/* 予光 · Supabase 数据接口预留（纯静态时零影响）
   ─────────────────────────────────────────────
   1) 在 supabase.com 新建项目
   2) 把 Project URL 与 anon public key 填入下方 SUPABASE 配置
   3) 此后即可用 window.sb() 读取/写入数据（示例见文件底部）
   说明：密钥留空时所有接口静默返回 null，网站保持纯静态照常运行。
*/
window.SUPABASE = {
  url: '', // 例如 'https://xxxxxxxx.supabase.co'
  anon: '' // 例如 'eyJhbGciOiJIUzI1NiIs...'
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

/* ── 预留调用示例（填入密钥后取消注释即可启用）──
// 读取商品/系列
window.sb('products?select=*&order=created_at').then(function (rows) {
  console.log('Supabase 商品数据：', rows);
});
// 提交一条访客留言（表名可改为 messages/orders）
window.sb('messages', {
  method: 'POST',
  body: JSON.stringify({ name: '访客', text: '想了解双生系列' })
});
*/
