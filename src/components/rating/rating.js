import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { uniqueId } from '../../core/id.js';
import { emit } from '../../core/events.js';

/** Trazados SVG (24×24, Material Icons) para iconos escalables sin distorsión. */
const SVG_PATHS = {
  star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  star_border: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
  star_outline: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
  favorite: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  favorite_border: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
  circle: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z',
  radio_button_unchecked: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
  thumb_up: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  thumb_up_off_alt: 'M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z',
};

const SIZES = ['small', 'medium', 'large'];

/**
 * Indica si un atributo booleano declarativo está activo (presente y distinto de "false").
 * @param {HTMLElement} el Elemento.
 * @param {string} name Atributo.
 * @returns {boolean} `true` si está activo.
 */
const hasFlag = (el, name) => el.hasAttribute(name) && el.getAttribute(name) !== 'false';

/**
 * Crea el nodo visual de un icono: SVG escalable si es conocido; si no, glifo Material Icons (24px).
 * @param {string} name Nombre del icono.
 * @param {string} className Clase del nodo.
 * @returns {HTMLElement} Nodo del icono.
 */
function createIcon(name, className) {
  const wrapper = document.createElement('span');
  wrapper.className = className;
  wrapper.setAttribute('aria-hidden', 'true');
  const path = SVG_PATHS[name];
  if (path) {
    wrapper.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><path d="${path}"/></svg>`;
  } else {
    const glyph = document.createElement('span');
    glyph.className = 'material-icons';
    glyph.textContent = name;
    wrapper.appendChild(glyph);
  }
  return wrapper;
}

/**
 * Valoración con estrellas (Rating de MUI) basada en radios nativos ocultos.
 *
 * Uso declarativo:
 * ```html
 * <span data-mtx="rating" data-value="3" data-name="score" aria-label="Valoración"></span>
 * ```
 */
export class Rating extends ComponentBase {
  /**
   * @param {HTMLElement} element Contenedor (normalmente un `<span>` vacío).
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-rating');

    this.max = Math.max(1, parseInt(element.getAttribute('data-max'), 10) || 5);
    const precision = parseFloat(element.getAttribute('data-precision'));
    // Solo precisiones que dividen la unidad en partes enteras (1, 0.5, 0.25…).
    this.precision = precision > 0 && precision <= 1 && Number.isInteger(Math.round(1 / precision * 1e6) / 1e6)
      ? precision : 1;
    this.readOnly = hasFlag(element, 'data-read-only') || element.classList.contains('mtx-rating--read-only');
    this.highlightSelectedOnly = hasFlag(element, 'data-highlight-selected-only');
    this.icon = element.getAttribute('data-icon') || 'star';
    this.emptyIcon = element.getAttribute('data-empty-icon')
      || (element.hasAttribute('data-icon') ? this.icon : 'star_border');
    this.name = element.getAttribute('data-name') || element.getAttribute('name') || uniqueId('mtx-rating');
    this._locale = getComponentLocale(element);

    const size = element.getAttribute('data-size');
    if (SIZES.includes(size) && size !== 'medium') element.classList.add(`mtx-rating--${size}`);
    element.classList.toggle('mtx-rating--read-only', this.readOnly);

    const label = element.getAttribute('data-label');
    if (label && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', label);
    }

    this._hover = null;
    this._value = this._round(parseFloat(element.getAttribute('data-value')));

    if (!element.querySelector('.mtx-rating__item')) this._build();
    this._bind();

    if (this.readOnly) {
      element.setAttribute('role', 'img');
    } else if (!element.hasAttribute('role')
      && (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'))) {
      element.setAttribute('role', 'radiogroup');
    }

    if (hasFlag(element, 'data-disabled')) this.disable();
    this._render();

    if (!this.readOnly) this._listen();
  }

  /**
   * Redondea y acota un valor a la precisión y al máximo (`null` = sin valoración).
   * @private
   * @param {number} value Valor bruto.
   * @returns {number|null} Valor normalizado.
   */
  _round(value) {
    if (!Number.isFinite(value) || value <= 0) return null;
    const steps = Math.round(value / this.precision);
    const rounded = Math.min(this.max, Number((steps * this.precision).toFixed(4)));
    return rounded > 0 ? rounded : null;
  }

  /**
   * Formatea un número para las etiquetas accesibles.
   * @private
   * @param {number} value Valor.
   * @returns {string} Texto.
   */
  _format(value) {
    try {
      return new Intl.NumberFormat(this._locale).format(value);
    } catch (e) {
      return String(value);
    }
  }

  /**
   * Etiqueta accesible de un valor ("3 Stars").
   * @private
   * @param {number} value Valor.
   * @returns {string} Etiqueta.
   */
  _labelFor(value) {
    const key = value === 1 ? 'star' : 'stars';
    return t('rating', key, { value: this._format(value) }, `${value} Stars`, this._locale);
  }

  /**
   * Genera la estructura: un ítem por icono y, dentro, un radio + label por cada paso de precisión.
   * @private
   */
  _build() {
    const el = this.element;
    const steps = Math.round(1 / this.precision);
    el.textContent = '';
    for (let i = 1; i <= this.max; i += 1) {
      const item = document.createElement('span');
      item.className = 'mtx-rating__item';
      if (steps > 1) item.classList.add('mtx-rating__item--decimal');
      for (let k = 1; k <= steps; k += 1) {
        const value = Number((i - 1 + k / steps).toFixed(4));
        const visual = document.createElement(this.readOnly ? 'span' : 'label');
        visual.className = 'mtx-rating__label';
        visual.setAttribute('data-rating-value', String(value));
        if (k < steps) {
          visual.classList.add('mtx-rating__label--partial');
          visual.style.width = `${(k / steps) * 100}%`;
          visual.style.zIndex = String(steps - k);
        }
        visual.appendChild(createIcon(this.icon, 'mtx-rating__icon mtx-rating__icon--filled'));
        visual.appendChild(createIcon(this.emptyIcon, 'mtx-rating__icon mtx-rating__icon--empty'));
        if (!this.readOnly) {
          const input = this._createInput(String(value));
          const text = document.createElement('span');
          text.className = 'mtx-rating__visually-hidden';
          text.textContent = this._labelFor(value);
          visual.setAttribute('for', input.id);
          visual.appendChild(text);
          item.appendChild(input);
        }
        item.appendChild(visual);
      }
      el.appendChild(item);
    }
    if (!this.readOnly) {
      // Radio "vacío" (sin valoración), como MUI: permite volver a null con el teclado.
      const input = this._createInput('');
      input.classList.add('mtx-rating__input--empty');
      const emptyLabel = document.createElement('label');
      emptyLabel.className = 'mtx-rating__visually-hidden';
      emptyLabel.setAttribute('for', input.id);
      emptyLabel.textContent = t('rating', 'empty', null, 'Empty', this._locale);
      el.appendChild(input);
      el.appendChild(emptyLabel);
    }
  }

  /**
   * @private
   * @param {string} value Valor del radio.
   * @returns {HTMLInputElement} Radio oculto.
   */
  _createInput(value) {
    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'mtx-rating__input';
    input.name = this.name;
    input.value = value;
    input.id = `${this.name}-${value === '' ? 'empty' : String(value).replace('.', '_')}`;
    return input;
  }

  /**
   * Vincula nodos existentes (estructura generada o BEM manual) y completa los iconos que falten.
   * @private
   */
  _bind() {
    this.items = Array.from(this.element.querySelectorAll('.mtx-rating__item'));
    this.visuals = Array.from(this.element.querySelectorAll('.mtx-rating__label[data-rating-value]'));
    this.visuals.forEach((visual) => {
      if (!visual.querySelector('.mtx-rating__icon--filled')) {
        visual.insertBefore(createIcon(this.icon, 'mtx-rating__icon mtx-rating__icon--filled'), visual.firstChild);
      }
      if (!visual.querySelector('.mtx-rating__icon--empty')) {
        visual.insertBefore(createIcon(this.emptyIcon, 'mtx-rating__icon mtx-rating__icon--empty'),
          visual.querySelector('.mtx-rating__icon--filled').nextSibling);
      }
    });
    this.inputs = Array.from(this.element.querySelectorAll('input.mtx-rating__input'));
    if (this.inputs.length) {
      this.name = this.inputs[0].name || this.name;
      const checked = this.inputs.find((input) => input.checked);
      if (checked && !this.element.hasAttribute('data-value')) this._value = this._round(parseFloat(checked.value));
    }
  }

  /**
   * Registra la interacción: cambio, vista previa al pasar el cursor y borrado al repetir clic.
   * @private
   */
  _listen() {
    this._pointerClick = false;
    this._pointerTimer = null;
    this.onDestroy(() => clearTimeout(this._pointerTimer));
    this._handleChange = (event) => {
      if (!event.target.matches('input.mtx-rating__input')) return;
      this._commit(this._round(parseFloat(event.target.value)));
    };
    this._handlePointerDown = () => {
      this._pointerClick = true;
      clearTimeout(this._pointerTimer);
      this._pointerTimer = setTimeout(() => {
        this._pointerTimer = null;
        this._pointerClick = false;
      }, 600);
    };
    this._handleClick = (event) => {
      const input = event.target;
      if (!input.matches || !input.matches('input.mtx-rating__input') || !this._pointerClick) return;
      // Clic con el puntero sobre el valor ya elegido: lo borra (MUI).
      if (input.value !== '' && this._round(parseFloat(input.value)) === this._value) {
        this._pointerClick = false;
        this._commit(null);
      }
    };
    this._handlePointerMove = (event) => {
      if (this.disabled || event.pointerType === 'touch') return;
      this._setHover(this._valueFromPointer(event.clientX));
    };
    this._handlePointerLeave = () => this._setHover(null);
    this._handleFocusOut = () => this._setHover(null);

    const el = this.element;
    el.addEventListener('change', this._handleChange);
    el.addEventListener('pointerdown', this._handlePointerDown);
    el.addEventListener('click', this._handleClick);
    el.addEventListener('pointermove', this._handlePointerMove);
    el.addEventListener('pointerleave', this._handlePointerLeave);
    el.addEventListener('focusout', this._handleFocusOut);
  }

  /**
   * Calcula el valor bajo el puntero según la posición horizontal (respeta RTL).
   * @private
   * @param {number} clientX Coordenada X del puntero.
   * @returns {number|null} Valor resaltado.
   */
  _valueFromPointer(clientX) {
    const rtl = getComputedStyle(this.element).direction === 'rtl';
    for (let i = 0; i < this.items.length; i += 1) {
      const rect = this.items[i].getBoundingClientRect();
      if (rect.width === 0) continue;
      if (clientX >= rect.left && clientX <= rect.right) {
        let ratio = (clientX - rect.left) / rect.width;
        if (rtl) ratio = 1 - ratio;
        const steps = Math.round(1 / this.precision);
        const part = Math.min(steps, Math.max(1, Math.ceil(ratio * steps)));
        return Number((i + part / steps).toFixed(4));
      }
    }
    return null;
  }

  /**
   * @private
   * @param {number|null} value Valor resaltado o `null`.
   */
  _setHover(value) {
    if (value === this._hover) return;
    this._hover = value;
    this.element.classList.toggle('mtx-rating--hovering', value !== null);
    this._render();
    emit(this.element, 'mtx:rating:active', { value });
  }

  /**
   * Aplica un valor elegido por el usuario y emite `mtx:rating:change`.
   * @private
   * @param {number|null} value Nuevo valor.
   */
  _commit(value) {
    if (value === this._value) return;
    this.value = value;
    emit(this.element, 'mtx:rating:change', { value: this._value });
  }

  /**
   * Pinta el estado de cada icono y sincroniza radios y etiquetas accesibles.
   * @private
   */
  _render() {
    const display = this._hover !== null ? this._hover : this._value;
    this.visuals.forEach((visual) => {
      const itemValue = parseFloat(visual.getAttribute('data-rating-value'));
      const filled = display !== null && (this.highlightSelectedOnly
        ? itemValue === display
        : itemValue <= display);
      visual.classList.toggle('mtx-rating__label--filled', filled);
      visual.classList.toggle('mtx-rating__label--hover', this._hover !== null && itemValue === this._hover);
    });
    this.items.forEach((item) => {
      const values = Array.from(item.querySelectorAll('[data-rating-value]'))
        .map((node) => parseFloat(node.getAttribute('data-rating-value')));
      item.classList.toggle('mtx-rating__item--active', this._hover !== null && values.includes(this._hover));
    });
    this.inputs.forEach((input) => {
      input.checked = input.value === '' ? this._value === null : this._round(parseFloat(input.value)) === this._value;
    });
    if (this.readOnly) {
      this.element.setAttribute('aria-label', t('rating', 'readOnly',
        { value: this._format(this._value || 0), max: this._format(this.max) },
        `Rated ${this._value || 0} out of ${this.max}`, this._locale));
    }
  }

  /** @returns {number|null} Valor actual (`null` sin valoración). */
  get value() {
    return this._value;
  }

  /**
   * Fija el valor sin emitir eventos (se redondea a la precisión; 0 o `null` lo vacía).
   * @param {number|null} val Nuevo valor.
   */
  set value(val) {
    this._value = this._round(val === null || val === undefined ? NaN : Number(val));
    this._render();
  }

  /** @returns {boolean} `true` si está deshabilitado. */
  get disabled() {
    return this.element.classList.contains('mtx-rating--disabled');
  }

  /** Deshabilita la valoración. */
  disable() {
    this.element.classList.add('mtx-rating--disabled');
    this.element.setAttribute('aria-disabled', 'true');
    this.inputs.forEach((input) => { input.disabled = true; });
    this._setHover(null);
  }

  /** Habilita la valoración. */
  enable() {
    this.element.classList.remove('mtx-rating--disabled');
    this.element.removeAttribute('aria-disabled');
    this.inputs.forEach((input) => { input.disabled = false; });
  }

  /** Enfoca el radio seleccionado (o el primero). */
  focus() {
    const target = this.inputs.find((input) => input.checked && input.value !== '') || this.inputs[0];
    if (target) target.focus();
  }

  /** Destruye la instancia y retira los listeners. */
  destroy() {
    if (this.readOnly) {
      super.destroy();
      return;
    }
    const el = this.element;
    el.removeEventListener('change', this._handleChange);
    el.removeEventListener('pointerdown', this._handlePointerDown);
    el.removeEventListener('click', this._handleClick);
    el.removeEventListener('pointermove', this._handlePointerMove);
    el.removeEventListener('pointerleave', this._handlePointerLeave);
    el.removeEventListener('focusout', this._handleFocusOut);
    super.destroy();
  }
}

registerComponent('rating', Rating);
