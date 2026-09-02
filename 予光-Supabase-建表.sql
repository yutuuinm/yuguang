-- ============================================================
-- 予光 YUGUANG · Supabase 建表 SQL（SQL Editor 整段执行，可重复执行）
-- 说明：按"Enable automatic RLS=开启"环境编写；每表显式开启 RLS 并配置策略。
-- anon 密钥仅能：读公开表、写订单/留言/订阅；其余写操作需 service_role 或后台。
-- ============================================================

-- ① 商品/系列
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  series text not null default 'east' check (series in ('east','west','union','destiny')),
  sub text default '',
  main_stone text default '',
  aux_stone text default '',
  metal text default '',
  chain text default '',
  glyph text default '',
  price_yuan numeric default 0,
  image_url text default '',
  story text default '',
  quote text default '',
  tags text[] default '{}',
  sort int default 0,
  visible boolean default true,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
drop policy if exists "products_公开读" on public.products;
create policy "products_公开读" on public.products for select using (true);

-- ② 晶石图鉴（养石/星图志 用）
create table if not exists public.crystals (
  id bigint generated always as identity primary key,
  name text not null unique,
  kind text default '',          -- 五行/星体/星座归属，如 火 · 巳蛇 或 月亮
  element text default '',       -- 水木火土金 / sun / moon / rising
  meaning text default '',
  care_tip text default '',
  color_hex text default '#8FA3D9',
  image_url text default '',
  sort int default 0,
  visible boolean default true
);
alter table public.crystals enable row level security;
drop policy if exists "crystals_公开读" on public.crystals;
create policy "crystals_公开读" on public.crystals for select using (true);

-- ③ 光集 · 客户作品库（类白桦 Remy 展示层，图片在 img/customers/ 或存储桶）
create table if not exists public.gallery (
  id bigint generated always as identity primary key,
  name text not null,
  image_url text not null default '',
  tag text default '',
  story text default '',
  quote text default '',
  sort int default 0,
  visible boolean default true,
  approved boolean default false,   -- 经客户授权后才置 true 对外展示
  created_at timestamptz default now()
);
alter table public.gallery enable row level security;
drop policy if exists "gallery_公开读已授权" on public.gallery;
create policy "gallery_公开读已授权" on public.gallery
  for select using (visible is true and approved is true);

-- ④ 防伪验真记录（每件作品唯一验证码）
create table if not exists public.records (
  id bigint generated always as identity primary key,
  code text unique not null,
  product_ref text default '',
  info jsonb default '{}'::jsonb,
  image_urls text default '',
  created_at timestamptz default now()
);
alter table public.records enable row level security;
drop policy if exists "records_公开按码查" on public.records;
create policy "records_公开按码查" on public.records for select using (true);

-- ⑤ 订单（写入公开；查询需后台/将来 auth）
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  order_no text unique not null default 'YG' || to_char(now(),'YYMMDD') || floor(random()*9000+1000)::text,
  phone text default '',
  items jsonb default '[]'::jsonb,
  amount numeric default 0,
  status text default 'new' check (status in ('new','paid','making','shipped','done','refund')),
  note text default '',
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
drop policy if exists "orders_匿名下单" on public.orders;
create policy "orders_匿名下单" on public.orders for insert with check (true);
-- 查询/改单默认仅 service_role（后台/将来接入 auth 后按 auth.uid 放行）

-- ⑥ 留言/投稿/咨询（写入公开；查看仅后台）
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  type text default 'message' check (type in ('message','gallery_submit','order_ask','contact')),
  name text default '',
  contact text default '',
  content text default '',
  image_url text default '',
  status text default 'new',
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
drop policy if exists "messages_匿名提交" on public.messages;
create policy "messages_匿名提交" on public.messages for insert with check (true);

-- ⑦ 订阅/微信号登记
create table if not exists public.subscribers (
  id bigint generated always as identity primary key,
  contact text not null,
  source text default '',
  created_at timestamptz default now()
);
alter table public.subscribers enable row level security;
drop policy if exists "subscribers_匿名登记" on public.subscribers;
create policy "subscribers_匿名登记" on public.subscribers for insert with check (true);

