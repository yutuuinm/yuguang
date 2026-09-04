/* ============================================================
   予光 · 品牌站脚本 v1.0
   星空 Canvas / 导航 / 滚动渐亮 / 定制工坊
   ============================================================ */

/* ---------- 数据（品牌手册 v1.0 同步） ---------- */

// 生肖 → 本命五行 + 光语
const ZODIAC = {
  子鼠: { el: '水', quote: '机敏灵动，你的光藏在暗处，你总能第一个看见它。' },
  丑牛: { el: '土', quote: '沉默耕耘，你的光不急于被看见，但大地记得。' },
  寅虎: { el: '木', quote: '你路过的地方，风都替你亮了一下。' },
  卯兔: { el: '木', quote: '温柔是你的光源，也是你的铠甲。' },
  辰龙: { el: '土', quote: '云深处有你的光，等一场雨，或等一个人。' },
  巳蛇: { el: '火', quote: '安静炽烈，你的光不喧哗，但没人能忽略。' },
  午马: { el: '火', quote: '你的光跑得比黑夜快。' },
  未羊: { el: '土', quote: '你把自己养得很好，光从从容容。' },
  申猴: { el: '金', quote: '机巧明亮，你把日子过成一场小把戏，光却始终认真。' },
  酉鸡: { el: '金', quote: '天亮前你是最早醒来的那束光。' },
  戌狗: { el: '土', quote: '忠诚是你恒定的光，照别人，也照自己。' },
  亥猪: { el: '水', quote: '你相信日子会好，于是日子真的慢慢亮起来。' },
};

// 五行 → 主石候选 [名称, 色]
const ELEMENT_STONES = {
  水: [['海蓝宝', '#7FB5C9'], ['蓝晶石', '#5B7FA6'], ['黑曜石', '#1B1B22']],
  木: [['绿幽灵', '#4C8C6A'], ['孔雀石', '#2E7D5B'], ['绿发晶', '#5C8A5C']],
  火: [['红纹石', '#C9575B'], ['石榴石', '#9E2A2B'], ['红碧玺', '#B03A48']],
  土: [['黄水晶', '#E0B25C'], ['蜜蜡', '#C98F4E'], ['虎眼石', '#B0804A']],
  金: [['白水晶', '#E8E4DA'], ['金发晶', '#D9B45C'], ['月光石', '#CFD4E0']],
};

// 八卦方位 [名, 卦符, 光语]
const GUAS = [
  ['乾 · 西北', '☰', '天行健，向着开阔处'],
  ['坤 · 西南', '☷', '厚德载物，稳稳托住'],
  ['离 · 南', '☲', '光明之卦，向着亮处去'],
  ['坎 · 北', '☵', '行于暗处，心不慌'],
  ['震 · 东', '☳', '惊雷唤醒，敢作敢为'],
  ['巽 · 东南', '☴', '如风入隙，柔而能入'],
  ['艮 · 东北', '☶', '山止于此，停下来也是路'],
  ['兑 · 西', '☱', '喜悦之卦，开口见光'],
];

// 太阳星座 → 主石 + 光语
const SUN = {
  白羊: { stone: ['红玛瑙', '#C04A4A'], quote: '你的光总是先于犹豫抵达。' },
  金牛: { stone: ['绿玉髓', '#6FA87F'], quote: '你的光很稳，慢一点，但从不熄灭。' },
  双子: { stone: ['虎眼石', '#B0804A'], quote: '你的光有两面，一面照亮别人，一面照亮自己。' },
  巨蟹: { stone: ['月光石', '#CFD4E0'], quote: '潮汐是你的情绪，也把你的温柔养得很大。' },
  狮子: { stone: ['黄水晶', '#E0B25C'], quote: '不必收敛你的亮，世界需要有人先点灯。' },
  处女: { stone: ['白水晶', '#E8E4DA'], quote: '你把细小的光整理成秩序，日子就亮了。' },
  天秤: { stone: ['摩根石', '#E8A8B8'], quote: '平衡不是妥协，是你给所有选择留的光。' },
  天蝎: { stone: ['黑曜石', '#1B1B22'], quote: '你的光在深处，等一个愿意走进来的人。' },
  射手: { stone: ['紫水晶', '#9B7BC9'], quote: '你的光生来向往远方，黑夜拦不住。' },
  摩羯: { stone: ['烟晶', '#8C7A6B'], quote: '你的光一步一步爬上山，最后照亮整片夜。' },
  水瓶: { stone: ['蓝晶石', '#5B7FA6'], quote: '你的光很特别，别人先是看不懂，然后是忘不掉。' },
  双鱼: { stone: ['海蓝宝', '#7FB5C9'], quote: '柔软不是弱点，是你发光的方式。' },
};

// 月亮（情绪质地）→ 辅石
const MOON = {
  '潮汐般易感': ['月光石', '#CFD4E0'],
  '炽烈而直白': ['红纹石', '#C9575B'],
  '沉静而隐忍': ['烟晶', '#8C7A6B'],
  '理性而疏离': ['海蓝宝', '#7FB5C9'],
  '柔软而丰盈': ['粉晶', '#E8B4C0'],
  '坚定而笃定': ['虎眼石', '#B0804A'],
};

// 星座符号
const GLYPH = {
  白羊: '♈', 金牛: '♉', 双子: '♊', 巨蟹: '♋', 狮子: '♌', 处女: '♍',
  天秤: '♎', 天蝎: '♏', 射手: '♐', 摩羯: '♑', 水瓶: '♒', 双鱼: '♓',
};

// 光集：客户作品图片库（图片存放 site/客户图片/，条目在此登记，页面自动陈列）
// 未来接入 Supabase 后可由 gallery 表驱动：sb('gallery?select=*&order=sort')
const GALLERY_ITEMS = [
  {
    src: '客户图片/示例图片.jpg',
    name: '巳蛇 · 离光',
    tag: '东方线 · 示例',
    story: '示例客户作品：本命火 · 离卦，红纹石主石。正式上线后这里将按客户授权展出真实作品。',
    quote: '「安静炽烈，你的光不喧哗，但没人能忽略。」',
  },
  {
    src: '客户图片/customer-2.jpg',
    name: '等待她的光',
    tag: '西方线',
    story: '她的星座主石正在路上——放入图片并在 GALLERY_ITEMS 登记后即自动展出。',
    quote: '「你的光在深处，等一个愿意走进来的人。」',
  },
  {
    src: '客户图片/customer-3.jpg',
    name: '两个人的满月',
    tag: '合盘线',
    story: '双生系列客户照位——放入图片并在 GALLERY_ITEMS 登记后即自动展出。',
    quote: '「两个人的光，合起来是一轮满月。」',
  },
];

/* ---------- 工具 ---------- */
function $(id) { return document.getElementById(id); }

function fillSelect(sel, options) {
  if (!sel) return;
  sel.innerHTML = options
    .map((o) => '<option value="' + o[0] + '">' + o[1] + '</option>')
    .join('');
}

/* ---------- 全站星夜底图（自动注入，换图只需改这里） ---------- */
const BG_PHOTO = '背景.jpg'; // 星夜底图：替换为新的背景图文件名即可全站生效

(function initBackdrop() {
  const canvas = $('stars');
  const photo = document.createElement('div');
  photo.className = 'bg-photo';
  const img = document.createElement('img');
  img.src = BG_PHOTO;
  img.alt = '';
  img.onerror = function () { photo.style.display = 'none'; };
  photo.appendChild(img);
  const dim = document.createElement('div');
  dim.className = 'bg-dim';
  if (canvas) {
    document.body.insertBefore(photo, canvas);
    document.body.insertBefore(dim, canvas);
  } else {
    document.body.appendChild(photo);
    document.body.appendChild(dim);
  }
})();

/* ---------- 星空背景（动效升级：闪烁星辰 · 星云光晕 · 流星） ---------- */
(function initStars() {
  const canvas = $('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let W, H, stars = [], orbs = [];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.min(240, Math.floor((W * H) / 8500));
    stars = [];
    for (let i = 0; i < n; i++) {
      // 6 成月白、3 成星蓝、1 成微光金；少量大星自带光晕
      const roll = Math.random();
      const rgb = roll < 0.6 ? '244,239,230' : roll < 0.9 ? '143,163,217' : '227,196,124';
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.3 + Math.random() * 1.4,
        rgb: rgb,
        base: 0.22 + Math.random() * 0.62,
        speed: 0.006 + Math.random() * 0.016,
        phase: Math.random() * Math.PI * 2,
        big: Math.random() < 0.05,
      });
    }
    // 星云光晕（缓慢漂移的低亮大光斑）
    orbs = [
      { x: W * 0.22, y: H * 0.3, r: Math.min(W, H) * 0.55, vx: 0.035, vy: 0.018, rgb: '143,163,217', a: 0.055 },
      { x: W * 0.82, y: H * 0.68, r: Math.min(W, H) * 0.5, vx: -0.028, vy: -0.022, rgb: '227,196,124', a: 0.045 },
    ];
  }

  // 流星（多点 · 明显：更快、更长、更亮，约三成概率双星齐落）
  let meteors = [];
  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.9,
      y: Math.random() * H * 0.45,
      vx: 5.5 + Math.random() * 6,
      vy: 3 + Math.random() * 3.4,
      life: 1,
    });
    if (Math.random() < 0.5) {
      meteors.push({
        x: Math.random() * W * 0.9,
        y: Math.random() * H * 0.45,
        vx: 5.5 + Math.random() * 6,
        vy: 3 + Math.random() * 3.4,
        life: 0.82,
      });
    }
  }
  let meteorTimer = 30; // 开场约 1.5 秒后出现第一颗
  const meteorInterval = 700; // 流星收尾与下一颗之间的间隔基准

  let t = 0;
  function draw() {
    t += 1;
    ctx.clearRect(0, 0, W, H);

    // 星云光晕
    for (const o of orbs) {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r;
      if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r;
      if (o.y > H + o.r) o.y = -o.r;
      const pulse = 0.75 + 0.25 * Math.sin(t * 0.008 + o.x * 0.01);
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, 'rgba(' + o.rgb + ',' + (o.a * pulse).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + o.rgb + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
    }

    // 星辰闪烁
    for (const s of stars) {
      const a = s.base * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase));
      if (a <= 0.02) continue;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + s.rgb + ',' + a.toFixed(3) + ')';
      ctx.fill();
      if (s.big) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        g.addColorStop(0, 'rgba(' + s.rgb + ',' + (a * 0.22).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + s.rgb + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(s.x - s.r * 5, s.y - s.r * 5, s.r * 10, s.r * 10);
      }
    }

    // 流星
    if (!meteors.length && t > meteorTimer) spawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.009;
      if (m.life <= 0) {
        meteors.splice(i, 1);
        if (!meteors.length) meteorTimer = t + meteorInterval + Math.random() * 2500;
        continue;
      }
      const tail = 26;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
      grad.addColorStop(0, 'rgba(227, 196, 124, ' + (0.95 * m.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(227, 196, 124, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
      ctx.stroke();
      // 流星头光晕（更亮更大）
      const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 9);
      hg.addColorStop(0, 'rgba(244, 239, 230, ' + (0.75 * m.life).toFixed(3) + ')');
      hg.addColorStop(1, 'rgba(244, 239, 230, 0)');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

/* ---------- 导航 v2：桌面 logo+品牌+「☰ 功能」｜主导航均分｜手机左侧功能抽屉 ---------- */
(function initNav() {
  const nav = $('nav');
  if (!nav) return;
  const inner = nav.querySelector('.nav-inner') || nav;
  const brand = nav.querySelector('.nav-brand');
  const logo = nav.querySelector('.nav-logo');
  const navLinks = $('navLinks');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // 1) 确保存在「☰ 功能」按钮（老页面由 JS 补建；index.html 已内置）
  let fnBtn = $('navFnBtn');
  if (!fnBtn) {
    fnBtn = document.createElement('button');
    fnBtn.type = 'button';
    fnBtn.id = 'navFnBtn';
    fnBtn.className = 'nav-fn';
    fnBtn.setAttribute('aria-label', '打开全部功能');
    fnBtn.setAttribute('aria-expanded', 'false');
    fnBtn.innerHTML = '<span class="fn-ico" aria-hidden="true">☰</span><span class="fn-txt">功能</span>';
    if (brand && brand.nextSibling) inner.insertBefore(fnBtn, brand.nextSibling);
    else inner.insertBefore(fnBtn, inner.firstChild);
  }
  // 旧版下拉菜单按钮已由新结构取代
  const legacyMenu = $('menuBtn');
  if (legacyMenu) legacyMenu.style.display = 'none';
  if (navLinks) Array.prototype.forEach.call(navLinks.querySelectorAll('a'), (a) => a.classList.remove('open'));

  // 2) 全部功能面板：桌面居中 / 手机 <960px 从左侧滑入的抽屉（CSS .fn-*）
  const path = (location.pathname || '').split('/').pop();
  const onHome = (path === '' || path === 'index.html');
  const pageHref = (hash) => onHome ? hash : ('index.html' + hash);
  const loggedIn = () => !!localStorage.getItem('yg_account');

  const GROUPS = [
    { t: '功能', items: [
      ['index.html', '首页', '光之始'],
      ['collections.html', '系列', '四大产品线'],
      ['studio.html', '定制工坊', '生肖 / 星座 / 合盘'],
      ['gallery.html', '光集', '她们与光的时刻'],
      ['atlas.html', '星图志', '生肖·八卦·星座'],
      ['knowledge.html', '学堂', '晶石 · 养石 · 文化'],
      [pageHref('#playSec'), '互动', '拈签 · 答案之书']
    ] },
    { t: '探索', items: [
      ['story.html', '品牌故事', '予光为何而来'],
      ['intro.html', '认识予光', '理念与体系'],
      ['faq.html', '常见问题', '定制·物流·售后']
    ] },
    { t: '服务', items: [
      ['studio.html', '开始定制', '立即生成设计卡'],
      ['verify.html', '作品验真', '防伪查询'],
      ['account.html#orders', '我的订单', '登录后查看进度', 'member'],
      ['account.html#inbox', '信箱', '站内来信 · 仅登录', 'member'],
      [pageHref('#contact'), '联系客服', '微信扫码 · 定制答疑'],
      ['account.html', '会员中心', '账号与资料']
    ] }
  ];

  if (!document.getElementById('fnMask')) {
    const mask = document.createElement('div');
    mask.className = 'fn-mask';
    mask.id = 'fnMask';
    mask.setAttribute('aria-hidden', 'true');
    let html = '<aside class="fn-panel" role="dialog" aria-label="予光 · 全部功能"><div class="fn-head"><h3>予光 · 全部功能</h3><button class="fn-x" type="button" aria-label="关闭">✕</button></div><div class="fn-body">';
    GROUPS.forEach((g) => {
      const items = g.items.filter((it) => !(it[3] === 'member') || loggedIn());
      if (!items.length) return;
      html += '<div class="fn-group"><h4>' + g.t + '</h4>';
      items.forEach((it) => {
        html += '<a class="fn-item" href="' + it[0] + '"><b>' + it[1] + '</b><small>' + (it[2] || '') + '</small></a>';
      });
      html += '</div>';
    });
    html += '</div><div class="fn-note">予光 · 黑暗中总有光伴你前行 ✦ 更多服务请在登录后查看</div></aside>';
    mask.innerHTML = html;
    document.body.appendChild(mask);
  }

  const mask = document.getElementById('fnMask');
  const openFn = () => {
    mask.classList.add('show');
    mask.setAttribute('aria-hidden', 'false');
    fnBtn.setAttribute('aria-expanded', 'true');
  };
  const closeFn = () => {
    mask.classList.remove('show');
    mask.setAttribute('aria-hidden', 'true');
    fnBtn.setAttribute('aria-expanded', 'false');
  };
  const toggleFn = () => { mask.classList.contains('show') ? closeFn() : openFn(); };

  fnBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleFn(); });
  // logo / 品牌点击保留旧 logo-menu 语义：唤出全部功能
  [logo, brand].forEach((el) => {
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleFn(); });
  });
  const xBtn = mask.querySelector('.fn-x');
  if (xBtn) xBtn.addEventListener('click', closeFn);
  mask.addEventListener('click', (e) => { if (e.target === mask) closeFn(); });
  mask.querySelectorAll('.fn-item').forEach((a) => a.addEventListener('click', closeFn));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFn(); });
  // 登录态变化（如用户区刷新）后关闭面板，避免过期条目
  window.addEventListener('yg:login', closeFn);
})();

