/**
 * Utilidades DOM compartidas por el núcleo (seguras en SSR).
 */
import type { RefObject } from 'react';

/** Elemento, ref o función que lo devuelve (permite resolverlo en efectos). */
export type ElementTarget<T = Element> =
  | T
  | null
  | undefined
  | RefObject<T | null>
  | (() => T | null | undefined);

/** Indica si se ejecuta en un navegador (hay `window` y `document`). */
export const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Indica si es un entorno de desarrollo (`process.env.NODE_ENV !== 'production'`).
 * En navegadores sin `process` sustituido devuelve `false`.
 */
export const isDev: boolean = (() => {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
})();

/**
 * Documento propietario de un nodo (o el global).
 * @param {Node|null} [node] Nodo de referencia.
 * @returns {Document} Documento.
 */
export function ownerDocument(node?: Node | null): Document {
  return (node && node.ownerDocument) || document;
}

/**
 * Indica si el usuario prefiere reducir las animaciones (lectura puntual, no reactiva).
 * @returns {boolean} `true` si se prefiere reducir el movimiento.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return Boolean(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/**
 * Resuelve un `ElementTarget` a su valor actual. Llamar solo en efectos o manejadores.
 * @param {ElementTarget} target Elemento, ref o función.
 * @returns {*} Valor resuelto o `null`.
 */
export function resolveTarget<T>(target: ElementTarget<T>): T | null {
  if (target == null) return null;
  if (typeof target === 'function') return ((target as () => T | null | undefined)() ?? null) as T | null;
  if (typeof target === 'object' && 'current' in (target as object) && !('nodeType' in (target as object))) {
    return ((target as RefObject<T | null>).current ?? null) as T | null;
  }
  return target as T;
}
