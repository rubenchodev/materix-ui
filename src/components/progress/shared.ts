/**
 * Lógica común de CircularProgress y LinearProgress: rango, valor, color y ARIA.
 */
import type { AriaAttributes } from 'react';

/** Colores de la paleta admitidos por los indicadores. */
export type ProgressColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';

export const PROGRESS_COLORS: readonly ProgressColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit'];

/**
 * Convierte un valor en número finito.
 * @param {unknown} raw Valor crudo.
 * @param {number} fallback Valor por defecto.
 * @returns {number} Número interpretado.
 */
export function toNumber(raw: unknown, fallback: number): number {
  if (raw === null || raw === undefined || raw === '') return fallback;
  const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw));
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Rango normalizado de un indicador. */
export interface ProgressRange {
  min: number;
  max: number;
}

/**
 * Normaliza el rango: si `max <= min`, `max = min + 100` (igual que vanilla).
 * @param {number} [min] Mínimo.
 * @param {number} [max] Máximo.
 * @returns {ProgressRange} Rango válido.
 */
export function normalizeRange(min?: number, max?: number): ProgressRange {
  const lo = toNumber(min, 0);
  let hi = toNumber(max, 100);
  if (hi <= lo) hi = lo + 100;
  return { min: lo, max: hi };
}

/**
 * Limita un valor al rango.
 * @param {number} value Valor.
 * @param {ProgressRange} range Rango.
 * @returns {number} Valor acotado.
 */
export function clamp(value: number, { min, max }: ProgressRange): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Porcentaje 0–100 de un valor dentro del rango.
 * @param {number} value Valor acotado.
 * @param {ProgressRange} range Rango.
 * @returns {number} Porcentaje.
 */
export function toPercent(value: number, { min, max }: ProgressRange): number {
  return ((value - min) / (max - min)) * 100;
}

/**
 * Normaliza el color (desconocido → `primary`).
 * @param {string} [color] Color solicitado.
 * @returns {ProgressColor} Color válido.
 */
export function normalizeColor(color?: string): ProgressColor {
  return PROGRESS_COLORS.includes(color as ProgressColor) ? (color as ProgressColor) : 'primary';
}

/** Entrada de {@link progressAria}. */
export interface ProgressAriaInput {
  decorative?: boolean;
  label?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  defaultLabel: string;
  hasValue: boolean;
  value: number;
  range: ProgressRange;
}

/** Atributos ARIA del elemento raíz. */
export type ProgressAria = Pick<
  AriaAttributes,
  'aria-hidden' | 'aria-label' | 'aria-labelledby' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
> & { role?: 'progressbar' };

/**
 * Calcula role, nombre accesible y `aria-value*` (misma precedencia que vanilla).
 * @param {ProgressAriaInput} input Estado del indicador.
 * @returns {ProgressAria} Atributos.
 */
export function progressAria(input: ProgressAriaInput): ProgressAria {
  if (input.decorative) return { 'aria-hidden': true };
  const attrs: ProgressAria = { role: 'progressbar' };
  if (input.ariaLabelledBy) attrs['aria-labelledby'] = input.ariaLabelledBy;
  else attrs['aria-label'] = input.label || input.ariaLabel || input.defaultLabel;
  if (input.hasValue) {
    attrs['aria-valuemin'] = input.range.min;
    attrs['aria-valuemax'] = input.range.max;
    attrs['aria-valuenow'] = Math.round(input.value * 100) / 100;
  }
  return attrs;
}
