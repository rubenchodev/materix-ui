import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, registerInstance } from '../../core/registry.js';
import { onClickAway } from '../../core/click-away-listener.js';
import { getPortalContainer } from '../../core/portal.js';
import { pushLayer, removeLayer, isInUpperLayer } from '../../core/layers.js';
import { positionDropdown, autoUpdate, isRtl } from '../../core/position.js';
import { t as _t, getComponentLocale } from '../../i18n/index.js';
import { uniqueId } from '../../core/id.js';


/** Colores de paleta admitidos en `data-color` (MUI). */
const SELECT_COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

const CHEVRON_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" ' +
  'focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';

/**
 * Representa un campo de selección de Materix UI.
 *
 * Sigue los patrones de interacción de bootstrap-select pero con estética
 * de Material Design y sin chips: el `<select>` nativo actúa como fuente de
 * verdad (oculto) y un menú desplegable propio muestra las opciones con
 * marca de verificación en las seleccionadas.
 *
 * Atributos `data-*`:
 * - `data-variant`: `outlined` (por defecto), `filled` o `standard`.
 * - `data-start-icon`: icono inicial del selector (clase `material-icons`).
 * - `data-helper-text`: texto de asistencia / error debajo del control.
 * - `data-color`: color de foco y selección (`primary`, `secondary`, `error`,
 *   `warning`, `info`, `success`).
 * - `data-search`: habilita una caja de búsqueda que filtra las opciones
 *   del menú (aplica a única y múltiple).
 * - `data-none-results-text` o `data-no-results-text`: texto cuando la búsqueda
 *   no produce coincidencias (`{0}` se sustituye por el término buscado).
 * - `data-actions-box`: añade botones "Seleccionar todo" y "Limpiar" en el
 *   menú (solo múltiple).
 * - `data-select-all-text`: texto del botón para seleccionar todo.
 * - `data-deselect-all-text` o `data-clear-all-text`: texto del botón para
 *   deseleccionar todo / limpiar.
 * - `data-header`: texto de cabecera dentro del menú.
 * - `data-max-options`: número máximo de opciones seleccionables (múltiple).
 * - `data-selected-text-format`: cómo mostrar la selección múltiple en el
 *   control: `values` (por defecto), `count`, `count > N` o `static`.
 * - `data-placeholder` o `title` del `<select>`: texto cuando no hay selección.
 * - `data-error`: estado de error. `data-disabled`: deshabilita el campo.
 * - `data-small` o `data-size="small"`: reduce la altura del control
 *   (`data-size="medium"` es el valor predeterminado).
 *
 * En los elementos `<option>`:
 * - `data-icon` o `data-image`: nombre del icono de Google Material Icons o
 *   URL/ruta de una imagen (PNG, SVG, WebP, etc.) a mostrar junto a la opción.
 *
 * Uso declarativo (múltiple con búsqueda y acciones):
 * ```html
 * <div class="mtx-select" data-mtx="select" data-search data-actions-box>
 *   <label class="mtx-select__label" for="sel">Habilidades</label>
 *   <div class="mtx-select__control">
 *     <select class="mtx-select__native" id="sel" multiple title="Elegir…">
 *       <option value="js" selected>JavaScript</option>
 *       <option value="ts">TypeScript</option>
 *     </select>
 *     <span class="mtx-select__chevron"></span>
 *   </div>
 * </div>
 * ```
 */
