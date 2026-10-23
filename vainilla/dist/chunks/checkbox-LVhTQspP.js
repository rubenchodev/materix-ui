import { r as p, C as u, d as b } from "./core-CJdkPtZx.js";
import { H as d } from "./form-helper-text-CHj-h3BR.js";
const m = ["primary", "secondary", "error", "warning", "info", "success"];
function x(r, t) {
  const e = document.createElement("label");
  e.className = t;
  const i = r.getAttribute("class");
  return i && (e.className += " " + i), r.parentNode && r.parentNode.insertBefore(e, r), e.appendChild(r), e;
}
function f(r, t, e) {
  return r.hasAttribute(e) ? r.getAttribute(e) : t && t !== r && t.hasAttribute(e) ? t.getAttribute(e) : null;
}
class k extends u {
  /**
   * Crea una instancia de la casilla.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-checkbox">`.
   */
  constructor(t) {
    var o;
    let e = t;
    if (t.matches('input[type="checkbox"]') && (e = t.closest(".mtx-checkbox") || x(t, "mtx-checkbox")), super(e), e.classList.add("mtx-checkbox"), this.input = e.matches('input[type="checkbox"]') ? e : e.querySelector('input[type="checkbox"]'), !this.input)
      throw new TypeError('Checkbox requiere un <input type="checkbox">.');
    this.input.classList.add("mtx-checkbox__input");
    const i = (s) => f(e, this.input, s);
    let n = e.querySelector(".mtx-checkbox__box");
    n || (n = document.createElement("span"), n.className = "mtx-checkbox__box", this.input.insertAdjacentElement("afterend", n)), this.box = n;
    const h = i("data-label") || i("label");
    if (h && !e.querySelector(".mtx-checkbox__label")) {
      const s = document.createElement("span");
      s.className = "mtx-checkbox__label", s.textContent = h, e.appendChild(s);
    }
    (i("data-small") !== null || i("data-size") === "small") && e.classList.add("mtx-checkbox--small");
    const a = i("data-color");
    m.includes(a) && a !== "primary" && e.classList.add(`mtx-checkbox--${a}`), i("data-indeterminate") !== null && i("data-indeterminate") !== "false" && (this.input.indeterminate = !0);
    const l = i("data-helper-text"), c = i("data-error");
    (l || c !== null || (o = e.parentElement) != null && o.classList.contains("mtx-form-control")) && (this.helper = new d({ host: e, target: this.input, helperText: l, errorAttr: c })), this._handlePointerDown = (s) => {
      this.input.disabled || i("data-disable-ripple") !== null || s.button !== 0 || b(this.box || e, s, {
        centered: !!this.box,
        interactionTarget: e
      });
    }, e.addEventListener("pointerdown", this._handlePointerDown), this._handleChange = () => this._syncAria(), this.input.addEventListener("change", this._handleChange), this._syncAria();
  }
  /** @returns {boolean} `true` si está comprobada. */
  get checked() {
    return this.input.checked;
  }
  /**
   * Establece el valor comprobado y sincroniza `aria-checked`.
   * @param {boolean} value Nuevo estado.
   */
  set checked(t) {
    this.input.checked = !!t, this._syncAria();
  }
  /** @returns {boolean} `true` si está indeterminada. */
  get indeterminate() {
    return this.input.indeterminate;
  }
  /**
   * Establece el estado indeterminado y sincroniza `aria-checked="mixed"`.
   * @param {boolean} value Nuevo estado.
   */
  set indeterminate(t) {
    this.input.indeterminate = !!t, this._syncAria();
  }
  /** Alterna el estado comprobado (limpia el indeterminado, como el navegador). */
  toggle() {
    this.disabled || (this.input.indeterminate = !1, this.checked = !this.checked);
  }
  /** @returns {boolean} `true` si la casilla está deshabilitada. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita la casilla. */
  disable() {
    this.input.disabled = !0, this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita la casilla. */
  enable() {
    this.input.disabled = !1, this.helper && this.helper.setDisabled(!1);
  }
  /** Enfoca la casilla nativa. */
  focus() {
    this.input.focus();
  }
  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda (FormHelperText) bajo la casilla.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(t) {
    this._ensureHelper().setHelperText(t);
  }
  /**
   * Activa el estado de error con `aria-invalid` y texto de error opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(t = !0) {
    this._ensureHelper().setError(t);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.helper && this.helper.clearError();
  }
  /** @private */
  _ensureHelper() {
    return this.helper || (this.helper = new d({ host: this.element, target: this.input })), this.helper;
  }
  /** Sincroniza `aria-checked` según checked/indeterminate. */
  _syncAria() {
    this.input.setAttribute("aria-checked", this.input.indeterminate ? "mixed" : String(this.input.checked));
  }
  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.input.removeEventListener("change", this._handleChange), super.destroy();
  }
}
p("checkbox", k);
export {
  k as C,
  f as r,
  x as w
};
