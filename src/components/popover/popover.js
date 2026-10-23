import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { computePosition, autoUpdate, parsePlacement } from '../../core/position.js';
import { getFocusable, resolveFocusTarget, trapTab } from '../../core/focus-manager.js';
import { addModal, removeModal } from '../../core/modal-manager.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { pushLayer, removeLayer, isTopLayer, isInUpperLayer } from '../../core/layers.js';
import { registerHomeNode } from '../../core/registry.js';

/** Margen mínimo con el viewport (MUI `marginThreshold`). */
const MARGIN_THRESHOLD = 16;
const EXIT_DURATION = 150;
const ELEVATIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 24];
const FALLBACK_FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Convierte un origen MUI (`"bottom left"`, `"center right"`, `"8 16"`) en desplazamientos.
 *
 * @param {string|null} value Valor `vertical horizontal`.
 * @param {number} width Ancho de la caja.
 * @param {number} height Alto de la caja.
 * @param {{vertical:string, horizontal:string}} fallback Valores por defecto.
 * @returns {{x: number, y: number}} Desplazamiento desde la esquina superior izquierda.
 */
function resolveOrigin(value, width, height, fallback) {
  const [vertical = fallback.vertical, horizontal = fallback.horizontal] = String(value || '').trim().split(/\s+/).filter(Boolean);
  const axis = (token, size, map) => {
    if (token in map) return map[token] * size;
    const num = parseFloat(token);
    return Number.isFinite(num) ? num : 0;
  };
  return {
    y: axis(vertical, height, { top: 0, center: 0.5, bottom: 1 }),
    x: axis(horizontal, width, { left: 0, center: 0.5, right: 1 }),
  };
}

/**
 * Popover de Materix UI (MUI Popover): superficie Paper con contenido arbitrario
 * anclada a un disparador, con cierre al hacer clic fuera o pulsar Escape.
 *
 * ```html
 * <button class="mtx-button" data-mtx="button" data-open-popover="#filters">Filtros</button>
 * <div data-mtx="popover" id="filters" data-label="Filtros">…</div>
 * ```
 */
export class Popover extends ComponentBase {
  /**
   * Crea el popover y prepara sus disparadores.
   *
   * @param {HTMLElement} element Contenido del popover (`data-mtx="popover"`).
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-popover');
    if (!element.id) element.id = uniqueId('mtx-popover');
    if (!element.hasAttribute('role')) element.setAttribute('role', 'dialog');
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    if (this.modal) element.setAttribute('aria-modal', 'true');
    element.hidden = true;
    this._applyLabel();
    this._applyElevation();

    this.isOpen = false;
    this._anchor = null;
    this._session = [];
    this._exitTimer = null;
    this._placeholder = null;

    this.triggers.forEach((trigger) => this._prepareTrigger(trigger));

    // Delegación por instancia: sirve también para disparadores añadidos después.
    this.listen(document, 'click', (event) => {
      const trigger = this._triggerFrom(event.target);
      // Solo el popover conectado con ese id (instancias de nodos retirados se ignoran).
      if (!trigger || document.getElementById(this.element.id) !== this.element) return;
      if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
      event.preventDefault();
      this._prepareTrigger(trigger);
      if (this.isOpen && this._trigger === trigger) this.close({ reason: 'trigger' });
      else this.open(trigger);
    });

    this._bindDocument();

    // Botones internos de cierre.
    this.listen(element, 'click', (event) => {
      const closer = event.target instanceof Element ? event.target.closest('[data-mtx-popover-close]') : null;
      if (closer && element.contains(closer)) this.close({ reason: 'action' });
    });
  }

  /** @returns {boolean} Si el popover es modal (atrapa el foco y bloquea el scroll). */
  get modal() {
    const value = this.element.getAttribute('data-modal');
    return value !== null && value !== 'false';
  }

