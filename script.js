document.documentElement.classList.add('js');

/* Rail navigation: mark the section currently in view. */
const railLinks = [...document.querySelectorAll('.rail-nav a')];
const watched = railLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter((el) => el instanceof HTMLElement);

if ('IntersectionObserver' in window && watched.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.3, 0.6] },
  );
  watched.forEach((el) => spy.observe(el));
}

/* Live system topology — decorative backdrop.
   Nodes drift, links join nearest neighbours, and packets travel along links so
   the field reads as a running system rather than a pattern. Guardrails: DPR
   capped, node budget scales with area, ~30fps cap, paused off-screen and when
   the tab is hidden, one static frame under prefers-reduced-motion. */
const topologyCanvas = document.querySelector('#topology');

if (topologyCanvas instanceof HTMLCanvasElement) {
  const ctx = topologyCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodeCountEl = document.querySelector('#node-count');
  const linkCountEl = document.querySelector('#link-count');

  const FRAME_MS = 1000 / 30;
  const MAX_NODES = 54;

  let width = 0;
  let height = 0;
  let nodes = [];
  let links = [];
  let packets = [];
  let running = false;
  let rafId = 0;
  let lastPaint = 0;
  let isOnScreen = true;
  let pointer = { x: 0.5, y: 0.5 };

  const rand = (min, max) => min + Math.random() * (max - min);

  const buildScene = () => {
    const budget = Math.round((width * height) / 26000);
    const count = Math.max(14, Math.min(MAX_NODES, budget));

    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-0.045, 0.045),
      vy: rand(-0.045, 0.045),
      r: rand(1.4, 3.2),
      hub: Math.random() < 0.16,
      phase: Math.random() * Math.PI * 2,
    }));

    // Link each node to its two nearest neighbours, de-duplicated.
    const seen = new Set();
    links = [];
    nodes.forEach((node, i) => {
      nodes
        .map((other, j) => ({ j, d: (other.x - node.x) ** 2 + (other.y - node.y) ** 2 }))
        .filter((entry) => entry.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          links.push({ a: i, b: j });
        });
    });

    packets = links
      .filter(() => Math.random() < 0.55)
      .map((link) => ({ link, t: Math.random(), speed: rand(0.0016, 0.0052) }));

    if (nodeCountEl) nodeCountEl.textContent = String(nodes.length);
    if (linkCountEl) linkCountEl.textContent = String(links.length);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = topologyCanvas.clientWidth;
    height = topologyCanvas.clientHeight;
    topologyCanvas.width = Math.max(1, Math.round(width * dpr));
    topologyCanvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScene();
  };

  const advance = () => {
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      node.x = Math.min(Math.max(node.x, 0), width);
      node.y = Math.min(Math.max(node.y, 0), height);
    });
    packets.forEach((packet) => {
      packet.t += packet.speed;
      if (packet.t > 1) packet.t -= 1;
    });
  };
  const paint = (time) => {
    if (!ctx || !width || !height) return;
    const shiftX = (pointer.x - 0.5) * 18;
    const shiftY = (pointer.y - 0.5) * 12;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(shiftX, shiftY);

    // Links: dimmed by length so distant pairs recede.
    links.forEach((link) => {
      const a = nodes[link.a];
      const b = nodes[link.b];
      if (!a || !b) return;
      const dist = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const fade = Math.max(0, 1 - dist / (Math.min(width, height) * 0.55));
      ctx.strokeStyle = `rgba(234,229,236,${(0.05 + fade * 0.13).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    // Packets: short amber trails travelling along their link.
    packets.forEach((packet) => {
      const a = nodes[packet.link.a];
      const b = nodes[packet.link.b];
      if (!a || !b) return;
      const x = a.x + (b.x - a.x) * packet.t;
      const y = a.y + (b.y - a.y) * packet.t;
      const tail = Math.max(0, packet.t - 0.14);
      const tx = a.x + (b.x - a.x) * tail;
      const ty = a.y + (b.y - a.y) * tail;
      const trail = ctx.createLinearGradient(tx, ty, x, y);
      trail.addColorStop(0, 'rgba(242,163,60,0)');
      trail.addColorStop(1, 'rgba(242,163,60,0.75)');
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,206,138,0.9)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nodes: hairline rings; hubs pulse amber.
    nodes.forEach((node) => {
      const pulse = node.hub ? 0.35 + 0.25 * Math.sin(time * 0.0011 + node.phase) : 0.18;
      ctx.strokeStyle = node.hub
        ? `rgba(242,163,60,${pulse.toFixed(3)})`
        : `rgba(234,229,236,${pulse.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = node.hub ? 'rgba(242,163,60,0.85)' : 'rgba(234,229,236,0.5)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  const loop = (time) => {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (time - lastPaint < FRAME_MS) return; // ~30fps ceiling
    lastPaint = time;
    advance();
    paint(time);
  };

  const start = () => {
    if (running || reducedMotion.matches) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  if (ctx) {
    resize();
    paint(0);

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); if (!running) paint(performance.now()); }, 180);
    });
    window.addEventListener('pointermove', (event) => {
      pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
    }, { passive: true });

    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) { stop(); paint(0); } else start();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (isOnScreen) start();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        isOnScreen = entry.isIntersecting;
        if (isOnScreen) start(); else stop();
      }, { threshold: 0.02 }).observe(topologyCanvas);
    } else {
      start();
    }
  }
}


