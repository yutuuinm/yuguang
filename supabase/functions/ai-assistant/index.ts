// ============================================================
// 予光 · Supabase Edge Function：ai-assistant（DeepSeek AI 光语助手）
// 支持模式：
//   chat   ：全站 AI 助手（功能介绍/需求建议/情感陪伴——合规红线见 system prompt）
//   stones ：AI 荐石（五行需求 → 从 crystals 库给出"文化意象参考"）
// 部署：npx supabase functions deploy ai-assistant
// 密钥（两种方式二选一）：
//   ① 环境变量：AI_API_KEY（DeepSeek key）、AI_MODEL（默认 deepseek-chat）
//   ② app_data 表：key='yuguang_ai'，data={"key":"sk-...","model":"deepseek-chat"}（service role 读取）
// 前端配置后调用：https://<ref>.supabase.co/functions/v1/ai-assistant
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

async function loadConfig(SUPABASE_URL, SERVICE_KEY) {
  let key = Deno.env.get("AI_API_KEY") || "";
  let model = Deno.env.get("AI_MODEL") || "deepseek-chat";
  if (!key && SERVICE_KEY) {
    try {
      const r = await fetch(SUPABASE_URL + "/rest/v1/app_data?select=value&key=eq.yuguang_ai", {
        headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY },
      });
      if (r.ok) {
        const rows = await r.json();
        const v = rows && rows[0] && rows[0].value;
        if (v) {
          const obj = typeof v === "string" ? JSON.parse(v.replace(/^"(.*)"$/, "$1")) : v;
          key = (obj && obj.key) || "";
          model = (obj && obj.model) || model;
        }
      }
    } catch (_) { /* 忽略 */ }
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

async function fetchCrystals(SUPABASE_URL, SERVICE_KEY) {
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/crystals?select=name,kind,element,meaning&visible=eq.true&order=sort.asc&limit=100", {
      headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY },
    });
    return r.ok ? await r.json() : [];
  } catch (_) { return []; }
}

const SYSTEM = [
  "你是「予光 YUGUANG」官网的 AI 光语助手。品牌：东西方双轨定制水晶饰品——东方（生肖五行、八卦）、西方（星座星盘、三盘一线）、合盘双生（双人）。",
  "网站功能导航：首页/系列（collections）、定制工坊（studio，生辰/生肖/星座生成设计卡并提交定制意向）、光集（客户作品）、星图志（生肖·八卦·星座·晶石·养石）、互动（拈签/答案书/转盘）、作品验真（verify，输验证码核验）、承诺（无理由退货不支持、不做刻字）、常见问题；联系走公众号/客服微信（告知可在页脚找到）。",
  "红线（务必遵守）：",
  "1) 不预测命运、运势、结果；绝不承诺任何效果（转运/复合/发财/疗愈等）；不宣传开光、法力、辟邪保证；",
  "2) 涉及生肖五行八卦星座星盘等，一律标注「文化意象参考，不构成任何承诺」；",
  "3) 情感/迷茫问题：温暖陪伴、鼓励自我关照，可建议先照亮自己再谈遇见，但绝不替用户做人生决定；",
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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const { key: apiKey, model } = await loadConfig(SUPABASE_URL, SERVICE_KEY);
    if (!apiKey) {
      return Response.json({ ok: false, error: "AI 未配置：请设置 AI_API_KEY（或 app_data.yuguang_ai）" }, { headers: corsHeaders });
    }

    if (mode === "stones") {
      // 荐石：结合需求与晶石库（意象参考）
      const need = String(body.need || "").trim() || "日常佩戴";
      const crystals = await fetchCrystals(SUPABASE_URL, SERVICE_KEY);
      const crystalText = crystals.length
        ? crystals.map((c) => `${c.name}（${c.kind || c.element || ""}）${c.meaning || ""}`).join("；")
        : "（晶石库暂未配置内容）";
      const out = await deepseekChat(apiKey, model, [
        { role: "system", content: SYSTEM },
        { role: "user", content: `用户需求：「${need}」。已知晶石：${crystalText}。请给出 2-4 个「文化意象参考」建议（含可考虑的款式方向与一句予光风格的光语），并提醒不构成任何效果承诺。` },
      ]);
      return Response.json({ ok: true, answer: out }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // chat：全站助手
    const question = String(body.question || "").trim();
    if (!question) return Response.json({ ok: false, error: "缺少问题内容" }, { headers: corsHeaders });
    const history = Array.isArray(body.history) ? body.history : [];
    const messages = [
      { role: "system", content: SYSTEM },
      ...history.slice(-8),
      { role: "user", content: question },
    ];
    const answer = await deepseekChat(apiKey, model, messages);
    return Response.json({ ok: true, answer }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
