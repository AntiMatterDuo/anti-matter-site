/* ============================================================
   ANTI MATTER — i18n.js  (language switching; usually no need to edit)
   Reads data/translations.js, builds the language buttons, swaps all
   text marked with data-i18n="key", and flips the page to right-to-left
   for Arabic and Kurdish.
   ============================================================ */
(() => {
  const T = window.TRANSLATIONS;
  const STORAGE_KEY = 'am-lang';
  let current = 'en';

  // Which language to open with: saved choice, else the visitor's browser language.
  function startLanguage() {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s && T[s]) return s; } catch (e) {}
    const n = (navigator.language || 'en').toLowerCase();
    if (n.startsWith('ar')) return 'ar';
    if (n.startsWith('ckb') || n.startsWith('ku')) return 'ckb';
    return 'en';
  }

  // Look up a text; falls back to English if a key is missing.
  const text = (key) => (T[current] && T[current][key] !== undefined) ? T[current][key] : (T.en ? T.en[key] : undefined);

  function applyLanguage(lang) {
    current = T[lang] ? lang : 'en';
    const L = T[current], root = document.documentElement;
    root.lang = L._lang;
    root.dir  = L._dir;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = text(el.dataset.i18n); if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = text(el.dataset.i18nHtml); if (v !== undefined) el.innerHTML = v;
    });

    // Page title + share descriptions
    document.title = text('meta.title');
    [['meta[name="description"]'], ['meta[property="og:description"]'], ['meta[name="twitter:description"]']]
      .forEach(([sel]) => { const m = document.querySelector(sel); if (m) m.content = text('meta.description'); });
    [['meta[property="og:title"]'], ['meta[name="twitter:title"]']]
      .forEach(([sel]) => { const m = document.querySelector(sel); if (m) m.content = text('meta.title'); });

    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === current));
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
  }

  // Build one button per language found in translations.js
  function buildButtons() {
    const box = document.querySelector('.lang'); if (!box) return;
    Object.keys(T).forEach(code => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.lang = code;
      b.textContent = T[code]._label; b.title = T[code]._name; b.lang = T[code]._lang;
      b.addEventListener('click', () => applyLanguage(code));
      box.appendChild(b);
    });
  }

  // Runs after main.js has created the project cards.
  document.addEventListener('DOMContentLoaded', () => { buildButtons(); applyLanguage(startLanguage()); });
})();
