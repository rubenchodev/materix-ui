'use client';
/**
 * Pila común de capas flotantes y modales (port de `core/layers.js`).
 *
 * Un único listener de `keydown` en `document` entrega Escape SOLO a la capa superior.
 * Prioridades: `tooltip` (2, transitoria) recibe Escape primero; `snackbar` (0) solo
 * sin otras capas; `modal` y `popup` comparten la prioridad 1 (gana la última abierta).
 */
import { useMemo, useRef } from 'react';
import { resolveTarget } from './dom';
import type { ElementTarget } from './dom';
import { useEnhancedEffect } from './hooks';

/** Tipo de capa. */
export type LayerKind = 'modal' | 'popup' | 'tooltip' | 'snackbar';

/** Nodos de una capa: elemento, ref, lista de ellos o función que los devuelve. */
export type LayerNodes = ElementTarget<Node> | Array<ElementTarget<Node>> | (() => Node | Node[] | null | undefined);

/** Nodo que debe quedar por encima de las capas abiertas (z-index escalonado). */
export interface LayerStackItem {
  node: ElementTarget<HTMLElement>;
  offset?: number;
}

/** Opciones de registro de una capa. */
export interface LayerOptions {
  kind?: LayerKind;
  /** Acción al recibir Escape siendo la capa superior (`null` consume Escape sin acción). */
  onEscape?: ((event: KeyboardEvent) => void) | null;
  nodes?: LayerNodes;
  stack?: LayerStackItem[] | (() => LayerStackItem[]);
}

interface LayerEntry {
  owner: object;
  kind: LayerKind;
  priority: number;
  transient: boolean;
  order: number;
  onEscape: ((event: KeyboardEvent) => void) | null;
  nodes: () => Node[];
}

const PRIORITY: Record<LayerKind, number> = { snackbar: 0, modal: 1, popup: 1, tooltip: 2 };
const HANDLED = '__mtxEscapeHandled';

const layers: LayerEntry[] = [];
const zClaims = new Map<HTMLElement, { original: string; claims: Map<object, number> }>();
let sequence = 0;
let installed = false;

/** Normaliza `nodes` a un proveedor de nodos resueltos. */
function toNodeProvider(nodes: LayerNodes | undefined): () => Node[] {
  return () => {
    const raw = typeof nodes === 'function' ? (nodes as () => unknown)() : nodes;
    const list = Array.isArray(raw) ? raw : [raw];
    return list.map((item) => resolveTarget(item as ElementTarget<Node>)).filter(Boolean) as Node[];
  };
}

function find(owner: object): LayerEntry | undefined {
  return layers.find((entry) => entry.owner === owner);
}

function sorted(list: LayerEntry[]): LayerEntry[] {
  return list.slice().sort((a, b) => a.priority - b.priority || a.order - b.order);
}

/** Retira capas cuyos nodos ya no están en el documento. */
function pruneDetached(): void {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const nodes = layers[i].nodes();
    if (nodes.length && nodes.every((node) => !node.isConnected)) {
      const [entry] = layers.splice(i, 1);
      releaseZ(entry.owner);
    }
  }
}

function topEntry(includeTransient: boolean): LayerEntry | null {
  pruneDetached();
  const list = sorted(includeTransient ? layers : layers.filter((entry) => !entry.transient));
  return list[list.length - 1] || null;
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented || isEscapeHandled(event)) return;
  const top = topEntry(true);
  if (!top) return;
  markEscapeHandled(event);
  if (typeof top.onEscape === 'function') top.onEscape(event);
}

function install(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('keydown', handleKeydown);
}

function applyZ(node: HTMLElement): void {
  const record = zClaims.get(node);
  if (!record) return;
  if (!record.claims.size) {
    node.style.zIndex = record.original;
    zClaims.delete(node);
    return;
  }
  const value = Math.max(...record.claims.values());
  node.style.zIndex = `calc(var(--mtx-z-index-modal, 1300) + ${value})`;
}

function claimZ(owner: object, node: HTMLElement, value: number): void {
  if (!node.style) return;
  let record = zClaims.get(node);
  if (!record) {
    record = { original: node.style.zIndex, claims: new Map() };
    zClaims.set(node, record);
  }
  record.claims.set(owner, value);
  applyZ(node);
}

function releaseZ(owner: object): void {
  Array.from(zClaims.keys()).forEach((node) => {
    const record = zClaims.get(node);
    if (record && record.claims.delete(owner)) applyZ(node);
  });
}

/**
 * Registra (o sube a la cima) una capa abierta.
 * @param {object} owner Propietario (identidad de la capa).
 * @param {LayerOptions} [options] Tipo, Escape, nodos y nodos a apilar.
 * @returns {number} Profundidad: capas modales/emergentes abiertas por debajo.
 */
export function pushLayer(owner: object, { kind = 'popup', onEscape = null, nodes, stack }: LayerOptions = {}): number {
  if (!owner) return 0;
  install();
  removeLayer(owner);
  pruneDetached();
  const depth = layers.filter((entry) => entry.priority === 1).length;
  if (depth > 0 && stack && PRIORITY[kind] !== 2) {
    const list = (typeof stack === 'function' ? stack() : stack) || [];
    list.forEach((item) => {
      const node = item && resolveTarget(item.node);
      if (node) claimZ(owner, node, 2 * depth + (item.offset || 0));
    });
  }
  layers.push({
    owner,
    kind,
    priority: PRIORITY[kind] ?? 1,
    transient: kind === 'tooltip',
    order: ++sequence,
    onEscape,
    nodes: toNodeProvider(nodes),
  });
  return depth;
}

