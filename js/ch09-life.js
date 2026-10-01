/* ============================================================
   Ch09 · 生活中的光影 — 五大场景 + 观察清单
   ============================================================ */
(function () {
  document.getElementById('life-desc').innerHTML =
    '前面的章节讲了光的“知识”，这一章把它们变成<strong>你的眼睛和手</strong>。' +
    '同样的光影规律，每天都出现在家里、衣服上、手机镜头里、电影和城市中。' +
    '看懂这些，你会开始<strong>有意识地观察光、欣赏光、用光</strong>。';

  const root = document.getElementById('life-content');

  // ===== Tab 切换 =====
  const tabs = document.createElement('div');
  tabs.style.cssText = 'text-align:center;margin-bottom:26px;';
  const panels = document.createElement('div');

  const scenes = [
    {
      name: '家里的光',
      html:
        '<h3>客厅就是一个“布光现场”</h3>' +
        '<p>主灯提供整体照明（主光），落地灯、台灯照亮阅读角落（辅光），射灯、灯带勾勒墙面和家具（轮廓光）。<strong>只开一盏顶灯，房间平淡；分层开灯，立刻有了氛围。</strong></p>' +
        '<p style="margin-top:14px;"><strong>色温决定情绪</strong>：卧室用暖光（2700K）放松，书房用中性光（4000K）专注。<strong>窗户是免费的柔光箱</strong>——白天拉一层纱帘，光就变得柔和均匀，把书桌或沙发摆在窗边。</p>' +
        '<div class="tag">呼应 Ch.05 三点布光</div><div class="tag">呼应 Ch.06 色温</div>'
    },
    {
      name: '穿搭与面料',
      html:
        '<h3>面料本身就有“光”</h3>' +
        '<p>丝绸、缎面高反光，显得华丽；棉麻哑光，显得松弛；皮革有硬高光，显得利落。<strong>想让穿搭立体，就用明暗对比</strong>——深色外套配浅色内搭，像给自己打了一道轮廓光。</p>' +
        '<p style="margin-top:14px;"><strong>买衣服要在自然光下看颜色</strong>：商场灯光偏暖偏亮，颜色会“骗人”，把衣服拿到窗边，才是它真实的颜色。</p>' +
        '<div class="tag">呼应 Ch.02 明暗</div><div class="tag">呼应 Ch.08 高低调</div>'
    },
    {
      name: '手机拍照',
      html:
        '<h3>记住三个口诀</h3>' +
        '<p><strong>黄金时刻拍人</strong>：日出后、日落前一小时，脸是暖的、影子是软的。<strong>窗边拍人像</strong>：人侧对窗户约45°，脸上出现自然明暗，就是手机版伦勃朗光。</p>' +
        '<p style="margin-top:14px;"><strong>逆光二选一</strong>：想要剪影，就对天空点测光；想要发光轮廓，就对人脸对焦。拍之前先想好要哪一种。</p>' +
        '<div class="tag">呼应 Ch.04 伦勃朗光</div><div class="tag">呼应 Ch.06 / Ch.07</div>'
    },
    {
      name: '看电影',
      html:
        '<h3>看电影时，留意“光”</h3>' +
        '<p>低调光、硬阴影多出现在悬疑片、黑色电影；高调柔光多出现在喜剧、爱情片。<strong>主角的头发和肩膀常被一道逆光勾边</strong>，把人和背景分开——这就是轮廓光。</p>' +
        '<p style="margin-top:14px;">当画面里大部分是黑的、只有一小束光照亮关键人物，那是导演在用<strong>暗色调主义</strong>告诉你：“注意这里。”</p>' +
        '<div class="tag">呼应 Ch.03 暗色调</div><div class="tag">呼应 Ch.08 高低调</div>'
    },
    {
      name: '城市里的光',
      html:
        '<h3>训练自己“看见光”</h3>' +
        '<p><strong>蓝调时刻拍城市</strong>：天还没全黑，深蓝天空配暖黄路灯，冷暖对撞最好看。清晨留意被拉长的影子，傍晚留意斜照的侧光，还有玻璃幕墙的反光、巷口的一束光。</p>' +
        '<p style="margin-top:14px;">好的公共艺术、地标建筑、装置（如西夏王陵的铁丝装置）都在主动用光。<strong>多看好的，审美的眼光才会被养出来。</strong></p>' +
        '<div class="tag">呼应 Ch.06 一天的光</div><div class="tag">审美输入</div>'
    }
  ];

  scenes.forEach(function (s, i) {
    const b = document.createElement('button');
    b.className = 'btn' + (i === 0 ? ' active' : '');
    b.textContent = s.name;
    b.onclick = function () {
      tabs.querySelectorAll('.btn').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      panels.innerHTML = '<div class="card reveal visible" style="min-height:180px;">' + s.html + '</div>';
    };
    tabs.appendChild(b);
  });
  panels.innerHTML = '<div class="card" style="min-height:180px;">' + scenes[0].html + '</div>';

  root.appendChild(tabs);
  root.appendChild(panels);

  // ===== 光影观察清单 =====
  const listWrap = document.createElement('div');
  listWrap.className = 'card';
  listWrap.style.marginTop = '30px';
  listWrap.innerHTML = '<h3 style="text-align:center;">光影观察清单</h3>' +
    '<p style="text-align:center;color:var(--text-dim);margin-bottom:18px;">去生活里，把它们一个个打卡</p>';

  const checklist = [
    '在黄金时刻拍过一张逆光照片',
    '认真观察过蓝调时刻的天空',
    '在家用台灯 + 落地灯搭出光线层次',
    '看电影时认出了主角身上的轮廓光',
    '在窗边观察过脸上的明暗过渡',
    '发现了一个城市里的好光影',
    '用侧对窗户的方式拍过一张人像',
    '注意过阴天和晴天光线的不同'
  ];

  const done = new Set();
  const progress = document.createElement('div');
  progress.style.cssText = 'text-align:center;color:var(--gold);margin:14px 0;font-size:14px;';

  checklist.forEach(function (text, i) {
    const item = document.createElement('label');
    item.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px;cursor:pointer;border-radius:8px;';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.style.accentColor = '#d4a857';
    const span = document.createElement('span');
    span.style.fontSize = '14px';
    span.textContent = text;
    cb.onchange = function () {
      if (cb.checked) { done.add(i); span.style.color = 'var(--text-faint)'; span.style.textDecoration = 'line-through'; }
      else { done.delete(i); span.style.color = ''; span.style.textDecoration = ''; }
      progress.textContent = '已完成 ' + done.size + ' / ' + checklist.length;
    };
    item.appendChild(cb); item.appendChild(span);
    listWrap.appendChild(item);
  });
  listWrap.appendChild(progress);
  root.appendChild(listWrap);

  // 结尾
  const ending = document.createElement('p');
  ending.style.cssText = 'text-align:center;margin-top:40px;font-family:var(--serif);font-size:22px;color:var(--light-warm);';
  ending.textContent = '懂光的人，处处都有光。';
  root.appendChild(ending);
})();
