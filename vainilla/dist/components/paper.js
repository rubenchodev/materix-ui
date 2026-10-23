import "./paper.css";
import { r as s, C as i, q as r } from "../chunks/core-CJdkPtZx.js";
class o extends i {
  /**
   * Crea una instancia de la superficie.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(a) {
    super(a), a.classList.contains("mtx-paper") || a.classList.add("mtx-paper");
    const t = a.getAttribute("data-elevation");
    t !== null && t !== "" && a.classList.add(`mtx-paper--elevation-${t}`), a.getAttribute("data-variant") === "outlined" && a.classList.add("mtx-paper--outlined"), a.hasAttribute("data-square") && a.classList.add("mtx-paper--square");
  }
}
s("paper", o);
r();
export {
  o as Paper
};
