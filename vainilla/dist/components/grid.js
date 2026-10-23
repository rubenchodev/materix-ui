import "./grid.css";
import { r as l, C as d, q as g } from "../chunks/core-CJdkPtZx.js";
const h = ["0_5", "1_5", "2_5"];
function u(m) {
  const t = String(m).trim().replace(".", "_");
  if (h.includes(t)) return t;
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return e <= 12 ? String(e) : null;
}
class c extends d {
  /**
   * Crea una instancia del componente Grid.
   *
   * @param {HTMLElement} element Elemento HTML contenedor o ítem.
   */
  constructor(t) {
    super(t), this._setupDom();
  }
  /**
   * Configura las clases y atributos de la grilla al inicializar.
   * @private
   */
  _setupDom() {
    this.element.classList.contains("mtx-grid") || this.element.classList.add("mtx-grid"), (this.element.hasAttribute("data-container") || this.element.getAttribute("data-mtx") === "grid-container") && this.element.classList.add("mtx-grid--container"), (this.element.hasAttribute("data-item") || this.element.getAttribute("data-mtx") === "grid-item") && this.element.classList.add("mtx-grid--item"), ["xs", "sm", "md", "lg", "xl"].forEach((i) => {
      const n = this.element.getAttribute(`data-${i}`);
      n !== null && n !== "" && (this.element.classList.add("mtx-grid--item"), this.element.classList.add(`mtx-grid--${i}-${n}`));
    }), !this.isContainer && !this.isItem && this.element.classList.add("mtx-grid--container"), [null, "sm", "md", "lg", "xl"].forEach((i) => {
      const n = i ? `-${i}` : "";
      [["spacing", "setSpacing"], ["row-spacing", "setRowSpacing"], ["column-spacing", "setColumnSpacing"]].forEach(([a, o]) => {
        const r = this.element.getAttribute(`data-${a}${n}`);
        r !== null && r !== "" && this[o](r, i);
      });
    });
    const t = this.element.getAttribute("data-direction");
    t && this.setDirection(t);
    const e = this.element.getAttribute("data-justify");
    e && this.setJustifyContent(e);
    const s = this.element.getAttribute("data-align");
    s && this.setAlignItems(s);
  }
  /**
   * Indica si el elemento es un contenedor de grilla.
   *
   * @returns {boolean} `true` si es un contenedor.
   */
  get isContainer() {
    return this.element.classList.contains("mtx-grid-container") || this.element.classList.contains("mtx-grid--container");
  }
  /**
   * Indica si el elemento es un ítem/columna de grilla.
   *
   * @returns {boolean} `true` si es un ítem.
   */
  get isItem() {
    return this.element.classList.contains("mtx-grid-item") || this.element.classList.contains("mtx-grid--item");
  }
  /**
   * Sustituye una clase de espaciado del contenedor.
   * @param {string} kind `spacing`, `row-spacing` o `column-spacing`.
   * @param {number|string} value Entero de 0 a 12 o medio paso 0.5 / 1.5 / 2.5 (n × 8px).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` (sin él aplica desde xs).
   * @private
   */
  _setSpacingClass(t, e, s) {
    if (!this.isContainer) return;
    const i = u(e);
    if (i === null) {
      console.warn(`Grid: ${t} no válido "${e}" (usa 0–12, 0.5, 1.5 o 2.5)`);
      return;
    }
    const n = s && s !== "xs" ? `mtx-grid--${s}-${t}-` : `mtx-grid--${t}-`;
    Array.from(this.element.classList).filter((a) => a.startsWith(n)).forEach((a) => this.element.classList.remove(a)), this.element.classList.add(`${n}${i}`);
  }
  /**
   * Cambia la separación horizontal y vertical entre ítems (gap de n × 8px).
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` desde el que aplica.
   */
  setSpacing(t, e) {
    this._setSpacingClass("spacing", t, e);
  }
  /**
   * Cambia solo la separación vertical entre filas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setRowSpacing(t, e) {
    this._setSpacingClass("row-spacing", t, e);
  }
  /**
   * Cambia solo la separación horizontal entre columnas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setColumnSpacing(t, e) {
    this._setSpacingClass("column-spacing", t, e);
  }
  /**
   * Establece la dirección flex (`row`, `column`, `row-reverse`, `column-reverse`).
   *
   * @param {string} direction Dirección flex.
   */
  setDirection(t) {
    Array.from(this.element.classList).filter(
      (s) => s.startsWith("mtx-grid--direction-")
    ).forEach((s) => this.element.classList.remove(s)), t && this.element.classList.add(`mtx-grid--direction-${t}`);
  }
  /**
   * Establece la alineación horizontal (`flex-start`, `center`, `flex-end`, etc.).
   *
   * @param {string} justify Justificación flex.
   */
  setJustifyContent(t) {
    Array.from(this.element.classList).filter(
      (s) => s.startsWith("mtx-grid--justify-")
    ).forEach((s) => this.element.classList.remove(s)), t && this.element.classList.add(`mtx-grid--justify-${t}`);
  }
  /**
   * Establece la alineación vertical (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`).
   *
   * @param {string} align Alineación flex.
   */
  setAlignItems(t) {
    Array.from(this.element.classList).filter(
      (s) => s.startsWith("mtx-grid--align-")
    ).forEach((s) => this.element.classList.remove(s)), t && this.element.classList.add(`mtx-grid--align-${t}`);
  }
}
l("grid", c);
l("grid-container", c);
l("grid-item", c);
g();
export {
  c as Grid
};
