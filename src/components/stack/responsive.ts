/**
 * Valores responsive compartidos por Stack y Grid (sin CSS, para no arrastrar hojas de estilo).
 */

/** Breakpoints canónicos (xs 0, sm 600, md 900, lg 1200, xl 1536). */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Valor fijo, por breakpoint (`{ xs: 'column', sm: 'row' }`) o en array (`['column', 'row']`, desde xs). */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>> | Array<T | null | undefined>;

/** Breakpoints en orden ascendente. */
export const BREAKPOINTS: readonly Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Convierte un valor responsive en pares breakpoint → valor.
 * @param {ResponsiveValue<T> | undefined} value Valor recibido.
 * @returns {Array<[Breakpoint, T]>} Pares definidos, de xs a xl.
 */
export function resolveResponsive<T>(value: ResponsiveValue<T> | undefined | null): Array<[Breakpoint, T]> {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value
      .map((v, i) => [BREAKPOINTS[i], v] as [Breakpoint | undefined, T | null | undefined])
      .filter((pair): pair is [Breakpoint, T] => pair[0] !== undefined && pair[1] !== undefined && pair[1] !== null);
  }
  if (typeof value === 'object') {
    const map = value as Partial<Record<Breakpoint, T>>;
    return BREAKPOINTS.filter((bp) => map[bp] !== undefined && map[bp] !== null).map((bp) => [bp, map[bp] as T]);
  }
  return [['xs', value as T]];
}
