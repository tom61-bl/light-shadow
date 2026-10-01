/* ============================================================
   Ch06 · 一天的光 — 日出到日落时间轴
   ============================================================ */
(function () {
  document.getElementById('day-desc').innerHTML =
    '同一地点，太阳的位置决定了光的<strong>角度、色温、阴影长度和氛围</strong>。' +
    '清晨和傍晚的「黄金时刻」太阳低、光暖而柔、影子长；正午太阳高、光白而硬、影子短。' +
    '拖动时间轴，看一天里光线如何流转。';

  const host = document.getElementById('day-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '一天的光 · 拖动时间轴';
  host.appendChild(title);

  const W = 720, H = 380;
  const cv = makeCanvas(W, H);
  host.appendChild(cv.canvas);

  // 时间：4.0 ~ 20.0 小时
  let t = 17.5;

  // 颜色插值
  function lerp(a, b, f) { return a + (b - a) * f; }
  function mix(c1, c2, f) {
    return [lerp(c1[0], c2[0], f), lerp(c1[1], c2[1], f), lerp(c1[2], c2[2], f)];
  }
  function rgb(c) { return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')'; }

  // 各时段天空色（顶，底）
  function skyColors(t) {
    // 关键时间点
    const keys = [
      [4, [12, 16, 40], [20, 26, 55]],      // 蓝调前（夜）
      [5.5, [40, 50, 90], [90, 80, 110]],   // 蓝调
      [6.5, [120, 110, 140], [240, 150, 100]], // 日出
      [8, [110, 160, 220], [200, 220, 240]], // 上午
      [12, [90, 150, 225], [200, 225, 250]], // 正午
      [16, [100, 155, 220], [200, 220, 240]], // 下午
      [18, [140, 120, 150], [250, 160, 100]], // 日落
      [19, [60, 60, 110], [120, 90, 120]],  // 蓝调
      [20, [15, 20, 45], [25, 30, 60]]      // 夜
    ];
    for (let i = 0; i < keys.length - 1; i++) {
      if (t >= keys[i][0] && t <= keys[i + 1][0]) {
        const f = (t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]);
        return [mix(keys[i][1], keys[i + 1][1], f), mix(keys[i][2], keys[i + 1][2], f)];
      }
    }
    return [keys[0][1], keys[0][2]];
  }

  // 太阳位置（地平线以上才有）
  function sunPos(t) {
    // 太阳 6 点升起，18 点落下（简化），弧线
    const dayF = (t - 6) / 12; // 0~1
    if (dayF < 0 || dayF > 1) return null;
    const sx = lerp(80, W - 80, dayF);
    const sy = lerp(H * 0.62, H * 0.62, 0) - Math.sin(dayF * Math.PI) * 220;
    return { x: sx, y: sy };
  }

  function draw() {
    const ctx = cv.ctx;
    const [top, bot] = skyColors(t);

    // 天空
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.7);
    g.addColorStop(0, rgb(top));
    g.addColorStop(1, rgb(bot));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 太阳
    const sp = sunPos(t);
    if (sp) {
      // 太阳颜色：日出日落偏橙，正午偏白
      const warmF = Math.abs((t - 12) / 6); // 正午0，早晚1
      const sunCol = mix([255, 250, 235], [255, 140, 60], Math.min(1, warmF));
      const glow = ctx.createRadialGradient(sp.x, sp.y, 4, sp.x, sp.y, 90);
      glow.addColorStop(0, 'rgba(255,220,150,0.9)');
      glow.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(sp.x, sp.y, 90, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgb(sunCol);
      ctx.beginPath(); ctx.arc(sp.x, sp.y, 26, 0, Math.PI * 2); ctx.fill();
    }

    // 远山
    ctx.fillStyle = 'rgba(60,70,80,0.7)';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.62);
    for (let x = 0; x <= W; x += 60) {
      ctx.lineTo(x, H * 0.62 - 40 - Math.sin(x * 0.02) * 30);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H);
    ctx.fill();

    // 地面
    const ground = ctx.createLinearGradient(0, H * 0.62, 0, H);
    ground.addColorStop(0, 'rgb(50,55,45)');
    ground.addColorStop(1, 'rgb(30,34,28)');
    ctx.fillStyle = ground;
    ctx.fillRect(0, H * 0.62, W, H * 0.38);

    // 树
    const tx = 360, ty = H * 0.62;
    ctx.fillStyle = 'rgb(45,35,25)';
    ctx.fillRect(tx - 8, ty - 90, 16, 90);
    ctx.fillStyle = 'rgb(35,55,35)';
    ctx.beginPath(); ctx.arc(tx, ty - 110, 45, 0, Math.PI * 2); ctx.fill();

    // 树影（随太阳方向和高度）
    if (sp) {
      const shadowLen = 40 + (1 - Math.max(0, (H * 0.62 - sp.y) / 220)) * 180;
      const dir = sp.x < tx ? 1 : -1;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(tx + dir * shadowLen * 0.5, ty + 8, shadowLen * 0.6, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 时段标注
    ctx.fillStyle = 'rgba(245,215,142,0.95)';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    let label = '';
    const hh = Math.floor(t), mm = Math.floor((t - hh) * 60);
    const time = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    if (t >= 5 && t < 7) label = '黄金时刻 · 日出';
    else if (t >= 17 && t < 19) label = '黄金时刻 · 日落';
    else if ((t >= 4.5 && t < 5.5) || (t >= 19 && t < 20)) label = '蓝调时刻';
    else if (t >= 11 && t < 13) label = '正午 · 顶光';
    else if (t >= 7 && t < 17) label = '日常光';
    else label = '夜晚';
    ctx.fillText(time + ' · ' + label, W / 2, 30);
    ctx.textAlign = 'left';
  }

  draw();

  // 时间滑块
  host.appendChild(makeSlider({
    min: 4, max: 20, step: 0.1, value: t,
    label: '时间',
    display: function (v) {
      const hh = Math.floor(v), mm = Math.floor((v - hh) * 60);
      return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    },
    onInput: function (v) { t = v; draw(); }
  }));

  // 时段卡片
  const cards = document.createElement('div');
  cards.className = 'grid grid-3';
  cards.style.marginTop = '22px';
  const items = [
    ['黄金时刻', '日出后/日落前约1小时，光暖、柔、有方向，影子长。拍人像、风景最出彩。'],
    ['蓝调时刻', '日出前/日落后20-30分钟，天空深蓝。配合城市暖灯，冷暖对撞，拍城市最佳。'],
    ['正午顶光', '太阳最高，光白而硬，阴影短而重，眼窝/下巴有黑影。人像最不讨好。'],
    ['阴天柔光', '云层把光打散，像巨大柔光箱，柔和均匀，适合人像、森林、质感题材。'],
    ['窗边光', '窗户是天然柔光箱，侧对窗有柔和明暗，室内人像最好用。'],
    ['阴影方向', '影子永远背离太阳，长度随太阳高度变化——低太阳=长影子。']
  ];
  items.forEach(function (it) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<h3>' + it[0] + '</h3><p>' + it[1] + '</p>';
    cards.appendChild(c);
  });
  host.appendChild(cards);
})();
