// theme.js — Portfolio interactions: theme, menu, animations, gallery, effects

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════
  //  THEME TOGGLE
  // ═══════════════════════════════════
  const themeToggleBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const os = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initial = saved || os;
  document.documentElement.setAttribute('data-theme', initial);
  setIcon(initial);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setIcon(next);
    });
  }

  function setIcon(t) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = t === 'light'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }

  // ═══════════════════════════════════
  //  MOBILE MENU + DROPDOWN
  // ═══════════════════════════════════
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const nNav = document.querySelector('.n-nav');

  if (mobileBtn && nNav) {
    mobileBtn.addEventListener('click', () => {
      nNav.classList.toggle('nav-open');
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll('.has-dropdown').forEach(dd => {
    const trigger = dd.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          dd.classList.toggle('open');
        }
      });
    }
  });



  // ═══════════════════════════════════
  //  CURSOR GLOW TRAIL
  // ═══════════════════════════════════
  if (window.innerWidth > 900) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    let gx = 0, gy = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { gx = e.clientX; gy = e.clientY; });
    (function glowLoop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      requestAnimationFrame(glowLoop);
    })();
  }

  // ═══════════════════════════════════
  //  CLICK RIPPLE
  // ═══════════════════════════════════
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  // ═══════════════════════════════════
  //  MAGNETIC HOVER ON BUTTONS/TILES
  // ═══════════════════════════════════
  if (window.innerWidth > 900) {
    document.querySelectorAll('.btn, .tile, .contact-icon-card').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.15;
        const dy = (e.clientY - r.top - r.height / 2) * 0.15;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════
  //  GSAP HERO STAGGER ANIMATIONS
  // ═══════════════════════════════════
  if (typeof gsap !== 'undefined') {
    gsap.from('.p-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.1 });
    gsap.from('.p-lead', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.btn-row .btn', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.4, stagger: 0.15 });
  }

  // ═══════════════════════════════════
  //  ANIMATED STAT COUNTERS
  // ═══════════════════════════════════
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const text = el.textContent.trim();
      const num = parseFloat(text);
      if (isNaN(num)) return;
      countObs.unobserve(el);
      const isFloat = text.includes('.');
      const suffix = text.replace(/[\d.]/g, '');
      const dur = 1200;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = num * ease;
        el.textContent = (isFloat ? val.toFixed(2) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-n').forEach(el => countObs.observe(el));

  // ═══════════════════════════════════
  //  TILT PARALLAX ON CARDS
  // ═══════════════════════════════════
  if (window.innerWidth > 900) {
    document.querySelectorAll('.hl-item, .ic, .skill-group, .gallery-card').forEach(el => {
      el.style.transition = 'transform 0.15s ease';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════
  //  PAGE TRANSITION
  // ═══════════════════════════════════
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || a.getAttribute('target') === '_blank') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });

  // Fade in on page load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
  });

  // ═══════════════════════════════════
  //  GALLERY FILTER TABS
  // ═══════════════════════════════════
  const filterBtns = document.querySelectorAll('.gf-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ═══════════════════════════════════
  //  GALLERY LIGHTBOX
  // ═══════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lb-img');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    let items = [];
    let currentIdx = 0;

    function collectItems() {
      items = Array.from(document.querySelectorAll('.gallery-card:not(.hidden) .gallery-card-inner img'));
    }

    function openLB(idx) {
      collectItems();
      if (idx < 0 || idx >= items.length) return;
      currentIdx = idx;
      lbImg.src = items[idx].src;
      lbImg.alt = items[idx].alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLB() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Attach click to gallery cards
    document.querySelectorAll('.gallery-card').forEach((card, i) => {
      card.addEventListener('click', () => openLB(i));
    });

    if (lbClose) lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
    if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); openLB(currentIdx - 1); });
    if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); openLB(currentIdx + 1); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') openLB(currentIdx - 1);
      if (e.key === 'ArrowRight') openLB(currentIdx + 1);
    });
  }



  // ═══════════════════════════════════
  //  CONTACT FORM (cosmetic)
  // ═══════════════════════════════════
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      if (btn) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#22c55e';
        setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 2500);
      }
    });
  }
  // ═══════════════════════════════════
  //  HERO CAROUSEL (8-second auto-advance)
  // ═══════════════════════════════════
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.hc-slide');
    const dotsContainer = document.getElementById('hc-dots');
    let currentSlide = 0;
    let carouselInterval;
    let paused = false;

    // Build dot indicators and slide click handle
    slides.forEach((slide, i) => {
      // Make entire slide clickable
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', (e) => {
        if (!e.target.closest('a') && !e.target.closest('button')) {
          const link = slide.querySelector('a');
          if (link) window.location.href = link.href;
        }
      });

      const dot = document.createElement('button');
      dot.className = 'hc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(i);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    function goToSlide(idx) {
      slides[currentSlide].classList.remove('active');
      dotsContainer.children[currentSlide].classList.remove('active');
      currentSlide = idx % slides.length;
      slides[currentSlide].classList.add('active');
      dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() {
      if (!paused) goToSlide(currentSlide + 1);
    }

    function resetInterval() {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 8000);
    }

    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });

    resetInterval();
  }

});
