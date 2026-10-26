import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx } from '../../core';

/** Propiedades propias de {@link CardHeader}. */
export interface CardHeaderOwnProps {
  /** Avatar inicial (p. ej. un `Avatar`). */
  avatar?: ReactNode;
  /** Título (`.mtx-card__title`). */
  title?: ReactNode;
  /** Subtítulo (`.mtx-card__subheader`). */
  subheader?: ReactNode;
  /** Acción a la derecha (p. ej. un `IconButton`). */
  action?: ReactNode;
}

/** Propiedades de {@link CardHeader}; `component` cambia la etiqueta (por defecto `div`). */
export type CardHeaderProps<C extends ElementType = 'div'> = CardHeaderOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof CardHeaderOwnProps | 'component'>;

type CardHeaderComponent = (<C extends ElementType = 'div'>(
  props: CardHeaderProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Encabezado de tarjeta: avatar, título, subtítulo y acción (`.mtx-card__header`).
 */
export const CardHeader = forwardRef(function CardHeader(
  { component, avatar, title, subheader, action, className, children, ...rest }: CardHeaderProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  return (
    <Root ref={ref} className={cx('mtx-card__header', className)} {...rest}>
      {avatar != null && <div className="mtx-card__header-avatar">{avatar}</div>}
      {/* Como en vanilla, la zona de contenido existe siempre (ocupa el espacio flexible). */}
      <div className="mtx-card__header-content">
        {title != null && <span className="mtx-card__title">{title}</span>}
        {subheader != null && <span className="mtx-card__subheader">{subheader}</span>}
      </div>
      {children}
      {action != null && <div className="mtx-card__header-action">{action}</div>}
    </Root>
  );
}) as CardHeaderComponent;

CardHeader.displayName = 'CardHeader';
