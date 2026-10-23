import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance } from '../../core/registry.js';
import { addModal, removeModal, isTopModal } from '../../core/modal-manager.js';
import { pushLayer, removeLayer, isInUpperLayer } from '../../core/layers.js';
import { focusFirst, getFocusable, trapTab } from '../../core/focus-manager.js';
import { uniqueId } from '../../core/id.js';
import { emit } from '../../core/events.js';

const ACTIONS_SELECTOR = '.mtx-dialog__actions, [data-mtx="dialog-actions"]';
const ACTIONS_ALIGNMENTS = ['start', 'center', 'end', 'between'];

/**
 * Aplica alineación y espaciado a un contenedor de acciones del diálogo (idempotente).
 *
 * @param {HTMLElement} actions Contenedor `.mtx-dialog__actions`.
 * @param {string|null} [fallbackAlign] Alineación heredada del diálogo (`data-actions-align`).
 * @returns {string} Alineación efectiva.
 */
export function applyDialogActionsOptions(actions, fallbackAlign = null) {
  actions.classList.add('mtx-dialog__actions');
  const own = actions.getAttribute('data-align');
  const fromClass = ACTIONS_ALIGNMENTS.find((value) => actions.classList.contains(`mtx-dialog__actions--${value}`));
  const align = [own, fromClass, fallbackAlign].find((value) => ACTIONS_ALIGNMENTS.includes(value)) || 'end';
  ACTIONS_ALIGNMENTS.forEach((value) => {
    actions.classList.toggle(`mtx-dialog__actions--${value}`, value === align && value !== 'end');
  });
  const spacing = actions.getAttribute('data-disable-spacing');
  if (spacing !== null && spacing !== 'false') actions.classList.add('mtx-dialog__actions--disable-spacing');
  return align;
}

/**
 * Representa un diálogo (modal) de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-dialog" id="mi-dialog" data-mtx="dialog" aria-labelledby="titulo">
 *   <div class="mtx-dialog__backdrop" data-mtx-dialog-close></div>
 *   <div class="mtx-dialog__paper" role="dialog" aria-modal="true">
 *     <h2 class="mtx-dialog__title" id="titulo">Título</h2>
 *     <div class="mtx-dialog__content">Contenido</div>
 *     <div class="mtx-dialog__actions">
 *       <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-dialog-close>Cancelar</button>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * Sintaxis simplificada: `data-title` genera el título (con `id` y `aria-labelledby`),
 * `data-description` genera `.mtx-dialog__content-text` (con `aria-describedby`) y los hijos
 * `.mtx-dialog__actions` (o `data-mtx="dialog-actions"`) se colocan tras el contenido.
 * `data-actions-align` fija la alineación de las acciones que no declaren `data-align`.
 *
 * Los elementos con `data-mtx-dialog-close` cierran el diálogo al hacer clic.
 */
