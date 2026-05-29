const nav = document.getElementById('nav');
if (nav) {
  const setNav = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  setNav();
  window.addEventListener('scroll', setNav, { passive: true });
}

const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = Number(el.dataset.target || 0);
  const duration = 950;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    if (entry.target.classList.contains('counter') && !entry.target.dataset.done) {
      entry.target.dataset.done = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: .16 }) : null;

document.querySelectorAll('.reveal, .counter').forEach((el) => {
  if (io) io.observe(el);
  else el.classList.add('show');
});

const year = document.getElementById('y');
if (year) year.textContent = new Date().getFullYear();
