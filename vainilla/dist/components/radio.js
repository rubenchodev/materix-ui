import "./form-helper-text.css";
import "./checkbox.css";
import "./radio.css";
import { r as h, C as u, d as p, g as m, v as b, q as f } from "../chunks/core-CJdkPtZx.js";
import { H as d } from "../chunks/form-helper-text-CHj-h3BR.js";
import { w as g, r as x } from "../chunks/checkbox-LVhTQspP.js";
const C = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>', _ = ["primary", "secondary", "error", "warning", "info", "success"];
class y extends u {
  /**
   * Crea una instancia del radio.
   *
   * @param {HTMLElement} root `<input type="radio">` o `<label class="mtx-radio">`.
   */
  constructor(e) {
    let t = e;
    if (e.matches('input[type="radio"]') && (t = e.closest(".mtx-radio") || g(e, "mtx-radio")), super(t), t.classList.add("mtx-radio"), this.input = t.matches('input[type="radio"]') ? t : t.querySelector('input[type="radio"]'), !this.input)
      throw new TypeError('Radio requiere un <input type="radio">.');
    this.input.classList.add("mtx-radio__input");
    const r = (i) => x(t, this.input, i);
    let a = t.querySelector(".mtx-radio__box");
    a || (a = document.createElement("span"), a.className = "mtx-radio__box", this.input.insertAdjacentElement("afterend", a)), this.box = a;
    const l = r("data-label") || r("label");
    if (l && !t.querySelector(".mtx-radio__label")) {
      const i = document.createElement("span");
      i.className = "mtx-radio__label", i.textContent = l, t.appendChild(i);
    }
    (r("data-small") !== null || r("data-size") === "small") && t.classList.add("mtx-radio--small");
    const s = r("data-color");
    _.includes(s) && s !== "primary" && t.classList.add(`mtx-radio--${s}`), this._handlePointerDown = (i) => {
      this.input.disabled || r("data-disable-ripple") !== null || i.button !== 0 || p(this.box || t, i, {
        centered: !!this.box,
        interactionTarget: t
      });
    }, t.addEventListener("pointerdown", this._handlePointerDown), this.input.removeAttribute("aria-checked");
  }
  /** @returns {boolean} `true` si está seleccionado. */
  get checked() {
    return this.input.checked;
  }
  /**
   * Establece el estado seleccionado (el navegador desmarca el resto del grupo).
   * @param {boolean} value Nuevo estado.
   */
  set checked(e) {
    this.input.checked = !!e;
  }
  /** @returns {boolean} `true` si el radio está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }
  /** Deshabilita el radio. */
  disable() {
    this.input.disabled = !0;
  }
  /** Habilita el radio. */
  enable() {
    this.input.disabled = !1;
  }
  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }
  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), super.destroy();
  }
}
class A extends u {
  /**
   * @param {HTMLElement} element Elemento contenedor del grupo.
   */
  constructor(e) {
    var n;
    super(e), e.classList.add("mtx-radio-group"), e.hasAttribute("role") || e.setAttribute("role", "radiogroup");
    const t = e.getAttribute("data-row"), r = e.getAttribute("data-direction");
    (t !== null && t !== "false" || r === "row") && e.classList.add("mtx-radio-group--row"), this.name = e.getAttribute("data-name") || e.getAttribute("name"), this.name && e.querySelectorAll('input[type="radio"]:not([name])').forEach((o) => {
      o.name = this.name;
    });
    const a = e.getAttribute("data-label"), l = e.getAttribute("data-helper-text"), s = e.getAttribute("data-error"), i = (n = e.parentElement) == null ? void 0 : n.classList.contains("mtx-form-control");
    (a || l || s !== null || i) && (this.helper = new d({ host: e, target: e, helperText: l, errorAttr: s })), a && this._buildLabel(a), this._handleChange = (o) => {
      o.target.matches('input[type="radio"]') && m(this.element, "mtx:radio-group:change", { value: o.target.value }, { aliases: ["mtx:change"] });
    }, this.element.addEventListener("change", this._handleChange);
  }
  /** @private */
  _buildLabel(e) {
    const t = this.helper.ensureWrapper();
    let r = t.querySelector(":scope > .mtx-form-label");
    r || (r = document.createElement("div"), r.className = "mtx-form-label", r.id = `${this.element.id || b("mtx-radio-group")}-label`, r.textContent = e, t.insertBefore(r, this.element)), this.labelEl = r, !this.element.hasAttribute("aria-label") && !this.element.hasAttribute("aria-labelledby") && this.element.setAttribute("aria-labelledby", r.id);
  }
  /** @private */
  _radios() {
    const e = Array.from(this.element.querySelectorAll('input[type="radio"]'));
    return this.name ? e.filter((t) => t.name === this.name) : e;
  }
  /** @returns {string} Valor del radio seleccionado ('' si ninguno). */
  get value() {
    const e = this._radios().find((t) => t.checked);
    return e ? e.value : "";
  }
  /**
   * Selecciona el radio que coincide con el valor dado.
   * @param {string} val Valor a seleccionar.
   */
  set value(e) {
    this._radios().forEach((t) => {
      t.checked = t.value === String(e);
    });
  }
  /** @returns {boolean} `true` si todos los radios están deshabilitados. */
  get disabled() {
    const e = this._radios();
    return e.length > 0 && e.every((t) => t.disabled);
  }
  /** Deshabilita todos los radios del grupo. */
  disable() {
    this._radios().forEach((e) => {
      e.disabled = !0;
    }), this.element.setAttribute("aria-disabled", "true"), this.helper && this.helper.setDisabled(!0);
  }
  /** Habilita todos los radios del grupo. */
  enable() {
    this._radios().forEach((e) => {
      e.disabled = !1;
    }), this.element.removeAttribute("aria-disabled"), this.helper && this.helper.setDisabled(!1);
  }
  /** @returns {boolean} `true` si el grupo está en estado de error. */
  get error() {
    return !!(this.helper && this.helper.error);
  }
  /**
   * Cambia el texto de ayuda bajo el grupo.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(e) {
    this._ensureHelper().setHelperText(e);
  }
  /**
   * Activa el estado de error (aria-invalid en el radiogroup) con mensaje opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(e = !0) {
    this._ensureHelper().setError(e);
  }
  /** Limpia el estado de error. */
  clearError() {
    this.helper && this.helper.clearError();
  }
  /** @private */
  _ensureHelper() {
    return this.helper || (this.helper = new d({ host: this.element, target: this.element })), this.helper;
  }
  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener("change", this._handleChange), super.destroy();
  }
}
h("radio", y);
h("radio-group", A);
f();
export {
  C as DOT_SVG,
  y as Radio,
  A as RadioGroup
};
