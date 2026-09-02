// ============================================================
// 予光 · Supabase Edge Function：account-api（会员：注册/登录/我的订单）
// 前端 POST：
//   {op:'register', account:'手机号', password:'...'}
//   {op:'login',    account, password}          → {token, phone}
//   {op:'me',       }  （需 x-sess: token）
//   {op:'orders',   }                            → 该账号的订单列表
//   {op:'logout',   }
// 口令哈希：PBKDF2-SHA256（盐随机）；令牌：随机 64hex，库中只存 sha256。
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
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt, iterations: iter, hash: "SHA-256" },
    key, 256
  );
  return Array.from(new Uint8Array(bits), (x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, name: "予光 account-api" }), {
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
      if (!account || password.length < 6) throw new Error("手机号或密码格式不正确（密码至少 6 位）");
      const r1 = await fetch(SB_URL + "/rest/v1/accounts?select=id,phone,pass_hash,salt&phone=eq." + encodeURIComponent(account), { headers: auth });
      const rows = (await r1.json()) || [];

      let accId, phone;
      if (op === "register") {
        if (rows.length) throw new Error("该账号已注册，请直接登录");
        const salt = randHex(16);
        const passHash = await pbkdf2(password, salt, iter);
        const ins = await fetch(SB_URL + "/rest/v1/accounts", {
          method: "POST", headers: { ...auth, Prefer: "return=representation" },
          body: JSON.stringify({ phone: account, pass_hash: passHash, salt: salt }),
        });
        if (!ins.ok) throw new Error("注册失败（" + ins.status + "）");
        const created = (await ins.json())[0];
        accId = created.id; phone = created.phone;
      } else {
        if (!rows.length) throw new Error("账号不存在，请先注册");
        const acc = rows[0];
        const hash = await pbkdf2(password, acc.salt, iter);
        if (hash !== acc.pass_hash) throw new Error("密码错误");
        accId = acc.id; phone = acc.phone;
      }
      const token = randHex(32);
      const tokenHash = await sha256Hex(token);
      const exp = new Date(Date.now() + 30 * 86400000).toISOString();
      await fetch(SB_URL + "/rest/v1/sessions", {
        method: "POST", headers: { ...auth, Prefer: "return=minimal" },
        body: JSON.stringify({ account_id: accId, token_hash: tokenHash, expires_at: exp }),
      });
      return Response.json({ ok: true, token: token, phone: phone }, { headers: corsHeaders });
    }

    const sessToken = (req.headers.get("x-sess") || "").trim();
    const tokenHash = sessToken ? await sha256Hex(sessToken) : "";
    const rs = await fetch(SB_URL + "/rest/v1/sessions?select=account_id,expires_at&token_hash=eq." + encodeURIComponent(tokenHash) + "&expires_at=gt." + encodeURIComponent(new Date().toISOString()), { headers: auth });
    const sess = (await rs.json()) || [];
    if (!sess.length) {
      return Response.json({ ok: false, error: "未登录或登录已过期" }, {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const accountId = sess[0].account_id;

    if (op === "me" || op === "orders" || op === "logout") {
      const ra = await fetch(SB_URL + "/rest/v1/accounts?select=id,phone&id=eq." + accountId, { headers: auth });
      const accRows = (await ra.json()) || [];
      const acc = accRows[0] || {};
      if (op === "me") {
        return Response.json({ ok: true, phone: acc.phone || "" }, { headers: corsHeaders });
      }
      if (op === "logout") {
        await fetch(SB_URL + "/rest/v1/sessions?token_hash=eq." + encodeURIComponent(tokenHash), { method: "DELETE", headers: { ...auth, Prefer: "return=minimal" } });
        return Response.json({ ok: true }, { headers: corsHeaders });
      }
      // orders：按账号手机号匹配订单
      const ro = await fetch(SB_URL + "/rest/v1/orders?select=*&phone=eq." + encodeURIComponent(acc.phone || "") + "&order=id.desc&limit=50", { headers: auth });
      const orders = (await ro.json()) || [];
      return Response.json({ ok: true, orders: orders }, { headers: corsHeaders });
    }

    return Response.json({ ok: false, error: "未知 op" }, { headers: corsHeaders });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
