'use client';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { SortDirection } from './Table';
import type { TableSortDetail } from './TableSortLabel';

/** Comparador de filas. */
export type RowComparator<Row> = (a: Row, b: Row) => number;

/**
 * Compara dos valores: números por resta y el resto con `localeCompare` (numérico).
 * @param {*} a Primer valor.
 * @param {*} b Segundo valor.
 * @param {string} [locale] Idioma de la comparación de textos.
 * @returns {number} Negativo, cero o positivo.
 */
export function compareValues(a: unknown, b: unknown, locale?: string): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), locale, { numeric: true, sensitivity: 'base' });
}

/**
 * Comparador por clave y dirección (patrón `getComparator` de MUI).
 * @param {SortDirection} direction Dirección.
 * @param {string} key Propiedad a comparar.
 * @param {string} [locale] Idioma de la comparación de textos.
 * @returns {RowComparator} Comparador.
 */
export function getComparator<Row>(direction: SortDirection, key: keyof Row, locale?: string): RowComparator<Row> {
  const factor = direction === 'desc' ? -1 : 1;
  return (a, b) => factor * compareValues(a[key], b[key], locale);
}

/**
 * Ordena una copia de las filas de forma estable.
 * @param {Row[]} rows Filas.
 * @param {RowComparator} comparator Comparador.
 * @returns {Row[]} Nueva lista ordenada.
 */
export function sortRows<Row>(rows: readonly Row[], comparator: RowComparator<Row>): Row[] {
  return rows
    .map((row, index) => [row, index] as const)
    .sort((a, b) => comparator(a[0], b[0]) || a[1] - b[1])
    .map(([row]) => row);
}

/**
 * Devuelve las filas de una página (base cero); `rowsPerPage = -1` devuelve todas.
 * @param {Row[]} rows Filas.
 * @param {number} page Página.
 * @param {number} rowsPerPage Filas por página.
 * @returns {Row[]} Filas de la página.
 */
export function paginateRows<Row>(rows: readonly Row[], page: number, rowsPerPage: number): Row[] {
  if (rowsPerPage === -1) return rows.slice();
  const start = Math.max(0, page) * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}

/** Opciones de {@link useTableSort}. */
export interface UseTableSortOptions<Key extends string> {
  /** Columna activa inicial. */
  defaultOrderBy?: Key | null;
  /** Dirección inicial. */
  defaultOrder?: SortDirection;
  /** Se invoca tras cada cambio de orden. */
  onSortChange?: (orderBy: Key, order: SortDirection) => void;
}

/** Resultado de {@link useTableSort}. */
export interface UseTableSortResult<Key extends string> {
  orderBy: Key | null;
  order: SortDirection;
  /** Fija columna y dirección. */
  setSort: (orderBy: Key | null, order?: SortDirection) => void;
  /** Props para el `TableSortLabel` de una columna (una sola activa, como vanilla). */
  getSortLabelProps: (key: Key) => {
    active: boolean;
    direction: SortDirection;
    sortKey: Key;
    onSort: (event: MouseEvent<HTMLButtonElement>, detail: TableSortDetail) => void;
  };
}

/**
 * Estado de orden de una tabla: una sola columna activa y alternancia asc/desc al pulsar.
 * @param {UseTableSortOptions} [options] Opciones.
 * @returns {UseTableSortResult} Estado y props para `TableSortLabel`.
 */
export function useTableSort<Key extends string>(options: UseTableSortOptions<Key> = {}): UseTableSortResult<Key> {
  const { defaultOrderBy = null, defaultOrder = 'asc', onSortChange } = options;
  const [state, setState] = useState<{ orderBy: Key | null; order: SortDirection }>({
    orderBy: defaultOrderBy,
    order: defaultOrder,
  });
  return {
    orderBy: state.orderBy,
    order: state.order,
    setSort: (orderBy, order = 'asc') => setState({ orderBy, order }),
    getSortLabelProps: (key) => ({
      active: state.orderBy === key,
      direction: state.orderBy === key ? state.order : 'asc',
      sortKey: key,
      onSort: (_event, detail) => {
        setState({ orderBy: key, order: detail.direction });
        onSortChange?.(key, detail.direction);
      },
    }),
  };
}
