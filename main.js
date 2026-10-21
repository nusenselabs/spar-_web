(() => {
  const EN = window.SPARO_EN;
  const DYN = window.SPARO_DYNAMIC;
  const STORAGE_KEY = 'sparo-lang';
  // Set by the inline script in <head> unless the visitor prefers reduced motion.
  const motionOK = document.documentElement.classList.contains('motion');
  window.SPARO_READY = true;

  // App store listings. Until these are filled in, the store buttons scroll to the app card in the footer.
  const STORE_LINKS = {
    ios: '',     // e.g. https://apps.apple.com/dk/app/sparo/id0000000000
    android: ''  // e.g. https://play.google.com/store/apps/details?id=dk.sparo.app
  };

  document.querySelectorAll('.store-btn[data-store]').forEach((a) => {
    const url = STORE_LINKS[a.dataset.store];
    if (!url) return;
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Language ---------- */

  // Danish is authored in the markup; capture it once so we can switch back.
  const DA = { ...window.SPARO_DA_ALT };
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!(key in DA)) DA[key] = el.innerHTML.trim();
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    DA[el.dataset.i18nPlaceholder] ??= el.getAttribute('placeholder');
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    DA[el.dataset.i18nAria] ??= el.getAttribute('aria-label');
  });
  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    DA[el.dataset.i18nContent] ??= el.getAttribute('content');
  });
  document.querySelectorAll('[data-i18n-src]').forEach((el) => {
    DA[el.dataset.i18nSrc] ??= el.getAttribute('src');
  });

  const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

  let lang = 'da';

  function t(key) {
    const dict = lang === 'en' ? EN : DA;
    if (!(key in dict)) console.warn(`[i18n] missing "${key}" for ${lang}`);
    return dict[key] ?? DA[key] ?? '';
  }

  function applyLanguage(next) {
    lang = next === 'en' ? 'en' : 'da';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.tagName === 'TITLE') el.textContent = stripTags(t(el.dataset.i18n));
      else el.innerHTML = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', stripTags(t(el.dataset.i18nPlaceholder)));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', stripTags(t(el.dataset.i18nAria)));
    });
    document.querySelectorAll('[data-i18n-content]').forEach((el) => {
      el.setAttribute('content', stripTags(t(el.dataset.i18nContent)));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      el.setAttribute('alt', stripTags(t(el.dataset.i18nAlt)));
    });
    // Images with text on them (product labels) have one file per language.
    document.querySelectorAll('[data-i18n-src]').forEach((el) => {
      const src = t(el.dataset.i18nSrc);
      if (src && el.getAttribute('src') !== src) el.setAttribute('src', src);
    });

    document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    updateMenuLabel();
    renderThemeToggle();

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* storage unavailable */ }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    } catch (_) { /* e.g. sandboxed previews */ }
  }

  function initialLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'da') return fromUrl;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'da') return stored;
    } catch (_) { /* storage unavailable */ }
    return 'da';
  }

  // Dip the page briefly so the copy swap reads as one change rather than a flicker.
  function switchLanguage(next) {
    if (next === lang) return;
    if (!motionOK) { applyLanguage(next); return; }
    document.body.classList.add('is-switching-lang');
    setTimeout(() => {
      applyLanguage(next);
      requestAnimationFrame(() => document.body.classList.remove('is-switching-lang'));
    }, 200);
  }

  document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => switchLanguage(lang === 'da' ? 'en' : 'da'));
  });

  /* ---------- Mobile menu ---------- */

  const menuToggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');

  function updateMenuLabel() {
    const open = header.classList.contains('is-open');
    menuToggle.textContent = open ? DYN[lang].menuClose : stripTags(t('nav.menu'));
  }

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  }

  menuToggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  document.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scaled illustrations ---------- */

  // Fixed-size compositions (phone mockups over photos) scale down to fit their column.
  const stages = document.querySelectorAll('.stage');
  const resizeStage = (stage) => {
    const w = Number(stage.dataset.stageWidth);
    const h = Number(stage.dataset.stageHeight);
    const scale = Math.min(1, stage.clientWidth / w);
    stage.style.setProperty('--stage-scale', scale);
    stage.style.height = `${h * scale}px`;
  };
  const ro = new ResizeObserver((entries) => entries.forEach((entry) => resizeStage(entry.target)));
  stages.forEach((stage) => { resizeStage(stage); ro.observe(stage); });

  /* ---------- FAQ: animated, one open at a time ---------- */

  const faqItems = document.querySelectorAll('.faq-item');
  const FAQ_EASE = 'cubic-bezier(.22, 1, .36, 1)';

  function setFaq(item, open) {
    const body = item.querySelector('.faq-item__body');
    const isOpen = item.open && !item.classList.contains('is-closing');
    if (open === isOpen) return;
    body.getAnimations().forEach((a) => a.cancel());

    if (!motionOK) { item.open = open; return; }

    if (open) {
      item.classList.remove('is-closing');
      item.open = true;
      const h = body.scrollHeight;
      body.animate(
        [{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }],
        { duration: 450, easing: FAQ_EASE }
      );
    } else {
      item.classList.add('is-closing');
      const h = body.scrollHeight;
      const anim = body.animate(
        [{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 320, easing: FAQ_EASE }
      );
      anim.onfinish = () => { item.open = false; item.classList.remove('is-closing'); };
    }
  }

  faqItems.forEach((item) => {
    item.querySelector('summary').addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !(item.open && !item.classList.contains('is-closing'));
      if (willOpen) faqItems.forEach((other) => { if (other !== item) setFaq(other, false); });
      setFaq(item, willOpen);
    });
  });

  /* ---------- Scroll reveal ---------- */

  // [data-reveal] elements fade in themselves; [data-stagger] containers reveal their
  // children one after another. Once done, .revealed hands transitions back to hover states.
  const STAGGER_FALLBACK_MS = 90;
  const REVEAL_MS = 1100;

  function msVar(el, name, fallback) {
    const v = parseFloat(getComputedStyle(el).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  }

  function markRevealed(el, i, container) {
    const delay = msVar(el, '--delay', 0) + i * msVar(container, '--stagger', STAGGER_FALLBACK_MS);
    setTimeout(() => el.classList.add('revealed'), delay + REVEAL_MS);
  }

  function reveal(el) {
    el.classList.add('is-visible');
    if (el.hasAttribute('data-stagger')) {
      [...el.children].forEach((child, i) => {
        if (child.hasAttribute('data-reveal')) child.classList.add('is-visible');
        markRevealed(child, i, el);
      });
    } else {
      markRevealed(el, 0, el);
    }
  }

  const pendingReveals = new Set();
  let revealObserver = null;

  if (motionOK && 'IntersectionObserver' in window) {
    document.querySelectorAll('[data-stagger]').forEach((container) => {
      [...container.children].forEach((child, i) => child.style.setProperty('--i', i));
    });
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver.unobserve(entry.target);
        pendingReveals.delete(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach((el) => {
      // Direct children of a stagger group follow the group's timing instead.
      if (el.matches('[data-stagger] > [data-reveal]') && !el.hasAttribute('data-stagger')) return;
      revealObserver.observe(el);
      pendingReveals.add(el);
    });
  } else {
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Scroll-linked effects: header, progress, parallax ---------- */

  const progressBar = document.querySelector('.scroll-progress');
  const parallaxEls = motionOK ? [...document.querySelectorAll('[data-parallax]')] : [];
  let ticking = false;

  function onScrollFrame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    header.classList.toggle('is-scrolled', y > 12);
    progressBar.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

    // At the very bottom nothing can scroll past the reveal line, so show what's on screen.
    if (pendingReveals.size && y >= max - 4) {
      pendingReveals.forEach((el) => {
        if (el.getBoundingClientRect().top > vh) return;
        reveal(el);
        revealObserver.unobserve(el);
        pendingReveals.delete(el);
      });
    }

    parallaxEls.forEach((el) => {
      // Measure the untransformed parent so the offset doesn't feed back into itself.
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax);
      el.style.translate = `0 ${(-offset).toFixed(1)}px`;
    });
  }

  function requestScrollFrame() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame);
  onScrollFrame();

  /* ---------- Light / dark theme ---------- */

  const THEME_KEY = 'sparo-theme';
  // Icons and sparrows that have a recoloured copy in a sibling dark/ folder.
  const DARK_ASSETS = new Set([
    'icons/logo.svg', 'icons/circle-check-small.svg', 'icons/plus.svg', 'icons/minus.svg', 'icons/product-action.svg',
    'icons/circle-check.svg', 'icons/shopping-bag.svg', 'icons/map-pin.svg', 'icons/list-tree.svg', 'icons/circle-plus.svg',
    'icons/graphic-eq.svg', 'icons/camera.svg', 'icons/arrow-up-right.svg',
    'illustrations/perched.svg', 'illustrations/pecking.svg', 'illustrations/curious.svg'
  ]);
  // These sit on surfaces that look the same in both themes, so they keep their original art.
  const THEME_LOCKED = '.phone, .phone-screen, .app-card, .store-btn--lime';
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const currentTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  function savedTheme() {
    try { const v = localStorage.getItem(THEME_KEY); return v === 'light' || v === 'dark' ? v : null; } catch (_) { return null; }
  }

  function swapThemeAssets(theme) {
    document.querySelectorAll('img[src*="assets/icons/"], img[src*="assets/illustrations/"]').forEach((img) => {
      if (img.closest(THEME_LOCKED)) return;
      const light = img.dataset.lightSrc || img.getAttribute('src');
      const match = light.match(/^(.*\/)?((?:icons|illustrations)\/)([^/]+\.svg)$/);
      if (!match || !DARK_ASSETS.has(match[2] + match[3])) return;
      img.dataset.lightSrc = light;
      const next = theme === 'dark' ? `${match[1] || ''}${match[2]}dark/${match[3]}` : light;
      if (img.getAttribute('src') !== next) img.setAttribute('src', next);
    });
  }

  function renderThemeToggle() {
    const dark = currentTheme() === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? DYN[lang].toLight : DYN[lang].toDark);
  }

  function setTheme(theme, save) {
    document.documentElement.dataset.theme = theme;
    swapThemeAssets(theme);
    renderThemeToggle();
    if (save) { try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* storage unavailable */ } }
  }

  themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    if (motionOK && document.startViewTransition) document.startViewTransition(() => setTheme(next, true));
    else setTheme(next, true);
  });

  // Follow the system setting until the visitor picks a theme themselves.
  systemDark.addEventListener('change', (e) => { if (!savedTheme()) setTheme(e.matches ? 'dark' : 'light', false); });

  swapThemeAssets(currentTheme());

  applyLanguage(initialLanguage());
})();
