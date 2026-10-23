import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance } from '../../core/registry.js';
import { IconButton } from '../icon-button/icon-button.js';
import { t, getComponentLocale } from '../../i18n/index.js';

/**
 * Representa una barra de aplicación (AppBar) de Materix UI.
 *
 * Sigue la especificación de `AppBar` y `Toolbar` de Material UI (MUI).
 * Proporciona estructura de cabecera fija, estática o pegajosa para navegación y acciones.
 *
 * Atributos `data-*`:
 * - `data-position`: `fixed` (por defecto), `static`, `sticky`, `absolute`, `relative`.
 * - `data-color`: `primary`, `secondary`, `default` (paper), `transparent`, `inherit`.
 * - `data-elevation`: número de 0 a 24 (4 por defecto; 0 añade `--flat`).
 * - `data-drawer`: id del Drawer que alterna el icono de navegación generado.
 *
 * Uso declarativo:
 * ```html
 * <header class="mtx-app-bar mtx-app-bar--fixed mtx-app-bar--primary" data-mtx="app-bar">
 *   <div class="mtx-toolbar">
 *     <span>Título</span>
 *   </div>
 * </header>
 * ```
 */
export class AppBar extends ComponentBase {
  /**
   * Crea una instancia de AppBar.
   *
   * @param {HTMLElement} element Elemento HTML asociado.
   */
  constructor(element) {
    super(element);

    this._autoScaffold();

    if (!element.classList.contains('mtx-app-bar')) {
      element.classList.add('mtx-app-bar');
    }

    const position = element.getAttribute('data-position') || 'fixed';
    if (!element.classList.contains(`mtx-app-bar--${position}`)) {
      element.classList.add(`mtx-app-bar--${position}`);
    }

    let color = element.getAttribute('data-color');
    if (!color) {
      if (element.classList.contains('mtx-app-bar--primary')) color = 'primary';
      else if (element.classList.contains('mtx-app-bar--secondary')) color = 'secondary';
      else if (element.classList.contains('mtx-app-bar--inherit')) color = 'inherit';
      else if (element.classList.contains('mtx-app-bar--transparent')) color = 'transparent';
      else color = 'default';
    }
    
    if (!element.classList.contains(`mtx-app-bar--${color}`)) {
      element.classList.add(`mtx-app-bar--${color}`);
    }

    const elevation = element.getAttribute('data-elevation');
    const hasElevation = elevation !== null && elevation !== '' && !isNaN(Number(elevation));
    this.defaultElevation = hasElevation ? Number(elevation) : 4;
    this.isElevated = true;

    // La sombra se expone como variable para que --transparent / --flat puedan anularla.
    if (element.hasAttribute('data-elevate-on-scroll')) {
      this._setShadow(false);
      this.isElevated = false;
    } else if (hasElevation) {
      if (this.defaultElevation === 0) {
        element.classList.add('mtx-app-bar--flat');
      }
      this._setShadow(true);
    }

    this.hideOnScroll = element.hasAttribute('data-hide-on-scroll');
    this.elevateOnScroll = element.hasAttribute('data-elevate-on-scroll');
    
    if (this.hideOnScroll || this.elevateOnScroll) {
      this._bindScroll();
    }

    this._enableTransitions();
  }

