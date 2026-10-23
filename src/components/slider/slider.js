import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, unregisterInstance } from '../../core/registry.js';
import { emit } from '../../core/events.js';
import { t, getComponentLocale } from '../../i18n/index.js';

const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const LABEL_DISPLAYS = ['auto', 'on', 'off'];
const TRACKS = ['normal', 'inverted', 'false'];

/**
 * Indica si un atributo booleano declarativo está activo (presente y distinto de "false").
 * @param {string|null} value Valor del atributo.
 * @returns {boolean} `true` si está activo.
 */
const isOn = (value) => value !== null && value !== 'false';

/**
 * Número de decimales de un número (para redondear al `step` sin errores de coma flotante).
 * @param {number} num Número.
 * @returns {number} Decimales.
 */
function getDecimals(num) {
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const mantissa = parts[0].split('.')[1];
    return (mantissa ? mantissa.length : 0) + parseInt(parts[1] || '0', 10);
  }
  const decimal = String(num).split('.')[1];
  return decimal ? decimal.length : 0;
}

/**
 * Crea un `<span>` con clase.
 * @param {string} className Clase.
 * @returns {HTMLSpanElement} Nodo.
 */
function span(className) {
  const node = document.createElement('span');
  node.className = className;
  return node;
}

/**
 * Deslizador (Slider de MUI) basado en `<input type="range">` nativos, uno por thumb.
 *
 * Uso declarativo:
 * ```html
 * <input type="range" data-mtx="slider" min="0" max="100" value="30" data-label="Volumen">
 * <input type="range" data-mtx="slider" name="price" data-range data-value="20,60" data-label="Precio">
 * ```
 */
