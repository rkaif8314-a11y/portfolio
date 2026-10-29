import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const shell = document.querySelector('.scene-shell');
const fallback = document.querySelector('#contours');
const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
const AMBER = 0xf2a33c;

const PROJECTS = [
  { id: 'koinelio', name: 'Koinelio', note: 'Campus community platform. In progress · pilot.', r: 2.2, tilt: 0.25 },
  { id: 'smartnotepad', name: 'SmartNotepad', note: 'Smart cloud notepad. Active development.', r: 3.0, tilt: -0.3 },
  { id: 'asrs', name: 'ASRS', note: 'IIT Bhilai record system. Demo.', r: 3.8, tilt: 0.15 },
  { id: 'nextmarga', name: 'NextMarga', note: 'Opportunity discovery and guidance. Active development.', r: 4.6, tilt: -0.2 },
];

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

function init() {
  const canvas = document.createElement('canvas');
  canvas.id = 'atlas-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive 3D orbital map of four projects. Drag to rotate. All projects are also listed as links.');
  const mobile = window.matchMedia('(max-width: 720px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true });
  const maxDpr = mobile ? 1.25 : 2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const home = new THREE.Vector3(0, 4.4, mobile ? 14.5 : 11);
  camera.position.copy(home);

  const root = new THREE.Group();
  scene.add(root);
  const disposables = [];
  const track = (o) => { disposables.push(o); return o; };

  scene.add(new THREE.AmbientLight(0x8896aa, 0.6));
  const key = new THREE.PointLight(AMBER, 40, 30);
  scene.add(key);

  const coreGeo = track(new THREE.IcosahedronGeometry(0.82, 1));
  const core = new THREE.Mesh(
    coreGeo,
    track(new THREE.MeshStandardMaterial({ color: 0x0d1015, emissive: 0x3a2408, emissiveIntensity: 0.5, flatShading: true, metalness: 0.55, roughness: 0.36 })),
  );
  const cage = new THREE.LineSegments(
    track(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.16, 1))),
    track(new THREE.LineBasicMaterial({ color: 0xcec4b4, transparent: true, opacity: 0.35 })),
  );
  const coreEdges = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(coreGeo)),
    track(new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.85 })),
  );
  root.add(core, coreEdges, cage);

  const ringMat = track(new THREE.LineBasicMaterial({ color: 0xcec4b4, transparent: true, opacity: 0.22 }));
  const nodeGeo = track(new THREE.SphereGeometry(0.095, 18, 18));
  const nodes = [];
  PROJECTS.forEach((p, i) => {
    const pivot = new THREE.Group();
    pivot.rotation.x = p.tilt;
    pivot.rotation.y = i * 1.6;
    const pts = [];
    for (let k = 0; k <= 128; k += 1) {
      const t = (k / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * p.r, 0, Math.sin(t) * p.r));
    }
    pivot.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), ringMat));
    const mat = track(new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: AMBER, emissiveIntensity: 1.1 }));
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(p.r, 0, 0);
    mesh.userData.id = p.id;
    pivot.add(mesh);
    root.add(pivot);
    nodes.push({ p, mesh, mat, pivot });
  });

  const count = mobile ? 250 : 700;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 5 + Math.random() * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  root.add(new THREE.Points(dustGeo, track(new THREE.PointsMaterial({ color: 0xcec4b4, size: 0.03, transparent: true, opacity: 0.6 }))));

  const linkGeo = track(new THREE.BufferGeometry());
  linkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PROJECTS.length * 6), 3));
  const linkLines = new THREE.LineSegments(linkGeo, track(new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.25 })));
  linkLines.frustumCulled = false;
  root.add(linkLines);

  // Full horizontal orbit, clamped vertical angle, no pan/zoom.
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.rotateSpeed = 0.6;
  controls.touches = { ONE: THREE.TOUCH.ROTATE };

  shell.appendChild(canvas);
  if (fallback) fallback.style.display = 'none';
  shell.classList.add('webgl');
  canvas.style.touchAction = 'pan-y'; // vertical swipes keep scrolling the page

  const panel = document.createElement('div');
  panel.className = 'atlas-panel';
  panel.innerHTML = '<p class="coord atlas-hint">Drag to rotate · select a node</p><div class="atlas-info" aria-live="polite" hidden><strong></strong><span></span><a class="btn btn-ghost">Open case study</a></div><button type="button" class="btn btn-ghost atlas-reset">Reset view</button>';
  shell.parentElement.appendChild(panel);
  const info = panel.querySelector('.atlas-info');
  const title = info.querySelector('strong');
  const note = info.querySelector('span');
  const openLink = info.querySelector('a');
  const hint = panel.querySelector('.atlas-hint');

  let selected = null;
  let resetting = false;
  const select = (id) => {
    selected = id;
    const n = nodes.find((x) => x.p.id === id);
    info.hidden = !n;
    hint.hidden = !!n;
    if (n) {
      title.textContent = n.p.name;
      note.textContent = n.p.note;
      openLink.href = `#${n.p.id}`;
    }
  };
  panel.querySelector('.atlas-reset').addEventListener('click', () => { select(null); resetting = true; });

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downAt = null;
  const onDown = (e) => { downAt = [e.clientX, e.clientY]; };
  const onUp = (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(nodes.map((n) => n.mesh), false)[0];
    select(hit ? hit.object.userData.id : null);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);

  // Hover/focus on the HTML project index highlights the matching node.
  let hovered = null;
  const cleanups = [];
  document.querySelectorAll('.index a').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const on = () => { hovered = id; };
    const off = () => { hovered = null; };
    ['mouseenter', 'focus'].forEach((ev) => a.addEventListener(ev, on));
    ['mouseleave', 'blur'].forEach((ev) => a.addEventListener(ev, off));
    cleanups.push(() => {
      ['mouseenter', 'focus'].forEach((ev) => a.removeEventListener(ev, on));
      ['mouseleave', 'blur'].forEach((ev) => a.removeEventListener(ev, off));
    });
  });

  const resize = () => {
    const w = shell.clientWidth;
    const h = shell.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (w > 900) camera.setViewOffset(w, h, -w * 0.27, -h * 0.04, w, h);
    else camera.setViewOffset(w, h, 0, -h * 0.26, w, h);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(shell);
  resize();

  let running = false;
  let visible = true;
  let frame = 0;
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const render = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (!reducedMq.matches) {
      core.rotation.y += dt * 0.25;
      cage.rotation.y -= dt * 0.12;
      nodes.forEach((n, i) => { n.pivot.rotation.y += dt * (0.18 - i * 0.03); });
    }
    if (resetting) {
      camera.position.lerp(home, 0.08);
      if (camera.position.distanceTo(home) < 0.02) resetting = false;
    }
    const lp = linkGeo.attributes.position;
    nodes.forEach((n, i) => {
      n.mesh.getWorldPosition(tmp);
      root.worldToLocal(tmp);
      lp.setXYZ(i * 2, 0, 0, 0);
      lp.setXYZ(i * 2 + 1, tmp.x, tmp.y, tmp.z);
      const on = n.p.id === selected || n.p.id === hovered;
      const s = on ? 1.8 : 1;
      n.mesh.scale.x += (s - n.mesh.scale.x) * 0.15;
      n.mesh.scale.y = n.mesh.scale.x;
      n.mesh.scale.z = n.mesh.scale.x;
      n.mat.emissiveIntensity = on ? 2 : 0.4 + Math.sin(t * 2 + i) * 0.1;
    });
    lp.needsUpdate = true;
    key.intensity = 40 + Math.sin(t * 0.8) * 4;
    controls.update();
    renderer.render(scene, camera);
  };
  const loop = () => {
    if (!running) return;
    render();
    frame = requestAnimationFrame(loop);
  };
  const sync = () => {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; clock.getDelta(); frame = requestAnimationFrame(loop); }
    else if (!should && running) { running = false; cancelAnimationFrame(frame); }
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
  io.observe(shell);
  document.addEventListener('visibilitychange', sync);
  sync();

  const teardown = () => {
    running = false;
    cancelAnimationFrame(frame);
    io.disconnect();
    ro.disconnect();
    controls.dispose();
    document.removeEventListener('visibilitychange', sync);
    cleanups.forEach((fn) => fn());
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    canvas.remove();
    panel.remove();
    shell.classList.remove('webgl');
    if (fallback) fallback.style.display = '';
  };
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); teardown(); });
  window.addEventListener('pagehide', teardown, { once: true });
  window.__atlas = { camera, controls, select };
}

if (shell && webglAvailable()) {
  try {
    init();
  } catch (err) {
    console.error('Atlas scene failed, using 2D fallback:', err);
    shell.querySelector('#atlas-canvas')?.remove();
    shell.parentElement.querySelector('.atlas-panel')?.remove();
    shell.classList.remove('webgl');
    if (fallback) fallback.style.display = '';
  }
}
