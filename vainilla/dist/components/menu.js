import "./menu.css";
var O = Object.defineProperty;
var q = (i, s, t) => s in i ? O(i, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[s] = t;
var x = (i, s, t) => q(i, typeof s != "symbol" ? s + "" : s, t);
import { r as w, j as g, C as S, d as D, F as H, O as T, g as f, P, B as b, b as K, N as C, J as k, Q as B, R as U, A as $, z as W, o as E, v as M, q as j } from "../chunks/core-CJdkPtZx.js";
const R = /^menuitem(checkbox|radio)$/;
function v(i) {
  const s = i.id;
  if (!s) return [];
  const t = typeof CSS < "u" && CSS.escape ? CSS.escape(s) : s, e = [
    `[data-open-menu="#${t}"]`,
    `[data-mtx-menu-trigger="#${t}"]`,
    `[data-mtx-menu-trigger="${t}"]`,
    `[aria-controls="${t}"]`
  ].join(",");
  return Array.from(document.querySelectorAll(e)).filter((n) => !i.contains(n) || n.hasAttribute("data-submenu-trigger"));
}
function L(i, s) {
  i.setAttribute("aria-haspopup", "menu"), i.hasAttribute("aria-expanded") || i.setAttribute("aria-expanded", "false"), s.id && !i.hasAttribute("aria-controls") && i.setAttribute("aria-controls", s.id);
}
function I(i, s, t) {
  s && i.getAttribute("role") === "menuitemradio" && (i.closest('[role="group"]') || t || i.parentElement).querySelectorAll('[role="menuitemradio"]').forEach((n) => {
    n !== i && (n.setAttribute("aria-checked", "false"), n.classList.remove("mtx-menu-item--checked"));
  }), i.setAttribute("aria-checked", String(s)), i.classList.toggle("mtx-menu-item--checked", s);
}
function X(i, s) {
  const t = i.getAttribute("role") || "";
  if (!R.test(t)) return null;
  const e = t === "menuitemradio" ? !0 : i.getAttribute("aria-checked") !== "true";
  return I(i, e, s), e;
}
function N(i) {
  if (i.hasAttribute("data-divider")) {
    i.className = "mtx-menu-item--divider", i.setAttribute("role", "separator"), i.removeAttribute("tabindex"), i.removeAttribute("aria-disabled");
    return;
  }
  i.classList.contains("mtx-menu-item") || i.classList.add("mtx-menu-item");
  const s = i.getAttribute("data-icon");
  if (s && !i.querySelector(".mtx-menu-item__icon, .material-icons, svg")) {
    const t = document.createElement("span");
    t.className = "mtx-menu-item__icon";
    const e = document.createElement("span");
    e.className = "material-icons", e.setAttribute("aria-hidden", "true"), e.textContent = s, t.appendChild(e), i.insertBefore(t, i.firstChild);
  }
  if (i.hasAttribute("data-submenu-trigger") && !i.querySelector(".mtx-menu-item__expand")) {
    const t = document.createElement("span");
    t.className = "material-icons mtx-menu-item__expand", t.setAttribute("aria-hidden", "true"), t.textContent = "chevron_right", i.appendChild(t);
  }
  if (i.hasAttribute("role") || i.setAttribute("role", "menuitem"), i.hasAttribute("tabindex") || (i.tabIndex = -1), i.hasAttribute("data-disabled") && (i.classList.add("mtx-menu-item--disabled"), i.setAttribute("aria-disabled", "true")), i.hasAttribute("data-selected") && i.classList.add("mtx-menu-item--selected"), i.hasAttribute("data-dense") && i.classList.add("mtx-menu-item--dense"), i.hasAttribute("data-disable-gutters") && i.classList.add("mtx-menu-item--disable-gutters"), R.test(i.getAttribute("role") || "") && (i.hasAttribute("aria-checked") || i.setAttribute("aria-checked", String(i.hasAttribute("data-checked"))), i.classList.toggle("mtx-menu-item--checked", i.getAttribute("aria-checked") === "true"), !i.querySelector(".mtx-menu-item__check"))) {
    const t = document.createElement("span");
    t.className = "material-icons mtx-menu-item__check", t.setAttribute("aria-hidden", "true"), t.textContent = "check", i.appendChild(t);
  }
}
class _ extends S {
  /**
   * Crea una instancia del menú.
   *
   * @param {HTMLElement} element Elemento del menú.
   */
  constructor(t) {
    const e = g(t);
    let n = null;
    e instanceof _ && e.constructor === new.target && !e.destroyed && (n = e._placeholder || null, e._placeholder = null);
    super(t);
    /**
     * Manejador de scroll/resize para mantener el menú adherido al disparador.
     */
    x(this, "_handleReposition", () => {
      this.isOpen && (this._repositionRaf && cancelAnimationFrame(this._repositionRaf), this._repositionRaf = requestAnimationFrame(() => {
        if (!this.isOpen) return;
        const t = this._getPositionAnchor();
        if (!t) return;
        const e = t.getBoundingClientRect(), n = window.innerHeight || document.documentElement.clientHeight;
        if (e.bottom < 0 || e.top > n) {
          this.close({ restoreFocus: !1 });
          return;
        }
        this._position({ keepSide: !0 });
      }));
    });
    this._inheritedPlaceholder = n, this.element.classList.add("mtx-menu"), this.element.hidden = !0;
    const a = t.getAttribute("data-anchor");
    this.anchor = a && document.querySelector(a) || v(t)[0] || null, this.isSubmenu = t.hasAttribute("data-submenu"), this.childMenu = null, this.parentMenu = null, Array.from(t.querySelectorAll('[data-mtx="menu-item"]')).forEach(N), this._handlePointerDown = (c) => {
      const r = c.target.closest(".mtx-menu-item");
      r && !r.classList.contains("mtx-menu-item--disabled") && !r.hasAttribute("disabled") && c.button === 0 && D(r, c);
    }, this.listen(t, "pointerdown", this._handlePointerDown), this._transitionToken = 0, this._repositionRaf = null, this._stopAutoUpdate = null, this.onDestroy(() => {
      this._unbindReposition(), this._clickAwayCleanup && this._clickAwayCleanup(), this._keydownCleanup && this._keydownCleanup(), this._clickAwayCleanup = null, this._keydownCleanup = null;
    }), this._build(), this._bindTriggers(), t.hasAttribute("data-open") && queueMicrotask(() => {
      this.destroyed || this.open();
    });
  }
  /**
   * Obtiene los items de menú actuales.
   *
   * @returns {HTMLElement[]} Lista de elementos `.mtx-menu-item`.
   */
  get menuItems() {
    return Array.from(this.element.querySelectorAll(".mtx-menu-item"));
  }
  /**
   * Prepara el menú para mostrarse en el portal sin desvincularlo del DOM permanentemente.
   */
  _build() {
    var n;
    this.menuContainer = H(), this.container = document.createElement("div"), this.container.className = "mtx-menu__popper", this.container.hidden = !0, this.container.style.opacity = "0", this.container.style.transform = "scale(0.6, 0)";
    const t = document.createElement("div");
    t.className = "mtx-menu__paper", t.setAttribute("role", "presentation");
    const e = this._inheritedPlaceholder;
    this._inheritedPlaceholder = null, e && e.isConnected ? (this._placeholder = e, T(this, e)) : this.element.parentNode && this.element.parentNode !== document.body && !((n = this.element.parentNode.classList) != null && n.contains("mtx-menu__paper")) && (this._placeholder = document.createComment(`mtx-menu${this.element.id ? `:${this.element.id}` : ""}`), this.element.parentNode.insertBefore(this._placeholder, this.element), T(this, this._placeholder)), this.element.setAttribute("role", "menu"), this.element.tabIndex = -1, t.appendChild(this.element), this.paper = t, this.container.appendChild(t), this.menuContainer.appendChild(this.container);
  }
  /**
   * Vincula los disparadores que abren este menú.
   */
  _bindTriggers() {
    this.triggers = v(this.element), this.anchor && !this.triggers.includes(this.anchor) && this.triggers.push(this.anchor), this._handleTriggerClick = (t) => {
      t.preventDefault(), t._mtxMenuHandled = !0, this._activeTrigger = t.currentTarget;
      const e = t.detail === 0;
      this.isSubmenu ? this.isOpen || this.open(null, { focusFirstItem: e }) : this._toggle({ focusFirstItem: e });
    }, this._handleTriggerEnter = (t) => {
      const e = t.currentTarget;
      clearTimeout(this._hoverTimeout), this._hoverTimeout = setTimeout(() => {
        this._activeTrigger = e, this.isOpen || this.open(null, { focusFirstItem: !1 });
      }, 100);
    }, this._handleTriggerLeave = () => {
      clearTimeout(this._hoverTimeout);
    }, this.triggers.forEach((t) => {
      this.listen(t, "click", this._handleTriggerClick), L(t, this.element), this.isSubmenu && (this.listen(t, "mouseenter", this._handleTriggerEnter), this.listen(t, "mouseleave", this._handleTriggerLeave));
    }), this.onDestroy(() => {
      clearTimeout(this._hoverTimeout), clearTimeout(this._closeChildTimeout);
    }), this._handleItemClick = (t) => {
      const e = t.target.closest(".mtx-menu-item");
      if (e && !e.classList.contains("mtx-menu-item--disabled")) {
        if (e.hasAttribute("data-submenu-trigger"))
          return;
        const n = X(e, this.element);
        this.close();
        const a = { item: e };
        n !== null && (a.checked = n), f(this.element, "mtx:menu:select", a, { bubbles: !0, cancelable: !1 });
      }
    }, this.listen(this.element, "click", this._handleItemClick), this._closeChildTimeout = null, this.menuItems.forEach((t) => {
      this.listen(t, "mouseenter", () => {
        this.childMenu && this.childMenu._activeTrigger !== t && (clearTimeout(this._closeChildTimeout), this._closeChildTimeout = setTimeout(() => {
          this.childMenu && this.childMenu._activeTrigger !== t && this.childMenu.close({ restoreFocus: !1 });
        }, 50));
      }), this.listen(t, "mouseleave", () => {
        clearTimeout(this._closeChildTimeout);
      });
    });
  }
  /**
   * Alterna la apertura del menú.
   *
   * @param {Object} [options] Opciones de apertura.
   */
  _toggle(t = {}) {
    this.isOpen ? this.close() : this.open(null, t);
  }
  /**
   * Actualiza `aria-expanded` en los disparadores vinculados y en el activo.
   *
   * @param {boolean} expanded Estado de apertura.
   */
  _setExpanded(t) {
    const e = String(t);
    this.triggers.forEach((n) => n.setAttribute("aria-expanded", e)), this._activeTrigger instanceof HTMLElement && this._activeTrigger.hasAttribute("aria-haspopup") && this._activeTrigger.setAttribute("aria-expanded", e);
  }
  /**
   * Indica si un nodo pertenece a un disparador del menú (vinculado o activo).
   *
   * @param {Node} target Nodo del evento.
   * @returns {boolean} `true` si es parte de un disparador.
   */
  _isTriggerTarget(t) {
    return this.triggers.some((e) => e.contains(t)) ? !0 : this._activeTrigger instanceof HTMLElement && this._activeTrigger.contains(t);
  }
  /**
   * Gestiona el clic de un disparador añadido después de inicializar el menú.
   *
   * @param {HTMLElement} trigger Disparador pulsado.
   * @param {MouseEvent} event Evento de clic.
   */
  _handleDelegatedTrigger(t, e) {
    e.preventDefault(), L(t, this.element);
    const n = e.detail === 0;
    if (this.isOpen && this._activeTrigger === t) {
      this.close();
      return;
    }
    this.isOpen && this.close({ restoreFocus: !1 }), this._activeTrigger instanceof HTMLElement && this._activeTrigger !== t && !this.triggers.includes(this._activeTrigger) && this._activeTrigger.setAttribute("aria-expanded", "false"), this._activeTrigger = t, this.open(null, { focusFirstItem: n });
  }
  /**
   * Indica si el menú está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-menu--open");
  }
  /**
   * Ancla de posicionamiento: la de `open(…, { anchorEl })`, `data-position-anchor`,
   * el disparador activo o el ancla por defecto.
   *
   * @returns {HTMLElement|{getBoundingClientRect: Function}|null} Ancla.
   */
  _getPositionAnchor() {
    if (this._openAnchorEl && (this._openAnchorEl.nodeType !== 1 || this._openAnchorEl.isConnected)) return this._openAnchorEl;
    const t = this.element.getAttribute("data-position-anchor");
    let e = null;
    if (t)
      try {
        e = document.querySelector(t);
      } catch {
        e = null;
      }
    return e || this._activeTrigger || this.anchor;
  }
  /**
   * Posiciona el menú relativo al ancla activo o predeterminado.
   *
   * @param {{keepSide?: boolean}} [options] `keepSide` conserva el lado elegido al abrir.
   * @returns {{placement: string, side: string, maxHeight: number}|undefined} Resultado aplicado.
   */
  _position({ keepSide: t = !1 } = {}) {
    const e = this._getPositionAnchor();
    if (!e) return;
    t || (this._rtl = this._resolveRtl(e), this.container.setAttribute("dir", this._rtl ? "rtl" : "ltr"));
    const n = P(e, this.container, {
      placement: this.isSubmenu ? "right-start" : "bottom-start",
      offset: this.isSubmenu ? 0 : 4,
      padding: 8,
      matchWidth: !this.isSubmenu && this.element.hasAttribute("data-match-width"),
      content: this.paper,
      rtl: this._rtl,
      lockSide: t ? this._side : void 0
    });
    return this._side = n.side, n;
  }
  /**
   * Dirección del contexto: la del menú padre (submenús), la del ancla o la de la ubicación original.
   *
   * @param {HTMLElement|Object} anchor Ancla de posicionamiento.
   * @returns {boolean} `true` en RTL.
   */
  _resolveRtl(t) {
    return this.isSubmenu && this.parentMenu && typeof this.parentMenu._rtl == "boolean" ? this.parentMenu._rtl : t && t.nodeType === 1 && t.isConnected ? b(t) : this._placeholder && this._placeholder.parentElement ? b(this._placeholder.parentElement) : b(document.documentElement);
  }
  /**
   * Reposiciona en tiempo real (scroll, resize y cambios de tamaño) con `autoUpdate`.
   */
  _bindReposition() {
    this._unbindReposition();
    const t = this._getPositionAnchor();
    let e = !0;
    this._stopAutoUpdate = K(t, this.container, () => {
      if (e) {
        e = !1;
        return;
      }
      this._handleReposition();
    });
  }
  /**
   * Detiene el reposicionamiento automático.
   */
  _unbindReposition() {
    this._repositionRaf && (cancelAnimationFrame(this._repositionRaf), this._repositionRaf = null), this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null);
  }
  /**
   * Abre el menú.
   *
   * @param {HTMLElement|Object} [anchor] Disparador opcional al que anclar esta apertura.
   * @param {Object} [options] Opciones de apertura.
   * @param {boolean} [options.focusFirstItem=true] Si debe enfocar el primer ítem al abrir.
   * @param {HTMLElement} [options.anchorEl] Elemento al que se ancla la posición (p. ej. el grupo
   *   de un split button); el foco sigue volviendo al disparador.
   */
  open(t = null, { focusFirstItem: e = !0, anchorEl: n = null } = {}) {
    if (t && (this._activeTrigger = t), this.isOpen || (this._openAnchorEl = n || null), this.isOpen) return;
    if (this._activeTrigger && this._activeTrigger instanceof HTMLElement) {
      const r = this._activeTrigger.closest(".mtx-menu");
      r && (this.parentMenu = g(r), this.parentMenu && (this.parentMenu.childMenu && this.parentMenu.childMenu !== this && this.parentMenu.childMenu.close({ restoreFocus: !1 }), this.parentMenu.childMenu = this));
    }
    this._transitionToken += 1, this._transitionToken, this.container.hidden = !1, this.element.hidden = !1, this.container.parentElement !== this.menuContainer && this.menuContainer.appendChild(this.container);
    const a = this._position(), c = this.element.getAttribute("data-transform-origin") || (a ? this.container.style.transformOrigin : "top");
    this.isSubmenu ? (this.container.style.transition = "none", this.container.style.opacity = "1", this.container.style.transform = "scale(1, 1)", this.element.classList.add("mtx-menu--open"), this._setExpanded(!0), f(this.element, "mtx:menu:open", void 0, { bubbles: !0, cancelable: !1 }), this._bindReposition(), this._clickAwayCleanup = C(this.container, (r) => {
      this._isTriggerTarget(r.target) || k(this, r.target) || this.childMenu && this.childMenu.container && this.childMenu.container.contains(r.target) || this.close({ restoreFocus: !1 });
    }), this._pushLayer(), this._keydownCleanup = this._bindKeyboard(), this._focusInitial(e)) : (this.element.classList.add("mtx-menu--open"), B(this.container, !0, { transformOrigin: c }), this._setExpanded(!0), this._bindReposition(), this._clickAwayCleanup = C(this.container, (r) => {
      this._isTriggerTarget(r.target) || k(this, r.target) || this.childMenu && this.childMenu.container && this.childMenu.container.contains(r.target) || this.close({ restoreFocus: !1 });
    }), this._pushLayer(), this._keydownCleanup = this._bindKeyboard(), this._focusInitial(e), f(this.element, "mtx:menu:open", void 0, { bubbles: !0, cancelable: !1 }));
  }
  /**
   * Cierra el menú.
   */
  close({ restoreFocus: t = !0 } = {}) {
    this.isOpen && (this.childMenu && (this.childMenu.close({ restoreFocus: !1 }), this.childMenu = null), this.parentMenu && this.parentMenu.childMenu === this && (this.parentMenu.childMenu = null), this._transitionToken += 1, U(this.container), this.container.style.transformOrigin || this.element.getAttribute("data-transform-origin"), this.element.classList.remove("mtx-menu--open"), $(this), this._setExpanded(!1), this._unbindReposition(), this._clickAwayCleanup && (this._clickAwayCleanup(), this._clickAwayCleanup = null), this._keydownCleanup && (this._keydownCleanup(), this._keydownCleanup = null), this.container.style.transition = "none", this.container.style.opacity = "0", this.container.style.transform = "scale(1, 1)", this.container.hidden = !0, this.element.hidden = !0, t && this._activeTrigger && typeof this._activeTrigger.focus == "function" && this._activeTrigger.focus(), f(this.element, "mtx:menu:close", void 0, { bubbles: !0, cancelable: !1 }));
  }
  /**
   * Registra el menú abierto en la pila de capas (Escape cierra solo el superior).
   */
  _pushLayer() {
    W(this, {
      kind: "popup",
      nodes: this.container,
      // El portal compartido sube por encima de un Dialog/Popover abierto debajo.
      stack: [{ node: this.menuContainer }],
      onEscape: () => this.close({ restoreFocus: !0 })
    });
  }
  /**
   * Vincula la navegación por teclado dentro del menú.
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const t = (e) => {
      if (this.childMenu && this.childMenu.isOpen) return;
      const n = this.menuItems.filter(
        (r) => !r.classList.contains("mtx-menu-item--disabled") && !r.hidden
      );
      if (e.key === "Tab") {
        this.close({ restoreFocus: !1 });
        return;
      }
      if (!n.length) return;
      const a = n.indexOf(document.activeElement);
      let c = -1;
      if (e.key === "ArrowDown" ? c = a < 0 ? 0 : (a + 1) % n.length : e.key === "ArrowUp" ? c = a < 0 ? n.length - 1 : (a - 1 + n.length) % n.length : e.key === "Home" ? c = 0 : e.key === "End" && (c = n.length - 1), c >= 0) {
        e.preventDefault(), n[c].focus();
        return;
      }
      if (e.key === "ArrowRight" && document.activeElement && document.activeElement.hasAttribute("data-submenu-trigger")) {
        e.preventDefault(), document.activeElement.click();
        return;
      }
      if (e.key === "ArrowLeft" && this.isSubmenu) {
        e.preventDefault(), this.close({ restoreFocus: !0 });
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        const r = document.activeElement;
        r && r.classList.contains("mtx-menu-item") && (e.preventDefault(), r.hasAttribute("data-submenu-trigger") ? r.dispatchEvent(new MouseEvent("mouseenter")) : r.click());
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const r = e.key.toLocaleLowerCase(), m = n.slice(a + 1).concat(n.slice(0, a + 1)).find((d) => d.textContent.trim().toLocaleLowerCase().startsWith(r));
        m && m.focus();
      }
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }
  /**
   * Enfoca el item seleccionado o el primer item habilitado.
   *
   * @param {boolean} focusFirstItem Determina si se debe priorizar un ítem sobre el contenedor.
   */
  _focusInitial(t = !0) {
    if (!t) {
      this.element.focus({ preventScroll: !0 });
      return;
    }
    const e = this.menuItems.filter(
      (a) => !a.classList.contains("mtx-menu-item--disabled")
    );
    (e.find((a) => a.classList.contains("mtx-menu-item--selected")) || e[0] || this.element).focus({ preventScroll: !0 });
  }
  /**
   * Libera listeners (disparadores, documento, ventana), retira el popper portado
   * y desvincula la instancia. El elemento del menú sale del DOM con el popper.
   */
  destroy() {
    this.isOpen && this.close({ restoreFocus: !1 }), this.container && this.container.parentElement && this.container.parentElement.removeChild(this.container), this._placeholder && this._placeholder.parentNode && this._placeholder.remove(), this._placeholder = null, super.destroy();
  }
  /**
   * Crea un menú contextual programático basado en JSON.
   *
   * @param {string} targetSelector Selector de los elementos donde aplicar el clic derecho.
   * @param {Array<Object>} items Definición JSON del menú.
   * @returns {Menu|null} Instancia del menú raíz creado.
   */
  static createContextMenu(t, e = []) {
    const n = document.querySelectorAll(t);
    if (!n.length) return null;
    const a = /* @__PURE__ */ new Map(), c = [], r = (d, u = !1) => {
      const l = document.createElement("div");
      return l.className = "mtx-menu", l.setAttribute("data-mtx", "menu"), u && l.setAttribute("data-submenu", "true"), l.id = M("mtx-context-menu"), d.forEach((o) => {
        const h = document.createElement("div");
        if (h.setAttribute("data-mtx", "menu-item"), o.divider) {
          h.setAttribute("data-divider", ""), l.appendChild(h);
          return;
        }
        h.className = "mtx-menu-item", o.disabled && h.setAttribute("data-disabled", "true");
        const y = M("mtx-context-menu-item");
        if (h.setAttribute("data-value", y), o.action && typeof o.action == "function" && a.set(y, o.action), o.icon)
          h.setAttribute("data-icon", o.icon);
        else if (o.image) {
          const p = document.createElement("img");
          p.src = o.image, p.alt = "", p.className = "mtx-menu-item__image", h.appendChild(p);
        }
        const F = document.createTextNode(o.label || "");
        if (h.appendChild(F), o.submenu && Array.isArray(o.submenu) && o.submenu.length > 0) {
          const p = r(o.submenu, !0);
          h.setAttribute("data-submenu-trigger", "true"), h.setAttribute("data-open-menu", `#${p.id}`);
        }
        l.appendChild(h);
      }), document.body.appendChild(l), c.push(l), l;
    }, A = r(e);
    c.forEach((d) => {
      E(d), d.querySelectorAll("[data-mtx]").forEach((u) => E(u));
    });
    const m = g(A);
    return c.forEach((d) => {
      d.addEventListener("mtx:menu:select", (u) => {
        const l = u.detail.item.getAttribute("data-value"), o = a.get(l);
        o && o(u.detail.item, u);
      });
    }), n.forEach((d) => {
      m.listen(d, "contextmenu", (u) => {
        u.preventDefault();
        const l = {
          getBoundingClientRect: () => ({
            width: 0,
            height: 0,
            top: u.clientY,
            right: u.clientX,
            bottom: u.clientY,
            left: u.clientX
          })
        };
        m.open(l, { focusFirstItem: !1 });
      });
    }), m;
  }
}
class Y extends S {
  /**
   * Crea una instancia del item de menú.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(s) {
    super(s), N(s);
  }
  /**
   * Indica si el ítem está marcado (`menuitemcheckbox` / `menuitemradio`).
   *
   * @returns {boolean} Estado de `aria-checked`.
   */
  get checked() {
    return this.element.getAttribute("aria-checked") === "true";
  }
  /**
   * Marca o desmarca el ítem; en `menuitemradio` desmarca los del mismo grupo.
   *
   * @param {boolean} value Nuevo estado.
   */
  set checked(s) {
    I(this.element, !!s, this.element.closest(".mtx-menu"));
  }
}
w("menu", _);
w("menu-item", Y);
typeof document < "u" && document.addEventListener("click", (i) => {
  if (i._mtxMenuHandled || !(i.target instanceof Element)) return;
  const s = i.target.closest("[data-open-menu], [data-mtx-menu-trigger]");
  if (!s) return;
  const t = (s.getAttribute("data-open-menu") || s.getAttribute("data-mtx-menu-trigger") || "").trim();
  if (!t) return;
  const e = document.getElementById(t.replace(/^#/, "")), n = e && g(e);
  !(n instanceof _) || n.triggers.includes(s) || n._handleDelegatedTrigger(s, i);
});
j();
export {
  _ as Menu,
  Y as MenuItem
};
