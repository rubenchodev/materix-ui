/* Gestor compartido para overlays modales de Materix UI. */
const stack = [];
let previousOverflow = '';
/** Indica si el bloqueo de scroll actual lo aplicó este gestor. */
let locked = false;
/** @type {MutationObserver|null} Vigila el documento mientras hay modales para liberar los eliminados sin cerrar. */
let observer = null;

/**
 * Indica si un modal registrado ya no está en el documento (eliminado sin `destroy()`).
 *
 * @param {*} element Elemento registrado.
 * @returns {boolean} `true` si es un nodo desconectado.
 */
function isDetached(element) {
  return Boolean(element && typeof element === 'object' && element.isConnected === false);
}

/** Bloquea el scroll del `body` guardando el valor del autor. */
function lockScroll() {
  if (locked || typeof document === 'undefined' || !document.body) return;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  locked = true;
  watchDetached();
}

/** Restaura el `overflow` del autor si el bloqueo lo aplicó este gestor. */
function unlockScroll() {
  if (!locked) return;
  locked = false;
  stopWatching();
  if (typeof document === 'undefined' || !document.body) return;
  // Si el autor cambió el overflow mientras el modal estaba abierto, se respeta su valor.
  if (document.body.style.overflow === 'hidden') document.body.style.overflow = previousOverflow;
  previousOverflow = '';
}

/**
 * Retira de la pila los modales desconectados y libera el scroll si la pila queda vacía.
 *
 * @param {*} [keep] Elemento que no se purga (el que se está registrando).
 */
function prune(keep) {
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    if (stack[i] !== keep && isDetached(stack[i])) stack.splice(i, 1);
  }
  if (stack.length === 0) unlockScroll();
}

/** Observa el documento para liberar el bloqueo cuando un modal se elimina sin cerrarse. */
function watchDetached() {
  if (observer || typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
  observer = new MutationObserver(() => prune());
  observer.observe(document.documentElement || document, { childList: true, subtree: true });
}

/** Detiene la observación del documento. */
function stopWatching() {
  if (!observer) return;
  observer.disconnect();
  observer = null;
}

/** Registra un modal y bloquea el scroll de la página. */
export function addModal(element) {
  const current = stack.indexOf(element);
  if (current >= 0) stack.splice(current, 1);
  prune(element);
  stack.push(element);
  lockScroll();
}

/** Retira un modal y restaura el scroll cuando se cierra el último. Sin efecto si no estaba registrado. */
export function removeModal(element) {
  const index = stack.lastIndexOf(element);
  if (index >= 0) stack.splice(index, 1);
  prune();
}

/** Indica si el elemento es el overlay modal superior. */
export function isTopModal(element) {
  prune();
  return stack[stack.length - 1] === element;
}
/** Indica si hay algún overlay modal abierto. */
export function hasOpenModal() {
  prune();
  return stack.length > 0;
}
