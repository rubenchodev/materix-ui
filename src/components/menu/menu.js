import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance, initElement, registerHomeNode } from '../../core/registry.js';
import { pushLayer, removeLayer, isInUpperLayer } from '../../core/layers.js';
import { onClickAway } from '../../core/click-away-listener.js';
import { getPortalContainer } from '../../core/portal.js';
import { transitionGrow, cancelTransition } from '../../core/transition.js';
import { positionDropdown, autoUpdate, isRtl } from '../../core/position.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { createRipple } from '../../core/ripple.js';

const CHECKABLE_ROLE = /^menuitem(checkbox|radio)$/;

/**
 * Busca los disparadores declarados para un menú.
 *
 * @param {HTMLElement} menuEl Elemento del menú.
 * @returns {HTMLElement[]} Disparadores encontrados (sin duplicados).
 */
function findMenuTriggers(menuEl) {
  const id = menuEl.id;
  if (!id) return [];
  const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id;
  const selector = [
    `[data-open-menu="#${escaped}"]`,
    `[data-mtx-menu-trigger="#${escaped}"]`,
    `[data-mtx-menu-trigger="${escaped}"]`,
    `[aria-controls="${escaped}"]`,
  ].join(',');
  return Array.from(document.querySelectorAll(selector)).filter((el) => !menuEl.contains(el) || el.hasAttribute('data-submenu-trigger'));
}

/**
 * Añade la semántica de disparador de menú (`aria-haspopup`, `aria-controls`).
 *
 * @param {HTMLElement} trigger Disparador.
 * @param {HTMLElement} menuEl Elemento del menú.
 */
