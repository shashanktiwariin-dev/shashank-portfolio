/* ================================================================
   PORTFOLIO — Shashank Tiwari
   main.js v2
   ================================================================ */
(function () {

  /* ── THEME ─────────────────────────────────────────────── */
  const root      = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const sunIcon   = document.getElementById('iconSun');
  const moonIcon  = document.getElementById('iconMoon');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (sunIcon)  sunIcon.style.display  = theme === 'light' ? 'none'   : 'inline';
    if (moonIcon) moonIcon.style.display = theme === 'light' ? 'inline' : 'none';
  }

  const saved   = localStorage.getItem('portfolio-theme');
  const prefers = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || prefers);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  /* ── CURSOR ────────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animCursor() {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }

  /* ── NAV SCROLL ────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── HAMBURGER ─────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      mobileMenu.classList.toggle('open', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      });
    });
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ── SHOW MORE / LESS ──────────────────────────────────── */
  const showMoreBtn  = document.getElementById('showMoreBtn');
  const projectsGrid = document.getElementById('projectsGrid');

  if (showMoreBtn && projectsGrid) {
    // How many cards to show initially
    const INITIAL_COUNT = 6;

    function initProjects() {
      const cards = [...projectsGrid.querySelectorAll('.project-card')];
      const hasExtra = cards.length > INITIAL_COUNT;

      cards.forEach((card, i) => {
        if (i >= INITIAL_COUNT) {
          card.classList.add('hidden');
        }
      });

      // Hide button entirely if nothing to expand
      showMoreBtn.parentElement.style.display = hasExtra ? 'flex' : 'none';
    }

    showMoreBtn.addEventListener('click', () => {
      const cards    = [...projectsGrid.querySelectorAll('.project-card')];
      const expanded = showMoreBtn.classList.contains('expanded');

      if (!expanded) {
        // Show all hidden cards with staggered animation
        let delay = 0;
        cards.forEach(card => {
          if (card.classList.contains('hidden')) {
            card.classList.remove('hidden');
            card.classList.remove('fade-in');
            // force reflow
            void card.offsetWidth;
            card.style.animationDelay = delay + 'ms';
            card.classList.add('fade-in');
            delay += 60;
          }
        });
        showMoreBtn.classList.add('expanded');
        showMoreBtn.querySelector('.btn-label').textContent = 'Show Less';
      } else {
        // Hide extras and scroll back to section top
        cards.forEach((card, i) => {
          if (i >= INITIAL_COUNT) {
            card.classList.add('hidden');
            card.classList.remove('fade-in');
            card.style.animationDelay = '';
          }
        });
        showMoreBtn.classList.remove('expanded');
        showMoreBtn.querySelector('.btn-label').textContent = 'Show More Projects';
        // Smooth scroll to projects section
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    initProjects();
  }

  /* ── REVEAL ON SCROLL ─────────────────────────────────── */
  const reveals  = document.querySelectorAll('.reveal');
  const revealOb = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealOb.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(r => revealOb.observe(r));

  /* ── SKILL BARS ───────────────────────────────────────── */
  const bars   = document.querySelectorAll('.bar-fill');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animated'); barObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObs.observe(b));

  /* ── CONTACT FORM FEEDBACK ────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  if (form && sendBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      sendBtn.textContent = 'Sent ✓';
      sendBtn.style.background = 'var(--accent)';
      sendBtn.style.color = '#fff';
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = 'Send Message';
        sendBtn.style.background = ''; sendBtn.style.color = '';
        sendBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

})();
