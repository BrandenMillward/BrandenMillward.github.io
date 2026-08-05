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

  // The OS preference is the default. localStorage only ever holds a deliberate override.
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  function systemTheme() { return mq.matches ? 'light' : 'dark'; }

  apply(localStorage.getItem(THEME_KEY) || systemTheme());

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      // Toggling back to whatever the OS is asking for clears the override rather than
      // pinning the same value — so there is a way back to following the system, which a
      // plain two-state toggle otherwise locks you out of permanently.
      if (next === systemTheme()) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
      apply(next);
    });
  }

  // Follow the OS live while no override is set — covers a phone flipping to dark at sunset
  // with the page already open.
  var onSystemChange = function () {
    if (!localStorage.getItem(THEME_KEY)) apply(systemTheme());
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);   // Safari < 14
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
