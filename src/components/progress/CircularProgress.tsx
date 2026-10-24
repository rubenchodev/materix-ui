'use client';
/**
 * Indicador de progreso circular (`CircularProgress` de MUI).
 */
import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/progress.css';
import { cx } from '../../core';
import { useT } from '../../i18n';
import { clamp, normalizeColor, normalizeRange, progressAria, toNumber, toPercent } from './shared';
import type { ProgressColor } from './shared';

/** Lado del viewBox del SVG (igual que MUI). */
const CIRCLE_BOX = 44;

/** Variantes del indicador circular. */
export type CircularProgressVariant = 'indeterminate' | 'determinate';

/** Props de {@link CircularProgress}. */
export interface CircularProgressProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Variante; por defecto `determinate` si hay `value` e `indeterminate` si no. */
  variant?: CircularProgressVariant;
  /** Valor actual dentro de [`min`, `max`]. */
  value?: number;
  /** Mínimo de la escala (0). */
  min?: number;
  /** Máximo de la escala (100). */
  max?: number;
  /** Diámetro en px (40). */
  size?: number;
  /** Grosor del trazo (3.6). */
  thickness?: number;
  /** Color de la paleta o `inherit`. */
  color?: ProgressColor;
  /** Desactiva la animación de encogimiento del trazo. */
  disableShrink?: boolean;
  /** Muestra el anillo de fondo. */
  track?: boolean;
  /** Muestra el porcentaje redondeado en el centro. */
  showLabel?: boolean;
  /** Nombre accesible (por defecto "Loading" traducido). */
  label?: string;
  /** Oculta el indicador a lectores de pantalla (p. ej. dentro de un botón con `aria-busy`). */
  decorative?: boolean;
  /** Idioma local del texto por defecto. */
  locale?: string;
  /** Elemento raíz (`span`). */
  component?: ElementType;
}

/**
 * Indicador circular determinado o indeterminado con `role="progressbar"`.
 */
export const CircularProgress = forwardRef<HTMLElement, CircularProgressProps>(function CircularProgress(props, ref) {
  const {
    variant: variantProp,
    value: valueProp,
    min,
    max,
    size: sizeProp,
    thickness: thicknessProp,
    color: colorProp,
    disableShrink = false,
    track = false,
    showLabel = false,
    label,
    decorative = false,
    locale,
    component: Component = 'span',
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;
  const t = useT('progress', locale);

  const range = normalizeRange(min, max);
  const variant: CircularProgressVariant =
    variantProp === 'determinate' || variantProp === 'indeterminate'
      ? variantProp
      : valueProp !== undefined && valueProp !== null
        ? 'determinate'
        : 'indeterminate';
  const value = clamp(toNumber(valueProp, range.min), range);
  const percent = toPercent(value, range);
  const size = Math.max(4, toNumber(sizeProp, 40));
  const thickness = Math.max(0.5, toNumber(thicknessProp, 3.6));
  const color = normalizeColor(colorProp);
  const determinate = variant === 'determinate';

  const radius = (CIRCLE_BOX - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const circleStyle: CSSProperties | undefined = determinate
    ? {
        strokeDasharray: circumference.toFixed(3),
        strokeDashoffset: `${(((100 - percent) / 100) * circumference).toFixed(3)}px`,
      }
    : undefined;

  const aria = progressAria({
    decorative,
    label,
    ariaLabel,
    ariaLabelledBy,
    defaultLabel: t('loading', null, 'Loading'),
    hasValue: determinate,
    value,
    range,
  });

  const circle = (cls: string, circleStyleValue?: CSSProperties) => (
    <circle
      className={cls}
      cx={CIRCLE_BOX}
      cy={CIRCLE_BOX}
      r={radius}
      fill="none"
      strokeWidth={thickness}
      style={circleStyleValue}
    />
  );

  return (
    <Component
      ref={ref}
      className={cx(
        'mtx-circular-progress',
        disableShrink && 'mtx-circular-progress--disable-shrink',
        track && 'mtx-circular-progress--track',
        showLabel && 'mtx-circular-progress--with-label',
        `mtx-circular-progress--${color}`,
        `mtx-circular-progress--${variant}`,
        className,
      )}
      style={{ '--mtx-circular-progress-size': `${size}px`, ...style } as CSSProperties}
      {...aria}
      {...rest}
    >
      <svg
        className="mtx-circular-progress__svg"
        viewBox={`${CIRCLE_BOX / 2} ${CIRCLE_BOX / 2} ${CIRCLE_BOX} ${CIRCLE_BOX}`}
        focusable="false"
        aria-hidden="true"
      >
        {track ? circle('mtx-circular-progress__track') : null}
        {circle('mtx-circular-progress__circle', circleStyle)}
      </svg>
      {showLabel ? (
        <span className="mtx-circular-progress__label" aria-hidden="true">
          {determinate ? `${Math.round(percent)}%` : ''}
        </span>
      ) : null}
    </Component>
  );
});
