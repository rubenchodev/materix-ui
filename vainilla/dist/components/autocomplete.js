import "./form-helper-text.css";
import "./icon-button.css";
import "./text-field.css";
import "./chip.css";
import "./progress.css";
import "./autocomplete.css";
import { r as y, C as A, x as f, v as S, j as d, D as O, E, z as I, g as c, A as m, F as g, b as C, c as T, t as B, h as L, y as b, q as F } from "../chunks/core-CJdkPtZx.js";
import { T as v } from "../chunks/text-field-BJ35FqKf.js";
import { C as V } from "../chunks/chip-ugJELXN0.js";
import { c as N } from "../chunks/progress-B9O329FF.js";
const x = 5, H = [
  "data-label",
  "data-variant",
  "data-size",
  "data-small",
  "data-color",
  "data-start-icon",
  "data-helper-text",
  "data-error"
], k = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', q = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';
function h(o) {
  return String(o ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function P(o, t, e = !1) {
  const i = h(t);
  if (!i.trim() || !o) return null;
  let s = "";
  const l = [];
  let n = 0;
  for (const r of String(o)) {
    for (const u of h(r))
      s += u, l.push({ start: n, end: n + r.length });
    n += r.length;
  }
  const a = s.indexOf(i);
  return a === -1 || e && a !== 0 ? null : { start: l[a].start, end: l[a + i.length - 1].end };
}
function _(o) {
  if (o == null) return null;
  if (typeof o != "object") {
    const s = String(o);
    return { value: s, label: s };
  }
  const t = o.value !== void 0 && o.value !== null ? String(o.value) : String(o.label ?? ""), e = o.label !== void 0 && o.label !== null ? String(o.label) : t, i = { ...o, value: t, label: e };
  return o.group !== void 0 && o.group !== null && o.group !== "" ? i.group = String(o.group) : delete i.group, i.disabled = !!o.disabled, i.disabled || delete i.disabled, i;
}
function p(o) {
  return !o || !o.querySelectorAll ? [] : Array.from(o.querySelectorAll("option")).map((t) => {
    const e = t.hasAttribute("value") ? t.getAttribute("value") : t.textContent.trim();
    if (e === "") return null;
    const i = t.parentElement && t.parentElement.tagName === "OPTGROUP" ? t.parentElement : null;
    return _({
      value: e,
      label: t.getAttribute("label") || t.textContent.trim() || e,
      group: i ? i.label : t.getAttribute("data-group") || void 0,
      disabled: t.disabled || !!(i && i.disabled),
      icon: t.getAttribute("data-icon") || void 0,
      description: t.getAttribute("data-description") || void 0
    });
  }).filter(Boolean);
}
class D extends A {
  /**
   * Crea una instancia del Autocomplete.
   *
   * @param {HTMLElement} element `<input>`, `<select>` o contenedor `.mtx-autocomplete`.
   * @throws {TypeError} Si no hay un `<input>` o `<select>` utilizable.
   */
  constructor(t) {
    let e = t, i = null;
    if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement ? (i = t, e = t.closest(".mtx-autocomplete"), e || (e = document.createElement("div"), e.className = "mtx-autocomplete", t.getAttribute("class") && (e.className += ` ${t.getAttribute("class")}`), t.parentNode && t.parentNode.insertBefore(e, t))) : i = t.querySelector("select") || t.querySelector('input:not([type="hidden"])'), !i) throw new TypeError("Autocomplete requiere un <input> o <select>.");
    super(e), e.classList.add("mtx-autocomplete"), this._configSource = i, this._source = i, this._timers = /* @__PURE__ */ new Set(), this._readConfig(), this._buildInput(i), this._buildField(), this._buildAdornments(), this._buildPopup(), this._loadOptions(i), this._loadInitialValue(i), this._bindEvents(), i instanceof HTMLSelectElement && i.parentNode && i.remove(), f(this.input, this), this.input !== i && f(i, this), this.loading = this._flag("data-loading"), this._syncDisabled(), this._resetInputValue(!1), this._syncState();
  }
  // ------------------------------------------------------------------
  // Configuración y construcción
  // ------------------------------------------------------------------
  /**
   * Lee un atributo de configuración del contenedor o del elemento de origen.
   *
   * @param {string} name Nombre del atributo.
   * @returns {string|null} Valor o `null`.
   */
  _cfg(t) {
    if (this.element.hasAttribute(t)) return this.element.getAttribute(t);
    const e = this._configSource;
    return e && e.hasAttribute(t) ? e.getAttribute(t) : null;
  }
  /**
   * Interpreta un atributo booleano (`data-x`, `data-x="true"`; `"false"` lo desactiva).
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} Valor booleano.
   */
  _flag(t) {
    const e = this._cfg(t);
    return e !== null && e !== "false";
  }
  /** Lee todas las opciones de comportamiento desde `data-*`. */
  _readConfig() {
    const t = this._configSource;
    this.multiple = this._flag("data-multiple") || t instanceof HTMLSelectElement && t.multiple, this.freeSolo = this._flag("data-free-solo"), this.disableCloseOnSelect = this._flag("data-disable-close-on-select"), this.clearOnEscape = this._flag("data-clear-on-escape"), this.disableClearable = this._flag("data-disable-clearable"), this.autoHighlight = this._flag("data-auto-highlight"), this.autoSelect = this._flag("data-auto-select"), this.openOnFocus = this._flag("data-open-on-focus"), this.filterSelectedOptions = this._flag("data-filter-selected-options"), this.selectOnFocus = !this.freeSolo, this.handleHomeEndKeys = !this.freeSolo;
    const e = parseInt(this._cfg("data-limit-tags"), 10);
    this.limitTags = Number.isFinite(e) && e >= 0 ? e : -1, this.matchFrom = this._cfg("data-match-from") === "start" ? "start" : "any";
    const i = this._cfg("data-filter");
    this.filterEnabled = i !== "false" && i !== "none";
    const s = parseInt(this._cfg("data-debounce"), 10);
    this.debounce = Number.isFinite(s) && s > 0 ? s : 0, this.valueFormat = this._cfg("data-value-format") === "csv" ? "csv" : "multiple", this.separator = this._cfg("data-separator") ?? ",";
    const l = this._cfg("data-force-popup-icon");
    this.hasPopupIcon = l === null ? !this.freeSolo : l !== "false", this.small = this._cfg("data-size") === "small" || this._flag("data-small");
    const n = this._cfg("data-color");
    this.color = ["secondary", "error", "warning", "info", "success"].includes(n) ? n : "primary", this.required = !!t.required || this._flag("data-required"), this.readOnly = t.hasAttribute("readonly") || this._flag("data-read-only") || this._flag("data-readonly"), this._disabled = !!t.disabled || this._flag("data-disabled");
  }
  /**
   * Prepara el `<input>` visible (lo crea si el origen es un `<select>`).
   *
   * @param {HTMLInputElement|HTMLSelectElement} source Elemento de origen.
   */
  _buildInput(t) {
    let e = t;
    t instanceof HTMLSelectElement && (e = this.element.querySelector("input.mtx-autocomplete__input") || document.createElement("input"), e.type = "text", ["id", "placeholder", "aria-label", "aria-labelledby", "aria-describedby", "form", "autofocus"].forEach((i) => {
      t.hasAttribute(i) && !e.hasAttribute(i) && e.setAttribute(i, t.getAttribute(i));
    }), t.id && t.removeAttribute("id"), !e.parentNode && t.parentNode && t.parentNode.insertBefore(e, t)), this.input = e, e.id || (e.id = S("mtx-autocomplete")), this._id = e.id, this.name = t.getAttribute("name") || this._cfg("data-name") || null, e.hasAttribute("name") && e.removeAttribute("name"), this._formAttr = t.getAttribute("form"), this._listId = e.getAttribute("list"), this._listId && e.removeAttribute("list"), e.removeAttribute("required"), e.required = !1, e.disabled = !1, e.classList.add("mtx-autocomplete__input"), e.setAttribute("role", "combobox"), e.setAttribute("aria-autocomplete", "list"), e.setAttribute("aria-expanded", "false"), e.setAttribute("autocomplete", "off"), e.setAttribute("autocapitalize", "none"), e.setAttribute("spellcheck", "false"), this.readOnly && (e.readOnly = !0);
  }
  /** Envuelve el input en un TextField (variantes, tamaños, label, helper y error). */
  _buildField() {
    let t = this.element.querySelector(".mtx-text-field");
    t || (t = document.createElement("div"), t.className = "mtx-text-field", this.input.parentNode && this.element.contains(this.input) ? this.input.parentNode.insertBefore(t, this.input) : this.element.appendChild(t), t.appendChild(this.input)), t.classList.add("mtx-autocomplete__field"), H.forEach((i) => {
      const s = this._cfg(i);
      s !== null && !t.hasAttribute(i) && t.setAttribute(i, s);
    }), this.small && !t.hasAttribute("data-size") && t.setAttribute("data-size", "small"), this.textField = d(t) instanceof v ? d(t) : new v(t), this.field = t, this.container = this.textField.container, this.container.classList.add("mtx-autocomplete__input-root"), this.label = this.textField.label || null, this.label && !this.label.id && (this.label.id = `${this._id}-label`);
    const e = this.textField._syncAria.bind(this.textField);
    this.textField._syncAria = () => {
      e(), this.multiple && this._values && this._values.length && this.field.classList.add("mtx-text-field--has-value");
    };
  }
  /** Crea el adorno final (cargando, limpiar, abrir), los valores ocultos y la región viva. */
  _buildAdornments() {
    this.element.querySelectorAll(
      ".mtx-autocomplete__end-adornment, .mtx-autocomplete__values, .mtx-autocomplete__live"
    ).forEach((e) => e.remove()), this.container.querySelectorAll(".mtx-autocomplete__tag, .mtx-autocomplete__tag-more").forEach((e) => e.remove());
    const t = document.createElement("span");
    t.className = "mtx-autocomplete__end-adornment", this.loadingSlot = document.createElement("span"), this.loadingSlot.className = "mtx-autocomplete__loading-indicator", this.loadingSlot.hidden = !0, this.clearButton = this._createIndicator("clear", k), this.popupButton = this._createIndicator("popup", q), this.popupButton.hidden = !this.hasPopupIcon, t.append(this.loadingSlot, this.clearButton, this.popupButton), this.container.appendChild(t), this.endAdornment = t, this.valuesHost = document.createElement("span"), this.valuesHost.className = "mtx-autocomplete__values", this.valuesHost.hidden = !0, this.element.appendChild(this.valuesHost), this.live = document.createElement("div"), this.live.className = "mtx-autocomplete__live", this.live.setAttribute("role", "status"), this.live.setAttribute("aria-live", "polite"), this.live.setAttribute("aria-atomic", "true"), this.element.appendChild(this.live), this._refreshTexts();
  }
  /**
   * Crea un botón indicador (limpiar o abrir) fuera del orden de tabulación, como MUI.
   *
   * @param {'clear'|'popup'} kind Tipo de indicador.
   * @param {string} svg Icono SVG.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createIndicator(t, e) {
    const i = document.createElement("button");
    return i.type = "button", i.tabIndex = -1, i.className = `mtx-autocomplete__indicator mtx-autocomplete__${t}-indicator`, i.innerHTML = e, i;
  }
  /** Crea la superficie flotante (Paper + listbox + mensaje de estado). */
  _buildPopup() {
    this.popper = document.createElement("div"), this.popper.className = `mtx-autocomplete__popper mtx-autocomplete__popper--${this.color}`, this.paper = document.createElement("div"), this.paper.className = "mtx-autocomplete__paper", this.listbox = document.createElement("ul"), this.listbox.className = "mtx-autocomplete__listbox", this.listbox.id = `${this._id}-listbox`, this.listbox.setAttribute("role", "listbox"), this.label ? this.listbox.setAttribute("aria-labelledby", this.label.id) : this.input.getAttribute("aria-label") && this.listbox.setAttribute("aria-label", this.input.getAttribute("aria-label")), this.multiple && this.listbox.setAttribute("aria-multiselectable", "true"), this.status = document.createElement("div"), this.status.className = "mtx-autocomplete__status", this.paper.append(this.listbox, this.status), this.popper.appendChild(this.paper), this._optionEls = [];
  }
  /**
   * Carga las opciones iniciales: `<select>`, `data-options` (selector o JSON) o `list`.
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadOptions(t) {
    let e = [];
    const i = this._cfg("data-options");
    if (t instanceof HTMLSelectElement)
      e = p(t);
    else if (i && i.trim().startsWith("["))
      try {
        e = JSON.parse(i);
      } catch (s) {
        console.warn("[Materix UI] Autocomplete: data-options no es un JSON válido.", s);
      }
    else if (i) {
      let s = null;
      try {
        s = document.querySelector(i);
      } catch {
        s = null;
      }
      e = p(s);
    } else this._listId ? e = p(document.getElementById(this._listId)) : e = p(this.element.querySelector("datalist"));
    this._options = (Array.isArray(e) ? e : []).map(_).filter(Boolean), this._filtered = [], this._highlighted = -1;
  }
  /**
   * Determina el valor inicial (`data-value`, `value` del input u opciones `selected`).
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadInitialValue(t) {
    let e = this._cfg("data-value");
    if (e === null)
      if (t instanceof HTMLSelectElement) {
        const s = Array.from(t.options).filter((l) => l.defaultSelected && l.value !== "").map((l) => l.value);
        e = this.multiple ? s : s[0] ?? "";
      } else
        e = t.value || "";
    let i = e;
    if (typeof e == "string") {
      const s = e.trim();
      if (!s) i = [];
      else if (this.multiple && s.startsWith("["))
        try {
          i = JSON.parse(s);
        } catch {
          i = [s];
        }
      else this.multiple ? i = s.split(this.separator).map((l) => l.trim()).filter(Boolean) : i = [s];
    }
    this._values = this._resolveValues(i), this.multiple || (this._values = this._values.slice(0, 1)), this._initialValues = this._values.slice(), this._syncHiddenInputs();
  }
  // ------------------------------------------------------------------
  // Eventos
  // ------------------------------------------------------------------
  /** Registra todos los listeners (se retiran solos en `destroy()`). */
  _bindEvents() {
    this._selectOnFocusPending = !0, this.listen(this.input, "input", (t) => this._onInput(t)), this.listen(this.input, "keydown", (t) => this._onKeyDown(t)), this.listen(this.input, "focus", () => this._onFocus()), this.listen(this.input, "blur", (t) => this._onBlur(t)), this.listen(this.input, "mousedown", (t) => this._onInputMouseDown(t)), this.listen(this.input, "click", () => {
      this.selectOnFocus && this._selectOnFocusPending && this.input.selectionStart === this.input.selectionEnd && this.input.value && this.input.select(), this._selectOnFocusPending = !1;
    }), this.listen(this.container, "mousedown", (t) => {
      t.target !== this.input && (t.target.closest(".mtx-autocomplete__tag, .mtx-autocomplete__indicator") || (t.preventDefault(), !this._disabled && (document.activeElement !== this.input && this.input.focus(), this._onInputMouseDown(t))));
    }), this.listen(this.clearButton, "mousedown", (t) => t.preventDefault()), this.listen(this.clearButton, "click", () => {
      this._disabled || this.readOnly || (this.input.focus(), this._clear("clear"));
    }), this.listen(this.popupButton, "mousedown", (t) => t.preventDefault()), this.listen(this.popupButton, "click", () => {
      this._disabled || this.readOnly || (this.input.focus(), this._setOpen(!this._open, "toggleInput"));
    }), this.listen(this.popper, "mousedown", (t) => t.preventDefault()), this.listen(this.popper, "click", (t) => {
      const e = t.target.closest(".mtx-autocomplete__option");
      if (!e || e.getAttribute("aria-disabled") === "true") return;
      const i = this._filtered[Number(e.dataset.optionIndex)];
      i && this._selectOption(i, "selectOption");
    }), this.listen(this.popper, "mousemove", (t) => {
      const e = t.target.closest(".mtx-autocomplete__option");
      if (!e || e.getAttribute("aria-disabled") === "true") return;
      const i = Number(e.dataset.optionIndex);
      i !== this._highlighted && this._setHighlight(i, { scroll: !1, reason: "mouse" });
    }), this.listen(this.element, "mtx:chip:delete", (t) => {
      const e = t.target.closest(".mtx-autocomplete__tag");
      !e || this._disabled || this.readOnly || (t.stopPropagation(), this._removeValueAt(Number(e.dataset.tagIndex)), this.input.focus());
    }), this.listen(this.element, "keydown", (t) => this._onTagKeyDown(t)), this.listen(this.element, "focusin", () => this._setFocused(!0)), this.listen(this.element, "focusout", (t) => {
      t.relatedTarget && this.element.contains(t.relatedTarget) || this._setFocused(!1);
    }), this.listen(document, "mtx:localechange", () => this._refreshTexts()), this.input.form && this.listen(this.input.form, "reset", () => {
      this._defer(() => {
        this._values = this._initialValues.slice(), this._afterValueChange(), this._resetInputValue(!1), this._setOpen(!1, "reset");
      }, 0);
    });
  }
  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} fn Función a ejecutar.
   * @param {number} ms Milisegundos.
   * @returns {number} Identificador del temporizador.
   */
  _defer(t, e) {
    const i = setTimeout(() => {
      this._timers.delete(i), t();
    }, e);
    return this._timers.add(i), i;
  }
  /**
   * Gestiona la escritura: filtra, abre el popup y emite `mtx:autocomplete:input`.
   */
  _onInput() {
    const t = this.input.value;
    !this._open && t !== "" && this._setOpen(!0, "input", { silentRefresh: !0 }), this._dirty = !0, t === "" && !this.multiple && !this.disableClearable && this._values.length && this._setValues([], "clear"), this._emitInput("input"), this._refresh(), this._syncState();
  }
  /**
   * Emite `mtx:autocomplete:input`, con debounce opcional (`data-debounce`) para escritura.
   *
   * @param {string} reason `input`, `reset` o `clear`.
   */
  _emitInput(t) {
    const e = () => c(this.element, "mtx:autocomplete:input", { inputValue: this.input.value, reason: t });
    t === "input" && this.debounce ? (this._debounceTimer && (clearTimeout(this._debounceTimer), this._timers.delete(this._debounceTimer)), this._debounceTimer = this._defer(e, this.debounce)) : e();
  }
  /**
   * Clic sobre el input: alterna el popup (como `handleInputMouseDown` de MUI).
   *
   * @param {MouseEvent} event Evento de ratón.
   */
  _onInputMouseDown(t) {
    t.button !== void 0 && t.button !== 0 || this._disabled || this.readOnly || (this.input.value === "" || !this._open) && this._setOpen(!this._open, "toggleInput");
  }
  /** Foco en el input: abre si `data-open-on-focus`. */
  _onFocus() {
    this._setFocused(!0), this.openOnFocus && !this._open && this._setOpen(!0, "focus");
  }
  /**
   * Pérdida de foco: autoSelect, confirmación en free solo o restauración del texto.
   */
  _onBlur() {
    if (this._selectOnFocusPending = !0, this._disabled) return;
    const t = this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
    if (this._open && this.autoSelect && t && !t.disabled)
      this._selectOption(t, "blur");
    else if (this.freeSolo && !this.multiple) {
      const e = this.input.value, i = this._values[0];
      e !== "" && (!i || i.label !== e) && this._setValues([this._freeOption(e)], "createOption");
    } else this.freeSolo || this._resetInputValue();
    this._setOpen(!1, "blur"), this._syncState();
  }
  /**
   * Teclado del combobox (patrón WAI-ARIA + atajos de MUI).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    if (!(t.isComposing || t.keyCode === 229 || this._disabled))
      switch (t.key) {
        case "Home":
        case "End":
          this._open && this.handleHomeEndKeys && this._filtered.length && (t.preventDefault(), this._setHighlight(this._nextIndex(t.key === "Home" ? "start" : "end")));
          break;
        case "PageUp":
        case "PageDown":
          t.preventDefault(), this._openOrMove(t.key === "PageUp" ? -x : x);
          break;
        case "ArrowDown":
        case "ArrowUp":
          t.preventDefault(), this._openOrMove(t.key === "ArrowUp" ? -1 : 1);
          break;
        case "ArrowLeft":
          if (this.multiple && this._values.length && this.input.selectionStart === 0 && this.input.selectionEnd === 0) {
            const e = this._tagElements();
            e.length && (t.preventDefault(), e[e.length - 1].focus());
          }
          break;
        case "Enter": {
          const e = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
          e ? (t.preventDefault(), e.disabled || this._selectOption(e, "selectOption")) : this.freeSolo && this.input.value !== "" && !this._inputIsSelectedValue() && (this.multiple && t.preventDefault(), this._selectOption(this._freeOption(this.input.value), "createOption"));
          break;
        }
        case "Escape":
          if (this._open) {
            O() === this && (E(t), t.stopPropagation(), this._setOpen(!1, "escape"));
            break;
          }
          this.clearOnEscape && !this.readOnly && (this.input.value !== "" || this.multiple && this._values.length) && (t.preventDefault(), t.stopPropagation(), this._clear("clear"));
          break;
        case "Backspace":
          this.multiple && !this.readOnly && this.input.value === "" && this._values.length && (t.preventDefault(), this._removeValueAt(this._values.length - 1));
          break;
        case "Tab": {
          const e = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
          this.autoSelect && e && !e.disabled && this._selectOption(e, "selectOption");
          break;
        }
      }
  }
  /**
   * Teclado sobre los chips: flechas para moverse y volver al input.
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onTagKeyDown(t) {
    const e = t.target.closest && t.target.closest(".mtx-autocomplete__tag");
    if (!e) return;
    const i = this._tagElements(), s = i.indexOf(e);
    t.key === "ArrowLeft" && s > 0 ? (t.preventDefault(), i[s - 1].focus()) : t.key === "ArrowRight" && (t.preventDefault(), s < i.length - 1 ? i[s + 1].focus() : this.input.focus());
  }
  /**
   * Abre el popup o, si ya está abierto, mueve la opción activa.
   *
   * @param {number} diff Desplazamiento (±1 o ±PAGE_SIZE).
   */
  _openOrMove(t) {
    if (!this._open) {
      this._setOpen(!0, "keyboard");
      return;
    }
    this._setHighlight(this._nextIndex(t));
  }
  /**
   * Calcula el siguiente índice activo saltando opciones deshabilitadas.
   *
   * @param {number|'start'|'end'} diff Desplazamiento o extremo.
   * @returns {number} Índice o `-1`.
   */
  _nextIndex(t) {
    const e = this._filtered.length;
    if (!e) return -1;
    const i = e - 1;
    let s, l;
    t === "start" ? (s = 0, l = 1) : t === "end" ? (s = i, l = -1) : (l = t > 0 ? 1 : -1, s = this._highlighted + t, s < 0 ? s = Math.abs(t) > 1 ? 0 : i : s > i && (s = Math.abs(t) > 1 ? i : 0));
    for (let n = 0; n < e; n += 1) {
      if (!this._filtered[s].disabled) return s;
      s = (s + l + e) % e;
    }
    return -1;
  }
  // ------------------------------------------------------------------
  // Estado: apertura, filtrado, render
  // ------------------------------------------------------------------
  /**
   * Abre o cierra el popup.
   *
   * @param {boolean} open Estado deseado.
   * @param {string} [reason] Motivo (`keyboard`, `toggleInput`, `escape`, `blur`, `selectOption`…).
   * @param {{silentRefresh?: boolean}} [options] Evita el refresco (lo hace quien llama).
   */
  _setOpen(t, e = "api", i = {}) {
    t && (this._disabled || this.readOnly) || !!t != !!this._open && (this._open = !!t, this._open ? (I(this, {
      kind: "popup",
      nodes: () => [this.popper, this.element],
      stack: () => [{ node: g() }],
      onEscape: () => this._setOpen(!1, "escape")
    }), this._dirty = !1, i.silentRefresh ? this._renderPopup() : this._refresh({ sync: !0 }), c(this.element, "mtx:autocomplete:open", { reason: e })) : (m(this), this._setHighlight(-1, { silent: !0 }), this._renderPopup(), c(this.element, "mtx:autocomplete:close", { reason: e })));
  }
  /**
   * Indica si el texto visible coincide con la etiqueta del valor (selección única).
   *
   * @returns {boolean} `true` si coincide.
   */
  _inputIsSelectedValue() {
    return !this.multiple && this._values.length > 0 && this.input.value === this._values[0].label;
  }
  /**
   * Aplica el filtro (sin tildes ni mayúsculas) sobre las opciones.
   *
   * @returns {Object[]} Opciones visibles.
   */
  _computeFiltered() {
    let t = this._options;
    this.multiple && this.filterSelectedOptions && (t = t.filter((s) => !this._isSelected(s)));
    const e = this._inputIsSelectedValue() && !this._dirty ? "" : this.input.value;
    this._query = this.filterEnabled ? e : "";
    const i = h(e);
    return !this.filterEnabled || !i.trim() ? t.slice() : t.filter((s) => {
      const l = h(s.label);
      return this.matchFrom === "start" ? l.startsWith(i) : l.includes(i);
    });
  }
  /**
   * Recalcula las opciones filtradas y, si está abierto, vuelve a pintar la lista.
   *
   * @param {{sync?: boolean, keepValue?: string|null}} [options] Sincroniza la opción activa con el valor.
   */
  _refresh({ sync: t = !1, keepValue: e = null } = {}) {
    if (this._filtered = this._computeFiltered(), this._open) {
      this._renderListbox();
      let i = -1;
      if (e !== null)
        i = this._filtered.findIndex((s) => s.value === e && !s.disabled);
      else if (t && this._values.length) {
        const s = this._values[0];
        i = this._filtered.findIndex((l) => l.value === s.value && !l.disabled);
      }
      i === -1 && this.autoHighlight && (i = this._nextIndex("start")), this._highlighted = -1, this._setHighlight(i, { reason: "auto" }), this._announce();
    }
    this._renderPopup();
  }
  /** Pinta las opciones filtradas (con grupos, iconos, descripción y resaltado). */
  _renderListbox() {
    this.listbox.textContent = "";
    let t = null, e;
    this._optionEls = this._filtered.map((i, s) => {
      let l = this.listbox;
      if (i.group !== void 0) {
        if (i.group !== e || !t) {
          e = i.group;
          const a = document.createElement("li");
          a.className = "mtx-autocomplete__group", a.setAttribute("role", "presentation");
          const r = document.createElement("div");
          r.className = "mtx-autocomplete__group-label", r.id = `${this._id}-group-${s}`, r.textContent = i.group, t = document.createElement("ul"), t.className = "mtx-autocomplete__group-list", t.setAttribute("role", "group"), t.setAttribute("aria-labelledby", r.id), a.append(r, t), this.listbox.appendChild(a);
        }
        l = t;
      } else
        e = void 0, t = null;
      const n = this._createOptionElement(i, s);
      return l.appendChild(n), n;
    });
  }
  /**
   * Crea el `<li role="option">` de una opción.
   *
   * @param {Object} opt Opción.
   * @param {number} index Índice en la lista filtrada.
   * @returns {HTMLLIElement} Elemento creado.
   */
  _createOptionElement(t, e) {
    const i = document.createElement("li");
    i.id = `${this._id}-option-${e}`, i.className = "mtx-autocomplete__option", i.setAttribute("role", "option"), i.dataset.optionIndex = String(e);
    const s = this._isSelected(t);
    if (i.setAttribute("aria-selected", String(s)), t.disabled && (i.setAttribute("aria-disabled", "true"), i.classList.add("mtx-autocomplete__option--disabled")), t.icon) {
      const a = document.createElement("span");
      a.className = "mtx-autocomplete__option-icon material-icons", a.setAttribute("aria-hidden", "true"), a.textContent = t.icon, i.appendChild(a);
    }
    const l = document.createElement("span");
    l.className = "mtx-autocomplete__option-content";
    const n = document.createElement("span");
    if (n.className = "mtx-autocomplete__option-label", this._appendHighlighted(n, t.label), l.appendChild(n), t.description) {
      const a = document.createElement("span");
      a.className = "mtx-autocomplete__option-description", a.textContent = t.description, l.appendChild(a);
    }
    return i.appendChild(l), i;
  }
  /**
   * Inserta el texto marcando en negrita el fragmento que coincide con la búsqueda.
   *
   * @param {HTMLElement} target Nodo destino.
   * @param {string} text Texto de la opción.
   */
  _appendHighlighted(t, e) {
    const i = this._query ? P(e, this._query, this.matchFrom === "start") : null;
    if (!i) {
      t.textContent = e;
      return;
    }
    const s = document.createElement("mark");
    s.className = "mtx-autocomplete__highlight", s.textContent = e.slice(i.start, i.end), t.append(e.slice(0, i.start), s, e.slice(i.end));
  }
  /** Muestra u oculta la superficie flotante según opciones, carga y free solo. */
  _renderPopup() {
    const t = this._filtered.length > 0, e = !t && (this._loading || !this.freeSolo), i = !!this._open && (t || e);
    this.element.classList.toggle("mtx-autocomplete--open", !!this._open), this.input.setAttribute("aria-expanded", String(!!this._open && t)), this._open && t ? this.input.setAttribute("aria-controls", this.listbox.id) : this.input.removeAttribute("aria-controls"), this._refreshPopupLabel(), i ? (this.listbox.hidden = !t, this.status.hidden = t, t || (this.status.textContent = this._loading ? this._text("loading") : this._text("noOptions"), this.status.classList.toggle("mtx-autocomplete__status--loading", !!this._loading)), this.listbox.setAttribute("aria-busy", String(!!this._loading)), this.popper.isConnected ? this._position() : (g().appendChild(this.popper), this._stopAutoUpdate = C(this.container, this.popper, () => this._position()))) : this.popper.isConnected && (this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = null, this.popper.remove());
  }
  /** Coloca el popup bajo el campo (o encima si no cabe), con el ancho del campo. */
  _position() {
    if (!this.popper.isConnected) return;
    const t = this.container.getBoundingClientRect();
    this.popper.style.width = `${t.width}px`;
    const { x: e, y: i, side: s } = T(this.container, this.popper, {
      placement: "bottom-start",
      offset: 4,
      flip: !0,
      shift: !0,
      padding: 8
    });
    this.popper.style.left = `${e}px`, this.popper.style.top = `${i}px`, this.popper.dataset.placement = s;
  }
  /**
   * Activa una opción (clase visual + `aria-activedescendant`) y la desplaza a la vista.
   *
   * @param {number} index Índice o `-1` para ninguna.
   * @param {{scroll?: boolean, reason?: string, silent?: boolean}} [options] Opciones.
   */
  _setHighlight(t, { scroll: e = !0, reason: i = "keyboard", silent: s = !1 } = {}) {
    const l = this._highlighted, n = this._optionEls[l];
    n && n.classList.remove("mtx-autocomplete__option--focused");
    const a = t >= 0 ? this._optionEls[t] : null;
    this._highlighted = a ? t : -1, this._highlighted === -1 && l === -1 && (s = !0), a ? (a.classList.add("mtx-autocomplete__option--focused"), this.input.setAttribute("aria-activedescendant", a.id), e && i !== "mouse" && this._scrollIntoView(a)) : this.input.removeAttribute("aria-activedescendant"), s || c(this.element, "mtx:autocomplete:highlight", {
      option: a ? this._filtered[t] : null,
      reason: i
    });
  }
  /**
   * Desplaza el listbox para mostrar la opción (deja hueco para la cabecera de grupo fija).
   *
   * @param {HTMLElement} el Opción activa.
   */
  _scrollIntoView(t) {
    const e = this.listbox;
    if (e.scrollHeight <= e.clientHeight) return;
    const i = this._filtered.some((n) => n.group !== void 0), s = t.offsetTop - (i ? t.offsetHeight * 1.3 : 0), l = t.offsetTop + t.offsetHeight;
    l > e.scrollTop + e.clientHeight ? e.scrollTop = l - e.clientHeight : s < e.scrollTop && (e.scrollTop = Math.max(0, s));
  }
  /** Anuncia en la región viva el número de resultados (con retardo para no saturar). */
  _announce() {
    this._announceTimer && (clearTimeout(this._announceTimer), this._timers.delete(this._announceTimer)), this._announceTimer = this._defer(() => {
      if (!this._open) return;
      const t = this._filtered.length;
      t ? this.live.textContent = t === 1 ? this._text("result") : this._text("results", [t]) : this.live.textContent = this._loading ? this._text("loading") : this._text("noOptions");
    }, 300);
  }
  // ------------------------------------------------------------------
  // Valor
  // ------------------------------------------------------------------
  /**
   * Indica si una opción forma parte del valor.
   *
   * @param {Object} opt Opción.
   * @returns {boolean} `true` si está seleccionada.
   */
  _isSelected(t) {
    return this._values.some((e) => e.value === t.value);
  }
  /**
   * Busca o crea opciones para una lista de valores (texto, objetos u opciones).
   *
   * @param {Array} list Valores.
   * @returns {Object[]} Opciones resueltas.
   */
  _resolveValues(t) {
    const e = /* @__PURE__ */ new Set();
    return (Array.isArray(t) ? t : [t]).map((i) => {
      if (i == null || i === "") return null;
      const s = String(typeof i == "object" ? i.value ?? i.label ?? "" : i), l = this._options.find((u) => u.value === s);
      if (l) return l;
      const n = h(s), a = this._options.find((u) => h(u.label) === n);
      if (a) return a;
      const r = _(i);
      return r && this.freeSolo && (r.freeSolo = !0), r;
    }).filter((i) => !i || e.has(i.value) ? !1 : (e.add(i.value), !0));
  }
  /**
   * Opción para un texto libre (reutiliza una opción con la misma etiqueta).
   *
   * @param {string} text Texto escrito.
   * @returns {Object} Opción.
   */
  _freeOption(t) {
    const e = h(t);
    return this._options.find((s) => h(s.label) === e) || { value: t, label: t, freeSolo: !0 };
  }
  /**
   * Selecciona (o alterna, en múltiple) una opción tras una interacción.
   *
   * @param {Object} option Opción elegida.
   * @param {string} reason Motivo (`selectOption`, `createOption`, `blur`).
   */
  _selectOption(t, e) {
    if (this.readOnly) return;
    let i, s = e;
    if (this.multiple) {
      const l = this._values.findIndex((n) => n.value === t.value);
      l === -1 ? i = [...this._values, t] : e === "createOption" ? i = this._values : (i = this._values.filter((n, a) => a !== l), s = "removeOption");
    } else
      i = [t];
    this._setValues(i, s, t), this._resetInputValue(), this.multiple && this.disableCloseOnSelect ? (this._dirty = !1, this._refresh({ keepValue: t.value })) : (this._setOpen(!1, e === "createOption" ? "createOption" : "selectOption"), this._refresh()), this._syncState();
  }
  /**
   * Quita el valor en una posición (múltiple).
   *
   * @param {number} index Índice del chip.
   */
  _removeValueAt(t) {
    var i;
    const e = this._values[t];
    e && (this._setValues(this._values.filter((s, l) => l !== t), "removeOption", e), this._refresh({ keepValue: this._highlighted >= 0 ? ((i = this._filtered[this._highlighted]) == null ? void 0 : i.value) ?? null : null }), this._syncState());
  }
  /**
   * Vacía el valor y el texto.
   *
   * @param {string} reason Motivo del cambio.
   */
  _clear(t) {
    this.input.value !== "" && (this.input.value = "", this._emitInput("clear")), this._setValues([], t), this._dirty = !1, this._refresh(), this._syncState();
  }
  /**
   * Sustituye el valor y emite `mtx:autocomplete:change` si cambió.
   *
   * @param {Object[]} next Nuevas opciones seleccionadas.
   * @param {string} reason Motivo.
   * @param {Object} [option] Opción afectada.
   * @param {boolean} [silent=false] No emite evento (cambios por API).
   * @returns {boolean} `true` si el valor cambió.
   */
  _setValues(t, e, i = null, s = !1) {
    const l = this._values.map((a) => a.value).join("\0"), n = t.map((a) => a.value).join("\0");
    if (this._values = t.slice(), this._afterValueChange(), l === n) return !1;
    if (!s) {
      const a = this.multiple ? { value: this.value, options: this.selectedOptions, option: i, reason: e } : { value: this.value, option: this.selectedOption, reason: e };
      c(this.element, "mtx:autocomplete:change", a);
    }
    return !0;
  }
  /** Sincroniza todo lo que depende del valor (inputs ocultos, chips, label, validez). */
  _afterValueChange() {
    this._syncHiddenInputs(), this._renderTags(), this.textField._syncAria(), this._syncState();
  }
  /**
   * Restablece el texto visible al valor (etiqueta en único, vacío en múltiple).
   *
   * @param {boolean} [notify=true] Emite `mtx:autocomplete:input` con `reason: 'reset'`.
   */
  _resetInputValue(t = !0) {
    const e = !this.multiple && this._values[0] ? this._values[0].label : "";
    this.input.value !== e && (this.input.value = e, t && this._emitInput("reset")), this.textField._syncAria();
  }
  /** Crea los inputs ocultos con `name` (uno por valor, o CSV con `data-value-format="csv"`). */
  _syncHiddenInputs() {
    if (this.valuesHost.textContent = "", !this.name) return;
    const t = this._values.map((i) => i.value), e = (i) => {
      const s = document.createElement("input");
      s.type = "hidden", s.name = this.name, s.value = i, this._formAttr && s.setAttribute("form", this._formAttr), s.disabled = !!this._disabled, this.valuesHost.appendChild(s);
    };
    this.multiple ? this.valueFormat === "csv" ? e(t.join(this.separator)) : t.forEach(e) : e(t[0] ?? "");
  }
  /** Pinta los chips de la selección múltiple (respeta `data-limit-tags` sin foco). */
  _renderTags() {
    if (this._tagElements().forEach((s) => {
      const l = d(s);
      l && typeof l.destroy == "function" && l.destroy(), s.remove();
    }), this.container.querySelectorAll(".mtx-autocomplete__tag-more").forEach((s) => s.remove()), !this.multiple) return;
    const t = this.element.classList.contains("mtx-autocomplete--focused"), e = this.limitTags >= 0 && !t ? this.limitTags : 1 / 0, i = !this._disabled && !this.readOnly;
    if (this._values.forEach((s, l) => {
      if (l >= e) return;
      const n = document.createElement("div");
      n.className = "mtx-autocomplete__tag", n.setAttribute("data-mtx", "chip"), n.setAttribute("data-label", s.label), n.dataset.tagIndex = String(l), this.small && n.setAttribute("data-size", "small"), s.icon && n.setAttribute("data-icon", s.icon), i && n.setAttribute("data-deletable", "");
      const a = new V(n);
      n.hasAttribute("tabindex") && (n.tabIndex = -1), this._disabled && a.disable(), this.container.insertBefore(n, this.input);
    }), this._values.length > e) {
      const s = document.createElement("span");
      s.className = "mtx-autocomplete__tag-more", s.textContent = this._text("more", [this._values.length - e]), this.container.insertBefore(s, this.input);
    }
  }
  /**
   * Chips actuales en orden.
   *
   * @returns {HTMLElement[]} Elementos `.mtx-autocomplete__tag`.
   */
  _tagElements() {
    return Array.from(this.container.querySelectorAll(".mtx-autocomplete__tag"));
  }
  /**
   * Marca el estado de foco del componente (muestra todos los chips con foco).
   *
   * @param {boolean} focused Estado de foco.
   */
  _setFocused(t) {
    if (this.element.classList.contains("mtx-autocomplete--focused") !== t && (this.element.classList.toggle("mtx-autocomplete--focused", t), this.multiple && this.limitTags >= 0)) {
      const i = document.activeElement;
      i && i.closest && i.closest(".mtx-autocomplete__tag") || this._renderTags();
    }
  }
  /** Clases de estado, botón limpiar, validez y requerido. */
  _syncState() {
    const t = this._values.length > 0 || this.input.value !== "", e = !this.disableClearable && !this._disabled && !this.readOnly && t;
    this.clearButton.hidden = !e, this.element.classList.toggle("mtx-autocomplete--has-clear", e), this.element.classList.toggle("mtx-autocomplete--has-popup", this.hasPopupIcon), this.element.classList.toggle("mtx-autocomplete--has-end", e || this.hasPopupIcon || !!this._loading), this.element.classList.toggle("mtx-autocomplete--multiple", this.multiple), this.element.classList.toggle("mtx-autocomplete--required", this.required), this.element.classList.toggle("mtx-autocomplete--readonly", this.readOnly);
    const i = this._values.length > 0;
    if (this.input.required = this.required && !i, this.required ? this.input.setAttribute("aria-required", "true") : this.input.removeAttribute("aria-required"), this.readOnly && this.input.setAttribute("aria-readonly", "true"), typeof this.input.setCustomValidity == "function") {
      const s = this.required && !i && !this.freeSolo && this.input.value.trim() !== "";
      this.input.setCustomValidity(s ? this._text("invalid") : "");
    }
  }
  /** Aplica el estado deshabilitado a input, botones, chips y valores ocultos. */
  _syncDisabled() {
    const t = !!this._disabled;
    this.input.disabled = t, this.clearButton.disabled = t, this.popupButton.disabled = t, this.element.classList.toggle("mtx-autocomplete--disabled", t), t && this._setOpen(!1, "disabled"), this._syncHiddenInputs(), this._renderTags(), this._syncState();
  }
  // ------------------------------------------------------------------
  // Textos (i18n)
  // ------------------------------------------------------------------
  /**
   * Texto traducido del componente (con anulaciones por `data-*`).
   *
   * @param {string} key Clave del diccionario `autocomplete`.
   * @param {Array} [params] Parámetros de interpolación.
   * @returns {string} Texto.
   */
  _text(t, e = null) {
    const i = { noOptions: "data-no-options-text", loading: "data-loading-text" }, s = i[t] ? this._cfg(i[t]) : null;
    return s || B("autocomplete", t, e, {
      clear: "Clear",
      open: "Open",
      close: "Close",
      noOptions: "No options",
      loading: "Loading…",
      more: "+{0}",
      result: "1 result available",
      results: "{0} results available",
      invalid: "Select an option from the list."
    }[t] ?? t, L(this.element));
  }
  /** Actualiza el nombre accesible del botón abrir/cerrar. */
  _refreshPopupLabel() {
    const t = this._text(this._open ? "close" : "open");
    this.popupButton.setAttribute("aria-label", t), this.popupButton.setAttribute("title", t);
  }
  /** Refresca todos los textos tras un cambio de idioma. */
  _refreshTexts() {
    const t = this._text("clear");
    this.clearButton.setAttribute("aria-label", t), this.clearButton.setAttribute("title", t), this._refreshPopupLabel(), this.popper && this.popper.isConnected && this._renderPopup(), this._values && this._renderTags();
  }
  // ------------------------------------------------------------------
  // API pública
  // ------------------------------------------------------------------
  /**
   * Valor actual: `string` (vacío si no hay selección) o `string[]` en múltiple.
   *
   * @returns {string|string[]} Valor.
   */
  get value() {
    return this.multiple ? this._values.map((t) => t.value) : this._values[0] ? this._values[0].value : "";
  }
  /**
   * Establece el valor sin emitir `mtx:autocomplete:change`.
   *
   * @param {string|string[]|Object|Object[]|null} value Valor(es) u opción(es).
   */
  set value(t) {
    let e = t == null || t === "" ? [] : t;
    Array.isArray(e) || (e = [e]);
    let i = this._resolveValues(e);
    this.multiple || (i = i.slice(0, 1)), this._setValues(i, "api", null, !0), this._resetInputValue(), this._refresh();
  }
  /** @returns {Object|null} Opción seleccionada (selección única). */
  get selectedOption() {
    return this._values[0] ? { ...this._values[0] } : null;
  }
  /** @returns {Object[]} Opciones seleccionadas (copia). */
  get selectedOptions() {
    return this._values.map((t) => ({ ...t }));
  }
  /** @returns {string} Texto escrito en el input. */
  get inputValue() {
    return this.input.value;
  }
  /**
   * Cambia el texto del input y refiltra (sin emitir eventos).
   *
   * @param {string} text Texto nuevo.
   */
  set inputValue(t) {
    this.input.value = t ?? "", this._dirty = !0, this.textField._syncAria(), this._refresh(), this._syncState();
  }
  /** @returns {Object[]} Copia de las opciones disponibles. */
  get options() {
    return this._options.map((t) => ({ ...t }));
  }
  /**
   * Sustituye las opciones (carga asíncrona) y conserva el valor actual.
   *
   * @param {Array<string|Object>} options Opciones `{value, label, group?, disabled?, icon?, description?}`.
   */
  setOptions(t) {
    var i;
    this._options = (Array.isArray(t) ? t : []).map(_).filter(Boolean);
    const e = this._values[0] ? this._values[0].label : null;
    this._values = this._values.map((s) => this._options.find((l) => l.value === s.value) || s), this._afterValueChange(), !this.multiple && e !== null && this.input.value === e && this._resetInputValue(!1), this._refresh({ keepValue: this._highlighted >= 0 ? ((i = this._filtered[this._highlighted]) == null ? void 0 : i.value) ?? null : null });
  }
  /** @returns {boolean} `true` si se muestra el indicador de carga. */
  get loading() {
    return !!this._loading;
  }
  /**
   * Activa o desactiva el estado de carga (CircularProgress + texto "Loading…").
   *
   * @param {boolean} value Estado de carga.
   */
  set loading(t) {
    this._loading = !!t, this._loading && !this.loadingSlot.firstChild && this.loadingSlot.appendChild(N({ size: 20, color: "inherit", decorative: !0 })), this.loadingSlot.hidden = !this._loading, this.element.classList.toggle("mtx-autocomplete--loading", this._loading), this._syncState(), this._open && (this._renderPopup(), this._announce());
  }
  /**
   * Alias de `loading` para uso encadenado.
   *
   * @param {boolean} value Estado de carga.
   */
  setLoading(t) {
    this.loading = t;
  }
  /** @returns {boolean} `true` si el popup está abierto. */
  get isOpen() {
    return !!this._open;
  }
  /** Abre el popup de opciones. */
  open() {
    this._setOpen(!0, "api");
  }
  /** Cierra el popup de opciones. */
  close() {
    this._setOpen(!1, "api");
  }
  /** Vacía valor y texto (emite `change` con `reason: 'clear'`). */
  clear() {
    this._clear("clear");
  }
  /** Enfoca el input. */
  focus() {
    this.input.focus();
  }
  /** Quita el foco del input. */
  blur() {
    this.input.blur();
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return !!this._disabled;
  }
  /** Deshabilita el componente. */
  disable() {
    this._disabled = !0, this._syncDisabled();
  }
  /** Habilita el componente. */
  enable() {
    this._disabled = !1, this._syncDisabled();
  }
  /**
   * Muestra un error con mensaje (delegado en TextField).
   *
   * @param {string|boolean} message Mensaje, `true` sin mensaje o vacío para limpiar.
   */
  setError(t) {
    this.textField.setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.textField.clearError();
  }
  /** Libera listeners, temporizadores, chips y el popup. */
  destroy() {
    this.destroyed || (this._timers.forEach((t) => clearTimeout(t)), this._timers.clear(), this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = null, this.popper.isConnected && this.popper.remove(), this._open = !1, m(this), this.element.classList.remove("mtx-autocomplete--open", "mtx-autocomplete--focused"), this._tagElements().forEach((t) => {
      const e = d(t);
      e && typeof e.destroy == "function" && e.destroy();
    }), this.name && !this.input.hasAttribute("name") && this.input === this._source && (this.input.setAttribute("name", this.name), this.valuesHost.textContent = ""), this.textField && typeof this.textField.destroy == "function" && this.textField.destroy(), b(this.input), b(this._source), this._source.removeAttribute && this._source.removeAttribute("data-mtx-initialized"), super.destroy());
  }
}
y("autocomplete", D);
F();
export {
  D as Autocomplete,
  P as findMatch,
  _ as normalizeOption,
  h as normalizeText,
  p as optionsFromElement
};
