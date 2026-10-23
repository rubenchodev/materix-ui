import "./form-helper-text.css";
import "./checkbox.css";
import "./switch.css";
import { r as d, C as u, d as m, q as _ } from "../chunks/core-CJdkPtZx.js";
import { H as p } from "../chunks/form-helper-text-CHj-h3BR.js";
import { w as b, r as w } from "../chunks/checkbox-LVhTQspP.js";
const f = ["primary", "secondary", "error", "warning", "info", "success"];
class x extends u {
  /**
   * Crea una instancia del interruptor.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-switch">`.
   */
  constructor(t) {
    var o;
    let e = t;
    if (t.matches('input[type="checkbox"]') && (e = t.closest(".mtx-switch") || b(t, "mtx-switch")), super(e), e.classList.add("mtx-switch"), this.input = e.matches('input[type="checkbox"]') ? e : e.querySelector('input[type="checkbox"]'), !this.input)
      throw new TypeError('Switch requiere un <input type="checkbox">.');
    this.input.classList.add("mtx-switch__input"), this.input.setAttribute("role", "switch");
    const s = (i) => w(e, this.input, i);
    let r = e.querySelector(".mtx-switch__track"), n = e.querySelector(".mtx-switch__thumb");
    r || (r = document.createElement("span"), r.className = "mtx-switch__track", n = document.createElement("span"), n.className = "mtx-switch__thumb", r.appendChild(n), this.input.insertAdjacentElement("afterend", r)), this.thumb = n || e.querySelector(".mtx-switch__thumb");
    const a = s("data-label") || s("label");
    if (a && !e.querySelector(".mtx-switch__label")) {
      const i = document.createElement("span");
      i.className = "mtx-switch__label", i.textContent = a, e.appendChild(i);
    }
    (s("data-small") !== null || s("data-size") === "small") && e.classList.add("mtx-switch--small");
    const h = s("data-color");
    f.includes(h) && h !== "primary" && e.classList.add(`mtx-switch--${h}`);
    const l = s("data-helper-text"), c = s("data-error");
    (l || c !== null || (o = e.parentElement) != null && o.classList.contains("mtx-form-control")) && (this.helper = new p({ host: e, target: this.input, helperText: l, errorAttr: c })), this._handlePointerDown = (i) => {
      this.input.disabled || s("data-disable-ripple") !== null || i.button !== 0 || m(this.thumb || e, i, {
        centered: !!this.thumb,
        interactionTarget: e
      });
    }, this._handleReadOnlyClick = (i) => {
      this.input.readOnly && i.preventDefault();
    }, this._handleChange = () => this._syncAria(), e.addEventListener("pointerdown", this._handlePointerDown), this.input.addEventListener("click", this._handleReadOnlyClick), this.input.addEventListener("change", this._handleChange), this._syncAria();
  }
  /** @returns {boolean} `true` si está activado. */
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
  /** Alterna el estado comprobado. */
  toggle() {
    !this.disabled && !this.input.readOnly && (this.checked = !this.checked);
  }
  /** @returns {boolean} `true` si el interruptor está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el interruptor. */
  disable() {
    this.input.disabled = !0, this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita el interruptor. */
  enable() {
    this.input.disabled = !1, this.helper && this.helper.setDisabled(!1);
  }
  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }
  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda (FormHelperText) bajo el interruptor.
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
    return this.helper || (this.helper = new p({ host: this.element, target: this.input })), this.helper;
  }
  /** Sincroniza `aria-checked` con el estado nativo. */
  _syncAria() {
    this.input.setAttribute("aria-checked", String(this.input.checked));
  }
  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this.input.removeEventListener("click", this._handleReadOnlyClick), this.input.removeEventListener("change", this._handleChange), super.destroy();
  }
}
d("switch", x);
_();
export {
  x as Switch
};
