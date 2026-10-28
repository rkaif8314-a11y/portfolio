document.documentElement.classList.add('js');
const navLinks = [...document.querySelectorAll('.nav a')];
const hud = document.querySelector('#hud-section');
const hudNames = {
  top: '00 · Origin',
  projects: '01 · Territories',
  experience: '02 · Route',
  skills: '03 · Instruments',
  contact: '04 · Open channel',
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
      ctx.strokeStyle = i % 5 === 0 ? 'rgba(181,255,93,0.45)' : 'rgba(166,178,192,0.18)';
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

const yearTarget = document.querySelector('#year');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();