export class Select extends ComponentBase {
  /**
   * Crea una instancia del campo de selección.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    // Un <select> que ya vive en un wrapper (re-init tras destroy, BEM o `new Select(sel)` repetido)
    // reutiliza ese wrapper: así no se anida un control nuevo y se reemplaza la instancia previa.
    const existingRoot = element instanceof HTMLSelectElement && element.parentElement
      ? element.parentElement.closest('.mtx-select')
      : null;
    if (existingRoot) {
      element = existingRoot;
    } else if (element instanceof HTMLSelectElement) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mtx-select';

      // AGENTS §6.3: `class` se concatena para no perder la clase base del wrapper.
      Array.from(element.attributes).forEach(attr => {
        if (attr.name === 'class') {
          wrapper.className += ' ' + attr.value;
        } else if (attr.name.startsWith('data-') || attr.name === 'label') {
          wrapper.setAttribute(attr.name, attr.value);
        }
      });

      if (element.parentNode) {
        element.parentNode.insertBefore(wrapper, element);
      }
      wrapper.appendChild(element);
      element = wrapper;
    }

    super(element);

    this.select = element.querySelector('select') || (element instanceof HTMLSelectElement ? element : null);
    if (!this.select) throw new TypeError('Select requiere un elemento <select>.');

    // Auto-construir .mtx-select__control si no existe
    let control = element.querySelector('.mtx-select__control');
    if (!control) {
      control = document.createElement('div');
      control.className = 'mtx-select__control';
      this.select.parentNode.insertBefore(control, this.select);
      control.appendChild(this.select);
    }
    this.control = control;

    // Auto-construir .mtx-select__label si tiene data-label
    const labelText = element.getAttribute('data-label') || element.getAttribute('label') || this.select.getAttribute('data-label');
    let label = element.querySelector('.mtx-select__label');
    if (labelText && !label) {
      label = document.createElement('label');
      label.className = 'mtx-select__label';
      label.textContent = labelText;
      element.insertBefore(label, control);
    }
    this.label = label;

    this._id = element.id || uniqueId('mtx-select');
    if (!element.id) element.id = this._id;
    this.control.id = this.control.id || `${this._id}-control`;
    this.readOnly = element.hasAttribute('data-readonly') || this.select.hasAttribute('readonly');
    this.placeholder =
      element.getAttribute('data-placeholder') || this.select.getAttribute('title') || '';

    const variant = element.getAttribute('data-variant') || this.select.getAttribute('data-variant') || 'outlined';
    this.variant = variant;
    element.classList.add(`mtx-select--${variant}`);

    const color = element.getAttribute('data-color') || this.select.getAttribute('data-color');
    this.color = SELECT_COLORS.includes(color) ? color : 'primary';
    element.classList.add(`mtx-select--color-${this.color}`);
    // Alias histórico (`mtx-select--secondary`); `error` se omite para no forzar el estado de error.
    if (color && color !== 'error' && color !== 'primary') element.classList.add(`mtx-select--${color}`);

    if (element.hasAttribute('data-error') || this.select.hasAttribute('data-error')) {
      element.classList.add('mtx-select--error');
    }
    if (
      element.hasAttribute('data-small') ||
      element.getAttribute('data-size') === 'small' ||
      this.select.hasAttribute('data-small') ||
      this.select.getAttribute('data-size') === 'small'
    ) {
      element.classList.add('mtx-select--small');
    }
    if (element.hasAttribute('data-disabled') || this.select.disabled) {
      this.select.disabled = true;
    }

    // Helper text desde data-helper-text
    const helperText = element.getAttribute('data-helper-text') || this.select.getAttribute('data-helper-text');
    let helper = element.querySelector('.mtx-select__helper-text');
    if (!helper && helperText) {
      helper = document.createElement('div');
      helper.className = 'mtx-select__helper-text';
      helper.id = `${this._id}-helper-text`;
      helper.textContent = helperText;
      element.appendChild(helper);
    }
    this.helperTextElement = helper;

    this.searchEnabled = element.hasAttribute('data-search') || this.select.hasAttribute('data-search');
    this._noneResultsTextOverride =
      element.getAttribute('data-none-results-text') ||
      element.getAttribute('data-no-results-text') ||
      this.select.getAttribute('data-none-results-text') ||
      this.select.getAttribute('data-no-results-text') ||
      null;

    this.actionsBox = element.hasAttribute('data-actions-box') || this.select.hasAttribute('data-actions-box');
    this._selectAllTextOverride =
      element.getAttribute('data-select-all-text') ||
      this.select.getAttribute('data-select-all-text') ||
      null;
    this._deselectAllTextOverride =
      element.getAttribute('data-deselect-all-text') ||
      element.getAttribute('data-clear-all-text') ||
      this.select.getAttribute('data-deselect-all-text') ||
      this.select.getAttribute('data-clear-all-text') ||
      null;

    this.header = element.getAttribute('data-header') || this.select.getAttribute('data-header') || '';
    const maxOpts = element.getAttribute('data-max-options') || this.select.getAttribute('data-max-options');
    this.maxOptions = maxOpts ? parseInt(maxOpts, 10) : Infinity;
    this.textFormat = element.getAttribute('data-selected-text-format') || this.select.getAttribute('data-selected-text-format') || 'values';
    this._textFormatCount = this._parseCountFormat(this.textFormat);

    // Placeholder en selección única: sin opción marcada con `selected`, no se elige la primera.
    if (this.placeholder && !this.select.multiple
      && !Array.from(this.select.options).some((option) => option.defaultSelected)) {
      this.select.selectedIndex = -1;
    }

    this._stopAutoUpdate = null;
    this._openRaf = null;
    this._searchTimer = null;
    // Limpiezas garantizadas en `destroy()` (reposicionamiento, temporizadores y click-away).
    this.onDestroy(() => {
      this._unbindReposition();
      if (this._clickAwayCleanup) this._clickAwayCleanup();
      this._clickAwayCleanup = null;
      if (this._openRaf) cancelAnimationFrame(this._openRaf);
      this._openRaf = null;
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    });

    this._buildControl();
    this._buildMenu();
    this._bindEvents();
    this._sync();

    // El <select> interno también resuelve a esta instancia: `initAll` no lo re-envuelve.
    registerInstance(this.select, this);
    if (this.select.hasAttribute('data-mtx')) this.select.setAttribute('data-mtx-initialized', '');

    // Escuchar cambios globales de idioma
    this._handleLocaleChange = () => this._refreshI18nTexts();
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);
  }

  /**
   * Interpreta formatos como `count > 3`.
   *
   * @param {string} format Valor de `data-selected-text-format`.
   * @returns {number} Umbral o `Infinity` si no aplica.
   */
  _parseCountFormat(format) {
    const match = /^count\s*>\s*(\d+)$/.exec(format);
    return match ? parseInt(match[1], 10) : Infinity;
  }

