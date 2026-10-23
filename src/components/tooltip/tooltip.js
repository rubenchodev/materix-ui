import { ComponentBase } from '../../core/component-base.js';
import {
  registerComponent,
  getInstance,
  registerInstance,
  unregisterInstance,
  initElement,
} from '../../core/registry.js';
import { computePosition, autoUpdate, isRtl } from '../../core/position.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { pushLayer, removeLayer } from '../../core/layers.js';

/** Selector de disparadores con tooltip (global declarativo y forma avanzada). */
const TRIGGER_SELECTOR = '[data-mtx-tooltip], [data-mtx="tooltip"]';
const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]';

/** Valores por defecto de MUI (ms y px). */
const DEFAULTS = {
  placement: 'bottom',
  enterDelay: 100,
  enterNextDelay: 0,
  leaveDelay: 0,
  enterTouchDelay: 700,
  leaveTouchDelay: 1500,
  hysteresis: 800,
  offset: 14,
  touchOffset: 24,
  exitDuration: 150,
};

/** @type {WeakMap<HTMLElement, Tooltip>} Tooltips de disparadores `data-mtx-tooltip` (no van al registro). */
const declarativeTooltips = new WeakMap();
/** @type {WeakMap<HTMLElement, Tooltip>} Superficie `.mtx-tooltip` → instancia propietaria. */
const popupOwners = new WeakMap();
/** @type {Set<Tooltip>} Tooltips visibles. */
const openTooltips = new Set();

let hysteresisOpen = false;
let hysteresisTimer = null;
let keyboardModality = false;

/**
 * Lee un atributo booleano `data-*` (presente y distinto de `"false"`).
 *
 * @param {HTMLElement} el Elemento.
 * @param {string} name Atributo.
 * @returns {boolean|null} Valor o `null` si no existe.
 */
function readBoolAttr(el, name) {
  if (!el.hasAttribute(name)) return null;
  return el.getAttribute(name) !== 'false';
}

/**
 * Texto visible de un elemento, sin iconos tipográficos ni nodos `aria-hidden`.
 *
 * @param {HTMLElement} el Elemento.
 * @returns {string} Texto normalizado.
 */
function getVisibleText(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('[aria-hidden="true"], .material-icons, [class*="material-symbols"], .mtx-ripple, script, style')
    .forEach((node) => node.remove());
  const alts = Array.from(clone.querySelectorAll('img[alt]')).map((img) => img.getAttribute('alt')).join(' ');
  return `${clone.textContent || ''} ${alts}`.replace(/\s+/g, ' ').trim();
}

/**
 * Nombre accesible aproximado del elemento (aria-label, aria-labelledby, label, title o texto).
 *
 * @param {HTMLElement} el Elemento.
 * @returns {string} Nombre (vacío si no tiene).
 */
export function getAccessibleName(el) {
  const label = (el.getAttribute('aria-label') || '').trim();
  if (label) return label;
  const labelledby = (el.getAttribute('aria-labelledby') || '').trim();
  if (labelledby) {
    const text = labelledby.split(/\s+/)
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((node) => node.textContent.trim())
      .join(' ')
      .trim();
    if (text) return text;
  }
  if (el.labels && el.labels.length) {
    const text = Array.from(el.labels).map((node) => node.textContent.trim()).join(' ').trim();
    if (text) return text;
  }
  if (el.tagName === 'IMG') return (el.getAttribute('alt') || '').trim();
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
    return (el.getAttribute('title') || el.getAttribute('placeholder') || '').trim();
  }
  return getVisibleText(el) || (el.getAttribute('title') || '').trim();
}

/**
 * Normaliza un texto para comparar nombre y título.
 *
 * @param {string} value Texto.
 * @returns {string} Texto normalizado.
 */
function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Añade o quita un id de una lista de ids (aria-describedby).
 *
 * @param {HTMLElement} el Elemento.
 * @param {string} attr Atributo.
 * @param {string} id Identificador.
 * @param {boolean} add `true` para añadir.
 */
