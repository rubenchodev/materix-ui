'use client';
/**
 * Hooks utilitarios genéricos del núcleo (estilo MUI).
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Ref, RefCallback } from 'react';
import { isDev } from './dom';

/**
 * Serializa un valor para compararlo por contenido; los no serializables (ciclos, funciones) caen a `String`.
 * @param {unknown} value Valor.
 * @returns {string} Representación estable.
 */
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value ?? null) ?? String(value);
  } catch {
    return String(value);
  }
}

/** `useLayoutEffect` en el cliente y `useEffect` en el servidor (sin avisos SSR). */
export const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Devuelve una función estable que siempre invoca la última versión de `fn`.
 * @param {Function} fn Callback.
 * @returns {Function} Callback de identidad estable.
 */
export function useEventCallback<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R {
  const ref = useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: Args) => ref.current(...args), []);
}

/**
 * Asigna un valor a una ref de objeto o de función.
 * @param {Ref} ref Ref destino.
 * @param {*} value Valor.
 */
export function setRef<T>(ref: Ref<T> | undefined | null, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * Combina varias refs en una callback ref (o `null` si todas son nulas).
 * @param {...Ref} refs Refs a combinar.
 * @returns {RefCallback|null} Ref combinada.
 */
export function useForkRef<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> | null {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (instance: T | null) => {
      refs.forEach((ref) => setRef(ref, instance));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

/** Opciones de `useControlled`. */
export interface UseControlledOptions<T> {
  /** Valor controlado (`undefined` = no controlado). */
  controlled: T | undefined;
  /** Valor inicial en modo no controlado. */
  default: T;
  /** Nombre del componente (para avisos). */
  name: string;
  /** Nombre de la prop controlada (para avisos). */
  state?: string;
}

/**
 * Gestiona una prop que puede ser controlada o no controlada (patrón MUI).
 * @param {UseControlledOptions} options Valor controlado, por defecto y nombres.
 * @returns {[*, Function]} Valor actual y setter que solo actúa en modo no controlado.
 */
export function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  state = 'value',
}: UseControlledOptions<T>): [T, (newValue: T) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState<T>(defaultProp);
  const value = isControlled ? (controlled as T) : valueState;

  const { current: defaultValue } = useRef(defaultProp);
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          `Materix: A component is changing the ${isControlled ? '' : 'un'}controlled ${state} state of ${name} to be ${
            isControlled ? 'un' : ''
          }controlled. Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`,
        );
      }
    }, [state, name, controlled, isControlled]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // Por contenido (como MUI): un default objeto/array recreado en cada render no es un cambio real.
      if (!isControlled && !Object.is(defaultValue, defaultProp) && safeStringify(defaultValue) !== safeStringify(defaultProp)) {
        console.error(
          `Materix: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeStringify(defaultProp)]);
  }

  const setValueIfUncontrolled = useCallback(
    (newValue: T) => {
      if (!isControlled) setValue(newValue);
    },
    [isControlled],
  );
  return [value, setValueIfUncontrolled];
}

/**
 * Indica de forma reactiva si el usuario prefiere reducir el movimiento.
 * Devuelve `false` en el servidor y en el primer render.
 * @returns {boolean} `true` con `prefers-reduced-motion: reduce`.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(Boolean(query.matches));
    sync();
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', sync);
      return () => query.removeEventListener('change', sync);
    }
    query.addListener?.(sync);
    return () => query.removeListener?.(sync);
  }, []);
  return reduced;
}