  /**
   * Añade el chevron, adornments, outline y oculta el `<select>` nativo.
   */
  _buildControl() {
    // Icono inicial desde data-start-icon (soporta icono o imagen)
    const startIcon = this.element.getAttribute('data-start-icon') || this.select.getAttribute('data-start-icon');
    let startAdornment = this.control.querySelector('.mtx-select__adornment--start');
    if (!startAdornment && startIcon) {
      const isImage =
        /^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(startIcon) ||
        /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(startIcon);

      if (isImage) {
        startAdornment = document.createElement('img');
        startAdornment.className = 'mtx-select__adornment mtx-select__adornment--start mtx-select__adornment--image';
        startAdornment.src = startIcon;
        startAdornment.alt = '';
        startAdornment.setAttribute('aria-hidden', 'true');
      } else {
        startAdornment = document.createElement('span');
        startAdornment.className = 'mtx-select__adornment mtx-select__adornment--start material-icons';
        startAdornment.setAttribute('aria-hidden', 'true');
        startAdornment.textContent = startIcon;
      }
      this.control.insertBefore(startAdornment, this.control.firstChild);
    }
    if (startAdornment) {
      this.element.classList.add('mtx-select--adorned-start');
    }

    this.chevron = this.control.querySelector('.mtx-select__chevron');
    if (!this.chevron) {
      this.chevron = document.createElement('span');
      this.chevron.className = 'mtx-select__chevron';
      this.control.appendChild(this.chevron);
    }
    this.chevron.innerHTML = CHEVRON_SVG;

    this.display = this.control.querySelector('.mtx-select__display');
    if (!this.display) {
      this.display = document.createElement('span');
      this.display.className = 'mtx-select__display';
      this.control.insertBefore(this.display, this.chevron);
    }

    this.select.classList.add('mtx-select__native');
    this.select.setAttribute('tabindex', '-1');
    this.select.setAttribute('aria-hidden', 'true');

    if (this.variant === 'outlined') {
      this._buildOutline();
    }
  }

  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label (NotchedOutline canónico de MUI).
   */
  _buildOutline() {
    if (this.control.querySelector('.mtx-select__outline')) return;

    const outline = document.createElement('fieldset');
    outline.className = 'mtx-select__outline';
    outline.setAttribute('aria-hidden', 'true');

    const hasLabel =
      this.label &&
      !this.element.classList.contains('mtx-select--hidden-label') &&
      !this.element.hasAttribute('data-hidden-label');

    if (hasLabel) {
      const legend = document.createElement('legend');
      legend.className = 'mtx-select__legend';

      const span = document.createElement('span');
      span.textContent = this.label.textContent;
      legend.appendChild(span);
      outline.appendChild(legend);
    }

    this.control.appendChild(outline);
    this.outline = outline;
  }

  /**
   * Construye el menú desplegable (cabecera, búsqueda, acciones, opciones).
   */
  _buildMenu() {
    // Re-init: retira el menú que la instancia anterior devolvió al contenedor.
    Array.from(this.element.children)
      .filter((child) => child.classList.contains('mtx-select__menu'))
      .forEach((child) => child.remove());
    this.menu = document.createElement('div');
    this.menu.className = `mtx-select__menu mtx-select__menu--color-${this.color}`;
    this.menu.id = `${this._id}-listbox`;
    this.menu.setAttribute('role', 'listbox');
    if (this.select.multiple) this.menu.setAttribute('aria-multiselectable', 'true');

    if (this.header) {
      const header = document.createElement('div');
      header.className = 'mtx-select__header';
      header.textContent = this.header;
      this.menu.appendChild(header);
    }

    if (this.searchEnabled) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'mtx-select__search-wrap';
      this.search = document.createElement('input');
      this.search.type = 'text';
      this.search.className = 'mtx-select__search';
      const locale = getComponentLocale(this.element);
      this.search.setAttribute('placeholder', _t('select', 'searchPlaceholder', null, 'Search…', locale));
      this.search.setAttribute('aria-label', _t('select', 'searchAriaLabel', null, 'Search options', locale));
      searchWrap.appendChild(this.search);
      this.menu.appendChild(searchWrap);
    }

