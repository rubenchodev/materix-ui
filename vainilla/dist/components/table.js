import "./table.css";
import { i as y, u as P, r as d, C as u, n as v, h as b, t as o, j as g, g as _, v as p, q as S } from "../chunks/core-CJdkPtZx.js";
const w = {
  en: {
    selectAllRows: "Select all rows",
    selectRow: "Select {0}",
    selectedCountSingular: "{0} selected",
    selectedCountPlural: "{0} selected",
    toolbar: "Table toolbar"
  },
  es: {
    selectAllRows: "Seleccionar todas las filas",
    selectRow: "Seleccionar {0}",
    selectedCountSingular: "{0} seleccionado",
    selectedCountPlural: "{0} seleccionados",
    toolbar: "Barra de herramientas de la tabla"
  }
};
Object.entries(w).forEach(([l, t]) => {
  const e = (y(l) || {}).table || {}, s = Object.fromEntries(Object.entries(t).filter(([i]) => e[i] === void 0));
  Object.keys(s).length && P(l, { table: s });
});
const f = '.mtx-table-cell--padding-checkbox, .mtx-table-cell--checkbox, [data-padding="checkbox"]', C = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [role="menuitem"], [contenteditable=""], [contenteditable="true"], .mtx-checkbox', E = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>';
let L = 0;
const h = (l, t) => l.hasAttribute(t) && l.getAttribute(t) !== "false", m = (l) => {
  l.classList.add("mtx-table-cell");
  const t = l.getAttribute("data-align"), e = l.getAttribute("data-padding");
  if (t && l.classList.add(`mtx-table-cell--${t}`), e && l.classList.add(`mtx-table-cell--padding-${e}`), l.tagName === "TH" && !l.hasAttribute("scope")) {
    const s = l.parentElement && l.parentElement.parentElement;
    s && s.tagName === "THEAD" ? l.scope = "col" : s && s.tagName === "TBODY" && (l.scope = "row");
  }
};
class k extends u {
  /**
   * Crea una instancia de la tabla.
   *
   * @param {HTMLTableElement} element Elemento `<table>` asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table");
    const e = t.closest('.mtx-table-container, [data-mtx="table-container"]');
    (h(t, "data-sticky-header") || e && h(e, "data-sticky-header")) && t.classList.add("mtx-table--sticky-header"), (t.getAttribute("data-size") === "small" || t.hasAttribute("data-dense")) && t.classList.add("mtx-table--small"), this.hover = h(t, "data-hover"), this.hover && t.classList.add("mtx-table--hover"), this.selectable = h(t, "data-selectable"), this.selectOnClick = this.selectable && h(t, "data-select-on-click"), this.selectable && t.classList.add("mtx-table--selectable"), this._selected = /* @__PURE__ */ new Set(), this._rowKeys = /* @__PURE__ */ new WeakMap(), this._seenRows = /* @__PURE__ */ new WeakSet(), this._autoLabelled = /* @__PURE__ */ new WeakSet(), this._handleChange = (s) => this._onChange(s), this._handleClick = (s) => this._onRowClick(s), this._handleLocaleChange = () => this._refreshLabels(), this.listen(t, "change", this._handleChange), this.listen(t, "click", this._handleClick), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.refresh(), typeof MutationObserver < "u" && (this._observer = new MutationObserver(() => this._scheduleRefresh()), this._observe());
  }
  /** @returns {string[]} Claves (`data-id`) de las filas seleccionadas. */
  get selected() {
    return Array.from(this._selected);
  }
  /** @param {string[]} keys Claves a seleccionar (reemplaza la selección). */
  set selected(t) {
    this._replaceSelection(new Set((t || []).map(String)), "api");
  }
  /**
   * Devuelve las filas del DOM actualmente seleccionadas.
   *
   * @returns {HTMLTableRowElement[]} Filas seleccionadas presentes en la tabla.
   */
  getSelectedRows() {
    return this._bodyRows().filter((t) => this._selected.has(this._keyOf(t)));
  }
  /**
   * Indica si una fila (o clave) está seleccionada.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @returns {boolean} `true` si está seleccionada.
   */
  isSelected(t) {
    return this._selected.has(this._resolveKey(t));
  }
  /**
   * Alterna la selección de una fila.
   *
   * @param {HTMLTableRowElement|string} rowOrKey Fila o clave.
   * @param {boolean} [force] Estado forzado.
   */
  toggleRow(t, e) {
    this._toggleKey(this._resolveKey(t), e, "api");
  }
  /** Selecciona todas las filas habilitadas del cuerpo. */
  selectAll() {
    this._setAll(!0, "api");
  }
  /** Vacía la selección completa (también claves de filas que ya no están en el DOM). */
  clearSelection() {
    this._replaceSelection(/* @__PURE__ */ new Set(), "api");
  }
  /**
   * Vuelve a aplicar clases, celdas de selección y estado a todas las filas.
   * Se ejecuta automáticamente cuando cambian las filas.
   */
  refresh() {
    this._refreshQueued = !1;
    const t = !!this._observer;
    t && this._observer.disconnect();
    try {
      this._decorate(), this.selectable && this._syncSelection(!0);
    } finally {
      t && this._observe();
    }
  }
  /** Elimina listeners y el observador. */
  destroy() {
    this._observer && this._observer.disconnect(), this._observer = null, this._refreshQueued = !1, super.destroy();
  }
  /** Inicia la observación de filas y celdas. */
  _observe() {
    this._observer.observe(this.element, { childList: !0, subtree: !0 });
  }
  /** Agrupa varias mutaciones en un único `refresh()`. */
  _scheduleRefresh() {
    this._refreshQueued || (this._refreshQueued = !0, queueMicrotask(() => {
      this._refreshQueued && !this.destroyed && this.refresh();
    }));
  }
  /** Aplica clases BEM a leyenda, secciones, filas y celdas. */
  _decorate() {
    const t = this.element;
    t.caption && t.caption.classList.add("mtx-table-caption"), t.tHead && t.tHead.classList.add("mtx-table-head"), Array.from(t.tBodies).forEach((e) => e.classList.add("mtx-table-body")), t.tFoot && t.tFoot.classList.add("mtx-table-footer"), Array.from(t.rows).forEach((e) => {
      e.classList.add("mtx-table-row");
      const s = e.parentElement && e.parentElement.tagName === "TBODY";
      this.hover && s && e.classList.add("mtx-table-row--hover"), this.selectable && this._ensureSelectionCell(e), Array.from(e.cells).forEach(m);
    });
  }
  /** @returns {HTMLTableRowElement[]} Filas de todos los `<tbody>`. */
  _bodyRows() {
    return Array.from(this.element.tBodies).flatMap((t) => Array.from(t.rows));
  }
  /**
   * Obtiene (o asigna) la clave estable de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {string} Clave de `data-id` o generada.
   */
  _keyOf(t) {
    const e = t.getAttribute("data-id");
    return e !== null && e !== "" ? e : (this._rowKeys.has(t) || this._rowKeys.set(t, `mtx-row-${++L}`), this._rowKeys.get(t));
  }
  /** @param {HTMLTableRowElement|string} rowOrKey Fila o clave. @returns {string} Clave. */
  _resolveKey(t) {
    return t && t.nodeType === 1 ? this._keyOf(t) : String(t);
  }
  /**
   * Busca la celda de selección (primera celda con checkbox) de una fila.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {HTMLTableCellElement|null} Celda encontrada.
   */
  _selectionCell(t) {
    const e = t.cells[0];
    return e && e.matches(f) ? e : null;
  }
  /** @param {HTMLTableRowElement} row Fila. @returns {HTMLInputElement|null} Checkbox de la fila. */
  _rowInput(t) {
    const e = this._selectionCell(t);
    return e ? e.querySelector('input[type="checkbox"]') : null;
  }
  /**
   * Indica si la fila participa en la selección.
   *
   * @param {HTMLTableRowElement} row Fila.
   * @returns {boolean} `true` si es seleccionable.
   */
  _isSelectableRow(t) {
    return !h(t, "data-no-select") && !!this._rowInput(t);
  }
  /**
   * Inserta la celda de checkbox en una fila si aún no la tiene.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _ensureSelectionCell(t) {
    const e = t.parentElement ? t.parentElement.tagName : "";
    if (this._selectionCell(t)) {
      e === "TBODY" && this._readInitialState(t);
      return;
    }
    if (e === "TBODY" && t.cells.length === 1 && t.cells[0].colSpan > 1) {
      this._seenRows.has(t) || (t.cells[0].colSpan += 1), this._seenRows.add(t);
      return;
    }
    const s = e === "TBODY" && h(t, "data-no-select"), i = e === "THEAD", a = i ? t.parentElement.rows : null, n = e === "TBODY" && !s || i && a[a.length - 1] === t, r = document.createElement(i ? "th" : "td");
    if (r.className = "mtx-table-cell mtx-table-cell--padding-checkbox", r.setAttribute("data-padding", "checkbox"), n) {
      const c = document.createElement("input");
      c.type = "checkbox", c.setAttribute("data-mtx", "checkbox"), this._autoLabelled.add(c), r.appendChild(c);
    }
    i && (r.scope = "col"), t.insertBefore(r, t.cells[0] || null), r.firstChild && (this._labelInput(r.firstChild, t, i), v(r)), e === "TBODY" && !s && this._readInitialState(t), s && this._seenRows.add(t);
  }
  /**
   * Toma `data-selected` de una fila vista por primera vez.
   *
   * @param {HTMLTableRowElement} row Fila.
   */
  _readInitialState(t) {
    if (this._seenRows.has(t)) return;
    this._seenRows.add(t);
    const e = this._rowInput(t);
    (h(t, "data-selected") || t.classList.contains("mtx-table-row--selected") || e && e.checked) && (this._initialKeys || (this._initialKeys = /* @__PURE__ */ new Set()), this._initialKeys.add(this._keyOf(t)));
  }
  /**
   * Asigna el nombre accesible traducido a un checkbox autogenerado.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {HTMLTableRowElement} row Fila.
   * @param {boolean} isHead Es la casilla de cabecera.
   */
  _labelInput(t, e, s) {
    const i = b(this.element);
    if (s) {
      t.setAttribute("aria-label", o("table", "selectAllRows", null, "Select all rows", i));
      return;
    }
    const a = e.getAttribute("data-label"), n = Array.from(e.cells).find((A) => !A.matches(f)), c = (a || (n ? n.textContent : "") || "").replace(/\s+/g, " ").trim().slice(0, 80) || String(e.sectionRowIndex + 1);
    t.setAttribute("aria-label", o("table", "selectRow", [c], `Select ${c}`, i));
  }
  /** Actualiza los nombres accesibles autogenerados tras un cambio de idioma. */
  _refreshLabels() {
    Array.from(this.element.rows).forEach((t) => {
      const e = this._selectionCell(t), s = e && e.querySelector('input[type="checkbox"]');
      s && this._autoLabelled.has(s) && this._labelInput(s, t, t.parentElement.tagName === "THEAD");
    });
  }
  /**
   * Gestiona los cambios de las casillas de cabecera y de fila.
   *
   * @param {Event} event Evento `change`.
   */
  _onChange(t) {
    if (!this.selectable) return;
    const e = t.target;
    if (!(e instanceof HTMLInputElement) || e.type !== "checkbox") return;
    const s = e.closest("tr");
    if (!s || s.closest("table") !== this.element || this._rowInput(s) !== e) return;
    const i = s.parentElement.tagName;
    i === "THEAD" ? this._setAll(e.checked, "user") : i === "TBODY" && this._toggleKey(this._keyOf(s), e.checked, "user");
  }
  /**
   * Alterna la fila al hacer clic en ella cuando `data-select-on-click` está activo.
   *
   * @param {MouseEvent} event Evento `click`.
   */
  _onRowClick(t) {
    if (!this.selectOnClick || t.defaultPrevented) return;
    const e = t.target;
    if (!(e instanceof Element) || e.closest(C)) return;
    const s = e.closest("tr");
    if (!s || s.closest("table") !== this.element || s.parentElement.tagName !== "TBODY") return;
    const i = this._rowInput(s);
    !i || i.disabled || h(s, "data-no-select") || this._toggleKey(this._keyOf(s), void 0, "user");
  }
  /**
   * Selecciona o deselecciona todas las filas habilitadas del DOM.
   *
   * @param {boolean} value Nuevo estado.
   * @param {string} reason Motivo del cambio.
   */
  _setAll(t, e) {
    const s = new Set(this._selected);
    this._bodyRows().forEach((i) => {
      const a = this._rowInput(i);
      !this._isSelectableRow(i) || a.disabled || (t ? s.add(this._keyOf(i)) : s.delete(this._keyOf(i)));
    }), this._replaceSelection(s, e);
  }
  /**
   * Cambia el estado de una clave.
   *
   * @param {string} key Clave.
   * @param {boolean} [force] Estado forzado.
   * @param {string} reason Motivo.
   */
  _toggleKey(t, e, s) {
    const i = new Set(this._selected);
    (e === void 0 ? !i.has(t) : !!e) ? i.add(t) : i.delete(t), this._replaceSelection(i, s);
  }
  /**
   * Sustituye la selección y emite `mtx:table:selection-change` si cambió.
   *
   * @param {Set<string>} next Nueva selección.
   * @param {string} reason Motivo.
   */
  _replaceSelection(t, e) {
    const s = t.size !== this._selected.size || Array.from(t).some((i) => !this._selected.has(i));
    this._selected = t, this._syncSelection(!1), s && this._emitSelection(e);
  }
  /**
   * Refleja la selección en filas, casillas y cabecera.
   *
   * @param {boolean} fromRefresh Incorpora el estado inicial de filas nuevas.
   */
  _syncSelection(t) {
    if (!this.selectable) return;
    if (t && this._initialKeys) {
      const i = Array.from(this._initialKeys).filter((a) => !this._selected.has(a));
      if (this._initialKeys = null, i.length) {
        i.forEach((a) => this._selected.add(a)), this._syncSelection(!1), this._emitSelection("refresh");
        return;
      }
    }
    let e = 0, s = 0;
    this._bodyRows().forEach((i) => {
      const a = this._rowInput(i);
      if (!a) return;
      const n = this._selected.has(this._keyOf(i));
      i.classList.toggle("mtx-table-row--selected", n), i.setAttribute("aria-selected", String(n)), this._setInput(a, n, !1), !a.disabled && !h(i, "data-no-select") && (e += 1, n && (s += 1));
    }), this.element.tHead && Array.from(this.element.tHead.rows).forEach((i) => {
      const a = this._rowInput(i);
      a && (this._setInput(a, e > 0 && s === e, s > 0 && s < e), a.disabled = e === 0);
    });
  }
  /**
   * Fija el estado de una casilla usando su instancia si existe.
   *
   * @param {HTMLInputElement} input Casilla.
   * @param {boolean} checked Marcada.
   * @param {boolean} indeterminate Indeterminada.
   */
  _setInput(t, e, s) {
    const i = g(t);
    if (i && "checked" in i && "indeterminate" in i) {
      i.checked !== e && (i.checked = e), i.indeterminate !== s && (i.indeterminate = s);
      return;
    }
    t.checked = e, t.indeterminate = s, s ? t.setAttribute("aria-checked", "mixed") : t.removeAttribute("aria-checked");
  }
  /** @param {string} reason Motivo del cambio. */
  _emitSelection(t) {
    const e = this.selected;
    _(
      this.element,
      "mtx:table:selection-change",
      { selected: e, rows: this.getSelectedRows(), count: e.length, reason: t }
    );
  }
}
class R extends u {
  /**
   * Crea una instancia del contenedor de tabla.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-container");
    const e = t.getAttribute("data-max-height");
    if (e && (t.style.maxHeight = /^\d+(\.\d+)?$/.test(e) ? `${e}px` : e, t.classList.add("mtx-table-container--scroll")), h(t, "data-sticky-header")) {
      t.classList.add("mtx-table-container--sticky");
      const s = t.querySelector("table");
      s && s.classList.add("mtx-table--sticky-header");
    }
    if (this._ownsTabindex = !t.hasAttribute("tabindex"), this._syncScrollRegion(), this._ownsTabindex && typeof ResizeObserver == "function") {
      const s = new ResizeObserver(() => this._syncScrollRegion());
      s.observe(t), this.onDestroy(() => s.disconnect());
    }
  }
  /**
   * Indica si el contenedor desplaza contenido (altura máxima o desbordamiento real).
   *
   * @returns {boolean} `true` si hay scroll.
   */
  get scrollable() {
    const t = this.element;
    return this.element.classList.contains("mtx-table-container--scroll") || t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > t.clientHeight + 1;
  }
  /** Hace enfocable y nombra el contenedor solo mientras tiene scroll. */
  _syncScrollRegion() {
    const { element: t } = this;
    if (!this._ownsTabindex) return;
    if (!this.scrollable) {
      this._regionApplied && (t.removeAttribute("tabindex"), this._regionApplied = !1);
      return;
    }
    if (this._regionApplied || (this._regionApplied = !0, t.tabIndex = 0, t.hasAttribute("role")) || (t.setAttribute("role", "region"), t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby"))) return;
    const e = t.querySelector("table"), s = e && e.querySelector("caption");
    s && s.textContent.trim() ? (s.id || (s.id = p("mtx-table-caption")), t.setAttribute("aria-labelledby", s.id)) : e && e.getAttribute("aria-labelledby") ? t.setAttribute("aria-labelledby", e.getAttribute("aria-labelledby")) : e && e.getAttribute("aria-label") ? t.setAttribute("aria-label", e.getAttribute("aria-label")) : t.setAttribute("aria-label", o("table", "scrollRegion", null, "Scrollable table", b(t)));
  }
}
class T extends u {
  /** @param {HTMLElement} element Elemento `<thead>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-head");
  }
}
class I extends u {
  /** @param {HTMLElement} element Elemento `<tbody>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-body");
  }
}
class x extends u {
  /** @param {HTMLElement} element Elemento `<tfoot>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-footer");
  }
}
class N extends u {
  /** @param {HTMLTableRowElement} element Elemento `<tr>`. */
  constructor(t) {
    super(t), t.classList.add("mtx-table-row"), t.hasAttribute("data-hover") && t.classList.add("mtx-table-row--hover"), (t.hasAttribute("data-selected") || t.classList.contains("mtx-table-row--selected")) && (t.classList.add("mtx-table-row--selected"), t.setAttribute("aria-selected", "true"));
  }
}
class B extends u {
  /** @param {HTMLTableCellElement} element Celda `<th>` o `<td>`. */
  constructor(t) {
    super(t), m(t);
    const e = t.getAttribute("data-sort-direction");
    (e === "asc" || e === "desc") && t.setAttribute("aria-sort", e === "asc" ? "ascending" : "descending");
  }
}
class O extends u {
  /**
   * Crea la barra y la vincula a la tabla de `data-table`.
   *
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-toolbar"), t.hasAttribute("role") || t.setAttribute("role", "toolbar");
    const e = t.getAttribute("data-title");
    if (this.title = t.querySelector(".mtx-table-toolbar__title"), !this.title && e && (this.title = document.createElement("div"), this.title.className = "mtx-table-toolbar__title", this.title.textContent = e, t.insertBefore(this.title, t.firstChild)), this.title && !this.title.id && (this.title.id = p("mtx-table-toolbar-title")), !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && (this.title ? t.setAttribute("aria-labelledby", this.title.id) : t.setAttribute("aria-label", o("table", "toolbar", null, "Table toolbar", b(t)))), this.countElement = t.querySelector(".mtx-table-toolbar__count"), this.countElement || (this.countElement = document.createElement("div"), this.countElement.className = "mtx-table-toolbar__count", t.insertBefore(this.countElement, this.title ? this.title.nextSibling : t.firstChild)), this.countElement.setAttribute("aria-live", "polite"), this.countElement.setAttribute("aria-atomic", "true"), this._count = 0, this._handleSelection = (i) => {
      this.count = i.detail.count;
    }, this._handleLocaleChange = () => this._render(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.table = this._resolveTable(), this.table) {
      this.listen(this.table, "mtx:table:selection-change", this._handleSelection);
      const i = g(this.table);
      i && Array.isArray(i.selected) && (this._count = i.selected.length);
    }
    const s = Number.parseInt(t.getAttribute("data-count"), 10);
    Number.isFinite(s) && (this._count = Math.max(0, s)), this._render();
  }
  /** @returns {number} Número de filas seleccionadas mostrado. */
  get count() {
    return this._count;
  }
  /** @param {number} value Nuevo número de seleccionadas. */
  set count(t) {
    this._count = Math.max(0, Number.parseInt(t, 10) || 0), this._render();
  }
  /** Elimina listeners instalados y suelta la tabla vinculada. */
  destroy() {
    super.destroy(), this.table = null;
  }
  /** @returns {HTMLTableElement|null} Tabla vinculada. */
  _resolveTable() {
    const t = this.element.getAttribute("data-table");
    if (t)
      try {
        return document.querySelector(t);
      } catch {
        return null;
      }
    const e = this.element.parentElement;
    return e ? e.querySelector('table[data-mtx="table"], table.mtx-table') : null;
  }
  /** Actualiza resaltado, contador y grupos visibles. */
  _render() {
    const t = this._count > 0, e = this.element;
    e.classList.toggle("mtx-table-toolbar--highlight", t), this.title && (this.title.hidden = t);
    const s = b(e), i = e.getAttribute("data-selected-text"), a = this._count === 1 ? "selectedCountSingular" : "selectedCountPlural", n = i ? i.replace("{0}", String(this._count)) : o("table", a, [this._count], `${this._count} selected`, s);
    this.countElement.textContent = t ? n : "", this.countElement.classList.toggle("mtx-table-toolbar__count--empty", !t), Array.from(e.querySelectorAll("[data-show]")).forEach((r) => {
      if (r.closest(".mtx-table-toolbar") !== e) return;
      const c = r.getAttribute("data-show");
      c === "selected" ? r.hidden = !t : c === "default" && (r.hidden = t);
    });
  }
}
class M extends u {
  /**
   * Crea una etiqueta de ordenación.
   *
   * @param {HTMLElement} element Botón o elemento interactivo asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-sort-label"), this._nativeButton = t.tagName === "BUTTON", this._nativeButton && !t.hasAttribute("type") && (t.type = "button"), this._nativeButton || (t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0)), this._icon = t.querySelector(".mtx-table-sort-label__icon"), this._icon || (this._icon = document.createElement("span"), this._icon.className = "mtx-table-sort-label__icon", t.appendChild(this._icon)), this._icon.setAttribute("aria-hidden", "true"), !this._icon.firstElementChild && !this._icon.textContent.trim() && (this._icon.innerHTML = E), this.direction = t.getAttribute("data-direction") === "desc" ? "desc" : "asc", this.active = t.hasAttribute("data-active"), this._handleClick = (e) => {
      if (this.disabled) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      const s = this.active && this.direction === "asc" ? "desc" : "asc";
      t.hasAttribute("data-disable-auto-toggle") || (this.direction = s, this.active = !0, this._deactivateSiblings()), _(t, "mtx:table:sort", {
        direction: s,
        active: !0,
        key: t.getAttribute("data-key") || null
      });
    }, this._handleKeydown = (e) => {
      this._nativeButton || this.disabled || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), t.click());
    }, this.listen(t, "click", this._handleClick), this.listen(t, "keydown", this._handleKeydown), t.hasAttribute("data-disabled") && this.disable();
  }
  /** Desactiva las demás etiquetas de ordenación de la misma cabecera (una sola columna activa). */
  _deactivateSiblings() {
    const t = this.element.closest("thead") || this.element.closest("table");
    t && t.querySelectorAll('.mtx-table-sort-label, [data-mtx="table-sort-label"]').forEach((e) => {
      if (e === this.element) return;
      const s = g(e);
      if (s && s !== this && "active" in s) {
        s.active = !1;
        return;
      }
      e.classList.remove("mtx-table-sort-label--active"), e.removeAttribute("data-active");
      const i = e.closest("th");
      i && i.removeAttribute("aria-sort");
    });
  }
  /** @returns {boolean} Indica si representa la ordenación activa. */
  get active() {
    return this.element.classList.contains("mtx-table-sort-label--active");
  }
  /** @param {boolean} value Nuevo estado activo. */
  set active(t) {
    this.element.classList.toggle("mtx-table-sort-label--active", !!t), this.element.toggleAttribute("data-active", !!t);
    const e = this.element.closest("th");
    e && (t ? e.setAttribute("aria-sort", this.direction === "asc" ? "ascending" : "descending") : e.removeAttribute("aria-sort"));
  }
  /** @returns {'asc'|'desc'} Dirección actual. */
  get direction() {
    return this._direction;
  }
  /** @param {'asc'|'desc'} value Dirección nueva. */
  set direction(t) {
    if (this._direction = t === "desc" ? "desc" : "asc", this.element.setAttribute("data-direction", this._direction), this.element.classList.toggle("mtx-table-sort-label--desc", this._direction === "desc"), this.active) {
      const e = this.element.closest("th");
      e && e.setAttribute("aria-sort", this._direction === "asc" ? "ascending" : "descending");
    }
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita la etiqueta. */
  disable() {
    "disabled" in this.element && (this.element.disabled = !0), this.element.setAttribute("aria-disabled", "true"), this._nativeButton || (this.element.tabIndex = -1);
  }
  /** Habilita la etiqueta. */
  enable() {
    "disabled" in this.element && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled"), this._nativeButton || (this.element.tabIndex = 0);
  }
  /** Enfoca la etiqueta. */
  focus() {
    this.element.focus();
  }
}
class q extends u {
  /**
   * Crea una paginación controlable y, opcionalmente, pagina una tabla local.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-table-pagination"), this._hasExplicitCount = t.hasAttribute("data-count"), this._count = this._integer("data-count", 0, -1), this._page = this._integer("data-page", 0, 0), this._rowsPerPage = this._integer("data-rows-per-page", 10, -1), this._resolveTable(), this._build(), this._handleClick = (e) => {
      const s = e.target.closest("[data-pagination-action]");
      if (!s || s.disabled) return;
      const i = s.getAttribute("data-pagination-action");
      i === "first" && this.firstPage(), i === "previous" && this.previousPage(), i === "next" && this.nextPage(), i === "last" && this.lastPage();
    }, this._handleRowsChange = () => this._setRowsPerPage(Number.parseInt(this._select.value, 10), !0), this.listen(t, "click", this._handleClick), this.listen(this._select, "change", this._handleRowsChange), t.hasAttribute("data-disabled") && this.disable(), this._handleLocaleChange = () => this._refreshI18nTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this.update();
  }
  /** @returns {number} Número total de filas o `-1` si es desconocido. */
  get count() {
    return this._count;
  }
  /** @param {number} value Nuevo total de filas. */
  set count(t) {
    this._hasExplicitCount = !0, this._count = Math.max(-1, Number.parseInt(t, 10) || 0), this.element.setAttribute("data-count", String(this._count)), this.update();
  }
  /** @returns {number} Página actual, con índice base cero. */
  get page() {
    return this._page;
  }
  /** @param {number} value Página nueva. */
  set page(t) {
    this._setPage(t, "programmatic", !1);
  }
  /** @returns {number} Filas mostradas por página. */
  get rowsPerPage() {
    return this._rowsPerPage;
  }
  /** @param {number} value Nuevo tamaño de página. */
  set rowsPerPage(t) {
    this._setRowsPerPage(t, !1);
  }
  /** Actualiza rango, botones y tabla vinculada. */
  update() {
    const t = this._getRows();
    !this._hasExplicitCount && t && (this._count = t.length);
    const e = this._lastPageIndex();
    this._count !== -1 && (this._page = Math.min(this._page, e));
    const s = this._rowsPerPage === -1, i = this._count === 0 ? 0 : s ? 1 : this._page * this._rowsPerPage + 1, a = this._count === 0 ? 0 : s ? this._count === -1 ? i : this._count : this._count === -1 ? i + this._rowsPerPage - 1 : Math.min(this._count, i + this._rowsPerPage - 1), n = b(this.element), r = this.element.getAttribute("data-label-of") || o("tablePagination", "of", null, "of", n), c = this.element.getAttribute("data-label-more-than") || o("tablePagination", "moreThan", null, "more than", n);
    this._displayed.textContent = this._count === -1 ? `${i}–${a} ${r} ${c} ${a}` : `${i}–${a} ${r} ${this._count}`, this._select.value = String(this._rowsPerPage), this._first.disabled = this.disabled || this._page === 0, this._previous.disabled = this.disabled || this._page === 0, this._next.disabled = this.disabled || this._count !== -1 && this._page >= e, this._last.disabled = this.disabled || this._count === -1 || this._page >= e, this._select.disabled = this.disabled, this.element.setAttribute("data-page", String(this._page)), this._applyRows(t);
  }
  /** Va a la primera página. */
  firstPage() {
    this._setPage(0, "firstPage");
  }
  /** Va a la página anterior. */
  previousPage() {
    this._setPage(this._page - 1, "previousPage");
  }
  /** Va a la página siguiente. */
  nextPage() {
    this._setPage(this._page + 1, "nextPage");
  }
  /** Va a la última página conocida. */
  lastPage() {
    this._count !== -1 && this._setPage(this._lastPageIndex(), "lastPage");
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita la paginación. */
  disable() {
    this.element.setAttribute("aria-disabled", "true"), this._select && this.update();
  }
  /** Habilita la paginación. */
  enable() {
    this.element.removeAttribute("aria-disabled"), this._select && this.update();
  }
  /** Elimina listeners instalados. */
  destroy() {
    this._applyRows(null, !0), super.destroy(), this._table = null;
  }
  /**
   * Refresca los textos de la paginación cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const t = b(this.element), e = this.element.querySelector(".mtx-table-pagination__select-label");
    if (e && !this.element.hasAttribute("data-label-rows-per-page")) {
      const i = o("tablePagination", "rowsPerPage", null, "Rows per page:", t), a = e.querySelector("select");
      e.textContent = i, a && e.appendChild(a), this._select && this._select.setAttribute("aria-label", i);
    }
    this._select && !this.element.hasAttribute("data-label-all") && Array.from(this._select.options).forEach((i) => {
      i.value === "-1" && (i.textContent = o("tablePagination", "all", null, "All", t));
    }), Object.entries({
      first: "firstPage",
      previous: "previousPage",
      next: "nextPage",
      last: "lastPage"
    }).forEach(([i, a]) => {
      const n = this.element.querySelector(`[data-pagination-action="${i}"]`);
      n && !this.element.hasAttribute(`data-label-${i}`) && n.setAttribute("aria-label", o("tablePagination", a, null, a, t));
    }), this.update();
  }
  /** Construye los controles accesibles. */
  _build() {
    let t = this.element.querySelector(".mtx-table-pagination__toolbar");
    t || (t = document.createElement("div"), t.className = "mtx-table-pagination__toolbar", this.element.appendChild(t));
    const e = b(this.element), s = document.createElement("label");
    s.className = "mtx-table-pagination__select-label", s.textContent = this.element.getAttribute("data-label-rows-per-page") || o("tablePagination", "rowsPerPage", null, "Rows per page:", e), this._select = document.createElement("select"), this._select.className = "mtx-table-pagination__select", this._select.setAttribute("aria-label", s.textContent), this._options().forEach((a) => {
      const n = document.createElement("option");
      n.value = String(a), n.textContent = a === -1 ? this.element.getAttribute("data-label-all") || o("tablePagination", "all", null, "All", e) : String(a), this._select.appendChild(n);
    }), s.appendChild(this._select), this._displayed = document.createElement("p"), this._displayed.className = "mtx-table-pagination__displayed-rows", this._displayed.setAttribute("aria-live", "polite");
    const i = document.createElement("div");
    i.className = "mtx-table-pagination__actions", this._first = this._button("first", "«", o("tablePagination", "firstPage", null, "First page", e)), this._previous = this._button("previous", "‹", o("tablePagination", "previousPage", null, "Previous page", e)), this._next = this._button("next", "›", o("tablePagination", "nextPage", null, "Next page", e)), this._last = this._button("last", "»", o("tablePagination", "lastPage", null, "Last page", e)), this._first.hidden = !this.element.hasAttribute("data-show-first-button"), this._last.hidden = !this.element.hasAttribute("data-show-last-button"), i.append(this._first, this._previous, this._next, this._last), t.append(s, this._displayed, i);
  }
  /** @param {string} action Acción. @param {string} text Texto. @param {string} fallbackLabel Etiqueta. @returns {HTMLButtonElement} Botón creado. */
  _button(t, e, s) {
    const i = document.createElement("button");
    return i.type = "button", i.className = "mtx-table-pagination__button", i.setAttribute("data-pagination-action", t), i.setAttribute("aria-label", this.element.getAttribute(`data-label-${t}`) || s), i.textContent = e, i;
  }
  /** @returns {number[]} Opciones normalizadas. */
  _options() {
    const t = (this.element.getAttribute("data-rows-per-page-options") || "10,25,50,100").split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => e === -1 || e > 0);
    return t.includes(this._rowsPerPage) || t.unshift(this._rowsPerPage), [...new Set(t)];
  }
  /** Resuelve la tabla opcional indicada por selector. */
  _resolveTable() {
    const t = this.element.getAttribute("data-table");
    if (t)
      try {
        this._table = document.querySelector(t);
      } catch {
        this._table = null;
      }
  }
  /** @returns {HTMLElement[]|null} Filas de cuerpo de la tabla vinculada. */
  _getRows() {
    return this._table ? Array.from(this._table.querySelectorAll("tbody > tr")) : null;
  }
  /** @param {HTMLElement[]|null} rows Filas. @param {boolean} [restore=false] Restaura visibilidad. */
  _applyRows(t, e = !1) {
    const s = t || this._getRows();
    if (!s) return;
    const i = this._page * this._rowsPerPage;
    s.forEach((a, n) => {
      a.hidden = e ? !1 : this._rowsPerPage !== -1 && (n < i || n >= i + this._rowsPerPage);
    });
  }
  /** @returns {number} Índice de la última página. */
  _lastPageIndex() {
    return this._count <= 0 || this._rowsPerPage === -1 ? 0 : Math.max(0, Math.ceil(this._count / this._rowsPerPage) - 1);
  }
  /** @param {number} value Página. @param {string} reason Motivo. @param {boolean} [shouldEmit=true] Emite evento. */
  _setPage(t, e, s = !0) {
    const i = this._page, a = this._count === -1 ? Number.MAX_SAFE_INTEGER : this._lastPageIndex();
    this._page = Math.min(a, Math.max(0, Number.parseInt(t, 10) || 0)), this.update(), s && this._page !== i && _(this.element, "mtx:table:page-change", { page: this._page, previousPage: i, reason: e });
  }
  /** @param {number} value Filas por página. @param {boolean} shouldEmit Emite evento. */
  _setRowsPerPage(t, e) {
    const s = t === -1 ? -1 : Math.max(1, Number.parseInt(t, 10) || 10), i = this._rowsPerPage;
    this._rowsPerPage = s, this._page = 0, this.element.setAttribute("data-rows-per-page", String(s)), this.update(), e && s !== i && _(this.element, "mtx:table:rows-per-page-change", { rowsPerPage: s, previousRowsPerPage: i, page: 0 });
  }
  /** @param {string} name Atributo. @param {number} fallback Alternativa. @param {number} minimum Mínimo. @returns {number} Entero normalizado. */
  _integer(t, e, s) {
    const i = Number.parseInt(this.element.getAttribute(t), 10);
    return Number.isFinite(i) ? Math.max(s, i) : e;
  }
}
d("table", k);
d("table-container", R);
d("table-head", T);
d("table-body", I);
d("table-footer", x);
d("table-foot", x);
d("table-row", N);
d("table-cell", B);
d("table-sort-label", M);
d("table-pagination", q);
d("table-toolbar", O);
S();
export {
  k as Table,
  I as TableBody,
  B as TableCell,
  R as TableContainer,
  x as TableFooter,
  T as TableHead,
  q as TablePagination,
  N as TableRow,
  M as TableSortLabel,
  O as TableToolbar
};
