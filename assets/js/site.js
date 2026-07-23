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

  function initThemeToggleButton() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
    btn.addEventListener('click', toggleTheme);
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

    const HIDE_DELAY = 250;
    const pendingHides = new WeakMap();

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = btn.dataset.filter;

        filters.forEach(function (f) {
          f.classList.toggle('active', f === btn);
        });

        cards.forEach(function (card) {
          const match = category === 'all' || card.dataset.category.includes(category);
          const isHidden = card.classList.contains('hidden');

          const pending = pendingHides.get(card);
          if (pending) {
            window.clearTimeout(pending);
            pendingHides.delete(card);
          }

          if (match && isHidden) {
            card.classList.remove('hidden');
            card.classList.add('filter-hide');
            void card.offsetWidth;
            card.classList.remove('filter-hide');
          } else if (!match && !isHidden) {
            card.classList.add('filter-hide');
            if (prefersReducedMotion) {
              card.classList.add('hidden');
              card.classList.remove('filter-hide');
            } else {
              const timeoutId = window.setTimeout(function () {
                card.classList.add('hidden');
                card.classList.remove('filter-hide');
                pendingHides.delete(card);
              }, HIDE_DELAY);
              pendingHides.set(card, timeoutId);
            }
          } else if (match && !isHidden) {
            card.classList.remove('filter-hide');
          }
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

  function initCardTilt() {
    if (!enableMouseEffects) return;
    const cards = document.querySelectorAll('.project-card, .blog-card');
    if (!cards.length) return;

    const MAX_TILT = 6;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * MAX_TILT * 2;
        const rotateX = (0.5 - py) * MAX_TILT * 2;
        const lift = card.classList.contains('project-card') ? -4 : -3;

        card.style.transform =
          'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(' + lift + 'px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
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

  function updateScrollUI() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    nav.classList.toggle('scrolled', window.scrollY > 20);

    let bar = nav.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      const fill = document.createElement('div');
      fill.className = 'scroll-progress-bar';
      bar.appendChild(fill);
      nav.appendChild(bar);
    }

    const fill = bar.querySelector('.scroll-progress-bar');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    fill.style.width = pct + '%';
  }

  function initPage() {
    initThemeToggleButton();
    initMobileNav();
    initActiveNav();
    initProjectFilters();
    initReveal();
    initHeroSpotlight();
    initCardGlow();
    initCardTilt();
    initEventVideos();
    updateScrollUI();
  }

  function isInternalHtmlLink(link) {
    if (!link || !link.href) return false;
    if (link.origin !== window.location.origin) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (!/\.html$/.test(link.pathname)) return false;
    return true;
  }

  function navigateTo(url, addToHistory) {
    fetch(url.href)
      .then(function (response) {
        if (!response.ok) throw new Error('Navigation fetch failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        const newDoc = new DOMParser().parseFromString(html, 'text/html');

        const applySwap = function () {
          document.title = newDoc.title;
          document.body.innerHTML = newDoc.body.innerHTML;

          const newDesc = newDoc.querySelector('meta[name="description"]');
          const curDesc = document.querySelector('meta[name="description"]');
          if (newDesc && curDesc) curDesc.setAttribute('content', newDesc.getAttribute('content') || '');

          initPage();

          if (url.hash) {
            const target = document.getElementById(url.hash.slice(1));
            if (target) target.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
        };

        if (addToHistory) {
          history.pushState({ vt: true }, '', url.href);
        }

        document.startViewTransition(applySwap);
      })
      .catch(function () {
        window.location.href = url.href;
      });
  }

  function initViewTransitions() {
    if (typeof document.startViewTransition !== 'function') return;

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = e.target.closest('a[href]');
      if (!isInternalHtmlLink(link)) return;

      const url = new URL(link.href, window.location.href);

      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
        return;
      }

      e.preventDefault();
      navigateTo(url, true);
    });

    window.addEventListener('popstate', function () {
      navigateTo(new URL(window.location.href), false);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initPage();
    initViewTransitions();
  });
})();