function prepareTrigger(trigger, menuEl) {
  trigger.setAttribute('aria-haspopup', 'menu');
  if (!trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
  if (menuEl.id && !trigger.hasAttribute('aria-controls')) trigger.setAttribute('aria-controls', menuEl.id);
}

/**
 * Fija `aria-checked` de un ítem y, si es radio, desmarca los de su grupo.
 *
 * @param {HTMLElement} item Ítem de menú.
 * @param {boolean} checked Nuevo estado.
 * @param {HTMLElement|null} menuEl Menú contenedor.
 */
function setItemChecked(item, checked, menuEl) {
  if (checked && item.getAttribute('role') === 'menuitemradio') {
    const scope = item.closest('[role="group"]') || menuEl || item.parentElement;
    scope.querySelectorAll('[role="menuitemradio"]').forEach((other) => {
      if (other !== item) {
        other.setAttribute('aria-checked', 'false');
        other.classList.remove('mtx-menu-item--checked');
      }
    });
  }
  item.setAttribute('aria-checked', String(checked));
  item.classList.toggle('mtx-menu-item--checked', checked);
}

/**
 * Alterna un ítem `menuitemcheckbox` o marca un `menuitemradio`.
 *
 * @param {HTMLElement} item Ítem activado.
 * @param {HTMLElement} menuEl Menú contenedor.
 * @returns {boolean|null} Nuevo estado o `null` si el ítem no es marcable.
 */
function toggleCheckedItem(item, menuEl) {
  const role = item.getAttribute('role') || '';
  if (!CHECKABLE_ROLE.test(role)) return null;
  const next = role === 'menuitemradio' ? true : item.getAttribute('aria-checked') !== 'true';
  setItemChecked(item, next, menuEl);
  return next;
}

/**
 * Prepara un ítem de menú: separadores, icono, rol, estados y marca (idempotente).
 *
 * @param {HTMLElement} el Elemento `data-mtx="menu-item"`.
 */
function setupMenuItem(el) {
  if (el.hasAttribute('data-divider')) {
    // Separador: no es un menuitem ni recibe el foco.
    el.className = 'mtx-menu-item--divider';
    el.setAttribute('role', 'separator');
    el.removeAttribute('tabindex');
    el.removeAttribute('aria-disabled');
    return;
  }

  if (!el.classList.contains('mtx-menu-item')) el.classList.add('mtx-menu-item');

  const iconName = el.getAttribute('data-icon');
  if (iconName && !el.querySelector('.mtx-menu-item__icon, .material-icons, svg')) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'mtx-menu-item__icon';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-icons';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = iconName;
    iconWrap.appendChild(iconSpan);
    el.insertBefore(iconWrap, el.firstChild);
  }

  if (el.hasAttribute('data-submenu-trigger') && !el.querySelector('.mtx-menu-item__expand')) {
    const expandSpan = document.createElement('span');
    expandSpan.className = 'material-icons mtx-menu-item__expand';
    expandSpan.setAttribute('aria-hidden', 'true');
    expandSpan.textContent = 'chevron_right';
    el.appendChild(expandSpan);
  }

  if (!el.hasAttribute('role')) el.setAttribute('role', 'menuitem');
  if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
  if (el.hasAttribute('data-disabled')) {
    el.classList.add('mtx-menu-item--disabled');
    el.setAttribute('aria-disabled', 'true');
  }
  if (el.hasAttribute('data-selected')) el.classList.add('mtx-menu-item--selected');
  if (el.hasAttribute('data-dense')) el.classList.add('mtx-menu-item--dense');
  if (el.hasAttribute('data-disable-gutters')) el.classList.add('mtx-menu-item--disable-gutters');

  if (CHECKABLE_ROLE.test(el.getAttribute('role') || '')) {
    if (!el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', String(el.hasAttribute('data-checked')));
    el.classList.toggle('mtx-menu-item--checked', el.getAttribute('aria-checked') === 'true');
    if (!el.querySelector('.mtx-menu-item__check')) {
      const check = document.createElement('span');
      check.className = 'material-icons mtx-menu-item__check';
      check.setAttribute('aria-hidden', 'true');
      check.textContent = 'check';
      el.appendChild(check);
    }
  }
}

/**
 * Representa un menú desplegable de Materix UI.
 *
 * Sigue el patrón de `Menu` de MUI (Popper + Paper + List). Se ancla a un
 * elemento disparador y muestra los `.mtx-menu-item` contenidos.
 *
 * Disparadores (el menú necesita un `id`, salvo `data-anchor`):
 * - `data-open-menu="#id"` o su alias `data-mtx-menu-trigger="#id"` en
 *   cualquier elemento (también si se añade después: delegación de clics).
 * - `aria-controls="id"` en un elemento existente al inicializar.
 * - `data-anchor="selector"` en el menú: ese elemento ancla y abre el menú.
 * - `data-position-anchor="selector"` en el menú: solo posiciona (no abre); p. ej. el
 *   ButtonGroup completo de un split button, como MUI.
 * No hay disparador implícito (p. ej. el hermano anterior): sin ninguno de
 * los anteriores, el menú solo se abre con `open(anchor)`.
 *
 * Uso declarativo:
 * ```html
 * <button class="mtx-button" data-open-menu="#menu1">Abrir</button>
 * <div class="mtx-menu" id="menu1" data-mtx="menu">
 *   <div class="mtx-menu-item" data-mtx="menu-item">Opción</div>
 * </div>
 * ```
 */
export class Menu extends ComponentBase {
  /**
   * Crea una instancia del menú.
   *
   * @param {HTMLElement} element Elemento del menú.
   */
  constructor(element) {
    // Re-instanciación (`new Menu(el)` dos veces): el `destroy()` de la previa, que corre en
    // `super()`, no debe retirar el marcador de la ubicación original; lo hereda esta instancia.
    const previous = getInstance(element);
    let inheritedPlaceholder = null;
    if (previous instanceof Menu && previous.constructor === new.target && !previous.destroyed) {
      inheritedPlaceholder = previous._placeholder || null;
      previous._placeholder = null;
    }

    super(element);
    this._inheritedPlaceholder = inheritedPlaceholder;

    this.element.classList.add('mtx-menu');
    this.element.hidden = true;

    const anchorSel = element.getAttribute('data-anchor');
    this.anchor = (anchorSel && document.querySelector(anchorSel)) || findMenuTriggers(element)[0] || null;

    this.isSubmenu = element.hasAttribute('data-submenu');
    this.childMenu = null;
    this.parentMenu = null;

    Array.from(element.querySelectorAll('[data-mtx="menu-item"]')).forEach(setupMenuItem);

    this._handlePointerDown = (event) => {
      const item = event.target.closest('.mtx-menu-item');
      if (item && !item.classList.contains('mtx-menu-item--disabled') && !item.hasAttribute('disabled') && event.button === 0) {
        createRipple(item, event);
      }
    };
    this.listen(element, 'pointerdown', this._handlePointerDown);

    this._transitionToken = 0;
    this._repositionRaf = null;
    this._stopAutoUpdate = null;
    // Limpiezas garantizadas aunque `destroy()` llegue con el menú abierto o a mitad de transición.
    this.onDestroy(() => {
      this._unbindReposition();
      if (this._clickAwayCleanup) this._clickAwayCleanup();
      if (this._keydownCleanup) this._keydownCleanup();
      this._clickAwayCleanup = null;
      this._keydownCleanup = null;
    });
    this._build();
    this._bindTriggers();
    if (element.hasAttribute('data-open')) queueMicrotask(() => { if (!this.destroyed) this.open(); });
  }

  /**
   * Obtiene los items de menú actuales.
   *
   * @returns {HTMLElement[]} Lista de elementos `.mtx-menu-item`.
   */
  get menuItems() {
    return Array.from(this.element.querySelectorAll('.mtx-menu-item'));
  }

  /**
   * Prepara el menú para mostrarse en el portal sin desvincularlo del DOM permanentemente.
   */
  _build() {
    this.menuContainer = getPortalContainer();
    this.container = document.createElement('div');
    this.container.className = 'mtx-menu__popper';
    this.container.hidden = true;
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(0.6, 0)';

    const paper = document.createElement('div');
    paper.className = 'mtx-menu__paper';
    paper.setAttribute('role', 'presentation');
    // Marcador en la ubicación original: al eliminarla (SPA), `watch({destroyOnRemove})` destruye el menú portado.
    const inherited = this._inheritedPlaceholder;
    this._inheritedPlaceholder = null;
    if (inherited && inherited.isConnected) {
      this._placeholder = inherited;
      registerHomeNode(this, inherited);
    } else if (this.element.parentNode && this.element.parentNode !== document.body
      && !this.element.parentNode.classList?.contains('mtx-menu__paper')) {
      this._placeholder = document.createComment(`mtx-menu${this.element.id ? `:${this.element.id}` : ''}`);
      this.element.parentNode.insertBefore(this._placeholder, this.element);
      registerHomeNode(this, this._placeholder);
    }
    this.element.setAttribute('role', 'menu');
    this.element.tabIndex = -1;
    paper.appendChild(this.element);
    this.paper = paper;
    this.container.appendChild(paper);
    this.menuContainer.appendChild(this.container);
  }

  /**
   * Vincula los disparadores que abren este menú.
   */
  _bindTriggers() {
    this.triggers = findMenuTriggers(this.element);
    if (this.anchor && !this.triggers.includes(this.anchor)) {
      this.triggers.push(this.anchor);
    }

    this._handleTriggerClick = (event) => {
      event.preventDefault();
      event._mtxMenuHandled = true;
      this._activeTrigger = event.currentTarget;
      const isKeyboard = event.detail === 0;
      if (this.isSubmenu) {
        if (!this.isOpen) this.open(null, { focusFirstItem: isKeyboard });
      } else {
        this._toggle({ focusFirstItem: isKeyboard });
      }
    };

    this._handleTriggerEnter = (event) => {
      const target = event.currentTarget;
      clearTimeout(this._hoverTimeout);
      this._hoverTimeout = setTimeout(() => {
        this._activeTrigger = target;
        if (!this.isOpen) this.open(null, { focusFirstItem: false });
      }, 100);
    };

    this._handleTriggerLeave = () => {
      clearTimeout(this._hoverTimeout);
    };

    this.triggers.forEach((el) => {
      this.listen(el, 'click', this._handleTriggerClick);
      prepareTrigger(el, this.element);

      if (this.isSubmenu) {
        this.listen(el, 'mouseenter', this._handleTriggerEnter);
        this.listen(el, 'mouseleave', this._handleTriggerLeave);
      }
    });
    this.onDestroy(() => {
      clearTimeout(this._hoverTimeout);
      clearTimeout(this._closeChildTimeout);
    });

    this._handleItemClick = (event) => {
      const item = event.target.closest('.mtx-menu-item');
      if (item && !item.classList.contains('mtx-menu-item--disabled')) {
        if (item.hasAttribute('data-submenu-trigger')) {
          // No cerrar el menú si se hace clic en un ítem que despliega un submenú
          return;
        }
        const checked = toggleCheckedItem(item, this.element);
        this.close();
        const detail = { item };
        if (checked !== null) detail.checked = checked;
        emit(this.element, 'mtx:menu:select', detail, { bubbles: true, cancelable: false });
      }
    };
    this.listen(this.element, 'click', this._handleItemClick);

    this._closeChildTimeout = null;
    this.menuItems.forEach((item) => {
      this.listen(item, 'mouseenter', () => {
        if (this.childMenu && this.childMenu._activeTrigger !== item) {
          clearTimeout(this._closeChildTimeout);
          this._closeChildTimeout = setTimeout(() => {
            if (this.childMenu && this.childMenu._activeTrigger !== item) {
              this.childMenu.close({ restoreFocus: false });
            }
          }, 50);
        }
      });
      this.listen(item, 'mouseleave', () => {
        clearTimeout(this._closeChildTimeout);
      });
    });
  }

  /**
   * Alterna la apertura del menú.
   *
   * @param {Object} [options] Opciones de apertura.
   */
  _toggle(options = {}) {
    if (this.isOpen) this.close();
    else this.open(null, options);
  }

  /**
   * Actualiza `aria-expanded` en los disparadores vinculados y en el activo.
   *
   * @param {boolean} expanded Estado de apertura.
   */
  _setExpanded(expanded) {
    const value = String(expanded);
    this.triggers.forEach((el) => el.setAttribute('aria-expanded', value));
    if (this._activeTrigger instanceof HTMLElement && this._activeTrigger.hasAttribute('aria-haspopup')) {
      this._activeTrigger.setAttribute('aria-expanded', value);
    }
  }

  /**
   * Indica si un nodo pertenece a un disparador del menú (vinculado o activo).
   *
   * @param {Node} target Nodo del evento.
   * @returns {boolean} `true` si es parte de un disparador.
   */
  _isTriggerTarget(target) {
    if (this.triggers.some((trigger) => trigger.contains(target))) return true;
    return this._activeTrigger instanceof HTMLElement && this._activeTrigger.contains(target);
  }

  /**
   * Gestiona el clic de un disparador añadido después de inicializar el menú.
   *
   * @param {HTMLElement} trigger Disparador pulsado.
   * @param {MouseEvent} event Evento de clic.
   */
  _handleDelegatedTrigger(trigger, event) {
    event.preventDefault();
    prepareTrigger(trigger, this.element);
    const isKeyboard = event.detail === 0;
    if (this.isOpen && this._activeTrigger === trigger) {
      this.close();
      return;
    }
    if (this.isOpen) this.close({ restoreFocus: false });
    if (this._activeTrigger instanceof HTMLElement && this._activeTrigger !== trigger && !this.triggers.includes(this._activeTrigger)) {
      this._activeTrigger.setAttribute('aria-expanded', 'false');
    }
    this._activeTrigger = trigger;
    this.open(null, { focusFirstItem: isKeyboard });
  }

  /**
   * Indica si el menú está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains('mtx-menu--open');
  }

  /**
   * Ancla de posicionamiento: la de `open(…, { anchorEl })`, `data-position-anchor`,
   * el disparador activo o el ancla por defecto.
   *
   * @returns {HTMLElement|{getBoundingClientRect: Function}|null} Ancla.
   */
  _getPositionAnchor() {
    if (this._openAnchorEl && (this._openAnchorEl.nodeType !== 1 || this._openAnchorEl.isConnected)) return this._openAnchorEl;
    const selector = this.element.getAttribute('data-position-anchor');
    let fromAttr = null;
    if (selector) {
      try { fromAttr = document.querySelector(selector); } catch (e) { fromAttr = null; }
    }
    return fromAttr || this._activeTrigger || this.anchor;
  }

  /**
   * Posiciona el menú relativo al ancla activo o predeterminado.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   * @returns {{placement: string, side: string, maxHeight: number}|undefined} Resultado aplicado.
   */
  _position({ keepSide = false } = {}) {
    const anchor = this._getPositionAnchor();
    if (!anchor) return undefined;
    if (!keepSide) {
      this._rtl = this._resolveRtl(anchor);
      // El popper portado conserva la dirección del contexto original (texto y submenús).
      this.container.setAttribute('dir', this._rtl ? 'rtl' : 'ltr');
    }
    const result = positionDropdown(anchor, this.container, {
      placement: this.isSubmenu ? 'right-start' : 'bottom-start',
      offset: this.isSubmenu ? 0 : 4,
      padding: 8,
      matchWidth: !this.isSubmenu && this.element.hasAttribute('data-match-width'),
      content: this.paper,
      rtl: this._rtl,
      lockSide: keepSide ? this._side : undefined,
    });
    this._side = result.side;
    return result;
  }

  /**
   * Dirección del contexto: la del menú padre (submenús), la del ancla o la de la ubicación original.
   *
   * @param {HTMLElement|Object} anchor Ancla de posicionamiento.
   * @returns {boolean} `true` en RTL.
   */
  _resolveRtl(anchor) {
    if (this.isSubmenu && this.parentMenu && typeof this.parentMenu._rtl === 'boolean') return this.parentMenu._rtl;
    if (anchor && anchor.nodeType === 1 && anchor.isConnected) return isRtl(anchor);
    if (this._placeholder && this._placeholder.parentElement) return isRtl(this._placeholder.parentElement);
    return isRtl(document.documentElement);
  }

  /**
   * Manejador de scroll/resize para mantener el menú adherido al disparador.
   */
  _handleReposition = () => {
    if (!this.isOpen) return;

    if (this._repositionRaf) cancelAnimationFrame(this._repositionRaf);
    this._repositionRaf = requestAnimationFrame(() => {
      if (!this.isOpen) return;
      const anchor = this._getPositionAnchor();
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom < 0 || rect.top > vh) {
        this.close({ restoreFocus: false });
        return;
      }
      this._position({ keepSide: true });
    });
  };

  /**
   * Reposiciona en tiempo real (scroll, resize y cambios de tamaño) con `autoUpdate`.
   */
  _bindReposition() {
    this._unbindReposition();
    const anchor = this._getPositionAnchor();
    let initial = true;
    // `autoUpdate` ejecuta el callback al empezar; `open()` ya posicionó el menú.
    this._stopAutoUpdate = autoUpdate(anchor, this.container, () => {
      if (initial) {
        initial = false;
        return;
      }
      this._handleReposition();
    });
  }

  /**
   * Detiene el reposicionamiento automático.
   */
  _unbindReposition() {
    if (this._repositionRaf) {
      cancelAnimationFrame(this._repositionRaf);
      this._repositionRaf = null;
    }
    if (this._stopAutoUpdate) {
      this._stopAutoUpdate();
      this._stopAutoUpdate = null;
    }
  }

  /**
   * Abre el menú.
   *
   * @param {HTMLElement|Object} [anchor] Disparador opcional al que anclar esta apertura.
   * @param {Object} [options] Opciones de apertura.
   * @param {boolean} [options.focusFirstItem=true] Si debe enfocar el primer ítem al abrir.
   * @param {HTMLElement} [options.anchorEl] Elemento al que se ancla la posición (p. ej. el grupo
   *   de un split button); el foco sigue volviendo al disparador.
   */
  open(anchor = null, { focusFirstItem = true, anchorEl = null } = {}) {
    if (anchor) {
      this._activeTrigger = anchor;
    }
    if (!this.isOpen) this._openAnchorEl = anchorEl || null;
    if (this.isOpen) return;

    if (this._activeTrigger && this._activeTrigger instanceof HTMLElement) {
      const parentMenuEl = this._activeTrigger.closest('.mtx-menu');
      if (parentMenuEl) {
        this.parentMenu = getInstance(parentMenuEl);
        if (this.parentMenu) {
          if (this.parentMenu.childMenu && this.parentMenu.childMenu !== this) {
            this.parentMenu.childMenu.close({ restoreFocus: false });
          }
          this.parentMenu.childMenu = this;
        }
      }
    }

    this._transitionToken += 1;
    const currentToken = this._transitionToken;

    this.container.hidden = false;
    this.element.hidden = false;
    if (this.container.parentElement !== this.menuContainer) {
      this.menuContainer.appendChild(this.container);
    }

    const placementResult = this._position();
    const origin = this.element.getAttribute('data-transform-origin')
      || (placementResult ? this.container.style.transformOrigin : 'top');

    if (this.isSubmenu) {
      this.container.style.transition = 'none';
      this.container.style.opacity = '1';
      this.container.style.transform = 'scale(1, 1)';
      this.element.classList.add('mtx-menu--open');
      this._setExpanded(true);
      emit(this.element, 'mtx:menu:open', undefined, { bubbles: true, cancelable: false });
      this._bindReposition();
      this._clickAwayCleanup = onClickAway(this.container, (event) => {
        if (this._isTriggerTarget(event.target) || isInUpperLayer(this, event.target)) return;
        if (this.childMenu && this.childMenu.container && this.childMenu.container.contains(event.target)) return;
        this.close({ restoreFocus: false });
      });
      this._pushLayer();
      this._keydownCleanup = this._bindKeyboard();
      this._focusInitial(focusFirstItem);
    } else {
      this.element.classList.add('mtx-menu--open');
      transitionGrow(this.container, true, { transformOrigin: origin });
      this._setExpanded(true);
      this._bindReposition();
      this._clickAwayCleanup = onClickAway(this.container, (event) => {
        if (this._isTriggerTarget(event.target) || isInUpperLayer(this, event.target)) {
          return;
        }
        if (this.childMenu && this.childMenu.container && this.childMenu.container.contains(event.target)) {
          return;
        }
        this.close({ restoreFocus: false });
      });
      this._pushLayer();
      this._keydownCleanup = this._bindKeyboard();
      this._focusInitial(focusFirstItem);
      emit(this.element, 'mtx:menu:open', undefined, { bubbles: true, cancelable: false });
    }
  }

  /**
   * Cierra el menú.
   */
  close({ restoreFocus = true } = {}) {
    if (!this.isOpen) return;

    if (this.childMenu) {
      this.childMenu.close({ restoreFocus: false });
      this.childMenu = null;
    }

    if (this.parentMenu && this.parentMenu.childMenu === this) {
      this.parentMenu.childMenu = null;
    }

    this._transitionToken += 1;
    // Una apertura en curso (grow) no debe terminar sobre el menú ya cerrado.
    cancelTransition(this.container);

    const origin = this.container.style.transformOrigin
      || this.element.getAttribute('data-transform-origin')
      || 'top';

    this.element.classList.remove('mtx-menu--open');
    removeLayer(this);
    this._setExpanded(false);
    this._unbindReposition();
    if (this._clickAwayCleanup) {
      this._clickAwayCleanup();
      this._clickAwayCleanup = null;
    }
    if (this._keydownCleanup) {
      this._keydownCleanup();
      this._keydownCleanup = null;
    }

    this.container.style.transition = 'none';
    this.container.style.opacity = '0';
    this.container.style.transform = 'scale(1, 1)';
    this.container.hidden = true;
    this.element.hidden = true;

    if (restoreFocus && this._activeTrigger && typeof this._activeTrigger.focus === 'function') {
      this._activeTrigger.focus();
    }
    emit(this.element, 'mtx:menu:close', undefined, { bubbles: true, cancelable: false });
  }

  /**
   * Registra el menú abierto en la pila de capas (Escape cierra solo el superior).
   */
  _pushLayer() {
    pushLayer(this, {
      kind: 'popup',
      nodes: this.container,
      // El portal compartido sube por encima de un Dialog/Popover abierto debajo.
      stack: [{ node: this.menuContainer }],
      onEscape: () => this.close({ restoreFocus: true }),
    });
  }

  /**
   * Vincula la navegación por teclado dentro del menú.
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const onKeydown = (event) => {
      // Si hay un submenú abierto, delegar el control del teclado a él
      if (this.childMenu && this.childMenu.isOpen) return;

      const enabled = this.menuItems.filter(
        (item) => !item.classList.contains('mtx-menu-item--disabled') && !item.hidden
      );
      // Escape lo entrega la pila de capas; Tab cierra sin devolver el foco.
      if (event.key === 'Tab') {
        this.close({ restoreFocus: false });
        return;
      }
      if (!enabled.length) return;

      const current = enabled.indexOf(document.activeElement);
      let next = -1;
      if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % enabled.length;
      else if (event.key === 'ArrowUp') next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = enabled.length - 1;

      if (next >= 0) {
        event.preventDefault();
        enabled[next].focus();
        return;
      }

      if (event.key === 'ArrowRight' && document.activeElement && document.activeElement.hasAttribute('data-submenu-trigger')) {
        event.preventDefault();
        document.activeElement.click();
        return;
      }

      if (event.key === 'ArrowLeft' && this.isSubmenu) {
        event.preventDefault();
        this.close({ restoreFocus: true });
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        const active = document.activeElement;
        if (active && active.classList.contains('mtx-menu-item')) {
          event.preventDefault();
          if (active.hasAttribute('data-submenu-trigger')) {
            active.dispatchEvent(new MouseEvent('mouseenter'));
          } else {
            active.click();
          }
        }
        return;
      }
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const query = event.key.toLocaleLowerCase();
        const ordered = enabled.slice(current + 1).concat(enabled.slice(0, current + 1));
        const match = ordered.find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(query));
        if (match) match.focus();
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }

  /**
   * Enfoca el item seleccionado o el primer item habilitado.
   *
   * @param {boolean} focusFirstItem Determina si se debe priorizar un ítem sobre el contenedor.
   */
  _focusInitial(focusFirstItem = true) {
    if (!focusFirstItem) {
      this.element.focus({ preventScroll: true });
      return;
    }
    const enabled = this.menuItems.filter(
      (item) => !item.classList.contains('mtx-menu-item--disabled')
    );
    const selected = enabled.find((item) => item.classList.contains('mtx-menu-item--selected'));
    (selected || enabled[0] || this.element).focus({ preventScroll: true });
  }

  /**
   * Libera listeners (disparadores, documento, ventana), retira el popper portado
   * y desvincula la instancia. El elemento del menú sale del DOM con el popper.
   */
  destroy() {
    if (this.isOpen) this.close({ restoreFocus: false });
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    if (this._placeholder && this._placeholder.parentNode) this._placeholder.remove();
    this._placeholder = null;
    super.destroy();
  }
  /**
   * Crea un menú contextual programático basado en JSON.
   *
   * @param {string} targetSelector Selector de los elementos donde aplicar el clic derecho.
   * @param {Array<Object>} items Definición JSON del menú.
   * @returns {Menu|null} Instancia del menú raíz creado.
   */
  static createContextMenu(targetSelector, items = []) {
    const targets = document.querySelectorAll(targetSelector);
    if (!targets.length) return null;

    const actionMap = new Map();
    const createdMenus = [];

    const buildMenuHtml = (menuItems, isSubmenu = false) => {
      const menuEl = document.createElement('div');
      menuEl.className = 'mtx-menu';
      menuEl.setAttribute('data-mtx', 'menu');
      if (isSubmenu) {
        menuEl.setAttribute('data-submenu', 'true');
      }
      menuEl.id = uniqueId('mtx-context-menu');

      menuItems.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.setAttribute('data-mtx', 'menu-item');

        if (item.divider) {
          itemEl.setAttribute('data-divider', '');
          menuEl.appendChild(itemEl);
          return;
        }

        itemEl.className = 'mtx-menu-item';
        if (item.disabled) {
          itemEl.setAttribute('data-disabled', 'true');
        }

        const value = uniqueId('mtx-context-menu-item');
        itemEl.setAttribute('data-value', value);

        if (item.action && typeof item.action === 'function') {
          actionMap.set(value, item.action);
        }

        if (item.icon) {
          itemEl.setAttribute('data-icon', item.icon);
        } else if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = '';
          img.className = 'mtx-menu-item__image';
          itemEl.appendChild(img);
        }

        const textNode = document.createTextNode(item.label || '');
        itemEl.appendChild(textNode);

        if (item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
          const submenuEl = buildMenuHtml(item.submenu, true);
          itemEl.setAttribute('data-submenu-trigger', 'true');
          itemEl.setAttribute('data-open-menu', `#${submenuEl.id}`);
        }

        menuEl.appendChild(itemEl);
      });

      document.body.appendChild(menuEl);
      createdMenus.push(menuEl);
      return menuEl;
    };

    const rootMenuEl = buildMenuHtml(items);

    // Inicializar todos los menús (raíz y submenús)
    createdMenus.forEach((el) => {
      initElement(el);
      el.querySelectorAll('[data-mtx]').forEach((child) => initElement(child));
    });

    const rootInstance = getInstance(rootMenuEl);

    // Escuchar selección para ejecutar la acción correspondiente
    createdMenus.forEach(el => {
      el.addEventListener('mtx:menu:select', (event) => {
        const val = event.detail.item.getAttribute('data-value');
        const action = actionMap.get(val);
        if (action) {
          action(event.detail.item, event);
        }
      });
    });

    // Anclar el contextmenu a los disparadores
    targets.forEach((target) => {
      rootInstance.listen(target, 'contextmenu', (event) => {
        event.preventDefault();
        const virtualAnchor = {
          getBoundingClientRect: () => ({
            width: 0, height: 0,
            top: event.clientY, right: event.clientX,
            bottom: event.clientY, left: event.clientX,
          })
        };
        rootInstance.open(virtualAnchor, { focusFirstItem: false });
      });
    });

    return rootInstance;
  }
}

