'use client';
/**
 * Modo efectivo del Drawer: la variante `responsive` alterna entre `temporary` y `permanent` con `matchMedia`.
 */
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import type { MutableRefObject } from 'react';

/** Variante declarada del drawer. */
export type DrawerVariant = 'temporary' | 'persistent' | 'permanent' | 'responsive';

/** Modo efectivo (la variante `responsive` se resuelve a `temporary` o `permanent`). */
export type DrawerMode = 'temporary' | 'persistent' | 'permanent';

/** Breakpoints canónicos de Materix (iguales a Grid). */
export type DrawerBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** `min-width` en px de cada breakpoint. */
export const DRAWER_BREAKPOINTS: Record<DrawerBreakpoint, number> = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

/** Suscripción vacía (sin `matchMedia` o sin variante responsive). */
const noopSubscribe = () => () => {};

/**
 * Indica si `matchMedia` está disponible.
 * @returns {boolean} `true` en navegadores con `matchMedia`.
 */
function canMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/**
 * Modo efectivo y marca de hidratación: `fromServer` es `true` mientras el modo procede del snapshot de servidor
 * (el primer cambio tras hidratar no es un cruce real del breakpoint).
 * @param {DrawerVariant} variant Variante declarada.
 * @param {DrawerBreakpoint} breakpoint Breakpoint de la variante responsive.
 * @returns {{mode: DrawerMode, fromServer: MutableRefObject<boolean>}} Modo y marca.
 */
export function useDrawerModeState(
  variant: DrawerVariant,
  breakpoint: DrawerBreakpoint,
): { mode: DrawerMode; fromServer: MutableRefObject<boolean> } {
  const minWidth = DRAWER_BREAKPOINTS[breakpoint] ?? DRAWER_BREAKPOINTS.md;
  const query = variant === 'responsive' ? `(min-width: ${minWidth}px)` : '';
  const fromServer = useRef(false);

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!query || !canMatchMedia()) return noopSubscribe();
      const mql = window.matchMedia(query);
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
      }
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    },
    [query],
  );
  const getSnapshot = () => Boolean(query && canMatchMedia() && window.matchMedia(query).matches);
  // Solo se llama al hidratar (y en el servidor): marca que el valor inicial no es el real.
  const getServerSnapshot = () => {
    fromServer.current = true;
    return false;
  };
  const matches = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // La corrección tras hidratar se aplica antes de la siguiente macrotarea; después, los cambios son reales.
  useEffect(() => {
    if (!fromServer.current) return undefined;
    const timer = setTimeout(() => {
      fromServer.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const mode: DrawerMode = variant === 'responsive' ? (matches ? 'permanent' : 'temporary') : variant;
  return { mode, fromServer };
}

/**
 * Resuelve el modo efectivo del drawer; en `responsive` escucha el breakpoint (sin `matchMedia`: `temporary`).
 * Úsalo también fuera del Drawer para sincronizar la AppBar (ocultar el botón de menú en `permanent`).
 * @param {DrawerVariant} [variant='temporary'] Variante declarada.
 * @param {DrawerBreakpoint} [breakpoint='md'] Breakpoint de la variante responsive.
 * @returns {DrawerMode} Modo efectivo.
 */
export function useDrawerMode(variant: DrawerVariant = 'temporary', breakpoint: DrawerBreakpoint = 'md'): DrawerMode {
  return useDrawerModeState(variant, breakpoint).mode;
}
