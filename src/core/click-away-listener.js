/**
 * ClickAwayListener: detecta clics fuera de un elemento.
 *
 * Equivalente al `ClickAwayListener` de MUI. Gestiona el evento `mousedown`
 * (y `touchstart`) en el documento para notificar cuando una interacción
 * ocurre fuera del elemento y de sus hijos. En táctil, el `mousedown` sintético
 * que el navegador emite tras un `touchstart` se ignora para no notificar dos veces.
 */

/** Ventana (ms) en la que un `mousedown` tras un `touchstart` se considera sintético. */
const SYNTHETIC_MOUSE_WINDOW = 1000;

/**
 * Suscribe un manejador de "clic fuera" del elemento.
 *
 * Devuelve una función de limpieza.
 *
 * @param {HTMLElement} element Elemento de referencia.
 * @param {Function} onClose Callback al hacer clic fuera.
 * @returns {Function} Función que cancela la suscripción.
 */
export function onClickAway(element, onClose) {
  /** Marca de tiempo del último `touchstart`: el `mousedown` sintético posterior se ignora. */
  let lastTouch = -Infinity;
  const handle = (event) => {
    const now = Date.now();
    if (event.type === 'touchstart') lastTouch = now;
    else if (now - lastTouch < SYNTHETIC_MOUSE_WINDOW) return;
    if (element && element.contains(event.target)) return;
    onClose(event);
  };

  document.addEventListener('mousedown', handle, true);
  document.addEventListener('touchstart', handle, true);

  return function cleanup() {
    document.removeEventListener('mousedown', handle, true);
    document.removeEventListener('touchstart', handle, true);
  };
}