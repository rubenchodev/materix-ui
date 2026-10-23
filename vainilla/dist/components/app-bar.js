import "./icon-button.css";
import "./app-bar.css";
import { r as d, C as h, h as m, t as p, j as u, q as b } from "../chunks/core-CJdkPtZx.js";
import { I as f } from "../chunks/icon-button-Bm1OjtlE.js";
class _ extends h {
  /**
   * Crea una instancia de AppBar.
   *
   * @param {HTMLElement} element Elemento HTML asociado.
   */
  constructor(t) {
    super(t), this._autoScaffold(), t.classList.contains("mtx-app-bar") || t.classList.add("mtx-app-bar");
    const e = t.getAttribute("data-position") || "fixed";
    t.classList.contains(`mtx-app-bar--${e}`) || t.classList.add(`mtx-app-bar--${e}`);
    let s = t.getAttribute("data-color");
    s || (t.classList.contains("mtx-app-bar--primary") ? s = "primary" : t.classList.contains("mtx-app-bar--secondary") ? s = "secondary" : t.classList.contains("mtx-app-bar--inherit") ? s = "inherit" : t.classList.contains("mtx-app-bar--transparent") ? s = "transparent" : s = "default"), t.classList.contains(`mtx-app-bar--${s}`) || t.classList.add(`mtx-app-bar--${s}`);
    const l = t.getAttribute("data-elevation"), i = l !== null && l !== "" && !isNaN(Number(l));
    this.defaultElevation = i ? Number(l) : 4, this.isElevated = !0, t.hasAttribute("data-elevate-on-scroll") ? (this._setShadow(!1), this.isElevated = !1) : i && (this.defaultElevation === 0 && t.classList.add("mtx-app-bar--flat"), this._setShadow(!0)), this.hideOnScroll = t.hasAttribute("data-hide-on-scroll"), this.elevateOnScroll = t.hasAttribute("data-elevate-on-scroll"), (this.hideOnScroll || this.elevateOnScroll) && this._bindScroll(), this._enableTransitions();
  }
  /**
   * Activa las transiciones tras el primer frame pintado, para que el estado
   * inicial (color, tema, elevación) no se anime al cargar la página.
   */
  _enableTransitions() {
    const t = this.element;
    if (typeof requestAnimationFrame != "function") {
      t.classList.add("mtx-app-bar--animated");
      return;
    }
    let e = 0;
    const s = requestAnimationFrame(() => {
      e = requestAnimationFrame(() => {
        this.destroyed || t.classList.add("mtx-app-bar--animated");
      });
    });
    this.onDestroy(() => {
      cancelAnimationFrame(s), e && cancelAnimationFrame(e);
    });
  }
  /**
   * Auto-construye la estructura interna de la AppBar si se usa la sintaxis simplificada.
   * Por ejemplo: <header data-mtx="app-bar" data-title="Noticias" data-start-icon="menu"></header>
   */
  _autoScaffold() {
    if (this.element.querySelector(".mtx-toolbar"))
      return;
    const t = this.element.getAttribute("data-title"), e = this.element.getAttribute("data-start-icon"), s = this.element.getAttribute("data-end-icon"), l = this.element.hasAttribute("data-dense");
    if (!t && !e && !s && !this.element.hasChildNodes())
      return;
    const i = document.createElement("div");
    i.className = "mtx-toolbar", l && i.classList.add("mtx-toolbar--dense");
    const o = m(this.element);
    if (e) {
      const a = this.element.getAttribute("data-drawer"), r = e === "menu" || a ? p("appBar", "openNavigation", null, "Open navigation", o) : e, c = this.element.getAttribute("data-start-icon-label") || r, n = this._createIconButton(e, c, "mtx-toolbar__navigation-icon");
      a && (n.setAttribute("data-mtx-drawer-toggle", a), n.setAttribute("aria-controls", a), n.setAttribute("aria-expanded", "false")), i.appendChild(n), this._drawerId = a;
    }
    if (t) {
      const a = document.createElement("span");
      a.className = "mtx-toolbar__title", a.textContent = t, i.appendChild(a);
    } else if (e && s && !this.element.hasChildNodes()) {
      const a = document.createElement("div");
      a.className = "mtx-toolbar__spacer", i.appendChild(a);
    }
    for (; this.element.firstChild; )
      i.appendChild(this.element.firstChild);
    if (s) {
      const a = this.element.getAttribute("data-end-icon-label") || s;
      i.appendChild(this._createIconButton(s, a));
    }
    if (this.element.appendChild(i), this._drawerId) {
      const a = document.getElementById(this._drawerId), r = a ? u(a) : null;
      r && typeof r.syncTriggers == "function" && r.syncTriggers();
    }
  }
  /**
   * Fija la sombra de la barra mediante la variable `--mtx-app-bar-shadow`.
   *
   * @param {boolean} elevated `true` para aplicar la elevación configurada.
   */
  _setShadow(t) {
    this.element.style.setProperty(
      "--mtx-app-bar-shadow",
      t ? `var(--mtx-elevation-${this.defaultElevation})` : "none"
    );
  }
  /**
   * Crea un IconButton de la Toolbar con su `aria-label`.
   *
   * @param {string} icon Nombre del icono de Material Icons.
   * @param {string} label Etiqueta accesible.
   * @param {string} [extraClass] Clase adicional.
   * @returns {HTMLButtonElement} Botón inicializado.
   */
  _createIconButton(t, e, s) {
    const l = document.createElement("button");
    l.className = s ? `mtx-icon-button ${s}` : "mtx-icon-button", l.setAttribute("type", "button"), l.setAttribute("aria-label", e), l.setAttribute("data-mtx", "icon-button");
    const i = document.createElement("span");
    return i.className = "material-icons", i.setAttribute("aria-hidden", "true"), i.textContent = t, l.appendChild(i), new f(l), l;
  }
  /**
   * Obtiene la posición vertical de scroll según el objetivo configurado.
   *
   * @returns {number} Posición vertical de scroll en píxeles.
   */
  _getScrollY() {
    return this._scrollTarget && this._scrollTarget !== window ? this._scrollTarget.scrollTop : window.scrollY || document.documentElement.scrollTop;
  }
  /**
   * Vincula el evento de scroll.
   */
  _bindScroll() {
    const t = this.element.getAttribute("data-scroll-target");
    this._scrollTarget = t && document.querySelector(t) || window, this._lastScrollY = this._getScrollY(), this._ticking = !1, this._handleScroll = () => {
      if (this._scrollFrame = 0, this.destroyed) return;
      const e = this._getScrollY();
      if (this.elevateOnScroll) {
        const s = e > 0;
        s && !this.isElevated ? (this._setShadow(!0), this.isElevated = !0) : !s && this.isElevated && (this._setShadow(!1), this.isElevated = !1);
      }
      this.hideOnScroll && (e > this._lastScrollY && e > 50 ? this.element.classList.add("mtx-app-bar--hidden") : e < this._lastScrollY && this.element.classList.remove("mtx-app-bar--hidden")), this._lastScrollY = e, this._ticking = !1;
    }, this._onScroll = () => {
      this._ticking || (this._scrollFrame = window.requestAnimationFrame(this._handleScroll), this._ticking = !0);
    }, this.listen(this._scrollTarget, "scroll", this._onScroll, { passive: !0 }), this.onDestroy(() => {
      this._scrollFrame && window.cancelAnimationFrame(this._scrollFrame), this._scrollFrame = 0;
    });
  }
  /**
   * Cambia la posición de la barra de aplicación.
   *
   * @param {'fixed' | 'static' | 'sticky' | 'absolute' | 'relative'} position Nueva posición.
   */
  setPosition(t) {
    ["fixed", "static", "sticky", "absolute", "relative"].forEach((e) => {
      this.element.classList.remove(`mtx-app-bar--${e}`);
    }), this.element.classList.add(`mtx-app-bar--${t}`);
  }
  /**
   * Cambia el color de la barra de aplicación.
   *
   * @param {'primary' | 'secondary' | 'default' | 'transparent' | 'inherit'} color Nuevo color.
   */
  setColor(t) {
    ["primary", "secondary", "default", "transparent", "inherit"].forEach((e) => {
      this.element.classList.remove(`mtx-app-bar--${e}`);
    }), this.element.classList.add(`mtx-app-bar--${t}`);
  }
}
d("app-bar", _);
b();
export {
  _ as AppBar
};
