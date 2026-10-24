import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/grid.css';
import { cx, isDev } from '../../core';
import { BREAKPOINTS, resolveResponsive } from '../stack/responsive';
import type { Breakpoint, ResponsiveValue } from '../stack/responsive';

/** Breakpoints de la grilla (xs 0, sm 600, md 900, lg 1200, xl 1536). */
export type GridBreakpoint = Breakpoint;

/** Valor fijo, por breakpoint (`{ xs: 12, md: 6 }`) o en array (desde xs). */
export type GridResponsive<T> = ResponsiveValue<T>;

/** Columnas de un ítem: 1–12, `true`/`'grow'` (reparte el espacio libre) o `'auto'` (ancho del contenido). */
export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | true | 'grow' | 'auto' | `${number}`;

/** Separación × 8px: enteros 0–12 y medios pasos 0.5, 1.5 y 2.5. */
export type GridSpacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | `${number}`;

/** Dirección flex del contenedor. */
export type GridDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

/** Ajuste de línea del contenedor. */
export type GridWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

/** Distribución horizontal de los ítems. */
export type GridJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

/** Alineación vertical de los ítems. */
export type GridAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

const HALF_STEPS = ['0_5', '1_5', '2_5'];
const DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'];
const WRAP: Record<string, string> = { wrap: 'wrap', nowrap: 'nowrap', 'wrap-reverse': 'reverse' };
const JUSTIFY: Record<string, string> = {
  'flex-start': 'flex-start',
  start: 'flex-start',
  center: 'center',
  'flex-end': 'flex-end',
  end: 'flex-end',
  'space-between': 'space-between',
  between: 'space-between',
  'space-around': 'space-around',
  around: 'space-around',
  'space-evenly': 'space-evenly',
  evenly: 'space-evenly',
};
const ALIGN: Record<string, string> = {
  'flex-start': 'flex-start',
  start: 'flex-start',
  center: 'center',
  'flex-end': 'flex-end',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

/**
 * Normaliza un espaciado a su sufijo de clase (`0`–`12`, `0_5`, `1_5`, `2_5`).
 * @param {unknown} value Valor declarado (`2`, `2.5`, `"2_5"`).
 * @returns {string | null} Sufijo o `null` si no pertenece a la escala.
 */
export function normalizeGridSpacing(value: unknown): string | null {
  const token = String(value).trim().replace('.', '_');
  if (HALF_STEPS.includes(token)) return token;
  if (!/^\d+$/.test(token)) return null;
  const n = Number(token);
  return n <= 12 ? String(n) : null;
}

/**
 * Normaliza un tamaño de ítem a su sufijo de clase (`1`–`12`, `true`, `auto`).
 * @param {unknown} value Tamaño declarado.
 * @returns {string | null} Sufijo o `null` si no es válido.
 */
export function normalizeGridSize(value: unknown): string | null {
  if (value === true || value === 'true' || value === 'grow') return 'true';
  if (value === 'auto') return 'auto';
  const token = String(value).trim();
  if (!/^\d+$/.test(token)) return null;
  const n = Number(token);
  return n >= 1 && n <= 12 ? String(n) : null;
}

/** Propiedades propias de {@link Grid}. */
export interface GridOwnProps {
  /** Contenedor flex de 12 columnas (`data-container`). Sin `container` ni tamaño, Grid actúa como contenedor. */
  container?: boolean;
  /** Fuerza el papel de ítem sin tamaño (`data-item`). */
  item?: boolean;
  /** Columnas por breakpoint (API de MUI Grid v2): `6` o `{ xs: 12, md: 6 }`. */
  size?: GridResponsive<GridSize>;
  /** Columnas desde 0px (`data-xs`). */
  xs?: GridSize;
  /** Columnas desde 600px (`data-sm`). */
  sm?: GridSize;
  /** Columnas desde 900px (`data-md`). */
  md?: GridSize;
  /** Columnas desde 1200px (`data-lg`). */
  lg?: GridSize;
  /** Columnas desde 1536px (`data-xl`). */
  xl?: GridSize;
  /** Separación de filas y columnas × 8px (`data-spacing` / `data-spacing-{bp}`); solo en contenedores. */
  spacing?: GridResponsive<GridSpacing>;
  /** Separación entre filas (`data-row-spacing` / `-{bp}`). */
  rowSpacing?: GridResponsive<GridSpacing>;
  /** Separación entre columnas (`data-column-spacing` / `-{bp}`). */
  columnSpacing?: GridResponsive<GridSpacing>;
  /** Dirección flex (`data-direction`). */
  direction?: GridDirection;
  /** Ajuste de línea (`mtx-grid--wrap-*`); por defecto `wrap`. */
  wrap?: GridWrap;
  /** Distribución horizontal (`data-justify`). */
  justifyContent?: GridJustify;
  /** Alineación vertical (`data-align`). */
  alignItems?: GridAlign;
}

/** Propiedades de {@link Grid}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type GridProps<C extends ElementType = 'div'> = GridOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridOwnProps | 'component'>;

type GridComponent = (<C extends ElementType = 'div'>(
  props: GridProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Avisa en desarrollo de un valor no válido.
 * @param {string} prop Propiedad.
 * @param {unknown} value Valor.
 */
const warn = (prop: string, value: unknown): void => {
  if (isDev) console.warn(`Grid: ${prop} no válido "${String(value)}"`);
};

/**
 * Clases de tamaño por breakpoint combinando `size` y `xs`…`xl` (estas prevalecen).
 * @param {GridOwnProps} props Propiedades.
 * @returns {string[]} Clases `mtx-grid--{bp}-{n}`.
 */
function sizeClasses(props: Pick<GridOwnProps, 'size' | GridBreakpoint>): string[] {
  const sizes = new Map<GridBreakpoint, unknown>(resolveResponsive(props.size));
  BREAKPOINTS.forEach((bp) => {
    if (props[bp] !== undefined && props[bp] !== null) sizes.set(bp, props[bp]);
  });
  return BREAKPOINTS.flatMap((bp) => {
    if (!sizes.has(bp)) return [];
    const key = normalizeGridSize(sizes.get(bp));
    if (key === null) {
      warn(`size (${bp})`, sizes.get(bp));
      return [];
    }
    return [`mtx-grid--${bp}-${key}`];
  });
}

/**
 * Clases de un tipo de espaciado por breakpoint.
 * @param {string} kind `spacing`, `row-spacing` o `column-spacing`.
 * @param {GridResponsive<GridSpacing> | undefined} value Valor.
 * @returns {string[]} Clases.
 */
function spacingClasses(kind: string, value: GridResponsive<GridSpacing> | undefined): string[] {
  return resolveResponsive(value).flatMap(([bp, raw]) => {
    const key = normalizeGridSpacing(raw);
    if (key === null) {
      warn(kind, raw);
      return [];
    }
    return [bp === 'xs' ? `mtx-grid--${kind}-${key}` : `mtx-grid--${bp}-${kind}-${key}`];
  });
}

/**
 * Devuelve la clase de un valor mapeado o avisa si no es válido.
 * @param {string} prop Propiedad.
 * @param {string | undefined} value Valor.
 * @param {Record<string, string>} map Valores aceptados → sufijo.
 * @param {string} prefix Prefijo de clase.
 * @returns {string | null} Clase.
 */
function mappedClass(prop: string, value: string | undefined, map: Record<string, string>, prefix: string): string | null {
  if (!value) return null;
  const key = map[value];
  if (!key) {
    warn(prop, value);
    return null;
  }
  return `${prefix}${key}`;
}

/**
 * Contenedor o ítem de la grilla flexbox de 12 columnas con gap (Grid v2 de MUI).
 */
export const Grid = forwardRef(function Grid(
  {
    component,
    container = false,
    item = false,
    size,
    xs,
    sm,
    md,
    lg,
    xl,
    spacing,
    rowSpacing,
    columnSpacing,
    direction,
    wrap,
    justifyContent,
    alignItems,
    className,
    ...rest
  }: GridProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const sizes = sizeClasses({ size, xs, sm, md, lg, xl });
  const isItem = item || sizes.length > 0;
  const isContainer = container || !isItem;
  const classes = cx(
    'mtx-grid',
    isContainer && 'mtx-grid--container',
    isItem && 'mtx-grid--item',
    ...sizes,
    ...(isContainer
      ? [
          ...spacingClasses('spacing', spacing),
          ...spacingClasses('row-spacing', rowSpacing),
          ...spacingClasses('column-spacing', columnSpacing),
        ]
      : []),
    direction && (DIRECTIONS.includes(direction) ? `mtx-grid--direction-${direction}` : (warn('direction', direction), null)),
    mappedClass('wrap', wrap, WRAP, 'mtx-grid--wrap-'),
    mappedClass('justifyContent', justifyContent, JUSTIFY, 'mtx-grid--justify-'),
    mappedClass('alignItems', alignItems, ALIGN, 'mtx-grid--align-'),
    className,
  );
  return <Root ref={ref} className={classes} {...rest} />;
}) as GridComponent;

Grid.displayName = 'Grid';
