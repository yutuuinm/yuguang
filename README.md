# 予光 YUGUANG — 官网静态站

黑暗中总有光伴你前行，虽微弱，但足够照亮。

## 在线地址
- 网站：<https://yutuuinm.github.io/yuguang/>
- 仓库：<https://github.com/yutuuinm/yuguang>

## 目录结构（仓库根 = 网站根）
```
index.html          首页
collections.html    系列总览
product.html        产品详情（示例款）
story.html          品牌故事
intro.html          认识予光
promise.html        承诺与隐私
faq.html            常见问题
studio.html         定制工坊（交互原型）
css/style.css       视觉系统
js/main.js          交互逻辑（星空动效/工坊/选项卡）
js/supabase-config.js  Supabase 数据接口预留
予光.jpg            logo（替换同名文件即可换 logo）
背景.jpg            星空底图
示例图片.jpg        商品示例图
img/                微信二维码放置目录（wechat-mp.png / wechat-service.png）
```

## 更新网站
方式 A（网页端）：在仓库页面手动上传替换文件。
方式 B（命令行，需本机安装 git）：
```
git clone https://github.com/yutuuinm/yuguang.git
# 替换文件后
git add -A && git commit -m "update" && git push
```
推送后约 1–2 分钟 GitHub Pages 自动生效。

## Supabase 数据接口（预留）
1. 到 supabase.com 新建项目；
2. 在「Project Settings → API」复制 Project URL 与 anon public key；
3. 填入 `js/supabase-config.js` 顶部的 `SUPABASE.url` / `SUPABASE.anon`；
4. 页面里即可用 `window.sb('表名?select=*')` 读写数据，示例见该文件底部注释；
5. 若表要求行级安全（RLS），请在 Supabase SQL Editor 执行：
   ```sql
   alter table products enable row level security;
   create policy "公开读" on products for select using (true);
   ```
建议预留表：`products`（商品/系列）、`light_cards`（光语）、`messages`（留言/咨询）、`orders`（订单）。

## 免责声明
予光所有产品均为饰品。涉及生肖、八卦、星座、星盘等符号及其解读，源自中国传统文化与流行文化中的象征寓意，属装饰与自我表达范畴，不构成任何医疗、心理或行为建议，也不对任何效果作出承诺。
