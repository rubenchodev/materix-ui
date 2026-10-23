import "./rating.css";
import { r as _, C as p, v as g, h as b, t as c, g as m, q as v } from "../chunks/core-CJdkPtZx.js";
const f = {
  star: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  star_border: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
  star_outline: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
  favorite: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  favorite_border: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z",
  circle: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z",
  radio_button_unchecked: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
  thumb_up: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
  thumb_up_off_alt: "M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z"
}, x = ["small", "medium", "large"], d = (l, t) => l.hasAttribute(t) && l.getAttribute(t) !== "false";
function o(l, t) {
  const e = document.createElement("span");
  e.className = t, e.setAttribute("aria-hidden", "true");
  const i = f[l];
  if (i)
    e.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><path d="${i}"/></svg>`;
  else {
    const s = document.createElement("span");
    s.className = "material-icons", s.textContent = l, e.appendChild(s);
  }
  return e;
}
class y extends p {
  /**
   * @param {HTMLElement} element Contenedor (normalmente un `<span>` vacío).
   */
  constructor(t) {
    super(t), t.classList.add("mtx-rating"), this.max = Math.max(1, parseInt(t.getAttribute("data-max"), 10) || 5);
    const e = parseFloat(t.getAttribute("data-precision"));
    this.precision = e > 0 && e <= 1 && Number.isInteger(Math.round(1 / e * 1e6) / 1e6) ? e : 1, this.readOnly = d(t, "data-read-only") || t.classList.contains("mtx-rating--read-only"), this.highlightSelectedOnly = d(t, "data-highlight-selected-only"), this.icon = t.getAttribute("data-icon") || "star", this.emptyIcon = t.getAttribute("data-empty-icon") || (t.hasAttribute("data-icon") ? this.icon : "star_border"), this.name = t.getAttribute("data-name") || t.getAttribute("name") || g("mtx-rating"), this._locale = b(t);
    const i = t.getAttribute("data-size");
    x.includes(i) && i !== "medium" && t.classList.add(`mtx-rating--${i}`), t.classList.toggle("mtx-rating--read-only", this.readOnly);
    const s = t.getAttribute("data-label");
    s && !t.hasAttribute("aria-label") && !t.hasAttribute("aria-labelledby") && t.setAttribute("aria-label", s), this._hover = null, this._value = this._round(parseFloat(t.getAttribute("data-value"))), t.querySelector(".mtx-rating__item") || this._build(), this._bind(), this.readOnly ? t.setAttribute("role", "img") : !t.hasAttribute("role") && (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) && t.setAttribute("role", "radiogroup"), d(t, "data-disabled") && this.disable(), this._render(), this.readOnly || this._listen();
  }
  /**
   * Redondea y acota un valor a la precisión y al máximo (`null` = sin valoración).
   * @private
   * @param {number} value Valor bruto.
   * @returns {number|null} Valor normalizado.
   */
  _round(t) {
    if (!Number.isFinite(t) || t <= 0) return null;
    const e = Math.round(t / this.precision), i = Math.min(this.max, Number((e * this.precision).toFixed(4)));
    return i > 0 ? i : null;
  }
  /**
   * Formatea un número para las etiquetas accesibles.
   * @private
   * @param {number} value Valor.
   * @returns {string} Texto.
   */
  _format(t) {
    try {
      return new Intl.NumberFormat(this._locale).format(t);
    } catch {
      return String(t);
    }
  }
  /**
   * Etiqueta accesible de un valor ("3 Stars").
   * @private
   * @param {number} value Valor.
   * @returns {string} Etiqueta.
   */
  _labelFor(t) {
    return c("rating", t === 1 ? "star" : "stars", { value: this._format(t) }, `${t} Stars`, this._locale);
  }
  /**
   * Genera la estructura: un ítem por icono y, dentro, un radio + label por cada paso de precisión.
   * @private
   */
  _build() {
    const t = this.element, e = Math.round(1 / this.precision);
    t.textContent = "";
    for (let i = 1; i <= this.max; i += 1) {
      const s = document.createElement("span");
      s.className = "mtx-rating__item", e > 1 && s.classList.add("mtx-rating__item--decimal");
      for (let r = 1; r <= e; r += 1) {
        const n = Number((i - 1 + r / e).toFixed(4)), a = document.createElement(this.readOnly ? "span" : "label");
        if (a.className = "mtx-rating__label", a.setAttribute("data-rating-value", String(n)), r < e && (a.classList.add("mtx-rating__label--partial"), a.style.width = `${r / e * 100}%`, a.style.zIndex = String(e - r)), a.appendChild(o(this.icon, "mtx-rating__icon mtx-rating__icon--filled")), a.appendChild(o(this.emptyIcon, "mtx-rating__icon mtx-rating__icon--empty")), !this.readOnly) {
          const u = this._createInput(String(n)), h = document.createElement("span");
          h.className = "mtx-rating__visually-hidden", h.textContent = this._labelFor(n), a.setAttribute("for", u.id), a.appendChild(h), s.appendChild(u);
        }
        s.appendChild(a);
      }
      t.appendChild(s);
    }
    if (!this.readOnly) {
      const i = this._createInput("");
      i.classList.add("mtx-rating__input--empty");
      const s = document.createElement("label");
      s.className = "mtx-rating__visually-hidden", s.setAttribute("for", i.id), s.textContent = c("rating", "empty", null, "Empty", this._locale), t.appendChild(i), t.appendChild(s);
    }
  }
  /**
   * @private
   * @param {string} value Valor del radio.
   * @returns {HTMLInputElement} Radio oculto.
   */
  _createInput(t) {
    const e = document.createElement("input");
    return e.type = "radio", e.className = "mtx-rating__input", e.name = this.name, e.value = t, e.id = `${this.name}-${t === "" ? "empty" : String(t).replace(".", "_")}`, e;
  }
  /**
   * Vincula nodos existentes (estructura generada o BEM manual) y completa los iconos que falten.
   * @private
   */
  _bind() {
    if (this.items = Array.from(this.element.querySelectorAll(".mtx-rating__item")), this.visuals = Array.from(this.element.querySelectorAll(".mtx-rating__label[data-rating-value]")), this.visuals.forEach((t) => {
      t.querySelector(".mtx-rating__icon--filled") || t.insertBefore(o(this.icon, "mtx-rating__icon mtx-rating__icon--filled"), t.firstChild), t.querySelector(".mtx-rating__icon--empty") || t.insertBefore(
        o(this.emptyIcon, "mtx-rating__icon mtx-rating__icon--empty"),
        t.querySelector(".mtx-rating__icon--filled").nextSibling
      );
    }), this.inputs = Array.from(this.element.querySelectorAll("input.mtx-rating__input")), this.inputs.length) {
      this.name = this.inputs[0].name || this.name;
      const t = this.inputs.find((e) => e.checked);
      t && !this.element.hasAttribute("data-value") && (this._value = this._round(parseFloat(t.value)));
    }
  }
  /**
   * Registra la interacción: cambio, vista previa al pasar el cursor y borrado al repetir clic.
   * @private
   */
  _listen() {
    this._pointerClick = !1, this._pointerTimer = null, this.onDestroy(() => clearTimeout(this._pointerTimer)), this._handleChange = (e) => {
      e.target.matches("input.mtx-rating__input") && this._commit(this._round(parseFloat(e.target.value)));
    }, this._handlePointerDown = () => {
      this._pointerClick = !0, clearTimeout(this._pointerTimer), this._pointerTimer = setTimeout(() => {
        this._pointerTimer = null, this._pointerClick = !1;
      }, 600);
    }, this._handleClick = (e) => {
      const i = e.target;
      !i.matches || !i.matches("input.mtx-rating__input") || !this._pointerClick || i.value !== "" && this._round(parseFloat(i.value)) === this._value && (this._pointerClick = !1, this._commit(null));
    }, this._handlePointerMove = (e) => {
      this.disabled || e.pointerType === "touch" || this._setHover(this._valueFromPointer(e.clientX));
    }, this._handlePointerLeave = () => this._setHover(null), this._handleFocusOut = () => this._setHover(null);
    const t = this.element;
    t.addEventListener("change", this._handleChange), t.addEventListener("pointerdown", this._handlePointerDown), t.addEventListener("click", this._handleClick), t.addEventListener("pointermove", this._handlePointerMove), t.addEventListener("pointerleave", this._handlePointerLeave), t.addEventListener("focusout", this._handleFocusOut);
  }
  /**
   * Calcula el valor bajo el puntero según la posición horizontal (respeta RTL).
   * @private
   * @param {number} clientX Coordenada X del puntero.
   * @returns {number|null} Valor resaltado.
   */
  _valueFromPointer(t) {
    const e = getComputedStyle(this.element).direction === "rtl";
    for (let i = 0; i < this.items.length; i += 1) {
      const s = this.items[i].getBoundingClientRect();
      if (s.width !== 0 && t >= s.left && t <= s.right) {
        let r = (t - s.left) / s.width;
        e && (r = 1 - r);
        const n = Math.round(1 / this.precision), a = Math.min(n, Math.max(1, Math.ceil(r * n)));
        return Number((i + a / n).toFixed(4));
      }
    }
    return null;
  }
  /**
   * @private
   * @param {number|null} value Valor resaltado o `null`.
   */
  _setHover(t) {
    t !== this._hover && (this._hover = t, this.element.classList.toggle("mtx-rating--hovering", t !== null), this._render(), m(this.element, "mtx:rating:active", { value: t }));
  }
  /**
   * Aplica un valor elegido por el usuario y emite `mtx:rating:change`.
   * @private
   * @param {number|null} value Nuevo valor.
   */
  _commit(t) {
    t !== this._value && (this.value = t, m(this.element, "mtx:rating:change", { value: this._value }));
  }
  /**
   * Pinta el estado de cada icono y sincroniza radios y etiquetas accesibles.
   * @private
   */
  _render() {
    const t = this._hover !== null ? this._hover : this._value;
    this.visuals.forEach((e) => {
      const i = parseFloat(e.getAttribute("data-rating-value")), s = t !== null && (this.highlightSelectedOnly ? i === t : i <= t);
      e.classList.toggle("mtx-rating__label--filled", s), e.classList.toggle("mtx-rating__label--hover", this._hover !== null && i === this._hover);
    }), this.items.forEach((e) => {
      const i = Array.from(e.querySelectorAll("[data-rating-value]")).map((s) => parseFloat(s.getAttribute("data-rating-value")));
      e.classList.toggle("mtx-rating__item--active", this._hover !== null && i.includes(this._hover));
    }), this.inputs.forEach((e) => {
      e.checked = e.value === "" ? this._value === null : this._round(parseFloat(e.value)) === this._value;
    }), this.readOnly && this.element.setAttribute("aria-label", c(
      "rating",
      "readOnly",
      { value: this._format(this._value || 0), max: this._format(this.max) },
      `Rated ${this._value || 0} out of ${this.max}`,
      this._locale
    ));
  }
  /** @returns {number|null} Valor actual (`null` sin valoración). */
  get value() {
    return this._value;
  }
  /**
   * Fija el valor sin emitir eventos (se redondea a la precisión; 0 o `null` lo vacía).
   * @param {number|null} val Nuevo valor.
   */
  set value(t) {
    this._value = this._round(t == null ? NaN : Number(t)), this._render();
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains("mtx-rating--disabled");
  }
  /** Deshabilita la valoración. */
  disable() {
    this.element.classList.add("mtx-rating--disabled"), this.element.setAttribute("aria-disabled", "true"), this.inputs.forEach((t) => {
      t.disabled = !0;
    }), this._setHover(null);
  }
  /** Habilita la valoración. */
  enable() {
    this.element.classList.remove("mtx-rating--disabled"), this.element.removeAttribute("aria-disabled"), this.inputs.forEach((t) => {
      t.disabled = !1;
    });
  }
  /** Enfoca el radio seleccionado (o el primero). */
  focus() {
    const t = this.inputs.find((e) => e.checked && e.value !== "") || this.inputs[0];
    t && t.focus();
  }
  /** Destruye la instancia y retira los listeners. */
  destroy() {
    if (this.readOnly) {
      super.destroy();
      return;
    }
    const t = this.element;
    t.removeEventListener("change", this._handleChange), t.removeEventListener("pointerdown", this._handlePointerDown), t.removeEventListener("click", this._handleClick), t.removeEventListener("pointermove", this._handlePointerMove), t.removeEventListener("pointerleave", this._handlePointerLeave), t.removeEventListener("focusout", this._handleFocusOut), super.destroy();
  }
}
_("rating", y);
v();
export {
  y as Rating
};
