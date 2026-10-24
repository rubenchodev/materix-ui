/**
 * Algoritmo `usePagination` de MUI (portado de `pagination.js` de vanilla).
 */

/** Botones de navegación de la paginación. */
export type PaginationNavType = 'first' | 'previous' | 'next' | 'last';

/** Ítem visible: número de página, botón de navegación o elipsis. */
export type PaginationItem = number | PaginationNavType | 'start-ellipsis' | 'end-ellipsis';

/** Opciones de {@link getPaginationItems}. */
export interface PaginationItemsOptions {
  /** Total de páginas. */
  count: number;
  /** Página actual (base 1). */
  page: number;
  /** Páginas a cada lado de la actual (1). */
  siblingCount?: number;
  /** Páginas fijas al inicio y al final (1). */
  boundaryCount?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
}

/**
 * Rango inclusivo de enteros.
 * @param {number} start Inicio.
 * @param {number} end Fin.
 * @returns {number[]} Rango (vacío si `end < start`).
 */
export function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return length > 0 ? Array.from({ length }, (_, i) => start + i) : [];
}

/**
 * Calcula los ítems visibles de la paginación.
 * @param {PaginationItemsOptions} options Opciones.
 * @returns {PaginationItem[]} Páginas y tipos (`first`, `previous`, `start-ellipsis`…).
 */
export function getPaginationItems(options: PaginationItemsOptions): PaginationItem[] {
  const { count, page, siblingCount = 1, boundaryCount = 1 } = options;
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  let startGap: PaginationItem[] = [];
  if (siblingsStart > boundaryCount + 2) startGap = ['start-ellipsis'];
  else if (boundaryCount + 1 < count - boundaryCount) startGap = [boundaryCount + 1];

  let endGap: PaginationItem[] = [];
  if (siblingsEnd < count - boundaryCount - 1) endGap = ['end-ellipsis'];
  else if (count - boundaryCount > boundaryCount) endGap = [count - boundaryCount];

  return [
    ...(options.showFirstButton ? (['first'] as const) : []),
    ...(options.hidePrevButton ? [] : (['previous'] as const)),
    ...startPages,
    ...startGap,
    ...range(siblingsStart, siblingsEnd),
    ...endGap,
    ...endPages,
    ...(options.hideNextButton ? [] : (['next'] as const)),
    ...(options.showLastButton ? (['last'] as const) : []),
  ];
}
