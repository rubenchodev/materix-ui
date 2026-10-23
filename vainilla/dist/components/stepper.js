import "./progress.css";
import "./button.css";
import "./stepper.css";
import { r as L, d as w, g as k, h as q, t as u, o as A, j as N, C as I, q as M } from "../chunks/core-CJdkPtZx.js";
const D = "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z", $ = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", C = "http://www.w3.org/2000/svg", z = ["next", "back", "reset"];
function y(p, t) {
  const e = document.createElementNS(C, "svg");
  e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("class", t), e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
  const s = document.createElementNS(C, "path");
  return s.setAttribute("d", p), e.appendChild(s), e;
}
function l(p, t, e) {
  const s = document.createElement(p);
  return t && (s.className = t), e !== void 0 && (s.textContent = e), s;
}
function b(p, t) {
  return p.hasAttribute(t) ? p.getAttribute(t) !== "false" : null;
}
function B(p) {
  const t = p.getAttribute("data-target"), e = t ? document.querySelector(t) : p.closest(".mtx-stepper, .mtx-mobile-stepper");
  return e && N(e) || null;
}
let S = !1;
function T() {
  S || typeof document > "u" || (S = !0, document.addEventListener("click", (p) => {
    const t = p.target.closest && p.target.closest("[data-mtx-stepper-action]");
    if (!t || t.disabled || t.getAttribute("aria-disabled") === "true") return;
    const e = t.getAttribute("data-mtx-stepper-action"), s = B(t);
    !s || !z.includes(e) || typeof s[e] != "function" || (p.preventDefault(), s[e]());
  }));
}
class E extends I {
  /**
   * Número de posiciones navegables (pasos).
   * @returns {number} Total de pasos.
   */
  get length() {
    return 0;
  }
  /** @returns {number} Índice del paso activo (igual a `length` al terminar). */
  get activeStep() {
    return this._active;
  }
  /** @param {number} index Nuevo índice activo. */
  set activeStep(t) {
    this.goTo(t);
  }
  /**
   * Indica si un paso no puede activarse.
   * @param {number} index Índice.
   * @returns {boolean} `true` si está deshabilitado.
   */
  _isDisabled(t) {
    return !1;
  }
  /**
   * Índice máximo alcanzable.
   * @returns {number} Límite superior.
   */
  _maxIndex() {
    return this.length;
  }
  /**
   * Activa un paso emitiendo `mtx:stepper:change` (cancelable).
   * @param {number} index Índice destino.
   * @param {{emit?: boolean}} [options] Opciones.
   * @returns {boolean} `true` si el paso activo cambió.
   */
  goTo(t, { emit: e = !0 } = {}) {
    const s = Math.round(Number(t));
    if (!Number.isFinite(s) || s < 0 || s > this._maxIndex() || s === this._active || s < this.length && this._isDisabled(s)) return !1;
    const i = this._active;
    return e && !k(this.element, "mtx:stepper:change", {
      activeStep: s,
      previousStep: i
    }, { cancelable: !0 }) ? !1 : (this._active = s, this.element.setAttribute("data-active-step", String(s)), this._render(), !0);
  }
  /**
   * Avanza al siguiente paso habilitado.
   * @returns {boolean} `true` si avanzó.
   */
  next() {
    let t = this._active + 1;
    for (; t < this.length && this._isDisabled(t); ) t += 1;
    return this.goTo(t);
  }
  /**
   * Retrocede al paso habilitado anterior.
   * @returns {boolean} `true` si retrocedió.
   */
  back() {
    let t = this._active - 1;
    for (; t > 0 && this._isDisabled(t); ) t -= 1;
    return this.goTo(t);
  }
  /**
   * Sincroniza los disparadores declarativos (`back` deshabilitado en el primer paso, `next` en el último índice alcanzable).
   */
  _syncTriggers() {
    Array.from(document.querySelectorAll("[data-mtx-stepper-action]")).filter((e) => (e.hasAttribute("data-target") || this.element.contains(e)) && B(e) === this).forEach((e) => {
      if (e.hasAttribute("data-keep-enabled")) return;
      const s = e.getAttribute("data-mtx-stepper-action");
      let i = !1;
      s === "back" && (i = this._active <= 0), s === "next" && (i = this._active >= this._maxIndex()), (s === "back" || s === "next") && (e.disabled = i);
    });
  }
  /** Repinta el estado (lo implementa cada componente). */
  _render() {
  }
}
class O extends E {
  /**
   * Crea una instancia del stepper.
   * @param {HTMLElement} element Elemento `<ol>` raíz.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-stepper"), this.orientation = t.getAttribute("data-orientation") === "vertical" ? "vertical" : "horizontal", this.alternativeLabel = this.orientation === "horizontal" && b(t, "data-alternative-label") === !0, this.nonLinear = b(t, "data-non-linear") === !0, t.classList.add(`mtx-stepper--${this.orientation}`), t.classList.toggle("mtx-stepper--alternative-label", this.alternativeLabel), t.classList.toggle("mtx-stepper--non-linear", this.nonLinear), t.tagName !== "OL" && t.tagName !== "UL" && !t.hasAttribute("role") && t.setAttribute("role", "list"), t.hasAttribute("data-label") && !t.hasAttribute("aria-label") && t.setAttribute("aria-label", t.getAttribute("data-label")), this._state = [], this.refresh({ render: !1 });
    const e = parseInt(t.getAttribute("data-active-step") || "0", 10);
    this._active = Number.isFinite(e) ? Math.min(Math.max(e, 0), this.length) : 0, this._handleClick = (s) => {
      const i = s.target.closest(".mtx-step-button");
      if (!i || !this.element.contains(i) || i.disabled) return;
      const r = this.steps.indexOf(i.closest(".mtx-step"));
      r >= 0 && this.goTo(r);
    }, this._handlePointerDown = (s) => {
      const i = s.target.closest(".mtx-step-button");
      !i || i.disabled || s.button !== 0 || w(i, s);
    }, this._handleLocaleChange = () => this._render(), t.addEventListener("click", this._handleClick), t.addEventListener("pointerdown", this._handlePointerDown), this.listen(document, "mtx:locale:change", this._handleLocaleChange), T(), this._render();
  }
  /** @returns {number} Número de pasos. */
  get length() {
    return this.steps.length;
  }
  /**
   * Vuelve a leer los `<li>` (pasos añadidos o quitados dinámicamente) y su estado `data-*`.
   * @param {{render?: boolean}} [options] Opciones.
   */
  refresh({ render: t = !0 } = {}) {
    this.steps = Array.from(this.element.children).filter((e) => e.tagName === "LI" || e.classList.contains("mtx-step")), this._state = this.steps.map((e) => {
      const s = e.getAttribute("data-error");
      return {
        completed: b(e, "data-completed"),
        error: s === null || s === "false" ? !1 : s,
        disabled: b(e, "data-disabled") === !0
      };
    }), this.steps.forEach((e, s) => this._scaffold(e, s)), t && (this._active = Math.min(this._active, this.length), this._render());
  }
  /**
   * Construye (o reutiliza en BEM manual) la anatomía de un paso.
   * @param {HTMLElement} step Elemento `<li>`.
   * @param {number} index Índice.
   */
  _scaffold(t, e) {
    t.classList.add("mtx-step"), t.tagName !== "LI" && !t.hasAttribute("role") && t.setAttribute("role", "listitem");
    let s = t.querySelector(":scope > .mtx-step__label-container");
    if (!s) {
      const c = Array.from(t.childNodes).filter((o) => !(o.nodeType === 1 && o.classList.contains("mtx-step-connector"))), h = c.some((o) => o.nodeType === 1 && !o.classList.contains("mtx-step__content"));
      let d = t.getAttribute("data-label");
      d === null && !h && (d = t.textContent.trim(), c.forEach((o) => {
        o.nodeType === 3 && o.remove();
      }));
      const _ = Array.from(t.childNodes).filter((o) => !(o.nodeType === 1 && (o.classList.contains("mtx-step-connector") || o.classList.contains("mtx-step__content"))) && !(o.nodeType === 3 && !o.textContent.trim()));
      if (s = l("span", "mtx-step__label-container"), s.appendChild(l("span", "mtx-step__label", d || "")), _.length && !t.querySelector(":scope > .mtx-step__content")) {
        const o = l("div", "mtx-step__content"), f = l("div", "mtx-step__content-inner");
        _.forEach((m) => f.appendChild(m)), o.appendChild(f), t.appendChild(o);
      }
      t.insertBefore(s, t.querySelector(":scope > .mtx-step__content"));
    }
    if (this.nonLinear && s.tagName !== "BUTTON") {
      const c = l("button", s.className);
      for (c.type = "button"; s.firstChild; ) c.appendChild(s.firstChild);
      s.replaceWith(c), s = c;
    }
    s.tagName === "BUTTON" && s.classList.add("mtx-step-button");
    let i = s.querySelector(".mtx-step__label");
    i || (i = l("span", "mtx-step__label", t.getAttribute("data-label") || ""), s.appendChild(i));
    let r = s.querySelector(".mtx-step__label-text");
    r || (r = l("span", "mtx-step__label-text"), i.replaceWith(r), r.appendChild(i)), s.querySelector(".mtx-step__icon-container") || s.insertBefore(l("span", "mtx-step__icon-container"), s.firstChild), r.querySelector(".mtx-step__sr-prefix") || r.insertBefore(l("span", "mtx-step__sr mtx-step__sr-prefix"), r.firstChild), r.querySelector(".mtx-step__sr-status") || r.appendChild(l("span", "mtx-step__sr mtx-step__sr-status"));
    const a = t.querySelector(":scope > .mtx-step__content");
    if (a && !a.querySelector(":scope > .mtx-step__content-inner")) {
      const c = l("div", "mtx-step__content-inner");
      for (; a.firstChild; ) c.appendChild(a.firstChild);
      a.appendChild(c);
    }
    let n = t.querySelector(":scope > .mtx-step-connector");
    e > 0 && !n ? (n = l("span", "mtx-step-connector"), n.appendChild(l("span", "mtx-step-connector__line")), t.insertBefore(n, t.firstChild)) : e === 0 && n && n.remove(), n && n.setAttribute("aria-hidden", "true");
  }
  /**
   * Indica si un paso está deshabilitado (en modo no lineal solo por `data-disabled`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si no puede activarse.
   */
  _isDisabled(t) {
    const e = this._state[t];
    return !!(e && e.disabled);
  }
  /**
   * Indica si un paso está completado (en modo lineal, los anteriores al activo lo están salvo `data-completed="false"`).
   * @param {number} index Índice.
   * @returns {boolean} `true` si está completado.
   */
  isCompleted(t) {
    const e = this._state[t];
    return e ? e.completed !== null ? e.completed : !this.nonLinear && t < this._active : !1;
  }
  /**
   * Marca o desmarca un paso como completado.
   * @param {number} index Índice.
   * @param {boolean} [completed=true] Estado.
   * @returns {this} La instancia.
   */
  setCompleted(t, e = !0) {
    const s = this._state[t];
    return s ? (s.completed = !!e, this.steps[t].setAttribute("data-completed", String(s.completed)), this._render(), this) : this;
  }
  /**
   * Activa o quita el estado de error de un paso.
   * @param {number} index Índice.
   * @param {string|boolean} message Mensaje visible, `true` (sin mensaje) o `false` para limpiar.
   * @returns {this} La instancia.
   */
  setError(t, e) {
    const s = this._state[t];
    return s ? (e === !1 || e === null || e === void 0 ? (s.error = !1, this.steps[t].removeAttribute("data-error")) : (s.error = e === !0 ? "" : String(e), this.steps[t].setAttribute("data-error", s.error)), this._render(), this) : this;
  }
  /**
   * Habilita o deshabilita un paso.
   * @param {number} index Índice.
   * @param {boolean} [disabled=true] Estado.
   * @returns {this} La instancia.
   */
  setDisabled(t, e = !0) {
    const s = this._state[t];
    return s ? (s.disabled = !!e, this.steps[t].toggleAttribute("data-disabled", s.disabled), this._render(), this) : this;
  }
  /**
   * Vuelve al primer paso y limpia completados y errores definidos por API o atributos.
   * @returns {boolean} `true` si se aplicó (el evento no fue cancelado).
   */
  reset() {
    return this._active !== 0 && !k(this.element, "mtx:stepper:change", {
      activeStep: 0,
      previousStep: this._active,
      reset: !0
    }, { cancelable: !0 }) ? !1 : (this._state.forEach((t, e) => {
      t.completed = null, t.error = !1, this.steps[e].removeAttribute("data-completed"), this.steps[e].removeAttribute("data-error");
    }), this._active = 0, this.element.setAttribute("data-active-step", "0"), this._render(), !0);
  }
  /** @returns {boolean} `true` si todos los pasos se han superado (`activeStep === length`). */
  get finished() {
    return this._active >= this.length;
  }
  /** Aplica clases, iconos, textos accesibles, paneles y disparadores. */
  _render() {
    const t = q(this.element), e = this.length;
    this.element.classList.toggle("mtx-stepper--finished", this.finished), this.steps.forEach((i, r) => {
      const a = this._state[r], n = r === this._active, c = this.isCompleted(r), h = a.error !== !1, d = a.disabled || !this.nonLinear && r > this._active;
      i.classList.toggle("mtx-step--active", n), i.classList.toggle("mtx-step--completed", c), i.classList.toggle("mtx-step--error", h), i.classList.toggle("mtx-step--disabled", d), i.classList.toggle("mtx-step--last", r === e - 1);
      const _ = n || b(i, "data-expanded") === !0;
      i.classList.toggle("mtx-step--expanded", _);
      const o = i.querySelector(":scope > .mtx-step__label-container"), f = o.tagName === "BUTTON" ? o : i;
      [i, o].forEach((x) => x.removeAttribute("aria-current")), n && f.setAttribute("aria-current", "step"), o.tagName === "BUTTON" && (o.disabled = a.disabled), this._renderIcon(o.querySelector(".mtx-step__icon-container"), i, r, c, h, n), this._renderCaption(o.querySelector(".mtx-step__label-text"), i, a, t), o.querySelector(".mtx-step__sr-prefix").textContent = `${u("stepper", "step", { n: r + 1, total: e }, null, t)}: `;
      const m = [];
      c && m.push(u("stepper", "completed", null, null, t)), h && !a.error && m.push(u("stepper", "error", null, null, t)), o.querySelector(".mtx-step__sr-status").textContent = m.length ? `, ${m.join(", ")}` : "";
      const g = i.querySelector(":scope > .mtx-step__content");
      if (g) {
        const x = this.orientation === "vertical" && _;
        g.setAttribute("aria-hidden", String(!x)), g.toggleAttribute("inert", !x);
      }
      const v = this._panel(i.getAttribute("data-panel"));
      v && (v.hidden = !n);
    });
    const s = this._panel(this.element.getAttribute("data-finished-panel"));
    s && (s.hidden = !this.finished), this._syncTriggers();
  }
  /**
   * Pinta el StepIcon: número, check, aviso o icono personalizado.
   * @param {HTMLElement} holder Contenedor del icono.
   * @param {HTMLElement} step Paso.
   * @param {number} index Índice.
   * @param {boolean} completed Completado.
   * @param {boolean} hasError En error.
   * @param {boolean} active Activo.
   */
  _renderIcon(t, e, s, i, r, a) {
    const n = e.getAttribute("data-icon"), c = r ? "error" : i ? "completed" : n ? `icon:${n}` : `n:${s + 1}`;
    t.setAttribute("aria-hidden", "true");
    const h = t.querySelector(".mtx-step-icon");
    if (h && h.getAttribute("data-kind") === c) {
      h.classList.toggle("mtx-step-icon--active", a);
      return;
    }
    t.textContent = "";
    let d;
    r ? d = y($, "mtx-step-icon mtx-step-icon--error") : i ? d = y(D, "mtx-step-icon mtx-step-icon--completed") : n ? d = l("span", "mtx-step-icon mtx-step-icon--custom material-icons", n) : d = l("span", "mtx-step-icon mtx-step-icon--number", String(s + 1)), d.setAttribute("data-kind", c), a && d.classList.add("mtx-step-icon--active"), t.appendChild(d);
  }
  /**
   * Pinta el caption opcional o el mensaje de error bajo la etiqueta.
   * @param {HTMLElement} text Contenedor de textos.
   * @param {HTMLElement} step Paso.
   * @param {{error: string|false}} state Estado.
   * @param {string} locale Idioma.
   */
  _renderCaption(t, e, s, i) {
    let r = t.querySelector(".mtx-step__optional");
    const a = e.getAttribute("data-optional");
    let n = null;
    if (s.error ? n = s.error : a !== null && a !== "false" && (n = a || u("stepper", "optional", null, null, i)), n === null) {
      r && r.hasAttribute("data-generated") && r.remove();
      return;
    }
    r || (r = l("span", "mtx-step__optional"), r.setAttribute("data-generated", ""), t.insertBefore(r, t.querySelector(".mtx-step__sr-status"))), r.hasAttribute("data-generated") && (r.textContent = n);
  }
  /**
   * Busca un panel asociado por selector.
   * @param {string|null} selector Selector CSS.
   * @returns {HTMLElement|null} Panel.
   */
  _panel(t) {
    if (!t) return null;
    try {
      return document.querySelector(t);
    } catch {
      return null;
    }
  }
  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
class P extends E {
  /**
   * Crea una instancia del stepper móvil.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-mobile-stepper");
    const e = t.getAttribute("data-variant");
    this.variant = ["dots", "text", "progress"].includes(e) ? e : "dots";
    const s = t.getAttribute("data-position");
    this.position = ["bottom", "top", "static"].includes(s) ? s : "static", t.classList.add(`mtx-mobile-stepper--${this.variant}`, `mtx-mobile-stepper--${this.position}`);
    const i = parseInt(t.getAttribute("data-steps") || "0", 10);
    this._steps = Number.isFinite(i) && i > 0 ? i : 1;
    const r = parseInt(t.getAttribute("data-active-step") || "0", 10);
    this._active = Number.isFinite(r) ? Math.min(Math.max(r, 0), this._steps - 1) : 0, this._build(), this._handleClick = (a) => {
      const n = a.target.closest(".mtx-mobile-stepper__back, .mtx-mobile-stepper__next");
      !n || n.disabled || (n.classList.contains("mtx-mobile-stepper__back") ? this.back() : this.next());
    }, this._handleLocaleChange = () => this._render(), t.addEventListener("click", this._handleClick), this.listen(document, "mtx:locale:change", this._handleLocaleChange), T(), this._render();
  }
  /** @returns {number} Total de pasos. */
  get length() {
    return this._steps;
  }
  /** @returns {number} Total de pasos. */
  get steps() {
    return this._steps;
  }
  /**
   * Cambia el número total de pasos.
   * @param {number} count Nuevo total (≥ 1).
   * @returns {this} La instancia.
   */
  setSteps(t) {
    const e = Math.max(1, Math.round(Number(t)) || 1);
    return this._steps = e, this.element.setAttribute("data-steps", String(e)), this._active = Math.min(this._active, e - 1), this._buildIndicator(), this._render(), this;
  }
  /** @returns {number} El último índice (el stepper móvil no tiene estado "terminado"). */
  _maxIndex() {
    return this._steps - 1;
  }
  /**
   * Vuelve al primer paso.
   * @returns {boolean} `true` si cambió.
   */
  reset() {
    return this.goTo(0);
  }
  /** Crea botones, indicador y región de estado accesible (o reutiliza los BEM existentes). */
  _build() {
    const { element: t } = this;
    this.backButton = t.querySelector(".mtx-mobile-stepper__back") || this._createButton("back"), this.nextButton = t.querySelector(".mtx-mobile-stepper__next") || this._createButton("next"), this.backButton.parentNode || t.insertBefore(this.backButton, t.firstChild), this.indicator = t.querySelector(".mtx-mobile-stepper__indicator"), this.indicator || (this.indicator = l("div", "mtx-mobile-stepper__indicator"), this.backButton.after(this.indicator)), this.nextButton.parentNode || t.appendChild(this.nextButton), this.status = t.querySelector(".mtx-mobile-stepper__status"), this.status || (this.status = l("span", "mtx-mobile-stepper__status"), this.status.setAttribute("aria-live", "polite"), t.appendChild(this.status)), this._buildIndicator();
  }
  /**
   * Crea un botón de texto con chevron.
   * @param {'back'|'next'} kind Tipo.
   * @returns {HTMLButtonElement} Botón.
   */
  _createButton(t) {
    const e = l("button", `mtx-button mtx-button--text mtx-button--small mtx-mobile-stepper__${t}`);
    e.type = "button", e.setAttribute("data-mtx", "button");
    const s = l("span", "mtx-button__icon material-icons", t === "back" ? "keyboard_arrow_left" : "keyboard_arrow_right");
    s.setAttribute("aria-hidden", "true");
    const i = l("span", "mtx-mobile-stepper__button-label");
    return t === "back" ? e.append(s, i) : e.append(i, s), A(e), e;
  }
  /** Genera el contenido del indicador según la variante. */
  _buildIndicator() {
    const { indicator: t } = this;
    if (t.setAttribute("aria-hidden", "true"), this.variant === "dots") {
      if (t.children.length === this._steps) return;
      t.textContent = "";
      for (let e = 0; e < this._steps; e += 1)
        t.appendChild(l("span", "mtx-mobile-stepper__dot"));
    } else if (this.variant === "progress") {
      if (t.querySelector(".mtx-mobile-stepper__progress")) return;
      const e = l("div", "mtx-mobile-stepper__progress");
      e.setAttribute("data-mtx", "linear-progress"), e.setAttribute("data-value", "0"), e.setAttribute("data-decorative", ""), t.appendChild(e), A(e);
    }
  }
  /** Actualiza indicador, botones y textos. */
  _render() {
    const t = q(this.element), e = this._steps, s = this._active;
    this.backButton.disabled = s <= 0, this.nextButton.disabled = s >= e - 1;
    const i = this.backButton.querySelector(".mtx-mobile-stepper__button-label"), r = this.nextButton.querySelector(".mtx-mobile-stepper__button-label");
    if (i && (i.textContent = this.element.getAttribute("data-back-label") || u("stepper", "back", null, null, t)), r && (r.textContent = this.element.getAttribute("data-next-label") || u("stepper", "next", null, null, t)), this.variant === "dots")
      Array.from(this.indicator.children).forEach((a, n) => {
        a.classList.toggle("mtx-mobile-stepper__dot--active", n === s);
      });
    else if (this.variant === "text")
      this.indicator.textContent = u("stepper", "fraction", { n: s + 1, total: e }, null, t);
    else {
      const a = this.indicator.querySelector(".mtx-mobile-stepper__progress"), n = e > 1 ? s / (e - 1) * 100 : 100, c = a ? N(a) : null;
      c && typeof c.setValue == "function" ? c.setValue(n) : a && a.style.setProperty("--mtx-mobile-stepper-value", `${n}%`);
    }
    this.status.textContent = u("stepper", "step", { n: s + 1, total: e }, null, t), this._syncTriggers();
  }
  /** Elimina los listeners de la instancia. */
  destroy() {
    this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
L("stepper", O);
L("mobile-stepper", P);
M();
export {
  P as MobileStepper,
  O as Stepper
};
