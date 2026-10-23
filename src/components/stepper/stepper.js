import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, initElement, getInstance } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit as emitEvent } from '../../core/events.js';

/** Trazados SVG de 24px (iconos CheckCircle y Warning de MUI). */
const CHECK_PATH = 'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z';
const WARNING_PATH = 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z';
const SVG_NS = 'http://www.w3.org/2000/svg';
const ACTIONS = ['next', 'back', 'reset'];

/**
 * Crea un icono SVG de 24px con el trazado indicado.
 * @param {string} path Trazado `d`.
 * @param {string} className Clase del SVG.
 * @returns {SVGElement} Icono decorativo.
 */
function createSvgIcon(path, className) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const shape = document.createElementNS(SVG_NS, 'path');
  shape.setAttribute('d', path);
  svg.appendChild(shape);
  return svg;
}

/**
 * Crea un elemento con clase y texto opcionales.
 * @param {string} tag Etiqueta.
 * @param {string} className Clases.
 * @param {string} [text] Texto.
 * @returns {HTMLElement} Elemento creado.
 */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Interpreta un atributo booleano (`""`/`"true"` → true, `"false"` → false, ausente → null).
 * @param {HTMLElement} node Elemento.
 * @param {string} name Atributo.
 * @returns {boolean|null} Valor interpretado.
 */
function boolAttr(node, name) {
  if (!node.hasAttribute(name)) return null;
  return node.getAttribute(name) !== 'false';
}

/**
 * Resuelve la instancia a la que apunta un disparador declarativo.
 * @param {HTMLElement} trigger Botón con `data-mtx-stepper-action`.
 * @returns {Object|null} Instancia de Stepper o MobileStepper.
 */
function resolveTarget(trigger) {
  const selector = trigger.getAttribute('data-target');
  const host = selector ? document.querySelector(selector) : trigger.closest('.mtx-stepper, .mtx-mobile-stepper');
  return host ? getInstance(host) || null : null;
}

let delegationInstalled = false;

/** Instala una única delegación de clics para `data-mtx-stepper-action`. */
function installDelegation() {
  if (delegationInstalled || typeof document === 'undefined') return;
  delegationInstalled = true;
  // Delegación global intencionada: una sola por documento, sin instancia que la libere.
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest && event.target.closest('[data-mtx-stepper-action]');
    if (!trigger || trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
    const action = trigger.getAttribute('data-mtx-stepper-action');
    const instance = resolveTarget(trigger);
    if (!instance || !ACTIONS.includes(action) || typeof instance[action] !== 'function') return;
    event.preventDefault();
    instance[action]();
  });
}

/**
 * Lógica común de navegación: índice activo, evento cancelable y disparadores.
 */
class StepperBase extends ComponentBase {
  /**
   * Número de posiciones navegables (pasos).
   * @returns {number} Total de pasos.
   */
  get length() {
    return 0;
  }

  /** @returns {number} Índice del paso activo (igual a `length` al terminar). */
  get activeStep() {
    return this._active;
  }

  /** @param {number} index Nuevo índice activo. */
  set activeStep(index) {
    this.goTo(index);
  }

  /**
   * Indica si un paso no puede activarse.
   * @param {number} index Índice.
   * @returns {boolean} `true` si está deshabilitado.
   */
  _isDisabled(index) { // eslint-disable-line no-unused-vars
    return false;
  }

  /**
   * Índice máximo alcanzable.
   * @returns {number} Límite superior.
   */
  _maxIndex() {
    return this.length;
  }

  /**
   * Activa un paso emitiendo `mtx:stepper:change` (cancelable).
   * @param {number} index Índice destino.
   * @param {{emit?: boolean}} [options] Opciones.
   * @returns {boolean} `true` si el paso activo cambió.
   */
  goTo(index, { emit = true } = {}) {
    const target = Math.round(Number(index));
    if (!Number.isFinite(target) || target < 0 || target > this._maxIndex()) return false;
    if (target === this._active || (target < this.length && this._isDisabled(target))) return false;
    const previousStep = this._active;
    if (emit) {
      const allowed = emitEvent(this.element, 'mtx:stepper:change', {
        activeStep: target,
        previousStep,
      }, { cancelable: true });
      if (!allowed) return false;
    }
    this._active = target;
    this.element.setAttribute('data-active-step', String(target));
    this._render();
    return true;
  }

