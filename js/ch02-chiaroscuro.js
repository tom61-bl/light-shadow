/* ============================================================
   Ch02 · 明暗法 Chiaroscuro — 球体光影五要素
   ============================================================ */
(function () {
  document.getElementById('chiaroscuro-desc').innerHTML =
    '明暗法（Chiaroscuro，意大利语“明-暗”）是<strong>用光影在平面上塑造体积</strong>的技法。' +
    '文艺复兴时期的画家发现，只要控制好一个物体上的明暗层次，平面的画布就能产生立体感。' +
    '一个球体上的光影可以拆成<strong>五个要素</strong>。拖动光源角度，观察它们如何移动。';

  const stage = document.getElementById('tenebrism-stage') ? null : document.getElementById('chiaroscuro-stage');
  const host = document.getElementById('chiaroscuro-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '球体光影五要素 · 改变光源角度与色温';
  host.appendChild(title);

  const W = 720, H = 420;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  let angle = 200; // 光源角度（度）
  let warm = true; // 暖光/冷光

  // 逐像素绘制球体
  function draw() {
    const ctx = cv.ctx;
    ctx.fillStyle = '#0d0c0b';
    ctx.fillRect(0, 0, W, H);

    const cx = 300, cy = 210, r = 130;
    // 光源位置
    const rad = angle * Math.PI / 180;
    const lx = cx + Math.cos(rad) * 320;
    const ly = cy + Math.sin(rad) * 320;

    // 光色
    const lightCol = warm ? [255, 228, 170] : [180, 205, 255];
    const ambientCol = warm ? [60, 45, 30] : [30, 40, 65];

    // 逐像素
    const img = ctx.createImageData(W, H);
    const data = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx = x - cx, dy = y - cy;
        const d2 = dx * dx + dy * dy;
        const i = (y * W + x) * 4;
        if (d2 <= r * r) {
          // 球面法线
          const nz = Math.sqrt(r * r - d2);
          // 光源方向
          let ldx = lx - cx, ldy = ly - cy, ldz = 260;
          const ll = Math.hypot(ldx, ldy, ldz);
          ldx /= ll; ldy /= ll; ldz /= ll;
          // 法线归一化
          const nnl = Math.hypot(dx, dy, nz);
          const nx = dx / nnl, ny = dy / nnl, nnz = nz / nnl;
          // 漫反射
          let diff = Math.max(0, nx * ldx + ny * ldy + nnz * ldz);
          // 高光（视线沿 z 轴）
          const viewDot = nnz;
          let spec = 0;
          if (diff > 0) {
            const refDot = nx * ldx + ny * ldy + nnz * ldz;
            // Blinn-Phong 半程向量
            const hx = ldx, hy = ldy, hz = ldz + 1;
            const hl = Math.hypot(hx, hy, hz);
            spec = Math.pow(Math.max(0, nx * hx / hl + ny * hy / hl + nnz * hz / hl), 24);
          }
          // 反射光（从下方/环境反弹，弱）
          const bounce = Math.max(0, -ny) * 0.18;

          const base = ambientCol;
          let rr = base[0] + lightCol[0] * (diff * 0.85 + bounce);
          let gg = base[1] + lightCol[1] * (diff * 0.85 + bounce);
          let bb = base[2] + lightCol[2] * (diff * 0.85 + bounce);
          rr += spec * 255; gg += spec * 255; bb += spec * 255;

          data[i] = Math.min(255, rr);
          data[i + 1] = Math.min(255, gg);
          data[i + 2] = Math.min(255, bb);
          data[i + 3] = 255;
        } else {
          data[i + 3] = 255;
          // 背景
          data[i] = 13; data[i + 1] = 12; data[i + 2] = 11;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // 投影：光源反方向的椭圆
    const shRad = Math.PI + rad;
    const shX = cx + Math.cos(shRad) * 40;
    const shY = cy + r + 18;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(shX, shY, 120, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 光源
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 30);
    glow.addColorStop(0, warm ? 'rgba(255,228,170,0.9)' : 'rgba(180,205,255,0.9)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx, ly, 30, 0, Math.PI * 2);
    ctx.fill();

    // 五要素标注（高光、中间调、明暗交界、反射光、投影）
    ctx.font = '13px sans-serif';
    // 标注位置沿光源方向
    function pt(off, fac) {
      return [cx + Math.cos(rad) * fac, cy + Math.sin(rad) * fac];
    }
    const labels = [
      ['① 高光', cx + Math.cos(rad) * 70, cy + Math.sin(rad) * 70],
      ['② 中间调', cx + Math.cos(rad) * 10, cy + Math.sin(rad) * 10 + 90],
      ['③ 明暗交界线', cx - Math.cos(rad) * 95, cy - Math.sin(rad) * 95],
      ['④ 反射光', cx - Math.cos(rad) * 70, cy - Math.sin(rad) * 70 + 90],
      ['⑤ 投影', shX, shY + 40]
    ];
    ctx.fillStyle = 'rgba(245,215,142,0.9)';
    labels.forEach(function (l) {
      ctx.fillText(l[0], l[1] - 24, l[2]);
    });
  }

  draw();

  // 光源角度滑块
  const slider = makeSlider({
    min: 0, max: 360, value: angle,
    label: '光源角度',
    display: function (v) { return v + '°'; },
    onInput: function (v) { angle = v; draw(); }
  });
  host.appendChild(slider);

  // 色温切换
  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'text-align:center;margin-top:10px;';
  const bWarm = document.createElement('button');
  bWarm.className = 'btn' + (warm ? ' active' : '');
  bWarm.textContent = '伦勃朗 · 暖光';
  const bCool = document.createElement('button');
  bCool.className = 'btn' + (!warm ? ' active' : '');
  bCool.textContent = '卡拉瓦乔 · 冷光';
  bWarm.onclick = function () {
    warm = true; bWarm.classList.add('active'); bCool.classList.remove('active'); draw();
  };
  bCool.onclick = function () {
    warm = false; bCool.classList.add('active'); bWarm.classList.remove('active'); draw();
  };
  btnWrap.appendChild(bWarm);
  btnWrap.appendChild(bCool);
  host.appendChild(btnWrap);

  // 五要素说明
  const notes = document.createElement('div');
  notes.className = 'grid grid-3';
  notes.style.marginTop = '24px';
  const items = [
    ['① 高光', '光直接反射最强的点，最亮'],
    ['② 中间调', '受光但不是直射，灰面'],
    ['③ 明暗交界线', '受光与背光的分界，最暗'],
    ['④ 反射光', '环境反弹的弱光，让暗部透气'],
    ['⑤ 投影', '物体挡住光，落在承接面上'],
    ['核心', '五要素齐全，体积感就成立']
  ];
  items.forEach(function (it) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + it[0] + '</h3><p>' + it[1] + '</p>';
    notes.appendChild(c);
  });
  host.appendChild(notes);
})();
