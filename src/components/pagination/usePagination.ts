'use client';
import { useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent, SyntheticEvent } from 'react';
import { useControlled } from '../../core';
import { getPaginationItems } from '../../utils';
import type { PaginationNavType } from '../../utils';

/** Tipo de ítem de la paginación (como `usePagination` de MUI). */
export type UsePaginationItemType = 'page' | PaginationNavType | 'start-ellipsis' | 'end-ellipsis';

/** Ítem calculado por {@link usePagination}. */
export interface UsePaginationItem {
  /** Tipo de ítem. */
  type: UsePaginationItemType;
  /** Página destino (`null` en las elipsis). */
  page: number | null;
  /** `true` en la página actual. */
  selected: boolean;
  /** `true` si el ítem no admite interacción. */
  disabled: boolean;
  /** Va a `page` (no hace nada si está deshabilitado o es la página actual). */
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Opciones de {@link usePagination}. */
export interface UsePaginationProps {
  /** Total de páginas (1). */
  count?: number;
  /** Página actual, base 1 (modo controlado). */
  page?: number;
  /** Página inicial (modo no controlado, 1). */
  defaultPage?: number;
  /** Se invoca al cambiar de página (`mtx:pagination:change` en vanilla). */
  onChange?: (event: SyntheticEvent, page: number) => void;
  /** Páginas a cada lado de la actual (1). */
  siblingCount?: number;
  /** Páginas fijas al inicio y al final (1). */
  boundaryCount?: number;
  /** Muestra el botón «primera página». */
  showFirstButton?: boolean;
  /** Muestra el botón «última página». */
  showLastButton?: boolean;
  /** Oculta el botón «página anterior». */
  hidePrevButton?: boolean;
  /** Oculta el botón «página siguiente». */
  hideNextButton?: boolean;
  /** Deshabilita todos los ítems. */
  disabled?: boolean;
  /** Nombre del componente para los avisos de modo controlado. */
  componentName?: string;
}

/** Resultado de {@link usePagination}. */
export interface UsePaginationResult {
  /** Ítems visibles en orden. */
  items: UsePaginationItem[];
  /** Página actual ajustada a `[1, count]`. */
  page: number;
  /** Total de páginas normalizado. */
  count: number;
  /** Cambia de página emitiendo `onChange` si cambia. */
  goTo: (event: SyntheticEvent, page: number) => boolean;
  /** Fija la página interna sin emitir `onChange` (solo modo no controlado). */
  setPage: (page: number) => void;
}

const NAV_TYPES: PaginationNavType[] = ['first', 'previous', 'next', 'last'];

/**
 * Normaliza un entero con mínimo.
 * @param {number} value Valor.
 * @param {number} fallback Valor por defecto.
 * @param {number} min Mínimo.
 * @returns {number} Entero válido.
 */
function toInt(value: number | undefined, fallback: number, min: number): number {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.max(min, n) : fallback;
}

/**
 * Lógica de paginación de MUI (`usePagination`): calcula los ítems visibles y gestiona la página.
 * @param {UsePaginationProps} [props] Opciones.
 * @returns {UsePaginationResult} Ítems, página actual y acciones.
 */
export function usePagination(props: UsePaginationProps = {}): UsePaginationResult {
  const {
    count: countProp = 1,
    page: pageProp,
    defaultPage = 1,
    onChange,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstButton = false,
    showLastButton = false,
    hidePrevButton = false,
    hideNextButton = false,
    disabled = false,
    componentName = 'usePagination',
  } = props;

  const count = toInt(countProp, 1, 0);
  const [rawPage, setRawPage] = useControlled({ controlled: pageProp, default: defaultPage, name: componentName, state: 'page' });
  const clamp = useCallback((value: number) => Math.min(Math.max(1, toInt(value, 1, 1)), Math.max(1, count)), [count]);
  const page = clamp(rawPage);

  const goTo = (event: SyntheticEvent, target: number): boolean => {
    const next = clamp(target);
    if (next === page || count === 0) return false;
    setRawPage(next);
    onChange?.(event, next);
    return true;
  };

  const targetOf = (type: PaginationNavType): number => {
    if (type === 'first') return 1;
    if (type === 'previous') return page - 1;
    if (type === 'next') return page + 1;
    return count;
  };

  const options = { showFirstButton, showLastButton, hidePrevButton, hideNextButton };
  const entries =
    count > 0
      ? getPaginationItems({ count, page, siblingCount: toInt(siblingCount, 1, 0), boundaryCount: toInt(boundaryCount, 1, 0), ...options })
      : NAV_TYPES.filter(
          (type) =>
            (type === 'first' && showFirstButton) ||
            (type === 'last' && showLastButton) ||
            (type === 'previous' && !hidePrevButton) ||
            (type === 'next' && !hideNextButton),
        );

  const items = entries.map<UsePaginationItem>((entry) => {
    if (typeof entry === 'number') {
      return {
        type: 'page',
        page: entry,
        selected: entry === page,
        disabled,
        onClick: (event) => {
          if (!disabled) goTo(event, entry);
        },
      };
    }
    if (entry === 'start-ellipsis' || entry === 'end-ellipsis') {
      return { type: entry, page: null, selected: false, disabled, onClick: () => {} };
    }
    const target = targetOf(entry);
    const itemDisabled =
      disabled || count === 0 || (entry === 'first' || entry === 'previous' ? page <= 1 : page >= count);
    return {
      type: entry,
      page: target,
      selected: false,
      disabled: itemDisabled,
      onClick: (event) => {
        if (!itemDisabled) goTo(event, target);
      },
    };
  });

  return { items, page, count, goTo, setPage: (value: number) => setRawPage(clamp(value)) };
}
