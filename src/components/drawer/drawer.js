import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance, initElement } from '../../core/registry.js';
import { onClickAway } from '../../core/click-away-listener.js';
import { addModal, removeModal, isTopModal } from '../../core/modal-manager.js';
import { focusFirst, trapTab } from '../../core/focus-manager.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit } from '../../core/events.js';
import { pushLayer, removeLayer, isInUpperLayer } from '../../core/layers.js';
import { uniqueId } from '../../core/id.js';

/**
 * Breakpoints canónicos (min-width en px), iguales a los de Grid.
 * @type {Record<string, number>}
 */
const BREAKPOINTS = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

/** Clase que oculta los disparadores de un drawer responsive mientras es permanente. */
const HIDDEN_TRIGGER_CLASS = 'mtx-drawer-trigger--hidden';

/**
 * Representa un cajón lateral (Drawer) de Materix UI, equivalente al `Drawer` de MUI.
 *
 * - Variantes: `temporary` (modal, por defecto), `persistent`, `permanent` y
 *   `responsive` (temporary por debajo de `data-breakpoint`, permanent por encima).
 * - Anclas: `left`, `right`, `top` y `bottom`.
 * - Auto-scaffolding de cabecera, botón de cierre, panel de contenido y pie.
 * - Patrón clipped bajo la AppBar (`data-clipped`) y modo contenido (`data-absolute`).
 */
export class Drawer extends ComponentBase {
  /**
   * Crea una instancia del drawer.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-drawer')) {
      element.classList.add('mtx-drawer');
    }

    this._userRole = element.getAttribute('role');
    this.anchor = element.getAttribute('data-anchor') || 'left';
    this.variant = element.getAttribute('data-variant') || 'temporary';
    this.breakpoint = element.getAttribute('data-breakpoint') || 'md';
    /** Modo efectivo actual: `temporary`, `persistent` o `permanent`. */
    this.mode = null;

    this.isAbsolute = element.hasAttribute('data-absolute') || element.classList.contains('mtx-drawer--absolute');
    if (this.isAbsolute) {
      element.classList.add('mtx-drawer--absolute');
    }

    this._applyWidth(element.getAttribute('data-width'));

    const elevation = element.getAttribute('data-elevation');
    if (elevation !== null) {
      element.style.boxShadow = `var(--mtx-elevation-${elevation})`;
    }

    if (element.hasAttribute('data-clipped') && element.getAttribute('data-clipped') !== 'false') {
      element.classList.add('mtx-drawer--clipped');
    }

    element.classList.add(`mtx-drawer--${this.anchor}`);
    if (this.variant === 'responsive') {
      element.classList.add('mtx-drawer--responsive');
    }

    this._buildStructure();
    const initiallyOpen = element.classList.contains('mtx-drawer--open') || element.hasAttribute('data-open');

    if (this.variant === 'permanent') {
      this._setMode('permanent');
      return;
    }

    this._handleClose = (event) => {
      const trigger = event.target.closest('[data-mtx-drawer-close]');
      if (trigger) {
        const targetId = trigger.getAttribute('data-mtx-drawer-close');
        if (!targetId || targetId === this.element.id) {
          this.close('closeButtonClick');
        }
      }
    };
    this.listen(element, 'click', this._handleClose);

    if (this.variant === 'persistent') {
      this._setMode('persistent');
    } else if (this.variant === 'responsive') {
      this._bindMediaQuery();
    } else {
      this._setMode('temporary');
    }

