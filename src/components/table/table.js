import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, initAll, getInstance } from '../../core/registry.js';
import { t as _t, getComponentLocale, updateLocale, getDictionary } from '../../i18n/index.js';
import { uniqueId } from '../../core/id.js';
import { emit } from '../../core/events.js';

/** Textos por defecto de selección y toolbar; los diccionarios centrales tienen prioridad. */
const TABLE_STRINGS = {
  en: {
    selectAllRows: 'Select all rows',
    selectRow: 'Select {0}',
    selectedCountSingular: '{0} selected',
    selectedCountPlural: '{0} selected',
    toolbar: 'Table toolbar',
  },
  es: {
    selectAllRows: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar {0}',
    selectedCountSingular: '{0} seleccionado',
    selectedCountPlural: '{0} seleccionados',
    toolbar: 'Barra de herramientas de la tabla',
  },
};
Object.entries(TABLE_STRINGS).forEach(([code, strings]) => {
  const current = (getDictionary(code) || {}).table || {};
  const missing = Object.fromEntries(Object.entries(strings).filter(([key]) => current[key] === undefined));
  if (Object.keys(missing).length) updateLocale(code, { table: missing });
});

/** Selector de celdas de selección (checkbox) creadas por el usuario o por la tabla. */
const SELECTION_CELL = '.mtx-table-cell--padding-checkbox, .mtx-table-cell--checkbox, [data-padding="checkbox"]';

/** Elementos interactivos que no deben alternar la fila al hacer clic. */
const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [role="menuitem"], [contenteditable=""], [contenteditable="true"], .mtx-checkbox';

const SORT_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">' +
  '<path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>';

/** Contador de claves internas de fila (no son ids del DOM). */
let rowKeyCounter = 0;

/**
 * Indica si un atributo booleano declarativo está activo.
 *
 * @param {HTMLElement} element Elemento.
 * @param {string} name Atributo.
 * @returns {boolean} `true` si existe y no vale `false`.
 */
const hasFlag = (element, name) => element.hasAttribute(name) && element.getAttribute(name) !== 'false';

/**
 * Aplica las clases de alineación y relleno declaradas en una celda.
 *
 * @param {HTMLTableCellElement} cell Celda.
 */
const decorateCell = (cell) => {
  cell.classList.add('mtx-table-cell');
  const align = cell.getAttribute('data-align');
  const padding = cell.getAttribute('data-padding');
  if (align) cell.classList.add(`mtx-table-cell--${align}`);
  if (padding) cell.classList.add(`mtx-table-cell--padding-${padding}`);
  if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
    const section = cell.parentElement && cell.parentElement.parentElement;
    if (section && section.tagName === 'THEAD') cell.scope = 'col';
    else if (section && section.tagName === 'TBODY') cell.scope = 'row';
  }
};

/**
 * Familia de tablas de Materix UI.
 *
 * Registra los elementos: `table`, `table-container`, `table-head`,
 * `table-body`, `table-footer`, `table-row`, `table-cell`,
 * `table-sort-label`, `table-pagination` y `table-toolbar`.
 *
 * `Table` estiliza por descendencia secciones, filas y celdas (incluidas las
 * añadidas tras la inicialización, gracias a un `MutationObserver`) y ofrece
 * selección de filas opcional con `data-selectable`.
 *
 * Uso declarativo:
 * ```html
 * <div data-mtx="table-container">
 *   <table data-mtx="table" data-selectable>
 *     <thead><tr><th>Nombre</th></tr></thead>
 *     <tbody><tr data-id="1"><td>Ana</td></tr></tbody>
 *   </table>
 * </div>
 * ```
 */
export class Table extends ComponentBase {
  /**
   * Crea una instancia de la tabla.
   *
   * @param {HTMLTableElement} element Elemento `<table>` asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table');
    const container = element.closest('.mtx-table-container, [data-mtx="table-container"]');
    if (hasFlag(element, 'data-sticky-header') || (container && hasFlag(container, 'data-sticky-header'))) {
      element.classList.add('mtx-table--sticky-header');
    }
    if (element.getAttribute('data-size') === 'small' || element.hasAttribute('data-dense')) {
      element.classList.add('mtx-table--small');
    }
    this.hover = hasFlag(element, 'data-hover');
    if (this.hover) element.classList.add('mtx-table--hover');

    this.selectable = hasFlag(element, 'data-selectable');
    this.selectOnClick = this.selectable && hasFlag(element, 'data-select-on-click');
    if (this.selectable) element.classList.add('mtx-table--selectable');

    /** @type {Set<string>} */
    this._selected = new Set();
    /** @type {WeakMap<HTMLTableRowElement, string>} */
    this._rowKeys = new WeakMap();
    /** @type {WeakSet<HTMLTableRowElement>} */
    this._seenRows = new WeakSet();
    /** @type {WeakSet<HTMLInputElement>} */
    this._autoLabelled = new WeakSet();

    this._handleChange = (event) => this._onChange(event);
    this._handleClick = (event) => this._onRowClick(event);
    this._handleLocaleChange = () => this._refreshLabels();
    this.listen(element, 'change', this._handleChange);
    this.listen(element, 'click', this._handleClick);
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this.refresh();

