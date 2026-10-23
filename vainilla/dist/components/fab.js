import "./fab.css";
import { r as n, C as d, d as o, q as l } from "../chunks/core-CJdkPtZx.js";
class c extends d {
  /**
   * Crea una instancia del FAB.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(t) {
    super(t), this.element.classList.add("mtx-fab"), this._isLink = t.tagName.toLowerCase() === "a";
    const s = t.getAttribute("data-size");
    s && (this.size = s);
    const a = t.getAttribute("data-color");
    a && (this.color = a), t.getAttribute("data-variant") === "extended" && this.element.classList.add("mtx-fab--extended");
    const r = t.getAttribute("data-icon"), i = t.getAttribute("data-label");
    if (i && this.element.classList.add("mtx-fab--extended"), r && !t.querySelector(".material-icons") && !t.querySelector("svg")) {
      const e = document.createElement("span");
      e.className = "material-icons", e.setAttribute("aria-hidden", "true"), e.textContent = r, t.insertBefore(e, t.firstChild);
    }
    if (i && !t.querySelector("span:not(.material-icons)")) {
      const e = document.createElement("span");
      e.textContent = i, t.appendChild(e);
    }
    this._handlePointerDown = (e) => {
      this.disabled || e.button !== 0 || o(t, e);
    }, t.addEventListener("pointerdown", this._handlePointerDown), this._isLink && (this._handleClick = (e) => {
      this.disabled && (e.preventDefault(), e.stopPropagation());
    }, t.addEventListener("click", this._handleClick));
  }
  /**
   * Indica si el FAB está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el FAB.
   */
  disable() {
    this.element.disabled !== void 0 ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el FAB.
   */
  enable() {
    this.element.disabled !== void 0 ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /** @returns {string} Tamaño del FAB (`small`, `medium`, `large`). */
  get size() {
    return this._size || "large";
  }
  /** @param {string} value Nuevo tamaño. */
  set size(t) {
    this._size = t, this.element.classList.remove("mtx-fab--small", "mtx-fab--medium", "mtx-fab--large"), t && t !== "large" && this.element.classList.add(`mtx-fab--${t}`);
  }
  /** @returns {string} Color del FAB. */
  get color() {
    return this._color || "primary";
  }
  /** @param {string} value Nuevo color. */
  set color(t) {
    this._color = t, this.element.classList.remove(
      "mtx-fab--primary",
      "mtx-fab--secondary",
      "mtx-fab--default",
      "mtx-fab--error",
      "mtx-fab--warning",
      "mtx-fab--info",
      "mtx-fab--success",
      "mtx-fab--inherit"
    ), t && t !== "primary" && this.element.classList.add(`mtx-fab--${t}`);
  }
  /**
   * Destruye la instancia del FAB y remueve sus event listeners.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this._isLink && this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
n("fab", c);
l();
export {
  c as Fab
};
