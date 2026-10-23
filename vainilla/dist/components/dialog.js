import "./dialog.css";
import { r as x, j as C, C as A, I as g, J as m, K as _, v as E, G as k, z as L, g as f, H as v, A as F, L as T, M as I, q as S } from "../chunks/core-CJdkPtZx.js";
const b = '.mtx-dialog__actions, [data-mtx="dialog-actions"]', c = ["start", "center", "end", "between"];
function d(n, t = null) {
  n.classList.add("mtx-dialog__actions");
  const i = n.getAttribute("data-align"), e = c.find((o) => n.classList.contains(`mtx-dialog__actions--${o}`)), a = [i, e, t].find((o) => c.includes(o)) || "end";
  c.forEach((o) => {
    n.classList.toggle(`mtx-dialog__actions--${o}`, o === a && o !== "end");
  });
  const r = n.getAttribute("data-disable-spacing");
  return r !== null && r !== "false" && n.classList.add("mtx-dialog__actions--disable-spacing"), a;
}
class N extends A {
  /**
   * Crea una instancia del diálogo.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-dialog") || t.classList.add("mtx-dialog");
    let i = t.querySelector(".mtx-dialog__paper");
    i || (i = this._scaffold(t)), this.paper = i, this.paper.setAttribute("role", this.paper.getAttribute("role") || "dialog"), this.paper.setAttribute("aria-modal", "true"), this.paper.tabIndex = this.paper.hasAttribute("tabindex") ? this.paper.tabIndex : -1, ["aria-labelledby", "aria-describedby", "aria-label"].forEach((e) => {
      t.hasAttribute(e) && !this.paper.hasAttribute(e) && this.paper.setAttribute(e, t.getAttribute(e));
    }), this._linkAria(), this._applyActionsAlign(), this.scroll = t.getAttribute("data-scroll") || "paper", t.classList.add(`mtx-dialog--scroll-${this.scroll}`), this._previousFocus = null, this._handleKeydown = (e) => this._onKeydown(e), this._handleCloseClick = (e) => {
      const a = e.target.closest("[data-mtx-dialog-close]");
      if (!a) return;
      const r = a.classList.contains("mtx-dialog__backdrop");
      r && t.hasAttribute("data-disable-backdrop-close") || this.close(r ? "backdropClick" : "closeButtonClick");
    }, this._handleFocusIn = (e) => {
      this.isOpen && g(this.element) && !this.paper.contains(e.target) && !m(this, e.target) && _(this.paper, this.element.querySelector("[data-dialog-autofocus]"));
    }, t.addEventListener("click", this._handleCloseClick), this.listen(document, "keydown", this._handleKeydown), this.listen(document, "focusin", this._handleFocusIn);
  }
  /**
   * Auto-construye backdrop, panel, título, contenido y acciones desde la sintaxis simplificada.
   *
   * @param {HTMLElement} element Contenedor del diálogo.
   * @returns {HTMLElement} Panel creado.
   */
  _scaffold(t) {
    let i = t.querySelector(":scope > .mtx-dialog__backdrop");
    i || (i = document.createElement("div"), i.className = "mtx-dialog__backdrop", i.setAttribute("data-mtx-dialog-close", ""), t.appendChild(i));
    const e = document.createElement("div");
    e.className = "mtx-dialog__paper", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true");
    const a = Array.from(t.childNodes).filter((s) => s !== i), r = (s, y) => s.nodeType === 1 && s.classList.contains(y);
    let o = a.find((s) => r(s, "mtx-dialog__title")) || null;
    const p = a.filter((s) => s.nodeType === 1 && s.matches(b));
    let l = a.find((s) => r(s, "mtx-dialog__content")) || null;
    const h = t.getAttribute("data-title");
    !o && h && (o = document.createElement("h2"), o.className = "mtx-dialog__title", o.textContent = h), o && e.appendChild(o), l || (l = document.createElement("div"), l.className = "mtx-dialog__content", a.filter((s) => s !== o && !p.includes(s)).forEach((s) => l.appendChild(s)));
    const u = t.getAttribute("data-description");
    if (u && !l.querySelector(".mtx-dialog__content-text")) {
      const s = document.createElement("p");
      s.className = "mtx-dialog__content-text", s.textContent = u, l.insertBefore(s, l.firstChild);
    }
    return e.appendChild(l), p.forEach((s) => e.appendChild(s)), t.appendChild(e), e;
  }
  /**
   * Da nombre y descripción accesibles al panel: enlaza `aria-labelledby` con el título y
   * `aria-describedby` con `.mtx-dialog__content-text`, generando ids cuando falten.
   */
  _linkAria() {
    const t = this.element.id || E("mtx-dialog"), i = this.paper.hasAttribute("aria-labelledby") || this.paper.hasAttribute("aria-label"), e = this.paper.querySelector(".mtx-dialog__title");
    e && !i && (e.id || (e.id = `${t}-title`), this.paper.setAttribute("aria-labelledby", e.id));
    const a = this.paper.querySelector(".mtx-dialog__content-text");
    a && !this.paper.hasAttribute("aria-describedby") && (a.id || (a.id = `${t}-description`), this.paper.setAttribute("aria-describedby", a.id));
  }
  /**
   * Propaga `data-actions-align` del diálogo a sus contenedores de acciones sin alineación propia.
   */
  _applyActionsAlign() {
    const t = this.element.getAttribute("data-actions-align");
    this.paper.querySelectorAll(b).forEach((i) => {
      i.closest(".mtx-dialog__paper") === this.paper && d(i, t);
    });
  }
  /**
   * Indica si el diálogo está abierto.
   *
   * @returns {boolean} `true` si está abierto.
   */
  get isOpen() {
    return this.element.classList.contains("mtx-dialog--open");
  }
  /**
   * Abre el diálogo, gestiona el foco y bloquea el scroll.
   */
  open() {
    this.isOpen || (this._previousFocus = this._resolveReturnFocus(), this._openTrigger = null, this.element.classList.add("mtx-dialog--open"), k(this.element), L(this, {
      kind: "modal",
      nodes: this.element,
      // Abierto desde otra capa (p. ej. un Popover portado): queda por encima de ella.
      stack: [{ node: this.element }],
      onEscape: () => {
        this.element.hasAttribute("data-disable-escape") || this.close("escapeKeyDown");
      }
    }), this._focusFirst(), f(this.element, "mtx:dialog:open"));
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
   * Cierra el diálogo y restaura el foco.
   *
   * @param {string} [reason='programmatic'] Motivo de cierre.
   */
  close(t = "programmatic") {
    this.isOpen && (this.element.classList.remove("mtx-dialog--open"), v(this.element), F(this), this._previousFocus && this._previousFocus.isConnected && this._previousFocus.focus && this._previousFocus.focus(), f(this.element, "mtx:dialog:close", { reason: t }));
  }
  /**
   * Enfoca el primer elemento enfocable del panel, o el marcado con
   * `data-dialog-autofocus` si existe.
   */
  _focusFirst() {
    _(this.paper, this.element.querySelector("[data-dialog-autofocus]"));
  }
  /**
   * Gestiona Tab para mantener el foco dentro (Escape lo entrega la pila de capas).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeydown(t) {
    !this.isOpen || !g(this.element) || m(this, document.activeElement) || t.key === "Tab" && this._trapFocus(t);
  }
  /**
   * Mantiene el foco dentro del diálogo (focus trap).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _trapFocus(t) {
    T(t, this.paper);
  }
  /**
   * Obtiene los elementos enfocables dentro del panel.
   *
   * @returns {HTMLElement[]} Elementos enfocables.
   */
  _getFocusable() {
    return I(this.paper);
  }
  /**
   * Cierra el diálogo si está abierto, libera sus listeners y lo desvincula del registro.
   */
  destroy() {
    this.isOpen && this.close(), this.element.removeEventListener("click", this._handleCloseClick), super.destroy();
  }
}
class O extends A {
  /**
   * Crea la instancia y aplica alineación y espaciado.
   *
   * @param {HTMLElement} element Contenedor de las acciones.
   */
  constructor(t) {
    super(t);
    const i = t.closest('.mtx-dialog, [data-mtx="dialog"]');
    this._align = d(t, i ? i.getAttribute("data-actions-align") : null);
  }
  /** @returns {string} Alineación actual (`start`, `center`, `end` o `between`). */
  get align() {
    return this._align;
  }
  /**
   * Cambia la alineación de las acciones.
   *
   * @param {string} value `start`, `center`, `end` o `between`.
   * @throws {RangeError} Si el valor no es una alineación válida.
   */
  set align(t) {
    if (!c.includes(t))
      throw new RangeError(`Alineación no válida: ${t}`);
    this.element.setAttribute("data-align", t), this._align = d(this.element);
  }
}
x("dialog", N);
x("dialog-actions", O);
typeof document < "u" && document.addEventListener("click", (n) => {
  const t = n.target.closest("[data-mtx-dialog-open]");
  if (!t) return;
  const i = t.getAttribute("data-mtx-dialog-open"), e = document.getElementById(i);
  if (e) {
    const a = C(e);
    a && typeof a.open == "function" && (a.isOpen || (a._openTrigger = t), a.open());
  }
});
S();
export {
  N as Dialog,
  O as DialogActions,
  d as applyDialogActionsOptions
};