    if (typeof MutationObserver !== 'undefined') {
      this._observer = new MutationObserver(() => this._scheduleRefresh());
      this._observe();
    }
  }

  /** @returns {string[]} Claves (`data-id`) de las filas seleccionadas. */
  get selected() {
    return Array.from(this._selected);
  }

  /** @param {string[]} keys Claves a seleccionar (reemplaza la selección). */
  set selected(keys) {
    this._replaceSelection(new Set((keys || []).map(String)), 'api');
  }

  /**
   * Devuelve las filas del DOM actualmente seleccionadas.
   *
   * @returns {HTMLTableRowElement[]} Filas seleccionadas presentes en la tabla.
   */
  getSelectedRows() {
    return this._bodyRows().filter((row) => this._selected.has(this._keyOf(row)));
  }

  /**
   * Indica si una fila (o clave) está seleccionada.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @returns {boolean} `true` si está seleccionada.
   */
  isSelected(rowOrKey) {
    return this._selected.has(this._resolveKey(rowOrKey));
  }

  /**
   * Alterna la selección de una fila.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @param {boolean} [force] Estado forzado.
   */
  toggleRow(rowOrKey, force) {
    this._toggleKey(this._resolveKey(rowOrKey), force, 'api');
  }

  /** Selecciona todas las filas habilitadas del cuerpo. */
  selectAll() {
    this._setAll(true, 'api');
  }

  /** Vacía la selección completa (también claves de filas que ya no están en el DOM). */
  clearSelection() {
    this._replaceSelection(new Set(), 'api');
  }

  /**
   * Vuelve a aplicar clases, celdas de selección y estado a todas las filas.
   * Se ejecuta automáticamente cuando cambian las filas.
   */
  refresh() {
    this._refreshQueued = false;
    const observing = Boolean(this._observer);
    if (observing) this._observer.disconnect();
    try {
      this._decorate();
      if (this.selectable) this._syncSelection(true);
    } finally {
      if (observing) this._observe();
    }
  }

  /** Elimina listeners y el observador. */
  destroy() {
    if (this._observer) this._observer.disconnect();
    this._observer = null;
    this._refreshQueued = false;
    super.destroy();
  }

  /** Inicia la observación de filas y celdas. */
  _observe() {
    this._observer.observe(this.element, { childList: true, subtree: true });
  }

  /** Agrupa varias mutaciones en un único `refresh()`. */
  _scheduleRefresh() {
    if (this._refreshQueued) return;
    this._refreshQueued = true;
    queueMicrotask(() => {
      if (this._refreshQueued && !this.destroyed) this.refresh();
    });
  }

  /** Aplica clases BEM a leyenda, secciones, filas y celdas. */
  _decorate() {
    const table = this.element;
    if (table.caption) table.caption.classList.add('mtx-table-caption');
    if (table.tHead) table.tHead.classList.add('mtx-table-head');
    Array.from(table.tBodies).forEach((body) => body.classList.add('mtx-table-body'));
    if (table.tFoot) table.tFoot.classList.add('mtx-table-footer');
    Array.from(table.rows).forEach((row) => {
      row.classList.add('mtx-table-row');
      const inBody = row.parentElement && row.parentElement.tagName === 'TBODY';
      if (this.hover && inBody) row.classList.add('mtx-table-row--hover');
      if (this.selectable) this._ensureSelectionCell(row);
      Array.from(row.cells).forEach(decorateCell);
    });
  }

  /** @returns {HTMLTableRowElement[]} Filas de todos los `<tbody>`. */
  _bodyRows() {
    return Array.from(this.element.tBodies).flatMap((body) => Array.from(body.rows));
  }

  /**
   * Obtiene (o asigna) la clave estable de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {string} Clave de `data-id` o generada.
   */
  _keyOf(row) {
    const id = row.getAttribute('data-id');
    if (id !== null && id !== '') return id;
    if (!this._rowKeys.has(row)) this._rowKeys.set(row, `mtx-row-${++rowKeyCounter}`);
    return this._rowKeys.get(row);
  }

  /** @param {HTMLTableRowElement|string} rowOrKey Fila o clave. @returns {string} Clave. */
  _resolveKey(rowOrKey) {
    return rowOrKey && rowOrKey.nodeType === 1 ? this._keyOf(rowOrKey) : String(rowOrKey);
  }

  /**
   * Busca la celda de selección (primera celda con checkbox) de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {HTMLTableCellElement|null} Celda encontrada.
   */
  _selectionCell(row) {
    const first = row.cells[0];
    return first && first.matches(SELECTION_CELL) ? first : null;
  }

  /** @param {HTMLTableRowElement} row Fila. @returns {HTMLInputElement|null} Checkbox de la fila. */
  _rowInput(row) {
    const cell = this._selectionCell(row);
    return cell ? cell.querySelector('input[type="checkbox"]') : null;
  }

  /**
   * Indica si la fila participa en la selección.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {boolean} `true` si es seleccionable.
   */
  _isSelectableRow(row) {
    return !hasFlag(row, 'data-no-select') && Boolean(this._rowInput(row));
  }

  /**
   * Inserta la celda de checkbox en una fila si aún no la tiene.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _ensureSelectionCell(row) {
    const section = row.parentElement ? row.parentElement.tagName : '';
    if (this._selectionCell(row)) {
      if (section === 'TBODY') this._readInitialState(row);
      return;
    }
    // Fila de ancho completo (una celda con colspan): amplía el colspan en lugar de añadir celda.
    if (section === 'TBODY' && row.cells.length === 1 && row.cells[0].colSpan > 1) {
      if (!this._seenRows.has(row)) row.cells[0].colSpan += 1;
      this._seenRows.add(row);
      return;
    }
    // data-no-select: celda vacía para conservar la alineación de columnas, sin casilla.
    const excluded = section === 'TBODY' && hasFlag(row, 'data-no-select');
    const isHead = section === 'THEAD';
    const headRows = isHead ? row.parentElement.rows : null;
    const withInput = (section === 'TBODY' && !excluded) || (isHead && headRows[headRows.length - 1] === row);
    const cell = document.createElement(isHead ? 'th' : 'td');
    cell.className = 'mtx-table-cell mtx-table-cell--padding-checkbox';
    cell.setAttribute('data-padding', 'checkbox');
    if (withInput) {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('data-mtx', 'checkbox');
      this._autoLabelled.add(input);
      cell.appendChild(input);
    }
    if (isHead) cell.scope = 'col';
    row.insertBefore(cell, row.cells[0] || null);
    if (cell.firstChild) {
      this._labelInput(cell.firstChild, row, isHead);
      initAll(cell);
    }
    if (section === 'TBODY' && !excluded) this._readInitialState(row);
    if (excluded) this._seenRows.add(row);
  }

  /**
   * Toma `data-selected` de una fila vista por primera vez.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _readInitialState(row) {
    if (this._seenRows.has(row)) return;
    this._seenRows.add(row);
    const input = this._rowInput(row);
    if (hasFlag(row, 'data-selected') || row.classList.contains('mtx-table-row--selected') || (input && input.checked)) {
      if (!this._initialKeys) this._initialKeys = new Set();
      this._initialKeys.add(this._keyOf(row));
    }
  }

  /**
   * Asigna el nombre accesible traducido a un checkbox autogenerado.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {HTMLTableRowElement} row Fila.
   * @param {boolean} isHead Es la casilla de cabecera.
   */
  _labelInput(input, row, isHead) {
    const locale = getComponentLocale(this.element);
    if (isHead) {
      input.setAttribute('aria-label', _t('table', 'selectAllRows', null, 'Select all rows', locale));
      return;
    }
    const explicit = row.getAttribute('data-label');
    const firstCell = Array.from(row.cells).find((cell) => !cell.matches(SELECTION_CELL));
    const text = (explicit || (firstCell ? firstCell.textContent : '') || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const name = text || String(row.sectionRowIndex + 1);
    input.setAttribute('aria-label', _t('table', 'selectRow', [name], `Select ${name}`, locale));
  }

  /** Actualiza los nombres accesibles autogenerados tras un cambio de idioma. */
  _refreshLabels() {
    Array.from(this.element.rows).forEach((row) => {
      const cell = this._selectionCell(row);
      const input = cell && cell.querySelector('input[type="checkbox"]');
      if (input && this._autoLabelled.has(input)) this._labelInput(input, row, row.parentElement.tagName === 'THEAD');
    });
  }

  /**
   * Gestiona los cambios de las casillas de cabecera y de fila.
   *
   * @param {Event} event Evento `change`.
   */
  _onChange(event) {
    if (!this.selectable) return;
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') return;
    const row = input.closest('tr');
    if (!row || row.closest('table') !== this.element || this._rowInput(row) !== input) return;
    const section = row.parentElement.tagName;
    if (section === 'THEAD') this._setAll(input.checked, 'user');
    else if (section === 'TBODY') this._toggleKey(this._keyOf(row), input.checked, 'user');
  }

  /**
   * Alterna la fila al hacer clic en ella cuando `data-select-on-click` está activo.
   *
   * @param {MouseEvent} event Evento `click`.
   */
  _onRowClick(event) {
    if (!this.selectOnClick || event.defaultPrevented) return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest(INTERACTIVE)) return;
    const row = target.closest('tr');
    if (!row || row.closest('table') !== this.element || row.parentElement.tagName !== 'TBODY') return;
    const input = this._rowInput(row);
    if (!input || input.disabled || hasFlag(row, 'data-no-select')) return;
    this._toggleKey(this._keyOf(row), undefined, 'user');
  }

  /**
   * Selecciona o deselecciona todas las filas habilitadas del DOM.
   *
   * @param {boolean} value Nuevo estado.
   * @param {string} reason Motivo del cambio.
   */
  _setAll(value, reason) {
    const next = new Set(this._selected);
    this._bodyRows().forEach((row) => {
      const input = this._rowInput(row);
      if (!this._isSelectableRow(row) || input.disabled) return;
      if (value) next.add(this._keyOf(row));
      else next.delete(this._keyOf(row));
    });
    this._replaceSelection(next, reason);
  }

  /**
   * Cambia el estado de una clave.
   *
   * @param {string} key Clave.
   * @param {boolean} [force] Estado forzado.
   * @param {string} reason Motivo.
   */
  _toggleKey(key, force, reason) {
    const next = new Set(this._selected);
    const value = force === undefined ? !next.has(key) : Boolean(force);
    if (value) next.add(key);
    else next.delete(key);
    this._replaceSelection(next, reason);
  }

  /**
   * Sustituye la selección y emite `mtx:table:selection-change` si cambió.
   *
   * @param {Set<string>} next Nueva selección.
   * @param {string} reason Motivo.
   */
  _replaceSelection(next, reason) {
    const changed = next.size !== this._selected.size || Array.from(next).some((key) => !this._selected.has(key));
    this._selected = next;
    this._syncSelection(false);
    if (changed) this._emitSelection(reason);
  }

  /**
   * Refleja la selección en filas, casillas y cabecera.
   *
   * @param {boolean} fromRefresh Incorpora el estado inicial de filas nuevas.
   */
  _syncSelection(fromRefresh) {
    if (!this.selectable) return;
    if (fromRefresh && this._initialKeys) {
      const added = Array.from(this._initialKeys).filter((key) => !this._selected.has(key));
      this._initialKeys = null;
      if (added.length) {
        added.forEach((key) => this._selected.add(key));
        this._syncSelection(false);
        this._emitSelection('refresh');
        return;
      }
    }
    let enabled = 0;
    let checked = 0;
    this._bodyRows().forEach((row) => {
      const input = this._rowInput(row);
      if (!input) return;
      const selected = this._selected.has(this._keyOf(row));
      row.classList.toggle('mtx-table-row--selected', selected);
      row.setAttribute('aria-selected', String(selected));
      this._setInput(input, selected, false);
      if (!input.disabled && !hasFlag(row, 'data-no-select')) {
        enabled += 1;
        if (selected) checked += 1;
      }
    });
    if (this.element.tHead) {
      Array.from(this.element.tHead.rows).forEach((row) => {
        const input = this._rowInput(row);
        if (!input) return;
        this._setInput(input, enabled > 0 && checked === enabled, checked > 0 && checked < enabled);
        input.disabled = enabled === 0;
      });
    }
  }

  /**
   * Fija el estado de una casilla usando su instancia si existe.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {boolean} checked Marcada.
   * @param {boolean} indeterminate Indeterminada.
   */
  _setInput(input, checked, indeterminate) {
    const instance = getInstance(input);
    if (instance && 'checked' in instance && 'indeterminate' in instance) {
      if (instance.checked !== checked) instance.checked = checked;
      if (instance.indeterminate !== indeterminate) instance.indeterminate = indeterminate;
      return;
    }
    input.checked = checked;
    input.indeterminate = indeterminate;
    if (indeterminate) input.setAttribute('aria-checked', 'mixed');
    else input.removeAttribute('aria-checked');
  }

  /** @param {string} reason Motivo del cambio. */
  _emitSelection(reason) {
    const selected = this.selected;
    emit(this.element, 'mtx:table:selection-change',
      { selected, rows: this.getSelectedRows(), count: selected.length, reason });
  }
}

