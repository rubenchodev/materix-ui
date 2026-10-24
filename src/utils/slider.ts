/**
 * Lógica pura de Slider (portada de `slider.js` de vanilla): step, límites, marcas y formato.
 */

/** Marca del slider. */
export interface SliderMark {
  value: number;
  label: string | null;
}

/** Escala del slider. */
export interface SliderScale {
  min: number;
  max: number;
  step: number;
}

/** Opciones de ajuste de valores. */
export interface SliderSnapOptions extends SliderScale {
  /** Marcas disponibles (para `marksOnly`). */
  marks?: readonly SliderMark[];
  /** Solo se permiten los valores de las marcas. */
  marksOnly?: boolean;
}

/**
 * Decimales de un número (para redondear al step sin errores de coma flotante).
 * @param {number} num Número.
 * @returns {number} Decimales.
 */
export function getDecimals(num: number): number {
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const mantissa = parts[0].split('.')[1];
    return (mantissa ? mantissa.length : 0) + parseInt(parts[1] || '0', 10);
  }
  const decimal = String(num).split('.')[1];
  return decimal ? decimal.length : 0;
}

/**
 * Redondea al múltiplo de step más cercano desde `min`.
 * @param {number} value Valor.
 * @param {number} min Mínimo.
 * @param {number} step Paso.
 * @returns {number} Valor redondeado.
 */
export function roundStep(value: number, min: number, step: number): number {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimals(step)));
}

/**
 * Ajusta al step (o a la marca más cercana con `marksOnly`) y acota a [min, max].
 * @param {number} value Valor bruto.
 * @param {SliderSnapOptions} options Escala y marcas.
 * @returns {number} Valor válido.
 */
export function snap(value: number | string, options: SliderSnapOptions): number {
  const { min, max, step, marks = [], marksOnly = false } = options;
  let v = Math.min(max, Math.max(min, Number(value)));
  if (!Number.isFinite(v)) v = min;
  if (marksOnly && marks.length) {
    return marks.reduce((best, m) => (Math.abs(m.value - v) < Math.abs(best - v) ? m.value : best), marks[0].value);
  }
  return Math.min(max, roundStep(v, min, step));
}

/**
 * Normaliza valores (step, límites y, en rango, orden ascendente).
 * @param {number[]} values Valores.
 * @param {SliderSnapOptions & {range?: boolean}} options Opciones.
 * @returns {number[]} Valores válidos.
 */
export function normalize(values: readonly (number | string)[], options: SliderSnapOptions & { range?: boolean }): number[] {
  const out = values.map((v) => snap(v, options));
  if (options.range) out.sort((a, b) => a - b);
  return out;
}

/**
 * Thumb más cercano a un valor (si coinciden, el que puede moverse hacia el puntero).
 * @param {number} value Valor del puntero.
 * @param {number[]} values Valores actuales.
 * @param {boolean} [range] Slider de rango (si no, siempre 0).
 * @returns {number} Índice del thumb.
 */
export function closestThumb(value: number, values: readonly number[], range = values.length > 1): number {
  if (!range) return 0;
  const [a, b] = values;
  if (a === b) return value < a ? 0 : 1;
  return Math.abs(value - a) <= Math.abs(value - b) ? 0 : 1;
}

/**
 * Porcentaje de un valor en la escala.
 * @param {number} value Valor.
 * @param {number} min Mínimo.
 * @param {number} max Máximo.
 * @returns {number} Porcentaje 0-100 (0 si la escala es nula).
 */
export function percent(value: number, min: number, max: number): number {
  const span = max - min;
  return span ? ((value - min) * 100) / span : 0;
}

/**
 * Valor a partir de la posición relativa del puntero en el rail.
 * @param {number} ratio Posición 0-1 desde el inicio (izquierda o abajo).
 * @param {number} min Mínimo.
 * @param {number} max Máximo.
 * @param {boolean} [invert=false] Invierte el eje (RTL horizontal).
 * @returns {number} Valor bruto sin ajustar al step.
 */
