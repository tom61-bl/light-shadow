/* ============================================================
   Ch02 · 明暗法 Chiaroscuro — 球体光影五要素（精修版）
   ============================================================ */
(function () {
  document.getElementById('chiaroscuro-desc').innerHTML =
    '明暗法（Chiaroscuro，意大利语“明-暗”）是<strong>用光影在平面上塑造体积</strong>的技法。' +
    '文艺复兴时期的画家发现，只要控制好一个物体上的明暗层次，平面的画布就能产生立体感。' +
    '一个球体上的光影可以拆成<strong>五个要素</strong>。拖动光源角度，观察它们如何移动。';

  const host = document.getElementById('chiaroscuro-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '球体光影五要素 · 改变光源角度与色温';
  host.appendChild(title);

  const W = 720, H = 440;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  let angle = 200;
  let warm = true;

  function draw() {
    const ctx = cv.ctx;
    // 精致背景：暗房径向渐变
    const bg = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 500);
    bg.addColorStop(0, '#141210');
    bg.addColorStop(1, '#080706');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const cx = 310, cy = 220, r = 120;
    const rad = angle * Math.PI / 180;
    const lx = cx + Math.cos(rad) * 300;
    const ly = cy + Math.sin(rad) * 300;

    const lightCol = warm ? [255, 228, 170] : [180, 205, 255];
    const ambientCol = warm ? [55, 42, 28] : [28, 38, 62];

    // 逐像素球体
    const img = ctx.createImageData(W, H);
    const data = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx = x - cx, dy = y - cy;
        const d2 = dx * dx + dy * dy;
        const i = (y * W + x) * 4;
        if (d2 <= r * r) {
          const nz = Math.sqrt(r * r - d2);
          let ldx = lx - cx, ldy = ly - cy, ldz = 260;
          const ll = Math.hypot(ldx, ldy, ldz);
          ldx /= ll; ldy /= ll; ldz /= ll;
          const nnl = Math.hypot(dx, dy, nz);
          const nx = dx / nnl, ny = dy / nnl, nnz = nz / nnl;
          let diff = Math.max(0, nx * ldx + ny * ldy + nnz * ldz);
          const hx = ldx, hy = ldy, hz = ldz + 1;
          const hl = Math.hypot(hx, hy, hz);
          let spec = Math.pow(Math.max(0, nx * hx / hl + ny * hy / hl + nnz * hz / hl), 28);
          const bounce = Math.max(0, -ny) * 0.16;
          let rr = ambientCol[0] + lightCol[0] * (diff * 0.85 + bounce);
          let gg = ambientCol[1] + lightCol[1] * (diff * 0.85 + bounce);
          let bb = ambientCol[2] + lightCol[2] * (diff * 0.85 + bounce);
          rr += spec * 255; gg += spec * 255; bb += spec * 255;
          data[i] = Math.min(255, rr);
          data[i + 1] = Math.min(255, gg);
          data[i + 2] = Math.min(255, bb);
          data[i + 3] = 255;
        } else {
          data[i + 3] = 0; // 透明，让背景透出来
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // 精致底座（圆形台座）
    const baseY = cy + r + 8;
    const baseGrad = ctx.createLinearGradient(0, baseY, 0, baseY + 30);
    baseGrad.addColorStop(0, '#3a352d');
    baseGrad.addColorStop(1, '#1a1815');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.ellipse(cx, baseY + 25, 150, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // 底座顶面
    ctx.fillStyle = '#4a443a';
    ctx.beginPath();
    ctx.ellipse(cx, baseY, 150, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a2722';
    ctx.beginPath();
    ctx.ellipse(cx, baseY, 130, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 投影（在底座上）
    const shRad = Math.PI + rad;
    const shX = cx + Math.cos(shRad) * 35;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(shX, baseY + 2, 100, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 光源
    const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 28);
    glow.addColorStop(0, warm ? 'rgba(255,228,170,0.95)' : 'rgba(180,205,255,0.95)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(lx, ly, 28, 0, Math.PI * 2); ctx.fill();

    // 五要素标注（精致引线 + 圆点）
    function label(text, px, py, tx, ty) {
      ctx.strokeStyle = 'rgba(245,215,142,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.fillStyle = '#f5d78e';
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = '13px serif';
      ctx.fillStyle = 'rgba(245,215,142,0.92)';
      ctx.fillText(text, tx + 6, ty + 4);
    }
    const dirX = Math.cos(rad), dirY = Math.sin(rad);
    label('① 高光', cx + dirX * 65, cy + dirY * 65, 520, 80);
    label('② 中间调', cx + dirX * 20, cy + dirY * 20 + 60, 520, 130);
    label('③ 明暗交界线', cx - dirX * 90, cy - dirY * 90, 520, 180);
    label('④ 反射光', cx - dirX * 60, cy - dirY * 60 + 70, 520, 230);
    label('⑤ 投影', shX, baseY + 2, 520, 290);
  }

  draw();

  host.appendChild(makeSlider({
    min: 0, max: 360, value: angle,
    label: '光源角度',
    display: function (v) { return v + '°'; },
    onInput: function (v) { angle = v; draw(); }
  }));

  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'text-align:center;margin-top:10px;';
  const bWarm = document.createElement('button');
  bWarm.className = 'btn active'; bWarm.textContent = '伦勃朗 · 暖光';
  const bCool = document.createElement('button');
  bCool.className = 'btn'; bCool.textContent = '卡拉瓦乔 · 冷光';
  bWarm.onclick = function () { warm = true; bWarm.classList.add('active'); bCool.classList.remove('active'); draw(); };
  bCool.onclick = function () { warm = false; bCool.classList.add('active'); bWarm.classList.remove('active'); draw(); };
  btnWrap.appendChild(bWarm); btnWrap.appendChild(bCool);
  host.appendChild(btnWrap);

  const notes = document.createElement('div');
  notes.className = 'grid grid-3';
  notes.style.marginTop = '24px';
  [['① 高光', '光直接反射最强的点，最亮'],
   ['② 中间调', '受光但不是直射，灰面'],
   ['③ 明暗交界线', '受光与背光的分界，最暗'],
   ['④ 反射光', '环境反弹的弱光，让暗部透气'],
   ['⑤ 投影', '物体挡住光，落在承接面上'],
   ['核心', '五要素齐全，体积感就成立']
  ].forEach(function (it) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + it[0] + '</h3><p>' + it[1] + '</p>';
    notes.appendChild(c);
  });
  host.appendChild(notes);
})();
