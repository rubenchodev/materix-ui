'use client';
/**
 * Gestión del foco (port de `core/focus-manager.js`) y hook `useFocusTrap`.
 */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { resolveTarget } from './dom';
import type { ElementTarget } from './dom';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Devuelve los descendientes enfocables y visibles de un contenedor.
 * @param {Element|null} container Contenedor.
 * @returns {HTMLElement[]} Elementos enfocables.
 */
export function getFocusable(container: Element | null | undefined): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0,
  );
}

/**
 * Resuelve el objetivo marcado: él mismo si es enfocable o su primer descendiente enfocable.
 * @param {HTMLElement|null} element Elemento marcado.
 * @returns {HTMLElement|null} Elemento a enfocar.
 */
export function resolveFocusTarget(element: HTMLElement | null | undefined): HTMLElement | null {
  if (!element) return null;
  if (element.matches(FOCUSABLE) || element.hasAttribute('tabindex')) return element;
  return getFocusable(element)[0] || element.querySelector<HTMLElement>(FOCUSABLE) || null;
}

/**
 * Enfoca el objetivo explícito, el primer control o el propio contenedor.
 * @param {HTMLElement} container Contenedor.
 * @param {HTMLElement|null} [explicit] Objetivo preferido.
 */
export function focusFirst(container: HTMLElement, explicit?: HTMLElement | null): void {
  const target = resolveFocusTarget(explicit) || getFocusable(container)[0] || container;
  if (!target.hasAttribute('tabindex') && target === container) target.tabIndex = -1;
  target.focus();
}

/** Indica si un elemento entra en el orden de tabulación. */
function isTabbable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.closest('[inert]')) return false;
  const view = element.ownerDocument.defaultView;
  if (view && view.getComputedStyle(element).visibility === 'hidden') return false;
  const input = element as HTMLInputElement;
  if (input.type === 'radio' && input.name && !input.checked) {
    const scope: ParentNode = input.form || element.ownerDocument;
    const group = Array.from(scope.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked'));
    if (group.some((radio) => radio.name === input.name && radio !== input)) return false;
  }
  return true;
}

/**
 * Devuelve los descendientes en el orden de tabulación del contenedor.
 * @param {Element} container Contenedor.
 * @returns {HTMLElement[]} Elementos tabulables.
 */
export function getTabbable(container: Element): HTMLElement[] {
  const seenRadioGroups = new Set<string>();
  return getFocusable(container).filter((element) => {
    if (!isTabbable(element)) return false;
    const input = element as HTMLInputElement;
    // Un grupo de radios sin selección es una sola parada (la primera).
    if (input.type === 'radio' && input.name && !input.checked) {
      if (seenRadioGroups.has(input.name)) return false;
      seenRadioGroups.add(input.name);
    }
    return true;
  });
}

/**
 * Mantiene Tab/Shift+Tab dentro del contenedor moviendo el foco de forma cíclica.
 * @param {KeyboardEvent} event Evento `keydown` de Tab.
 * @param {HTMLElement} container Contenedor que atrapa el foco.
 */
export function trapTab(event: KeyboardEvent, container: HTMLElement): void {
  event.preventDefault();
  const tabbable = getTabbable(container);
  if (!tabbable.length) {
    focusFirst(container);
    return;
  }
  const active = container.ownerDocument.activeElement;
  let index = tabbable.indexOf(active as HTMLElement);
  if (index === -1 && active && container.contains(active)) {
    // Foco en un nodo no tabulable (p. ej. el propio panel): parte de su posición en el DOM.
    const following = tabbable.findIndex(
      (node) => active.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
    index = following === -1 ? tabbable.length : following;
    if (!event.shiftKey) index -= 1;
  }
  let next: number;
  if (event.shiftKey) next = index <= 0 ? tabbable.length - 1 : index - 1;
  else next = index === -1 || index >= tabbable.length - 1 ? 0 : index + 1;
  tabbable[next].focus();
}

/** Opciones de `useFocusTrap`. */
export interface UseFocusTrapOptions {
  /** Activa la trampa. */
  active: boolean;
  /** Elemento a enfocar al activarse (si no, el primer enfocable o el contenedor). */
  initialFocus?: ElementTarget<HTMLElement>;
  /** Devuelve el foco al elemento previo al desactivarse (`true` por defecto). */
  restoreFocus?: boolean;
  /** Reenfoca el contenedor si el foco sale de él (`true` por defecto). */
  enforceFocus?: boolean;
  /** Nodos que no se consideran "fuera" (p. ej. capas abiertas encima). */
  ignore?: (node: Node | null) => boolean;
}

/** Trampas activas: solo la última recibe Tab y fuerza el foco. */
const traps: object[] = [];

/**
 * Atrapa el foco dentro de `containerRef` mientras `active` sea `true`.
 * @param {RefObject<HTMLElement>} containerRef Contenedor.
 * @param {UseFocusTrapOptions} options Estado y foco inicial/de retorno.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, options: UseFocusTrapOptions): void {
  const { active, restoreFocus = true } = options;
  const latest = useRef(options);
  latest.current = options;
  const token = useRef<object>({}).current;

  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;
    const doc = container.ownerDocument;
    const previous = doc.activeElement as HTMLElement | null;
    traps.push(token);
    const isTop = () => traps[traps.length - 1] === token;
    const ignored = (node: Node | null) => Boolean(latest.current.ignore && latest.current.ignore(node));
    const initial = () => resolveTarget(latest.current.initialFocus) || null;

    if (!container.contains(doc.activeElement)) focusFirst(container, initial());

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.defaultPrevented || !isTop()) return;
      if (ignored(doc.activeElement)) return;
      trapTab(event, container);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (latest.current.enforceFocus === false || !isTop()) return;
      const target = event.target as Node | null;
      if (container.contains(target) || ignored(target)) return;
      focusFirst(container, initial());
    };
    doc.addEventListener('keydown', onKeydown);
    doc.addEventListener('focusin', onFocusIn);

    return () => {
      doc.removeEventListener('keydown', onKeydown);
      doc.removeEventListener('focusin', onFocusIn);
      const index = traps.lastIndexOf(token);
      if (index >= 0) traps.splice(index, 1);
      if (restoreFocus && previous && previous.isConnected && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, [active, restoreFocus, containerRef, token]);
}