/** Contenedor con scroll de la tabla (MUI TableContainer). */
export class TableContainer extends ComponentBase {
  /**
   * Crea una instancia del contenedor de tabla.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-container');
    const maxHeight = element.getAttribute('data-max-height');
    if (maxHeight) {
      element.style.maxHeight = /^\d+(\.\d+)?$/.test(maxHeight) ? `${maxHeight}px` : maxHeight;
      element.classList.add('mtx-table-container--scroll');
    }
    if (hasFlag(element, 'data-sticky-header')) {
      element.classList.add('mtx-table-container--sticky');
      const table = element.querySelector('table');
      if (table) table.classList.add('mtx-table--sticky-header');
    }

    // Región con scroll accesible por teclado (WCAG 2.1.1, axe scrollable-region-focusable).
    this._ownsTabindex = !element.hasAttribute('tabindex');
    this._syncScrollRegion();
    if (this._ownsTabindex && typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(() => this._syncScrollRegion());
      observer.observe(element);
      this.onDestroy(() => observer.disconnect());
    }
  }

  /**
   * Indica si el contenedor desplaza contenido (altura máxima o desbordamiento real).
   *
   * @returns {boolean} `true` si hay scroll.
   */
  get scrollable() {
    const el = this.element;
    return this.element.classList.contains('mtx-table-container--scroll')
      || el.scrollWidth > el.clientWidth + 1
      || el.scrollHeight > el.clientHeight + 1;
  }

