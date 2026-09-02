// ============================================================
// 予光 · Supabase Edge Function：ai-assistant（设置表驱动 v2 · DeepSeek）
// 配置优先级：环境变量（AI_API_KEY / AI_MODEL）> settings 表 key='ai'
//   settings.ai = {"key":"sk-...","model":"deepseek-chat"}（service role 读取；匿名不可见）
// 模式：chat（全站助手）/ stones（AI 荐石，读 crystals 晶石库）
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

async function getDbAi(SB_URL, SK) {
  try {
    const r = await fetch(SB_URL + "/rest/v1/settings?select=value&key=eq.ai", {
      headers: { apikey: SK, Authorization: "Bearer " + SK },
    });
    if (!r.ok) return null;
    const rows = await r.json();
    const v = rows && rows[0] && rows[0].value;
    if (!v) return null;
    return typeof v === "string" ? JSON.parse(v.replace(/^"(.*)"$/, "$1")) : v;
  } catch (_) { return null; }
}

async function loadConfig(SB_URL, SK) {
  let key = Deno.env.get("AI_API_KEY") || "";
  let model = Deno.env.get("AI_MODEL") || "deepseek-chat";
  if ((!key || !model) && SK) {
    const db = await getDbAi(SB_URL, SK);
    if (db) {
      if (!key) key = db.key || "";
      if (!model) model = db.model || "deepseek-chat";
    }
  }
  return { key, model };
}

async function deepseekChat(apiKey, model, messages) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
    body: JSON.stringify({ model: model || "deepseek-chat", messages, temperature: 0.7, max_tokens: 900 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error && data.error.message) || ("HTTP " + res.status));
  const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return (text || "").trim();
}

async function fetchCrystals(SB_URL, SK) {
  try {
    const r = await fetch(SB_URL + "/rest/v1/crystals?select=name,kind,element,meaning&visible=eq.true&order=sort.asc&limit=100", {
      headers: { apikey: SK, Authorization: "Bearer " + SK },
    });
    return r.ok ? await r.json() : [];
  } catch (_) { return []; }
}

const SYSTEM = [
  "你是「予光 YUGUANG」官网的 AI 光语助手。品牌：东西方双轨定制水晶饰品——东方（生肖五行、八卦）、西方（星座星盘、三盘一线）、合盘双生（双人）。",
  "网站功能导航：首页/系列（collections）、定制工坊（studio，生辰/生肖/星座生成设计卡并提交定制意向）、光集（客户作品）、星图志（生肖·八卦·星座·晶石·养石）、互动（拈签/答案书/转盘）、作品验真（verify，输验证码核验）、承诺（不做刻字、不支持无理由退货）、常见问题；联系走公众号/客服微信（页脚可找到）。",
  "红线（务必遵守）：",
  "1) 不预测命运、运势、结果；绝不承诺任何效果（转运/复合/发财/疗愈等）；不宣传开光、法力、辟邪保证；",
  "2) 涉及生肖五行八卦星座星盘等，一律标注「文化意象参考，不构成任何承诺」；",
  "3) 情感/迷茫问题：温暖陪伴、鼓励自我关照（先照亮自己，再谈遇见），绝不替用户做人生决定；",
  "4) 医疗/健康/心理疾病类问题：温和建议咨询专业机构；",
  "5) 未成年人相关命运类话题请引导由监护人陪同了解；",
  "6) 回答简洁、中文、口语化、有温度、适当分点；不确定就引导联系客服微信。",
].join("\n");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 ai-assistant" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const mode = body.mode || "chat";
    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const { key: apiKey, model } = await loadConfig(SB_URL, SK);
    if (!apiKey) {
      return Response.json({ ok: false, error: "AI 未配置：settings.ai 或 AI_API_KEY" }, { headers: corsHeaders });
    }

    if (mode === "stones") {
      const need = String(body.need || "").trim() || "日常佩戴";
      const crystals = await fetchCrystals(SB_URL, SK);
      const crystalText = crystals.length
        ? crystals.map((c) => `${c.name}（${c.kind || c.element || ""}）${c.meaning || ""}`).join("；")
        : "（晶石库暂未配置内容）";
      const out = await deepseekChat(apiKey, model, [
        { role: "system", content: SYSTEM },
        { role: "user", content: `用户需求：「${need}」。已知晶石：${crystalText}。请给出 2-4 个「文化意象参考」建议（含可考虑的款式方向与一句予光风格的光语），并提醒不构成任何效果承诺。` },
      ]);
      return Response.json({ ok: true, answer: out }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const question = String(body.question || "").trim();
    if (!question) return Response.json({ ok: false, error: "缺少问题内容" }, { headers: corsHeaders });
    const history = Array.isArray(body.history) ? body.history : [];
    const answer = await deepseekChat(apiKey, model, [
      { role: "system", content: SYSTEM },
      ...history.slice(-8),
      { role: "user", content: question },
    ]);
    return Response.json({ ok: true, answer }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
