/* Shared theme toggle + mobile nav. Mirrors the inline pre-paint boot script in each <head>.
   If the two ever disagree the page flashes the wrong theme. */
(function () {
  // ── Theme toggle ──
  var THEME_KEY = 'site-theme';
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (btn) {
      btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: theme } }));
  }

  var saved = localStorage.getItem(THEME_KEY);
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(saved || (prefersLight ? 'light' : 'dark'));

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      apply(next);
    });
  }
})();

(function () {
  // ── Mobile nav toggle ──
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    var open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.classList.contains('is-open')) return;
    if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !navMenu.classList.contains('is-open')) return;
    closeMenu();
    navToggle.focus();
  });
})();
