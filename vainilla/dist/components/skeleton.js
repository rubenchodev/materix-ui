import "./skeleton.css";
import { r as u, C as h, g as m, q as f } from "../chunks/core-CJdkPtZx.js";
const o = ["text", "circular", "rectangular", "rounded"], p = ["pulse", "wave", "false"], x = (n) => n !== null && n !== "false";
function r(n) {
  if (n == null) return "";
  const t = String(n).trim();
  return t ? /^-?\d+(\.\d+)?$/.test(t) ? `${t}px` : t : "";
}
class g extends h {
  /**
   * Crea la instancia y aplica variante, tamaño, animación y líneas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.setAttribute("aria-hidden", "true");
    const e = parseInt(t.getAttribute("data-lines"), 10);
    this._lines = Number.isFinite(e) && e > 1 ? e : 0, this._variant = "text", this._animation = "pulse", this._lines ? this._renderLines() : (t.classList.add("mtx-skeleton"), this._wrapTextNodes(), this.setVariant(t.getAttribute("data-variant") || this._variantFromClass() || "text")), this._applySize(t), this.setAnimation(t.getAttribute("data-animation") || this._animationFromClass() || "pulse");
  }
  /** @returns {string|null} Variante declarada por clase BEM (SSR), si existe. */
  _variantFromClass() {
    return o.find((t) => this.element.classList.contains(`mtx-skeleton--${t}`)) || null;
  }
  /** @returns {string|null} Animación declarada por clase BEM (SSR), si existe. */
  _animationFromClass() {
    const { classList: t } = this.element;
    return t.contains("mtx-skeleton--wave") ? "wave" : t.contains("mtx-skeleton--no-animation") ? "false" : null;
  }
  /** Aplica `data-width`/`data-height` al elemento raíz. */
  _applySize(t) {
    const e = r(this.element.getAttribute("data-width")), s = r(this.element.getAttribute("data-height"));
    e && (t.style.width = e), s && !this._lines && (t.style.height = s);
  }
  /** Genera N líneas de texto; la última más corta (`data-last-width`, 60 % por defecto). */
  _renderLines() {
    const { element: t } = this;
    if (t.classList.add("mtx-skeleton-lines"), t.querySelector(":scope > .mtx-skeleton")) return;
    const e = r(t.getAttribute("data-last-width")) || "60%";
    for (let s = 0; s < this._lines; s += 1) {
      const i = document.createElement("span");
      i.className = "mtx-skeleton mtx-skeleton--text", s === this._lines - 1 && (i.style.width = e), t.appendChild(i);
    }
  }
  /**
   * Envuelve el texto directo en `.mtx-skeleton__text` para ocultarlo con `visibility`
   * (como los hijos elemento) en vez de dejar texto transparente que falla el contraste.
   */
  _wrapTextNodes() {
    Array.from(this.element.childNodes).forEach((t) => {
      if (t.nodeType !== 3 || t.textContent.trim() === "") return;
      const e = document.createElement("span");
      e.className = "mtx-skeleton__text", t.replaceWith(e), e.appendChild(t);
    });
  }
  /** @returns {boolean} `true` si envuelve elementos o texto no vacío. */
  _hasContent() {
    return Array.from(this.element.childNodes).some((t) => t.nodeType === 1 || t.nodeType === 3 && t.textContent.trim() !== "");
  }
  /** @returns {HTMLElement[]} Bloques animados (el propio elemento o sus líneas). */
  get blocks() {
    return this._lines ? Array.from(this.element.querySelectorAll(":scope > .mtx-skeleton")) : [this.element];
  }
  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }
  /** @returns {string} Animación actual (`pulse`, `wave` o `false`). */
  get animation() {
    return this._animation;
  }
  /**
   * Cambia la forma del bloque (sin efecto en modo `data-lines`, siempre texto).
   *
   * @param {'text'|'circular'|'rectangular'|'rounded'} variant Variante.
   * @returns {this} La instancia.
   */
  setVariant(t) {
    if (this._lines) return this;
    const e = o.includes(t) ? t : "text", { classList: s } = this.element;
    return o.forEach((i) => s.remove(`mtx-skeleton--${i}`)), s.add(`mtx-skeleton--${e}`), s.toggle("mtx-skeleton--with-children", this._hasContent()), this._variant = e, this;
  }
  /**
   * Cambia la animación; `'false'`/`false` la desactiva.
   *
   * @param {'pulse'|'wave'|'false'|false} animation Animación.
   * @returns {this} La instancia.
   */
  setAnimation(t) {
    const e = t === !1 ? "false" : String(t), s = p.includes(e) ? e : "pulse";
    return this.blocks.forEach((i) => {
      i.classList.remove("mtx-skeleton--pulse", "mtx-skeleton--wave", "mtx-skeleton--no-animation"), i.classList.add(s === "false" ? "mtx-skeleton--no-animation" : `mtx-skeleton--${s}`);
    }), this._animation = s, this;
  }
}
function l(n) {
  return typeof n == "string" ? document.querySelector(n) : n && n.nodeType === 1 ? n : null;
}
const a = {
  /**
   * Activa o desactiva la carga: `data-loading`, `aria-busy` y evento `mtx:skeleton:change`.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @param {boolean} [loading=true] `true` mientras se carga.
   * @returns {HTMLElement|null} El contenedor o `null` si no existe.
   */
  set(n, t = !0) {
    const e = l(n);
    if (!e) return null;
    const s = !!t, i = a.isLoading(e);
    return s ? (e.setAttribute("data-loading", ""), e.setAttribute("aria-busy", "true")) : (e.removeAttribute("data-loading"), e.removeAttribute("aria-busy")), e.querySelectorAll(":scope > [data-skeleton-placeholder]").forEach((d) => {
      d.setAttribute("aria-hidden", "true");
    }), i !== s && m(e, "mtx:skeleton:change", { loading: s }), e;
  },
  /**
   * Indica si el contenedor está en estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} `true` si tiene `data-loading` (distinto de `"false"`).
   */
  isLoading(n) {
    const t = l(n);
    return !!t && x(t.getAttribute("data-loading"));
  },
  /**
   * Alterna el estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} Nuevo estado.
   */
  toggle(n) {
    const t = !a.isLoading(n);
    return a.set(n, t), t;
  }
};
function c(n = document) {
  n.querySelectorAll('[data-loading]:not([data-loading="false"])').forEach((t) => {
    t.querySelector(":scope > [data-skeleton-placeholder], :scope > [data-skeleton-content]") && a.set(t, !0);
  });
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => c()) : c());
u("skeleton", g);
f();
export {
  g as Skeleton,
  a as skeleton
};
