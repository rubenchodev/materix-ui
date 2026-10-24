import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/container.css';
import { cx, isDev } from '../../core';

/** Topes de ancho de {@link Container} (`false` = ancho completo). */
export type ContainerMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

const MAX_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl'];

/** Propiedades propias de {@link Container}. */
export interface ContainerOwnProps {
  /** Ancho máximo (`data-max-width`): xs 444, sm 600, md 900, lg 1200 (por defecto en CSS), xl 1536 o `false` (fluido). */
  maxWidth?: ContainerMaxWidth;
  /** El ancho máximo salta al mínimo de cada breakpoint (`data-fixed`). */
  fixed?: boolean;
  /** Quita los márgenes laterales internos de 16/24px (`data-disable-gutters`). */
  disableGutters?: boolean;
}

/** Propiedades de {@link Container}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type ContainerProps<C extends ElementType = 'div'> = ContainerOwnProps & {
  /** Elemento o componente raíz (`main`, `section`, `article`…). */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ContainerOwnProps | 'component'>;

type ContainerComponent = (<C extends ElementType = 'div'>(
  props: ContainerProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Devuelve la clase del tope de ancho o `null` si no aplica.
 * @param {unknown} maxWidth Valor recibido.
 * @returns {string | null} Clase `mtx-container--{key}`.
 */
function maxWidthClass(maxWidth: unknown): string | null {
  if (maxWidth === undefined || maxWidth === null) return null;
  if (maxWidth === false || maxWidth === 'false') return 'mtx-container--fluid';
  if (MAX_WIDTHS.includes(String(maxWidth))) return `mtx-container--${maxWidth}`;
  if (isDev) console.warn(`Container: maxWidth no válido "${String(maxWidth)}"`);
  return null;
}

/**
 * Centra el contenido con un ancho máximo y márgenes laterales responsive (Container de MUI).
 */
export const Container = forwardRef(function Container(
  { component, maxWidth, fixed = false, disableGutters = false, className, ...rest }: ContainerProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const classes = cx(
    'mtx-container',
    maxWidthClass(maxWidth),
    disableGutters && 'mtx-container--disable-gutters',
    fixed && 'mtx-container--fixed',
    className,
  );
  return <Root ref={ref} className={classes} {...rest} />;
}) as ContainerComponent;

Container.displayName = 'Container';
