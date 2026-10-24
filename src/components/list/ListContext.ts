'use client';
import { createContext, useContext } from 'react';

/** Detalle de la selección (equivalente al `detail` de `mtx:list:select`). */
export interface ListSelectDetail {
  /** Fila seleccionada. */
  item: HTMLElement;
  /** Valor de la fila (`value` de `ListItemButton` o un id generado). */
  value: string;
}

/** Ámbito de selección compartido por una lista y sus listas anidadas. */
export interface ListSelection {
  /** Valor seleccionado (`null`/`undefined` = ninguno). */
  value: string | null | undefined;
  /** `false` desactiva la selección automática al hacer clic. */
  selectable: boolean;
  /** Selecciona una fila. */
  select: (value: string, item: HTMLElement) => void;
}

/** Valor del contexto de lista. */
export interface ListContextValue {
  /** Filas compactas heredadas de la lista. */
  dense: boolean;
  /** Ámbito de selección. */
  selection: ListSelection;
}

/** Contexto de la lista más cercana (o `null` fuera de una). */
export const ListContext = createContext<ListContextValue | null>(null);

/**
 * Lee el contexto de la lista contenedora.
 * @returns {ListContextValue|null} Contexto o `null`.
 */
export function useListContext(): ListContextValue | null {
  return useContext(ListContext);
}
