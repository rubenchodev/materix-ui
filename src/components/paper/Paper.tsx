/**
 * Superficie de Materix UI (`Paper` de MUI): elevaciones 0–24, variante outlined y esquinas rectas.
 */
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/paper.css';
import { cx } from '../../core';

/** Elevaciones con token y estilo propio (MUI): 0–8, 12, 16 y 24. */
export type PaperElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 16 | 24;

/** Propiedades propias de {@link Paper}. */
export interface PaperOwnProps {
  /** Elevación (`mtx-paper--elevation-{n}`). Sin valor se usa la sombra base (elevación 1). */
  elevation?: PaperElevation | number;
  /** `elevation` (sombra, por defecto) u `outlined` (borde de 1px sin sombra). */
  variant?: 'elevation' | 'outlined';
  /** Esquinas rectas (sin radio). */
  square?: boolean;
}

/** Propiedades de {@link Paper}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type PaperProps<C extends ElementType = 'div'> = PaperOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof PaperOwnProps | 'component'>;

type PaperComponent = (<C extends ElementType = 'div'>(
  props: PaperProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Superficie elevada de Materix UI (Paper de MUI).
 */
export const Paper = forwardRef(function Paper(
  { component, elevation, variant, square = false, className, ...rest }: PaperProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const classes = cx(
    'mtx-paper',
    elevation !== undefined && elevation !== null && `mtx-paper--elevation-${elevation}`,
    variant === 'outlined' && 'mtx-paper--outlined',
    square && 'mtx-paper--square',
    className,
  );
  return <Root ref={ref} className={classes} {...rest} />;
}) as PaperComponent;

Paper.displayName = 'Paper';
