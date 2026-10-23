import "./popover.css";
import { r as L, C as M, v as S, b as C, G as N, z as I, g as $, H as B, A as D, O as H, S as R, M as U, J as q, c as P, T as W, U as z, L as k, q as G } from "../chunks/core-CJdkPtZx.js";
const n = 16, K = 150, X = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 24], J = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function E(v, t, e, i) {
  const [s = i.vertical, r = i.horizontal] = String(v || "").trim().split(/\s+/).filter(Boolean), o = (a, p, u) => {
    if (a in u) return u[a] * p;
    const l = parseFloat(a);
    return Number.isFinite(l) ? l : 0;
  };
  return {
    y: o(s, e, { top: 0, center: 0.5, bottom: 1 }),
    x: o(r, t, { left: 0, center: 0.5, right: 1 })
  };
}
class V extends M {
  /**
   * Crea el popover y prepara sus disparadores.
   *
   * @param {HTMLElement} element Contenido del popover (`data-mtx="popover"`).
   */
  constructor(t) {
    super(t), t.classList.add("mtx-popover"), t.id || (t.id = S("mtx-popover")), t.hasAttribute("role") || t.setAttribute("role", "dialog"), t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), this.modal && t.setAttribute("aria-modal", "true"), t.hidden = !0, this._applyLabel(), this._applyElevation(), this.isOpen = !1, this._anchor = null, this._session = [], this._exitTimer = null, this._placeholder = null, this.triggers.forEach((e) => this._prepareTrigger(e)), this.listen(document, "click", (e) => {
      const i = this._triggerFrom(e.target);
      !i || document.getElementById(this.element.id) !== this.element || i.disabled || i.getAttribute("aria-disabled") === "true" || (e.preventDefault(), this._prepareTrigger(i), this.isOpen && this._trigger === i ? this.close({ reason: "trigger" }) : this.open(i));
    }), this._bindDocument(), this.listen(t, "click", (e) => {
      const i = e.target instanceof Element ? e.target.closest("[data-mtx-popover-close]") : null;
      i && t.contains(i) && this.close({ reason: "action" });
    });
  }
  /** @returns {boolean} Si el popover es modal (atrapa el foco y bloquea el scroll). */
  get modal() {
    const t = this.element.getAttribute("data-modal");
    return t !== null && t !== "false";
  }
  /**
   * Disparadores declarados: `data-open-popover="#id"` o `aria-controls="id"`.
   *
   * @returns {HTMLElement[]} Disparadores actuales.
   */
  get triggers() {
    const t = this.element.id, e = typeof CSS < "u" && CSS.escape ? CSS.escape(t) : t;
    return Array.from(document.querySelectorAll(
      `[data-open-popover="#${e}"], [data-open-popover="${e}"], [aria-controls="${e}"]`
    )).filter((i) => !this.element.contains(i));
  }
  /**
   * Disparador al que pertenece un nodo, si apunta a este popover.
   *
   * @param {EventTarget} node Nodo del evento.
   * @returns {HTMLElement|null} Disparador.
   * @private
   */
  _triggerFrom(t) {
    if (!(t instanceof Element)) return null;
    const e = t.closest("[data-open-popover], [aria-controls]");
    if (!e || this.element.contains(e)) return null;
    const i = this.element.id, s = (e.getAttribute("data-open-popover") || "").trim().replace(/^#/, "");
    return s ? s === i ? e : null : e.getAttribute("aria-controls") === i ? e : null;
  }
  /**
   * Añade la semántica de disparador (`aria-haspopup`, `aria-controls`, `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _prepareTrigger(t) {
    t.hasAttribute("aria-haspopup") || t.setAttribute("aria-haspopup", "dialog"), t.hasAttribute("aria-controls") || t.setAttribute("aria-controls", this.element.id), t.setAttribute("aria-expanded", this.isOpen && this._trigger === t ? "true" : "false");
  }
  /**
   * Nombre accesible: `data-label`, o el primer encabezado interno vía `aria-labelledby`.
   *
   * @private
   */
  _applyLabel() {
    const t = this.element;
    if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
    const e = t.getAttribute("data-label");
    if (e) {
      t.setAttribute("aria-label", e);
      return;
    }
    const i = t.querySelector("[data-popover-title], h1, h2, h3, h4, h5, h6");
    i && (i.id || (i.id = `${t.id}-title`), t.setAttribute("aria-labelledby", i.id));
  }
  /**
   * Aplica la elevación (`data-elevation`, 8 por defecto como MUI).
   *
   * @private
   */
  _applyElevation() {
    const t = parseInt(this.element.getAttribute("data-elevation"), 10);
    if (Number.isNaN(t)) return;
    const e = X.reduce((i, s) => Math.abs(s - t) < Math.abs(i - t) ? s : i, 8);
    this.element.style.setProperty("--mtx-popover-shadow", e === 0 ? "none" : `var(--mtx-elevation-${e})`), this.element.style.setProperty("--mtx-popover-overlay", `var(--mtx-overlay-elevation-${e})`);
  }
  /**
   * Ancla efectiva: la indicada, `data-anchor`, el último disparador o el primero declarado.
   *
   * @returns {Element|{getBoundingClientRect: Function}|null} Ancla.
   * @private
   */
  _resolveAnchor() {
    if (this._anchor) return this._anchor;
    const t = this.element.getAttribute("data-anchor");
    return (t ? document.querySelector(t.startsWith("#") ? t : `#${t}`) : null) || this.triggers[0] || null;
  }
  /**
   * Abre el popover.
   *
   * @param {HTMLElement|{x:number, y:number}|{getBoundingClientRect: Function}} [anchor] Ancla:
   *   elemento, punto de viewport (`anchorPosition` de MUI) o ancla virtual.
   * @returns {boolean} `true` si se abrió.
   */
  open(t) {
    if (t) {
      if (t.nodeType === 1 || typeof t.getBoundingClientRect == "function")
        this._anchor = t;
      else if (Number.isFinite(t.x) && Number.isFinite(t.y)) {
        const { x: o, y: a } = t;
        this._anchor = { getBoundingClientRect: () => ({ top: a, bottom: a, left: o, right: o, width: 0, height: 0, x: o, y: a }) };
      }
      t.nodeType === 1 && this._triggerFrom(t) && this._setTrigger(t);
    }
    if (this.isOpen)
      return this.update(), !0;
    const e = this.element;
    if (!this._trigger) {
      const o = this._anchor && this._anchor.nodeType === 1 ? this._anchor : this.triggers[0];
      o && this._setTrigger(o);
    }
    const i = document.activeElement;
    this._returnFocus = i && i !== document.body && i.tabIndex >= 0 && !e.contains(i) ? i : this._trigger || i, clearTimeout(this._exitTimer), this._portal(), e.hidden = !1, this.isOpen = !0, this._trigger && this._trigger.setAttribute("aria-expanded", "true");
    const s = this._resolveAnchor(), r = C(s && s.nodeType === 1 ? s : null, e, () => this.update());
    return this._session.push(r), this._wasModal = this.modal, this._wasModal && N(e), I(this, {
      kind: this._wasModal ? "modal" : "popup",
      nodes: e,
      stack: [{ node: e }],
      onEscape: () => this.close({ reason: "escape" })
    }), e.offsetWidth, e.classList.add("mtx-popover--open"), this._focusInitial(), $(e, "mtx:popover:open", { popover: this, anchor: s }), !0;
  }
  /**
   * Cierra el popover.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.restoreFocus=true] Devuelve el foco al disparador.
   * @param {string} [options.reason='api'] Motivo (`escape`, `click-away`, `tab`, `trigger`, `action`, `api`).
   */
  close({ restoreFocus: t = !0, reason: e = "api" } = {}) {
    if (!this.isOpen) return;
    const i = this.element;
    this.isOpen = !1, this._session.forEach((s) => s()), this._session = [], this._wasModal && B(i), this._wasModal = !1, D(this), i.classList.remove("mtx-popover--open"), this._trigger && this._trigger.setAttribute("aria-expanded", "false"), t && this._restoreLostFocus(), clearTimeout(this._exitTimer), this._exitTimer = setTimeout(() => {
      this.isOpen || (i.hidden = !0);
    }, K), $(i, "mtx:popover:close", { popover: this, reason: e });
  }
  /**
   * Devuelve el foco al disparador si quedó perdido tras cerrar sin restauración.
   *
   * @private
   */
  _restoreLostFocus() {
    if (this.isOpen) return;
    const t = this._returnFocus && this._returnFocus.isConnected ? this._returnFocus : this._trigger;
    if (!t || typeof t.focus != "function") return;
    const e = document.activeElement;
    (!e || e === document.body || this.element.contains(e) || e.tabIndex < 0 && e.contains(t)) && t.focus();
  }
  /**
   * Alterna el estado.
   *
   * @param {HTMLElement|{x:number,y:number}} [anchor] Ancla opcional.
   */
  toggle(t) {
    this.isOpen ? this.close() : this.open(t);
  }
  /**
   * Cambia el disparador activo (para `aria-expanded`).
   *
   * @param {HTMLElement} trigger Disparador.
   * @private
   */
  _setTrigger(t) {
    this._trigger && this._trigger !== t && this._trigger.setAttribute("aria-expanded", "false"), this._trigger = t, this._anchor = this._anchor || t;
  }
  /**
   * Porta el popover a `<body>` (evita overflow/z-index de los ancestros); deja un marcador para restaurarlo.
   *
   * @private
   */
  _portal() {
    const t = this.element;
    t.parentElement !== document.body && (!this._placeholder && t.parentNode && (this._placeholder = document.createComment(`mtx-popover:${t.id}`), t.parentNode.insertBefore(this._placeholder, t), H(this, this._placeholder)), document.body.appendChild(t));
  }
  /**
   * Enfoca `[data-autofocus]`, el primer control o el propio panel.
   *
   * @private
   */
  _focusInitial() {
    const t = this.element, i = R(t.querySelector("[data-autofocus]")) || U(t)[0] || t.querySelector(J) || t;
    try {
      i.focus({ preventScroll: !0 });
    } catch {
      i.focus();
    }
  }
  /**
   * Indica si un nodo pertenece a una capa abierta después de este popover
   * (popover hijo, menú, select, diálogo abierto desde él, tooltip).
   *
   * @param {Node} node Nodo.
   * @returns {boolean} `true` si está en una capa superior.
   * @private
   */
  _inUpperLayer(t) {
    return t instanceof Element ? t.closest(".mtx-tooltip") ? !0 : q(this, t) : !1;
  }
  /**
   * Listeners de documento (clic fuera, Tab); solo actúan mientras está abierto.
   *
   * @private
   */
  _bindDocument() {
    const t = this.element;
    this._focusTimer = null, this._tabTimer = null, this.onDestroy(() => {
      clearTimeout(this._focusTimer), clearTimeout(this._tabTimer);
    });
    const e = (s) => {
      if (!this.isOpen) return;
      const r = s.target;
      t.contains(r) || this._inUpperLayer(r) || this._triggerFrom(r) || this._anchor && this._anchor.nodeType === 1 && this._anchor.contains(r) || (this.close({ restoreFocus: !1, reason: "click-away" }), clearTimeout(this._focusTimer), this._focusTimer = setTimeout(() => {
        this._focusTimer = null, this.destroyed || this._restoreLostFocus();
      }, 0));
    }, i = (s) => {
      if (!(!this.isOpen || s.key !== "Tab" || !z(this))) {
        if (this.modal) {
          k(s, t);
          return;
        }
        clearTimeout(this._tabTimer), this._tabTimer = setTimeout(() => {
          if (this._tabTimer = null, this.destroyed) return;
          const r = document.activeElement;
          this.isOpen && r && r !== document.body && !t.contains(r) && !this._inUpperLayer(r) && this.close({ restoreFocus: !1, reason: "tab" });
        }, 0);
      }
    };
    this.listen(document, "mousedown", e, !0), this.listen(document, "touchstart", e, !0), this.listen(document, "keydown", i);
  }
  /**
   * Recalcula la posición respecto del ancla.
   */
  update() {
    if (!this.isOpen) return;
    const t = this.element, e = this._resolveAnchor(), i = document.documentElement.clientWidth || window.innerWidth, s = document.documentElement.clientHeight || window.innerHeight, r = t.offsetWidth || t.getBoundingClientRect().width, o = t.offsetHeight || t.getBoundingClientRect().height;
    if (!e) {
      t.style.left = `${Math.max(n, (i - r) / 2)}px`, t.style.top = `${Math.max(n, (s - o) / 2)}px`, t.style.transformOrigin = "center center";
      return;
    }
    const a = this.element.getAttribute("data-anchor-origin"), p = this.element.getAttribute("data-transform-origin");
    if (a || p) {
      const m = e.getBoundingClientRect(), O = E(a, m.width, m.height, { vertical: "bottom", horizontal: "left" }), f = E(p, r, o, { vertical: "top", horizontal: "left" });
      let h = m.top + O.y - f.y, c = m.left + O.x - f.x, b = f.x, y = f.y;
      const F = h + o, w = c + r;
      if (h < n)
        y -= n - h, h = n;
      else if (F > s - n) {
        const d = F - (s - n);
        h -= d, y += d;
      }
      if (c < n)
        b -= n - c, c = n;
      else if (w > i - n) {
        const d = w - (i - n);
        c -= d, b += d;
      }
      t.style.top = `${Math.round(h)}px`, t.style.left = `${Math.round(c)}px`, t.style.transformOrigin = `${Math.round(b)}px ${Math.round(y)}px`, t.setAttribute("data-placement", "origin");
      return;
    }
    const u = parseFloat(this.element.getAttribute("data-offset")), l = P(e, t, {
      placement: this.element.getAttribute("data-placement") || "bottom-start",
      offset: Number.isFinite(u) ? u : 0,
      padding: n
    });
    t.style.left = `${l.x}px`, t.style.top = `${l.y}px`;
    const { side: g, align: x } = W(`${l.side}-${l.align}`), _ = g === "top" || g === "bottom", T = x === "start" ? _ ? "left" : "top" : x === "end" ? _ ? "right" : "bottom" : "center", A = { top: "bottom", bottom: "top", left: "right", right: "left" }[g];
    t.style.transformOrigin = _ ? `${T} ${A}` : `${A} ${T}`, t.setAttribute("data-placement", l.placement);
  }
  /**
   * Cierra, restaura la posición original en el DOM y libera listeners.
   */
  destroy() {
    this.close({ restoreFocus: !1, reason: "destroy" }), clearTimeout(this._exitTimer), this._exitTimer = null;
    const t = this.element.style;
    this.element.hidden = !0, t.left = "", t.top = "", t.transformOrigin = "", this._placeholder && this._placeholder.parentNode && (this._placeholder.parentNode.insertBefore(this.element, this._placeholder), this._placeholder.remove()), this._placeholder = null, super.destroy();
  }
}
L("popover", V);
G();
export {
  V as Popover
};