  /**
   * Disparadores declarados: `data-open-popover="#id"` o `aria-controls="id"`.
   *
   * @returns {HTMLElement[]} Disparadores actuales.
   */
  get triggers() {
    const id = this.element.id;
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id;
    return Array.from(document.querySelectorAll(
      `[data-open-popover="#${escaped}"], [data-open-popover="${escaped}"], [aria-controls="${escaped}"]`,
    )).filter((el) => !this.element.contains(el));
  }

  /**
   * Disparador al que pertenece un nodo, si apunta a este popover.
   *
   * @param {EventTarget} node Nodo del evento.
   * @returns {HTMLElement|null} Disparador.
   * @private
   */
  _triggerFrom(node) {
    if (!(node instanceof Element)) return null;
    const trigger = node.closest('[data-open-popover], [aria-controls]');
    if (!trigger || this.element.contains(trigger)) return null;
    const id = this.element.id;
    const ref = (trigger.getAttribute('data-open-popover') || '').trim().replace(/^#/, '');
    if (ref) return ref === id ? trigger : null;
    return trigger.getAttribute('aria-controls') === id ? trigger : null;
  }

  /**
   * Añade la semántica de disparador (`aria-haspopup`, `aria-controls`, `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _prepareTrigger(trigger) {
    if (!trigger.hasAttribute('aria-haspopup')) trigger.setAttribute('aria-haspopup', 'dialog');
    if (!trigger.hasAttribute('aria-controls')) trigger.setAttribute('aria-controls', this.element.id);
    trigger.setAttribute('aria-expanded', this.isOpen && this._trigger === trigger ? 'true' : 'false');
  }

  /**
   * Nombre accesible: `data-label`, o el primer encabezado interno vía `aria-labelledby`.
   *
   * @private
   */
  _applyLabel() {
    const el = this.element;
    if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return;
    const label = el.getAttribute('data-label');
    if (label) {
      el.setAttribute('aria-label', label);
      return;
    }
    const heading = el.querySelector('[data-popover-title], h1, h2, h3, h4, h5, h6');
    if (heading) {
      if (!heading.id) heading.id = `${el.id}-title`;
      el.setAttribute('aria-labelledby', heading.id);
    }
  }

  /**
   * Aplica la elevación (`data-elevation`, 8 por defecto como MUI).
   *
   * @private
   */
  _applyElevation() {
    const raw = parseInt(this.element.getAttribute('data-elevation'), 10);
    if (Number.isNaN(raw)) return;
    const level = ELEVATIONS.reduce((best, value) => (Math.abs(value - raw) < Math.abs(best - raw) ? value : best), 8);
    this.element.style.setProperty('--mtx-popover-shadow', level === 0 ? 'none' : `var(--mtx-elevation-${level})`);
    this.element.style.setProperty('--mtx-popover-overlay', `var(--mtx-overlay-elevation-${level})`);
  }

  /**
   * Ancla efectiva: la indicada, `data-anchor`, el último disparador o el primero declarado.
   *
   * @returns {Element|{getBoundingClientRect: Function}|null} Ancla.
   * @private
   */
  _resolveAnchor() {
    if (this._anchor) return this._anchor;
    const ref = this.element.getAttribute('data-anchor');
    const fromAttr = ref ? document.querySelector(ref.startsWith('#') ? ref : `#${ref}`) : null;
    return fromAttr || this.triggers[0] || null;
  }

  /**
   * Abre el popover.
   *
   * @param {HTMLElement|{x:number, y:number}|{getBoundingClientRect: Function}} [anchor] Ancla:
   *   elemento, punto de viewport (`anchorPosition` de MUI) o ancla virtual.
   * @returns {boolean} `true` si se abrió.
   */
  open(anchor) {
    if (anchor) {
      if (anchor.nodeType === 1 || typeof anchor.getBoundingClientRect === 'function') {
        this._anchor = anchor;
      } else if (Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
        const { x, y } = anchor;
        this._anchor = { getBoundingClientRect: () => ({ top: y, bottom: y, left: x, right: x, width: 0, height: 0, x, y }) };
      }
      if (anchor.nodeType === 1 && this._triggerFrom(anchor)) this._setTrigger(anchor);
    }
    if (this.isOpen) {
      this.update();
      return true;
    }
    const el = this.element;
    if (!this._trigger) {
      const candidate = this._anchor && this._anchor.nodeType === 1 ? this._anchor : this.triggers[0];
      if (candidate) this._setTrigger(candidate);
    }
    // Un clic en WebKit no enfoca el botón (queda en body o en un ancestro con
    // tabindex="-1"): solo se conserva el foco activo si es tabulable; si no, el disparador.
    const active = document.activeElement;
    this._returnFocus = active && active !== document.body && active.tabIndex >= 0 && !el.contains(active)
      ? active
      : this._trigger || active;

    clearTimeout(this._exitTimer);
    this._portal();
    el.hidden = false;
    this.isOpen = true;
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'true');

    const anchorEl = this._resolveAnchor();
    const stop = autoUpdate(anchorEl && anchorEl.nodeType === 1 ? anchorEl : null, el, () => this.update());
    this._session.push(stop);
    // Se guarda al abrir: close() libera el modal aunque luego se retire `data-modal`.
    this._wasModal = this.modal;
    if (this._wasModal) addModal(el);
    pushLayer(this, {
      kind: this._wasModal ? 'modal' : 'popup',
      nodes: el,
      stack: [{ node: el }],
      onEscape: () => this.close({ reason: 'escape' }),
    });

    void el.offsetWidth;
    el.classList.add('mtx-popover--open');
    this._focusInitial();
    emit(el, 'mtx:popover:open', { popover: this, anchor: anchorEl });
    return true;
  }

