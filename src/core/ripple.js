/**
 * Ripple: efecto de material que se propaga desde el punto de contacto.
 *
 * Implementa el patrón `TouchRipple` de MUI: el círculo crece desde el punto
 * de contacto hasta cubrir el elemento (tamaño igual a la diagonal) con una
 * transición de 550ms y opacidad 0.1 → 0.3. Se respeta la preferencia
 * `prefers-reduced-motion`.
 */
const RIPPLE_CLASS = 'mtx-ripple';
/** Eventos que terminan el gesto. */
const END_EVENTS = ['pointerup', 'pointercancel', 'pointerleave'];
const RIPPLE_CONTAINER_CLASS = 'mtx-ripple-container';
const RIPPLE_FINISHING_CLASS = 'mtx-ripple--finishing';
/** Duración de la animación de entrada, igual a `DURATION` en TouchRipple.js de MUI. */
const RIPPLE_DURATION = 550;
/** Respaldo para retirar el nodo si `animationend` no llega (estilos no cargados, animación anulada). */
const RIPPLE_REMOVE_FALLBACK = RIPPLE_DURATION * 2;

/**
 * Comprueba si el usuario prefiere reducir las animaciones.
 *
 * @returns {boolean} `true` si se prefiere reducir el movimiento.
 */
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Finaliza un ripple aplicando la animación de salida y eliminándolo.
 *
 * @param {HTMLElement} ripple Elemento ripple.
 */
function removeRipple(ripple) {
  if (ripple.classList.contains(RIPPLE_FINISHING_CLASS)) return;
  ripple.classList.add(RIPPLE_FINISHING_CLASS);
  let fallback = 0;
  const detach = () => {
    clearTimeout(fallback);
    ripple.removeEventListener('animationend', detach);
    if (ripple.parentElement) ripple.parentElement.removeChild(ripple);
  };
  ripple.addEventListener('animationend', detach);
  fallback = setTimeout(detach, RIPPLE_REMOVE_FALLBACK);
}

/**
 * Crea el círculo ripple en la posición indicada.
 *
 * El tamaño se calcula como la diagonal del elemento desde el punto de
 * contacto (`sqrt(sizeX² + sizeY²)`), igual que TouchRipple de MUI. Se usa
 * `Math.abs()` para que el cálculo sea correcto incluso si el punto de
 * contacto cae fuera del rect (bordes, zoom, transformaciones CSS).
 *
 * @param {HTMLElement} element Elemento contenedor.
 * @param {number} x Posición X del contacto relativa al elemento.
 * @param {number} y Posición Y del contacto relativa al elemento.
 * @returns {HTMLElement} Elemento ripple creado.
 */
function spawnRipple(element, x, y) {
  let container = element.querySelector(`.${RIPPLE_CONTAINER_CLASS}`);
  if (!container) {
    container = document.createElement('span');
    container.className = RIPPLE_CONTAINER_CLASS;
    element.appendChild(container);
  }
  const rect = element.getBoundingClientRect();
  const sizeX = Math.max(Math.abs(rect.width - x), x) * 2 + 2;
  const sizeY = Math.max(Math.abs(rect.height - y), y) * 2 + 2;
  const rippleSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY);
  const ripple = document.createElement('span');
  ripple.className = RIPPLE_CLASS;
  ripple.style.width = ripple.style.height = `${rippleSize}px`;
  ripple.style.left = `${x - rippleSize / 2}px`;
  ripple.style.top = `${y - rippleSize / 2}px`;
  container.appendChild(ripple);
  return ripple;
}

/**
 * Activa el efecto ripple sobre un elemento.
 *
 * A diferencia de la versión anterior, el ripple respeta una duración
 * mínima de visibilidad (`RIPPLE_DURATION`) antes de iniciar la salida,
 * igual que TouchRipple de MUI: así un clic o tap muy rápido no corta la
 * animación de entrada a la mitad.
 *
 * @param {HTMLElement} element Elemento que recibe el ripple.
 * @param {MouseEvent|PointerEvent} event Evento de contacto.
 * @param {Object} [options] Opciones visuales y de interacción.
 * @param {boolean} [options.centered=false] Centra el círculo en el elemento.
 * @param {HTMLElement} [options.interactionTarget=element] Nodo que recibe el fin del gesto.
 */
export function createRipple(element, event, options = {}) {
  if (prefersReducedMotion()) return;
  const { centered = false, interactionTarget = element } = options;
  const rect = element.getBoundingClientRect();
  const x = centered ? rect.width / 2 : (event.clientX || 0) - rect.left;
  const y = centered ? rect.height / 2 : (event.clientY || 0) - rect.top;
  const ripple = spawnRipple(element, x, y);
  const startTime = performance.now();

  /**
   * Programa la salida del ripple respetando la duración mínima de entrada.
   */
  const finish = () => {
    // El primer fin de gesto retira los tres listeners: no se acumulan entre gestos.
    END_EVENTS.forEach((type) => interactionTarget.removeEventListener(type, finish));
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(RIPPLE_DURATION - elapsed, 0);
    setTimeout(() => removeRipple(ripple), remaining);
  };

  END_EVENTS.forEach((type) => interactionTarget.addEventListener(type, finish));
}