/**
 * Transition: animaciones de entrada/salida estilo MUI.
 *
 * Implementa `fade`, `grow` y `collapse` siguiendo las curvas y duraciones
 * de MUI, respetando `prefers-reduced-motion`. Se gestionan con clases CSS
 * (`entering` → `entered`, `exiting` → `exited`) y un temporizador por duración.
 *
 * Una transición nueva sobre el mismo elemento cancela la que esté en curso:
 * la promesa cancelada se resuelve con `false` (la completada, con `true`), así
 * que las acciones posteriores a una entrada no se ejecutan en mitad de una salida.
 */
import { createPortal } from './portal.js';

const classes = {
  entering: 'mtx-transition--entering',
  entered: 'mtx-transition--entered',
  exiting: 'mtx-transition--exiting',
  exited: 'mtx-transition--exited',
};
const ALL_CLASSES = Object.values(classes);
const EASING_ENTER = 'cubic-bezier(0, 0, 0.2, 1)';
const EASING_EXIT = 'cubic-bezier(0.4, 0, 1, 1)';
const EASING_STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * Transiciones en curso por elemento.
 * @type {WeakMap<HTMLElement, {frame: number, timer: number, resolve: Function}>}
 */
const running = new WeakMap();

/**
 * Aplica un estilo inicial antes de una transición CSS.
 *
 * @param {HTMLElement} el Elemento.
 * @param {Object} style Estilos a aplicar.
 */
function applyStyle(el, style) {
  Object.entries(style).forEach(([key, value]) => {
    el.style[key] = value;
  });
}

/**
 * Determina si el usuario prefiere reducir las animaciones.
 *
 * @returns {boolean} `true` si se prefiere reducirlas.
 */
function prefersReducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/**
 * Cancela la transición en curso de un elemento (su promesa se resuelve con `false`).
 *
 * @param {HTMLElement} el Elemento.
 * @returns {boolean} `true` si había una transición en curso.
 */
