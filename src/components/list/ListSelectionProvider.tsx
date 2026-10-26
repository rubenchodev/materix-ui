'use client';
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useControlled, useEventCallback } from '../../core';
import type { ListSelectDetail, ListSelection } from './ListContext';

/** Ámbito de selección compartido por varias `List` (o `null` si no hay proveedor). */
export const ListSelectionContext = createContext<ListSelection | null>(null);

/**
 * Lee el ámbito de selección compartido más cercano.
 * @returns {ListSelection|null} Ámbito o `null`.
 */
export function useListSelection(): ListSelection | null {
  return useContext(ListSelectionContext);
}

/** Propiedades de {@link ListSelectionProvider}. */
export interface ListSelectionProviderProps {
  /** Valor seleccionado (controlado). `null` = ninguno. */
  value?: string | null;
  /** Valor seleccionado inicial (no controlado). */
  defaultValue?: string | null;
  /** Se llama al seleccionar una fila de cualquiera de las listas (equivale a `mtx:list:select`). */
  onSelect?: (detail: ListSelectDetail) => void;
  /** `false` desactiva la selección al hacer clic. */
  selectable?: boolean;
  /** Listas que comparten la selección (p. ej. las secciones de un `<nav>` o un Drawer). */
  children?: ReactNode;
}

/**
 * Comparte una única selección entre varias `List` (en vanilla, el ámbito es el `nav` o Drawer contenedor).
 */
export function ListSelectionProvider({
  value: valueProp,
  defaultValue = null,
  onSelect,
  selectable = true,
  children,
}: ListSelectionProviderProps) {
  const [value, setValue] = useControlled<string | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'ListSelectionProvider',
  });
  const select = useEventCallback((next: string, item: HTMLElement) => {
    setValue(next);
    onSelect?.({ item, value: next });
  });
  const selection = useMemo<ListSelection>(() => ({ value, selectable, select }), [value, selectable, select]);
  return <ListSelectionContext.Provider value={selection}>{children}</ListSelectionContext.Provider>;
}
