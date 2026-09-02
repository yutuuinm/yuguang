# 予光 · Supabase 邮件发送 & AI 助手（Edge Functions）

与白桦同架构，但做了两点优化：密钥只存 **Secrets/app_data**（service role 读取，不进前端）；AI 提示词内置**予光合规红线**。

## 目录（已放入仓库 `supabase/functions/`）
| 函数 | 作用 |
|---|---|
| `email-send` | 客户提交定制意向/留言/投稿后，SMTP 发通知邮件到商家邮箱 |
| `ai-assistant` | DeepSeek AI 光语助手：`chat`（全站助手）/ `stones`（AI 荐石，读 crystals 库） |

## 部署（本机执行，一次性）

需要本机安装 Node 并登录 Supabase：

```bash
# 1) 安装并登录（浏览器授权）
npm i -g supabase
supabase login

# 2) 在本项目目录关联项目
supabase link --project-ref iswxrfxugxvqcjuqzhst

# 3) 部署两个函数
supabase functions deploy email-send
supabase functions deploy ai-assistant

# 4) 配置 Secrets（值换成你自己的）
# 邮件：使用你的发件邮箱（QQ/163 均可，需开启 SMTP 并取得授权码）
supabase secrets set SMTP_USER=你的发件邮箱 SMTP_PASS=邮箱授权码 MAIL_TO=收件邮箱
# AI：DeepSeek 平台申请 key（platform.deepseek.com）
supabase secrets set AI_API_KEY=sk-你的key AI_MODEL=deepseek-chat
```

> 也可不用环境变量：在 SQL Editor 执行
> `insert into app_data(key,value) values ('yuguang_ai','{"key":"sk-...","model":"deepseek-chat"}') on conflict (key) do update set value=excluded.value;`
> AI 函数会优先读 `AI_API_KEY`，读不到再查 `app_data.yuguang_ai`。

## 前端接线（已完成）
- `site/js/supabase-config.js` 已预留 `emailUrl / aiUrl / emailToken`（默认空 = 关闭，不影响页面）。
- 表单提交成功后若配置了 `emailUrl`，自动发一封通知邮件（kind=order/gallery_submit/message）。
- AI 助手入口可在任意页面打开浏览器控制台验证：
  ```js
  // 设好 emailUrl/aiUrl 后（或临时手填）：
  fetch('https://iswxrfxugxvqcjuqzhst.supabase.co/functions/v1/ai-assistant', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ mode:'chat', question:'帮我看看定制流程？' })
  }).then(r=>r.json()).then(console.log)
  ```

## 防滥用与合规
- `email-send` 支持 `FUNC_TOKEN` 校验（`supabase secrets set FUNC_TOKEN=xxx` 后前端同样配置），防止被刷邮件；
- AI 提示词内置红线：不算命、不承诺效果、不宣传开光法力、文化意象仅供参考、医疗问题引导就医；
- anon key 依旧只用于站内读写公开表/提交表单，两个函数均不依赖前端密钥。

## 常见问题
- 函数地址 404：确认已 link 到本项目 ref 并部署成功；浏览器直接 GET 函数地址应返回健康 JSON。
- 邮件发不出去：检查 SMTP 授权码是否正确、QQ 邮箱需在设置里开启 SMTP 服务。
- AI 返回"未配置"：检查 `AI_API_KEY` 或 `app_data.yuguang_ai` 是否写入。