function toggleIdRef(el, attr, id, add) {
  const ids = (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean).filter((value) => value !== id);
  if (add) ids.push(id);
  if (ids.length) el.setAttribute(attr, ids.join(' '));
  else el.removeAttribute(attr);
}

/**
 * Representa el tooltip de un disparador (MUI Tooltip).
 *
 * Dos formas de uso: global declarativa (`data-mtx-tooltip="Texto"` en cualquier elemento, sin
 * inicialización) y avanzada (`data-mtx="tooltip"` con `data-title`, envolviendo al disparador).
 */
export class Tooltip extends ComponentBase {
  /**
   * Crea el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador o contenedor `data-mtx="tooltip"`.
   * @param {Object} [options] Opciones que prevalecen sobre los atributos.
   * @param {string} [options.title] Texto del tooltip.
   * @param {string} [options.placement] Colocación (`top|bottom|left|right` + `-start|-end`).
   * @param {boolean} [options.arrow] Muestra la flecha.
   * @param {number} [options.enterDelay] Retardo de apertura (ms).
   * @param {number} [options.leaveDelay] Retardo de cierre (ms).
   * @param {boolean} [options.followCursor] Sigue al puntero.
   * @param {boolean} [options.declarative] Uso interno: no ocupa el registro del elemento.
   */
  constructor(element, options = {}) {
    const previous = getInstance(element);
    const wasInitialized = element.hasAttribute('data-mtx-initialized');
    super(element);
    this._declarative = Boolean(options.declarative);
    if (this._declarative) {
      // El disparador puede ser otro componente (IconButton...): se conserva su instancia.
      if (previous) registerInstance(element, previous);
      else unregisterInstance(element);
      if (!wasInitialized) element.removeAttribute('data-mtx-initialized');
      declarativeTooltips.set(element, this);
    }
    this.options = { ...options };
    delete this.options.declarative;
    this.id = uniqueId('mtx-tooltip');
    /** @type {HTMLElement|null} Superficie `role="tooltip"` (solo mientras se muestra). */
    this.popup = null;
    this.isOpen = false;
    this._timers = {};
    this._pointer = null;
    this._touch = false;
    this._stopAutoUpdate = null;
    this.syncAccessibleName();
  }

  /**
   * Elemento que recibe el foco y los atributos ARIA (el propio o su primer hijo enfocable).
   *
   * @returns {HTMLElement} Destino.
   */
  get target() {
    const el = this.element;
    if (el.getAttribute('data-mtx') !== 'tooltip' || el.matches(FOCUSABLE_SELECTOR)) return el;
    return el.querySelector(FOCUSABLE_SELECTOR) || el.firstElementChild || el;
  }

  /**
   * Texto actual del tooltip.
   *
   * @returns {string} Título.
   */
  get title() {
    if (typeof this.options.title === 'string') return this.options.title;
    const el = this.element;
    if (el.getAttribute('data-mtx') === 'tooltip' && el.hasAttribute('data-title')) return el.getAttribute('data-title');
    return el.getAttribute('data-mtx-tooltip') || el.getAttribute('data-title') || '';
  }

  /**
   * Lee una opción: objeto de opciones, `data-tooltip-{name}` o `data-{name}` (forma avanzada).
   *
   * @param {string} key Clave camelCase.
   * @param {string} attr Sufijo kebab-case del atributo.
   * @param {'string'|'number'|'boolean'} type Tipo esperado.
   * @returns {*} Valor o `undefined`.
   * @private
   */
  _option(key, attr, type) {
    if (this.options[key] !== undefined) return this.options[key];
    const el = this.element;
    const names = [`data-tooltip-${attr}`];
    if (el.getAttribute('data-mtx') === 'tooltip') names.push(`data-${attr}`);
    for (const name of names) {
      if (!el.hasAttribute(name)) continue;
      if (type === 'boolean') return readBoolAttr(el, name);
      const raw = el.getAttribute(name);
      if (type === 'number') {
        const num = parseInt(raw, 10);
        if (!Number.isNaN(num)) return num;
        continue;
      }
      if (raw) return raw;
    }
    return undefined;
  }

