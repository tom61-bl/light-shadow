/* ============================================================
   光影志 · main.js — 封面鼠标光源 + 通用滚动逻辑
   ============================================================ */

// ===== 封面：鼠标即光源 =====
(function () {
  const cover = document.getElementById('cover');
  const light = document.getElementById('coverLight');
  const cursor = document.getElementById('coverCursor');
  const h1 = cover.querySelector('h1');

  function move(e) {
    const x = e.clientX;
    const y = e.clientY;
    light.style.left = x + 'px';
    light.style.top = y + 'px';
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    light.style.opacity = '1';
    cursor.style.opacity = '1';
    // 标题遮罩跟随烛火
    const rect = h1.getBoundingClientRect();
    h1.style.setProperty('--mx', ((x - rect.left) / rect.width * 100) + '%');
    h1.style.setProperty('--my', ((y - rect.top) / rect.height * 100) + '%');
  }

  // 初始放在屏幕中央
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  light.style.left = cx + 'px';
  light.style.top = cy + 'px';
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';

  cover.addEventListener('mousemove', move);
  document.addEventListener('mousemove', function (e) {
    // 判断鼠标是否在封面区域内
    const coverRect = cover.getBoundingClientRect();
    if (e.clientY >= coverRect.top && e.clientY <= coverRect.bottom) {
      light.style.opacity = '1';
      cursor.style.opacity = '1';
    } else {
      light.style.opacity = '0';
      cursor.style.opacity = '0';
    }
  });
})();

// ===== 滚动显现 =====
(function () {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

// ===== 通用工具：创建滑块 =====
window.makeSlider = function (config) {
  // config: { min, max, step, value, label, onInput }
  const wrap = document.createElement('div');
  wrap.className = 'control';

  const label = document.createElement('label');
  label.innerHTML = config.label + ' <span class="val"></span>';
  const valSpan = label.querySelector('.val');

  const input = document.createElement('input');
  input.type = 'range';
  input.min = config.min;
  input.max = config.max;
  input.step = config.step || 1;
  input.value = config.value;

  function update() {
    valSpan.textContent = config.display ? config.display(input.value) : input.value;
    if (config.onInput) config.onInput(parseFloat(input.value));
  }

  input.addEventListener('input', update);
  update();

  wrap.appendChild(label);
  wrap.appendChild(input);

  // 暴露 setValue 方法
  wrap.setValue = function (v) {
    input.value = v;
    update();
  };
  wrap.input = input;

  return wrap;
};

// ===== 通用工具：创建画布 =====
window.makeCanvas = function (w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  return { canvas: canvas, ctx: ctx };
};
