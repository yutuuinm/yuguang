// ============================================================
// 予光 · admin-api v4（后台数据接口）
// 鉴权：x-sess 会员令牌 → 必须 role='admin'/'root'
// 用法：POST {op, table, id?, set?, row?, limit?, title?, body?}
// op: list / insert / update / delete(软删入回收站) / restore / purge(回收站彻底删)
//     purge_all / broadcast
// 允许表：orders messages gallery products crystals records subscribers settings app_data
//        users wheel_spins ai_usage mailboxes recycle_bin archives
// 行为：所有增删改自动写 archives 存档；delete 先入 recycle_bin 再删源行
// ============================================================

const TABLES = ['orders','messages','gallery','products','crystals','records','subscribers','settings','app_data','users','wheel_spins','ai_usage','mailboxes','recycle_bin','archives'];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-sess",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
function hdr(SK) { return { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" }; }
async function sha256Hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 admin-api v4" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const op = body.op || "list";
    const table = String(body.table || "");
    if (op !== "broadcast" && TABLES.indexOf(table) === -1) throw new Error("不允许的表：" + table);

    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) throw new Error("service role 未注入");
    const auth = hdr(SK);

    // 鉴权：x-sess → sessions → users.role='admin'/'root'
    const sessToken = (req.headers.get("x-sess") || "").trim();
    const tokenHash = sessToken ? await sha256Hex(sessToken) : "";
    const rs = await fetch(
      SB_URL + "/rest/v1/sessions?select=account_id,expires_at&token_hash=eq." + encodeURIComponent(tokenHash) +
      "&expires_at=gt." + encodeURIComponent(new Date().toISOString()),
      { headers: auth }
    );
    const sess = (await rs.json()) || [];
    if (!sess.length) {
      return Response.json({ ok: false, error: "未登录或已过期" }, { status: 401, headers: corsHeaders });
    }
    const ru = await fetch(SB_URL + "/rest/v1/users?select=account,role&id=eq." + sess[0].account_id, { headers: auth });
    const user = ((await ru.json()) || [])[0];
    if (!user || (user.role !== "admin" && user.role !== "root")) {
      return Response.json({ ok: false, error: "无管理员权限" }, { status: 403, headers: corsHeaders });
    }

    const base = SB_URL + "/rest/v1/" + table;
    const keyed = (table === "settings" || table === "app_data");
    const whereOf = (t, id) => (t === "settings" || t === "app_data") ? "key=eq." + encodeURIComponent(id) : "id=eq." + encodeURIComponent(id);

    // 用户表守卫：root 账号不可删改；非 root 管理员只能管理普通 user
    async function guardUser(id) {
      if (table !== "users" || !id) return;
      const t = await fetch(base + "?select=account,role&id=eq." + encodeURIComponent(id), { headers: auth });
      const target = ((await t.json()) || [])[0];
      if (!target) throw new Error("目标用户不存在");
      if (target.role === "root") throw new Error("终端管理员账号不可修改或删除");
      if (user.role !== "root" && target.role !== "user") throw new Error("仅 root 可管理管理员账号");
    }
    // 存档：记录一切管理员写操作（保留 5 天自动清理）
    async function log(action, target, note, payload) {
      try {
        await fetch(SB_URL + "/rest/v1/archives", {
          method: "POST",
          headers: { ...auth, Prefer: "return=minimal" },
          body: JSON.stringify({
            account: user.account || "",
            action: String(action || "").slice(0, 40),
            target: String(target || "").slice(0, 120),
            note: String(note || "").slice(0, 300),
            payload: payload || {}
          })
        });
        // 超过 5 天的旧存档自动清除
        const cut = new Date(Date.now() - 5 * 86400000).toISOString();
        fetch(SB_URL + "/rest/v1/archives?created_at=lt." + encodeURIComponent(cut), {
          method: "DELETE", headers: { ...auth, Prefer: "return=minimal" }
        }).catch(() => {});
      } catch (_) { /* 存档失败不影响主流程 */ }
    }
    async function fetchRow(t, id) {
      const r = await fetch(SB_URL + "/rest/v1/" + t + "?select=*&" + whereOf(t, id) + "&limit=1", { headers: auth });
      return ((await r.json().catch(() => [])) || [])[0] || null;
    }
    async function moveToRecycle(t, id) {
      const row = await fetchRow(t, id);
      if (!row) throw new Error("目标行不存在（可能已删除）");
      const payload = Object.assign({}, row);
      delete payload.id;
      const ins = await fetch(SB_URL + "/rest/v1/recycle_bin", {
        method: "POST",
        headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ table_name: t, row_id: String(id), payload: payload, account: user.account || "" })
      });
      if (!ins.ok) throw new Error("移入回收站失败");
      await fetch(SB_URL + "/rest/v1/" + t + "?" + whereOf(t, id), { method: "DELETE", headers: auth });
      return payload;
    }

    if (op === "list") {
      const limit = Math.min(Number(body.limit) || 100, 200);
      const ord = keyed ? "key.asc" : "id.desc";
      const r = await fetch(base + "?select=*&order=" + ord + "&limit=" + limit, { headers: auth });
      return Response.json({ ok: r.ok, rows: await r.json().catch(() => []) }, { headers: corsHeaders });
    }
    if (op === "delete") {
      // 回收站/存档本身 = 彻底删除；其余表 = 软删移入回收站
      if (!body.id) throw new Error("缺少 id");
      if (table === "recycle_bin" || table === "archives") {
        await fetch(base + "?" + whereOf(table, body.id), { method: "DELETE", headers: auth });
        log("purge", table + ":" + body.id, "彻底删除");
        return Response.json({ ok: true }, { headers: corsHeaders });
      }
      await guardUser(body.id);
      await moveToRecycle(table, body.id);
      log("delete", table + ":" + body.id, "移入回收站（可恢复/彻底删除）");
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "insert") {
      const r = await fetch(base, { method: "POST", headers: { ...auth, Prefer: "return=representation" }, body: JSON.stringify(body.row || {}) });
      const j = await r.json().catch(() => null);
      const row = Array.isArray(j) ? (j[0] || null) : j;
      const idv = row ? (row.id !== undefined ? row.id : row.key || row.code || "") : "";
      log("insert", table + (idv !== "" ? ":" + idv : ""), "新增" + (body.row && body.row.name ? " " + String(body.row.name).slice(0, 60) : ""));
      return Response.json({ ok: r.ok, row: row }, { headers: corsHeaders });
    }
    if (op === "update") {
      if (!body.id) throw new Error("缺少 id");
      await guardUser(body.id);
      const where = whereOf(table, body.id);
      await fetch(base + "?" + where, { method: "PATCH", headers: auth, body: JSON.stringify(body.set || {}) });
      log("update", table + ":" + body.id, "修改 " + JSON.stringify(body.set || {}).slice(0, 240));
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "restore") {
      // id = recycle_bin 行 id
      const rb = await fetchRow("recycle_bin", body.id);
      if (!rb) throw new Error("回收站记录不存在");
      const t2 = String(rb.table_name || "");
      if (TABLES.indexOf(t2) === -1) throw new Error("不允许的表：" + t2);
      const payload = (rb.payload && typeof rb.payload === "object") ? Object.assign({}, rb.payload) : {};
      if (t2 === "users" && payload.role === "root") throw new Error("终端管理员不可通过回收站恢复");
      const ins = await fetch(SB_URL + "/rest/v1/" + t2, {
        method: "POST",
        headers: { ...auth, Prefer: "return=representation" },
        body: JSON.stringify(payload)
      });
      const j = await ins.json().catch(() => null);
      if (!ins.ok) throw new Error("恢复失败：" + (String(j && j.message) || String(j || "").slice(0, 160) || ins.status));
      await fetch(SB_URL + "/rest/v1/recycle_bin?" + whereOf("recycle_bin", body.id), { method: "DELETE", headers: auth });
      log("restore", t2 + ":" + (payload.code || payload.order_no || payload.account || body.id), "已从回收站恢复");
      return Response.json({ ok: true, row: Array.isArray(j) ? (j[0] || null) : j }, { headers: corsHeaders });
    }
    if (op === "purge_all") {
      // 彻底清空整类：recycle_bin 或 archives
      if (table !== "recycle_bin" && table !== "archives") throw new Error("purge_all 仅支持 recycle_bin / archives");
      let n = 0;
      for (let page = 0; page < 5; page++) {
        const r = await fetch(SB_URL + "/rest/v1/" + table + "?select=id&order=id.desc&limit=200", { headers: auth });
        const rows = (await r.json().catch(() => [])) || [];
        if (!rows.length) break;
        for (const row of rows) {
          await fetch(SB_URL + "/rest/v1/" + table + "?" + whereOf(table, row.id), { method: "DELETE", headers: auth });
          n++;
        }
        if (rows.length < 200) break;
      }
      log("purge_all", table, "清空 " + n + " 条");
      return Response.json({ ok: true, cleared: n }, { headers: corsHeaders });
    }
    if (op === "broadcast") {
      // 信箱管理：站内信群发（kind=notice）+ 可选发邮件；可指定 accounts 目标
      const title = String(body.title || "").trim();
      const bodyTxt = String(body.body || "").slice(0, 500);
      const toEmail = body.email === true || body.email === "true";
      const only = Array.isArray(body.accounts) ? body.accounts.map((a) => String(a)).filter(Boolean) : null;
      if (!title && !bodyTxt) throw new Error("标题与内容不能都为空");
      const ru = await fetch(SB_URL + "/rest/v1/users?select=account,email&limit=500", { headers: auth });
      let users = (await ru.json()) || [];
      if (only && only.length) users = users.filter((u) => only.indexOf(u.account) > -1);
      let done = 0, mailed = 0;
      for (const u of users) {
        if (!u.account) continue;
        const ins = await fetch(SB_URL + "/rest/v1/mailboxes", { method: "POST", headers: { ...auth, Prefer: "return=minimal" },
          body: JSON.stringify({ account: u.account, kind: "notice", title: title || "予光通知", body: bodyTxt }) });
        if (ins.ok) done++;
        if (toEmail && u.email) {
          try {
            const em = await fetch(SB_URL + "/functions/v1/email-send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ kind: "notice", subject: title || "予光通知", fields: { 内容: bodyTxt }, to: [u.email] })
            });
            if (em.ok) mailed++;
          } catch (_) { /* 单封失败不影响 */ }
          await new Promise((res) => setTimeout(res, 200));
        }
      }
      log("broadcast", only ? ("accounts:" + only.length) : "mailboxes", "群发「" + title + "」信箱 " + done + "/" + users.length + (toEmail ? "，邮件 " + mailed : ""));
      return Response.json({ ok: true, sent: done, users: users.length, mailed }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
