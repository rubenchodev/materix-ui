import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** Lado del viewBox del SVG circular (igual que MUI). */
const CIRCLE_BOX = 44;
const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit'];

/**
 * Convierte un atributo numérico en número finito.
 * @param {string|null} raw Valor crudo.
 * @param {number} fallback Valor por defecto.
 * @returns {number} Número interpretado.
 */
function toNumber(raw, fallback) {
  if (raw === null || raw === undefined || raw === '') return fallback;
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Lógica común de CircularProgress y LinearProgress: rango, valor, color y ARIA.
 */
class ProgressBase extends ComponentBase {
  /**
   * @param {HTMLElement} element Elemento raíz.
   * @param {string} block Bloque BEM (`mtx-circular-progress` o `mtx-linear-progress`).
   * @param {string[]} variants Variantes admitidas.
   */
  constructor(element, block, variants) {
    super(element);
    this._block = block;
    this._variants = variants;
    element.classList.add(block);

    this._min = toNumber(element.getAttribute('data-min'), 0);
    this._max = toNumber(element.getAttribute('data-max'), 100);
    if (this._max <= this._min) this._max = this._min + 100;

    const explicit = element.getAttribute('data-variant');
    this._variant = variants.includes(explicit) ? explicit : this._inferVariant();
    this._value = this._clamp(toNumber(element.getAttribute('data-value'), this._min));
    this._color = 'primary';
  }

  /** @returns {string} Variante deducida de los atributos presentes. */
  _inferVariant() {
    return this.element.hasAttribute('data-value') ? 'determinate' : 'indeterminate';
  }

  /**
   * Limita un número al rango [min, max].
   * @param {number} value Valor de entrada.
   * @returns {number} Valor acotado.
   */
  _clamp(value) {
    return Math.min(this._max, Math.max(this._min, value));
  }

  /** @returns {number} Porcentaje 0–100 del valor actual. */
  get percent() {
    return ((this._value - this._min) / (this._max - this._min)) * 100;
  }

  /** @returns {number} Valor actual dentro de [min, max]. */
  get value() {
    return this._value;
  }

  /** @param {number} next Nuevo valor. */
  set value(next) {
    this.setValue(next);
  }

  /**
   * Fija el valor; una variante indeterminate pasa a determinate.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setValue(next) {
    const parsed = toNumber(next, this._value);
    this._value = this._clamp(parsed);
    if (this._variant === 'indeterminate' || this._variant === 'query') this._variant = 'determinate';
    this.element.setAttribute('data-value', String(this._value));
    this._render();
    return this;
  }

  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }

  /** @param {string} next Variante admitida por el componente. */
  set variant(next) {
    if (!this._variants.includes(next)) return;
    this._variant = next;
    this._render();
  }

  /** @returns {string} Color de la paleta aplicado. */
  get color() {
    return this._color;
  }

  /** @param {string} next `primary`, `secondary`, `error`, `warning`, `info`, `success` o `inherit`. */
  set color(next) {
    this._applyColor(next);
  }

  /**
   * Aplica la clase de color de la paleta.
   * @param {string|null} next Color solicitado.
   */
  _applyColor(next) {
    const color = COLORS.includes(next) ? next : 'primary';
    COLORS.forEach((name) => this.element.classList.remove(`${this._block}--${name}`));
    this.element.classList.add(`${this._block}--${color}`);
    this._color = color;
  }

  /** Aplica role, nombre accesible y aria-value* según la variante. */
  _syncAria() {
    const { element } = this;
    if (element.hasAttribute('data-decorative')) {
      ['role', 'aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow'].forEach((name) => element.removeAttribute(name));
      element.setAttribute('aria-hidden', 'true');
      return;
    }
    element.setAttribute('role', 'progressbar');
    if (!element.hasAttribute('aria-labelledby')) {
      const label = element.getAttribute('data-label');
      if (label) {
        element.setAttribute('aria-label', label);
      } else if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', t('progress', 'loading', null, 'Loading', getComponentLocale(element)));
      }
    }
    if (this._hasValue()) {
      element.setAttribute('aria-valuemin', String(this._min));
      element.setAttribute('aria-valuemax', String(this._max));
      element.setAttribute('aria-valuenow', String(Math.round(this._value * 100) / 100));
    } else {
      element.removeAttribute('aria-valuemin');
      element.removeAttribute('aria-valuemax');
      element.removeAttribute('aria-valuenow');
    }
  }

  /** @returns {boolean} `true` si la variante expone un valor. */
  _hasValue() {
    return this._variant === 'determinate' || this._variant === 'buffer';
  }

  /** Actualiza las clases de variante. */
  _syncVariantClass() {
    this._variants.forEach((name) => this.element.classList.remove(`${this._block}--${name}`));
    this.element.classList.add(`${this._block}--${this._variant}`);
  }

  /** Actualiza el texto de porcentaje visible, si existe. */
  _syncLabel() {
    if (this.labelEl) {
      this.labelEl.textContent = this._hasValue() ? `${Math.round(this.percent)}%` : '';
    }
  }
}