  /** @returns {string} Colocación configurada. */
  get placement() { return this._option('placement', 'placement', 'string') || DEFAULTS.placement; }

  /** @returns {boolean} Si muestra flecha. */
  get arrow() { return this._option('arrow', 'arrow', 'boolean') === true; }

  /** @returns {boolean} Si sigue al cursor. */
  get followCursor() { return this._option('followCursor', 'follow-cursor', 'boolean') === true; }

  /** @returns {number} Retardo de apertura (ms). */
  get enterDelay() {
    const value = this._option('enterDelay', 'enter-delay', 'number');
    return value === undefined ? DEFAULTS.enterDelay : Math.max(0, value);
  }

  /** @returns {number} Retardo de cierre (ms). */
  get leaveDelay() {
    const value = this._option('leaveDelay', 'leave-delay', 'number');
    return value === undefined ? DEFAULTS.leaveDelay : Math.max(0, value);
  }

  /**
   * Si el disparador no tiene nombre accesible, usa el título como `aria-label`.
   * Si lo puso Materix antes, lo mantiene sincronizado con el título.
   */
  syncAccessibleName() {
    const target = this.target;
    const title = this.title.trim();
    if (target.hasAttribute('data-mtx-tooltip-label')) {
      if (title) target.setAttribute('aria-label', title);
      return;
    }
    if (!title || getAccessibleName(target)) return;
    target.setAttribute('aria-label', title);
    target.setAttribute('data-mtx-tooltip-label', '');
  }

  /**
   * Cambia el texto del tooltip (y el `aria-label` si lo generó Materix).
   *
   * @param {string} title Nuevo texto.
   */
  setTitle(title) {
    const text = String(title == null ? '' : title);
    const el = this.element;
    if (typeof this.options.title === 'string') this.options.title = text;
    else if (el.getAttribute('data-mtx') === 'tooltip') el.setAttribute('data-title', text);
    else el.setAttribute('data-mtx-tooltip', text);
    this.refresh();
  }

  /**
   * Relee el título: sincroniza el nombre accesible y el texto visible (sin escribir atributos de título).
   */
  refresh() {
    const text = this.title;
    this.syncAccessibleName();
    if (this.popup) this.popup.querySelector('.mtx-tooltip__label').textContent = text;
    if (!text.trim()) this.close({ immediate: true });
    else if (this.isOpen) this.update();
  }

  /**
   * Programa la apertura con el retardo correspondiente (MUI: 0 si otro tooltip acaba de cerrarse).
   *
   * @param {'hover'|'focus'|'touch'} reason Origen.
   * @private
   */
  _scheduleOpen(reason) {
    this._clearTimer('leave');
    if (this.isOpen && !this._closing) return;
    let delay = hysteresisOpen ? DEFAULTS.enterNextDelay : this.enterDelay;
    if (reason === 'touch') delay = DEFAULTS.enterTouchDelay;
    this._clearTimer('enter');
    const run = () => this.open({ touch: reason === 'touch' });
    if (delay <= 0) run();
    else this._timers.enter = setTimeout(run, delay);
  }

  /**
   * Programa el cierre (mouseleave / fin de pulsación larga).
   *
   * @param {number} [delay] Retardo (ms); por defecto `leaveDelay`.
   * @private
   */
  _scheduleClose(delay = this.leaveDelay) {
    this._clearTimer('enter');
    if (!this.isOpen) return;
    this._clearTimer('leave');
    if (delay <= 0) this.close();
    else this._timers.leave = setTimeout(() => this.close(), delay);
  }