export class Dialog extends ComponentBase {
  /**
   * Crea una instancia del diálogo.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-dialog')) {
      element.classList.add('mtx-dialog');
    }

    let paper = element.querySelector('.mtx-dialog__paper');
    if (!paper) {
      paper = this._scaffold(element);
    }
    this.paper = paper;
    this.paper.setAttribute('role', this.paper.getAttribute('role') || 'dialog');
    this.paper.setAttribute('aria-modal', 'true');
    this.paper.tabIndex = this.paper.hasAttribute('tabindex') ? this.paper.tabIndex : -1;
    ['aria-labelledby', 'aria-describedby', 'aria-label'].forEach((name) => {
      if (element.hasAttribute(name) && !this.paper.hasAttribute(name)) {
        this.paper.setAttribute(name, element.getAttribute(name));
      }
    });
    this._linkAria();
    this._applyActionsAlign();
    this.scroll = element.getAttribute('data-scroll') || 'paper';
    element.classList.add(`mtx-dialog--scroll-${this.scroll}`);
    this._previousFocus = null;
    this._handleKeydown = (event) => this._onKeydown(event);
    this._handleCloseClick = (event) => {
      const closeTarget = event.target.closest('[data-mtx-dialog-close]');
      if (!closeTarget) return;
      const isBackdrop = closeTarget.classList.contains('mtx-dialog__backdrop');
      if (isBackdrop && element.hasAttribute('data-disable-backdrop-close')) return;
      this.close(isBackdrop ? 'backdropClick' : 'closeButtonClick');
    };
    this._handleFocusIn = (event) => {
      if (this.isOpen && isTopModal(this.element) && !this.paper.contains(event.target)
        && !isInUpperLayer(this, event.target)) {
        focusFirst(this.paper, this.element.querySelector('[data-dialog-autofocus]'));
      }
    };
    element.addEventListener('click', this._handleCloseClick);
    this.listen(document, 'keydown', this._handleKeydown);
    this.listen(document, 'focusin', this._handleFocusIn);
  }

  /**
   * Auto-construye backdrop, panel, título, contenido y acciones desde la sintaxis simplificada.
   *
   * @param {HTMLElement} element Contenedor del diálogo.
   * @returns {HTMLElement} Panel creado.
   */
  _scaffold(element) {
    let backdrop = element.querySelector(':scope > .mtx-dialog__backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mtx-dialog__backdrop';
      backdrop.setAttribute('data-mtx-dialog-close', '');
      element.appendChild(backdrop);
    }

    const paper = document.createElement('div');
    paper.className = 'mtx-dialog__paper';
    paper.setAttribute('role', 'dialog');
    paper.setAttribute('aria-modal', 'true');

    const children = Array.from(element.childNodes).filter((node) => node !== backdrop);
    const isPart = (node, cls) => node.nodeType === 1 && node.classList.contains(cls);
    let title = children.find((node) => isPart(node, 'mtx-dialog__title')) || null;
    const actions = children.filter((node) => node.nodeType === 1 && node.matches(ACTIONS_SELECTOR));
    let content = children.find((node) => isPart(node, 'mtx-dialog__content')) || null;

    const dataTitle = element.getAttribute('data-title');
    if (!title && dataTitle) {
      title = document.createElement('h2');
      title.className = 'mtx-dialog__title';
      title.textContent = dataTitle;
    }
    if (title) paper.appendChild(title);

    if (!content) {
      content = document.createElement('div');
      content.className = 'mtx-dialog__content';
      // Solo el resto de hijos va al contenido: título y acciones conservan su sitio.
      children
        .filter((node) => node !== title && !actions.includes(node))
        .forEach((node) => content.appendChild(node));
    }
    const description = element.getAttribute('data-description');
    if (description && !content.querySelector('.mtx-dialog__content-text')) {
      const text = document.createElement('p');
      text.className = 'mtx-dialog__content-text';
      text.textContent = description;
      content.insertBefore(text, content.firstChild);
    }
    paper.appendChild(content);
    actions.forEach((node) => paper.appendChild(node));

    element.appendChild(paper);
    return paper;
  }

  /**
   * Da nombre y descripción accesibles al panel: enlaza `aria-labelledby` con el título y
   * `aria-describedby` con `.mtx-dialog__content-text`, generando ids cuando falten.
   */
  _linkAria() {
    const baseId = this.element.id || uniqueId('mtx-dialog');
    const hasName = this.paper.hasAttribute('aria-labelledby') || this.paper.hasAttribute('aria-label');
    const title = this.paper.querySelector('.mtx-dialog__title');
    if (title && !hasName) {
      if (!title.id) title.id = `${baseId}-title`;
      this.paper.setAttribute('aria-labelledby', title.id);
    }
    const text = this.paper.querySelector('.mtx-dialog__content-text');
    if (text && !this.paper.hasAttribute('aria-describedby')) {
      if (!text.id) text.id = `${baseId}-description`;
      this.paper.setAttribute('aria-describedby', text.id);
    }
  }

  /**
   * Propaga `data-actions-align` del diálogo a sus contenedores de acciones sin alineación propia.
   */
  _applyActionsAlign() {
    const align = this.element.getAttribute('data-actions-align');
    this.paper.querySelectorAll(ACTIONS_SELECTOR).forEach((actions) => {
      if (actions.closest('.mtx-dialog__paper') !== this.paper) return;
      applyDialogActionsOptions(actions, align);
    });
  }

  /**
   * Indica si el diálogo está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains('mtx-dialog--open');
  }

  /**
   * Abre el diálogo, gestiona el foco y bloquea el scroll.
   */
  open() {
    if (this.isOpen) return;
    this._previousFocus = this._resolveReturnFocus();
    this._openTrigger = null;
    this.element.classList.add('mtx-dialog--open');
    addModal(this.element);
    pushLayer(this, {
      kind: 'modal',
      nodes: this.element,
      // Abierto desde otra capa (p. ej. un Popover portado): queda por encima de ella.
      stack: [{ node: this.element }],
      onEscape: () => {
        if (!this.element.hasAttribute('data-disable-escape')) this.close('escapeKeyDown');
      },
    });
    this._focusFirst();
    emit(this.element, 'mtx:dialog:open');
  }

