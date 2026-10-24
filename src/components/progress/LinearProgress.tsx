'use client';
/**
 * Barra de progreso lineal (`LinearProgress` de MUI).
 */
import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/progress.css';
import { cx } from '../../core';
import { useT } from '../../i18n';
import { clamp, normalizeColor, normalizeRange, progressAria, toNumber, toPercent } from './shared';
import type { ProgressColor, ProgressRange } from './shared';

/** Variantes de la barra lineal. */
export type LinearProgressVariant = 'indeterminate' | 'determinate' | 'buffer' | 'query';

const VARIANTS: readonly LinearProgressVariant[] = ['indeterminate', 'determinate', 'buffer', 'query'];

/** Props de {@link LinearProgress}. */
export interface LinearProgressProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Variante; por defecto `buffer` si hay `valueBuffer`, `determinate` si hay `value` e `indeterminate` si no. */
  variant?: LinearProgressVariant;
  /** Valor actual dentro de [`min`, `max`]. */
  value?: number;
  /** Valor del buffer (variante `buffer`); por defecto `max`. */
  valueBuffer?: number;
  /** Mínimo de la escala (0). */
  min?: number;
  /** Máximo de la escala (100). */
  max?: number;
  /** Color de la paleta o `inherit`. */
  color?: ProgressColor;
  /** Extremos redondeados. */
  rounded?: boolean;
  /** Muestra el porcentaje redondeado a la derecha. */
  showLabel?: boolean;
  /** Nombre accesible (por defecto "Loading" traducido). */
  label?: string;
  /** Oculta la barra a lectores de pantalla. */
  decorative?: boolean;
  /** Idioma local del texto por defecto. */
  locale?: string;
  /** Elemento raíz (`span`). */
  component?: ElementType;
}

/**
 * Transformación de una barra para un valor.
 * @param {number} value Valor acotado.
 * @param {ProgressRange} range Rango.
 * @returns {string} `translateX(...)`.
 */
function toTransform(value: number, range: ProgressRange): string {
  return `translateX(${(toPercent(value, range) - 100).toFixed(3)}%)`;
}

/**
 * Barra lineal indeterminate, determinate, buffer o query con `role="progressbar"`.
 */
export const LinearProgress = forwardRef<HTMLElement, LinearProgressProps>(function LinearProgress(props, ref) {
  const {
    variant: variantProp,
    value: valueProp,
    valueBuffer: bufferProp,
    min,
    max,
    color: colorProp,
    rounded = false,
    showLabel = false,
    label,
    decorative = false,
    locale,
    component: Component = 'span',
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;
  const t = useT('progress', locale);

  const range = normalizeRange(min, max);
  let variant: LinearProgressVariant;
  if (variantProp && VARIANTS.includes(variantProp)) variant = variantProp;
  else if (bufferProp !== undefined && bufferProp !== null) variant = 'buffer';
  else if (valueProp !== undefined && valueProp !== null) variant = 'determinate';
  else variant = 'indeterminate';

  const value = clamp(toNumber(valueProp, range.min), range);
  const buffer = clamp(toNumber(bufferProp, range.max), range);
  const hasValue = variant === 'determinate' || variant === 'buffer';
  const color = normalizeColor(colorProp);

  const bar1Style: CSSProperties | undefined = hasValue ? { transform: toTransform(value, range) } : undefined;
  const bar2Style: CSSProperties | undefined = variant === 'buffer' ? { transform: toTransform(buffer, range) } : undefined;

  const aria = progressAria({
    decorative,
    label,
    ariaLabel,
    ariaLabelledBy,
    defaultLabel: t('loading', null, 'Loading'),
    hasValue,
    value,
    range,
  });

  return (
    <Component
      ref={ref}
      className={cx(
        'mtx-linear-progress',
        rounded && 'mtx-linear-progress--rounded',
        showLabel && 'mtx-linear-progress--with-label',
        `mtx-linear-progress--${color}`,
        `mtx-linear-progress--${variant}`,
        className,
      )}
      {...aria}
      {...rest}
    >
      <span className="mtx-linear-progress__track">
        <span className="mtx-linear-progress__dashed" />
        <span className="mtx-linear-progress__bar mtx-linear-progress__bar1" style={bar1Style} />
        <span className="mtx-linear-progress__bar mtx-linear-progress__bar2" style={bar2Style} />
      </span>
      {showLabel ? (
        <span className="mtx-linear-progress__label" aria-hidden="true">
          {hasValue ? `${Math.round(toPercent(value, range))}%` : ''}
        </span>
      ) : null}
    </Component>
  );
});
