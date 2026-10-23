import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, registerInstance, initElement } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit } from '../../core/events.js';
import '../link/link.js';

/** Icono MoreHoriz de MUI (24×16) del botón de colapso. */
const MORE_HORIZ_SVG =
  '<svg class="mtx-breadcrumbs__collapse-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
  '<path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>';

/** Nombre de icono Material: minúsculas, dígitos y guion bajo (3+ caracteres). */
const ICON_NAME_PATTERN = /^[a-z][a-z0-9_]{2,}$/;

/**
 * Lee un entero no negativo de un atributo.
 *
 * @param {HTMLElement} element Elemento origen.
 * @param {string} name Atributo.
 * @param {number} fallback Valor por defecto.
 * @returns {number} Entero leído.
 */
function readInteger(element, name, fallback) {
  const value = Number.parseInt(element.getAttribute(name), 10);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/**
 * Representa una ruta de navegación (Breadcrumbs) de Materix UI.
 *
 * Sigue `Breadcrumbs` de MUI: `<nav>` + `<ol>`, separadores ocultos al lector
 * de pantalla, último ítem con `aria-current="page"` y colapso con botón
 * "Mostrar ruta" cuando hay más de `data-max-items` ítems.
 *
 * Uso declarativo:
 * ```html
 * <ol data-mtx="breadcrumbs">
 *   <li><a href="/">Inicio</a></li>
 *   <li>Facturas</li>
 * </ol>
 * ```
 */
export class Breadcrumbs extends ComponentBase {
  /**
   * Crea la instancia y normaliza la estructura.
   *
   * @param {HTMLElement} element `<ol>`, `<ul>`, `<nav>` o contenedor de enlaces.
   */
  constructor(element) {
    super(element);
    this.source = element;
    this._expanded = false;
    this._maxItems = readInteger(element, 'data-max-items', 8);
    this._itemsBefore = readInteger(element, 'data-items-before-collapse', 1);
    this._itemsAfter = readInteger(element, 'data-items-after-collapse', 1);
    this._separator = element.getAttribute('data-separator') || '/';

    this._buildStructure();
    this._items = Array.from(this.list.children).filter(
      (li) => !li.classList.contains('mtx-breadcrumbs__separator') && !li.classList.contains('mtx-breadcrumbs__collapsed')
    );
    this._itemData = this._items.map((li) => this._normalizeItem(li));
    this._ensureCurrent();

    this._handleClick = (event) => this._onClick(event);
    this.list.addEventListener('click', this._handleClick);
    this._handleLocaleChange = () => this._refreshTexts();
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this._render();
  }

  /** @returns {boolean} `true` si la ruta está expandida por el usuario. */
  get expanded() {
    return this._expanded;
  }

  /** @returns {number} Máximo de ítems visibles antes de colapsar. */
  get maxItems() {
    return this._maxItems;
  }

  /** @param {number} value Nuevo máximo de ítems visibles. */
  set maxItems(value) {
    this._maxItems = Math.max(0, Number.parseInt(value, 10) || 0);
    this._render();
  }

  /**
   * Devuelve una copia de los ítems actuales.
   *
   * @returns {Array<{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}>} Ítems.
   */
  getItems() {
    return this._itemData.map((item) => ({ ...item, data: { ...item.data } }));
  }

  /**
   * Reemplaza la ruta completa (navegación dinámica / SPA).
   *
   * @param {Array<{label: string, href?: string, icon?: string, current?: boolean, data?: Object}>} items Ítems nuevos.
   * @throws {TypeError} Si `items` no es un array.
   */
  setItems(items) {
    if (!Array.isArray(items)) throw new TypeError('Breadcrumbs.setItems espera un array de ítems.');
    const explicitCurrent = items.some((item) => item && item.current === true);
    this._items = items.map((raw, index) => {
      const item = raw || {};
      const current = explicitCurrent ? item.current === true : index === items.length - 1;
      return this._createItem({ ...item, current });
    });
    this._itemData = this._items.map((li) => this._normalizeItem(li));
    this._expanded = false;
    this._render();
  }

  /**
   * Muestra todos los ítems ocultos por el colapso.
   *
   * @param {boolean} [focus=false] Mueve el foco al primer ítem revelado.
   */
  expand(focus = false) {
    if (this._expanded) return;
    this._expanded = true;
    this._render();
    if (focus) {
      const revealed = this._items[this._itemsBefore];
      const target = (revealed && revealed.querySelector('a[href], button:not(:disabled)'))
        || this.list.querySelector('a[href], button:not(:disabled), [tabindex]');
      if (target) target.focus();
    }
    emit(this.element, 'mtx:breadcrumbs:expand');
  }

  /** Vuelve a aplicar el colapso definido por `data-max-items`. */
  collapse() {
    if (!this._expanded) return;
    this._expanded = false;
    this._render();
  }

  /** Elimina los listeners instalados. */
  destroy() {
    this.list.removeEventListener('click', this._handleClick);
    super.destroy();
  }

  /**
   * Crea `<nav>` + `<ol>` a partir del elemento original.
   */
  _buildStructure() {
    const source = this.source;
    const locale = getComponentLocale(source);
    let nav;
    let list;

    if (source.tagName === 'OL' || source.tagName === 'UL') {
      nav = source.closest('nav.mtx-breadcrumbs') || document.createElement('nav');
      if (!nav.contains(source)) {
        source.parentNode.insertBefore(nav, source);
        nav.appendChild(source);
      }
      list = source;
      ['aria-label', 'aria-labelledby'].forEach((attr) => {
        if (source.hasAttribute(attr)) {
          nav.setAttribute(attr, source.getAttribute(attr));
          source.removeAttribute(attr);
        }
      });
      Array.from(source.classList).forEach((cls) => {
        if (cls === 'mtx-breadcrumbs' || cls.startsWith('mtx-breadcrumbs--')) {
          source.classList.remove(cls);
          if (cls !== 'mtx-breadcrumbs') nav.className += ` ${cls}`;
        }
      });
    } else {
      nav = source;
      list = source.querySelector(':scope > ol, :scope > ul');
      if (!list) {
        list = document.createElement('ol');
        Array.from(source.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const li = document.createElement('li');
            li.appendChild(node);
            list.appendChild(li);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const li = document.createElement('li');
            li.textContent = node.textContent.trim();
            list.appendChild(li);
            node.remove();
          } else {
            node.remove();
          }
        });
        source.appendChild(list);
      }
      if (nav.tagName !== 'NAV' && !nav.hasAttribute('role')) nav.setAttribute('role', 'navigation');
    }

    nav.classList.add('mtx-breadcrumbs');
    list.classList.add('mtx-breadcrumbs__ol');
    this._autoLabel = !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby');
    if (this._autoLabel) nav.setAttribute('aria-label', t('breadcrumbs', 'label', null, 'breadcrumb', locale));

    this.element = nav;
    this.list = list;
    if (nav !== source) registerInstance(nav, this);
  }

  /**
   * Normaliza un `<li>` existente y devuelve sus datos.
   *
   * @param {HTMLLIElement} li Ítem.
   * @returns {{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}} Datos del ítem.
   */
  _normalizeItem(li) {
    li.classList.add('mtx-breadcrumbs__li');
    let content = li.querySelector(':scope > a, :scope > button, :scope > span, :scope > .mtx-breadcrumbs__text');
    if (!content) {
      content = document.createElement('span');
      content.className = 'mtx-breadcrumbs__text';
      content.textContent = li.textContent.trim();
      li.textContent = '';
      li.appendChild(content);
    }

    if (content.tagName === 'A' || content.tagName === 'BUTTON') {
      content.classList.add('mtx-breadcrumbs__link');
      if (!content.hasAttribute('data-mtx') && !content.classList.contains('mtx-link')) {
        if (!content.hasAttribute('data-color')) content.setAttribute('data-color', 'inherit');
        if (!content.hasAttribute('data-underline')) content.setAttribute('data-underline', 'hover');
        content.setAttribute('data-mtx', 'link');
      }
      if (content.getAttribute('data-mtx') === 'link') initElement(content);
    } else {
      content.classList.add('mtx-breadcrumbs__text');
    }

    const icon = content.getAttribute('data-icon') || li.getAttribute('data-icon');
    if (icon && !content.querySelector('.mtx-breadcrumbs__icon')) {
      const iconEl = document.createElement('span');
      iconEl.className = 'mtx-breadcrumbs__icon material-icons';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.textContent = icon;
      content.insertBefore(iconEl, content.firstChild);
    }
    if (content.querySelector('.mtx-breadcrumbs__icon')) content.classList.add('mtx-breadcrumbs__item--with-icon');

    const labelClone = content.cloneNode(true);
    labelClone.querySelectorAll('.mtx-breadcrumbs__icon, .mtx-ripple-container').forEach((node) => node.remove());
    const data = {};
    Object.keys(content.dataset).forEach((key) => {
      if (!['mtx', 'mtxInitialized', 'color', 'underline', 'icon'].includes(key)) data[key] = content.dataset[key];
    });

    this._contentOf = this._contentOf || new WeakMap();
    this._contentOf.set(li, content);
    return {
      label: labelClone.textContent.trim(),
      href: content.getAttribute('href'),
      icon: icon || null,
      current: content.getAttribute('aria-current') === 'page',
      data,
    };
  }

  /**
   * Construye un `<li>` desde un objeto de `setItems()`.
   *
   * @param {{label: string, href?: string, icon?: string, current: boolean, data?: Object}} item Datos.
   * @returns {HTMLLIElement} Ítem creado.
   */
  _createItem(item) {
    const li = document.createElement('li');
    let content;
    if (item.href != null && item.href !== '') {
      content = document.createElement('a');
      content.href = item.href;
    } else if (item.current) {
      content = document.createElement('span');
    } else {
      content = document.createElement('button');
      content.type = 'button';
    }
    content.textContent = item.label == null ? '' : String(item.label);
    if (item.icon) content.setAttribute('data-icon', item.icon);
    if (item.current) content.setAttribute('aria-current', 'page');
    if (item.data && typeof item.data === 'object') {
      Object.entries(item.data).forEach(([key, value]) => {
        if (value != null) content.dataset[key] = String(value);
      });
    }
    li.appendChild(content);
    return li;
  }

  /** Marca el último ítem como página actual si ninguno lo está. */
  _ensureCurrent() {
    if (!this._items.length || this._itemData.some((item) => item.current)) return;
    const lastIndex = this._items.length - 1;
    this._contentOf.get(this._items[lastIndex]).setAttribute('aria-current', 'page');
    this._itemData[lastIndex].current = true;
  }

  /**
   * Crea un separador oculto a tecnologías de asistencia.
   *
   * @returns {HTMLLIElement} Separador.
   */
  _createSeparator() {
    const li = document.createElement('li');
    li.className = 'mtx-breadcrumbs__separator';
    li.setAttribute('aria-hidden', 'true');
    if (ICON_NAME_PATTERN.test(this._separator)) {
      const icon = document.createElement('span');
      icon.className = 'material-icons';
      icon.textContent = this._separator;
      li.appendChild(icon);
    } else {
      li.textContent = this._separator;
    }
    return li;
  }

  /**
   * Crea el ítem con el botón que expande la ruta.
   *
   * @returns {HTMLLIElement} Ítem colapsado.
   */
  _createCollapsed() {
    const li = document.createElement('li');
    li.className = 'mtx-breadcrumbs__collapsed';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mtx-breadcrumbs__collapse-button';
    button.setAttribute('aria-label', this._showPathLabel());
    button.innerHTML = MORE_HORIZ_SVG;
    button.addEventListener('click', () => this.expand(true));
    li.appendChild(button);
    this._collapseButton = button;
    return li;
  }

  /** @returns {string} Texto accesible del botón de colapso. */
  _showPathLabel() {
    return this.source.getAttribute('data-expand-label')
      || t('breadcrumbs', 'showPath', null, 'Show path', getComponentLocale(this.element));
  }

  /** Pinta los ítems visibles, separadores y colapso. */
  _render() {
    const items = this._items;
    const total = items.length;
    let visible = items;
    const canCollapse = this._itemsBefore + this._itemsAfter < total;
    if (!this._expanded && this._maxItems > 0 && total > this._maxItems && canCollapse) {
      visible = [
        ...items.slice(0, this._itemsBefore),
        this._createCollapsed(),
        ...items.slice(total - this._itemsAfter),
      ];
    } else {
      this._collapseButton = null;
    }
    const nodes = [];
    visible.forEach((node, index) => {
      if (index > 0) nodes.push(this._createSeparator());
      nodes.push(node);
    });
    this.list.replaceChildren(...nodes);
    this.element.classList.toggle('mtx-breadcrumbs--collapsed', Boolean(this._collapseButton));
  }

  /**
   * Emite `mtx:breadcrumbs:navigate` al activar un enlace (cancelable).
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(event) {
    const link = event.target.closest('a, button');
    if (!link || !this.list.contains(link) || link.classList.contains('mtx-breadcrumbs__collapse-button')) return;
    const li = link.closest('.mtx-breadcrumbs__li');
    const index = this._items.indexOf(li);
    if (index < 0) return;
    const item = this._itemData[index];
    const allowed = emit(this.element, 'mtx:breadcrumbs:navigate', {
      index,
      href: item.href,
      label: item.label,
      current: item.current,
      item: { ...item, data: { ...item.data } },
      originalEvent: event,
    }, { cancelable: true });
    if (!allowed) event.preventDefault();
  }

  /** Actualiza los textos traducidos al cambiar el idioma. */
  _refreshTexts() {
    const locale = getComponentLocale(this.element);
    if (this._autoLabel) this.element.setAttribute('aria-label', t('breadcrumbs', 'label', null, 'breadcrumb', locale));
    if (this._collapseButton) this._collapseButton.setAttribute('aria-label', this._showPathLabel());
  }
}

registerComponent('breadcrumbs', Breadcrumbs);
