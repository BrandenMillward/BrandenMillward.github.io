(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const enableMouseEffects = !prefersReducedMotion && isFinePointer;

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (!filters.length || !cards.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = btn.dataset.filter;

        filters.forEach(function (f) {
          f.classList.toggle('active', f === btn);
        });

        cards.forEach(function (card) {
          const match = category === 'all' || card.dataset.category.includes(category);
          card.classList.toggle('hidden', !match);
        });
      });
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initHeroSpotlight() {
    if (!enableMouseEffects) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      hero.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
  }

  function initCardGlow() {
    if (!enableMouseEffects) return;
    const cards = document.querySelectorAll('.project-card, .blog-card, .skill-group');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  function initEventVideos() {
    const containers = document.querySelectorAll('.event-video[data-yt-id]');
    if (!containers.length) return;

    containers.forEach(function (container) {
      const btn = container.querySelector('.event-video-play');
      if (!btn) return;

      btn.addEventListener('click', function () {
        const id = container.dataset.ytId;
        const title = container.dataset.ytTitle || 'YouTube video player';

        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
        iframe.title = title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;

        container.innerHTML = '';
        container.appendChild(iframe);
        iframe.focus();
      });
    });
  }

  function initScrollProgress() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    const fill = document.createElement('div');
    fill.className = 'scroll-progress-bar';
    bar.appendChild(fill);
    nav.appendChild(bar);

    function update() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      fill.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    initMobileNav();
    initActiveNav();
    initProjectFilters();
    initReveal();
    initHeroSpotlight();
    initCardGlow();
    initEventVideos();
    initScrollProgress();
    initNavScroll();
  });
})();
