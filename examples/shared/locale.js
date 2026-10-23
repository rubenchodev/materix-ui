/**
 * Materix UI — Ejemplos
 * Selector de idioma (EN / ES) de los textos internos de los componentes.
 * Expone `window.MtxDemoLocale.mount(container)`; nav.js lo monta en la AppBar.
 */
(function () {
  if (window.MtxDemoLocale) return;
  window.__MTX_LOCALE_INITIALIZED__ = true;

  var STORAGE_KEY = 'mtx-locale';
  var LOCALES = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' },
  ];

  /**
   * Lee el idioma guardado.
   * @returns {string} Código de idioma.
   */
  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (e) {
      return 'en';
    }
  }

  /**
   * Devuelve el idioma activo de la librería.
   * @returns {string} Código de idioma.
   */
  function getCurrent() {
    if (window.Materix && typeof window.Materix.getLocale === 'function') {
      return window.Materix.getLocale();
    }
    return readStored();
  }

  /**
   * Marca el botón activo de cada grupo.
   * @param {string} active Código activo.
   * @returns {void}
   */
  function updateButtons(active) {
    document.querySelectorAll('.demo-locale-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-locale') === active));
    });
  }

  /**
   * Aplica y persiste un idioma.
   * @param {string} code Código de idioma.
   * @returns {void}
   */
  function apply(code) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {
      /* almacenamiento no disponible */
    }
    if (window.Materix && typeof window.Materix.setLocale === 'function') {
      window.Materix.setLocale(code);
    }
    updateButtons(code);
  }

  /**
   * Inserta el grupo de botones de idioma en un contenedor (idempotente).
   * @param {HTMLElement} [container] Destino; por defecto `.demo-nav-actions`.
   * @returns {HTMLElement|null} Grupo insertado o existente.
   */
  function mount(container) {
    var target = container || document.querySelector('.demo-nav-actions, .example-nav__actions');
    if (!target) return null;
    var existing = target.querySelector('.demo-locale-group');
    if (existing) return existing;

    var group = document.createElement('div');
    group.className = 'demo-locale-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Component language');

    var current = getCurrent();
    LOCALES.forEach(function (loc) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'demo-locale-btn';
      btn.setAttribute('data-locale', loc.code);
      btn.setAttribute('aria-pressed', String(loc.code === current));
      btn.setAttribute('title', loc.name);
      btn.textContent = loc.label;
      btn.addEventListener('click', function () {
        apply(loc.code);
      });
      group.appendChild(btn);
    });

    var themeBtn = target.querySelector('#theme-toggle');
    target.insertBefore(group, themeBtn || null);
    return group;
  }

  // Restaura el idioma de los componentes (no altera el lang del documento, que es inglés).
  var saved = readStored();
  if (window.Materix && typeof window.Materix.setLocale === 'function') {
    window.Materix.setLocale(saved);
  }

  window.MtxDemoLocale = { mount: mount, apply: apply, get: getCurrent };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mount();
    });
  } else {
    mount();
  }
})();
