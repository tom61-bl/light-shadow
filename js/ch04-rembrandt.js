/* ============================================================
   Ch04 · 伦勃朗光 — 人脸布光，寻找倒三角光斑
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

  const W = 720, H = 420;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 光源：水平角度（0正面~90侧面），高度（0平视~60高）
  let hAng = 45, vAng = 35;
  let status = document.createElement('div');

  function draw() {
    const ctx = cv.ctx;
    ctx.fillStyle = '#0d0c0b';
    ctx.fillRect(0, 0, W, H);

    const cx = 360, cy = 210;

    // 画脸（离屏，先画完整亮脸，再叠加阴影）
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const f = off.getContext('2d');

    // 脖子
    f.fillStyle = '#b89577';
    f.fillRect(cx - 38, cy + 110, 76, 60);
    // 脸（椭圆）
    const skin = f.createRadialGradient(cx - 20, cy - 30, 30, cx, cy, 150);
    skin.addColorStop(0, '#e8c9a8');
    skin.addColorStop(1, '#c49a76');
    f.fillStyle = skin;
    f.beginPath();
    f.ellipse(cx, cy, 110, 140, 0, 0, Math.PI * 2);
    f.fill();

    // 五官
    f.fillStyle = '#3a2a20';
    // 眼睛
    f.beginPath(); f.ellipse(cx - 40, cy - 30, 13, 7, 0, 0, Math.PI * 2); f.fill();
    f.beginPath(); f.ellipse(cx + 40, cy - 30, 13, 7, 0, 0, Math.PI * 2); f.fill();
    // 眼白高光
    f.fillStyle = '#fff';
    f.beginPath(); f.arc(cx - 42, cy - 32, 3, 0, Math.PI * 2); f.fill();
    f.beginPath(); f.arc(cx + 38, cy - 32, 3, 0, Math.PI * 2); f.fill();
    // 眉毛
    f.strokeStyle = '#4a3528'; f.lineWidth = 5;
    f.beginPath(); f.moveTo(cx - 55, cy - 52); f.quadraticCurveTo(cx - 40, cy - 60, cx - 25, cy - 52); f.stroke();
    f.beginPath(); f.moveTo(cx + 25, cy - 52); f.quadraticCurveTo(cx + 40, cy - 60, cx + 55, cy - 52); f.stroke();
    // 鼻子
    f.strokeStyle = 'rgba(90,60,40,0.6)'; f.lineWidth = 3;
    f.beginPath(); f.moveTo(cx, cy - 15); f.lineTo(cx - 8, cy + 25); f.lineTo(cx + 8, cy + 25); f.stroke();
    // 嘴
    f.fillStyle = '#9a5a4a';
    f.beginPath(); f.ellipse(cx, cy + 65, 28, 9, 0, 0, Math.PI * 2); f.fill();

    // ===== 叠加阴影 =====
    // 阴影侧：假设光源在右侧（hAng 表示灯在右侧的角度）
    // 阴影从左侧进入，覆盖脸的左半，留倒三角
    const side = 1; // 固定灯在右侧，阴影在左侧
    const sh = f.createLinearGradient(cx - 110, 0, cx + 110, 0);
    // 阴影强度随水平角度
    const strength = hAng / 90;
    const boundary = cx - 40 + (1 - strength) * 120; // 明暗交界位置
    sh.addColorStop(0, 'rgba(10,8,6,' + (0.75 * strength) + ')');
    sh.addColorStop(Math.max(0, (boundary - (cx - 110)) / 220), 'rgba(10,8,6,' + (0.6 * strength) + ')');
    sh.addColorStop(1, 'rgba(10,8,6,0)');
    f.fillStyle = sh;
    f.beginPath();
    f.ellipse(cx, cy, 110, 140, 0, 0, Math.PI * 2);
    f.fill();

    // 鼻子的阴影（向阴影侧、向下），随高度
    f.fillStyle = 'rgba(20,15,10,' + (0.5 * strength) + ')';
    f.beginPath();
    f.moveTo(cx - 2, cy - 10);
    f.quadraticCurveTo(cx - 30, cy + 10 + vAng * 0.5, cx - 22, cy + 40 + vAng * 0.4);
    f.lineTo(cx + 5, cy + 35);
    f.closePath();
    f.fill();

    // 倒三角亮斑（阴影侧脸颊、眼睛下方）
    // 当伦勃朗光条件满足时，这个三角形亮着
    const isRembrandt = hAng >= 35 && hAng <= 60 && vAng >= 25 && vAng <= 50;
    if (isRembrandt) {
      // 用“擦除”阴影的方式在左脸颊画倒三角
      f.save();
      f.globalCompositeOperation = 'destination-out';
      const tx = cx - 42, ty = cy + 5;
      f.beginPath();
      f.moveTo(tx - 18, ty);
      f.lineTo(tx + 18, ty);
      f.lineTo(tx, ty + 28);
      f.closePath();
      f.fill();
      f.restore();
      // 重新在该位置补一点肤色（因为擦除会透明）
      f.fillStyle = 'rgba(220,185,150,0.95)';
      f.beginPath();
      f.moveTo(tx - 18, ty);
      f.lineTo(tx + 18, ty);
      f.lineTo(tx, ty + 28);
      f.closePath();
      f.fill();
      // 描边标注倒三角
      f.strokeStyle = 'rgba(245,215,142,0.9)';
      f.lineWidth = 2;
      f.beginPath();
      f.moveTo(tx - 18, ty);
      f.lineTo(tx + 18, ty);
      f.lineTo(tx, ty + 28);
      f.closePath();
      f.stroke();
    }

    ctx.drawImage(off, 0, 0);

    // 光源示意（右上角）
    const lx = cx + Math.cos((90 - hAng) * Math.PI / 180) * 200 + 100;
    const ly = cy - vAng * 3 - 40;
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 26);
    glow.addColorStop(0, 'rgba(255,235,190,0.95)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(lx, ly, 26, 0, Math.PI * 2); ctx.fill();

    // 状态文字
    ctx.fillStyle = isRembrandt ? '#f5d78e' : 'rgba(232,226,213,0.5)';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText(isRembrandt ? '✓ 伦勃朗光达成：倒三角光斑已出现' : '继续调整：灯在侧前方约45°，略高于眼睛', cx, 30);
    ctx.textAlign = 'left';
  }

  draw();

  // 水平角度
  host.appendChild(makeSlider({
    min: 0, max: 90, value: hAng,
    label: '光源水平角度（正面→侧面）',
    display: function (v) { return v + '°'; },
    onInput: function (v) { hAng = v; draw(); }
  }));
  // 高度
  host.appendChild(makeSlider({
    min: 0, max: 60, value: vAng,
    label: '光源高度（平视→偏高）',
    display: function (v) { return v + '°'; },
    onInput: function (v) { vAng = v; draw(); }
  }));

  // 其他布光方式对比
  const patterns = document.createElement('div');
  patterns.className = 'grid grid-2';
  patterns.style.marginTop = '22px';
  const ps = [
    ['蝴蝶光', '灯在正前方高处，鼻子下出现蝴蝶形阴影，显瘦、 glamour 感。'],
    ['环形光', '比伦勃朗光弱，鼻子阴影不与脸颊连接，形成一个小环。'],
    ['分割光', '灯在正侧面，脸被明暗对半切，强烈、戏剧、男性化。'],
    ['伦勃朗光', '侧上方45°，倒三角光斑，立体、经典、最通用。']
  ];
  ps.forEach(function (p) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + p[0] + '</h3><p>' + p[1] + '</p>';
    patterns.appendChild(c);
  });
  host.appendChild(patterns);
})();