  /**
   * Cancela un temporizador.
   *
   * @param {string} name Nombre.
   * @private
   */
  _clearTimer(name) {
    if (this._timers[name]) {
      clearTimeout(this._timers[name]);
      this._timers[name] = null;
    }
  }

  /**
   * Crea la superficie `role="tooltip"` portada a `<body>`.
   *
   * @returns {HTMLElement} Superficie.
   * @private
   */
  _createPopup() {
    const popup = document.createElement('div');
    popup.className = 'mtx-tooltip';
    popup.id = this.id;
    popup.setAttribute('role', 'tooltip');
    const label = document.createElement('span');
    label.className = 'mtx-tooltip__label';
    popup.appendChild(label);
    popupOwners.set(popup, this);
    return popup;
  }

  /**
   * Muestra el tooltip de inmediato.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.touch=false] Estilo táctil (fuente mayor, más separación).
   * @returns {boolean} `true` si se mostró.
   */
  open({ touch = false } = {}) {
    this._clearTimer('enter');
    this._clearTimer('leave');
    this._clearTimer('exit');
    const title = this.title;
    if (!title.trim() || !this.element.isConnected) return false;

    openTooltips.forEach((other) => {
      if (other !== this) other.close({ immediate: true });
    });

    if (!this.popup) this.popup = this._createPopup();
    const popup = this.popup;
    popup.querySelector('.mtx-tooltip__label').textContent = title;
    this._touch = touch;
    popup.classList.toggle('mtx-tooltip--touch', touch);
    popup.classList.toggle('mtx-tooltip--arrow', this.arrow);
    let arrow = popup.querySelector('.mtx-tooltip__arrow');
    if (this.arrow && !arrow) {
      arrow = document.createElement('span');
      arrow.className = 'mtx-tooltip__arrow';
      arrow.setAttribute('aria-hidden', 'true');
      popup.appendChild(arrow);
    } else if (!this.arrow && arrow) {
      arrow.remove();
    }
    if (!popup.isConnected) document.body.appendChild(popup);

    const wasOpen = this.isOpen && !this._closing;
    this.isOpen = true;
    this._closing = false;
    openTooltips.add(this);
    // Capa transitoria: Escape la cierra primero (WCAG 1.4.13) sin bloquear las demás.
    pushLayer(this, { kind: 'tooltip', nodes: () => this.popup, onEscape: () => this.close() });
    this._setDescribedBy(true);

    if (this._stopAutoUpdate) this._stopAutoUpdate();
    this._stopAutoUpdate = autoUpdate(this.target, popup, () => this.update());

    if (!wasOpen) {
      // Reflujo forzado: la transición de entrada parte del estado inicial.
      void popup.offsetWidth;
      popup.classList.add('mtx-tooltip--open');
      hysteresisOpen = true;
      if (hysteresisTimer) clearTimeout(hysteresisTimer);
      hysteresisTimer = null;
      emit(this.element, 'mtx:tooltip:open', { tooltip: this });
    }
    return true;
  }

  /**
   * Oculta el tooltip.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.immediate=false] Retira la superficie sin transición.
   */
  close({ immediate = false } = {}) {
    this._clearTimer('enter');
    this._clearTimer('leave');
    if (!this.isOpen) return;
    const popup = this.popup;
    this.isOpen = false;
    this._closing = !immediate;
    openTooltips.delete(this);
    removeLayer(this);
    this._setDescribedBy(false);
    if (this._stopAutoUpdate) {
      this._stopAutoUpdate();
      this._stopAutoUpdate = null;
    }
    if (popup) popup.classList.remove('mtx-tooltip--open');
    const finish = () => {
      this._closing = false;
      this._clearTimer('exit');
      if (!this.isOpen && popup) popup.remove();
    };
    if (immediate) finish();
    else this._timers.exit = setTimeout(finish, DEFAULTS.exitDuration);

    if (hysteresisTimer) clearTimeout(hysteresisTimer);
    hysteresisTimer = setTimeout(() => {
      hysteresisOpen = false;
      hysteresisTimer = null;
    }, DEFAULTS.hysteresis + this.leaveDelay);
    emit(this.element, 'mtx:tooltip:close', { tooltip: this });
  }

