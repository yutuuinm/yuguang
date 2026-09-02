// ============================================================
// 予光 · Supabase Edge Function：admin-api（管理员后台专用）
// 安全：service_role 只存在于本函数内；前端用口令（x-admin-token）调用。
// 口令来源（优先级）：环境变量 ADMIN_TOKEN > settings 表 key='admin' {"token":"..."}
// 用法：POST {op:'list'|'update'|'insert'|'delete', table, id?, set?, row?, limit?}
// 允许的表：orders messages gallery products crystals records subscribers settings app_data
// ============================================================

const TABLES = ['orders','messages','gallery','products','crystals','records','subscribers','settings','app_data'];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

function hdr(SK) {
  return { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" };
}

async function getAdminToken(SB_URL, SK) {
  const env = Deno.env.get("ADMIN_TOKEN") || "";
  if (env) return env;
  try {
    const r = await fetch(SB_URL + "/rest/v1/settings?select=value&key=eq.admin", { headers: hdr(SK) });
    if (r.ok) {
      const rows = await r.json();
      const v = rows && rows[0] && rows[0].value;
      if (v) {
        const obj = typeof v === "string" ? JSON.parse(v.replace(/^"(.*)"$/, "$1")) : v;
        return (obj && obj.token) || "";
      }
    }
  } catch (_) { /* ignore */ }
  return "";
}

function safeEq(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 admin-api" }), {
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
    const token = await getAdminToken(SB_URL, SK);
    if (!token || !safeEq(req.headers.get("x-admin-token") || "", token)) {
      return new Response(JSON.stringify({ ok: false, error: "口令错误或未配置" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base = SB_URL + "/rest/v1/" + table;
    const auth = { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" };

    if (op === "list") {
      const limit = Math.min(Number(body.limit) || 100, 200);
      const r = await fetch(base + "?select=*&order=id.desc&limit=" + limit, { headers: auth });
      const data = await r.json();
      return Response.json({ ok: r.ok, rows: data }, { headers: corsHeaders });
    }

    if (op === "delete") {
      if (!body.id) throw new Error("缺少 id");
      const r = await fetch(base + "?id=eq." + encodeURIComponent(body.id), {
        method: "DELETE", headers: { ...auth, Prefer: "return=minimal" },
      });
      return Response.json({ ok: r.ok || r.status === 204 }, { headers: corsHeaders });
    }

    if (op === "insert") {
      const r = await fetch(base, {
        method: "POST", headers: { ...auth, Prefer: "return=representation" },
        body: JSON.stringify(body.row || {}),
      });
      const data = await r.json().catch(() => null);
      return Response.json({ ok: r.ok, row: data }, { headers: corsHeaders });
    }

    if (op === "update") {
      if (!body.id) throw new Error("缺少 id");
      // settings 表按 key 更新
      const where = table === "settings" ? "key=eq." + encodeURIComponent(body.id) : "id=eq." + encodeURIComponent(body.id);
      const r = await fetch(base + "?" + where, {
        method: "PATCH", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify(body.set || {}),
      });
      return Response.json({ ok: r.ok || r.status === 204 }, { headers: corsHeaders });
    }

    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