  /**
   * Cierra el popover.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.restoreFocus=true] Devuelve el foco al disparador.
   * @param {string} [options.reason='api'] Motivo (`escape`, `click-away`, `tab`, `trigger`, `action`, `api`).
   */
  close({ restoreFocus = true, reason = 'api' } = {}) {
    if (!this.isOpen) return;
    const el = this.element;
    this.isOpen = false;
    this._session.forEach((fn) => fn());
    this._session = [];
    if (this._wasModal) removeModal(el);
    this._wasModal = false;
    removeLayer(this);
    el.classList.remove('mtx-popover--open');
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'false');

    if (restoreFocus) this._restoreLostFocus();

    clearTimeout(this._exitTimer);
    this._exitTimer = setTimeout(() => {
      if (!this.isOpen) el.hidden = true;
    }, EXIT_DURATION);
    emit(el, 'mtx:popover:close', { popover: this, reason });
  }

  /**
   * Devuelve el foco al disparador si quedó perdido tras cerrar sin restauración.
   *
   * @private
   */
  _restoreLostFocus() {
    if (this.isOpen) return;
    const target = this._returnFocus && this._returnFocus.isConnected ? this._returnFocus : this._trigger;
    if (!target || typeof target.focus !== 'function') return;
    const active = document.activeElement;
    const lost = !active || active === document.body || this.element.contains(active)
      || (active.tabIndex < 0 && active.contains(target));
    if (lost) target.focus();
  }

  /**
   * Alterna el estado.
   *
   * @param {HTMLElement|{x:number,y:number}} [anchor] Ancla opcional.
   */
  toggle(anchor) {
    if (this.isOpen) this.close();
    else this.open(anchor);
  }

  /**
   * Cambia el disparador activo (para `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _setTrigger(trigger) {
    if (this._trigger && this._trigger !== trigger) this._trigger.setAttribute('aria-expanded', 'false');
    this._trigger = trigger;
    this._anchor = this._anchor || trigger;
  }

  /**
   * Porta el popover a `<body>` (evita overflow/z-index de los ancestros); deja un marcador para restaurarlo.
   *
   * @private
   */
  _portal() {
    const el = this.element;
    if (el.parentElement === document.body) return;
    if (!this._placeholder && el.parentNode) {
      this._placeholder = document.createComment(`mtx-popover:${el.id}`);
      el.parentNode.insertBefore(this._placeholder, el);
      // Si se elimina la ubicación original, `watch({destroyOnRemove})`/`destroyAll` destruyen el popover portado.
      registerHomeNode(this, this._placeholder);
    }
    document.body.appendChild(el);
  }

  /**
   * Enfoca `[data-autofocus]`, el primer control o el propio panel.
   *
   * @private
   */
  _focusInitial() {
    const el = this.element;
    const explicit = resolveFocusTarget(el.querySelector('[data-autofocus]'));
    const target = explicit
      || getFocusable(el)[0]
      || el.querySelector(FALLBACK_FOCUSABLE)
      || el;
    try {
      target.focus({ preventScroll: true });
    } catch (e) {
      target.focus();
    }
  }

  /**
   * Indica si un nodo pertenece a una capa abierta después de este popover
   * (popover hijo, menú, select, diálogo abierto desde él, tooltip).
   *
   * @param {Node} node Nodo.
   * @returns {boolean} `true` si está en una capa superior.
   * @private
   */
  _inUpperLayer(node) {
    if (!(node instanceof Element)) return false;
    if (node.closest('.mtx-tooltip')) return true;
    return isInUpperLayer(this, node);
  }

  /**
   * Listeners de documento (clic fuera, Tab); solo actúan mientras está abierto.
   *
   * @private
   */
  _bindDocument() {
    const el = this.element;
    // Temporizadores diferidos de foco/Tab: se cancelan al destruir.
    this._focusTimer = null;
    this._tabTimer = null;
    this.onDestroy(() => {
      clearTimeout(this._focusTimer);
      clearTimeout(this._tabTimer);
    });
    const onPointerDown = (event) => {
      if (!this.isOpen) return;
      const target = event.target;
      if (el.contains(target) || this._inUpperLayer(target)) return;
      if (this._triggerFrom(target)) return;
      // El ancla actual (p. ej. un botón que llama a toggle()) no cuenta como "fuera".
      if (this._anchor && this._anchor.nodeType === 1 && this._anchor.contains(target)) return;
      this.close({ restoreFocus: false, reason: 'click-away' });
      // Tras el clic, si el foco se perdió (body, el popover oculto o un contenedor no
      // tabulable), vuelve al disparador; si el clic enfocó otro control, se respeta.
      clearTimeout(this._focusTimer);
      this._focusTimer = setTimeout(() => {
        this._focusTimer = null;
        if (!this.destroyed) this._restoreLostFocus();
      }, 0);
    };
    const onKeyDown = (event) => {
      // Escape lo entrega la pila de capas; aquí solo Tab y solo si es la capa superior.
      if (!this.isOpen || event.key !== 'Tab' || !isTopLayer(this)) return;
      if (this.modal) {
        trapTab(event, el);
        return;
      }
      // No modal: al salir con Tab se cierra sin robar el foco.
      clearTimeout(this._tabTimer);
      this._tabTimer = setTimeout(() => {
        this._tabTimer = null;
        if (this.destroyed) return;
        const active = document.activeElement;
        if (this.isOpen && active && active !== document.body && !el.contains(active) && !this._inUpperLayer(active)) {
          this.close({ restoreFocus: false, reason: 'tab' });
        }
      }, 0);
    };
    this.listen(document, 'mousedown', onPointerDown, true);
    this.listen(document, 'touchstart', onPointerDown, true);
    this.listen(document, 'keydown', onKeyDown);
  }

  /**
   * Recalcula la posición respecto del ancla.
   */
  update() {
    if (!this.isOpen) return;
    const el = this.element;
    const anchor = this._resolveAnchor();
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const width = el.offsetWidth || el.getBoundingClientRect().width;
    const height = el.offsetHeight || el.getBoundingClientRect().height;

    if (!anchor) {
      el.style.left = `${Math.max(MARGIN_THRESHOLD, (viewportWidth - width) / 2)}px`;
      el.style.top = `${Math.max(MARGIN_THRESHOLD, (viewportHeight - height) / 2)}px`;
      el.style.transformOrigin = 'center center';
      return;
    }

    const anchorOrigin = this.element.getAttribute('data-anchor-origin');
    const transformOrigin = this.element.getAttribute('data-transform-origin');
    if (anchorOrigin || transformOrigin) {
      // Algoritmo de MUI: punto del ancla − punto de transformación, limitado al viewport.
      const rect = anchor.getBoundingClientRect();
      const a = resolveOrigin(anchorOrigin, rect.width, rect.height, { vertical: 'bottom', horizontal: 'left' });
      const t = resolveOrigin(transformOrigin, width, height, { vertical: 'top', horizontal: 'left' });
      let top = rect.top + a.y - t.y;
      let left = rect.left + a.x - t.x;
      let originX = t.x;
      let originY = t.y;
      const bottom = top + height;
      const right = left + width;
      if (top < MARGIN_THRESHOLD) {
        originY -= MARGIN_THRESHOLD - top;
        top = MARGIN_THRESHOLD;
      } else if (bottom > viewportHeight - MARGIN_THRESHOLD) {
        const diff = bottom - (viewportHeight - MARGIN_THRESHOLD);
        top -= diff;
        originY += diff;
      }
      if (left < MARGIN_THRESHOLD) {
        originX -= MARGIN_THRESHOLD - left;
        left = MARGIN_THRESHOLD;
      } else if (right > viewportWidth - MARGIN_THRESHOLD) {
        const diff = right - (viewportWidth - MARGIN_THRESHOLD);
        left -= diff;
        originX += diff;
      }
      el.style.top = `${Math.round(top)}px`;
      el.style.left = `${Math.round(left)}px`;
      el.style.transformOrigin = `${Math.round(originX)}px ${Math.round(originY)}px`;
      el.setAttribute('data-placement', 'origin');
      return;
    }

    const offset = parseFloat(this.element.getAttribute('data-offset'));
    const result = computePosition(anchor, el, {
      placement: this.element.getAttribute('data-placement') || 'bottom-start',
      offset: Number.isFinite(offset) ? offset : 0,
      padding: MARGIN_THRESHOLD,
    });
    el.style.left = `${result.x}px`;
    el.style.top = `${result.y}px`;
    const { side, align } = parsePlacement(`${result.side}-${result.align}`);
    const vertical = side === 'top' || side === 'bottom';
    const cross = align === 'start' ? (vertical ? 'left' : 'top') : align === 'end' ? (vertical ? 'right' : 'bottom') : 'center';
    const main = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side];
    el.style.transformOrigin = vertical ? `${cross} ${main}` : `${main} ${cross}`;
    el.setAttribute('data-placement', result.placement);
  }

  /**
   * Cierra, restaura la posición original en el DOM y libera listeners.
   */
  destroy() {
    this.close({ restoreFocus: false, reason: 'destroy' });
    clearTimeout(this._exitTimer);
    this._exitTimer = null;
    // Estado final de cierre: sin él quedaría una caja invisible que intercepta clics y foco.
    const style = this.element.style;
    this.element.hidden = true;
    style.left = '';
    style.top = '';
    style.transformOrigin = '';
    if (this._placeholder && this._placeholder.parentNode) {
      this._placeholder.parentNode.insertBefore(this.element, this._placeholder);
      this._placeholder.remove();
    }
    this._placeholder = null;
    super.destroy();
  }
}

registerComponent('popover', Popover);