  /** Hace enfocable y nombra el contenedor solo mientras tiene scroll. */
  _syncScrollRegion() {
    const { element } = this;
    if (!this._ownsTabindex) return;
    if (!this.scrollable) {
      if (this._regionApplied) {
        element.removeAttribute('tabindex');
        this._regionApplied = false;
      }
      return;
    }
    if (this._regionApplied) return;
    this._regionApplied = true;
    element.tabIndex = 0;
    if (element.hasAttribute('role')) return;
    element.setAttribute('role', 'region');
    if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) return;
    const table = element.querySelector('table');
    const caption = table && table.querySelector('caption');
    if (caption && caption.textContent.trim()) {
      if (!caption.id) caption.id = uniqueId('mtx-table-caption');
      element.setAttribute('aria-labelledby', caption.id);
    } else if (table && table.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-labelledby', table.getAttribute('aria-labelledby'));
    } else if (table && table.getAttribute('aria-label')) {
      element.setAttribute('aria-label', table.getAttribute('aria-label'));
    } else {
      element.setAttribute('aria-label', _t('table', 'scrollRegion', null, 'Scrollable table', getComponentLocale(element)));
    }
  }
}

export class TableHead extends ComponentBase {
  /** @param {HTMLElement} element Elemento `<thead>`. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-head');
  }
}

export class TableBody extends ComponentBase {
  /** @param {HTMLElement} element Elemento `<tbody>`. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-body');
  }
}

export class TableFooter extends ComponentBase {
  /** @param {HTMLElement} element Elemento `<tfoot>`. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-footer');
  }
}

export class TableRow extends ComponentBase {
  /** @param {HTMLTableRowElement} element Elemento `<tr>`. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-row');
    if (element.hasAttribute('data-hover')) element.classList.add('mtx-table-row--hover');
    if (element.hasAttribute('data-selected') || element.classList.contains('mtx-table-row--selected')) {
      element.classList.add('mtx-table-row--selected');
      element.setAttribute('aria-selected', 'true');
    }
  }
}

export class TableCell extends ComponentBase {
  /** @param {HTMLTableCellElement} element Celda `<th>` o `<td>`. */
  constructor(element) {
    super(element);
    decorateCell(element);
    const sortDirection = element.getAttribute('data-sort-direction');
    if (sortDirection === 'asc' || sortDirection === 'desc') {
      element.setAttribute('aria-sort', sortDirection === 'asc' ? 'ascending' : 'descending');
    }
  }
}

