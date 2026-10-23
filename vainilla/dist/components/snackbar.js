import "./snackbar.css";
import { r as l, C as u, z as m, N as d, g as a, A as _, j as b, q as p } from "../chunks/core-CJdkPtZx.js";
const r = ["bottom-left", "bottom-center", "bottom-right", "top-left", "top-center", "top-right"];
function o(s) {
  if (s == null || s === "none" || s === !1) return null;
  const t = Number(s);
  return Number.isFinite(t) && t >= 0 ? t : null;
}
class c extends u {
  /**
   * Crea una instancia del snackbar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-snackbar") || t.classList.add("mtx-snackbar"), this.duration = o(t.getAttribute("data-duration")), this._activeDuration = this.duration, this.anchor = t.getAttribute("data-anchor") || "bottom-center";
    const e = t.getAttribute("data-action");
    e && !t.querySelector(".mtx-snackbar__action") && (this._createAction().textContent = e);
    const n = t.getAttribute("data-message");
    n && !t.querySelector(".mtx-snackbar__message") && (this._createMessage().textContent = n), this.message = t.querySelector(".mtx-snackbar__message"), this._applyMessageRole(), this._handleAction = (h) => this._onAction(h), this._bindAction(t.querySelector(".mtx-snackbar__action")), this._handlePause = () => this._clearTimer(), this._handleResume = () => this._startTimer(), t.addEventListener("mouseenter", this._handlePause), t.addEventListener("mouseleave", this._handleResume), t.addEventListener("focusin", this._handlePause), t.addEventListener("focusout", this._handleResume), t.hasAttribute("data-open") && this.open();
  }
  /** @returns {boolean} `true` cuando está visible. */
  get isOpen() {
    return this.element.classList.contains("mtx-snackbar--open");
  }
  /** @returns {string} Anclaje actual (`bottom-center`, `top-right`…). */
  get anchor() {
    return this._anchor;
  }
  /** @param {string} value Anclaje; valores no válidos usan `bottom-center`. */
  set anchor(t) {
    const e = r.includes(t) ? t : "bottom-center";
    r.forEach((n) => this.element.classList.remove(`mtx-snackbar--${n}`)), this.element.classList.add(`mtx-snackbar--${e}`), this._anchor = e;
  }
  /**
   * Cambia el texto del mensaje (crea `.mtx-snackbar__message` si no existe).
   *
   * @param {string} text Texto plano del mensaje.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setMessage(t) {
    return this.message || (this.message = this._createMessage(), this._applyMessageRole()), this.message.textContent = t == null ? "" : String(t), this;
  }
  /**
   * Cambia, muestra u oculta la acción.
   *
   * @param {string|null|false} label Texto del botón; `null`/`false`/`''` la oculta.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setAction(t) {
    return t ? (this.action || this._bindAction(this._createAction()), this.action.textContent = String(t), this.action.hidden = !1, this) : (this.action && (this.action.hidden = !0), this);
  }
  /**
   * Muestra el snackbar. Si ya está abierto, actualiza el contenido y reinicia el temporizador.
   *
   * @param {Object} [options] Contenido de esta apertura.
   * @param {string} [options.message] Texto del mensaje.
   * @param {string|null|false} [options.action] Texto de la acción; `null`/`false` la oculta.
   * @param {Function} [options.onAction] Se ejecuta al pulsar la acción y después cierra (`reason: 'action'`).
   * @param {number|null|'none'} [options.duration] Auto-cierre solo para esta apertura.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  open(t = {}) {
    const e = t && typeof t == "object" && !(t instanceof Event) ? t : {};
    return Object.prototype.hasOwnProperty.call(e, "message") && this.setMessage(e.message), Object.prototype.hasOwnProperty.call(e, "action") && this.setAction(e.action), this._onActionCallback = typeof e.onAction == "function" ? e.onAction : null, this._activeDuration = Object.prototype.hasOwnProperty.call(e, "duration") ? o(e.duration) : this.duration, m(this, { kind: "snackbar", nodes: this.element, onEscape: () => this.close("escapeKeyDown") }), this.isOpen ? (this._startTimer(), this) : (this.element.classList.add("mtx-snackbar--open"), this._clickAwayCleanup = d(this.element, () => this.close("clickaway")), this._startTimer(), a(this.element, "mtx:snackbar:open"), this);
  }
  /**
   * Oculta el snackbar.
   *
   * @param {string} [reason='programmatic'] Motivo: `timeout`, `clickaway`, `escapeKeyDown`, `action` o propio.
   */
  close(t = "programmatic") {
    this.isOpen && (this.element.classList.remove("mtx-snackbar--open"), _(this), this._clickAwayCleanup && this._clickAwayCleanup(), this._clickAwayCleanup = null, this._clearTimer(), a(this.element, "mtx:snackbar:close", { reason: t }));
  }
  /** Inicia el autocierre si hay duración activa. */
  _startTimer() {
    this._clearTimer(), !(this._activeDuration === null || !this.isOpen) && (this._timer = setTimeout(() => this.close("timeout"), this._activeDuration));
  }
  /** Cancela el temporizador activo. */
  _clearTimer() {
    this._timer && clearTimeout(this._timer), this._timer = null;
  }
  /**
   * Crea el nodo del mensaje al inicio del snackbar.
   * @returns {HTMLElement} Mensaje creado.
   */
  _createMessage() {
    const t = document.createElement("div");
    return t.className = "mtx-snackbar__message", this.element.insertBefore(t, this.element.firstChild), t;
  }
  /**
   * Crea el botón de acción al final del snackbar.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createAction() {
    const t = document.createElement("button");
    return t.type = "button", t.className = "mtx-snackbar__action", this.element.appendChild(t), t;
  }
  /** Aplica el rol vivo al mensaje (`data-role` o `alert`). */
  _applyMessageRole() {
    this.message && !this.message.hasAttribute("role") && this.message.setAttribute("role", this.element.getAttribute("data-role") || "alert");
  }
  /**
   * Conecta el botón de acción.
   * @param {HTMLElement|null} action Botón de acción.
   */
  _bindAction(t) {
    t && (t.tagName === "BUTTON" && !t.getAttribute("type") && (t.type = "button"), t.addEventListener("click", this._handleAction), this.action = t);
  }
  /**
   * Gestiona el clic en la acción: emite `mtx:snackbar:action` y cierra si corresponde.
   * @param {MouseEvent} event Evento de clic.
   */
  _onAction(t) {
    const e = this._onActionCallback;
    a(this.element, "mtx:snackbar:action"), e ? (this._onActionCallback = null, e(t, this), this.close("action")) : this.element.hasAttribute("data-close-on-action") && this.close("action");
  }
  /**
   * Cierra el snackbar, cancela el temporizador y libera sus listeners.
   */
  destroy() {
    this.close(), this.element.removeEventListener("mouseenter", this._handlePause), this.element.removeEventListener("mouseleave", this._handleResume), this.element.removeEventListener("focusin", this._handlePause), this.element.removeEventListener("focusout", this._handleResume), this.action && this.action.removeEventListener("click", this._handleAction), super.destroy();
  }
}
l("snackbar", c);
let i = null;
function f(s = {}) {
  if (typeof document > "u") return null;
  const t = typeof s == "string" ? { message: s } : { ...s };
  if (!i || i.destroyed || !i.element.isConnected) {
    const e = document.createElement("div");
    e.className = "mtx-snackbar", e.setAttribute("data-mtx", "snackbar"), e.setAttribute("data-role", t.role || "status"), e.setAttribute("data-duration", "4000"), document.body.appendChild(e), i = b(e) || new c(e);
  }
  return t.anchor && (i.anchor = t.anchor), t.role && i.message && i.message.setAttribute("role", t.role), Object.prototype.hasOwnProperty.call(t, "action") || (t.action = null), delete t.anchor, delete t.role, i.open(t);
}
const A = {
  show: f
};
p();
export {
  c as Snackbar,
  f as showSnackbar,
  A as snackbar
};
