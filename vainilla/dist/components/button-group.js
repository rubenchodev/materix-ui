import "./progress.css";
import "./button.css";
import "./button-group.css";
import { r as c, C as f, j as n, o as m, q as g } from "../chunks/core-CJdkPtZx.js";
const o = ["contained", "outlined", "text"], u = ["small", "medium", "large"], b = ["primary", "secondary", "error", "warning", "info", "success", "inherit"], p = ["first", "middle", "last"];
function d(r, t) {
  return r.hasAttribute(t) && r.getAttribute(t) !== "false";
}
class x extends f {
  /**
   * Crea la instancia, aplica la semántica de grupo y prepara los botones.
   *
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t);
    const i = t.getAttribute("data-variant");
    this.variant = o.includes(i) ? i : o.find((h) => t.classList.contains(`mtx-button-group--${h}`)) || "outlined";
    const s = t.getAttribute("data-size");
    this.size = u.includes(s) ? s : "medium";
    const e = t.getAttribute("data-color");
    this.color = b.includes(e) ? e : "primary", this.orientation = t.getAttribute("data-orientation") === "vertical" || t.classList.contains("mtx-button-group--vertical") ? "vertical" : "horizontal", this._disabledByGroup = /* @__PURE__ */ new WeakSet();
    const { classList: a } = t;
    a.add("mtx-button-group", `mtx-button-group--${this.variant}`, `mtx-button-group--${this.orientation}`), this.color !== "primary" && a.add(`mtx-button-group--${this.color}`), this.size !== "medium" && a.add(`mtx-button-group--${this.size}`), d(t, "data-full-width") && a.add("mtx-button-group--full-width"), d(t, "data-disable-elevation") && a.add("mtx-button-group--disable-elevation"), !t.hasAttribute("role") && t.tagName.toLowerCase() !== "fieldset" && t.setAttribute("role", "group");
    const l = t.getAttribute("data-label");
    l && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", l), this.orientation === "vertical" && t.getAttribute("role") === "toolbar" && t.setAttribute("aria-orientation", "vertical"), this.refresh(), d(t, "data-disabled") && this.disable();
  }
  /** @returns {HTMLElement[]} Botones directos del grupo. */
  get buttons() {
    return Array.from(this.element.children).filter((t) => t.matches('button, a, .mtx-button, [data-mtx="button"]'));
  }
  /**
   * Prepara los hijos (clases heredadas, Button, posición). Llamar tras añadir o quitar botones.
   *
   * @returns {this} La instancia.
   */
  refresh() {
    const t = this.buttons;
    return t.forEach((i, s) => {
      this._prepareButton(i);
      let e = "middle";
      s === 0 && (e = "first"), s === t.length - 1 && (e = t.length === 1 ? "first" : "last"), p.forEach((a) => i.classList.toggle(`mtx-button-group__${a}`, a === e)), t.length === 1 && i.classList.add("mtx-button-group__last"), this.isDisabled && !i.disabled && i.getAttribute("aria-disabled") !== "true" && this._setButtonDisabled(i, !0);
    }), this;
  }
  /**
   * Aplica al hijo la variante/tamaño/color del grupo si no declara los suyos e inicializa Button.
   * @param {HTMLElement} button Botón hijo.
   */
  _prepareButton(t) {
    const { classList: i } = t;
    i.add("mtx-button", "mtx-button-group__grouped"), o.some((s) => i.contains(`mtx-button--${s}`)) || i.add(`mtx-button--${this.variant}`), !t.hasAttribute("data-size") && !u.some((s) => i.contains(`mtx-button--${s}`)) && this.size !== "medium" && i.add(`mtx-button--${this.size}`), !t.hasAttribute("data-color") && this.color !== "primary" && !b.some((s) => i.contains(`mtx-button--${s}`)) && i.add(`mtx-button--${this.color}`), this.element.classList.contains("mtx-button-group--disable-elevation") && i.add("mtx-button--disable-elevation"), this.element.classList.contains("mtx-button-group--full-width") && i.add("mtx-button--full-width"), t.tagName.toLowerCase() === "button" && !t.hasAttribute("type") && (t.type = "button"), t.hasAttribute("data-mtx") || t.setAttribute("data-mtx", "button"), t.getAttribute("data-mtx") === "button" && !n(t) && m(t);
  }
  /**
   * Deshabilita o habilita un botón usando su instancia Button si existe.
   * @param {HTMLElement} button Botón.
   * @param {boolean} disabled Nuevo estado.
   */
  _setButtonDisabled(t, i) {
    const s = n(t);
    i ? (this._disabledByGroup.add(t), s && typeof s.disable == "function" ? s.disable() : "disabled" in t ? t.disabled = !0 : t.setAttribute("aria-disabled", "true")) : (this._disabledByGroup.delete(t), s && typeof s.enable == "function" ? s.enable() : "disabled" in t ? t.disabled = !1 : t.removeAttribute("aria-disabled"));
  }
  /** @returns {boolean} `true` si el grupo está deshabilitado. */
  get isDisabled() {
    return this.element.classList.contains("mtx-button-group--disabled");
  }
  /** @returns {boolean} Alias de `isDisabled` (compatibilidad con ComponentBase). */
  get disabled() {
    return this.isDisabled;
  }
  /**
   * Deshabilita todos los botones del grupo (recuerda los que ya lo estaban).
   *
   * @returns {this} La instancia.
   */
  disable() {
    return this.element.classList.add("mtx-button-group--disabled"), this.element.setAttribute("aria-disabled", "true"), this.buttons.forEach((t) => {
      t.disabled === !0 || t.getAttribute("aria-disabled") === "true" || this._setButtonDisabled(t, !0);
    }), this;
  }
  /**
   * Habilita los botones que deshabilitó el grupo.
   *
   * @returns {this} La instancia.
   */
  enable() {
    return this.element.classList.remove("mtx-button-group--disabled"), this.element.removeAttribute("aria-disabled"), this.buttons.forEach((t) => {
      this._disabledByGroup.has(t) && this._setButtonDisabled(t, !1);
    }), this;
  }
}
c("button-group", x);
g();
export {
  x as ButtonGroup
};
