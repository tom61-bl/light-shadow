/* ============================================================
   Ch01 · 光是什么 — 手电筒投影模拟器（光源自由移动）
   ============================================================ */
(function () {
  document.getElementById('what-desc').innerHTML =
    '光沿<strong>直线</strong>传播，是一种能量。我们之所以能看见物体的形状、颜色，' +
    '是因为光照射到物体上，再反射进我们的眼睛。<strong>当光被不透明的物体挡住，' +
    '墙上就会出现影子。</strong>拖动手电筒（上下左右自由移动），看看影子怎么变化。';

  const host = document.getElementById('what-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '手电筒模拟器 · 拖动光源（上下左右）';
  host.appendChild(title);

  const W = 720, H = 360;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 光源位置（可自由移动）
  let lx = 80, ly = 120;
  // 遮挡物
  const obj = { x: 380, y: 140, w: 22, h: 160 };
  // 墙
  const wallX = 660;

  function draw() {
    const ctx = cv.ctx;
    ctx.fillStyle = '#0d0c0b';
    ctx.fillRect(0, 0, W, H);

    // 墙
    ctx.fillStyle = '#1c1a17';
    ctx.fillRect(wallX, 0, W - wallX, H);

    // 计算遮挡物边缘光线到达墙的位置
    function wallY(edgeY) {
      const t = (wallX - lx) / (obj.x - lx);
      return ly + (edgeY - ly) * t;
    }
    const shTop = wallY(obj.y);
    const shBot = wallY(obj.y + obj.h);

    // 光束扇形（从光源到墙，有扩散）
    const spread = 280;
    const beamTop = ly - spread;
    const beamBot = ly + spread;

    // 照亮区域
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(wallX, beamTop);
    ctx.lineTo(wallX, beamBot);
    ctx.closePath();
    const beam = ctx.createLinearGradient(lx, 0, wallX, 0);
    beam.addColorStop(0, 'rgba(245,215,142,0.2)');
    beam.addColorStop(1, 'rgba(245,215,142,0.05)');
    ctx.fillStyle = beam;
    ctx.fill();
    ctx.restore();

    // 墙上的影子
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(wallX, Math.max(0, shTop), W - wallX, Math.min(H, shBot) - Math.max(0, shTop));

    // 遮挡物边缘的光线（切线）
    ctx.strokeStyle = 'rgba(245,215,142,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(wallX, shTop);
    ctx.moveTo(lx, ly);
    ctx.lineTo(wallX, shBot);
    ctx.stroke();

    // 遮挡物
    ctx.fillStyle = '#2a2722';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    ctx.strokeStyle = 'rgba(245,215,142,0.15)';
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

    // 手电筒（光源）
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 42);
    glow.addColorStop(0, 'rgba(255,235,180,0.95)');
    glow.addColorStop(1, 'rgba(255,235,180,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(lx, ly, 42, 0, Math.PI * 2); ctx.fill();

    // 手电筒本体（朝向遮挡物）
    const ang = Math.atan2(obj.y + obj.h / 2 - ly, obj.x - lx);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(ang);
    ctx.fillStyle = '#3a352d';
    ctx.fillRect(-16, -9, 20, 18);
    ctx.fillStyle = '#f5d78e';
    ctx.beginPath(); ctx.arc(4, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // 标注
    ctx.fillStyle = 'rgba(232,226,213,0.5)';
    ctx.font = '12px sans-serif';
    ctx.fillText('光源（可拖动）', lx - 30, ly - 30);
    ctx.fillText('遮挡物', obj.x - 6, obj.y - 10);
    ctx.fillText('墙（影子）', wallX + 6, 24);
  }

  draw();

  // 拖动光源（上下左右）
  let dragging = false;
  function getPos(e) {
    const rect = cv.canvas.getBoundingClientRect();
    const sx = W / rect.width, sy = H / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }
  cv.canvas.addEventListener('mousedown', function (e) {
    const p = getPos(e);
    if (Math.hypot(p.x - lx, p.y - ly) < 60) dragging = true;
  });
  cv.canvas.addEventListener('mousemove', function (e) {
    if (dragging) {
      const p = getPos(e);
      lx = Math.max(20, Math.min(obj.x - 60, p.x));
      ly = Math.max(20, Math.min(H - 20, p.y));
      draw();
    }
  });
  window.addEventListener('mouseup', function () { dragging = false; });

  // 触摸支持
  cv.canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const t = e.touches[0];
    const p = getPos(t);
    if (Math.hypot(p.x - lx, p.y - ly) < 80) dragging = true;
  });
  cv.canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (dragging) {
      const t = e.touches[0];
      const p = getPos(t);
      lx = Math.max(20, Math.min(obj.x - 60, p.x));
      ly = Math.max(20, Math.min(H - 20, p.y));
      draw();
    }
  });
  cv.canvas.addEventListener('touchend', function () { dragging = false; });

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:13px;color:var(--text-faint);margin-top:14px;text-align:center;';
  hint.textContent = '光源越靠近遮挡物，影子越大；光源正对遮挡物中心，影子最短。';
  host.appendChild(hint);
})();
