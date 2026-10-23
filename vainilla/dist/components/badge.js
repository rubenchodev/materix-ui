import "./badge.css";
import { r as s, C as n, q as l } from "../chunks/core-CJdkPtZx.js";
class o extends n {
  /**
   * Crea una instancia de la insignia.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-badge") || t.classList.add("mtx-badge"), this.variant = t.getAttribute("data-variant") || "standard";
    const e = t.getAttribute("data-max");
    this.max = e === null ? 99 : Number(e), this.showZero = this._getBooleanAttribute("data-show-zero"), this.standalone = this._getBooleanAttribute("data-standalone") || t.classList.contains("mtx-badge--standalone"), this.standalone && t.classList.add("mtx-badge--standalone"), this.labelTemplate = t.getAttribute("data-label"), this.badge = t.querySelector(".mtx-badge__badge") || document.createElement("span"), this.badge.classList.add("mtx-badge__badge"), this.standalone && !this.labelTemplate ? this.badge.removeAttribute("aria-hidden") : this.badge.setAttribute("aria-hidden", "true"), this.badge.parentElement || t.appendChild(this.badge), this.labelTemplate && (this.labelElement = t.querySelector(".mtx-badge__label") || document.createElement("span"), this.labelElement.className = "mtx-badge__label", this.labelElement.parentElement || t.appendChild(this.labelElement)), this.variant === "dot" && t.classList.add("mtx-badge--dot");
    const i = t.getAttribute("data-color") || "default";
    t.classList.add(`mtx-badge--${i}`);
    const a = t.getAttribute("data-anchor");
    a && a !== "top-right" && t.classList.add(`mtx-badge--${a}`), t.getAttribute("data-overlap") === "circular" && t.classList.add("mtx-badge--overlap-circular"), this._content = t.getAttribute("data-content"), this._explicitInvisible = this._getBooleanAttribute("data-invisible"), this._render();
  }
  /**
   * Obtiene un atributo booleano declarativo.
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} `true` salvo cuando su valor es `false`.
   */
  _getBooleanAttribute(t) {
    const e = this.element.getAttribute(t);
    return e !== null && e !== "false";
  }
  /** Actualiza contenido y visibilidad de la insignia. */
  _render() {
    if (this.variant !== "dot") {
      const i = this._content !== null && /^-?\d+$/.test(this._content), a = i ? Number(this._content) : null;
      this.badge.textContent = i && Number.isFinite(this.max) && a > this.max ? `${this.max}+` : this._content || "";
    }
    const t = this.variant !== "dot" && (this._content === null || Number(this._content) === 0 && !this.showZero), e = this._explicitInvisible || t;
    this.element.classList.toggle("mtx-badge--invisible", e), this.labelElement && (this.labelElement.textContent = e ? "" : this.labelTemplate.replace("{0}", this.badge.textContent || this._content || ""));
  }
  /** @returns {string|null} Contenido actual de la insignia. */
  get content() {
    return this._content;
  }
  /** @param {string|number|null} value Nuevo contenido. */
  set content(t) {
    this._content = t === null ? null : String(t), this._render();
  }
  /** @returns {boolean} `true` si la insignia está oculta. */
  get invisible() {
    return this.element.classList.contains("mtx-badge--invisible");
  }
  /** @param {boolean} value Estado de visibilidad. */
  set invisible(t) {
    this._explicitInvisible = !!t, this._render();
  }
}
s("badge", o);
l();
export {
  o as Badge
};
