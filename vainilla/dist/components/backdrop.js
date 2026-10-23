import "./backdrop.css";
import { r as c, j as d, C as l, G as h, z as u, g as a, H as p, A as m, q as f } from "../chunks/core-CJdkPtZx.js";
const _ = 'a[href], button, input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
function i(r, e) {
  return r.hasAttribute(e) && r.getAttribute(e) !== "false";
}
class o extends l {
  /**
   * Crea la instancia y aplica las opciones declarativas.
   *
   * @param {HTMLElement} element Elemento de la capa.
   */
  constructor(e) {
    super(e), e.classList.add("mtx-backdrop"), i(e, "data-invisible") && e.classList.add("mtx-backdrop--invisible");
    const t = e.getAttribute("data-z");
    t && /^-?\d+$/.test(t.trim()) && (e.style.zIndex = t.trim()), this._inerted = [], this._isOpen = !1, this._closeTimer = null, this.listen(e, "click", (s) => this._handleClick(s)), this.onDestroy(() => {
      clearTimeout(this._closeTimer), this._isOpen && this._release();
    }), i(e, "data-open") || e.classList.contains("mtx-backdrop--open") ? (this._isOpen = !1, this.open({ silent: !0 })) : (e.hidden = !0, e.setAttribute("aria-hidden", "true"));
  }
  /** @returns {boolean} `true` si la capa está abierta. */
  get isOpen() {
    return this._isOpen;
  }
  /**
   * Muestra la capa con un fundido.
   *
   * @param {{silent?: boolean}} [options] `silent` evita emitir el evento.
   * @returns {this} La instancia.
   */
  open(e = {}) {
    if (this._isOpen) return this;
    const { element: t } = this;
    return clearTimeout(this._closeTimer), this._isOpen = !0, t.hidden = !1, t.removeAttribute("aria-hidden"), t.setAttribute("data-open", ""), i(t, "data-lock-scroll") && h(t), i(t, "data-inert") && this._setInert(!0), ["data-close-on-escape", "data-lock-scroll", "data-inert"].some((s) => i(t, s)) && u(this, { kind: "modal", nodes: t, onEscape: () => this._handleEscape() }), t.offsetWidth, t.classList.add("mtx-backdrop--open"), e.silent || a(t, "mtx:backdrop:open"), this;
  }
  /**
   * Oculta la capa con un fundido.
   *
   * @param {{reason?: 'api'|'click'|'escape'}} [options] Motivo del cierre (en `detail`).
   * @returns {this} La instancia.
   */
  close(e = {}) {
    if (!this._isOpen) return this;
    const { element: t } = this;
    this._isOpen = !1, t.classList.remove("mtx-backdrop--open"), t.removeAttribute("data-open"), t.setAttribute("aria-hidden", "true"), this._release();
    const s = this._leaveDuration(), n = () => {
      this._isOpen || (t.hidden = !0);
    };
    return s > 0 ? this._closeTimer = setTimeout(n, s) : n(), a(t, "mtx:backdrop:close", { reason: e.reason || "api" }), this;
  }
  /**
   * Alterna entre abierto y cerrado.
   *
   * @returns {this} La instancia.
   */
  toggle() {
    return this._isOpen ? this.close() : this.open();
  }
  /** Libera el bloqueo de scroll y el `inert` aplicados al abrir. */
  _release() {
    p(this.element), m(this), this._setInert(!1);
  }
  /** @returns {number} Duración de salida en ms (0 con movimiento reducido). */
  _leaveDuration() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
    const t = (getComputedStyle(this.element).transitionDuration || "0s").split(",")[0].trim(), s = parseFloat(t) || 0;
    return t.endsWith("ms") ? s : s * 1e3;
  }
  /**
   * Marca como `inert` los hermanos de la capa y de sus ancestros (patrón aria-hidden de MUI).
   * @param {boolean} active `true` al abrir.
   */
  _setInert(e) {
    if (!e) {
      this._inerted.forEach((s) => s.removeAttribute("inert")), this._inerted = [];
      return;
    }
    let t = this.element;
    for (; t && t.parentElement && t !== document.body; )
      Array.from(t.parentElement.children).forEach((s) => {
        s === t || s.hasAttribute("inert") || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(s.tagName) || (s.setAttribute("inert", ""), this._inerted.push(s));
      }), t = t.parentElement;
  }
  /** Cierra al hacer clic si `data-close-on-click` (ignora controles interactivos del contenido). */
  _handleClick(e) {
    if (!this._isOpen) return;
    const t = e.target instanceof Element ? e.target : null;
    if (t && t.closest("[data-mtx-backdrop-close]")) {
      this.close({ reason: "click" });
      return;
    }
    if (!i(this.element, "data-close-on-click")) return;
    const s = t && t !== this.element && t.closest(_);
    s && this.element.contains(s) || this.close({ reason: "click" });
  }
  /** Cierra con Escape (entregado por la pila de capas) si `data-close-on-escape`. */
  _handleEscape() {
    !this._isOpen || !i(this.element, "data-close-on-escape") || this.close({ reason: "escape" });
  }
}
c("backdrop", o);
typeof document < "u" && document.addEventListener("click", (r) => {
  if (!(r.target instanceof Element)) return;
  const e = r.target.closest("[data-mtx-backdrop-open]");
  if (!e) return;
  const t = (e.getAttribute("data-mtx-backdrop-open") || "").trim().replace(/^#/, ""), s = t && document.getElementById(t), n = s && d(s);
  n instanceof o && n.toggle();
});
f();
export {
  o as Backdrop
};