/**
 * Indicador de progreso circular de Materix UI (`CircularProgress` de MUI).
 *
 * Atributos `data-*`: `data-variant` (`indeterminate`|`determinate`), `data-value`,
 * `data-min`, `data-max`, `data-size` (px, 40), `data-thickness` (3.6), `data-color`,
 * `data-disable-shrink`, `data-show-label`, `data-track`, `data-label` (nombre accesible),
 * `data-decorative` (oculto a lectores de pantalla).
 *
 * ```html
 * <div data-mtx="circular-progress" data-value="75" data-show-label></div>
 * ```
 */
export class CircularProgress extends ProgressBase {
  /**
   * Crea la instancia y construye el SVG si falta.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(element) {
    super(element, 'mtx-circular-progress', ['indeterminate', 'determinate']);
    this._size = Math.max(4, toNumber(element.getAttribute('data-size'), 40));
    this._thickness = Math.max(0.5, toNumber(element.getAttribute('data-thickness'), 3.6));

    if (element.hasAttribute('data-disable-shrink')) element.classList.add('mtx-circular-progress--disable-shrink');
    this._ensureStructure();
    this._applyColor(element.getAttribute('data-color'));
    this._render();
  }

  /** Crea (o reutiliza) el SVG, el círculo, la pista y la etiqueta. */
  _ensureStructure() {
    const { element } = this;
    const radius = (CIRCLE_BOX - this._thickness) / 2;
    this._circumference = 2 * Math.PI * radius;
    element.style.setProperty('--mtx-circular-progress-size', `${this._size}px`);

    let svg = element.querySelector('.mtx-circular-progress__svg');
    if (!svg) {
      svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('class', 'mtx-circular-progress__svg');
      svg.setAttribute('viewBox', `${CIRCLE_BOX / 2} ${CIRCLE_BOX / 2} ${CIRCLE_BOX} ${CIRCLE_BOX}`);
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('aria-hidden', 'true');
      element.insertBefore(svg, element.firstChild);
    }
    const makeCircle = (className) => {
      let circle = svg.querySelector(`.${className}`);
      if (!circle) {
        circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('class', className);
        svg.appendChild(circle);
      }
      circle.setAttribute('cx', String(CIRCLE_BOX));
      circle.setAttribute('cy', String(CIRCLE_BOX));
      circle.setAttribute('r', String(radius));
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke-width', String(this._thickness));
      return circle;
    };
    if (element.hasAttribute('data-track') || svg.querySelector('.mtx-circular-progress__track')) {
      element.classList.add('mtx-circular-progress--track');
      this.trackEl = makeCircle('mtx-circular-progress__track');
      svg.insertBefore(this.trackEl, svg.firstChild);
    }
    this.circleEl = makeCircle('mtx-circular-progress__circle');

    this.labelEl = element.querySelector('.mtx-circular-progress__label');
    if (!this.labelEl && element.hasAttribute('data-show-label')) {
      this.labelEl = document.createElement('span');
      this.labelEl.className = 'mtx-circular-progress__label';
      element.appendChild(this.labelEl);
    }
    if (this.labelEl) {
      this.labelEl.setAttribute('aria-hidden', 'true');
      element.classList.add('mtx-circular-progress--with-label');
    }
  }

  /** Pinta el arco según la variante y el valor. */
  _render() {
    this._syncVariantClass();
    if (this._variant === 'determinate') {
      const offset = ((100 - this.percent) / 100) * this._circumference;
      this.circleEl.style.strokeDasharray = this._circumference.toFixed(3);
      this.circleEl.style.strokeDashoffset = `${offset.toFixed(3)}px`;
    } else {
      this.circleEl.style.strokeDasharray = '';
      this.circleEl.style.strokeDashoffset = '';
    }
    this._syncLabel();
    this._syncAria();
  }

  /** @returns {number} Diámetro en px. */
  get size() {
    return this._size;
  }
}

/**
 * Barra de progreso lineal de Materix UI (`LinearProgress` de MUI).
 *
 * Atributos `data-*`: `data-variant` (`indeterminate`|`determinate`|`buffer`|`query`),
 * `data-value`, `data-value-buffer`, `data-min`, `data-max`, `data-color`,
 * `data-show-label`, `data-rounded`, `data-label` (nombre accesible), `data-decorative`.
 *
 * ```html
 * <div data-mtx="linear-progress" data-value="40"></div>
 * ```
 */
export class LinearProgress extends ProgressBase {
  /**
   * Crea la instancia y construye pista y barras si faltan.
   * @param {HTMLElement} element Elemento raíz.
   */
  constructor(element) {
    super(element, 'mtx-linear-progress', ['indeterminate', 'determinate', 'buffer', 'query']);
    this._buffer = this._clamp(toNumber(element.getAttribute('data-value-buffer'), this._max));
    if (element.hasAttribute('data-rounded')) element.classList.add('mtx-linear-progress--rounded');
    this._ensureStructure();
    this._applyColor(element.getAttribute('data-color'));
    this._render();
  }

