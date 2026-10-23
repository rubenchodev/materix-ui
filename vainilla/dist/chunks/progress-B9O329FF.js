import { r as d, C as g, t as v, h as A } from "./core-CJdkPtZx.js";
const o = "http://www.w3.org/2000/svg", h = 44, _ = ["primary", "secondary", "error", "warning", "info", "success", "inherit"];
function u(n, t) {
  if (n == null || n === "") return t;
  const e = parseFloat(n);
  return Number.isFinite(e) ? e : t;
}
class b extends g {
  /**
   * @param {HTMLElement} element Elemento raíz.
   * @param {string} block Bloque BEM (`mtx-circular-progress` o `mtx-linear-progress`).
   * @param {string[]} variants Variantes admitidas.
   */
  constructor(t, e, r) {
    super(t), this._block = e, this._variants = r, t.classList.add(e), this._min = u(t.getAttribute("data-min"), 0), this._max = u(t.getAttribute("data-max"), 100), this._max <= this._min && (this._max = this._min + 100);
    const i = t.getAttribute("data-variant");
    this._variant = r.includes(i) ? i : this._inferVariant(), this._value = this._clamp(u(t.getAttribute("data-value"), this._min)), this._color = "primary";
  }
  /** @returns {string} Variante deducida de los atributos presentes. */
  _inferVariant() {
    return this.element.hasAttribute("data-value") ? "determinate" : "indeterminate";
  }
  /**
   * Limita un número al rango [min, max].
   * @param {number} value Valor de entrada.
   * @returns {number} Valor acotado.
   */
  _clamp(t) {
    return Math.min(this._max, Math.max(this._min, t));
  }
  /** @returns {number} Porcentaje 0–100 del valor actual. */
  get percent() {
    return (this._value - this._min) / (this._max - this._min) * 100;
  }
  /** @returns {number} Valor actual dentro de [min, max]. */
  get value() {
    return this._value;
  }
  /** @param {number} next Nuevo valor. */
  set value(t) {
    this.setValue(t);
  }
  /**
   * Fija el valor; una variante indeterminate pasa a determinate.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setValue(t) {
    const e = u(t, this._value);
    return this._value = this._clamp(e), (this._variant === "indeterminate" || this._variant === "query") && (this._variant = "determinate"), this.element.setAttribute("data-value", String(this._value)), this._render(), this;
  }
  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }
  /** @param {string} next Variante admitida por el componente. */
  set variant(t) {
    this._variants.includes(t) && (this._variant = t, this._render());
  }
  /** @returns {string} Color de la paleta aplicado. */
  get color() {
    return this._color;
  }
  /** @param {string} next `primary`, `secondary`, `error`, `warning`, `info`, `success` o `inherit`. */
  set color(t) {
    this._applyColor(t);
  }
  /**
   * Aplica la clase de color de la paleta.
   * @param {string|null} next Color solicitado.
   */
  _applyColor(t) {
    const e = _.includes(t) ? t : "primary";
    _.forEach((r) => this.element.classList.remove(`${this._block}--${r}`)), this.element.classList.add(`${this._block}--${e}`), this._color = e;
  }
  /** Aplica role, nombre accesible y aria-value* según la variante. */
  _syncAria() {
    const { element: t } = this;
    if (t.hasAttribute("data-decorative")) {
      ["role", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow"].forEach((e) => t.removeAttribute(e)), t.setAttribute("aria-hidden", "true");
      return;
    }
    if (t.setAttribute("role", "progressbar"), !t.hasAttribute("aria-labelledby")) {
      const e = t.getAttribute("data-label");
      e ? t.setAttribute("aria-label", e) : t.hasAttribute("aria-label") || t.setAttribute("aria-label", v("progress", "loading", null, "Loading", A(t)));
    }
    this._hasValue() ? (t.setAttribute("aria-valuemin", String(this._min)), t.setAttribute("aria-valuemax", String(this._max)), t.setAttribute("aria-valuenow", String(Math.round(this._value * 100) / 100))) : (t.removeAttribute("aria-valuemin"), t.removeAttribute("aria-valuemax"), t.removeAttribute("aria-valuenow"));
  }
  /** @returns {boolean} `true` si la variante expone un valor. */
  _hasValue() {
    return this._variant === "determinate" || this._variant === "buffer";
  }
  /** Actualiza las clases de variante. */
  _syncVariantClass() {
    this._variants.forEach((t) => this.element.classList.remove(`${this._block}--${t}`)), this.element.classList.add(`${this._block}--${this._variant}`);
  }
  /** Actualiza el texto de porcentaje visible, si existe. */
  _syncLabel() {
    this.labelEl && (this.labelEl.textContent = this._hasValue() ? `${Math.round(this.percent)}%` : "");
  }
}
class m extends b {
  /**
   * Crea la instancia y construye el SVG si falta.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t, "mtx-circular-progress", ["indeterminate", "determinate"]), this._size = Math.max(4, u(t.getAttribute("data-size"), 40)), this._thickness = Math.max(0.5, u(t.getAttribute("data-thickness"), 3.6)), t.hasAttribute("data-disable-shrink") && t.classList.add("mtx-circular-progress--disable-shrink"), this._ensureStructure(), this._applyColor(t.getAttribute("data-color")), this._render();
  }
  /** Crea (o reutiliza) el SVG, el círculo, la pista y la etiqueta. */
  _ensureStructure() {
    const { element: t } = this, e = (h - this._thickness) / 2;
    this._circumference = 2 * Math.PI * e, t.style.setProperty("--mtx-circular-progress-size", `${this._size}px`);
    let r = t.querySelector(".mtx-circular-progress__svg");
    r || (r = document.createElementNS(o, "svg"), r.setAttribute("class", "mtx-circular-progress__svg"), r.setAttribute("viewBox", `${h / 2} ${h / 2} ${h} ${h}`), r.setAttribute("focusable", "false"), r.setAttribute("aria-hidden", "true"), t.insertBefore(r, t.firstChild));
    const i = (a) => {
      let s = r.querySelector(`.${a}`);
      return s || (s = document.createElementNS(o, "circle"), s.setAttribute("class", a), r.appendChild(s)), s.setAttribute("cx", String(h)), s.setAttribute("cy", String(h)), s.setAttribute("r", String(e)), s.setAttribute("fill", "none"), s.setAttribute("stroke-width", String(this._thickness)), s;
    };
    (t.hasAttribute("data-track") || r.querySelector(".mtx-circular-progress__track")) && (t.classList.add("mtx-circular-progress--track"), this.trackEl = i("mtx-circular-progress__track"), r.insertBefore(this.trackEl, r.firstChild)), this.circleEl = i("mtx-circular-progress__circle"), this.labelEl = t.querySelector(".mtx-circular-progress__label"), !this.labelEl && t.hasAttribute("data-show-label") && (this.labelEl = document.createElement("span"), this.labelEl.className = "mtx-circular-progress__label", t.appendChild(this.labelEl)), this.labelEl && (this.labelEl.setAttribute("aria-hidden", "true"), t.classList.add("mtx-circular-progress--with-label"));
  }
  /** Pinta el arco según la variante y el valor. */
  _render() {
    if (this._syncVariantClass(), this._variant === "determinate") {
      const t = (100 - this.percent) / 100 * this._circumference;
      this.circleEl.style.strokeDasharray = this._circumference.toFixed(3), this.circleEl.style.strokeDashoffset = `${t.toFixed(3)}px`;
    } else
      this.circleEl.style.strokeDasharray = "", this.circleEl.style.strokeDashoffset = "";
    this._syncLabel(), this._syncAria();
  }
  /** @returns {number} Diámetro en px. */
  get size() {
    return this._size;
  }
}
class x extends b {
  /**
   * Crea la instancia y construye pista y barras si faltan.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(t) {
    super(t, "mtx-linear-progress", ["indeterminate", "determinate", "buffer", "query"]), this._buffer = this._clamp(u(t.getAttribute("data-value-buffer"), this._max)), t.hasAttribute("data-rounded") && t.classList.add("mtx-linear-progress--rounded"), this._ensureStructure(), this._applyColor(t.getAttribute("data-color")), this._render();
  }
  /** @returns {string} Variante deducida (buffer si hay `data-value-buffer`). */
  _inferVariant() {
    return this.element.hasAttribute("data-value-buffer") ? "buffer" : super._inferVariant();
  }
  /** Crea (o reutiliza) la pista, el patrón de buffer, las dos barras y la etiqueta. */
  _ensureStructure() {
    const { element: t } = this;
    let e = t.querySelector(".mtx-linear-progress__track");
    e || (e = document.createElement("span"), e.className = "mtx-linear-progress__track", t.insertBefore(e, t.firstChild));
    const r = (i) => {
      let a = e.querySelector(`.${i.split(" ").join(".")}`);
      return a || (a = document.createElement("span"), a.className = i, e.appendChild(a)), a;
    };
    this.trackEl = e, this.dashedEl = r("mtx-linear-progress__dashed"), this.bar1El = r("mtx-linear-progress__bar mtx-linear-progress__bar1"), this.bar2El = r("mtx-linear-progress__bar mtx-linear-progress__bar2"), this.labelEl = t.querySelector(".mtx-linear-progress__label"), !this.labelEl && t.hasAttribute("data-show-label") && (this.labelEl = document.createElement("span"), this.labelEl.className = "mtx-linear-progress__label", t.appendChild(this.labelEl)), this.labelEl && (this.labelEl.setAttribute("aria-hidden", "true"), t.classList.add("mtx-linear-progress--with-label"));
  }
  /** @returns {number} Valor del buffer dentro de [min, max]. */
  get valueBuffer() {
    return this._buffer;
  }
  /** @param {number} next Nuevo valor de buffer. */
  set valueBuffer(t) {
    this.setBuffer(t);
  }
  /**
   * Fija el valor de buffer y activa la variante `buffer`.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setBuffer(t) {
    return this._buffer = this._clamp(u(t, this._buffer)), this._variant = "buffer", this.element.setAttribute("data-value-buffer", String(this._buffer)), this._render(), this;
  }
  /** Pinta las barras según la variante. */
  _render() {
    this._syncVariantClass();
    const t = (e) => `translateX(${((e - this._min) / (this._max - this._min) * 100 - 100).toFixed(3)}%)`;
    this._hasValue() ? (this.bar1El.style.transform = t(this._value), this.bar2El.style.transform = this._variant === "buffer" ? t(this._buffer) : "") : (this.bar1El.style.transform = "", this.bar2El.style.transform = ""), this._syncLabel(), this._syncAria();
  }
}
function y(n = {}) {
  const {
    size: t = 40,
    thickness: e = 3.6,
    color: r = "primary",
    value: i,
    label: a,
    decorative: s = !1,
    disableShrink: f = !1,
    className: c = "",
    tagName: p = "span"
  } = n, l = document.createElement(p);
  return l.setAttribute("data-mtx", "circular-progress"), l.setAttribute("data-size", String(t)), l.setAttribute("data-thickness", String(e)), l.setAttribute("data-color", r), i != null && l.setAttribute("data-value", String(i)), a && !s && l.setAttribute("data-label", a), s && l.setAttribute("data-decorative", ""), f && l.setAttribute("data-disable-shrink", ""), c && (l.className = c), new m(l), l;
}
d("circular-progress", m);
d("linear-progress", x);
export {
  m as C,
  x as L,
  y as c
};
