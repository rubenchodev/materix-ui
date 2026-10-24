'use client';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/list.css';
import { cx } from '../../core';
import { renderListItemContent } from './content';
import type { ListItemContentProps } from './content';
import { useListContext } from './ListContext';

/** Propiedades propias de {@link ListItem}. */
export interface ListItemOwnProps extends ListItemContentProps {
  /** Fila estática deshabilitada (texto atenuado y `aria-disabled`). */
  disabled?: boolean;
  /** Fila compacta (se hereda de `List dense`). */
  dense?: boolean;
  /** Quita todo el padding (útil con un `ListItemButton` dentro). */
  disablePadding?: boolean;
  /** Quita el padding horizontal. */
  disableGutters?: boolean;
  /** Borde inferior de 1px. */
  divider?: boolean;
  /** `flex-start` alinea el icono o avatar con la primera línea. */
  alignItems?: 'center' | 'flex-start';
}

/** Propiedades de {@link ListItem}; `component` cambia la etiqueta (por defecto `li`). */
export type ListItemProps<C extends ElementType = 'li'> = ListItemOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListItemOwnProps | 'component'>;

type ListItemComponent = (<C extends ElementType = 'li'>(
  props: ListItemProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Fila estática de una lista (`.mtx-list-item`) con atajos de icono, avatar y textos.
 */
export const ListItem = forwardRef(function ListItem(
  {
    component,
    disabled = false,
    dense,
    disablePadding = false,
    disableGutters = false,
    divider = false,
    alignItems = 'center',
    icon,
    avatar,
    avatarAlt,
    primary,
    secondary,
    secondaryAction,
    className,
    children,
    ...rest
  }: ListItemProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'li';
  const list = useListContext();
  const isDense = dense ?? Boolean(list?.dense);
  return (
    <Root
      ref={ref}
      aria-disabled={disabled ? 'true' : undefined}
      {...rest}
      className={cx(
        'mtx-list-item',
        disabled && 'mtx-list-item--disabled',
        isDense && 'mtx-list-item--dense',
        disablePadding && 'mtx-list-item--disable-padding',
        alignItems === 'flex-start' && 'mtx-list-item--align-start',
        divider && 'mtx-list-item--divider',
        disableGutters && 'mtx-list-item--disable-gutters',
        className,
      )}
    >
      {renderListItemContent({ icon, avatar, avatarAlt, primary, secondary, secondaryAction, children })}
    </Root>
  );
}) as ListItemComponent;

ListItem.displayName = 'ListItem';