/**
 * Barra de herramientas de tabla (patrón `EnhancedTableToolbar` de MUI).
 *
 * Muestra el título o, con filas seleccionadas, el contador resaltado y las
 * acciones en lote. Los hijos con `data-show="default"` solo se ven sin
 * selección y los de `data-show="selected"` solo con selección.
 */
export class TableToolbar extends ComponentBase {
  /**
   * Crea la barra y la vincula a la tabla de `data-table`.
   *
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-toolbar');
    if (!element.hasAttribute('role')) element.setAttribute('role', 'toolbar');

    const titleText = element.getAttribute('data-title');
    this.title = element.querySelector('.mtx-table-toolbar__title');
    if (!this.title && titleText) {
      this.title = document.createElement('div');
      this.title.className = 'mtx-table-toolbar__title';
      this.title.textContent = titleText;
      element.insertBefore(this.title, element.firstChild);
    }
    if (this.title && !this.title.id) this.title.id = uniqueId('mtx-table-toolbar-title');
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      if (this.title) element.setAttribute('aria-labelledby', this.title.id);
      else element.setAttribute('aria-label', _t('table', 'toolbar', null, 'Table toolbar', getComponentLocale(element)));
    }

    this.countElement = element.querySelector('.mtx-table-toolbar__count');
    if (!this.countElement) {
      this.countElement = document.createElement('div');
      this.countElement.className = 'mtx-table-toolbar__count';
      element.insertBefore(this.countElement, this.title ? this.title.nextSibling : element.firstChild);
    }
    this.countElement.setAttribute('aria-live', 'polite');
    this.countElement.setAttribute('aria-atomic', 'true');

    this._count = 0;
    this._handleSelection = (event) => { this.count = event.detail.count; };
    this._handleLocaleChange = () => this._render();
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this.table = this._resolveTable();
    if (this.table) {
      // El listener vive en el elemento <table>, no en su instancia: sobrevive a Table.destroy().
      this.listen(this.table, 'mtx:table:selection-change', this._handleSelection);
      const instance = getInstance(this.table);
      if (instance && Array.isArray(instance.selected)) this._count = instance.selected.length;
    }
    const initial = Number.parseInt(element.getAttribute('data-count'), 10);
    if (Number.isFinite(initial)) this._count = Math.max(0, initial);
    this._render();
  }

  /** @returns {number} Número de filas seleccionadas mostrado. */
  get count() {
    return this._count;
  }

  /** @param {number} value Nuevo número de seleccionadas. */
  set count(value) {
    this._count = Math.max(0, Number.parseInt(value, 10) || 0);
    this._render();
  }

  /** Elimina listeners instalados y suelta la tabla vinculada. */
  destroy() {
    super.destroy();
    this.table = null;
  }

  /** @returns {HTMLTableElement|null} Tabla vinculada. */
  _resolveTable() {
    const selector = this.element.getAttribute('data-table');
    if (selector) {
      try { return document.querySelector(selector); } catch { return null; }
    }
    const scope = this.element.parentElement;
    return scope ? scope.querySelector('table[data-mtx="table"], table.mtx-table') : null;
  }

  /** Actualiza resaltado, contador y grupos visibles. */
  _render() {
    const selected = this._count > 0;
    const element = this.element;
    element.classList.toggle('mtx-table-toolbar--highlight', selected);
    if (this.title) this.title.hidden = selected;
    const locale = getComponentLocale(element);
    const custom = element.getAttribute('data-selected-text');
    const key = this._count === 1 ? 'selectedCountSingular' : 'selectedCountPlural';
    const text = custom
      ? custom.replace('{0}', String(this._count))
      : _t('table', key, [this._count], `${this._count} selected`, locale);
    this.countElement.textContent = selected ? text : '';
    this.countElement.classList.toggle('mtx-table-toolbar__count--empty', !selected);
    Array.from(element.querySelectorAll('[data-show]')).forEach((node) => {
      if (node.closest('.mtx-table-toolbar') !== element) return;
      const mode = node.getAttribute('data-show');
      if (mode === 'selected') node.hidden = !selected;
      else if (mode === 'default') node.hidden = selected;
    });
  }
}