/**
 * Retira la capa de un propietario (idempotente).
 * @param {object} owner Propietario.
 */
export function removeLayer(owner: object): void {
  const index = layers.findIndex((entry) => entry.owner === owner);
  if (index >= 0) layers.splice(index, 1);
  releaseZ(owner);
}

/**
 * Indica si el propietario es la capa superior (los tooltips solo cuentan entre tooltips).
 * @param {object} owner Propietario.
 * @returns {boolean} `true` si es la superior.
 */
export function isTopLayer(owner: object): boolean {
  const entry = find(owner);
  if (!entry) return false;
  const top = topEntry(entry.transient);
  return Boolean(top && top.owner === owner);
}

/**
 * Propietario de la capa superior (incluye tooltips).
 * @returns {object|null} Propietario o `null`.
 */
export function getTopLayer(): object | null {
  const top = topEntry(true);
  return top ? top.owner : null;
}

/**
 * Indica si el propietario tiene una capa registrada.
 * @param {object} owner Propietario.
 * @returns {boolean} `true` si está registrada.
 */
export function hasLayer(owner: object): boolean {
  return Boolean(find(owner));
}

/**
 * Número de capas abiertas.
 * @param {boolean} [includeTransient=true] Cuenta tooltips.
 * @returns {number} Capas abiertas.
 */
export function layerCount(includeTransient = true): number {
  return includeTransient ? layers.length : layers.filter((entry) => !entry.transient).length;
}

/**
 * Indica si un nodo pertenece a una capa abierta después de la del propietario (no es "clic fuera").
 * @param {object} owner Propietario de referencia.
 * @param {Node|null} node Nodo del evento.
 * @returns {boolean} `true` si el nodo está en una capa superior.
 */
export function isInUpperLayer(owner: object, node: Node | EventTarget | null | undefined): boolean {
  if (!node || typeof node !== 'object') return false;
  const entry = find(owner);
  const since = entry ? entry.order : -Infinity;
  return layers.some(
    (other) =>
      other !== entry &&
      other.order > since &&
      other.kind !== 'snackbar' &&
      other.nodes().some((root) => root === node || (typeof root.contains === 'function' && root.contains(node as Node))),
  );
}

/**
 * Marca un Escape como gestionado: ninguna otra capa lo procesará.
 * @param {KeyboardEvent} event Evento de teclado (nativo o sintético de React).
 */
export function markEscapeHandled(event: KeyboardEvent | { nativeEvent: KeyboardEvent } | null | undefined): void {
  if (!event) return;
  const native = ('nativeEvent' in event ? event.nativeEvent : event) as KeyboardEvent;
  try {
    (native as unknown as Record<string, unknown>)[HANDLED] = true;
  } catch {
    /* evento congelado */
  }
  if (native.cancelable) native.preventDefault();
}

/**
 * Indica si un Escape ya fue gestionado por una capa.
 * @param {KeyboardEvent} event Evento de teclado (nativo o sintético).
 * @returns {boolean} `true` si se gestionó.
 */
export function isEscapeHandled(event: KeyboardEvent | { nativeEvent: KeyboardEvent } | null | undefined): boolean {
  if (!event) return false;
  const native = ('nativeEvent' in event ? event.nativeEvent : event) as unknown as Record<string, unknown>;
  return Boolean(native[HANDLED]);
}

/** Opciones de `useLayer`. */
export interface UseLayerOptions {
  /** Capa abierta (registrada) o cerrada. */
  open: boolean;
  kind?: LayerKind;
  /** Acción de Escape siendo la capa superior; sin ella Escape se consume sin acción. */
  onEscape?: ((event: KeyboardEvent) => void) | null;
  nodes?: LayerNodes;
  stack?: LayerOptions['stack'];
}

/** Resultado de `useLayer`. */
export interface UseLayerResult {
  /** Identidad de la capa en la pila. */
  owner: object;
  /** Indica si es la capa superior. */
  isTopLayer: () => boolean;
  /** Indica si un nodo pertenece a una capa abierta encima de esta. */
  isInUpperLayer: (node: Node | EventTarget | null | undefined) => boolean;
  /** Profundidad devuelta al registrarse (capas modales/emergentes debajo). */
  getDepth: () => number;
}

/**
 * Registra la capa en la pila global mientras `open` sea `true`.
 * @param {UseLayerOptions} options Estado, tipo, Escape y nodos.
 * @returns {UseLayerResult} Consultas sobre la capa.
 */
export function useLayer({ open, kind = 'popup', onEscape, nodes, stack }: UseLayerOptions): UseLayerResult {
  const owner = useRef<object>({}).current;
  const depth = useRef(0);
  const latest = useRef({ onEscape, nodes, stack });
  latest.current = { onEscape, nodes, stack };

  useEnhancedEffect(() => {
    if (!open) return undefined;
    depth.current = pushLayer(owner, {
      kind,
      onEscape: (event) => latest.current.onEscape?.(event),
      nodes: () => toNodeProvider(latest.current.nodes)(),
      stack: () => {
        const s = latest.current.stack;
        return (typeof s === 'function' ? s() : s) || [];
      },
    });
    return () => {
      removeLayer(owner);
      depth.current = 0;
    };
  }, [open, kind, owner]);

  return useMemo(
    () => ({
      owner,
      isTopLayer: () => isTopLayer(owner),
      isInUpperLayer: (node) => isInUpperLayer(owner, node),
      getDepth: () => depth.current,
    }),
    [owner],
  );
}
