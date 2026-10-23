import { r as I, C as U, j as L, x as q, y as $, v as M, z as R, b as j, g as E, A as k, c as z, B as P, o as F } from "./core-CJdkPtZx.js";
const G = '[data-mtx-tooltip], [data-mtx="tooltip"]', O = 'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]', n = {
  placement: "bottom",
  enterDelay: 100,
  enterNextDelay: 0,
  leaveDelay: 0,
  enterTouchDelay: 700,
  leaveTouchDelay: 1500,
  hysteresis: 800,
  offset: 14,
  touchOffset: 24,
  exitDuration: 150
}, m = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new Set();
let g = !1, u = null, b = !1;
function K(i, t) {
  return i.hasAttribute(t) ? i.getAttribute(t) !== "false" : null;
}
function W(i) {
  const t = i.cloneNode(!0);
  t.querySelectorAll('[aria-hidden="true"], .material-icons, [class*="material-symbols"], .mtx-ripple, script, style').forEach((r) => r.remove());
  const e = Array.from(t.querySelectorAll("img[alt]")).map((r) => r.getAttribute("alt")).join(" ");
  return `${t.textContent || ""} ${e}`.replace(/\s+/g, " ").trim();
}
function x(i) {
  const t = (i.getAttribute("aria-label") || "").trim();
  if (t) return t;
  const e = (i.getAttribute("aria-labelledby") || "").trim();
  if (e) {
    const r = e.split(/\s+/).map((s) => document.getElementById(s)).filter(Boolean).map((s) => s.textContent.trim()).join(" ").trim();
    if (r) return r;
  }
  if (i.labels && i.labels.length) {
    const r = Array.from(i.labels).map((s) => s.textContent.trim()).join(" ").trim();
    if (r) return r;
  }
  return i.tagName === "IMG" ? (i.getAttribute("alt") || "").trim() : /^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName) ? (i.getAttribute("title") || i.getAttribute("placeholder") || "").trim() : W(i) || (i.getAttribute("title") || "").trim();
}
function v(i) {
  return String(i || "").replace(/\s+/g, " ").trim().toLowerCase();
}
function C(i, t, e, r) {
  const s = (i.getAttribute(t) || "").split(/\s+/).filter(Boolean).filter((o) => o !== e);
  r && s.push(e), s.length ? i.setAttribute(t, s.join(" ")) : i.removeAttribute(t);
}
class A extends U {
  /**
   * Crea el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador o contenedor `data-mtx="tooltip"`.
   * @param {Object} [options] Opciones que prevalecen sobre los atributos.
   * @param {string} [options.title] Texto del tooltip.
   * @param {string} [options.placement] Colocación (`top|bottom|left|right` + `-start|-end`).
   * @param {boolean} [options.arrow] Muestra la flecha.
   * @param {number} [options.enterDelay] Retardo de apertura (ms).
   * @param {number} [options.leaveDelay] Retardo de cierre (ms).
   * @param {boolean} [options.followCursor] Sigue al puntero.
   * @param {boolean} [options.declarative] Uso interno: no ocupa el registro del elemento.
   */
  constructor(t, e = {}) {
    const r = L(t), s = t.hasAttribute("data-mtx-initialized");
    super(t), this._declarative = !!e.declarative, this._declarative && (r ? q(t, r) : $(t), s || t.removeAttribute("data-mtx-initialized"), m.set(t, this)), this.options = { ...e }, delete this.options.declarative, this.id = M("mtx-tooltip"), this.popup = null, this.isOpen = !1, this._timers = {}, this._pointer = null, this._touch = !1, this._stopAutoUpdate = null, this.syncAccessibleName();
  }
  /**
   * Elemento que recibe el foco y los atributos ARIA (el propio o su primer hijo enfocable).
   *
   * @returns {HTMLElement} Destino.
   */
  get target() {
    const t = this.element;
    return t.getAttribute("data-mtx") !== "tooltip" || t.matches(O) ? t : t.querySelector(O) || t.firstElementChild || t;
  }
  /**
   * Texto actual del tooltip.
   *
   * @returns {string} Título.
   */
  get title() {
    if (typeof this.options.title == "string") return this.options.title;
    const t = this.element;
    return t.getAttribute("data-mtx") === "tooltip" && t.hasAttribute("data-title") ? t.getAttribute("data-title") : t.getAttribute("data-mtx-tooltip") || t.getAttribute("data-title") || "";
  }
  /**
   * Lee una opción: objeto de opciones, `data-tooltip-{name}` o `data-{name}` (forma avanzada).
   *
   * @param {string} key Clave camelCase.
   * @param {string} attr Sufijo kebab-case del atributo.
   * @param {'string'|'number'|'boolean'} type Tipo esperado.
   * @returns {*} Valor o `undefined`.
   * @private
   */
  _option(t, e, r) {
    if (this.options[t] !== void 0) return this.options[t];
    const s = this.element, o = [`data-tooltip-${e}`];
    s.getAttribute("data-mtx") === "tooltip" && o.push(`data-${e}`);
    for (const l of o) {
      if (!s.hasAttribute(l)) continue;
      if (r === "boolean") return K(s, l);
      const h = s.getAttribute(l);
      if (r === "number") {
        const w = parseInt(h, 10);
        if (!Number.isNaN(w)) return w;
        continue;
      }
      if (h) return h;
    }
  }
  /** @returns {string} Colocación configurada. */
  get placement() {
    return this._option("placement", "placement", "string") || n.placement;
  }
  /** @returns {boolean} Si muestra flecha. */
  get arrow() {
    return this._option("arrow", "arrow", "boolean") === !0;
  }
  /** @returns {boolean} Si sigue al cursor. */
  get followCursor() {
    return this._option("followCursor", "follow-cursor", "boolean") === !0;
  }
  /** @returns {number} Retardo de apertura (ms). */
  get enterDelay() {
    const t = this._option("enterDelay", "enter-delay", "number");
    return t === void 0 ? n.enterDelay : Math.max(0, t);
  }
  /** @returns {number} Retardo de cierre (ms). */
  get leaveDelay() {
    const t = this._option("leaveDelay", "leave-delay", "number");
    return t === void 0 ? n.leaveDelay : Math.max(0, t);
  }
  /**
   * Si el disparador no tiene nombre accesible, usa el título como `aria-label`.
   * Si lo puso Materix antes, lo mantiene sincronizado con el título.
   */
  syncAccessibleName() {
    const t = this.target, e = this.title.trim();
    if (t.hasAttribute("data-mtx-tooltip-label")) {
      e && t.setAttribute("aria-label", e);
      return;
    }
    !e || x(t) || (t.setAttribute("aria-label", e), t.setAttribute("data-mtx-tooltip-label", ""));
  }
  /**
   * Cambia el texto del tooltip (y el `aria-label` si lo generó Materix).
   *
   * @param {string} title Nuevo texto.
   */
  setTitle(t) {
    const e = String(t ?? ""), r = this.element;
    typeof this.options.title == "string" ? this.options.title = e : r.getAttribute("data-mtx") === "tooltip" ? r.setAttribute("data-title", e) : r.setAttribute("data-mtx-tooltip", e), this.refresh();
  }
  /**
   * Relee el título: sincroniza el nombre accesible y el texto visible (sin escribir atributos de título).
   */
  refresh() {
    const t = this.title;
    this.syncAccessibleName(), this.popup && (this.popup.querySelector(".mtx-tooltip__label").textContent = t), t.trim() ? this.isOpen && this.update() : this.close({ immediate: !0 });
  }
  /**
   * Programa la apertura con el retardo correspondiente (MUI: 0 si otro tooltip acaba de cerrarse).
   *
   * @param {'hover'|'focus'|'touch'} reason Origen.
   * @private
   */
  _scheduleOpen(t) {
    if (this._clearTimer("leave"), this.isOpen && !this._closing) return;
    let e = g ? n.enterNextDelay : this.enterDelay;
    t === "touch" && (e = n.enterTouchDelay), this._clearTimer("enter");
    const r = () => this.open({ touch: t === "touch" });
    e <= 0 ? r() : this._timers.enter = setTimeout(r, e);
  }
  /**
   * Programa el cierre (mouseleave / fin de pulsación larga).
   *
   * @param {number} [delay] Retardo (ms); por defecto `leaveDelay`.
   * @private
   */
  _scheduleClose(t = this.leaveDelay) {
    this._clearTimer("enter"), this.isOpen && (this._clearTimer("leave"), t <= 0 ? this.close() : this._timers.leave = setTimeout(() => this.close(), t));
  }
  /**
   * Cancela un temporizador.
   *
   * @param {string} name Nombre.
   * @private
   */
  _clearTimer(t) {
    this._timers[t] && (clearTimeout(this._timers[t]), this._timers[t] = null);
  }
  /**
   * Crea la superficie `role="tooltip"` portada a `<body>`.
   *
   * @returns {HTMLElement} Superficie.
   * @private
   */
  _createPopup() {
    const t = document.createElement("div");
    t.className = "mtx-tooltip", t.id = this.id, t.setAttribute("role", "tooltip");
    const e = document.createElement("span");
    return e.className = "mtx-tooltip__label", t.appendChild(e), _.set(t, this), t;
  }
  /**
   * Muestra el tooltip de inmediato.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.touch=false] Estilo táctil (fuente mayor, más separación).
   * @returns {boolean} `true` si se mostró.
   */
  open({ touch: t = !1 } = {}) {
    this._clearTimer("enter"), this._clearTimer("leave"), this._clearTimer("exit");
    const e = this.title;
    if (!e.trim() || !this.element.isConnected) return !1;
    p.forEach((l) => {
      l !== this && l.close({ immediate: !0 });
    }), this.popup || (this.popup = this._createPopup());
    const r = this.popup;
    r.querySelector(".mtx-tooltip__label").textContent = e, this._touch = t, r.classList.toggle("mtx-tooltip--touch", t), r.classList.toggle("mtx-tooltip--arrow", this.arrow);
    let s = r.querySelector(".mtx-tooltip__arrow");
    this.arrow && !s ? (s = document.createElement("span"), s.className = "mtx-tooltip__arrow", s.setAttribute("aria-hidden", "true"), r.appendChild(s)) : !this.arrow && s && s.remove(), r.isConnected || document.body.appendChild(r);
    const o = this.isOpen && !this._closing;
    return this.isOpen = !0, this._closing = !1, p.add(this), R(this, { kind: "tooltip", nodes: () => this.popup, onEscape: () => this.close() }), this._setDescribedBy(!0), this._stopAutoUpdate && this._stopAutoUpdate(), this._stopAutoUpdate = j(this.target, r, () => this.update()), o || (r.offsetWidth, r.classList.add("mtx-tooltip--open"), g = !0, u && clearTimeout(u), u = null, E(this.element, "mtx:tooltip:open", { tooltip: this })), !0;
  }
  /**
   * Oculta el tooltip.
   *
   * @param {Object} [options] Opciones.
   * @param {boolean} [options.immediate=false] Retira la superficie sin transición.
   */
  close({ immediate: t = !1 } = {}) {
    if (this._clearTimer("enter"), this._clearTimer("leave"), !this.isOpen) return;
    const e = this.popup;
    this.isOpen = !1, this._closing = !t, p.delete(this), k(this), this._setDescribedBy(!1), this._stopAutoUpdate && (this._stopAutoUpdate(), this._stopAutoUpdate = null), e && e.classList.remove("mtx-tooltip--open");
    const r = () => {
      this._closing = !1, this._clearTimer("exit"), !this.isOpen && e && e.remove();
    };
    t ? r() : this._timers.exit = setTimeout(r, n.exitDuration), u && clearTimeout(u), u = setTimeout(() => {
      g = !1, u = null;
    }, n.hysteresis + this.leaveDelay), E(this.element, "mtx:tooltip:close", { tooltip: this });
  }
  /**
   * Alterna la visibilidad.
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /** Alias de `open()` (API de `Materix.tooltip`). */
  show() {
    return this.open();
  }
  /** Alias de `close()`. */
  hide() {
    this.close();
  }
  /**
   * Añade o retira `aria-describedby`. Se omite si el nombre accesible ya coincide con el título.
   *
   * @param {boolean} active `true` al abrir.
   * @private
   */
  _setDescribedBy(t) {
    const e = this.target;
    if (!t) {
      C(e, "aria-describedby", this.id, !1);
      return;
    }
    v(x(e)) !== v(this.title) && C(e, "aria-describedby", this.id, !0);
  }
  /**
   * Recalcula la posición (scroll, resize, cursor).
   */
  update() {
    const t = this.popup;
    if (!t || !this.isOpen) return;
    if (!this.element.isConnected) {
      this.close({ immediate: !0 });
      return;
    }
    const e = this._pointer, r = this.followCursor && e ? { getBoundingClientRect: () => ({ top: e.y, bottom: e.y, left: e.x, right: e.x, width: 0, height: 0, x: e.x, y: e.y }) } : this.target, s = this._touch ? n.touchOffset : n.offset, o = z(r, t, {
      placement: this.placement,
      offset: s,
      flip: !0,
      shift: !0,
      padding: 8,
      rtl: P(this.target)
    });
    t.style.left = `${o.x}px`, t.style.top = `${o.y}px`, t.style.setProperty("--mtx-tooltip-gap", `${s}px`), t.setAttribute("data-side", o.side), t.setAttribute("data-placement", o.placement);
    const l = t.querySelector(".mtx-tooltip__arrow");
    if (l) {
      const h = o.side === "top" || o.side === "bottom";
      l.style.left = h ? `calc(${o.arrowOffset}px - 0.5em)` : "", l.style.top = h ? "" : `calc(${o.arrowOffset}px - 0.5em)`;
    }
  }
  /**
   * Libera temporizadores, superficie y atributos. En la forma global no toca el registro.
   */
  destroy() {
    Object.keys(this._timers).forEach((e) => this._clearTimer(e)), this.close({ immediate: !0 }), this.popup && (this.popup.remove(), _.delete(this.popup), this.popup = null);
    const t = this.target;
    if (t.hasAttribute("data-mtx-tooltip-label") && (t.removeAttribute("aria-label"), t.removeAttribute("data-mtx-tooltip-label")), this._declarative) {
      m.delete(this.element);
      const e = this._cleanups || [];
      for (this._cleanups = []; e.length; )
        try {
          e.pop()();
        } catch {
        }
      this.destroyed = !0;
      return;
    }
    super.destroy();
  }
}
function a(i, t = !0) {
  if (!i || i.nodeType !== 1) return null;
  if (i.getAttribute("data-mtx") === "tooltip") {
    const r = L(i);
    return r instanceof A ? r : t ? F(i) : null;
  }
  const e = m.get(i);
  return e || !t || !i.hasAttribute("data-mtx-tooltip") ? e || null : new A(i, { declarative: !0 });
}
function f(i) {
  return i instanceof Element ? i.closest(G) : null;
}
function D(i) {
  const t = i instanceof Element ? i.closest(".mtx-tooltip") : null;
  return t && _.get(t) || null;
}
function N(i, t) {
  return t instanceof Node ? i.element.contains(t) || !!(i.popup && i.popup.contains(t)) : !1;
}
let c = null;
const T = {
  pointerover(i) {
    if (i.pointerType === "touch") return;
    const t = D(i.target);
    if (t) {
      t._clearTimer("leave"), t._closing && t.open({ touch: t._touch });
      return;
    }
    const e = f(i.target);
    if (!e) return;
    const r = a(e);
    r && (r.followCursor && (r._pointer = { x: i.clientX, y: i.clientY }), !(i.relatedTarget && N(r, i.relatedTarget) && (r.isOpen || r._timers.enter)) && r._scheduleOpen("hover"));
  },
  pointerout(i) {
    if (i.pointerType === "touch") return;
    const t = D(i.target), e = t ? null : f(i.target), r = t || e && a(e, !1);
    r && (i.relatedTarget && N(r, i.relatedTarget) || r._scheduleClose());
  },
  pointermove(i) {
    if (i.pointerType === "touch") return;
    const t = f(i.target), e = t && a(t, !1);
    !e || !e.followCursor || (e._pointer = { x: i.clientX, y: i.clientY }, e.isOpen && e.update());
  },
  pointerdown(i) {
    if (b = !1, i.pointerType !== "touch") return;
    const t = f(i.target);
    if (p.forEach((r) => {
      (!t || r.element !== t) && r.close();
    }), !t) return;
    const e = a(t);
    e && (c && clearTimeout(c.timer), c = { instance: e, timer: null }, e._clearTimer("leave"), c.timer = setTimeout(() => {
      e.open({ touch: !0 });
    }, n.enterTouchDelay));
  },
  pointerup(i) {
    if (i.pointerType !== "touch" || !c) return;
    const { instance: t, timer: e } = c;
    clearTimeout(e), c = null, t.isOpen && t._scheduleClose(n.leaveTouchDelay);
  },
  focusin(i) {
    const t = f(i.target);
    if (!t || !b) return;
    const e = a(t);
    e && e._scheduleOpen("focus");
  },
  focusout(i) {
    const t = f(i.target), e = t && a(t, !1);
    e && (i.relatedTarget && e.element.contains(i.relatedTarget) || e.close());
  },
  keydown(i) {
    i.key !== "Escape" && (i.metaKey || i.altKey || i.ctrlKey || (b = !0));
  }
};
T.pointercancel = T.pointerup;
let S = !1, y = null;
function d(i = document) {
  const t = [];
  i.nodeType === 1 && i.hasAttribute("data-mtx-tooltip") && t.push(i), i.querySelectorAll && t.push(...i.querySelectorAll("[data-mtx-tooltip]")), t.forEach((e) => {
    const r = m.get(e);
    if (r) {
      r.syncAccessibleName();
      return;
    }
    const s = (e.getAttribute("data-mtx-tooltip") || "").trim();
    e.hasAttribute("data-mtx-tooltip-label") ? s && e.setAttribute("aria-label", s) : s && !x(e) && (e.setAttribute("aria-label", s), e.setAttribute("data-mtx-tooltip-label", ""));
  });
}
function B() {
  if (S || typeof document > "u") return;
  S = !0, Object.entries(T).forEach(([t, e]) => {
    document.addEventListener(t, e, t === "focusin" || t === "focusout" ? void 0 : !0);
  });
  const i = () => {
    d(document), !(typeof MutationObserver > "u" || y) && (y = new MutationObserver((t) => {
      t.forEach((e) => {
        if (e.type === "attributes") {
          const r = e.target;
          d(r);
          const s = m.get(r);
          s && s.refresh();
          return;
        }
        e.addedNodes.forEach((r) => {
          r.nodeType === 1 && d(r);
        }), e.removedNodes.length && p.size && Array.from(p).forEach((r) => {
          (!r.target || !r.target.isConnected) && r.close({ immediate: !0 });
        });
      });
    }), y.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-mtx-tooltip"]
    }));
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i, { once: !0 }) : i();
}
const Y = {
  /**
   * Muestra el tooltip de un disparador al instante.
   *
   * @param {HTMLElement} element Disparador.
   * @param {{touch?: boolean}} [options] Opciones (`touch`).
   * @returns {Tooltip|null} Instancia.
   */
  show(i, t) {
    const e = a(i);
    return e && e.open(t), e;
  },
  /**
   * Oculta el tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   */
  hide(i) {
    const t = a(i, !1);
    t && t.close();
  },
  /** Oculta todos los tooltips visibles. */
  hideAll() {
    Array.from(p).forEach((i) => i.close({ immediate: !0 }));
  },
  /**
   * Obtiene (o crea) la instancia del tooltip de un disparador.
   *
   * @param {HTMLElement} element Disparador.
   * @returns {Tooltip|null} Instancia.
   */
  get(i) {
    return a(i);
  },
  /**
   * Fuerza la sincronización de `aria-label` en un contenedor (contenido añadido sin observador).
   *
   * @param {Document|HTMLElement} [root=document] Contenedor.
   */
  sync(i) {
    d(i || document);
  },
  /** Instala la delegación global (se hace automáticamente al importar). */
  install: B
};
I("tooltip", A);
B();
export {
  A as T,
  a,
  x as g,
  Y as t
};
