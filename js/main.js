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

// 光集：客户作品图片库（图片存放 site/img/customers/，条目在此登记，页面自动陈列）
// 未来接入 Supabase 后可由 gallery 表驱动：sb('gallery?select=*&order=sort')
const GALLERY_ITEMS = [
  {
    src: 'img/customers/示例图片.jpg',
    name: '巳蛇 · 离光',
    tag: '东方线 · 示例',
    story: '示例客户作品：本命火 · 离卦，红纹石主石。正式上线后这里将按客户授权展出真实作品。',
    quote: '「安静炽烈，你的光不喧哗，但没人能忽略。」',
  },
  {
    src: 'img/customers/customer-2.jpg',
    name: '等待她的光',
    tag: '西方线',
    story: '她的星座主石正在路上——放入图片并在 GALLERY_ITEMS 登记后即自动展出。',
    quote: '「你的光在深处，等一个愿意走进来的人。」',
  },
  {
    src: 'img/customers/customer-3.jpg',
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
    if (Math.random() < 0.3) {
      meteors.push({
        x: Math.random() * W * 0.9,
        y: Math.random() * H * 0.45,
        vx: 5.5 + Math.random() * 6,
        vy: 3 + Math.random() * 3.4,
        life: 0.82,
      });
    }
  }
  let meteorTimer = 90; // 开场约 1.5 秒后出现第一颗
  const meteorInterval = 1500; // 流星收尾与下一颗之间的间隔基准

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

/* ---------- 导航 ---------- */
(function initNav() {
  const nav = $('nav');
  const menuBtn = $('menuBtn');
  const navLinks = $('navLinks');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
})();

/* ---------- 滚动渐亮 ---------- */
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
  els.forEach((el) => io.observe(el));
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

  // 填充下拉
  fillSelect($('eastZodiac'), Object.keys(ZODIAC).map((k) => [k, k + ' · ' + ZODIAC[k].el + '行']));
  fillSelect($('eastGua'), GUAS.map((g, i) => [String(i), g[0] + '　' + g[2]]));
  fillSelect($('westSun'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));
  fillSelect($('westMoon'), Object.keys(MOON).map((k) => [k, k]));
  fillSelect($('unionA'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));
  fillSelect($('unionB'), Object.keys(SUN).map((k) => [k, k + ' ' + GLYPH[k]]));

  if ($('eastGua')) $('eastGua').selectedIndex = 2; // 默认离卦，与示例一致
  if ($('eastZodiac')) $('eastZodiac').value = '巳蛇';

  // 谱系切换
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      $('panel-' + btn.dataset.panel).classList.add('active');
      render();
      // 由 #east/#west/#union 锚点进入时，滚动到工坊区
      if (location.hash.slice(1) === btn.dataset.panel) {
        setTimeout(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });
  });

  // 锚点直达
  const hashPanel = { east: 'east', west: 'west', union: 'union' }[location.hash.slice(1)];
  if (hashPanel) {
    const btn = document.querySelector('.tab-btn[data-panel="' + hashPanel + '"]');
    if (btn) btn.click();
  }

  // 变更重绘
  root.querySelectorAll('select').forEach((sel) => sel.addEventListener('change', render));

  // 保存（原型示意）
  const saveBtn = $('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      alert('原型示意：已加入礼盒 ✦\n正式版将进入：确认订单信息 → 下单 → 夜蓝礼盒收货仪式。\n（本原型不收集任何信息，不算命、不承诺效果）');
    });
  }

  render();

  /* ----- 渲染 ----- */
  function render() {
    const active = document.querySelector('.tab-btn.active');
    if (!active) return;
    if (active.dataset.panel === 'east') renderEast();
    else if (active.dataset.panel === 'west') renderWest();
    else renderUnion();
  }

  function setStone(colorA, colorB) {
    const stone = $('stone');
    if (!stone) return;
    if (colorB) {
      stone.style.background = 'radial-gradient(circle at 35% 32%, ' + colorA + ', ' + colorB + ' 85%)';
    } else {
      stone.style.background = 'radial-gradient(circle at 35% 32%, ' + colorA + ', #0b0e17 78%)';
    }
    stone.style.setProperty('--stone-glow', colorA);
  }

  function renderEast() {
    const z = $('eastZodiac').value;
    const guaIdx = Number($('eastGua').value);
    const metal = $('metalEast').value;
    const info = ZODIAC[z];
    const gua = GUAS[guaIdx];
    const stones = ELEMENT_STONES[info.el];
    const main = stones[0];

    $('eastElement').textContent = '本命五行：' + info.el + ' · 主石建议：' + stones.map((s) => s[0]).join(' / ');
    $('pName').textContent = z + ' · ' + gua[0].split(' · ')[0] + '光';
    $('pSub').textContent = 'EAST · 生肖五行';
    $('rMain').textContent = main[0] + '（本命' + info.el + ' · ' + z + '）';
    $('rAux').textContent = stones[1][0] + '（' + info.el + '色系辅光）';
    $('rMetal').textContent = metal;
    $('rChain').textContent = '生肖暗刻 · 手作';
    $('rGlyph').textContent = gua[1] + ' ' + gua[0];
    $('pLight').textContent = info.quote + '　' + gua[2];
    setStone(main[1]);
  }

  function renderWest() {
    const sun = $('westSun').value;
    const moonKey = $('westMoon').value;
    const rising = $('westRising').value.split(' · ')[0];
    const metal = $('metalWest').value;
    const s = SUN[sun];
    const m = MOON[moonKey];

    $('pName').textContent = sun + ' · ' + moonKey.slice(0, 2) + '月';
    $('pSub').textContent = 'WEST · 三盘一线';
    $('rMain').textContent = s.stone[0] + '（太阳 · 本我）';
    $('rAux').textContent = m[0] + '（月亮 · 情绪）';
    $('rMetal').textContent = metal;
    $('rChain').textContent = rising + '（上升 · 外壳）';
    $('rGlyph').textContent = GLYPH[sun] + ' 月亮符号 ☽';
    $('pLight').textContent = s.quote;
    setStone(s.stone[1]);
  }

  function renderUnion() {
    const a = SUN[$('unionA').value];
    const b = SUN[$('unionB').value];
    const clasp = $('unionClasp').value.split(' · ')[0];
    const metal = $('metalUnion').value;

    $('pName').textContent = '双生 · ' + clasp;
    $('pSub').textContent = 'UNION · 两个人的光';
    $('rMain').textContent = a.stone[0] + '（我的光）';
    $('rAux').textContent = b.stone[0] + '（你的光）';
    $('rMetal').textContent = metal;
    $('rChain').textContent = '互扣 · ' + clasp;
    $('rGlyph').textContent = '☀ + ☾';
    $('pLight').textContent = a.quote + '　' + b.quote + '　两个人的光，合起来是一轮满月。各自佩戴时，你们都是完整的自己。';
    setStone(a.stone[1], b.stone[1]);
  }
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
