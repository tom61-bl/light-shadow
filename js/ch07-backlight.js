/* ============================================================
   Ch07 · 逆光与剪影 — 曝光选择器
   ============================================================ */
(function () {
  document.getElementById('backlight-desc').innerHTML =
    '逆光（Backlight / Contre-jour）是让<strong>光源在主体背后、朝向镜头</strong>。' +
    '这时有两种选择：<strong>对亮背景曝光，主体变成纯黑的剪影</strong>，靠形状说话；' +
    '<strong>对主体曝光，主体边缘出现一圈发光的轮廓光</strong>，把人和背景分开。' +
    '拖动曝光滑块，在两种结果之间切换。';

  const host = document.getElementById('backlight-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '逆光曝光 · 剪影 ↔ 轮廓光';
  host.appendChild(title);

  const W = 720, H = 380;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 曝光：-2（对天空，剪影）~ +2（对人物，轮廓光）
  let expo = -2;

  function draw() {
    const ctx = cv.ctx;
    // 背景亮度受曝光影响：对人物曝光时背景过曝发白
    const bgOver = Math.max(0, expo / 2); // 0~1

    // 夕阳天空
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    const top = [Math.round(lerp2(40, 230, bgOver)), Math.round(lerp2(50, 235, bgOver)), Math.round(lerp2(90, 245, bgOver))];
    const bot = [Math.round(lerp2(240, 255, bgOver)), Math.round(lerp2(140, 240, bgOver)), Math.round(lerp2(80, 230, bgOver))];
    sky.addColorStop(0, 'rgb(' + top.join(',') + ')');
    sky.addColorStop(1, 'rgb(' + bot.join(',') + ')');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // 太阳
    const sunG = ctx.createRadialGradient(W / 2, 200, 10, W / 2, 200, 120);
    sunG.addColorStop(0, 'rgba(255,250,220,0.95)');
    sunG.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = sunG;
    ctx.beginPath(); ctx.arc(W / 2, 200, 120, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgb(255,240,200)';
    ctx.beginPath(); ctx.arc(W / 2, 200, 45, 0, Math.PI * 2); ctx.fill();

    // 地面
    ctx.fillStyle = 'rgb(' + [Math.round(lerp2(60, 200, bgOver)), Math.round(lerp2(50, 190, bgOver)), Math.round(lerp2(40, 170, bgOver))].join(',') + ')';
    ctx.fillRect(0, 320, W, 60);

    // 人物（中心）
    const px = W / 2, py = 320;
    const personF = Math.max(0, (expo + 2) / 4);

    const rim = Math.sin(Math.min(1, personF + 0.3) * Math.PI);
    ctx.save();
    ctx.shadowColor = 'rgba(255,230,170,' + (0.5 + rim * 0.5) + ')';
    ctx.shadowBlur = 20 + rim * 25;

    const bodyCol = personF < 0.15 ? '#15110c' : 'rgb(' +
      Math.round(lerp2(20, 200, personF)) + ',' +
      Math.round(lerp2(15, 160, personF)) + ',' +
      Math.round(lerp2(12, 130, personF)) + ')';
    ctx.fillStyle = bodyCol;

    // 腿
    ctx.fillRect(px - 16, py - 10, 13, 12);
    ctx.fillRect(px + 3, py - 10, 13, 12);

    // 身体（连衣裙/上衣，有腰的曲线）
    ctx.beginPath();
    ctx.moveTo(px - 38, py - 95);
    ctx.quadraticCurveTo(px - 48, py - 60, px - 42, py - 25);
    ctx.quadraticCurveTo(px - 35, py - 12, px - 20, py - 10);
    ctx.lineTo(px + 20, py - 10);
    ctx.quadraticCurveTo(px + 35, py - 12, px + 42, py - 25);
    ctx.quadraticCurveTo(px + 48, py - 60, px + 38, py - 95);
    ctx.quadraticCurveTo(px, py - 105, px - 38, py - 95);
    ctx.closePath();
    ctx.fill();

    // 手臂（自然下垂）
    ctx.beginPath();
    ctx.ellipse(px - 48, py - 55, 8, 32, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + 48, py - 55, 8, 32, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // 脖子
    ctx.fillRect(px - 10, py - 110, 20, 18);

    // 头（椭圆脸）
    ctx.beginPath();
    ctx.ellipse(px, py - 138, 24, 29, 0, 0, Math.PI * 2);
    ctx.fill();

    // 头发（覆盖头顶和两侧，有发丝感）
    ctx.beginPath();
    ctx.moveTo(px - 24, py - 140);
    ctx.bezierCurveTo(px - 28, py - 170, px - 10, py - 178, px, py - 175);
    ctx.bezierCurveTo(px + 10, py - 178, px + 28, py - 170, px + 24, py - 140);
    ctx.bezierCurveTo(px + 20, py - 155, px + 8, py - 160, px, py - 158);
    ctx.bezierCurveTo(px - 8, py - 160, px - 20, py - 155, px - 24, py - 140);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 轮廓光高亮（头发、肩膀边缘）
    if (personF > 0.1) {
      ctx.strokeStyle = 'rgba(255,235,190,' + (0.6 + rim * 0.4) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(px, py - 138, 24, 29, 0, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px - 38, py - 95);
      ctx.quadraticCurveTo(px - 48, py - 60, px - 42, py - 25);
      ctx.moveTo(px + 38, py - 95);
      ctx.quadraticCurveTo(px + 48, py - 60, px + 42, py - 25);
      ctx.stroke();
      // 头发轮廓光
      ctx.strokeStyle = 'rgba(255,240,200,' + (0.5 + rim * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 24, py - 140);
      ctx.bezierCurveTo(px - 28, py - 170, px - 10, py - 178, px, py - 175);
      ctx.bezierCurveTo(px + 10, py - 178, px + 28, py - 170, px + 24, py - 140);
      ctx.stroke();
    }
    }

    // 状态
    ctx.fillStyle = '#f5d78e';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    let msg;
    if (personF < 0.2) msg = '剪影：对天空曝光，主体纯黑，形状即画面';
    else if (personF < 0.7) msg = '轮廓光：边缘发光，主体与背景分离';
    else msg = '主体完整：对人物曝光，背景过曝，逆光氛围感';
    ctx.fillText(msg, W / 2, 30);
    ctx.textAlign = 'left';
  }

  function lerp2(a, b, f) { return a + (b - a) * f; }

  draw();

  host.appendChild(makeSlider({
    min: -2, max: 2, step: 0.05, value: expo,
    label: '曝光补偿（对谁曝光）',
    display: function (v) { return (v > 0 ? '+' : '') + (v).toFixed(1) + ' EV'; },
    onInput: function (v) { expo = v; draw(); }
  }));

  // 快捷按钮
  const btns = document.createElement('div');
  btns.style.cssText = 'text-align:center;margin-top:8px;';
  [['剪影', -2], ['轮廓光', 0.2], ['完整曝光', 2]].forEach(function (b) {
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = b[0];
    btn.onclick = function () {
      expo = b[1];
      const sl = host.querySelector('input[type=range]');
      sl.value = b[1]; sl.dispatchEvent(new Event('input'));
    };
    btns.appendChild(btn);
  });
  host.appendChild(btns);

  // 说明
  const notes = document.createElement('div');
  notes.className = 'grid grid-2';
  notes.style.marginTop = '22px';
  const items = [
    ['为什么逆光下头发会发光', '头发、绒毛、草、蒲公英边缘细密，光从背后穿过，每根细丝都被照亮，形成金色“发光边缘”。'],
    ['轮廓光的作用', '主体和背景颜色接近时，一道逆光勾边就能把它们分开，这是影视让人“跳出画面”的常用手法。'],
    ['剪影怎么拍', '对亮天空点测光（或-1~-2档曝光补偿），主体彻底变黑。轮廓清晰、形状简单的主体最好。'],
    ['光晕与光斑', '逆光时缩小光圈(f/11+)、让太阳贴着主体边缘，会出现星芒和镜头光晕，增添梦幻感。']
  ];
  items.forEach(function (it) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + it[0] + '</h3><p>' + it[1] + '</p>';
    notes.appendChild(c);
  });
  host.appendChild(notes);
})();
