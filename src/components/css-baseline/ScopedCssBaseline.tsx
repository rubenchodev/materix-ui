import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/base.css';
import '@rubenchodev/materix-ui/components/css-baseline.css';
import { cx } from '../../core';

/** Propiedades de {@link ScopedCssBaseline}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type ScopedCssBaselineProps<C extends ElementType = 'div'> = {
  /** Elemento o componente raíz (`section`, `main`…). */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, 'component'>;

type ScopedCssBaselineComponent = (<C extends ElementType = 'div'>(
  props: ScopedCssBaselineProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Línea base acotada a un subárbol (equivale a `<div data-mtx="css-baseline">`): renderiza un contenedor `.mtx-root`.
 */
export const ScopedCssBaseline = forwardRef(function ScopedCssBaseline(
  { component, className, ...rest }: ScopedCssBaselineProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  return <Root ref={ref} className={cx('mtx-root', className)} {...rest} />;
}) as ScopedCssBaselineComponent;

ScopedCssBaseline.displayName = 'ScopedCssBaseline';
