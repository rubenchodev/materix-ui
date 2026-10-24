'use client';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/table.css';
import { cx, useEnhancedEffect } from '../../core';
import { useTableCellSort } from './Table';
import type { SortDirection } from './Table';

/** Detalle de {@link TableSortLabelProps.onSort} (equivale a `mtx:table:sort` de vanilla). */
export interface TableSortDetail {
  /** Dirección solicitada: `desc` si ya estaba activa en `asc`; si no, `asc`. */
  direction: SortDirection;
  /** Siempre `true`: la columna pulsada pasa a ser la activa. */
  active: true;
  /** Clave de la columna (`sortKey`) o `null`. */
  key: string | null;
}

/** Props de {@link TableSortLabel}. */
export interface TableSortLabelProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSort'> {
  /** Columna ordenada actualmente (`mtx-table-sort-label--active`, icono visible). */
  active?: boolean;
  /** Dirección mostrada (`desc` añade `mtx-table-sort-label--desc`). */
  direction?: SortDirection;
  /** Clave de la columna que se devuelve en `onSort`. */
  sortKey?: string;
  /** Pide un nuevo orden al pulsar la etiqueta. */
  onSort?: (event: MouseEvent<HTMLButtonElement>, detail: TableSortDetail) => void;
  /** Icono propio (por defecto la flecha SVG de MUI, 18px). */
  icon?: ReactNode;
  /** Oculta el icono mientras la columna no está activa. */
  hideSortIcon?: boolean;
}

const SortIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </svg>
);

/**
 * Etiqueta de ordenación de columna (TableSortLabel de MUI) sobre un `<button>` nativo.
 * Es controlada (`active`, `direction`) y publica `aria-sort` en el `<th>` que la contiene.
 */
export const TableSortLabel = forwardRef<HTMLButtonElement, TableSortLabelProps>(function TableSortLabel(props, ref) {
  const {
    active = false,
    direction = 'asc',
    sortKey,
    onSort,
    onClick,
    icon,
    hideSortIcon = false,
    disabled = false,
    className,
    children,
    type = 'button',
    ...rest
  } = props;
  const setCellSort = useTableCellSort();

  useEnhancedEffect(() => {
    if (!setCellSort) return undefined;
    setCellSort(active ? direction : false);
    return () => setCellSort(false);
  }, [setCellSort, active, direction]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const next: SortDirection = active && direction === 'asc' ? 'desc' : 'asc';
    onSort?.(event, { direction: next, active: true, key: sortKey ?? null });
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'mtx-table-sort-label',
        active && 'mtx-table-sort-label--active',
        direction === 'desc' && 'mtx-table-sort-label--desc',
        className,
      )}
      data-direction={direction}
      data-active={active ? '' : undefined}
      data-key={sortKey}
      disabled={disabled || undefined}
      aria-disabled={disabled ? 'true' : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
      {hideSortIcon && !active ? null : (
        <span className="mtx-table-sort-label__icon" aria-hidden="true">
          {icon ?? <SortIcon />}
        </span>
      )}
    </button>
  );
});