  /**
   * Alterna la visibilidad.
   */
  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  /** Alias de `open()` (API de `Materix.tooltip`). */
  show() { return this.open(); }

  /** Alias de `close()`. */
  hide() { this.close(); }

  /**
   * Añade o retira `aria-describedby`. Se omite si el nombre accesible ya coincide con el título.
   *
   * @param {boolean} active `true` al abrir.
   * @private
   */
  _setDescribedBy(active) {
    const target = this.target;
    if (!active) {
      toggleIdRef(target, 'aria-describedby', this.id, false);
      return;
    }
    if (normalizeText(getAccessibleName(target)) === normalizeText(this.title)) return;
    toggleIdRef(target, 'aria-describedby', this.id, true);
  }

  /**
   * Recalcula la posición (scroll, resize, cursor).
   */
  update() {
    const popup = this.popup;
    if (!popup || !this.isOpen) return;
    if (!this.element.isConnected) {
      this.close({ immediate: true });
      return;
    }
    const pointer = this._pointer;
    const anchor = this.followCursor && pointer
      ? { getBoundingClientRect: () => ({ top: pointer.y, bottom: pointer.y, left: pointer.x, right: pointer.x, width: 0, height: 0, x: pointer.x, y: pointer.y }) }
      : this.target;
    const gap = this._touch ? DEFAULTS.touchOffset : DEFAULTS.offset;
    const result = computePosition(anchor, popup, {
      placement: this.placement,
      offset: gap,
      flip: true,
      shift: true,
      padding: 8,
      rtl: isRtl(this.target),
    });
    popup.style.left = `${result.x}px`;
    popup.style.top = `${result.y}px`;
    popup.style.setProperty('--mtx-tooltip-gap', `${gap}px`);
    popup.setAttribute('data-side', result.side);
    popup.setAttribute('data-placement', result.placement);
    const arrow = popup.querySelector('.mtx-tooltip__arrow');
    if (arrow) {
      const vertical = result.side === 'top' || result.side === 'bottom';
      arrow.style.left = vertical ? `calc(${result.arrowOffset}px - 0.5em)` : '';
      arrow.style.top = vertical ? '' : `calc(${result.arrowOffset}px - 0.5em)`;
    }
  }

  /**
   * Libera temporizadores, superficie y atributos. En la forma global no toca el registro.
   */
  destroy() {
    Object.keys(this._timers).forEach((name) => this._clearTimer(name));
    this.close({ immediate: true });
    if (this.popup) {
      this.popup.remove();
      popupOwners.delete(this.popup);
      this.popup = null;
    }
    const target = this.target;
    if (target.hasAttribute('data-mtx-tooltip-label')) {
      target.removeAttribute('aria-label');
      target.removeAttribute('data-mtx-tooltip-label');
    }
    if (this._declarative) {
      declarativeTooltips.delete(this.element);
      const cleanups = this._cleanups || [];
      this._cleanups = [];
      while (cleanups.length) {
        try { cleanups.pop()(); } catch (e) { /* sin efecto */ }
      }
      this.destroyed = true;
      return;
    }
    super.destroy();
  }
}

/**
 * Obtiene (o crea) el tooltip de un disparador.
 *
 * @param {HTMLElement} element Disparador con `data-mtx-tooltip` o contenedor `data-mtx="tooltip"`.
 * @param {boolean} [create=true] Crea la instancia si no existe.
 * @returns {Tooltip|null} Instancia o `null`.
 */
export function getTooltip(element, create = true) {
  if (!element || element.nodeType !== 1) return null;
  if (element.getAttribute('data-mtx') === 'tooltip') {
    const existing = getInstance(element);
    if (existing instanceof Tooltip) return existing;
    return create ? initElement(element) : null;
  }
  const existing = declarativeTooltips.get(element);
  if (existing || !create || !element.hasAttribute('data-mtx-tooltip')) return existing || null;
  return new Tooltip(element, { declarative: true });
}

