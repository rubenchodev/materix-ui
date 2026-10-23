import "./form-helper-text.css";
import "./icon-button.css";
import "./text-field.css";
import "./progress.css";
import "./button.css";
import "./date-time-picker.css";
var tt = Object.defineProperty;
var et = (f, t, e) => t in f ? tt(f, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : f[t] = e;
var q = (f, t, e) => et(f, typeof t != "symbol" ? t + "" : t, e);
import { r as P, C as it, j as K, x as st, h as Q, t as at, i as F, v as W, z as nt, g as I, A as rt, y as ot, q as ct } from "../chunks/core-CJdkPtZx.js";
import { T as lt } from "../chunks/text-field-BJ35FqKf.js";
const G = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]"
].join(",");
function z(f) {
  const t = Q(f), e = typeof document < "u" ? document.documentElement : null;
  if (f && typeof f.getAttribute == "function")
    for (let a = f; a && a.nodeType === 1; a = a.parentElement) {
      const s = a.getAttribute("data-locale") || a.getAttribute("data-lang") || (a !== e ? a.getAttribute("lang") : null);
      if (s && s.trim()) return s.trim();
    }
  const i = e ? (e.getAttribute("lang") || "").trim() : "";
  return i && Z(i, t) ? i : t;
}
function Z(f, t) {
  const e = String(f).toLowerCase().replace("_", "-"), i = String(t).toLowerCase();
  return e === i || e.startsWith(`${i}-`);
}
function ht(f) {
  return String(f || "en").toLowerCase().trim().split(/[-_]/)[0] || "en";
}
function O(f) {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([String(f).replace("_", "-")])[0] || "en";
  } catch {
    return "en";
  }
}
function X(f) {
  try {
    const t = new Intl.DateTimeFormat(O(f), { year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(2026, 9, 20)), e = { day: "DD", month: "MM", year: "YYYY" }, i = t.filter((a) => e[a.type]).map((a) => e[a.type]);
    if (i.length === 3) return i;
  } catch {
  }
  return ht(f) === "en" ? ["MM", "DD", "YYYY"] : ["DD", "MM", "YYYY"];
}
function dt(f, t) {
  const e = t.replace(/-?range/, "").replace("date-time", "datetime");
  return e === "date" || e === "time" || e === "datetime" ? e : /date-?time/.test(f) ? "datetime" : f.includes("time") ? "time" : "date";
}
function B(f, t) {
  return !!(f && t) && f.getFullYear() === t.getFullYear() && f.getMonth() === t.getMonth() && f.getDate() === t.getDate();
}
function J(f) {
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}-${String(f.getDate()).padStart(2, "0")}`;
}
function ut(f) {
  if (!f) return "";
  let t = f.replace(/YYYY|AAAA/g, "0000").replace(/YY/g, "00").replace(/MM/g, "00").replace(/DD/g, "00").replace(/HH|hh/g, "00").replace(/mm/g, "00").replace(/ss/g, "00");
  return t = t.replace(new RegExp("\\b[aA]\\b|(?<=\\s|^)[aA](?=\\s|$)|AM|PM|aa|AA", "g"), "AA"), t;
}
const S = class S extends it {
  /**
   * Destruye un picker previo sobre el elemento o su TextField contenedor, para que
   * `new DateTimePicker(el)` repetido no deje dos popovers vivos.
   *
   * @param {HTMLElement} element Elemento que se va a inicializar.
   */
  static _destroyPrevious(t) {
    if (!t || !t.nodeType) return;
    const e = typeof t.closest == "function" ? t.closest(".mtx-text-field") : null;
    [K(t), e ? K(e) : null].forEach((i) => {
      if (!(!(i instanceof S) || i.destroyed))
        try {
          i.destroy();
        } catch {
        }
    });
  }
  /**
   * Crea una instancia de DateTimePicker.
   *
   * @param {HTMLElement} element Elemento asociado (input, div o contenedor).
   */
  constructor(t) {
    S._destroyPrevious(t);
    const e = t.hasAttribute("data-static") || t.classList.contains("mtx-picker-static"), i = (t.getAttribute("data-mtx") || "").toLowerCase(), a = (t.getAttribute("data-picker") || "").toLowerCase(), s = t.getAttribute("data-range") === "true" || t.hasAttribute("data-range") || i.includes("range") || a.includes("range"), r = dt(i, a);
    let n = null, c = "";
    if (!e && (t instanceof HTMLInputElement || !t.classList.contains("mtx-text-field"))) {
      c = (t.value || t.getAttribute("data-value") || t.getAttribute("data-default-value") || "").trim(), "value" in t && (t.value = "");
      const p = r === "time" ? "schedule" : r === "datetime" ? "calendar_month" : "event";
      t.hasAttribute("data-end-action") || (t.setAttribute("data-end-action", t.getAttribute("data-end-icon") || p), t.removeAttribute("data-end-icon"));
      const l = t.getAttribute("data-format") || "", d = t.getAttribute("data-ampm") === "true" || t.hasAttribute("data-ampm") && t.getAttribute("data-ampm") !== "false" || !!(l && (/(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(l) || l.includes("hh"))), g = l || S._defaultFormatFor(r, d, z(t));
      if (!t.hasAttribute("data-mask")) {
        let b;
        if (!l && r === "time" ? b = d ? "time-ampm" : "time" : b = ut(g), b === "00/00/0000" && (b = "date"), s) {
          const h = b === "date" ? "00/00/0000" : b === "time" ? "00:00" : b === "time-ampm" ? "00:00 AA" : b;
          b = g.includes(" - ") || g.includes(" / ") ? h : `${h} - ${h}`;
        }
        t.setAttribute("data-mask", b);
      }
      n = new lt(t), t = n.element;
    }
    super(t), this._textField = n, this._mode = r, this._isRange = s, this._isStatic = e, this._isOpen = !1, this.input = e ? null : this.element.querySelector(".mtx-text-field__input, input"), this.input && this.input !== this.element && st(this.input, this);
    const o = (p) => this.element.getAttribute(p) ?? (this.input ? this.input.getAttribute(p) : null);
    this._rangeSeparator = o("data-range-separator") || " - ", this._rangeStart = null, this._rangeEnd = null, this._rangeStep = "start", this._hoverDate = null, this._focusedDate = null;
    const u = o("data-time-view") || o("data-time-mode");
    this._timeInputMode = u === "dial" || u === "clock" ? "dial" : "input", this._timeUnit = "hours", this._currentView = r === "time" ? "time" : "calendar", this._activeTab = r === "time" ? "time" : "date", this._format = o("data-format") || this._getDefaultFormat(), this._minDate = this._parseDate(o("data-min") || o("min")), this._maxDate = this._parseDate(o("data-max") || o("max")), this._displayMode = o("data-display") === "modal" ? "modal" : "popover", this._selectedHour = 12, this._selectedMinute = 0, this._selectedAmPm = "PM", this._startHour = 9, this._startMinute = 0, this._startAmPm = "AM", this._endHour = 18, this._endMinute = 0, this._endAmPm = "PM";
    const _ = c || (this.input ? this.input.value : "") || o("data-value") || o("data-default-value") || "";
    if (this._isRange && _ && (_.includes(this._rangeSeparator) || _.includes(" - "))) {
      const p = _.includes(this._rangeSeparator) ? this._rangeSeparator : " - ", [l, d] = _.split(p);
      this._rangeStart = this._parseDate(l), this._rangeEnd = this._parseDate(d), this._selectedDate = this._rangeStart, this._rangeStart && (this._startHour = this._rangeStart.getHours(), this._startMinute = this._rangeStart.getMinutes(), this._startAmPm = this._startHour >= 12 ? "PM" : "AM"), this._rangeEnd && (this._endHour = this._rangeEnd.getHours(), this._endMinute = this._rangeEnd.getMinutes(), this._endAmPm = this._endHour >= 12 ? "PM" : "AM");
    } else
      this._selectedDate = _ ? this._parseDate(_) : null, this._selectedDate && (this._selectedHour = this._selectedDate.getHours(), this._selectedMinute = this._selectedDate.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._isRange && (this._rangeStart = this._selectedDate, this._startHour = this._selectedHour, this._startMinute = this._selectedMinute, this._startAmPm = this._selectedAmPm));
    this._viewDate = this._selectedDate ? new Date(this._selectedDate) : /* @__PURE__ */ new Date(), this.input && (this._isRange && this._rangeStart ? this.input.value = this._rangeEnd ? `${this._formatDate(this._rangeStart)}${this._rangeSeparator}${this._formatDate(this._rangeEnd)}` : this._formatDate(this._rangeStart) : !this._isRange && this._selectedDate ? this.input.value = this._formatDate(this._selectedDate) : c && !this.input.value && (this.input.value = c), this._syncFieldState()), this._okText = o("data-ok-text"), this._cancelText = o("data-cancel-text"), this._todayText = o("data-today-text"), this.element.mtxDateTimePicker = this, this.input && (this.input.mtxDateTimePicker = this), this._buildPickerDOM(), this._bindEvents(), this._syncToggleButton(), this._isStatic && this._renderCurrentView();
  }
  /**
   * Formato por defecto según modo, AM/PM y locale (`en` → MM/DD/YYYY, `es` → DD/MM/YYYY).
   *
   * @param {'date'|'time'|'datetime'} mode Modo del picker.
   * @param {boolean} isAmPm Formato de 12 horas.
   * @param {string} rawLocale Locale crudo.
   * @returns {string} Patrón de formato.
   */
  static _defaultFormatFor(t, e, i) {
    const a = e ? "hh:mm A" : "HH:mm";
    if (t === "time") return a;
    const s = X(i).join("/");
    return t === "datetime" ? `${s} ${a}` : s;
  }
  /**
   * Locale crudo de la instancia (p. ej. `es-MX`).
   * @private
   * @returns {string}
   */
  _getLocale() {
    return z(this.element);
  }
  /**
   * Idioma registrado en i18n para los textos (resuelto con `getComponentLocale()`).
   * @private
   * @returns {string}
   */
  _getLang() {
    return Q(this.element);
  }
  /**
   * Obtiene una traducción del componente DateTimePicker.
   * @private
   */
  _t(t, e = null, i = null) {
    return at("dateTimePicker", t, e, i, this._getLang());
  }
  /**
   * Diccionario i18n del idioma base, solo si está registrado (si no, se usa `Intl`).
   * @private
   * @returns {object|null}
   */
  _getLangDict() {
    const t = this._getLang();
    if (!Z(this._getLocale(), t)) return null;
    const e = F(t);
    return e && e.code === t && e.dateTimePicker ? e.dateTimePicker : null;
  }
  /**
   * Nombres de meses o días generados con `Intl` para el locale activo.
   * @private
   * @param {'month'|'weekday'} kind Tipo de nombre.
   * @param {'long'|'short'|'narrow'} width Longitud.
   * @returns {string[]|null} Lista de nombres o `null` si `Intl` no está disponible.
   */
  _intlNames(t, e) {
    try {
      const i = new Intl.DateTimeFormat(O(this._getLocale()), { [t]: e });
      return Array.from({ length: t === "month" ? 12 : 7 }, (r, n) => i.format(t === "month" ? new Date(2026, n, 1) : new Date(2026, 1, 1 + n))).map((r) => r.charAt(0).toUpperCase() + r.slice(1));
    } catch {
      return null;
    }
  }
  /**
   * Retorna la lista de nombres completos de meses según el idioma activo.
   * @private
   */
  _getMonthNames() {
    const t = this._getLangDict();
    return t && t.months || this._intlNames("month", "long") || F("en").dateTimePicker.months;
  }
  /**
   * Retorna la lista de nombres abreviados de meses según el idioma activo.
   * @private
   */
  _getMonthNamesShort() {
    const t = this._getLangDict();
    return t && t.monthsShort || this._intlNames("month", "short") || F("en").dateTimePicker.monthsShort;
  }
  /**
   * Retorna la lista de iniciales de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNames() {
    const t = this._getLangDict();
    return t && t.weekdays || this._intlNames("weekday", "narrow") || F("en").dateTimePicker.weekdays;
  }
  /**
   * Retorna la lista de nombres abreviados de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNamesShort() {
    const t = this._getLangDict();
    return t && t.weekdaysShort || this._intlNames("weekday", "short") || F("en").dateTimePicker.weekdaysShort;
  }
  /**
   * Nombres completos de los días de la semana (cabeceras accesibles del grid).
   * @private
   */
  _getWeekdayNamesLong() {
    return this._intlNames("weekday", "long") || this._getWeekdayNamesShort();
  }
  /**
   * Etiqueta accesible completa de un día ("Tuesday, October 20, 2026").
   * @private
   * @param {Date} date Fecha.
   * @returns {string} Texto localizado.
   */
  _formatDayLabel(t) {
    try {
      return new Intl.DateTimeFormat(O(this._getLocale()), {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(t);
    } catch {
      return `${this._getWeekdayNamesShort()[t.getDay()]}, ${this._getMonthNames()[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
    }
  }
  /**
   * Determina si el componente está configurado en formato 12 horas AM/PM.
   * @private
   * @returns {boolean}
   */
  _isAmPmMode() {
    const t = this.element ? this.element.getAttribute("data-ampm") : null;
    if (t === "true" || this.element && this.element.hasAttribute("data-ampm") && t !== "false")
      return !0;
    const e = this.input ? this.input.getAttribute("data-ampm") : null;
    return e === "true" || this.input && this.input.hasAttribute("data-ampm") && e !== "false" ? !0 : this._format ? /(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(this._format) || this._format.includes("hh") : !1;
  }
  /**
   * Retorna el formato de fecha por defecto según el modo y el locale activos.
   * @private
   */
  _getDefaultFormat() {
    return S._defaultFormatFor(this._mode, this._isAmPmMode(), this._getLocale());
  }
  /**
   * Orden de los segmentos de fecha del formato activo (o del locale si el formato no los define).
   * @private
   * @returns {string[]} Tokens `DD`, `MM`, `YYYY` ordenados.
   */
  _getDateOrder() {
    const e = ((this._format || "").match(/YYYY|AAAA|YY|MM|DD/g) || []).map((i) => i === "AAAA" || i === "YY" ? "YYYY" : i);
    return e.length === 3 && new Set(e).size === 3 ? e : X(this._getLocale());
  }
  /**
   * Patrón de solo fecha del locale/formato activo (p. ej. `MM/DD/YYYY`).
   * @private
   * @returns {string}
   */
  _getDatePattern() {
    return this._getDateOrder().join("/");
  }
  /**
   * Sincroniza la clase `--has-value` del TextField tras escribir el valor por código.
   * @private
   */
  _syncFieldState() {
    this.input && (this._textField && typeof this._textField._syncAria == "function" ? this._textField._syncAria() : this.element.classList.contains("mtx-text-field") && this.element.classList.toggle("mtx-text-field--has-value", !!this.input.value.trim()));
  }
  /**
   * Botón que abre el picker (IconButton final o adorno heredado del marcado BEM).
   * @private
   * @returns {HTMLElement|null}
   */
  _getToggleButton() {
    return this._isStatic ? null : this._textField && this._textField.endAction ? this._textField.endAction : this.element.querySelector(".mtx-text-field__action--end, .mtx-text-field__adornment--end");
  }
  /**
   * Nombre accesible del diálogo y del botón según el modo.
   * @private
   * @returns {string}
   */
  _getDialogLabel() {
    return this._mode === "time" ? this._t("chooseTime", null, "Choose time") : this._isRange ? this._t("chooseDateRange", null, "Choose date range") : this._mode === "datetime" ? this._t("chooseDateTime", null, "Choose date and time") : this._t("chooseDate", null, "Choose date");
  }
  /**
   * Refleja en el botón de apertura su nombre, `aria-expanded` y el estado deshabilitado/solo lectura.
   * @private
   */
  _syncToggleButton() {
    const t = this._getToggleButton();
    if (!t) return;
    const e = this._getDialogLabel(), i = this.input ? this.input.value.trim() : "";
    t.setAttribute("aria-label", i ? this._t("chooseWithValue", { label: e, value: i }, `${e}, ${i}`) : e), t.setAttribute("aria-haspopup", "dialog"), t.setAttribute("aria-expanded", String(this._isOpen)), this._container && this._container.id && t.setAttribute("aria-controls", this._container.id);
    const a = !!(this.input && (this.input.disabled || this.input.readOnly));
    t.tagName === "BUTTON" ? t.disabled = a : (t.setAttribute("role", "button"), t.setAttribute("tabindex", a ? "-1" : "0"), t.removeAttribute("aria-hidden")), a ? t.setAttribute("aria-disabled", "true") : t.removeAttribute("aria-disabled");
  }
  /**
   * Construye el contenedor DOM del picker (popover, diálogo modal o estático).
   * @private
   */
  _buildPickerDOM() {
    if (this._isStatic) {
      this.element.classList.add("mtx-picker-static"), this._container = this.element, this.element.hasAttribute("role") || (this.element.setAttribute("role", "group"), this._addedRole = !0), !this.element.hasAttribute("aria-label") && !this.element.hasAttribute("aria-labelledby") && (this.element.setAttribute("aria-label", this._getDialogLabel()), this._addedLabel = !0), this.listen(this._container, "keydown", (e) => this._handleContainerKeyDown(e));
      return;
    }
    const t = (e) => e.stopPropagation();
    this._displayMode === "modal" ? (this._backdrop = document.createElement("div"), this._backdrop.className = "mtx-picker-backdrop", this._dialog = document.createElement("div"), this._dialog.className = "mtx-picker-dialog", this._dialog.setAttribute("aria-modal", "true"), this._dialog.addEventListener("click", t), this._dialog.addEventListener("mousedown", t), this._backdrop.appendChild(this._dialog), document.body.appendChild(this._backdrop), this._container = this._dialog) : (this._mobileBackdrop = document.createElement("div"), this._mobileBackdrop.className = "mtx-picker-backdrop-mobile", this._mobileBackdrop.addEventListener("click", (e) => {
      e.stopPropagation(), this.close(!0);
    }), document.body.appendChild(this._mobileBackdrop), this._popover = document.createElement("div"), this._popover.className = "mtx-picker-popover", this._popover.addEventListener("click", t), this._popover.addEventListener("mousedown", t), this.element.appendChild(this._popover), this._container = this._popover), this._container.id = W("mtx-picker-dialog"), this._container.setAttribute("role", "dialog"), this._container.setAttribute("aria-label", this._getDialogLabel()), this.listen(this._container, "keydown", (e) => this._handleContainerKeyDown(e)), this.listen(this._container, "focusout", (e) => this._handleFocusOut(e));
  }
  /**
   * Asocia los eventos interactivos del picker. Todo listener pasa por `listen()` para liberarse en `destroy()`.
   * @private
   */
  _bindEvents() {
    if (this.listen(document, "mtx:locale:change", () => {
      this._container && this._container.getAttribute("role") === "dialog" && this._container.setAttribute("aria-label", this._getDialogLabel()), this._syncToggleButton(), (this._isOpen || this._isStatic) && this._renderCurrentView();
    }), this._isStatic || !this.input) return;
    const t = this._getToggleButton();
    t && (t.style.cursor = "pointer", this.listen(t, "click", (s) => {
      s.stopPropagation(), !this._isLocked() && (this._isOpen ? this.close(!0) : this.open({ focus: !0 }));
    }), t.tagName !== "BUTTON" && this.listen(t, "keydown", (s) => {
      (s.key === "Enter" || s.key === " ") && (s.preventDefault(), t.click());
    })), this.listen(this.input, "click", (s) => {
      s.stopPropagation(), this._isOpen || this.open({ focus: !1 });
    });
    const e = this._mode === "time" ? /^[0-9:\sAPMapm]$/ : this._mode === "date" ? /^[0-9/\-.\s]$/ : /^[0-9/\-.:\sAPMapm]$/, i = this._mode === "time" ? /[^0-9:\sAPMapm]/g : this._mode === "date" ? /[^0-9/\-.\s]/g : /[^0-9/\-.:\sAPMapm]/g;
    this.listen(this.input, "keydown", (s) => {
      if (s.key === "ArrowDown" && (s.altKey || this._isOpen)) {
        s.preventDefault(), this._isOpen ? this._focusActiveView() : this.open({ focus: !0 });
        return;
      }
      s.ctrlKey || s.metaKey || s.altKey || s.key.length > 1 || e.test(s.key) || s.preventDefault();
    }), this.listen(this.input, "paste", (s) => {
      var n;
      const r = (n = s.clipboardData || window.clipboardData) == null ? void 0 : n.getData("text");
      if (r && new RegExp(i.source).test(r)) {
        s.preventDefault();
        const c = r.replace(i, "");
        if (document.queryCommandSupported && document.queryCommandSupported("insertText"))
          document.execCommand("insertText", !1, c);
        else {
          const o = this.input.selectionStart || 0, u = this.input.selectionEnd || 0, _ = this.input.value;
          this.input.value = _.slice(0, o) + c + _.slice(u), this.input.dispatchEvent(new Event("input", { bubbles: !0 }));
        }
      }
    });
    const a = () => {
      if (this._isInternalChange) return;
      new RegExp(i.source).test(this.input.value) && (this.input.value = this.input.value.replace(i, ""));
      const s = this.input.value.trim();
      if (!s) {
        this._selectedDate = null, this._rangeStart = null, this._rangeEnd = null, this._isOpen && this._renderCurrentView();
        return;
      }
      if (this._isRange && (s.includes(this._rangeSeparator) || s.includes(" - "))) {
        const n = s.includes(this._rangeSeparator) ? this._rangeSeparator : " - ", [c, o] = s.split(n), u = this._parseDate(c), _ = this._parseDate(o);
        u && (this._rangeStart = u), _ && (this._rangeEnd = _), this._selectedDate = this._rangeStart || this._rangeEnd, this._isOpen && this._renderCurrentView();
        return;
      }
      const r = this._parseDate(s);
      r && (this._selectedDate = r, this._isRange && (this._rangeStart = r), this._viewDate = new Date(r), this._selectedHour = r.getHours(), this._selectedMinute = r.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._isOpen && this._renderCurrentView());
    };
    this.listen(this.input, "change", a), this.listen(this.input, "input", a), this.listen(document, "click", (s) => {
      if (!this._isOpen) return;
      if (this._displayMode === "modal") {
        s.target === this._backdrop && this.close(!0);
        return;
      }
      if (this._mobileBackdrop && s.target === this._mobileBackdrop) {
        this.close(!0);
        return;
      }
      const r = s.composedPath ? s.composedPath() : [];
      r.includes(this.element) || r.includes(this._container) || this.element.contains(s.target) || this._container.contains(s.target) || this.close();
    }), this.listen(window, "resize", () => {
      this._isOpen && (this._syncModalState(), this._positionPopover());
    });
  }
  /**
   * Indica si el viewport es móvil (≤ 600px), donde el popover se comporta como modal.
   * @private
   * @returns {boolean}
   */
  _isMobileViewport() {
    return typeof window < "u" && window.innerWidth <= 600;
  }
  /**
   * Indica si el picker actúa como modal (diálogo o popover en móvil).
   * @private
   * @returns {boolean}
   */
  _isModal() {
    return this._displayMode === "modal" || !!(this._popover && this._isMobileViewport());
  }
  /**
   * Ajusta `aria-modal` del popover según el viewport.
   * @private
   */
  _syncModalState() {
    this._popover && (this._isMobileViewport() ? this._popover.setAttribute("aria-modal", "true") : this._popover.removeAttribute("aria-modal"));
  }
  /**
   * Indica si el campo está deshabilitado o es de solo lectura.
   * @private
   * @returns {boolean}
   */
  _isLocked() {
    return this._isStatic ? this.element.getAttribute("aria-disabled") === "true" : !!(this.input && (this.input.disabled || this.input.readOnly));
  }
  /**
   * Cierra el popover cuando el foco sale con Tab fuera del campo y del picker (modo no modal).
   * @private
   * @param {FocusEvent} e Evento focusout.
   */
  _handleFocusOut(t) {
    if (!this._isOpen || this._isModal()) return;
    const e = t.relatedTarget;
    !e || !(e instanceof Node) || this.element.contains(e) || this._container.contains(e) || this.close(!1);
  }
  /**
   * Teclado dentro del picker: trampa de foco, grid de días, meses, años, pestañas y reloj.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleContainerKeyDown(t) {
    if (t.key === "Tab" && this._isOpen && this._isModal()) {
      this._trapTab(t);
      return;
    }
    const e = t.target;
    e instanceof HTMLElement && (e.classList.contains("mtx-date-picker__day") ? this._handleGridKeyDown(t, e) : e.classList.contains("mtx-date-picker__month") || e.classList.contains("mtx-date-picker__year") ? this._handleOptionGridKeyDown(t, e) : e.getAttribute("role") === "tab" ? this._handleTabKeyDown(t, e) : e.classList.contains("mtx-time-picker__clock") && this._handleClockKeyDown(t));
  }
  /**
   * Mantiene el foco dentro del contenedor modal.
   * @private
   * @param {KeyboardEvent} e Evento Tab.
   */
  _trapTab(t) {
    const e = Array.from(this._container.querySelectorAll(G)).filter((r) => r.getAttribute("tabindex") !== "-1" && !r.hidden && r.getAttribute("aria-hidden") !== "true");
    if (!e.length) {
      t.preventDefault();
      return;
    }
    const i = e[0], a = e[e.length - 1], s = document.activeElement;
    t.shiftKey && (s === i || !this._container.contains(s)) ? (t.preventDefault(), a.focus()) : !t.shiftKey && (s === a || !this._container.contains(s)) && (t.preventDefault(), i.focus());
  }
  /**
   * Posiciona el popover adaptándolo al espacio disponible de la pantalla para evitar desbordamientos.
   * @private
   */
  _positionPopover() {
    if (!this._popover || this._displayMode === "modal" || this._isMobileViewport() || (this._popover.style.left = "0", this._popover.style.right = "auto", this._popover.style.top = "100%", this._popover.style.bottom = "auto", this._popover.style.marginTop = "4px", this._popover.style.marginBottom = "0", typeof window > "u")) return;
    const t = this.element.getBoundingClientRect();
    t.left + 320 > window.innerWidth && (this._popover.style.left = "auto", this._popover.style.right = "0");
    const e = window.innerHeight - t.bottom, i = t.top;
    e < 380 && i > e && (this._popover.style.top = "auto", this._popover.style.bottom = "100%", this._popover.style.marginTop = "0", this._popover.style.marginBottom = "4px");
  }
  /**
   * Abre el selector visual de fecha/hora.
   *
   * @param {{focus?: boolean}} [options] `focus: false` mantiene el foco en el campo (apertura por clic en el input).
   */
  open(t = {}) {
    if (this._isOpen || this._isStatic || this._isLocked()) return;
    S._activePicker && S._activePicker !== this && S._activePicker.close(!1), S._activePicker = this, this._isOpen = !0;
    const e = typeof document < "u" ? document.activeElement : null;
    this._returnFocusEl = e && e !== document.body && this.element.contains(e) ? e : null;
    const i = this.element.getAttribute("data-time-view") || this.element.getAttribute("data-time-mode") || (this.input ? this.input.getAttribute("data-time-view") || this.input.getAttribute("data-time-mode") : null);
    this._timeInputMode = i === "dial" || i === "clock" ? "dial" : "input", this._mode === "time" ? (this._activeTab = "time", this._timeUnit = "hours", this._currentView = "time") : (this._activeTab = "date", this._currentView = "calendar"), this._selectedDate ? (this._viewDate = new Date(this._selectedDate), this._selectedHour = this._selectedDate.getHours(), this._selectedMinute = this._selectedDate.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM") : this._viewDate = /* @__PURE__ */ new Date(), this._focusedDate = null, this._renderCurrentView(), this._displayMode === "modal" ? this._backdrop.classList.add("mtx-picker-backdrop--open") : (this._mobileBackdrop && this._mobileBackdrop.classList.add("mtx-picker-backdrop-mobile--open"), this._syncModalState(), this._positionPopover(), this._popover.classList.add("mtx-picker-popover--open")), this._syncToggleButton(), nt(this, {
      kind: this._displayMode === "modal" ? "modal" : "popup",
      nodes: () => [this._container, this._backdrop, this._mobileBackdrop],
      stack: () => [{ node: this._backdrop }, { node: this._mobileBackdrop, offset: -1 }],
      onEscape: () => this.close(!0)
    }), (t.focus !== !1 || this._isModal()) && this._focusActiveView(), I(this.input || this.element, "mtx:date-time-picker:open", { picker: this }, { aliases: ["mtx:open"] });
  }
  /**
   * Cierra el selector visual de fecha/hora.
   *
   * @param {boolean} [focusInput=false] Si es true, devuelve el foco al elemento que lo abrió (botón o campo).
   */
  close(t = !1) {
    if (!(!this._isOpen || this._isStatic)) {
      if (this._isOpen = !1, this._activeDragEnd && this._activeDragEnd(!1), this._clearTimer(this._clockSwitchTimer), this._clockSwitchTimer = null, S._activePicker === this && (S._activePicker = null), rt(this), this._displayMode === "modal" ? this._backdrop.classList.remove("mtx-picker-backdrop--open") : (this._mobileBackdrop && this._mobileBackdrop.classList.remove("mtx-picker-backdrop-mobile--open"), this._popover.classList.remove("mtx-picker-popover--open")), this._syncToggleButton(), t) {
        const e = this._returnFocusEl && this._returnFocusEl.isConnected && !this._returnFocusEl.disabled ? this._returnFocusEl : this.input;
        if (e && typeof e.focus == "function")
          try {
            e.focus({ preventScroll: !0 });
          } catch {
            e.focus();
          }
      }
      this._returnFocusEl = null, I(this.input || this.element, "mtx:date-time-picker:close", { picker: this }, { aliases: ["mtx:close"] });
    }
  }
  /**
   * Alterna entre abierto y cerrado.
   */
  toggle() {
    this._isOpen ? this.close(!0) : this.open();
  }
  /**
   * Cierra cualquier selector de fecha/hora actualmente abierto en la página.
   *
   * @param {boolean} [focusInput=false]
   */
  static closeAll(t = !1) {
    S._activePicker && S._activePicker.close(t);
  }
  /**
   * Indica si el componente está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.input ? this.input.disabled === !0 : this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el campo, el botón de apertura y cierra el picker si estaba abierto.
   */
  disable() {
    this._isOpen && this.close(!1), this.input ? this._textField && typeof this._textField.disable == "function" ? this._textField.disable() : this.input.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.setAttribute("inert", ""), this.element.classList.add("mtx-picker-static--disabled")), this._syncToggleButton();
  }
  /**
   * Vuelve a habilitar el campo y el botón de apertura.
   */
  enable() {
    this.input ? this._textField && typeof this._textField.enable == "function" ? this._textField.enable() : this.input.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.removeAttribute("inert"), this.element.classList.remove("mtx-picker-static--disabled")), this._syncToggleButton();
  }
  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} callback Función a ejecutar.
   * @param {number} delay Retardo en milisegundos.
   * @returns {number|null} Id del temporizador, o `null` si la instancia ya se destruyó.
   */
  _setTimer(t, e) {
    if (this.destroyed) return null;
    this._timers || (this._timers = /* @__PURE__ */ new Set());
    const i = setTimeout(() => {
      this._timers.delete(i), this.destroyed || t();
    }, e);
    return this._timers.add(i), i;
  }
  /**
   * Cancela un temporizador programado con `_setTimer()`.
   *
   * @param {number|null} id Id del temporizador.
   */
  _clearTimer(t) {
    t != null && (clearTimeout(t), this._timers && this._timers.delete(t));
  }
  /**
   * Cancela todos los temporizadores pendientes.
   */
  _clearTimers() {
    this._timers && (this._timers.forEach((t) => clearTimeout(t)), this._timers.clear(), this._clockSwitchTimer = null);
  }
  /**
   * Libera listeners, nodos generados (popover, backdrops portados a `<body>`) y el registro.
   */
  destroy() {
    if (this.destroyed) return;
    this._activeDragEnd && this._activeDragEnd(!1), this._isOpen && this.close(!1), S._activePicker === this && (S._activePicker = null), this._clearTimers(), super.destroy(), this._backdrop && this._backdrop.remove(), this._mobileBackdrop && this._mobileBackdrop.remove(), this._popover && this._popover.remove(), this._isStatic && this._container && (this._container.innerHTML = "", this._container.classList.remove("mtx-picker-static", "mtx-picker-static--disabled"), this._addedRole && this._container.removeAttribute("role"), this._addedLabel && this._container.removeAttribute("aria-label"));
    const t = this._getToggleButton();
    t && ["aria-haspopup", "aria-expanded", "aria-controls"].forEach((e) => t.removeAttribute(e)), this._textField && typeof this._textField.destroy == "function" && !this._textField.destroyed && this._textField.destroy(), this.input && (ot(this.input), this.input.removeAttribute("data-mtx-initialized"), delete this.input.mtxDateTimePicker), delete this.element.mtxDateTimePicker, this._backdrop = null, this._mobileBackdrop = null, this._popover = null, this._dialog = null, this._container = null;
  }
  /**
   * Renderiza el contenido del picker según el modo y la vista activa, conservando el foco.
   * @private
   */
  _renderCurrentView() {
    if (!this._container) return;
    const t = typeof document < "u" ? document.activeElement : null, e = !!(t && this._container.contains(t)), i = e ? t.getAttribute("data-focus-key") : null;
    this._container.innerHTML = "", (this._displayMode === "modal" || this._isStatic) && this._renderHeader(), this._mode === "datetime" && this._renderTabs();
    const a = document.createElement("div");
    a.className = "mtx-picker-content", this._activeTab === "date" ? this._currentView === "years" ? a.appendChild(this._createYearPicker()) : this._currentView === "months" ? a.appendChild(this._createMonthPicker()) : a.appendChild(this._createCalendar()) : a.appendChild(this._createTimePicker()), this._container.appendChild(a), this._renderActions(), e && this._restoreFocus(i);
  }
  /**
   * Devuelve el foco al control equivalente tras re-renderizar (o a la vista activa).
   * @private
   * @param {string|null} key Valor de `data-focus-key` del elemento que tenía el foco.
   */
  _restoreFocus(t) {
    if (!this._container) return;
    let e = null;
    t === "grid" || t === "month" || t === "year" ? e = this._container.querySelector(`[data-focus-key="${t}"][tabindex="0"]`) : t && (e = this._container.querySelector(`[data-focus-key="${t}"]`)), e && !e.disabled ? e.focus() : this._focusActiveView();
  }
  /**
   * Enfoca el elemento principal de la vista activa (día con tabindex 0, mes, año, reloj u hora).
   * @private
   */
  _focusActiveView() {
    if (!this._container) return;
    const t = {
      calendar: '.mtx-date-picker__day[tabindex="0"]',
      months: '.mtx-date-picker__month[tabindex="0"]',
      years: '.mtx-date-picker__year[tabindex="0"]'
    };
    let e = null;
    this._activeTab === "date" ? e = this._container.querySelector(t[this._currentView] || t.calendar) : e = this._container.querySelector(".mtx-time-picker__clock, .mtx-time-picker__digit-card--input"), e || (e = Array.from(this._container.querySelectorAll(G)).find((i) => i.getAttribute("tabindex") !== "-1")), e && (e.focus(), e.classList.contains("mtx-date-picker__year") && typeof e.scrollIntoView == "function" && e.scrollIntoView({ block: "center" }));
  }
  /**
   * Renderiza la cabecera Material Design.
   * @private
   */
  _renderHeader() {
    if (this._mode === "time" || this._activeTab !== "date")
      return;
    const t = document.createElement("div");
    if (t.className = "mtx-picker-header", this._isRange && this._mode === "datetime") {
      const a = document.createElement("div");
      if (a.className = "mtx-picker-header__year", this._activeTab === "date") {
        const s = this._rangeStart ? this._rangeStart.getFullYear() : this._rangeEnd ? this._rangeEnd.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
        a.textContent = s, a.addEventListener("click", () => {
          this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
        });
      } else this._activeTab === "time-start" ? a.textContent = this._t("startTimeHeader", null, "START TIME") : this._activeTab === "time-end" && (a.textContent = this._t("endTimeHeader", null, "END TIME"));
      if (t.appendChild(a), this._activeTab === "date") {
        const s = document.createElement("div");
        if (s.className = "mtx-picker-header__date", s.style.fontSize = "1.05rem", this._rangeStart && this._rangeEnd) {
          const r = this._rangeStart.getDate(), n = this._getMonthNamesShort()[this._rangeStart.getMonth()], c = this._rangeEnd.getDate(), o = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
          s.textContent = `${r} ${n} - ${c} ${o}`;
        } else if (this._rangeStart) {
          const r = this._rangeStart.getDate(), n = this._getMonthNamesShort()[this._rangeStart.getMonth()];
          s.textContent = `${r} ${n} - ${this._t("selectEnd", null, "Select end date")}`;
        } else
          s.textContent = this._t("selectRange", null, "Select range");
        t.appendChild(s);
      } else {
        const s = this._activeTab === "time-end", r = s ? this._endHour : this._startHour, n = s ? this._endMinute : this._startMinute, c = s ? this._endAmPm : this._startAmPm;
        let o = r % 12;
        o === 0 && (o = 12);
        const u = String(o).padStart(2, "0"), _ = String(n).padStart(2, "0"), p = document.createElement("div");
        p.className = "mtx-picker-header__time";
        const l = document.createElement("span");
        l.className = `mtx-picker-header__time-unit ${this._currentView === "clock-hours" ? "mtx-picker-header__time-unit--active" : ""}`, l.textContent = u, l.addEventListener("click", () => {
          this._currentView = "clock-hours", this._renderCurrentView();
        });
        const d = document.createElement("span");
        d.textContent = ":";
        const g = document.createElement("span");
        g.className = `mtx-picker-header__time-unit ${this._currentView === "clock-minutes" ? "mtx-picker-header__time-unit--active" : ""}`, g.textContent = _, g.addEventListener("click", () => {
          this._currentView = "clock-minutes", this._renderCurrentView();
        });
        const b = document.createElement("div");
        b.className = "mtx-picker-header__ampm-group";
        const h = document.createElement("span");
        h.className = `mtx-picker-header__ampm-btn ${c === "AM" ? "mtx-picker-header__ampm-btn--active" : ""}`, h.textContent = "AM", h.addEventListener("click", () => {
          this._setAmPm("AM");
        });
        const m = document.createElement("span");
        m.className = `mtx-picker-header__ampm-btn ${c === "PM" ? "mtx-picker-header__ampm-btn--active" : ""}`, m.textContent = "PM", m.addEventListener("click", () => {
          this._setAmPm("PM");
        }), b.appendChild(h), b.appendChild(m), p.appendChild(l), p.appendChild(d), p.appendChild(g), p.appendChild(b), t.appendChild(p);
      }
      this._enhanceHeader(t), this._container.appendChild(t);
      return;
    }
    if (this._isRange) {
      const a = document.createElement("div");
      a.className = "mtx-picker-header__year";
      const s = this._rangeStart ? this._rangeStart.getFullYear() : this._rangeEnd ? this._rangeEnd.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
      a.textContent = s, a.addEventListener("click", () => {
        this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
      }), t.appendChild(a);
      const r = document.createElement("div");
      if (r.className = "mtx-picker-header__date", r.style.fontSize = "1.05rem", this._rangeStart && this._rangeEnd) {
        const n = this._rangeStart.getDate(), c = this._getMonthNamesShort()[this._rangeStart.getMonth()], o = this._rangeEnd.getDate(), u = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
        r.textContent = `${n} ${c} - ${o} ${u}`;
      } else if (this._rangeStart) {
        const n = this._rangeStart.getDate(), c = this._getMonthNamesShort()[this._rangeStart.getMonth()];
        r.textContent = `${n} ${c} - ${this._t("selectEnd", null, "Select end date")}`;
      } else
        r.textContent = this._t("selectRange", null, "Select range");
      t.appendChild(r), this._enhanceHeader(t), this._container.appendChild(t);
      return;
    }
    const e = this._selectedDate || /* @__PURE__ */ new Date(), i = document.createElement("div");
    if (i.className = "mtx-picker-header__year", i.textContent = e.getFullYear(), i.addEventListener("click", () => {
      this._activeTab = "date", this._currentView = "years", this._renderCurrentView();
    }), t.appendChild(i), this._mode === "date" || this._mode === "datetime" && this._activeTab === "date") {
      const a = document.createElement("div");
      a.className = "mtx-picker-header__date";
      const s = this._getWeekdayNamesShort()[e.getDay()], r = this._getMonthNamesShort()[e.getMonth()];
      a.textContent = `${s}, ${e.getDate()} ${r}`, t.appendChild(a);
    } else {
      const a = document.createElement("div");
      a.className = "mtx-picker-header__time";
      let s = this._selectedHour % 12;
      s === 0 && (s = 12);
      const r = String(s).padStart(2, "0"), n = String(this._selectedMinute).padStart(2, "0"), c = document.createElement("span");
      c.className = `mtx-picker-header__time-unit ${this._currentView === "clock-hours" ? "mtx-picker-header__time-unit--active" : ""}`, c.textContent = r, c.addEventListener("click", () => {
        this._currentView = "clock-hours", this._renderCurrentView();
      });
      const o = document.createElement("span");
      o.textContent = ":";
      const u = document.createElement("span");
      u.className = `mtx-picker-header__time-unit ${this._currentView === "clock-minutes" ? "mtx-picker-header__time-unit--active" : ""}`, u.textContent = n, u.addEventListener("click", () => {
        this._currentView = "clock-minutes", this._renderCurrentView();
      });
      const _ = document.createElement("div");
      _.className = "mtx-picker-header__ampm-group";
      const p = document.createElement("span");
      p.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === "AM" ? "mtx-picker-header__ampm-btn--active" : ""}`, p.textContent = "AM", p.addEventListener("click", () => {
        this._setAmPm("AM");
      });
      const l = document.createElement("span");
      l.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === "PM" ? "mtx-picker-header__ampm-btn--active" : ""}`, l.textContent = "PM", l.addEventListener("click", () => {
        this._setAmPm("PM");
      }), _.appendChild(p), _.appendChild(l), a.appendChild(c), a.appendChild(o), a.appendChild(u), a.appendChild(_), t.appendChild(a);
    }
    this._enhanceHeader(t), this._container.appendChild(t);
  }
  /**
   * Renderiza las pestañas de navegación de DateTimePicker.
   * @private
   */
  _renderTabs() {
    const t = document.createElement("div");
    if (t.className = "mtx-picker-tabs", this._isRange && this._mode === "datetime") {
      let a = this._startHour % 12;
      a === 0 && (a = 12);
      const s = String(a).padStart(2, "0"), r = String(this._startMinute).padStart(2, "0"), n = `${s}:${r} ${this._startAmPm}`;
      let c = this._endHour % 12;
      c === 0 && (c = 12);
      const o = String(c).padStart(2, "0"), u = String(this._endMinute).padStart(2, "0"), _ = `${o}:${u} ${this._endAmPm}`, p = document.createElement("button");
      p.className = `mtx-picker-tab ${this._activeTab === "date" ? "mtx-picker-tab--active" : ""}`, p.type = "button", p.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t("dates", null, "Dates")}`, p.addEventListener("click", (g) => {
        g.stopPropagation(), this._activeTab = "date", this._currentView = "calendar", this._renderCurrentView();
      });
      const l = document.createElement("button");
      l.className = `mtx-picker-tab ${this._activeTab === "time-start" ? "mtx-picker-tab--active" : ""}`, l.type = "button", l.innerHTML = `<span class="material-icons">schedule</span> ${this._t("start", null, "Start")} (${n})`, l.addEventListener("click", (g) => {
        g.stopPropagation(), this._activeTab = "time-start", this._currentView = "clock-hours", this._renderCurrentView();
      });
      const d = document.createElement("button");
      d.className = `mtx-picker-tab ${this._activeTab === "time-end" ? "mtx-picker-tab--active" : ""}`, d.type = "button", d.innerHTML = `<span class="material-icons">schedule</span> ${this._t("end", null, "End")} (${_})`, d.addEventListener("click", (g) => {
        g.stopPropagation(), this._activeTab = "time-end", this._currentView = "clock-hours", this._renderCurrentView();
      }), t.appendChild(p), t.appendChild(l), t.appendChild(d), this._enhanceTabs(t), this._container.appendChild(t);
      return;
    }
    const e = document.createElement("button");
    e.className = `mtx-picker-tab ${this._activeTab === "date" ? "mtx-picker-tab--active" : ""}`, e.type = "button", e.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t("date", null, "Date")}`, e.addEventListener("click", (a) => {
      a.stopPropagation(), this._activeTab = "date", this._currentView = "calendar", this._renderCurrentView();
    });
    const i = document.createElement("button");
    i.className = `mtx-picker-tab ${this._activeTab === "time" ? "mtx-picker-tab--active" : ""}`, i.type = "button", i.innerHTML = `<span class="material-icons">schedule</span> ${this._t("time", null, "Time")}`, i.addEventListener("click", (a) => {
      a.stopPropagation(), this._activeTab = "time", this._currentView = "clock-hours", this._renderCurrentView();
    }), t.appendChild(e), t.appendChild(i), this._enhanceTabs(t), this._container.appendChild(t);
  }
  /**
   * Hace accesibles por teclado los elementos clicables de la cabecera MD2.
   * @private
   * @param {HTMLElement} header Cabecera renderizada.
   */
  _enhanceHeader(t) {
    t.querySelectorAll(".mtx-picker-header__year, .mtx-picker-header__time-unit, .mtx-picker-header__ampm-btn").forEach((e, i) => {
      e.setAttribute("role", "button"), e.setAttribute("tabindex", "0"), e.setAttribute("data-focus-key", `header-${i}`), e.classList.contains("mtx-picker-header__year") && e.setAttribute("aria-label", this._t("yearViewLabel", { year: e.textContent }, `${e.textContent}, choose year`)), e.addEventListener("keydown", (a) => {
        (a.key === "Enter" || a.key === " ") && (a.preventDefault(), e.click());
      });
    });
  }
  /**
   * Aplica el patrón WAI-ARIA Tabs a las pestañas Fecha/Hora (roving tabindex).
   * @private
   * @param {HTMLElement} tabs Contenedor de pestañas.
   */
  _enhanceTabs(t) {
    t.setAttribute("role", "tablist"), t.setAttribute("aria-label", this._getDialogLabel()), t.querySelectorAll(".mtx-picker-tab").forEach((e, i) => {
      const a = e.classList.contains("mtx-picker-tab--active");
      e.setAttribute("role", "tab"), e.setAttribute("aria-selected", String(a)), e.setAttribute("tabindex", a ? "0" : "-1"), e.setAttribute("data-focus-key", `tab-${i}`), e.querySelectorAll(".material-icons").forEach((s) => s.setAttribute("aria-hidden", "true"));
    });
  }
  /**
   * Flechas izquierda/derecha, Inicio y Fin entre pestañas (activación automática).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} tab Pestaña enfocada.
   */
  _handleTabKeyDown(t, e) {
    const i = Array.from(e.parentElement.querySelectorAll('[role="tab"]')), a = i.indexOf(e);
    let s = null;
    if (t.key === "ArrowRight" ? s = i[(a + 1) % i.length] : t.key === "ArrowLeft" ? s = i[(a - 1 + i.length) % i.length] : t.key === "Home" ? s = i[0] : t.key === "End" && (s = i[i.length - 1]), !s) return;
    t.preventDefault();
    const r = s.getAttribute("data-focus-key");
    s.click();
    const n = this._container && this._container.querySelector(`[data-focus-key="${r}"]`);
    n && n.focus();
  }
  /**
   * Día que recibe `tabindex="0"` en el grid: enfocado, seleccionado, hoy o primer día habilitado.
   * @private
   * @returns {Date} Fecha objetivo del roving tabindex.
   */
  _getGridFocusDate() {
    const t = this._viewDate.getFullYear(), e = this._viewDate.getMonth(), i = (n) => n && n.getFullYear() === t && n.getMonth() === e && !this._isDateDisabled(n);
    if (i(this._focusedDate)) return this._focusedDate;
    const a = this._isRange ? this._rangeStart || this._rangeEnd : this._selectedDate;
    if (i(a)) return a;
    const s = /* @__PURE__ */ new Date();
    if (i(s)) return s;
    const r = new Date(t, e + 1, 0).getDate();
    for (let n = 1; n <= r; n++) {
      const c = new Date(t, e, n);
      if (!this._isDateDisabled(c)) return c;
    }
    return new Date(t, e, 1);
  }
  /**
   * Crea el calendario interactivo mensual como `role="grid"` (filas de semanas y roving tabindex).
   * @private
   */
  _createCalendar() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker";
    const e = this._getMonthNames(), i = W("mtx-picker-title"), a = document.createElement("div");
    a.className = "mtx-date-picker__nav";
    const s = document.createElement("div");
    s.className = "mtx-date-picker__title-group", s.id = i, s.setAttribute("aria-live", "polite");
    const r = e[this._viewDate.getMonth()], n = document.createElement("button");
    n.className = "mtx-date-picker__title mtx-date-picker__title--month", n.type = "button", n.setAttribute("data-focus-key", "month-title"), n.setAttribute("aria-label", this._t("monthViewLabel", { month: r }, `${r}, choose month`)), n.innerHTML = '<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>', n.firstChild.textContent = r, n.addEventListener("click", (v) => {
      v.stopPropagation(), this._currentView = "months", this._renderCurrentView();
    });
    const c = String(this._viewDate.getFullYear()), o = document.createElement("button");
    o.className = "mtx-date-picker__title mtx-date-picker__title--year", o.type = "button", o.setAttribute("data-focus-key", "year-title"), o.setAttribute("aria-label", this._t("yearViewLabel", { year: c }, `${c}, choose year`)), o.innerHTML = '<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>', o.firstChild.textContent = c, o.addEventListener("click", (v) => {
      v.stopPropagation(), this._currentView = "years", this._renderCurrentView();
    }), s.appendChild(n), s.appendChild(o);
    const u = (v) => {
      const x = document.createElement("button");
      x.className = "mtx-date-picker__nav-btn", x.type = "button";
      const M = v < 0 ? "previousMonth" : "nextMonth";
      return x.setAttribute("data-focus-key", M), x.setAttribute("aria-label", this._t(M, null, v < 0 ? "Previous month" : "Next month")), x.innerHTML = `<span class="material-icons" aria-hidden="true">${v < 0 ? "chevron_left" : "chevron_right"}</span>`, x.addEventListener("click", (R) => {
        R.stopPropagation(), this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + v, 1), this._focusedDate = null, this._renderCurrentView();
      }), x;
    }, _ = document.createElement("div");
    _.className = "mtx-date-picker__nav-group", _.appendChild(u(-1)), _.appendChild(u(1)), a.appendChild(s), a.appendChild(_), t.appendChild(a);
    const p = document.createElement("div");
    p.className = "mtx-date-picker__grid", p.setAttribute("role", "grid"), p.setAttribute("aria-labelledby", i);
    const l = document.createElement("div");
    l.className = "mtx-date-picker__weekdays", l.setAttribute("role", "row");
    const d = this._getWeekdayNamesLong();
    this._getWeekdayNames().forEach((v, x) => {
      const M = document.createElement("div");
      M.className = "mtx-date-picker__weekday", M.setAttribute("role", "columnheader"), M.setAttribute("aria-label", d[x]), M.title = d[x], M.textContent = v, l.appendChild(M);
    }), p.appendChild(l);
    const g = document.createElement("div");
    g.className = "mtx-date-picker__days", g.setAttribute("role", "rowgroup");
    const b = this._viewDate.getFullYear(), h = this._viewDate.getMonth(), m = new Date(b, h, 1).getDay(), w = new Date(b, h + 1, 0).getDate(), A = Math.ceil((m + w) / 7) * 7, V = /* @__PURE__ */ new Date(), Y = this._getGridFocusDate();
    this._focusedDate = Y;
    let $ = null;
    for (let v = 0; v < A; v++) {
      v % 7 === 0 && ($ = document.createElement("div"), $.className = "mtx-date-picker__week", $.setAttribute("role", "row"), g.appendChild($));
      const x = new Date(b, h, 1 - m + v), M = x.getMonth() !== h;
      $.appendChild(this._createDayCell(x, M, V, Y, g));
    }
    return this._isRange && g.addEventListener("mouseleave", () => {
      this._rangeStart && !this._rangeEnd && (this._hoverDate = null, this._renderRangePreview(g));
    }), p.appendChild(g), t.appendChild(p), t;
  }
  /**
   * Crea una celda del grid (`role="gridcell"`) con estado, etiqueta completa y selección.
   * @private
   * @param {Date} dateObj Fecha de la celda.
   * @param {boolean} outside Si pertenece al mes anterior/siguiente.
   * @param {Date} today Fecha actual.
   * @param {Date} focusDate Fecha con tabindex 0.
   * @param {HTMLElement} daysContainer Contenedor de semanas (vista previa de rango).
   * @returns {HTMLElement} Celda creada.
   */
  _createDayCell(t, e, i, a, s) {
    const r = document.createElement("div");
    r.className = "mtx-date-picker__day-cell", r.setAttribute("role", "presentation");
    const n = document.createElement("button");
    n.className = "mtx-date-picker__day", n.type = "button", n.textContent = t.getDate(), n._cellDate = t, n.setAttribute("role", "gridcell"), n.setAttribute("data-date", J(t)), n.setAttribute("data-focus-key", e ? "grid-outside" : "grid"), n.setAttribute("aria-label", this._formatDayLabel(t)), n.setAttribute("tabindex", !e && B(t, a) ? "0" : "-1"), B(t, i) && (n.classList.add("mtx-date-picker__day--today"), n.setAttribute("aria-current", "date"));
    let c = !1;
    if (e)
      n.classList.add("mtx-date-picker__day--outside");
    else if (this._isRange) {
      const o = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime(), u = this._rangeStart ? new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime() : null, _ = this._rangeEnd ? new Date(this._rangeEnd.getFullYear(), this._rangeEnd.getMonth(), this._rangeEnd.getDate()).getTime() : null, p = u !== null && o === u, l = _ !== null && o === _, d = u !== null && _ !== null && o > u && o < _;
      if (p && (r.classList.add("mtx-date-picker__day-cell--range-start"), n.classList.add("mtx-date-picker__day--selected", "mtx-date-picker__day--range-start")), l && (r.classList.add("mtx-date-picker__day-cell--range-end"), n.classList.add("mtx-date-picker__day--selected", "mtx-date-picker__day--range-end")), d && (r.classList.add("mtx-date-picker__day-cell--in-range"), n.classList.add("mtx-date-picker__day--in-range")), c = p || l || d, this._rangeStart && !this._rangeEnd && this._hoverDate) {
        const g = new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime();
        o > Math.min(u, g) && o < Math.max(u, g) && (r.classList.add("mtx-date-picker__day-cell--range-preview"), n.classList.add("mtx-date-picker__day--range-preview"));
      }
      this._isDateDisabled(t) || n.addEventListener("mouseenter", () => {
        this._rangeStart && !this._rangeEnd && (this._hoverDate = t, this._renderRangePreview(s));
      });
    } else B(t, this._selectedDate) && (n.classList.add("mtx-date-picker__day--selected"), c = !0);
    return n.setAttribute("aria-selected", String(c)), this._isDateDisabled(t) ? (n.disabled = !0, n.setAttribute("aria-disabled", "true"), n.classList.add("mtx-date-picker__day--disabled")) : n.addEventListener("click", () => {
      this._focusedDate = new Date(t), e && (this._viewDate = new Date(t.getFullYear(), t.getMonth(), 1)), this._selectDay(t.getFullYear(), t.getMonth(), t.getDate());
    }), r.appendChild(n), r;
  }
  /**
   * Navegación por teclado del grid de días (flechas, Inicio/Fin, RePág/AvPág, Mayús+RePág/AvPág, Enter/Espacio).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} dayBtn Día enfocado.
   */
  _handleGridKeyDown(t, e) {
    const i = e._cellDate ? new Date(e._cellDate) : new Date(this._focusedDate || /* @__PURE__ */ new Date()), a = i.getFullYear(), s = i.getMonth(), r = i.getDate(), n = (u) => {
      const _ = new Date(a, s + u + 1, 0).getDate();
      return new Date(a, s + u, Math.min(r, _));
    };
    let c = null, o = 1;
    switch (t.key) {
      case "ArrowLeft":
        c = new Date(a, s, r - 1), o = -1;
        break;
      case "ArrowRight":
        c = new Date(a, s, r + 1);
        break;
      case "ArrowUp":
        c = new Date(a, s, r - 7), o = -1;
        break;
      case "ArrowDown":
        c = new Date(a, s, r + 7);
        break;
      case "Home":
        c = new Date(a, s, r - i.getDay());
        break;
      case "End":
        c = new Date(a, s, r + (6 - i.getDay())), o = -1;
        break;
      case "PageUp":
        c = n(t.shiftKey ? -12 : -1), o = -1;
        break;
      case "PageDown":
        c = n(t.shiftKey ? 12 : 1);
        break;
      case "Enter":
      case " ":
        t.preventDefault(), e.disabled || e.click();
        return;
      default:
        return;
    }
    t.preventDefault(), this._moveGridFocus(c, o);
  }
  /**
   * Mueve el foco del grid a una fecha (saltando días deshabilitados) y cambia de mes si hace falta.
   * @private
   * @param {Date} target Fecha destino.
   * @param {number} step Dirección de búsqueda si el destino está deshabilitado (1 o -1).
   */
  _moveGridFocus(t, e) {
    let i = new Date(t), a = 0;
    for (; this._isDateDisabled(i) && a < 366; )
      i = new Date(i.getFullYear(), i.getMonth(), i.getDate() + e), a++;
    if (this._isDateDisabled(i)) return;
    this._focusedDate = i, this._isRange && this._rangeStart && !this._rangeEnd && (this._hoverDate = i), i.getFullYear() === this._viewDate.getFullYear() && i.getMonth() === this._viewDate.getMonth() ? this._isRange && this._hoverDate && this._renderRangePreview(this._container.querySelector(".mtx-date-picker__days")) : (this._viewDate = new Date(i.getFullYear(), i.getMonth(), 1), this._renderCurrentView());
    const r = J(i);
    this._container.querySelectorAll(".mtx-date-picker__day").forEach((n) => {
      const c = n.getAttribute("data-date") === r && !n.classList.contains("mtx-date-picker__day--outside");
      n.setAttribute("tabindex", c ? "0" : "-1"), c && n.focus();
    });
  }
  /**
   * Actualiza el resaltado visual interactivo de rango en hover sin reconstruir el calendario.
   *
   * @param {HTMLElement} container Contenedor de días.
   * @private
   */
  _renderRangePreview(t) {
    if (!t || !this._rangeStart || this._rangeEnd) return;
    const e = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime(), i = this._hoverDate ? new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime() : null, a = i !== null ? Math.min(e, i) : null, s = i !== null ? Math.max(e, i) : null;
    t.querySelectorAll(".mtx-date-picker__day-cell").forEach((n) => {
      const c = n.querySelector(".mtx-date-picker__day");
      if (!c || !c._cellDate || c.classList.contains("mtx-date-picker__day--outside")) return;
      const o = new Date(c._cellDate.getFullYear(), c._cellDate.getMonth(), c._cellDate.getDate()).getTime();
      a !== null && s !== null && o > a && o < s ? (n.classList.add("mtx-date-picker__day-cell--range-preview"), c.classList.add("mtx-date-picker__day--range-preview")) : (n.classList.remove("mtx-date-picker__day-cell--range-preview"), c.classList.remove("mtx-date-picker__day--range-preview"));
    });
  }
  /**
   * Crea el selector de meses (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createMonthPicker() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker__months", t.setAttribute("role", "radiogroup"), t.setAttribute("aria-label", this._t("chooseMonth", null, "Choose month"));
    const e = this._viewDate.getFullYear(), i = this._selectedDate && this._selectedDate.getFullYear() === e ? this._selectedDate.getMonth() : this._viewDate.getMonth(), a = this._getMonthNamesShort();
    return this._getMonthNames().forEach((s, r) => {
      const n = document.createElement("button"), c = r === i;
      n.className = `mtx-date-picker__month ${c ? "mtx-date-picker__month--selected" : ""}`, n.type = "button", n.textContent = a[r], n.title = s, n.setAttribute("role", "radio"), n.setAttribute("aria-checked", String(c)), n.setAttribute("aria-label", s), n.setAttribute("tabindex", c ? "0" : "-1"), n.setAttribute("data-focus-key", "month");
      const o = new Date(e, r, 1), u = new Date(e, r + 1, 0);
      let _ = !1;
      this._minDate && u < new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate()) && (_ = !0), this._maxDate && o > this._maxDate && (_ = !0), _ ? (n.disabled = !0, n.setAttribute("aria-disabled", "true")) : n.addEventListener("click", (p) => {
        p.stopPropagation();
        const l = new Date(e, r + 1, 0).getDate();
        this._viewDate = new Date(e, r, Math.min(this._viewDate.getDate(), l)), this._focusedDate = null, this._currentView = "calendar", this._renderCurrentView();
      }), t.appendChild(n);
    }), this._ensureRovingStop(t, ".mtx-date-picker__month"), t;
  }
  /**
   * Crea el selector de años (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createYearPicker() {
    const t = document.createElement("div");
    t.className = "mtx-date-picker__years", t.setAttribute("role", "radiogroup"), t.setAttribute("aria-label", this._t("chooseYear", null, "Choose year"));
    const e = this._viewDate.getFullYear(), i = this._selectedDate ? this._selectedDate.getFullYear() : e, a = this._minDate ? this._minDate.getFullYear() : 1900, s = this._maxDate ? this._maxDate.getFullYear() : 2100;
    for (let r = a; r <= s; r++) {
      const n = document.createElement("button"), c = r === i;
      n.className = `mtx-date-picker__year ${c ? "mtx-date-picker__year--selected" : ""}`, n.type = "button", n.textContent = r, n.setAttribute("role", "radio"), n.setAttribute("aria-checked", String(c)), n.setAttribute("tabindex", c ? "0" : "-1"), n.setAttribute("data-focus-key", "year"), n.addEventListener("click", (o) => {
        o.stopPropagation();
        const u = new Date(r, this._viewDate.getMonth() + 1, 0).getDate();
        this._viewDate = new Date(r, this._viewDate.getMonth(), Math.min(this._viewDate.getDate(), u)), this._focusedDate = null, this._currentView = "calendar", this._renderCurrentView();
      }), t.appendChild(n);
    }
    return this._ensureRovingStop(t, ".mtx-date-picker__year"), this._setTimer(() => {
      const r = t.querySelector(".mtx-date-picker__year--selected");
      r && typeof r.scrollIntoView == "function" && r.scrollIntoView({ block: "center" });
    }, 0), t;
  }
  /**
   * Garantiza que exista un único elemento con `tabindex="0"` en una lista con roving tabindex.
   * @private
   * @param {HTMLElement} container Lista.
   * @param {string} selector Selector de las opciones.
   */
  _ensureRovingStop(t, e) {
    if (t.querySelector(`${e}[tabindex="0"]:not(:disabled)`)) return;
    const i = t.querySelector(`${e}:not(:disabled)`);
    t.querySelectorAll(e).forEach((a) => a.setAttribute("tabindex", "-1")), i && i.setAttribute("tabindex", "0");
  }
  /**
   * Teclado en las vistas de meses y años: flechas (±1 / ±3 filas), Inicio/Fin y Enter/Espacio.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} option Opción enfocada.
   */
  _handleOptionGridKeyDown(t, e) {
    const i = Array.from(e.parentElement.children).filter((n) => !n.disabled), a = i.indexOf(e), s = 3;
    let r = null;
    switch (t.key) {
      case "ArrowLeft":
        r = i[a - 1];
        break;
      case "ArrowRight":
        r = i[a + 1];
        break;
      case "ArrowUp":
        r = i[a - s];
        break;
      case "ArrowDown":
        r = i[a + s];
        break;
      case "Home":
        r = i[0];
        break;
      case "End":
        r = i[i.length - 1];
        break;
      case "Enter":
      case " ":
        t.preventDefault(), e.click();
        return;
      default:
        return;
    }
    t.preventDefault(), r && (i.forEach((n) => n.setAttribute("tabindex", n === r ? "0" : "-1")), r.focus());
  }
  /**
   * Crea el selector de hora canónico Material Design (MUI / MD2):
   * Modo 1: Dial analógico con tarjetas interactivas superiores ("Select time").
   * Modo 2: Entrada directa por teclado con tarjetas editables ("Enter time").
   * @private
   * @returns {HTMLElement}
   */
  _createTimePicker() {
    const t = document.createElement("div");
    t.className = "mtx-time-picker";
    let e, i, a;
    this._isRange && this._mode === "datetime" ? this._activeTab === "time-end" ? (e = this._endHour, i = this._endMinute, a = this._endAmPm) : (e = this._startHour, i = this._startMinute, a = this._startAmPm) : (e = this._selectedHour, i = this._selectedMinute, a = this._selectedAmPm);
    const s = this._isAmPmMode();
    let r = e;
    s && (r = e % 12, r === 0 && (r = 12));
    const n = this._timeInputMode === "input" || this._timeInputMode === "keyboard", c = this._timeUnit === "hours", o = document.createElement("div");
    o.className = "mtx-time-picker__header-box";
    const u = document.createElement("span");
    u.className = "mtx-time-picker__title", u.textContent = n ? this._t("enterTime", null, "Enter time") : this._t("selectTime", null, "Select time"), o.appendChild(u);
    const _ = document.createElement("div");
    _.className = "mtx-time-picker__cards-row";
    const p = document.createElement("div");
    p.className = "mtx-time-picker__card-wrapper";
    let l, d;
    if (n ? (l = document.createElement("input"), l.type = "text", l.inputMode = "numeric", l.maxLength = 2, l.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${c ? "mtx-time-picker__digit-card--active" : ""}`, l.value = String(r).padStart(2, "0"), l.setAttribute("aria-label", this._t("hour", null, "Hour")), l.setAttribute("data-focus-key", "hour-card"), l.addEventListener("focus", () => {
      this._timeUnit = "hours", l.classList.add("mtx-time-picker__digit-card--active"), d && d.classList.remove("mtx-time-picker__digit-card--active"), l.select();
    }), l.addEventListener("keydown", (h) => {
      if (h.key === "Enter")
        h.preventDefault(), d && (d.focus(), d.select());
      else if (h.key === "ArrowUp") {
        h.preventDefault();
        let m = parseInt(l.value, 10) || 0;
        m = s ? m % 12 + 1 : (m + 1) % 24, l.value = String(m).padStart(2, "0"), this._setHour(m), l.select();
      } else if (h.key === "ArrowDown") {
        h.preventDefault();
        let m = parseInt(l.value, 10) || 0;
        m = s ? m <= 1 ? 12 : m - 1 : m <= 0 ? 23 : m - 1, l.value = String(m).padStart(2, "0"), this._setHour(m), l.select();
      }
    }), l.addEventListener("input", () => {
      let h = l.value.replace(/\D/g, "");
      if (l.value = h, h.length > 0) {
        let m = parseInt(h, 10);
        s ? m > 12 && (m = 12, l.value = "12") : m > 23 && (m = 23, l.value = "23"), this._setHour(m), (h.length === 2 || s && m > 1) && d && (d.focus(), d.select());
      }
    }), l.addEventListener("blur", () => {
      l.value && (l.value = l.value.padStart(2, "0"));
    }), this._setTimer(() => {
      l && document.body.contains(l) && (l.focus(), l.select());
    }, 30)) : (l = document.createElement("button"), l.type = "button", l.className = `mtx-time-picker__digit-card ${c ? "mtx-time-picker__digit-card--active" : ""}`, l.textContent = String(r).padStart(2, "0"), l.setAttribute("aria-label", `${this._t("hour", null, "Hour")} ${String(r).padStart(2, "0")}`), l.setAttribute("aria-pressed", String(c)), l.setAttribute("data-focus-key", "hour-card"), l.addEventListener("click", (h) => {
      h.stopPropagation(), this._timeUnit !== "hours" && (this._timeUnit = "hours", this._renderCurrentView());
    })), p.appendChild(l), n) {
      const h = document.createElement("span");
      h.className = "mtx-time-picker__card-label", h.textContent = this._t("hour", null, "Hour"), p.appendChild(h);
    }
    _.appendChild(p);
    const g = document.createElement("span");
    g.className = "mtx-time-picker__colon", g.textContent = ":", _.appendChild(g);
    const b = document.createElement("div");
    if (b.className = "mtx-time-picker__card-wrapper", n ? (d = document.createElement("input"), d.type = "text", d.inputMode = "numeric", d.maxLength = 2, d.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${c ? "" : "mtx-time-picker__digit-card--active"}`, d.value = String(i).padStart(2, "0"), d.setAttribute("aria-label", this._t("minute", null, "Minute")), d.setAttribute("data-focus-key", "minute-card"), d.addEventListener("focus", () => {
      this._timeUnit = "minutes", d.classList.add("mtx-time-picker__digit-card--active"), l && l.classList.remove("mtx-time-picker__digit-card--active"), d.select();
    }), d.addEventListener("keydown", (h) => {
      if (h.key === "Enter")
        h.preventDefault(), this._applySelection(), this._isStatic || this.close(!0);
      else if (h.key === "ArrowUp") {
        h.preventDefault();
        let m = parseInt(d.value, 10) || 0;
        m = (m + 1) % 60, d.value = String(m).padStart(2, "0"), this._setMinute(m), d.select();
      } else if (h.key === "ArrowDown") {
        h.preventDefault();
        let m = parseInt(d.value, 10) || 0;
        m = m <= 0 ? 59 : m - 1, d.value = String(m).padStart(2, "0"), this._setMinute(m), d.select();
      }
    }), d.addEventListener("input", () => {
      let h = d.value.replace(/\D/g, "");
      if (d.value = h, h.length > 0) {
        let m = parseInt(h, 10);
        m > 59 && (m = 59, d.value = "59"), this._setMinute(m);
      }
    }), d.addEventListener("blur", () => {
      d.value && (d.value = d.value.padStart(2, "0"));
    })) : (d = document.createElement("button"), d.type = "button", d.className = `mtx-time-picker__digit-card ${c ? "" : "mtx-time-picker__digit-card--active"}`, d.textContent = String(i).padStart(2, "0"), d.setAttribute("aria-label", `${this._t("minute", null, "Minute")} ${String(i).padStart(2, "0")}`), d.setAttribute("aria-pressed", String(!c)), d.setAttribute("data-focus-key", "minute-card"), d.addEventListener("click", (h) => {
      h.stopPropagation(), this._timeUnit !== "minutes" && (this._timeUnit = "minutes", this._renderCurrentView());
    })), b.appendChild(d), n) {
      const h = document.createElement("span");
      h.className = "mtx-time-picker__card-label", h.textContent = this._t("minute", null, "Minute"), b.appendChild(h);
    }
    if (_.appendChild(b), s) {
      const h = document.createElement("div");
      h.className = "mtx-time-picker__ampm-stack";
      const m = document.createElement("button");
      m.type = "button", m.className = `mtx-time-picker__ampm-opt ${a === "AM" ? "mtx-time-picker__ampm-opt--active" : ""}`, m.textContent = "AM", m.setAttribute("aria-pressed", String(a === "AM")), m.setAttribute("data-focus-key", "ampm-am"), m.addEventListener("click", (A) => {
        A.stopPropagation(), this._setAmPm("AM"), m.classList.add("mtx-time-picker__ampm-opt--active"), w.classList.remove("mtx-time-picker__ampm-opt--active"), m.setAttribute("aria-pressed", "true"), w.setAttribute("aria-pressed", "false");
      });
      const w = document.createElement("button");
      w.type = "button", w.className = `mtx-time-picker__ampm-opt ${a === "PM" ? "mtx-time-picker__ampm-opt--active" : ""}`, w.textContent = "PM", w.setAttribute("aria-pressed", String(a === "PM")), w.setAttribute("data-focus-key", "ampm-pm"), w.addEventListener("click", (A) => {
        A.stopPropagation(), this._setAmPm("PM"), w.classList.add("mtx-time-picker__ampm-opt--active"), m.classList.remove("mtx-time-picker__ampm-opt--active"), w.setAttribute("aria-pressed", "true"), m.setAttribute("aria-pressed", "false");
      }), h.appendChild(m), h.appendChild(w), _.appendChild(h);
    }
    if (o.appendChild(_), t.appendChild(o), !n) {
      const h = document.createElement("div");
      h.className = "mtx-time-picker__clock";
      const m = s ? r : e;
      h.setAttribute("role", "slider"), h.setAttribute("tabindex", "0"), h.setAttribute("data-focus-key", "clock"), h.setAttribute("aria-orientation", "horizontal"), h.setAttribute("aria-label", c ? this._t("selectHours", null, "Select hours") : this._t("selectMinutes", null, "Select minutes")), h.setAttribute("aria-valuemin", c && s ? "1" : "0"), h.setAttribute("aria-valuemax", c ? s ? "12" : "23" : "59"), h.setAttribute("aria-valuenow", String(c ? m : i)), h.setAttribute("aria-valuetext", c ? this._t("hoursValue", { value: s ? `${m} ${a}` : m }, `${m} hours`) : this._t("minutesValue", { value: i }, `${i} minutes`));
      const w = document.createElement("div");
      w.className = "mtx-time-picker__center", h.appendChild(w);
      const A = document.createElement("div");
      A.className = "mtx-time-picker__hand";
      const V = document.createElement("div");
      V.className = "mtx-time-picker__pointer", A.appendChild(V), h.appendChild(A);
      const Y = 104, $ = 128, v = 128;
      let x = 0;
      if (c) {
        let D = e % 12;
        D === 0 && (D = 12), x = D % 12 * 30;
        for (let k = 1; k <= 12; k++) {
          const E = document.createElement("div");
          E.setAttribute("aria-hidden", "true"), E.className = `mtx-time-picker__number ${k === D ? "mtx-time-picker__number--selected" : ""}`, E.textContent = k;
          const H = (k * 30 - 90) * (Math.PI / 180), L = $ + Y * Math.cos(H), y = v + Y * Math.sin(H);
          E.style.left = `${L}px`, E.style.top = `${y}px`, h.appendChild(E);
        }
      } else {
        x = i * 6;
        for (let D = 0; D < 60; D += 5) {
          const k = document.createElement("div");
          k.setAttribute("aria-hidden", "true");
          const E = Math.round(i / 5) * 5 === D;
          k.className = `mtx-time-picker__number ${E ? "mtx-time-picker__number--selected" : ""}`, k.textContent = String(D).padStart(2, "0");
          const H = (D * 6 - 90) * (Math.PI / 180), L = $ + Y * Math.cos(H), y = v + Y * Math.sin(H);
          k.style.left = `${L}px`, k.style.top = `${y}px`, h.appendChild(k);
        }
      }
      A.style.height = `${Y}px`, A.style.transform = `rotate(${x}deg)`;
      const M = (D) => {
        const k = h.getBoundingClientRect(), E = (D.touches ? D.touches[0].clientX : D.clientX) - k.left - $, H = (D.touches ? D.touches[0].clientY : D.clientY) - k.top - v;
        let L = Math.atan2(H, E) * (180 / Math.PI) + 90;
        if (L < 0 && (L += 360), c) {
          let y = Math.round(L / 30) % 12;
          y === 0 && (y = 12), this._setHour(y), A.style.transform = `rotate(${y % 12 * 30}deg)`, h.querySelectorAll(".mtx-time-picker__number").forEach((N) => {
            N.classList.toggle("mtx-time-picker__number--selected", parseInt(N.textContent, 10) === y);
          }), l.textContent = String(y).padStart(2, "0");
        } else {
          let y = Math.round(L / 6) % 60;
          this._setMinute(y), A.style.transform = `rotate(${y * 6}deg)`;
          const N = Math.round(y / 5) * 5;
          h.querySelectorAll(".mtx-time-picker__number").forEach((T) => {
            T.classList.toggle("mtx-time-picker__number--selected", parseInt(T.textContent, 10) === N);
          }), d.textContent = String(y).padStart(2, "0");
        }
      }, R = () => {
        let D = 0, k = null;
        c ? (D = 200, k = () => {
          this._timeUnit = "minutes";
        }) : this._isRange && this._mode === "datetime" && this._activeTab === "time-start" && (D = 300, k = () => {
          this._activeTab = "time-end", this._timeUnit = "hours";
        }), k && (this._clearTimer(this._clockSwitchTimer), this._clockSwitchTimer = this._setTimer(() => {
          this._clockSwitchTimer = null, k(), this._renderCurrentView();
        }, D));
      }, U = (D) => {
        this._activeDragEnd && this._activeDragEnd(!1);
        const k = !!D.touches;
        k && D.cancelable && D.preventDefault(), A.classList.add("mtx-time-picker__hand--dragging"), M(D);
        const E = (T) => {
          k && T.cancelable && T.preventDefault(), M(T);
        }, H = k ? ["touchend", "touchcancel"] : ["mouseup"], L = k ? "touchmove" : "mousemove", y = k ? { passive: !1 } : void 0, N = (T) => {
          this._activeDragEnd === N && (this._activeDragEnd = null), A.classList.remove("mtx-time-picker__hand--dragging"), window.removeEventListener(L, E, y), H.forEach((j) => window.removeEventListener(j, N)), !(T === !1 || T && T.type === "touchcancel") && !this.destroyed && R();
        };
        this._activeDragEnd = N, window.addEventListener(L, E, y), H.forEach((T) => window.addEventListener(T, N));
      };
      h.addEventListener("mousedown", U), h.addEventListener("touchstart", U, { passive: !1 }), t.appendChild(h);
    }
    return t;
  }
  /**
   * Hora (0-23) y minuto activos según la pestaña (simple, inicio o fin de rango).
   * @private
   * @returns {{hour: number, minute: number}}
   */
  _getActiveTime() {
    if (this._isRange && this._mode === "datetime") {
      const t = this._activeTab === "time-end";
      return { hour: t ? this._endHour : this._startHour, minute: t ? this._endMinute : this._startMinute };
    }
    return { hour: this._selectedHour, minute: this._selectedMinute };
  }
  /**
   * Fija la hora en formato 24 h (teclado del reloj sin AM/PM).
   * @private
   * @param {number} hour24 Hora 0-23.
   */
  _setHour24(t) {
    const e = t >= 12 ? "PM" : "AM";
    this._isRange && this._mode === "datetime" ? this._activeTab === "time-end" ? this._endAmPm = e : this._startAmPm = e : this._selectedAmPm = e, this._setHour(t % 12 === 0 ? 12 : t % 12), this._isRange && this._mode === "datetime" || (this._selectedHour = t, this._selectedDate && this._selectedDate.setHours(t), this._applySelection());
  }
  /**
   * Teclado del reloj radial: flechas ±1, RePág/AvPág ±5 minutos, Inicio/Fin y Enter para pasar a minutos.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleClockKeyDown(t) {
    const e = this._timeUnit === "hours", i = this._isAmPmMode(), { hour: a, minute: s } = this._getActiveTime(), r = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (t.key === "Enter" || t.key === " ") {
      t.preventDefault(), e ? (this._timeUnit = "minutes", this._renderCurrentView()) : this._isRange && this._mode === "datetime" && this._activeTab === "time-start" && (this._activeTab = "time-end", this._timeUnit = "hours", this._renderCurrentView());
      return;
    }
    if (e) {
      const n = i ? 1 : 0, c = i ? 12 : 23;
      let o = i ? a % 12 || 12 : a;
      if (r[t.key] !== void 0) {
        const u = c - n + 1;
        o = (o - n + Math.sign(r[t.key]) + u) % u + n;
      } else if (t.key === "Home") o = n;
      else if (t.key === "End") o = c;
      else return;
      t.preventDefault(), i ? (this._setHour(o), this._isRange && this._mode === "datetime" || this._applySelection()) : this._setHour24(o);
    } else {
      let n = s;
      if (r[t.key] !== void 0) n = (s + r[t.key] + 60) % 60;
      else if (t.key === "Home") n = 0;
      else if (t.key === "End") n = 59;
      else return;
      t.preventDefault(), this._setMinute(n);
    }
    this._renderCurrentView();
  }
  /**
   * Renderiza la barra de acciones inferiores ("Hoy", "Cancelar", "Aceptar", o botón de alternancia Dial/Teclado).
   * @private
   */
  _renderActions() {
    const t = document.createElement("div");
    if (t.className = "mtx-picker-actions", this._mode === "time" || this._activeTab !== "date") {
      const e = this._timeInputMode === "input" || this._timeInputMode === "keyboard", i = document.createElement("button");
      i.type = "button", i.className = "mtx-picker-icon-btn", i.title = e ? this._t("switchToClock", null, "Switch to clock view") : this._t("switchToKeyboard", null, "Enter time with keyboard"), i.setAttribute("aria-label", i.title), i.setAttribute("data-focus-key", "time-view-toggle"), i.innerHTML = `<span class="material-icons" aria-hidden="true">${e ? "schedule" : "keyboard"}</span>`, i.addEventListener("click", (a) => {
        a.stopPropagation(), this._timeInputMode = e ? "dial" : "input", this._renderCurrentView();
      }), t.appendChild(i);
    } else {
      const e = document.createElement("button");
      e.className = "mtx-button mtx-button--text mtx-button--small", e.type = "button", e.textContent = this._todayText || this._t("today", null, "Today"), e.setAttribute("data-focus-key", "today"), e.addEventListener("click", (i) => {
        i.stopPropagation();
        const a = /* @__PURE__ */ new Date();
        this.setDate(a), !this._isStatic && this._mode !== "datetime" && this.close(!0);
      }), t.appendChild(e);
    }
    if (!this._isStatic) {
      const e = document.createElement("button");
      e.className = "mtx-button mtx-button--text mtx-button--small", e.type = "button", e.textContent = this._cancelText || this._t("cancel", null, "Cancel"), e.addEventListener("click", () => {
        this.close(!0);
      });
      const i = document.createElement("button");
      i.className = "mtx-button mtx-button--contained mtx-button--small", i.type = "button", i.textContent = this._okText || this._t("ok", null, "OK"), i.addEventListener("click", () => {
        this._applySelection(), this.close(!0);
      }), t.appendChild(e), t.appendChild(i);
    }
    this._container.appendChild(t);
  }
  /**
   * Selecciona un día del calendario.
   * @private
   */
  _selectDay(t, e, i) {
    if (this._isRange)
      if (this._rangeStep === "start" || !this._rangeStart || this._rangeStart && this._rangeEnd) {
        const a = this._mode === "datetime" ? this._startHour : 0, s = this._mode === "datetime" ? this._startMinute : 0, r = new Date(t, e, i, a, s);
        this._rangeStart = r, this._rangeEnd = null, this._rangeStep = "end", this._selectedDate = this._rangeStart, this._renderCurrentView();
        return;
      } else {
        const a = this._mode === "datetime" ? this._endHour : 0, s = this._mode === "datetime" ? this._endMinute : 0, r = new Date(t, e, i, a, s), n = new Date(t, e, i).getTime(), c = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime();
        if (n < c ? (this._rangeEnd = new Date(this._rangeStart), this._rangeStart = r, this._mode === "datetime" && (this._rangeStart.setHours(this._startHour, this._startMinute), this._rangeEnd.setHours(this._endHour, this._endMinute))) : this._rangeEnd = r, this._rangeStep = "start", this._selectedDate = this._rangeEnd, this._hoverDate = null, this._mode === "datetime") {
          this._activeTab = "time-start", this._timeUnit = "hours", this._currentView = this._timeInputMode === "dial" ? "clock-hours" : "digital-time", this._applySelection(), this._renderCurrentView();
          return;
        }
        this._applySelection(), !this._isStatic && this._displayMode !== "modal" ? this.close(!0) : this._renderCurrentView();
        return;
      }
    this._selectedDate ? this._selectedDate.setFullYear(t, e, i) : this._selectedDate = new Date(t, e, i, this._selectedHour, this._selectedMinute), this._mode === "datetime" ? (this._activeTab = "time", this._timeUnit = "hours", this._currentView = this._timeInputMode === "dial" ? "clock-hours" : "digital-time", this._renderCurrentView()) : (this._applySelection(), !this._isStatic && this._displayMode !== "modal" ? this.close(!0) : this._renderCurrentView());
  }
  /**
   * Modifica la hora seleccionada.
   * @private
   */
  _setHour(t) {
    if (this._isRange && this._mode === "datetime") {
      const i = this._activeTab === "time-end", a = i ? this._endAmPm : this._startAmPm;
      let s = t % 12;
      a === "PM" && (s += 12), i ? (this._endHour = s, this._rangeEnd && this._rangeEnd.setHours(s)) : (this._startHour = s, this._rangeStart && this._rangeStart.setHours(s)), this._applySelection();
      return;
    }
    let e = t % 12;
    this._selectedAmPm === "PM" && (e += 12), this._selectedHour = e, this._selectedDate && this._selectedDate.setHours(this._selectedHour);
  }
  /**
   * Modifica el minuto seleccionado.
   * @private
   */
  _setMinute(t) {
    if (this._isRange && this._mode === "datetime") {
      this._activeTab === "time-end" ? (this._endMinute = t, this._rangeEnd && this._rangeEnd.setMinutes(t)) : (this._startMinute = t, this._rangeStart && this._rangeStart.setMinutes(t)), this._applySelection();
      return;
    }
    this._selectedMinute = t, this._selectedDate && this._selectedDate.setMinutes(t), this._applySelection();
  }
  /**
   * Alterna el período AM/PM.
   * @private
   */
  _setAmPm(t) {
    if (this._isRange && this._mode === "datetime") {
      if (this._activeTab === "time-end") {
        if (this._endAmPm === t) return;
        this._endAmPm = t, t === "PM" && this._endHour < 12 ? this._endHour += 12 : t === "AM" && this._endHour >= 12 && (this._endHour -= 12), this._rangeEnd && this._rangeEnd.setHours(this._endHour);
      } else {
        if (this._startAmPm === t) return;
        this._startAmPm = t, t === "PM" && this._startHour < 12 ? this._startHour += 12 : t === "AM" && this._startHour >= 12 && (this._startHour -= 12), this._rangeStart && this._rangeStart.setHours(this._startHour);
      }
      this._applySelection();
      return;
    }
    this._selectedAmPm !== t && (this._selectedAmPm = t, t === "PM" && this._selectedHour < 12 ? this._selectedHour += 12 : t === "AM" && this._selectedHour >= 12 && (this._selectedHour -= 12), this._selectedDate && (this._selectedDate.setHours(this._selectedHour), this._applySelection()));
  }
  /**
   * Aplica la selección actual al campo de texto y dispara los eventos correspondientes.
   * @private
   */
  _applySelection() {
    this._isInternalChange = !0;
    try {
      let t = "";
      if (this._isRange) {
        this._mode === "datetime" && (this._rangeStart && this._rangeStart.setHours(this._startHour, this._startMinute, 0, 0), this._rangeEnd && this._rangeEnd.setHours(this._endHour, this._endMinute, 0, 0));
        const i = this._rangeStart ? this._formatDate(this._rangeStart) : "", a = this._rangeEnd ? this._formatDate(this._rangeEnd) : "";
        i && a ? t = `${i}${this._rangeSeparator}${a}` : i && (t = i);
      } else
        this._selectedDate || (this._selectedDate = /* @__PURE__ */ new Date(), this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0)), t = this._formatDate(this._selectedDate);
      const e = {
        isRange: this._isRange,
        date: this._selectedDate ? new Date(this._selectedDate) : null,
        dateTime: this._selectedDate ? new Date(this._selectedDate) : null,
        startDate: this._rangeStart ? new Date(this._rangeStart) : null,
        endDate: this._rangeEnd ? new Date(this._rangeEnd) : null,
        range: {
          start: this._rangeStart ? new Date(this._rangeStart) : null,
          end: this._rangeEnd ? new Date(this._rangeEnd) : null
        },
        time: this.getTime(),
        value: t,
        iso: this.getISOString(),
        picker: this
      };
      this.input && (this.input.value = t, this.input.dispatchEvent(new Event("input", { bubbles: !0 })), this.input.dispatchEvent(new Event("change", { bubbles: !0 })), this._syncFieldState(), this._syncToggleButton()), this._emitChange(e);
    } finally {
      this._isInternalChange = !1;
    }
  }
  /**
   * Emite una única vez `mtx:date-time-picker:change` (y el alias deprecado `mtx:change`).
   * Se despacha en el `<input>` (burbujea al contenedor) o en el contenedor en modo estático.
   * @private
   * @param {object} detail Datos de la selección.
   */
  _emitChange(t) {
    I(this.input || this.element, "mtx:date-time-picker:change", t, { aliases: ["mtx:change"] });
  }
  /**
   * Determina si una fecha está fuera del rango min/max permitido.
   * @private
   */
  _isDateDisabled(t) {
    const e = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
    if (this._minDate) {
      const i = new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate()).getTime();
      if (e < i) return !0;
    }
    if (this._maxDate) {
      const i = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate()).getTime();
      if (e > i) return !0;
    }
    return !1;
  }
  /**
   * Parsea una entrada (Date, timestamp o texto) a Date. Admite ISO `YYYY-MM-DD[THH:mm]`,
   * el formato activo (orden DD/MM o MM/DD según locale/`data-format`) y horas `HH:mm [AM|PM]`.
   *
   * @param {Date|number|string} str Valor a parsear.
   * @returns {Date|null} Objeto Date nativo válido o null.
   * @private
   */
  _parseDate(t) {
    if (t instanceof Date)
      return isNaN(t.getTime()) ? null : new Date(t);
    if (typeof t == "number") {
      const o = new Date(t);
      return isNaN(o.getTime()) ? null : o;
    }
    if (!t || typeof t != "string") return null;
    const e = t.trim();
    if (!e) return null;
    if (/^(today|hoy|now|ahora)$/i.test(e))
      return /* @__PURE__ */ new Date();
    const i = (o) => {
      const u = e.match(/\b(a|p)\.?\s?m?\.?$/i) || e.match(/(am|pm)$/i);
      if (!u) return o;
      const _ = u[0].toLowerCase().startsWith("p");
      return _ && o < 12 ? o + 12 : !_ && o === 12 ? 0 : o;
    }, a = (o, u, _, p = 0, l = 0, d = 0) => {
      const g = new Date(o, u, _, p, l, d);
      return isNaN(g.getTime()) || g.getFullYear() !== o || g.getMonth() !== u || g.getDate() !== _ ? null : g;
    }, s = (o) => {
      const u = (o || "").match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      return u ? [i(parseInt(u[1], 10)), parseInt(u[2], 10), u[3] ? parseInt(u[3], 10) : 0] : [0, 0, 0];
    }, r = e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
    if (r) {
      const [o, u, _] = s(r[4]);
      return a(parseInt(r[1], 10), parseInt(r[2], 10) - 1, parseInt(r[3], 10), o, u, _);
    }
    const n = e.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})(?:[\sT]+(.*))?$/);
    if (n) {
      const o = /^\d{4}$/.test(n[1]) ? ["YYYY", "MM", "DD"] : this._getDateOrder(), u = {};
      o.forEach((h, m) => {
        u[h] = parseInt(n[m + 1], 10);
      });
      let _ = u.YYYY;
      n[o.indexOf("YYYY") + 1].length <= 2 && (_ += 2e3);
      let p = u.MM, l = u.DD;
      p > 12 && l <= 12 && ([p, l] = [l, p]);
      const [d, g, b] = s(n[4]);
      return a(_, p - 1, l, d, g, b);
    }
    if (/^\d{1,2}:\d{2}/.test(e)) {
      const [o, u, _] = s(e);
      if (o > 23 || u > 59) return null;
      const p = /* @__PURE__ */ new Date();
      return p.setHours(o, u, _, 0), p;
    }
    const c = new Date(e);
    return isNaN(c.getTime()) ? null : c;
  }
  /**
   * Formatea un objeto Date según el formato configurado o uno personalizado.
   *
   * @param {Date} date Objeto Date a formatear.
   * @param {string} [customFormat] Patrón opcional alternativo.
   * @returns {string} Cadena formateada.
   * @private
   */
  _formatDate(t, e = null) {
    if (!t || isNaN(t.getTime())) return "";
    const i = String(t.getDate()).padStart(2, "0"), a = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getFullYear()), r = s.slice(-2), n = t.getHours(), c = String(n).padStart(2, "0");
    let o = n % 12;
    o === 0 && (o = 12);
    const u = String(o).padStart(2, "0"), _ = String(t.getMinutes()).padStart(2, "0"), p = String(t.getSeconds()).padStart(2, "0"), l = n >= 12 ? "PM" : "AM", d = n >= 12 ? "pm" : "am";
    return (e || this._format).replace(/YYYY|AAAA/g, s).replace(/YY|AA(?!$|[ -])/g, r).replace(/MM/g, a).replace(/DD/g, i).replace(/HH/g, c).replace(/hh/g, u).replace(/mm/g, _).replace(/ss/g, p).replace(new RegExp("\\bA\\b|(?<=\\s|^)A(?=\\s|$)|AM|PM|(?<=\\d|\\s)AA(?=\\s|$)", "g"), l).replace(new RegExp("\\ba\\b|(?<=\\s|^)a(?=\\s|$)|am|pm|(?<=\\d|\\s)aa(?=\\s|$)", "g"), d);
  }
  // =========================================================================
  // API Pública (Obtener e Insertar Fecha / Fecha y Hora)
  // =========================================================================
  /**
   * Obtiene la fecha seleccionada.
   *
   * @param {string|boolean} [format=false] Si es true o un patrón (ej. 'YYYY-MM-DD'),
   *                                        retorna la cadena formateada. Si es 'iso',
   *                                        retorna cadena ISO 8601. Si es false/omitido,
   *                                        retorna una copia del objeto Date nativo.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDate(t = !1) {
    return this._selectedDate ? t === !0 ? this._formatDate(this._selectedDate, this._mode === "datetime" ? this._getDatePattern() : null) : typeof t == "string" && t ? t.toLowerCase() === "iso" ? this.getISOString() : this._formatDate(this._selectedDate, t) : new Date(this._selectedDate) : null;
  }
  /**
   * Obtiene la fecha y hora seleccionada como objeto Date o cadena formateada.
   *
   * @param {string|boolean} [format=false] Si es true, retorna fecha y hora con el orden del locale
   *                                        (p. ej. 'MM/DD/YYYY HH:mm' en inglés, 'DD/MM/YYYY HH:mm' en español).
   *                                        Si es 'iso', retorna formato ISO 8601.
   *                                        Si se omite o es false, retorna el objeto Date.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDateTime(t = !1) {
    return this._selectedDate ? t === !0 ? this._formatDate(this._selectedDate, `${this._getDatePattern()} ${this._isAmPmMode() ? "hh:mm A" : "HH:mm"}`) : typeof t == "string" && t ? t.toLowerCase() === "iso" ? this.getISOString() : this._formatDate(this._selectedDate, t) : new Date(this._selectedDate) : null;
  }
  /**
   * Obtiene la hora seleccionada como cadena ('HH:mm') o como objeto { hours, minutes }.
   *
   * @param {boolean} [asObject=false] Si es true, retorna { hours, minutes }.
   * @returns {string|{hours: number, minutes: number}|null} Hora formateada o desglose.
   */
  getTime(t = !1) {
    const e = this._isAmPmMode();
    if (this._isRange) {
      if (e) {
        let o = this._startHour % 12;
        o === 0 && (o = 12);
        let u = this._endHour % 12;
        u === 0 && (u = 12);
        const _ = String(o).padStart(2, "0"), p = String(this._startMinute).padStart(2, "0"), l = String(u).padStart(2, "0"), d = String(this._endMinute).padStart(2, "0");
        return t ? {
          start: { hours: this._startHour, minutes: this._startMinute, ampm: this._startAmPm },
          end: { hours: this._endHour, minutes: this._endMinute, ampm: this._endAmPm }
        } : `${_}:${p} ${this._startAmPm} - ${l}:${d} ${this._endAmPm}`;
      }
      const s = String(this._startHour).padStart(2, "0"), r = String(this._startMinute).padStart(2, "0"), n = String(this._endHour).padStart(2, "0"), c = String(this._endMinute).padStart(2, "0");
      return t ? {
        start: { hours: this._startHour, minutes: this._startMinute },
        end: { hours: this._endHour, minutes: this._endMinute }
      } : `${s}:${r} - ${n}:${c}`;
    }
    if (!this._selectedDate && !this._selectedHour) return null;
    if (t)
      return e ? { hours: this._selectedHour, minutes: this._selectedMinute, ampm: this._selectedAmPm } : { hours: this._selectedHour, minutes: this._selectedMinute };
    if (e) {
      let s = this._selectedHour % 12;
      s === 0 && (s = 12);
      const r = String(s).padStart(2, "0"), n = String(this._selectedMinute).padStart(2, "0");
      return `${r}:${n} ${this._selectedAmPm}`;
    }
    const i = String(this._selectedHour).padStart(2, "0"), a = String(this._selectedMinute).padStart(2, "0");
    return `${i}:${a}`;
  }
  /**
   * Obtiene la fecha seleccionada en formato ISO 8601 estándar (UTC).
   *
   * @returns {string|null} Cadena ISO o null si no hay fecha seleccionada.
   */
  getISOString() {
    return this._selectedDate ? this._selectedDate.toISOString() : null;
  }
  /**
   * Obtiene el valor textual actual mostrado en el campo de texto.
   *
   * @returns {string} Valor formateado actual.
   */
  getValue() {
    return this.value;
  }
  /**
   * Inserta o establece programáticamente una fecha (y hora opcional).
   * Admite objetos Date nativos, strings (ISO, local) o timestamps numéricos.
   *
   * @param {Date|string|number|null} date Nueva fecha a asignar.
   * @returns {DateTimePicker} La instancia para permitir encadenamiento.
   */
  setDate(t) {
    if (t == null || t === "")
      return this.clear(), this;
    const e = this._parseDate(t);
    return !e || isNaN(e.getTime()) ? this : (this._selectedDate = e, this._viewDate = new Date(e), this._selectedHour = e.getHours(), this._selectedMinute = e.getMinutes(), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._applySelection(), this._container && this._renderCurrentView(), this);
  }
  /**
   * Inserta o establece programáticamente la fecha y hora completa.
   * Alias explícito de setDate para flujos de DateTimePicker.
   *
   * @param {Date|string|number|null} dateTime Fecha y hora a asignar.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setDateTime(t) {
    return this.setDate(t);
  }
  /**
   * Modifica o inserta únicamente la hora en la selección actual.
   *
   * @param {string|{hours?: number, minutes?: number}|Date} time Hora en formato 'HH:mm', objeto o Date.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setTime(t) {
    if (!t) return this;
    let e = 0, i = 0;
    if (t instanceof Date)
      e = t.getHours(), i = t.getMinutes();
    else if (typeof t == "string") {
      const a = t.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
      if (a) {
        e = parseInt(a[1], 10), i = parseInt(a[2], 10);
        const s = a[3];
        s && (s.toUpperCase() === "PM" && e < 12 ? e += 12 : s.toUpperCase() === "AM" && e === 12 && (e = 0));
      }
    } else typeof t == "object" && (e = parseInt(t.hours ?? t.hour ?? 0, 10), i = parseInt(t.minutes ?? t.minute ?? 0, 10));
    return this._selectedHour = Math.max(0, Math.min(23, e)), this._selectedMinute = Math.max(0, Math.min(59, i)), this._selectedAmPm = this._selectedHour >= 12 ? "PM" : "AM", this._selectedDate || (this._selectedDate = /* @__PURE__ */ new Date()), this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0), this._applySelection(), this._container && this._renderCurrentView(), this;
  }
  /**
   * Inserta o establece el valor textual actual en el campo.
   *
   * @param {string|Date|number} val Cadena formateada o fecha.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setValue(t) {
    return this.setDate(t);
  }
  /**
   * Propiedad getter para la fecha seleccionada.
   *
   * @returns {Date|null}
   */
  get date() {
    return this.getDate();
  }
  /**
   * Propiedad setter para la fecha seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set date(t) {
    this.setDate(t);
  }
  /**
   * Propiedad getter para la fecha y hora seleccionada.
   *
   * @returns {Date|null}
   */
  get dateTime() {
    return this.getDateTime();
  }
  /**
   * Propiedad setter para la fecha y hora seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set dateTime(t) {
    this.setDateTime(t);
  }
  /**
   * Propiedad getter para la hora en formato 'HH:mm'.
   *
   * @returns {string|null}
   */
  get time() {
    return this.getTime();
  }
  /**
   * Propiedad setter para la hora.
   *
   * @param {string|object|Date} val
   */
  set time(t) {
    this.setTime(t);
  }
  /**
   * Propiedad getter para la cadena ISO 8601.
   *
   * @returns {string|null}
   */
  get isoString() {
    return this.getISOString();
  }
  /**
   * Propiedad getter para el valor textual del campo.
   *
   * @returns {string}
   */
  get value() {
    return this.input ? this.input.value : this._selectedDate ? this._formatDate(this._selectedDate) : "";
  }
  /**
   * Propiedad setter para el valor textual o fecha.
   *
   * @param {string|Date|number} val
   */
  set value(t) {
    this.setDate(t);
  }
  /**
   * Obtiene el rango de fechas seleccionado.
   *
   * @param {string|boolean} [format=false] Si es true, retorna valores formateados.
   *                                        Si es 'iso', retorna cadenas ISO 8601.
   *                                        Si es false/omitido, retorna objetos Date nativos.
   * @returns {{start: Date|string|null, end: Date|string|null, value?: string}}
   */
  getRange(t = !1) {
    if (t === !0) {
      const e = this._rangeStart ? this._formatDate(this._rangeStart) : null, i = this._rangeEnd ? this._formatDate(this._rangeEnd) : null;
      return {
        start: e,
        end: i,
        value: e && i ? `${e}${this._rangeSeparator}${i}` : e || ""
      };
    }
    return typeof t == "string" && t.toLowerCase() === "iso" ? {
      start: this._rangeStart ? this._rangeStart.toISOString() : null,
      end: this._rangeEnd ? this._rangeEnd.toISOString() : null
    } : {
      start: this._rangeStart ? new Date(this._rangeStart) : null,
      end: this._rangeEnd ? new Date(this._rangeEnd) : null
    };
  }
  /**
   * Inserta o establece programáticamente un rango de fechas.
   *
   * @param {Date|string|number|null|{start?: any, end?: any}} start Fecha inicial, cadena u objeto con { start, end }.
   * @param {Date|string|number|null} [end=null] Fecha final o cadena.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setRange(t, e = null) {
    if (!t && !e)
      return this._rangeStart = null, this._rangeEnd = null, this.clear(), this;
    t && typeof t == "object" && !(t instanceof Date) && ("start" in t || "end" in t) && (e = t.end, t = t.start);
    const i = this._parseDate(t), a = e ? this._parseDate(e) : null;
    return i && a && i.getTime() > a.getTime() ? (this._rangeStart = a, this._rangeEnd = i) : (this._rangeStart = i, this._rangeEnd = a), this._rangeStart && (this._startHour = this._rangeStart.getHours(), this._startMinute = this._rangeStart.getMinutes(), this._startAmPm = this._startHour >= 12 ? "PM" : "AM"), this._rangeEnd && (this._endHour = this._rangeEnd.getHours(), this._endMinute = this._rangeEnd.getMinutes(), this._endAmPm = this._endHour >= 12 ? "PM" : "AM"), this._selectedDate = this._rangeStart || this._rangeEnd, this._selectedDate && (this._viewDate = new Date(this._selectedDate)), this._applySelection(), this._container && this._renderCurrentView(), this;
  }
  /**
   * Propiedad getter para el rango.
   *
   * @returns {{start: Date|null, end: Date|null}}
   */
  get range() {
    return this.getRange();
  }
  /**
   * Propiedad setter para el rango.
   *
   * @param {{start: Date|string|null, end: Date|string|null}} val
   */
  set range(t) {
    t && typeof t == "object" && this.setRange(t.start, t.end);
  }
  /**
   * Indica si el picker opera en modo de selección de rango.
   *
   * @returns {boolean}
   */
  get isRange() {
    return this._isRange;
  }
  /**
   * Limpia la fecha seleccionada y vacía el campo de texto.
   *
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  clear() {
    return this._selectedDate = null, this._rangeStart = null, this._rangeEnd = null, this._rangeStep = "start", this._hoverDate = null, this.input && (this.input.value = "", this.input.dispatchEvent(new Event("input", { bubbles: !0 })), this.input.dispatchEvent(new Event("change", { bubbles: !0 })), this._syncFieldState(), this._syncToggleButton()), this._emitChange({
      isRange: this._isRange,
      date: null,
      dateTime: null,
      startDate: null,
      endDate: null,
      range: { start: null, end: null },
      time: null,
      value: "",
      iso: null,
      picker: this
    }), this._container && this._renderCurrentView(), this;
  }
};
/** @type {DateTimePicker|null} Referencia al selector actualmente abierto en la página */
q(S, "_activePicker", null);
let C = S;
P("date-time-picker", C);
P("datetime-picker", C);
P("datetimepicker", C);
P("date-picker", C);
P("datepicker", C);
P("time-picker", C);
P("timepicker", C);
P("date-range-picker", C);
P("daterangepicker", C);
P("datetime-range-picker", C);
P("datetimerangepicker", C);
ct();
export {
  C as DatePicker,
  C as DateRangePicker,
  C as DateTimePicker,
  C as DateTimeRangePicker,
  C as TimePicker
};
