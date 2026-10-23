import { getInstance, registerInstance, releaseInstance } from './registry.js';

/**
 * Indica si dos instancias son del mismo componente: una es instancia de la clase de la otra
 * (misma clase o subclase en cualquier sentido). `ComponentBase` por sí sola no cuenta.
 *
 * @param {Object} a Instancia.
 * @param {Object} b Instancia.
 * @returns {boolean} `true` si comparten linaje de componente.
 */
function sameComponentLineage(a, b) {
  const related = (x, Y) => typeof Y === 'function' && Y !== ComponentBase && x instanceof Y;
  return related(a, b.constructor) || related(b, a.constructor);
}

/**
 * Destruye la instancia previa del mismo componente (misma clase o subclase) vinculada al elemento.
 *
 * @param {HTMLElement} element Elemento asociado.
 * @param {Object} instance Nueva instancia.
 */
function replaceSameClassInstance(element, instance) {
  if (!element || !element.nodeType) return;
  const existing = getInstance(element);
  if (!existing || existing === instance || !sameComponentLineage(existing, instance)) return;
  try {
    if (!existing.destroyed && typeof existing.destroy === 'function') existing.destroy();
  } catch (e) {
    /* una destrucción fallida no impide crear la nueva instancia */
  } finally {
    releaseInstance(existing);
  }
}

/**
 * Clase base para todos los componentes de Materix UI.
 *
 * Centraliza el vínculo entre el elemento del DOM y su instancia,
 * y facilita la gestión del estado `disabled`.
 */
export class ComponentBase {
  /**
   * Crea la instancia base del componente.
   *
   * Si el elemento ya tiene una instancia del MISMO componente (misma clase o una subclase
   * en cualquier sentido, p. ej. `new Button(el)` dos veces o `new MyButton(el)` sobre un
   * Button), la anterior se destruye antes de registrar la nueva, para no duplicar listeners.
   * Instancias de otras clases sobre el mismo nodo (Tooltip declarativo, TextField interno
   * de DateTimePicker) se conservan.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    /** @type {Array<Function>} Funciones de limpieza registradas con `listen()`/`onDestroy()`. */
    this._cleanups = [];
    this.element = element;
    replaceSameClassInstance(element, this);
    if (element && element.setAttribute) {
      element.setAttribute('data-mtx-initialized', '');
    }
    registerInstance(element, this);
  }

  /**
   * Añade un listener que se retira automáticamente en `destroy()`.
   *
   * @param {EventTarget} target Destino (elemento, `document`, `window`...).
   * @param {string} type Tipo de evento.
   * @param {Function} handler Manejador.
   * @param {boolean|AddEventListenerOptions} [options] Opciones del listener.
   * @returns {Function} Función que retira el listener de forma anticipada.
   */
  listen(target, type, handler, options) {
    if (!target || typeof target.addEventListener !== 'function') return () => {};
    target.addEventListener(type, handler, options);
    const off = () => target.removeEventListener(type, handler, options);
    this.onDestroy(off);
    return off;
  }

  /**
   * Registra una limpieza adicional (observers, temporizadores, nodos portados...).
   *
   * @param {Function} cleanup Función a ejecutar en `destroy()`.
   */
  onDestroy(cleanup) {
    if (!this._cleanups) this._cleanups = [];
    if (typeof cleanup === 'function') this._cleanups.push(cleanup);
  }

  /**
   * Libera listeners y limpiezas registradas y desvincula la instancia del registro.
   * No deshace el auto-scaffolding del DOM. Las subclases que sobrescriban
   * `destroy()` deben llamar a `super.destroy()`. Es idempotente.
   */
  destroy() {
    const cleanups = this._cleanups || [];
    this._cleanups = [];
    while (cleanups.length) {
      try { cleanups.pop()(); } catch (e) { /* una limpieza fallida no bloquea las demás */ }
    }
    releaseInstance(this);
    if (this.element && this.element.removeAttribute) this.element.removeAttribute('data-mtx-initialized');
    this.destroyed = true;
  }

  /**
   * Indica si el componente está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled === true;
  }

  /**
   * Deshabilita el componente.
   */
  disable() {
    this.element.disabled = true;
  }

  /**
   * Habilita el componente.
   */
  enable() {
    this.element.disabled = false;
  }
}