export class Slider extends ComponentBase {
  /**
   * @param {HTMLElement} source `<input type="range">` suelto o contenedor `.mtx-slider` con estructura BEM.
   */
  constructor(source) {
    const isInput = source.matches('input[type="range"]');
    let root = source;
    let generated = false;
    if (isInput) {
      root = source.closest('.mtx-slider');
      if (!root) {
        root = span('mtx-slider');
        // AGENTS §6.3: concatenar clases, nunca setAttribute('class').
        const extra = source.getAttribute('class');
        if (extra) root.className += ' ' + extra;
        if (source.parentNode) source.parentNode.insertBefore(root, source);
        generated = true;
      }
    }

    super(root);
    root.classList.add('mtx-slider');
    this.source = source;
    this._generated = generated;
    this._locale = getComponentLocale(root);
    this._dragging = -1;
    this._activeIndex = -1;

    /** Lee configuración del contenedor o, en su defecto, del elemento original. */
    this._cfg = (name) => {
      if (root.hasAttribute(name)) return root.getAttribute(name);
      return source !== root && source.hasAttribute(name) ? source.getAttribute(name) : null;
    };
    const cfg = this._cfg;
    const firstInput = isInput ? source : root.querySelector('input[type="range"]');
    const num = (attr, dataAttr, fallback) => {
      const fromInput = firstInput ? parseFloat(firstInput.getAttribute(attr)) : NaN;
      if (Number.isFinite(fromInput)) return fromInput;
      const fromData = parseFloat(cfg(dataAttr));
      return Number.isFinite(fromData) ? fromData : fallback;
    };

    this._min = num('min', 'data-min', 0);
    this._max = num('max', 'data-max', 100);
    if (this._max < this._min) this._max = this._min;
    const step = num('step', 'data-step', 1);
    this._step = step > 0 ? step : 1;

    const existingInputs = isInput ? [source] : Array.from(root.querySelectorAll('input[type="range"]'));
    this.range = isOn(cfg('data-range')) || existingInputs.length > 1;
    this.disableSwap = isOn(cfg('data-disable-swap'));
    this.minDistance = Math.max(0, parseFloat(cfg('data-min-distance')) || 0);
    const display = cfg('data-value-label-display');
    this.valueLabelDisplay = LABEL_DISPLAYS.includes(display) ? display : 'off';
    this.valueLabelFormat = cfg('data-value-label-format');
    const track = cfg('data-track');
    this.track = TRACKS.includes(track) ? track : 'normal';
    this.orientation = cfg('data-orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.marksOnly = isOn(cfg('data-marks-only'));
    this.marksInset = isOn(cfg('data-marks-inset'));

    const size = cfg('data-size');
    if (size === 'small') root.classList.add('mtx-slider--small');
    const color = cfg('data-color');
    if (COLORS.includes(color) && color !== 'primary') root.classList.add(`mtx-slider--${color}`);
    root.classList.toggle('mtx-slider--vertical', this.orientation === 'vertical');
    root.classList.toggle('mtx-slider--track-inverted', this.track === 'inverted');
    root.classList.toggle('mtx-slider--track-false', this.track === 'false');
    root.classList.toggle('mtx-slider--marks-inset', this.marksInset);
    root.classList.add(`mtx-slider--label-${this.valueLabelDisplay}`);

    this._build(existingInputs);
    this._marksSpec = cfg('data-marks');
    this._buildMarks();

    // Valor inicial: data-value (admite "20,60") o los value nativos.
    const dataValue = cfg('data-value');
    let initial;
    if (dataValue !== null && dataValue.trim() !== '') {
      initial = dataValue.split(',').map((v) => parseFloat(v));
    } else {
      initial = this.inputs.map((input) => parseFloat(input.getAttribute('value')));
    }
    if (this.range) {
      const a = Number.isFinite(initial[0]) ? initial[0] : this._min;
      const b = Number.isFinite(initial[1]) ? initial[1] : this._max;
      this._values = [a, b];
    } else {
      const v = Number.isFinite(initial[0]) ? initial[0] : (this._min + this._max) / 2;
      this._values = [v];
    }
    this._values = this._normalize(this._values);

    this._applyLabels();
    if (isOn(cfg('data-disabled')) || this.inputs.some((input) => input.disabled)) this.disable();
    this._render();
    this._listen();
  }

  /**
   * Genera rail, track, thumbs, inputs y value labels que falten.
   * @private
   * @param {HTMLInputElement[]} existingInputs Inputs ya presentes.
   */
  _build(existingInputs) {
    const root = this.element;
    this.rail = root.querySelector('.mtx-slider__rail');
    if (!this.rail) {
      this.rail = span('mtx-slider__rail');
      root.insertBefore(this.rail, root.firstChild);
    }
    this.trackEl = root.querySelector('.mtx-slider__track');
    if (!this.trackEl) {
      this.trackEl = span('mtx-slider__track');
      this.rail.insertAdjacentElement('afterend', this.trackEl);
    }

    const inputs = existingInputs.slice(0, this.range ? 2 : 1);
    if (this.range && inputs.length < 2) {
      const second = document.createElement('input');
      second.type = 'range';
      second.setAttribute('data-mtx-generated', '');
      inputs.push(second);
    }
    const baseName = inputs[0].getAttribute('name');
    if (this.range && baseName && inputs[1].hasAttribute('data-mtx-generated')) {
      this._originalName = baseName;
      inputs[0].name = `${baseName}-start`;
      inputs[1].name = `${baseName}-end`;
    }

    this.thumbs = [];
    this.valueLabels = [];
    inputs.forEach((input, index) => {
      let thumb = input.closest('.mtx-slider__thumb');
      if (!thumb || !root.contains(thumb)) {
        thumb = span('mtx-slider__thumb');
        thumb.setAttribute('data-mtx-generated', '');
        root.appendChild(thumb);
        thumb.appendChild(input);
      }
      thumb.setAttribute('data-index', String(index));
      input.classList.add('mtx-slider__input');
      input.setAttribute('data-index', String(index));
      input.min = String(this._min);
      input.max = String(this._max);
      input.step = String(this._step);
      if (this.orientation === 'vertical') input.setAttribute('aria-orientation', 'vertical');
      let label = thumb.querySelector('.mtx-slider__value-label');
      if (!label) {
        label = span('mtx-slider__value-label');
        label.setAttribute('aria-hidden', 'true');
        label.appendChild(span('mtx-slider__value-label-text'));
        thumb.appendChild(label);
      }
      this.thumbs.push(thumb);
      this.valueLabels.push(label.querySelector('.mtx-slider__value-label-text') || label);
    });
    this.inputs = inputs;
  }

  /**
   * Interpreta `data-marks`: "true" (cada step), lista "0:0°C,20:20°C" o JSON `[{value,label}]`.
   * @private
   * @returns {{value: number, label: string|null}[]} Marcas.
   */
  _parseMarks() {
    const spec = this._marksSpec;
    if (spec === null || spec === 'false') return [];
    if (spec === '' || spec === 'true') {
      const count = Math.floor((this._max - this._min) / this._step);
      if (count > 500) return [];
      const marks = [];
      for (let i = 0; i <= count; i += 1) marks.push({ value: this._roundStep(this._min + i * this._step), label: null });
      return marks;
    }
    if (spec.trim().startsWith('[')) {
      try {
        return JSON.parse(spec)
          .filter((m) => m && Number.isFinite(Number(m.value)))
          .map((m) => ({ value: Number(m.value), label: m.label != null ? String(m.label) : null }));
      } catch (e) {
        return [];
      }
    }
    return spec.split(',').map((part) => {
      const [raw, ...rest] = part.split(':');
      const value = parseFloat(raw);
      const label = rest.length ? rest.join(':').trim() : null;
      return { value, label: label || null };
    }).filter((m) => Number.isFinite(m.value));
  }

  /**
   * (Re)genera las marcas y sus etiquetas.
   * @private
   */
  _buildMarks() {
    const root = this.element;
    root.querySelectorAll('.mtx-slider__mark, .mtx-slider__mark-label').forEach((node) => node.remove());
    this.marks = this._parseMarks().filter((m) => m.value >= this._min && m.value <= this._max);
    this.markNodes = [];
    const firstThumb = this.thumbs[0];
    this.marks.forEach((mark) => {
      const dot = span('mtx-slider__mark');
      dot.setAttribute('data-value', String(mark.value));
      dot.setAttribute('aria-hidden', 'true');
      root.insertBefore(dot, firstThumb);
      let text = null;
      if (mark.label) {
        text = span('mtx-slider__mark-label');
        text.setAttribute('aria-hidden', 'true');
        text.textContent = mark.label;
        root.insertBefore(text, firstThumb);
      }
      const percent = this._percent(mark.value);
      this._place(dot, percent);
      if (text) {
        this._place(text, percent);
        // Etiquetas en los extremos: con data-marks-inset se alinean hacia dentro del rail.
        if (percent <= 0) text.classList.add('mtx-slider__mark-label--start');
        else if (percent >= 100) text.classList.add('mtx-slider__mark-label--end');
      }
      this.markNodes.push({ mark, dot, text });
    });
    root.classList.toggle('mtx-slider--marked', this.marks.some((m) => m.label));
  }

  /**
   * Aplica nombres accesibles (data-label / aria-*) y, en rango, "Mínimo"/"Máximo" por thumb.
   * @private
   */
  _applyLabels() {
    const label = this._cfg('data-label');
    const labelledBy = this._cfg('aria-labelledby');
    if (!this.range) {
      const input = this.inputs[0];
      if (labelledBy && !input.hasAttribute('aria-labelledby') && !input.hasAttribute('aria-label')) {
        input.setAttribute('aria-labelledby', labelledBy);
      }
      if (label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        input.setAttribute('aria-label', label);
      }
      return;
    }
    let base = label || (this._generated ? this.source.getAttribute('aria-label') : null);
    if (!base && labelledBy) {
      const external = document.getElementById(labelledBy);
      base = external ? external.textContent.trim() : null;
    }
    this.inputs.forEach((input, index) => {
      // En BEM manual se respeta un aria-label propio de cada thumb.
      if (!this._generated && input.hasAttribute('aria-label') && !input.hasAttribute('data-mtx-thumb-label')) return;
      const thumb = t('slider', index === 0 ? 'minimum' : 'maximum', null, index === 0 ? 'Minimum' : 'Maximum', this._locale);
      const text = base ? t('slider', 'thumbLabel', { label: base, thumb }, `${base}: ${thumb}`, this._locale) : thumb;
      input.setAttribute('aria-label', text);
      input.setAttribute('data-mtx-thumb-label', '');
      input.removeAttribute('aria-labelledby');
    });
  }

  /**
   * Registra los listeners (todos con `this.listen` para liberarlos en `destroy()`).
   * @private
   */
  _listen() {
    const root = this.element;
    this.listen(root, 'pointerdown', (event) => this._onPointerDown(event));
    this.inputs.forEach((input, index) => {
      this.listen(input, 'keydown', (event) => this._onKeyDown(event, index));
      // Cambios del lector de pantalla u otros agentes que escriben input.value directamente.
      this.listen(input, 'input', () => {
        if (this._syncing) return;
        const raw = parseFloat(input.value);
        if (Number.isFinite(raw)) this._setFromUser(index, raw, true);
      });
      this.listen(input, 'focus', () => { this._activeIndex = index; this._renderActive(); });
      this.listen(input, 'blur', () => { if (this._dragging < 0) { this._activeIndex = -1; this._renderActive(); } });
    });
  }

  /**
   * Inicia el arrastre: elige el thumb más cercano, fija el valor y sigue el puntero.
   * @private
   * @param {PointerEvent} event Evento.
   */
  _onPointerDown(event) {
    if (this.disabled || (event.button !== undefined && event.button !== 0)) return;
    if (event.target && event.target.closest && event.target.closest('.mtx-slider__value-label')) return;
    event.preventDefault();
    const value = this._valueFromPointer(event);
    if (value === null) return;
    const index = this._closestThumb(value);
    this._dragging = index;
    this._activeIndex = index;
    this._startValue = this.value;
    this.element.classList.add('mtx-slider--dragging');
    const input = this.inputs[index];
    try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    this._setFromUser(index, value, false);

    const move = (ev) => {
      if (this._dragging < 0) return;
      const v = this._valueFromPointer(ev);
      if (v !== null) this._setFromUser(this._dragging, v, false);
    };
    const up = () => {
      offMove(); offUp(); offCancel();
      this._dragging = -1;
      this.element.classList.remove('mtx-slider--dragging');
      this._renderActive();
      if (!this._sameValue(this._startValue, this.value)) this._commit();
    };
    const offMove = this.listen(document, 'pointermove', move);
    const offUp = this.listen(document, 'pointerup', up);
    const offCancel = this.listen(document, 'pointercancel', up);
    this._renderActive();
  }

  /**
   * Teclado (como MUI): flechas ±step, PageUp/PageDown ±10 %, Home/End extremos; respeta RTL.
   * @private
   * @param {KeyboardEvent} event Evento.
   * @param {number} index Índice del thumb.
   */
  _onKeyDown(event, index) {
    if (this.disabled) return;
    const current = this._values[index];
    const rtl = this._isRtl() && this.orientation === 'horizontal';
    const big = Math.max(this._step, this._roundStep(this._min + (this._max - this._min) / 10) - this._min);
    let next = null;
    switch (event.key) {
      case 'ArrowUp': next = this._stepFrom(current, 1, this._step); break;
      case 'ArrowDown': next = this._stepFrom(current, -1, this._step); break;
      case 'ArrowRight': next = this._stepFrom(current, rtl ? -1 : 1, this._step); break;
      case 'ArrowLeft': next = this._stepFrom(current, rtl ? 1 : -1, this._step); break;
      case 'PageUp': next = this._stepFrom(current, 1, big); break;
      case 'PageDown': next = this._stepFrom(current, -1, big); break;
      case 'Home': next = this._min; break;
      case 'End': next = this._max; break;
      default: return;
    }
    event.preventDefault();
    const before = this.value;
    this._setFromUser(index, next, false, true);
    if (!this._sameValue(before, this.value)) this._commit();
  }

  /**
   * Siguiente valor en una dirección: por marcas (data-marks-only) o por incremento.
   * @private
   * @param {number} current Valor actual.
   * @param {number} dir 1 o -1.
   * @param {number} amount Incremento.
   * @returns {number} Valor siguiente.
   */
  _stepFrom(current, dir, amount) {
    if (this.marksOnly && this.marks.length) {
      const values = this.marks.map((m) => m.value).sort((a, b) => a - b);
      const found = dir > 0 ? values.find((v) => v > current) : values.reverse().find((v) => v < current);
      return found !== undefined ? found : current;
    }
    return current + dir * amount;
  }

  /**
   * Aplica un valor elegido por el usuario a un thumb (swap / disableSwap / minDistance) y emite `mtx:slider:input`.
   * @private
   * @param {number} index Thumb movido.
   * @param {number} raw Valor bruto.
   * @param {boolean} fromNative Viene del evento `input` nativo.
   * @param {boolean} [fromKeyboard=false] Viene del teclado (sin swap).
   */
  _setFromUser(index, raw, fromNative, fromKeyboard = false) {
    let value = this._snap(raw);
    const values = this._values.slice();
    let active = index;
    if (this.range) {
      const other = 1 - index;
      const dist = this.minDistance;
      if (this.disableSwap || dist > 0 || fromKeyboard || fromNative) {
        value = index === 0
          ? Math.min(value, values[1] - dist)
          : Math.max(value, values[0] + dist);
        value = Math.min(this._max, Math.max(this._min, value));
        values[index] = value;
      } else {
        values[index] = value;
        if ((index === 0 && value > values[other]) || (index === 1 && value < values[other])) {
          // Cruce: intercambia el thumb activo (comportamiento por defecto de MUI).
          values.sort((a, b) => a - b);
          active = values.indexOf(value) === 0 ? 0 : 1;
          if (values[0] === values[1]) active = other;
        }
      }
    } else {
      values[0] = value;
    }
    const changed = !this._sameValue(values, this._values);
    this._values = values;
    if (active !== index) {
      this._dragging = this._dragging >= 0 ? active : this._dragging;
      this._activeIndex = active;
      const input = this.inputs[active];
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    }
    this._render();
    if (changed || fromNative) {
      if (!fromNative) this._dispatchNative('input');
      emit(this.element, 'mtx:slider:input', { value: this.value, activeThumb: this._activeIndex });
    }
  }

  /**
   * Emite `mtx:slider:change` (al soltar o tras el teclado) y `change` nativo.
   * @private
   */
  _commit() {
    this._dispatchNative('change');
    emit(this.element, 'mtx:slider:change', { value: this.value });
  }

  /**
   * Notifica a formularios/frameworks con eventos nativos del input activo sin re-entrar.
   * @private
   * @param {string} type `input` o `change`.
   */
  _dispatchNative(type) {
    const input = this.inputs[Math.max(0, this._activeIndex)];
    if (!input) return;
    this._syncing = true;
    try {
      input.dispatchEvent(new Event(type, { bubbles: true }));
    } finally {
      this._syncing = false;
    }
  }

  /**
   * Valor bajo el puntero (horizontal, vertical y RTL).
   * @private
   * @param {PointerEvent} event Evento.
   * @returns {number|null} Valor o `null` si el rail no tiene tamaño.
   */
  _valueFromPointer(event) {
    const rect = this.rail.getBoundingClientRect();
    let ratio;
    if (this.orientation === 'vertical') {
      if (!rect.height) return null;
      ratio = (rect.bottom - event.clientY) / rect.height;
    } else {
      if (!rect.width) return null;
      ratio = (event.clientX - rect.left) / rect.width;
      if (this._isRtl()) ratio = 1 - ratio;
    }
    ratio = Math.min(1, Math.max(0, ratio));
    return this._min + ratio * (this._max - this._min);
  }

  /**
   * Thumb más cercano a un valor (si coinciden, el que permite moverse hacia el puntero).
   * @private
   * @param {number} value Valor.
   * @returns {number} Índice.
   */
  _closestThumb(value) {
    if (!this.range) return 0;
    const [a, b] = this._values;
    if (a === b) return value < a ? 0 : 1;
    return Math.abs(value - a) <= Math.abs(value - b) ? 0 : 1;
  }

  /**
   * Redondea al step (o a la marca más cercana con data-marks-only) y acota a [min, max].
   * @private
   * @param {number} value Valor bruto.
   * @returns {number} Valor válido.
   */
  _snap(value) {
    let v = Math.min(this._max, Math.max(this._min, Number(value)));
    if (!Number.isFinite(v)) v = this._min;
    if (this.marksOnly && this.marks.length) {
      return this.marks.reduce((best, m) => (Math.abs(m.value - v) < Math.abs(best - v) ? m.value : best), this.marks[0].value);
    }
    return Math.min(this._max, this._roundStep(v));
  }

  /**
   * Redondea al múltiplo de step más cercano desde min.
   * @private
   * @param {number} value Valor.
   * @returns {number} Valor redondeado.
   */
  _roundStep(value) {
    const nearest = Math.round((value - this._min) / this._step) * this._step + this._min;
    return Number(nearest.toFixed(getDecimals(this._step)));
  }

  /**
   * Normaliza un array de valores (step, límites, orden).
   * @private
   * @param {number[]} values Valores.
   * @returns {number[]} Valores válidos.
   */
  _normalize(values) {
    const out = values.map((v) => this._snap(v));
    if (this.range) out.sort((a, b) => a - b);
    return out;
  }

  /** @private */
  _percent(value) {
    const span = this._max - this._min;
    return span ? ((value - this._min) * 100) / span : 0;
  }

  /**
   * Coloca un nodo a un porcentaje del eje (inline-start en horizontal, bottom en vertical).
   * @private
   */
  _place(node, percent) {
    if (this.orientation === 'vertical') {
      node.style.bottom = `${percent}%`;
      node.style.insetInlineStart = '';
    } else {
      node.style.insetInlineStart = `${percent}%`;
      node.style.bottom = '';
    }
  }

  /** @private */
  _isRtl() {
    try {
      return getComputedStyle(this.element).direction === 'rtl';
    } catch (e) {
      return false;
    }
  }

  /** @private */
  _sameValue(a, b) {
    const x = [].concat(a);
    const y = [].concat(b);
    return x.length === y.length && x.every((v, i) => v === y[i]);
  }

  /**
   * Texto del valor según `data-value-label-format` (`{value}`) y el locale.
   * @param {number} value Valor.
   * @returns {string} Texto formateado.
   */
  formatValue(value) {
    let text;
    try {
      text = new Intl.NumberFormat(this._locale, { maximumFractionDigits: Math.max(getDecimals(this._step), 0) }).format(value);
    } catch (e) {
      text = String(value);
    }
    return this.valueLabelFormat ? this.valueLabelFormat.split('{value}').join(text) : text;
  }

  /**
   * Pinta track, thumbs, marcas, value labels y sincroniza los inputs nativos y ARIA.
   * @private
   */
  _render() {
    const pcts = this._values.map((v) => this._percent(v));
    const start = this.range ? pcts[0] : 0;
    const end = this.range ? pcts[1] : pcts[0];
    const trackStart = this.track === 'inverted' && !this.range ? end : start;
    const trackLen = this.track === 'inverted' && !this.range ? 100 - end : end - start;
    if (this.orientation === 'vertical') {
      this.trackEl.style.bottom = `${trackStart}%`;
      this.trackEl.style.height = `${trackLen}%`;
      this.trackEl.style.insetInlineStart = '';
      this.trackEl.style.width = '';
    } else {
      this.trackEl.style.insetInlineStart = `${trackStart}%`;
      this.trackEl.style.width = `${trackLen}%`;
      this.trackEl.style.bottom = '';
      this.trackEl.style.height = '';
    }

    this.thumbs.forEach((thumb, i) => {
      this._place(thumb, pcts[i]);
      const input = this.inputs[i];
      const value = this._values[i];
      this._syncing = true;
      input.value = String(value);
      this._syncing = false;
      input.setAttribute('value', String(value));
      const text = this.formatValue(value);
      if (this.valueLabelFormat) input.setAttribute('aria-valuetext', text);
      else input.removeAttribute('aria-valuetext');
      if (this.valueLabels[i]) this.valueLabels[i].textContent = text;
    });

    // Marcas activas (como MUI): dentro del track.
    const lo = this.range ? this._values[0] : this._min;
    const hi = this.range ? this._values[1] : this._values[0];
    this.markNodes.forEach(({ mark, dot, text }) => {
      let active;
      if (this.track === 'false') active = false;
      else if (this.track === 'inverted') active = this.range ? (mark.value <= lo || mark.value >= hi) : mark.value >= hi;
      else active = mark.value >= lo && mark.value <= hi;
      dot.classList.toggle('mtx-slider__mark--active', active);
      if (text) text.classList.toggle('mtx-slider__mark-label--active', mark.value >= lo && mark.value <= hi);
    });
    this._renderActive();
  }

  /**
   * Marca el thumb activo (arrastre o foco) para el halo y el value label `auto`.
   * @private
   */
  _renderActive() {
    this.thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('mtx-slider__thumb--active', this._dragging === i);
      thumb.classList.toggle('mtx-slider__thumb--focused', this._activeIndex === i);
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
  set value(val) {
    let list = Array.isArray(val) ? val : String(val).split(',');
    list = list.map(Number);
    if (this.range) {
      if (list.length < 2) list = [list[0], this._values[1]];
      this._values = this._normalize(list.slice(0, 2));
    } else {
      this._values = this._normalize([list[0]]);
    }
    this._render();
  }

  /** @returns {number} Mínimo. */
  get min() { return this._min; }

  /** @param {number} v Nuevo mínimo (re-acota el valor y regenera marcas). */
  set min(v) { this._setBounds({ min: Number(v) }); }

  /** @returns {number} Máximo. */
  get max() { return this._max; }

  /** @param {number} v Nuevo máximo. */
  set max(v) { this._setBounds({ max: Number(v) }); }

  /** @returns {number} Incremento. */
  get step() { return this._step; }

  /** @param {number} v Nuevo incremento (> 0). */
  set step(v) { this._setBounds({ step: Number(v) }); }

  /**
   * Actualiza min/max/step, inputs, marcas y valor.
   * @private
   */
  _setBounds({ min = this._min, max = this._max, step = this._step }) {
    if (Number.isFinite(min)) this._min = min;
    if (Number.isFinite(max)) this._max = Math.max(this._min, max);
    if (Number.isFinite(step) && step > 0) this._step = step;
    this.inputs.forEach((input) => {
      input.min = String(this._min);
      input.max = String(this._max);
      input.step = String(this._step);
    });
    this._buildMarks();
    this._values = this._normalize(this._values);
    this._render();
  }

  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains('mtx-slider--disabled');
  }

  /** Deshabilita el slider. */
  disable() {
    this.element.classList.add('mtx-slider--disabled');
    this.element.setAttribute('aria-disabled', 'true');
    this.inputs.forEach((input) => { input.disabled = true; });
  }

  /** Habilita el slider. */
  enable() {
    this.element.classList.remove('mtx-slider--disabled');
    this.element.removeAttribute('aria-disabled');
    this.inputs.forEach((input) => { input.disabled = false; });
  }

  /**
   * Enfoca un thumb.
   * @param {number} [index=0] Índice del thumb.
   */
  focus(index = 0) {
    const input = this.inputs[index] || this.inputs[0];
    if (input) input.focus();
  }

  /**
   * Libera listeners y, si la estructura fue generada desde un `<input>`, restaura el input original.
   */
  destroy() {
    super.destroy();
    if (this.source !== this.element) unregisterInstance(this.source);
    if (!this._generated || !this.element.parentNode) return;
    const source = this.source;
    if (this._originalName) source.name = this._originalName;
    source.classList.remove('mtx-slider__input');
    source.removeAttribute('data-index');
    this.element.parentNode.insertBefore(source, this.element);
    this.element.remove();
    source.removeAttribute('data-mtx-initialized');
  }
}

registerComponent('slider', Slider);
