// theme.js — Portfolio v2.0
// Interactions: theme, cursor, nav, animations, gallery lightbox, smooth scroll, form

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════
  //  SPLASH SCREEN
  // ═══════════════════════════════════════════════
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('done');
      setTimeout(() => splash.remove(), 700);
    }, 1600);
  }

  // ═══════════════════════════════════════════════
  //  LENIS SMOOTH SCROLLING
  // ═══════════════════════════════════════════════
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1.2,
      smoothTouch: false,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // ═══════════════════════════════════════════════
  //  CUSTOM CURSOR
  // ═══════════════════════════════════════════════
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.innerWidth > 900) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function ringLoop() {
      rx += (mx - rx) * 0.08;
      ry += (my - ry) * 0.08;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();

    // Hover state on interactive elements
    const hoverEls = 'a, button, .gallery-card, .contact-icon-card, .skill-group, .project-card, .note-card, .ic, .ach-entry';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    // Hide cursor elements on touch/mobile
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  // ═══════════════════════════════════════════════
  //  CLICK RIPPLE
  // ═══════════════════════════════════════════════
  document.addEventListener('click', e => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

  // ═══════════════════════════════════════════════
  //  THEME TOGGLE
  // ═══════════════════════════════════════════════
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const osPref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initial = saved || osPref;
  root.setAttribute('data-theme', initial);
  renderIcon(initial);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      renderIcon(next);
    });
  }

  function renderIcon(t) {
    if (!themeBtn) return;
    themeBtn.innerHTML = t === 'light'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }

  // ═══════════════════════════════════════════════
  //  NAVBAR SCROLL BEHAVIOUR
  // ═══════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ═══════════════════════════════════════════════
  //  MOBILE MENU
  // ═══════════════════════════════════════════════
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const nNav = document.getElementById('n-nav');
  if (mobileBtn && nNav) {
    mobileBtn.addEventListener('click', () => nNav.classList.toggle('nav-open'));
  }

  // Mobile dropdown
  document.querySelectorAll('.has-dropdown').forEach(dd => {
    const trigger = dd.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = dd.classList.contains('open');
        // Close all other dropdowns first
        document.querySelectorAll('.has-dropdown.open').forEach(other => {
          if (other !== dd) other.classList.remove('open');
        });
        dd.classList.toggle('open', !isOpen);
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(dd => dd.classList.remove('open'));
    }
  });

  // ═══════════════════════════════════════════════
  //  PAGE TRANSITION
  // ═══════════════════════════════════════════════
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Fade-in on load
  setTimeout(() => { overlay.classList.remove('out'); }, 10);

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('out');
      setTimeout(() => { window.location.href = href; }, 360);
    });
  });

  window.addEventListener('pageshow', () => overlay.classList.remove('out'));

  // ═══════════════════════════════════════════════
  //  GSAP SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero video parallax
    const heroBg = document.querySelector('.hero-video-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cinematic-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Split-section media parallax
    document.querySelectorAll('.split-media img, .split-media video').forEach(el => {
      el.style.willChange = 'transform';
      gsap.fromTo(el,
        { scale: 1.15, yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.split-section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });

    // Project card image parallax
    document.querySelectorAll('.pc-media img, .pc-media video').forEach(el => {
      gsap.fromTo(el,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.project-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });

    // ═══════════════════════════════════════════════
    //  HERO ENTRANCE ANIMATION (GSAP + SplitType)
    // ═══════════════════════════════════════════════
    if (document.querySelector('.cinematic-hero')) {
      const heroDelay = splash ? 1.7 : 0.2;
      const heroTL = gsap.timeline({ delay: heroDelay, defaults: { ease: 'expo.out' } });

      // Eyebrow
      heroTL.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0);

      // Title: split into words, stagger with 3D reveal
      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && typeof SplitType !== 'undefined') {
        heroTitle.style.opacity = '1';
        const split = new SplitType(heroTitle, { types: 'words' });
        gsap.set(split.words, { opacity: 0, y: 60, rotateX: -40 });
        heroTL.to(split.words, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.9, stagger: 0.12, ease: 'expo.out',
        }, 0.15);
      } else if (heroTitle) {
        heroTL.to(heroTitle, { opacity: 1, y: 0, duration: 0.9 }, 0.15);
      }

      // Subtitle
      heroTL.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.6);

      // CTA buttons with elastic easing
      heroTL.to('.hero-cta', { opacity: 1, duration: 0.1 }, 0.8);
      heroTL.fromTo('.hero-cta .btn',
        { opacity: 0, scale: 0.85, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
        0.8
      );

      // Stats stagger
      heroTL.to('.hero-stats', { opacity: 1, duration: 0.1 }, 1.0);
      heroTL.fromTo('.hs-item',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out' },
        1.0
      );
      heroTL.fromTo('.hs-div', { scaleY: 0 }, { scaleY: 1, duration: 0.4, stagger: 0.1 }, 1.15);

      // Scroll indicator
      heroTL.to('.hero-scroll', { opacity: 1, duration: 0.6 }, 1.4);
    }

    // ═══════════════════════════════════════════════
    //  GSAP SCROLL REVEALS (replacing AOS)
    // ═══════════════════════════════════════════════
    document.querySelectorAll('[data-aos]').forEach(el => {
      if (el.closest('.cinematic-hero')) return;
      const delayMs = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          delay: delayMs / 1000,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });
  }

  // ═══════════════════════════════════════════════
  //  ANIMATED STAT COUNTERS
  // ═══════════════════════════════════════════════
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      countObs.unobserve(el);
      const isFloat = raw.includes('.');
      const prefix = raw.match(/^[^0-9.]*/)?.[0] || '';
      const suffix = raw.match(/[^0-9.]*$/)?.[0] || '';
      const dur = 1400;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = num * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(2) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-n, .hs-num, .ic-big').forEach(el => countObs.observe(el));

  // ═══════════════════════════════════════════════
  //  TILT ON CARDS
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 900) {
    document.querySelectorAll('.skill-group, .ic, .note-card, .contact-icon-card').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  // ═══════════════════════════════════════════════
  //  VANILLATILT ON PROJECT CARDS & SPLIT MEDIA
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 900 && typeof VanillaTilt !== 'undefined') {
    document.querySelectorAll('.project-card').forEach(card => {
      VanillaTilt.init(card, {
        max: 4, speed: 600, scale: 1.01,
        glare: true, 'max-glare': 0.08, perspective: 1200,
      });
    });
    document.querySelectorAll('.split-media').forEach(el => {
      VanillaTilt.init(el, {
        max: 3, speed: 800, scale: 1.0,
        glare: true, 'max-glare': 0.05, perspective: 1500,
      });
    });
  }

  // ═══════════════════════════════════════════════
  //  MAGNETIC BUTTONS
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 900) {
    document.querySelectorAll('.btn').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.18;
        const dy = (e.clientY - r.top - r.height / 2) * 0.18;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  // ═══════════════════════════════════════════════
  //  GALLERY FILTER TABS
  // ═══════════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.gf-btn[data-filter]');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryCards.forEach(card => {
        card.classList.toggle('hidden', !(filter === 'all' || card.getAttribute('data-category') === filter));
      });
    });
  });

  // ═══════════════════════════════════════════════
  //  GALLERY LIGHTBOX
  // ═══════════════════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lb-img');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    let items = [], idx = 0;

    function collectItems() {
      items = Array.from(document.querySelectorAll('.gallery-card:not(.hidden) .gallery-card-inner img'));
    }

    function openLB(i) {
      collectItems();
      if (i < 0 || i >= items.length) return;
      idx = i;
      lbImg.src = items[idx].src;
      lbImg.alt = items[idx].alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Update caption
      const caption = lightbox.querySelector('.lb-caption');
      if (caption) caption.textContent = items[idx].alt || '';
      // Update counter
      const counter = lightbox.querySelector('.lb-counter');
      if (counter) counter.textContent = (idx + 1) + ' / ' + items.length;
    }

    function closeLB() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-card').forEach((card, i) => {
      card.addEventListener('click', () => openLB(i));
    });

    if (lbClose) lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); openLB(idx - 1); });
    if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); openLB(idx + 1); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') openLB(idx - 1);
      if (e.key === 'ArrowRight') openLB(idx + 1);
    });
  }

  // ═══════════════════════════════════════════════
  //  CONTACT FORM (cosmetic handler)
  // ═══════════════════════════════════════════════
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      if (btn) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'var(--accent)';
        btn.style.color = '#040407';
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.style.color = '';
        }, 2800);
      }
    });
  }

  // ═══════════════════════════════════════════════
  //  MEDIA PLACEHOLDER AUTO-HIDE
  //  Hides .media-placeholder when actual media loads
  // ═══════════════════════════════════════════════
  function setupPlaceholders(scope) {
    scope.querySelectorAll('.media-placeholder').forEach(ph => {
      const container = ph.parentElement;
      const vid = container.querySelector('video');
      const img = container.querySelector('img:not([style*="display:none"])');

      if (vid) {
        vid.addEventListener('loadeddata', () => { ph.style.display = 'none'; });
        if (vid.readyState >= 3) ph.style.display = 'none';
      }
      if (img) {
        const hide = () => { if (img.naturalWidth > 0) ph.style.display = 'none'; };
        img.addEventListener('load', hide);
        if (img.complete) hide();
      }
    });
  }
  setupPlaceholders(document);

  // ═══════════════════════════════════════════════
  //  SYS-GALLERY LIGHTBOX (for inner sys pages)
  // ═══════════════════════════════════════════════
  document.querySelectorAll('.sys-gallery-item').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !img.naturalWidth) return;

      const lb = document.createElement('div');
      lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:1000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      const lbImg = document.createElement('img');
      lbImg.src = img.src;
      lbImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:4px;';
      lb.appendChild(lbImg);
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';
      lb.addEventListener('click', () => { lb.remove(); document.body.style.overflow = ''; });
    });
  });

  // ═══════════════════════════════════════════════
  //  SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════════
  const scrollProgressFill = document.getElementById('scroll-progress-fill');
  if (scrollProgressFill) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressFill.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ═══════════════════════════════════════════════
  //  CURSOR TRAIL
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 900) {
    const trailCount = 8;
    const trails = [];
    const trailPositions = [];

    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.width = (6 - i * 0.5) + 'px';
      trail.style.height = (6 - i * 0.5) + 'px';
      trail.style.opacity = (0.3 - i * 0.03);
      document.body.appendChild(trail);
      trails.push(trail);
      trailPositions.push({ x: 0, y: 0 });
    }

    let trailMx = 0, trailMy = 0;
    document.addEventListener('mousemove', e => {
      trailMx = e.clientX;
      trailMy = e.clientY;
    });

    (function trailLoop() {
      trailPositions[0].x += (trailMx - trailPositions[0].x) * 0.25;
      trailPositions[0].y += (trailMy - trailPositions[0].y) * 0.25;
      for (let i = 1; i < trailCount; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.2;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.2;
      }
      for (let i = 0; i < trailCount; i++) {
        trails[i].style.left = trailPositions[i].x + 'px';
        trails[i].style.top = trailPositions[i].y + 'px';
      }
      requestAnimationFrame(trailLoop);
    })();
  }

  // ═══════════════════════════════════════════════
  //  PAGE TITLE TEXT REVEAL ON SCROLL
  // ═══════════════════════════════════════════════
  document.querySelectorAll('.p-title').forEach(title => {
    // Wrap each word in a span for reveal animation
    const text = title.innerHTML;
    const words = text.split(/(\s+|<[^>]+>)/);
    let html = '';
    words.forEach(part => {
      if (part.match(/^</) || part.match(/^\s+$/)) {
        html += part;
      } else if (part.trim()) {
        html += `<span class="word"><span class="word-inner">${part}</span></span> `;
      }
    });
    title.innerHTML = html;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          title.classList.add('revealed');
          obs.unobserve(title);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(title);
  });

  // ═══════════════════════════════════════════════
  //  SECTION DIVIDER ANIMATION
  // ═══════════════════════════════════════════════
  document.querySelectorAll('.section-divider.accent-line').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // ═══════════════════════════════════════════════
  //  SKILL PROFICIENCY BARS (scroll-triggered)
  // ═══════════════════════════════════════════════
  const spCards = document.querySelectorAll('.sp-card');
  if (spCards.length) {
    const spObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('sp-visible');
          const fill = e.target.querySelector('.sp-bar-fill');
          if (fill) {
            fill.style.width = fill.getAttribute('data-proficiency') + '%';
          }
          spObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    spCards.forEach(card => spObs.observe(card));
  }

  // ═══════════════════════════════════════════════
  //  PROJECT MODAL
  // ═══════════════════════════════════════════════
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.project-modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.pm-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.project-modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // ═══════════════════════════════════════════════
  //  ENHANCED GALLERY LIGHTBOX (with captions + counter)
  // ═══════════════════════════════════════════════
  if (lightbox) {
    // Add caption and counter elements if not present
    if (!lightbox.querySelector('.lb-caption')) {
      const caption = document.createElement('div');
      caption.className = 'lb-caption';
      lightbox.querySelector('.lb-content').appendChild(caption);
    }
    if (!lightbox.querySelector('.lb-counter')) {
      const counter = document.createElement('div');
      counter.className = 'lb-counter';
      lightbox.appendChild(counter);
    }
  }

});
