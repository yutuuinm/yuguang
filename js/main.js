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
    syncOrderItem();
  }

  function syncOrderItem() {
    var inp = document.getElementById("orderItems");
    if (!inp) return;
    try {
      inp.value = JSON.stringify([{ name: $('pName').textContent, sub: $('pSub').textContent, main: $('rMain').textContent, aux: $('rAux').textContent, metal: $('rMetal').textContent, chain: $('rChain').textContent, quote: $('pLight').textContent }]);
    } catch (e) {}
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

/* ---------- 互动：拈一签 · 答案之书 · 微光转盘 ---------- */
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
          if (status) status.textContent = (table === 'orders' ? '已收到你的定制意向 ✦ 我们将在 1 个工作日内与你二次确认后制作。' : '已收到你的留言 ✦ 我们会在 1 个工作日内回复。');
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
  function draw(rows) {
    if (!rows || !rows.length) {
      grid.innerHTML = '<p class="section-sub" style="margin:10px auto 0;">（暂无可展示商品；接入商品数据后此处自动陈列）</p>';
      return;
    }
    grid.innerHTML = rows.map(function (p) {
      var src = window.sbImg ? window.sbImg(p.image_url) : (p.image_url || '');
      return '<div class="g-card reveal">' +
        '<div class="g-img">' +
          '<img src="' + src + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';">' +
          '<div class="ph">商品图占位</div>' +
        '</div>' +
        '<div class="g-cap">' +
          '<div class="g-name">' + p.name + '</div>' +
          '<span class="g-tag">' + (SERIES[p.series] || p.series || '') + '</span>' +
          '<p class="g-story">' + (p.main_stone ? '主石：' + p.main_stone : '') + (p.price_yuan ? ' · ¥' + p.price_yuan + ' 起' : '') + '</p>' +
          (p.quote ? '<div class="g-quote">' + p.quote + '</div>' : '') +
        '</div>' +
        '<div style="padding:0 18px 18px;"><a class="btn-ghost" style="width:100%;text-align:center;font-size:13px;padding:8px 0;" href="studio.html">去定制同款</a></div>' +
      '</div>';
    }).join('');
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

/* ---------- AI 光语助手（悬浮对话 + 星图志选石；未加载配置时自动降级） ---------- */
(function initAi() {
  // 右下角悬浮助手
  if (window.sbAI && !document.getElementById('aiFab')) {
    var root = document.createElement('div');
    root.className = 'ai-widget';
    root.innerHTML =
      '<button type="button" class="ai-fab" id="aiFab">✨ 光语助手</button>' +
      '<div class="ai-panel" id="aiPanel">' +
        '<div class="ai-head">予光 · 光语助手<span class="ai-close" id="aiClose">✕</span></div>' +
        '<div class="ai-body" id="aiBody"><p class="ai-tip">问我定制流程、功能用法、晶石意象，或只是想聊聊。文化意象仅供参考，不构成任何承诺。</p></div>' +
        '<div class="ai-foot"><input id="aiInput" placeholder="输入你的问题…" autocomplete="off"><button type="button" id="aiSend">发送</button></div>' +
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
          else addMsg('（AI 暂时走神了，稍后再试；急事可加客服微信）', 'ai');
        })
        .catch(function () {
          if (bodyEl.contains(wait)) bodyEl.removeChild(wait);
          addMsg('（网络开了个小差，稍后再试）', 'ai');
        });
    }
    fab.addEventListener('click', function () { open = !open; root.classList.toggle('open', open); if (open) inp.focus(); });
    closeBtn.addEventListener('click', function () { open = false; root.classList.remove('open'); });
    sendBtn.addEventListener('click', ask);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(); });
  }

  // 星图志「AI 帮你选石」
  var needBtn = document.getElementById('aiStonesBtn');
  var needInp = document.getElementById('aiNeed');
  var needRes = document.getElementById('aiStonesRes');
  if (needBtn && needInp && needRes) {
    if (!window.sbAI) {
      needBtn.disabled = true;
      needRes.textContent = '（离线版暂不可用，请访问线上版使用 AI）';
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
