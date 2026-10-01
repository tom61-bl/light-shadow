/* ============================================================
   Ch03 · 暗色调主义 Tenebrism — 聚光灯模拟器
   ============================================================ */
(function () {
  document.getElementById('tenebrism-desc').innerHTML =
    '暗色调主义（Tenebrism）是明暗法的<strong>极端形式</strong>，由卡拉瓦乔推向极致：' +
    '画面的大部分没入几乎完全的黑暗，只有一小部分被一束剧场般的强光照亮。' +
    '黑暗不再是背景，而是<strong>主动引导注意力的工具</strong>——光打在哪里，你就看哪里。' +
    '拖动光斑，调整它的大小。';

  const host = document.getElementById('tenebrism-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '聚光灯模拟器 · 拖动光斑照亮静物';
  host.appendChild(title);

  const W = 720, H = 400;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 光斑
  let spotX = 360, spotY = 220, spotR = 150;

  // 静物（暗室里的几何物体，位置固定）
  const objects = [
    { type: 'rect', x: 180, y: 240, w: 90, h: 110, c: '#5a4a38' },
    { type: 'circle', x: 360, y: 270, r: 70, c: '#3e5060' },
    { type: 'rect', x: 480, y: 200, w: 70, h: 150, c: '#5a3a3a' },
    { type: 'circle', x: 120, y: 300, r: 45, c: '#4a5a3e' },
    { type: 'rect', x: 580, y: 280, w: 80, h: 70, c: '#4a4a5a' }
  ];

  function draw() {
    const ctx = cv.ctx;
    // 全黑
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // 先画完整场景到离屏
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    // 地面
    octx.fillStyle = '#1a1714';
    octx.fillRect(0, 340, W, 60);
    // 静物
    objects.forEach(function (o) {
      octx.fillStyle = o.c;
      if (o.type === 'rect') {
        octx.fillRect(o.x, o.y, o.w, o.h);
      } else {
        octx.beginPath();
        octx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        octx.fill();
      }
      // 简单明暗
      octx.fillStyle = 'rgba(0,0,0,0.3)';
      if (o.type === 'rect') octx.fillRect(o.x, o.y, o.w, o.h / 2);
    });

    // 用光斑作为遮罩：只显示光斑内的场景
    // 方法：画光斑渐变，destination-in
    octx.globalCompositeOperation = 'destination-in';
    const grad = octx.createRadialGradient(spotX, spotY, spotR * 0.1, spotX, spotY, spotR);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    octx.fillStyle = grad;
    octx.fillRect(0, 0, W, H);

    ctx.drawImage(off, 0, 0);

    // 光斑边缘的微弱光晕（暖光）
    const halo = ctx.createRadialGradient(spotX, spotY, spotR * 0.8, spotX, spotY, spotR * 1.15);
    halo.addColorStop(0, 'rgba(245,215,142,0)');
    halo.addColorStop(1, 'rgba(245,215,142,0.12)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
  }

  draw();

  // 拖动光斑
  let dragging = false;
  function getPos(e) {
    const rect = cv.canvas.getBoundingClientRect();
    const sx = W / rect.width, sy = H / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }
  cv.canvas.addEventListener('mousedown', function (e) { dragging = true; const p = getPos(e); spotX = p.x; spotY = p.y; draw(); });
  cv.canvas.addEventListener('mousemove', function (e) {
    if (dragging) { const p = getPos(e); spotX = p.x; spotY = p.y; draw(); }
  });
  window.addEventListener('mouseup', function () { dragging = false; });

  // 光斑大小
  const rSlider = makeSlider({
    min: 60, max: 280, value: spotR,
    label: '光斑大小',
    display: function (v) { return v + 'px'; },
    onInput: function (v) { spotR = v; draw(); }
  });
  host.appendChild(rSlider);

  // 对比：卡拉瓦乔 vs 伦勃朗
  const note = document.createElement('div');
  note.className = 'grid grid-2';
  note.style.marginTop = '22px';
  const cmp = [
    ['卡拉瓦乔 · 冷暗', '阴影偏冷、近黑，对比强烈，制造对峙与戏剧张力。光像刀一样切开黑暗。'],
    ['伦勃朗 · 暖暗', '阴影偏暖（赭石+焦褐），包裹感强，制造亲密与内省。光像炉火一样柔和。']
  ];
  cmp.forEach(function (c) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>' + c[0] + '</h3><p>' + c[1] + '</p>';
    note.appendChild(card);
  });
  host.appendChild(note);
})();
