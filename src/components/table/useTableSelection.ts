'use client';
import { useEffect, useMemo, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useControlled } from '../../core';
import { useTableStrings } from './strings';

/** Identificador de fila (se normaliza a cadena, como `data-id` en vanilla). */
export type TableRowId = string | number;

/** Motivo de un cambio de selección (`reason` de `mtx:table:selection-change`). */
export type TableSelectionReason = 'user' | 'api';

/** Detalle de {@link UseTableSelectionOptions.onSelectionChange}. */
export interface TableSelectionChangeDetail<Row> {
  /** Claves seleccionadas. */
  selected: string[];
  /** Filas seleccionadas presentes en `rows`. */
  rows: Row[];
  /** Número de claves seleccionadas. */
  count: number;
  /** Origen del cambio. */
  reason: TableSelectionReason;
}

/** Opciones de {@link useTableSelection}. */
export interface UseTableSelectionOptions<Row> {
  /** Claves seleccionadas (modo controlado). */
  selected?: readonly TableRowId[];
  /** Claves seleccionadas iniciales (modo no controlado; equivale a `data-selected`). */
  defaultSelected?: readonly TableRowId[];
  /** Se invoca cuando cambia la selección (equivale a `mtx:table:selection-change`). */
  onSelectionChange?: (selected: string[], detail: TableSelectionChangeDetail<Row>) => void;
  /** `false` excluye la fila de la selección (equivale a `data-no-select`). */
  isRowSelectable?: (row: Row) => boolean;
  /** `true` deshabilita la casilla de la fila. */
  isRowDisabled?: (row: Row) => boolean;
  /** Texto del nombre accesible "Select {0}" (por defecto, la clave). */
  getRowLabel?: (row: Row) => string;
  /** Alterna la fila al hacer clic fuera de controles (equivale a `data-select-on-click`). */
  selectOnClick?: boolean;
  /** Descarta las claves cuyo id ya no está en `rows` (p. ej. tras borrar filas). Por defecto `false`: la selección sobrevive a filtrar y paginar. */
  pruneMissing?: boolean;
  /** Idioma de los nombres accesibles. */
  locale?: string;
}