const yearTarget = document.querySelector('#year');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();

/* Command palette: combobox + listbox driven by aria-activedescendant.
   Focus stays in the field; Escape restores it to the trigger. */
const palette = document.querySelector('#palette');
const paletteOpen = document.querySelector('.palette-open');
const paletteInput = document.querySelector('#palette-input');
const paletteList = document.querySelector('#palette-list');
const paletteEmpty = document.querySelector('.palette-empty');

const destinations = [
  { label: 'About', meta: 'Section', href: '#about' },
  { label: 'Route so far', meta: 'Section', href: '#experience' },
  { label: 'Selected work', meta: 'Section', href: '#projects' },
  { label: 'Koinelio', meta: 'Project', href: '#koinelio' },
  { label: 'SmartNotepad', meta: 'Project', href: '#smartnotepad' },
  { label: 'ASRS', meta: 'Project', href: '#asrs' },
  { label: 'NextMarga', meta: 'Project', href: '#nextmarga' },
  { label: 'Smaller builds', meta: 'Section', href: '#more' },
  { label: 'Tech stack', meta: 'Section', href: '#skills' },
  { label: 'Contact', meta: 'Section', href: '#contact' },
  { label: 'GitHub profile', meta: 'External', href: 'https://github.com/rkaif8314-a11y' },
  { label: 'LinkedIn', meta: 'External', href: 'https://www.linkedin.com/in/kaif-raja-92a116283/' },
  { label: 'Email Kaif', meta: 'External', href: 'mailto:rkaif8314@gmail.com' },
];

let paletteMatches = [];
let paletteResults = [];
let paletteIndex = 0;

const setActiveOption = (index) => {
  if (!paletteMatches.length) {
    paletteInput.removeAttribute('aria-activedescendant');
    return;
  }
  paletteIndex = (index + paletteMatches.length) % paletteMatches.length;
  paletteMatches.forEach((item, i) => item.setAttribute('aria-selected', String(i === paletteIndex)));
  paletteInput.setAttribute('aria-activedescendant', paletteMatches[paletteIndex].id);
  paletteMatches[paletteIndex].scrollIntoView({ block: 'nearest' });
};

const go = (dest) => {
  closePalette();
  if (dest.href.startsWith('#')) {
    const target = document.querySelector(dest.href);
    if (target) {
      target.scrollIntoView();
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    history.replaceState(null, '', dest.href);
  } else {
    window.open(dest.href, '_blank', 'noopener');
  }
};

const renderPalette = (query = '') => {
  const q = query.trim().toLowerCase();
  const results = q
    ? destinations.filter((d) => `${d.label} ${d.meta}`.toLowerCase().includes(q))
    : destinations;

  paletteList.replaceChildren();
  paletteResults = results;
  paletteMatches = results.map((dest, i) => {
    const li = document.createElement('li');
    li.className = 'palette-item';
    li.id = `palette-option-${i}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    const text = document.createElement('span');
    text.textContent = dest.label;
    const meta = document.createElement('span');
    meta.textContent = dest.meta;
    li.append(text, meta);
    li.addEventListener('pointerdown', (event) => {
      event.preventDefault(); // keep focus in the dialog until it closes
      go(dest);
    });
    paletteList.append(li);
    return li;
  });

  paletteEmpty.hidden = paletteMatches.length > 0;
  setActiveOption(0);
};

const openPalette = () => {
  palette.hidden = false;
  paletteOpen.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  renderPalette(paletteInput.value);
  paletteInput.focus();
};

const closePalette = () => {
  palette.hidden = true;
  paletteOpen.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  paletteInput.value = '';
  paletteOpen.focus();
};

if (palette && paletteOpen && paletteInput && paletteList) {
  const shortcutLabel = paletteOpen.querySelector('.palette-key');
  if (shortcutLabel && !/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    shortcutLabel.textContent = 'Ctrl K';
  }

  paletteOpen.addEventListener('click', openPalette);

  document.addEventListener('keydown', (event) => {
    const isOpen = !palette.hidden;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      isOpen ? closePalette() : openPalette();
      return;
    }
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closePalette();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveOption(paletteIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveOption(paletteIndex - 1);
    } else if (event.key === 'Enter' && paletteResults.length) {
      event.preventDefault();
      const chosen = paletteResults[paletteIndex];
      if (chosen) go(chosen);
    } else if (event.key === 'Tab') {
      event.preventDefault(); // the panel is the only focusable region
      paletteInput.focus();
    }
  });

  paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));
  palette.addEventListener('click', (event) => {
    if (event.target === palette) closePalette();
  });
  renderPalette();
}