    if (initiallyOpen && this.mode !== 'permanent') {
      this.open();
    }
  }

  /**
   * Indica si el drawer está abierto (siempre `true` en modo permanente).
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains('mtx-drawer--open');
  }

  /**
   * Aplica el ancho declarado en `data-width`.
   *
   * @param {string|null} width Valor del atributo.
   */
  _applyWidth(width) {
    const el = this.element;
    if (width === 'wide') {
      el.classList.add('mtx-drawer--wide');
    } else if (width === 'narrow') {
      el.classList.add('mtx-drawer--narrow');
    } else if (width === 'full' || width === 'full-width') {
      el.classList.add('mtx-drawer--full-width');
    } else if (width) {
      el.style.width = width;
      el.style.setProperty('--mtx-drawer-width', width);
    }
  }

  /**
   * Genera cabecera, pie y panel de contenido (sintaxis simplificada) sin duplicar el BEM existente.
   */
  _buildStructure() {
    const element = this.element;
    let header = element.querySelector('.mtx-drawer__header');
    const titleText = element.getAttribute('data-title');
    const userName = element.getAttribute('data-user-name');
    const userEmail = element.getAttribute('data-user-email');

    if (!header && (titleText || userName || userEmail)) {
      header = document.createElement('div');
      header.className = 'mtx-drawer__header';

      if (userName || userEmail) {
        header.appendChild(this._buildUser(userName, userEmail));
      } else {
        const heading = document.createElement('div');
        heading.className = 'mtx-drawer__heading';

        const titleEl = document.createElement('h3');
        titleEl.className = 'mtx-drawer__title';
        titleEl.textContent = titleText;
        heading.appendChild(titleEl);

        const subtitleText = element.getAttribute('data-subtitle');
        if (subtitleText) {
          const subtitleEl = document.createElement('div');
          subtitleEl.className = 'mtx-drawer__subtitle';
          subtitleEl.textContent = subtitleText;
          heading.appendChild(subtitleEl);
        }
        header.appendChild(heading);
      }

      if (element.getAttribute('data-close-button') !== 'false' && this.variant !== 'permanent') {
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'mtx-icon-button mtx-drawer__close';
        closeBtn.setAttribute('aria-label', t('drawer', 'close', null, 'Close', getComponentLocale(element)));
        closeBtn.setAttribute('data-mtx-drawer-close', '');
        closeBtn.innerHTML = '<span class="material-icons" aria-hidden="true">close</span>';
        header.appendChild(closeBtn);
      }
    }

    if (header && element.getAttribute('data-header') === 'temporary') {
      header.classList.add('mtx-drawer__temporary-only');
    }

    let footer = element.querySelector('.mtx-drawer__footer');
    const footerVersion = element.getAttribute('data-footer-version');
    const footerAction = element.getAttribute('data-footer-action');

    if (!footer && (footerVersion || footerAction)) {
      footer = document.createElement('div');
      footer.className = 'mtx-drawer__footer';

      if (footerVersion) {
        const infoEl = document.createElement('div');
        infoEl.className = 'mtx-drawer__footer-info';
        infoEl.textContent = footerVersion;
        footer.appendChild(infoEl);
      }

      if (footerAction) {
        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'mtx-drawer__footer-actions';

        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = 'mtx-button mtx-button--text mtx-button--small mtx-button--error';
        actionBtn.setAttribute('data-mtx', 'button');
        actionBtn.setAttribute('data-mtx-drawer-close', '');

        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = element.getAttribute('data-footer-action-icon') || 'logout';
        actionBtn.append(icon, ` ${footerAction}`);
        actionsWrap.appendChild(actionBtn);
        footer.appendChild(actionsWrap);
      }
    }

    let panel = element.querySelector('.mtx-drawer__content');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'mtx-drawer__content';
      const childNodes = Array.from(element.childNodes).filter((node) => node !== header && node !== footer);
      for (const node of childNodes) {
        panel.appendChild(node);
      }
      element.appendChild(panel);
    }
    if (header && header.parentElement !== element) {
      element.insertBefore(header, panel);
    }
    if (footer && footer.parentElement === element) {
      element.appendChild(footer);
    }
    this.panel = panel;
    this.header = header;
    this.footer = footer;

    if (element.getAttribute('data-padded') === 'true' || element.classList.contains('mtx-drawer--padded')) {
      panel.classList.add('mtx-drawer__content--padded');
    }

    // El padding del contenedor raíz se transfiere al panel para mantener cabecera y pie de borde a borde.
    if (element.style.padding) {
      panel.style.padding = element.style.padding;
      element.style.padding = '';
    }
  }

  /**
   * Construye la cabecera de usuario con avatar, nombre y correo.
   *
   * @param {string|null} userName Nombre del usuario.
   * @param {string|null} userEmail Correo del usuario.
   * @returns {HTMLElement} Contenedor `.mtx-drawer__user`.
   */
  _buildUser(userName, userEmail) {
    const userWrap = document.createElement('div');
    userWrap.className = 'mtx-drawer__user';

    const avatarText = this.element.getAttribute('data-user-avatar') || (userName ? userName.charAt(0).toUpperCase() : '');
    if (avatarText) {
      const avatarEl = document.createElement('div');
      avatarEl.className = 'mtx-avatar mtx-avatar--circular mtx-drawer__user-avatar';
      avatarEl.setAttribute('data-mtx', 'avatar');
      avatarEl.textContent = avatarText;
      userWrap.appendChild(avatarEl);
      initElement(avatarEl);
    }

    const userInfo = document.createElement('div');
    userInfo.className = 'mtx-drawer__user-info';
    if (userName) {
      const nameEl = document.createElement('div');
      nameEl.className = 'mtx-drawer__user-name';
      nameEl.textContent = userName;
      userInfo.appendChild(nameEl);
    }
    if (userEmail) {
      const emailEl = document.createElement('div');
      emailEl.className = 'mtx-drawer__user-email';
      emailEl.textContent = userEmail;
      userInfo.appendChild(emailEl);
    }
    userWrap.appendChild(userInfo);
    return userWrap;
  }

  /**
   * Observa el breakpoint de la variante responsive y cambia de modo al cruzarlo.
   */
  _bindMediaQuery() {
    const minWidth = BREAKPOINTS[this.breakpoint] ?? BREAKPOINTS.md;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      this._setMode('temporary');
      return;
    }
    this._mql = window.matchMedia(`(min-width: ${minWidth}px)`);
    this._onMediaChange = () => this._setMode(this._mql.matches ? 'permanent' : 'temporary');
    if (this._mql.addEventListener) {
      this.listen(this._mql, 'change', this._onMediaChange);
    } else if (this._mql.addListener) {
      this._mql.addListener(this._onMediaChange);
      this.onDestroy(() => this._mql.removeListener(this._onMediaChange));
    }
    this._onMediaChange();
  }

  /**
   * Cambia el modo efectivo y sincroniza clases, ARIA, fondo, disparadores y foco.
   *
   * @param {'temporary'|'persistent'|'permanent'} mode Modo destino.
   */
  _setMode(mode) {
    if (mode === this.mode) return;
    const previous = this.mode;
    const el = this.element;
    const focusInside = el.contains(document.activeElement);

    if (previous === 'temporary' && this.isOpen) {
      this._releaseModal();
    }
    el.classList.remove('mtx-drawer--animated', 'mtx-drawer--temporary', 'mtx-drawer--persistent', 'mtx-drawer--permanent', 'mtx-drawer--open');
    this.mode = mode;

    if (mode === 'permanent') {
      el.classList.add('mtx-drawer--permanent', 'mtx-drawer--open');
      el.setAttribute('aria-hidden', 'false');
      this._setPanelDialog(false);
      if (!this._userRole) el.setAttribute('role', 'navigation');
      if (this.backdrop) this.backdrop.classList.remove('mtx-drawer__backdrop--open');
    } else if (mode === 'persistent') {
      el.classList.add('mtx-drawer--persistent');
      el.setAttribute('aria-hidden', 'true');
      if (!this._userRole) el.setAttribute('role', 'region');
      this.panel.setAttribute('tabindex', '-1');
    } else {
      el.classList.add('mtx-drawer--temporary');
      el.setAttribute('aria-hidden', 'true');
      if (!this._userRole) el.removeAttribute('role');
      this._setPanelDialog(true);
      this._ensureBackdrop();
    }

    this._syncTriggers(this.isOpen);

    if (previous && mode === 'temporary' && focusInside) {
      const trigger = this._getTriggers().find((node) => node.offsetParent !== null || node.getClientRects().length > 0);
      if (trigger && trigger.focus) {
        trigger.focus();
      } else if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
    }

    if (previous) {
      emit(el, 'mtx:drawer:mode-change', { mode, previousMode: previous },
        { aliases: ['mtx:drawer:modechange'] });
    }
  }

  /**
   * Aplica o retira la semántica de diálogo modal del panel interior.
   *
   * @param {boolean} enabled `true` para el modo temporal.
   */
  _setPanelDialog(enabled) {
    const panel = this.panel;
    if (enabled) {
      if (!panel.hasAttribute('role')) {
        panel.setAttribute('role', 'dialog');
        this._panelRoleAdded = true;
      }
      panel.setAttribute('aria-modal', 'true');
      if (!panel.hasAttribute('tabindex')) {
        panel.tabIndex = -1;
        this._panelTabindexAdded = true;
      }
      if (!panel.hasAttribute('aria-label') && !panel.hasAttribute('aria-labelledby')) {
        const label = this.element.getAttribute('aria-label');
        const title = this.header && this.header.querySelector('.mtx-drawer__title, .mtx-drawer__user-name');
        if (label) {
          panel.setAttribute('aria-label', label);
          this._panelLabelAdded = 'aria-label';
        } else if (title) {
          if (!title.id) title.id = uniqueId('mtx-drawer-title');
          panel.setAttribute('aria-labelledby', title.id);
          this._panelLabelAdded = 'aria-labelledby';
        }
      }
      return;
    }
    if (this._panelRoleAdded) {
      panel.removeAttribute('role');
      this._panelRoleAdded = false;
    }
    panel.removeAttribute('aria-modal');
    if (this._panelTabindexAdded) {
      panel.removeAttribute('tabindex');
      this._panelTabindexAdded = false;
    }
    if (this._panelLabelAdded) {
      panel.removeAttribute(this._panelLabelAdded);
      this._panelLabelAdded = null;
    }
  }

  /**
   * Crea el fondo (backdrop) del modo temporal si procede y aún no existe.
   */
  _ensureBackdrop() {
    const el = this.element;
    if (this.backdrop || el.getAttribute('data-backdrop') === 'false' || el.hasAttribute('data-hide-backdrop')) return;
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'mtx-drawer__backdrop';
    if (this.isAbsolute && el.parentElement) {
      this.backdrop.classList.add('mtx-drawer__backdrop--absolute');
      el.parentElement.appendChild(this.backdrop);
    } else {
      document.body.appendChild(this.backdrop);
    }
    this._handleBackdrop = () => {
      if (!this.element.hasAttribute('data-disable-backdrop-click')) {
        this.close('backdropClick');
      }
    };
    this.listen(this.backdrop, 'click', this._handleBackdrop);
  }

  /**
   * Abre el drawer. No hace nada en modo permanente.
   */
  open() {
    if (this.isOpen) return;

    this._previousFocus = this._resolveReturnFocus();
    this._openTrigger = null;
    this.element.classList.add('mtx-drawer--animated', 'mtx-drawer--open');
    this.element.setAttribute('aria-hidden', 'false');
    this._syncTriggers(true);

    if (this.mode === 'persistent') {
      emit(this.element, 'mtx:drawer:open');
      return;
    }

    if (this.backdrop) {
      this.backdrop.classList.add('mtx-drawer__backdrop--open');
    }
    if (!this.isAbsolute) {
      addModal(this.element);
    }

    pushLayer(this, {
      kind: 'modal',
      nodes: () => [this.element, this.backdrop],
      stack: () => [{ node: this.element }, { node: this.backdrop, offset: -1 }],
      onEscape: () => {
        if (!this.element.hasAttribute('data-disable-escape')) this.close('escapeKeyDown');
      },
    });
    this._keydownCleanup = this._bindKeyboard();
    this._clickAwayCleanup = onClickAway(this.element, (event) => {
      // Interacción con una capa abierta desde el drawer (menú, popover, diálogo): no es "fuera".
      if (event && isInUpperLayer(this, event.target)) return;
      if (!this.element.hasAttribute('data-disable-backdrop-click')) {
        this.close('clickaway');
      }
    });

    focusFirst(this.panel, this.element.querySelector('[data-drawer-autofocus]'));
    emit(this.element, 'mtx:drawer:open');
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
   * Cierra el drawer. No hace nada en modo permanente.
   *
   * @param {string} [reason='programmatic'] Motivo del cierre.
   */
  close(reason = 'programmatic') {
    if (!this.isOpen || this.mode === 'permanent') return;

    this.element.classList.add('mtx-drawer--animated');
    this.element.classList.remove('mtx-drawer--open');
    this.element.setAttribute('aria-hidden', 'true');
    this._syncTriggers(false);

    if (this.mode !== 'persistent') {
      this._releaseModal();
    }

    this._openTrigger = null;
    if (this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus) {
      this._previousFocus.focus();
    }

    emit(this.element, 'mtx:drawer:close', { reason });
  }

  /**
   * Libera el fondo, el bloqueo de scroll y los listeners del modo temporal.
   */
  _releaseModal() {
    if (this.backdrop) {
      this.backdrop.classList.remove('mtx-drawer__backdrop--open');
    }
    if (!this.isAbsolute) {
      removeModal(this.element);
    }
    removeLayer(this);
    this._unbindModalListeners();
  }

  /**
   * Retira los listeners de documento del modo temporal (teclado y click-away). Idempotente.
   */
  _unbindModalListeners() {
    if (this._keydownCleanup) {
      this._keydownCleanup();
      this._keydownCleanup = null;
    }
    if (this._clickAwayCleanup) {
      this._clickAwayCleanup();
      this._clickAwayCleanup = null;
    }
  }

  /**
   * Alterna el estado abierto/cerrado del drawer.
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Devuelve los disparadores declarativos (`open` y `toggle`) asociados a este drawer.
   *
   * @returns {HTMLElement[]} Disparadores encontrados en el documento.
   */
  _getTriggers() {
    if (!this.element.id) return [];
    const id = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(this.element.id) : this.element.id;
    return Array.from(document.querySelectorAll(`[data-mtx-drawer-open="${id}"], [data-mtx-drawer-toggle="${id}"]`));
  }

  /**
   * Sincroniza `aria-controls`/`aria-expanded` de los disparadores y, en la variante
   * responsive, los oculta mientras el drawer es permanente.
   *
   * @param {boolean} [expanded=this.isOpen] Estado expandido.
   */
  syncTriggers(expanded = this.isOpen) {
    this._syncTriggers(expanded);
  }

  /**
   * @param {boolean} expanded Estado expandido.
   */
  _syncTriggers(expanded) {
    const hide = this.variant === 'responsive' && this.mode === 'permanent';
    this._getTriggers().forEach((trigger) => {
      trigger.setAttribute('aria-controls', this.element.id);
      trigger.setAttribute('aria-expanded', String(expanded));
      if (this.variant === 'responsive') {
        trigger.classList.toggle(HIDDEN_TRIGGER_CLASS, hide);
      }
    });
  }

  /**
   * Vincula el teclado (Tab trapping; Escape lo entrega la pila de capas).
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const onKeydown = (event) => {
      if (!isTopModal(this.element) && !this.isAbsolute) return;
      if (isInUpperLayer(this, document.activeElement)) return;
      if (event.key === 'Tab') {
        trapTab(event, this.panel);
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }

  /**
   * Cierra el drawer, libera listeners y media queries, retira el backdrop portado
   * y desvincula la instancia (no deshace el auto-scaffolding).
   */
  destroy() {
    if (this.isOpen && this.mode !== 'permanent') {
      this.close();
    }
    // Limpieza garantizada en cualquier modo (p. ej. tras un cambio responsive en caliente).
    this._unbindModalListeners();
    removeLayer(this);
    if (this._mql && this._onMediaChange) {
      this._getTriggers().forEach((trigger) => trigger.classList.remove(HIDDEN_TRIGGER_CLASS));
    }
    if (this.backdrop && this.backdrop.parentElement) {
      this.backdrop.remove();
    }
    super.destroy();
    this._mql = null;
    this._previousFocus = null;
    this._openTrigger = null;
  }
}