/** Representa una etiqueta interactiva de ordenación de columna. */
export class TableSortLabel extends ComponentBase {
  /**
   * Crea una etiqueta de ordenación.
   *
   * @param {HTMLElement} element Botón o elemento interactivo asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-sort-label');
    this._nativeButton = element.tagName === 'BUTTON';
    if (this._nativeButton && !element.hasAttribute('type')) element.type = 'button';
    if (!this._nativeButton) {
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
    }
    this._icon = element.querySelector('.mtx-table-sort-label__icon');
    if (!this._icon) {
      this._icon = document.createElement('span');
      this._icon.className = 'mtx-table-sort-label__icon';
      element.appendChild(this._icon);
    }
    this._icon.setAttribute('aria-hidden', 'true');
    if (!this._icon.firstElementChild && !this._icon.textContent.trim()) this._icon.innerHTML = SORT_ICON_SVG;
    this.direction = element.getAttribute('data-direction') === 'desc' ? 'desc' : 'asc';
    this.active = element.hasAttribute('data-active');
    this._handleClick = (event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const nextDirection = this.active && this.direction === 'asc' ? 'desc' : 'asc';
      if (!element.hasAttribute('data-disable-auto-toggle')) {
        this.direction = nextDirection;
        this.active = true;
        this._deactivateSiblings();
      }
      emit(element, 'mtx:table:sort', {
        direction: nextDirection,
        active: true,
        key: element.getAttribute('data-key') || null,
      });
    };
    this._handleKeydown = (event) => {
      if (this._nativeButton || this.disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    };
    this.listen(element, 'click', this._handleClick);
    this.listen(element, 'keydown', this._handleKeydown);
    if (element.hasAttribute('data-disabled')) this.disable();
  }

  /** Desactiva las demás etiquetas de ordenación de la misma cabecera (una sola columna activa). */
  _deactivateSiblings() {
    const scope = this.element.closest('thead') || this.element.closest('table');
    if (!scope) return;
    scope.querySelectorAll('.mtx-table-sort-label, [data-mtx="table-sort-label"]').forEach((other) => {
      if (other === this.element) return;
      const instance = getInstance(other);
      if (instance && instance !== this && 'active' in instance) {
        instance.active = false;
        return;
      }
      other.classList.remove('mtx-table-sort-label--active');
      other.removeAttribute('data-active');
      const cell = other.closest('th');
      if (cell) cell.removeAttribute('aria-sort');
    });
  }

  /** @returns {boolean} Indica si representa la ordenación activa. */
  get active() {
    return this.element.classList.contains('mtx-table-sort-label--active');
  }

  /** @param {boolean} value Nuevo estado activo. */
  set active(value) {
    this.element.classList.toggle('mtx-table-sort-label--active', Boolean(value));
    this.element.toggleAttribute('data-active', Boolean(value));
    const cell = this.element.closest('th');
    if (cell) {
      if (value) cell.setAttribute('aria-sort', this.direction === 'asc' ? 'ascending' : 'descending');
      else cell.removeAttribute('aria-sort');
    }
  }

  /** @returns {'asc'|'desc'} Dirección actual. */
  get direction() {
    return this._direction;
  }

  /** @param {'asc'|'desc'} value Dirección nueva. */
  set direction(value) {
    this._direction = value === 'desc' ? 'desc' : 'asc';
    this.element.setAttribute('data-direction', this._direction);
    this.element.classList.toggle('mtx-table-sort-label--desc', this._direction === 'desc');
    if (this.active) {
      const cell = this.element.closest('th');
      if (cell) cell.setAttribute('aria-sort', this._direction === 'asc' ? 'ascending' : 'descending');
    }
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === true || this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita la etiqueta. */
  disable() {
    if ('disabled' in this.element) this.element.disabled = true;
    this.element.setAttribute('aria-disabled', 'true');
    if (!this._nativeButton) this.element.tabIndex = -1;
  }

  /** Habilita la etiqueta. */
  enable() {
    if ('disabled' in this.element) this.element.disabled = false;
    this.element.removeAttribute('aria-disabled');
    if (!this._nativeButton) this.element.tabIndex = 0;
  }

  /** Enfoca la etiqueta. */
  focus() {
    this.element.focus();
  }
}

/** Representa la paginación de una tabla. */
export class TablePagination extends ComponentBase {
  /**
   * Crea una paginación controlable y, opcionalmente, pagina una tabla local.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-table-pagination');
    this._hasExplicitCount = element.hasAttribute('data-count');
    this._count = this._integer('data-count', 0, -1);
    this._page = this._integer('data-page', 0, 0);
    this._rowsPerPage = this._integer('data-rows-per-page', 10, -1);
    this._resolveTable();
    this._build();
    this._handleClick = (event) => {
      const button = event.target.closest('[data-pagination-action]');
      if (!button || button.disabled) return;
      const action = button.getAttribute('data-pagination-action');
      if (action === 'first') this.firstPage();
      if (action === 'previous') this.previousPage();
      if (action === 'next') this.nextPage();
      if (action === 'last') this.lastPage();
    };
    this._handleRowsChange = () => this._setRowsPerPage(Number.parseInt(this._select.value, 10), true);
    this.listen(element, 'click', this._handleClick);
    this.listen(this._select, 'change', this._handleRowsChange);
    if (element.hasAttribute('data-disabled')) this.disable();

    // Escuchar cambios globales de idioma
    this._handleLocaleChange = () => this._refreshI18nTexts();
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this.update();
  }

  /** @returns {number} Número total de filas o `-1` si es desconocido. */
  get count() { return this._count; }
  /** @param {number} value Nuevo total de filas. */
  set count(value) {
    this._hasExplicitCount = true;
    this._count = Math.max(-1, Number.parseInt(value, 10) || 0);
    this.element.setAttribute('data-count', String(this._count));
    this.update();
  }

