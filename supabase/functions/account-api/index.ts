// ============================================================
// 予光 · account-api v5（邮箱验证码注册登录 + 个人中心 + 忘记密码 + 信箱）
// op:
//   send_code {email}                       发验证码（10分钟，60s防重）
//   register  {email,code,password,phone?}  验证通过后注册
//   login_pw / login_code                   密码/验证码登录
//   me / logout / orders                    会话与订单
//   update_profile {nickname?,phone?,email?,code?}  改昵称/手机号/邮箱（改邮箱需发到原邮箱的验证码）
//   change_pw    {old_password,new_password}
//   forgot_pw    {email}                    申请重置→通知管理员邮箱
//   admin_reset  {account}                  管理员重置（随机临时密码→邮件用户+信箱）
//   inbox / inbox_read                      我的信箱（important/notice）
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

async function getMailSettings(SB_URL, SK) {
  try {
    const ms = await (await fetch(SB_URL + "/rest/v1/settings?select=value&key=eq.mail", { headers: hdr(SK) })).json();
    const raw = ms && ms[0] && ms[0].value;
    return typeof raw === "string" ? JSON.parse(raw.replace(/^"(.*)"$/, "$1")) : raw;
  } catch (_) { return null; }
}
async function sendMail(settings, to, subject, text) {
  const smtpUser = settings.smtp_user || "";
  const smtpPass = settings.smtp_pass || "";
  if (!smtpUser || !smtpPass) throw new Error("发件邮箱未配置（settings.mail）");
  const tr = nodemailer.createTransport({
    host: settings.smtp_host || "smtp.qq.com",
    port: Number(settings.smtp_port || 465),
    secure: Number(settings.smtp_port || 465) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
  await tr.sendMail({ from: `予光 <${smtpUser}>`, to, subject, text });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 account-api v5" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    const body = await req.json();
    const op = body.op || "";
    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) throw new Error("service role 未注入");
    const auth = hdr(SK);
    const norm = (s) => String(s || "").trim().toLowerCase();
    const isValidEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

    async function findUser(idOrEmail) {
      const q = "users?select=id,account,email,pass_hash,salt,phone,nickname,role&or=(account.eq." + encodeURIComponent(idOrEmail) + ",email.eq." + encodeURIComponent(idOrEmail) + ")&limit=1";
      const rows = (await (await fetch(SB_URL + "/rest/v1/" + q, { headers: auth })).json()) || [];
      return rows[0];
    }
    async function makeSession(u) {
      const token = randHex(32);
      await fetch(SB_URL + "/rest/v1/sessions", { method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ account_id: u.id, token_hash: await sha256Hex(token), expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }) });
      try {
        const now = new Date().toISOString();
        await fetch(SB_URL + "/rest/v1/users?id=eq." + u.id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ last_login_at: now, last_active_at: now }) });
      } catch (_) { /* 列未建则忽略 */ }
      return Response.json({ ok: true, token, account: u.account, email: u.email || u.account, role: u.role || "user", avatar: avatarOf(u), nickname: u.nickname || "" }, { headers: corsHeaders });
    }
    async function requireSession() {
      const sessToken = (req.headers.get("x-sess") || "").trim();
      const tokenHash = sessToken ? await sha256Hex(sessToken) : "";
      const rs = await fetch(SB_URL + "/rest/v1/sessions?select=account_id,expires_at&token_hash=eq." + encodeURIComponent(tokenHash) + "&expires_at=gt." + encodeURIComponent(new Date().toISOString()), { headers: auth });
      const sess = (await rs.json()) || [];
      if (!sess.length) throw new Error("未登录或已过期");
      // 会话挂 users.id，按 id 直查（不能用账号名查询）
      const uid = String(sess[0].account_id);
      const ru = await fetch(SB_URL + "/rest/v1/users?select=id,account,email,pass_hash,salt,phone,nickname,role&id=eq." + encodeURIComponent(uid) + "&limit=1", { headers: auth });
      const u = ((await ru.json()) || [])[0];
      if (!u) throw new Error("用户不存在");
      return { u, tokenHash };
    }
    async function verifyCode(email, code) {
      const codeHash = await sha256Hex(String(code || "").trim());
      const r = await fetch(SB_URL + "/rest/v1/email_codes?select=id&email=eq." + encodeURIComponent(email) + "&code_hash=eq." + encodeURIComponent(codeHash) + "&used=eq.false&expires_at=gt." + encodeURIComponent(new Date().toISOString()) + "&order=id.desc&limit=1", { headers: auth });
      const rows = (await r.json()) || [];
      if (!rows.length) throw new Error("验证码错误或已过期");
      await fetch(SB_URL + "/rest/v1/email_codes?or=(id.eq." + rows[0].id + ",used.eq.false)", { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
    }
    async function mailbox(account, kind, title, bodyTxt) {
      try {
        await fetch(SB_URL + "/rest/v1/mailboxes", { method: "POST", headers: { ...auth, Prefer: "return=minimal" },
          body: JSON.stringify({ account, kind, title, body: String(bodyTxt || "").slice(0, 500) }) });
      } catch (_) { /* 表未建忽略 */ }
    }

    if (op === "send_code") {
      const email = norm(body.email);
      if (!isValidEmail(email)) throw new Error("邮箱格式不正确");
      await fetch(SB_URL + "/rest/v1/email_codes?or=(used.eq.true,expires_at.lt." + encodeURIComponent(new Date().toISOString()) + ")", { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
      const recent = await fetch(SB_URL + "/rest/v1/email_codes?select=id,created_at&email=eq." + encodeURIComponent(email) + "&used=eq.false", { headers: auth });
      const rows = (await recent.json()) || [];
      if (rows.some((r) => r.created_at && new Date(r.created_at).getTime() > Date.now() - 60000)) throw new Error("验证码已发送，请稍后再试");
      const code = String(Math.floor(100000 + Math.random() * 900000));
      await fetch(SB_URL + "/rest/v1/email_codes", { method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ email, code_hash: await sha256Hex(code), expires_at: new Date(Date.now() + 10 * 60000).toISOString(), used: false }) });
      const mail = await getMailSettings(SB_URL, SK);
      await sendMail(mail || {}, email, "【予光】邮箱验证码", "您好：\n\n您的予光验证码为：\n\n  " + code + "  \n\n验证码 10 分钟内有效，请尽快完成验证；如非本人操作，请忽略本邮件。\n\n——予光 YUGUANG\n黑暗中总有光伴你前行，虽微弱，但足够照亮。");
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (op === "register") {
      const account = String(body.account || "").trim();
      const email = norm(body.email);
      const code = String(body.code || "").trim();
      const password = String(body.password || "");
      if (!account || !isValidEmail(email)) throw new Error("请填写账号与邮箱");
      if (!/^\d{6}$/.test(code)) throw new Error("请输入 6 位验证码");
      if (password.length < 6) throw new Error("密码至少 6 位");
      await verifyCode(email, code);
      const exist = await findUser(account);
      if (exist) throw new Error("该账号已注册");
      const byEmail = await fetch(SB_URL + "/rest/v1/users?select=id&or=(account.eq." + encodeURIComponent(email) + ",email.eq." + encodeURIComponent(email) + ")&limit=1", { headers: auth });
      const emRows = (await byEmail.json()) || [];
      if (emRows.length) throw new Error("该邮箱已被注册");
      const salt = randHex(16);
      const ins = await fetch(SB_URL + "/rest/v1/users", { method: "POST", headers: { ...auth, Prefer: "return=representation" },
        body: JSON.stringify({ account, email, pass_hash: await pbkdf2(password, salt, 20000), salt, phone: String(body.phone || "").trim(), nickname: "", role: "user" }) });
      if (!ins.ok) throw new Error("注册失败（" + ins.status + "）");
      const u = (await ins.json())[0];
      await mailbox(u.account, "important", "欢迎来到予光", "账号注册成功。黑暗中总有光伴你前行。");
      return await makeSession(u);
    }

    if (op === "login_code") {
      const email = norm(body.email);
      if (!isValidEmail(email) || !/^\d{6}$/.test(String(body.code || "").trim())) throw new Error("请输入邮箱与 6 位验证码");
      await verifyCode(email, String(body.code).trim());
      const u = await findUser(email);
      if (!u) throw new Error("该邮箱未注册，请先注册");
      return await makeSession(u);
    }
    if (op === "login" || op === "login_pw") {
      const acc = String(body.account || body.email || "").trim();
      const rq = await fetch(SB_URL + "/rest/v1/users?select=id,account,email,pass_hash,salt,phone,nickname,role&account=eq." + encodeURIComponent(acc) + "&limit=1", { headers: auth });
      const rows = (await rq.json()) || [];
      const u = rows[0];
      if (!u) throw new Error("账号不存在");
      if (!u.salt || (await pbkdf2(String(body.password || ""), u.salt, 20000)) !== u.pass_hash) throw new Error("密码错误");
      return await makeSession(u);
    }

    // 以下需登录
    const { u } = await requireSession();

    if (op === "me") {
      return Response.json({ ok: true, account: u.account, email: u.email || u.account, role: u.role || "user", avatar: avatarOf(u), nickname: u.nickname || "", phone: u.phone || "" }, { headers: corsHeaders });
    }
    if (op === "verify_pass") {
      // 二次确认：校验本人登录密码（不产生新会话）
      const pw = String(body.password || "");
      const ok2 = !!u.salt && (await pbkdf2(pw, u.salt, 20000)) === u.pass_hash;
      return Response.json(ok2 ? { ok: true } : { ok: false, error: "密码不正确" }, { headers: corsHeaders });
    }
    if (op === "touch") {
      try {
        await fetch(SB_URL + "/rest/v1/users?id=eq." + u.id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ last_active_at: new Date().toISOString() }) });
      } catch (_) { /* 列未建则忽略 */ }
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "logout") {
      await fetch(SB_URL + "/rest/v1/sessions?token_hash=eq." + encodeURIComponent(await sha256Hex((req.headers.get("x-sess") || "").trim())), { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "orders") {
      const ro = await fetch(SB_URL + "/rest/v1/orders?select=*&account=eq." + encodeURIComponent(u.account) + "&order=id.desc&limit=50", { headers: auth });
      return Response.json({ ok: true, orders: (await ro.json()) || [] }, { headers: corsHeaders });
    }
    if (op === "update_profile") {
      const set = {};
      if (body.account !== undefined) {
        const ac = String(body.account).trim();
        if (!ac) throw new Error('账号不能为空');
        if (ac !== u.account) {
          const chk = await fetch(SB_URL + "/rest/v1/users?select=id&account=eq." + encodeURIComponent(ac) + "&limit=1", { headers: auth });
          const chkRows = (await chk.json()) || [];
          if (chkRows.length) throw new Error('该账号已被使用');
          set.account = ac;
        }
      }
      if (body.nickname !== undefined) set.nickname = String(body.nickname).trim();
      if (body.phone !== undefined) set.phone = String(body.phone).trim();
      if (body.email !== undefined) {
        const email = norm(body.email);
        if (!isValidEmail(email)) throw new Error("邮箱格式不正确");
        if (email !== norm(u.email || u.account)) {
          if (!/^\d{6}$/.test(String(body.code || "").trim())) throw new Error("改邮箱需输入发送到原邮箱的验证码");
          await verifyCode(norm(u.email || u.account), String(body.code).trim());
          if (await findUser(email)) throw new Error("该邮箱已被使用");
          set.email = email;
        }
      }
      if (!Object.keys(set).length) throw new Error("没有要修改的内容");
      await fetch(SB_URL + "/rest/v1/users?id=eq." + u.id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify(set) });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "change_pw") {
      const oldPw = String(body.old_password || "");
      const newPw = String(body.new_password || "");
      if (newPw.length < 6) throw new Error("新密码至少 6 位");
      if (!u.salt || (await pbkdf2(oldPw, u.salt, 20000)) !== u.pass_hash) throw new Error("原密码错误");
      const salt = randHex(16);
      await fetch(SB_URL + "/rest/v1/users?id=eq." + u.id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ pass_hash: await pbkdf2(newPw, salt, 20000), salt }) });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "inbox") {
      const ro = await fetch(SB_URL + "/rest/v1/mailboxes?select=*&account=eq." + encodeURIComponent(u.account) + "&order=id.desc&limit=60", { headers: auth });
      return Response.json({ ok: true, items: (await ro.json()) || [] }, { headers: corsHeaders });
    }
    if (op === "inbox_del") {
      const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter((n) => n > 0) : [];
      if (!ids.length) throw new Error("缺少要删除的信件");
      await fetch(SB_URL + "/rest/v1/mailboxes?account=eq." + encodeURIComponent(u.account) + "&id=in.(" + ids.join(",") + ")", { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "inbox_read") {
      const ids = (body.ids || []).map(Number).join(",");
      if (ids) await fetch(SB_URL + "/rest/v1/mailboxes?account=eq." + encodeURIComponent(u.account) + "&id=in.(" + ids + ")", { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ read: true }) });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "forgot_pw") {
      // 允许游客（未登录也可申请）
      const q = norm(body.email || body.account);
      if (!q) throw new Error("请填写账号或邮箱");
      const uu = await findUser(q);
      if (!uu) throw new Error("账号或邮箱未注册");
      await fetch(SB_URL + "/rest/v1/pw_resets", { method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ account: uu.account, email, status: "pending" }) });
      const mail = await getMailSettings(SB_URL, SK);
      const admins = (mail && mail.to) || [];
      if (admins.length) await sendMail(mail, admins, "【予光】密码重置申请", "用户 " + email + " 申请重置密码，请登录后台为其重置。");
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "admin_reset") {
      if ((u.role !== "admin" && u.role !== "root")) throw new Error("无管理员权限");
      const target = await findUser(norm(body.account));
      if (!target) throw new Error("该账号不存在");
      const tempPw = randHex(4).slice(0, 8);
      const salt = randHex(16);
      await fetch(SB_URL + "/rest/v1/users?id=eq." + target.id, { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ pass_hash: await pbkdf2(tempPw, salt, 20000), salt }) });
      await fetch(SB_URL + "/rest/v1/pw_resets?account=eq." + encodeURIComponent(target.account) + "&status=eq.pending", { method: "PATCH", headers: { ...auth, Prefer: "return=minimal" }, body: JSON.stringify({ status: "done" }) });
      const mail = await getMailSettings(SB_URL, SK);
      const to = target.email || target.account;
      await sendMail(mail || {}, to, "【予光】密码已重置", "你的密码已被管理员重置：临时密码 " + tempPw + "\n请尽快登录并修改密码。");
      await mailbox(target.account, "important", "密码已重置", "管理员已为你重置密码，临时密码已发送至你的邮箱，请尽快登录修改。");
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