/* ---------- 滚动渐亮（同组卡片错落延迟） ---------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => {
    if (el.classList.contains('visible')) return;
    // 同组（同一父容器）内的 .reveal 按顺序错落渐显
    const p = el.parentElement;
    if (p && !el.style.transitionDelay) {
      const sibs = Array.prototype.filter.call(p.children, (c) => c.classList && c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
    }
    io.observe(el);
  });
})();

/* ---------- 通用选项卡（产品页等） ---------- */
(function initMiniTabs() {
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const btns = group.querySelectorAll('.tab-mini');
    const panels = group.querySelectorAll('.tab-panel');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach((p) => p.classList.toggle('active', p.id === btn.dataset.target));
      });
    });
  });
})();

/* ---------- 定制工坊 ---------- */
(function initStudio() {
  const root = $('studio');
  if (!root) return;

  /* ---------- 定制数据 ---------- */
  // 六十四卦 · 常用 16 卦：[卦名, 卦符(Unicode), 下卦五行→配石意象, 一句意象]
  var HEXES = [
    ['乾为天', '䷀', '金', '天行健，自强不息，向着开阔处去'],
    ['坤为地', '䷁', '土', '厚德载物，稳稳托住你的一切'],
    ['水雷屯', '䷂', '木', '万事起头难，缓一缓，光会先落在第一步'],
    ['山水蒙', '䷃', '水', '心若蒙尘，诚心一问，雾自开'],
    ['水天需', '䷄', '金', '云上于天，静候其雨，时候未到也是一种答案'],
    ['天水讼', '䷅', '水', '慎争止讼，把力气留给更重要的事'],
    ['地水师', '䷆', '水', '众行有律，你已在正确的队列里'],
    ['水地比', '䷇', '土', '亲比相依，择善而从，靠近温暖的人'],
    ['风天小畜', '䷈', '金', '小有积蓄，慢慢来，风会把云吹向你'],
    ['天泽履', '䷉', '金', '如履薄冰，谨慎而清醒，路会越走越稳'],
    ['地天泰', '䷊', '金', '天地交泰，否极泰来，好天气正在路上'],
    ['天地否', '䷋', '土', '闭塞有时，守住本心，自有通的一日'],
    ['天火同人', '䷌', '火', '同心同德，与懂你的人结伴而行'],
    ['火天大有', '䷍', '金', '日丽中天，你的光正当其时'],
    ['地山谦', '䷎', '土', '谦谦君子，卑以自牧，光敛而不弱'],
    ['雷地豫', '䷏', '土', '雷出地奋，和乐而作，该醒的花都醒了']
  ];
  // 十二时辰：[名, 时段, 意象一句]
  var HOURS = [
    ['子', '23:00–01:00', '夜深人定，光藏在你心里，最懂得安眠'],
    ['丑', '01:00–03:00', '万籁俱寂时仍醒着的人，光都替你记着'],
    ['寅', '03:00–05:00', '破晓之前，你替夜先亮了一刻'],
    ['卯', '05:00–07:00', '晨光初透，你与日子一同醒来'],
    ['辰', '07:00–09:00', '万物生长，你的光落在从容的日常'],
    ['巳', '09:00–11:00', '日头渐暖，你自有你的节奏'],
    ['午', '11:00–13:00', '日正中天，光正盛，你也正盛'],
    ['未', '13:00–15:00', '午后柔和，光陪你慢慢来'],
    ['申', '15:00–17:00', '云卷云舒，光依然在你肩上'],
    ['酉', '17:00–19:00', '落日熔金，把一天的疲惫交还给晚风'],
    ['戌', '19:00–21:00', '灯初上，你开始发自己的光'],
    ['亥', '21:00–23:00', '人静下来，光会自己浮出水面']
  ];

  /* ---------- 填充下拉 ---------- */
  fillSelect($('eastZodiac'), Object.keys(ZODIAC).map((k) => [k, k + ' · ' + ZODIAC[k].el + '行']));
  var guaOpts = [['', '暂不选卦 · 随本命五行来配']];
  HEXES.forEach(function (h, i) { guaOpts.push([String(i + 1), h[1] + ' ' + h[0] + ' · ' + h[3]]); });
  fillSelect($('eastGua'), guaOpts);
  var hourOpts = [['', '不确定 · 时辰记不起来了']];
  HOURS.forEach(function (h) { hourOpts.push([h[0], h[0] + '时（' + h[1] + '）']); });
  fillSelect($('eastHour'), hourOpts);
  fillSelect($('westSun'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));
  var moonOpts = [['', '暂不确定（可选）']];
  Object.keys(MOON).forEach(function (k) { moonOpts.push([k, k]); });
  fillSelect($('westMoon'), moonOpts);
  var risNotes = { '轻盈细链': '风一样地来', '精致锁骨链': '得体而坚定', '粗犷麻绳链': '不问也知有力量', '波浪蛇骨链': '温柔藏有暗涌' };
  var risOpts = [['', '暂不确定（可选）']];
  Object.keys(risNotes).forEach(function (r) { risOpts.push([r, r + ' · ' + risNotes[r]]); });
  fillSelect($('westRising'), risOpts);
  fillSelect($('unionA'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));
  fillSelect($('unionB'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));

  if ($('eastZodiac')) $('eastZodiac').value = '巳蛇';
  if ($('eastHour')) $('eastHour').value = '午';   // 默认午时
  if ($('westSun')) $('westSun').value = '天蝎';
  if ($('unionA')) $('unionA').value = '天蝎';
  if ($('unionB')) $('unionB').value = '双鱼';

  /* ---------- 谱系切换（保留 #east/#west/#union 锚点直达） ---------- */
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      var pnl = $('panel-' + btn.dataset.panel);
      if (pnl) pnl.classList.add('active');
      if (location.hash.slice(1) === btn.dataset.panel) {
        setTimeout(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });
  });
  var hashPanel = { east: 'east', west: 'west', union: 'union' }[location.hash.slice(1)];
  if (hashPanel) {
    var hb = document.querySelector('.tab-btn[data-panel="' + hashPanel + '"]');
    if (hb) hb.click();
  }

  /* ---------- 东方：生辰 / 摇卦 子方式切换 ---------- */
  var subBtns = document.querySelectorAll('#eastSubTabs .sub-btn');
  function setEastSub(name) {
    subBtns.forEach((b) => {
      var on = b.getAttribute('data-sub') === name;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if ($('subBirth')) $('subBirth').hidden = (name !== 'birth');
    if ($('subShake')) $('subShake').hidden = (name !== 'shake');
  }
  subBtns.forEach((b) => {
    b.addEventListener('click', function () { setEastSub(b.getAttribute('data-sub')); });
  });

  /* ---------- 出生年份 → 生肖自动推演 ---------- */
  var yearEl = $('eastYear');
  var zodEl = $('eastZodiac');
  var ZO_LIST = Object.keys(ZODIAC); // 子鼠…亥猪
  function zodiacOfYear(y) {
    if (y < 100) y = (y <= new Date().getFullYear() % 100) ? 2000 + y : 1900 + y;
    return ZO_LIST[(((y - 4) % 12) + 12) % 12];
  }
  function updateZodiacHint(extra) {
    var info = zodEl ? ZODIAC[zodEl.value] : null;
    var el2 = $('eastElement');
    if (!info || !el2) return;
    el2.textContent = '本命五行：' + info.el + ' · 主石建议：' +
      ELEMENT_STONES[info.el].map((s) => s[0]).join(' / ') + (extra || '');
  }
  function yearToZodiac() {
    if (!yearEl || !zodEl) return;
    var raw = String(yearEl.value || '').trim();
    if (!raw) { updateZodiacHint(); return; }
    var y = parseInt(raw, 10);
    if (!isFinite(y) || y < 1900 || y > new Date().getFullYear()) {
      if ($('eastElement')) $('eastElement').textContent = '请填写 1900 年后的出生年份（例如 1990）';
      return;
    }
    zodEl.value = zodiacOfYear(y);
    updateZodiacHint('（按 ' + y + ' 年自动推演）');
  }
  if (yearEl) yearEl.addEventListener('input', yearToZodiac);
  if (zodEl) zodEl.addEventListener('change', updateZodiacHint);
  updateZodiacHint();   // 初始展示本命五行与主石建议

  /* ---------- 结果卡与珠串画布 ---------- */
  var genBusy = false;
  var shakeTimer = null;
  var lastHexName = '';
  var curHex = null;                 // 当前结果卦（无卦=null）
  var lastDesign = null;            // 最近一次设计卡 cfg
  var flatMode = false;
  function st(txt, isErr) {
    var g = $('genStatus');
    if (g) { g.textContent = txt || ''; g.classList.toggle('err', !!isErr); }
  }
  function syncOrderItem() {
    var inp = $('orderItems');
    if (!inp) return;
    try {
      inp.value = JSON.stringify([{
        name: $('pName').textContent, sub: $('pSub').textContent,
        main: $('rMain').textContent, aux: $('rAux').textContent,
        metal: $('rMetal').textContent, chain: $('rChain').textContent,
        quote: $('pLight').textContent
      }]);
    } catch (e) {}
  }
  function shade(hex, k) {
    var c = String(hex || '#e3c47c');
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (!m) return c;
    var s = m[1];
    if (s.length === 3) s = s.replace(/./g, function (x) { return x + x; });
    var out = '#';
    for (var i = 0; i < 3; i++) {
      var v = Math.max(0, Math.min(255, Math.round(parseInt(s.substr(i * 2, 2), 16) * k)));
      out += (v < 16 ? '0' : '') + v.toString(16);
    }
    return out;
  }
  function drawBracelet(beads, flat) {
    var cv = $('braceletCanvas');
    if (!cv || !beads || !beads.length) return;
    var w = 520, h = 176;
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    var L = 36, R = w - 36;        // 串线两端（含扣点）
    var midY = 104;                // 弧线基准：中段略垂、两端上扬，呈手链自然弧度
    function arcY(x) {
      if (flat) return midY;
      var t = (x - L) / (R - L);
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      return midY + Math.sin(t * Math.PI) * 13;
    }
    // 穿珠金线：虚线微光
    ctx.strokeStyle = 'rgba(227, 196, 124, 0.34)';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([2, 7]);
    ctx.beginPath();
    ctx.moveTo(L, arcY(L));
    ctx.quadraticCurveTo((L + R) / 2, midY + 18, R, arcY(R));
    ctx.stroke();
    ctx.setLineDash([]);
    // 两端扣点
    ctx.fillStyle = 'rgba(227, 196, 124, 0.85)';
    [[L, arcY(L)], [R, arcY(R)]].forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    var n = beads.length;
    var step = (n > 1) ? (R - L) / (n - 1) : 0;
    for (var i = 0; i < n; i++) {
      var bd = beads[i];
      var bx = L + i * step;
      var by = arcY(bx);
      var r = Math.max(3.2, bd.mm * 1.35);
      var isMain = bd.mm >= 10;   // 主石大珠：品牌金描边 + 柔和光晕
      if (isMain) {
        var gg = ctx.createRadialGradient(bx, by, r * 0.3, bx, by, r * 2.5);
        gg.addColorStop(0, 'rgba(227, 196, 124, 0.3)');
        gg.addColorStop(1, 'rgba(227, 196, 124, 0)');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(bx, by, r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      var grad = ctx.createRadialGradient(bx - r * 0.38, by - r * 0.42, r * 0.12, bx, by, r);
      grad.addColorStop(0, shade(bd.color, 1.45));
      grad.addColorStop(0.6, bd.color);
      grad.addColorStop(1, shade(bd.color, 0.5));
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = isMain ? 'rgba(227, 196, 124, 0.95)' : 'rgba(244, 239, 230, 0.5)';
      ctx.lineWidth = isMain ? 2 : 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx - r * 0.38, by - r * 0.44, r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();
    }
  }
  function setLegend(items) {
    var box = $('bLegend');
    if (!box) return;
    if (!items || !items.length) { box.innerHTML = ''; return; }
    box.innerHTML = items.map(function (it) {
      return '<span class="lg-item"><i class="lg-dot" style="background:' + it.color + '"></i><b>' +
        it.role + '</b>' + it.name + '<em>' + it.mm + 'mm</em></span>';
    }).join('');
  }
  function showDesign(cfg) {
    cfg = cfg || {};
    lastDesign = cfg;
    flatMode = false;
    var hx = $('genHex'); if (hx) hx.style.display = curHex ? 'inline-flex' : 'none';
    var hb = $('genHexBox'); if (hb) { hb.style.display = 'none'; hb.innerHTML = ''; }
    var hf = $('genFlat'); if (hf) hf.textContent = '📿 整串平视图';
    if ($('pName')) $('pName').textContent = cfg.name || '予光 · 定制';
    if ($('pSub')) $('pSub').textContent = cfg.sub || '';
    if ($('rMain')) $('rMain').textContent = cfg.mainText || '';
    if ($('rAux')) $('rAux').textContent = cfg.auxText || '';
    if ($('rMetal')) $('rMetal').textContent = cfg.metal || '—';
    if ($('rChain')) $('rChain').textContent = cfg.chain || '';
    if ($('rGlyph')) $('rGlyph').textContent = cfg.glyph || '';
    if ($('pLight')) $('pLight').textContent = cfg.quote || '';
    drawBracelet(cfg.beads || []);
    setLegend(cfg.legend || []);
    syncOrderItem();
  }
  function caps() {
    return [
      { color: '#e3c47c', mm: 3 },
      { color: '#e3c47c', mm: 3 }
    ];
  }

  /* ---------- 生成逻辑（纯本地规则，界面不依赖远程） ---------- */
  function runBirth() {
    var yRaw = yearEl ? String(yearEl.value || '').trim() : '';
    if (yRaw && !/^(19|20)\d{2}$/.test(yRaw)) { st('出生年份请填四位数字，例如 1990 ✦', true); return; }
    if (yRaw) yearToZodiac();
    var z = zodEl ? zodEl.value : '';
    var info = ZODIAC[z];
    if (!info) { st('请先选一个生肖 ✦', true); return; }
    var list = ELEMENT_STONES[info.el];
    var main = list[0];
    var hourVal = $('eastHour') ? $('eastHour').value : '午';
    var hour = hourVal ? HOURS.filter((h) => h[0] === hourVal)[0] : null;
    var guaIdx = Number($('eastGua') ? $('eastGua').value : '') - 1;
    var gua = (guaIdx >= 0 && HEXES[guaIdx]) ? HEXES[guaIdx] : null;
    var aux = list[1];
    if (gua) {
      var auxList = ELEMENT_STONES[gua[2]];
      if (auxList && auxList[0]) aux = auxList[0];
    }
    curHex = gua;
    var parts = [info.quote];
    if (hour) parts.push(hour[2]);
    if (gua) parts.push('卦象「' + gua[0] + '」：' + gua[3]);
    showDesign({
      name: gua ? (z + ' · ' + gua[0]) : (z + ' · 生辰'),
      sub: 'EAST · 生辰定制' + (gua ? ' · ' + gua[1] : ''),
      mainText: main[0] + '（本命' + info.el + ' · 主石 10mm）',
      auxText: aux[0] + '（' + (gua ? '随卦' + gua[2] + '系意象 · ' : info.el + '色系辅光 · ') + '配石 8mm）',
      metal: $('metalEast') ? $('metalEast').value : '',
      chain: gua ? (gua[0] + ' · 手作') : '生肖暗刻 · 手作',
      glyph: gua ? (gua[1] + ' ' + gua[0]) : (hour ? hour[0] + '时' : '生辰'),
      quote: parts.join('　'),
      beads: caps().concat([{ color: aux[1], mm: 8 }, { color: main[1], mm: 10 }, { color: aux[1], mm: 8 }], caps()),
      legend: [
        { role: '主石', name: main[0], color: main[1], mm: 10 },
        { role: '配石', name: aux[0], color: aux[1], mm: 8 }
      ]
    });
    st('生辰设计已生成 ✦ 下方按钮可带上光语一起提交');
  }

  function runShake(forceNew) {
    if (genBusy) return;
    var info = ZODIAC[zodEl ? zodEl.value : '巳蛇'];
    if (!info) { st('请先在上方选一个生肖 ✦', true); return; }
    var btn = $('shakeGen');
    var view = $('shakeView');
    genBusy = true;
    if (btn) btn.disabled = true;
    st('');
    if (view) {
      view.classList.add('shaking');
      view.innerHTML = '卦象流转中…';
    }
    var cycles = 13 + Math.floor(Math.random() * 4);   // 约 0.72–0.88s 洗卦动画（55ms/轮）
    var rounds = 0;
    shakeTimer = setInterval(function () {
      rounds++;
      var pre = HEXES[Math.floor(Math.random() * HEXES.length)];
      if (view) view.innerHTML = pre[1] + '　' + pre[0];
      if (rounds >= cycles) {
        clearInterval(shakeTimer);
        shakeTimer = null;
        var pick = HEXES[Math.floor(Math.random() * HEXES.length)];
        // 「再试一次」摇卦会换一卦
        if (forceNew && pick[0] === lastHexName && HEXES.length > 1) {
          var idx = HEXES.indexOf(pick);
          pick = HEXES[(idx + 1) % HEXES.length];
        }
        finishShake(pick, info);
      }
    }, 55);
  }
  function finishShake(hex, info) {
    lastHexName = hex[0];
    curHex = hex;
    var list = ELEMENT_STONES[info.el];
    var main = list[0];
    var auxList = ELEMENT_STONES[hex[2]] || list;
    var aux = auxList[0];
    var view = $('shakeView');
    genBusy = false;
    if ($('shakeGen')) { $('shakeGen').disabled = false; $('shakeGen').textContent = '再摇一卦 ✦'; }
    if (view) { view.classList.remove('shaking'); view.innerHTML = hex[1] + '　' + hex[0]; }
    showDesign({
      name: info.el + '行 · ' + hex[0],
      sub: 'EAST · 摇卦定制 · 得 ' + hex[1],
      mainText: main[0] + '（本命' + info.el + ' · 主石 10mm）',
      auxText: aux[0] + '（随「' + hex[0] + '」' + hex[2] + '系意象 · 配石 8mm）',
      metal: $('metalEast') ? $('metalEast').value : '',
      chain: hex[0] + ' · 手作',
      glyph: hex[1] + ' ' + hex[0],
      quote: '卦象「' + hex[0] + '」：' + hex[3] + '　' + info.quote,
      beads: caps().concat([{ color: aux[1], mm: 8 }, { color: main[1], mm: 10 }, { color: aux[1], mm: 8 }], caps()),
      legend: [
        { role: '主石', name: main[0], color: main[1], mm: 10 },
        { role: '配石', name: aux[0], color: aux[1], mm: 8 }
      ]
    });
    st('摇卦完成 ✦ 得「' + hex[0] + '」。可再摇，也可带着卦象与光语提交');
  }

  function runWest() {
    curHex = null;
    var sun = $('westSun') ? $('westSun').value : '';
    if (!sun) { st('请先选一个太阳星座 ✦', true); return; }
    var s = SUN[sun];
    var moonKey = $('westMoon') ? $('westMoon').value : '';
    var moon = (moonKey && MOON[moonKey]) ? MOON[moonKey] : null;
    var auxN = moon ? moon[0] : '月光石';
    var auxC = moon ? moon[1] : '#CFD4E0';
    var risRaw = $('westRising') ? $('westRising').value : '';
    var chainTxt = risRaw || '轻盈细链';
    var name = sun + (moonKey ? ' · ' + moonKey.slice(0, 2) : ' · 月光');
    var quote = s.quote + (moon ? '' : '　月光石替你把说不出的情绪，温柔地接住。');
    showDesign({
      name: name,
      sub: 'WEST · 星座定制 · ' + GLYPH[sun],
      mainText: s.stone[0] + '（太阳 · 本我 · 主石 10mm）',
      auxText: auxN + '（月亮情绪意象 · 配石 8mm）',
      metal: $('metalWest') ? $('metalWest').value : '',
      chain: chainTxt + (risRaw ? ' · 上升意象' : ''),
      glyph: GLYPH[sun] + (moonKey ? ' ☽' : ''),
      quote: quote,
      beads: caps().concat([{ color: auxC, mm: 8 }, { color: s.stone[1], mm: 10 }, { color: auxC, mm: 8 }], caps()),
      legend: [
        { role: '主石', name: s.stone[0], color: s.stone[1], mm: 10 },
        { role: '配石', name: auxN, color: auxC, mm: 8 }
      ]
    });
    st('星座设计已生成 ✦ 下方按钮可带上光语一起提交');
  }

  function runUnion() {
    var aKey = $('unionA') ? $('unionA').value : '';
    var bKey = $('unionB') ? $('unionB').value : '';
    if (!aKey || !bKey) { st('请把两个人的星座都选上 ✦', true); return; }
    var a = SUN[aKey], b = SUN[bKey];
    var clasp = String($('unionClasp') ? $('unionClasp').value : '日月扣').split(' · ')[0];
    showDesign({
      name: '双生 · ' + aKey + ' × ' + bKey,
      sub: 'UNION · 合盘定制 · ' + clasp,
      mainText: a.stone[0] + '（我的光 · 主石 10mm）',
      auxText: b.stone[0] + '（你的光 · 主石 10mm）',
      metal: $('metalUnion') ? $('metalUnion').value : '',
      chain: '互扣 · ' + clasp,
      glyph: GLYPH[aKey] + ' + ' + GLYPH[bKey],
      quote: a.quote + '　' + b.quote + '　两个人的光，合起来是一轮满月。各自佩戴时，你们都是完整的自己。',
      beads: caps().concat([{ color: a.stone[1], mm: 10 }, { color: b.stone[1], mm: 10 }], caps()),
      legend: [
        { role: '主石一', name: a.stone[0], color: a.stone[1], mm: 10 },
        { role: '主石二', name: b.stone[0], color: b.stone[1], mm: 10 }
      ]
    });
    st('双珠设计已生成 ✦ 下方按钮可带上光语一起提交');
  }

  function retryLast() {
    if (genBusy) return;
    var act = document.querySelector('.tab-btn.active');
    var p = act ? act.dataset.panel : 'east';
    if (p === 'east') {
      if ($('subShake') && !$('subShake').hidden) runShake(true);
      else runBirth();
    } else if (p === 'west') runWest();
    else runUnion();
  }

  /* ---------- 一键把小光建议 / 光语随定制意向一起提交 ---------- */
  var submitting = false;
  function submitGen() {
    if (submitting) return;
    var form = root.querySelector('.sb-form[data-table="orders"]');
    if (!form) { st('没有找到提交表单 ✦', true); return; }
    var phone = form.querySelector('[name="phone"]');
    var note = form.querySelector('[name="note"]');
    var acct = window.ygAccount ? window.ygAccount() : '';
    if (!window.sb) {
      st('离线版无法在线提交，可把右侧设计卡截图发给客服微信 ✦');
      return;
    }
    if ((!phone || !phone.value.trim()) && !acct) {
      st('请在上方订单区填好微信号 / 手机号，再点一次就能带上光语提交 ✦');
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (phone) setTimeout(function () { phone.focus(); }, 320);
      return;
    }
    var light = $('pLight') ? $('pLight').textContent : '';
    var cur = note ? (note.value || '') : '';
    var keep = cur.split('\n').filter(function (l) {
      return l.indexOf('光语：') !== 0 && l.indexOf('小光建议：') !== 0 && l.indexOf('依据：') !== 0;
    }).join('\n');
    var add = light ? ('光语：' + light) : '';
    // 生成依据：取自右侧设计卡（作品名 / 谱系 / 主石配石 / 链饰），随订单备注一起交给客服
    var basis = [
      $('pName') ? $('pName').textContent : '',
      $('pSub') ? $('pSub').textContent : '',
      $('rMain') ? $('rMain').textContent : '',
      ($('rAux') && $('rAux').textContent !== '—') ? $('rAux').textContent : '',
      ($('rChain') && $('rChain').textContent !== '—') ? $('rChain').textContent : ''
    ].filter(Boolean).join(' · ');
    if (basis) add = add ? (add + '\n依据：' + basis) : ('依据：' + basis);
    var relNote = $('unionNote') ? String($('unionNote').value).trim() : '';
    if (relNote) add = add ? (add + '\n关系备注：' + relNote) : ('关系备注：' + relNote);
    if (note) note.value = add ? (keep ? (add + '\n' + keep) : add) : keep;
    submitting = true;
    try {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      st('已收到 ✦ 客服将与你二次确认。');
    } catch (e) { /* 由表单内部状态提示 */ }
    setTimeout(function () { submitting = false; }, 2600);
  }

  /* ---------- 事件绑定 ---------- */
  var genBtns = { eastGen: runBirth, westGen: runWest, unionGen: runUnion };
  Object.keys(genBtns).forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('click', genBtns[id]);
  });
  if ($('shakeGen')) $('shakeGen').addEventListener('click', function () { runShake(false); });
  if ($('genRetry')) $('genRetry').addEventListener('click', retryLast);
  if ($('genSubmit')) $('genSubmit').addEventListener('click', submitGen);
  if ($('genHex')) $('genHex').addEventListener('click', function () {
    var box = $('genHexBox'); if (!box || !curHex) return;
    if (box.style.display === 'block') { box.style.display = 'none'; return; }
    var h = curHex;
    var html = '<div class="gen-hex-inner"><div class="ghex-title">' + h[1] + '　' + h[0] + '</div>' +
      '<p>' + (h[3] || '一卦意象') + '</p>' +
      '<p>卦属「' + (h[2] || '—') + '」的意象：做设计时以此为引，主石取本命五行、配石取卦的用色方向，串成一枚随身的光。</p>' +
      '<p class="ghex-dim">✦ 卦象与解读均来自传统文化意象，属文化的表达与陪伴，不构成任何断言。</p></div>';
    box.innerHTML = html;
    box.style.display = 'block';
  });
  if ($('genFlat')) $('genFlat').addEventListener('click', function () {
    flatMode = !flatMode;
    var b = $('genFlat'); if (b) b.textContent = flatMode ? '📿 回到弧面' : '📿 整串平视图';
    if (lastDesign) drawBracelet(lastDesign.beads || [], flatMode);
  });

  // 模式卡 → 对应表单（选择你想要的定制方式）
  root.querySelectorAll('.mode-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.id === 'modeXg') {
        var xb = $('xgBox');
        if (xb) xb.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if ($('xgNeed')) setTimeout(function () { $('xgNeed').focus(); }, 340);
        return;
      }
      var go = card.getAttribute('data-go');
      var tb = document.querySelector('.tab-btn[data-panel="' + go + '"]');
      if (tb && !tb.classList.contains('active')) tb.click();
      if (go === 'east' && card.getAttribute('data-sub')) setEastSub(card.getAttribute('data-sub'));
      var pnl = $('panel-' + go);
      if (pnl) pnl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 打开页面生成一张与当前谱系对应的示例设计卡（默认东方 · 生辰 · 巳蛇 · 午时）
  if (!hashPanel || hashPanel === 'east') runBirth();
  else if (hashPanel === 'west') runWest();
  else runUnion();

  /* ================= 小光定制：让 小光 帮你挑 ================= */
  (function xgHelp() {
    const btn = $('xgBtn');
    const inp = $('xgNeed');
    const res = $('xgRes');
    if (!btn || !res) return;

    let sugKeep = ''; // 最近一次的小光建议：提交定制意向时附到备注开头（不改原提交流程）

    function escXg(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // 把当前谱系 + 用户补充拼成一句中文需求
    function buildNeed() {
      const act = document.querySelector('.tab-btn.active');
      const p = (act && act.dataset.panel) || 'east';
      const parts = [];
      if (p === 'east') {
        const z = $('eastZodiac') ? $('eastZodiac').value : '';
        if (z) {
          const info = ZODIAC[z];
          parts.push('东方 · 生肖 ' + z + (info ? '（本命' + info.el + '行）' : ''));
        }
        const gv = $('eastGua') ? $('eastGua').value : '';
        const gi = Number(gv);
        if (gi > 0 && HEXES[gi - 1]) {
          const h = HEXES[gi - 1];
          parts.push('心念卦象「' + h[0] + ' ' + h[1] + '」——' + h[3]);
        }
      } else if (p === 'west') {
        const sun = $('westSun') ? $('westSun').value : '';
        const moon = $('westMoon') ? $('westMoon').value : '';
        const ris = $('westRising') ? String($('westRising').value).split(' · ')[0] : '';
        if (sun) parts.push('西方 · 太阳星座 ' + sun + '（本我主石）');
        if (moon) parts.push('月亮情绪质地 ' + moon);
        if (ris) parts.push('上升给人的印象是 ' + ris);
      } else {
        const a = $('unionA') ? $('unionA').value : '';
        const b = $('unionB') ? $('unionB').value : '';
        if (a || b) parts.push('合盘双生 · 我是' + (a || '？') + '座，对方是' + (b || '？') + '座');
      }
      let need = parts.join('；');
      if (!need) need = '还未选好谱系，先按上方任意一套来选';
      const extra = inp ? String(inp.value).trim() : '';
      if (extra) need += '。另外我想说：' + extra;
      need += '。请为我挑一枚主石与一枚配石，并配一句光语。';
      return need;
    }

    function showFail() {
      res.hidden = false;
      res.className = 'xg-res fail';
      res.textContent = '小光走神了 ✦ 稍后再试，或直接告诉我们你的想法';
    }

    function askXg() {
      if (!window.sbAI) { showFail(); return; }
      btn.disabled = true;
      btn.textContent = '小光正在看…';
      res.hidden = false;
      res.className = 'xg-res busy';
      res.textContent = '小光正在星图与晶石间为你挑拣 ✦';
      window.sbAI({ mode: 'stones', need: buildNeed() })
        .then(function (r) {
          if (r && r.ok) {
            sugKeep = String(r.answer || '').trim();
            res.className = 'xg-res';
            res.innerHTML = '<div class="xg-card">' +
              '<div class="xg-say">' + escXg(sugKeep) + '</div>' +
              '<p class="xg-caveat">✦ 以上是文化意象与陪伴的表达，最终设计以我们与你二次确认的为准。</p>' +
            '</div>';
          } else showFail();
        })
        .catch(showFail)
        .then(function () {
          btn.disabled = false;
          btn.textContent = '让 小光 来看看';
        });
    }

    btn.addEventListener('click', askXg);
    if (inp) inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askXg(); } });

    // 提交定制意向时，把小光建议附到备注开头（仅展示，不改原提交流程）
    const ordForm = root.querySelector('.sb-form[data-table="orders"]');
    if (ordForm) {
      ordForm.addEventListener('submit', function () {
        if (!sugKeep) return;
        const nt = ordForm.querySelector('[name="note"]');
        if (!nt) return;
        const cur = (nt.value || '').trim();
        if (cur.indexOf('小光建议：') === 0) return;
        nt.value = cur ? ('小光建议：' + sugKeep + '\n' + cur) : ('小光建议：' + sugKeep);
      });
    }
  })();
})();

