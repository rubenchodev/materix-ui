import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/** Breakpoints con infijo (xs no lleva infijo). */
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];
const DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'];
const SPACING = ['0', '0_5', '1', '1_5', '2', '2_5', '3', '4', '5', '6', '8', '10'];
const ALIGN = { start: 'start', 'flex-start': 'start', center: 'center', end: 'end', 'flex-end': 'end', stretch: 'stretch', baseline: 'baseline' };
const JUSTIFY = {
  start: 'start', 'flex-start': 'start', center: 'center', end: 'end', 'flex-end': 'end',
  between: 'between', 'space-between': 'between', around: 'around', 'space-around': 'around',
  evenly: 'evenly', 'space-evenly': 'evenly',
};
const DIVIDER_ATTR = 'data-mtx-stack-divider';

/**
 * Normaliza un valor de espaciado (`1.5` → `1_5`).
 * @param {string|number} value Valor recibido.
 * @returns {string|null} Clave de la escala o `null` si no es válida.
 */
const normalizeSpacing = (value) => {
  const key = String(value).trim().replace('.', '_');
  return SPACING.includes(key) ? key : null;
};

/**
 * Indica si un atributo booleano está activo (presente y distinto de "false").
 * @param {HTMLElement} el Elemento.
 * @param {string} name Atributo.
 * @returns {boolean} Estado.
 */
const isOn = (el, name) => el.hasAttribute(name) && el.getAttribute(name) !== 'false';

/**
 * Stack de Materix UI: apila hijos en una dirección con separación uniforme (MUI Stack).
 *
 * ```html
 * <div data-mtx="stack" data-direction="row" data-spacing="2">…</div>
 * ```
 */
export class Stack extends ComponentBase {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-stack');

    const read = (name) => {
      const v = element.getAttribute(name);
      return v !== null && v !== '' ? v : null;
    };

    [null, ...BREAKPOINTS].forEach((bp) => {
      const suffix = bp ? `-${bp}` : '';
      const direction = read(`data-direction${suffix}`);
      if (direction) this._safe(() => this.setDirection(direction, bp));
      const spacing = read(`data-spacing${suffix}`);
      if (spacing !== null) this._safe(() => this.setSpacing(spacing, bp));
    });

    const align = read('data-align');
    if (align) this.setAlign(align);
    const justify = read('data-justify');
    if (justify) this.setJustify(justify);
    if (isOn(element, 'data-wrap')) this.setWrap(true);

    this._divider = isOn(element, 'data-divider');
    this.refresh();
  }

  /**
   * Ejecuta una configuración declarativa sin interrumpir la inicialización.
   * @param {Function} fn Configuración a aplicar.
   * @private
   */
  _safe(fn) {
    try {
      fn();
    } catch (error) {
      console.warn(error.message);
    }
  }

  /**
   * Sustituye las clases que empiezan por un prefijo.
   * @param {string} prefix Prefijo de clase.
   * @param {string|null} next Clase nueva o `null` para solo eliminar.
   * @param {RegExp} [match] Filtro adicional sobre el resto del nombre.
   * @private
   */
  _swap(prefix, next, match) {
    Array.from(this.element.classList)
      .filter((c) => c.startsWith(prefix) && (!match || match.test(c.slice(prefix.length))))
      .forEach((c) => this.element.classList.remove(c));
    if (next) this.element.classList.add(next);
  }

  /**
   * Cambia la dirección, opcionalmente desde un breakpoint.
   * @param {'row'|'column'|'row-reverse'|'column-reverse'} direction Dirección flex.
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint (sin él aplica desde xs).
   * @throws {RangeError} Si la dirección no es válida.
   */
  setDirection(direction, bp) {
    const value = direction === 'col' ? 'column' : direction;
    if (!DIRECTIONS.includes(value)) throw new RangeError(`Stack: dirección no válida "${direction}"`);
    const prefix = bp ? `mtx-stack--${bp}-` : 'mtx-stack--';
    this._swap(prefix, `${prefix}${value}`, /^(row|column|col)(-reverse)?$/);
  }

  /**
   * Cambia la separación entre hijos (escala `n × 8px`).
   * @param {string|number} spacing Valor de la escala (0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10).
   * @param {'sm'|'md'|'lg'|'xl'} [bp] Breakpoint.
   * @throws {RangeError} Si el valor no pertenece a la escala.
   */
  setSpacing(spacing, bp) {
    const key = normalizeSpacing(spacing);
    if (key === null) throw new RangeError(`Stack: espaciado no válido "${spacing}"`);
    const prefix = bp ? `mtx-stack--${bp}-spacing-` : 'mtx-stack--spacing-';
    this._swap(prefix, `${prefix}${key}`);
  }

  /**
   * Alinea los hijos en el eje cruzado.
   * @param {string} align start|center|end|stretch|baseline (acepta flex-start/flex-end).
   */
  setAlign(align) {
    const key = ALIGN[align];
    this._swap('mtx-stack--align-', key ? `mtx-stack--align-${key}` : null);
  }

  /**
   * Distribuye los hijos en el eje principal.
   * @param {string} justify start|center|end|between|around|evenly (acepta valores CSS).
   */
  setJustify(justify) {
    const key = JUSTIFY[justify];
    this._swap('mtx-stack--justify-', key ? `mtx-stack--justify-${key}` : null);
  }

  /**
   * Activa o desactiva el ajuste de línea.
   * @param {boolean} wrap Estado.
   */
  setWrap(wrap) {
    this.element.classList.toggle('mtx-stack--wrap', Boolean(wrap));
  }

  /**
   * Activa o desactiva los divisores automáticos entre hijos.
   * @param {boolean} enabled Estado.
   */
  setDivider(enabled) {
    this._divider = Boolean(enabled);
    this.refresh();
  }

  /**
   * Regenera los divisores (llamar tras añadir o quitar hijos). Idempotente.
   */
  refresh() {
    Array.from(this.element.children)
      .filter((c) => c.hasAttribute(DIVIDER_ATTR))
      .forEach((c) => c.remove());
    if (!this._divider) return;

    const items = Array.from(this.element.children);
    items.slice(1).forEach((item) => {
      const hr = document.createElement('hr');
      hr.className = 'mtx-divider mtx-stack__divider';
      hr.setAttribute(DIVIDER_ATTR, '');
      // Decorativo: la separación ya la da la estructura; evita ruido en lectores de pantalla.
      hr.setAttribute('aria-hidden', 'true');
      this.element.insertBefore(hr, item);
    });
  }
}

registerComponent('stack', Stack);
