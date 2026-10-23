import "./accordion.css";
import { r as h, C as f, j as c, v as p, d as g, g as y, q as x } from "../chunks/core-CJdkPtZx.js";
const b = '.mtx-accordion-group, [data-mtx="accordion-group"]', A = '.mtx-accordion, [data-mtx="accordion"]', E = '.mtx-accordion-actions, [data-mtx="accordion-actions"]', v = "expand_more", D = ["ArrowDown", "ArrowUp", "Home", "End"];
function S() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function L(a) {
  if (!a) return 0;
  const t = a / 36;
  return Math.round((4 + 15 * t ** 0.25 + t / 5) * 10);
}
function w() {
  return typeof document < "u" && !!document.body && "onbeforematch" in document.body;
}
function o(a, t) {
  return !a || !a.hasAttribute(t) ? null : a.getAttribute(t) !== "false";
}
function _(a) {
  const t = a.parentElement;
  if (!t) return null;
  const e = t.closest(b);
  if (!e) return null;
  const i = t.closest(".mtx-accordion");
  return i && e.contains(i) ? null : e;
}
function u(a) {
  return Array.from(a.querySelectorAll(A)).filter((t) => _(t) === a);
}
function m(a) {
  return !!a && a.getAttribute("data-exclusive") !== "false";
}
class C extends f {
  /**
   * Crea el acordeón y genera su estructura si falta.
   * @param {HTMLElement} element Raíz (`<div>` o `<details>`).
   */
  constructor(t) {
    super(t), this._isDetails = t.tagName === "DETAILS", this._group = _(t), this._timer = null, this._untilFound = !this._isDetails && w(), t.classList.add("mtx-accordion"), this._applyOptions(), this._isDetails ? this._scaffoldDetails() : this._scaffoldDiv(), this._linkAria();
    let e = this._readInitialExpanded();
    e && m(this._group) && this._siblings().some((n) => {
      var s;
      return (s = c(n)) == null ? void 0 : s.expanded;
    }) && (e = !1), this._expanded = !e, this._setState(e, { animate: !1, emit: !1 });
    const i = o(t, "data-disabled") === !0 || t.classList.contains("mtx-accordion--disabled") || this.summary.disabled === !0 || this.summary.getAttribute("aria-disabled") === "true";
    this._setDisabled(i), this._bindEvents();
  }
  /** Traduce los atributos `data-*` (propios o heredados del grupo) a clases. */
  _applyOptions() {
    const t = this.element, e = this._group, i = (l) => t.hasAttribute(l) ? t : e && e.hasAttribute(l) ? e : null, n = i("data-variant");
    n && n.getAttribute("data-variant") === "outlined" && t.classList.add("mtx-accordion--outlined"), o(i("data-square"), "data-square") && t.classList.add("mtx-accordion--square");
    const s = i("data-summary-style");
    s && s.getAttribute("data-summary-style") === "plain" && t.classList.add("mtx-accordion--plain-summary"), o(i("data-disable-gutters"), "data-disable-gutters") && t.classList.add("mtx-accordion--disable-gutters");
    const r = i("data-elevation"), d = r ? r.getAttribute("data-elevation") : "";
    d !== "" && d !== null && t.classList.add(`mtx-accordion--elevation-${d}`);
  }
  /** Construye cabecera, resumen y región para la forma `<div>`. */
  _scaffoldDiv() {
    const t = this.element;
    let e = t.querySelector(":scope > .mtx-accordion__summary, :scope > .mtx-accordion__heading > .mtx-accordion__summary");
    if (!e) {
      e = document.createElement("button"), e.className = "mtx-accordion__summary";
      const i = document.createElement("span");
      i.className = "mtx-accordion__summary-content", i.textContent = t.getAttribute("data-summary") || "", e.appendChild(i);
      const n = t.getAttribute("data-heading-level") || "3";
      let s = e;
      /^[1-6]$/.test(n) && (s = document.createElement(`h${n}`), s.className = "mtx-accordion__heading", s.appendChild(e)), t.insertBefore(s, t.firstChild);
    }
    e.tagName === "BUTTON" && !e.hasAttribute("type") && (e.type = "button"), this.summary = e, this.heading = e.parentElement !== t ? e.parentElement : null, this._ensureSummaryParts(), this._ensureRegion(this.heading || e);
  }
  /** Mejora un `<details>` existente: el `<summary>` nativo hace de AccordionSummary. */
  _scaffoldDetails() {
    const t = this.element;
    let e = t.querySelector(":scope > summary");
    if (!e) {
      e = document.createElement("summary");
      const i = document.createElement("span");
      i.className = "mtx-accordion__summary-content", i.textContent = t.getAttribute("data-summary") || "", e.appendChild(i), t.insertBefore(e, t.firstChild);
    }
    e.classList.add("mtx-accordion__summary"), this.summary = e, this.heading = null, this._ensureSummaryParts(), this._ensureRegion(e);
  }
  /** Garantiza el contenedor de texto y el icono de expansión dentro del resumen. */
  _ensureSummaryParts() {
    const t = this.summary;
    let e = t.querySelector(":scope > .mtx-accordion__expand-icon"), i = t.querySelector(":scope > .mtx-accordion__summary-content");
    i || (i = document.createElement("span"), i.className = "mtx-accordion__summary-content", Array.from(t.childNodes).filter((s) => s !== e).forEach((s) => i.appendChild(s)), t.insertBefore(i, t.firstChild));
    const n = this.element.getAttribute("data-expand-icon");
    if (!e && n !== "false" && n !== "none") {
      e = document.createElement("span"), e.className = "mtx-accordion__expand-icon", e.setAttribute("aria-hidden", "true");
      const s = document.createElement("span");
      s.className = "material-icons", s.textContent = n || v, e.appendChild(s), t.appendChild(e);
    } else e && !e.hasAttribute("aria-hidden") && e.setAttribute("aria-hidden", "true");
    this.content = i, this.expandIcon = e || null;
  }
  /**
   * Garantiza la región colapsable con AccordionDetails y AccordionActions.
   * @param {HTMLElement} header Nodo de cabecera que no debe moverse.
   */
  _ensureRegion(t) {
    const e = this.element;
    let i = e.querySelector(":scope > .mtx-accordion__region");
    if (!i) {
      i = document.createElement("div"), i.className = "mtx-accordion__region";
      let n = e.querySelector(":scope > .mtx-accordion__details");
      const s = Array.from(e.children).filter((r) => r.matches(E));
      n || (n = document.createElement("div"), n.className = "mtx-accordion__details", Array.from(e.childNodes).filter((r) => r !== t && !s.includes(r)).forEach((r) => n.appendChild(r))), i.appendChild(n), s.forEach((r) => i.appendChild(r)), e.appendChild(i);
    }
    i.querySelectorAll(':scope > [data-mtx="accordion-actions"]').forEach((n) => n.classList.add("mtx-accordion-actions")), this.region = i, this.details = i.querySelector(":scope > .mtx-accordion__details");
  }
  /** Enlaza resumen y región con `aria-controls` / `aria-labelledby`. */
  _linkAria() {
    const t = this.element.id || p("mtx-accordion");
    this.summary.id || (this.summary.id = `${t}-summary`), this.region.id || (this.region.id = `${t}-region`), this.summary.setAttribute("aria-controls", this.region.id), this.region.setAttribute("role", "region"), this.region.setAttribute("aria-labelledby", this.summary.id);
  }
  /** @returns {boolean} Estado inicial declarado. */
  _readInitialExpanded() {
    const t = o(this.element, "data-expanded");
    return t !== null ? t : this._isDetails ? this.element.open === !0 : this.element.classList.contains("mtx-accordion--expanded") || this.summary.getAttribute("aria-expanded") === "true";
  }
  /** Registra los listeners de interacción. */
  _bindEvents() {
    this._handleClick = (t) => {
      if (this._isDetails && t.preventDefault(), this.disabled) {
        t.preventDefault();
        return;
      }
      this._setState(!this._expanded, { animate: !0, emit: !0 });
    }, this.summary.addEventListener("click", this._handleClick), this._handleKeyDown = (t) => this._onKeyDown(t), this.summary.addEventListener("keydown", this._handleKeyDown), o(this.element, "data-ripple") && (this._handlePointerDown = (t) => {
      this.disabled || t.button !== 0 || g(this.summary, t);
    }, this.summary.addEventListener("pointerdown", this._handlePointerDown)), this._isDetails ? (this._handleToggle = () => {
      this._timer || this.element.open === this._expanded || this._setState(this.element.open, { animate: !1, emit: !0 });
    }, this.element.addEventListener("toggle", this._handleToggle)) : (this._handleBeforeMatch = () => this._setState(!0, { animate: !1, emit: !0 }), this.region.addEventListener("beforematch", this._handleBeforeMatch));
  }
  /**
   * Navegación WAI-ARIA entre resúmenes de un mismo grupo (flechas, Home, End).
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(t) {
    if (!this._group || !D.includes(t.key)) return;
    const e = u(this._group).map((s) => c(s)).filter((s) => s && s.summary && !s.disabled).map((s) => s.summary);
    if (e.length < 2) return;
    const i = e.indexOf(this.summary);
    let n;
    t.key === "Home" ? n = 0 : t.key === "End" ? n = e.length - 1 : t.key === "ArrowDown" ? n = (i + 1) % e.length : n = (i - 1 + e.length) % e.length, t.preventDefault(), e[n].focus();
  }
  /** @returns {HTMLElement[]} Otros acordeones del mismo grupo. */
  _siblings() {
    return this._group ? u(this._group).filter((t) => t !== this.element) : [];
  }
  /**
   * Cambia el estado expandido, anima la región y notifica.
   * @param {boolean} expanded Nuevo estado.
   * @param {{animate: boolean, emit: boolean}} options Opciones.
   */
  _setState(t, { animate: e, emit: i }) {
    t !== this._expanded && (this._expanded = t, this.element.classList.toggle("mtx-accordion--expanded", t), this.summary.setAttribute("aria-expanded", String(t)), this._transition(t, e), t && m(this._group) && this._siblings().forEach((n) => {
      const s = c(n);
      s && s !== this && s.expanded && s._setState(!1, { animate: e, emit: i });
    }), i && y(this.element, "mtx:accordion:change", { expanded: t }));
  }
  /** @returns {number|null} Duración fija declarada en `data-duration`, o `null` para automática. */
  _fixedDuration() {
    const t = this.element.getAttribute("data-duration");
    if (t === null || t === "" || t === "auto") return null;
    const e = Number(t);
    return Number.isFinite(e) && e >= 0 ? e : null;
  }
  /**
   * Transición de altura (Collapse) de la región.
   * @param {boolean} expanding `true` al expandir.
   * @param {boolean} animate `false` aplica el estado al instante.
   */
  _transition(t, e) {
    const i = this.region;
    clearTimeout(this._timer), this._timer = null;
    const n = this._fixedDuration();
    if (!e || S() || n === 0) {
      this._finish(t);
      return;
    }
    const r = (this._isDetails ? !this.element.open : i.hasAttribute("hidden")) ? 0 : i.getBoundingClientRect().height;
    t && this._show();
    const d = t ? i.scrollHeight : 0, l = n ?? L(Math.abs(d - r));
    if (!l) {
      this._finish(t);
      return;
    }
    i.style.overflow = "hidden", i.style.transition = "none", i.style.height = `${r}px`, i.offsetHeight, i.style.transition = `height ${l}ms var(--mtx-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))`, i.style.height = `${d}px`, this._timer = setTimeout(() => {
      this._timer = null, this._finish(t);
    }, l);
  }
  /**
   * Fija el estado final de la región y limpia estilos en línea.
   * @param {boolean} expanded Estado final.
   */
  _finish(t) {
    const e = this.region.style;
    e.height = "", e.overflow = "", e.transition = "", t ? this._show() : this._hide();
  }
  /** Muestra la región. */
  _show() {
    this._isDetails ? this.element.open || (this.element.open = !0) : this.region.removeAttribute("hidden");
  }
  /** Oculta la región (con `until-found` cuando el navegador lo soporta). */
  _hide() {
    this._isDetails ? this.element.open && (this.element.open = !1) : this.region.setAttribute("hidden", this._untilFound ? "until-found" : "");
  }
  /**
   * Aplica el estado deshabilitado en raíz y resumen.
   * @param {boolean} disabled Nuevo estado.
   */
  _setDisabled(t) {
    this._disabled = t, this.element.classList.toggle("mtx-accordion--disabled", t), this.summary.tagName === "BUTTON" ? this.summary.disabled = t : t ? (this.summary.setAttribute("aria-disabled", "true"), this.summary.setAttribute("tabindex", "-1")) : (this.summary.removeAttribute("aria-disabled"), this.summary.removeAttribute("tabindex"));
  }
  /** @returns {boolean} `true` si el panel está expandido. */
  get expanded() {
    return this._expanded;
  }
  /** @param {boolean} value Expande (`true`) o contrae (`false`) con animación. */
  set expanded(t) {
    this._setState(!!t, { animate: !0, emit: !0 });
  }
  /** Expande el panel. */
  expand() {
    this._setState(!0, { animate: !0, emit: !0 });
  }
  /** Contrae el panel. */
  collapse() {
    this._setState(!1, { animate: !0, emit: !0 });
  }
  /** Alterna el panel. */
  toggle() {
    this._setState(!this._expanded, { animate: !0, emit: !0 });
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this._disabled === !0;
  }
  /** Deshabilita el panel (no se puede alternar). */
  disable() {
    this._setDisabled(!0);
  }
  /** Habilita el panel. */
  enable() {
    this._setDisabled(!1);
  }
  /** Elimina listeners y temporizadores. */
  destroy() {
    this._timer && (clearTimeout(this._timer), this._timer = null, this._finish(this._expanded)), this.summary.removeEventListener("click", this._handleClick), this.summary.removeEventListener("keydown", this._handleKeyDown), this._handlePointerDown && this.summary.removeEventListener("pointerdown", this._handlePointerDown), this._handleToggle && this.element.removeEventListener("toggle", this._handleToggle), this._handleBeforeMatch && this.region.removeEventListener("beforematch", this._handleBeforeMatch), super.destroy();
  }
}
class N extends f {
  /**
   * Crea el grupo y normaliza el estado inicial si es exclusivo.
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-accordion-group"), this.exclusive && this._normalizeInitial();
  }
  /** Deja abierto solo el primer panel declarado como expandido. */
  _normalizeInitial() {
    let t = !1;
    u(this.element).forEach((e) => {
      const i = c(e);
      if (i ? i.expanded : o(e, "data-expanded") === !0 || e.tagName === "DETAILS" && e.open || e.classList.contains("mtx-accordion--expanded")) {
        if (!t) {
          t = !0;
          return;
        }
        i ? i._setState(!1, { animate: !1, emit: !1 }) : (e.setAttribute("data-expanded", "false"), e.classList.remove("mtx-accordion--expanded"), e.tagName === "DETAILS" && (e.open = !1));
      }
    });
  }
  /** @returns {boolean} `true` si solo puede haber un panel abierto. */
  get exclusive() {
    return m(this.element);
  }
  /** @returns {Accordion[]} Instancias de los acordeones del grupo. */
  get accordions() {
    return u(this.element).map((t) => c(t)).filter(Boolean);
  }
  /** Expande todos los paneles (solo en grupos no exclusivos). */
  expandAll() {
    this.exclusive || this.accordions.forEach((t) => !t.disabled && t.expand());
  }
  /** Contrae todos los paneles. */
  collapseAll() {
    this.accordions.forEach((t) => t.collapse());
  }
}
class T extends f {
  /**
   * @param {HTMLElement} element Contenedor de acciones.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-accordion-actions"), o(t, "data-disable-spacing") && t.classList.add("mtx-accordion-actions--disable-spacing");
  }
}
h("accordion", C);
h("accordion-group", N);
h("accordion-actions", T);
x();
export {
  C as Accordion,
  T as AccordionActions,
  N as AccordionGroup
};
