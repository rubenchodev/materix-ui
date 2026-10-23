import { r as a, C as d } from "./core-CJdkPtZx.js";
class r extends d {
  /**
   * Crea una instancia del enlace.
   *
   * @param {HTMLElement} element Elemento `<a>` o `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-link") || t.classList.add("mtx-link"), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button");
    const e = t.getAttribute("data-color");
    e && (t.classList.add(`mtx-link--${e}`), t.classList.add(`mtx-link--color-${e}`));
    const i = t.getAttribute("data-underline");
    i && t.classList.add(`mtx-link--underline-${i}`), this._handleClick = (s) => {
      this.disabled && (s.preventDefault(), s.stopImmediatePropagation());
    }, t.addEventListener("click", this._handleClick), t.hasAttribute("data-disabled") && this.disable();
  }
  /**
   * Indica si el enlace está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el enlace: `disabled` en `<button>`; `aria-disabled` y fuera del tabulado en `<a>`.
   */
  disable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el enlace.
   */
  enable() {
    this.element.tagName === "BUTTON" ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.removeAttribute("tabindex"));
  }
  /**
   * Destruye la instancia y retira sus listeners.
   */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
a("link", r);
export {
  r as L
};