  /** @returns {number} Página actual, con índice base cero. */
  get page() { return this._page; }
  /** @param {number} value Página nueva. */
  set page(value) { this._setPage(value, 'programmatic', false); }

  /** @returns {number} Filas mostradas por página. */
  get rowsPerPage() { return this._rowsPerPage; }
  /** @param {number} value Nuevo tamaño de página. */
  set rowsPerPage(value) { this._setRowsPerPage(value, false); }

  /** Actualiza rango, botones y tabla vinculada. */
  update() {
    const rows = this._getRows();
    if (!this._hasExplicitCount && rows) this._count = rows.length;
    const lastPage = this._lastPageIndex();
    if (this._count !== -1) this._page = Math.min(this._page, lastPage);
    const allRows = this._rowsPerPage === -1;
    const from = this._count === 0 ? 0 : (allRows ? 1 : this._page * this._rowsPerPage + 1);
    const to = this._count === 0 ? 0 : (allRows
      ? (this._count === -1 ? from : this._count)
      : (this._count === -1 ? from + this._rowsPerPage - 1 : Math.min(this._count, from + this._rowsPerPage - 1)));
    const locale = getComponentLocale(this.element);
    const ofLabel = this.element.getAttribute('data-label-of') || _t('tablePagination', 'of', null, 'of', locale);
    const moreThanLabel = this.element.getAttribute('data-label-more-than') || _t('tablePagination', 'moreThan', null, 'more than', locale);
    this._displayed.textContent = this._count === -1
      ? `${from}–${to} ${ofLabel} ${moreThanLabel} ${to}`
      : `${from}–${to} ${ofLabel} ${this._count}`;
    this._select.value = String(this._rowsPerPage);
    this._first.disabled = this.disabled || this._page === 0;
    this._previous.disabled = this.disabled || this._page === 0;
    this._next.disabled = this.disabled || (this._count !== -1 && this._page >= lastPage);
    this._last.disabled = this.disabled || this._count === -1 || this._page >= lastPage;
    this._select.disabled = this.disabled;
    this.element.setAttribute('data-page', String(this._page));
    this._applyRows(rows);
  }

  /** Va a la primera página. */
  firstPage() { this._setPage(0, 'firstPage'); }
  /** Va a la página anterior. */
  previousPage() { this._setPage(this._page - 1, 'previousPage'); }
  /** Va a la página siguiente. */
  nextPage() { this._setPage(this._page + 1, 'nextPage'); }
  /** Va a la última página conocida. */
  lastPage() {
    if (this._count !== -1) this._setPage(this._lastPageIndex(), 'lastPage');
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() { return this.element.getAttribute('aria-disabled') === 'true'; }
  /** Deshabilita la paginación. */
  disable() {
    this.element.setAttribute('aria-disabled', 'true');
    if (this._select) this.update();
  }
  /** Habilita la paginación. */
  enable() {
    this.element.removeAttribute('aria-disabled');
    if (this._select) this.update();
  }

  /** Elimina listeners instalados. */
  destroy() {
    this._applyRows(null, true);
    super.destroy();
    this._table = null;
  }

  /**
   * Refresca los textos de la paginación cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const locale = getComponentLocale(this.element);

    // Actualizar label "Filas por página:"
    const labelEl = this.element.querySelector('.mtx-table-pagination__select-label');
    if (labelEl && !this.element.hasAttribute('data-label-rows-per-page')) {
      const labelText = _t('tablePagination', 'rowsPerPage', null, 'Rows per page:', locale);
      // Preservar el <select> que está dentro del <label>
      const selectEl = labelEl.querySelector('select');
      labelEl.textContent = labelText;
      if (selectEl) labelEl.appendChild(selectEl);
      if (this._select) this._select.setAttribute('aria-label', labelText);
    }

    // Actualizar opción "Todas"
    if (this._select && !this.element.hasAttribute('data-label-all')) {
      Array.from(this._select.options).forEach((opt) => {
        if (opt.value === '-1') {
          opt.textContent = _t('tablePagination', 'all', null, 'All', locale);
        }
      });
    }

    // Actualizar aria-labels de los botones de navegación
    const buttonMap = {
      first: 'firstPage',
      previous: 'previousPage',
      next: 'nextPage',
      last: 'lastPage'
    };
    Object.entries(buttonMap).forEach(([action, key]) => {
      const btn = this.element.querySelector(`[data-pagination-action="${action}"]`);
      if (btn && !this.element.hasAttribute(`data-label-${action}`)) {
        btn.setAttribute('aria-label', _t('tablePagination', key, null, key, locale));
      }
    });

    // Refrescar texto del rango mostrado
    this.update();
  }

  /** Construye los controles accesibles. */
  _build() {
    let toolbar = this.element.querySelector('.mtx-table-pagination__toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'mtx-table-pagination__toolbar';
      this.element.appendChild(toolbar);
    }
    const locale = getComponentLocale(this.element);
    const label = document.createElement('label');
    label.className = 'mtx-table-pagination__select-label';
    label.textContent = this.element.getAttribute('data-label-rows-per-page') || _t('tablePagination', 'rowsPerPage', null, 'Rows per page:', locale);
    this._select = document.createElement('select');
    this._select.className = 'mtx-table-pagination__select';
    this._select.setAttribute('aria-label', label.textContent);
    this._options().forEach((value) => {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = value === -1 ? (this.element.getAttribute('data-label-all') || _t('tablePagination', 'all', null, 'All', locale)) : String(value);
      this._select.appendChild(option);
    });
    label.appendChild(this._select);
    this._displayed = document.createElement('p');
    this._displayed.className = 'mtx-table-pagination__displayed-rows';
    this._displayed.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div');
    actions.className = 'mtx-table-pagination__actions';
    this._first = this._button('first', '«', _t('tablePagination', 'firstPage', null, 'First page', locale));
    this._previous = this._button('previous', '‹', _t('tablePagination', 'previousPage', null, 'Previous page', locale));
    this._next = this._button('next', '›', _t('tablePagination', 'nextPage', null, 'Next page', locale));
    this._last = this._button('last', '»', _t('tablePagination', 'lastPage', null, 'Last page', locale));
    this._first.hidden = !this.element.hasAttribute('data-show-first-button');
    this._last.hidden = !this.element.hasAttribute('data-show-last-button');
    actions.append(this._first, this._previous, this._next, this._last);
    toolbar.append(label, this._displayed, actions);
  }

  /** @param {string} action Acción. @param {string} text Texto. @param {string} fallbackLabel Etiqueta. @returns {HTMLButtonElement} Botón creado. */
  _button(action, text, fallbackLabel) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mtx-table-pagination__button';
    button.setAttribute('data-pagination-action', action);
    button.setAttribute('aria-label', this.element.getAttribute(`data-label-${action}`) || fallbackLabel);
    button.textContent = text;
    return button;
  }

