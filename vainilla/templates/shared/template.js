/**
 * Materix UI — Plantillas
 * Configura la API de tema de la librería (`Materix.theme`) antes de que cargue:
 * persistencia en localStorage, `?theme=dark|light` y modo del sistema por defecto.
 * Se carga en <head> para aplicar el tema inicial sin parpadeo.
 */
(function () {
  var STORAGE_KEY = 'mtx-template-theme';
  var root = document.documentElement;

  root.setAttribute('data-mtx-theme-persist', STORAGE_KEY);
  root.setAttribute('data-mtx-theme-query', '');

  /**
   * Resuelve el modo inicial con la misma prioridad que `Materix.theme`: URL, guardado, sistema.
   * @returns {string} 'light', 'dark' o 'system'.
   */
  var initialMode = function () {
    var param = new URLSearchParams(window.location.search).get('theme');
    if (param === 'dark' || param === 'light' || param === 'system') return param;
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
    } catch (e) { /* sin almacenamiento */ }
    return 'system';
  };

  var mode = initialMode();
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-mtx-theme-mode', mode);
  root.setAttribute('data-mtx-theme', mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode);

  // Compatibilidad: botones antiguos `data-tpl-theme-toggle` pasan a la API de la librería.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-tpl-theme-toggle]:not([data-mtx-theme-toggle])').forEach(function (btn) {
      btn.setAttribute('data-mtx-theme-toggle', '');
    });
  });
})();
