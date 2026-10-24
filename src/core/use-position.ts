'use client';
/**
 * Hook de posicionamiento de superficies flotantes sobre `computePosition`/`positionDropdown`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveTarget } from './dom';
import type { ElementTarget } from './dom';
import { useEnhancedEffect } from './hooks';
import { autoUpdate, computePosition, positionDropdown } from './position';
import type { Placement, PositionAnchor, Side } from './position';

/** Opciones del modo desplegable (`positionDropdown`). */
export interface UsePositionDropdownOptions {
  /** Iguala el ancho mínimo al del ancla. */
  matchWidth?: boolean;
  /** Elemento que hace scroll (mide el alto natural). */
  content?: ElementTarget<HTMLElement>;
  /** Conserva el lado elegido al recolocar por scroll/resize (`true` por defecto, como vanilla). */
  lockSide?: boolean;
}

/** Opciones de `usePosition`. */
export interface UsePositionOptions {
  /** Posiciona solo mientras está abierto. */
  open: boolean;
  placement?: Placement | string;
  /** Separación con el ancla (8 por defecto; 4 en modo desplegable). */
  offset?: number;
  /** Margen mínimo con el viewport (8 por defecto). */
  padding?: number;
  /** `fixed` (por defecto) o `absolute` (suma el scroll de la ventana). */
  strategy?: 'fixed' | 'absolute';
  flip?: boolean;
  shift?: boolean;
  /** Fuerza RTL (por defecto se detecta en el ancla). */
  rtl?: boolean;
  /** Recoloca ante scroll, resize y cambios de tamaño (`true` por defecto). */
  autoUpdate?: boolean;
  /** Activa el modo desplegable (Menu, Select): limita el alto al espacio disponible. */
  dropdown?: UsePositionDropdownOptions | boolean;
}

/** Resultado de `usePosition`. */
export interface UsePositionResult {
  /** Colocación final aplicada (`undefined` hasta posicionar). */
  placement: string | undefined;
  /** Lado físico final. */
  side: Side | undefined;
  /** Centro del ancla relativo a la superficie (flecha); no aplica en modo desplegable. */
  arrowOffset: number | undefined;
  /** Recalcula la posición manualmente. */
  update: () => void;
}

interface Subscription {
  anchor: PositionAnchor;
  floating: HTMLElement;
  key: string;
  cleanup: () => void;
}

/**
 * Posiciona `floating` respecto de `anchor` mientras `open` sea `true` y aplica los estilos
 * en un efecto de layout. Con Portal, pasar los elementos desde estado (callback ref) para
 * que el hook se re-ejecute cuando se monten.
 * @param {ElementTarget} anchor Ancla (elemento, ancla virtual o ref).
 * @param {ElementTarget<HTMLElement>} floating Superficie flotante (elemento o ref).
 * @param {UsePositionOptions} options Opciones.
 * @returns {UsePositionResult} Colocación final y `update`.
 */
export function usePosition(
  anchor: ElementTarget<PositionAnchor>,
  floating: ElementTarget<HTMLElement>,
  options: UsePositionOptions,
): UsePositionResult {
  const [state, setState] = useState<{ placement?: string; side?: Side; arrowOffset?: number }>({});
  const latest = useRef({ anchor, floating, options });
  latest.current = { anchor, floating, options };
  const lockedSide = useRef<Side | null>(null);
  const sub = useRef<Subscription | null>(null);

  /** Calcula y aplica la posición; `reposition` conserva el lado en modo desplegable. */
  const run = useCallback((reposition: boolean) => {
    const { options: opts } = latest.current;
    const a = resolveTarget(latest.current.anchor);
    const f = resolveTarget(latest.current.floating);
    if (!opts.open || !a || !f) return;
    let next: { placement: string; side: Side; arrowOffset?: number };
    if (opts.dropdown) {
      const dd = typeof opts.dropdown === 'object' ? opts.dropdown : {};
      const keep = dd.lockSide !== false;
      const result = positionDropdown(a, f, {
        placement: opts.placement || 'bottom-start',
        offset: opts.offset ?? 4,
        padding: opts.padding ?? 8,
        matchWidth: Boolean(dd.matchWidth),
        content: resolveTarget(dd.content),
        rtl: opts.rtl,
        lockSide: reposition && keep ? lockedSide.current : null,
      });
      lockedSide.current = result.side;
      next = { placement: result.placement, side: result.side };
    } else {
      const result = computePosition(a, f, {
        placement: opts.placement || 'bottom',
        offset: opts.offset ?? 8,
        padding: opts.padding ?? 8,
        flip: opts.flip ?? true,
        shift: opts.shift ?? true,
        rtl: opts.rtl,
      });
      const absolute = opts.strategy === 'absolute';
      f.style.position = absolute ? 'absolute' : 'fixed';
      f.style.left = `${result.x + (absolute ? window.scrollX : 0)}px`;
      f.style.top = `${result.y + (absolute ? window.scrollY : 0)}px`;
      f.dataset.placement = result.placement;
      next = { placement: result.placement, side: result.side, arrowOffset: result.arrowOffset };
    }
    setState((prev) =>
      prev.placement === next.placement && prev.side === next.side && prev.arrowOffset === next.arrowOffset
        ? prev
        : next,
    );
  }, []);

  const update = useCallback(() => run(true), [run]);

  // Se evalúa en cada commit: re-suscribe solo si cambian los nodos resueltos o las opciones.
  useEnhancedEffect(() => {
    const { open } = options;
    const a = open ? resolveTarget(anchor) : null;
    const f = open ? resolveTarget(floating) : null;
    const dd = typeof options.dropdown === 'object' ? options.dropdown : {};
    const key = [
      options.placement,
      options.offset,
      options.padding,
      options.strategy,
      options.flip,
      options.shift,
      options.rtl,
      options.autoUpdate,
      Boolean(options.dropdown),
      dd.matchWidth,
      dd.lockSide,
    ].join('|');
    const current = sub.current;
    if (current && current.anchor === a && current.floating === f && current.key === key) return;
    if (current) {
      current.cleanup();
      sub.current = null;
    }
    if (!a || !f) {
      lockedSide.current = null;
      return;
    }
    lockedSide.current = null;
    let cleanup: () => void;
    if (options.autoUpdate === false) {
      run(false);
      cleanup = () => undefined;
    } else {
      let initial = true;
      cleanup = autoUpdate(a, f, () => {
        run(!initial);
        initial = false;
      });
    }
    sub.current = { anchor: a, floating: f, key, cleanup };
  });

  useEffect(
    () => () => {
      sub.current?.cleanup();
      sub.current = null;
    },
    [],
  );

  return { placement: state.placement, side: state.side, arrowOffset: state.arrowOffset, update };
}
