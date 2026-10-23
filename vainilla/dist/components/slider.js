import "./slider.css";
import { r as F, C as N, h as E, t as k, g as A, y as M, q as w } from "../chunks/core-CJdkPtZx.js";
const I = ["primary", "secondary", "error", "warning", "info", "success"], C = ["auto", "on", "off"], D = ["normal", "inverted", "false"], f = (c) => c !== null && c !== "false";
function S(c) {
  if (Math.abs(c) < 1) {
    const e = c.toExponential().split("e-"), s = e[0].split(".")[1];
    return (s ? s.length : 0) + parseInt(e[1] || "0", 10);
  }
  const t = String(c).split(".")[1];
  return t ? t.length : 0;
}
function _(c) {
  const t = document.createElement("span");
  return t.className = c, t;
}
class B extends N {
  /**
   * @param {HTMLElement} source `<input type="range">` suelto o contenedor `.mtx-slider` con estructura BEM.
   */
  constructor(t) {
    const e = t.matches('input[type="range"]');
    let s = t, a = !1;
    if (e && (s = t.closest(".mtx-slider"), !s)) {
      s = _("mtx-slider");
      const o = t.getAttribute("class");
      o && (s.className += " " + o), t.parentNode && t.parentNode.insertBefore(s, t), a = !0;
    }
    super(s), s.classList.add("mtx-slider"), this.source = t, this._generated = a, this._locale = E(s), this._dragging = -1, this._activeIndex = -1, this._cfg = (o) => s.hasAttribute(o) ? s.getAttribute(o) : t !== s && t.hasAttribute(o) ? t.getAttribute(o) : null;
    const i = this._cfg, r = e ? t : s.querySelector('input[type="range"]'), l = (o, v, L) => {
      const x = r ? parseFloat(r.getAttribute(o)) : NaN;
      if (Number.isFinite(x)) return x;
      const y = parseFloat(i(v));
      return Number.isFinite(y) ? y : L;
    };
    this._min = l("min", "data-min", 0), this._max = l("max", "data-max", 100), this._max < this._min && (this._max = this._min);
    const n = l("step", "data-step", 1);
    this._step = n > 0 ? n : 1;
    const h = e ? [t] : Array.from(s.querySelectorAll('input[type="range"]'));
    this.range = f(i("data-range")) || h.length > 1, this.disableSwap = f(i("data-disable-swap")), this.minDistance = Math.max(0, parseFloat(i("data-min-distance")) || 0);
    const u = i("data-value-label-display");
    this.valueLabelDisplay = C.includes(u) ? u : "off", this.valueLabelFormat = i("data-value-label-format");
    const m = i("data-track");
    this.track = D.includes(m) ? m : "normal", this.orientation = i("data-orientation") === "vertical" ? "vertical" : "horizontal", this.marksOnly = f(i("data-marks-only")), this.marksInset = f(i("data-marks-inset")), i("data-size") === "small" && s.classList.add("mtx-slider--small");
    const g = i("data-color");
    I.includes(g) && g !== "primary" && s.classList.add(`mtx-slider--${g}`), s.classList.toggle("mtx-slider--vertical", this.orientation === "vertical"), s.classList.toggle("mtx-slider--track-inverted", this.track === "inverted"), s.classList.toggle("mtx-slider--track-false", this.track === "false"), s.classList.toggle("mtx-slider--marks-inset", this.marksInset), s.classList.add(`mtx-slider--label-${this.valueLabelDisplay}`), this._build(h), this._marksSpec = i("data-marks"), this._buildMarks();
    const p = i("data-value");
    let d;
    if (p !== null && p.trim() !== "" ? d = p.split(",").map((o) => parseFloat(o)) : d = this.inputs.map((o) => parseFloat(o.getAttribute("value"))), this.range) {
      const o = Number.isFinite(d[0]) ? d[0] : this._min, v = Number.isFinite(d[1]) ? d[1] : this._max;
      this._values = [o, v];
    } else {
      const o = Number.isFinite(d[0]) ? d[0] : (this._min + this._max) / 2;
      this._values = [o];
    }
    this._values = this._normalize(this._values), this._applyLabels(), (f(i("data-disabled")) || this.inputs.some((o) => o.disabled)) && this.disable(), this._render(), this._listen();
  }
  /**
   * Genera rail, track, thumbs, inputs y value labels que falten.
   * @private
   * @param {HTMLInputElement[]} existingInputs Inputs ya presentes.
   */
  _build(t) {
    const e = this.element;
    this.rail = e.querySelector(".mtx-slider__rail"), this.rail || (this.rail = _("mtx-slider__rail"), e.insertBefore(this.rail, e.firstChild)), this.trackEl = e.querySelector(".mtx-slider__track"), this.trackEl || (this.trackEl = _("mtx-slider__track"), this.rail.insertAdjacentElement("afterend", this.trackEl));
    const s = t.slice(0, this.range ? 2 : 1);
    if (this.range && s.length < 2) {
      const i = document.createElement("input");
      i.type = "range", i.setAttribute("data-mtx-generated", ""), s.push(i);
    }
    const a = s[0].getAttribute("name");
    this.range && a && s[1].hasAttribute("data-mtx-generated") && (this._originalName = a, s[0].name = `${a}-start`, s[1].name = `${a}-end`), this.thumbs = [], this.valueLabels = [], s.forEach((i, r) => {
      let l = i.closest(".mtx-slider__thumb");
      (!l || !e.contains(l)) && (l = _("mtx-slider__thumb"), l.setAttribute("data-mtx-generated", ""), e.appendChild(l), l.appendChild(i)), l.setAttribute("data-index", String(r)), i.classList.add("mtx-slider__input"), i.setAttribute("data-index", String(r)), i.min = String(this._min), i.max = String(this._max), i.step = String(this._step), this.orientation === "vertical" && i.setAttribute("aria-orientation", "vertical");
      let n = l.querySelector(".mtx-slider__value-label");
      n || (n = _("mtx-slider__value-label"), n.setAttribute("aria-hidden", "true"), n.appendChild(_("mtx-slider__value-label-text")), l.appendChild(n)), this.thumbs.push(l), this.valueLabels.push(n.querySelector(".mtx-slider__value-label-text") || n);
    }), this.inputs = s;
  }
  /**
   * Interpreta `data-marks`: "true" (cada step), lista "0:0°C,20:20°C" o JSON `[{value,label}]`.
   * @private
   * @returns {{value: number, label: string|null}[]} Marcas.
   */
  _parseMarks() {
    const t = this._marksSpec;
    if (t === null || t === "false") return [];
    if (t === "" || t === "true") {
      const e = Math.floor((this._max - this._min) / this._step);
      if (e > 500) return [];
      const s = [];
      for (let a = 0; a <= e; a += 1) s.push({ value: this._roundStep(this._min + a * this._step), label: null });
      return s;
    }
    if (t.trim().startsWith("["))
      try {
        return JSON.parse(t).filter((e) => e && Number.isFinite(Number(e.value))).map((e) => ({ value: Number(e.value), label: e.label != null ? String(e.label) : null }));
      } catch {
        return [];
      }
    return t.split(",").map((e) => {
      const [s, ...a] = e.split(":"), i = parseFloat(s), r = a.length ? a.join(":").trim() : null;
      return { value: i, label: r || null };
    }).filter((e) => Number.isFinite(e.value));
  }
  /**
   * (Re)genera las marcas y sus etiquetas.
   * @private
   */
  _buildMarks() {
    const t = this.element;
    t.querySelectorAll(".mtx-slider__mark, .mtx-slider__mark-label").forEach((s) => s.remove()), this.marks = this._parseMarks().filter((s) => s.value >= this._min && s.value <= this._max), this.markNodes = [];
    const e = this.thumbs[0];
    this.marks.forEach((s) => {
      const a = _("mtx-slider__mark");
      a.setAttribute("data-value", String(s.value)), a.setAttribute("aria-hidden", "true"), t.insertBefore(a, e);
      let i = null;
      s.label && (i = _("mtx-slider__mark-label"), i.setAttribute("aria-hidden", "true"), i.textContent = s.label, t.insertBefore(i, e));
      const r = this._percent(s.value);
      this._place(a, r), i && (this._place(i, r), r <= 0 ? i.classList.add("mtx-slider__mark-label--start") : r >= 100 && i.classList.add("mtx-slider__mark-label--end")), this.markNodes.push({ mark: s, dot: a, text: i });
    }), t.classList.toggle("mtx-slider--marked", this.marks.some((s) => s.label));
  }
  /**
   * Aplica nombres accesibles (data-label / aria-*) y, en rango, "Mínimo"/"Máximo" por thumb.
   * @private
   */
  _applyLabels() {
    const t = this._cfg("data-label"), e = this._cfg("aria-labelledby");
    if (!this.range) {
      const a = this.inputs[0];
      e && !a.hasAttribute("aria-labelledby") && !a.hasAttribute("aria-label") && a.setAttribute("aria-labelledby", e), t && !a.hasAttribute("aria-label") && !a.hasAttribute("aria-labelledby") && a.setAttribute("aria-label", t);
      return;
    }
    let s = t || (this._generated ? this.source.getAttribute("aria-label") : null);
    if (!s && e) {
      const a = document.getElementById(e);
      s = a ? a.textContent.trim() : null;
    }
    this.inputs.forEach((a, i) => {
      if (!this._generated && a.hasAttribute("aria-label") && !a.hasAttribute("data-mtx-thumb-label")) return;
      const r = k("slider", i === 0 ? "minimum" : "maximum", null, i === 0 ? "Minimum" : "Maximum", this._locale), l = s ? k("slider", "thumbLabel", { label: s, thumb: r }, `${s}: ${r}`, this._locale) : r;
      a.setAttribute("aria-label", l), a.setAttribute("data-mtx-thumb-label", ""), a.removeAttribute("aria-labelledby");
    });
  }
  /**
   * Registra los listeners (todos con `this.listen` para liberarlos en `destroy()`).
   * @private
   */
  _listen() {
    const t = this.element;
    this.listen(t, "pointerdown", (e) => this._onPointerDown(e)), this.inputs.forEach((e, s) => {
      this.listen(e, "keydown", (a) => this._onKeyDown(a, s)), this.listen(e, "input", () => {
        if (this._syncing) return;
        const a = parseFloat(e.value);
        Number.isFinite(a) && this._setFromUser(s, a, !0);
      }), this.listen(e, "focus", () => {
        this._activeIndex = s, this._renderActive();
      }), this.listen(e, "blur", () => {
        this._dragging < 0 && (this._activeIndex = -1, this._renderActive());
      });
    });
  }
  /**
   * Inicia el arrastre: elige el thumb más cercano, fija el valor y sigue el puntero.
   * @private
   * @param {PointerEvent} event Evento.
   */
  _onPointerDown(t) {
    if (this.disabled || t.button !== void 0 && t.button !== 0 || t.target && t.target.closest && t.target.closest(".mtx-slider__value-label")) return;
    t.preventDefault();
    const e = this._valueFromPointer(t);
    if (e === null) return;
    const s = this._closestThumb(e);
    this._dragging = s, this._activeIndex = s, this._startValue = this.value, this.element.classList.add("mtx-slider--dragging");
    const a = this.inputs[s];
    try {
      a.focus({ preventScroll: !0 });
    } catch {
      a.focus();
    }
    this._setFromUser(s, e, !1);
    const i = (u) => {
      if (this._dragging < 0) return;
      const m = this._valueFromPointer(u);
      m !== null && this._setFromUser(this._dragging, m, !1);
    }, r = () => {
      l(), n(), h(), this._dragging = -1, this.element.classList.remove("mtx-slider--dragging"), this._renderActive(), this._sameValue(this._startValue, this.value) || this._commit();
    }, l = this.listen(document, "pointermove", i), n = this.listen(document, "pointerup", r), h = this.listen(document, "pointercancel", r);
    this._renderActive();
  }
  /**
   * Teclado (como MUI): flechas ±step, PageUp/PageDown ±10 %, Home/End extremos; respeta RTL.
   * @private
   * @param {KeyboardEvent} event Evento.
   * @param {number} index Índice del thumb.
   */
  _onKeyDown(t, e) {
    if (this.disabled) return;
    const s = this._values[e], a = this._isRtl() && this.orientation === "horizontal", i = Math.max(this._step, this._roundStep(this._min + (this._max - this._min) / 10) - this._min);
    let r = null;
    switch (t.key) {
      case "ArrowUp":
        r = this._stepFrom(s, 1, this._step);
        break;
      case "ArrowDown":
        r = this._stepFrom(s, -1, this._step);
        break;
      case "ArrowRight":
        r = this._stepFrom(s, a ? -1 : 1, this._step);
        break;
      case "ArrowLeft":
        r = this._stepFrom(s, a ? 1 : -1, this._step);
        break;
      case "PageUp":
        r = this._stepFrom(s, 1, i);
        break;
      case "PageDown":
        r = this._stepFrom(s, -1, i);
        break;
      case "Home":
        r = this._min;
        break;
      case "End":
        r = this._max;
        break;
      default:
        return;
    }
    t.preventDefault();
    const l = this.value;
    this._setFromUser(e, r, !1, !0), this._sameValue(l, this.value) || this._commit();
  }
  /**
   * Siguiente valor en una dirección: por marcas (data-marks-only) o por incremento.
   * @private
   * @param {number} current Valor actual.
   * @param {number} dir 1 o -1.
   * @param {number} amount Incremento.
   * @returns {number} Valor siguiente.
   */
  _stepFrom(t, e, s) {
    if (this.marksOnly && this.marks.length) {
      const a = this.marks.map((r) => r.value).sort((r, l) => r - l), i = e > 0 ? a.find((r) => r > t) : a.reverse().find((r) => r < t);
      return i !== void 0 ? i : t;
    }
    return t + e * s;
  }
  /**
   * Aplica un valor elegido por el usuario a un thumb (swap / disableSwap / minDistance) y emite `mtx:slider:input`.
   * @private
   * @param {number} index Thumb movido.
   * @param {number} raw Valor bruto.
   * @param {boolean} fromNative Viene del evento `input` nativo.
   * @param {boolean} [fromKeyboard=false] Viene del teclado (sin swap).
   */
  _setFromUser(t, e, s, a = !1) {
    let i = this._snap(e);
    const r = this._values.slice();
    let l = t;
    if (this.range) {
      const h = 1 - t, u = this.minDistance;
      this.disableSwap || u > 0 || a || s ? (i = t === 0 ? Math.min(i, r[1] - u) : Math.max(i, r[0] + u), i = Math.min(this._max, Math.max(this._min, i)), r[t] = i) : (r[t] = i, (t === 0 && i > r[h] || t === 1 && i < r[h]) && (r.sort((m, b) => m - b), l = r.indexOf(i) === 0 ? 0 : 1, r[0] === r[1] && (l = h)));
    } else
      r[0] = i;
    const n = !this._sameValue(r, this._values);
    if (this._values = r, l !== t) {
      this._dragging = this._dragging >= 0 ? l : this._dragging, this._activeIndex = l;
      const h = this.inputs[l];
      try {
        h.focus({ preventScroll: !0 });
      } catch {
        h.focus();
      }
    }
    this._render(), (n || s) && (s || this._dispatchNative("input"), A(this.element, "mtx:slider:input", { value: this.value, activeThumb: this._activeIndex }));
  }
  /**
   * Emite `mtx:slider:change` (al soltar o tras el teclado) y `change` nativo.
   * @private
   */
  _commit() {
    this._dispatchNative("change"), A(this.element, "mtx:slider:change", { value: this.value });
  }
  /**
   * Notifica a formularios/frameworks con eventos nativos del input activo sin re-entrar.
   * @private
   * @param {string} type `input` o `change`.
   */
  _dispatchNative(t) {
    const e = this.inputs[Math.max(0, this._activeIndex)];
    if (e) {
      this._syncing = !0;
      try {
        e.dispatchEvent(new Event(t, { bubbles: !0 }));
      } finally {
        this._syncing = !1;
      }
    }
  }
  /**
   * Valor bajo el puntero (horizontal, vertical y RTL).
   * @private
   * @param {PointerEvent} event Evento.
   * @returns {number|null} Valor o `null` si el rail no tiene tamaño.
   */
  _valueFromPointer(t) {
    const e = this.rail.getBoundingClientRect();
    let s;
    if (this.orientation === "vertical") {
      if (!e.height) return null;
      s = (e.bottom - t.clientY) / e.height;
    } else {
      if (!e.width) return null;
      s = (t.clientX - e.left) / e.width, this._isRtl() && (s = 1 - s);
    }
    return s = Math.min(1, Math.max(0, s)), this._min + s * (this._max - this._min);
  }
  /**
   * Thumb más cercano a un valor (si coinciden, el que permite moverse hacia el puntero).
   * @private
   * @param {number} value Valor.
   * @returns {number} Índice.
   */
  _closestThumb(t) {
    if (!this.range) return 0;
    const [e, s] = this._values;
    return e === s ? t < e ? 0 : 1 : Math.abs(t - e) <= Math.abs(t - s) ? 0 : 1;
  }
  /**
   * Redondea al step (o a la marca más cercana con data-marks-only) y acota a [min, max].
   * @private
   * @param {number} value Valor bruto.
   * @returns {number} Valor válido.
   */
  _snap(t) {
    let e = Math.min(this._max, Math.max(this._min, Number(t)));
    return Number.isFinite(e) || (e = this._min), this.marksOnly && this.marks.length ? this.marks.reduce((s, a) => Math.abs(a.value - e) < Math.abs(s - e) ? a.value : s, this.marks[0].value) : Math.min(this._max, this._roundStep(e));
  }
  /**
   * Redondea al múltiplo de step más cercano desde min.
   * @private
   * @param {number} value Valor.
   * @returns {number} Valor redondeado.
   */
  _roundStep(t) {
    const e = Math.round((t - this._min) / this._step) * this._step + this._min;
    return Number(e.toFixed(S(this._step)));
  }
  /**
   * Normaliza un array de valores (step, límites, orden).
   * @private
   * @param {number[]} values Valores.
   * @returns {number[]} Valores válidos.
   */
  _normalize(t) {
    const e = t.map((s) => this._snap(s));
    return this.range && e.sort((s, a) => s - a), e;
  }
  /** @private */
  _percent(t) {
    const e = this._max - this._min;
    return e ? (t - this._min) * 100 / e : 0;
  }
  /**
   * Coloca un nodo a un porcentaje del eje (inline-start en horizontal, bottom en vertical).
   * @private
   */
  _place(t, e) {
    this.orientation === "vertical" ? (t.style.bottom = `${e}%`, t.style.insetInlineStart = "") : (t.style.insetInlineStart = `${e}%`, t.style.bottom = "");
  }
  /** @private */
  _isRtl() {
    try {
      return getComputedStyle(this.element).direction === "rtl";
    } catch {
      return !1;
    }
  }
  /** @private */
  _sameValue(t, e) {
    const s = [].concat(t), a = [].concat(e);
    return s.length === a.length && s.every((i, r) => i === a[r]);
  }
  /**
   * Texto del valor según `data-value-label-format` (`{value}`) y el locale.
   * @param {number} value Valor.
   * @returns {string} Texto formateado.
   */
  formatValue(t) {
    let e;
    try {
      e = new Intl.NumberFormat(this._locale, { maximumFractionDigits: Math.max(S(this._step), 0) }).format(t);
    } catch {
      e = String(t);
    }
    return this.valueLabelFormat ? this.valueLabelFormat.split("{value}").join(e) : e;
  }
  /**
   * Pinta track, thumbs, marcas, value labels y sincroniza los inputs nativos y ARIA.
   * @private
   */
  _render() {
    const t = this._values.map((n) => this._percent(n)), e = this.range ? t[0] : 0, s = this.range ? t[1] : t[0], a = this.track === "inverted" && !this.range ? s : e, i = this.track === "inverted" && !this.range ? 100 - s : s - e;
    this.orientation === "vertical" ? (this.trackEl.style.bottom = `${a}%`, this.trackEl.style.height = `${i}%`, this.trackEl.style.insetInlineStart = "", this.trackEl.style.width = "") : (this.trackEl.style.insetInlineStart = `${a}%`, this.trackEl.style.width = `${i}%`, this.trackEl.style.bottom = "", this.trackEl.style.height = ""), this.thumbs.forEach((n, h) => {
      this._place(n, t[h]);
      const u = this.inputs[h], m = this._values[h];
      this._syncing = !0, u.value = String(m), this._syncing = !1, u.setAttribute("value", String(m));
      const b = this.formatValue(m);
      this.valueLabelFormat ? u.setAttribute("aria-valuetext", b) : u.removeAttribute("aria-valuetext"), this.valueLabels[h] && (this.valueLabels[h].textContent = b);
    });
    const r = this.range ? this._values[0] : this._min, l = this.range ? this._values[1] : this._values[0];
    this.markNodes.forEach(({ mark: n, dot: h, text: u }) => {
      let m;
      this.track === "false" ? m = !1 : this.track === "inverted" ? m = this.range && n.value <= r || n.value >= l : m = n.value >= r && n.value <= l, h.classList.toggle("mtx-slider__mark--active", m), u && u.classList.toggle("mtx-slider__mark-label--active", n.value >= r && n.value <= l);
    }), this._renderActive();
  }
  /**
   * Marca el thumb activo (arrastre o foco) para el halo y el value label `auto`.
   * @private
   */
  _renderActive() {
    this.thumbs.forEach((t, e) => {
      t.classList.toggle("mtx-slider__thumb--active", this._dragging === e), t.classList.toggle("mtx-slider__thumb--focused", this._activeIndex === e);
    });
  }
  /** @returns {number|number[]} Valor actual (`[inicio, fin]` en rango). */
  get value() {
    return this.range ? this._values.slice() : this._values[0];
  }
  /**
   * Fija el valor sin emitir eventos (se redondea al step y se acota).
   * @param {number|number[]|string} val Número, `[a, b]` o "a,b".
   */
  set value(t) {
    let e = Array.isArray(t) ? t : String(t).split(",");
    e = e.map(Number), this.range ? (e.length < 2 && (e = [e[0], this._values[1]]), this._values = this._normalize(e.slice(0, 2))) : this._values = this._normalize([e[0]]), this._render();
  }
  /** @returns {number} Mínimo. */
  get min() {
    return this._min;
  }
  /** @param {number} v Nuevo mínimo (re-acota el valor y regenera marcas). */
  set min(t) {
    this._setBounds({ min: Number(t) });
  }
  /** @returns {number} Máximo. */
  get max() {
    return this._max;
  }
  /** @param {number} v Nuevo máximo. */
  set max(t) {
    this._setBounds({ max: Number(t) });
  }
  /** @returns {number} Incremento. */
  get step() {
    return this._step;
  }
  /** @param {number} v Nuevo incremento (> 0). */
  set step(t) {
    this._setBounds({ step: Number(t) });
  }
  /**
   * Actualiza min/max/step, inputs, marcas y valor.
   * @private
   */
  _setBounds({ min: t = this._min, max: e = this._max, step: s = this._step }) {
    Number.isFinite(t) && (this._min = t), Number.isFinite(e) && (this._max = Math.max(this._min, e)), Number.isFinite(s) && s > 0 && (this._step = s), this.inputs.forEach((a) => {
      a.min = String(this._min), a.max = String(this._max), a.step = String(this._step);
    }), this._buildMarks(), this._values = this._normalize(this._values), this._render();
  }
  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains("mtx-slider--disabled");
  }
  /** Deshabilita el slider. */
  disable() {
    this.element.classList.add("mtx-slider--disabled"), this.element.setAttribute("aria-disabled", "true"), this.inputs.forEach((t) => {
      t.disabled = !0;
    });
  }
  /** Habilita el slider. */
  enable() {
    this.element.classList.remove("mtx-slider--disabled"), this.element.removeAttribute("aria-disabled"), this.inputs.forEach((t) => {
      t.disabled = !1;
    });
  }
  /**
   * Enfoca un thumb.
   * @param {number} [index=0] Índice del thumb.
   */
  focus(t = 0) {
    const e = this.inputs[t] || this.inputs[0];
    e && e.focus();
  }
  /**
   * Libera listeners y, si la estructura fue generada desde un `<input>`, restaura el input original.
   */
  destroy() {
    if (super.destroy(), this.source !== this.element && M(this.source), !this._generated || !this.element.parentNode) return;
    const t = this.source;
    this._originalName && (t.name = this._originalName), t.classList.remove("mtx-slider__input"), t.removeAttribute("data-index"), this.element.parentNode.insertBefore(t, this.element), this.element.remove(), t.removeAttribute("data-mtx-initialized");
  }
}
F("slider", B);
w();
export {
  B as Slider
};
