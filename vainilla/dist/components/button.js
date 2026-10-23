import "./progress.css";
import "./button.css";
import { r as h, C as u, d as b, q as _ } from "../chunks/core-CJdkPtZx.js";
import { c as m } from "../chunks/progress-B9O329FF.js";
const c = ["center", "start", "end"], g = ["primary", "secondary"];
class f extends u {
  /**
   * Crea una instancia del botón.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(t) {
    super(t);
    const e = t.getAttribute("data-size");
    e && !t.classList.contains(`mtx-button--${e}`) && t.classList.add(`mtx-button--${e}`), t.hasAttribute("data-small") && !t.classList.contains("mtx-button--small") ? t.classList.add("mtx-button--small") : t.hasAttribute("data-large") && !t.classList.contains("mtx-button--large") && t.classList.add("mtx-button--large");
    const i = t.getAttribute("data-color");
    i && i !== "primary" && !t.classList.contains(`mtx-button--${i}`) && t.classList.add(`mtx-button--${i}`);
    const n = t.getAttribute("data-surface");
    g.includes(n) && !t.classList.contains(`mtx-button--on-${n}`) && t.classList.add(`mtx-button--on-${n}`), this._renderIcons(), this._isLink = t.tagName.toLowerCase() === "a", this._handlePointerDown = (a) => {
      if (this.disabled || a.button !== 0) return;
      const s = t.classList.contains("mtx-icon-button");
      b(t, a, { centered: s });
    }, t.addEventListener("pointerdown", this._handlePointerDown), this._isLink && (this._handleClick = (a) => {
      this.disabled && (a.preventDefault(), a.stopPropagation());
    }, t.addEventListener("click", this._handleClick)), this._loading = !1, t.hasAttribute("data-loading") && t.getAttribute("data-loading") !== "false" && this.setLoading(!0);
  }
  /**
   * Genera los iconos de `data-start-icon` / `data-end-icon` (ligadura Material) si aún no existen.
   * Idempotente: no duplica un `.mtx-button__icon` ya presente en ese extremo.
   */
  _renderIcons() {
    const { element: t } = this, e = () => Array.from(t.childNodes).filter((o) => !(o.nodeType === Node.TEXT_NODE && !o.textContent.trim()) && !(o.classList && (o.classList.contains("mtx-ripple-container") || o.classList.contains("mtx-button__loading-indicator")))), i = (o) => !!(o && o.classList && o.classList.contains("mtx-button__icon")), n = (o, l) => {
      const d = document.createElement("span");
      return d.className = `mtx-button__icon mtx-button__icon--${l} material-icons`, d.setAttribute("aria-hidden", "true"), d.textContent = o, d;
    }, a = (t.getAttribute("data-start-icon") || "").trim();
    a && !i(e()[0]) && t.insertBefore(n(a, "start"), t.firstChild);
    const s = (t.getAttribute("data-end-icon") || "").trim(), r = e();
    s && !(r.length > 1 && i(r[r.length - 1])) && t.appendChild(n(s, "end"));
  }
  /** @returns {boolean} `true` mientras el botón está en estado de carga. */
  get loading() {
    return this._loading;
  }
  /** @param {boolean} value Activa o desactiva la carga. */
  set loading(t) {
    this.setLoading(t);
  }
  /**
   * Activa o desactiva el estado de carga: deshabilita, marca `aria-busy` y muestra el indicador.
   * Al desactivarlo restaura el estado `disabled` previo.
   *
   * @param {boolean} value `true` para cargar.
   * @returns {this} La instancia, para encadenar.
   */
  setLoading(t) {
    const e = !!t;
    if (e === this._loading) return this;
    const { element: i } = this;
    if (this._loading = e, e) {
      this._wasDisabled = this.disabled, this._prevTabIndex = i.getAttribute("tabindex"), this._wasDisabled || this.disable();
      const n = i.getAttribute("data-loading-position");
      this._loadingPosition = c.includes(n) ? n : "center", i.setAttribute("aria-busy", "true"), i.setAttribute("data-loading", ""), i.classList.add("mtx-button--loading", `mtx-button--loading-${this._loadingPosition}`), this._mountIndicator();
    } else
      i.classList.remove("mtx-button--loading", ...c.map((n) => `mtx-button--loading-${n}`)), i.removeAttribute("aria-busy"), i.removeAttribute("data-loading"), this._indicator && this._indicator.remove(), this._indicator = null, this._hiddenIcon && this._hiddenIcon.classList.remove("mtx-button__icon--loading-hidden"), this._hiddenIcon = null, this._wasDisabled || (this.enable(), this._isLink && (this._prevTabIndex === null ? i.removeAttribute("tabindex") : i.setAttribute("tabindex", this._prevTabIndex)));
    return this;
  }
  /** Inserta (o reutiliza) el indicador y oculta el icono que sustituye. */
  _mountIndicator() {
    const { element: t } = this, e = this._loadingPosition;
    let i = t.querySelector(":scope > .mtx-button__loading-indicator");
    if (!i) {
      i = document.createElement("span");
      const s = t.getAttribute("data-loading-indicator");
      s ? (i.textContent = s, i.classList.add("mtx-button__loading-indicator--text")) : i.appendChild(m({ size: 16, color: "inherit", decorative: !0 }));
    }
    i.classList.add("mtx-button__loading-indicator"), c.forEach((s) => i.classList.toggle(`mtx-button__loading-indicator--${s}`, s === e)), i.setAttribute("aria-hidden", "true");
    const n = Array.from(t.childNodes).filter((s) => s !== i && !(s.nodeType === Node.TEXT_NODE && !s.textContent.trim()) && !(s.classList && s.classList.contains("mtx-ripple-container"))), a = (s) => s && s.classList && s.classList.contains("mtx-button__icon");
    if (e === "start") {
      const s = n[0];
      a(s) && (this._hiddenIcon = s), t.insertBefore(i, s || null);
    } else if (e === "end") {
      const s = n[n.length - 1];
      a(s) && (this._hiddenIcon = s), t.insertBefore(i, s ? s.nextSibling : null);
    } else
      t.appendChild(i);
    this._hiddenIcon && (this._hiddenIcon.classList.add("mtx-button__icon--loading-hidden"), ["start", "end"].forEach((s) => i.classList.toggle(
      `mtx-button__icon--${s}`,
      this._hiddenIcon.classList.contains(`mtx-button__icon--${s}`)
    ))), this._indicator = i;
  }
  /**
   * Indica si el botón está deshabilitado.
   *
   * Cubre tanto el atributo nativo `disabled` (elementos `<button>`) como
   * `aria-disabled` (necesario cuando el componente se renderiza como
   * `<a>`, que no soporta `disabled` nativamente).
   *
   * @returns {boolean} `true` si el botón está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute("aria-disabled") === "true";
  }
  /**
   * Deshabilita el botón.
   *
   * En elementos de formulario usa el atributo nativo `disabled`; en enlaces
   * (`<a>`) aplica `aria-disabled` y lo retira del orden de tabulación.
   */
  disable() {
    this.element.disabled !== void 0 ? this.element.disabled = !0 : (this.element.setAttribute("aria-disabled", "true"), this.element.tabIndex = -1);
  }
  /**
   * Habilita el botón.
   */
  enable() {
    this.element.disabled !== void 0 ? this.element.disabled = !1 : (this.element.removeAttribute("aria-disabled"), this.element.tabIndex = 0);
  }
  /**
   * Destruye la instancia del botón y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener("pointerdown", this._handlePointerDown), this._isLink && this.element.removeEventListener("click", this._handleClick), super.destroy();
  }
}
h("button", f);
_();
export {
  f as Button
};