export function valueFromRatio(ratio: number, min: number, max: number, invert = false): number {
  let r = invert ? 1 - ratio : ratio;
  r = Math.min(1, Math.max(0, r));
  return min + r * (max - min);
}

/** Especificación de marcas: `true` (cada step), lista `"0:0°C,20:20°C"`, JSON o array. */
export type SliderMarksSpec = boolean | string | null | undefined | readonly { value: number | string; label?: unknown }[];

/**
 * Interpreta la especificación de marcas (`data-marks` de vanilla).
 * @param {SliderMarksSpec} spec Especificación.
 * @param {SliderScale} scale Escala (para `true`).
 * @returns {SliderMark[]} Marcas (sin filtrar por min/max).
 */
export function parseMarks(spec: SliderMarksSpec, scale: SliderScale): SliderMark[] {
  if (spec === null || spec === undefined || spec === false || spec === 'false') return [];
  if (Array.isArray(spec)) {
    return spec
      .filter((m) => m && Number.isFinite(Number(m.value)))
      .map((m) => ({ value: Number(m.value), label: m.label != null ? String(m.label) : null }));
  }
  if (spec === true || spec === '' || spec === 'true') {
    const { min, max, step } = scale;
    const count = Math.floor((max - min) / step);
    if (count > 500) return [];
    const marks: SliderMark[] = [];
    for (let i = 0; i <= count; i += 1) marks.push({ value: roundStep(min + i * step, min, step), label: null });
    return marks;
  }
  const text = String(spec);
  if (text.trim().startsWith('[')) {
    try {
      return parseMarks(JSON.parse(text) as { value: number; label?: unknown }[], scale);
    } catch {
      return [];
    }
  }
  return text
    .split(',')
    .map((part) => {
      const [raw, ...rest] = part.split(':');
      const value = parseFloat(raw);
      const label = rest.length ? rest.join(':').trim() : null;
      return { value, label: label || null };
    })
    .filter((m) => Number.isFinite(m.value));
}

/**
 * Marcas dentro de la escala.
 * @param {SliderMarksSpec} spec Especificación.
 * @param {SliderScale} scale Escala.
 * @returns {SliderMark[]} Marcas entre min y max.
 */
export function getMarks(spec: SliderMarksSpec, scale: SliderScale): SliderMark[] {
  return parseMarks(spec, scale).filter((m) => m.value >= scale.min && m.value <= scale.max);
}

/** Opciones de {@link formatValue}. */
export interface SliderFormatOptions {
  /** Locale de `Intl.NumberFormat`. */
  locale?: string;
  /** Paso (define los decimales máximos). */
  step?: number;
  /** Plantilla con `{value}` (`"{value} °C"`) o función. */
  format?: string | ((text: string, value: number) => string) | null;
}

/**
 * Texto del valor (value label y `aria-valuetext`).
 * @param {number} value Valor.
 * @param {SliderFormatOptions} [options] Locale, step y plantilla.
 * @returns {string} Texto formateado.
 */
export function formatValue(value: number, options: SliderFormatOptions = {}): string {
  const { locale, step = 1, format } = options;
  let text: string;
  try {
    text = new Intl.NumberFormat(locale, { maximumFractionDigits: Math.max(getDecimals(step), 0) }).format(value);
  } catch {
    text = String(value);
  }
  if (typeof format === 'function') return format(text, value);
  return format ? format.split('{value}').join(text) : text;
}

/**
 * Siguiente valor en una dirección: por marcas (`marksOnly`) o por incremento.
 * @param {number} current Valor actual.
 * @param {number} dir `1` o `-1`.
 * @param {number} amount Incremento.
 * @param {SliderMark[]} [marks] Marcas.
 * @param {boolean} [marksOnly] Solo marcas.
 * @returns {number} Valor siguiente (sin ajustar).
 */