registerComponent('drawer', Drawer);

// Disparadores declarativos globales: open, close, toggle y submenús colapsables.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-mtx-drawer-open]');
    if (openTrigger) {
      const drawerEl = document.getElementById(openTrigger.getAttribute('data-mtx-drawer-open'));
      const instance = drawerEl ? getInstance(drawerEl) : null;
      if (instance) {
        instance._openTrigger = openTrigger;
        instance.open();
      }
      return;
    }

    // Cierre declarativo con id explícito (fuera del drawer)
    const closeTrigger = event.target.closest('[data-mtx-drawer-close]');
    if (closeTrigger) {
      const targetId = closeTrigger.getAttribute('data-mtx-drawer-close');
      if (targetId) {
        const drawerEl = document.getElementById(targetId);
        const instance = drawerEl ? getInstance(drawerEl) : null;
        if (instance) {
          instance.close('closeButtonClick');
        }
      }
      return;
    }

    const toggleTrigger = event.target.closest('[data-mtx-drawer-toggle]');
    if (toggleTrigger) {
      const drawerEl = document.getElementById(toggleTrigger.getAttribute('data-mtx-drawer-toggle'));
      const instance = drawerEl ? getInstance(drawerEl) : null;
      if (instance) {
        instance._openTrigger = toggleTrigger;
        instance.toggle();
      }
      return;
    }

    const collapseTrigger = event.target.closest('[data-mtx-collapse-trigger]');
    if (collapseTrigger) {
      const targetId = collapseTrigger.getAttribute('data-mtx-collapse-trigger');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const nextState = collapseTrigger.getAttribute('aria-expanded') !== 'true';
        collapseTrigger.setAttribute('aria-expanded', String(nextState));

        // Normaliza el indicador expand_more a chevron_right (rota 90° al abrir).
        const indicator = collapseTrigger.querySelector('.mtx-collapse-indicator');
        if (indicator && indicator.textContent.trim() === 'expand_more') {
          indicator.textContent = 'chevron_right';
        }

        if (nextState) {
          targetEl.removeAttribute('hidden');
          targetEl.removeAttribute('inert');
          targetEl.classList.remove('mtx-collapse--collapsing');
          void targetEl.offsetHeight;
          targetEl.classList.add('mtx-collapse--open');
        } else {
          // inert: sin foco ni árbol accesible durante la animación de cierre.
          targetEl.setAttribute('hidden', '');
          targetEl.setAttribute('inert', '');
          targetEl.classList.remove('mtx-collapse--open');
          targetEl.classList.add('mtx-collapse--collapsing');
          setTimeout(() => {
            if (targetEl.hasAttribute('hidden')) {
              targetEl.classList.remove('mtx-collapse--collapsing');
            }
          }, 250);
        }
      }
    }
  });
}
