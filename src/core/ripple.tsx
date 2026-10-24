'use client';
/**
 * Ripple: efecto de material que se propaga desde el punto de contacto (patrón TouchRipple de MUI).
 * Port de `core/ripple.js`: mismo DOM, tamaño, duración mínima y retirada.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AnimationEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { prefersReducedMotion } from './dom';

/** Duración de la animación de entrada (`DURATION` en TouchRipple de MUI). */
export const RIPPLE_DURATION = 550;
/** Respaldo para retirar el nodo si `animationend` no llega. */
export const RIPPLE_REMOVE_FALLBACK = RIPPLE_DURATION * 2;

interface RippleItem {
  key: number;
  size: number;
  x: number;
  y: number;
  finishing: boolean;
}

/** Opciones de `useRipple`. */
export interface UseRippleOptions {
  /** Desactiva el efecto. */
  disabled?: boolean;
  /** Centra el círculo en el elemento (IconButton, Checkbox...). */
  centered?: boolean;
}

/** Manejadores que se esparcen en el elemento anfitrión. */
export interface RippleHandlers<T extends Element = Element> {
  onPointerDown: (event: ReactPointerEvent<T>) => void;
  onPointerUp: (event: ReactPointerEvent<T>) => void;
  onPointerLeave: (event: ReactPointerEvent<T>) => void;
  onPointerCancel: (event: ReactPointerEvent<T>) => void;
}

/** Resultado de `useRipple`. */
export interface UseRippleResult<T extends Element = Element> {
  /** Manejadores de puntero para el anfitrión. */
  handlers: RippleHandlers<T>;
  /** Contenedor de ripples: renderizar como último hijo del anfitrión. */
  element: ReactNode;
}

/**
 * Gestiona el efecto ripple de un elemento: se inicia en `pointerdown` (botón principal)
 * y termina en `pointerup`, `pointerleave` o `pointercancel`.
 * @param {UseRippleOptions} [options] `disabled` y `centered`.
 * @returns {UseRippleResult} `handlers` para el anfitrión y `element` a renderizar.
 */
export function useRipple<T extends Element = HTMLElement>(options: UseRippleOptions = {}): UseRippleResult<T> {
  const { disabled = false, centered = false } = options;
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const nextKey = useRef(0);
  /** Ripples aún sin programar su salida (con su instante de inicio). */
  const pending = useRef<Array<{ key: number; start: number }>>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const fallbacks = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const config = useRef({ disabled, centered });
  config.current = { disabled, centered };

  useEffect(() => {
    const active = timers.current;
    const fallbackMap = fallbacks.current;
    return () => {
      active.forEach(clearTimeout);
      active.clear();
      fallbackMap.forEach(clearTimeout);
      fallbackMap.clear();
      pending.current = [];
    };
  }, []);

  const api = useMemo(() => {
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        timers.current.delete(id);
        fn();
      }, delay);
      timers.current.add(id);
      return id;
    };

    const remove = (key: number) => {
      const fallback = fallbacks.current.get(key);
      if (fallback !== undefined) {
        clearTimeout(fallback);
        timers.current.delete(fallback);
        fallbacks.current.delete(key);
      }
      setRipples((prev) => (prev.some((r) => r.key === key) ? prev.filter((r) => r.key !== key) : prev));
    };

    const finish = (key: number) => {
      setRipples((prev) => prev.map((r) => (r.key === key ? { ...r, finishing: true } : r)));
      fallbacks.current.set(key, schedule(() => remove(key), RIPPLE_REMOVE_FALLBACK));
    };

    /** Programa la salida respetando la duración mínima de entrada. */
    const end = () => {
      const list = pending.current;
      if (!list.length) return;
      pending.current = [];
      const now = performance.now();
      list.forEach(({ key, start }) => {
        schedule(() => finish(key), Math.max(RIPPLE_DURATION - (now - start), 0));
      });
    };

    const start = (event: ReactPointerEvent<T>) => {
      if (config.current.disabled || event.button !== 0 || prefersReducedMotion()) return;
      const host = event.currentTarget as unknown as Element;
      const rect = host.getBoundingClientRect();
      const x = config.current.centered ? rect.width / 2 : (event.clientX || 0) - rect.left;
      const y = config.current.centered ? rect.height / 2 : (event.clientY || 0) - rect.top;
      const sizeX = Math.max(Math.abs(rect.width - x), x) * 2 + 2;
      const sizeY = Math.max(Math.abs(rect.height - y), y) * 2 + 2;
      const size = Math.sqrt(sizeX * sizeX + sizeY * sizeY);
      const key = (nextKey.current += 1);
      pending.current.push({ key, start: performance.now() });
      setRipples((prev) => [...prev, { key, size, x, y, finishing: false }]);
    };

    const handlers: RippleHandlers<T> = {
      onPointerDown: start,
      onPointerUp: end,
      onPointerLeave: end,
      onPointerCancel: end,
    };
    return { handlers, remove };
  }, []);

  const element = ripples.length ? (
    <span className="mtx-ripple-container">
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className={ripple.finishing ? 'mtx-ripple mtx-ripple--finishing' : 'mtx-ripple'}
          style={{
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            left: `${ripple.x - ripple.size / 2}px`,
            top: `${ripple.y - ripple.size / 2}px`,
          }}
          onAnimationEnd={
            ripple.finishing
              ? (event: AnimationEvent<HTMLSpanElement>) => {
                  if (event.target === event.currentTarget) api.remove(ripple.key);
                }
              : undefined
          }
        />
      ))}
    </span>
  ) : null;

  return { handlers: api.handlers, element };
}
