import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

const HALF_STEPS = ['0_5', '1_5', '2_5'];

/**
 * Normaliza un valor de espaciado a su sufijo de clase (`0`–`12`, `0_5`, `1_5`, `2_5`).
 * @param {number|string} value Valor declarado (`2`, `2.5`, `"2_5"`).
 * @returns {string|null} Sufijo o `null` si no pertenece a la escala.
 */
function normalizeSpacing(value) {
  const token = String(value).trim().replace('.', '_');
  if (HALF_STEPS.includes(token)) return token;
  if (!/^\d+$/.test(token)) return null;
  const n = Number(token);
  return n <= 12 ? String(n) : null;
}

/**
 * Representa un contenedor o ítem del sistema de Grilla (Grid) de Materix UI.
 * Grilla flexbox de 12 columnas con separación por gap (MUI Grid v2).
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-grid mtx-grid--container mtx-grid--spacing-2" data-mtx="grid">
 *   <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">...</div>
 *   <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">...</div>
 * </div>
 * ```
 */
export class Grid extends ComponentBase {
  /**
   * Crea una instancia del componente Grid.
   *
   * @param {HTMLElement} element Elemento HTML contenedor o ítem.
   */
  constructor(element) {
    super(element);
    this._setupDom();
  }

  /**
   * Configura las clases y atributos de la grilla al inicializar.
   * @private
   */
  _setupDom() {
    if (!this.element.classList.contains('mtx-grid')) {
      this.element.classList.add('mtx-grid');
    }

    if (this.element.hasAttribute('data-container') || this.element.getAttribute('data-mtx') === 'grid-container') {
      this.element.classList.add('mtx-grid--container');
    }

    if (this.element.hasAttribute('data-item') || this.element.getAttribute('data-mtx') === 'grid-item') {
      this.element.classList.add('mtx-grid--item');
    }

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((bp) => {
      const val = this.element.getAttribute(`data-${bp}`);
      if (val !== null && val !== '') {
        this.element.classList.add('mtx-grid--item');
        this.element.classList.add(`mtx-grid--${bp}-${val}`);
      }
    });

    // Si no tiene explícitamente item ni container, asumir container por defecto
    if (!this.isContainer && !this.isItem) {
      this.element.classList.add('mtx-grid--container');
    }

    // Espaciado declarativo: data-spacing / data-row-spacing / data-column-spacing y sus variantes -{bp}
    [null, 'sm', 'md', 'lg', 'xl'].forEach((bp) => {
      const suffix = bp ? `-${bp}` : '';
      [['spacing', 'setSpacing'], ['row-spacing', 'setRowSpacing'], ['column-spacing', 'setColumnSpacing']].forEach(([attr, method]) => {
        const value = this.element.getAttribute(`data-${attr}${suffix}`);
        if (value !== null && value !== '') this[method](value, bp);
      });
    });

    const direction = this.element.getAttribute('data-direction');
    if (direction) {
      this.setDirection(direction);
    }

    const justify = this.element.getAttribute('data-justify');
    if (justify) {
      this.setJustifyContent(justify);
    }

    const align = this.element.getAttribute('data-align');
    if (align) {
      this.setAlignItems(align);
    }
  }

  /**
   * Indica si el elemento es un contenedor de grilla.
   *
   * @returns {boolean} `true` si es un contenedor.
   */
  get isContainer() {
    return (
      this.element.classList.contains('mtx-grid-container') ||
      this.element.classList.contains('mtx-grid--container')
    );
  }

  /**
   * Indica si el elemento es un ítem/columna de grilla.
   *
   * @returns {boolean} `true` si es un ítem.
   */
  get isItem() {
    return (
      this.element.classList.contains('mtx-grid-item') ||
      this.element.classList.contains('mtx-grid--item')
    );
  }

  /**
   * Sustituye una clase de espaciado del contenedor.
   * @param {string} kind `spacing`, `row-spacing` o `column-spacing`.
   * @param {number|string} value Entero de 0 a 12 o medio paso 0.5 / 1.5 / 2.5 (n × 8px).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` (sin él aplica desde xs).
   * @private
   */
  _setSpacingClass(kind, value, bp) {
    if (!this.isContainer) return;
    const n = normalizeSpacing(value);
    if (n === null) {
      console.warn(`Grid: ${kind} no válido "${value}" (usa 0–12, 0.5, 1.5 o 2.5)`);
      return;
    }
    const prefix = bp && bp !== 'xs' ? `mtx-grid--${bp}-${kind}-` : `mtx-grid--${kind}-`;
    Array.from(this.element.classList)
      .filter((c) => c.startsWith(prefix))
      .forEach((c) => this.element.classList.remove(c));
    this.element.classList.add(`${prefix}${n}`);
  }

  /**
   * Cambia la separación horizontal y vertical entre ítems (gap de n × 8px).
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl` desde el que aplica.
   */
  setSpacing(spacing, bp) {
    this._setSpacingClass('spacing', spacing, bp);
  }

  /**
   * Cambia solo la separación vertical entre filas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setRowSpacing(spacing, bp) {
    this._setSpacingClass('row-spacing', spacing, bp);
  }

  /**
   * Cambia solo la separación horizontal entre columnas.
   *
   * @param {number|string} spacing Entero de 0 a 12 o medio paso (0.5, 1.5, 2.5; también `0_5`).
   * @param {string} [bp] Breakpoint `sm|md|lg|xl`.
   */
  setColumnSpacing(spacing, bp) {
    this._setSpacingClass('column-spacing', spacing, bp);
  }

  /**
   * Establece la dirección flex (`row`, `column`, `row-reverse`, `column-reverse`).
   *
   * @param {string} direction Dirección flex.
   */
  setDirection(direction) {
    const classes = Array.from(this.element.classList).filter(c =>
      c.startsWith('mtx-grid--direction-')
    );
    classes.forEach(c => this.element.classList.remove(c));

    if (direction) {
      this.element.classList.add(`mtx-grid--direction-${direction}`);
    }
  }

  /**
   * Establece la alineación horizontal (`flex-start`, `center`, `flex-end`, etc.).
   *
   * @param {string} justify Justificación flex.
   */
  setJustifyContent(justify) {
    const classes = Array.from(this.element.classList).filter(c =>
      c.startsWith('mtx-grid--justify-')
    );
    classes.forEach(c => this.element.classList.remove(c));

    if (justify) {
      this.element.classList.add(`mtx-grid--justify-${justify}`);
    }
  }

  /**
   * Establece la alineación vertical (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`).
   *
   * @param {string} align Alineación flex.
   */
  setAlignItems(align) {
    const classes = Array.from(this.element.classList).filter(c =>
      c.startsWith('mtx-grid--align-')
    );
    classes.forEach(c => this.element.classList.remove(c));

    if (align) {
      this.element.classList.add(`mtx-grid--align-${align}`);
    }
  }
}

registerComponent('grid', Grid);
registerComponent('grid-container', Grid);
registerComponent('grid-item', Grid);
