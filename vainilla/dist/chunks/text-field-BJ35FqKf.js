import { r as b, C as z, v as N, x as q, g as $, o as P, t as g, h as I } from "./core-CJdkPtZx.js";
import { p as M } from "./form-helper-text-CHj-h3BR.js";
class A extends z {
  /**
   * Crea una instancia del campo de texto.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(t) {
    const i = t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement, s = i && t.parentElement ? t.parentElement.closest(".mtx-text-field") : null;
    if (s)
      t = s;
    else if (i) {
      const e = document.createElement("div");
      e.className = "mtx-text-field", Array.from(t.attributes).forEach((a) => {
        a.name === "class" ? e.className += " " + a.value : (a.name.startsWith("data-") || a.name === "label") && e.setAttribute(a.name, a.value);
      }), t.parentNode && t.parentNode.insertBefore(e, t), e.appendChild(t), t = e;
    }
    if (super(t), this.input = t.querySelector(".mtx-text-field__input") || t.querySelector("input, textarea, select") || (t.matches("input, textarea, select") ? t : null), !this.input)
      throw new TypeError("TextField requiere un <input>, <textarea> o <select>.");
    this.input.id || (this.input.id = N("mtx-text-field")), this._autoBuildStructure(), this._createdSupport = !1, this._hasCustomError = !1, this._helperText = this.helperEl ? this.helperEl.textContent : this.support ? this.support.textContent : "", this._helperId = this.support ? this.support.id || `${this.input.id}-helper-text` : "", this._baseDescribedBy = (this.input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean), this.support && (this.support.id = this._helperId, this._syncDescribedBy()), this.element.classList.contains("mtx-text-field--outlined") && this._buildOutline();
    const r = M(this.element.getAttribute("data-error"));
    r.error && this.setError(r.message || !0), this._syncActionsDisabled(), this._handleLocaleChange = () => {
      this._updateCounter(), this._syncPasswordToggle();
    }, this.listen(document, "mtx:locale:change", this._handleLocaleChange), this._initMask(), this._handleInput = (e) => {
      this._mask && this._handleMaskInput(e), this._syncAria(), this._updateCounter(), this._adjustAutoResize();
    }, ["input", "change", "focus", "blur", "keyup"].forEach((e) => this.listen(this.input, e, this._handleInput)), this.listen(this.input, "paste", () => {
      const e = setTimeout(() => {
        this.destroyed || this._handleInput();
      }, 0);
      this.onDestroy(() => clearTimeout(e));
    }), this._syncAria(), this._updateCounter(), this._adjustAutoResize(), this._hasAutoResize && typeof requestAnimationFrame == "function" && requestAnimationFrame(() => {
      this.destroyed || this._adjustAutoResize();
    }), q(this.input, this), this.input.hasAttribute("data-mtx") && this.input.setAttribute("data-mtx-initialized", "");
  }
  /**
   * Construye automáticamente la estructura HTML requerida (label, container, adornments, helper text)
   * cuando el desarrollador utiliza la sintaxis simplificada de un solo elemento.
   * @private
   */
  _autoBuildStructure() {
    const t = this.element;
    t.classList.contains("mtx-text-field") || t.classList.add("mtx-text-field");
    const i = t.getAttribute("data-variant");
    i ? i === "no-label" ? t.classList.add("mtx-text-field--outlined", "mtx-text-field--no-label") : t.classList.add(`mtx-text-field--${i}`) : t.className.match(/mtx-text-field--(outlined|filled|standard|no-label)/) || t.classList.add("mtx-text-field--outlined");
    const s = t.getAttribute("data-size") || this.input.getAttribute("data-size");
    s === "small" || s === "compact" || t.hasAttribute("data-small") || this.input.hasAttribute("data-small") ? t.classList.add("mtx-text-field--small") : s === "large" || t.hasAttribute("data-large") || this.input.hasAttribute("data-large") ? t.classList.add("mtx-text-field--large") : s === "medium" && t.classList.add("mtx-text-field--medium");
    const r = t.getAttribute("data-color");
    r && t.classList.add(`mtx-text-field--${r}`), this.input && !this.input.classList.contains("mtx-text-field__input") && this.input.classList.add("mtx-text-field__input");
    let e = t.querySelector(".mtx-text-field__container");
    e || (e = document.createElement("div"), e.className = "mtx-text-field__container", this.input.parentNode.insertBefore(e, this.input), e.appendChild(this.input)), this.container = e;
    const a = t.getAttribute("data-start-icon") || this.input.getAttribute("data-start-icon");
    if (a && !e.querySelector(".mtx-text-field__adornment--start")) {
      const l = this._createIconOrImage(a, "mtx-text-field__adornment mtx-text-field__adornment--start");
      l && e.insertBefore(l, e.firstChild);
    }
    const n = (l) => t.hasAttribute(l) ? t.getAttribute(l) : this.input.getAttribute(l), o = e.querySelector(".mtx-text-field__action--start");
    o && (this.startAction = o, this._bindActionButton(o, "start"));
    const u = n("data-start-action");
    u && !e.querySelector(".mtx-text-field__adornment--start") && (this.startAction = this._createActionAdornment("start", u, n("data-start-action-label")), t.classList.add("mtx-text-field--adorned-start"));
    const m = n("data-password-toggle"), y = m !== null && m !== "false" && (this.input.getAttribute("type") || "").toLowerCase() === "password", C = n("data-end-action"), f = e.querySelector(".mtx-text-field__action--end");
    f && (y ? this.passwordToggle = f : this.endAction = f, this._bindActionButton(f, "end")), e.querySelector(".mtx-text-field__adornment--end") || (y ? (this.passwordToggle = this._createActionAdornment("end", "visibility", ""), this.passwordToggle.setAttribute("aria-controls", this.input.id), this._syncPasswordToggle()) : C && (this.endAction = this._createActionAdornment("end", C, n("data-end-action-label"))));
    const E = t.getAttribute("data-end-icon") || this.input.getAttribute("data-end-icon");
    if (E && !e.querySelector(".mtx-text-field__adornment--end")) {
      const l = this._createIconOrImage(E, "mtx-text-field__adornment mtx-text-field__adornment--end");
      l && e.appendChild(l);
    }
    e.querySelector(".mtx-text-field__adornment--start") && t.classList.add("mtx-text-field--adorned-start"), e.querySelector(".mtx-text-field__adornment--end") && t.classList.add("mtx-text-field--adorned-end");
    let x = t.getAttribute("data-label") || t.getAttribute("label") || this.input.getAttribute("data-label") || this.input.getAttribute("label");
    const B = t.classList.contains("mtx-text-field--no-label") || t.getAttribute("data-variant") === "no-label" || this.input.getAttribute("data-variant") === "no-label";
    if (!x && !B && this.input.hasAttribute("placeholder")) {
      const l = this.input.getAttribute("placeholder").trim();
      l && (x = l, this.input.setAttribute("placeholder", " "));
    }
    let d = t.querySelector(".mtx-text-field__label");
    x && !d && (d = document.createElement("label"), d.className = "mtx-text-field__label", d.setAttribute("for", this.input.id), d.textContent = x, t.insertBefore(d, e)), this.label = d, this.input && !this.input.hasAttribute("placeholder") && this.input.setAttribute("placeholder", " ");
    const w = this.input instanceof HTMLTextAreaElement;
    if (w || t.hasAttribute("data-multiline") || this.input.hasAttribute("data-multiline")) {
      if (t.classList.add("mtx-text-field--multiline"), !w && (t.hasAttribute("data-multiline") || this.input.hasAttribute("data-multiline"))) {
        const c = document.createElement("textarea");
        Array.from(this.input.attributes).forEach((L) => {
          c.setAttribute(L.name, L.value);
        }), c.value = this.input.value, this.input.parentNode && this.input.parentNode.replaceChild(c, this.input), this.input = c;
      }
      if (!this.input.hasAttribute("rows")) {
        const c = t.getAttribute("data-rows") || t.getAttribute("rows") || this.input.getAttribute("data-rows") || this.input.getAttribute("rows") || "3";
        this.input.setAttribute("rows", c);
      }
      const l = t.getAttribute("data-auto-resize") ?? t.getAttribute("data-autoresize") ?? t.getAttribute("data-autosize") ?? this.input.getAttribute("data-auto-resize") ?? this.input.getAttribute("data-autoresize") ?? this.input.getAttribute("data-autosize"), h = l !== null && l !== "false";
      this._hasAutoResize = h, this._hasAutoResize && t.classList.add("mtx-text-field--auto-resize");
    }
    const S = t.getAttribute("data-helper-text") || this.input.getAttribute("data-helper-text"), _ = (t.getAttribute("data-counter") || this.input.getAttribute("data-counter") || "").toLowerCase(), T = t.getAttribute("data-max-characters") || t.getAttribute("data-max-chars") || this.input.getAttribute("data-max-characters") || this.input.getAttribute("data-max-chars") || (this.input.hasAttribute("maxlength") ? this.input.getAttribute("maxlength") : null), v = t.getAttribute("data-max-words") || this.input.getAttribute("data-max-words");
    this._maxChars = T ? parseInt(T, 10) : null, this._maxWords = v ? parseInt(v, 10) : null, _ === "words" || !_ && this._maxWords && !this._maxChars ? this._counterType = "words" : _ === "both" || this._maxWords && this._maxChars ? this._counterType = "both" : _ || this._maxChars ? this._counterType = "characters" : this._counterType = null;
    const k = !!this._counterType;
    let p = t.querySelector(".mtx-text-field__supporting-text");
    if ((S || k) && !p && (p = document.createElement("div"), p.className = "mtx-text-field__supporting-text", t.appendChild(p)), this.support = p, this.support) {
      let l = this.support.querySelector(".mtx-text-field__helper-text");
      if (!l) {
        l = document.createElement("span"), l.className = "mtx-text-field__helper-text";
        const h = S || (this.support.childNodes.length === 1 && this.support.firstChild.nodeType === Node.TEXT_NODE ? this.support.textContent.trim() : "");
        h && (l.textContent = h), this.support.textContent = "", this.support.appendChild(l);
      }
      if (this.helperEl = l, k) {
        let h = this.support.querySelector(".mtx-text-field__counter");
        h || (h = document.createElement("span"), h.className = "mtx-text-field__counter", h.setAttribute("aria-live", "polite"), this.support.appendChild(h)), this.counterEl = h;
      }
    }
    if (this.input instanceof HTMLSelectElement && (t.classList.add("mtx-text-field--select"), !e.querySelector(".mtx-text-field__chevron"))) {
      const l = document.createElement("span");
      l.className = "mtx-text-field__chevron", l.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>', e.appendChild(l);
    }
  }
  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label.
   */
  _buildOutline() {
    if (this.container.querySelector(".mtx-text-field__outline")) return;
    const t = document.createElement("fieldset");
    if (t.className = "mtx-text-field__outline", t.setAttribute("aria-hidden", "true"), this.label && !this.element.classList.contains("mtx-text-field--hidden-label")) {
      const s = document.createElement("legend");
      s.className = "mtx-text-field__legend";
      const r = document.createElement("span");
      r.textContent = this.label.textContent, s.appendChild(r), t.appendChild(s);
    }
    this.container.appendChild(t);
  }
  /**
   * Valor actual del campo.
   *
   * @returns {string} Valor del input.
   */
  get value() {
    return this.input.value;
  }
  /**
   * Establece el valor del campo.
   *
   * @param {string} value Nuevo valor.
   */
  set value(t) {
    this._mask ? this.input.value = this._formatValue(t != null ? String(t) : "") : this.input.value = t, this._syncAria(), this._updateCounter(), this._adjustAutoResize();
  }
  /**
   * Obtiene el valor limpio sin caracteres de formato de la máscara.
   *
   * @returns {string} Valor desmascarado.
   */
  get unmaskedValue() {
    return this._mask ? this._maskType === "currency" ? this._unmaskCurrency(this.input.value) : this._unmaskPattern(this.input.value, this._pattern) : this.input.value;
  }
  /**
   * Establece el valor limpio y lo formatea automáticamente según la máscara.
   *
   * @param {string|number} val Valor sin formato.
   */
  set unmaskedValue(t) {
    if (!this._mask) {
      this.value = t;
      return;
    }
    const i = t == null ? "" : String(t);
    this.value = this._formatValue(i);
  }
  /**
   * Indica si la máscara actual ha sido completada en todos sus slots.
   *
   * @returns {boolean} `true` si está completa.
   */
  get isMaskComplete() {
    if (!this._mask) return !0;
    if (this._maskType === "currency")
      return !!(this.unmaskedValue && parseFloat(this.unmaskedValue) > 0);
    if (!this._pattern) return !0;
    const t = (this._pattern.match(/[0aA*]/g) || []).length;
    return this.unmaskedValue.length >= t;
  }
  /**
   * Indica si el campo está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.input.disabled;
  }
  /**
   * Deshabilita el campo.
   */
  disable() {
    this.input.disabled = !0, this._syncActionsDisabled();
  }
  /**
   * Habilita el campo.
   */
  enable() {
    this.input.disabled = !1, this._syncActionsDisabled();
  }
  /**
   * Indica si la contraseña se muestra en claro (solo con `data-password-toggle`).
   *
   * @returns {boolean} `true` si el input es de tipo texto.
   */
  get passwordVisible() {
    return !!this.passwordToggle && this.input.type === "text";
  }
  /**
   * Muestra u oculta la contraseña y sincroniza el botón (icono y `aria-pressed`).
   *
   * @param {boolean} [force] Estado deseado; si se omite, alterna.
   * @returns {boolean} `true` si la contraseña queda visible.
   */
  togglePasswordVisibility(t) {
    if (!this.passwordToggle) return !1;
    const i = typeof t == "boolean" ? t : this.input.type === "password", s = document.activeElement === this.input, { selectionStart: r, selectionEnd: e } = this.input;
    if (this.input.type = i ? "text" : "password", s && r !== null)
      try {
        this.input.setSelectionRange(r, e);
      } catch {
      }
    return this._syncPasswordToggle(), $(
      this.element,
      "mtx:text-field:password-visibility",
      { visible: i },
      { aliases: ["mtx:password-visibility"] }
    ), i;
  }
  /**
   * Crea un adorno interactivo (IconButton edge-start/edge-end) dentro del contenedor.
   *
   * @param {'start'|'end'} position Posición del adorno.
   * @param {string} icon Nombre del Material Icon.
   * @param {string|null} label Nombre accesible del botón.
   * @returns {HTMLButtonElement} Botón creado.
   * @private
   */
  _createActionAdornment(t, i, s) {
    const r = document.createElement("span");
    r.className = `mtx-text-field__adornment mtx-text-field__adornment--${t} mtx-text-field__adornment--action`;
    const e = document.createElement("button");
    e.type = "button";
    const a = this.element.classList.contains("mtx-text-field--small");
    e.className = `mtx-icon-button mtx-text-field__action mtx-text-field__action--${t}` + (a ? " mtx-icon-button--small" : ""), e.setAttribute("data-mtx", "icon-button"), s && e.setAttribute("aria-label", s);
    const n = document.createElement("span");
    return n.className = "material-icons", n.setAttribute("aria-hidden", "true"), n.textContent = i, e.appendChild(n), r.appendChild(e), t === "start" ? this.container.insertBefore(r, this.container.firstChild) : this.container.appendChild(r), this._bindActionButton(e, t), e;
  }
  /**
   * Enlaza clic y mousedown de un botón de adorno (liberados en `destroy()`).
   *
   * @param {HTMLButtonElement} button Botón del adorno.
   * @param {'start'|'end'} position Posición del adorno.
   * @private
   */
  _bindActionButton(t, i) {
    this.listen(t, "click", () => {
      if (t === this.passwordToggle) {
        this.togglePasswordVisibility();
        return;
      }
      $(
        this.element,
        "mtx:text-field:adornment-click",
        { position: i, button: t, input: this.input },
        { aliases: ["mtx:adornment-click"] }
      );
    }), this.listen(t, "mousedown", (s) => s.preventDefault()), P(t, "icon-button");
  }
  /**
   * Refleja en el botón de contraseña el estado actual (icono, aria-pressed y nombre i18n).
   * @private
   */
  _syncPasswordToggle() {
    const t = this.passwordToggle;
    if (!t) return;
    const i = this.input.type === "text", r = this.element.getAttribute("data-password-toggle-label") || this.input.getAttribute("data-password-toggle-label") || g("textField", "showPassword", null, "Show password", I(this.element));
    t.setAttribute("aria-pressed", String(i)), t.setAttribute("aria-label", r);
    const e = t.querySelector(".material-icons");
    e && (e.textContent = i ? "visibility_off" : "visibility");
  }
  /**
   * Sincroniza el estado deshabilitado de los adornos interactivos con el input.
   * @private
   */
  _syncActionsDisabled() {
    [this.startAction, this.endAction, this.passwordToggle].forEach((t) => {
      t && (t.disabled = this.input.disabled);
    });
  }
  /**
   * Libera los listeners de la instancia (input, botones y documento).
   */
  destroy() {
    super.destroy();
  }
  /**
   * Enfoca el input.
   */
  focus() {
    this.input.focus();
  }
  /**
   * Muestra el estado de error.
   *
   * @param {string|boolean} message Mensaje de error, `true` para error sin mensaje
   *   (conserva el helper text) o cadena vacía/`false` para limpiar.
   */
  setError(t) {
    if (!t) {
      this.clearError();
      return;
    }
    if (this._hasCustomError = !0, this.element.classList.add("mtx-text-field--error"), this.input.setAttribute("aria-invalid", "true"), t === !0) {
      this._syncDescribedBy();
      return;
    }
    const i = `${this.input.id}-error`;
    this.support || (this.support = document.createElement("div"), this.support.className = "mtx-text-field__supporting-text", this.element.appendChild(this.support), this._createdSupport = !0), this.support.id = i, this.support.dataset.mtxError = "", this.helperEl || (this.helperEl = document.createElement("span"), this.helperEl.className = "mtx-text-field__helper-text", this.support.insertBefore(this.helperEl, this.support.firstChild)), this.helperEl.id = i, this.helperEl.textContent = t, this.helperEl.dataset.mtxError = "", this._syncDescribedBy();
  }
  /**
   * Limpia el estado de error.
   */
  clearError() {
    this._hasCustomError = !1, this.element.classList.remove("mtx-text-field--error"), this.input.removeAttribute("aria-invalid"), this.support && (this._createdSupport && !this.counterEl ? (this.support.remove(), this.support = null, this.helperEl = null, this._createdSupport = !1) : (this.support.id = this._helperId || "", delete this.support.dataset.mtxError, this.helperEl ? (this.helperEl.textContent = this._helperText || "", this.helperEl.id = this._helperId || "", delete this.helperEl.dataset.mtxError) : this.support.textContent = this._helperText || "")), this._updateCounter(), this._syncDescribedBy();
  }
  /** Sincroniza los ids de ayuda y error sin borrar referencias externas. */
  _syncDescribedBy() {
    const t = [...this._baseDescribedBy];
    this.support && this.support.id && t.push(this.support.id);
    const i = [...new Set(t)];
    i.length ? this.input.setAttribute("aria-describedby", i.join(" ")) : this.input.removeAttribute("aria-describedby");
  }
  /** Quita el foco del control. */
  blur() {
    this.input.blur();
  }
  /**
   * Sincroniza la clase de estado si hay un valor, un placeholder de texto visible o tipo fecha/hora.
   */
  _syncAria() {
    const t = this.input.value, i = !!(t && String(t).trim() !== ""), s = this.input.getAttribute("placeholder"), r = !!(s && s.trim() !== "" && s.trim() !== " "), e = (this.input.getAttribute("type") || "").toLowerCase(), a = ["date", "time", "datetime-local", "month", "week"].includes(e), n = this.input instanceof HTMLSelectElement;
    i || r || a || n ? this.element.classList.add("mtx-text-field--has-value") : this.element.classList.remove("mtx-text-field--has-value");
  }
  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(t) {
    return typeof t == "string" && (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/") || t.startsWith("./") || t.startsWith("../") || t.startsWith("data:image/") || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(t));
  }
  /**
   * Crea un elemento <img> para URLs o un <span> con Material Icons.
   *
   * @param {string} val Nombre del icono o URL de la imagen.
   * @param {string} className Clases CSS a aplicar.
   * @param {string} [defaultIconClass] Clase por defecto para iconos de texto.
   * @returns {HTMLElement|null} Elemento DOM generado.
   * @private
   */
  _createIconOrImage(t, i, s) {
    if (!t) return null;
    if (this._isImageUrl(t)) {
      const e = document.createElement("img");
      return e.src = t, e.alt = "", e.className = i ? `${i} mtx-text-field__adornment--image` : "mtx-text-field__adornment--image", e;
    }
    const r = document.createElement("span");
    return r.className = i ? `${i} ${s || "material-icons"}` : s || "material-icons", r.setAttribute("aria-hidden", "true"), r.textContent = t, r;
  }
  /**
   * Inicializa el sistema de máscaras declarativas si data-mask está presente.
   * @private
   */
  _initMask() {
    const t = this.element, i = t.getAttribute("data-mask") || this.input.getAttribute("data-mask");
    if (!i) {
      this._mask = null;
      return;
    }
    this._mask = i.trim();
    const s = {
      "credit-card": "0000 0000 0000 0000",
      date: "00/00/0000",
      "date-short": "00/00",
      time: "00:00",
      "time-ampm": "00:00 AA",
      "time-seconds": "00:00:00",
      phone: "(000) 000-0000",
      "phone-intl": "+00 (000) 000-0000",
      cpf: "000.000.000-00",
      cnpj: "00.000.000/0000-00",
      zip: "00000-000",
      "postal-code": "00000-0000"
    };
    this._mask === "currency" || this._mask === "money" ? (this._maskType = "currency", this._currencyOptions = {
      prefix: t.getAttribute("data-currency-prefix") ?? this.input.getAttribute("data-currency-prefix") ?? "$ ",
      suffix: t.getAttribute("data-currency-suffix") ?? this.input.getAttribute("data-currency-suffix") ?? "",
      thousands: t.getAttribute("data-thousands") ?? this.input.getAttribute("data-thousands") ?? ",",
      decimal: t.getAttribute("data-decimal") ?? this.input.getAttribute("data-decimal") ?? ".",
      precision: parseInt(t.getAttribute("data-precision") ?? this.input.getAttribute("data-precision") ?? "2", 10)
    }) : (this._maskType = "pattern", this._pattern = s[this._mask.toLowerCase()] || this._mask), this.input.value && (this.input.value = this._formatValue(this.input.value));
  }
  /**
   * Formatea un valor según la máscara configurada.
   *
   * @param {string} val Valor a formatear.
   * @returns {string} Valor formateado.
   * @private
   */
  _formatValue(t) {
    return this._mask ? this._maskType === "currency" ? this._applyCurrencyMask(t, this._currencyOptions) : this._applyPatternMask(t, this._pattern) : t;
  }
  /**
   * Evalúa si un carácter es un token de slot en la máscara.
   *
   * @param {string} char Carácter.
   * @returns {boolean} `true` si es token.
   * @private
   */
  _isSlotToken(t) {
    return t === "0" || t === "a" || t === "A" || t === "*";
  }
  /**
   * Evalúa si un carácter coincide con el token de slot.
   *
   * @param {string} token Token de la máscara.
   * @param {string} char Carácter a validar.
   * @returns {boolean} `true` si coincide.
   * @private
   */
  _matchesSlot(t, i) {
    return i ? t === "0" ? /\d/.test(i) : t === "a" || t === "A" ? /[a-zA-Z]/.test(i) : t === "*" ? /[0-9a-zA-Z]/.test(i) : !1 : !1;
  }
  /**
   * Aplica la máscara basada en patrón al texto.
   *
   * @param {string} rawText Texto sin formatear o parcialmente formateado.
   * @param {string} pattern Patrón de máscara.
   * @returns {string} Texto formateado.
   * @private
   */
  _applyPatternMask(t, i) {
    if (!i || !t) return "";
    let s = "";
    for (let n = 0; n < t.length; n++) {
      const o = t[n];
      /[0-9a-zA-Z]/.test(o) && (s += o);
    }
    if (!s) return "";
    let r = 0, e = "", a = !1;
    for (let n = 0; n < i.length && r < s.length; n++) {
      const o = i[n];
      if (this._isSlotToken(o)) {
        for (; r < s.length && !this._matchesSlot(o, s[r]); )
          r++;
        if (r < s.length) {
          let u = s[r++];
          o === "A" ? u = u.toUpperCase() : o === "a" && (u = u.toLowerCase()), e += u, a = !0;
        }
      } else
        e += o;
    }
    if (a) {
      let n = e.length;
      for (; n < i.length && !this._isSlotToken(i[n]); )
        e += i[n++];
    }
    return e;
  }
  /**
   * Extrae los caracteres de slots sin literales.
   *
   * @param {string} formattedValue Valor formateado.
   * @param {string} pattern Patrón.
   * @returns {string} Cadena limpia.
   * @private
   */
  _unmaskPattern(t, i) {
    if (!t || !i) return t || "";
    let s = "", r = 0;
    for (let e = 0; e < t.length && r < i.length; e++) {
      const a = t[e], n = i[r];
      this._isSlotToken(n) ? this._matchesSlot(n, a) && (s += a, r++) : a === n && r++;
    }
    return s;
  }
  /**
   * Aplica formato monetario con prefijo, sufijo y separadores.
   *
   * @param {string} value Valor de entrada.
   * @param {Object} opts Opciones de moneda.
   * @returns {string} Valor formateado.
   * @private
   */
  _applyCurrencyMask(t, i) {
    if (!t) return "";
    const s = String(t).replace(/\D/g, "");
    if (!s) return "";
    const r = i.precision;
    let e = "", a = "";
    if (r > 0) {
      const u = s.padStart(r + 1, "0");
      e = u.slice(0, u.length - r).replace(/^0+(?=\d)/, ""), a = u.slice(u.length - r);
    } else
      e = s.replace(/^0+(?=\d)/, "") || "0";
    const n = e.replace(/\B(?=(\d{3})+(?!\d))/g, i.thousands), o = r > 0 ? `${n}${i.decimal}${a}` : n;
    return `${i.prefix}${o}${i.suffix}`;
  }
  /**
   * Extrae el valor numérico limpio de una cadena de moneda.
   *
   * @param {string} value Cadena formateada.
   * @returns {string} Número como string (ej. "1250.50").
   * @private
   */
  _unmaskCurrency(t) {
    var r;
    if (!t) return "";
    const i = String(t).replace(/\D/g, "");
    if (!i) return "";
    const s = ((r = this._currencyOptions) == null ? void 0 : r.precision) ?? 2;
    if (s > 0) {
      const e = i.padStart(s + 1, "0"), a = e.slice(0, e.length - s).replace(/^0+(?=\d)/, ""), n = e.slice(e.length - s);
      return `${a}.${n}`;
    }
    return i;
  }
  /**
   * Cuenta cuántos caracteres pertenecen a slots antes de una posición dada.
   *
   * @param {string} str Subcadena.
   * @returns {number} Conteo.
   * @private
   */
  _countSlotChars(t) {
    return (t.match(/[0-9a-zA-Z]/g) || []).length;
  }
  /**
   * Calcula la posición del cursor en la cadena formateada basándose en el conteo de slots.
   *
   * @param {string} formatted Cadena formateada.
   * @param {number} targetSlotCount Cantidad de caracteres de slot.
   * @returns {number} Índice del cursor.
   * @private
   */
  _getCursorIndexFromSlotCount(t, i) {
    let s = 0;
    for (let r = 0; r < t.length; r++)
      if (/[0-9a-zA-Z]/.test(t[r]) && s++, s === i)
        return r + 1;
    return t.length;
  }
  /**
   * Gestiona el evento de entrada para actualizar la máscara y preservar la posición del cursor.
   *
   * @param {Event} e Evento de input.
   * @private
   */
  _handleMaskInput(t) {
    var e;
    if (!this._mask) return;
    const i = this.input, s = i.value, r = i.selectionStart || 0;
    if (this._maskType === "currency") {
      const a = this._formatValue(s);
      i.value = a;
      const n = (((e = this._currencyOptions) == null ? void 0 : e.suffix) || "").length, o = Math.max(0, a.length - n);
      i.setSelectionRange(o, o);
    } else {
      const a = this._countSlotChars(s.slice(0, r)), n = this._applyPatternMask(s, this._pattern);
      i.value = n;
      const o = this._getCursorIndexFromSlotCount(n, a);
      i.setSelectionRange(o, o);
    }
  }
  /**
   * Cuenta las palabras contenidas en una cadena de texto.
   *
   * @param {string} text Cadena a evaluar.
   * @returns {number} Número de palabras.
   * @private
   */
  _countWords(t) {
    if (!t || typeof t != "string") return 0;
    const i = t.trim();
    return i ? i.split(/\s+/).filter(Boolean).length : 0;
  }
  /**
   * Actualiza el contenido visual del contador y valida límites máximos.
   * @private
   */
  _updateCounter() {
    if (!this.counterEl) return;
    const t = this.input.value || "", i = t.length, s = this._countWords(t);
    let r = !1, e = "";
    const a = I(this.element);
    if (this._counterType === "both") {
      const n = this._maxWords ? `${s}/${this._maxWords}` : `${s}`, o = this._maxChars ? `${i}/${this._maxChars}` : `${i}`, u = g("textField", "counterWordsShort", { value: n }, "{value} words", a), m = g("textField", "counterCharsShort", { value: o }, "{value} chars", a);
      e = `${u} | ${m}`, this._maxWords && s > this._maxWords && (r = !0), this._maxChars && i > this._maxChars && (r = !0);
    } else this._counterType === "words" ? (e = this._maxWords ? `${s} / ${this._maxWords}` : g("textField", "counterWords", { count: s }, "{count} words", a), this._maxWords && s > this._maxWords && (r = !0)) : (e = this._maxChars ? `${i} / ${this._maxChars}` : `${i}`, this._maxChars && i > this._maxChars && (r = !0));
    this.counterEl.textContent = e, this.counterEl.classList.toggle("mtx-text-field__counter--error", r), r ? (this.element.classList.add("mtx-text-field--error"), this.input.setAttribute("aria-invalid", "true")) : this._hasCustomError || (this.element.classList.remove("mtx-text-field--error"), this.input.removeAttribute("aria-invalid"));
  }
  /**
   * Ajusta automáticamente la altura del textarea según su contenido solo si tiene auto-resize activo.
   * @private
   */
  _adjustAutoResize() {
    if (!this._hasAutoResize || !(this.input instanceof HTMLTextAreaElement))
      return;
    const t = this.input;
    t.style.height = "auto";
    const i = t.scrollHeight;
    if (i <= 0) return;
    const s = this.element.getAttribute("data-max-rows") || t.getAttribute("data-max-rows");
    if (s) {
      const r = parseInt(s, 10);
      if (!isNaN(r) && r > 0) {
        const e = typeof window < "u" && window.getComputedStyle ? window.getComputedStyle(t) : null, a = e && parseFloat(e.lineHeight) || 24, n = e && parseFloat(e.paddingTop) || 0, o = e && parseFloat(e.paddingBottom) || 0, u = a * r + n + o;
        if (i > u) {
          t.style.height = `${u}px`, t.style.overflowY = "auto";
          return;
        }
      }
    }
    t.style.height = `${i}px`, t.style.overflowY = "hidden";
  }
}
b("text-field", A);
b("input", A);
b("textarea", A);
export {
  A as T
};
