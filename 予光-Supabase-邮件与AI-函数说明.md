# 予光 · Supabase 邮件发送 & AI 助手（Edge Functions · v2）

与白桦同架构，优化点：**邮件收件人与 AI 配置入库**（`settings` 表，仅 service role 可读，
管理员在 Table Editor 直接改，无需改代码），密钥**不进网页、不进公开仓库**。

## 代码位置（已随仓库部署到 GitHub，公开可见的是无密钥的源码）
- `supabase/functions/email-send/index.ts` —— SMTP 邮件通知（发件/收件均读 settings.mail）
- `supabase/functions/ai-assistant/index.ts` —— DeepSeek AI 助手（chat / stones，读 settings.ai）

## 第一步：配置入库（本机执行，含密钥）
在 Supabase → SQL Editor 执行本地文件 **`予光-Supabase-配置.sql`**（整段）：
- 建 `settings` 表（匿名不可见）并写入
  - `mail`：发件 2132389280@qq.com + 授权码 + 收件 `["21040690227@163.com"]`（支持多个）
  - `ai`：DeepSeek key + model
- 同时收紧 `app_data` 公开读策略（防密钥暴露）

**管理员以后改配置**：Supabase → Table Editor → `settings` 表 →
- 改收件邮箱/加邮箱：编辑 `mail` 行的 `value.to` 数组（示例见 SQL 注释）
- 换模型/换 AI key：编辑 `ai` 行
- 也可以加环境变量覆盖（Secrets 优先级更高）：`SMTP_USER/SMTP_PASS/MAIL_TO/AI_API_KEY/AI_MODEL`

## 第二步：部署函数（二选一）
方式 A（推荐，自动）：Supabase Dashboard → **Integrations → GitHub** 接入 `yutuuinm/yuguang`
→ 启用 Edge Functions（分支 main）。之后仓库 push 即自动部署，改函数我推上去即可。
方式 B（本机一次）：
```bash
npm i -g supabase && supabase login
supabase link --project-ref iswxrfxugxvqcjuqzhst
supabase functions deploy email-send
supabase functions deploy ai-assistant
```

## 第三步：验证
- 浏览器 GET 函数地址（如 `https://iswxrfxugxvqcjuqzhst.supabase.co/functions/v1/email-send`）应返回健康 JSON；
- 网站任一表单（首页留言/定制意向/光集投稿）提交后，收件邮箱应收到【予光】通知；
- AI 前端入口：在浏览器控制台执行下方命令验证 chat 与 stones：
```js
fetch('https://iswxrfxugxvqcjuqzhst.supabase.co/functions/v1/ai-assistant', {
  method:'POST', headers:{'Content-Type':'application/json'},
  body: JSON.stringify({ mode:'stones', need:'想给自己一份分手后的陪伴' })
}).then(r=>r.json()).then(console.log)
```

## 防滥用与合规
- `email-send` 支持 `FUNC_TOKEN`（`supabase secrets set FUNC_TOKEN=xxx`，前端同步配置后防刷邮件）；
- AI 提示词内置红线：不算命、不承诺效果、不宣传开光法力、文化意象仅供参考、医疗引导就医；
- 含密钥的 `予光-Supabase-配置.sql` 与邮件授权码**绝不推送到 GitHub 公开仓库**（源码里无任何密钥）。

## 常见问题
- 函数 404：确认已 link 正确项目并成功 deploy；GET 健康检查应返回 JSON。
- 邮件收不到：SQL 是否执行（settings.mail 已写入）；SMTP 授权码是否正确；QQ 邮箱需在设置开启 SMTP。
- AI 返回"未配置"：settings.ai 是否已写入（或设置 AI_API_KEY）。