  /**
   * Destino del foco al cerrar. Un clic en WebKit no enfoca el botón (el foco queda en
   * body o en un ancestro con tabindex="-1"): entonces se usa el disparador pulsado.
   *
   * @returns {HTMLElement|null} Elemento al que devolver el foco.
   */
  _resolveReturnFocus() {
    const active = document.activeElement;
    if (active && active !== document.body && active.tabIndex >= 0 && !this.element.contains(active)) {
      return active;
    }
    return this._openTrigger && this._openTrigger.isConnected ? this._openTrigger : active;
  }

  /**
   * Cierra el diálogo y restaura el foco.
   *
   * @param {string} [reason='programmatic'] Motivo de cierre.
   */
  close(reason = 'programmatic') {
    if (!this.isOpen) return;
    this.element.classList.remove('mtx-dialog--open');
    removeModal(this.element);
    removeLayer(this);
    if (this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus) {
      this._previousFocus.focus();
    }
    emit(this.element, 'mtx:dialog:close', { reason });
  }

  /**
   * Enfoca el primer elemento enfocable del panel, o el marcado con
   * `data-dialog-autofocus` si existe.
   */
  _focusFirst() {
    focusFirst(this.paper, this.element.querySelector('[data-dialog-autofocus]'));
  }

  /**
   * Gestiona Tab para mantener el foco dentro (Escape lo entrega la pila de capas).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeydown(event) {
    if (!this.isOpen || !isTopModal(this.element)) return;
    // Foco en una capa abierta desde el diálogo (popover, menú): esa capa gestiona Tab.
    if (isInUpperLayer(this, document.activeElement)) return;

    if (event.key === 'Tab') {
      this._trapFocus(event);
    }
  }

  /**
   * Mantiene el foco dentro del diálogo (focus trap).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _trapFocus(event) {
    trapTab(event, this.paper);
  }

  /**
   * Obtiene los elementos enfocables dentro del panel.
   *
   * @returns {HTMLElement[]} Elementos enfocables.
   */
  _getFocusable() {
    return getFocusable(this.paper);
  }

  /**
   * Cierra el diálogo si está abierto, libera sus listeners y lo desvincula del registro.
   */
  destroy() {
    if (this.isOpen) this.close();
    this.element.removeEventListener('click', this._handleCloseClick);
    super.destroy();
  }
}

/**
 * Contenedor de acciones del diálogo (MUI DialogActions).
 *
 * `data-align="start|center|end|between"` (por defecto `end`) y `data-disable-spacing`.
 */
export class DialogActions extends ComponentBase {
  /**
   * Crea la instancia y aplica alineación y espaciado.
   *
   * @param {HTMLElement} element Contenedor de las acciones.
   */
  constructor(element) {
    super(element);
    const dialog = element.closest('.mtx-dialog, [data-mtx="dialog"]');
    this._align = applyDialogActionsOptions(element, dialog ? dialog.getAttribute('data-actions-align') : null);
  }

  /** @returns {string} Alineación actual (`start`, `center`, `end` o `between`). */
  get align() {
    return this._align;
  }

  /**
   * Cambia la alineación de las acciones.
   *
   * @param {string} value `start`, `center`, `end` o `between`.
   * @throws {RangeError} Si el valor no es una alineación válida.
   */
  set align(value) {
    if (!ACTIONS_ALIGNMENTS.includes(value)) {
      throw new RangeError(`Alineación no válida: ${value}`);
    }
    this.element.setAttribute('data-align', value);
    this._align = applyDialogActionsOptions(this.element);
  }
}

registerComponent('dialog', Dialog);
registerComponent('dialog-actions', DialogActions);

/**
 * Conecta los elementos de apertura con su diálogo.
 *
 * Un botón con `data-mtx-dialog-open="<id>"` abre el diálogo indicado.
 */
if (typeof document !== 'undefined') {
  // Delegación global intencionada: una sola por documento, sin instancia que la libere.
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-mtx-dialog-open]');
    if (!trigger) return;
    const id = trigger.getAttribute('data-mtx-dialog-open');
    const dialogEl = document.getElementById(id);
    if (dialogEl) {
      const instance = getInstance(dialogEl);
      if (instance && typeof instance.open === 'function') {
        if (!instance.isOpen) instance._openTrigger = trigger;
        instance.open();
      }
    }
  });
}