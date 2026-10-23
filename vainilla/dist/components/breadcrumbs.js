import "./link.css";
import "./breadcrumbs.css";
import { r as d, C as h, g as m, h as n, t as l, x as b, o as _, q as p } from "../chunks/core-CJdkPtZx.js";
import "../chunks/link-DxLy9jL3.js";
const f = '<svg class="mtx-breadcrumbs__collapse-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>', x = /^[a-z][a-z0-9_]{2,}$/;
function c(o, t, e) {
  const a = Number.parseInt(o.getAttribute(t), 10);
  return Number.isFinite(a) && a >= 0 ? a : e;
}
class A extends h {
  /**
   * Crea la instancia y normaliza la estructura.
   *
   * @param {HTMLElement} element `<ol>`, `<ul>`, `<nav>` o contenedor de enlaces.
   */
  constructor(t) {
    super(t), this.source = t, this._expanded = !1, this._maxItems = c(t, "data-max-items", 8), this._itemsBefore = c(t, "data-items-before-collapse", 1), this._itemsAfter = c(t, "data-items-after-collapse", 1), this._separator = t.getAttribute("data-separator") || "/", this._buildStructure(), this._items = Array.from(this.list.children).filter(
      (e) => !e.classList.contains("mtx-breadcrumbs__separator") && !e.classList.contains("mtx-breadcrumbs__collapsed")
    ), this._itemData = this._items.map((e) => this._normalizeItem(e)), this._ensureCurrent(), this._handleClick = (e) => this._onClick(e), this.list.addEventListener("click", this._handleClick), this._handleLocaleChange = () => this._refreshTexts(), this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._render();
  }
  /** @returns {boolean} `true` si la ruta está expandida por el usuario. */
  get expanded() {
    return this._expanded;
  }
  /** @returns {number} Máximo de ítems visibles antes de colapsar. */
  get maxItems() {
    return this._maxItems;
  }
  /** @param {number} value Nuevo máximo de ítems visibles. */
  set maxItems(t) {
    this._maxItems = Math.max(0, Number.parseInt(t, 10) || 0), this._render();
  }
  /**
   * Devuelve una copia de los ítems actuales.
   *
   * @returns {Array<{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}>} Ítems.
   */
  getItems() {
    return this._itemData.map((t) => ({ ...t, data: { ...t.data } }));
  }
  /**
   * Reemplaza la ruta completa (navegación dinámica / SPA).
   *
   * @param {Array<{label: string, href?: string, icon?: string, current?: boolean, data?: Object}>} items Ítems nuevos.
   * @throws {TypeError} Si `items` no es un array.
   */
  setItems(t) {
    if (!Array.isArray(t)) throw new TypeError("Breadcrumbs.setItems espera un array de ítems.");
    const e = t.some((a) => a && a.current === !0);
    this._items = t.map((a, r) => {
      const s = a || {}, i = e ? s.current === !0 : r === t.length - 1;
      return this._createItem({ ...s, current: i });
    }), this._itemData = this._items.map((a) => this._normalizeItem(a)), this._expanded = !1, this._render();
  }
  /**
   * Muestra todos los ítems ocultos por el colapso.
   *
   * @param {boolean} [focus=false] Mueve el foco al primer ítem revelado.
   */
  expand(t = !1) {
    if (!this._expanded) {
      if (this._expanded = !0, this._render(), t) {
        const e = this._items[this._itemsBefore], a = e && e.querySelector("a[href], button:not(:disabled)") || this.list.querySelector("a[href], button:not(:disabled), [tabindex]");
        a && a.focus();
      }
      m(this.element, "mtx:breadcrumbs:expand");
    }
  }
  /** Vuelve a aplicar el colapso definido por `data-max-items`. */
  collapse() {
    this._expanded && (this._expanded = !1, this._render());
  }
  /** Elimina los listeners instalados. */
  destroy() {
    this.list.removeEventListener("click", this._handleClick), super.destroy();
  }
  /**
   * Crea `<nav>` + `<ol>` a partir del elemento original.
   */
  _buildStructure() {
    const t = this.source, e = n(t);
    let a, r;
    t.tagName === "OL" || t.tagName === "UL" ? (a = t.closest("nav.mtx-breadcrumbs") || document.createElement("nav"), a.contains(t) || (t.parentNode.insertBefore(a, t), a.appendChild(t)), r = t, ["aria-label", "aria-labelledby"].forEach((s) => {
      t.hasAttribute(s) && (a.setAttribute(s, t.getAttribute(s)), t.removeAttribute(s));
    }), Array.from(t.classList).forEach((s) => {
      (s === "mtx-breadcrumbs" || s.startsWith("mtx-breadcrumbs--")) && (t.classList.remove(s), s !== "mtx-breadcrumbs" && (a.className += ` ${s}`));
    })) : (a = t, r = t.querySelector(":scope > ol, :scope > ul"), r || (r = document.createElement("ol"), Array.from(t.childNodes).forEach((s) => {
      if (s.nodeType === Node.ELEMENT_NODE) {
        const i = document.createElement("li");
        i.appendChild(s), r.appendChild(i);
      } else if (s.nodeType === Node.TEXT_NODE && s.textContent.trim()) {
        const i = document.createElement("li");
        i.textContent = s.textContent.trim(), r.appendChild(i), s.remove();
      } else
        s.remove();
    }), t.appendChild(r)), a.tagName !== "NAV" && !a.hasAttribute("role") && a.setAttribute("role", "navigation")), a.classList.add("mtx-breadcrumbs"), r.classList.add("mtx-breadcrumbs__ol"), this._autoLabel = !a.hasAttribute("aria-label") && !a.hasAttribute("aria-labelledby"), this._autoLabel && a.setAttribute("aria-label", l("breadcrumbs", "label", null, "breadcrumb", e)), this.element = a, this.list = r, a !== t && b(a, this);
  }
  /**
   * Normaliza un `<li>` existente y devuelve sus datos.
   *
   * @param {HTMLLIElement} li Ítem.
   * @returns {{label: string, href: (string|null), icon: (string|null), current: boolean, data: Object}} Datos del ítem.
   */
  _normalizeItem(t) {
    t.classList.add("mtx-breadcrumbs__li");
    let e = t.querySelector(":scope > a, :scope > button, :scope > span, :scope > .mtx-breadcrumbs__text");
    e || (e = document.createElement("span"), e.className = "mtx-breadcrumbs__text", e.textContent = t.textContent.trim(), t.textContent = "", t.appendChild(e)), e.tagName === "A" || e.tagName === "BUTTON" ? (e.classList.add("mtx-breadcrumbs__link"), !e.hasAttribute("data-mtx") && !e.classList.contains("mtx-link") && (e.hasAttribute("data-color") || e.setAttribute("data-color", "inherit"), e.hasAttribute("data-underline") || e.setAttribute("data-underline", "hover"), e.setAttribute("data-mtx", "link")), e.getAttribute("data-mtx") === "link" && _(e)) : e.classList.add("mtx-breadcrumbs__text");
    const a = e.getAttribute("data-icon") || t.getAttribute("data-icon");
    if (a && !e.querySelector(".mtx-breadcrumbs__icon")) {
      const i = document.createElement("span");
      i.className = "mtx-breadcrumbs__icon material-icons", i.setAttribute("aria-hidden", "true"), i.textContent = a, e.insertBefore(i, e.firstChild);
    }
    e.querySelector(".mtx-breadcrumbs__icon") && e.classList.add("mtx-breadcrumbs__item--with-icon");
    const r = e.cloneNode(!0);
    r.querySelectorAll(".mtx-breadcrumbs__icon, .mtx-ripple-container").forEach((i) => i.remove());
    const s = {};
    return Object.keys(e.dataset).forEach((i) => {
      ["mtx", "mtxInitialized", "color", "underline", "icon"].includes(i) || (s[i] = e.dataset[i]);
    }), this._contentOf = this._contentOf || /* @__PURE__ */ new WeakMap(), this._contentOf.set(t, e), {
      label: r.textContent.trim(),
      href: e.getAttribute("href"),
      icon: a || null,
      current: e.getAttribute("aria-current") === "page",
      data: s
    };
  }
  /**
   * Construye un `<li>` desde un objeto de `setItems()`.
   *
   * @param {{label: string, href?: string, icon?: string, current: boolean, data?: Object}} item Datos.
   * @returns {HTMLLIElement} Ítem creado.
   */
  _createItem(t) {
    const e = document.createElement("li");
    let a;
    return t.href != null && t.href !== "" ? (a = document.createElement("a"), a.href = t.href) : t.current ? a = document.createElement("span") : (a = document.createElement("button"), a.type = "button"), a.textContent = t.label == null ? "" : String(t.label), t.icon && a.setAttribute("data-icon", t.icon), t.current && a.setAttribute("aria-current", "page"), t.data && typeof t.data == "object" && Object.entries(t.data).forEach(([r, s]) => {
      s != null && (a.dataset[r] = String(s));
    }), e.appendChild(a), e;
  }
  /** Marca el último ítem como página actual si ninguno lo está. */
  _ensureCurrent() {
    if (!this._items.length || this._itemData.some((e) => e.current)) return;
    const t = this._items.length - 1;
    this._contentOf.get(this._items[t]).setAttribute("aria-current", "page"), this._itemData[t].current = !0;
  }
  /**
   * Crea un separador oculto a tecnologías de asistencia.
   *
   * @returns {HTMLLIElement} Separador.
   */
  _createSeparator() {
    const t = document.createElement("li");
    if (t.className = "mtx-breadcrumbs__separator", t.setAttribute("aria-hidden", "true"), x.test(this._separator)) {
      const e = document.createElement("span");
      e.className = "material-icons", e.textContent = this._separator, t.appendChild(e);
    } else
      t.textContent = this._separator;
    return t;
  }
  /**
   * Crea el ítem con el botón que expande la ruta.
   *
   * @returns {HTMLLIElement} Ítem colapsado.
   */
  _createCollapsed() {
    const t = document.createElement("li");
    t.className = "mtx-breadcrumbs__collapsed";
    const e = document.createElement("button");
    return e.type = "button", e.className = "mtx-breadcrumbs__collapse-button", e.setAttribute("aria-label", this._showPathLabel()), e.innerHTML = f, e.addEventListener("click", () => this.expand(!0)), t.appendChild(e), this._collapseButton = e, t;
  }
  /** @returns {string} Texto accesible del botón de colapso. */
  _showPathLabel() {
    return this.source.getAttribute("data-expand-label") || l("breadcrumbs", "showPath", null, "Show path", n(this.element));
  }
  /** Pinta los ítems visibles, separadores y colapso. */
  _render() {
    const t = this._items, e = t.length;
    let a = t;
    const r = this._itemsBefore + this._itemsAfter < e;
    !this._expanded && this._maxItems > 0 && e > this._maxItems && r ? a = [
      ...t.slice(0, this._itemsBefore),
      this._createCollapsed(),
      ...t.slice(e - this._itemsAfter)
    ] : this._collapseButton = null;
    const s = [];
    a.forEach((i, u) => {
      u > 0 && s.push(this._createSeparator()), s.push(i);
    }), this.list.replaceChildren(...s), this.element.classList.toggle("mtx-breadcrumbs--collapsed", !!this._collapseButton);
  }
  /**
   * Emite `mtx:breadcrumbs:navigate` al activar un enlace (cancelable).
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(t) {
    const e = t.target.closest("a, button");
    if (!e || !this.list.contains(e) || e.classList.contains("mtx-breadcrumbs__collapse-button")) return;
    const a = e.closest(".mtx-breadcrumbs__li"), r = this._items.indexOf(a);
    if (r < 0) return;
    const s = this._itemData[r];
    m(this.element, "mtx:breadcrumbs:navigate", {
      index: r,
      href: s.href,
      label: s.label,
      current: s.current,
      item: { ...s, data: { ...s.data } },
      originalEvent: t
    }, { cancelable: !0 }) || t.preventDefault();
  }
  /** Actualiza los textos traducidos al cambiar el idioma. */
  _refreshTexts() {
    const t = n(this.element);
    this._autoLabel && this.element.setAttribute("aria-label", l("breadcrumbs", "label", null, "breadcrumb", t)), this._collapseButton && this._collapseButton.setAttribute("aria-label", this._showPathLabel());
  }
}
d("breadcrumbs", A);
p();
export {
  A as Breadcrumbs
};
