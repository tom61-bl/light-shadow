/* ============================================================
   Ch03 · 暗色调主义 Tenebrism — 聚光灯模拟器（精致静物版）
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

  const W = 720, H = 420;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  let spotX = 360, spotY = 210, spotR = 160;

  // 精致静物绘制
  function drawStillLife(ctx) {
    // 桌面
    const tableY = 340;
    const tg = ctx.createLinearGradient(0, tableY, 0, H);
    tg.addColorStop(0, '#3a3025');
    tg.addColorStop(1, '#1a1510');
    ctx.fillStyle = tg;
    ctx.fillRect(0, tableY, W, H - tableY);
    // 桌面边缘
    ctx.fillStyle = '#2a221a';
    ctx.fillRect(0, tableY, W, 4);

    // 书（底层）
    ctx.fillStyle = '#5a3a2a';
    ctx.fillRect(140, 310, 160, 30);
    ctx.fillStyle = '#6a4a35';
    ctx.fillRect(140, 306, 160, 6);
    ctx.fillStyle = '#3a2518';
    ctx.fillRect(140, 310, 8, 30);

    // 花瓶（优雅曲线）
    const vx = 220, vy = 310;
    ctx.fillStyle = '#4a6070';
    ctx.beginPath();
    ctx.moveTo(vx - 18, vy);
    ctx.bezierCurveTo(vx - 42, vy - 40, vx - 35, vy - 80, vx - 15, vy - 100);
    ctx.lineTo(vx - 12, vy - 115);
    ctx.lineTo(vx + 12, vy - 115);
    ctx.lineTo(vx + 15, vy - 100);
    ctx.bezierCurveTo(vx + 35, vy - 80, vx + 42, vy - 40, vx + 18, vy);
    ctx.closePath();
    ctx.fill();
    // 花瓶高光
    ctx.fillStyle = 'rgba(200,220,235,0.25)';
    ctx.beginPath();
    ctx.ellipse(vx - 12, vy - 60, 6, 30, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 花（简单的几朵）
    ctx.strokeStyle = '#3a5a30';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, vy - 115);
    ctx.quadraticCurveTo(vx - 15, vy - 140, vx - 25, vy - 155);
    ctx.moveTo(vx, vy - 115);
    ctx.quadraticCurveTo(vx + 10, vy - 145, vx + 20, vy - 160);
    ctx.stroke();
    ctx.fillStyle = '#c47080';
    ctx.beginPath(); ctx.arc(vx - 25, vy - 155, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d4a050';
    ctx.beginPath(); ctx.arc(vx + 20, vy - 160, 7, 0, Math.PI * 2); ctx.fill();

    // 苹果
    const ax = 400, ay = 300;
    ctx.fillStyle = '#8a2a2a';
    ctx.beginPath();
    ctx.arc(ax, ay, 26, 0, Math.PI * 2);
    ctx.fill();
    // 苹果高光
    ctx.fillStyle = 'rgba(255,180,180,0.35)';
    ctx.beginPath();
    ctx.ellipse(ax - 8, ay - 10, 8, 12, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // 苹果柄
    ctx.strokeStyle = '#4a3020';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ax, ay - 24);
    ctx.quadraticCurveTo(ax + 3, ay - 35, ax + 8, ay - 38);
    ctx.stroke();
    // 叶子
    ctx.fillStyle = '#4a6a30';
    ctx.beginPath();
    ctx.ellipse(ax + 12, ay - 36, 8, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 高脚杯
    const gx = 510, gy = 310;
    ctx.fillStyle = 'rgba(180,200,220,0.35)';
    // 杯肚
    ctx.beginPath();
    ctx.moveTo(gx - 22, gy - 70);
    ctx.quadraticCurveTo(gx - 28, gy - 40, gx - 18, gy - 20);
    ctx.lineTo(gx + 18, gy - 20);
    ctx.quadraticCurveTo(gx + 28, gy - 40, gx + 22, gy - 70);
    ctx.closePath();
    ctx.fill();
    // 杯脚
    ctx.fillRect(gx - 2, gy - 20, 4, 20);
    // 杯底
    ctx.beginPath();
    ctx.ellipse(gx, gy, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // 杯中酒
    ctx.fillStyle = 'rgba(140,40,40,0.5)';
    ctx.beginPath();
    ctx.moveTo(gx - 20, gy - 50);
    ctx.quadraticCurveTo(gx - 24, gy - 35, gx - 16, gy - 22);
    ctx.lineTo(gx + 16, gy - 22);
    ctx.quadraticCurveTo(gx + 24, gy - 35, gx + 20, gy - 50);
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    const ctx = cv.ctx;
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // 离屏画完整静物
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    drawStillLife(octx);

    // 光斑遮罩
    octx.globalCompositeOperation = 'destination-in';
    const grad = octx.createRadialGradient(spotX, spotY, spotR * 0.1, spotX, spotY, spotR);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    octx.fillStyle = grad;
    octx.fillRect(0, 0, W, H);

    ctx.drawImage(off, 0, 0);

    // 光斑边缘暖光晕
    const halo = ctx.createRadialGradient(spotX, spotY, spotR * 0.8, spotX, spotY, spotR * 1.15);
    halo.addColorStop(0, 'rgba(245,215,142,0)');
    halo.addColorStop(1, 'rgba(245,215,142,0.12)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
  }

  draw();

  let dragging = false;
  function getPos(e) {
    const rect = cv.canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (W / rect.width), y: (e.clientY - rect.top) * (H / rect.height) };
  }
  cv.canvas.addEventListener('mousedown', function (e) { dragging = true; const p = getPos(e); spotX = p.x; spotY = p.y; draw(); });
  cv.canvas.addEventListener('mousemove', function (e) { if (dragging) { const p = getPos(e); spotX = p.x; spotY = p.y; draw(); } });
  window.addEventListener('mouseup', function () { dragging = false; });

  host.appendChild(makeSlider({
    min: 60, max: 300, value: spotR,
    label: '光斑大小',
    display: function (v) { return v + 'px'; },
    onInput: function (v) { spotR = v; draw(); }
  }));

  const note = document.createElement('div');
  note.className = 'grid grid-2';
  note.style.marginTop = '22px';
  [['卡拉瓦乔 · 冷暗', '阴影偏冷、近黑，对比强烈，制造对峙与戏剧张力。光像刀一样切开黑暗。'],
   ['伦勃朗 · 暖暗', '阴影偏暖（赭石+焦褐），包裹感强，制造亲密与内省。光像炉火一样柔和。']
  ].forEach(function (c) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>' + c[0] + '</h3><p>' + c[1] + '</p>';
    note.appendChild(card);
  });
  host.appendChild(note);
})();
