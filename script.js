const navLinks = [...document.querySelectorAll('.side-nav a')];
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

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

