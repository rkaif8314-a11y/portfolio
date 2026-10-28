document.documentElement.classList.add('js');
const navLinks = [...document.querySelectorAll('.nav a')];
const hud = document.querySelector('#hud-section');
const hudNames = {
  top: '00 · Origin',
  projects: '01 · Territories',
  more: '02 · More builds',
  experience: '03 · Route',
  skills: '04 · Instruments',
  contact: '05 · Open channel',
};
const sections = Object.keys(hudNames)
  .map((id) => document.getElementById(id))
  .filter((el) => el instanceof HTMLElement);

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      if (hud) hud.textContent = hudNames[id];
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const active = href === `#${id}` || (id === 'top' && href === '#about');
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] },
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

/* Contour field: decorative, aria-hidden, paused off-screen, static with reduced motion. */
const canvas = document.querySelector('#contours');
if (canvas instanceof HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let running = false;
  let frame = 0;
  let pointerX = 0.5;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (t) => {
    if (!ctx || !width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const lines = 26;
    for (let i = 0; i < lines; i += 1) {
      const base = (i / lines) * height * 1.15;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const nx = x / width;
        const y = base
          + Math.sin(nx * 5 + i * 0.35 + t * 0.00022) * 22
          + Math.sin(nx * 11 - i * 0.2 + t * 0.00031 + pointerX * 2) * 9
          + Math.cos(nx * 2.2 + i * 0.12) * 30;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i % 5 === 0 ? 'rgba(242,163,60,0.42)' : 'rgba(206,196,180,0.15)';
      ctx.lineWidth = i % 5 === 0 ? 1.3 : 1;
      ctx.stroke();
    }
  };

  const loop = (t) => {
    if (!running) return;
    draw(t);
    frame = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || reduced.matches) return;
    running = true;
    frame = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  if (ctx) {
    resize();
    draw(0);
    window.addEventListener('resize', () => { resize(); draw(performance.now()); });
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX / window.innerWidth;
    }, { passive: true });
    reduced.addEventListener('change', () => {
      if (reduced.matches) { stop(); draw(0); } else start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(canvas);
    } else {
      start();
    }
  }
}

/* Command palette: combobox + listbox driven by aria-activedescendant.
   Focus stays in the input; Escape restores focus to the trigger. */
const palette = document.querySelector('#palette');
const paletteOpen = document.querySelector('.palette-open');
const paletteInput = document.querySelector('#palette-input');
const paletteList = document.querySelector('#palette-list');
const paletteEmpty = document.querySelector('.palette-empty');

const destinations = [
  { label: 'About', meta: 'Section', href: '#about' },
  { label: 'Territories — all projects', meta: 'Section', href: '#projects' },
  { label: 'Koinelio', meta: 'Project', href: '#koinelio' },
  { label: 'SmartNotepad', meta: 'Project', href: '#smartnotepad' },
  { label: 'ASRS — student record system', meta: 'Project', href: '#asrs' },
  { label: 'NextMarga', meta: 'Project', href: '#nextmarga' },
  { label: 'More builds', meta: 'Section', href: '#more' },
  { label: 'Route', meta: 'Section', href: '#experience' },
  { label: 'Instruments', meta: 'Section', href: '#skills' },
  { label: 'Contact', meta: 'Section', href: '#contact' },
  { label: 'GitHub profile', meta: 'External', href: 'https://github.com/rkaif8314-a11y' },
  { label: 'LinkedIn', meta: 'External', href: 'https://www.linkedin.com/in/kaif-raja-92a116283/' },
  { label: 'Email Kaif', meta: 'External', href: 'mailto:rkaif8314@gmail.com' },
];

let paletteMatches = [];
let paletteResults = [];
let paletteIndex = 0;
let paletteReturnFocus = null;

const setActiveOption = (index) => {
  if (!paletteMatches.length) {
    paletteInput.removeAttribute('aria-activedescendant');
    return;
  }
  paletteIndex = (index + paletteMatches.length) % paletteMatches.length;
  paletteMatches.forEach((item, i) => {
    item.setAttribute('aria-selected', String(i === paletteIndex));
  });
  paletteInput.setAttribute('aria-activedescendant', paletteMatches[paletteIndex].id);
  paletteMatches[paletteIndex].scrollIntoView({ block: 'nearest' });
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
  paletteReturnFocus = paletteOpen;
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
  (paletteReturnFocus instanceof HTMLElement ? paletteReturnFocus : paletteOpen).focus();
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

if (palette && paletteOpen && paletteInput && paletteList) {
  // Show the shortcut that actually works on the visitor's platform.
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
      // The panel is the only focusable region; keep Tab inside it.
      event.preventDefault();
      paletteInput.focus();
    }
  });

  paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));
  palette.addEventListener('click', (event) => {
    if (event.target === palette) closePalette();
  });
  renderPalette();
}

const yearTarget = document.querySelector('#year');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();
