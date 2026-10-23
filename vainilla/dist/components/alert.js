import "./alert.css";
import { r as c, C as h, t as m, h as u, g as o, q as f } from "../chunks/core-CJdkPtZx.js";
const n = {
  success: '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
  info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
  warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
  error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
};
class _ extends h {
  /**
   * Crea una instancia de la alerta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t);
    const l = t.getAttribute("data-severity") || "success", d = t.getAttribute("data-variant") || "standard";
    t.classList.add(`mtx-alert--${l}`, `mtx-alert--${d}`), t.hasAttribute("role") || t.setAttribute("role", "alert");
    let r = t.querySelector(".mtx-alert__icon");
    if (!r && t.getAttribute("data-icon") !== "false" && (r = document.createElement("span"), r.className = "mtx-alert__icon", r.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">${n[l] || n.success}</svg>`, t.insertBefore(r, t.firstChild)), t.hasAttribute("data-dismissible")) {
      let e = Array.from(t.children).find((a) => a.classList.contains("mtx-alert__close"));
      e || (e = document.createElement("button"), e.type = "button", e.className = "mtx-alert__close", e.setAttribute("aria-label", t.getAttribute("data-close-label") || m("alert", "close", null, "Close", u(t))), e.innerHTML = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', t.appendChild(e)), this._handleClose = () => this.close(), this.listen(e, "click", this._handleClose), this.closeButton = e;
    }
    t.classList.contains("mtx-alert") || t.classList.add("mtx-alert");
    let s = t.querySelector(".mtx-alert__message");
    if (s) {
      const e = t.getAttribute("data-title");
      if (e && !s.querySelector(".mtx-alert__title")) {
        const a = document.createElement("div");
        a.className = "mtx-alert__title", a.textContent = e, s.insertBefore(a, s.firstChild);
      }
    } else {
      s = document.createElement("div"), s.className = "mtx-alert__message";
      const e = t.getAttribute("data-title");
      if (e) {
        const i = document.createElement("div");
        i.className = "mtx-alert__title", i.textContent = e, s.appendChild(i);
      }
      Array.from(t.childNodes).filter((i) => i !== r && i !== this.closeButton).forEach((i) => s.appendChild(i)), this.closeButton ? t.insertBefore(s, this.closeButton) : t.appendChild(s);
    }
  }
  /**
   * Cierra (oculta) la alerta.
   */
  close() {
    if (!this.element.hidden) {
      if (this._prefersReducedMotion()) {
        clearTimeout(this._closeTimer), this._finishClose();
        return;
      }
      this.element.style.opacity = "0", this.element.style.transform = "translateY(-4px)", this.element.style.transition = "opacity 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1)", clearTimeout(this._closeTimer), this._closeTimer = setTimeout(() => this._finishClose(), 200);
    }
  }
  /** Oculta la alerta con `hidden` (sale del flujo) y emite `mtx:alert:close`. */
  _finishClose() {
    this._closeTimer = null, this.element.hidden = !0, o(this.element, "mtx:alert:close");
  }
  /** @returns {boolean} `true` si el usuario pidió reducir animaciones. */
  _prefersReducedMotion() {
    return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /** Vuelve a mostrar una alerta cerrada. */
  open() {
    clearTimeout(this._closeTimer), this._closeTimer = null, this.element.hidden = !1, requestAnimationFrame(() => {
      this.destroyed || (this.element.style.opacity = "1", this.element.style.transform = "translateY(0)");
    }), o(this.element, "mtx:alert:open");
  }
  /** Elimina listeners y temporizadores. */
  destroy() {
    this._closeTimer && (this.element.hidden = !0), clearTimeout(this._closeTimer), this._closeTimer = null, super.destroy();
  }
}
c("alert", _);
c("alert-title", h);
f();
export {
  _ as Alert
};