    if (this.actionsBox && this.select.multiple) {
      const actions = document.createElement('div');
      actions.className = 'mtx-select__actions';
      const locale = getComponentLocale(this.element);

      const selectAll = document.createElement('button');
      selectAll.type = 'button';
      selectAll.className = 'mtx-select__action mtx-select__action--select-all';
      selectAll.textContent = this._selectAllTextOverride || _t('select', 'selectAllText', null, 'Select all', locale);
      selectAll.addEventListener('click', () => this._selectAll());

      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'mtx-select__action mtx-select__action--deselect-all';
      clear.textContent = this._deselectAllTextOverride || _t('select', 'deselectAllText', null, 'Deselect all', locale);
      clear.addEventListener('click', () => this._clearAll());

      actions.append(selectAll, clear);
      this.menu.appendChild(actions);
    }

    this.optgroups = [];
    this.optionItems = [];
    const walk = (parent) => {
      Array.from(parent.children).forEach((child) => {
        if (child.tagName === 'OPTGROUP') {
          const header = document.createElement('div');
          header.className = 'mtx-select__optgroup';
          header.textContent = child.label || '';
          this.menu.appendChild(header);
          this.optgroups.push({ header, options: [] });
          walk(child);
        } else if (child.tagName === 'OPTION') {
          const item = document.createElement('div');
          item.className = 'mtx-select__option';
          item.setAttribute('role', 'option');
          item.tabIndex = -1;
          item.dataset.value = child.value;
          item._mtxOption = child;
          const optionDisabled = child.disabled || Boolean(child.closest('optgroup:disabled'));
          item.classList.toggle('mtx-select__option--disabled', optionDisabled);
          if (optionDisabled) item.setAttribute('aria-disabled', 'true');

          if (this.select.multiple) {
            const check = document.createElement('span');
            check.className = 'mtx-select__check';
            item.appendChild(check);
          }

          const optionMedia = child.getAttribute('data-icon') || child.getAttribute('data-image');
          if (optionMedia) {
            const mediaNode = this._createIconOrImage(optionMedia, 'mtx-select__option');
            if (mediaNode) item.appendChild(mediaNode);
          }

          const text = document.createElement('span');
          text.className = 'mtx-select__option-text';
          text.textContent = child.text;
          item.appendChild(text);
          this.menu.appendChild(item);
          this.optionItems.push(item);

          if (this.optgroups.length) this.optgroups[this.optgroups.length - 1].options.push(item);
        }
      });
    };
    walk(this.select);

    this.noResults = document.createElement('div');
    this.noResults.className = 'mtx-select__no-results';
    this.noResults.hidden = true;
    this.menu.appendChild(this.noResults);

