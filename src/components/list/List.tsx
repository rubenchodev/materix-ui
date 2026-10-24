'use client';
import { forwardRef, useMemo } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/list.css';
import { cx, useControlled, useEventCallback } from '../../core';
import { ListContext, useListContext } from './ListContext';
import type { ListContextValue, ListSelectDetail, ListSelection } from './ListContext';

/** Propiedades propias de {@link List}. */
export interface ListOwnProps {
  /** Filas compactas (4px de padding vertical) en toda la lista, también en las anidadas. */
  dense?: boolean;
  /** Quita el padding vertical de 8px. */
  disablePadding?: boolean;
  /** Lista anidada: sangra sus filas 48px (`2` → 72px, segundo nivel) y comparte la selección del padre. */
  nested?: boolean | 2;
  /** Subcabecera que se pinta como primer hijo (p. ej. un `ListSubheader`). */
  subheader?: ReactNode;
  /** `false` desactiva la selección al hacer clic en sus `ListItemButton`. */
  selectable?: boolean;
  /** Valor seleccionado (controlado). `null` = ninguno. */
  value?: string | null;
  /** Valor seleccionado inicial (no controlado). */
  defaultValue?: string | null;
  /** Se llama al seleccionar una fila con clic (equivale a `mtx:list:select`). */
  onSelect?: (detail: ListSelectDetail) => void;
}

/** Propiedades de {@link List}; `component` cambia la etiqueta (por defecto `ul`). */
export type ListProps<C extends ElementType = 'ul'> = ListOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListOwnProps | 'component'>;

type ListComponent = (<C extends ElementType = 'ul'>(
  props: ListProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Lista de Materix UI (List de MUI): contenedor de filas con densidad, anidación y selección.
 */
export const List = forwardRef(function List(
  {
    component,
    dense = false,
    disablePadding = false,
    nested = false,
    subheader,
    selectable,
    value: valueProp,
    defaultValue = null,
    onSelect,
    className,
    children,
    ...rest
  }: ListProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'ul';
  const parent = useListContext();
  const [value, setValue] = useControlled<string | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'List',
  });
  const handleSelect = useEventCallback((next: string, item: HTMLElement) => {
    setValue(next);
    onSelect?.({ item, value: next });
  });
  // Una lista anidada sin estado propio comparte el ámbito de selección del padre (como vanilla).
  const ownsSelection = !parent || !nested || valueProp !== undefined || onSelect !== undefined;
  const parentSelection = parent?.selection;
  const ownSelectable = selectable ?? (ownsSelection ? true : parentSelection?.selectable ?? true);

  const selection = useMemo<ListSelection>(() => {
    if (!ownsSelection && parentSelection) {
      return selectable === undefined ? parentSelection : { ...parentSelection, selectable };
    }
    return { value, selectable: ownSelectable, select: handleSelect };
  }, [ownsSelection, parentSelection, selectable, value, ownSelectable, handleSelect]);

  const isDense = dense || Boolean(parent?.dense);
  const context = useMemo<ListContextValue>(() => ({ dense: isDense, selection }), [isDense, selection]);

  return (
    <ListContext.Provider value={context}>
      <Root
        ref={ref}
        className={cx(
          'mtx-list',
          dense && 'mtx-list--dense',
          nested && 'mtx-list--nested',
          nested === 2 && 'mtx-list--nested-2',
          disablePadding && 'mtx-list--disable-padding',
          className,
        )}
        {...rest}
      >
        {subheader}
        {children}
      </Root>
    </ListContext.Provider>
  );
}) as ListComponent;

List.displayName = 'List';