  /**
   * Avanza al siguiente paso habilitado.
   * @returns {boolean} `true` si avanzó.
   */
  next() {
    let index = this._active + 1;
    while (index < this.length && this._isDisabled(index)) index += 1;
    return this.goTo(index);
  }

  /**
   * Retrocede al paso habilitado anterior.
   * @returns {boolean} `true` si retrocedió.
   */
  back() {
    let index = this._active - 1;
    while (index > 0 && this._isDisabled(index)) index -= 1;
    return this.goTo(index);
  }

  /**
   * Sincroniza los disparadores declarativos (`back` deshabilitado en el primer paso, `next` en el último índice alcanzable).
   */
  _syncTriggers() {
    const triggers = Array.from(document.querySelectorAll('[data-mtx-stepper-action]'))
      .filter((node) => (node.hasAttribute('data-target') || this.element.contains(node)) && resolveTarget(node) === this);
    triggers.forEach((trigger) => {
      if (trigger.hasAttribute('data-keep-enabled')) return;
      const action = trigger.getAttribute('data-mtx-stepper-action');
      let disabled = false;
      if (action === 'back') disabled = this._active <= 0;
      if (action === 'next') disabled = this._active >= this._maxIndex();
      if (action === 'back' || action === 'next') trigger.disabled = disabled;
    });
  }

  /** Repinta el estado (lo implementa cada componente). */
  _render() {}
}

/**
 * Stepper de Materix UI (patrón `Stepper` de MUI): horizontal, vertical,
 * etiqueta alternativa y modo no lineal con pasos clicables.
 *
 * Uso declarativo:
 * ```html
 * <ol data-mtx="stepper" data-active-step="1">
 *   <li data-label="Email"></li>
 *   <li data-label="Código" data-optional></li>
 *   <li data-label="Contraseña"></li>
 * </ol>
 * ```
 */
export class Stepper extends StepperBase {
  /**
   * Crea una instancia del stepper.
   * @param {HTMLElement} element Elemento `<ol>` raíz.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-stepper');
    this.orientation = element.getAttribute('data-orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.alternativeLabel = this.orientation === 'horizontal' && boolAttr(element, 'data-alternative-label') === true;
    this.nonLinear = boolAttr(element, 'data-non-linear') === true;

    element.classList.add(`mtx-stepper--${this.orientation}`);
    element.classList.toggle('mtx-stepper--alternative-label', this.alternativeLabel);
    element.classList.toggle('mtx-stepper--non-linear', this.nonLinear);
    if (element.tagName !== 'OL' && element.tagName !== 'UL' && !element.hasAttribute('role')) {
      element.setAttribute('role', 'list');
    }
    if (element.hasAttribute('data-label') && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', element.getAttribute('data-label'));
    }

    /** @type {Array<{completed: boolean|null, error: string|false, disabled: boolean}>} */
    this._state = [];
    this.refresh({ render: false });

    const initial = parseInt(element.getAttribute('data-active-step') || '0', 10);
    this._active = Number.isFinite(initial) ? Math.min(Math.max(initial, 0), this.length) : 0;

