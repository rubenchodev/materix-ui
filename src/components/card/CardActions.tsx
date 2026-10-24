'use client';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx } from '../../core';
import { useCardContext } from './CardContext';
import type { CardActionsAlign } from './CardContext';

/** Propiedades de {@link CardActions}. */
export interface CardActionsProps extends ComponentPropsWithoutRef<'div'> {
  /** Alineación (`end` por defecto; `start` es la de MUI). Hereda `actionsAlign` de la tarjeta. */
  align?: CardActionsAlign;
  /** Quita la separación de 8px entre acciones. */
  disableSpacing?: boolean;
}

/**
 * Fila de acciones de una tarjeta (`.mtx-card__actions`), alineada a la derecha por defecto.
 */
export const CardActions = forwardRef(function CardActions(
  { align, disableSpacing = false, className, ...rest }: CardActionsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const card = useCardContext();
  const effective = align ?? card?.actionsAlign ?? 'end';
  return (
    <div
      ref={ref}
      className={cx(
        'mtx-card__actions',
        disableSpacing && 'mtx-card__actions--disable-spacing',
        effective !== 'end' && `mtx-card__actions--${effective}`,
        className,
      )}
      {...rest}
    />
  );
});

CardActions.displayName = 'CardActions';