/* ---------- 光集渲染（客户作品库） ---------- */
(function initGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;
  var cards = GALLERY_ITEMS.map(function (it, i) {
    return (
      '<figure class="g-card reveal" style="transition-delay:' + (i * 60) + 'ms">' +
        '<div class="g-img">' +
          '<img src="' + it.src + '" alt="' + it.name + '" loading="lazy" onerror="this.style.display=\'none\';">' +
          '<div class="ph">客户图片占位<br>' + it.src + '</div>' +
        '</div>' +
        '<figcaption class="g-cap">' +
          '<div class="g-name">' + it.name + '</div>' +
          '<span class="g-tag">' + it.tag + '</span>' +
          '<p class="g-story">' + it.story + '</p>' +
          '<div class="g-quote">' + it.quote + '</div>' +
        '</figcaption>' +
      '</figure>'
    );
  });
  grid.innerHTML = cards.join('');
})();

/* ---------- 光集：数据库优先（表就绪后自动读取；失败/未配置则保留静态展示） ---------- */
(function initLiveGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid || !window.sb) return;
  window.sb('gallery?select=*&visible=eq.true&approved=eq.true&order=sort.asc')
    .then(function (rows) {
      if (!rows || !rows.length) return;
      grid.innerHTML = rows.map(function (it) {
        var src = (window.sbImg && it.image_url) ? window.sbImg(it.image_url) : '';
        return '<figure class="g-card reveal">' +
          '<div class="g-img">' +
          '<img src="' + src + '" alt="' + (it.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';">' +
          '<div class="ph">客户图片占位<br>' + (it.image_url || '') + '</div>' +
          '</div>' +
          '<figcaption class="g-cap">' +
          '<div class="g-name">' + (it.name || '') + '</div>' +
          (it.tag ? '<span class="g-tag">' + it.tag + '</span>' : '') +
          (it.story ? '<p class="g-story">' + it.story + '</p>' : '') +
          (it.quote ? '<div class="g-quote">' + it.quote + '</div>' : '') +
          '</figcaption></figure>';
      }).join('');
    })
    .catch(function () {});
})();

