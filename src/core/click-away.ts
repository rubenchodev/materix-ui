'use client';
/**
 * Detección de "clic fuera" (port de `core/click-away-listener.js`, equivalente a `ClickAwayListener` de MUI).
 */
import { useEffect } from 'react';
import { resolveTarget } from './dom';
import type { ElementTarget } from './dom';
import { useEventCallback } from './hooks';

/** Ventana (ms) en la que un `mousedown` tras un `touchstart` se considera sintético. */
export const SYNTHETIC_MOUSE_WINDOW = 1000;

/** Nodos que cuentan como "dentro": uno, varios o un proveedor resuelto en cada evento. */
export type ClickAwayTargets =
  | ElementTarget<Node>
  | Array<ElementTarget<Node>>
  | (() => ElementTarget<Node> | Array<ElementTarget<Node>>);

function contains(targets: ClickAwayTargets, target: Node | null): boolean {
  if (!target) return false;
  const raw = typeof targets === 'function' ? (targets as () => unknown)() : targets;
  const list = (Array.isArray(raw) ? raw : [raw]) as Array<ElementTarget<Node>>;
  return list.some((item) => {
    const node = resolveTarget(item);
    return Boolean(node && typeof node.contains === 'function' && node.contains(target));
  });
}

/**
 * Suscribe un manejador de "clic fuera" (`mousedown`/`touchstart` en captura sobre el documento).
 * @param {ClickAwayTargets} targets Nodos de referencia.
 * @param {Function} onAway Callback al interactuar fuera.
 * @param {Document} [doc=document] Documento a escuchar.
 * @returns {Function} Limpieza.
 */
export function onClickAway(
  targets: ClickAwayTargets,
  onAway: (event: MouseEvent | TouchEvent) => void,
  doc: Document = document,
): () => void {
  /** Último `touchstart`: el `mousedown` sintético posterior se ignora. */
  let lastTouch = -Infinity;
  const handle = (event: MouseEvent | TouchEvent) => {
    const now = Date.now();
    if (event.type === 'touchstart') lastTouch = now;
    else if (now - lastTouch < SYNTHETIC_MOUSE_WINDOW) return;
    if (contains(targets, event.target as Node | null)) return;
    onAway(event);
  };
  doc.addEventListener('mousedown', handle, true);
  doc.addEventListener('touchstart', handle, true);
  return () => {
    doc.removeEventListener('mousedown', handle, true);
    doc.removeEventListener('touchstart', handle, true);
  };
}

/** Opciones de `useClickAway`. */
export interface UseClickAwayOptions {
  /** Activa la escucha (`true` por defecto). */
  enabled?: boolean;
}

/**
 * Llama a `handler` ante `mousedown`/`touchstart` fuera de todos los nodos indicados.
 * Ignora el `mousedown` sintético que sigue a un `touchstart` durante 1 s.
 * @param {ClickAwayTargets} refs Nodos (elementos o refs) que cuentan como "dentro".
 * @param {Function} handler Callback.
 * @param {UseClickAwayOptions} [options] `enabled`.
 */
export function useClickAway(
  refs: ClickAwayTargets,
  handler: (event: MouseEvent | TouchEvent) => void,
  { enabled = true }: UseClickAwayOptions = {},
): void {
  const onAway = useEventCallback(handler);
  const getRefs = useEventCallback(() => refs);
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;
    return onClickAway(() => {
      const current = getRefs();
      return (typeof current === 'function' ? current() : current) as Array<ElementTarget<Node>>;
    }, onAway);
  }, [enabled, getRefs, onAway]);
}
