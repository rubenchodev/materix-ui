import "./select.css";
var A = Object.defineProperty;
var g = (u, c, t) => c in u ? A(u, c, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[c] = t;
var b = (u, c, t) => g(u, typeof c != "symbol" ? c + "" : c, t);
import { r as y, C as E, v, x as C, h as p, t as r, F as _, N as O, J as T, z as L, A as x, B as k, P as w, b as S, q as N } from "../chunks/core-CJdkPtZx.js";
const R = ["primary", "secondary", "error", "warning", "info", "success"], I = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';
class q extends E {
  /**
   * Crea una instancia del campo de selección.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    const e = t instanceof HTMLSelectElement && t.parentElement ? t.parentElement.closest(".mtx-select") : null;
    if (e)
      t = e;
    else if (t instanceof HTMLSelectElement) {
      const h = document.createElement("div");
      h.className = "mtx-select", Array.from(t.attributes).forEach((m) => {
        m.name === "class" ? h.className += " " + m.value : (m.name.startsWith("data-") || m.name === "label") && h.setAttribute(m.name, m.value);
      }), t.parentNode && t.parentNode.insertBefore(h, t), h.appendChild(t), t = h;
    }
    super(t);
    /**
     * Reposiciona el menú al hacer scroll o resize; lo cierra si el control
     * queda fuera del viewport.
     */
    b(this, "_handleReposition", () => {
      if (!this.element.classList.contains("mtx-select--open")) return;
      const t = this.control.getBoundingClientRect();
      if (t.bottom < 0 || t.top > window.innerHeight) {
        this._setOpen(!1);
        return;
      }
      this._positionMenu({ keepSide: !0 });
    });
    if (this.select = t.querySelector("select") || (t instanceof HTMLSelectElement ? t : null), !this.select) throw new TypeError("Select requiere un elemento <select>.");
    let s = t.querySelector(".mtx-select__control");
    s || (s = document.createElement("div"), s.className = "mtx-select__control", this.select.parentNode.insertBefore(s, this.select), s.appendChild(this.select)), this.control = s;
    const i = t.getAttribute("data-label") || t.getAttribute("label") || this.select.getAttribute("data-label");
    let l = t.querySelector(".mtx-select__label");
    i && !l && (l = document.createElement("label"), l.className = "mtx-select__label", l.textContent = i, t.insertBefore(l, s)), this.label = l, this._id = t.id || v("mtx-select"), t.id || (t.id = this._id), this.control.id = this.control.id || `${this._id}-control`, this.readOnly = t.hasAttribute("data-readonly") || this.select.hasAttribute("readonly"), this.placeholder = t.getAttribute("data-placeholder") || this.select.getAttribute("title") || "";
    const n = t.getAttribute("data-variant") || this.select.getAttribute("data-variant") || "outlined";
    this.variant = n, t.classList.add(`mtx-select--${n}`);
    const a = t.getAttribute("data-color") || this.select.getAttribute("data-color");
    this.color = R.includes(a) ? a : "primary", t.classList.add(`mtx-select--color-${this.color}`), a && a !== "error" && a !== "primary" && t.classList.add(`mtx-select--${a}`), (t.hasAttribute("data-error") || this.select.hasAttribute("data-error")) && t.classList.add("mtx-select--error"), (t.hasAttribute("data-small") || t.getAttribute("data-size") === "small" || this.select.hasAttribute("data-small") || this.select.getAttribute("data-size") === "small") && t.classList.add("mtx-select--small"), (t.hasAttribute("data-disabled") || this.select.disabled) && (this.select.disabled = !0);
    const o = t.getAttribute("data-helper-text") || this.select.getAttribute("data-helper-text");
    let d = t.querySelector(".mtx-select__helper-text");
    !d && o && (d = document.createElement("div"), d.className = "mtx-select__helper-text", d.id = `${this._id}-helper-text`, d.textContent = o, t.appendChild(d)), this.helperTextElement = d, this.searchEnabled = t.hasAttribute("data-search") || this.select.hasAttribute("data-search"), this._noneResultsTextOverride = t.getAttribute("data-none-results-text") || t.getAttribute("data-no-results-text") || this.select.getAttribute("data-none-results-text") || this.select.getAttribute("data-no-results-text") || null, this.actionsBox = t.hasAttribute("data-actions-box") || this.select.hasAttribute("data-actions-box"), this._selectAllTextOverride = t.getAttribute("data-select-all-text") || this.select.getAttribute("data-select-all-text") || null, this._deselectAllTextOverride = t.getAttribute("data-deselect-all-text") || t.getAttribute("data-clear-all-text") || this.select.getAttribute("data-deselect-all-text") || this.select.getAttribute("data-clear-all-text") || null, this.header = t.getAttribute("data-header") || this.select.getAttribute("data-header") || "";
    const f = t.getAttribute("data-max-options") || this.select.getAttribute("data-max-options");
    this.maxOptions = f ? parseInt(f, 10) : 1 / 0, this.textFormat = t.getAttribute("data-selected-text-format") || this.select.getAttribute("data-selected-text-format") || "values", this._textFormatCount = this._parseCountFormat(this.textFormat), this.placeholder && !this.select.multiple && !Array.from(this.select.options).some((h) => h.defaultSelected) && (this.select.selectedIndex = -1), this._stopAutoUpdate = null, this._openRaf = null, this._searchTimer = null, this.onDestroy(() => {
      this._unbindReposition(), this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = null, clearTimeout(this._searchTimer), this._searchTimer = null;
    }), this._buildControl(), this._buildMenu(), this._bindEvents(), this._sync(), C(this.select, this), this.select.hasAttribute("data-mtx") && this.select.setAttribute("data-mtx-initialized", ""), this._handleLocaleChange = () => this._refreshI18nTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange);
  }
  /**
   * Interpreta formatos como `count > 3`.
   *
   * @param {string} format Valor de `data-selected-text-format`.
   * @returns {number} Umbral o `Infinity` si no aplica.
   */
  _parseCountFormat(t) {
    const e = /^count\s*>\s*(\d+)$/.exec(t);
    return e ? parseInt(e[1], 10) : 1 / 0;
  }
  /**
   * Añade el chevron, adornments, outline y oculta el `<select>` nativo.
   */
  _buildControl() {
    const t = this.element.getAttribute("data-start-icon") || this.select.getAttribute("data-start-icon");
    let e = this.control.querySelector(".mtx-select__adornment--start");
    !e && t && (/^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(t) || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(t) ? (e = document.createElement("img"), e.className = "mtx-select__adornment mtx-select__adornment--start mtx-select__adornment--image", e.src = t, e.alt = "", e.setAttribute("aria-hidden", "true")) : (e = document.createElement("span"), e.className = "mtx-select__adornment mtx-select__adornment--start material-icons", e.setAttribute("aria-hidden", "true"), e.textContent = t), this.control.insertBefore(e, this.control.firstChild)), e && this.element.classList.add("mtx-select--adorned-start"), this.chevron = this.control.querySelector(".mtx-select__chevron"), this.chevron || (this.chevron = document.createElement("span"), this.chevron.className = "mtx-select__chevron", this.control.appendChild(this.chevron)), this.chevron.innerHTML = I, this.display = this.control.querySelector(".mtx-select__display"), this.display || (this.display = document.createElement("span"), this.display.className = "mtx-select__display", this.control.insertBefore(this.display, this.chevron)), this.select.classList.add("mtx-select__native"), this.select.setAttribute("tabindex", "-1"), this.select.setAttribute("aria-hidden", "true"), this.variant === "outlined" && this._buildOutline();
  }
  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label (NotchedOutline canónico de MUI).
   */
  _buildOutline() {
    if (this.control.querySelector(".mtx-select__outline")) return;
    const t = document.createElement("fieldset");
    if (t.className = "mtx-select__outline", t.setAttribute("aria-hidden", "true"), this.label && !this.element.classList.contains("mtx-select--hidden-label") && !this.element.hasAttribute("data-hidden-label")) {
      const s = document.createElement("legend");
      s.className = "mtx-select__legend";
      const i = document.createElement("span");
      i.textContent = this.label.textContent, s.appendChild(i), t.appendChild(s);
    }
    this.control.appendChild(t), this.outline = t;
  }
  /**
   * Construye el menú desplegable (cabecera, búsqueda, acciones, opciones).
   */
  _buildMenu() {
    if (Array.from(this.element.children).filter((e) => e.classList.contains("mtx-select__menu")).forEach((e) => e.remove()), this.menu = document.createElement("div"), this.menu.className = `mtx-select__menu mtx-select__menu--color-${this.color}`, this.menu.id = `${this._id}-listbox`, this.menu.setAttribute("role", "listbox"), this.select.multiple && this.menu.setAttribute("aria-multiselectable", "true"), this.header) {
      const e = document.createElement("div");
      e.className = "mtx-select__header", e.textContent = this.header, this.menu.appendChild(e);
    }
    if (this.searchEnabled) {
      const e = document.createElement("div");
      e.className = "mtx-select__search-wrap", this.search = document.createElement("input"), this.search.type = "text", this.search.className = "mtx-select__search";
      const s = p(this.element);
      this.search.setAttribute("placeholder", r("select", "searchPlaceholder", null, "Search…", s)), this.search.setAttribute("aria-label", r("select", "searchAriaLabel", null, "Search options", s)), e.appendChild(this.search), this.menu.appendChild(e);
    }
    if (this.actionsBox && this.select.multiple) {
      const e = document.createElement("div");
      e.className = "mtx-select__actions";
      const s = p(this.element), i = document.createElement("button");
      i.type = "button", i.className = "mtx-select__action mtx-select__action--select-all", i.textContent = this._selectAllTextOverride || r("select", "selectAllText", null, "Select all", s), i.addEventListener("click", () => this._selectAll());
      const l = document.createElement("button");
      l.type = "button", l.className = "mtx-select__action mtx-select__action--deselect-all", l.textContent = this._deselectAllTextOverride || r("select", "deselectAllText", null, "Deselect all", s), l.addEventListener("click", () => this._clearAll()), e.append(i, l), this.menu.appendChild(e);
    }
    this.optgroups = [], this.optionItems = [];
    const t = (e) => {
      Array.from(e.children).forEach((s) => {
        if (s.tagName === "OPTGROUP") {
          const i = document.createElement("div");
          i.className = "mtx-select__optgroup", i.textContent = s.label || "", this.menu.appendChild(i), this.optgroups.push({ header: i, options: [] }), t(s);
        } else if (s.tagName === "OPTION") {
          const i = document.createElement("div");
          i.className = "mtx-select__option", i.setAttribute("role", "option"), i.tabIndex = -1, i.dataset.value = s.value, i._mtxOption = s;
          const l = s.disabled || !!s.closest("optgroup:disabled");
          if (i.classList.toggle("mtx-select__option--disabled", l), l && i.setAttribute("aria-disabled", "true"), this.select.multiple) {
            const o = document.createElement("span");
            o.className = "mtx-select__check", i.appendChild(o);
          }
          const n = s.getAttribute("data-icon") || s.getAttribute("data-image");
          if (n) {
            const o = this._createIconOrImage(n, "mtx-select__option");
            o && i.appendChild(o);
          }
          const a = document.createElement("span");
          a.className = "mtx-select__option-text", a.textContent = s.text, i.appendChild(a), this.menu.appendChild(i), this.optionItems.push(i), this.optgroups.length && this.optgroups[this.optgroups.length - 1].options.push(i);
        }
      });
    };
    t(this.select), this.noResults = document.createElement("div"), this.noResults.className = "mtx-select__no-results", this.noResults.hidden = !0, this.menu.appendChild(this.noResults), this.menu.hidden = !0, this.element.appendChild(this.menu);
  }
  /**
   * Vincula los eventos de control, menú y búsqueda.
   */
  _bindEvents() {
    this.control.setAttribute("role", "combobox"), this.control.setAttribute("aria-haspopup", "listbox"), this.control.setAttribute("aria-controls", this.menu.id), this.control.setAttribute("aria-expanded", "false"), this.label ? (this.label.id || (this.label.id = `${this._id}-label`), this.control.setAttribute("aria-labelledby", this.label.id)) : this.select.getAttribute("aria-label") && this.control.setAttribute("aria-label", this.select.getAttribute("aria-label")), this._syncAccessibility(), this._handleControlClick = (t) => {
      this.select.disabled || (t.preventDefault(), this._toggleOpen());
    }, this._handleControlKeydown = (t) => {
      this.select.disabled || this.readOnly || (t.key === "ArrowDown" || t.key === "ArrowUp" || t.key === " " ? (t.preventDefault(), this._setOpen(!0)) : t.key === "Enter" && (t.preventDefault(), this._toggleOpen()));
    }, this._handleMenuClick = (t) => {
      const e = t.target.closest(".mtx-select__option");
      e && this._onOptionClick(e);
    }, this._handleMenuKeydown = (t) => {
      if (t.key === "ArrowDown" || t.key === "ArrowUp")
        t.preventDefault(), this._moveFocus(t.key === "ArrowDown" ? 1 : -1);
      else if (t.key === "Enter" || t.key === " ") {
        const e = document.activeElement;
        e && e.classList.contains("mtx-select__option") && (t.preventDefault(), this._onOptionClick(e));
      } else t.key === "Tab" && this._setOpen(!1);
    }, this._handleSearchInput = this._debounce((t) => {
      this._filterOptions(t.target.value);
    }, 150), this.control.addEventListener("click", this._handleControlClick), this.control.addEventListener("keydown", this._handleControlKeydown), this.menu.addEventListener("click", this._handleMenuClick), this.menu.addEventListener("keydown", this._handleMenuKeydown), this.search && this.search.addEventListener("input", this._handleSearchInput), this._handleSelectChange = () => this._sync(), this.select.addEventListener("change", this._handleSelectChange);
  }
  /**
   * Valor(es) seleccionado(s).
   *
   * @returns {string|string[]} Valor único o lista de valores.
   */
  get value() {
    return this.select.multiple ? Array.from(this.select.selectedOptions).map((t) => t.value) : this.select.value;
  }
  /**
   * Establece el valor seleccionado.
   *
   * @param {string|string[]} value Valor único o lista de valores.
   */
  set value(t) {
    if (this.select.multiple) {
      const e = (Array.isArray(t) ? t : [t]).map(String);
      Array.from(this.select.options).forEach((s) => {
        s.selected = e.includes(s.value);
      });
    } else {
      const e = Array.isArray(t) ? t[0] : t, s = Array.from(this.select.options).find((i) => i.value === String(e ?? ""));
      s ? s.selected = !0 : this.select.selectedIndex = -1;
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
    this.select.disabled = !0, this.close(), this._syncAccessibility();
  }
  /** Habilita el componente. */
  enable() {
    this.select.disabled = !1, this._syncAccessibility();
  }
  /** Enfoca el combobox visible. */
  focus() {
    this.control.focus();
  }
  /**
   * Abre el menú desplegable.
   */
  open() {
    this.select.disabled || this.readOnly || this._setOpen(!0);
  }
  /**
   * Cierra el menú desplegable.
   */
  close() {
    this._setOpen(!1);
  }
  /**
   * Alterna la apertura del menú.
   */
  _toggleOpen() {
    this._setOpen(!this.element.classList.contains("mtx-select--open"));
  }
  /**
   * Abre o cierra el menú desplegable.
   *
   * @param {boolean} open `true` para abrir.
   */
  _setOpen(t) {
    t && (this.select.disabled || this.readOnly) || t !== this.element.classList.contains("mtx-select--open") && (this._closeTimer && (clearTimeout(this._closeTimer), this._closeTimer = null), this.element.classList.toggle("mtx-select--open", t), this.control.setAttribute("aria-expanded", String(t)), t ? (this.menu.parentElement !== _() && _().appendChild(this.menu), this.menu.hidden = !1, this._positionMenu(), this.menu.style.opacity = "0", this.menu.style.transform = "scale(0.85, 0.85)", this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = requestAnimationFrame(() => {
      this._openRaf = null, this.menu.style.transition = "transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 225ms cubic-bezier(0, 0, 0.2, 1)", this.menu.style.opacity = "1", this.menu.style.transform = "scale(1, 1)";
    }), this._clickAwayCleanup = O(this.control, (e) => {
      this.menu && this.menu.contains(e.target) || T(this, e.target) || this._setOpen(!1);
    }), L(this, {
      kind: "popup",
      nodes: this.menu,
      stack: [{ node: _() }],
      onEscape: () => {
        this._setOpen(!1), this.control.focus();
      }
    }), this._bindReposition(), this._focusInitial()) : (this.menu.style.opacity = "0", this.menu.style.transform = "scale(0.85, 0.85)", this._closeTimer = setTimeout(() => {
      this.menu.hidden = !0, this.menu.parentElement && this.menu.parentElement.removeChild(this.menu), this.element && this.element.appendChild(this.menu), this._closeTimer = null;
    }, 225), this._openRaf && cancelAnimationFrame(this._openRaf), this._openRaf = null, this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._unbindReposition(), x(this)));
  }
  /**
   * Posiciona el menú dentro del viewport y lo invierte cuando hay más
   * espacio disponible sobre el control.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   */
  _positionMenu({ keepSide: t = !1 } = {}) {
    t || (this._rtl = k(this.control), this.menu.setAttribute("dir", this._rtl ? "rtl" : "ltr"));
    const e = w(this.control, this.menu, {
      placement: "bottom-start",
      offset: 4,
      padding: 16,
      matchWidth: !0,
      rtl: this._rtl,
      // Las recolocaciones (scroll, filtrado) mantienen el lado elegido al abrir.
      lockSide: t ? this._side : void 0
    });
    this._side = e.side;
  }
  /**
   * Reposiciona el menú abierto ante scroll, resize o cambios de tamaño (`autoUpdate`).
   */
  _bindReposition() {
    this._unbindReposition();
    let t = !0;
    this._stopAutoUpdate = S(this.control, this.menu, () => {
      if (t) {
        t = !1;
        return;
      }
      this._handleReposition();
    });
  }
  /**
   * Detiene el reposicionamiento automático.
   */
  _unbindReposition() {
    this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null);
  }
  /**
   * Enfoca la búsqueda (si existe) o la primera opción seleccionada.
   */
  _focusInitial() {
    if (this.search && this.searchEnabled) {
      this.search.focus();
      return;
    }
    const t = Array.from(this.menu.querySelectorAll(".mtx-select__option")).filter(
      (i) => !i.classList.contains("mtx-select__option--disabled") && !i.classList.contains("mtx-select__option--hidden")
    ), e = Array.from(this.select.selectedOptions), s = t.find((i) => i._mtxOption && e.includes(i._mtxOption)) || t[0];
    s && s.focus();
  }
  /**
   * Maneja el clic en una opción.
   *
   * @param {HTMLElement} option Elemento `.mtx-select__option`.
   */
  _onOptionClick(t) {
    if (this.readOnly || t.classList.contains("mtx-select__option--disabled")) return;
    const e = t._mtxOption || this._findOption(t.dataset.value);
    if (!(!e || e.disabled || e.parentElement.tagName === "OPTGROUP" && e.parentElement.disabled)) {
      if (this.select.multiple) {
        const s = this.select.selectedOptions.length;
        if (!e.selected && s >= this.maxOptions) return;
        e.selected = !e.selected;
      } else
        e.selected = !0;
      this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 })), this.select.multiple || (this._setOpen(!1), this.control.focus());
    }
  }
  /**
   * Selecciona todas las opciones disponibles (solo múltiple).
   */
  _selectAll() {
    if (!this.select.multiple || this.readOnly || this.select.disabled) return;
    let t = 0;
    Array.from(this.select.options).forEach((e) => {
      const s = e.disabled || e.parentElement.tagName === "OPTGROUP" && e.parentElement.disabled;
      e.selected = !s && t < this.maxOptions, e.selected && (t += 1);
    }), this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Limpia todas las opciones seleccionadas (solo múltiple).
   */
  _clearAll() {
    !this.select.multiple || this.readOnly || this.select.disabled || (Array.from(this.select.options).forEach((t) => {
      t.selected = !1;
    }), this._sync(), this.select.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  /**
   * Mueve el foco entre las opciones del menú.
   *
   * @param {number} step Dirección (`1` abajo, `-1` arriba).
   */
  _moveFocus(t) {
    const e = Array.from(this.menu.querySelectorAll(".mtx-select__option")).filter(
      (l) => !l.classList.contains("mtx-select__option--disabled") && !l.classList.contains("mtx-select__option--hidden")
    );
    if (!e.length) return;
    const s = document.activeElement;
    let i = e.indexOf(s);
    i += t, i < 0 && (i = e.length - 1), i >= e.length && (i = 0), e[i].focus();
  }
  /**
   * Busca el `<option>` nativo cuyo valor coincide.
   *
   * @param {string} value Valor a buscar.
   * @returns {HTMLOptionElement|undefined} Opción encontrada.
   */
  _findOption(t) {
    return Array.from(this.select.options).find((e) => e.value === t);
  }
  /**
   * Filtra las opciones del menú según el texto de búsqueda.
   *
   * @param {string} term Texto a buscar.
   */
  _filterOptions(t) {
    const e = (t || "").toLowerCase().trim();
    let s = !1;
    if (this.optionItems.forEach((i) => {
      const l = !e || i.dataset.searchable.includes(e);
      i.classList.toggle("mtx-select__option--hidden", !l), l && (s = !0);
    }), this.optgroups.forEach((i) => {
      const l = i.options.some(
        (n) => !n.classList.contains("mtx-select__option--hidden")
      );
      i.header.classList.toggle("mtx-select__optgroup--hidden", !l);
    }), this.noResults)
      if (!s && e) {
        const i = p(this.element), l = this._noneResultsTextOverride || r("select", "noneResultsText", null, 'No results found for "{0}"', i), n = l.includes("{0}") ? l.replace("{0}", t) : l;
        this.noResults.textContent = n, this.noResults.hidden = !1;
      } else
        this.noResults.hidden = !0;
  }
  /**
   * Sincroniza la interfaz con el estado del select nativo.
   */
  _sync() {
    this._syncAccessibility(), this._renderDisplay(), this._syncMenu();
  }
  /** Sincroniza estado ARIA y tabulación con el select nativo. */
  _syncAccessibility() {
    const t = this.select.disabled;
    this.control.tabIndex = t ? -1 : 0, this.control.setAttribute("aria-disabled", String(t)), this.readOnly ? this.control.setAttribute("aria-readonly", "true") : this.control.removeAttribute("aria-readonly"), this.select.required ? this.control.setAttribute("aria-required", "true") : this.control.removeAttribute("aria-required"), this.element.classList.contains("mtx-select--error") || this.select.getAttribute("aria-invalid") === "true" ? this.control.setAttribute("aria-invalid", "true") : this.control.removeAttribute("aria-invalid");
    let s = this.select.getAttribute("aria-describedby") || "";
    this.helperTextElement && (s ? s.split(/\s+/).includes(this.helperTextElement.id) || (s = `${s} ${this.helperTextElement.id}`) : s = this.helperTextElement.id), s ? this.control.setAttribute("aria-describedby", s) : this.control.removeAttribute("aria-describedby");
  }
  /**
   * Texto de ayuda o soporte del selector.
   *
   * @returns {string} Texto actual.
   */
  get helperText() {
    return this.helperTextElement ? this.helperTextElement.textContent : "";
  }
  /**
   * Actualiza el texto de ayuda o soporte del selector.
   *
   * @param {string} text Nuevo texto.
   */
  set helperText(t) {
    !this.helperTextElement && t && (this.helperTextElement = document.createElement("div"), this.helperTextElement.className = "mtx-select__helper-text", this.helperTextElement.id = `${this._id}-helper-text`, this.element.appendChild(this.helperTextElement)), this.helperTextElement && (this.helperTextElement.textContent = t, t || (this.helperTextElement.remove(), this.helperTextElement = null)), this._syncAccessibility();
  }
  /**
   * Actualiza el texto mostrado en el control.
   */
  _renderDisplay() {
    const t = Array.from(this.select.options).filter((n) => n.selected);
    let e = this.placeholder, s = null, i = !t.length;
    if (this.select.multiple) {
      if (t.length)
        if (this.textFormat === "static")
          e = this.placeholder;
        else if (this.textFormat === "count") {
          const n = p(this.element), a = t.length === 1 ? "selectedCountSingular" : "selectedCountPlural";
          e = r("select", a, [t.length], `${t.length} selected`, n);
        } else if (this.textFormat === "values" || t.length <= this._textFormatCount)
          e = t.map((n) => n.text).join(", ");
        else {
          const n = p(this.element);
          e = r("select", "selectedCountPlural", [t.length], `${t.length} selected`, n);
        }
    } else if (t[0]) {
      const n = t[0];
      n.value === "" && this.placeholder ? i = !0 : (e = n.text, s = n.getAttribute("data-icon") || n.getAttribute("data-image"));
    }
    if (this.display.innerHTML = "", s) {
      const n = this._createIconOrImage(s, "mtx-select__display");
      n && this.display.appendChild(n);
    }
    const l = document.createElement("span");
    l.className = "mtx-select__display-text", l.textContent = e, this.display.appendChild(l), this.display.classList.toggle("mtx-select__display--empty", i);
  }
  /**
   * Actualiza el estado de las opciones del menú y aplica `data-max-options`.
   */
  _syncMenu() {
    if (!this.menu) return;
    const t = Array.from(this.select.selectedOptions), e = this.select.multiple && t.length >= this.maxOptions;
    Array.from(this.menu.querySelectorAll(".mtx-select__option")).forEach((s) => {
      const i = s._mtxOption || this._findOption(s.dataset.value), l = !!(i && i.selected);
      s.classList.toggle("mtx-select__option--selected", l), s.setAttribute("aria-selected", String(l)), s.dataset.searchable === void 0 && i && (s.dataset.searchable = (i.text + " " + i.value).toLowerCase());
      const a = !!(i && (i.disabled || i.parentElement.tagName === "OPTGROUP" && i.parentElement.disabled)) || e && !l;
      s.classList.toggle("mtx-select__option--disabled", a), a ? s.setAttribute("aria-disabled", "true") : s.removeAttribute("aria-disabled");
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
  _debounce(t, e) {
    return (...s) => {
      clearTimeout(this._searchTimer), this._searchTimer = setTimeout(() => {
        this._searchTimer = null, t.apply(this, s);
      }, e);
    };
  }
  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    x(this), this.control.removeEventListener("click", this._handleControlClick), this.control.removeEventListener("keydown", this._handleControlKeydown), this.menu.removeEventListener("click", this._handleMenuClick), this.menu.removeEventListener("keydown", this._handleMenuKeydown), this.search && this.search.removeEventListener("input", this._handleSearchInput), this.select.removeEventListener("change", this._handleSelectChange), this._closeTimer && clearTimeout(this._closeTimer), this._closeTimer = null, this.menu && this.element && this.menu.parentElement !== this.element && (this.menu.hidden = !0, this.element.appendChild(this.menu)), this.element.classList.remove("mtx-select--open"), this.control && this.control.setAttribute("aria-expanded", "false"), super.destroy();
  }
  /**
   * Refresca los textos del componente cuando cambia el idioma global.
   */
  _refreshI18nTexts() {
    const t = p(this.element);
    if (this.search && (this.search.setAttribute("placeholder", r("select", "searchPlaceholder", null, "Search…", t)), this.search.setAttribute("aria-label", r("select", "searchAriaLabel", null, "Search options", t))), this.actionsBox && this.select.multiple) {
      const e = this.menu.querySelector(".mtx-select__action--select-all"), s = this.menu.querySelector(".mtx-select__action--deselect-all");
      e && !this._selectAllTextOverride && (e.textContent = r("select", "selectAllText", null, "Select all", t)), s && !this._deselectAllTextOverride && (s.textContent = r("select", "deselectAllText", null, "Deselect all", t));
    }
    this._renderDisplay();
  }
  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(t) {
    return typeof t == "string" && (/^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(t) || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(t));
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
  _createIconOrImage(t, e) {
    if (!t) return null;
    if (this._isImageUrl(t)) {
      const i = document.createElement("img");
      return i.className = `${e}-image`, i.src = t, i.alt = "", i.setAttribute("aria-hidden", "true"), i;
    }
    const s = document.createElement("span");
    return s.className = `${e}-icon material-icons`, s.setAttribute("aria-hidden", "true"), s.textContent = t, s;
  }
}
y("select", q);
N();
export {
  q as Select
};