/* ---------- 星图志：图鉴/百科/养石 ---------- */
(function initAtlas() {
  var east = document.getElementById('atlasEast');
  var gua = document.getElementById('atlasGua');
  var west = document.getElementById('atlasWest');
  var cg = document.getElementById('atlasCrystal');
  var care = document.getElementById('atlasCare');
  var onAtlas = east || gua || west || cg || care;
  if (!onAtlas) return;

  if (east) {
    east.innerHTML = Object.keys(ZODIAC).map(function (k) {
      var z = ZODIAC[k], s = ELEMENT_STONES[z.el][0];
      return '<div class="mini-card"><h4>' + k + '</h4><span class="sym">本命五行 · ' + z.el + '</span><p class="sub">主石建议 · ' + s[0] + '</p><p>' + z.quote + '</p></div>';
    }).join('');
  }
  if (gua) {
    gua.innerHTML = GUAS.map(function (g) {
      return '<div class="mini-card"><h4>' + g[0] + '</h4><span class="sym">' + g[1] + '</span><p>' + g[2] + '</p></div>';
    }).join('');
  }
  if (west) {
    west.innerHTML = Object.keys(SUN).map(function (k) {
      var s = SUN[k];
      return '<div class="mini-card"><h4>' + k + ' ' + GLYPH[k] + '</h4><span class="sym">主石 · ' + s.stone[0] + '</span><p>' + s.quote + '</p></div>';
    }).join('');
  }
  var CRYSTALS_STATIC = [
    { name: '红纹石', kind: '本命火 · 巳蛇等', meaning: '温暖与深情，静焰的化身', color_hex: '#C9575B' },
    { name: '月光石', kind: '月亮 · 情绪', meaning: '情绪的潮汐与柔软', color_hex: '#CFD4E0' },
    { name: '海蓝宝', kind: '水 · 双鱼/水瓶', meaning: '深海般澄澈与理性', color_hex: '#7FB5C9' },
    { name: '紫水晶', kind: '灵感 · 静心', meaning: '静心与灵感的光', color_hex: '#9B7BC9' },
    { name: '虎眼石', kind: '土 · 坚定', meaning: '坚定与笃定', color_hex: '#B0804A' },
    { name: '黑曜石', kind: '守护意象', meaning: '传统文化中的守护，愿平安', color_hex: '#1B1B22' },
  ];
  function drawCrystals(rows) {
    if (!cg) return;
    cg.innerHTML = rows.map(function (c) {
      var col = c.color_hex || '#8FA3D9';
      return '<div class="mini-card" style="border-left:3px solid ' + col + '">' +
        '<h4>' + c.name + '</h4><span class="sym">' + (c.kind || c.element || '') + '</span>' +
        '<p>' + (c.meaning || '') + '</p>' +
        (c.care_tip ? '<p style="margin-top:6px;color:var(--moon);font-size:12px;">养护：' + c.care_tip + '</p>' : '') +
        '</div>';
    }).join('');
  }
  if (window.sb) {
    window.sb('crystals?select=*&visible=eq.true&order=sort.asc')
      .then(function (rows) { drawCrystals((rows && rows.length) ? rows : CRYSTALS_STATIC); })
      .catch(function () { drawCrystals(CRYSTALS_STATIC); });
  } else if (cg) drawCrystals(CRYSTALS_STATIC);

  if (care) {
    var CARE = [
      ['水', '避免暴晒与高温；可用清水冲洗后软布擦干。', '海蓝宝 · 黑曜石'],
      ['木', '忌干燥高温；软布轻拭；避免接触化妆品与香水。', '绿幽灵 · 孔雀石'],
      ['火', '避免长时间暴晒以防褪色；单独收纳防磕碰。', '红纹石 · 石榴石'],
      ['土', '远离酸碱与香水；不佩戴时放入礼盒阴凉处。', '黄水晶 · 蜜蜡'],
      ['金', '轻柔清洁；不与硬物同放；洗澡运动前取下。', '白水晶 · 月光石'],
      ['月亮 / 星盘', '睡前取下；不接触化学品；每月月圆夜静置片刻（文化习俗，量力而行）。', '定制款'],
    ];
    care.innerHTML = '<p style="margin-bottom:18px;color:var(--text-dim);">予光的养石不是「开光」，是日常三件事：清洁 · 收纳 · 佩戴习惯。水晶是矿物，养护是态度。</p>' +
      CARE.map(function (c) {
        return '<div class="mini-card"><h4>' + c[0] + '系</h4><p>' + c[1] + '</p><p class="sub" style="color:var(--star);font-size:12px;">' + c[2] + '</p></div>';
      }).join('');
  }
})();

/* ---------- 互动：拈一签 · 答案之书（转盘已从首页下线；其代码保留于此，无对应元素时自动跳过） ---------- */
(function initPlay() {
  var qianBtn = document.getElementById('qianBtn');
  var qianRes = document.getElementById('qianRes');
  var bookBtn = document.getElementById('bookBtn');
  var bookRes = document.getElementById('bookRes');
  var wheelBtn = document.getElementById('wheelBtn');
  var wheel = document.getElementById('wheel');
  var wheelRes = document.getElementById('wheelRes');
  if (!qianBtn && !bookBtn && !wheel) return;

  // 拈一签：池子 = 生肖光语 + 卦象 + 星座光语
  var QIAN = [];
  Object.keys(ZODIAC).forEach(function (k) { QIAN.push({ t: '生肖 · ' + k, q: ZODIAC[k].quote }); });
  GUAS.forEach(function (g) { QIAN.push({ t: '卦象 · ' + g[0] + ' ' + g[1], q: g[2] }); });
  Object.keys(SUN).forEach(function (k) { QIAN.push({ t: '星座 · ' + k + ' ' + GLYPH[k], q: SUN[k].quote }); });

  if (qianBtn) {
    qianBtn.addEventListener('click', function () {
      var it = QIAN[Math.floor(Math.random() * QIAN.length)];
      qianRes.innerHTML = '<b style="color:var(--gold);font-weight:500;">' + it.t + '</b><br>' + it.q;
    });
  }

  var ANSWERS = [
    '现在不是答案的时刻，是积蓄光的时刻。', '再等等——你等的不是别人，是自己的决定。', '把门留一条缝，光会自己进来。', '是的，但先照顾好今天。', '答案不在远处，在你第一直觉里。', '这一次，听自己的。', '慢一点，并不等于落后。', '去睡一觉，醒来再做决定。', '你担心的事，大概率不会发生。', '值得，但不必急。', '先照亮自己，再谈遇见。', '不是拒绝，只是时候未到。', '相信你已经准备好了。', '那扇窗没有关，是你还没看向它。', '温柔地拒绝，也是一种光。', '向前一步，光会跟上。', '把它当作练习，而不是考试。', '你若先亮，黑夜自会退半步。',
  ];
  if (bookBtn) {
    bookBtn.addEventListener('click', function () {
      bookRes.textContent = '……';
      setTimeout(function () {
        bookRes.textContent = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      }, 700);
    });
  }

  var PRIZES = [
    { t: '光语卡 ¥10', c: '#e3c47c' }, { t: '生肖石 9 折', c: '#8fa3d9' },
    { t: '微光小礼', c: '#c33c2e' }, { t: '满赠礼盒', c: '#6fa87f' },
    { t: '月光石试用', c: '#cfd4e0' }, { t: '再转一次', c: '#b0804a' },
  ];
  if (wheel) {
    var pieces = PRIZES.map(function (p, i) { return p.c + ' ' + (i * 60) + 'deg ' + ((i + 1) * 60) + 'deg'; });
    wheel.style.background = 'conic-gradient(' + pieces.join(',') + ')';
    var rot = 0;
    wheelBtn.addEventListener('click', function () {
      var today = new Date().toDateString();
      var last = localStorage.getItem('yg_wheel_day');
      var idx = Math.floor(Math.random() * PRIZES.length);
      if (last === today) { wheelRes.textContent = '今日已转 ✦ 光也需要休息，明日再来。'; return; }
      localStorage.setItem('yg_wheel_day', today);
      rot += 360 * (5 + Math.floor(Math.random() * 3)) + ((360 - (idx * 60 + 30) - (rot % 360)) % 360);
      wheel.style.transform = 'rotate(' + rot + 'deg)';
      wheelRes.textContent = '转动中……';
      setTimeout(function () { wheelRes.innerHTML = '你抽到了：<b style="color:var(--gold);font-weight:500;">' + PRIZES[idx].t + '</b> ✦ 添加客服微信领取'; }, 4400);
        if (window.sb) { try { window.sb('wheel_spins', { method: 'POST', body: JSON.stringify({ prize: PRIZES[idx].t }) }); } catch (e) {} }
    });
  }
})();

/* ---------- 通用提交表单（咨询/投稿→messages；定制意向→orders，客服确认制） ---------- */
(function initForms() {
  document.querySelectorAll('.sb-form').forEach(function (f) {
    var status = f.querySelector('.form-status');
    var btn = f.querySelector('button[type="submit"]');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var table = f.dataset.table || 'messages';
      var type = f.dataset.type || 'message';
      var body = {};
      if (table === 'orders') {
        var ph = f.querySelector('[name="phone"]');
        var ac = window.ygAccount ? window.ygAccount() : '';
        if (ac) body.account = ac;
        var nt = f.querySelector('[name="note"]');
        var it = f.querySelector('[name="items"]');
        if (ph && ph.value) body.phone = ph.value.trim();
        if (nt && nt.value) body.note = nt.value.trim();
        try { if (it && it.value) body.items = JSON.parse(it.value); } catch (err) { body.items = []; }
      } else {
        body.type = type;
        ['name', 'contact', 'content'].forEach(function (k) {
          var el = f.querySelector('[name="' + k + '"]');
          if (el && el.value) body[k] = el.value.trim();
        });
      }
      if (!window.sb) {
        if (status) status.textContent = '离线版无法在线提交，请通过下方微信或邮箱联系我们 ✦';
        return;
      }
      if (btn) btn.disabled = true;
      window.sb(table, { method: 'POST', body: JSON.stringify(body) })
        .then(function () {
          if (status) status.textContent = (table === 'orders' ? '已收到 ✦ 客服将与你二次确认（通常在 1 个工作日内）。' : '已收到你的留言 ✦ 我们会在 1 个工作日内回复。');
          if (window.notifyEmail) window.notifyEmail(table, body);
          f.reset();
          if (btn) btn.disabled = false;
        })
        .catch(function () {
          if (status) status.textContent = '提交失败，请稍后再试，或直接加客服微信。';
          if (btn) btn.disabled = false;
        });
    });
  });
})();