  /** @returns {string} Variante deducida (buffer si hay `data-value-buffer`). */
  _inferVariant() {
    if (this.element.hasAttribute('data-value-buffer')) return 'buffer';
    return super._inferVariant();
  }

  /** Crea (o reutiliza) la pista, el patrón de buffer, las dos barras y la etiqueta. */
  _ensureStructure() {
    const { element } = this;
    let track = element.querySelector('.mtx-linear-progress__track');
    if (!track) {
      track = document.createElement('span');
      track.className = 'mtx-linear-progress__track';
      element.insertBefore(track, element.firstChild);
    }
    const ensure = (className) => {
      let node = track.querySelector(`.${className.split(' ').join('.')}`);
      if (!node) {
        node = document.createElement('span');
        node.className = className;
        track.appendChild(node);
      }
      return node;
    };
    this.trackEl = track;
    this.dashedEl = ensure('mtx-linear-progress__dashed');
    this.bar1El = ensure('mtx-linear-progress__bar mtx-linear-progress__bar1');
    this.bar2El = ensure('mtx-linear-progress__bar mtx-linear-progress__bar2');

    this.labelEl = element.querySelector('.mtx-linear-progress__label');
    if (!this.labelEl && element.hasAttribute('data-show-label')) {
      this.labelEl = document.createElement('span');
      this.labelEl.className = 'mtx-linear-progress__label';
      element.appendChild(this.labelEl);
    }
    if (this.labelEl) {
      this.labelEl.setAttribute('aria-hidden', 'true');
      element.classList.add('mtx-linear-progress--with-label');
    }
  }

  /** @returns {number} Valor del buffer dentro de [min, max]. */
  get valueBuffer() {
    return this._buffer;
  }

  /** @param {number} next Nuevo valor de buffer. */
  set valueBuffer(next) {
    this.setBuffer(next);
  }

  /**
   * Fija el valor de buffer y activa la variante `buffer`.
   * @param {number} next Nuevo valor (se acota a [min, max]).
   * @returns {this} La instancia, para encadenar.
   */
  setBuffer(next) {
    this._buffer = this._clamp(toNumber(next, this._buffer));
    this._variant = 'buffer';
    this.element.setAttribute('data-value-buffer', String(this._buffer));
    this._render();
    return this;
  }

  /** Pinta las barras según la variante. */
  _render() {
    this._syncVariantClass();
    const toTransform = (value) => {
      const pct = ((value - this._min) / (this._max - this._min)) * 100;
      return `translateX(${(pct - 100).toFixed(3)}%)`;
    };
    if (this._hasValue()) {
      this.bar1El.style.transform = toTransform(this._value);
      this.bar2El.style.transform = this._variant === 'buffer' ? toTransform(this._buffer) : '';
    } else {
      this.bar1El.style.transform = '';
      this.bar2El.style.transform = '';
    }
    this._syncLabel();
    this._syncAria();
  }
}

/**
 * Crea un CircularProgress listo para insertar (p. ej. dentro de un botón en carga).
 *
 * @param {Object} [options] Opciones.
 * @param {number} [options.size=40] Diámetro en px.
 * @param {number} [options.thickness=3.6] Grosor del trazo.
 * @param {string} [options.color='primary'] Color de paleta o `inherit`.
 * @param {number} [options.value] Valor 0–100; si se omite es indeterminate.
 * @param {string} [options.label] Nombre accesible; ignorado si `decorative`.
 * @param {boolean} [options.decorative=false] Oculta el indicador a lectores de pantalla (`aria-hidden`).
 * @param {boolean} [options.disableShrink=false] Desactiva la animación de encogimiento.
 * @param {string} [options.className] Clases extra.
 * @param {string} [options.tagName='span'] Etiqueta del elemento raíz.
 * @returns {HTMLElement} Elemento raíz ya inicializado (instancia vía `getInstance`).
 */
export function createCircularProgress(options = {}) {
  const {
    size = 40, thickness = 3.6, color = 'primary', value, label,
    decorative = false, disableShrink = false, className = '', tagName = 'span',
  } = options;
  const el = document.createElement(tagName);
  el.setAttribute('data-mtx', 'circular-progress');
  el.setAttribute('data-size', String(size));
  el.setAttribute('data-thickness', String(thickness));
  el.setAttribute('data-color', color);
  if (value !== undefined && value !== null) el.setAttribute('data-value', String(value));
  if (label && !decorative) el.setAttribute('data-label', label);
  if (decorative) el.setAttribute('data-decorative', '');
  if (disableShrink) el.setAttribute('data-disable-shrink', '');
  if (className) el.className = className;
  new CircularProgress(el); // eslint-disable-line no-new
  return el;
}

registerComponent('circular-progress', CircularProgress);
registerComponent('linear-progress', LinearProgress);
