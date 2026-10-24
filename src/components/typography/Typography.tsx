import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/typography.css';
import { cx } from '../../core';

/** Variantes de la escala tipográfica de MUI. */
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

/** Colores admitidos: paleta, texto e `inherit`. */
export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'text-primary'
  | 'text-secondary'
  | 'text-disabled'
  | 'disabled'
  | 'inherit';

/** Alineación del texto (`inherit` no añade clase). */
export type TypographyAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';

/** Etiqueta usada por defecto para cada variante (subtítulos como `<p>` para no crear encabezados falsos). */
export const TYPOGRAPHY_VARIANT_MAPPING: Record<TypographyVariant | 'inherit', ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'p',
  subtitle2: 'p',
  body1: 'p',
  body2: 'p',
  button: 'span',
  caption: 'span',
  overline: 'span',
  inherit: 'p',
};

const HEADING_RE = /^h[1-6]$/;

/** Propiedades propias de {@link Typography}. */
export interface TypographyOwnProps {
  /** Variante tipográfica; `inherit` no aplica estilo de escala. Por defecto `body1` (o la del encabezado `component`). */
  variant?: TypographyVariant | 'inherit';
  /** Variante desde 600px (`mtx-typography--sm-{v}`). */
  variantSm?: TypographyVariant;
  /** Variante desde 900px (`mtx-typography--md-{v}`). */
  variantMd?: TypographyVariant;
  /** Variante desde 1200px (`mtx-typography--lg-{v}`). */
  variantLg?: TypographyVariant;
  /** Variante desde 1536px (`mtx-typography--xl-{v}`). */
  variantXl?: TypographyVariant;
  /** Escala fluida de h1–h6 (`responsiveFontSizes` de MUI). */
  responsive?: boolean;
  /** Color del texto. */
  color?: TypographyColor;
  /** Alineación del texto. */
  align?: TypographyAlign;
  /** Una sola línea con elipsis. */
  noWrap?: boolean;
  /** Margen inferior de 0.35em. */
  gutterBottom?: boolean;
  /** Margen inferior de 16px; usa `<p>` si no se indica `component`. */
  paragraph?: boolean;
  /** Sustituye el mapeo variante → etiqueta. */
  variantMapping?: Partial<Record<TypographyVariant | 'inherit', ElementType>>;
}

/** Propiedades de {@link Typography}; `component` elige la etiqueta (semántica) y `variant` el estilo. */
export type TypographyProps<C extends ElementType = 'p'> = TypographyOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof TypographyOwnProps | 'component'>;

type TypographyComponent = (<C extends ElementType = 'p'>(
  props: TypographyProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Texto con la escala tipográfica de MUI (Typography).
 */
export const Typography = forwardRef(function Typography(
  {
    component,
    variant: variantProp,
    variantSm,
    variantMd,
    variantLg,
    variantXl,
    responsive = false,
    color,
    align = 'inherit',
    noWrap = false,
    gutterBottom = false,
    paragraph = false,
    variantMapping,
    className,
    ...rest
  }: TypographyProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  // Como vanilla: un encabezado h1–h6 sin variante toma la suya de la etiqueta.
  const variant: TypographyVariant | 'inherit' =
    variantProp ?? (typeof component === 'string' && HEADING_RE.test(component) ? (component as TypographyVariant) : 'body1');
  const Root: ElementType =
    component ?? (paragraph ? 'p' : variantMapping?.[variant] ?? TYPOGRAPHY_VARIANT_MAPPING[variant] ?? 'span');

  const classes = cx(
    'mtx-typography',
    variant !== 'inherit' && `mtx-typography--${variant}`,
    variantSm && `mtx-typography--sm-${variantSm}`,
    variantMd && `mtx-typography--md-${variantMd}`,
    variantLg && `mtx-typography--lg-${variantLg}`,
    variantXl && `mtx-typography--xl-${variantXl}`,
    responsive && 'mtx-typography--responsive',
    color && `mtx-typography--color-${color}`,
    align !== 'inherit' && `mtx-typography--${align}`,
    align !== 'inherit' && `mtx-typography--align-${align}`,
    noWrap && 'mtx-typography--no-wrap',
    gutterBottom && 'mtx-typography--gutter-bottom',
    paragraph && 'mtx-typography--paragraph',
    className,
  );

  return <Root ref={ref} className={classes} {...rest} />;
}) as TypographyComponent;

Typography.displayName = 'Typography';
