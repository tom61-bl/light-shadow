/* ============================================================
   Ch08 · 高调与低调 — 影调滑块 + 直方图
   ============================================================ */
(function () {
  document.getElementById('key-desc').innerHTML =
    '影调（Key）指一幅画面<strong>整体的明暗倾向</strong>。<strong>高调（High Key）</strong>画面明亮、' +
    '阴影少、通透轻盈；<strong>低调（Low Key）</strong>画面暗沉、阴影重、神秘有张力。' +
    '直方图显示了像素在明暗上的分布——高调集中在右，低调集中在左。拖动滑块，同时看画面和直方图。';

  const host = document.getElementById('key-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '影调调节 · 高调 ↔ 低调';
  host.appendChild(title);

  const W = 720, H = 340;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 影调：0 低调 ~ 1 高调
  let key = 0.85;

  function draw() {
    const ctx = cv.ctx;
    // 基础亮度
    const base = 20 + key * 215;
    // 背景
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgb(' + (base + 15) + ',' + (base + 15) + ',' + (base + 12) + ')');
    bg.addColorStop(1, 'rgb(' + base + ',' + base + ',' + (base - 3) + ')');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 精致静物（花瓶 + 花）
    const cx = 240, cy = 200;
    const objDark = Math.max(10, base - 120);
    const objLight = Math.min(255, base + 30);
    const flowerDark = Math.max(15, base - 100);
    const flowerLight = Math.min(255, base + 20);

    // 桌面
    ctx.fillStyle = 'rgb(' + Math.max(10, base - 40) + ',' + Math.max(10, base - 42) + ',' + Math.max(10, base - 48) + ')';
    ctx.fillRect(0, cy + 85, W, H);
    // 桌面边缘线
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, cy + 85, W, 3);

    // 花瓶（优雅曲线：细颈、圆肚、收底）
    const vg = ctx.createLinearGradient(cx - 45, 0, cx + 45, 0);
    vg.addColorStop(0, 'rgb(' + objDark + ',' + (objDark - 5) + ',' + (objDark - 10) + ')');
    vg.addColorStop(0.4, 'rgb(' + objLight + ',' + (objLight - 5) + ',' + (objLight - 15) + ')');
    vg.addColorStop(0.6, 'rgb(' + (objLight - 10) + ',' + (objLight - 15) + ',' + (objLight - 25) + ')');
    vg.addColorStop(1, 'rgb(' + objDark + ',' + (objDark - 5) + ',' + (objDark - 10) + ')');
    ctx.fillStyle = vg;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 80); // 瓶口左
    ctx.lineTo(cx - 14, cy - 60); // 瓶颈
    ctx.bezierCurveTo(cx - 45, cy - 45, cx - 52, cy + 10, cx - 38, cy + 55); // 左肚
    ctx.quadraticCurveTo(cx - 30, cy + 75, cx, cy + 78); // 底左
    ctx.quadraticCurveTo(cx + 30, cy + 75, cx + 38, cy + 55); // 底右
    ctx.bezierCurveTo(cx + 52, cy + 10, cx + 45, cy - 45, cx + 14, cy - 60); // 右肚
    ctx.lineTo(cx + 14, cy - 80); // 瓶颈右
    ctx.closePath();
    ctx.fill();
    // 瓶口
    ctx.fillStyle = 'rgb(' + Math.max(5, objDark - 20) + ',' + Math.max(5, objDark - 25) + ',' + Math.max(5, objDark - 30) + ')';
    ctx.fillRect(cx - 14, cy - 82, 28, 5);
    // 花瓶高光
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx - 22, cy - 10, 7, 35, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // 花茎
    ctx.strokeStyle = 'rgb(' + Math.max(20, base - 80) + ',' + Math.max(30, base - 60) + ',' + Math.max(15, base - 100) + ')';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 78);
    ctx.quadraticCurveTo(cx - 25, cy - 110, cx - 40, cy - 140);
    ctx.moveTo(cx + 3, cy - 78);
    ctx.quadraticCurveTo(cx + 15, cy - 115, cx + 10, cy - 150);
    ctx.moveTo(cx, cy - 78);
    ctx.quadraticCurveTo(cx + 5, cy - 105, cx - 5, cy - 135);
    ctx.stroke();

    // 叶子
    ctx.fillStyle = 'rgb(' + Math.max(25, base - 70) + ',' + Math.max(40, base - 50) + ',' + Math.max(20, base - 90) + ')';
    ctx.beginPath();
    ctx.ellipse(cx - 28, cy - 105, 10, 5, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 12, cy - 115, 9, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 花（三朵：玫瑰形）
    function flower(fx, fy, size, col) {
      ctx.fillStyle = col;
      // 外层花瓣
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a) * size * 0.5, fy + Math.sin(a) * size * 0.5, size * 0.45, size * 0.3, a, 0, Math.PI * 2);
        ctx.fill();
      }
      // 中心
      ctx.fillStyle = 'rgb(' + Math.max(10, flowerDark - 10) + ',' + Math.max(8, flowerDark - 15) + ',' + Math.max(5, flowerDark - 20) + ')';
      ctx.beginPath();
      ctx.arc(fx, fy, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const roseCol = 'rgb(' + Math.round(lerp2(flowerDark, flowerLight + 40, 0.6)) + ',' +
      Math.round(lerp2(flowerDark, flowerLight - 20, 0.4)) + ',' +
      Math.round(lerp2(flowerDark, flowerLight - 10, 0.5)) + ')';
    flower(cx - 40, cy - 145, 16, roseCol);
    flower(cx + 10, cy - 155, 14, roseCol);
    flower(cx - 5, cy - 138, 12, roseCol);

    // ===== 直方图（右侧区域）=====
    const histX = 460, histY = 60, histW = 220, histH = 200;
    // 底
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(histX, histY, histW, histH);
    // 生成亮度分布（高斯，均值随 key）
    const mean = 30 + key * 200;
    const spread = 25 + Math.abs(key - 0.5) * 20;
    const bins = new Array(64).fill(0);
    let maxBin = 0;
    for (let i = 0; i < 64; i++) {
      const v = i / 63 * 255;
      bins[i] = Math.exp(-((v - mean) ** 2) / (2 * spread * spread));
      maxBin = Math.max(maxBin, bins[i]);
    }
    // 画
    const bw = histW / 64;
    for (let i = 0; i < 64; i++) {
      const bh = bins[i] / maxBin * (histH - 10);
      const shade = i / 63 * 255;
      ctx.fillStyle = 'rgb(' + shade + ',' + shade + ',' + shade + ')';
      ctx.fillRect(histX + i * bw, histY + histH - bh, bw - 0.5, bh);
    }
    // 直方图边框
    ctx.strokeStyle = 'rgba(245,215,142,0.4)';
    ctx.strokeRect(histX, histY, histW, histH);
    ctx.fillStyle = 'rgba(245,215,142,0.8)';
    ctx.font = '12px sans-serif';
    ctx.fillText('直方图', histX, histY - 8);
    ctx.fillText('暗', histX, histY + histH + 18);
    ctx.fillText('亮', histX + histW - 14, histY + histH + 18);

    // 状态
    ctx.fillStyle = key > 0.65 ? '#8a6a30' : '#d4a857';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    let msg;
    if (key > 0.7) msg = '高调 High Key：明亮通透，阴影少';
    else if (key < 0.35) msg = '低调 Low Key：暗沉神秘，对比强';
    else msg = '中间调：明暗均衡，最写实';
    ctx.fillText(msg, W / 2, 28);
    ctx.textAlign = 'left';
  }

  draw();

  host.appendChild(makeSlider({
    min: 0, max: 1, step: 0.01, value: key,
    label: '影调',
    display: function (v) { return v > 0.7 ? '高调' : v < 0.35 ? '低调' : '中间调'; },
    onInput: function (v) { key = v; draw(); }
  }));

  // 风格配对
  const cards = document.createElement('div');
  cards.className = 'grid grid-2';
  cards.style.marginTop = '22px';
  const items = [
    ['高调 · 用在哪里', '清新、母婴、美妆、喜剧、日系、电商主图。传递干净、轻盈、积极。'],
    ['低调 · 用在哪里', '电影感、悬疑、奢侈品、男装、酒类、夜景。传递高级、神秘、情绪。'],
    ['直方图怎么读', '山峰靠左=偏暗，靠右=偏亮，铺满=对比强，挤在中间=反差低、发灰。'],
    ['为什么“发灰”不好', '像素都挤在中间、缺少纯黑和纯白，画面就灰蒙蒙、不通透——拉大明暗对比即可解决。']
  ];
  items.forEach(function (it) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + it[0] + '</h3><p>' + it[1] + '</p>';
    cards.appendChild(c);
  });
  host.appendChild(cards);
})();