/**
 * Representa un elemento de menú de Materix UI.
 */
export class MenuItem extends ComponentBase {
  /**
   * Crea una instancia del item de menú.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    setupMenuItem(element);
  }

  /**
   * Indica si el ítem está marcado (`menuitemcheckbox` / `menuitemradio`).
   *
   * @returns {boolean} Estado de `aria-checked`.
   */
  get checked() {
    return this.element.getAttribute('aria-checked') === 'true';
  }

  /**
   * Marca o desmarca el ítem; en `menuitemradio` desmarca los del mismo grupo.
   *
   * @param {boolean} value Nuevo estado.
   */
  set checked(value) {
    setItemChecked(this.element, Boolean(value), this.element.closest('.mtx-menu'));
  }
}

registerComponent('menu', Menu);
registerComponent('menu-item', MenuItem);

// Delegación: disparadores `data-open-menu` / `data-mtx-menu-trigger` añadidos
// después de inicializar el menú (filas de tabla, contenido dinámico).
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    if (event._mtxMenuHandled || !(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-open-menu], [data-mtx-menu-trigger]');
    if (!trigger) return;
    const ref = (trigger.getAttribute('data-open-menu') || trigger.getAttribute('data-mtx-menu-trigger') || '').trim();
    if (!ref) return;
    const menuEl = document.getElementById(ref.replace(/^#/, ''));
    const instance = menuEl && getInstance(menuEl);
    if (!(instance instanceof Menu) || instance.triggers.includes(trigger)) return;
    instance._handleDelegatedTrigger(trigger, event);
  });
}