import "./container.css";
import { r, C as o, q as d } from "../chunks/core-CJdkPtZx.js";
const a = ["xs", "sm", "md", "lg", "xl"], c = [...a, "fluid"].map((e) => `mtx-container--${e}`), i = (e, t) => e.hasAttribute(t) && e.getAttribute(t) !== "false";
class l extends o {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-container");
    const s = t.getAttribute("data-max-width");
    if (s)
      try {
        this.setMaxWidth(s);
      } catch (n) {
        console.warn(n.message);
      }
    i(t, "data-disable-gutters") && this.setGutters(!1), i(t, "data-fixed") && this.setFixed(!0);
  }
  /**
   * Cambia el ancho máximo.
   * @param {'xs'|'sm'|'md'|'lg'|'xl'|false|'false'} value Breakpoint tope o `false` para ancho completo.
   * @throws {RangeError} Si el valor no es válido.
   */
  setMaxWidth(t) {
    const s = t === !1 || t === "false" ? "fluid" : String(t);
    if (s !== "fluid" && !a.includes(s))
      throw new RangeError(`Container: data-max-width no válido "${t}"`);
    this.element.classList.remove(...c), this.element.classList.add(`mtx-container--${s}`);
  }
  /**
   * Activa o desactiva los márgenes laterales internos (16px / 24px).
   * @param {boolean} enabled `false` equivale a `data-disable-gutters`.
   */
  setGutters(t) {
    this.element.classList.toggle("mtx-container--disable-gutters", !t);
  }
  /**
   * Activa o desactiva el ancho fijo por breakpoint.
   * @param {boolean} fixed Estado.
   */
  setFixed(t) {
    this.element.classList.toggle("mtx-container--fixed", !!t);
  }
}
r("container", l);
d();
export {
  l as Container
};