    this._handleClick = (event) => {
      const button = event.target.closest('.mtx-step-button');
      if (!button || !this.element.contains(button) || button.disabled) return;
      const index = this.steps.indexOf(button.closest('.mtx-step'));
      if (index >= 0) this.goTo(index);
    };
    this._handlePointerDown = (event) => {
      const button = event.target.closest('.mtx-step-button');
      if (!button || button.disabled || event.button !== 0) return;
      createRipple(button, event);
    };
    this._handleLocaleChange = () => this._render();
    element.addEventListener('click', this._handleClick);
    element.addEventListener('pointerdown', this._handlePointerDown);
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);
    installDelegation();
    this._render();
  }

  /** @returns {number} Número de pasos. */
  get length() {
    return this.steps.length;
  }

  /**
   * Vuelve a leer los `<li>` (pasos añadidos o quitados dinámicamente) y su estado `data-*`.
   * @param {{render?: boolean}} [options] Opciones.
   */
  refresh({ render = true } = {}) {
    this.steps = Array.from(this.element.children).filter((node) => node.tagName === 'LI' || node.classList.contains('mtx-step'));
    this._state = this.steps.map((step) => {
      const error = step.getAttribute('data-error');
      return {
        completed: boolAttr(step, 'data-completed'),
        error: error === null || error === 'false' ? false : error,
        disabled: boolAttr(step, 'data-disabled') === true,
      };
    });
    this.steps.forEach((step, index) => this._scaffold(step, index));
    if (render) {
      this._active = Math.min(this._active, this.length);
      this._render();
    }
  }

  /**
   * Construye (o reutiliza en BEM manual) la anatomía de un paso.
   * @param {HTMLElement} step Elemento `<li>`.
   * @param {number} index Índice.
   */
  _scaffold(step, index) {
    step.classList.add('mtx-step');
    if (step.tagName !== 'LI' && !step.hasAttribute('role')) step.setAttribute('role', 'listitem');

    let container = step.querySelector(':scope > .mtx-step__label-container');
    if (!container) {
      const ownNodes = Array.from(step.childNodes).filter((node) => !(node.nodeType === 1 && node.classList.contains('mtx-step-connector')));
      const hasElements = ownNodes.some((node) => node.nodeType === 1 && !node.classList.contains('mtx-step__content'));
      let label = step.getAttribute('data-label');
      if (label === null && !hasElements) {
        label = step.textContent.trim();
        ownNodes.forEach((node) => { if (node.nodeType === 3) node.remove(); });
      }
      const contentNodes = Array.from(step.childNodes).filter((node) => (
        !(node.nodeType === 1 && (node.classList.contains('mtx-step-connector') || node.classList.contains('mtx-step__content')))
        && !(node.nodeType === 3 && !node.textContent.trim())
      ));
      container = el('span', 'mtx-step__label-container');
      container.appendChild(el('span', 'mtx-step__label', label || ''));
      if (contentNodes.length && !step.querySelector(':scope > .mtx-step__content')) {
        const content = el('div', 'mtx-step__content');
        const inner = el('div', 'mtx-step__content-inner');
        contentNodes.forEach((node) => inner.appendChild(node));
        content.appendChild(inner);
        step.appendChild(content);
      }
      step.insertBefore(container, step.querySelector(':scope > .mtx-step__content'));
    }

    if (this.nonLinear && container.tagName !== 'BUTTON') {
      const button = el('button', container.className);
      button.type = 'button';
      while (container.firstChild) button.appendChild(container.firstChild);
      container.replaceWith(button);
      container = button;
    }
    if (container.tagName === 'BUTTON') container.classList.add('mtx-step-button');

    let label = container.querySelector('.mtx-step__label');
    if (!label) {
      label = el('span', 'mtx-step__label', step.getAttribute('data-label') || '');
      container.appendChild(label);
    }
    let text = container.querySelector('.mtx-step__label-text');
    if (!text) {
      text = el('span', 'mtx-step__label-text');
      label.replaceWith(text);
      text.appendChild(label);
    }
    if (!container.querySelector('.mtx-step__icon-container')) {
      container.insertBefore(el('span', 'mtx-step__icon-container'), container.firstChild);
    }
    if (!text.querySelector('.mtx-step__sr-prefix')) {
      text.insertBefore(el('span', 'mtx-step__sr mtx-step__sr-prefix'), text.firstChild);
    }
    if (!text.querySelector('.mtx-step__sr-status')) {
      text.appendChild(el('span', 'mtx-step__sr mtx-step__sr-status'));
    }

    const content = step.querySelector(':scope > .mtx-step__content');
    if (content && !content.querySelector(':scope > .mtx-step__content-inner')) {
      const inner = el('div', 'mtx-step__content-inner');
      while (content.firstChild) inner.appendChild(content.firstChild);
      content.appendChild(inner);
    }

    let connector = step.querySelector(':scope > .mtx-step-connector');
    if (index > 0 && !connector) {
      connector = el('span', 'mtx-step-connector');
      connector.appendChild(el('span', 'mtx-step-connector__line'));
      step.insertBefore(connector, step.firstChild);
    } else if (index === 0 && connector) {
      connector.remove();
    }
    if (connector) connector.setAttribute('aria-hidden', 'true');
  }

  /**
   * Indica si un paso está deshabilitado (en modo no lineal solo por `data-disabled`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si no puede activarse.
   */
  _isDisabled(index) {
    const state = this._state[index];
    return Boolean(state && state.disabled);
  }

  /**
   * Indica si un paso está completado (en modo lineal, los anteriores al activo lo están salvo `data-completed="false"`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si está completado.
   */
  isCompleted(index) {
    const state = this._state[index];
    if (!state) return false;
    if (state.completed !== null) return state.completed;
    return !this.nonLinear && index < this._active;
  }

  /**
   * Marca o desmarca un paso como completado.
   * @param {number} index Índice.
   * @param {boolean} [completed=true] Estado.
   * @returns {this} La instancia.
   */
  setCompleted(index, completed = true) {
    const state = this._state[index];
    if (!state) return this;
    state.completed = Boolean(completed);
    this.steps[index].setAttribute('data-completed', String(state.completed));
    this._render();
    return this;
  }

  /**
   * Activa o quita el estado de error de un paso.
   * @param {number} index Índice.
   * @param {string|boolean} message Mensaje visible, `true` (sin mensaje) o `false` para limpiar.
   * @returns {this} La instancia.
   */
  setError(index, message) {
    const state = this._state[index];
    if (!state) return this;
    if (message === false || message === null || message === undefined) {
      state.error = false;
      this.steps[index].removeAttribute('data-error');
    } else {
      state.error = message === true ? '' : String(message);
      this.steps[index].setAttribute('data-error', state.error);
    }
    this._render();
    return this;
  }

  /**
   * Habilita o deshabilita un paso.
   * @param {number} index Índice.
   * @param {boolean} [disabled=true] Estado.
   * @returns {this} La instancia.
   */
  setDisabled(index, disabled = true) {
    const state = this._state[index];
    if (!state) return this;
    state.disabled = Boolean(disabled);
    this.steps[index].toggleAttribute('data-disabled', state.disabled);
    this._render();
    return this;
  }

  /**
   * Vuelve al primer paso y limpia completados y errores definidos por API o atributos.
   * @returns {boolean} `true` si se aplicó (el evento no fue cancelado).
   */
  reset() {
    if (this._active !== 0) {
      const allowed = emitEvent(this.element, 'mtx:stepper:change', {
        activeStep: 0,
        previousStep: this._active,
        reset: true,
      }, { cancelable: true });
      if (!allowed) return false;
    }
    this._state.forEach((state, index) => {
      state.completed = null;
      state.error = false;
      this.steps[index].removeAttribute('data-completed');
      this.steps[index].removeAttribute('data-error');
    });
    this._active = 0;
    this.element.setAttribute('data-active-step', '0');
    this._render();
    return true;
  }

  /** @returns {boolean} `true` si todos los pasos se han superado (`activeStep === length`). */
  get finished() {
    return this._active >= this.length;
  }

  /** Aplica clases, iconos, textos accesibles, paneles y disparadores. */
  _render() {
    const locale = getComponentLocale(this.element);
    const total = this.length;
    this.element.classList.toggle('mtx-stepper--finished', this.finished);

    this.steps.forEach((step, index) => {
      const state = this._state[index];
      const active = index === this._active;
      const completed = this.isCompleted(index);
      const hasError = state.error !== false;
      const disabled = state.disabled || (!this.nonLinear && index > this._active);
      step.classList.toggle('mtx-step--active', active);
      step.classList.toggle('mtx-step--completed', completed);
      step.classList.toggle('mtx-step--error', hasError);
      step.classList.toggle('mtx-step--disabled', disabled);
      step.classList.toggle('mtx-step--last', index === total - 1);
      const expanded = active || boolAttr(step, 'data-expanded') === true;
      step.classList.toggle('mtx-step--expanded', expanded);

      const container = step.querySelector(':scope > .mtx-step__label-container');
      const current = container.tagName === 'BUTTON' ? container : step;
      [step, container].forEach((node) => node.removeAttribute('aria-current'));
      if (active) current.setAttribute('aria-current', 'step');
      if (container.tagName === 'BUTTON') container.disabled = state.disabled;

      this._renderIcon(container.querySelector('.mtx-step__icon-container'), step, index, completed, hasError, active);
      this._renderCaption(container.querySelector('.mtx-step__label-text'), step, state, locale);

      container.querySelector('.mtx-step__sr-prefix').textContent = `${t('stepper', 'step', { n: index + 1, total }, null, locale)}: `;
      const status = [];
      if (completed) status.push(t('stepper', 'completed', null, null, locale));
      if (hasError && !state.error) status.push(t('stepper', 'error', null, null, locale));
      container.querySelector('.mtx-step__sr-status').textContent = status.length ? `, ${status.join(', ')}` : '';

      const content = step.querySelector(':scope > .mtx-step__content');
      if (content) {
        const visible = this.orientation === 'vertical' && expanded;
        content.setAttribute('aria-hidden', String(!visible));
        content.toggleAttribute('inert', !visible);
      }
      const panel = this._panel(step.getAttribute('data-panel'));
      if (panel) panel.hidden = !active;
    });

    const finishedPanel = this._panel(this.element.getAttribute('data-finished-panel'));
    if (finishedPanel) finishedPanel.hidden = !this.finished;
    this._syncTriggers();
  }

  /**
   * Pinta el StepIcon: número, check, aviso o icono personalizado.
   * @param {HTMLElement} holder Contenedor del icono.
   * @param {HTMLElement} step Paso.
   * @param {number} index Índice.
   * @param {boolean} completed Completado.
   * @param {boolean} hasError En error.
   * @param {boolean} active Activo.
   */
  _renderIcon(holder, step, index, completed, hasError, active) {
    const custom = step.getAttribute('data-icon');
    const kind = hasError ? 'error' : completed ? 'completed' : custom ? `icon:${custom}` : `n:${index + 1}`;
    holder.setAttribute('aria-hidden', 'true');
    const existing = holder.querySelector('.mtx-step-icon');
    if (existing && existing.getAttribute('data-kind') === kind) {
      existing.classList.toggle('mtx-step-icon--active', active);
      return;
    }
    holder.textContent = '';
    let icon;
    if (hasError) {
      icon = createSvgIcon(WARNING_PATH, 'mtx-step-icon mtx-step-icon--error');
    } else if (completed) {
      icon = createSvgIcon(CHECK_PATH, 'mtx-step-icon mtx-step-icon--completed');
    } else if (custom) {
      icon = el('span', 'mtx-step-icon mtx-step-icon--custom material-icons', custom);
    } else {
      icon = el('span', 'mtx-step-icon mtx-step-icon--number', String(index + 1));
    }
    icon.setAttribute('data-kind', kind);
    if (active) icon.classList.add('mtx-step-icon--active');
    holder.appendChild(icon);
  }

  /**
   * Pinta el caption opcional o el mensaje de error bajo la etiqueta.
   * @param {HTMLElement} text Contenedor de textos.
   * @param {HTMLElement} step Paso.
   * @param {{error: string|false}} state Estado.
   * @param {string} locale Idioma.
   */
  _renderCaption(text, step, state, locale) {
    let caption = text.querySelector('.mtx-step__optional');
    const optional = step.getAttribute('data-optional');
    let value = null;
    if (state.error) value = state.error;
    else if (optional !== null && optional !== 'false') value = optional || t('stepper', 'optional', null, null, locale);
    if (value === null) {
      if (caption && caption.hasAttribute('data-generated')) caption.remove();
      return;
    }
    if (!caption) {
      caption = el('span', 'mtx-step__optional');
      caption.setAttribute('data-generated', '');
      text.insertBefore(caption, text.querySelector('.mtx-step__sr-status'));
    }
    if (caption.hasAttribute('data-generated')) caption.textContent = value;
  }

  /**
   * Busca un panel asociado por selector.
   * @param {string|null} selector Selector CSS.
   * @returns {HTMLElement|null} Panel.
   */
  _panel(selector) {
    if (!selector) return null;
    try {
      return document.querySelector(selector);
    } catch (error) {
      return null;
    }
  }

  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener('click', this._handleClick);
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    super.destroy();
  }
}

