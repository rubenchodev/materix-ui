import { r as n, C as p, v as i } from "./core-CJdkPtZx.js";
function l(t) {
  return t == null || t === "false" ? { error: !1, message: "" } : t === "" || t === "true" ? { error: !0, message: "" } : { error: !0, message: String(t) };
}
class d extends p {
  /**
   * @param {HTMLElement} element Elemento del texto de ayuda.
   */
  constructor(e) {
    super(e), e.classList.add("mtx-form-helper-text"), e.id || (e.id = i("mtx-form-helper-text"));
    const { error: r } = l(e.getAttribute("data-error"));
    this.error = r;
  }
  /** @returns {boolean} `true` si el texto está en estado de error. */
  get error() {
    return this.element.classList.contains("mtx-form-helper-text--error");
  }
  /**
   * Activa o desactiva el estado de error.
   * @param {boolean} value Nuevo estado.
   */
  set error(e) {
    this.element.classList.toggle("mtx-form-helper-text--error", !!e);
  }
  /**
   * Reemplaza el texto visible.
   * @param {string} text Nuevo texto.
   */
  setText(e) {
    this.element.textContent = e == null ? "" : String(e);
  }
}
class f {
  /**
   * @param {object} options Opciones.
   * @param {HTMLElement} options.host Elemento visual que se envuelve (label o grupo).
   * @param {HTMLElement} options.target Elemento que recibe aria-describedby/aria-invalid.
   * @param {string} [options.helperText] Texto de ayuda inicial.
   * @param {string|null} [options.errorAttr] Valor inicial de `data-error`.
   */
  constructor({ host: e, target: r, helperText: s = "", errorAttr: h = null }) {
    this.host = e, this.target = r, this.wrapper = e.parentElement && e.parentElement.classList.contains("mtx-form-control") ? e.parentElement : null, this.helperEl = this.wrapper ? this.wrapper.querySelector(":scope > .mtx-form-helper-text") : null, this._helperText = s || (this.helperEl ? this.helperEl.textContent : ""), this._error = !1, this._baseDescribedBy = (r.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean), this.helperEl && (this._prepareHelper(this.helperEl), this.helperEl.classList.contains("mtx-form-helper-text--error") && (this._error = !0)), s && this.setHelperText(s);
    const { error: o, message: a } = l(h);
    o ? this.setError(a || !0) : this._sync();
  }
  /** @returns {boolean} `true` si el control está en estado de error. */
  get error() {
    return this._error;
  }
  /**
   * Cambia el texto de ayuda base (se muestra cuando no hay mensaje de error).
   * @param {string} text Texto de ayuda; vacío lo elimina.
   */
  setHelperText(e) {
    this._helperText = e ? String(e) : "", this._errorMessage || this._render(this._helperText), this._sync();
  }
  /**
   * Activa el estado de error.
   * @param {string|boolean} [message=true] Mensaje que reemplaza al texto de ayuda, o `true` sin mensaje.
   */
  setError(e = !0) {
    if (e === !1 || e === null) {
      this.clearError();
      return;
    }
    this._error = !0, this._errorMessage = typeof e == "string" ? e : "", this._render(this._errorMessage || this._helperText), this._sync();
  }
  /** Limpia el estado de error y restaura el texto de ayuda. */
  clearError() {
    this._error = !1, this._errorMessage = "", this._render(this._helperText), this._sync();
  }
  /**
   * Sincroniza el estado deshabilitado del contenedor.
   * @param {boolean} disabled Estado.
   */
  setDisabled(e) {
    this._disabled = !!e, this.wrapper && this.wrapper.classList.toggle("mtx-form-control--disabled", this._disabled), this._syncDisabled();
  }
  /**
   * Marca el texto de ayuda con `aria-disabled` cuando el control está deshabilitado,
   * para que su color atenuado (text-disabled) se trate como contenido deshabilitado.
   * @private
   */
  _syncDisabled() {
    if (!this.helperEl) return;
    this._disabled ?? this.target.disabled === !0 ? this.helperEl.setAttribute("aria-disabled", "true") : this.helperEl.removeAttribute("aria-disabled");
  }
  /** Crea el contenedor `.mtx-form-control` si aún no existe. */
  ensureWrapper() {
    if (this.wrapper) return this.wrapper;
    const e = document.createElement("div");
    return e.className = "mtx-form-control", this.host.parentNode && this.host.parentNode.insertBefore(e, this.host), e.appendChild(this.host), this.wrapper = e, e;
  }
  /** @private */
  _prepareHelper(e) {
    e.classList.add("mtx-form-helper-text"), e.id || (e.id = i("mtx-form-helper-text"));
  }
  /** @private */
  _render(e) {
    if (!e) {
      this.helperEl && this.helperEl.dataset.mtxGenerated === "" ? (this.helperEl.remove(), this.helperEl = null) : this.helperEl && (this.helperEl.textContent = "");
      return;
    }
    if (!this.helperEl) {
      const r = this.ensureWrapper(), s = document.createElement("p");
      s.dataset.mtxGenerated = "", this._prepareHelper(s), r.appendChild(s), this.helperEl = s;
    }
    this.helperEl.textContent = e;
  }
  /** @private */
  _sync() {
    this.helperEl && this.helperEl.classList.toggle("mtx-form-helper-text--error", this._error), this._syncDisabled(), this.wrapper && this.wrapper.classList.toggle("mtx-form-control--error", this._error);
    const e = [...this._baseDescribedBy];
    this.helperEl && this.helperEl.id && this.helperEl.textContent && e.push(this.helperEl.id);
    const r = [...new Set(e)];
    r.length ? this.target.setAttribute("aria-describedby", r.join(" ")) : this.target.removeAttribute("aria-describedby"), this._error ? (this.target.setAttribute("aria-invalid", "true"), this._ownsInvalid = !0) : this._ownsInvalid && (this.target.removeAttribute("aria-invalid"), this._ownsInvalid = !1);
  }
}
n("form-helper-text", d);
export {
  d as F,
  f as H,
  l as p
};