-- ⑧ 站点配置/公告（公开读，后台写）
create table if not exists public.app_data (
  key text primary key,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.app_data enable row level security;
drop policy if exists "app_data_公开读" on public.app_data;
create policy "app_data_公开读" on public.app_data for select using (true);

-- ⑨ 素材存储桶（图片上传目标；SQL Editor 以 postgres 执行可建桶）
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;
drop policy if exists "予光素材公开读" on storage.objects;
create policy "予光素材公开读" on storage.objects
  for select using (bucket_id = 'assets');
-- 上传仅允许 service_role（Dashboard → Storage 手动上传即可；anon 不开放写）

-- ============================================================
-- 种子数据（可重复执行；示例数据便于联调，正式内容另行管理）
-- ============================================================
insert into public.products (slug, name, series, sub, main_stone, aux_stone, metal, chain, glyph, price_yuan, image_url, quote, tags, sort, visible)
values
  ('sisi-liguang', '巳蛇 · 离光', 'east', '本命火 · 离卦', '红纹石', '石榴石 / 红碧玺', '18K 哑光金', '生肖暗刻 · 手作', '☲ 离卦', 699, '示例图片.jpg', '安静炽烈，你的光不喧哗，但没人能忽略。', array['东方线','生肖定制','示例'], 1, true),
  ('shuangtian-chaoxi', '天蝎 · 静焰', 'west', '太阳 · 月亮 · 上升', '黑曜石', '月光石', '925 做旧银', '波浪蛇骨链', '♏ ☽', 699, '', '你的光在深处，等一个愿意走进来的人。', array['西方线','三盘一线'], 2, true)
on conflict (slug) do nothing;

insert into public.crystals (name, kind, element, meaning, care_tip, color_hex, sort, visible) values
  ('红纹石','本命火 · 巳蛇 等','火','传统意象中主温暖与深情，被看作"静焰"的化身','避免暴晒与磕碰，软布轻拭', '#C9575B', 1, true),
  ('月光石','月亮 · 情绪','moon','象征情绪的潮汐与柔软，愿你安放内心','不接触化学品，睡前取下', '#CFD4E0', 2, true),
  ('海蓝宝','水 · 双鱼/水瓶','水','似深海的光，理性与澄澈','远离高温，清水冲洗后擦干', '#7FB5C9', 3, true),
  ('紫水晶','火气 · 射手/双鱼','火','灵感与静心的光','避免长时间暴晒以防褪色', '#9B7BC9', 4, true),
  ('虎眼石','土 · 金牛/双子','土','坚定与笃定的守护意象','用软布单独收纳', '#B0804A', 5, true),
  ('黑曜石','水 · 天蝎/摩羯','水','传统文化中的守护意象，愿平安','轻柔清洁，避免撞击', '#1B1B22', 6, true)
on conflict (name) do nothing;

insert into public.gallery (name, image_url, tag, story, quote, sort, visible, approved) values
  ('巳蛇 · 离光','img/customers/示例图片.jpg','东方线 · 示例','示例客户作品：本命火 · 离卦，红纹石主石。','安静炽烈，你的光不喧哗，但没人能忽略。',1,true,true),
  ('等待她的光','img/customers/customer-2.jpg','西方线','她的星座主石正在路上——放入图片并登记后展出。','你的光在深处，等一个愿意走进来的人。',2,true,false),
  ('两个人的满月','img/customers/customer-3.jpg','合盘线','双生系列客户照位。','两个人的光，合起来是一轮满月。',3,true,false)
on conflict do nothing;

insert into public.app_data (key, value) values
  ('brand', '{"name":"予光","slogan":"黑暗中总有光伴你前行，虽微弱，但足够照亮。","disclaimer":"予光所有产品均为饰品。生肖八卦星座星盘等符号及其解读源自传统文化与流行文化中的象征寓意，属装饰与自我表达，不构成任何承诺。"}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- 完成。之后在网站前端将按 RLS 读取公开表；订单/留言由页面提交写入。

-- ============================================================
-- 【整理/修复】可随时执行（幂等）
-- 1) 光集去重（SQL 重复执行导致的重复种子）
delete from public.gallery a
using public.gallery b
where a.id > b.id
  and a.name = b.name
  and coalesce(a.image_url,'') = coalesce(b.image_url,'');
-- 2) 给光集加唯一约束，防止再次重复（幂等：先删后建，可重复执行）
alter table public.gallery drop constraint if exists gallery_name_img_unique;
alter table public.gallery
  add constraint gallery_name_img_unique unique (name, image_url);