    this.menu.hidden = true;
    this.element.appendChild(this.menu);
  }

  /**
   * Vincula los eventos de control, menú y búsqueda.
   */
  _bindEvents() {
    this.control.setAttribute('role', 'combobox');
    this.control.setAttribute('aria-haspopup', 'listbox');
    this.control.setAttribute('aria-controls', this.menu.id);
    this.control.setAttribute('aria-expanded', 'false');
    if (this.label) {
      if (!this.label.id) this.label.id = `${this._id}-label`;
      this.control.setAttribute('aria-labelledby', this.label.id);
    } else if (this.select.getAttribute('aria-label')) {
      this.control.setAttribute('aria-label', this.select.getAttribute('aria-label'));
    }
    this._syncAccessibility();

    this._handleControlClick = (event) => {
      if (this.select.disabled) return;
      event.preventDefault();
      this._toggleOpen();
    };
    this._handleControlKeydown = (event) => {
      if (this.select.disabled || this.readOnly) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ') {
        event.preventDefault();
        this._setOpen(true);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this._toggleOpen();
      }
    };
    this._handleMenuClick = (event) => {
      const option = event.target.closest('.mtx-select__option');
      if (option) this._onOptionClick(option);
    };
    this._handleMenuKeydown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this._moveFocus(event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        const active = document.activeElement;
        if (active && active.classList.contains('mtx-select__option')) {
          event.preventDefault();
          this._onOptionClick(active);
        }
      } else if (event.key === 'Tab') {
        // Escape lo entrega la pila de capas (cierra y devuelve el foco al control).
        this._setOpen(false);
      }
    };
    this._handleSearchInput = this._debounce((event) => {
      this._filterOptions(event.target.value);
    }, 150);

    this.control.addEventListener('click', this._handleControlClick);
    this.control.addEventListener('keydown', this._handleControlKeydown);
    this.menu.addEventListener('click', this._handleMenuClick);
    this.menu.addEventListener('keydown', this._handleMenuKeydown);
    if (this.search) this.search.addEventListener('input', this._handleSearchInput);
    this._handleSelectChange = () => this._sync();
    this.select.addEventListener('change', this._handleSelectChange);
  }

  /**
   * Valor(es) seleccionado(s).
   *
   * @returns {string|string[]} Valor único o lista de valores.
   */
  get value() {
    if (this.select.multiple) {
      return Array.from(this.select.selectedOptions).map((o) => o.value);
    }
    return this.select.value;
  }

  /**
   * Establece el valor seleccionado.
   *
   * @param {string|string[]} value Valor único o lista de valores.
   */
  set value(value) {
    if (this.select.multiple) {
      const values = (Array.isArray(value) ? value : [value]).map(String);
      Array.from(this.select.options).forEach((option) => {
        option.selected = values.includes(option.value);
      });
    } else {
      const single = Array.isArray(value) ? value[0] : value;
      const match = Array.from(this.select.options).find((option) => option.value === String(single ?? ''));
      if (match) match.selected = true;
      else this.select.selectedIndex = -1;
    }
    this._sync();
  }

  /**
   * Indica si la selección es múltiple.
   *
   * @returns {boolean} `true` si es múltiple.
   */
  get multiple() {
    return this.select.multiple;
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.select.disabled;
  }

  /** Deshabilita el componente y cierra el menú. */
  disable() {
    this.select.disabled = true;
    this.close();
    this._syncAccessibility();
  }

  /** Habilita el componente. */
  enable() {
    this.select.disabled = false;
    this._syncAccessibility();
  }

  /** Enfoca el combobox visible. */
  focus() {
    this.control.focus();
  }

  /**
   * Abre el menú desplegable.
   */
  open() {
    if (this.select.disabled || this.readOnly) return;
    this._setOpen(true);
  }

  /**
   * Cierra el menú desplegable.
   */
  close() {
    this._setOpen(false);
  }

  /**
   * Alterna la apertura del menú.
   */
  _toggleOpen() {
    this._setOpen(!this.element.classList.contains('mtx-select--open'));
  }

  /**
   * Abre o cierra el menú desplegable.
   *
   * @param {boolean} open `true` para abrir.
   */
  _setOpen(open) {
    if (open && (this.select.disabled || this.readOnly)) return;
    if (open === this.element.classList.contains('mtx-select--open')) return;
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this.element.classList.toggle('mtx-select--open', open);
    this.control.setAttribute('aria-expanded', String(open));

    if (open) {
      if (this.menu.parentElement !== getPortalContainer()) {
        getPortalContainer().appendChild(this.menu);
      }
      this.menu.hidden = false;
      this._positionMenu();
      this.menu.style.opacity = '0';
      this.menu.style.transform = 'scale(0.85, 0.85)';

      if (this._openRaf) cancelAnimationFrame(this._openRaf);
      this._openRaf = requestAnimationFrame(() => {
        this._openRaf = null;
        this.menu.style.transition =
          'transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 225ms cubic-bezier(0, 0, 0.2, 1)';
        this.menu.style.opacity = '1';
        this.menu.style.transform = 'scale(1, 1)';
      });

      this._clickAwayCleanup = onClickAway(this.control, (event) => {
        if (this.menu && this.menu.contains(event.target)) return;
        if (isInUpperLayer(this, event.target)) return;
        this._setOpen(false);
      });
      pushLayer(this, {
        kind: 'popup',
        nodes: this.menu,
        stack: [{ node: getPortalContainer() }],
        onEscape: () => {
          this._setOpen(false);
          this.control.focus();
        },
      });
      this._bindReposition();
      this._focusInitial();
    } else {
      this.menu.style.opacity = '0';
      this.menu.style.transform = 'scale(0.85, 0.85)';
      this._closeTimer = setTimeout(() => {
        this.menu.hidden = true;
        if (this.menu.parentElement) this.menu.parentElement.removeChild(this.menu);
        if (this.element) this.element.appendChild(this.menu);
        this._closeTimer = null;
      }, 225);
      if (this._openRaf) cancelAnimationFrame(this._openRaf);
      this._openRaf = null;
      if (this._clickAwayCleanup) this._clickAwayCleanup();
      this._clickAwayCleanup = null;
      this._unbindReposition();
      removeLayer(this);
    }
  }

  /**
   * Posiciona el menú dentro del viewport y lo invierte cuando hay más
   * espacio disponible sobre el control.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   */
  _positionMenu({ keepSide = false } = {}) {
    if (!keepSide) {
      this._rtl = isRtl(this.control);
      // El menú portado conserva la dirección del contexto del control.
      this.menu.setAttribute('dir', this._rtl ? 'rtl' : 'ltr');
    }
    const result = positionDropdown(this.control, this.menu, {
      placement: 'bottom-start',
      offset: 4,
      padding: 16,
      matchWidth: true,
      rtl: this._rtl,
      // Las recolocaciones (scroll, filtrado) mantienen el lado elegido al abrir.
      lockSide: keepSide ? this._side : undefined,
    });
    this._side = result.side;
  }

  /**
   * Reposiciona el menú al hacer scroll o resize; lo cierra si el control
   * queda fuera del viewport.
   */
  _handleReposition = () => {
    if (!this.element.classList.contains('mtx-select--open')) return;
    const rect = this.control.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      this._setOpen(false);
      return;
    }
    this._positionMenu({ keepSide: true });
  };

  /**
   * Reposiciona el menú abierto ante scroll, resize o cambios de tamaño (`autoUpdate`).
   */
  _bindReposition() {
    this._unbindReposition();
    let initial = true;
    // `autoUpdate` ejecuta el callback al empezar; `_setOpen()` ya posicionó el menú.
    this._stopAutoUpdate = autoUpdate(this.control, this.menu, () => {
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
    if (this._stopAutoUpdate) {
      this._stopAutoUpdate();
      this._stopAutoUpdate = null;
    }
  }

  /**
   * Enfoca la búsqueda (si existe) o la primera opción seleccionada.
   */
  _focusInitial() {
    if (this.search && this.searchEnabled) {
      this.search.focus();
      return;
    }
    const options = Array.from(this.menu.querySelectorAll('.mtx-select__option')).filter(
      (option) => !option.classList.contains('mtx-select__option--disabled')
        && !option.classList.contains('mtx-select__option--hidden')
    );
    const selected = Array.from(this.select.selectedOptions);
    const target = options.find((option) => option._mtxOption && selected.includes(option._mtxOption)) || options[0];
    if (target) target.focus();
  }

  /**
   * Maneja el clic en una opción.
   *
   * @param {HTMLElement} option Elemento `.mtx-select__option`.
   */
  _onOptionClick(option) {
    if (this.readOnly || option.classList.contains('mtx-select__option--disabled')) return;
    const native = option._mtxOption || this._findOption(option.dataset.value);
    if (!native || native.disabled || (native.parentElement.tagName === 'OPTGROUP' && native.parentElement.disabled)) return;

    if (this.select.multiple) {
      const selectedCount = this.select.selectedOptions.length;
      if (!native.selected && selectedCount >= this.maxOptions) return;
      native.selected = !native.selected;
    } else {
      native.selected = true;
    }
    this._sync();
    this.select.dispatchEvent(new Event('change', { bubbles: true }));

    if (!this.select.multiple) {
      this._setOpen(false);
      this.control.focus();
    }
  }

  /**
   * Selecciona todas las opciones disponibles (solo múltiple).
   */
  _selectAll() {
    if (!this.select.multiple || this.readOnly || this.select.disabled) return;
    let selected = 0;
    Array.from(this.select.options).forEach((option) => {
      const disabled = option.disabled
        || (option.parentElement.tagName === 'OPTGROUP' && option.parentElement.disabled);
      option.selected = !disabled && selected < this.maxOptions;
      if (option.selected) selected += 1;
    });
    this._sync();
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Limpia todas las opciones seleccionadas (solo múltiple).
   */
  _clearAll() {
    if (!this.select.multiple || this.readOnly || this.select.disabled) return;
    Array.from(this.select.options).forEach((o) => {
      o.selected = false;
    });
    this._sync();
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Mueve el foco entre las opciones del menú.
   *
   * @param {number} step Dirección (`1` abajo, `-1` arriba).
   */
  _moveFocus(step) {
    const options = Array.from(this.menu.querySelectorAll('.mtx-select__option')).filter(
      (option) => !option.classList.contains('mtx-select__option--disabled')
        && !option.classList.contains('mtx-select__option--hidden')
    );
    if (!options.length) return;
    const current = document.activeElement;
    let index = options.indexOf(current);
    index += step;
    if (index < 0) index = options.length - 1;
    if (index >= options.length) index = 0;
    options[index].focus();
  }

  /**
   * Busca el `<option>` nativo cuyo valor coincide.
   *
   * @param {string} value Valor a buscar.
   * @returns {HTMLOptionElement|undefined} Opción encontrada.
   */
  _findOption(value) {
    return Array.from(this.select.options).find((o) => o.value === value);
  }

  /**
   * Filtra las opciones del menú según el texto de búsqueda.
   *
   * @param {string} term Texto a buscar.
   */
  _filterOptions(term) {
    const query = (term || '').toLowerCase().trim();
    let hasMatches = false;
    this.optionItems.forEach((item) => {
      const matches = !query || item.dataset.searchable.includes(query);
      item.classList.toggle('mtx-select__option--hidden', !matches);
      if (matches) hasMatches = true;
    });
    this.optgroups.forEach((group) => {
      const visible = group.options.some(
        (item) => !item.classList.contains('mtx-select__option--hidden')
      );
      group.header.classList.toggle('mtx-select__optgroup--hidden', !visible);
    });

    if (this.noResults) {
      if (!hasMatches && query) {
        const locale = getComponentLocale(this.element);
        const template = this._noneResultsTextOverride || _t('select', 'noneResultsText', null, 'No results found for "{0}"', locale);
        const text = template.includes('{0}')
          ? template.replace('{0}', term)
          : template;
        this.noResults.textContent = text;
        this.noResults.hidden = false;
      } else {
        this.noResults.hidden = true;
      }
    }
  }

  /**
   * Sincroniza la interfaz con el estado del select nativo.
   */
  _sync() {
    this._syncAccessibility();
    this._renderDisplay();
    this._syncMenu();
  }

  /** Sincroniza estado ARIA y tabulación con el select nativo. */
  _syncAccessibility() {
    const disabled = this.select.disabled;
    this.control.tabIndex = disabled ? -1 : 0;
    this.control.setAttribute('aria-disabled', String(disabled));
    if (this.readOnly) this.control.setAttribute('aria-readonly', 'true');
    else this.control.removeAttribute('aria-readonly');
    if (this.select.required) this.control.setAttribute('aria-required', 'true');
    else this.control.removeAttribute('aria-required');
    const invalid = this.element.classList.contains('mtx-select--error')
      || this.select.getAttribute('aria-invalid') === 'true';
    if (invalid) this.control.setAttribute('aria-invalid', 'true');
    else this.control.removeAttribute('aria-invalid');

    let describedBy = this.select.getAttribute('aria-describedby') || '';
    if (this.helperTextElement) {
      if (!describedBy) {
        describedBy = this.helperTextElement.id;
      } else if (!describedBy.split(/\s+/).includes(this.helperTextElement.id)) {
        describedBy = `${describedBy} ${this.helperTextElement.id}`;
      }
    }
    if (describedBy) this.control.setAttribute('aria-describedby', describedBy);
    else this.control.removeAttribute('aria-describedby');
  }

  /**
   * Texto de ayuda o soporte del selector.
   *
   * @returns {string} Texto actual.
   */
  get helperText() {
    return this.helperTextElement ? this.helperTextElement.textContent : '';
  }

  /**
   * Actualiza el texto de ayuda o soporte del selector.
   *
   * @param {string} text Nuevo texto.
   */
  set helperText(text) {
    if (!this.helperTextElement && text) {
      this.helperTextElement = document.createElement('div');
      this.helperTextElement.className = 'mtx-select__helper-text';
      this.helperTextElement.id = `${this._id}-helper-text`;
      this.element.appendChild(this.helperTextElement);
    }
    if (this.helperTextElement) {
      this.helperTextElement.textContent = text;
      if (!text) {
        this.helperTextElement.remove();
        this.helperTextElement = null;
      }
    }
    this._syncAccessibility();
  }

  /**
   * Actualiza el texto mostrado en el control.
   */
  _renderDisplay() {
    const selected = Array.from(this.select.options).filter((option) => option.selected);
    let text = this.placeholder;
    let media = null;
    let empty = !selected.length;

    if (this.select.multiple) {
      if (selected.length) {
        if (this.textFormat === 'static') {
          text = this.placeholder;
        } else if (this.textFormat === 'count') {
          const locale = getComponentLocale(this.element);
          const key = selected.length === 1 ? 'selectedCountSingular' : 'selectedCountPlural';
          text = _t('select', key, [selected.length], `${selected.length} selected`, locale);
        } else if (this.textFormat === 'values' || selected.length <= this._textFormatCount) {
          text = selected.map((o) => o.text).join(', ');
        } else {
          const locale = getComponentLocale(this.element);
          text = _t('select', 'selectedCountPlural', [selected.length], `${selected.length} selected`, locale);
        }
      }
    } else if (selected[0]) {
      const current = selected[0];
      // Una opción con valor vacío se trata como "sin selección" si hay placeholder.
      if (current.value === '' && this.placeholder) {
        empty = true;
      } else {
        text = current.text;
        media = current.getAttribute('data-icon') || current.getAttribute('data-image');
      }
    }

    this.display.innerHTML = '';
    if (media) {
      const mediaNode = this._createIconOrImage(media, 'mtx-select__display');
      if (mediaNode) this.display.appendChild(mediaNode);
    }
    // El texto va siempre en su propio span para que funcione el ellipsis.
    const textSpan = document.createElement('span');
    textSpan.className = 'mtx-select__display-text';
    textSpan.textContent = text;
    this.display.appendChild(textSpan);
    this.display.classList.toggle('mtx-select__display--empty', empty);
  }

  /**
   * Actualiza el estado de las opciones del menú y aplica `data-max-options`.
   */
  _syncMenu() {
    if (!this.menu) return;
    const selected = Array.from(this.select.selectedOptions);
    const reachedLimit = this.select.multiple && selected.length >= this.maxOptions;

    Array.from(this.menu.querySelectorAll('.mtx-select__option')).forEach((item) => {
      const native = item._mtxOption || this._findOption(item.dataset.value);
      const isSelected = Boolean(native && native.selected);
      item.classList.toggle('mtx-select__option--selected', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
      if (item.dataset.searchable === undefined && native) {
        item.dataset.searchable = (native.text + ' ' + native.value).toLowerCase();
      }

      const nativeDisabled = Boolean(native && (
        native.disabled
        || (native.parentElement.tagName === 'OPTGROUP' && native.parentElement.disabled)
      ));
      const disabled = nativeDisabled || (reachedLimit && !isSelected);
      item.classList.toggle('mtx-select__option--disabled', disabled);
      if (disabled) item.setAttribute('aria-disabled', 'true');
      else item.removeAttribute('aria-disabled');
    });
  }

  /**
   * Retrasa la ejecución de una función hasta que pase un tiempo sin llamadas.
   * El temporizador vive en `_searchTimer` para cancelarlo en `destroy()`.
   *
   * @param {Function} fn Función a ejecutar.
   * @param {number} wait Milisegundos de espera.
   * @returns {Function} Función con debounce.
   */
  _debounce(fn, wait) {
    return (...args) => {
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => {
        this._searchTimer = null;
        fn.apply(this, args);
      }, wait);
    };
  }

  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    removeLayer(this);
    this.control.removeEventListener('click', this._handleControlClick);
    this.control.removeEventListener('keydown', this._handleControlKeydown);
    this.menu.removeEventListener('click', this._handleMenuClick);
    this.menu.removeEventListener('keydown', this._handleMenuKeydown);
    if (this.search) this.search.removeEventListener('input', this._handleSearchInput);
    this.select.removeEventListener('change', this._handleSelectChange);
    if (this._closeTimer) clearTimeout(this._closeTimer);
    this._closeTimer = null;
    // Devuelve el menú portado a <body> a su contenedor original.
    if (this.menu && this.element && this.menu.parentElement !== this.element) {
      this.menu.hidden = true;
      this.element.appendChild(this.menu);
    }
    this.element.classList.remove('mtx-select--open');
    if (this.control) this.control.setAttribute('aria-expanded', 'false');
    super.destroy();
  }

  /**
   * Refresca los textos del componente cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const locale = getComponentLocale(this.element);

    // Actualizar placeholder y aria-label del campo de búsqueda
    if (this.search) {
      this.search.setAttribute('placeholder', _t('select', 'searchPlaceholder', null, 'Search…', locale));
      this.search.setAttribute('aria-label', _t('select', 'searchAriaLabel', null, 'Search options', locale));
    }

    // Actualizar botones de acciones
    if (this.actionsBox && this.select.multiple) {
      const selectAllBtn = this.menu.querySelector('.mtx-select__action--select-all');
      const deselectAllBtn = this.menu.querySelector('.mtx-select__action--deselect-all');
      if (selectAllBtn && !this._selectAllTextOverride) {
        selectAllBtn.textContent = _t('select', 'selectAllText', null, 'Select all', locale);
      }
      if (deselectAllBtn && !this._deselectAllTextOverride) {
        deselectAllBtn.textContent = _t('select', 'deselectAllText', null, 'Deselect all', locale);
      }
    }

    // Refrescar texto de visualización (para el caso de count)
    this._renderDisplay();
  }

  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(src) {
    return typeof src === 'string' && (
      /^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(src) ||
      /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(src)
    );
  }

  /**
   * Crea un nodo visual (icono tipográfico de Material Icons o etiqueta <img>)
   * dependiendo de si el valor es una URL/ruta de imagen o un nombre de icono.
   *
   * @param {string} value Nombre de icono o ruta/URL de imagen.
   * @param {string} prefix Prefijo de clase BEM.
   * @returns {HTMLElement|null} Elemento span o img creado.
   * @private
   */
  _createIconOrImage(value, prefix) {
    if (!value) return null;
    if (this._isImageUrl(value)) {
      const img = document.createElement('img');
      img.className = `${prefix}-image`;
      img.src = value;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      return img;
    }

    const span = document.createElement('span');
    span.className = `${prefix}-icon material-icons`;
    span.setAttribute('aria-hidden', 'true');
    span.textContent = value;
    return span;
  }
}

registerComponent('select', Select);