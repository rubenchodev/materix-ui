'use client';
import { forwardRef } from 'react';
import type { ChangeEvent, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/table.css';
import { cx, useControlled } from '../../core';
import { useT } from '../../i18n';

/** Acción de navegación de la paginación. */
export type TablePaginationAction = 'first' | 'previous' | 'next' | 'last';
/** Motivo de cambio de página (igual que el `reason` de `mtx:table:page-change`). */
export type TablePageChangeReason = 'firstPage' | 'previousPage' | 'nextPage' | 'lastPage';

/** Detalle de {@link TablePaginationProps.onPageChange}. */
export interface TablePageChangeDetail {
  previousPage: number;
  reason: TablePageChangeReason;
}

/** Detalle de {@link TablePaginationProps.onRowsPerPageChange}. */
export interface TableRowsPerPageChangeDetail {
  previousRowsPerPage: number;
  /** Página tras el cambio (siempre `0`). */
  page: 0;
}

/** Datos para {@link TablePaginationProps.labelDisplayedRows}. */
export interface TableDisplayedRowsInfo {
  from: number;
  to: number;
  count: number;
  page: number;
}

/** Props de {@link TablePagination}. */
export interface TablePaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Total de filas; `-1` si es desconocido ("más de"). */
  count?: number;
  /** Página actual con índice base cero (controlada). */
  page?: number;
  /** Página inicial (no controlada). */
  defaultPage?: number;
  /** Filas por página (controlada); `-1` muestra todas. */
  rowsPerPage?: number;
  /** Filas por página iniciales (no controlada). */
  defaultRowsPerPage?: number;
  /** Opciones del selector; `-1` es "Todas". */
  rowsPerPageOptions?: number[];
  /** Cambio de página por interacción (equivale a `mtx:table:page-change`). */
  onPageChange?: (event: MouseEvent<HTMLButtonElement>, page: number, detail: TablePageChangeDetail) => void;
  /** Cambio de filas por página (equivale a `mtx:table:rows-per-page-change`); la página vuelve a 0. */
  onRowsPerPageChange?: (event: ChangeEvent<HTMLSelectElement>, rowsPerPage: number, detail: TableRowsPerPageChangeDetail) => void;
  /** Muestra el botón de primera página. */
  showFirstButton?: boolean;
  /** Muestra el botón de última página. */
  showLastButton?: boolean;
  /** Deshabilita selector y botones (`aria-disabled` en la raíz). */
  disabled?: boolean;
  /** Texto del selector ("Rows per page:"). */
  labelRowsPerPage?: string;
  /** Texto de la opción `-1` ("All"). */
  labelAll?: string;
  /** Palabra "of" del rango. */
  labelOf?: string;
  /** Palabra "more than" del rango con total desconocido. */
  labelMoreThan?: string;
  /** Texto completo del rango; sustituye a `labelOf`/`labelMoreThan`. */
  labelDisplayedRows?: (info: TableDisplayedRowsInfo) => ReactNode;
  /** Nombre accesible de cada botón. */
  getItemAriaLabel?: (type: TablePaginationAction) => string;
  /** Idioma de los textos (prevalece sobre `I18nProvider`). */
  locale?: string;
}

const DEFAULT_OPTIONS = [10, 25, 50, 100];
const SYMBOLS: Record<TablePaginationAction, string> = { first: '«', previous: '‹', next: '›', last: '»' };
const ARIA_KEYS: Record<TablePaginationAction, TablePageChangeReason> = {
  first: 'firstPage',
  previous: 'previousPage',
  next: 'nextPage',
  last: 'lastPage',
};
const FALLBACK_LABELS: Record<TablePageChangeReason, string> = {
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
};

/**
 * Normaliza las opciones de filas por página (incluye la actual y quita duplicados).
 * @param {number[]} options Opciones declaradas.
 * @param {number} current Valor actual.
 * @returns {number[]} Opciones válidas.
 */
export function normalizeRowsPerPageOptions(options: number[], current: number): number[] {
  const values = options.filter((value) => value === -1 || value > 0);
  if (!values.includes(current)) values.unshift(current);
  return [...new Set(values)];
}

/**
 * Índice de la última página.
 * @param {number} count Total (-1 desconocido).
 * @param {number} rowsPerPage Filas por página (-1 todas).
 * @returns {number} Última página (base cero).
 */
export function lastPageIndex(count: number, rowsPerPage: number): number {
  if (count <= 0 || rowsPerPage === -1) return 0;
  return Math.max(0, Math.ceil(count / rowsPerPage) - 1);
}

/**
 * Paginación de tabla (TablePagination de MUI) con selector nativo de filas por página,
 * rango mostrado en región viva y botones de primera/anterior/siguiente/última página.
 */
