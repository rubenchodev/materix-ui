import { r, C as c, d } from "./core-CJdkPtZx.js";
class e extends c {
  /**
   * Crea una instancia del botón de icono.
   *
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-icon-button") || t.classList.add("mtx-icon-button");
    const i = t.getAttribute("data-size");
    i && t.classList.add(`mtx-icon-button--${i}`);
    const n = t.getAttribute("data-color");
    n && t.classList.add(`mtx-icon-button--${n}`);
    const s = t.getAttribute("data-edge");
    (s === "start" || s === "end") && t.classList.add(`mtx-icon-button--edge-${s}`);
    const a = t.getAttribute("data-icon");
    if (a && !t.querySelector(".material-icons") && !t.querySelector("svg") && t.children.length === 0) {
      const o = document.createElement("span");
      o.className = "material-icons", o.setAttribute("aria-hidden", "true"), o.textContent = a, t.appendChild(o);
    }
    this._handlePointerDown = (o) => {
      this.disabled || o.button !== 0 || d(t, o, { centered: !0 });
    }, t.addEventListener("pointerdown", this._handlePointerDown);
  }
  /**
   * Destruye la instancia y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
r("icon-button", e);
export {
  e as I
};