/**
 * MobileStepper de Materix UI (patrón `MobileStepper` de MUI): progreso compacto
 * con botones Atrás/Siguiente y variantes `dots`, `text` o `progress`.
 *
 * ```html
 * <div data-mtx="mobile-stepper" data-steps="5" data-variant="dots"></div>
 * ```
 */
export class MobileStepper extends StepperBase {
  /**
   * Crea una instancia del stepper móvil.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-mobile-stepper');
    const variant = element.getAttribute('data-variant');
    this.variant = ['dots', 'text', 'progress'].includes(variant) ? variant : 'dots';
    const position = element.getAttribute('data-position');
    this.position = ['bottom', 'top', 'static'].includes(position) ? position : 'static';
    element.classList.add(`mtx-mobile-stepper--${this.variant}`, `mtx-mobile-stepper--${this.position}`);

    const steps = parseInt(element.getAttribute('data-steps') || '0', 10);
    this._steps = Number.isFinite(steps) && steps > 0 ? steps : 1;
    const initial = parseInt(element.getAttribute('data-active-step') || '0', 10);
    this._active = Number.isFinite(initial) ? Math.min(Math.max(initial, 0), this._steps - 1) : 0;

    this._build();
    this._handleClick = (event) => {
      const button = event.target.closest('.mtx-mobile-stepper__back, .mtx-mobile-stepper__next');
      if (!button || button.disabled) return;
      if (button.classList.contains('mtx-mobile-stepper__back')) this.back();
      else this.next();
    };
    this._handleLocaleChange = () => this._render();
    element.addEventListener('click', this._handleClick);
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);
    installDelegation();
    this._render();
  }

  /** @returns {number} Total de pasos. */
  get length() {
    return this._steps;
  }

