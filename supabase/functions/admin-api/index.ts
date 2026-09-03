// ============================================================
// 予光 · admin-api v2（后台数据接口）
// 鉴权：x-sess 会员令牌 → 必须 role='admin'（即 fftt0227）
// 用法：POST {op:'list'|'update'|'insert'|'delete', table, id?, set?, row?, limit?}
// 允许表：orders messages gallery products crystals records subscribers settings app_data
// ============================================================

const TABLES = ['orders','messages','gallery','products','crystals','records','subscribers','settings','app_data'];
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
    return new Response(JSON.stringify({ ok: true, name: "予光 admin-api v2" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const op = body.op || "list";
    const table = String(body.table || "");
    if (TABLES.indexOf(table) === -1) throw new Error("不允许的表：" + table);

    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) throw new Error("service role 未注入");
    const auth = hdr(SK);

    // 鉴权：x-sess → sessions → users.role='admin'
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
    const ru = await fetch(SB_URL + "/rest/v1/users?select=role&id=eq." + sess[0].account_id, { headers: auth });
    const user = ((await ru.json()) || [])[0];
    if (!user || (user.role !== "admin" && user.role !== "root")) {
      return Response.json({ ok: false, error: "无管理员权限" }, { status: 403, headers: corsHeaders });
    }

    const base = SB_URL + "/rest/v1/" + table;
    if (op === "list") {
      const limit = Math.min(Number(body.limit) || 100, 200);
      const r = await fetch(base + "?select=*&order=id.desc&limit=" + limit, { headers: auth });
      return Response.json({ ok: r.ok, rows: await r.json().catch(() => []) }, { headers: corsHeaders });
    }
    if (op === "delete") {
      if (!body.id) throw new Error("缺少 id");
      await fetch(base + "?id=eq." + encodeURIComponent(body.id), { method: "DELETE", headers: auth });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "insert") {
      const r = await fetch(base, { method: "POST", headers: auth, body: JSON.stringify(body.row || {}) });
      return Response.json({ ok: r.ok, row: await r.json().catch(() => null) }, { headers: corsHeaders });
    }
    if (op === "update") {
      if (!body.id) throw new Error("缺少 id");
      const where = table === "settings" ? "key=eq." + encodeURIComponent(body.id) : "id=eq." + encodeURIComponent(body.id);
      await fetch(base + "?" + where, { method: "PATCH", headers: auth, body: JSON.stringify(body.set || {}) });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
