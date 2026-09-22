const navLinks = [...document.querySelectorAll('.side-nav a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter((section) => section instanceof HTMLElement);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const activeLink = navLinks.find(
        (link) => link.getAttribute('href') === `#${visible.target.id}`,
      );
      if (!activeLink) return;
      navLinks.forEach((item) => item.classList.remove('active'));
      activeLink.classList.add('active');
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const sceneShell = document.querySelector('.scene-shell');
if (sceneShell && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  sceneShell.addEventListener('pointermove', (event) => {
    const rect = sceneShell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 18;

    sceneShell.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  sceneShell.addEventListener('pointerleave', () => {
    sceneShell.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

const yearTarget = document.querySelector('#year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}