function cancel(el) {
  const record = running.get(el);
  if (!record) return false;
  running.delete(el);
  if (record.frame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(record.frame);
  clearTimeout(record.timer);
  record.resolve(false);
  return true;
}

/**
 * Ejecuta una transición: cancela la previa, limpia clases y aplica las fases.
 *
 * @param {HTMLElement} el Elemento a animar.
 * @param {boolean} inValue `true` para entrar.
 * @param {number} duration Duración en ms.
 * @param {Object} steps Fases de la transición.
 * @param {Function} steps.prepare Estado inicial (síncrono).
 * @param {Function} steps.animate Estado final (en el siguiente frame).
 * @param {Function} [steps.done] Ajustes al terminar (también con movimiento reducido).
 * @returns {Promise<boolean>} `true` al completarse, `false` si otra transición la canceló.
 */
function run(el, inValue, duration, { prepare, animate, done }) {
  const interrupted = cancel(el);
  el.classList.remove(...ALL_CLASSES);
  if (prefersReducedMotion()) {
    // Sin animación: se aplica directamente el estado final.
    animate(interrupted);
    if (done) done();
    el.classList.add(inValue ? classes.entered : classes.exited);
    return Promise.resolve(true);
  }
  prepare(interrupted);
  el.classList.add(inValue ? classes.entering : classes.exiting);
  return new Promise((resolve) => {
    const record = { frame: 0, timer: 0, resolve };
    const frame = () => {
      record.frame = 0;
      animate(interrupted);
    };
    record.frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(frame) : 0;
    if (!record.frame) frame();
    record.timer = setTimeout(() => {
      if (running.get(el) !== record) return;
      running.delete(el);
      el.classList.remove(classes.entering, classes.exiting);
      el.classList.add(inValue ? classes.entered : classes.exited);
      if (done) done();
      resolve(true);
    }, duration);
    running.set(el, record);
  });
}

/**
 * Transición `fade`: cambio de opacidad.
 *
 * @param {HTMLElement} el Elemento a animar.
 * @param {boolean} inValue `true` para entrar.
 * @param {number} [duration=225] Duración en ms.
 * @returns {Promise<boolean>} `true` al terminar; `false` si se canceló por otra transición.
 */
export function transitionFade(el, inValue, duration = 225) {
  return run(el, inValue, duration, {
    prepare: (interrupted) => {
      // Si se interrumpe otra transición, se parte de la opacidad actual.
      if (!interrupted) applyStyle(el, { opacity: inValue ? 0 : 1 });
      el.style.transition = `opacity ${duration}ms ${inValue ? EASING_ENTER : EASING_EXIT}`;
    },
    animate: () => applyStyle(el, { opacity: inValue ? 1 : 0 }),
  });
}

/**
 * Transición `collapse`: plegado/desplegado de altura. Al terminar la entrada
 * la altura queda en `auto` para adaptarse a cambios de contenido.
 *
 * @param {HTMLElement} el Elemento a animar.
 * @param {boolean} inValue `true` para expandir.
 * @param {number} [duration=225] Duración en ms.
 * @returns {Promise<boolean>} `true` al terminar; `false` si se canceló por otra transición.
 */
export function transitionCollapse(el, inValue, duration = 225) {
  const minHeight = getComputedStyle(el).minHeight || '0px';
  const easing = `height ${duration}ms ${inValue ? EASING_STANDARD : EASING_EXIT}`;
  return run(el, inValue, duration, {
    prepare: (interrupted) => {
      if (inValue) {
        // Interrumpida una salida, se parte de la altura actual en lugar de 0.
        const start = interrupted ? `${el.getBoundingClientRect().height}px` : '0px';
        applyStyle(el, { height: start, minHeight: '0px' });
      } else {
        const current = interrupted ? el.getBoundingClientRect().height : el.scrollHeight;
        applyStyle(el, { height: `${current}px`, minHeight });
      }
      el.style.transition = easing;
    },
    animate: () => {
      if (inValue) applyStyle(el, { height: `${el.scrollHeight}px`, minHeight });
      else applyStyle(el, { height: '0px', minHeight: '0px' });
    },
    done: () => {
      if (inValue) applyStyle(el, { height: 'auto' });
    },
  });
}

/**
 * Transición `grow`: escala de 0 a 1 con transform origin configurable.
 *
 * @param {HTMLElement} el Elemento a animar.
 * @param {boolean} inValue `true` para entrar.
 * @param {Object} [options] Opciones (`transformOrigin`, `duration`).
 * @returns {Promise<boolean>} `true` al terminar; `false` si se canceló por otra transición.
 */
export function transitionGrow(el, inValue, options = {}) {
  const { transformOrigin = 'top', duration = 225 } = options;
  el.style.transformOrigin = transformOrigin;
  const cubic = inValue ? EASING_ENTER : EASING_EXIT;
  const hidden = { transform: 'scale(0.6, 0)', opacity: 0 };
  const shown = { transform: 'scale(1, 1)', opacity: 1 };
  return run(el, inValue, duration, {
    prepare: (interrupted) => {
      el.style.transition = `transform ${duration}ms ${cubic}, opacity ${duration}ms ${cubic}`;
      if (!interrupted) applyStyle(el, inValue ? hidden : shown);
    },
    animate: () => applyStyle(el, inValue ? shown : hidden),
  });
}

/**
 * Cancela la transición en curso de un elemento y retira sus clases de fase.
 * La promesa de esa transición se resuelve con `false`.
 *
 * @param {HTMLElement} el Elemento.
 * @returns {boolean} `true` si había una transición en curso.
 */
export function cancelTransition(el) {
  if (!el) return false;
  const cancelled = cancel(el);
  if (el.classList) el.classList.remove(...ALL_CLASSES);
  return cancelled;
}

export { createPortal };  // re-export para comodidad
