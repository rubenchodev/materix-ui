import "./avatar.css";
import "./icon-button.css";
import "./drawer.css";
import { r as w, j as b, C as A, t as v, h as y, o as C, g as u, v as k, G as L, z as E, N as T, K as M, H as S, A as f, I as N, J as _, L as I, q } from "../chunks/core-CJdkPtZx.js";
const g = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }, x = "mtx-drawer-trigger--hidden";
class B extends A {
  /**
   * Crea una instancia del drawer.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-drawer") || t.classList.add("mtx-drawer"), this._userRole = t.getAttribute("role"), this.anchor = t.getAttribute("data-anchor") || "left", this.variant = t.getAttribute("data-variant") || "temporary", this.breakpoint = t.getAttribute("data-breakpoint") || "md", this.mode = null, this.isAbsolute = t.hasAttribute("data-absolute") || t.classList.contains("mtx-drawer--absolute"), this.isAbsolute && t.classList.add("mtx-drawer--absolute"), this._applyWidth(t.getAttribute("data-width"));
    const s = t.getAttribute("data-elevation");
    s !== null && (t.style.boxShadow = `var(--mtx-elevation-${s})`), t.hasAttribute("data-clipped") && t.getAttribute("data-clipped") !== "false" && t.classList.add("mtx-drawer--clipped"), t.classList.add(`mtx-drawer--${this.anchor}`), this.variant === "responsive" && t.classList.add("mtx-drawer--responsive"), this._buildStructure();
    const a = t.classList.contains("mtx-drawer--open") || t.hasAttribute("data-open");
    if (this.variant === "permanent") {
      this._setMode("permanent");
      return;
    }
    this._handleClose = (r) => {
      const i = r.target.closest("[data-mtx-drawer-close]");
      if (i) {
        const e = i.getAttribute("data-mtx-drawer-close");
        (!e || e === this.element.id) && this.close("closeButtonClick");
      }
    }, this.listen(t, "click", this._handleClose), this.variant === "persistent" ? this._setMode("persistent") : this.variant === "responsive" ? this._bindMediaQuery() : this._setMode("temporary"), a && this.mode !== "permanent" && this.open();
  }
  /**
   * Indica si el drawer está abierto (siempre `true` en modo permanente).
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-drawer--open");
  }
  /**
   * Aplica el ancho declarado en `data-width`.
   *
   * @param {string|null} width Valor del atributo.
   */
  _applyWidth(t) {
    const s = this.element;
    t === "wide" ? s.classList.add("mtx-drawer--wide") : t === "narrow" ? s.classList.add("mtx-drawer--narrow") : t === "full" || t === "full-width" ? s.classList.add("mtx-drawer--full-width") : t && (s.style.width = t, s.style.setProperty("--mtx-drawer-width", t));
  }
  /**
   * Genera cabecera, pie y panel de contenido (sintaxis simplificada) sin duplicar el BEM existente.
   */
  _buildStructure() {
    const t = this.element;
    let s = t.querySelector(".mtx-drawer__header");
    const a = t.getAttribute("data-title"), r = t.getAttribute("data-user-name"), i = t.getAttribute("data-user-email");
    if (!s && (a || r || i)) {
      if (s = document.createElement("div"), s.className = "mtx-drawer__header", r || i)
        s.appendChild(this._buildUser(r, i));
      else {
        const n = document.createElement("div");
        n.className = "mtx-drawer__heading";
        const d = document.createElement("h3");
        d.className = "mtx-drawer__title", d.textContent = a, n.appendChild(d);
        const m = t.getAttribute("data-subtitle");
        if (m) {
          const p = document.createElement("div");
          p.className = "mtx-drawer__subtitle", p.textContent = m, n.appendChild(p);
        }
        s.appendChild(n);
      }
      if (t.getAttribute("data-close-button") !== "false" && this.variant !== "permanent") {
        const n = document.createElement("button");
        n.type = "button", n.className = "mtx-icon-button mtx-drawer__close", n.setAttribute("aria-label", v("drawer", "close", null, "Close", y(t))), n.setAttribute("data-mtx-drawer-close", ""), n.innerHTML = '<span class="material-icons" aria-hidden="true">close</span>', s.appendChild(n);
      }
    }
    s && t.getAttribute("data-header") === "temporary" && s.classList.add("mtx-drawer__temporary-only");
    let e = t.querySelector(".mtx-drawer__footer");
    const o = t.getAttribute("data-footer-version"), c = t.getAttribute("data-footer-action");
    if (!e && (o || c)) {
      if (e = document.createElement("div"), e.className = "mtx-drawer__footer", o) {
        const n = document.createElement("div");
        n.className = "mtx-drawer__footer-info", n.textContent = o, e.appendChild(n);
      }
      if (c) {
        const n = document.createElement("div");
        n.className = "mtx-drawer__footer-actions";
        const d = document.createElement("button");
        d.type = "button", d.className = "mtx-button mtx-button--text mtx-button--small mtx-button--error", d.setAttribute("data-mtx", "button"), d.setAttribute("data-mtx-drawer-close", "");
        const m = document.createElement("span");
        m.className = "material-icons", m.setAttribute("aria-hidden", "true"), m.textContent = t.getAttribute("data-footer-action-icon") || "logout", d.append(m, ` ${c}`), n.appendChild(d), e.appendChild(n);
      }
    }
    let l = t.querySelector(".mtx-drawer__content");
    if (!l) {
      l = document.createElement("div"), l.className = "mtx-drawer__content";
      const n = Array.from(t.childNodes).filter((d) => d !== s && d !== e);
      for (const d of n)
        l.appendChild(d);
      t.appendChild(l);
    }
    s && s.parentElement !== t && t.insertBefore(s, l), e && e.parentElement === t && t.appendChild(e), this.panel = l, this.header = s, this.footer = e, (t.getAttribute("data-padded") === "true" || t.classList.contains("mtx-drawer--padded")) && l.classList.add("mtx-drawer__content--padded"), t.style.padding && (l.style.padding = t.style.padding, t.style.padding = "");
  }
  /**
   * Construye la cabecera de usuario con avatar, nombre y correo.
   *
   * @param {string|null} userName Nombre del usuario.
   * @param {string|null} userEmail Correo del usuario.
   * @returns {HTMLElement} Contenedor `.mtx-drawer__user`.
   */
  _buildUser(t, s) {
    const a = document.createElement("div");
    a.className = "mtx-drawer__user";
    const r = this.element.getAttribute("data-user-avatar") || (t ? t.charAt(0).toUpperCase() : "");
    if (r) {
      const e = document.createElement("div");
      e.className = "mtx-avatar mtx-avatar--circular mtx-drawer__user-avatar", e.setAttribute("data-mtx", "avatar"), e.textContent = r, a.appendChild(e), C(e);
    }
    const i = document.createElement("div");
    if (i.className = "mtx-drawer__user-info", t) {
      const e = document.createElement("div");
      e.className = "mtx-drawer__user-name", e.textContent = t, i.appendChild(e);
    }
    if (s) {
      const e = document.createElement("div");
      e.className = "mtx-drawer__user-email", e.textContent = s, i.appendChild(e);
    }
    return a.appendChild(i), a;
  }
  /**
   * Observa el breakpoint de la variante responsive y cambia de modo al cruzarlo.
   */
  _bindMediaQuery() {
    const t = g[this.breakpoint] ?? g.md;
    if (typeof window > "u" || typeof window.matchMedia != "function") {
      this._setMode("temporary");
      return;
    }
    this._mql = window.matchMedia(`(min-width: ${t}px)`), this._onMediaChange = () => this._setMode(this._mql.matches ? "permanent" : "temporary"), this._mql.addEventListener ? this.listen(this._mql, "change", this._onMediaChange) : this._mql.addListener && (this._mql.addListener(this._onMediaChange), this.onDestroy(() => this._mql.removeListener(this._onMediaChange))), this._onMediaChange();
  }
  /**
   * Cambia el modo efectivo y sincroniza clases, ARIA, fondo, disparadores y foco.
   *
   * @param {'temporary'|'persistent'|'permanent'} mode Modo destino.
   */
  _setMode(t) {
    if (t === this.mode) return;
    const s = this.mode, a = this.element, r = a.contains(document.activeElement);
    if (s === "temporary" && this.isOpen && this._releaseModal(), a.classList.remove("mtx-drawer--animated", "mtx-drawer--temporary", "mtx-drawer--persistent", "mtx-drawer--permanent", "mtx-drawer--open"), this.mode = t, t === "permanent" ? (a.classList.add("mtx-drawer--permanent", "mtx-drawer--open"), a.setAttribute("aria-hidden", "false"), this._setPanelDialog(!1), this._userRole || a.setAttribute("role", "navigation"), this.backdrop && this.backdrop.classList.remove("mtx-drawer__backdrop--open")) : t === "persistent" ? (a.classList.add("mtx-drawer--persistent"), a.setAttribute("aria-hidden", "true"), this._userRole || a.setAttribute("role", "region"), this.panel.setAttribute("tabindex", "-1")) : (a.classList.add("mtx-drawer--temporary"), a.setAttribute("aria-hidden", "true"), this._userRole || a.removeAttribute("role"), this._setPanelDialog(!0), this._ensureBackdrop()), this._syncTriggers(this.isOpen), s && t === "temporary" && r) {
      const i = this._getTriggers().find((e) => e.offsetParent !== null || e.getClientRects().length > 0);
      i && i.focus ? i.focus() : document.activeElement && document.activeElement.blur && document.activeElement.blur();
    }
    s && u(
      a,
      "mtx:drawer:mode-change",
      { mode: t, previousMode: s },
      { aliases: ["mtx:drawer:modechange"] }
    );
  }
  /**
   * Aplica o retira la semántica de diálogo modal del panel interior.
   *
   * @param {boolean} enabled `true` para el modo temporal.
   */
  _setPanelDialog(t) {
    const s = this.panel;
    if (t) {
      if (s.hasAttribute("role") || (s.setAttribute("role", "dialog"), this._panelRoleAdded = !0), s.setAttribute("aria-modal", "true"), s.hasAttribute("tabindex") || (s.tabIndex = -1, this._panelTabindexAdded = !0), !s.hasAttribute("aria-label") && !s.hasAttribute("aria-labelledby")) {
        const a = this.element.getAttribute("aria-label"), r = this.header && this.header.querySelector(".mtx-drawer__title, .mtx-drawer__user-name");
        a ? (s.setAttribute("aria-label", a), this._panelLabelAdded = "aria-label") : r && (r.id || (r.id = k("mtx-drawer-title")), s.setAttribute("aria-labelledby", r.id), this._panelLabelAdded = "aria-labelledby");
      }
      return;
    }
    this._panelRoleAdded && (s.removeAttribute("role"), this._panelRoleAdded = !1), s.removeAttribute("aria-modal"), this._panelTabindexAdded && (s.removeAttribute("tabindex"), this._panelTabindexAdded = !1), this._panelLabelAdded && (s.removeAttribute(this._panelLabelAdded), this._panelLabelAdded = null);
  }
  /**
   * Crea el fondo (backdrop) del modo temporal si procede y aún no existe.
   */
  _ensureBackdrop() {
    const t = this.element;
    this.backdrop || t.getAttribute("data-backdrop") === "false" || t.hasAttribute("data-hide-backdrop") || (this.backdrop = document.createElement("div"), this.backdrop.className = "mtx-drawer__backdrop", this.isAbsolute && t.parentElement ? (this.backdrop.classList.add("mtx-drawer__backdrop--absolute"), t.parentElement.appendChild(this.backdrop)) : document.body.appendChild(this.backdrop), this._handleBackdrop = () => {
      this.element.hasAttribute("data-disable-backdrop-click") || this.close("backdropClick");
    }, this.listen(this.backdrop, "click", this._handleBackdrop));
  }
  /**
   * Abre el drawer. No hace nada en modo permanente.
   */
  open() {
    if (!this.isOpen) {
      if (this._previousFocus = this._resolveReturnFocus(), this._openTrigger = null, this.element.classList.add("mtx-drawer--animated", "mtx-drawer--open"), this.element.setAttribute("aria-hidden", "false"), this._syncTriggers(!0), this.mode === "persistent") {
        u(this.element, "mtx:drawer:open");
        return;
      }
      this.backdrop && this.backdrop.classList.add("mtx-drawer__backdrop--open"), this.isAbsolute || L(this.element), E(this, {
        kind: "modal",
        nodes: () => [this.element, this.backdrop],
        stack: () => [{ node: this.element }, { node: this.backdrop, offset: -1 }],
        onEscape: () => {
          this.element.hasAttribute("data-disable-escape") || this.close("escapeKeyDown");
        }
      }), this._keydownCleanup = this._bindKeyboard(), this._clickAwayCleanup = T(this.element, (t) => {
        t && _(this, t.target) || this.element.hasAttribute("data-disable-backdrop-click") || this.close("clickaway");
      }), M(this.panel, this.element.querySelector("[data-drawer-autofocus]")), u(this.element, "mtx:drawer:open");
    }
  }
  /**
   * Destino del foco al cerrar. Un clic en WebKit no enfoca el botón (el foco queda en
   * body o en un ancestro con tabindex="-1"): entonces se usa el disparador pulsado.
   *
   * @returns {HTMLElement|null} Elemento al que devolver el foco.
   */
  _resolveReturnFocus() {
    const t = document.activeElement;
    return t && t !== document.body && t.tabIndex >= 0 && !this.element.contains(t) ? t : this._openTrigger && this._openTrigger.isConnected ? this._openTrigger : t;
  }
  /**
   * Cierra el drawer. No hace nada en modo permanente.
   *
   * @param {string} [reason='programmatic'] Motivo del cierre.
   */
  close(t = "programmatic") {
    !this.isOpen || this.mode === "permanent" || (this.element.classList.add("mtx-drawer--animated"), this.element.classList.remove("mtx-drawer--open"), this.element.setAttribute("aria-hidden", "true"), this._syncTriggers(!1), this.mode !== "persistent" && this._releaseModal(), this._openTrigger = null, this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus && this._previousFocus.focus(), u(this.element, "mtx:drawer:close", { reason: t }));
  }
  /**
   * Libera el fondo, el bloqueo de scroll y los listeners del modo temporal.
   */
  _releaseModal() {
    this.backdrop && this.backdrop.classList.remove("mtx-drawer__backdrop--open"), this.isAbsolute || S(this.element), f(this), this._unbindModalListeners();
  }
  /**
   * Retira los listeners de documento del modo temporal (teclado y click-away). Idempotente.
   */
  _unbindModalListeners() {
    this._keydownCleanup && (this._keydownCleanup(), this._keydownCleanup = null), this._clickAwayCleanup && (this._clickAwayCleanup(), this._clickAwayCleanup = null);
  }
  /**
   * Alterna el estado abierto/cerrado del drawer.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /**
   * Devuelve los disparadores declarativos (`open` y `toggle`) asociados a este drawer.
   *
   * @returns {HTMLElement[]} Disparadores encontrados en el documento.
   */
  _getTriggers() {
    if (!this.element.id) return [];
    const t = typeof CSS < "u" && CSS.escape ? CSS.escape(this.element.id) : this.element.id;
    return Array.from(document.querySelectorAll(`[data-mtx-drawer-open="${t}"], [data-mtx-drawer-toggle="${t}"]`));
  }
  /**
   * Sincroniza `aria-controls`/`aria-expanded` de los disparadores y, en la variante
   * responsive, los oculta mientras el drawer es permanente.
   *
   * @param {boolean} [expanded=this.isOpen] Estado expandido.
   */
  syncTriggers(t = this.isOpen) {
    this._syncTriggers(t);
  }
  /**
   * @param {boolean} expanded Estado expandido.
   */
  _syncTriggers(t) {
    const s = this.variant === "responsive" && this.mode === "permanent";
    this._getTriggers().forEach((a) => {
      a.setAttribute("aria-controls", this.element.id), a.setAttribute("aria-expanded", String(t)), this.variant === "responsive" && a.classList.toggle(x, s);
    });
  }
  /**
   * Vincula el teclado (Tab trapping; Escape lo entrega la pila de capas).
   *
   * @returns {Function} Función de limpieza.
   */
  _bindKeyboard() {
    const t = (s) => {
      !N(this.element) && !this.isAbsolute || _(this, document.activeElement) || s.key === "Tab" && I(s, this.panel);
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }
  /**
   * Cierra el drawer, libera listeners y media queries, retira el backdrop portado
   * y desvincula la instancia (no deshace el auto-scaffolding).
   */
  destroy() {
    this.isOpen && this.mode !== "permanent" && this.close(), this._unbindModalListeners(), f(this), this._mql && this._onMediaChange && this._getTriggers().forEach((t) => t.classList.remove(x)), this.backdrop && this.backdrop.parentElement && this.backdrop.remove(), super.destroy(), this._mql = null, this._previousFocus = null, this._openTrigger = null;
  }
}
w("drawer", B);
typeof document < "u" && document.addEventListener("click", (h) => {
  const t = h.target.closest("[data-mtx-drawer-open]");
  if (t) {
    const i = document.getElementById(t.getAttribute("data-mtx-drawer-open")), e = i ? b(i) : null;
    e && (e._openTrigger = t, e.open());
    return;
  }
  const s = h.target.closest("[data-mtx-drawer-close]");
  if (s) {
    const i = s.getAttribute("data-mtx-drawer-close");
    if (i) {
      const e = document.getElementById(i), o = e ? b(e) : null;
      o && o.close("closeButtonClick");
    }
    return;
  }
  const a = h.target.closest("[data-mtx-drawer-toggle]");
  if (a) {
    const i = document.getElementById(a.getAttribute("data-mtx-drawer-toggle")), e = i ? b(i) : null;
    e && (e._openTrigger = a, e.toggle());
    return;
  }
  const r = h.target.closest("[data-mtx-collapse-trigger]");
  if (r) {
    const i = r.getAttribute("data-mtx-collapse-trigger"), e = document.getElementById(i);
    if (e) {
      const o = r.getAttribute("aria-expanded") !== "true";
      r.setAttribute("aria-expanded", String(o));
      const c = r.querySelector(".mtx-collapse-indicator");
      c && c.textContent.trim() === "expand_more" && (c.textContent = "chevron_right"), o ? (e.removeAttribute("hidden"), e.removeAttribute("inert"), e.classList.remove("mtx-collapse--collapsing"), e.offsetHeight, e.classList.add("mtx-collapse--open")) : (e.setAttribute("hidden", ""), e.setAttribute("inert", ""), e.classList.remove("mtx-collapse--open"), e.classList.add("mtx-collapse--collapsing"), setTimeout(() => {
        e.hasAttribute("hidden") && e.classList.remove("mtx-collapse--collapsing");
      }, 250));
    }
  }
});
q();
export {
  B as Drawer
};
