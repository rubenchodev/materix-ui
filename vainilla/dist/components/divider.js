import "./divider.css";
import { r as c, C as x, q as n } from "../chunks/core-CJdkPtZx.js";
class r extends x {
  /**
   * Indica si el elemento es un `<li>` hijo directo de una lista.
   *
   * @param {HTMLElement} element Elemento a comprobar.
   * @returns {boolean} `true` si está dentro de `<ul>`, `<ol>` o `role="list"`.
   */
  static isListChild(t) {
    const i = t.parentElement;
    return t.tagName === "LI" && !!i && (i.tagName === "UL" || i.tagName === "OL" || i.getAttribute("role") === "list");
  }
  /**
   * Crea una instancia de la división.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-divider") || t.classList.add("mtx-divider"), t.getAttribute("data-orientation") === "vertical" && t.classList.add("mtx-divider--vertical"), r.isListChild(t) ? !(t.getAttribute("data-text") || t.textContent.trim()) && !t.hasAttribute("role") && !t.hasAttribute("aria-hidden") && t.setAttribute("aria-hidden", "true") : t.tagName !== "HR" && !t.hasAttribute("role") && t.setAttribute("role", "separator"), t.classList.contains("mtx-divider--vertical") && !t.hasAttribute("aria-orientation") && t.setAttribute("aria-orientation", "vertical");
    const d = t.getAttribute("data-variant");
    d === "inset" ? t.classList.add("mtx-divider--inset") : d === "middle" && t.classList.add("mtx-divider--middle"), t.hasAttribute("data-flex-item") && t.classList.add("mtx-divider--flex-item");
    const o = t.getAttribute("data-text") || (t.tagName !== "HR" && t.children.length === 0 && t.textContent.trim() ? t.textContent.trim() : null);
    if (o) {
      t.classList.add("mtx-divider--text");
      const a = t.getAttribute("data-text-align");
      if ((a === "left" || a === "right") && t.classList.add(`mtx-divider--text-${a}`), !t.querySelector(".mtx-divider__text")) {
        t.textContent = "";
        const s = document.createElement("span");
        s.className = "mtx-divider__text", s.textContent = o, t.appendChild(s);
      }
    }
  }
}
c("divider", r);
n();
export {
  r as Divider
};