/**
 * Disparador con tooltip más cercano a un nodo.
 *
 * @param {EventTarget} node Nodo.
 * @returns {HTMLElement|null} Disparador.
 */
function closestTrigger(node) {
  return node instanceof Element ? node.closest(TRIGGER_SELECTOR) : null;
}

/**
 * Tooltip cuya superficie contiene el nodo.
 *
 * @param {EventTarget} node Nodo.
 * @returns {Tooltip|null} Propietario.
 */
function ownerOfPopup(node) {
  const popup = node instanceof Element ? node.closest('.mtx-tooltip') : null;
  return popup ? popupOwners.get(popup) || null : null;
}

/**
 * Indica si `node` está dentro del disparador o de la superficie del tooltip.
 *
 * @param {Tooltip} instance Tooltip.
 * @param {EventTarget} node Nodo.
 * @returns {boolean} `true` si pertenece.
 */
function isInside(instance, node) {
  if (!(node instanceof Node)) return false;
  return instance.element.contains(node) || Boolean(instance.popup && instance.popup.contains(node));
}

/** Temporizador de pulsación larga táctil. */
let touchState = null;

const handlers = {
  pointerover(event) {
    if (event.pointerType === 'touch') return;
    const owner = ownerOfPopup(event.target);
    if (owner) {
      // Hoverable (WCAG 1.4.13): el puntero sobre el tooltip lo mantiene abierto.
      owner._clearTimer('leave');
      if (owner._closing) owner.open({ touch: owner._touch });
      return;
    }
    const trigger = closestTrigger(event.target);
    if (!trigger) return;
    const instance = getTooltip(trigger);
    if (!instance) return;
    if (instance.followCursor) instance._pointer = { x: event.clientX, y: event.clientY };
    if (event.relatedTarget && isInside(instance, event.relatedTarget) && (instance.isOpen || instance._timers.enter)) return;
    instance._scheduleOpen('hover');
  },
  pointerout(event) {
    if (event.pointerType === 'touch') return;
    const owner = ownerOfPopup(event.target);
    const trigger = owner ? null : closestTrigger(event.target);
    const instance = owner || (trigger && getTooltip(trigger, false));
    if (!instance) return;
    if (event.relatedTarget && isInside(instance, event.relatedTarget)) return;
    instance._scheduleClose();
  },
  pointermove(event) {
    if (event.pointerType === 'touch') return;
    const trigger = closestTrigger(event.target);
    const instance = trigger && getTooltip(trigger, false);
    if (!instance || !instance.followCursor) return;
    instance._pointer = { x: event.clientX, y: event.clientY };
    if (instance.isOpen) instance.update();
  },
  pointerdown(event) {
    keyboardModality = false;
    if (event.pointerType !== 'touch') return;
    const trigger = closestTrigger(event.target);
    openTooltips.forEach((open) => {
      if (!trigger || open.element !== trigger) open.close();
    });
    if (!trigger) return;
    const instance = getTooltip(trigger);
    if (!instance) return;
    if (touchState) clearTimeout(touchState.timer);
    touchState = { instance, timer: null };
    instance._clearTimer('leave');
    touchState.timer = setTimeout(() => {
      instance.open({ touch: true });
    }, DEFAULTS.enterTouchDelay);
  },
  pointerup(event) {
    if (event.pointerType !== 'touch' || !touchState) return;
    const { instance, timer } = touchState;
    clearTimeout(timer);
    touchState = null;
    if (instance.isOpen) instance._scheduleClose(DEFAULTS.leaveTouchDelay);
  },
  focusin(event) {
    const trigger = closestTrigger(event.target);
    if (!trigger || !keyboardModality) return;
    const instance = getTooltip(trigger);
    if (instance) instance._scheduleOpen('focus');
  },
  focusout(event) {
    const trigger = closestTrigger(event.target);
    const instance = trigger && getTooltip(trigger, false);
    if (!instance) return;
    if (event.relatedTarget && instance.element.contains(event.relatedTarget)) return;
    instance.close();
  },
  keydown(event) {
    // Escape lo entrega la pila de capas (src/core/layers.js): el tooltip visible se cierra primero.
    if (event.key === 'Escape') return;
    if (event.metaKey || event.altKey || event.ctrlKey) return;
    keyboardModality = true;
  },
};
handlers.pointercancel = handlers.pointerup;

