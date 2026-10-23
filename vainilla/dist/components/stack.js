import "./divider.css";
import "./stack.css";
import { r as h, C as u, q as f } from "../chunks/core-CJdkPtZx.js";
const m = ["sm", "md", "lg", "xl"], g = ["row", "column", "row-reverse", "column-reverse"], p = ["0", "0_5", "1", "1_5", "2", "2_5", "3", "4", "5", "6", "8", "10"], v = { start: "start", "flex-start": "start", center: "center", end: "end", "flex-end": "end", stretch: "stretch", baseline: "baseline" }, x = {
  start: "start",
  "flex-start": "start",
  center: "center",
  end: "end",
  "flex-end": "end",
  between: "between",
  "space-between": "between",
  around: "around",
  "space-around": "around",
  evenly: "evenly",
  "space-evenly": "evenly"
}, l = "data-mtx-stack-divider", k = (a) => {
  const t = String(a).trim().replace(".", "_");
  return p.includes(t) ? t : null;
}, d = (a, t) => a.hasAttribute(t) && a.getAttribute(t) !== "false";
class w extends u {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-stack");
    const e = (i) => {
      const n = t.getAttribute(i);
      return n !== null && n !== "" ? n : null;
    };
    [null, ...m].forEach((i) => {
      const n = i ? `-${i}` : "", c = e(`data-direction${n}`);
      c && this._safe(() => this.setDirection(c, i));
      const o = e(`data-spacing${n}`);
      o !== null && this._safe(() => this.setSpacing(o, i));
    });
    const s = e("data-align");
    s && this.setAlign(s);
    const r = e("data-justify");
    r && this.setJustify(r), d(t, "data-wrap") && this.setWrap(!0), this._divider = d(t, "data-divider"), this.refresh();
  }
  /**
   * Ejecuta una configuración declarativa sin interrumpir la inicialización.
   * @param {Function} fn Configuración a aplicar.
   * @private
   */
  _safe(t) {
    try {
      t();
    } catch (e) {
      console.warn(e.message);
    }
  }
  /**
   * Sustituye las clases que empiezan por un prefijo.
   * @param {string} prefix Prefijo de clase.
   * @param {string|null} next Clase nueva o `null` para solo eliminar.
   * @param {RegExp} [match] Filtro adicional sobre el resto del nombre.
   * @private
   */
  _swap(t, e, s) {
    Array.from(this.element.classList).filter((r) => r.startsWith(t) && (!s || s.test(r.slice(t.length)))).forEach((r) => this.element.classList.remove(r)), e && this.element.classList.add(e);
  }
  /**
   * Cambia la dirección, opcionalmente desde un breakpoint.
   * @param {'row'|'column'|'row-reverse'|'column-reverse'} direction Dirección flex.
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint (sin él aplica desde xs).
   * @throws {RangeError} Si la dirección no es válida.
   */
  setDirection(t, e) {
    const s = t === "col" ? "column" : t;
    if (!g.includes(s)) throw new RangeError(`Stack: dirección no válida "${t}"`);
    const r = e ? `mtx-stack--${e}-` : "mtx-stack--";
    this._swap(r, `${r}${s}`, /^(row|column|col)(-reverse)?$/);
  }
  /**
   * Cambia la separación entre hijos (escala `n × 8px`).
   * @param {string|number} spacing Valor de la escala (0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10).
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint.
   * @throws {RangeError} Si el valor no pertenece a la escala.
   */
  setSpacing(t, e) {
    const s = k(t);
    if (s === null) throw new RangeError(`Stack: espaciado no válido "${t}"`);
    const r = e ? `mtx-stack--${e}-spacing-` : "mtx-stack--spacing-";
    this._swap(r, `${r}${s}`);
  }
  /**
   * Alinea los hijos en el eje cruzado.
   * @param {string} align start|center|end|stretch|baseline (acepta flex-start/flex-end).
   */
  setAlign(t) {
    const e = v[t];
    this._swap("mtx-stack--align-", e ? `mtx-stack--align-${e}` : null);
  }
  /**
   * Distribuye los hijos en el eje principal.
   * @param {string} justify start|center|end|between|around|evenly (acepta valores CSS).
   */
  setJustify(t) {
    const e = x[t];
    this._swap("mtx-stack--justify-", e ? `mtx-stack--justify-${e}` : null);
  }
  /**
   * Activa o desactiva el ajuste de línea.
   * @param {boolean} wrap Estado.
   */
  setWrap(t) {
    this.element.classList.toggle("mtx-stack--wrap", !!t);
  }
  /**
   * Activa o desactiva los divisores automáticos entre hijos.
   * @param {boolean} enabled Estado.
   */
  setDivider(t) {
    this._divider = !!t, this.refresh();
  }
  /**
   * Regenera los divisores (llamar tras añadir o quitar hijos). Idempotente.
   */
  refresh() {
    if (Array.from(this.element.children).filter((e) => e.hasAttribute(l)).forEach((e) => e.remove()), !this._divider) return;
    Array.from(this.element.children).slice(1).forEach((e) => {
      const s = document.createElement("hr");
      s.className = "mtx-divider mtx-stack__divider", s.setAttribute(l, ""), s.setAttribute("aria-hidden", "true"), this.element.insertBefore(s, e);
    });
  }
}
h("stack", w);
f();
export {
  w as Stack
};