/* ---------- 商品橱窗（collections 页数据驱动，未连库保留静态系列卡） ---------- */
(function initDbProducts() {
  var grid = document.getElementById('dbProducts');
  if (!grid) return;
  var SERIES = { east: '东方线', west: '西方线', union: '合盘线', destiny: '本命' };
  // HTML 转义（DB 内容写入模板前统一处理，防止引号/标签破坏结构与样式）
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function draw(rows) {
    if (!rows || !rows.length) {
      grid.innerHTML = '<p class="section-sub" style="margin:10px auto 0;">（暂无可展示商品；接入商品数据后此处自动陈列）</p>';
      return;
    }
    grid.innerHTML = rows.map(function (p, i) {
      var src = window.sbImg ? window.sbImg(p.image_url) : (p.image_url || '');
      var pr = Number(p.price_yuan);
      var hasPrice = isFinite(pr) && pr > 0;
      // 购买小按钮：带 data-buy 供 initBuy 委托打开下单弹窗；无定价商品不显示购买
      var buyBtn = hasPrice
        ? '<button class="buy-mini" type="button" data-buy data-buy-name="' + esc(p.name) +
          '" data-buy-price="' + pr + '" data-buy-sale="' + (p.discount_price && Number(p.discount_price) > 0 ? esc(String(p.discount_price)) : '') + '">' + (p.discount_price && Number(p.discount_price) > 0 ? '🛒 折后购' : '🛒 购买') + '</button>'
        : '';
      return '<div class="g-card reveal" style="transition-delay:' + Math.min(i, 6) * 70 + 'ms">' +
        '<div class="g-img">' +
          '<img src="' + esc(src) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.style.display=\'none\';">' +
          '<div class="ph">商品图占位</div>' +
        '</div>' +
        '<div class="g-cap">' +
          '<div class="g-name">' + esc(p.name) + '</div>' +
          '<span class="g-tag">' + esc(SERIES[p.series] || p.series || '') + '</span>' +
          '<p class="g-story">' + (p.main_stone ? esc('主石：' + p.main_stone) : '') + (hasPrice ? ' · ¥' + pr + ' 起' : '') + '</p>' +
          (p.quote ? '<div class="g-quote">' + esc(p.quote) + '</div>' : '') +
        '</div>' +
        '<div class="g-foot">' +
          buyBtn +
          '<a class="btn-ghost" href="studio.html">去定制同款</a>' +
        '</div>' +
      '</div>';
    }).join('');
    // 异步注入的 .reveal 卡片需自行触发渐显（initReveal 只处理页面加载时的元素）
    var dyn = grid.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(dyn, function (c) { c.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(dyn, function (c) { io.observe(c); });
  }
  if (!window.sb) { draw(null); return; }
  window.sb('products?select=*&visible=eq.true&order=sort.asc')
    .then(draw).catch(function () { draw(null); });
})();

/* ---------- 作品验真（防伪）：records 表按码查询 ---------- */
(function initVerify() {
  var inp = document.getElementById('verifyCode');
  var btn = document.getElementById('verifyBtn');
  var res = document.getElementById('verifyRes');
  if (!inp || !btn || !res) return;
  btn.addEventListener('click', function () {
    var code = (inp.value || '').trim();
    if (!code) { res.innerHTML = '请输入作品背面/证书上的验证码。'; return; }
    res.innerHTML = '查询中……';
    if (!window.sb) {
      res.innerHTML = '当前为离线版，验真需联网数据库。请上线版或联系客服人工核验。';
      return;
    }
    window.sb('records?select=*&code=eq.' + encodeURIComponent(code))
      .then(function (rows) {
        var r = rows && rows[0];
        if (!r) {
          res.innerHTML = '<div class="doc-block" style="margin:0;"><h3 style="text-align:center;">未查询到该验证码</h3><p style="text-align:center;">请核对后重试；若仍有疑问，请联系客服人工核验（谨防仿冒渠道）。</p></div>';
          return;
        }
        var info = (r.info && typeof r.info === 'object') ? r.info : {};
        var img = (window.sbImg && r.image_urls) ? window.sbImg(String(r.image_urls).split(',')[0]) : '';
        res.innerHTML = '<div class="doc-block" style="margin:0;">' +
          '<h3 style="text-align:center;">✓ 验真通过 · 予光正品</h3>' +
          (img ? '<img src="' + img + '" alt="作品图" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin-bottom:14px;" loading="lazy" onerror="this.style.display=\'none\';">' : '') +
          '<p><b style="color:var(--moon);">验证码：</b><span style="color:var(--gold);letter-spacing:.1em;">' + code + '</span></p>' +
          (r.product_ref ? '<p><b style="color:var(--moon);">作品：</b>' + r.product_ref + '</p>' : '') +
          (info.text ? '<p>' + info.text + '</p>' : '') +
          '<p style="color:var(--text-dim);font-size:12px;">建档时间：' + (r.created_at || '').replace('T', ' ').slice(0, 16) + '</p>' +
          '</div>';
      })
      .catch(function () {
        res.innerHTML = '<p style="text-align:center;">查询服务暂不可用，请稍后再试或联系客服。</p>';
      });
  });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') btn.click(); });
})();

/* ---------- 小光 · 微光助手（悬浮对话 + 星图志选石；未加载配置时自动降级） ---------- */
/* 小光为品牌抽象符号：圆形按钮内一枚光珠（金色渐变圆 + 细小星芒 + 柔和光晕呼吸），不拟人、不画人物五官 */
(function initAi() {
  // 右下角悬浮助手
  if (window.sbAI && !document.getElementById('aiFab')) {
    var root = document.createElement('div');
    root.className = 'ai-widget';
    root.innerHTML =
      '<button type="button" class="ai-fab" id="aiFab" aria-label="小光 · 予光助手">' +
        '<svg class="ai-mark" viewBox="0 0 64 64" aria-hidden="true">' +
          '<defs>' +
            '<radialGradient id="ygOrbCore" cx="36%" cy="28%" r="88%">' +
              '<stop offset="0%" stop-color="#fff9e9"/><stop offset="42%" stop-color="#ffe9b8"/><stop offset="72%" stop-color="#e8bd67"/><stop offset="100%" stop-color="#cf9740"/>' +
            '</radialGradient>' +
            '<radialGradient id="ygOrbHalo" cx="50%" cy="50%" r="50%">' +
              '<stop offset="0%" stop-color="rgba(227,196,124,0.40)"/><stop offset="58%" stop-color="rgba(227,196,124,0.12)"/><stop offset="100%" stop-color="rgba(227,196,124,0)"/>' +
            '</radialGradient>' +
          '</defs>' +
          '<circle class="ai-halo" cx="32" cy="32" r="30" fill="url(#ygOrbHalo)"/>' +
          '<g fill="none" stroke="#e3c47c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12.5 58 Q31.5 42.5 51.5 58"/>' +
            '<path d="M15.5 53.5 Q17.5 46.5 22.5 43"/>' +
            '<path d="M48.5 53.5 Q46.5 46.5 41.5 43"/>' +
            '<path d="M26 61 L38 61"/>' +
          '</g>' +
          '<circle class="ai-orb" cx="32" cy="26.5" r="10.5" fill="url(#ygOrbCore)"/>' +
          '<ellipse class="ai-spec" cx="27.8" cy="22.6" rx="2.9" ry="2.1" fill="#fffdf2" transform="rotate(-24 27.8 22.6)"/>' +
          '<path class="ai-glint" transform="translate(15.5 12) scale(.7)" d="M0 -3.4 C0.5 -1.1 1.1 -0.5 3.4 0 C1.1 0.5 0.5 1.1 0 3.4 C-0.5 1.1 -1.1 0.5 -3.4 0 C-1.1 -0.5 -0.5 -1.1 0 -3.4 Z" fill="#fff6e0"/>' +
          '<path class="ai-glint g2" transform="translate(48.5 11.5) scale(.55)" d="M0 -3.4 C0.5 -1.1 1.1 -0.5 3.4 0 C1.1 0.5 0.5 1.1 0 3.4 C-0.5 1.1 -1.1 0.5 -3.4 0 C-1.1 -0.5 -0.5 -1.1 0 -3.4 Z" fill="#ffe9b8"/>' +
        '</svg>' +
      '</button>' +
      '<div class="ai-panel" id="aiPanel">' +
        '<div class="ai-head">予光 · 小光<span class="ai-close" id="aiClose">✕</span></div>' +
        '<div class="ai-body" id="aiBody"><p class="ai-tip">可问我：定制流程 · 光集故事 · 作品验真 ✦ 也可以只说说你的心意。</p></div>' +
        '<div class="ai-foot"><input id="aiInput" placeholder="跟小光说点什么…" autocomplete="off"><button type="button" id="aiSend">发送</button></div>' +
      '</div>';
    document.body.appendChild(root);
    var panel = root.querySelector('#aiPanel');
    var bodyEl = root.querySelector('#aiBody');
    var inp = root.querySelector('#aiInput');
    var fab = root.querySelector('#aiFab');
    var closeBtn = root.querySelector('#aiClose');
    var sendBtn = root.querySelector('#aiSend');
    var history = [];
    var open = false;
    var greeted = false;
    var HELLOS = [
      '你好，我是小光 ✦ 需要我帮你看看，还是听听你？',
      '我是小光 ✦ 想挑一枚光、配一句光语，或只想歇一歇，都可以说给我听。',
      '你好 ✦ 今天想要一枚怎样的光？说说你的心意，我来为你配。',
      '小光在这里 ✦ 看看系列、问问流程，或者只是待一会儿，都好。'
    ];
    var hiIdx = 0;
    var FALLBACKS = [
      '嗯，这一问我还需要再想想 ✦ 换个说法告诉我，好么？',
      '我一时没想明白 ✦ 别着急，也可以点「微信客服」问真人。',
      '这一问超出我的范围 ✦ 先聊聊别的吧，光一直都在。'
    ];
    function addMsg(text, who) {
      var d = document.createElement('div');
      d.className = 'ai-msg ' + who;
      d.textContent = text;
      bodyEl.appendChild(d);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      return d;
    }
    function ask() {
      var q = (inp.value || '').trim();
      if (!q) return;
      inp.value = '';
      addMsg(q, 'me');
      var wait = addMsg('…', 'ai');
      history.push({ role: 'user', content: q });
      window.sbAI({ mode: 'chat', question: q, history: history })
        .then(function (r) {
          if (bodyEl.contains(wait)) bodyEl.removeChild(wait);
          if (r && r.ok) { history.push({ role: 'assistant', content: r.answer }); addMsg(r.answer, 'ai'); }
          else addMsg(FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)], 'ai');
        })
        .catch(function () {
          if (bodyEl.contains(wait)) bodyEl.removeChild(wait);
          addMsg('（暂时连不上线 ✦ 稍后再试好吗？）', 'ai');
        });
    }
    fab.addEventListener('click', function () {
      open = !open;
      root.classList.toggle('open', open);
      if (open) {
        if (!greeted) {
          greeted = true;
          var g = addMsg(HELLOS[hiIdx % HELLOS.length], 'ai');
          hiIdx++;
          g.className = 'ai-msg ai greet';
        }
        inp.focus();
        // 打开面板即滚到最新一条
        setTimeout(function () { bodyEl.scrollTop = bodyEl.scrollHeight; }, 40);
      }
    });
    closeBtn.addEventListener('click', function () { open = false; root.classList.remove('open'); });
    sendBtn.addEventListener('click', ask);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(); });
  }

  // 星图志「小光帮你选石」
  var needBtn = document.getElementById('aiStonesBtn');
  var needInp = document.getElementById('aiNeed');
  var needRes = document.getElementById('aiStonesRes');
  if (needBtn && needInp && needRes) {
    if (!window.sbAI) {
      needBtn.disabled = true;
      needRes.textContent = '（当前为离线版；联网后即可让小光帮你挑，也可以先逛逛星图志）';
      return;
    }
    needBtn.addEventListener('click', function () {
      var need = (needInp.value || '').trim() || '日常佩戴';
      needRes.textContent = '思考中……';
      needBtn.disabled = true;
      window.sbAI({ mode: 'stones', need: need })
        .then(function (r) {
          needRes.textContent = (r && r.ok) ? r.answer : ('（' + ((r && r.error) || '暂不可用，请稍后再试') + '）');
        })
        .catch(function () { needRes.textContent = '（网络开小差了，稍后再试）'; })
        .then(function () { needBtn.disabled = false; });
    });
  }
})();

/* ---------- 聊天/留言框自动高度：气泡按内容撑开、输入框不被固定高卡死 ---------- */
(function initAutoGrow() {
  // 需要自动撑高的多行输入：留言/备注/小光聊天输入区；气泡本身随内容自适应（CSS 保证换行）
  var SEL = 'textarea[data-autogrow], .sb-form textarea, .xg-box textarea, .field textarea, #buyNote';
  function fit(t) {
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight + 2, 300) + 'px';
    t.style.overflowY = t.scrollHeight > 298 ? 'auto' : 'hidden';
  }
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t && t.tagName === 'TEXTAREA' && t.matches && t.matches(SEL)) fit(t);
  });
  function fitAll() {
    var list = document.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) fit(list[i]);
  }
  fitAll();
  window.addEventListener('load', fitAll);
  // 弹窗里动态出现的备注框在打开时也适配一次
  document.addEventListener('click', function () { setTimeout(fitAll, 60); });
})();

/* ---------- 会员 v6：登录=账号+密码；注册=邮箱验证码+密码两遍 ---------- */
(function initAuthV6() {
  var cfg = window.SUPABASE;
  if (!cfg || !cfg.url) return;
  var API = cfg.url + '/functions/v1/account-api';
  var token = localStorage.getItem('yg_token') || '';
  var account = localStorage.getItem('yg_account') || '';
  var role = localStorage.getItem('yg_role') || 'user';
  var navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  function nick() { return localStorage.getItem('yg_nick') || ''; }
  function av() { var s = (nick() || account || '光').trim(); return s.charAt(0); }
  function api(body) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sess': token }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }
  function refreshChip() {
    if (account) {
      chip.innerHTML = '<span class="chip-av">' + av() + '</span>';
      chip.title = nick() || account;
      chip.setAttribute('data-logged', '1');
      chip.classList.remove('cta');
    } else {
      chip.classList.add('cta');
      chip.textContent = '登录 / 注册';
      chip.removeAttribute('data-logged');
      chip.title = '';
    }
  }
  window.addEventListener('yg:login', function () {
    account = localStorage.getItem('yg_account') || '';
    role = localStorage.getItem('yg_role') || 'user';
    refreshChip();
  });

  var right = document.createElement('div');
  right.className = 'nav-user-wrap';
  var chip = document.createElement('a');
  chip.href = 'javascript:void(0)';
  chip.style.cssText = 'color:var(--gold);font-size:13px;display:inline-flex;align-items:center;';
  right.appendChild(chip);
  var menu = document.createElement('div');
  menu.className = 'user-menu';
  menu.className = 'user-menu up-panel';
  menu.innerHTML = '<a href="account.html#edit">✏️ 编辑资料</a><a href="account.html#email">📮 更换邮箱</a><a href="account.html#orders">📦 我的订单</a><a href="javascript:void(0)" id="menuOut">退出登录</a>';
  menu.style.display = 'none';
  right.appendChild(menu);
  navLinks.parentNode.insertBefore(right, navLinks.nextSibling);

  // ---- 登录/注册弹窗（登录=账号+密码；注册=账号+邮箱验证码+密码两遍）----
  var mask = document.createElement('div');
  mask.className = 'login-modal-mask';
  mask.innerHTML =
    '<div class="login-modal"><span class="close-x">✕</span>' +
    '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px;">' +
      '<button type="button" class="tab-mini auth-tab active" data-tab="login">登录</button>' +
      '<button type="button" class="tab-mini auth-tab" data-tab="reg">注册</button>' +
    '</div>' +
    '<h3 style="text-align:center;">予光会员</h3>' +
    '<input id="lgAccount" placeholder="账号（登录用）" autocomplete="off">' +
    '<input id="lgEmail" type="email" placeholder="邮箱（注册用）" style="display:none;">' +
    '<div id="codeRow" style="display:none;gap:8px;flex-wrap:wrap;">' +
      '<input id="lgCode" type="text" inputmode="numeric" maxlength="6" placeholder="6 位验证码" style="flex:1;min-width:150px;margin:0;">' +
      '<button class="btn-ghost" id="lgSend" type="button" style="flex-shrink:0;padding:8px 14px;font-size:13px;">获取验证码</button>' +
    '</div>' +
    '<input id="lgPwd" type="password" placeholder="密码">' +
    '<input id="lgPwd2" type="password" placeholder="再次输入密码" style="display:none;">' +
    '<input id="lgPhone" type="tel" placeholder="手机号（选填）" style="display:none;">' +
    '<div class="err" id="lgErr"></div>' +
    '<button class="btn-gold" style="width:100%;" id="lgGo" type="button">登 录</button>' +
    '<div style="margin-top:12px;text-align:center;color:var(--text-dim);font-size:12px;">' +
      '<span id="lgForget" style="cursor:pointer;text-decoration:underline;">忘记密码？</span>' +
    '</div>' +
    '</div>';
  document.body.appendChild(mask);
  var acctEl = mask.querySelector('#lgAccount');
  var emailEl = mask.querySelector('#lgEmail');
  var codeEl = mask.querySelector('#lgCode');
  var codeRow = mask.querySelector('#codeRow');
  var pwdEl = mask.querySelector('#lgPwd');
  var pwd2El = mask.querySelector('#lgPwd2');
  var phoneEl = mask.querySelector('#lgPhone');
  var errEl = mask.querySelector('#lgErr');
  var goEl = mask.querySelector('#lgGo');
  var sendEl = mask.querySelector('#lgSend');
  var forgetEl = mask.querySelector('#lgForget');
  var tabLogin = mask.querySelector('[data-tab="login"]');
  var tabReg = mask.querySelector('[data-tab="reg"]');
  var tab = 'login';

  function show(t) {
    tab = t;
    tabLogin.classList.toggle('active', t === 'login');
    tabReg.classList.toggle('active', t === 'reg');
    var reg = t === 'reg';
    acctEl.placeholder = reg ? '账号（登录用）' : '账号';
    emailEl.style.display = reg ? 'block' : 'none';
    codeRow.style.display = reg ? 'flex' : 'none';
    pwdEl.placeholder = reg ? '设置密码（至少 6 位）' : '密码';
    pwd2El.style.display = reg ? 'block' : 'none';
    phoneEl.style.display = reg ? 'block' : 'none';
    goEl.textContent = reg ? '注册并登录' : '登 录';
    errEl.textContent = '';
  }
  tabLogin.addEventListener('click', function () { show('login'); });
  tabReg.addEventListener('click', function () { show('reg'); });

  forgetEl.addEventListener('click', function () {
    var em = (emailEl.value || '').trim() || (acctEl.value || '').trim();
    var q = em;
    if (!q) { errEl.textContent = '请填写注册时的邮箱或账号'; acctEl.focus(); return; }
    goEl.disabled = true;
    api({ op: 'forgot_pw', email: q }).then(function (r) {
      if (r.ok) errEl.textContent = '已通知管理员，重置后临时密码会发到你的注册邮箱。';
      else errEl.textContent = r.error || '提交失败';
    }).catch(function () { errEl.textContent = '网络错误'; }).then(function () { goEl.disabled = false; });
  });

  chip.addEventListener('click', function (e) {
    e.stopPropagation();
    if (chip.getAttribute('data-logged') !== '1') { show('login'); mask.classList.add('show'); acctEl.focus(); return; }
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function () { menu.style.display = 'none'; });
  menu.addEventListener('click', function (e) { e.stopPropagation(); });
  var menuOut = document.getElementById('menuOut');
  if (menuOut) menuOut.addEventListener('click', function () {
    api({ op: 'logout' }).catch(function () {});
    ['yg_token', 'yg_account', 'yg_role', 'yg_nick'].forEach(function (k) { localStorage.removeItem(k); });
    account = ''; token = ''; role = 'user';
    refreshChip(); menu.style.display = 'none';
    if (location.pathname.indexOf('admin.html') !== -1) { location.href = 'index.html'; return; }
  });

  mask.querySelector('.close-x').addEventListener('click', function () { mask.classList.remove('show'); });
  mask.addEventListener('click', function (e) { if (e.target === mask) mask.classList.remove('show'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mask.classList.remove('show'); });

  var cd = 0;
  sendEl.addEventListener('click', function () {
    if (cd > 0) return;
    var em = (emailEl.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { errEl.textContent = '请输入正确的邮箱'; emailEl.focus(); return; }
    errEl.textContent = '正在发送…';
    api({ op: 'send_code', email: em }).then(function (r) {
      if (r.ok) {
        errEl.textContent = '发送成功，请前往邮箱查看（10 分钟内有效）'; cd = 60; sendEl.textContent = '已发送(' + cd + ')';
        var t = setInterval(function () { cd--; if (cd <= 0) { clearInterval(t); sendEl.textContent = '获取验证码'; } else sendEl.textContent = '已发送(' + cd + ')'; }, 1000);
      } else errEl.textContent = r.error || '发送失败';
    }).catch(function () { errEl.textContent = '网络错误'; });
  });

  goEl.addEventListener('click', function () {
    var acc = (acctEl.value || '').trim();
    var body;
    if (tab === 'reg') {
      var em = (emailEl.value || '').trim();
      var code = (codeEl.value || '').trim();
      if (!acc) { errEl.textContent = '请设置账号'; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { errEl.textContent = '请输入正确的邮箱'; return; }
      if (!/^\d{6}$/.test(code)) { errEl.textContent = '请输入 6 位验证码'; return; }
      if (pwdEl.value.length < 6) { errEl.textContent = '密码至少 6 位'; return; }
      if (pwdEl.value !== pwd2El.value) { errEl.textContent = '两次输入的密码不一致'; return; }
      body = { op: 'register', account: acc, email: em, code: code, password: pwdEl.value, phone: (phoneEl.value || '').trim() };
    } else {
      if (!acc || !pwdEl.value) { errEl.textContent = '请输入账号与密码'; return; }
      body = { op: 'login_pw', account: acc, password: pwdEl.value };
    }
    goEl.disabled = true;
    api(body).then(function (r) {
      if (r.ok) loginAfter(r);
      else errEl.textContent = r.error || '操作失败';
    }).catch(function () { errEl.textContent = '网络错误'; }).then(function () { goEl.disabled = false; });
  });
  pwd2El.addEventListener('keydown', function (e) { if (e.key === 'Enter') goEl.click(); });

  function loginAfter(r) {
    token = r.token; account = r.account; role = r.role || 'user';
    localStorage.setItem('yg_token', token);
    localStorage.setItem('yg_account', account);
    localStorage.setItem('yg_role', role);
    localStorage.setItem('yg_nick', r.nickname || '');
    refreshChip(); mask.classList.remove('show');
    window.dispatchEvent(new Event('yg:login'));
  }
  function loadOrders() {
    var list = document.getElementById('ordersList');
    var tip = document.getElementById('ordersTip');
    if (!list) return;
    api({ op: 'orders' }).then(function (r) {
      if (!r.ok || !r.orders) { list.innerHTML = '<p class="orders-empty">未能加载订单</p>'; return; }
      if (!r.orders.length) list.innerHTML = '<p class="orders-empty">还没有订单 ✦ 去定制工坊，生成你的第一枚光吧。</p>';
      else {
        list.innerHTML = r.orders.map(function (o) {
          var items = [];
          try { var arr = (typeof o.items === 'string') ? JSON.parse(o.items) : (o.items || []); items = arr.map(function (x) { return x.name || ''; }); } catch (e) {}
          var st = { new: '待确认', paid: '已确认', making: '制作中', shipped: '已发货', done: '已完成', refund: '退款中' }[o.status] || o.status;
          return '<div class="order-row"><span class="on">' + (o.order_no || '') + '</span><span>¥' + (o.amount || '—') + '</span><span class="st">' + st + '</span><span class="it">' + (items.join('、') || '定制订单') + ' · ' + String(o.created_at || '').replace('T', ' ').slice(0, 16) + '</span></div>';
        }).join('');
      }
      if (tip) tip.textContent = '共 ' + r.orders.length + ' 笔订单';
    }).catch(function () { list.innerHTML = '<p class="orders-empty">网络开小差了</p>'; });
  }

  window.__yuguangLogout = function () {
    ['yg_token', 'yg_account', 'yg_role', 'yg_nick'].forEach(function (k) { localStorage.removeItem(k); });
    location.reload();
  };
  refreshChip();
  window.ygAccount = function () { return localStorage.getItem('yg_account') || ''; };
  /* 静默校验：会话过期则清除假登录态（无弹窗） */
  (function () {
    var tk = localStorage.getItem('yg_token') || '';
    var cfg = window.SUPABASE || {};
    if (!tk || !cfg.url) return;
    fetch(cfg.url + '/functions/v1/account-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sess': tk },
      body: JSON.stringify({ op: 'me' })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) {
        role = j.role || role;
        account = j.account || account;
        if (j.nickname) localStorage.setItem('yg_nick', j.nickname);
        localStorage.setItem('yg_role', role);
        localStorage.setItem('yg_account', account);
        refreshChip();
      } else if (j && !j.ok && /未登录|过期/.test(String(j.error || ''))) {
        ['yg_token', 'yg_account', 'yg_role', 'yg_nick'].forEach(function (k) { localStorage.removeItem(k); });
        account = ''; role = 'user';
        refreshChip();
      }
    }).catch(function () {});
  })();

})();

/* 唤醒统一：先服务端校验 admin/root 再进后台 */
(function () {
  var cfg = window.SUPABASE || {};
  if (!cfg.url) return;
  window.__goAdmin = goAdmin;
  function goAdmin() {
    var token = localStorage.getItem('yg_token') || '';
    if (!token) { location.href = 'account.html'; return; }
    fetch(cfg.url + '/functions/v1/account-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sess': token },
      body: JSON.stringify({ op: 'me' })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.ok && (j.role === 'admin' || j.role === 'root')) {
        localStorage.setItem('yg_role', j.role);
        localStorage.setItem('yg_account', j.account);
        location.href = 'admin.html';
      } else if (j && !j.ok && /未登录|过期/.test(String(j.error || ''))) {
        ['yg_token', 'yg_account', 'yg_role', 'yg_nick'].forEach(function (k) { localStorage.removeItem(k); });
        location.href = 'account.html';
      }
    }).catch(function () {});
  }
  // 手机连点进入后台：改用 pointerdown 计数（click 在快速连点时常被合并/吞掉）。
  // 只统计导航栏空白与 logo 区的点按；忽略来自 a 链接 / 按钮 / 输入框发起的点按；
  // 窗口放宽到 3.2s，累计 6 次立即唤醒并重置；桌面键盘 888888 与下方并存。
  var head = document.querySelector('header.nav');
  var cnt = 0, timer = null;
  if (head) head.addEventListener('pointerdown', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('a,button,input,select,textarea,[data-buy]')) return;
    cnt++;
    clearTimeout(timer);
    timer = setTimeout(function () { cnt = 0; }, 3200);
    if (cnt >= 6) { cnt = 0; clearTimeout(timer); goAdmin(); }
  });
  var buf = '';
  document.addEventListener('keyup', function (e) {
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      buf = (buf + e.key).slice(-6);
      if (buf === '888888') { buf = ''; goAdmin(); }
    }
  });
})();


