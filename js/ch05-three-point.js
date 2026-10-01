/* ============================================================
   Ch05 · 三点布光 Three-Point Lighting — Three.js 布光模拟器
   ============================================================ */
(function () {
  document.getElementById('three-point-desc').innerHTML =
    '三点布光是影视、摄影、演播室里<strong>最通用的布光方法</strong>，由三盏灯组成：' +
    '<strong>主光（Key）</strong>决定基调与造型，<strong>辅光（Fill）</strong>填充暗部、柔化阴影，' +
    '<strong>轮廓光（Rim）</strong>从后方勾勒边缘、把主体和背景分开。' +
    '下面是一个实时渲染的石膏像，开关每盏灯，体会它们各自的作用。';

  const host = document.getElementById('three-point-stage');

  const title = document.createElement('div');
  title.className = 'stage-title';
  title.textContent = '三点布光模拟器 · 开关与调节每盏灯';
  host.appendChild(title);

  // 容器
  const mount = document.createElement('div');
  mount.style.cssText = 'width:100%;height:440px;border-radius:8px;overflow:hidden;background:#0a0a0a;';
  host.appendChild(mount);

  if (typeof THREE === 'undefined') {
    mount.innerHTML = '<p style="padding:40px;text-align:center;color:var(--text-dim)">Three.js 加载失败，请检查网络。</p>';
    return;
  }

  // ===== 场景 =====
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.2, 8.5);
  camera.lookAt(0, 1.4, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ===== 石膏像（头 + 鼻 + 颈 + 肩 + 底座） =====
  const plaster = new THREE.MeshStandardMaterial({ color: 0xe2d9cb, roughness: 0.75, metalness: 0 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), plaster);
  head.scale.set(0.82, 1.02, 0.82);
  head.position.y = 2.5;
  head.castShadow = true;
  scene.add(head);

  // 鼻子
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), plaster);
  nose.scale.set(0.7, 1.2, 1.4);
  nose.position.set(0, 2.45, 0.78);
  nose.castShadow = true;
  scene.add(nose);

  // 脖子
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.55, 24), plaster);
  neck.position.y = 1.55;
  neck.castShadow = true;
  scene.add(neck);

  // 肩膀（更优雅的胸像）
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(1.25, 48, 24), plaster);
  shoulders.scale.set(1.15, 0.48, 0.72);
  shoulders.position.y = 1.05;
  shoulders.castShadow = true;
  scene.add(shoulders);

  // 底座（圆柱台座）
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.9, metalness: 0 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.45, 0.5, 32), baseMat);
  base.position.y = 0.25;
  base.castShadow = true;
  base.receiveShadow = true;
  scene.add(base);
  const baseTop = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 0.12, 32), plaster);
  baseTop.position.y = 0.56;
  baseTop.castShadow = true;
  baseTop.receiveShadow = true;
  scene.add(baseTop);

  // 地面
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x141210, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // ===== 三盏灯 =====
  function makeSpot(color, pos, intensity) {
    const s = new THREE.SpotLight(color, intensity, 40, Math.PI / 7, 0.5, 1.2);
    s.position.set(pos[0], pos[1], pos[2]);
    s.target.position.set(0, 1.8, 0);
    s.castShadow = true;
    s.shadow.mapSize.set(1024, 1024);
    s.shadow.bias = -0.0005;
    scene.add(s);
    scene.add(s.target);
    return s;
  }

  const keyLight = makeSpot(0xfff0d0, [5, 6, 5], 8);
  const fillLight = makeSpot(0xdce8ff, [-6, 3, 4], 0);
  const rimLight = makeSpot(0xffffff, [0, 5, -6], 0);

  // 灯光辅助小球（可视化光源位置）
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0 });
  function bulb(light) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: light.color }));
    b.position.copy(light.position);
    scene.add(b);
    return b;
  }
  const keyBulb = bulb(keyLight);
  const fillBulb = bulb(fillLight);
  const fillBulbMat = fillBulb.material;
  const rimBulb = bulb(rimLight);
  const rimBulbMat = rimBulb.material;

  // ===== 渲染循环 =====
  function animate() {
    requestAnimationFrame(animate);
    // 灯泡亮度随灯光强度
    keyBulb.material.color.setHex(keyLight.intensity > 0.1 ? 0xfff0d0 : 0x333333);
    fillBulb.material.color.setHex(fillLight.intensity > 0.1 ? 0xdce8ff : 0x333333);
    rimBulb.material.color.setHex(rimLight.intensity > 0.1 ? 0xffffff : 0x333333);
    renderer.render(scene, camera);
  }
  animate();

  // 轻微拖动旋转视角
  let rot = null;
  mount.addEventListener('mousedown', function (e) { rot = e.clientX; });
  window.addEventListener('mouseup', function () { rot = null; });
  mount.addEventListener('mousemove', function (e) {
    if (rot !== null) {
      const dx = e.clientX - rot; rot = e.clientX;
      camera.position.x = Math.max(-5, Math.min(5, camera.position.x - dx * 0.02));
      camera.lookAt(0, 1.4, 0);
    }
  });

  // ===== 控制面板 =====
  const panel = document.createElement('div');
  panel.className = 'grid grid-3';
  panel.style.marginTop = '22px';

  function lightCard(name, light, color, defaultInt) {
    const card = document.createElement('div');
    card.className = 'card';
    const head = document.createElement('h3');
    head.textContent = name;
    card.appendChild(head);

    const toggle = document.createElement('button');
    toggle.className = 'btn' + (light.intensity > 0.1 ? ' active' : '');
    toggle.textContent = light.intensity > 0.1 ? '已开启' : '已关闭';
    toggle.onclick = function () {
      if (light.intensity > 0.1) { light.intensity = 0; toggle.classList.remove('active'); toggle.textContent = '已关闭'; }
      else { light.intensity = defaultInt; toggle.classList.add('active'); toggle.textContent = '已开启'; }
      slider.setValue(light.intensity);
    };
    card.appendChild(toggle);

    const slider = makeSlider({
      min: 0, max: 15, step: 0.1, value: light.intensity,
      label: '强度',
      display: function (v) { return v; },
      onInput: function (v) {
        light.intensity = v;
        if (v > 0.1) { toggle.classList.add('active'); toggle.textContent = '已开启'; }
        else { toggle.classList.remove('active'); toggle.textContent = '已关闭'; }
      }
    });
    card.appendChild(slider);
    return card;
  }

  panel.appendChild(lightCard('主光 Key', keyLight, 0xfff0d0, 8));
  panel.appendChild(lightCard('辅光 Fill', fillLight, 0xdce8ff, 4));
  panel.appendChild(lightCard('轮廓光 Rim', rimLight, 0xffffff, 6));
  host.appendChild(panel);

  // ===== 引导 + 预设 =====
  const presets = document.createElement('div');
  presets.style.cssText = 'text-align:center;margin-top:20px;';

  function preset(name, fn) {
    const b = document.createElement('button');
    b.className = 'btn'; b.textContent = name;
    b.onclick = fn;
    presets.appendChild(b);
  }

  function setLights(k, f, r) {
    keyLight.intensity = k; fillLight.intensity = f; rimLight.intensity = r;
    // 刷新面板滑块
    panel.querySelectorAll('input[type=range]').forEach((inp, i) => {
      inp.value = [k, f, r][i];
      inp.dispatchEvent(new Event('input', { bubbles: false }));
    });
  }

  preset('① 只开主光', function () { setLights(8, 0, 0); });
  preset('② 加辅光', function () { setLights(8, 4, 0); });
  preset('③ 完整三点布光', function () { setLights(8, 4, 6); });
  preset('戏剧性（强反差）', function () { setLights(10, 1, 3); });
  preset('平光（柔和）', function () { setLights(6, 6, 0); });

  host.appendChild(presets);

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:13px;color:var(--text-faint);margin-top:14px;text-align:center;';
  hint.textContent = '建议依次点「只开主光 → 加辅光 → 完整三点布光」，看暗部如何被一点点“打开”。';
  host.appendChild(hint);
})();