let installed = false;
let observer = null;

/**
 * Aplica `aria-label` a los disparadores sin nombre accesible dentro de un contenedor.
 *
 * @param {Document|HTMLElement} [root=document] Contenedor.
 */
function syncTriggers(root = document) {
  const nodes = [];
  if (root.nodeType === 1 && root.hasAttribute('data-mtx-tooltip')) nodes.push(root);
  if (root.querySelectorAll) nodes.push(...root.querySelectorAll('[data-mtx-tooltip]'));
  nodes.forEach((node) => {
    const instance = declarativeTooltips.get(node);
    if (instance) {
      instance.syncAccessibleName();
      return;
    }
    const title = (node.getAttribute('data-mtx-tooltip') || '').trim();
    if (node.hasAttribute('data-mtx-tooltip-label')) {
      if (title) node.setAttribute('aria-label', title);
    } else if (title && !getAccessibleName(node)) {
      node.setAttribute('aria-label', title);
      node.setAttribute('data-mtx-tooltip-label', '');
    }
  });
}

/**
 * Instala la delegación global (una vez por documento) y el observador de nombres accesibles.
 */
function install() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  Object.entries(handlers).forEach(([type, handler]) => {
    document.addEventListener(type, handler, type === 'focusin' || type === 'focusout' ? undefined : true);
  });
  const start = () => {
    syncTriggers(document);
    if (typeof MutationObserver === 'undefined' || observer) return;
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const node = mutation.target;
          syncTriggers(node);
          const instance = declarativeTooltips.get(node);
          if (instance) instance.refresh();
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) syncTriggers(node);
        });
        // Disparador retirado del DOM (SPA): su superficie portada a <body> no debe quedar huérfana.
        if (mutation.removedNodes.length && openTooltips.size) {
          Array.from(openTooltips).forEach((instance) => {
            if (!instance.target || !instance.target.isConnected) instance.close({ immediate: true });
          });
        }
      });
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-mtx-tooltip'],
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

/**
 * API global de tooltips (`Materix.tooltip`).
 */
export const tooltip = {
  /**
   * Muestra el tooltip de un disparador al instante.
   *
   * @param {HTMLElement} element Disparador.
   * @param {{touch?: boolean}} [options] Opciones (`touch`).
   * @returns {Tooltip|null} Instancia.
   */
  show(element, options) {
    const instance = getTooltip(element);
    if (instance) instance.open(options);
    return instance;
  },
  /**
   * Oculta el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   */
  hide(element) {
    const instance = getTooltip(element, false);
    if (instance) instance.close();
  },
  /** Oculta todos los tooltips visibles. */
  hideAll() {
    Array.from(openTooltips).forEach((instance) => instance.close({ immediate: true }));
  },
  /**
   * Obtiene (o crea) la instancia del tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   * @returns {Tooltip|null} Instancia.
   */
  get(element) {
    return getTooltip(element);
  },
  /**
   * Fuerza la sincronización de `aria-label` en un contenedor (contenido añadido sin observador).
   *
   * @param {Document|HTMLElement} [root=document] Contenedor.
   */
  sync(root) {
    syncTriggers(root || document);
  },
  /** Instala la delegación global (se hace automáticamente al importar). */
  install,
};

registerComponent('tooltip', Tooltip);
install();
