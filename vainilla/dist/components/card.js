import "./avatar.css";
import "./icon-button.css";
import "./card.css";
import { r as l, C as h, t as x, h as _, d as A, q as p } from "../chunks/core-CJdkPtZx.js";
class v extends h {
  /**
   * Crea una instancia de la tarjeta.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    super(t), t.classList.contains("mtx-card") || t.classList.add("mtx-card");
    const a = t.getAttribute("data-title"), d = t.getAttribute("data-subheader"), o = t.getAttribute("data-avatar"), r = t.getAttribute("data-image") || t.getAttribute("data-media");
    if ((a || d || o) && !t.querySelector(".mtx-card__header, .mtx-card-header")) {
      const i = document.createElement("div");
      if (i.className = "mtx-card__header", o) {
        const e = document.createElement("div");
        e.className = "mtx-card__header-avatar";
        const s = document.createElement("div");
        s.className = "mtx-avatar mtx-avatar--primary", s.setAttribute("data-mtx", "avatar"), s.textContent = o, e.appendChild(s), i.appendChild(e);
      }
      const c = document.createElement("div");
      if (c.className = "mtx-card__header-content", a) {
        const e = document.createElement("span");
        e.className = "mtx-card__title", e.textContent = a, c.appendChild(e);
      }
      if (d) {
        const e = document.createElement("span");
        e.className = "mtx-card__subheader", e.textContent = d, c.appendChild(e);
      }
      if (i.appendChild(c), t.hasAttribute("data-action-icon")) {
        const e = document.createElement("div");
        e.className = "mtx-card__header-action";
        const s = document.createElement("button");
        s.className = "mtx-icon-button", s.setAttribute("data-mtx", "icon-button"), s.setAttribute("type", "button"), s.setAttribute("aria-label", t.getAttribute("data-action-label") || x("card", "actions", null, "Actions", _(t)));
        const u = document.createElement("span");
        u.className = "material-icons", u.textContent = t.getAttribute("data-action-icon"), u.setAttribute("aria-hidden", "true"), s.appendChild(u), e.appendChild(s), i.appendChild(e);
      }
      t.insertBefore(i, t.firstChild);
    }
    if (r && !t.querySelector(".mtx-card__media, .mtx-card-media")) {
      const i = document.createElement("div");
      i.className = "mtx-card__media", i.setAttribute("data-mtx", "card-media"), i.style.backgroundImage = `url("${r}")`;
      const c = t.getAttribute("data-image-alt");
      c && i.setAttribute("data-alt", c);
      const e = t.getAttribute("data-media-height") || t.getAttribute("data-height");
      e && (i.style.height = `${e}px`);
      const s = t.querySelector(".mtx-card__header, .mtx-card-header");
      s && !t.hasAttribute("data-media-top") ? s.after(i) : t.insertBefore(i, t.firstChild);
    }
    const f = t.getAttribute("data-actions-align");
    t.querySelectorAll('.mtx-card__actions, .mtx-card-actions, [data-mtx="card-actions"]').forEach((i) => {
      i.closest('.mtx-card, [data-mtx="card"]') === t && g(i, f);
    }), t.getAttribute("data-variant") === "outlined" && t.classList.add("mtx-card--outlined");
    const m = t.getAttribute("data-elevation");
    m !== null && t.classList.add(`mtx-card--elevation-${m}`), t.hasAttribute("data-raised") && t.classList.add("mtx-card--raised"), t.hasAttribute("data-square") && t.classList.add("mtx-card--square"), this.interactive = t.hasAttribute("data-clickable") || t.classList.contains("mtx-card--clickable"), this.interactive && (t.classList.add("mtx-card--clickable"), /^(BUTTON|A)$/.test(t.tagName) || t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0), this._handlePointerDown = (i) => {
      this.disabled || i.button !== 0 || A(t, i);
    }, this._handleKeydown = (i) => {
      this.disabled || (i.key === "Enter" || i.key === " ") && (i.preventDefault(), t.click());
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("keydown", this._handleKeydown)), t.hasAttribute("data-disabled") && this.disable();
  }
  /** @returns {boolean} Estado deshabilitado de una tarjeta interactiva. */
  get disabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita una tarjeta interactiva. */
  disable() {
    this.element.setAttribute("aria-disabled", "true"), this.element.classList.add("mtx-card--disabled"), this.element.tabIndex = -1;
  }
  /** Habilita una tarjeta interactiva. */
  enable() {
    this.element.removeAttribute("aria-disabled"), this.element.classList.remove("mtx-card--disabled"), this.interactive && (this.element.tabIndex = 0);
  }
  /** Enfoca la tarjeta (útil en tarjetas interactivas). */
  focus() {
    this.element.focus();
  }
  /** Elimina listeners de una tarjeta interactiva. */
  destroy() {
    this._handlePointerDown && this.element.removeEventListener("pointerdown", this._handlePointerDown), this._handleKeydown && this.element.removeEventListener("keydown", this._handleKeydown), super.destroy();
  }
}
class y extends h {
  /**
   * Crea un área interactiva con teclado, foco y ripple.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-card-action-area"), this._nativeInteractive = /^(BUTTON|A)$/.test(t.tagName), t.tagName === "BUTTON" && !t.hasAttribute("type") && (t.type = "button"), this._nativeInteractive || (t.setAttribute("role", "button"), t.hasAttribute("tabindex") || (t.tabIndex = 0)), this._handlePointerDown = (a) => {
      !this.disabled && a.button === 0 && A(t, a);
    }, this._handleKeydown = (a) => {
      this.disabled || this._nativeInteractive || (a.key === "Enter" || a.key === " ") && (a.preventDefault(), t.click());
    }, this._handleClick = (a) => {
      this.disabled && (a.preventDefault(), a.stopImmediatePropagation());
    }, t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("keydown", this._handleKeydown), t.addEventListener("click", this._handleClick), (t.hasAttribute("data-disabled") || t.getAttribute("aria-disabled") === "true") && this.disable();
  }
  /** @returns {boolean} Indica si el área está deshabilitada. */
  get disabled() {
    return this.element.disabled === !0 || this.element.getAttribute("aria-disabled") === "true";
  }
  /** Deshabilita el área de acción. */
  disable() {
    "disabled" in this.element && (this.element.disabled = !0), this.element.setAttribute("aria-disabled", "true"), this.element.classList.add("mtx-card-action-area--disabled"), (!this._nativeInteractive || this.element.tagName === "A") && (this.element.tabIndex = -1);
  }
  /** Habilita el área de acción. */
  enable() {
    "disabled" in this.element && (this.element.disabled = !1), this.element.removeAttribute("aria-disabled"), this.element.classList.remove("mtx-card-action-area--disabled"), (!this._nativeInteractive || this.element.tagName === "A") && (this.element.tabIndex = 0);
  }
  /** Enfoca el área de acción. */
  focus() {
    this.element.focus();
  }
  /** Elimina los listeners instalados. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.element.removeEventListener("keydown", this._handleKeydown), this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
class C extends h {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__header");
  }
}
class L extends h {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__content");
  }
}
const b = ["start", "center", "end", "between"];
function g(n, t = null) {
  const a = n.getAttribute("data-align"), d = b.find((r) => n.classList.contains(`mtx-card__actions--${r}`)), o = [a, d, t].find((r) => b.includes(r)) || "end";
  return b.forEach((r) => {
    n.classList.toggle(`mtx-card__actions--${r}`, r === o && r !== "end");
  }), o;
}
class E extends h {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(t) {
    super(t), t.classList.add("mtx-card__actions");
    const a = t.getAttribute("data-disable-spacing");
    a !== null && a !== "false" && t.classList.add("mtx-card__actions--disable-spacing");
    const d = t.closest('.mtx-card, [data-mtx="card"]');
    this._align = g(t, d ? d.getAttribute("data-actions-align") : null);
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
    if (!b.includes(t))
      throw new RangeError(`Alineación no válida: ${t}`);
    this.element.setAttribute("data-align", t), this._align = g(this.element);
  }
}
class w extends h {
  /**
   * Crea el media y aplica `data-image`, `data-alt` y `data-height`.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(t) {
    super(t), t.classList.add("mtx-card__media");
    const a = Number.parseFloat(t.getAttribute("data-height") || t.getAttribute("data-media-height"));
    Number.isFinite(a) && a >= 0 && (t.style.height = `${a}px`);
    const d = t.getAttribute("data-alt");
    t.tagName === "IMG" ? d ? t.alt = d : t.hasAttribute("alt") || (t.alt = "") : d ? (t.setAttribute("role", "img"), t.setAttribute("aria-label", d)) : !t.hasAttribute("role") && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && !t.children.length && (t.hasAttribute("data-image") || t.style.backgroundImage) && t.setAttribute("aria-hidden", "true"), t.hasAttribute("data-image") && (this.image = t.getAttribute("data-image"));
  }
  /** @returns {string} URL actual del recurso. */
  get image() {
    return this.element.tagName === "IMG" ? this.element.getAttribute("src") || "" : this.element.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, "");
  }
  /** @param {string} value URL del recurso. */
  set image(t) {
    if (this.element.tagName === "IMG")
      this.element.src = t;
    else {
      const a = String(t).replace(/["\\\n\r]/g, encodeURIComponent);
      this.element.style.backgroundImage = `url("${a}")`;
    }
  }
}
l("card", v);
l("card-action-area", y);
l("card-header", C);
l("card-content", L);
l("card-actions", E);
l("card-media", w);
p();
export {
  v as Card,
  y as CardActionArea,
  E as CardActions,
  L as CardContent,
  C as CardHeader,
  w as CardMedia,
  g as applyCardActionsAlign
};
