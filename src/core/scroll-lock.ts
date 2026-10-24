'use client';
/**
 * Bloqueo de scroll del `body` compartido por overlays modales (port de `core/modal-manager.js`).
 * Pila global: el scroll se bloquea con el primer modal y se restaura al cerrar el último.
 */
import { useRef } from 'react';
import { useEnhancedEffect } from './hooks';

const stack: object[] = [];
let previousOverflow = '';
let locked = false;

/** Indica si un propietario es un nodo ya desconectado del documento. */
function isDetached(owner: unknown): boolean {
  return Boolean(owner && typeof owner === 'object' && (owner as Node).isConnected === false);
}

function lockScroll(): void {
  if (locked || typeof document === 'undefined' || !document.body) return;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  locked = true;
}

function unlockScroll(): void {
  if (!locked) return;
  locked = false;
  if (typeof document === 'undefined' || !document.body) return;
  // Si el autor cambió el overflow mientras el modal estaba abierto, se respeta su valor.
  if (document.body.style.overflow === 'hidden') document.body.style.overflow = previousOverflow;
  previousOverflow = '';
}

function prune(keep?: object): void {
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    if (stack[i] !== keep && isDetached(stack[i])) stack.splice(i, 1);
  }
  if (stack.length === 0) unlockScroll();
}

/**
 * Registra un modal y bloquea el scroll de la página.
 * @param {object} owner Propietario (elemento o token).
 */
export function addModal(owner: object): void {
  const current = stack.indexOf(owner);
  if (current >= 0) stack.splice(current, 1);
  prune(owner);
  stack.push(owner);
  lockScroll();
}

/**
 * Retira un modal y restaura el scroll al cerrarse el último (sin efecto si no estaba).
 * @param {object} owner Propietario.
 */
export function removeModal(owner: object): void {
  const index = stack.lastIndexOf(owner);
  if (index >= 0) stack.splice(index, 1);
  prune();
}

/**
 * Indica si el propietario es el modal superior.
 * @param {object} owner Propietario.
 * @returns {boolean} `true` si es el último registrado.
 */
export function isTopModal(owner: object): boolean {
  prune();
  return stack[stack.length - 1] === owner;
}

/**
 * Indica si hay algún modal abierto.
 * @returns {boolean} `true` si la pila no está vacía.
 */
export function hasOpenModal(): boolean {
  prune();
  return stack.length > 0;
}

/**
 * Bloquea el scroll del `body` mientras `locked` sea `true`; se libera al desmontar.
 * @param {boolean} locked Activa el bloqueo.
 * @returns {object} Token del modal en la pila (para `isTopModal`).
 */
export function useScrollLock(locked: boolean): object {
  const owner = useRef<object>({}).current;
  useEnhancedEffect(() => {
    if (!locked) return undefined;
    addModal(owner);
    return () => removeModal(owner);
  }, [locked, owner]);
  return owner;
}
