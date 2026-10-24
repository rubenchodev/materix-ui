import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/list.css';
import { cx } from '../../core';

/** Propiedades de {@link ListItemText}. */
export interface ListItemTextProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Texto principal; si falta se usan los `children`. */
  primary?: ReactNode;
  /** Texto secundario (body2, color secundario). */
  secondary?: ReactNode;
  /** Texto principal alternativo a `primary`. */
  children?: ReactNode;
}

/**
 * Texto de una fila: principal y secundario (`.mtx-list-item-text`).
 */
export const ListItemText = forwardRef(function ListItemText(
  { primary, secondary, children, className, ...rest }: ListItemTextProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <span ref={ref} className={cx('mtx-list-item-text', className)} {...rest}>
      <span className="mtx-list-item-text__primary">{primary ?? children}</span>
      {secondary != null && secondary !== '' && secondary !== false && (
        <span className="mtx-list-item-text__secondary">{secondary}</span>
      )}
    </span>
  );
});
ListItemText.displayName = 'ListItemText';

/** Propiedades de {@link ListItemIcon}. */
export interface ListItemIconProps extends ComponentPropsWithoutRef<'span'> {
  /** Nombre de Material Icon a pintar cuando no hay `children`. */
  icon?: string;
}

/**
 * Contenedor de icono de una fila (`.mtx-list-item-icon`).
 */
export const ListItemIcon = forwardRef(function ListItemIcon(
  { icon, children, className, ...rest }: ListItemIconProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <span ref={ref} className={cx('mtx-list-item-icon', className)} {...rest}>
      {children ??
        (icon ? (
          <span className="material-icons" aria-hidden="true">
            {icon}
          </span>
        ) : null)}
    </span>
  );
});
ListItemIcon.displayName = 'ListItemIcon';

/** Propiedades de {@link ListItemAvatar}. */
export type ListItemAvatarProps = ComponentPropsWithoutRef<'span'>;

/**
 * Contenedor de avatar de una fila, 56px de ancho mínimo (`.mtx-list-item-avatar`).
 */
export const ListItemAvatar = forwardRef(function ListItemAvatar(
  { className, ...rest }: ListItemAvatarProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return <span ref={ref} className={cx('mtx-list-item-avatar', className)} {...rest} />;
});
ListItemAvatar.displayName = 'ListItemAvatar';

/** Propiedades de {@link ListItemSecondaryAction}. */
export type ListItemSecondaryActionProps = ComponentPropsWithoutRef<'span'>;

/**
 * Acciones al final de la fila (`.mtx-list-item-secondary-action`).
 */
export const ListItemSecondaryAction = forwardRef(function ListItemSecondaryAction(
  { className, ...rest }: ListItemSecondaryActionProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return <span ref={ref} className={cx('mtx-list-item-secondary-action', className)} {...rest} />;
});
ListItemSecondaryAction.displayName = 'ListItemSecondaryAction';

/** Propiedades propias de {@link ListSubheader}. */
export interface ListSubheaderOwnProps {
  /** Sangría de 72px para alinear con el texto de filas con icono. */
  inset?: boolean;
  /** Fija la subcabecera arriba mientras la lista se desplaza. */
  sticky?: boolean;
}

/** Propiedades de {@link ListSubheader}; `component` cambia la etiqueta (por defecto `li`). */
export type ListSubheaderProps<C extends ElementType = 'li'> = ListSubheaderOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListSubheaderOwnProps | 'component'>;

type ListSubheaderComponent = (<C extends ElementType = 'li'>(
  props: ListSubheaderProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Subcabecera de grupo de una lista (`.mtx-list-subheader`).
 */
export const ListSubheader = forwardRef(function ListSubheader(
  { component, inset = false, sticky = false, className, ...rest }: ListSubheaderProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'li';
  return (
    <Root
      ref={ref}
      className={cx(
        'mtx-list-subheader',
        inset && 'mtx-list-subheader--inset',
        sticky && 'mtx-list-subheader--sticky',
        className,
      )}
      {...rest}
    />
  );
}) as ListSubheaderComponent;
ListSubheader.displayName = 'ListSubheader';
