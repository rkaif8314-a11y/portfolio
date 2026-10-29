/* Engineering Atlas: interactive 360-degree Three.js scene.
 * Uses the pinned Three.js ESM import map from index.html.
 * The scene is decorative/supplementary; project links remain ordinary HTML.
 */
(async function initEngineeringAtlasScene() {
  const canvas = document.querySelector('#atlas-3d');
  const hero = document.querySelector('#top');
  if (!(canvas instanceof HTMLCanvasElement) || !hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const resetButton = document.querySelector('#scene-reset');
  const controlsPanel = document.querySelector('#scene-controls');

  let THREE;
  let OrbitControls;
  try {
    THREE = await import('three');
    ({ OrbitControls } = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js'));
  } catch {
    // CDN/module failures leave the original contour canvas visible.
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    // WebGL may be unavailable or disabled; the page still has its original CSS/canvas background.
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.AmbientLight(0xc7d2e2, 1.25));
  const keyLight = new THREE.PointLight(0xffb14d, 38, 24);
  keyLight.position.set(3.5, 3.4, 5.5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x718ac6, 22, 22);
  rimLight.position.set(-4.2, -1.8, -2);
  scene.add(rimLight);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x141a22,
    metalness: 0.72,
    roughness: 0.26,
    emissive: 0x351b08,
    emissiveIntensity: 0.62,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.06, 3), coreMaterial);
  root.add(core);

  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.075, 2),
    new THREE.MeshBasicMaterial({ color: 0xf2a33c, wireframe: true, transparent: true, opacity: 0.3 }),
  );
  root.add(coreWire);

  const innerSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 40, 28),
    new THREE.MeshBasicMaterial({ color: 0xf2a33c, wireframe: true, transparent: true, opacity: 0.1 }),
  );
  root.add(innerSphere);

  const ringMaterial = (color, opacity) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });

  const rings = [
    { radius: 1.75, tube: 0.009, rot: [0.92, 0.18, 0.22], color: 0xf2a33c, opacity: 0.66 },
    { radius: 2.18, tube: 0.006, rot: [1.22, 0.3, -0.64], color: 0xd8d9e1, opacity: 0.29 },
    { radius: 2.58, tube: 0.005, rot: [0.28, 0.8, 0.45], color: 0xf2a33c, opacity: 0.38 },
  ];
  rings.forEach(({ radius, tube, rot, color, opacity }) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 220), ringMaterial(color, opacity));
    ring.rotation.set(...rot);
    root.add(ring);
  });

  // Faint geodesic lines create structure without hiding the central form.
  const geodesic = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.5, 1)),
    new THREE.LineBasicMaterial({ color: 0xd5d9e3, transparent: true, opacity: 0.13 }),
  );
  root.add(geodesic);

  // Light-weight starfield: deterministic placement keeps the scene stable between visits.
  const starPositions = new Float32Array(360 * 3);
  for (let i = 0; i < 360; i += 1) {
    const a = i * 2.399963229728653;
    const radius = 3.2 + ((i * 37) % 101) / 100 * 4.6;
    starPositions[i * 3] = Math.cos(a) * radius;
    starPositions[i * 3 + 1] = Math.sin(a * 1.31) * (2.1 + ((i * 13) % 37) / 30);
    starPositions[i * 3 + 2] = -3.8 + ((i * 19) % 47) / 47 * 5;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({ color: 0xe6d8c3, size: 0.019, transparent: true, opacity: 0.55, sizeAttenuation: true }),
  );
  scene.add(stars);

  const projectDefs = [
    { id: 'koinelio', angle: -0.6, y: 0.8, z: 0.28 },
    { id: 'nextmarga', angle: 0.65, y: 1.14, z: -0.18 },
    { id: 'smartnotepad', angle: 2.2, y: -0.8, z: 0.38 },
    { id: 'asrs', angle: 3.85, y: -0.95, z: -0.28 },
  ];
  const projectNodes = [];
  const connectorMaterial = new THREE.LineBasicMaterial({ color: 0xf2a33c, transparent: true, opacity: 0.36 });
  projectDefs.forEach((project, index) => {
    const position = new THREE.Vector3(
      Math.cos(project.angle) * (2.28 + (index % 2) * 0.18),
      project.y,
      project.z,
    );
    const connector = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), position.clone()]),
      connectorMaterial,
    );
    root.add(connector);

    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 18, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffc36d,
        emissive: 0x8a470b,
        emissiveIntensity: 1.2,
        metalness: 0.35,
        roughness: 0.24,
      }),
    );
    node.position.copy(position);
    node.userData.projectId = project.id;
    node.userData.baseScale = 1;
    root.add(node);
    projectNodes.push(node);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xf2a33c, transparent: true, opacity: 0.09, depthWrite: false }),
    );
    halo.position.copy(position);
    root.add(halo);
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-2, -2);
  let pressedAt = null;
  let hoveredNode = null;

  function intersectProject(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(projectNodes, false)[0]?.object || null;
  }

  canvas.addEventListener('pointerdown', (event) => {
    pressedAt = { x: event.clientX, y: event.clientY, dragged: false };
  }, { passive: true });

  canvas.addEventListener('pointermove', (event) => {
    if (pressedAt && Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) > 7) {
      pressedAt.dragged = true;
    }
    if (pressedAt?.dragged) return;
    const hit = intersectProject(event);
    if (hoveredNode && hoveredNode !== hit) hoveredNode.scale.setScalar(1);
    if (hit) hit.scale.setScalar(1.42);
    hoveredNode = hit;
    canvas.style.cursor = hit ? 'pointer' : 'grab';
  }, { passive: true });

  canvas.addEventListener('pointerleave', () => {
    if (hoveredNode) hoveredNode.scale.setScalar(1);
    hoveredNode = null;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('pointerup', (event) => {
    if (pressedAt && !pressedAt.dragged && Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) < 7) {
      const target = intersectProject(event);
      const destination = target?.userData?.projectId;
      if (destination && document.getElementById(destination)) {
        document.getElementById(destination).scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }
    pressedAt = null;
  });

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reducedMotion.matches;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = !reducedMotion.matches;
  controls.autoRotateSpeed = 0.34;
  controls.minPolarAngle = 0.42;
  controls.maxPolarAngle = Math.PI - 0.42;
  controls.rotateSpeed = 0.58;

  let running = false;
  let inView = true;
  let frame = 0;
  function render() {
    renderer.render(scene, camera);
  }
  function animate() {
    if (!running) return;
    if (!reducedMotion.matches) {
      controls.update();
      stars.rotation.y += 0.000055;
    }
    render();
    frame = requestAnimationFrame(animate);
  }
  function start() {
    if (running || document.hidden || !inView || reducedMotion.matches) return;
    running = true;
    frame = requestAnimationFrame(animate);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    render();
  }

  controls.addEventListener('change', () => {
    if (!running || reducedMotion.matches) render();
  });

  let compactLayout = window.matchMedia('(max-width: 700px)').matches;
  function placeScene(force = false) {
    const nextCompact = window.matchMedia('(max-width: 700px)').matches;
    if (!force && compactLayout === nextCompact) return;
    compactLayout = nextCompact;
    const centerX = nextCompact ? 0.85 : 2.18;
    root.position.set(centerX, 0.03, 0);
    root.scale.setScalar(nextCompact ? 0.7 : 1);
    camera.position.set(centerX, 0.04, 11);
    controls.target.set(centerX, 0, 0);
    controls.update();
    controls.saveState();
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    placeScene();
    render();
  }

  placeScene(true);
  resize();
  if (controlsPanel) controlsPanel.hidden = false;
  document.documentElement.classList.add('atlas-webgl-ready');

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      controls.reset();
      if (!reducedMotion.matches) start();
      render();
    });
  }

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    }, { threshold: 0.08 });
    observer.observe(hero);
  } else {
    start();
  }

  reducedMotion.addEventListener('change', () => {
    controls.autoRotate = !reducedMotion.matches;
    controls.enableDamping = !reducedMotion.matches;
    if (reducedMotion.matches) {
      stop();
      render();
    } else {
      start();
    }
  });

  window.addEventListener('pagehide', () => {
    stop();
    controls.dispose();
    scene.traverse((object) => {
      if (object.geometry?.dispose) object.geometry.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
    renderer.dispose();
  }, { once: true });
})();