  /** @returns {number} Total de pasos. */
  get steps() {
    return this._steps;
  }

  /**
   * Cambia el número total de pasos.
   * @param {number} count Nuevo total (≥ 1).
   * @returns {this} La instancia.
   */
  setSteps(count) {
    const next = Math.max(1, Math.round(Number(count)) || 1);
    this._steps = next;
    this.element.setAttribute('data-steps', String(next));
    this._active = Math.min(this._active, next - 1);
    this._buildIndicator();
    this._render();
    return this;
  }

  /** @returns {number} El último índice (el stepper móvil no tiene estado "terminado"). */
  _maxIndex() {
    return this._steps - 1;
  }

  /**
   * Vuelve al primer paso.
   * @returns {boolean} `true` si cambió.
   */
  reset() {
    return this.goTo(0);
  }

  /** Crea botones, indicador y región de estado accesible (o reutiliza los BEM existentes). */
  _build() {
    const { element } = this;
    this.backButton = element.querySelector('.mtx-mobile-stepper__back') || this._createButton('back');
    this.nextButton = element.querySelector('.mtx-mobile-stepper__next') || this._createButton('next');
    if (!this.backButton.parentNode) element.insertBefore(this.backButton, element.firstChild);
    this.indicator = element.querySelector('.mtx-mobile-stepper__indicator');
    if (!this.indicator) {
      this.indicator = el('div', 'mtx-mobile-stepper__indicator');
      this.backButton.after(this.indicator);
    }
    if (!this.nextButton.parentNode) element.appendChild(this.nextButton);
    this.status = element.querySelector('.mtx-mobile-stepper__status');
    if (!this.status) {
      this.status = el('span', 'mtx-mobile-stepper__status');
      this.status.setAttribute('aria-live', 'polite');
      element.appendChild(this.status);
    }
    this._buildIndicator();
  }

