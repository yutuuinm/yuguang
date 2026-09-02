// ============================================================
// 予光 · account-api v2（白桦式账号体系）
// 注册：{op:'register', account, password, phone(必填), nickname?, email?}
// 登录：{op:'login', account, password}      → {token, account, role, avatar, nickname}
// 会话：30 天；前端保存 token（管理员端默认不自动退出）
// 订单：{op:'orders'} → 按 users.account 匹配 orders.account
// ============================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-sess",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

function hdr(SK) {
  return { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" };
}
function randHex(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, "0")).join("");
}
async function pbkdf2(pass, saltHex, iter) {
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits), (x) => x.toString(16).padStart(2, "0")).join("");
}
const avatarOf = (u) => {
  const s = (u.nickname || u.account || "光").trim();
  return s.charAt(0);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 account-api v2" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const op = body.op || "";
    const SB_URL = Deno.env.get("SUPABASE_URL") || "";
    const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) throw new Error("service role 未注入");
    const auth = hdr(SK);
    const iter = 20000;

    if (op === "register" || op === "login") {
      const account = String(body.account || "").trim();
      const password = String(body.password || "");
      if (!account || password.length < 6) throw new Error("请输入账号与至少 6 位密码");
      const q = "users?select=id,account,pass_hash,salt,phone,nickname,email,role&account=eq." + encodeURIComponent(account);
      const rows = (await (await fetch(SB_URL + "/rest/v1/" + q, { headers: auth })).json()) || [];

      let u;
      if (op === "register") {
        if (rows.length) throw new Error("该账号已注册，请直接登录");
        const phone = String(body.phone || "").trim();
        if (!phone) throw new Error("手机号必填");
        const nickname = String(body.nickname || "").trim();
        const email = String(body.email || "").trim();
        const salt = randHex(16);
        const passHash = await pbkdf2(password, salt, iter);
        const ins = await fetch(SB_URL + "/rest/v1/users", {
          method: "POST",
          headers: { ...auth, Prefer: "return=representation" },
          body: JSON.stringify({ account, pass_hash: passHash, salt, phone, nickname, email, role: "user" }),
        });
        if (!ins.ok) throw new Error("注册失败（" + ins.status + "）");
        u = (await ins.json())[0];
      } else {
        if (!rows.length) throw new Error("账号不存在，请先注册");
        const cand = rows[0];
        if ((await pbkdf2(password, cand.salt, iter)) !== cand.pass_hash) throw new Error("密码错误");
        u = cand;
      }
      const token = randHex(32);
      const tokenHash = await sha256Hex(token);
      await fetch(SB_URL + "/rest/v1/sessions", {
        method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({
          account_id: u.id,
          token_hash: tokenHash,
          expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        }),
      });
      return Response.json({
        ok: true, token, account: u.account, role: u.role || "user",
        avatar: avatarOf(u), nickname: u.nickname || "",
      }, { headers: corsHeaders });
    }

    const sessToken = (req.headers.get("x-sess") || "").trim();
    const tokenHash = sessToken ? await sha256Hex(sessToken) : "";
    const rs = await fetch(
      SB_URL + "/rest/v1/sessions?select=account_id,expires_at&token_hash=eq." + encodeURIComponent(tokenHash) +
      "&expires_at=gt." + encodeURIComponent(new Date().toISOString()),
      { headers: auth }
    );
    const sess = (await rs.json()) || [];
    if (!sess.length) {
      return Response.json({ ok: false, error: "未登录或登录已过期" }, {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const uid = sess[0].account_id;

    const ra = await fetch(SB_URL + "/rest/v1/users?select=id,account,phone,nickname,email,role&id=eq." + uid, { headers: auth });
    const u = ((await ra.json()) || [])[0] || {};

    if (op === "me") {
      return Response.json({ ok: true, account: u.account || "", role: u.role || "user", avatar: avatarOf(u), nickname: u.nickname || "" }, { headers: corsHeaders });
    }
    if (op === "logout") {
      await fetch(SB_URL + "/rest/v1/sessions?token_hash=eq." + encodeURIComponent(tokenHash), {
        method: "DELETE", headers: { ...auth, Prefer: "return=minimal" },
      });
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    if (op === "orders") {
      const ro = await fetch(
        SB_URL + "/rest/v1/orders?select=*&account=eq." + encodeURIComponent(u.account || "") + "&order=id.desc&limit=50",
        { headers: auth }
      );
      const orders = (await ro.json()) || [];
      return Response.json({ ok: true, orders }, { headers: corsHeaders });
    }
    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
