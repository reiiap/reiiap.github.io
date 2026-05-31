const loader = document.querySelector('.site-loader');

if (loader) {
  const loaderOutput = loader.querySelector('[data-loader-output]');
  const loaderCursor = loader.querySelector('.cursor');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOADER_DURATION = reduceMotion ? 700 : 2400;
  const FADE_DURATION = reduceMotion ? 220 : 500;
  const bootLines = [
    'Initializing ReiiKajurawa Dev...',
    'Loading core modules...',
    'Connecting services...',
    'Compiling interface...',
    'Launching system...',
    'Ready.'
  ];

  let pageLoaded = document.readyState === 'complete';
  let animationDone = false;
  let loaderHidden = false;

  const tryHideLoader = () => {
    if (loaderHidden || !pageLoaded || !animationDone) return;
    loaderHidden = true;
    document.body.classList.add('loading-complete');
    window.setTimeout(() => loader.remove(), FADE_DURATION);
  };

  const typeLine = (line) => new Promise((resolve) => {
    const row = document.createElement('span');
    row.className = `terminal-line${line === 'Ready.' ? ' ready' : ''}`;
    loaderOutput.appendChild(row);

    if (reduceMotion) {
      row.textContent = line;
      resolve();
      return;
    }

    let index = 0;
    const typeNext = () => {
      row.textContent = line.slice(0, index);
      if (loaderCursor) row.appendChild(loaderCursor);
      index += 1;
      if (index <= line.length) {
        window.setTimeout(typeNext, line === 'Ready.' ? 32 : 18);
      } else {
        loaderOutput.appendChild(loaderCursor);
        window.setTimeout(resolve, line === 'Ready.' ? 110 : 95);
      }
    };
    typeNext();
  });

  const runLoaderAnimation = async () => {
    loader.classList.add('is-booting');
    const startedAt = performance.now();
    for (const line of bootLines) {
      await typeLine(line);
    }

    const elapsed = performance.now() - startedAt;
    window.setTimeout(() => {
      animationDone = true;
      tryHideLoader();
    }, Math.max(0, LOADER_DURATION - elapsed));
  };

  if (!pageLoaded) {
    window.addEventListener('load', () => {
      pageLoaded = true;
      tryHideLoader();
    }, { once: true });
  }

  runLoaderAnimation();
}

const nav = document.getElementById('nav');
if (nav) {
  const setNav = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  setNav();
  window.addEventListener('scroll', setNav, { passive: true });
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.links');
if (nav && navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });
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


const activityTimeline = document.querySelector('[data-activity-timeline]');
if (activityTimeline) {
  const activityCards = [...activityTimeline.querySelectorAll('.activity-card')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (activityCards.length > 1 && !prefersReducedMotion) {
    let activeIndex = activityCards.findIndex((card) => card.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;
    window.setInterval(() => {
      activityCards[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % activityCards.length;
      activityCards[activeIndex].classList.add('is-active');
    }, 2600);
  }
}

document.querySelectorAll('[data-project-card]').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${(-y * 3).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 4).toFixed(2)}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

const year = document.getElementById('y');
if (year) year.textContent = new Date().getFullYear();