  /**
   * Crea un botón de texto con chevron.
   * @param {'back'|'next'} kind Tipo.
   * @returns {HTMLButtonElement} Botón.
   */
  _createButton(kind) {
    const button = el('button', `mtx-button mtx-button--text mtx-button--small mtx-mobile-stepper__${kind}`);
    button.type = 'button';
    button.setAttribute('data-mtx', 'button');
    const icon = el('span', 'mtx-button__icon material-icons', kind === 'back' ? 'keyboard_arrow_left' : 'keyboard_arrow_right');
    icon.setAttribute('aria-hidden', 'true');
    const label = el('span', 'mtx-mobile-stepper__button-label');
    if (kind === 'back') button.append(icon, label);
    else button.append(label, icon);
    initElement(button);
    return button;
  }

  /** Genera el contenido del indicador según la variante. */
  _buildIndicator() {
    const { indicator } = this;
    indicator.setAttribute('aria-hidden', 'true');
    if (this.variant === 'dots') {
      if (indicator.children.length === this._steps) return;
      indicator.textContent = '';
      for (let index = 0; index < this._steps; index += 1) {
        indicator.appendChild(el('span', 'mtx-mobile-stepper__dot'));
      }
    } else if (this.variant === 'progress') {
      if (indicator.querySelector('.mtx-mobile-stepper__progress')) return;
      const bar = el('div', 'mtx-mobile-stepper__progress');
      bar.setAttribute('data-mtx', 'linear-progress');
      bar.setAttribute('data-value', '0');
      bar.setAttribute('data-decorative', '');
      indicator.appendChild(bar);
      initElement(bar);
    }
  }

