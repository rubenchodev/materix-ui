import "./native-select.css";
import { r as n, C as c, v as h, q as d } from "../chunks/core-CJdkPtZx.js";
const u = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>', r = ["standard", "outlined", "filled"];
class o extends c {
  /**
   * Crea una instancia del select nativo.
   *
   * @param {HTMLElement} element Elemento contenedor o `<select>` directo.
   */
  constructor(t) {
    if (t instanceof HTMLSelectElement && !t.closest(".mtx-native-select")) {
      const i = document.createElement("div");
      i.className = "mtx-native-select", Array.from(t.attributes).forEach((e) => {
        e.name === "class" ? i.className += ` ${e.value}` : (e.name.startsWith("data-") && e.name !== "data-mtx-initialized" || e.name === "label") && i.setAttribute(e.name, e.value);
      }), t.removeAttribute("class"), t.parentNode && t.parentNode.insertBefore(i, t), i.appendChild(t), t = i;
    }
    if (super(t), this.input = t.querySelector("select") || (t instanceof HTMLSelectElement ? t : null), !(this.input instanceof HTMLSelectElement))
      throw new TypeError("NativeSelect requiere un elemento <select>.");
    this.input.classList.add("mtx-native-select__input");
    const s = t.getAttribute("data-variant"), a = r.find((i) => t.classList.contains(`mtx-native-select--${i}`));
    this.variant = r.includes(s) ? s : a || "standard", t.classList.add(`mtx-native-select--${this.variant}`), (t.hasAttribute("data-small") || t.getAttribute("data-size") === "small") && t.classList.add("mtx-native-select--small");
    const l = t.getAttribute("data-label") || t.getAttribute("label");
    this.label = t.querySelector(".mtx-native-select__label"), !this.label && l && (this.label = document.createElement("label"), this.label.className = "mtx-native-select__label", this.label.textContent = l, t.insertBefore(this.label, this.input)), this.label && (this.input.id || (this.input.id = h("mtx-native-select")), this.label.tagName === "LABEL" && !this.label.htmlFor && (this.label.htmlFor = this.input.id), this.label.tagName !== "LABEL" && (this.label.id || (this.label.id = `${this.input.id}-label`), this.input.hasAttribute("aria-labelledby") || this.input.setAttribute("aria-labelledby", this.label.id)), t.classList.add("mtx-native-select--has-label")), this.chevron = t.querySelector(".mtx-native-select__chevron"), this.chevron || (this.chevron = document.createElement("span"), this.chevron.className = "mtx-native-select__chevron", t.appendChild(this.chevron)), this.chevron.setAttribute("aria-hidden", "true"), this.chevron.firstElementChild || (this.chevron.innerHTML = u), t.hasAttribute("data-error") && (t.classList.add("mtx-native-select--error"), this.input.setAttribute("aria-invalid", "true")), this.input.multiple && t.classList.add("mtx-native-select--multiple");
  }
  /** @returns {string|string[]} Valor actual. */
  get value() {
    return this.input.multiple ? Array.from(this.input.selectedOptions).map((t) => t.value) : this.input.value;
  }
  /** @param {string|string[]} value Nuevo valor. */
  set value(t) {
    const s = Array.isArray(t) ? t.map(String) : [String(t)];
    Array.from(this.input.options).forEach((a) => {
      a.selected = s.includes(a.value);
    });
  }
  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el select. */
  disable() {
    this.input.disabled = !0;
  }
  /** Habilita el select. */
  enable() {
    this.input.disabled = !1;
  }
  /** Enfoca el select nativo. */
  focus() {
    this.input.focus();
  }
}
n("native-select", o);
d();
export {
  o as NativeSelect
};
