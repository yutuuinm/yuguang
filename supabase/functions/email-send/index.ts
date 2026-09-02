// ============================================================
// 予光 · Supabase Edge Function：email-send
// 作用：客户提交定制意向/留言后，用 SMTP 发送通知邮件到商家邮箱
// 部署：Supabase CLI → npx supabase functions deploy email-send
// Secrets（绝不写进网页）：
//   SMTP_HOST=smtp.qq.com  SMTP_PORT=465
//   SMTP_USER=你的发件邮箱（需开启 SMTP 授权码）
//   SMTP_PASS=邮箱授权码
//   MAIL_TO=收件邮箱（可逗号分隔多个）
//   FUNC_TOKEN=自定义防滥用口令（前端调用时带 x-func-token，可留空=不校验）
// 前端：提交成功后调用
//   https://<ref>.supabase.co/functions/v1/email-send  （POST {kind,subject?,fields}）
// ============================================================
import nodemailer from "npm:nodemailer@6.9.9";

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.qq.com";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") || 465);
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const RECIPIENT = Deno.env.get("MAIL_TO") || "";
const FUNC_TOKEN = Deno.env.get("FUNC_TOKEN") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-func-token",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({
      ok: true, name: "予光 email-send", smtpUser: SMTP_USER || "(未配置)", recipient: RECIPIENT,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    if (FUNC_TOKEN && req.headers.get("x-func-token") !== FUNC_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "token 校验失败" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const payload = await req.json();
    if (!SMTP_USER || !SMTP_PASS || !RECIPIENT) throw new Error("SMTP 未配置");
    const kind = payload.kind || "intent";
    const title = kind === "order"
      ? "【予光】新定制意向"
      : kind === "gallery_submit"
      ? "【予光】光集投稿意向"
      : "【予光】新留言";
    const lines = Object.entries(payload.fields || payload)
      .filter(([k]) => !["subject", "kind", "to"].includes(k))
      .map(([k, v]) => k + "：" + (Array.isArray(v) || typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)));
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const toList = String(payload.to || RECIPIENT).split(/[,，;；\s]+/).filter(Boolean);
    await transporter.sendMail({
      from: `予光定制 <${SMTP_USER}>`,
      to: toList.length ? toList : [RECIPIENT],
      subject: payload.subject || title,
      text: "予光收到了新的一条客户信息：\n\n" + lines.join("\n") + "\n\n—— 予光 YUGUANG",
    });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
