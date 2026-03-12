// three-bg.js — 3D wireframe geometry background using Three.js
(function () {
  if (window.innerWidth < 768) return; // Skip on mobile for performance

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.id = 'three-canvas';
  renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0.35;transition:opacity 0.6s ease;';
  document.body.prepend(renderer.domElement);

  // Read accent colors from CSS custom properties
  function getAccentColor() {
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue('--accent').trim() || '#00D4FF';
    const accentAlt = cs.getPropertyValue('--accent-alt').trim() || '#B533FF';
    return { accent, accentAlt };
  }

  let colors = getAccentColor();

  // ── Central Icosahedron ──
  const icoGeo = new THREE.IcosahedronGeometry(6, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: colors.accent,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // ── Inner ring ──
  const torusGeo = new THREE.TorusGeometry(9, 0.08, 8, 80);
  const torusMat = new THREE.MeshBasicMaterial({
    color: colors.accentAlt,
    transparent: true,
    opacity: 0.18,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  // ── Floating particles ──
  const particleCount = 120;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities.push({
      x: (Math.random() - 0.5) * 0.012,
      y: (Math.random() - 0.5) * 0.012,
      z: (Math.random() - 0.5) * 0.008,
    });
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const pMat = new THREE.PointsMaterial({
    color: colors.accent,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Small orbiting octahedrons ──
  const orbiters = [];
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.OctahedronGeometry(0.4, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? colors.accent : colors.accentAlt,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = (i / 6) * Math.PI * 2;
    const radius = 14 + Math.random() * 4;
    mesh.userData = { angle, radius, speed: 0.002 + Math.random() * 0.003, yOff: (Math.random() - 0.5) * 10 };
    scene.add(mesh);
    orbiters.push(mesh);
  }

  // ── Mouse parallax ──
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Theme change watcher ──
  const themeObs = new MutationObserver(() => {
    colors = getAccentColor();
    icoMat.color.set(colors.accent);
    torusMat.color.set(colors.accentAlt);
    pMat.color.set(colors.accent);
    orbiters.forEach((o, i) => {
      o.material.color.set(i % 2 === 0 ? colors.accent : colors.accentAlt);
    });
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Resize ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Render loop ──
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate central shapes
    ico.rotation.x = t * 0.08 + my * 0.3;
    ico.rotation.y = t * 0.12 + mx * 0.3;
    torus.rotation.z = t * 0.06;
    torus.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.15;

    // Pulse icosahedron
    const pulse = 1 + Math.sin(t * 0.8) * 0.04;
    ico.scale.set(pulse, pulse, pulse);

    // Drift particles
    const posArr = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3] += velocities[i].x;
      posArr[i * 3 + 1] += velocities[i].y;
      posArr[i * 3 + 2] += velocities[i].z;
      // wrap
      if (Math.abs(posArr[i * 3]) > 30) velocities[i].x *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 30) velocities[i].y *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 20) velocities[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Orbit octahedrons
    orbiters.forEach(o => {
      o.userData.angle += o.userData.speed;
      o.position.x = Math.cos(o.userData.angle) * o.userData.radius;
      o.position.z = Math.sin(o.userData.angle) * o.userData.radius - 5;
      o.position.y = o.userData.yOff + Math.sin(t * 0.5 + o.userData.angle) * 2;
      o.rotation.x = t * 0.5;
      o.rotation.y = t * 0.3;
    });

    // Camera parallax
    camera.position.x += (mx * 3 - camera.position.x) * 0.03;
    camera.position.y += (-my * 3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
