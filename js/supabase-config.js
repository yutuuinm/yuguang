/* 予光 · Supabase 数据接口（已配置）
   ─────────────────────────────────────────────
   Project URL / anon key 来自 supabase.com → Settings → API
   使用约定：window.sb('表?查询') 读，sb('表',{method:'POST',body}) 写
   注意：anon 仅能按 RLS 策略访问；请勿在公开代码中放入 service_role。
*/
window.SUPABASE = {
  url: 'https://iswxrfxugxvqcjuqzhst.supabase.co',
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzd3hyZnh1Z3h2cWNqdXF6aHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDQ1MTMsImV4cCI6MjEwMzkyMDUxM30.t9VW2vBoG1upxGwKa-J8nheU9E3BDMxvYkEfZbAdQyU'
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
  if (v.indexOf('http') === 0 || v.indexOf('img/') === 0) return v;
  return window.SUPABASE.url + '/storage/v1/object/public/' + v;
};
