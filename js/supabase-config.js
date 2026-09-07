/* 予光 · Supabase 数据接口（已配置）
   ─────────────────────────────────────────────
   Project URL / anon key 来自 supabase.com → Settings → API
   使用约定：window.sb('表?查询') 读，sb('表',{method:'POST',body}) 写
   注意：anon 仅能按 RLS 策略访问；请勿在公开代码中放入 service_role。
   Edge Functions（已部署）：
     emailUrl = email-send 函数地址（表单提交成功后自动发邮件通知，FUNC_TOKEN 未设则无需 token）
     aiUrl    = ai-assistant 函数地址（AI 光语助手 / 荐石）
*/
window.SUPABASE = {
  url: 'https://iswxrfxugxvqcjuqzhst.supabase.co',
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzd3hyZnh1Z3h2cWNqdXF6aHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDQ1MTMsImV4cCI6MjEwMzkyMDUxM30.t9VW2vBoG1upxGwKa-J8nheU9E3BDMxvYkEfZbAdQyU',
  emailUrl: 'https://iswxrfxugxvqcjuqzhst.supabase.co/functions/v1/email-send',
  emailToken: '',
  aiUrl: 'https://iswxrfxugxvqcjuqzhst.supabase.co/functions/v1/ai-assistant'
};

/* 轻量 REST 接口：sb('products?select=*') 或 sb('messages',{method:'POST',body}) */
window.sb = function (pathname, opts) {
  var cfg = window.SUPABASE;
  if (!cfg.url || !cfg.anon) return Promise.resolve(null);
  var url = cfg.url + '/rest/v1/' + pathname;
  var headers = Object.assign(
    {
      apikey: cfg.anon,
      Authorization: 'Bearer ' + cfg.anon,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    (opts && opts.headers) || {}
  );
  return fetch(url, Object.assign({ headers: headers }, opts)).then(function (r) {
    return r.ok ? r.json() : Promise.reject(new Error('sb ' + r.status + ' ' + pathname));
  });
};

/* 把图片字段转成可展示地址：
   - 已含 http / 站内 img/ 开头 → 原样返回
   - 其余（如 storage 路径 yuguang/xx.jpg）→ 拼接公开存储桶 */
window.sbImg = function (v) {
  if (!v) return '';
  if (v.indexOf('http') === 0 || v.indexOf('img/') === 0 || v.indexOf('客户图片/') === 0) return v;
  return window.SUPABASE.url + '/storage/v1/object/public/' + v;
};

/* 提交成功后触发邮件通知（统一发送到后台预置邮箱；失败静默）
   type：order / message / design（系列预约设计）/ gallery_submit / subscriber / share 等 */
window.notifyEmail = function (table, body, type) {
  var cfg = window.SUPABASE;
  if (!cfg || !cfg.url) return;
  try {
    var t = type || (table === 'orders' ? 'order' : (table === 'subscribers' ? 'subscriber' : 'message'));
    var subject = '【予光】新信息通知';
    var f = {};
    if (t === 'order') {
      subject = '【予光】新的定制/购买意向';
      f['客户联系方式'] = body.phone || body.account || '—';
      f['商品明细'] = typeof body.items === 'string' ? body.items : JSON.stringify(body.items || []).slice(0, 400);
      f['留言/备注'] = String(body.note || '—').slice(0, 600);
      f['下单账号'] = body.account || '（未登录）';
      f['期望金额'] = body.amount !== undefined ? ('¥' + body.amount) : '—';
    } else if (t === 'design') {
      subject = '【予光】系列/预约设计意向';
      f['称呼'] = body.name || '—';
      f['联系方式'] = body.contact || '—';
      f['预约设计内容'] = String(body.content || body.note || '—').slice(0, 600);
    } else if (t === 'gallery_submit') {
      subject = '【予光】光集投稿意向';
      f['称呼'] = body.name || '—';
      f['联系方式'] = body.contact || '—';
      f['作品信息与光语'] = String(body.content || '').slice(0, 600);
    } else if (t === 'subscriber') {
      subject = '【予光】新的订阅';
      f['订阅联系方式'] = body.contact || '—';
    } else if (t === 'share') {
      subject = '【予光】光语分享 · 顾客授权回执';
      Object.keys(body || {}).forEach(function (k) { f[k] = body[k]; });
    } else {
      subject = '【予光】新的留言';
      f['称呼'] = body.name || '—';
      f['联系方式'] = body.contact || '—';
      f['内容'] = String(body.content || '').slice(0, 500);
    }
    fetch(cfg.url + '/functions/v1/email-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: t, subject: subject, fields: f })
    }).catch(function () {});
  } catch (e) {}
};
/* AI 助手统一调用：sbAI({mode:'chat'|'stones', question/need, history}) → Promise<{ok,answer|error}> */
window.sbAI = function (payload) {
  var cfg = window.SUPABASE;
  if (!cfg.aiUrl) return Promise.resolve({ ok: false, error: 'AI 未配置' });
  return fetch(cfg.aiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function (r) { return r.json(); });
};
