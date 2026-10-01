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

    // 一个静物（花瓶），明暗随影调
    const cx = 250, cy = 190;
    const objDark = Math.max(10, base - 120);
    const objLight = Math.min(255, base + 30);
    // 花瓶
    const vg = ctx.createLinearGradient(cx - 40, 0, cx + 40, 0);
    vg.addColorStop(0, 'rgb(' + objDark + ',' + (objDark - 5) + ',' + (objDark - 10) + ')');
    vg.addColorStop(0.5, 'rgb(' + objLight + ',' + (objLight - 5) + ',' + (objLight - 15) + ')');
    vg.addColorStop(1, 'rgb(' + objDark + ',' + (objDark - 5) + ',' + (objDark - 10) + ')');
    ctx.fillStyle = vg;
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy - 90);
    ctx.quadraticCurveTo(cx - 50, cy - 40, cx - 38, cy + 60);
    ctx.quadraticCurveTo(cx, cy + 90, cx + 38, cy + 60);
    ctx.quadraticCurveTo(cx + 50, cy - 40, cx + 22, cy - 90);
    ctx.closePath();
    ctx.fill();
    // 桌面
    ctx.fillStyle = 'rgb(' + Math.max(10, base - 40) + ',' + Math.max(10, base - 42) + ',' + Math.max(10, base - 48) + ')';
    ctx.fillRect(0, cy + 80, W, H);

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
