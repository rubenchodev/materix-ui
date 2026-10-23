import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { uniqueId } from '../../core/id.js';
import { emit as emitEvent } from '../../core/events.js';

const GROUP_SELECTOR = '.mtx-accordion-group, [data-mtx="accordion-group"]';
const ACCORDION_SELECTOR = '.mtx-accordion, [data-mtx="accordion"]';
const ACTIONS_SELECTOR = '.mtx-accordion-actions, [data-mtx="accordion-actions"]';
const DEFAULT_EXPAND_ICON = 'expand_more';
const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * Indica si el usuario pidió reducir las animaciones.
 * @returns {boolean} `true` si se prefiere reducir el movimiento.
 */
function prefersReducedMotion() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Duración automática de Collapse según la altura (fórmula `getAutoHeightDuration` de MUI).
 * @param {number} height Altura a recorrer en px.
 * @returns {number} Duración en ms.
 */
function getAutoHeightDuration(height) {
  if (!height) return 0;
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

/**
 * Indica si el navegador soporta `hidden="until-found"` (búsqueda en página dentro de paneles cerrados).
 * @returns {boolean} `true` si existe el evento `beforematch`.
 */
function supportsUntilFound() {
  return typeof document !== 'undefined' && !!document.body && 'onbeforematch' in document.body;
}

/**
 * Lee un atributo booleano `data-*` (presente y distinto de "false").
 * @param {HTMLElement|null} el Elemento.
 * @param {string} name Nombre del atributo.
 * @returns {boolean|null} Valor, o `null` si el atributo no existe.
 */
function readFlag(el, name) {
  if (!el || !el.hasAttribute(name)) return null;
  return el.getAttribute(name) !== 'false';
}

/**
 * Devuelve el grupo al que pertenece un acordeón (ignora grupos de acordeones anidados exteriores).
 * @param {HTMLElement} el Elemento raíz del acordeón.
 * @returns {HTMLElement|null} Contenedor del grupo o `null`.
 */
function findGroup(el) {
  const parent = el.parentElement;
  if (!parent) return null;
  const group = parent.closest(GROUP_SELECTOR);
  if (!group) return null;
  const outer = parent.closest('.mtx-accordion');
  return outer && group.contains(outer) ? null : group;
}

/**
 * Lista los acordeones que pertenecen directamente a un grupo.
 * @param {HTMLElement} group Contenedor del grupo.
 * @returns {HTMLElement[]} Elementos raíz en orden de documento.
 */
function getGroupItems(group) {
  return Array.from(group.querySelectorAll(ACCORDION_SELECTOR)).filter((el) => findGroup(el) === group);
}

/**
 * Indica si un grupo solo permite un panel abierto (por defecto sí).
 * @param {HTMLElement|null} group Contenedor del grupo.
 * @returns {boolean} `true` si es exclusivo.
 */
function isExclusiveGroup(group) {
  return !!group && group.getAttribute('data-exclusive') !== 'false';
}

/**
 * Acordeón de Materix UI (Accordion + AccordionSummary + AccordionDetails de MUI).
 *
 * Admite tres formas: `<details><summary>` (mejora progresiva), un `<div>` con
 * `data-summary` y la estructura BEM completa.
 *
 * Uso declarativo:
 * ```html
 * <div data-mtx="accordion" data-summary="¿Qué es Materix?">Una librería vanilla.</div>
 * ```
 */
export class Accordion extends ComponentBase {
  /**
   * Crea el acordeón y genera su estructura si falta.
   * @param {HTMLElement} element Raíz (`<div>` o `<details>`).
   */
  constructor(element) {
    super(element);
    this._isDetails = element.tagName === 'DETAILS';
    this._group = findGroup(element);
    this._timer = null;
    this._untilFound = !this._isDetails && supportsUntilFound();
    element.classList.add('mtx-accordion');

    this._applyOptions();
    if (this._isDetails) this._scaffoldDetails();
    else this._scaffoldDiv();
    this._linkAria();

    let expanded = this._readInitialExpanded();
    if (expanded && isExclusiveGroup(this._group) && this._siblings().some((el) => getInstance(el)?.expanded)) {
      expanded = false;
    }
    this._expanded = !expanded;
    this._setState(expanded, { animate: false, emit: false });

    const disabled = readFlag(element, 'data-disabled') === true
      || element.classList.contains('mtx-accordion--disabled')
      || this.summary.disabled === true
      || this.summary.getAttribute('aria-disabled') === 'true';
    this._setDisabled(disabled);

    this._bindEvents();
  }

  /** Traduce los atributos `data-*` (propios o heredados del grupo) a clases. */
  _applyOptions() {
    const el = this.element;
    const group = this._group;
    const pick = (name) => (el.hasAttribute(name) ? el : group && group.hasAttribute(name) ? group : null);

    const variantSource = pick('data-variant');
    if (variantSource && variantSource.getAttribute('data-variant') === 'outlined') {
      el.classList.add('mtx-accordion--outlined');
    }
    if (readFlag(pick('data-square'), 'data-square')) el.classList.add('mtx-accordion--square');
    const summaryStyleSource = pick('data-summary-style');
    if (summaryStyleSource && summaryStyleSource.getAttribute('data-summary-style') === 'plain') {
      el.classList.add('mtx-accordion--plain-summary');
    }
    if (readFlag(pick('data-disable-gutters'), 'data-disable-gutters')) {
      el.classList.add('mtx-accordion--disable-gutters');
    }
    const elevationSource = pick('data-elevation');
    const elevation = elevationSource ? elevationSource.getAttribute('data-elevation') : '';
    if (elevation !== '' && elevation !== null) el.classList.add(`mtx-accordion--elevation-${elevation}`);
  }

  /** Construye cabecera, resumen y región para la forma `<div>`. */
  _scaffoldDiv() {
    const el = this.element;
    let summary = el.querySelector(':scope > .mtx-accordion__summary, :scope > .mtx-accordion__heading > .mtx-accordion__summary');

    if (!summary) {
      summary = document.createElement('button');
      summary.className = 'mtx-accordion__summary';
      const content = document.createElement('span');
      content.className = 'mtx-accordion__summary-content';
      content.textContent = el.getAttribute('data-summary') || '';
      summary.appendChild(content);

      const level = el.getAttribute('data-heading-level') || '3';
      let top = summary;
      if (/^[1-6]$/.test(level)) {
        top = document.createElement(`h${level}`);
        top.className = 'mtx-accordion__heading';
        top.appendChild(summary);
      }
      el.insertBefore(top, el.firstChild);
    }
    if (summary.tagName === 'BUTTON' && !summary.hasAttribute('type')) summary.type = 'button';

    this.summary = summary;
    this.heading = summary.parentElement !== el ? summary.parentElement : null;
    this._ensureSummaryParts();
    this._ensureRegion(this.heading || summary);
  }

  /** Mejora un `<details>` existente: el `<summary>` nativo hace de AccordionSummary. */
  _scaffoldDetails() {
    const el = this.element;
    let summary = el.querySelector(':scope > summary');
    if (!summary) {
      summary = document.createElement('summary');
      const content = document.createElement('span');
      content.className = 'mtx-accordion__summary-content';
      content.textContent = el.getAttribute('data-summary') || '';
      summary.appendChild(content);
      el.insertBefore(summary, el.firstChild);
    }
    summary.classList.add('mtx-accordion__summary');
    this.summary = summary;
    this.heading = null;
    this._ensureSummaryParts();
    this._ensureRegion(summary);
  }

  /** Garantiza el contenedor de texto y el icono de expansión dentro del resumen. */
  _ensureSummaryParts() {
    const summary = this.summary;
    let icon = summary.querySelector(':scope > .mtx-accordion__expand-icon');
    let content = summary.querySelector(':scope > .mtx-accordion__summary-content');

    if (!content) {
      content = document.createElement('span');
      content.className = 'mtx-accordion__summary-content';
      Array.from(summary.childNodes)
        .filter((node) => node !== icon)
        .forEach((node) => content.appendChild(node));
      summary.insertBefore(content, summary.firstChild);
    }

    const iconName = this.element.getAttribute('data-expand-icon');
    if (!icon && iconName !== 'false' && iconName !== 'none') {
      icon = document.createElement('span');
      icon.className = 'mtx-accordion__expand-icon';
      icon.setAttribute('aria-hidden', 'true');
      const glyph = document.createElement('span');
      glyph.className = 'material-icons';
      glyph.textContent = iconName || DEFAULT_EXPAND_ICON;
      icon.appendChild(glyph);
      summary.appendChild(icon);
    } else if (icon && !icon.hasAttribute('aria-hidden')) {
      icon.setAttribute('aria-hidden', 'true');
    }
    this.content = content;
    this.expandIcon = icon || null;
  }

  /**
   * Garantiza la región colapsable con AccordionDetails y AccordionActions.
   * @param {HTMLElement} header Nodo de cabecera que no debe moverse.
   */
  _ensureRegion(header) {
    const el = this.element;
    let region = el.querySelector(':scope > .mtx-accordion__region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'mtx-accordion__region';
      let details = el.querySelector(':scope > .mtx-accordion__details');
      const actions = Array.from(el.children).filter((child) => child.matches(ACTIONS_SELECTOR));
      if (!details) {
        details = document.createElement('div');
        details.className = 'mtx-accordion__details';
        Array.from(el.childNodes)
          .filter((node) => node !== header && !actions.includes(node))
          .forEach((node) => details.appendChild(node));
      }
      region.appendChild(details);
      actions.forEach((node) => region.appendChild(node));
      el.appendChild(region);
    }
    region.querySelectorAll(':scope > [data-mtx="accordion-actions"]').forEach((node) => node.classList.add('mtx-accordion-actions'));
    this.region = region;
    this.details = region.querySelector(':scope > .mtx-accordion__details');
  }

  /** Enlaza resumen y región con `aria-controls` / `aria-labelledby`. */
  _linkAria() {
    const base = this.element.id || uniqueId('mtx-accordion');
    if (!this.summary.id) this.summary.id = `${base}-summary`;
    if (!this.region.id) this.region.id = `${base}-region`;
    this.summary.setAttribute('aria-controls', this.region.id);
    this.region.setAttribute('role', 'region');
    this.region.setAttribute('aria-labelledby', this.summary.id);
  }

  /** @returns {boolean} Estado inicial declarado. */
  _readInitialExpanded() {
    const flag = readFlag(this.element, 'data-expanded');
    if (flag !== null) return flag;
    if (this._isDetails) return this.element.open === true;
    return this.element.classList.contains('mtx-accordion--expanded')
      || this.summary.getAttribute('aria-expanded') === 'true';
  }

  /** Registra los listeners de interacción. */
  _bindEvents() {
    this._handleClick = (event) => {
      if (this._isDetails) event.preventDefault();
      if (this.disabled) {
        event.preventDefault();
        return;
      }
      this._setState(!this._expanded, { animate: true, emit: true });
    };
    this.summary.addEventListener('click', this._handleClick);

    this._handleKeyDown = (event) => this._onKeyDown(event);
    this.summary.addEventListener('keydown', this._handleKeyDown);

    if (readFlag(this.element, 'data-ripple')) {
      this._handlePointerDown = (event) => {
        if (this.disabled || event.button !== 0) return;
        createRipple(this.summary, event);
      };
      this.summary.addEventListener('pointerdown', this._handlePointerDown);
    }

    if (this._isDetails) {
      // Sincroniza aperturas externas (búsqueda en página, `details.open = …`).
      this._handleToggle = () => {
        if (this._timer || this.element.open === this._expanded) return;
        this._setState(this.element.open, { animate: false, emit: true });
      };
      this.element.addEventListener('toggle', this._handleToggle);
    } else {
      this._handleBeforeMatch = () => this._setState(true, { animate: false, emit: true });
      this.region.addEventListener('beforematch', this._handleBeforeMatch);
    }
  }

  /**
   * Navegación WAI-ARIA entre resúmenes de un mismo grupo (flechas, Home, End).
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(event) {
    if (!this._group || !NAV_KEYS.includes(event.key)) return;
    const summaries = getGroupItems(this._group)
      .map((el) => getInstance(el))
      .filter((inst) => inst && inst.summary && !inst.disabled)
      .map((inst) => inst.summary);
    if (summaries.length < 2) return;
    const index = summaries.indexOf(this.summary);
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = summaries.length - 1;
    else if (event.key === 'ArrowDown') next = (index + 1) % summaries.length;
    else next = (index - 1 + summaries.length) % summaries.length;
    event.preventDefault();
    summaries[next].focus();
  }

  /** @returns {HTMLElement[]} Otros acordeones del mismo grupo. */
  _siblings() {
    if (!this._group) return [];
    return getGroupItems(this._group).filter((el) => el !== this.element);
  }

  /**
   * Cambia el estado expandido, anima la región y notifica.
   * @param {boolean} expanded Nuevo estado.
   * @param {{animate: boolean, emit: boolean}} options Opciones.
   */
  _setState(expanded, { animate, emit }) {
    if (expanded === this._expanded) return;
    this._expanded = expanded;
    this.element.classList.toggle('mtx-accordion--expanded', expanded);
    this.summary.setAttribute('aria-expanded', String(expanded));
    this._transition(expanded, animate);

    if (expanded && isExclusiveGroup(this._group)) {
      this._siblings().forEach((el) => {
        const inst = getInstance(el);
        if (inst && inst !== this && inst.expanded) inst._setState(false, { animate, emit });
      });
    }

    if (emit) {
      emitEvent(this.element, 'mtx:accordion:change', { expanded });
    }
  }

  /** @returns {number|null} Duración fija declarada en `data-duration`, o `null` para automática. */
  _fixedDuration() {
    const raw = this.element.getAttribute('data-duration');
    if (raw === null || raw === '' || raw === 'auto') return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  /**
   * Transición de altura (Collapse) de la región.
   * @param {boolean} expanding `true` al expandir.
   * @param {boolean} animate `false` aplica el estado al instante.
   */
  _transition(expanding, animate) {
    const region = this.region;
    clearTimeout(this._timer);
    this._timer = null;

    const fixed = this._fixedDuration();
    if (!animate || prefersReducedMotion() || fixed === 0) {
      this._finish(expanding);
      return;
    }

    const isHidden = this._isDetails ? !this.element.open : region.hasAttribute('hidden');
    const start = isHidden ? 0 : region.getBoundingClientRect().height;
    if (expanding) this._show();
    const end = expanding ? region.scrollHeight : 0;
    const duration = fixed ?? getAutoHeightDuration(Math.abs(end - start));
    if (!duration) {
      this._finish(expanding);
      return;
    }

    region.style.overflow = 'hidden';
    region.style.transition = 'none';
    region.style.height = `${start}px`;
    void region.offsetHeight; // fuerza el reflow antes de animar
    region.style.transition = `height ${duration}ms var(--mtx-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))`;
    region.style.height = `${end}px`;
    this._timer = setTimeout(() => {
      this._timer = null;
      this._finish(expanding);
    }, duration);
  }

  /**
   * Fija el estado final de la región y limpia estilos en línea.
   * @param {boolean} expanded Estado final.
   */
  _finish(expanded) {
    const style = this.region.style;
    style.height = '';
    style.overflow = '';
    style.transition = '';
    if (expanded) this._show();
    else this._hide();
  }

  /** Muestra la región. */
  _show() {
    if (this._isDetails) {
      if (!this.element.open) this.element.open = true;
    } else {
      this.region.removeAttribute('hidden');
    }
  }

  /** Oculta la región (con `until-found` cuando el navegador lo soporta). */
  _hide() {
    if (this._isDetails) {
      if (this.element.open) this.element.open = false;
    } else {
      this.region.setAttribute('hidden', this._untilFound ? 'until-found' : '');
    }
  }

  /**
   * Aplica el estado deshabilitado en raíz y resumen.
   * @param {boolean} disabled Nuevo estado.
   */
  _setDisabled(disabled) {
    this._disabled = disabled;
    this.element.classList.toggle('mtx-accordion--disabled', disabled);
    if (this.summary.tagName === 'BUTTON') {
      this.summary.disabled = disabled;
    } else if (disabled) {
      this.summary.setAttribute('aria-disabled', 'true');
      this.summary.setAttribute('tabindex', '-1');
    } else {
      this.summary.removeAttribute('aria-disabled');
      this.summary.removeAttribute('tabindex');
    }
  }

  /** @returns {boolean} `true` si el panel está expandido. */
  get expanded() {
    return this._expanded;
  }

  /** @param {boolean} value Expande (`true`) o contrae (`false`) con animación. */
  set expanded(value) {
    this._setState(!!value, { animate: true, emit: true });
  }

  /** Expande el panel. */
  expand() {
    this._setState(true, { animate: true, emit: true });
  }

  /** Contrae el panel. */
  collapse() {
    this._setState(false, { animate: true, emit: true });
  }

  /** Alterna el panel. */
  toggle() {
    this._setState(!this._expanded, { animate: true, emit: true });
  }

  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this._disabled === true;
  }

  /** Deshabilita el panel (no se puede alternar). */
  disable() {
    this._setDisabled(true);
  }

  /** Habilita el panel. */
  enable() {
    this._setDisabled(false);
  }

  /** Elimina listeners y temporizadores. */
  destroy() {
    // Destruido a mitad de la animación: fija el estado final para no dejar contenido oculto pero enfocable.
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
      this._finish(this._expanded);
    }
    this.summary.removeEventListener('click', this._handleClick);
    this.summary.removeEventListener('keydown', this._handleKeyDown);
    if (this._handlePointerDown) this.summary.removeEventListener('pointerdown', this._handlePointerDown);
    if (this._handleToggle) this.element.removeEventListener('toggle', this._handleToggle);
    if (this._handleBeforeMatch) this.region.removeEventListener('beforematch', this._handleBeforeMatch);
    super.destroy();
  }
}

