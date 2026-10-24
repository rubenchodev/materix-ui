import { Children, Fragment, cloneElement, forwardRef, isValidElement } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/stack.css';
import '@rubenchodev/materix-ui/components/divider.css';
import { cx, isDev } from '../../core';
import { resolveResponsive } from './responsive';
import type { Breakpoint, ResponsiveValue } from './responsive';

/** Breakpoints canónicos (xs 0, sm 600, md 900, lg 1200, xl 1536). */
export type StackBreakpoint = Breakpoint;

/** Valor fijo, por breakpoint o en array (desde xs). */
export type StackResponsive<T> = ResponsiveValue<T>;

/** Dirección flex del Stack (`col` es alias heredado de `column`). */
export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse' | 'col';

/** Escala de espaciado (× 8px). */
export type StackSpacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | `${number}`;

/** Alineación en el eje cruzado (acepta los valores CSS). */
export type StackAlign = 'start' | 'flex-start' | 'center' | 'end' | 'flex-end' | 'stretch' | 'baseline';

/** Distribución en el eje principal (acepta los valores CSS). */
export type StackJustify =
  | 'start'
  | 'flex-start'
  | 'center'
  | 'end'
  | 'flex-end'
  | 'between'
  | 'space-between'
  | 'around'
  | 'space-around'
  | 'evenly'
  | 'space-evenly';

const DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'];
const SPACING = ['0', '0_5', '1', '1_5', '2', '2_5', '3', '4', '5', '6', '8', '10'];
const ALIGN: Record<string, string> = {
  start: 'start',
  'flex-start': 'start',
  center: 'center',
  end: 'end',
  'flex-end': 'end',
  stretch: 'stretch',
  baseline: 'baseline',
};
const JUSTIFY: Record<string, string> = {
  start: 'start',
  'flex-start': 'start',
  center: 'center',
  end: 'end',
  'flex-end': 'end',
  between: 'between',
  'space-between': 'between',
  around: 'around',
  'space-around': 'around',
  evenly: 'evenly',
  'space-evenly': 'evenly',
};

/**
 * Prefijo de clase para un breakpoint (xs sin infijo).
 * @param {StackBreakpoint} bp Breakpoint.
 * @returns {string} Prefijo.
 */
const prefixFor = (bp: StackBreakpoint): string => (bp === 'xs' ? 'mtx-stack--' : `mtx-stack--${bp}-`);

/**
 * Clases de dirección por breakpoint; avisa en desarrollo de valores no válidos.
 * @param {StackResponsive<StackDirection> | undefined} direction Dirección.
 * @returns {string[]} Clases.
 */
function directionClasses(direction: StackResponsive<StackDirection> | undefined): string[] {
  return resolveResponsive(direction).flatMap(([bp, raw]) => {
    const value = raw === 'col' ? 'column' : String(raw);
    if (!DIRECTIONS.includes(value)) {
      if (isDev) console.warn(`Stack: dirección no válida "${String(raw)}"`);
      return [];
    }
    return [`${prefixFor(bp)}${value}`];
  });
}

/**
 * Clases de espaciado por breakpoint (`1.5` → `1_5`).
 * @param {StackResponsive<StackSpacing> | undefined} spacing Espaciado.
 * @returns {string[]} Clases.
 */
function spacingClasses(spacing: StackResponsive<StackSpacing> | undefined): string[] {
  return resolveResponsive(spacing).flatMap(([bp, raw]) => {
    const key = String(raw).trim().replace('.', '_');
    if (!SPACING.includes(key)) {
      if (isDev) console.warn(`Stack: espaciado no válido "${String(raw)}"`);
      return [];
    }
    return [`${prefixFor(bp)}spacing-${key}`];
  });
}

/** Propiedades propias de {@link Stack}. */
export interface StackOwnProps {
  /** Dirección (`data-direction` / `data-direction-{bp}`); por defecto `column`. */
  direction?: StackResponsive<StackDirection>;
  /** Separación × 8px (`data-spacing` / `data-spacing-{bp}`): 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10. */
  spacing?: StackResponsive<StackSpacing>;
  /** Alineación en el eje cruzado (`data-align`). */
  alignItems?: StackAlign;
  /** Distribución en el eje principal (`data-justify`). */
  justifyContent?: StackJustify;
  /** Ajuste de línea (`data-wrap`). */
  wrap?: boolean;
  /** Divisor entre hijos (`data-divider`): `true` inserta un `<hr>` decorativo o pasa un nodo propio. */
  divider?: boolean | ReactNode;
  children?: ReactNode;
}

/** Propiedades de {@link Stack}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type StackProps<C extends ElementType = 'div'> = StackOwnProps & {
  /** Elemento o componente raíz (`form`, `ul`, `nav`…). */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof StackOwnProps | 'component'>;

type StackComponent = (<C extends ElementType = 'div'>(
  props: StackProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Intercala el divisor entre los hijos válidos.
 * @param {ReactNode} children Hijos.
 * @param {boolean | ReactNode} divider Divisor.
 * @returns {ReactNode} Hijos con divisores.
 */
function joinChildren(children: ReactNode, divider: boolean | ReactNode): ReactNode {
  const items = Children.toArray(children);
  return items.map((child, index) => {
    if (index === 0) return child;
    const key = `mtx-stack-divider-${index}`;
    const separator =
      divider === true ? (
        <hr key={key} className="mtx-divider mtx-stack__divider" aria-hidden="true" />
      ) : isValidElement(divider) ? (
        cloneElement(divider, { key })
      ) : (
        <Fragment key={key}>{divider}</Fragment>
      );
    return (
      <Fragment key={`mtx-stack-item-${index}`}>
        {separator}
        {child}
      </Fragment>
    );
  });
}

/**
 * Apila hijos en una dirección con separación uniforme y cambios por breakpoint (Stack de MUI).
 */
export const Stack = forwardRef(function Stack(
  {
    component,
    direction,
    spacing,
    alignItems,
    justifyContent,
    wrap = false,
    divider,
    className,
    children,
    ...rest
  }: StackProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const align = alignItems ? ALIGN[alignItems] : undefined;
  const justify = justifyContent ? JUSTIFY[justifyContent] : undefined;
  const classes = cx(
    'mtx-stack',
    ...directionClasses(direction),
    ...spacingClasses(spacing),
    align && `mtx-stack--align-${align}`,
    justify && `mtx-stack--justify-${justify}`,
    wrap && 'mtx-stack--wrap',
    className,
  );
  const hasDivider = divider !== undefined && divider !== null && divider !== false;
  return (
    <Root ref={ref} className={classes} {...rest}>
      {hasDivider ? joinChildren(children, divider) : children}
    </Root>
  );
}) as StackComponent;

Stack.displayName = 'Stack';
