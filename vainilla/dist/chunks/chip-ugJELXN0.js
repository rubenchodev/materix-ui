import { r as o, C as m, t as b, h as u, g as p } from "./core-CJdkPtZx.js";
const f = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"/></svg>';
class x extends m {
  /**
   * Crea una instancia del chip.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(e) {
    super(e), this._ensureStructure(), this._bindDelete(), this._bindClick();
  }
  /**
   * Normaliza la estructura interna del chip (avatar, icono, label, delete).
   */
  _ensureStructure() {
    const { element: e } = this;
    e.classList.contains("mtx-chip") || e.classList.add("mtx-chip");
    let i = e.querySelector(".mtx-chip__label");
    const r = Array.from(e.childNodes).filter(
      (t) => t.nodeType === Node.TEXT_NODE && t.textContent.trim()
    ), d = r.map((t) => t.textContent.trim()).join(" ");
    r.forEach((t) => t.remove()), i || (i = document.createElement("span"), i.className = "mtx-chip__label", e.appendChild(i)), this.labelEl = i, e.hasAttribute("data-label") ? i.textContent = e.getAttribute("data-label") : !i.textContent && d && (i.textContent = d);
    const c = e.getAttribute("data-icon");
    if (c && !e.querySelector(".mtx-chip__icon")) {
      const t = document.createElement("span");
      t.className = "mtx-chip__icon material-icons", t.setAttribute("aria-hidden", "true"), t.textContent = c, e.insertBefore(t, i);
    }
    if (e.hasAttribute("data-deletable")) {
      let t = e.querySelector(".mtx-chip__delete");
      if (t && /^(BUTTON|A|INPUT)$/.test(t.tagName)) {
        const a = document.createElement("span");
        a.className = t.className, a.innerHTML = t.innerHTML, t.replaceWith(a), t = a;
      }
      t || (t = document.createElement("span"), t.className = "mtx-chip__delete", t.innerHTML = e.getAttribute("data-delete-icon") || f, e.appendChild(t)), t.removeAttribute("tabindex"), t.removeAttribute("role"), t.removeAttribute("aria-label"), t.setAttribute("aria-hidden", "true"), t.title = e.getAttribute("data-delete-label") || b("chip", "delete", null, "Delete", u(e)), e.hasAttribute("aria-keyshortcuts") || e.setAttribute("aria-keyshortcuts", "Delete Backspace"), this.deleteEl = t;
    }
    const h = e.hasAttribute("data-clickable") || e.hasAttribute("data-deletable");
    e.hasAttribute("data-clickable") && e.classList.add("mtx-chip--clickable"), h && !/^(BUTTON|A)$/.test(e.tagName) && (e.setAttribute("role", "button"), e.hasAttribute("tabindex") || (e.tabIndex = 0)), (e.hasAttribute("data-disabled") || e.getAttribute("aria-disabled") === "true") && this.disable();
    const l = e.getAttribute("data-size");
    l && l !== "medium" && e.classList.add(`mtx-chip--${l}`);
    const s = e.getAttribute("data-variant");
    s && s !== "filled" && e.classList.add(`mtx-chip--${s}`);
    const n = e.getAttribute("data-color");
    n && n !== "default" && e.classList.add(`mtx-chip--${n}`);
  }
  /**
   * Vincula el evento de eliminación.
   */
  _bindDelete() {
    this.deleteEl && (this._handleDelete = (e) => {
      e.stopPropagation(), e.preventDefault(), !this.disabled && this.emit("delete");
    }, this.deleteEl.addEventListener("click", this._handleDelete));
  }
  /**
   * Vincula el evento de clic en chips interactivos.
   */
  _bindClick() {
    !this.element.hasAttribute("data-clickable") && !this.deleteEl || (this._handleClick = (e) => {
      this.disabled || e.target.closest(".mtx-chip__delete") || this.element.hasAttribute("data-clickable") && this.emit("click");
    }, this._handleKeydown = (e) => {
      this.disabled || ((e.key === "Enter" || e.key === " ") && this.element.hasAttribute("data-clickable") ? (e.preventDefault(), this.element.click()) : (e.key === "Delete" || e.key === "Backspace") && this.deleteEl ? (e.preventDefault(), this.emit("delete")) : e.key === "Escape" && this.element.blur());
    }, this.element.addEventListener("click", this._handleClick), this.element.addEventListener("keydown", this._handleKeydown));
  }
  /**
   * Texto del chip.
   *
   * @returns {string} Texto del label.
   */
  get label() {
    return this.labelEl.textContent;
  }
  /**
   * Establece el texto del chip.
   *
   * @param {string} text Nuevo texto.
   */
  set label(e) {
    this.labelEl.textContent = e;
  }
  /** @returns {boolean} `true` si el chip está deshabilitado. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita interacción y retira el chip del orden de tabulación. */
  disable() {
    this.element.classList.add("mtx-chip--disabled"), this.element.setAttribute("aria-disabled", "true"), this.element.hasAttribute("tabindex") && (this.element.tabIndex = -1);
  }
  /** Habilita nuevamente el chip. */
  enable() {
    this.element.classList.remove("mtx-chip--disabled"), this.element.removeAttribute("aria-disabled"), this.element.getAttribute("role") === "button" && (this.element.tabIndex = 0);
  }
  /**
   * Desencadena un evento público personalizado sobre el elemento.
   *
   * @param {string} name Nombre del evento (`delete`, `click`, …).
   * @param {Object} [detail] Datos adicionales.
   */
  emit(e, i = {}) {
    p(this.element, `mtx:chip:${e}`, i);
  }
  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    this.deleteEl && this.deleteEl.removeEventListener("click", this._handleDelete), this._handleClick && this.element.removeEventListener("click", this._handleClick), this._handleKeydown && this.element.removeEventListener("keydown", this._handleKeydown), super.destroy();
  }
}
o("chip", x);
export {
  x as C
};
