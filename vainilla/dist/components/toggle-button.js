import "./toggle-button.css";
import { r as h, C as g, d as v, g as b, j as d, o as A, q as x } from "../chunks/core-CJdkPtZx.js";
const _ = ["small", "medium", "large"], y = ["standard", "primary", "secondary", "error", "warning", "info", "success"], f = '.mtx-toggle-button-group, [data-mtx="toggle-button-group"]', c = 'button, [data-mtx="toggle-button"], .mtx-toggle-button', o = (r, t) => r.hasAttribute(t) && r.getAttribute(t) !== "false";
function p(r, t, e) {
  _.includes(t) && t !== "medium" && r.classList.add(`mtx-toggle-button--${t}`), y.includes(e) && e !== "standard" && r.classList.add(`mtx-toggle-button--${e}`);
}
class E extends g {
  /**
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-toggle-button"), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button"), p(t, t.getAttribute("data-size"), t.getAttribute("data-color"));
    const e = t.getAttribute("data-icon");
    if (e && !t.querySelector(".material-icons, .material-symbols-outlined, svg")) {
      const i = document.createElement("span");
      i.className = "material-icons mtx-toggle-button__icon", i.setAttribute("aria-hidden", "true"), i.textContent = e, t.insertBefore(i, t.firstChild);
    }
    const a = o(t, "data-selected") || t.classList.contains("mtx-toggle-button--selected") || t.getAttribute("aria-pressed") === "true";
    t.classList.remove("mtx-toggle-button--selected"), this._setPressed(a), o(t, "data-disabled") && this.disable(), this._handlePointerDown = (i) => {
      this.disabled || i.button !== 0 || v(t, i);
    }, this._handleClick = () => {
      this.disabled || this.group || (this._setPressed(!this.selected), b(t, "mtx:toggle-button:change", { selected: this.selected, value: this.value }));
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("click", this._handleClick);
  }
  /** @returns {HTMLElement|null} Contenedor del grupo, si existe. */
  get group() {
    const t = this.element.parentElement;
    return t ? t.closest(f) : null;
  }
  /** @returns {string} Valor del botón (`data-value`, `value` o texto). */
  get value() {
    return this.element.getAttribute("data-value") ?? (this.element.getAttribute("value") || this.element.textContent.trim());
  }
  /** @returns {boolean} `true` si está seleccionado (`aria-pressed="true"`). */
  get selected() {
    return this.element.getAttribute("aria-pressed") === "true";
  }
  /**
   * Fija el estado seleccionado sin emitir eventos.
   * @param {boolean} value Nuevo estado.
   */
  set selected(t) {
    this._setPressed(!!t);
  }
  /**
   * Alterna el estado seleccionado sin emitir eventos.
   * @returns {boolean} Nuevo estado.
   */
  toggle() {
    return this._setPressed(!this.selected), this.selected;
  }
  /** @returns {boolean} `true` si está deshabilitado (`disabled` o `aria-disabled`). */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el botón. */
  disable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !0 : this.element.setAttribute("aria-disabled", "true");
  }
  /** Habilita el botón. */
  enable() {
    this.element.tagName === "BUTTON" && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled");
  }
  /** Enfoca el botón. */
  focus() {
    this.element.focus();
  }
  /**
   * @private
   * @param {boolean} pressed Estado.
   */
  _setPressed(t) {
    this.element.setAttribute("aria-pressed", String(t));
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class L extends g {
  /**
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-toggle-button-group"), t.hasAttribute("role") || t.setAttribute("role", "group");
    const e = t.getAttribute("data-label");
    e && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", e), this.exclusive = o(t, "data-exclusive") || t.classList.contains("mtx-toggle-button-group--exclusive"), this.enforceValueSet = o(t, "data-enforce-value-set"), this.orientation = t.getAttribute("data-orientation") === "vertical" || t.classList.contains("mtx-toggle-button-group--vertical") ? "vertical" : "horizontal", t.classList.toggle("mtx-toggle-button-group--vertical", this.orientation === "vertical"), o(t, "data-full-width") && t.classList.add("mtx-toggle-button-group--full-width");
    const a = t.getAttribute("data-size"), i = t.getAttribute("data-color");
    this._buttonElements().forEach((s) => {
      a && !s.hasAttribute("data-size") && s.setAttribute("data-size", a), i && !s.hasAttribute("data-color") && s.setAttribute("data-color", i), s.hasAttribute("data-mtx") || s.setAttribute("data-mtx", "toggle-button"), d(s) ? p(s, s.getAttribute("data-size"), s.getAttribute("data-color")) : A(s, "toggle-button");
    }), t.hasAttribute("data-value") ? this.value = this._parseValue(t.getAttribute("data-value")) : this.exclusive && (this.value = this.value), o(t, "data-disabled") && this.disable(), this._handleClick = (s) => this._onClick(s), this._handleKeyDown = (s) => this._onKeyDown(s), t.addEventListener("click", this._handleClick), t.addEventListener("keydown", this._handleKeyDown);
  }
  /**
   * @private
   * @returns {HTMLElement[]} Botones que pertenecen a este grupo (no a grupos anidados).
   */
  _buttonElements() {
    return Array.from(this.element.querySelectorAll(c)).filter((t) => t.parentElement && t.parentElement.closest(f) === this.element);
  }
  /** @returns {ToggleButton[]} Instancias de los botones del grupo. */
  get buttons() {
    return this._buttonElements().map((t) => d(t)).filter(Boolean);
  }
  /**
   * @private
   * @param {string} raw Valor declarativo (lista separada por comas en modo múltiple).
   * @returns {string|string[]|null} Valor normalizado.
   */
  _parseValue(t) {
    return this.exclusive ? t === "" ? null : t : t.split(",").map((e) => e.trim()).filter(Boolean);
  }
  /**
   * Valor actual: `string|null` en modo exclusivo; `string[]` (orden del DOM) en modo múltiple.
   * @returns {string|string[]|null} Valor.
   */
  get value() {
    const t = this.buttons.filter((e) => e.selected).map((e) => e.value);
    return this.exclusive ? t[0] ?? null : t;
  }
  /**
   * Fija el valor sin emitir eventos.
   * @param {string|string[]|null} val Valor (string, array o `null`).
   */
  set value(t) {
    let e;
    t == null || t === "" ? e = [] : e = (Array.isArray(t) ? t : [t]).map(String), this.exclusive && (e = e.slice(0, 1));
    let a = !1;
    this.buttons.forEach((i) => {
      const s = e.includes(i.value) && !(this.exclusive && a);
      s && (a = !0), i.selected = s;
    });
  }
  /**
   * @private
   * @param {MouseEvent} event Clic delegado.
   */
  _onClick(t) {
    const e = t.target.closest ? t.target.closest(c) : null;
    if (!e || !this._buttonElements().includes(e)) return;
    const a = d(e);
    if (!a || a.disabled) return;
    const i = this.value;
    let s;
    if (this.exclusive) {
      if (s = i === a.value ? null : a.value, s === null && this.enforceValueSet) return;
    } else if (s = i.includes(a.value) ? i.filter((n) => n !== a.value) : [...i, a.value], s.length === 0 && this.enforceValueSet) return;
    this.value = s, b(this.element, "mtx:toggle-button-group:change", { value: this.value });
  }
  /**
   * Flechas, Inicio y Fin mueven el foco entre los botones habilitados.
   * @private
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    const e = this.buttons.filter((u) => !u.disabled).map((u) => u.element), a = e.indexOf(t.target);
    if (a === -1) return;
    const i = this.orientation === "vertical", s = getComputedStyle(this.element).direction === "rtl", n = i ? "ArrowDown" : s ? "ArrowLeft" : "ArrowRight", m = i ? "ArrowUp" : s ? "ArrowRight" : "ArrowLeft";
    let l = null;
    t.key === n ? l = e[(a + 1) % e.length] : t.key === m ? l = e[(a - 1 + e.length) % e.length] : t.key === "Home" ? l = e[0] : t.key === "End" && (l = e[e.length - 1]), l && (t.preventDefault(), l.focus());
  }
  /** @returns {boolean} `true` si todos los botones están deshabilitados. */
  get disabled() {
    const t = this.buttons;
    return t.length > 0 && t.every((e) => e.disabled);
  }
  /** Deshabilita todos los botones del grupo. */
  disable() {
    this.buttons.forEach((t) => t.disable()), this.element.setAttribute("aria-disabled", "true");
  }
  /** Habilita todos los botones del grupo. */
  enable() {
    this.buttons.forEach((t) => t.enable()), this.element.removeAttribute("aria-disabled");
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), this.element.removeEventListener("keydown", this._handleKeyDown), super.destroy();
  }
}
h("toggle-button", E);
h("toggle-button-group", L);
x();
export {
  E as ToggleButton,
  L as ToggleButtonGroup
};