  /** Actualiza indicador, botones y textos. */
  _render() {
    const locale = getComponentLocale(this.element);
    const total = this._steps;
    const current = this._active;
    this.backButton.disabled = current <= 0;
    this.nextButton.disabled = current >= total - 1;
    const backLabel = this.backButton.querySelector('.mtx-mobile-stepper__button-label');
    const nextLabel = this.nextButton.querySelector('.mtx-mobile-stepper__button-label');
    if (backLabel) backLabel.textContent = this.element.getAttribute('data-back-label') || t('stepper', 'back', null, null, locale);
    if (nextLabel) nextLabel.textContent = this.element.getAttribute('data-next-label') || t('stepper', 'next', null, null, locale);

    if (this.variant === 'dots') {
      Array.from(this.indicator.children).forEach((dot, index) => {
        dot.classList.toggle('mtx-mobile-stepper__dot--active', index === current);
      });
    } else if (this.variant === 'text') {
      this.indicator.textContent = t('stepper', 'fraction', { n: current + 1, total }, null, locale);
    } else {
      const bar = this.indicator.querySelector('.mtx-mobile-stepper__progress');
      const value = total > 1 ? (current / (total - 1)) * 100 : 100;
      const instance = bar ? getInstance(bar) : null;
      if (instance && typeof instance.setValue === 'function') instance.setValue(value);
      else if (bar) bar.style.setProperty('--mtx-mobile-stepper-value', `${value}%`);
    }
    this.status.textContent = t('stepper', 'step', { n: current + 1, total }, null, locale);
    this._syncTriggers();
  }

  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

registerComponent('stepper', Stepper);
registerComponent('mobile-stepper', MobileStepper);
