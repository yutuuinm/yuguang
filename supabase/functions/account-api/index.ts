// ============================================================
// 予光 · account-api v3（邮箱验证码登录 + 管理员密码登录）
// op:
//   send_code  {email}                          → 发 6 位验证码（10 分钟有效，60 秒可重发）
//   code_login {email, code}                    → 校验通过自动登录（新邮箱自动注册，账号=邮箱）
//   login      {account, password}              → 账号密码登录（管理员 fftt0227 用）
//   me / orders / logout                        → 会话（x-sess）
// ============================================================
import nodemailer from "npm:nodemailer@6.9.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-sess",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
function hdr(SK) { return { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" }; }
function randHex(n) { const b = new Uint8Array(n); crypto.getRandomValues(b); return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join(""); }
async function sha256Hex(s) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, "0")).join(""); }
async function pbkdf2(pass, saltHex, iter) {
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits), (x) => x.toString(16).padStart(2, "0")).join("");
}
const avatarOf = (u) => { const s = (((u.nickname || "") || (u.account || "")) || "光").trim(); return s.charAt(0); };

async function sendMail(settings, to, subject, text) {
  const smtpUser = settings.smtp_user || "";
  const smtpPass = settings.smtp_pass || "";
  if (!smtpUser || !smtpPass) throw new Error("发件邮箱未配置（settings.mail）");
  const transporter = nodemailer.createTransport({
    host: settings.smtp_host || "smtp.qq.com",
    port: Number(settings.smtp_port || 465),
    secure: Number(settings.smtp_port || 465) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
  await transporter.sendMail({ from: `予光 <${smtpUser}>`, to, subject, text });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 account-api v3（邮箱验证码）" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    const body = await req.json();
    const op = body.op || "";
    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) throw new Error("service role 未注入");
    const auth = hdr(SK);
    const norm = (s) => String(s || "").trim().toLowerCase();

    if (op === "send_code") {
      const email = norm(body.email);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("邮箱格式不正确");
      const recent = await fetch(SB_URL + "/rest/v1/email_codes?select=id,created_at&email=eq." + encodeURIComponent(email) + "&used=eq.false&expires_at=gt." + encodeURIComponent(new Date(Date.now() + 10 * 60000).toISOString()), { headers: auth });
      const recentRows = (await recent.json()) || [];
      const fresh = recentRows.filter((r) => r.created_at && new Date(r.created_at).getTime() > Date.now() - 60000);
      if (fresh.length) throw new Error("验证码已发送，请稍后再试");
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const codeHash = await sha256Hex(code);
      await fetch(SB_URL + "/rest/v1/email_codes", {
        method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ email, code_hash: codeHash, expires_at: new Date(Date.now() + 10 * 60000).toISOString(), used: false }),
      });
      const ms = await (await fetch(SB_URL + "/rest/v1/settings?select=value&key=eq.mail", { headers: auth })).json();
      const raw = ms && ms[0] && ms[0].value;
      const cfgMail = typeof raw === "string" ? JSON.parse(raw.replace(/^"(.*)"$/, "$1")) : raw;
      await sendMail(cfgMail || {}, email, "【予光】登录验证码", "你的验证码是：" + code + "\n10 分钟内有效，请勿泄露。\n——予光 YUGUANG");
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (op === "code_login") {
      const email = norm(body.email);
      const code = String(body.code || "").trim();
      if (!email || !/^\d{6}$/.test(code)) throw new Error("请输入邮箱与 6 位验证码");
      const codeHash = await sha256Hex(code);
      const r = await fetch(
        SB_URL + "/rest/v1/email_codes?select=id&email=eq." + encodeURIComponent(email) +
        "&code_hash=eq." + encodeURIComponent(codeHash) + "&used=eq.false&expires_at=gt." + encodeURIComponent(new Date().toISOString()) + "&order=id.desc&limit=1",
        { headers: auth }
      );
      const rows = (await r.json()) || [];
      if (!rows.length) throw new Error("验证码错误或已过期");
      await fetch(SB_URL + "/rest/v1/email_codes?id=eq." + rows[0].id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ used: true }) });

      const q = "users?select=id,account,email,nickname,role&account=eq." + encodeURIComponent(email);
      let user = ((await (await fetch(SB_URL + "/rest/v1/" + q, { headers: auth })).json()) || [])[0];
      if (!user) {
        const salt = randHex(16);
        const passHash = await pbkdf2(randHex(8), salt, 20000);
        const ins = await fetch(SB_URL + "/rest/v1/users", {
          method: "POST", headers: { ...auth, Prefer: "return=representation" },
          body: JSON.stringify({ account: email, email, pass_hash: passHash, salt, phone: "", nickname: "", role: "user" }),
        });
        if (!ins.ok) throw new Error("注册失败（" + ins.status + "）");
        user = (await ins.json())[0];
      }
      const token = randHex(32);
      await fetch(SB_URL + "/rest/v1/sessions", {
        method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ account_id: user.id, token_hash: await sha256Hex(token), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }),
      });
      return Response.json({ ok: true, token, account: user.account, role: user.role || "user", avatar: avatarOf(user), nickname: user.nickname || "" }, { headers: corsHeaders });
    }

    if (op === "login") {
      const account = norm(body.account);
      const password = String(body.password || "");
      const q = "users?select=id,account,pass_hash,salt,phone,nickname,email,role&account=eq." + encodeURIComponent(account);
      const rows = (await (await fetch(SB_URL + "/rest/v1/" + q, { headers: auth })).json()) || [];
      if (!rows.length) throw new Error("账号不存在");
      const u = rows[0];
      if (!u.salt || (await pbkdf2(password, u.salt, 20000)) !== u.pass_hash) throw new Error("密码错误");
      const token = randHex(32);
      await fetch(SB_URL + "/rest/v1/sessions", {
        method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ account_id: u.id, token_hash: await sha256Hex(token), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }),
      });
      return Response.json({ ok: true, token, account: u.account, role: u.role || "user", avatar: avatarOf(u), nickname: u.nickname || "" }, { headers: corsHeaders });
    }

    const sessToken = (req.headers.get("x-sess") || "").trim();
    const tokenHash = sessToken ? await sha256Hex(sessToken) : "";
    const rs = await fetch(SB_URL + "/rest/v1/sessions?select=account_id,expires_at&token_hash=eq." + encodeURIComponent(tokenHash) + "&expires_at=gt." + encodeURIComponent(new Date().toISOString()), { headers: auth });
    const sess = (await rs.json()) || [];
    if (!sess.length) return Response.json({ ok: false, error: "未登录或已过期" }, { status: 401, headers: corsHeaders });
    const uid = sess[0].account_id;
    const ru = await fetch(SB_URL + "/rest/v1/users?select=id,account,email,nickname,role&id=eq." + uid, { headers: auth });
    const u = ((await ru.json()) || [])[0] || {};

    if (op === "me") return Response.json({ ok: true, account: u.account || "", email: u.email || "", role: u.role || "user", avatar: avatarOf(u), nickname: u.nickname || "" }, { headers: corsHeaders });
    if (op === "logout") {
      await fetch(SB_URL + "/rest/v1/sessions?token_hash=eq." + encodeURIComponent(tokenHash), { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "orders") {
      const ro = await fetch(SB_URL + "/rest/v1/orders?select=*&account=eq." + encodeURIComponent(u.account || "") + "&order=id.desc&limit=50", { headers: auth });
      return Response.json({ ok: true, orders: (await ro.json()) || [] }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
