// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (navToggle && nav) {
  const backdrop = document.getElementById('nav-backdrop');
  const body = document.body;
  const closeMenu = () => {
    nav.classList.remove('show');
    backdrop && backdrop.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  };
  const openMenu = () => {
    nav.classList.add('show');
    backdrop && backdrop.classList.add('show');
    navToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  };
  const closeBtn = document.getElementById('nav-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navToggle.addEventListener('click', () => {
    const open = !nav.classList.contains('show');
    open ? openMenu() : closeMenu();
  });
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// Sticky header shadow
const header = document.querySelector('.site-header');
const onScrollHeader = () => {
  if (!header) return;
  const y = window.scrollY || window.pageYOffset;
  header.classList.toggle('is-scrolled', y > 10);
};
window.addEventListener('scroll', onScrollHeader);
onScrollHeader();

// Back to top button
const toTop = document.getElementById('to-top');
const revealToTop = () => {
  if (!toTop) return;
  const y = window.scrollY || window.pageYOffset;
  if (y > 300) toTop.classList.add('show'); else toTop.classList.remove('show');
};
window.addEventListener('scroll', revealToTop);
revealToTop();
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Year
const yEl = document.getElementById('year');
if (yEl) yEl.textContent = String(new Date().getFullYear());

// Form behavior (static demo)
const form = document.getElementById('inquiry-form');
const statusEl = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Basic front-end validation
    if (!payload.name || !payload.email || !payload.message) {
      statusEl.textContent = 'Please fill out all required fields.';
      statusEl.style.color = '#b91c1c';
      return;
    }

    // Simulate sending
    statusEl.textContent = 'Sending...';
    statusEl.style.color = '#6b7280';
    setTimeout(() => {
      statusEl.textContent = 'Thank you! Your inquiry has been noted.';
      statusEl.style.color = '#166534';
      form.reset();
    }, 900);
  });
}

// Intersection Observer: reveal products/cards on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const revealEls = document.querySelectorAll('.product, .card, .img-card img');
  const sectionRevealEls = document.querySelectorAll('#mission');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));
  sectionRevealEls.forEach(el => observer.observe(el));
}

// Smooth anchor scroll
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(l => {
  l.addEventListener('click', (e) => {
    const id = l.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Magic line indicator (desktop only)
(function() {
  const nav = document.getElementById('site-nav');
  const indicator = document.getElementById('nav-indicator');
  if (!nav || !indicator) return;

  const isMobile = () => window.matchMedia('(max-width: 640px)').matches;

  const setToLink = (link) => {
    if (!link || isMobile()) { indicator.style.opacity = '0'; return; }
    const linkRect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const x = linkRect.left - navRect.left;
    const w = linkRect.width;
    indicator.style.opacity = '1';
    indicator.style.transform = `translateX(${Math.round(x)}px)`;
    indicator.style.width = `${Math.round(w)}px`;
  };

  let activeLink = null;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));

  // Hover/focus handling
  links.forEach(a => {
    a.addEventListener('mouseenter', () => setToLink(a));
    a.addEventListener('focus', () => setToLink(a));
  });
  nav.addEventListener('mouseleave', () => setToLink(activeLink));
  window.addEventListener('resize', () => setToLink(activeLink));

  // Scrollspy for active section
  const sectionIds = links.map(a => a.getAttribute('href')).filter(Boolean);
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    let best = null;
    let maxRatio = 0;
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > maxRatio) {
        maxRatio = e.intersectionRatio;
        best = e.target;
      }
    });
    if (best) {
      const id = '#' + best.id;
      links.forEach(a => {
        const isActive = a.getAttribute('href') === id;
        a.toggleAttribute('aria-current', isActive);
        if (isActive) activeLink = a;
      });
      setToLink(activeLink);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  sections.forEach(s => spy.observe(s));
})();

// Button ripple origin from pointer position
(function() {
  const btns = document.querySelectorAll('.btn');
  btns.forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      btn.style.setProperty('--x', x + 'px');
      btn.style.setProperty('--y', y + 'px');
    });
  });
})();