/* ========== 页面切换过渡导航 + 左上角返回（鸿蒙式） ========== */
(function () {
  var leaving = false;
  function nav(url) {
    if (leaving) return; leaving = true;
    document.body.classList.add('yg-exit');
    setTimeout(function () { try { location.assign(url); } catch (e) { location.href = url; } }, 250);
  }
  window.ygNav = nav;

  var singleMode = !!document.querySelector('.view[data-view]');

  document.addEventListener('click', function (e) {
    var t = e.target;
    var a = t && t.closest ? t.closest('a') : null;
    if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = (a.getAttribute('href') || '').trim();
    if (!href || href.charAt(0) === '#' || /^(https?:)?\/\//.test(href)) return;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return;
    if (/\.html(?:#.*)?$/.test(href)) {
      if (singleMode) return; // 单文件由视图路由接管
      e.preventDefault();
      nav(href);
    }
  });

  var nm = (location.pathname || '').split('/').pop();
  if (nm === 'index.html' || nm === '' || nm === 'account.html') return;
  var b = document.createElement('a');
  b.id = 'ygBack';
  b.href = 'javascript:void(0)';
  b.setAttribute('aria-label', '返回上一页');
  b.innerHTML = '‹';
  b.style.display = 'flex';
  b.addEventListener('click', function (ev) {
    ev.preventDefault();
    document.body.classList.add('yg-exit');
    setTimeout(function () {
      if (singleMode) {
        var home = document.querySelector('.nav-brand');
        if (home) { home.click(); return; }
      }
      var ref = document.referrer || '';
      var same = false;
      try { same = ref && (new URL(ref).origin === location.origin); } catch (e) { same = ref.indexOf(location.origin) === 0; }
      if (same && history.length > 1) history.back();
      else location.href = 'index.html';
    }, 250);
  });
  document.body.appendChild(b);

  // 单文件：仅非首页视图显示返回键
  var viewsEl = document.querySelectorAll('.view[data-view]');
  if (viewsEl.length) {
    function syncBack() {
      var show = false;
      viewsEl.forEach(function (v) {
        if (v.classList.contains('active') && v.getAttribute('data-view') !== 'index') show = true;
      });
      b.style.display = show ? 'flex' : 'none';
    }
    viewsEl.forEach(function (v) {
      var mo = new MutationObserver(syncBack);
      mo.observe(v, { attributes: true, attributeFilter: ['class'] });
    });
    syncBack();
  }
})();


/* ============================================================
   B 组改造（前端侧）：首页光集化 / 微信设置 / 实时 ygLive / 小光名字统一
   ============================================================ */

/* ---------- 1. 光集 · 她们与光（首页 #galleryHome）：gallery 数据驱动 3 列卡片 ---------- */
(function initHomeGallery() {
  var grid = document.getElementById('ghGrid');
  if (!grid) return; // 仅首页该区块存在
  var EMPTY = '<p class="gh-empty reveal visible">光集正在点亮…稍后再来 ✦</p>';
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function showEmpty() {
    if (grid.querySelector('.gh-card')) return;
    grid.innerHTML = EMPTY;
  }
  function draw(rows) {
    rows = rows || [];
    if (!rows.length) { showEmpty(); return; }
    var cards = rows.map(function (it, i) {
      var src = (window.sbImg && it.image_url) ? window.sbImg(it.image_url) : '';
      var text = String(it.story || '').trim() || String(it.quote || '').trim();
      var imgHtml = src
        ? '<div class="gh-img"><img src="' + esc(src) + '" alt="' + esc(it.name || '予光 · 光集作品') + '" loading="lazy" onerror="this.style.display=\'none\';"><div class="gh-ph">✦<br>图片暂未亮起</div></div>'
        : '<div class="gh-img"><div class="gh-ph">✦<br>图片暂未亮起</div></div>';
      var tag = it.tag ? '<span class="gh-tag">' + esc(it.tag) + '</span>' : '';
      var body = text ? '<p class="gh-story">' + esc(text) + '</p>' : '';
      return '<figure class="gh-card reveal" style="transition-delay:' + (Math.min(i, 6) * 70) + 'ms">' +
        imgHtml +
        '<figcaption class="gh-cap"><div class="gh-name">' + esc(it.name || '予光 · 光集') + '</div>' + tag + body +
        '</figcaption></figure>';
    });
    grid.innerHTML = cards.join('');
    // 卡片 reveal：进入视口才错落渐显
    var dyn = grid.querySelectorAll('.gh-card.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(dyn, function (c) { c.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(dyn, function (c) { io.observe(c); });
  }
  if (!window.sb) { showEmpty(); return; }
  window.sb('gallery?select=name,image_url,story,quote,tag&visible=eq.true&approved=eq.true&order=id.desc&limit=6')
    .then(draw)
    .catch(showEmpty);
})();

/* ---------- 2. 微信设置前台生效（app_data key='contact'；仅当存在时） ---------- */
(function initContactCfg() {
  var wxEl = document.getElementById('wxIdTxt');
  var mpImg = document.getElementById('qrMpImg');
  var svcImg = document.getElementById('qrSvcImg');
  if ((!wxEl && !mpImg && !svcImg) || !window.sb) return; // 仅联系方式区所在页面
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function applyQr(img, fileName) {
    if (!img || !fileName || typeof fileName !== 'string') return;
    var name = fileName.trim();
    if (!name || !/\.\w{2,5}$/.test(name)) return; // 空 / 无扩展名 → 跳过
    var box = img.parentNode;
    var ph = box ? box.querySelector('.qr-ph') : null;
    function showImg() { if (ph) ph.style.display = 'none'; }
    function restorePh() { if (ph) ph.style.display = ''; }
    img.style.display = '';
    if (img.complete && img.naturalWidth) showImg();
    img.addEventListener('load', showImg, { once: true });
    img.addEventListener('error', restorePh, { once: true });
    img.src = (/^(https?:)?\/\//.test(name) || name.indexOf('img/') === 0) ? name : ('img/' + name);
  }
  window.sb('app_data?select=key,value')
    .then(function (rows) {
      if (!rows || !rows.length) return;
      var cfg = null;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i] && rows[i].key === 'contact') {
          var v = rows[i].value;
          if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { v = null; } }
          if (v && typeof v === 'object') { cfg = v; break; }
        }
      }
      if (!cfg) return; // 未配置 contact → 不生效
      // 微信号文本：把含 yuguang-service 的文本替换为新微信号
      var w = String(cfg.wechat || cfg.wechat2 || '').trim();
      if (wxEl && w && wxEl.innerHTML.indexOf('yuguang-service') !== -1) {
        wxEl.innerHTML = wxEl.innerHTML.split('yuguang-service').join(esc(w));
      }
      // 二维码：src = img/ + 文件名
      applyQr(mpImg, cfg.qr_mp);
      applyQr(svcImg, cfg.qr_service);
    })
    .catch(function () { /* 失败静默，保持默认 */ });
})();

/* ---------- 3. 实时微光（ygLive）：顶部轻提示 / 角标 / 20s 轮询基座（供各页复用） ---------- */
(function initYgLive() {
  var cfg = window.SUPABASE || {};
  function token() { return localStorage.getItem('yg_token') || ''; }
  function api(body) {
    if (!cfg.url) return Promise.resolve({ ok: false, error: '离线模式' });
    return fetch(cfg.url + '/functions/v1/account-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sess': token() },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: '网络错误' }; });
  }
  var seq = 0;
  function escTip(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, function (c) {
      return c === '&' ? '&amp;' : (c === '<' ? '&lt;' : '&gt;');
    });
  }
  // 顶部轻提示：dark-gold 小条，6s 自动淡出；同键替换，避免堆叠
  function tip(opts) {
    opts = opts || {};
    var key = opts.key || ('tip' + (++seq));
    document.querySelectorAll('.yg-tip').forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); });
    var bar = document.createElement('div');
    bar.className = 'yg-tip' + (opts.cls ? ' ' + opts.cls : '');
    bar.id = 'ygTip-' + key;
    bar.setAttribute('role', 'status');
    bar.innerHTML = escTip(opts.text || '');
    var dead = false;
    function dismiss() {
      if (dead) return;
      dead = true;
      if (bar.parentNode) {
        bar.classList.add('yg-out');
        setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 520);
      }
    }
    bar.addEventListener('click', function () {
      dismiss();
      if (opts.onClick) { try { opts.onClick(); } catch (e) {} }
    });
    document.body.appendChild(bar);
    setTimeout(dismiss, opts.dur || 6000);
    return { close: dismiss };
  }
  // 角标：菜单按钮右上小红点 / 数字
  function badgeEl(el) {
    if (!el) return null;
    if (!el._ygBadge) {
      var b = document.createElement('span');
      b.className = 'yg-badge';
      b.style.display = 'none';
      el.appendChild(b);
      el._ygBadge = b;
    }
    return el._ygBadge;
  }
  function badgeSet(el, num) {
    var b = badgeEl(el);
    if (!b) return;
    if (num == null || num <= 0) { badgeClear(el); return; }
    b.className = 'yg-badge';
    b.textContent = num > 9 ? '9+' : String(num);
    b.style.display = 'inline-block';
  }
  function badgeClear(el) {
    var b = el && el._ygBadge;
    if (b) { b.style.display = 'none'; b.textContent = ''; }
  }
  var polls = {};
  // 轮询：仅在页面可见且 when() 通过时触发 tick；立即首轮执行
  function poll(opts) {
    opts = opts || {};
    var key = opts.key || ('poll' + (++seq));
    if (polls[key]) clearInterval(polls[key]);
    function tick() {
      if (document.hidden) return;
      if (opts.when && !opts.when()) return;
      try { opts.tick(); } catch (e) {}
    }
    polls[key] = setInterval(tick, opts.every || 20000);
    setTimeout(tick, opts.immediate === false ? opts.every : 60);
    return { stop: function () { if (polls[key]) { clearInterval(polls[key]); delete polls[key]; } } };
  }
  window.ygLive = {
    api: api,
    logged: function () { return !!token(); },
    tip: tip,
    badgeSet: badgeSet,
    badgeClear: badgeClear,
    poll: poll
  };
})();