export const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(function TablePagination(props, ref) {
  const {
    count = 0,
    page: pageProp,
    defaultPage = 0,
    rowsPerPage: rowsPerPageProp,
    defaultRowsPerPage = 10,
    rowsPerPageOptions = DEFAULT_OPTIONS,
    onPageChange,
    onRowsPerPageChange,
    showFirstButton = false,
    showLastButton = false,
    disabled = false,
    labelRowsPerPage,
    labelAll,
    labelOf,
    labelMoreThan,
    labelDisplayedRows,
    getItemAriaLabel,
    locale,
    className,
    ...rest
  } = props;
  const t = useT('tablePagination', locale);
  const [rawRowsPerPage, setRowsPerPage] = useControlled({
    controlled: rowsPerPageProp,
    default: defaultRowsPerPage,
    name: 'TablePagination',
    state: 'rowsPerPage',
  });
  const [rawPage, setPage] = useControlled({ controlled: pageProp, default: defaultPage, name: 'TablePagination', state: 'page' });

  const total = Math.max(-1, Math.trunc(count) || 0);
  const rowsPerPage = rawRowsPerPage === -1 ? -1 : Math.max(1, Math.trunc(rawRowsPerPage) || 10);
  const lastPage = lastPageIndex(total, rowsPerPage);
  const page = total === -1 ? Math.max(0, rawPage) : Math.min(Math.max(0, rawPage), lastPage);

  const allRows = rowsPerPage === -1;
  const from = total === 0 ? 0 : allRows ? 1 : page * rowsPerPage + 1;
  let to: number;
  if (total === 0) to = 0;
  else if (allRows) to = total === -1 ? from : total;
  else to = total === -1 ? from + rowsPerPage - 1 : Math.min(total, from + rowsPerPage - 1);

  const ofText = labelOf ?? t('of', null, 'of');
  const moreThanText = labelMoreThan ?? t('moreThan', null, 'more than');
  const displayed = labelDisplayedRows
    ? labelDisplayedRows({ from, to, count: total, page })
    : total === -1
      ? `${from}–${to} ${ofText} ${moreThanText} ${to}`
      : `${from}–${to} ${ofText} ${total}`;
  const rowsLabel = labelRowsPerPage ?? t('rowsPerPage', null, 'Rows per page:');
  const allLabel = labelAll ?? t('all', null, 'All');
  const options = normalizeRowsPerPageOptions(rowsPerPageOptions, rowsPerPage);

  const goTo = (event: MouseEvent<HTMLButtonElement>, target: number, reason: TablePageChangeReason) => {
    const maximum = total === -1 ? Number.MAX_SAFE_INTEGER : lastPage;
    const next = Math.min(maximum, Math.max(0, target));
    if (next === page) return;
    setPage(next);
    onPageChange?.(event, next, { previousPage: page, reason });
  };

  const handleRowsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    const normalized = value === -1 ? -1 : Math.max(1, value || 10);
    setRowsPerPage(normalized);
    setPage(0);
    if (normalized !== rowsPerPage) onRowsPerPageChange?.(event, normalized, { previousRowsPerPage: rowsPerPage, page: 0 });
  };

  const isDisabled: Record<TablePaginationAction, boolean> = {
    first: disabled || page === 0,
    previous: disabled || page === 0,
    next: disabled || (total !== -1 && page >= lastPage),
    last: disabled || total === -1 || page >= lastPage,
  };
  const targets: Record<TablePaginationAction, number> = { first: 0, previous: page - 1, next: page + 1, last: lastPage };
  const hidden: Record<TablePaginationAction, boolean> = {
    first: !showFirstButton,
    previous: false,
    next: false,
    last: !showLastButton,
  };

  return (
    <div
      ref={ref}
      className={cx('mtx-table-pagination', className)}
      aria-disabled={disabled ? 'true' : undefined}
      data-page={page}
      data-rows-per-page={rowsPerPage}
      {...rest}
    >
      <div className="mtx-table-pagination__toolbar">
        <label className="mtx-table-pagination__select-label">
          {rowsLabel}
          <select
            className="mtx-table-pagination__select"
            aria-label={rowsLabel}
            value={String(rowsPerPage)}
            disabled={disabled}
            onChange={handleRowsChange}
          >
            {options.map((value) => (
              <option key={value} value={String(value)}>
                {value === -1 ? allLabel : String(value)}
              </option>
            ))}
          </select>
        </label>
        <p className="mtx-table-pagination__displayed-rows" aria-live="polite">
          {displayed}
        </p>
        <div className="mtx-table-pagination__actions">
          {(['first', 'previous', 'next', 'last'] as const).map((action) => {
            const key = ARIA_KEYS[action];
            return (
              <button
                key={action}
                type="button"
                className="mtx-table-pagination__button"
                data-pagination-action={action}
                aria-label={getItemAriaLabel?.(action) ?? t(key, null, FALLBACK_LABELS[key])}
                disabled={isDisabled[action]}
                hidden={hidden[action]}
                onClick={(event) => goTo(event, targets[action], key)}
              >
                {SYMBOLS[action]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
