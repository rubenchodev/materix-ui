import "./pagination.css";
import { r as p, C as g, d as _, g as c, x as m, t as b, h as f, q as x } from "../chunks/core-CJdkPtZx.js";
const v = {
  first: "M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z",
  previous: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  next: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  last: "M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
}, A = ["text", "outlined"], C = ["circular", "rounded"], L = ["small", "medium", "large"], N = ["standard", "primary", "secondary"], S = ["first", "previous", "next", "last"];
function d(l, t) {
  const s = t - l + 1;
  return s > 0 ? Array.from({ length: s }, (a, e) => l + e) : [];
}
function M(l) {
  const { count: t, page: s, siblingCount: a, boundaryCount: e } = l, i = d(1, Math.min(e, t)), o = d(Math.max(t - e + 1, e + 1), t), n = Math.max(
    Math.min(s - a, t - e - a * 2 - 1),
    e + 2
  ), r = Math.min(
    Math.max(s + a, e + a * 2 + 2),
    o.length > 0 ? o[0] - 2 : t - 1
  );
  let h = [];
  n > e + 2 ? h = ["start-ellipsis"] : e + 1 < t - e && (h = [e + 1]);
  let u = [];
  return r < t - e - 1 ? u = ["end-ellipsis"] : t - e > e && (u = [t - e]), [
    ...l.showFirstButton ? ["first"] : [],
    ...l.hidePrevButton ? [] : ["previous"],
    ...i,
    ...h,
    ...d(n, r),
    ...u,
    ...o,
    ...l.hideNextButton ? [] : ["next"],
    ...l.showLastButton ? ["last"] : []
  ];
}
class B extends g {
  /**
   * Crea la paginación y pinta sus ítems.
   *
   * @param {HTMLElement} element `<nav>` (recomendado), `<div>` o `<ul>`.
   */
  constructor(t) {
    super(t), this.source = t;
    const s = (e, i, o) => {
      const n = Number.parseInt(t.getAttribute(e), 10);
      return Number.isFinite(n) ? Math.max(o, n) : i;
    }, a = (e) => t.hasAttribute(e) && t.getAttribute(e) !== "false";
    this._count = s("data-count", 1, 0), this._page = s("data-page", 1, 1), this._siblingCount = s("data-sibling-count", 1, 0), this._boundaryCount = s("data-boundary-count", 1, 0), this._options = {
      showFirstButton: a("data-show-first-button"),
      showLastButton: a("data-show-last-button"),
      hidePrevButton: a("data-hide-prev-button"),
      hideNextButton: a("data-hide-next-button")
    }, this._hrefTemplate = t.getAttribute("data-href-template"), this._disabled = a("data-disabled"), this._buildStructure(), this._handleClick = (e) => this._onClick(e), this._handlePointerDown = (e) => {
      const i = e.target.closest(".mtx-pagination__item");
      !i || e.button !== 0 || this._isItemDisabled(i) || _(i, e);
    }, this._handleLocaleChange = () => {
      this._autoLabel && this.element.setAttribute("aria-label", this._t("label", "pagination navigation")), this._render();
    }, this.list.addEventListener("click", this._handleClick), this.list.addEventListener("pointerdown", this._handlePointerDown), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._page = this._clamp(this._page), this._render();
  }
  /** @returns {number} Página actual (base 1). */
  get page() {
    return this._page;
  }
  /** @param {number} value Página nueva; se ajusta a `[1, count]` sin emitir evento. */
  set page(t) {
    this._page = this._clamp(t), this._render();
  }
  /** @returns {number} Número total de páginas. */
  get count() {
    return this._count;
  }
  /** @param {number} value Total de páginas; la página actual se ajusta si queda fuera. */
  set count(t) {
    this._count = Math.max(0, Number.parseInt(t, 10) || 0), this._page = this._clamp(this._page), this._render();
  }
  /** @returns {boolean} `true` si la paginación está deshabilitada. */
  get disabled() {
    return this._disabled;
  }
  /** Deshabilita todos los ítems. */
  disable() {
    this._disabled = !0, this._render();
  }
  /** Habilita los ítems. */
  enable() {
    this._disabled = !1, this._render();
  }
  /**
   * Va a una página y emite `mtx:pagination:change` si cambia.
   *
   * @param {number} page Página destino (base 1).
   * @returns {boolean} `true` si la página cambió.
   */
  goTo(t) {
    const s = this._clamp(t);
    if (s === this._page || this._count === 0) return !1;
    const a = this._page;
    return this._page = s, this._render(), c(this.element, "mtx:pagination:change", { page: s, previousPage: a }), !0;
  }
  /** Va a la página siguiente. @returns {boolean} `true` si cambió. */
  next() {
    return this.goTo(this._page + 1);
  }
  /** Va a la página anterior. @returns {boolean} `true` si cambió. */
  previous() {
    return this.goTo(this._page - 1);
  }
  /** Elimina listeners instalados. */
  destroy() {
    this.list.removeEventListener("click", this._handleClick), this.list.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
  /** Crea `<nav>` + `<ul>` y aplica las clases de variante. */
  _buildStructure() {
    const t = this.source;
    let s = t, a;
    t.tagName === "UL" || t.tagName === "OL" ? (s = document.createElement("nav"), t.parentNode.insertBefore(s, t), s.appendChild(t), a = t, ["aria-label", "aria-labelledby"].forEach((i) => {
      t.hasAttribute(i) && (s.setAttribute(i, t.getAttribute(i)), t.removeAttribute(i));
    }), Array.from(t.classList).forEach((i) => {
      i.startsWith("mtx-pagination--") && (t.classList.remove(i), s.className += ` ${i}`);
    }), t.classList.remove("mtx-pagination")) : (a = t.querySelector(":scope > ul.mtx-pagination__ul, :scope > ul"), a || (a = document.createElement("ul"), t.appendChild(a)), t.tagName !== "NAV" && !t.hasAttribute("role") && t.setAttribute("role", "navigation"));
    const e = (i, o, n) => {
      const r = t.getAttribute(i);
      return o.includes(r) ? r : n;
    };
    this._variant = e("data-variant", A, "text"), this._shape = e("data-shape", C, "circular"), this._size = e("data-size", L, "medium"), this._color = e("data-color", N, "standard"), s.classList.add(
      "mtx-pagination",
      `mtx-pagination--${this._variant}`,
      `mtx-pagination--${this._shape}`,
      `mtx-pagination--${this._size}`,
      `mtx-pagination--color-${this._color}`
    ), a.classList.add("mtx-pagination__ul"), this.element = s, this.list = a, s !== t && m(s, this), this._autoLabel = !s.hasAttribute("aria-label") && !s.hasAttribute("aria-labelledby"), this._autoLabel && s.setAttribute("aria-label", this._t("label", "pagination navigation"));
  }
  /**
   * Traduce una clave del diccionario `pagination`.
   *
   * @param {string} key Clave.
   * @param {string} fallback Texto por defecto.
   * @param {Object} [params] Parámetros de interpolación.
   * @returns {string} Texto traducido.
   */
  _t(t, s, a = null) {
    return b("pagination", t, a, s, f(this.element || this.source));
  }
  /**
   * Ajusta un valor al rango válido de páginas.
   *
   * @param {number} value Página propuesta.
   * @returns {number} Página válida.
   */
  _clamp(t) {
    const s = Number.parseInt(t, 10), a = Math.max(1, this._count);
    return Math.min(Math.max(1, Number.isFinite(s) ? s : 1), a);
  }
  /**
   * Página destino de un tipo de botón de navegación.
   *
   * @param {string} type `first`, `previous`, `next` o `last`.
   * @returns {number} Página destino.
   */
  _targetOf(t) {
    return t === "first" ? 1 : t === "previous" ? this._page - 1 : t === "next" ? this._page + 1 : this._count;
  }
  /**
   * @param {HTMLElement} item Ítem.
   * @returns {boolean} `true` si el ítem no admite interacción.
   */
  _isItemDisabled(t) {
    return t.disabled === !0 || t.getAttribute("aria-disabled") === "true";
  }
  /**
   * Crea un ítem interactivo (botón o enlace).
   *
   * @param {number} page Página destino.
   * @param {string} key Clave de foco (`page-3`, `next`…).
   * @param {boolean} disabled Si está deshabilitado.
   * @returns {HTMLElement} Elemento creado.
   */
  _createControl(t, s, a) {
    let e;
    return this._hrefTemplate ? (e = document.createElement("a"), a ? (e.setAttribute("aria-disabled", "true"), e.setAttribute("role", "link")) : e.href = this._hrefTemplate.replace(/\{page\}/g, String(t))) : (e = document.createElement("button"), e.type = "button", e.disabled = a), e.className = "mtx-pagination__item", e.setAttribute("data-page", String(t)), e.setAttribute("data-key", s), e;
  }
  /** Pinta la lista completa conservando el foco. */
  _render() {
    const t = document.activeElement, s = t && this.list.contains(t) ? t.getAttribute("data-key") : null, e = (this._count > 0 ? M({
      count: this._count,
      page: this._page,
      siblingCount: this._siblingCount,
      boundaryCount: this._boundaryCount,
      ...this._options
    }) : this._options.hidePrevButton && this._options.hideNextButton ? [] : S.filter((i) => i === "first" && this._options.showFirstButton || i === "last" && this._options.showLastButton || i === "previous" && !this._options.hidePrevButton || i === "next" && !this._options.hideNextButton)).map((i) => {
      const o = document.createElement("li");
      if (typeof i == "number") {
        const n = i === this._page, r = this._createControl(i, `page-${i}`, this._disabled);
        r.classList.add("mtx-pagination__item--page"), r.textContent = String(i), r.setAttribute("aria-label", n ? this._t("page", "page {page}", { page: i }) : this._t("goToPage", "Go to page {page}", { page: i })), n && (r.setAttribute("aria-current", "page"), r.classList.add("mtx-pagination__item--selected")), o.appendChild(r);
      } else if (i === "start-ellipsis" || i === "end-ellipsis") {
        const n = document.createElement("div");
        n.className = "mtx-pagination__ellipsis", n.textContent = "…", this._disabled && n.classList.add("mtx-pagination__ellipsis--disabled"), o.appendChild(n);
      } else {
        const n = this._targetOf(i), r = this._disabled || this._count === 0 || (i === "first" || i === "previous" ? this._page <= 1 : this._page >= this._count), h = this._createControl(n, i, r);
        h.classList.add("mtx-pagination__item--nav", `mtx-pagination__item--${i}`), h.setAttribute("aria-label", this._t(i, `Go to ${i} page`)), h.innerHTML = `<svg class="mtx-pagination__icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${v[i]}"/></svg>`, o.appendChild(h);
      }
      return o;
    });
    if (this.list.replaceChildren(...e), this.element.classList.toggle("mtx-pagination--disabled", this._disabled), this.source.setAttribute("data-page", String(this._page)), this.source.setAttribute("data-count", String(this._count)), s) {
      let i = this.list.querySelector(`[data-key="${s}"]`);
      (!i || this._isItemDisabled(i)) && (i = this.list.querySelector('[aria-current="page"]')), i && i.focus();
    }
  }
  /**
   * Gestiona la activación de un ítem.
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(t) {
    const s = t.target.closest(".mtx-pagination__item");
    if (!s || !this.list.contains(s)) return;
    if (this._isItemDisabled(s)) {
      t.preventDefault();
      return;
    }
    const a = Number.parseInt(s.getAttribute("data-page"), 10);
    if (!this._hrefTemplate) {
      this.goTo(a);
      return;
    }
    if (a === this._page) return;
    c(this.element, "mtx:pagination:change", {
      page: a,
      previousPage: this._page,
      href: s.getAttribute("href")
    }, { cancelable: !0 }) || (t.preventDefault(), this._page = this._clamp(a), this._render());
  }
}
p("pagination", B);
x();
export {
  B as Pagination,
  M as getPaginationItems
};
