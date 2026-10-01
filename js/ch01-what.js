/* ============================================================
   Ch01 · 光是什么 — 手电筒投影模拟器
   ============================================================ */
(function () {
  // 描述
  document.getElementById('what-desc').innerHTML =
    '光沿<strong>直线</strong>传播，是一种能量。我们之所以能看见物体的形状、颜色，' +
    '是因为光照射到物体上，再反射进我们的眼睛。<strong>当光被不透明的物体挡住，' +
    '墙上就会出现影子。</strong>拖动下面的手电筒，看看影子怎么变化。';

  const stage = document.getElementById('what-stage');
  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '手电筒模拟器 · 拖动光源';
  stage.appendChild(title);

  const W = 720, H = 360;
  const cv = makeCanvas(W, H);
  stage.appendChild(cv.canvas);

  // 光源位置（可拖动）
  let lightY = 120;
  // 遮挡物（固定在中间）
  const obj = { x: 380, y: 150, w: 24, h: 150 };
  // 墙
  const wallX = 660;

  function draw() {
    const ctx = cv.ctx;
    // 背景（暗房）
    ctx.fillStyle = '#0d0c0b';
    ctx.fillRect(0, 0, W, H);

    // 墙
    ctx.fillStyle = '#1c1a17';
    ctx.fillRect(wallX, 0, W - wallX, H);

    // 光源（手电筒）
    const lampX = 60;
    const glow = ctx.createRadialGradient(lampX, lightY, 2, lampX, lightY, 40);
    glow.addColorStop(0, 'rgba(255,235,180,0.9)');
    glow.addColorStop(1, 'rgba(255,235,180,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lampX, lightY, 40, 0, Math.PI * 2);
    ctx.fill();

    // 手电筒本体
    ctx.fillStyle = '#3a352d';
    ctx.fillRect(lampX - 14, lightY - 10, 18, 20);
    ctx.fillStyle = '#f5d78e';
    ctx.beginPath();
    ctx.arc(lampX + 4, lightY, 6, 0, Math.PI * 2);
    ctx.fill();

    // 光束：从光源向墙发出，被遮挡物挡住
    // 计算遮挡物上下边缘的切线
    // 光源 (lampX, lightY)，遮挡物 (obj.x, obj.y)~(obj.x+obj.w, obj.y+obj.h)
    // 光线到达墙 wallX
    function wallY(srcY, edgeX, edgeY) {
      const t = (wallX - lampX) / (edgeX - lampX);
      return srcY + (edgeY - srcY) * t;
    }

    // 光束的扇形范围（整个手电筒照亮区域）
    const topSpread = lightY - 320;
    const botSpread = lightY + 320;

    // 画照亮区域（墙前面的光）
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lampX, lightY);
    ctx.lineTo(wallX, topSpread);
    ctx.lineTo(wallX, botSpread);
    ctx.closePath();
    const beam = ctx.createLinearGradient(lampX, 0, wallX, 0);
    beam.addColorStop(0, 'rgba(245,215,142,0.18)');
    beam.addColorStop(1, 'rgba(245,215,142,0.04)');
    ctx.fillStyle = beam;
    ctx.fill();
    ctx.restore();

    // 影子：遮挡物挡住的部分
    // 经过遮挡物上边缘的光线
    const shadowTop = wallY(lightY, obj.x, obj.y);
    const shadowBot = wallY(lightY, obj.x, obj.y + obj.h);

    // 墙上的影子（未被照亮的区域）
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(wallX, shadowTop, W - wallX, shadowBot - shadowTop);

    // 影子边缘的光线（被遮挡物边缘切出的边界）
    ctx.strokeStyle = 'rgba(245,215,142,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lampX, lightY);
    ctx.lineTo(wallX, shadowTop);
    ctx.moveTo(lampX, lightY);
    ctx.lineTo(wallX, shadowBot);
    ctx.stroke();

    // 遮挡物
    ctx.fillStyle = '#2a2722';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    ctx.strokeStyle = 'rgba(245,215,142,0.15)';
    ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

    // 标注
    ctx.fillStyle = 'rgba(232,226,213,0.5)';
    ctx.font = '12px sans-serif';
    ctx.fillText('光源', lampX - 12, lightY - 22);
    ctx.fillText('遮挡物', obj.x - 8, obj.y - 10);
    ctx.fillText('墙（影子）', wallX + 6, 24);
  }

  draw();

  // 拖动光源
  let dragging = false;
  function getPos(e) {
    const rect = cv.canvas.getBoundingClientRect();
    const scale = W / rect.width;
    return (e.clientY - rect.top) * scale;
  }
  cv.canvas.addEventListener('mousedown', function (e) {
    const y = getPos(e);
    if (Math.abs(y - lightY) < 60) dragging = true;
  });
  cv.canvas.addEventListener('mousemove', function (e) {
    if (dragging) {
      lightY = Math.max(20, Math.min(H - 20, getPos(e)));
      draw();
    }
  });
  window.addEventListener('mouseup', function () { dragging = false; });

  // 提示
  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:13px;color:var(--text-faint);margin-top:14px;text-align:center;';
  hint.textContent = '光源越靠近遮挡物边缘，影子越长；光源正对遮挡物，影子最短。';
  stage.appendChild(hint);
})();
