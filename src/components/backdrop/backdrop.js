import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance } from '../../core/registry.js';
import { emit } from '../../core/events.js';
import { addModal, removeModal } from '../../core/modal-manager.js';
import { pushLayer, removeLayer } from '../../core/layers.js';

/** Elementos interactivos que no cierran el backdrop con `data-close-on-click`. */
const INTERACTIVE = 'a[href], button, input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/**
 * Indica si un atributo booleano `data-*` está activo (presente y distinto de `"false"`).
 * @param {HTMLElement} el Elemento.
 * @param {string} name Nombre del atributo.
 * @returns {boolean} Estado.
 */
function flag(el, name) {
  return el.hasAttribute(name) && el.getAttribute(name) !== 'false';
}

/**
 * Capa fija que oscurece la pantalla y centra un contenido (Backdrop de MUI).
 *
 * Uso declarativo:
 * ```html
 * <button data-mtx="button" data-mtx-backdrop-open="loading">Cargar</button>
 * <div data-mtx="backdrop" id="loading" data-close-on-click>
 *   <div data-mtx="circular-progress" data-color="inherit"></div>
 * </div>
 * ```
 *
 * No es un diálogo: no atrapa el foco ni tiene rol. Para bloquear la interacción
 * con un mensaje o acciones, usar Dialog.
 */
export class Backdrop extends ComponentBase {
  /**
   * Crea la instancia y aplica las opciones declarativas.
   *
   * @param {HTMLElement} element Elemento de la capa.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-backdrop');
    if (flag(element, 'data-invisible')) element.classList.add('mtx-backdrop--invisible');
    const z = element.getAttribute('data-z');
    if (z && /^-?\d+$/.test(z.trim())) element.style.zIndex = z.trim();

    /** @type {HTMLElement[]} Nodos marcados como `inert` por este backdrop. */
    this._inerted = [];
    this._isOpen = false;
    this._closeTimer = null;

    this.listen(element, 'click', (event) => this._handleClick(event));
    this.onDestroy(() => {
      clearTimeout(this._closeTimer);
      if (this._isOpen) this._release();
    });

    if (flag(element, 'data-open') || element.classList.contains('mtx-backdrop--open')) {
      this._isOpen = false;
      this.open({ silent: true });
    } else {
      element.hidden = true;
      element.setAttribute('aria-hidden', 'true');
    }
  }

  /** @returns {boolean} `true` si la capa está abierta. */
  get isOpen() {
    return this._isOpen;
  }

  /**
   * Muestra la capa con un fundido.
   *
   * @param {{silent?: boolean}} [options] `silent` evita emitir el evento.
   * @returns {this} La instancia.
   */
  open(options = {}) {
    if (this._isOpen) return this;
    const { element } = this;
    clearTimeout(this._closeTimer);
    this._isOpen = true;
    element.hidden = false;
    element.removeAttribute('aria-hidden');
    element.setAttribute('data-open', '');
    if (flag(element, 'data-lock-scroll')) addModal(element);
    if (flag(element, 'data-inert')) this._setInert(true);
    // Capa de la pila común: con `data-close-on-escape` Escape la cierra; si bloquea
    // la página (`data-lock-scroll` / `data-inert`) consume Escape sin cerrarse.
    if (['data-close-on-escape', 'data-lock-scroll', 'data-inert'].some((name) => flag(element, name))) {
      pushLayer(this, { kind: 'modal', nodes: element, onEscape: () => this._handleEscape() });
    }
    // Fuerza un reflow para que la transición de opacidad arranque desde 0.
    void element.offsetWidth; // eslint-disable-line no-void
    element.classList.add('mtx-backdrop--open');
    if (!options.silent) {
      emit(element, 'mtx:backdrop:open');
    }
    return this;
  }

  /**
   * Oculta la capa con un fundido.
   *
   * @param {{reason?: 'api'|'click'|'escape'}} [options] Motivo del cierre (en `detail`).
   * @returns {this} La instancia.
   */
  close(options = {}) {
    if (!this._isOpen) return this;
    const { element } = this;
    this._isOpen = false;
    element.classList.remove('mtx-backdrop--open');
    element.removeAttribute('data-open');
    element.setAttribute('aria-hidden', 'true');
    this._release();
    const duration = this._leaveDuration();
    const finish = () => {
      if (!this._isOpen) element.hidden = true;
    };
    if (duration > 0) this._closeTimer = setTimeout(finish, duration);
    else finish();
    emit(element, 'mtx:backdrop:close', { reason: options.reason || 'api' });
    return this;
  }

  /**
   * Alterna entre abierto y cerrado.
   *
   * @returns {this} La instancia.
   */
  toggle() {
    return this._isOpen ? this.close() : this.open();
  }

  /** Libera el bloqueo de scroll y el `inert` aplicados al abrir. */
  _release() {
    removeModal(this.element);
    removeLayer(this);
    this._setInert(false);
  }

  /** @returns {number} Duración de salida en ms (0 con movimiento reducido). */
  _leaveDuration() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    const raw = getComputedStyle(this.element).transitionDuration || '0s';
    const first = raw.split(',')[0].trim();
    const value = parseFloat(first) || 0;
    return first.endsWith('ms') ? value : value * 1000;
  }

  /**
   * Marca como `inert` los hermanos de la capa y de sus ancestros (patrón aria-hidden de MUI).
   * @param {boolean} active `true` al abrir.
   */
  _setInert(active) {
    if (!active) {
      this._inerted.forEach((node) => node.removeAttribute('inert'));
      this._inerted = [];
      return;
    }
    let node = this.element;
    while (node && node.parentElement && node !== document.body) {
      Array.from(node.parentElement.children).forEach((sibling) => {
        if (sibling === node || sibling.hasAttribute('inert')) return;
        if (/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(sibling.tagName)) return;
        sibling.setAttribute('inert', '');
        this._inerted.push(sibling);
      });
      node = node.parentElement;
    }
  }

  /** Cierra al hacer clic si `data-close-on-click` (ignora controles interactivos del contenido). */
  _handleClick(event) {
    if (!this._isOpen) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest('[data-mtx-backdrop-close]')) {
      this.close({ reason: 'click' });
      return;
    }
    if (!flag(this.element, 'data-close-on-click')) return;
    const interactive = target && target !== this.element && target.closest(INTERACTIVE);
    if (interactive && this.element.contains(interactive)) return;
    this.close({ reason: 'click' });
  }

  /** Cierra con Escape (entregado por la pila de capas) si `data-close-on-escape`. */
  _handleEscape() {
    if (!this._isOpen || !flag(this.element, 'data-close-on-escape')) return;
    this.close({ reason: 'escape' });
  }
}

registerComponent('backdrop', Backdrop);

// Disparadores declarativos: `data-mtx-backdrop-open="id"` alterna el backdrop indicado.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-mtx-backdrop-open]');
    if (!trigger) return;
    const id = (trigger.getAttribute('data-mtx-backdrop-open') || '').trim().replace(/^#/, '');
    const el = id && document.getElementById(id);
    const instance = el && getInstance(el);
    if (instance instanceof Backdrop) instance.toggle();
  });
}