/**
 * Grupo de acordeones: por defecto exclusivo (solo un panel abierto) y con
 * navegación por flechas entre resúmenes. `data-exclusive="false"` permite varios.
 */
export class AccordionGroup extends ComponentBase {
  /**
   * Crea el grupo y normaliza el estado inicial si es exclusivo.
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-accordion-group');
    if (this.exclusive) this._normalizeInitial();
  }

  /** Deja abierto solo el primer panel declarado como expandido. */
  _normalizeInitial() {
    let found = false;
    getGroupItems(this.element).forEach((el) => {
      const inst = getInstance(el);
      const open = inst
        ? inst.expanded
        : readFlag(el, 'data-expanded') === true || (el.tagName === 'DETAILS' && el.open)
          || el.classList.contains('mtx-accordion--expanded');
      if (!open) return;
      if (!found) {
        found = true;
        return;
      }
      if (inst) {
        inst._setState(false, { animate: false, emit: false });
      } else {
        el.setAttribute('data-expanded', 'false');
        el.classList.remove('mtx-accordion--expanded');
        if (el.tagName === 'DETAILS') el.open = false;
      }
    });
  }

  /** @returns {boolean} `true` si solo puede haber un panel abierto. */
  get exclusive() {
    return isExclusiveGroup(this.element);
  }

  /** @returns {Accordion[]} Instancias de los acordeones del grupo. */
  get accordions() {
    return getGroupItems(this.element).map((el) => getInstance(el)).filter(Boolean);
  }

  /** Expande todos los paneles (solo en grupos no exclusivos). */
  expandAll() {
    if (this.exclusive) return;
    this.accordions.forEach((acc) => !acc.disabled && acc.expand());
  }

  /** Contrae todos los paneles. */
  collapseAll() {
    this.accordions.forEach((acc) => acc.collapse());
  }
}

/** Barra de acciones al pie del panel (AccordionActions). */
export class AccordionActions extends ComponentBase {
  /**
   * @param {HTMLElement} element Contenedor de acciones.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-accordion-actions');
    if (readFlag(element, 'data-disable-spacing')) element.classList.add('mtx-accordion-actions--disable-spacing');
  }
}

registerComponent('accordion', Accordion);
registerComponent('accordion-group', AccordionGroup);
registerComponent('accordion-actions', AccordionActions);