/** Props para el `Checkbox` de la cabecera. */
export interface TableHeaderCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  'aria-label': string;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/** Props para el `Checkbox` de una fila. */
export interface TableRowCheckboxProps {
  checked: boolean;
  disabled: boolean;
  'aria-label': string;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/** Props para el `TableRow` de una fila. */
export interface TableSelectionRowProps {
  selected?: boolean;
  'aria-selected'?: 'true' | 'false';
  'data-no-select'?: '';
  onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
}

/** Resultado de {@link useTableSelection}. */
export interface UseTableSelectionResult<Row> {
  /** Claves seleccionadas (incluye las de filas filtradas que ya no están en `rows`). */
  selected: string[];
  /** Número de claves seleccionadas. */
  numSelected: number;
  /** Filas de `rows` seleccionadas. */
  selectedRows: Row[];
  /** Todas las filas seleccionables y habilitadas están seleccionadas. */
  allSelected: boolean;
  /** Selección parcial de las filas visibles (casilla de cabecera indeterminada). */
  someSelected: boolean;
  /** Indica si una fila o clave está seleccionada. */
  isSelected: (rowOrId: Row | TableRowId) => boolean;
  /** Indica si la fila participa en la selección. */
  canSelect: (row: Row) => boolean;
  /** Alterna (o fuerza) la selección de una fila o clave. */
  toggleRow: (rowOrId: Row | TableRowId, force?: boolean) => void;
  /** Selecciona todas las filas seleccionables y habilitadas de `rows`. */
  selectAll: () => void;
  /** Vacía la selección completa. */
  clearSelection: () => void;
  /** Sustituye la selección. */
  setSelected: (ids: readonly TableRowId[]) => void;
  /** Props del `Checkbox` de cabecera. */
  getHeaderCheckboxProps: () => TableHeaderCheckboxProps;
  /** Props del `Checkbox` de una fila. */
  getRowCheckboxProps: (row: Row) => TableRowCheckboxProps;
  /** Props del `TableRow` de una fila (`selected`, `aria-selected`, clic). */
  getRowProps: (row: Row) => TableSelectionRowProps;
}

/** Elementos interactivos que no alternan la fila al hacer clic (como vanilla). */
const INTERACTIVE =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [role="menuitem"], [contenteditable=""], [contenteditable="true"], .mtx-checkbox';

const sameKeys = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((key) => b.includes(key));

/**
 * Selección de filas de tabla como en vanilla (`data-selectable`): casilla de cabecera con
 * estado indeterminado, `aria-selected`, selección por clave estable que sobrevive a
 * reordenar o filtrar, filas excluidas o deshabilitadas y selección por clic opcional.
 *
 * @param {Row[]} rows Filas visibles (las que pinta la tabla).
 * @param {Function} getId Clave estable de cada fila.
 * @param {UseTableSelectionOptions} [options] Opciones.
 * @returns {UseTableSelectionResult} Estado y props para filas y casillas.
 */
export function useTableSelection<Row>(
  rows: readonly Row[],
  getId: (row: Row) => TableRowId,
  options: UseTableSelectionOptions<Row> = {},
): UseTableSelectionResult<Row> {
  const {
    selected: selectedProp,
    defaultSelected = [],
    onSelectionChange,
    isRowSelectable,
    isRowDisabled,
    getRowLabel,
    selectOnClick = false,
    pruneMissing = false,
    locale,
  } = options;
  const t = useTableStrings(locale);
  const controlled = useMemo(() => selectedProp?.map(String), [selectedProp]);
  const [stored, setSelectedState] = useControlled<string[]>({
    controlled,
    default: defaultSelected.map(String),
    name: 'useTableSelection',
    state: 'selected',
  });

  const keyOf = (row: Row) => String(getId(row));
  const rowKeys = new Set(rows.map(keyOf));
  const selected = pruneMissing ? stored.filter((key) => rowKeys.has(key)) : stored;
  const pruned = selected.length !== stored.length;

  // Última selección conocida: permite varios cambios seguidos en el mismo evento.
  const latest = useRef(selected);
  latest.current = selected;
  const canSelect = (row: Row) => (isRowSelectable ? isRowSelectable(row) !== false : true);
  const isDisabled = (row: Row) => Boolean(isRowDisabled?.(row));
  const resolve = (rowOrId: Row | TableRowId) =>
    typeof rowOrId === 'string' || typeof rowOrId === 'number' ? String(rowOrId) : keyOf(rowOrId as Row);

  const commit = (next: string[], reason: TableSelectionReason) => {
    if (sameKeys(next, latest.current)) return;
    latest.current = next;
    setSelectedState(next);
    onSelectionChange?.(next, {
      selected: next,
      rows: rows.filter((row) => next.includes(keyOf(row))),
      count: next.length,
      reason,
    });
  };

  // Con `pruneMissing`, sincroniza el estado (y avisa al padre) cuando desaparecen filas seleccionadas.
  const prunedKey = pruned ? selected.join('|') : null;
  useEffect(() => {
    if (prunedKey === null) return;
    setSelectedState(latest.current);
    onSelectionChange?.(latest.current, {
      selected: latest.current,
      rows: rows.filter((row) => latest.current.includes(keyOf(row))),
      count: latest.current.length,
      reason: 'api',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prunedKey]);

  const toggleKey = (key: string, force: boolean | undefined, reason: TableSelectionReason) => {
    const current = latest.current;
    const value = force === undefined ? !current.includes(key) : Boolean(force);
    const next = current.filter((item) => item !== key);
    if (value) next.push(key);
    commit(next, reason);
  };

  const setAll = (value: boolean, reason: TableSelectionReason) => {
    const next = new Set(latest.current);
    rows.forEach((row) => {
      if (!canSelect(row) || isDisabled(row)) return;
      if (value) next.add(keyOf(row));
      else next.delete(keyOf(row));
    });
    commit([...next], reason);
  };

  const selectedSet = new Set(selected);
  let enabled = 0;
  let checked = 0;
  rows.forEach((row) => {
    if (!canSelect(row) || isDisabled(row)) return;
    enabled += 1;
    if (selectedSet.has(keyOf(row))) checked += 1;
  });
  const allSelected = enabled > 0 && checked === enabled;
  const someSelected = checked > 0 && checked < enabled;

  return {
    selected,
    numSelected: selected.length,
    selectedRows: rows.filter((row) => selectedSet.has(keyOf(row))),
    allSelected,
    someSelected,
    isSelected: (rowOrId) => selectedSet.has(resolve(rowOrId)),
    canSelect,
    toggleRow: (rowOrId, force) => toggleKey(resolve(rowOrId), force, 'api'),
    selectAll: () => setAll(true, 'api'),
    clearSelection: () => commit([], 'api'),
    setSelected: (ids) => commit(ids.map(String), 'api'),
    getHeaderCheckboxProps: () => ({
      checked: allSelected,
      indeterminate: someSelected,
      disabled: enabled === 0,
      'aria-label': t('selectAllRows'),
      onChange: (_event, value) => setAll(value, 'user'),
    }),
    getRowCheckboxProps: (row) => {
      const key = keyOf(row);
      const label = (getRowLabel ? getRowLabel(row) : key).replace(/\s+/g, ' ').trim().slice(0, 80);
      return {
        checked: selectedSet.has(key),
        disabled: isDisabled(row),
        'aria-label': t('selectRow', [label || key]),
        onChange: (_event, value) => toggleKey(key, value, 'user'),
      };
    },
    getRowProps: (row) => {
      const key = keyOf(row);
      const isRowSelected = selectedSet.has(key);
      if (!canSelect(row)) return { 'data-no-select': '' };
      return {
        selected: isRowSelected,
        'aria-selected': isRowSelected ? 'true' : 'false',
        onClick: selectOnClick
          ? (event) => {
              if (event.defaultPrevented || isDisabled(row)) return;
              const target = event.target;
              if (!(target instanceof Element) || target.closest(INTERACTIVE)) return;
              toggleKey(key, undefined, 'user');
            }
          : undefined,
      };
    },
  };
}
