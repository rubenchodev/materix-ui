import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx } from '../../core';

/** Propiedades de {@link CardContent}; `component` cambia la etiqueta (por defecto `div`). */
export type CardContentProps<C extends ElementType = 'div'> = {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, 'component'>;

type CardContentComponent = (<C extends ElementType = 'div'>(
  props: CardContentProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Contenido principal de una tarjeta (`.mtx-card__content`).
 */
export const CardContent = forwardRef(function CardContent(
  { component, className, ...rest }: CardContentProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  return <Root ref={ref} className={cx('mtx-card__content', className)} {...rest} />;
}) as CardContentComponent;

CardContent.displayName = 'CardContent';