  /** @returns {number[]} Opciones normalizadas. */
  _options() {
    const values = (this.element.getAttribute('data-rows-per-page-options') || '10,25,50,100')
      .split(',').map((value) => Number.parseInt(value.trim(), 10)).filter((value) => value === -1 || value > 0);
    if (!values.includes(this._rowsPerPage)) values.unshift(this._rowsPerPage);
    return [...new Set(values)];
  }

  /** Resuelve la tabla opcional indicada por selector. */
  _resolveTable() {
    const selector = this.element.getAttribute('data-table');
    if (!selector) return;
    try { this._table = document.querySelector(selector); } catch { this._table = null; }
  }

  /** @returns {HTMLElement[]|null} Filas de cuerpo de la tabla vinculada. */
  _getRows() {
    return this._table ? Array.from(this._table.querySelectorAll('tbody > tr')) : null;
  }

  /** @param {HTMLElement[]|null} rows Filas. @param {boolean} [restore=false] Restaura visibilidad. */
  _applyRows(rows, restore = false) {
    const targetRows = rows || this._getRows();
    if (!targetRows) return;
    const start = this._page * this._rowsPerPage;
    targetRows.forEach((row, index) => {
      row.hidden = restore ? false : (this._rowsPerPage !== -1 && (index < start || index >= start + this._rowsPerPage));
    });
  }

  /** @returns {number} Índice de la última página. */
  _lastPageIndex() {
    if (this._count <= 0 || this._rowsPerPage === -1) return 0;
    return Math.max(0, Math.ceil(this._count / this._rowsPerPage) - 1);
  }

  /** @param {number} value Página. @param {string} reason Motivo. @param {boolean} [shouldEmit=true] Emite evento. */
  _setPage(value, reason, shouldEmit = true) {
    const previousPage = this._page;
    const maximum = this._count === -1 ? Number.MAX_SAFE_INTEGER : this._lastPageIndex();
    this._page = Math.min(maximum, Math.max(0, Number.parseInt(value, 10) || 0));
    this.update();
    if (shouldEmit && this._page !== previousPage) {
      emit(this.element, 'mtx:table:page-change', { page: this._page, previousPage, reason });
    }
  }

  /** @param {number} value Filas por página. @param {boolean} shouldEmit Emite evento. */
  _setRowsPerPage(value, shouldEmit) {
    const normalized = value === -1 ? -1 : Math.max(1, Number.parseInt(value, 10) || 10);
    const previousRowsPerPage = this._rowsPerPage;
    this._rowsPerPage = normalized;
    this._page = 0;
    this.element.setAttribute('data-rows-per-page', String(normalized));
    this.update();
    if (shouldEmit && normalized !== previousRowsPerPage) {
      emit(this.element, 'mtx:table:rows-per-page-change', { rowsPerPage: normalized, previousRowsPerPage, page: 0 });
    }
  }

  /** @param {string} name Atributo. @param {number} fallback Alternativa. @param {number} minimum Mínimo. @returns {number} Entero normalizado. */
  _integer(name, fallback, minimum) {
    const parsed = Number.parseInt(this.element.getAttribute(name), 10);
    return Number.isFinite(parsed) ? Math.max(minimum, parsed) : fallback;
  }
}

registerComponent('table', Table);
registerComponent('table-container', TableContainer);
registerComponent('table-head', TableHead);
registerComponent('table-body', TableBody);
registerComponent('table-footer', TableFooter);
// Alias histórico; `table-footer` es el nombre canónico.
registerComponent('table-foot', TableFooter);
registerComponent('table-row', TableRow);
registerComponent('table-cell', TableCell);
registerComponent('table-sort-label', TableSortLabel);
registerComponent('table-pagination', TablePagination);
registerComponent('table-toolbar', TableToolbar);