export function stepFrom(current: number, dir: number, amount: number, marks: readonly SliderMark[] = [], marksOnly = false): number {
  if (marksOnly && marks.length) {
    const values = marks.map((m) => m.value).sort((a, b) => a - b);
    const found = dir > 0 ? values.find((v) => v > current) : values.reverse().find((v) => v < current);
    return found !== undefined ? found : current;
  }
  return current + dir * amount;
}

/**
 * Paso grande de PageUp/PageDown: 10 % de la escala redondeado al step (mínimo un step).
 * @param {SliderScale} scale Escala.
 * @returns {number} Incremento.
 */
export function getBigStep(scale: SliderScale): number {
  const { min, max, step } = scale;
  return Math.max(step, roundStep(min + (max - min) / 10, min, step) - min);
}

/** Opciones de {@link getKeyboardValue}. */
export interface SliderKeyboardOptions extends SliderSnapOptions {
  /** Dirección RTL en un slider horizontal (invierte ArrowLeft/ArrowRight). */
  rtl?: boolean;
}

/**
 * Valor tras una tecla (como MUI): flechas ±step, PageUp/PageDown ±10 %, Home/End extremos.
 * @param {string} key `event.key`.
 * @param {number} current Valor actual.
 * @param {SliderKeyboardOptions} options Escala, marcas y RTL.
 * @returns {number|null} Valor bruto siguiente o `null` si la tecla no aplica.
 */
export function getKeyboardValue(key: string, current: number, options: SliderKeyboardOptions): number | null {
  const { step, min, max, marks = [], marksOnly = false, rtl = false } = options;
  const big = getBigStep(options);
  switch (key) {
    case 'ArrowUp': return stepFrom(current, 1, step, marks, marksOnly);
    case 'ArrowDown': return stepFrom(current, -1, step, marks, marksOnly);
    case 'ArrowRight': return stepFrom(current, rtl ? -1 : 1, step, marks, marksOnly);
    case 'ArrowLeft': return stepFrom(current, rtl ? 1 : -1, step, marks, marksOnly);
    case 'PageUp': return stepFrom(current, 1, big, marks, marksOnly);
    case 'PageDown': return stepFrom(current, -1, big, marks, marksOnly);
    case 'Home': return min;
    case 'End': return max;
    default: return null;
  }
}

/** Opciones de {@link setThumbValue}. */
export interface SliderThumbOptions extends SliderSnapOptions {
  /** Slider de rango. */
  range?: boolean;
  /** Distancia mínima entre thumbs. */
  minDistance?: number;
  /** Impide que los thumbs se crucen. */
  disableSwap?: boolean;
  /** Teclado o input nativo: nunca intercambia (acota contra el otro thumb). */
  noSwap?: boolean;
}

/**
 * Aplica un valor a un thumb con swap, `disableSwap` y `minDistance` (`_setFromUser` de vanilla).
 * @param {number[]} values Valores actuales.
 * @param {number} index Thumb movido.
 * @param {number} raw Valor bruto.
 * @param {SliderThumbOptions} options Opciones.
 * @returns {{values: number[], activeThumb: number}} Nuevos valores y thumb activo (cambia al cruzar).
 */
export function setThumbValue(
  values: readonly number[],
  index: number,
  raw: number,
  options: SliderThumbOptions,
): { values: number[]; activeThumb: number } {
  let value = snap(raw, options);
  const next = values.slice();
  let active = index;
  if (options.range) {
    const other = 1 - index;
    const dist = Math.max(0, options.minDistance || 0);
    if (options.disableSwap || dist > 0 || options.noSwap) {
      value = index === 0 ? Math.min(value, next[1] - dist) : Math.max(value, next[0] + dist);
      value = Math.min(options.max, Math.max(options.min, value));
      next[index] = value;
    } else {
      next[index] = value;
      if ((index === 0 && value > next[other]) || (index === 1 && value < next[other])) {
        next.sort((a, b) => a - b);
        active = next.indexOf(value) === 0 ? 0 : 1;
        if (next[0] === next[1]) active = other;
      }
    }
  } else {
    next[0] = value;
  }
  return { values: next, activeThumb: active };
}