  /**
   * Activa las transiciones tras el primer frame pintado, para que el estado
   * inicial (color, tema, elevación) no se anime al cargar la página.
   */
  _enableTransitions() {
    const element = this.element;
    if (typeof requestAnimationFrame !== 'function') {
      element.classList.add('mtx-app-bar--animated');
      return;
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        if (!this.destroyed) element.classList.add('mtx-app-bar--animated');
      });
    });
    this.onDestroy(() => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    });
  }

  /**
   * Auto-construye la estructura interna de la AppBar si se usa la sintaxis simplificada.
   * Por ejemplo: <header data-mtx="app-bar" data-title="Noticias" data-start-icon="menu"></header>
   */
  _autoScaffold() {
    // Si ya tiene un toolbar, asumimos sintaxis BEM completa
    if (this.element.querySelector('.mtx-toolbar')) {
      return;
    }

    const title = this.element.getAttribute('data-title');
    const startIcon = this.element.getAttribute('data-start-icon');
    const endIcon = this.element.getAttribute('data-end-icon');
    const dense = this.element.hasAttribute('data-dense');

    if (!title && !startIcon && !endIcon && !this.element.hasChildNodes()) {
      return; // No hay datos para scaffold
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'mtx-toolbar';
    if (dense) toolbar.classList.add('mtx-toolbar--dense');

    const locale = getComponentLocale(this.element);
    if (startIcon) {
      const drawerId = this.element.getAttribute('data-drawer');
      const fallbackLabel = startIcon === 'menu' || drawerId
        ? t('appBar', 'openNavigation', null, 'Open navigation', locale)
        : startIcon;
      const label = this.element.getAttribute('data-start-icon-label') || fallbackLabel;
      const btn = this._createIconButton(startIcon, label, 'mtx-toolbar__navigation-icon');
      if (drawerId) {
        btn.setAttribute('data-mtx-drawer-toggle', drawerId);
        btn.setAttribute('aria-controls', drawerId);
        btn.setAttribute('aria-expanded', 'false');
      }
      toolbar.appendChild(btn);
      this._drawerId = drawerId;
    }

    if (title) {
      const span = document.createElement('span');
      span.className = 'mtx-toolbar__title';
      span.textContent = title;
      toolbar.appendChild(span);
    } else if (startIcon && endIcon && !this.element.hasChildNodes()) {
      // Si no hay título y no hay hijos, pero hay icono inicial y final, empujar al final
      const spacer = document.createElement('div');
      spacer.className = 'mtx-toolbar__spacer';
      toolbar.appendChild(spacer);
    }

    // Mover hijos existentes al toolbar (por ejemplo botones de texto como "LOGIN")
    while (this.element.firstChild) {
      toolbar.appendChild(this.element.firstChild);
    }

    if (endIcon) {
      const label = this.element.getAttribute('data-end-icon-label') || endIcon;
      toolbar.appendChild(this._createIconButton(endIcon, label));
    }

    this.element.appendChild(toolbar);

    // Si el Drawer ya se inicializó antes que la barra, sincroniza su nuevo disparador.
    if (this._drawerId) {
      const drawerEl = document.getElementById(this._drawerId);
      const drawer = drawerEl ? getInstance(drawerEl) : null;
      if (drawer && typeof drawer.syncTriggers === 'function') drawer.syncTriggers();
    }
  }

  /**
   * Fija la sombra de la barra mediante la variable `--mtx-app-bar-shadow`.
   *
   * @param {boolean} elevated `true` para aplicar la elevación configurada.
   */
  _setShadow(elevated) {
    this.element.style.setProperty(
      '--mtx-app-bar-shadow',
      elevated ? `var(--mtx-elevation-${this.defaultElevation})` : 'none'
    );
  }

  /**
   * Crea un IconButton de la Toolbar con su `aria-label`.
   *
   * @param {string} icon Nombre del icono de Material Icons.
   * @param {string} label Etiqueta accesible.
   * @param {string} [extraClass] Clase adicional.
   * @returns {HTMLButtonElement} Botón inicializado.
   */
  _createIconButton(icon, label, extraClass) {
    const btn = document.createElement('button');
    btn.className = extraClass ? `mtx-icon-button ${extraClass}` : 'mtx-icon-button';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-mtx', 'icon-button');
    const iconEl = document.createElement('span');
    iconEl.className = 'material-icons';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = icon;
    btn.appendChild(iconEl);
    new IconButton(btn);
    return btn;
  }

  /**
   * Obtiene la posición vertical de scroll según el objetivo configurado.
   *
   * @returns {number} Posición vertical de scroll en píxeles.
   */
  _getScrollY() {
    if (this._scrollTarget && this._scrollTarget !== window) {
      return this._scrollTarget.scrollTop;
    }
    return window.scrollY || document.documentElement.scrollTop;
  }

  /**
   * Vincula el evento de scroll.
   */
  _bindScroll() {
    const targetSelector = this.element.getAttribute('data-scroll-target');
    this._scrollTarget = targetSelector ? (document.querySelector(targetSelector) || window) : window;

    this._lastScrollY = this._getScrollY();
    this._ticking = false;

    this._handleScroll = () => {
      this._scrollFrame = 0;
      if (this.destroyed) return;
      const currentScrollY = this._getScrollY();

      if (this.elevateOnScroll) {
        const shouldElevate = currentScrollY > 0;
        if (shouldElevate && !this.isElevated) {
          this._setShadow(true);
          this.isElevated = true;
        } else if (!shouldElevate && this.isElevated) {
          this._setShadow(false);
          this.isElevated = false;
        }
      }

      if (this.hideOnScroll) {
        if (currentScrollY > this._lastScrollY && currentScrollY > 50) {
          // Scrolling down
          this.element.classList.add('mtx-app-bar--hidden');
        } else if (currentScrollY < this._lastScrollY) {
          // Scrolling up
          this.element.classList.remove('mtx-app-bar--hidden');
        }
      }

      this._lastScrollY = currentScrollY;
      this._ticking = false;
    };

    this._onScroll = () => {
      if (!this._ticking) {
        this._scrollFrame = window.requestAnimationFrame(this._handleScroll);
        this._ticking = true;
      }
    };

    this.listen(this._scrollTarget, 'scroll', this._onScroll, { passive: true });
    this.onDestroy(() => {
      if (this._scrollFrame) window.cancelAnimationFrame(this._scrollFrame);
      this._scrollFrame = 0;
    });
  }

  /**
   * Cambia la posición de la barra de aplicación.
   *
   * @param {'fixed' | 'static' | 'sticky' | 'absolute' | 'relative'} position Nueva posición.
   */
  setPosition(position) {
    ['fixed', 'static', 'sticky', 'absolute', 'relative'].forEach((pos) => {
      this.element.classList.remove(`mtx-app-bar--${pos}`);
    });
    this.element.classList.add(`mtx-app-bar--${position}`);
  }

  /**
   * Cambia el color de la barra de aplicación.
   *
   * @param {'primary' | 'secondary' | 'default' | 'transparent' | 'inherit'} color Nuevo color.
   */
  setColor(color) {
    ['primary', 'secondary', 'default', 'transparent', 'inherit'].forEach((c) => {
      this.element.classList.remove(`mtx-app-bar--${c}`);
    });
    this.element.classList.add(`mtx-app-bar--${color}`);
  }
}

registerComponent('app-bar', AppBar);
