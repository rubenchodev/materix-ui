import "./typography.css";
import { r as p, C as d, q as g } from "../chunks/core-CJdkPtZx.js";
const y = ["sm", "md", "lg", "xl"];
class c extends d {
  /**
   * Crea una instancia del elemento tipográfico.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(a) {
    super(a), a.classList.contains("mtx-typography") || a.classList.add("mtx-typography");
    const r = a.getAttribute("data-variant");
    if (r)
      a.classList.add(`mtx-typography--${r}`);
    else {
      const t = a.tagName.toLowerCase();
      /^h[1-6]$/.test(t) && a.classList.add(`mtx-typography--${t}`);
    }
    y.forEach((t) => {
      const i = a.getAttribute(`data-variant-${t}`);
      i && a.classList.add(`mtx-typography--${t}-${i}`);
    }), a.hasAttribute("data-responsive") && a.getAttribute("data-responsive") !== "false" && a.classList.add("mtx-typography--responsive");
    const o = a.getAttribute("data-color");
    o && a.classList.add(`mtx-typography--color-${o}`);
    const s = a.getAttribute("data-align");
    s && (a.classList.add(`mtx-typography--${s}`), a.classList.add(`mtx-typography--align-${s}`)), a.hasAttribute("data-no-wrap") && a.classList.add("mtx-typography--no-wrap"), a.hasAttribute("data-gutter-bottom") && a.classList.add("mtx-typography--gutter-bottom"), a.hasAttribute("data-paragraph") && a.classList.add("mtx-typography--paragraph");
  }
}
p("typography", c);
g();
export {
  c as Typography
};
