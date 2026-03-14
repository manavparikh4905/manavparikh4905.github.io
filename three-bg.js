// three-bg.js — Cinematic Neural/Circuit Background v2.0
// Inspired by robotics: neural maps, circuit traces, sensor webs
(function () {
  if (window.innerWidth < 768) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 55);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.id = 'three-canvas';
  renderer.domElement.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;transition:opacity 0.6s ease;';
  document.body.prepend(renderer.domElement);

  // ── Color helpers ──────────────────────────────────────────────
  function getAccentColor() {
    const cs = getComputedStyle(document.documentElement);
    return {
      accent: cs.getPropertyValue('--accent').trim() || '#00E5D4',
      accentAlt: cs.getPropertyValue('--accent-alt').trim() || '#B533FF',
      accent2: cs.getPropertyValue('--accent-2').trim() || '#FF5533',
    };
  }
  let colors = getAccentColor();

  // ── Node Network (neural/circuit graph) ───────────────────────
  const NODE_COUNT = 80;
  const CONNECT_DIST = 18;
  const nodes = [];
  const nodeGeo = new THREE.BufferGeometry();
  const nodePosArr = new Float32Array(NODE_COUNT * 3);

  // Node velocities and data
  for (let i = 0; i < NODE_COUNT; i++) {
    const spread = 50;
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * spread;
    const z = (Math.random() - 0.5) * 30;
    nodes.push({
      x, y, z,
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.018,
      vz: (Math.random() - 0.5) * 0.008,
      size: 0.15 + Math.random() * 0.25,
      pulse: Math.random() * Math.PI * 2,
    });
    nodePosArr[i * 3] = x;
    nodePosArr[i * 3 + 1] = y;
    nodePosArr[i * 3 + 2] = z;
  }

  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: colors.accent,
    size: 0.22,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });
  const nodeMesh = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodeMesh);

  // ── Connection lines (rebuild each frame) ─────────────────────
  const MAX_LINES = 200;
  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors = new Float32Array(MAX_LINES * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.18,
  }));
  scene.add(lineMat);

  // Data travellers: glowing dots running along edges
  const travellers = [];
  for (let i = 0; i < 12; i++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    const mat = new THREE.PointsMaterial({
      color: i % 3 === 0 ? colors.accent2 : (i % 3 === 1 ? colors.accent : colors.accentAlt),
      size: 0.45,
      transparent: true,
      opacity: 0.0,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    travellers.push({
      mesh,
      from: 0, to: 1,
      t: Math.random(),
      speed: 0.008 + Math.random() * 0.012,
    });
  }

  // ── Outer dust ring / starfield ───────────────────────────────
  const STAR_COUNT = 300;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 60 + Math.random() * 60;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: colors.accent,
    size: 0.08,
    transparent: true,
    opacity: 0.25,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── Central Structure: Nested wireframe rings ─────────────────
  // Outer ring
  const ring1Geo = new THREE.TorusGeometry(12, 0.06, 4, 120);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: colors.accent,
    transparent: true,
    opacity: 0.12,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  scene.add(ring1);

  // Inner ring tilted perpendicular
  const ring2Geo = new THREE.TorusGeometry(7, 0.05, 4, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: colors.accentAlt,
    transparent: true,
    opacity: 0.10,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 2;
  scene.add(ring2);

  // Innermost ring
  const ring3Geo = new THREE.TorusGeometry(4, 0.04, 4, 60);
  const ring3Mat = new THREE.MeshBasicMaterial({
    color: colors.accent,
    transparent: true,
    opacity: 0.15,
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.y = Math.PI / 3;
  scene.add(ring3);

  // ── Spiral galaxy arms ────────────────────────────────────────
  const SPIRAL_COUNT = 180;
  const spiralGeo = new THREE.BufferGeometry();
  const spiralPos = new Float32Array(SPIRAL_COUNT * 3);
  const spiralCol = new Float32Array(SPIRAL_COUNT * 3);
  const accentC = new THREE.Color(colors.accent);
  const altC = new THREE.Color(colors.accentAlt);
  for (let i = 0; i < SPIRAL_COUNT; i++) {
    const t = i / SPIRAL_COUNT;
    const arm = i % 2;
    const angle = t * Math.PI * 6 + (arm * Math.PI);
    const radius = 5 + t * 22;
    const jitter = (Math.random() - 0.5) * 2;
    spiralPos[i * 3] = Math.cos(angle) * radius + jitter;
    spiralPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
    spiralPos[i * 3 + 2] = Math.sin(angle) * radius + jitter;
    const c = arm === 0 ? accentC : altC;
    spiralCol[i * 3] = c.r;
    spiralCol[i * 3 + 1] = c.g;
    spiralCol[i * 3 + 2] = c.b;
  }
  spiralGeo.setAttribute('position', new THREE.BufferAttribute(spiralPos, 3));
  spiralGeo.setAttribute('color', new THREE.BufferAttribute(spiralCol, 3));
  const spiralMat = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.14,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
  });
  const spiral = new THREE.Points(spiralGeo, spiralMat);
  scene.add(spiral);

  // ── Mouse parallax ────────────────────────────────────────────
  let mx = 0, my = 0, targetCamX = 0, targetCamY = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Scroll influence ──────────────────────────────────────────
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // ── Theme watcher ─────────────────────────────────────────────
  new MutationObserver(() => {
    colors = getAccentColor();
    nodeMat.color.set(colors.accent);
    starMat.color.set(colors.accent);
    ring1Mat.color.set(colors.accent);
    ring2Mat.color.set(colors.accentAlt);
    ring3Mat.color.set(colors.accent);
    travellers.forEach((tr, i) => {
      tr.mesh.material.color.set(i % 3 === 0 ? colors.accent2 : (i % 3 === 1 ? colors.accent : colors.accentAlt));
    });
    // Update spiral colors
    const ac = new THREE.Color(colors.accent);
    const alt = new THREE.Color(colors.accentAlt);
    const sc = spiralGeo.attributes.color.array;
    for (let i = 0; i < SPIRAL_COUNT; i++) {
      const c = i % 2 === 0 ? ac : alt;
      sc[i * 3] = c.r; sc[i * 3 + 1] = c.g; sc[i * 3 + 2] = c.b;
    }
    spiralGeo.attributes.color.needsUpdate = true;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Resize ────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Helpers ───────────────────────────────────────────────────
  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  // Build edge list for travellers
  function buildEdges() {
    const edges = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const d2 = dist2(nodes[i], nodes[j]);
        if (d2 < CONNECT_DIST * CONNECT_DIST) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  }
  let edges = buildEdges();

  // ── Render loop ───────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // ── Move nodes ──
    const np = nodeGeo.attributes.position.array;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
      // Soft boundary bounce
      const BOUND = 28;
      if (Math.abs(n.x) > BOUND) n.vx *= -1;
      if (Math.abs(n.y) > BOUND) n.vy *= -1;
      if (Math.abs(n.z) > 16) n.vz *= -1;
      np[i * 3] = n.x;
      np[i * 3 + 1] = n.y;
      np[i * 3 + 2] = n.z;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    // ── Rebuild connection lines ──
    const lp = lineGeo.attributes.position.array;
    const lc = lineGeo.attributes.color.array;
    const CONNECTED_DIST2 = CONNECT_DIST * CONNECT_DIST;
    let lineIdx = 0;
    const accentCV = new THREE.Color(colors.accent);
    const altCV = new THREE.Color(colors.accentAlt);

    edges = [];
    for (let i = 0; i < NODE_COUNT && lineIdx < MAX_LINES; i++) {
      for (let j = i + 1; j < NODE_COUNT && lineIdx < MAX_LINES; j++) {
        const d2 = dist2(nodes[i], nodes[j]);
        if (d2 < CONNECTED_DIST2) {
          edges.push([i, j]);
          const strength = 1 - Math.sqrt(d2) / CONNECT_DIST;
          const li = lineIdx * 6;
          lp[li] = nodes[i].x; lp[li + 1] = nodes[i].y; lp[li + 2] = nodes[i].z;
          lp[li + 3] = nodes[j].x; lp[li + 4] = nodes[j].y; lp[li + 5] = nodes[j].z;
          // Alternate edge color based on index
          const c = (i + j) % 2 === 0 ? accentCV : altCV;
          lc[li] = c.r * strength; lc[li + 1] = c.g * strength; lc[li + 2] = c.b * strength;
          lc[li + 3] = c.r * strength; lc[li + 4] = c.g * strength; lc[li + 5] = c.b * strength;
          lineIdx++;
        }
      }
    }
    // Zero out remaining slots
    for (let i = lineIdx * 6; i < MAX_LINES * 6; i++) { lp[i] = 0; lc[i] = 0; }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx * 2);

    // ── Animate travellers ──
    travellers.forEach(tr => {
      if (edges.length === 0) return;
      if (tr.t >= 1) {
        // Pick new random edge
        const edge = edges[Math.floor(Math.random() * edges.length)];
        tr.from = edge[0];
        tr.to = edge[1];
        tr.t = 0;
        tr.mesh.material.opacity = 0.85;
      }
      tr.t += tr.speed;
      const fa = nodes[tr.from], ta = nodes[tr.to];
      const px = fa.x + (ta.x - fa.x) * tr.t;
      const py = fa.y + (ta.y - fa.y) * tr.t;
      const pz = fa.z + (ta.z - fa.z) * tr.t;
      const pos = tr.mesh.geometry.attributes.position.array;
      pos[0] = px; pos[1] = py; pos[2] = pz;
      tr.mesh.geometry.attributes.position.needsUpdate = true;
      // Fade in/out at ends
      const fade = Math.sin(tr.t * Math.PI);
      tr.mesh.material.opacity = fade * 0.9;
    });

    // ── Rotate central rings ──
    ring1.rotation.z = t * 0.04;
    ring1.rotation.x = Math.sin(t * 0.12) * 0.3;
    ring2.rotation.y = t * 0.07;
    ring2.rotation.z = t * 0.03;
    ring3.rotation.x = t * 0.1;
    ring3.rotation.y = t * 0.06;

    // ── Rotate spiral arms slowly (like a galaxy) ──
    spiral.rotation.y = t * 0.025;
    spiral.rotation.x = Math.sin(t * 0.07) * 0.08;

    // ── Rotate starfield very slowly ──
    stars.rotation.y = t * 0.003;
    stars.rotation.x = t * 0.001;

    // ── Camera parallax with scroll ──
    targetCamX = mx * 5.5;
    targetCamY = -my * 4;
    const scrollInfluence = scrollY * 0.012;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.position.z = 55 - scrollInfluence * 0.5;
    camera.lookAt(0, 0, 0);

    // ── Whole-scene gentle drift ──
    scene.rotation.y = Math.sin(t * 0.04) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
})();