/* ---------- 3.5 兼容历史深链：index.html#lights → 平滑定位到新的光集区块 ---------- */
(function oldLightsCompat() {
  if (location.hash !== '#lights') return;
  var page = (location.pathname || '').split('/').pop();
  if (page !== 'index.html' && page !== '') return;
  setTimeout(function () {
    var el = document.getElementById('galleryHome');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
})();

/* ---------- 4. 助手名称统一：页面既有「光语助手」等旧文案运行时替换为「小光」 ---------- */
(function unifyBotName() {
  function walk(n) {
    if (!n || n.nodeType !== 1) return;
    var tag = n.tagName || '';
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT') return;
    Array.prototype.forEach.call(n.childNodes, function (c) {
      if (c.nodeType === 3) {
        if (c.nodeValue && c.nodeValue.indexOf('光语助手') !== -1) {
          c.nodeValue = c.nodeValue.split('光语助手').join('小光');
        }
      } else if (c.nodeType === 1) walk(c);
    });
  }
  walk(document.body);
})();

/* ============================================================
   购买 / 下单弹窗 + 微光转盘优惠（initBuy）
   触发源：
     · collections 页 DB 商品卡「🛒 购买」小按钮（initDbProducts 渲染，data-buy）
     · product 详情页 #addCart（data-buy 属性，见 product.html）
   弹窗与转盘全部为 JS 动态创建，转盘只出现在下单弹窗内，不在任何页面常驻。
   下单：window.sb('orders', {method:'POST', body: JSON.stringify(...)})（沿用全站约定）
   ============================================================ */
(function initBuy() {
  var DAY_KEY = 'yg_buy_wheel_day';            // 浏览器每日限次 key
  var overlay = null;                          // 弹窗容器（懒建一次）
  var isOpen = false;                          // 弹窗是否展开
  var spinning = false;                        // 转盘转动中
  var busy = false;                            // 订单提交中
  var qty = 1;                                 // 数量
  var discount = 0;                            // 本次订单已立减金额（¥）
  var nameVal = '';
  var saleVal = 0; // 折后单价（0=无折后）                            // 当前商品名
  var priceVal = 0;                            // 当前单价（元）
  var cfgCache = null;                         // 转盘配置 {tiers, probs}
  var cfgPromise = null;                       // 配置读取 Promise（惰性一次）
  var lastDeg = 0;                             // 转盘累计旋转角度（会话内）
  var WCOL = ['#e3c47c', '#c9575b', '#8fa3d9', '#6fa87f']; // 4 扇区配色

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function account() {
    var t = localStorage.getItem('yg_token');
    var a = localStorage.getItem('yg_account');
    return (t && a) ? a : '';
  }
  function toPrice(v) {
    var n = Number(v);
    return (isFinite(n) && n > 0) ? n : 0;
  }
  function yuan(n) {
    n = Math.round((Number(n) || 0) * 100) / 100;
    return '¥' + n;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function acctDayKey() {
    var a = account();
    return a ? (DAY_KEY + '_' + a) : '';
  }
  function wheelUsed() {
    var t = today();
    if (localStorage.getItem(DAY_KEY) === t) return true;
    var k = acctDayKey();
    return !!(k && localStorage.getItem(k) === t);
  }
  function markWheelUsed() {
    var t = today();
    localStorage.setItem(DAY_KEY, t);
    var k = acctDayKey();
    if (k) localStorage.setItem(k, t);
  }
  function validContact(v) {
    v = String(v || '').trim();
    if (!v) return false;
    if (v.indexOf('@') !== -1) return v.length >= 6;   // 宽松邮箱
    var digits = v.replace(/\D/g, '');
    return digits.length >= 6;                          // ≥6 位数字（手机/微信号）
  }

  /* ---------- 转盘配置：app_data key='wheel' → {min,max,probs} ---------- */
  function defaultCfg() { return { tiers: [28, 48, 68, 88], probs: null }; }
  function parseCfg(v) {
    if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { v = null; } }
    if (!v || typeof v !== 'object') return null;
    var min = Number(v.min), max = Number(v.max);
    if (!isFinite(min) || !isFinite(max)) { min = 28; max = 88; }
    if (max < min) { var sw = min; min = max; max = sw; }
    if (min < 1) min = 1;
    if (!(max > min)) max = min + 1;
    var tiers = [];
    for (var k = 0; k < 4; k++) tiers.push(Math.round(min + (max - min) * k / 3));
    var probs = null;
    var p = v.probs;
    if (p && typeof p.length === 'number' && p.length >= 4) {
      var arr = [], sum = 0, ok = true;
      for (var j = 0; j < 4; j++) {
        var x = Number(p[j]);
        if (!isFinite(x) || x < 0) { ok = false; break; }
        arr.push(x); sum += x;
      }
      if (ok && sum > 0 && Math.abs(sum - 100) <= 15) probs = arr; // 合计≈100 才加权
    }
    return { tiers: tiers, probs: probs };
  }
  function ensureCfg() {
    if (cfgPromise) return cfgPromise;
    cfgPromise = new Promise(function (resolve) {
      function done(cfg) { cfgCache = cfg || defaultCfg(); resolve(cfgCache); }
      if (!window.sb) { done(defaultCfg()); return; }
      window.sb('app_data?select=value&key=eq.wheel')
        .then(function (rows) {
          var cfg = null;
          if (rows && rows.length) cfg = parseCfg(rows[0] && rows[0].value);
          done(cfg);                                   // 读取失败/无配置 → 默认均分 28/48/68/88
        })
        .catch(function () { done(null); });
    });
    return cfgPromise;
  }
  function pickIndex(cfg) {
    if (cfg.probs) {
      var p = cfg.probs, sum = 0, i;
      for (i = 0; i < p.length; i++) sum += p[i];
      var r = Math.random() * sum;
      for (i = 0; i < p.length; i++) { r -= p[i]; if (r <= 0) return i; }
      return p.length - 1;
    }
    return Math.floor(Math.random() * 4);
  }
  function discBg() {
    var s = [];
    for (var k = 0; k < 4; k++) s.push(WCOL[k] + ' ' + (k * 90) + 'deg ' + ((k + 1) * 90) + 'deg');
    return 'conic-gradient(' + s.join(',') + ')';
  }
  /* 落盘：把扇区文本与位置画到盘面（文字始终朝上，与 CSS 断点同步半径） */
  function paintWheel(cfg) {
    if (!overlay) return;
    var disc = overlay.querySelector('#buyWheelDisc');
    if (disc) disc.style.background = discBg();
    var size = (window.innerWidth || 640) <= 640 ? 150 : 180;   // 与 style.css 断点一致
    var r = Math.round(size * 0.3);
    var labels = overlay.querySelectorAll('.buyWheelLabel');
    Array.prototype.forEach.call(labels, function (el, i) {
      var a = i * 90 + 45;
      el.style.transform = 'translate(-50%, -50%) rotate(' + a + 'deg) translateY(-' + r + 'px) rotate(-' + a + 'deg)';
      el.textContent = (cfg && cfg.tiers && cfg.tiers[i] != null) ? '¥' + cfg.tiers[i] : '';
    });
  }

  /* ---------- 金额/小计 ---------- */
  function unit() { return saleVal > 0 ? saleVal : priceVal; }
  function subTotal() { return Math.round(unit() * qty * 100) / 100; }
  function payTotal() {
    var p = Math.round((subTotal() - discount) * 100) / 100;
    return p < 1 ? 1 : p; // 低于 1 元按 1 元
  }
  function bump(el) {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
  function refreshAmount(pop) {
    if (!overlay) return;
    var subEl = overlay.querySelector('#buySub');
    var offRow = overlay.querySelector('#buyOffRow');
    var offEl = overlay.querySelector('#buyOff');
    var payEl = overlay.querySelector('#buyPay');
    if (subEl) subEl.textContent = yuan(subTotal());
    if (offRow && offEl) {
      if (discount > 0) {
        offRow.style.display = '';
        offEl.textContent = '−' + yuan(discount);
      } else offRow.style.display = 'none';
    }
    if (payEl) payEl.textContent = yuan(payTotal());
    if (pop) { if (offEl && discount > 0) bump(offEl); if (payEl) bump(payEl); }
  }

  /* ---------- 弹窗 HTML ---------- */
  function formHtml() {
    var acct = account();
    var tip = acct
      ? '将以账号 <b>' + esc(acct) + '</b> 提交 ✦ 订单可在会员中心查询'
      : '暂未登录，也可微信联系客服下单';
    return '' +
      '<button class="buyX" type="button" aria-label="关闭下单弹窗">✕</button>' +
      '<h3 class="buyTitle">确认这枚光</h3>' +
      '<div class="buyProd">' +
        '<div class="buyProdName">' + esc(nameVal) + '</div>' +
        '<div class="buyProdPrice">' + (saleVal > 0 ? '<s>' + yuan(priceVal) + '</s> <b>' + yuan(saleVal) + '</b> <small>折后单价</small>' : yuan(priceVal) + ' <small>单价</small>') + '</div>' +
      '</div>' +
      '<div class="buyRow">' +
        '<span class="buyLbl buyLblRow">数量</span>' +
        '<div class="buyQty">' +
          '<button class="buyStep" type="button" data-q="-1" aria-label="减少数量">−</button>' +
          '<span class="buyQtyNum">1</span>' +
          '<button class="buyStep" type="button" data-q="1" aria-label="增加数量">＋</button>' +
        '</div>' +
      '</div>' +
      '<div class="buyAmt">' +
        '<div class="buyAmtRow"><span>商品小计</span><b id="buySub"></b></div>' +
        '<div class="buyAmtRow buyOff" id="buyOffRow" style="display:none;"><span>🎡 微光转盘立减</span><b id="buyOff"></b></div>' +
        '<div class="buyAmtRow buyTotal"><span>应付</span><b id="buyPay"></b></div>' +
      '</div>' +
      '<label class="buyLbl" for="buyName">收件人</label>' +
      '<input class="buyInput" id="buyName" type="text" maxlength="40" placeholder="收件人昵称（已登录自动带出）">' +
      '<label class="buyLbl" for="buyPhone">联系方式（手机号 / 微信号，必填）</label>' +
      '<input class="buyInput" id="buyPhone" type="text" autocomplete="tel" maxlength="80" placeholder="手机号／微信号／邮箱">' +
      '<label class="buyLbl" for="buyAddr">收货地址（必填）</label>' +
      '<textarea class="buyInput buyNoteArea" id="buyAddr" rows="2" placeholder="省市区 + 详细地址"></textarea>' +
      '<label class="buyLbl" for="buyNote">备注（选填）</label>' +
      '<textarea class="buyInput buyNoteArea" id="buyNote" rows="2" placeholder="送人生日、想要的光语、收货偏好等"></textarea>' +
      wheelZoneHtml() +
      '<div class="buyTip">' + tip + '</div>' +
      '<div class="buyErr" id="buyErr"></div>' +
      '<button class="buySubmit" id="buySubmit" type="button">提交订单</button>';
  }
  function wheelZoneHtml() {
    var used = wheelUsed();
    return '<div class="buyWheelZone">' +
      '<div class="buyWheelHead"><span>🎡 微光转盘</span><em>转一下，本单立减一份小光礼 ✦ 每日一次</em></div>' +
      '<div class="buyWheelWrap">' +
        '<div class="buyWheel' + (used ? ' used' : '') + '">' +
          '<div class="buyWheelDisc" id="buyWheelDisc">' +
            '<span class="buyWheelLabel" data-i="0"></span>' +
            '<span class="buyWheelLabel" data-i="1"></span>' +
            '<span class="buyWheelLabel" data-i="2"></span>' +
            '<span class="buyWheelLabel" data-i="3"></span>' +
          '</div>' +
          '<span class="buyWheelPin"></span>' +
          '<button class="buyWheelHub" id="buyWheelHub" type="button" aria-label="转动微光转盘"' + (used ? ' disabled' : '') + '>🎡</button>' +
        '</div>' +
      '</div>' +
      '<div class="buyWheelMsg" id="buyWheelMsg" role="status"></div>' +
    '</div>';
  }
  function successHtml() {
    return '' +
      '<button class="buyX" type="button" aria-label="关闭">✕</button>' +
      '<div class="buyOk">' +
        '<div class="buyOkIco">✦</div>' +
        '<h3 class="buyOkTitle">已收到</h3>' +
        '<p class="buyOkTxt">已收到 ✦ 客服将在 1 个工作日内与您确认，订单号可在会员中心查询。</p>' +
        '<button class="buyOkBtn" id="buyOkBtn" type="button">好的</button>' +
      '</div>';
  }

  /* ---------- 弹窗容器 ---------- */
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'buyModal';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<div class="buyCard"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeBuy(true); // 点遮罩关闭
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) closeBuy(true);
    });
    return overlay;
  }
  function showOverlay(on) {
    var ov = ensureOverlay();
    ov.classList.toggle('show', !!on);
    ov.setAttribute('aria-hidden', on ? 'false' : 'true');
    document.body.classList.toggle('buyLock', !!on);
  }
  function closeBuy(reset) {
    if (!overlay) return;
    isOpen = false;
    spinning = false;
    if (reset) { qty = 1; discount = 0; }
    showOverlay(false);
  }
  function setWheelMsg(html) {
    var m = overlay && overlay.querySelector('#buyWheelMsg');
    if (!m) return;
    m.innerHTML = html;
  }
  function pageInfo() {
    var o = { name: '', price: 0 };
    var n = document.querySelector('.p-name');
    var p = document.querySelector('.p-price');
    if (n) o.name = String(n.textContent || '').trim();
    if (p) {
      var m = String(p.textContent || '').match(/¥\s*(\d+(?:\.\d+)?)/);
      if (m) o.price = parseFloat(m[1]);
    }
    return o;
  }
  function openBuy(opts) {
    opts = opts || {};
    saleVal = toPrice(opts.sale);
    var name = (opts.name != null && String(opts.name).trim()) ? String(opts.name).trim() : '';
    var price = toPrice(opts.price);
    if (!name || !price) {
      var pg = pageInfo();
      if (!name) name = pg.name;
      if (!price) price = pg.price;
    }
    if (!name) name = '予光 · 定制款';
    nameVal = name;
    priceVal = price;
    qty = 1; discount = 0; spinning = false; busy = false;

    var card = ensureOverlay().querySelector('.buyCard');
    card.innerHTML = formHtml();
    wireForm(card);
    refreshAmount(false);
    if (account()) {
      try {
        fetch((window.SUPABASE.url || '') + '/functions/v1/account-api', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sess': localStorage.getItem('yg_token') || '' },
          body: JSON.stringify({ op: 'me' })
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (!isOpen || !j || !j.ok) return;
          var nn = overlay && overlay.querySelector('#buyName');
          if (nn && !(nn.value || '').trim() && (j.nickname || j.account)) nn.value = j.nickname || j.account;
          var ph = overlay && overlay.querySelector('#buyPhone');
          if (ph && !(ph.value || '').trim() && j.phone) ph.value = j.phone;
        }).catch(function () {});
      } catch (e) {}
    }
    paintWheel(defaultCfg());                       // 先按默认档位落字
    ensureCfg().then(function (cfg) {               // 配置到达后刷新档位
      if (isOpen) paintWheel(cfg);
    });
    var used = wheelUsed();
    setWheelMsg(used
      ? '今日已转过 ✦ 明日再来'
      : '转一下，本单立减一份小光礼 ✦ 每日一次');
    showOverlay(true);
    isOpen = true;
  }

  /* ---------- 交互绑定（每次开窗重建后执行） ---------- */
  function wireForm(card) {
    var stepBtns = card.querySelectorAll('.buyStep');
    Array.prototype.forEach.call(stepBtns, function (b) {
      b.addEventListener('click', function () {
        var d = Number(b.getAttribute('data-q')) || 0;
        qty = Math.min(99, Math.max(1, qty + d));
        var nEl = card.querySelector('.buyQtyNum');
        if (nEl) nEl.textContent = qty;
        refreshAmount(true);
      });
    });
    var x = card.querySelector('.buyX');
    if (x) x.addEventListener('click', function () { closeBuy(true); });
    var hub = card.querySelector('#buyWheelHub');
    if (hub) hub.addEventListener('click', spinWheel);
    var sub = card.querySelector('#buySubmit');
    if (sub) sub.addEventListener('click', submitOrder);
  }

  /* ---------- 转盘转动 ---------- */
  function spinWheel() {
    if (spinning || busy || !overlay || discount > 0) return;
    var hub = overlay.querySelector('#buyWheelHub');
    if (!hub || hub.disabled) return;
    if (wheelUsed()) {
      setWheelMsg('今日已转过 ✦ 明日再来');
      hub.disabled = true;
      return;
    }
    spinning = true;
    hub.disabled = true;
    setWheelMsg('微光转动中 ✦ 落定即见立减…');
    ensureCfg().then(function (cfg) {
      var idx = pickIndex(cfg);
      var amt = cfg.tiers[idx];
      // 落到扇区 i 中心正对顶部指针：所需角度增量 = (315 − 90i) − 当前余角
      var delta = (315 - 90 * idx - (lastDeg % 360)) % 360;
      if (delta < 0) delta += 360;
      lastDeg += 360 * (4 + Math.floor(Math.random() * 3)) + delta;
      var disc = overlay.querySelector('#buyWheelDisc');
      if (disc) {
        disc.style.transition = 'transform 4.2s cubic-bezier(.16, .84, .22, 1)';
        disc.style.transform = 'rotate(' + lastDeg + 'deg)';
      }
      window.setTimeout(function () {
        spinning = false;
        if (!isOpen) return;                        // 中途关闭：不落账、不计次
        discount = amt;
        markWheelUsed();
        tryRecordSpin(amt);
        refreshAmount(true);
        setWheelMsg('本单立减 <b>' + yuan(amt) + '</b> ✦ 已计入下方金额');
        var h = overlay && overlay.querySelector('#buyWheelHub');
        if (h) h.disabled = true;
      }, 4300);
    }).catch(function () {
      spinning = false;
      setWheelMsg('转盘开小差了，请再试一次 ✦');
    });
  }
  function tryRecordSpin(amt) {
    if (!window.sb) return;
    var phoneEl = overlay && overlay.querySelector('#buyPhone');
    var phone = phoneEl ? (phoneEl.value || '').trim() : '';
    if (!phone) phone = account();
    if (!phone) return;
    try {
      window.sb('wheel_spins', { method: 'POST', body: JSON.stringify({ phone: phone, prize: '立减¥' + amt }) })
        .catch(function () { /* RLS/网络失败静默忽略 */ });
    } catch (e) { /* 忽略 */ }
  }

  /* ---------- 提交订单 ---------- */
  function submitOrder() {
    if (!overlay || busy) return;
    var phoneEl = overlay.querySelector('#buyPhone');
    var noteEl = overlay.querySelector('#buyNote');
    var nameEl = overlay.querySelector('#buyName');
    var addrEl = overlay.querySelector('#buyAddr');
    var errEl = overlay.querySelector('#buyErr');
    var btn = overlay.querySelector('#buySubmit');
    var phone = (phoneEl && phoneEl.value || '').trim();
    var note = (noteEl && noteEl.value || '').trim();
    var buyer = (nameEl && nameEl.value || '').trim() || (account() || '');
    var addr = (addrEl && addrEl.value || '').trim();
    if (errEl) errEl.textContent = '';
    if (!validContact(phone)) {
      if (errEl) errEl.textContent = '请填写有效的手机号（≥6 位数字）、微信号或邮箱';
      if (phoneEl) phoneEl.focus();
      return;
    }
    if (!addr) {
      if (errEl) errEl.textContent = '请填写收货地址（省市区 + 详细地址）';
      if (addrEl) addrEl.focus();
      return;
    }
    busy = true;
    if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
    var acct = account();
    var items = [{
      name: nameVal,
      price: unit(),
      price_yuan: priceVal,
      discount_price: saleVal > 0 ? saleVal : undefined,
      qty: qty,
      amount: subTotal()
    }];
    var fullNote = note;
    if (discount > 0) fullNote = (fullNote ? fullNote + '；' : '') + '微光转盘立减 ¥' + discount;
    var body = { phone: phone, items: items, amount: payTotal(), note: fullNote, status: 'new' };
    if (buyer) body.receiver = buyer;
    if (addr) body.address = addr;
    if (acct) body.account = acct;
    if (!window.sb) {
      if (errEl) errEl.textContent = '当前为离线版，无法在线下单，请微信联系客服 ✦';
      busy = false;
      if (btn) { btn.disabled = false; btn.textContent = '提交订单'; }
      return;
    }
    window.sb('orders', { method: 'POST', body: JSON.stringify(body) })
      .then(function () {
        if (!isOpen) return;
        try {
          var eurl = (window.SUPABASE && (window.SUPABASE.emailUrl || window.SUPABASE.url + '/functions/v1/email-send')) || '';
          if (eurl) {
            var flds = {
              '订单商品': items.map(function (it) { return it.name + ' ×' + it.qty; }).join('、'),
              '数量': qty,
              '单价(原)': '¥' + priceVal,
              '单价(折后)': saleVal > 0 ? '¥' + saleVal : '—',
              '转盘立减': discount > 0 ? '¥' + discount : '—',
              '应付合计': '¥' + payTotal(),
              '收件人': buyer,
              '联系方式': phone,
              '收货地址': addr,
              '备注': note || '—',
              '下单账号': acct || '（未登录）'
            };
            fetch(eurl, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kind: 'order', subject: '【予光】新的下单通知', fields: flds })
            }).catch(function () {});
          }
        } catch (e2) {}
        var card = overlay.querySelector('.buyCard');
        card.innerHTML = successHtml();
        var x2 = card.querySelector('.buyX');
        if (x2) x2.addEventListener('click', function () { closeBuy(true); });
        var ok = card.querySelector('#buyOkBtn');
        if (ok) ok.addEventListener('click', function () { closeBuy(true); });
      })
      .catch(function () {
        if (errEl) errEl.textContent = '提交失败，请稍后再试，或微信联系客服下单 ✦';
      })
      .then(function () {
        busy = false;
        if (btn && overlay.contains(btn)) { btn.disabled = false; btn.textContent = '提交订单'; }
      });
  }

  /* ---------- 委托：页面任意 [data-buy]（商品卡 / #addCart）→ 打开弹窗 ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var trig = (t && t.closest) ? t.closest('[data-buy]') : null;
    if (!trig) return;
    e.preventDefault();
    e.stopPropagation();   // 防止卡片/页面的点击穿透
    openBuy({
      name: trig.getAttribute('data-buy-name') || '',
      price: trig.getAttribute('data-buy-price') || '',
      sale: trig.getAttribute('data-buy-sale') || ''
    });
  });

  /* 对外 API：product.html / 其它页面可直接调用 ygOpenBuy({name, price}) */
  window.ygOpenBuy = function (opts) {
    openBuy((opts && typeof opts === 'object') ? opts : {});
  };
})();

