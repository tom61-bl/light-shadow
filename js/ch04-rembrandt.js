/* ============================================================
   Ch04 · 伦勃朗光 — 精致人脸布光
   ============================================================ */
(function () {
  document.getElementById('rembrandt-desc').innerHTML =
    '伦勃朗光是<strong>最实用、最经典的人像布光</strong>，只用一盏灯就能让扁平的脸变得立体。' +
    '把主灯放在人物侧前方约 45°、略高于眼睛的位置，让鼻子的阴影和脸颊的阴影连接起来，' +
    '在<strong>阴影侧脸颊、眼睛下方围出一个小的倒三角形光斑</strong>——这就是它的标志。' +
    '调整光源，直到三角形出现。';

  const host = document.getElementById('rembrandt-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '人像布光 · 调整光源角度与高度';
  host.appendChild(title);

  const W = 720, H = 460;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  let hAng = 45, vAng = 35;

  // 画精致人脸（基础亮脸）
  function drawFace(ctx, cx, cy) {
    // 脖子
    ctx.fillStyle = '#b89577';
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy + 100);
    ctx.lineTo(cx - 40, cy + 170);
    ctx.lineTo(cx + 40, cy + 170);
    ctx.lineTo(cx + 32, cy + 100);
    ctx.closePath();
    ctx.fill();

    // 肩膀/衣服
    ctx.fillStyle = '#3a3530';
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy + 200);
    ctx.quadraticCurveTo(cx - 60, cy + 150, cx, cy + 155);
    ctx.quadraticCurveTo(cx + 60, cy + 150, cx + 120, cy + 200);
    ctx.lineTo(cx + 120, cy + 230);
    ctx.lineTo(cx - 120, cy + 230);
    ctx.closePath();
    ctx.fill();
    // 衣领
    ctx.fillStyle = '#2a2520';
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + 160);
    ctx.lineTo(cx, cy + 185);
    ctx.lineTo(cx + 35, cy + 160);
    ctx.lineTo(cx + 25, cy + 155);
    ctx.lineTo(cx, cy + 170);
    ctx.lineTo(cx - 25, cy + 155);
    ctx.closePath();
    ctx.fill();

    // 脸（有下巴的脸型）
    const skin = ctx.createRadialGradient(cx - 15, cy - 40, 20, cx, cy + 20, 160);
    skin.addColorStop(0, '#e8c9a8');
    skin.addColorStop(0.6, '#d4a87e');
    skin.addColorStop(1, '#b8906a');
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130); // 头顶
    ctx.bezierCurveTo(cx + 80, cy - 130, cx + 100, cy - 70, cx + 95, cy - 20); // 右额
    ctx.bezierCurveTo(cx + 92, cy + 30, cx + 70, cy + 70, cx + 45, cy + 95); // 右颊
    ctx.quadraticCurveTo(cx + 25, cy + 115, cx, cy + 118); // 右下巴
    ctx.quadraticCurveTo(cx - 25, cy + 115, cx - 45, cy + 95); // 左下巴
    ctx.bezierCurveTo(cx - 70, cy + 70, cx - 92, cy + 30, cx - 95, cy - 20); // 左颊
    ctx.bezierCurveTo(cx - 100, cy - 70, cx - 80, cy - 130, cx, cy - 130); // 左额
    ctx.closePath();
    ctx.fill();

    // 头发（短发，覆盖额头和两侧）
    ctx.fillStyle = '#2a1f15';
    ctx.beginPath();
    ctx.moveTo(cx - 95, cy - 30);
    ctx.bezierCurveTo(cx - 100, cy - 100, cx - 60, cy - 145, cx, cy - 140);
    ctx.bezierCurveTo(cx + 60, cy - 145, cx + 100, cy - 100, cx + 95, cy - 30);
    ctx.bezierCurveTo(cx + 80, cy - 60, cx + 50, cy - 80, cx + 20, cy - 75);
    ctx.quadraticCurveTo(cx, cy - 65, cx - 20, cy - 75);
    ctx.bezierCurveTo(cx - 50, cy - 80, cx - 80, cy - 60, cx - 95, cy - 30);
    ctx.closePath();
    ctx.fill();
    // 发丝高光
    ctx.strokeStyle = 'rgba(120,90,60,0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const ox = cx - 70 + i * 13;
      ctx.beginPath();
      ctx.moveTo(ox, cy - 120);
      ctx.quadraticCurveTo(ox + 5, cy - 100, ox + 3, cy - 80);
      ctx.stroke();
    }

    // 眉毛
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy - 55);
    ctx.quadraticCurveTo(cx - 40, cy - 65, cx - 22, cy - 58);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 22, cy - 58);
    ctx.quadraticCurveTo(cx + 40, cy - 65, cx + 55, cy - 55);
    ctx.stroke();

    // 眼睛（杏仁形）
    function eye(ex, ey) {
      // 眼白
      ctx.fillStyle = '#f0e8e0';
      ctx.beginPath();
      ctx.moveTo(ex - 16, ey);
      ctx.quadraticCurveTo(ex - 8, ey - 9, ex, ey - 8);
      ctx.quadraticCurveTo(ex + 8, ey - 9, ex + 16, ey);
      ctx.quadraticCurveTo(ex + 8, ey + 7, ex, ey + 7);
      ctx.quadraticCurveTo(ex - 8, ey + 7, ex - 16, ey);
      ctx.closePath();
      ctx.fill();
      // 虹膜
      ctx.fillStyle = '#5a4030';
      ctx.beginPath(); ctx.arc(ex, ey - 1, 7, 0, Math.PI * 2); ctx.fill();
      // 瞳孔
      ctx.fillStyle = '#1a1008';
      ctx.beginPath(); ctx.arc(ex, ey - 1, 3.5, 0, Math.PI * 2); ctx.fill();
      // 高光
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(ex - 2, ey - 3, 1.8, 0, Math.PI * 2); ctx.fill();
      // 上眼线
      ctx.strokeStyle = '#2a1a10';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ex - 16, ey);
      ctx.quadraticCurveTo(ex - 8, ey - 9, ex, ey - 8);
      ctx.quadraticCurveTo(ex + 8, ey - 9, ex + 16, ey);
      ctx.stroke();
      // 睫毛
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const lx = ex - 10 + i * 7;
        ctx.beginPath();
        ctx.moveTo(lx, ey - 7);
        ctx.lineTo(lx - 1, ey - 12);
        ctx.stroke();
      }
    }
    eye(cx - 35, cy - 30);
    eye(cx + 35, cy - 30);

    // 鼻子（用阴影表现）
    ctx.strokeStyle = 'rgba(120,80,50,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy - 15);
    ctx.lineTo(cx - 8, cy + 20);
    ctx.stroke();
    // 鼻翼
    ctx.fillStyle = 'rgba(120,80,50,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx - 10, cy + 25, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 10, cy + 25, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // 鼻尖高光
    ctx.fillStyle = 'rgba(255,230,200,0.4)';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy + 18, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 嘴巴
    ctx.fillStyle = '#a06050';
    // 上唇（有唇峰）
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy + 55);
    ctx.quadraticCurveTo(cx - 12, cy + 48, cx - 6, cy + 52);
    ctx.quadraticCurveTo(cx, cy + 46, cx + 6, cy + 52);
    ctx.quadraticCurveTo(cx + 12, cy + 48, cx + 22, cy + 55);
    ctx.quadraticCurveTo(cx + 10, cy + 62, cx, cy + 60);
    ctx.quadraticCurveTo(cx - 10, cy + 62, cx - 22, cy + 55);
    ctx.closePath();
    ctx.fill();
    // 下唇
    ctx.fillStyle = '#b07060';
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 60);
    ctx.quadraticCurveTo(cx, cy + 75, cx + 20, cy + 60);
    ctx.quadraticCurveTo(cx, cy + 68, cx - 20, cy + 60);
    ctx.closePath();
    ctx.fill();
    // 唇缝
    ctx.strokeStyle = '#704030';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 58);
    ctx.quadraticCurveTo(cx, cy + 62, cx + 20, cy + 58);
    ctx.stroke();
    // 上唇高光
    ctx.fillStyle = 'rgba(255,200,190,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx - 8, cy + 53, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 耳朵
    ctx.fillStyle = '#c49a76';
    ctx.beginPath();
    ctx.ellipse(cx - 92, cy + 5, 10, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 92, cy + 5, 10, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    const ctx = cv.ctx;
    ctx.fillStyle = '#0d0c0b';
    ctx.fillRect(0, 0, W, H);

    const cx = 360, cy = 220;

    // 离屏画脸
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const f = off.getContext('2d');
    drawFace(f, cx, cy);

    // 叠加阴影（从左侧，因为灯在右侧）
    const strength = hAng / 90;
    const boundary = cx - 30 + (1 - strength) * 110;
    const sh = f.createLinearGradient(cx - 110, 0, cx + 110, 0);
    sh.addColorStop(0, 'rgba(8,6,4,' + (0.78 * strength) + ')');
    sh.addColorStop(Math.max(0.01, (boundary - (cx - 110)) / 220), 'rgba(8,6,4,' + (0.6 * strength) + ')');
    sh.addColorStop(1, 'rgba(8,6,4,0)');
    f.fillStyle = sh;
    f.beginPath();
    f.ellipse(cx, cy, 110, 140, 0, 0, Math.PI * 2);
    f.fill();

    // 鼻子阴影
    f.fillStyle = 'rgba(15,10,6,' + (0.45 * strength) + ')';
    f.beginPath();
    f.moveTo(cx - 2, cy - 12);
    f.quadraticCurveTo(cx - 28, cy + 8 + vAng * 0.4, cx - 20, cy + 38 + vAng * 0.3);
    f.lineTo(cx + 4, cy + 32);
    f.closePath();
    f.fill();

    // 伦勃朗倒三角亮斑
    const isRem = hAng >= 35 && hAng <= 60 && vAng >= 25 && vAng <= 50;
    if (isRem) {
      f.save();
      f.globalCompositeOperation = 'destination-out';
      const tx = cx - 38, ty = cy + 2;
      f.beginPath();
      f.moveTo(tx - 16, ty);
      f.lineTo(tx + 16, ty);
      f.lineTo(tx, ty + 26);
      f.closePath();
      f.fill();
      f.restore();
      f.fillStyle = 'rgba(215,180,145,0.92)';
      f.beginPath();
      f.moveTo(tx - 16, ty);
      f.lineTo(tx + 16, ty);
      f.lineTo(tx, ty + 26);
      f.closePath();
      f.fill();
      f.strokeStyle = 'rgba(245,215,142,0.95)';
      f.lineWidth = 2;
      f.beginPath();
      f.moveTo(tx - 16, ty); f.lineTo(tx + 16, ty); f.lineTo(tx, ty + 26); f.closePath();
      f.stroke();
    }

    ctx.drawImage(off, 0, 0);

    // 光源示意
    const lx = cx + Math.cos((90 - hAng) * Math.PI / 180) * 190 + 80;
    const ly = cy - vAng * 2.8 - 30;
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 24);
    glow.addColorStop(0, 'rgba(255,235,190,0.95)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(lx, ly, 24, 0, Math.PI * 2); ctx.fill();

    // 状态
    ctx.fillStyle = isRem ? '#f5d78e' : 'rgba(232,226,213,0.5)';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText(isRem ? '✓ 伦勃朗光达成：倒三角光斑已出现' : '继续调整：灯在侧前方约45°，略高于眼睛', W / 2, 28);
    ctx.textAlign = 'left';
  }

  draw();

  host.appendChild(makeSlider({
    min: 0, max: 90, value: hAng,
    label: '光源水平角度（正面→侧面）',
    display: function (v) { return v + '°'; },
    onInput: function (v) { hAng = v; draw(); }
  }));
  host.appendChild(makeSlider({
    min: 0, max: 60, value: vAng,
    label: '光源高度（平视→偏高）',
    display: function (v) { return v + '°'; },
    onInput: function (v) { vAng = v; draw(); }
  }));

  const patterns = document.createElement('div');
  patterns.className = 'grid grid-2';
  patterns.style.marginTop = '22px';
  [['蝴蝶光', '灯在正前方高处，鼻子下出现蝴蝶形阴影，显瘦、glamour 感。'],
   ['环形光', '比伦勃朗光弱，鼻子阴影不与脸颊连接，形成一个小环。'],
   ['分割光', '灯在正侧面，脸被明暗对半切，强烈、戏剧、男性化。'],
   ['伦勃朗光', '侧上方45°，倒三角光斑，立体、经典、最通用。']
  ].forEach(function (p) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + p[0] + '</h3><p>' + p[1] + '</p>';
    patterns.appendChild(c);
  });
  host.appendChild(patterns);
})();
