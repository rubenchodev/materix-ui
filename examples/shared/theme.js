/**
 * Materix UI — Ejemplos
 * Fuente única del tema claro/oscuro de las páginas de ejemplo.
 * Expone `window.MtxDemoTheme` y gestiona cualquier botón `#theme-toggle` o `[data-demo-theme-toggle]`.
 */
(function () {
  if (window.MtxDemoTheme) return;
  window.__MTX_THEME_INITIALIZED__ = true;

  var STORAGE_KEY = 'mtx-theme';
  var TOGGLE_SELECTOR = '#theme-toggle, [data-demo-theme-toggle]';
  var root = document.documentElement;

  /**
   * Lee el tema persistido sin romper en modo privado.
   * @returns {string|null} Tema guardado.
   */
  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Devuelve el tema activo.
   * @returns {'light'|'dark'} Tema actual.
   */
  function get() {
    return root.getAttribute('data-mtx-theme') === 'dark' ? 'dark' : 'light';
  }

  /**
   * Sincroniza icono, etiqueta y estado de los botones de tema presentes en el DOM.
   * @returns {void}
   */
  function sync() {
    var isDark = get() === 'dark';
    var label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    document.querySelectorAll(TOGGLE_SELECTOR).forEach(function (btn) {
      var icon = btn.querySelector('.material-icons');
      if (icon) {
        icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        btn.setAttribute('aria-label', label);
      }
      btn.setAttribute('title', label);
    });
  }

  /**
   * Aplica un tema y opcionalmente lo persiste.
   * @param {'light'|'dark'} theme Tema a aplicar.
   * @param {boolean} [persist=false] Guardar en localStorage.
   * @returns {void}
   */
  function apply(theme, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-mtx-theme', next);
    root.style.colorScheme = next;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* almacenamiento no disponible */
      }
    }
    sync();
    document.dispatchEvent(new CustomEvent('demo:themechange', { detail: { theme: next } }));
  }

  /**
   * Alterna entre claro y oscuro persistiendo la elección.
   * @returns {void}
   */
  function toggle() {
    apply(get() === 'dark' ? 'light' : 'dark', true);
  }

  // `?theme=dark|light` fuerza el tema sin persistirlo (útil para capturas y enlaces).
  var forced = /[?&]theme=(dark|light)\b/.exec(window.location.search);
  apply(forced ? forced[1] : readStored() || root.getAttribute('data-mtx-theme') || 'light', false);

  document.addEventListener('click', function (event) {
    if (event.target.closest(TOGGLE_SELECTOR)) toggle();
  });

  window.MtxDemoTheme = { get: get, apply: apply, toggle: toggle, sync: sync };
})();