/* ===== 首页「系列 · 把它带回家」商品区 ===== */
(function initHomeShop() {
  var grid = document.getElementById('hsGrid');
  if (!grid) return;
  function show(rows) {
    if (!rows || !rows.length) { grid.innerHTML = '<p class="section-sub" style="text-align:center;color:var(--text-dim);">系列正在打磨 ✦ 稍后再来看看</p>'; return; }
    grid.innerHTML = rows.map(function (x) {
      var pr = x.price_yuan;
      var disc = (x.discount_price && Number(x.discount_price) > 0) ? Number(x.discount_price) : 0;
      var img = window.sbImg ? window.sbImg(x.image_url) : (x.image_url || '');
      return '<div class="hs-card reveal">' +
        '<div class="hs-img">' + (img ? '<img class="hs-real" src="' + esc(img) + '" alt="' + esc(x.name) + '" loading="lazy">' : '') +
          '<div class="hs-ph"' + (img ? '' : ' style="display:flex;"') + '>图未就位 ✦</div></div>' +
        '<div class="hs-name">' + esc(x.name || '') + '</div>' +
        '<div class="hs-tag">' + esc(x.series || '') + '</div>' +
        '<div class="hs-price">' + (disc > 0 ? '<s>¥' + esc(String(pr)) + '</s> <b>¥' + esc(String(disc)) + '</b>' : ('¥' + esc(String(pr === undefined || pr === null ? '—' : pr)))) + '</div>' +
        (x.quote ? '<div class="hs-q">' + esc(x.quote) + '</div>' : '') +
        '<button class="btn-gold hs-buy" type="button" data-buy data-buy-name="' + esc(x.name) + '" data-buy-price="' + esc(String(pr || '')) + '" data-buy-sale="' + (disc > 0 ? esc(String(disc)) : '') + '">选择这枚光</button></div>';
    }).join('');
    grid.querySelectorAll('img.hs-real').forEach(function (im) {
      im.addEventListener('error', function () {
        if (im.getAttribute('data-ph')) return;
        im.setAttribute('data-ph', '1');
        im.style.display = 'none';
        var ph = im.parentNode ? im.parentNode.querySelector('.hs-ph') : null;
        if (ph) ph.style.display = 'flex';
      });
    });
    grid.querySelectorAll('.reveal').forEach(function (el) {
      setTimeout(function () { el.classList.add('visible'); }, 60);
    });
  }
  if (!window.sb) { show([]); return; }
  window.sb('products?select=name,slug,series,price_yuan,discount_price,image_url,quote&visible=eq.true&order=sort.asc,id.desc&limit=8')
    .then(function (r) { show((r && r.length) ? r : []); })
    .catch(function () { show([]); });
})();

/* ============================================================
   G 组：信箱悬浮小圆钮（登录可见，叠在小光上方）+ 20s 轮询 + 顶部 1.5s 来信横幅
   接口约定同 account.html：op:'inbox' → {items:[{id,read,...}]}；op:'inbox_read',ids 标已读
   ============================================================ */
(function initInboxFab() {
  var cfg = window.SUPABASE || {};
  if (!cfg.url) return;
  var FAB_ID = 'mbFab';
  var TIP_KEY = 'mbBell';
  var fab = null;
  var pollTimer = null;
  var lastUnread = -1;   // -1 = 尚未建立基线（首轮不弹横幅）
  var unreadIds = [];
  var apiBusy = false;

  function tok() { return localStorage.getItem('yg_token') || ''; }
  function acc() { return localStorage.getItem('yg_account') || ''; }
  function logged() { return !!(tok() && acc()); }
  function api(body) {
    return fetch(cfg.url + '/functions/v1/account-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sess': tok() },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: '网络错误' }; });
  }

  function ensureFab() {
    if (fab && fab.isConnected) return fab;
    fab = document.getElementById(FAB_ID);
    if (fab) return fab;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = FAB_ID;
    b.className = 'mb-fab';
    b.setAttribute('aria-label', '信箱 · 站内来信');
    b.innerHTML = '<span class="mb-ico" aria-hidden="true">✉</span><span class="mb-num" hidden></span>';
    document.body.appendChild(b);
    fab = b;
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      openInbox();
    });
    return b;
  }
  function dropFab() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    if (fab && fab.isConnected) fab.remove();
    fab = null;
    lastUnread = -1;
    unreadIds = [];
  }
  function setBadge(n) {
    var el = fab ? fab.querySelector('.mb-num') : null;
    if (!el) return;
    if (n > 0) {
      el.hidden = false;
      el.textContent = n > 9 ? '9+' : String(n);
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    } else {
      el.hidden = true;
      el.textContent = '';
    }
  }
  function markAllRead() {
    if (!unreadIds.length) return;
    var ids = unreadIds.slice();
    api({ op: 'inbox_read', ids: ids }).catch(function () {});
  }
  function openInbox() {
    markAllRead();              // 点信箱：先标已读再跳 account.html#inbox
    unreadIds = [];
    lastUnread = 0;
    setBadge(0);
    location.href = 'account.html#inbox';
  }
  function announce(n) {
    if (!window.ygLive) return;
    window.ygLive.tip({
      key: TIP_KEY,
      cls: 'mb-tip',                                // 独立于账户页 6s 提示：本横幅 1.5s、置于导航下方
      text: n > 1 ? ('✦ 收到 ' + n + ' 封新的微光来信') : '✦ 收到新的微光来信',
      dur: 1500,
      onClick: function () { openInbox(); }          // 点横幅直达信箱
    });
  }
  function tick() {
    if (!logged()) { dropFab(); return; }
    if (apiBusy) return;
    apiBusy = true;
    api({ op: 'inbox' }).then(function (r) {
      if (!r || !r.ok || !r.items) return;
      var unread = 0, ids = [];
      r.items.forEach(function (it) {
        if (!it.read) { unread++; ids.push(it.id); }
      });
      var inc = 0;
      if (lastUnread >= 0 && unread > lastUnread) inc = unread - lastUnread;  // 未读比上次增加
      unreadIds = ids;
      lastUnread = unread;
      ensureFab();
      setBadge(unread);
      if (inc > 0) announce(inc);
    }).catch(function () { /* 网络失败静默，下一轮再试 */ })
      .then(function () { apiBusy = false; });
  }
  function start() {
    if (!logged()) return;
    ensureFab();
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(tick, 20000);
    tick();
  }
  window.addEventListener('yg:login', function () { lastUnread = -1; start(); });
  // 右上用户菜单退出登录（同页不刷新时）立即移除信箱钮
  document.addEventListener('click', function (e) {
    var out = e.target && e.target.closest ? e.target.closest('#menuOut') : null;
    if (out) dropFab();
  });
  start();
})();

/* ============================================================
   G 组：微光粒子（鸿蒙式指针光效）——全屏 fixed canvas，pointer-events:none 不挡交互
   桌面 pointermove/down 节流 ~30ms；移动端仅 touch 且更低频省电；
   prefers-reduced-motion 或非指针设备自动禁用；随页面加载只建一次
   ============================================================ */
(function initDustFX() {
  if (document.getElementById('ygFX')) return;        // 页面切换后清理防重复（每次加载新建）
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (rm && rm.matches) return;
  var hasPointer = 'PointerEvent' in window;
  var hasTouch = 'ontouchstart' in window;
  if (!hasPointer && !hasTouch) return;
  var touchish = hasTouch;                            // 移动端：低频少量，省电
  var cv = document.createElement('canvas');
  cv.id = 'ygFX';
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  var W = 0, H = 0;
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.floor(W * DPR);
    cv.height = Math.floor(H * DPR);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size();
  window.addEventListener('resize', size);
  var parts = [];
  var CAP = touchish ? 16 : 44;
  var COLORS = ['#e3c47c', '#fff6e0', '#ffe9ad'];
  var lastMove = 0, lastDown = 0, raf = 0;
  function push(p) {
    if (parts.length >= CAP) parts.shift();
    parts.push(p);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function spawnAt(x, y, n, isDown) {
    var now = Date.now();
    var gap = isDown ? (touchish ? 260 : 120) : (touchish ? 120 : 34);   // ~30ms 级节流
    var ref = isDown ? lastDown : lastMove;
    if (now - ref < gap) return;
    if (isDown) lastDown = now; else lastMove = now;
    for (var i = 0; i < n; i++) {
      push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.55,
        vy: -(0.25 + Math.random() * 0.9),
        life: 1,
        decay: 0.008 + Math.random() * 0.012,          // 约 0.6–1s 淡出
        r: 0.8 + Math.random() * 1.7,
        star: Math.random() < 0.3,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }
  function spawnMove(x, y) {
    spawnAt(x, y, touchish ? 1 : 1 + Math.floor(Math.random() * 2), false);   // 1–3 粒
  }
  function spawnDown(x, y) {
    spawnAt(x, y, touchish ? 1 : 2 + Math.floor(Math.random() * 2), true);
  }
  if (hasPointer) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;           // 触屏交给下方 touchmove 低频路径
      spawnMove(e.clientX, e.clientY);
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      spawnDown(e.clientX, e.clientY);
    }, { passive: true });
  } else {
    window.addEventListener('mousemove', function (e) { spawnMove(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('mousedown', function (e) { spawnDown(e.clientX, e.clientY); }, { passive: true });
  }
  if (hasTouch) {
    window.addEventListener('touchmove', function (e) {
      var t = e.touches && e.touches[0];
      if (t) spawnMove(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0];
      if (t) spawnDown(t.clientX, t.clientY);
    }, { passive: true });
  }
  function loop() {
    raf = 0;
    ctx.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, p.life) * 0.9;
      ctx.fillStyle = p.c;
      if (p.star) {
        var s = p.r * 2.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - s);
        ctx.quadraticCurveTo(p.x + s * 0.22, p.y - s * 0.22, p.x + s, p.y);
        ctx.quadraticCurveTo(p.x + s * 0.22, p.y + s * 0.22, p.x, p.y + s);
        ctx.quadraticCurveTo(p.x - s * 0.22, p.y + s * 0.22, p.x - s, p.y);
        ctx.quadraticCurveTo(p.x - s * 0.22, p.y - s * 0.22, p.x, p.y - s);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.length) raf = requestAnimationFrame(loop);
  }
})();

/* ===== 心跳：登录后每 60s 上报活跃，后台“最后活跃”随之刷新 ===== */
(function () {
  var cfg = window.SUPABASE || {};
  if (!cfg.url) return;
  function beat() {
    if (document.hidden) return;
    var tk = localStorage.getItem('yg_token');
    if (!tk) return;
    fetch(cfg.url + '/functions/v1/account-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sess': tk },
      body: JSON.stringify({ op: 'touch' })
    }).catch(function () {});
  }
  var iv = setInterval(function () {
    if (localStorage.getItem('yg_token')) { beat(); clearInterval(iv); setInterval(beat, 60000); }
  }, 2500);
})();

/* ===== 标题与网址根 ===== */
(function () {
  if (document.title.indexOf('予光') === -1) document.title = '予光 · ' + document.title;
  if (/^https?:$/.test(location.protocol)) {
    setTimeout(function () {
      try {
        var base = '/';
        if (location.pathname.indexOf('/yuguang/') === 0) base = '/yuguang/';
        if (location.pathname !== base && location.search === '' && location.hash === '') {
          history.replaceState(null, '', base);
        }
      } catch (e) {}
    }, 700);
  }
})();
