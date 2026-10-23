const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Devuelve descendientes enfocables y visibles de un contenedor. */
export function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter((element) => (
    !element.hidden
    && element.getAttribute('aria-hidden') !== 'true'
    && element.getClientRects().length > 0
  ));
}

/**
 * Resuelve el objetivo marcado: él mismo si es enfocable o su primer descendiente
 * enfocable (p. ej. wrapper generado por TextField alrededor del input).
 * @param {HTMLElement|null} element Elemento marcado con `data-*-autofocus`.
 * @returns {HTMLElement|null} Elemento a enfocar o `null`.
 */
export function resolveFocusTarget(element) {
  if (!element) return null;
  if (element.matches(FOCUSABLE) || element.hasAttribute('tabindex')) return element;
  return getFocusable(element)[0] || element.querySelector(FOCUSABLE) || null;
}

/** Enfoca el objetivo explícito, el primer control o el contenedor. */
export function focusFirst(container, explicit) {
  const target = resolveFocusTarget(explicit) || getFocusable(container)[0] || container;
  if (!target.hasAttribute('tabindex') && target === container) target.tabIndex = -1;
  target.focus();
}

/**
 * Indica si un elemento entra en el orden de tabulación (excluye `tabindex="-1"`,
 * `inert`, `visibility: hidden` y radios no activos de un grupo con selección).
 * @param {HTMLElement} element Candidato devuelto por `getFocusable`.
 * @returns {boolean} `true` si Tab debe detenerse en él.
 */
function isTabbable(element) {
  if (element.tabIndex < 0) return false;
  if (element.closest('[inert]')) return false;
  const view = element.ownerDocument.defaultView;
  if (view && view.getComputedStyle(element).visibility === 'hidden') return false;
  if (element.type === 'radio' && element.name && !element.checked) {
    const scope = element.form || element.ownerDocument;
    const group = Array.from(scope.querySelectorAll('input[type="radio"]:checked'));
    if (group.some((radio) => radio.name === element.name && radio !== element)) return false;
  }
  return true;
}

/**
 * Devuelve los descendientes en el orden de tabulación del contenedor.
 * @param {HTMLElement} container Contenedor.
 * @returns {HTMLElement[]} Elementos tabulables.
 */
export function getTabbable(container) {
  const seenRadioGroups = new Set();
  return getFocusable(container).filter((element) => {
    if (!isTabbable(element)) return false;
    // Un grupo de radios sin selección es una sola parada (la primera).
    if (element.type === 'radio' && element.name && !element.checked) {
      if (seenRadioGroups.has(element.name)) return false;
      seenRadioGroups.add(element.name);
    }
    return true;
  });
}

/**
 * Mantiene Tab dentro del contenedor. Intercepta siempre Tab/Shift+Tab y mueve el
 * foco explícitamente: WebKit omite los enlaces al tabular por defecto y su orden
 * nativo podría sacar el foco del contenedor.
 * @param {KeyboardEvent} event Evento `keydown` de Tab.
 * @param {HTMLElement} container Contenedor que atrapa el foco.
 */
export function trapTab(event, container) {
  event.preventDefault();
  const tabbable = getTabbable(container);
  if (!tabbable.length) {
    focusFirst(container);
    return;
  }
  const active = document.activeElement;
  let index = tabbable.indexOf(active);
  if (index === -1 && container.contains(active)) {
    // Foco en un nodo no tabulable (p. ej. el propio panel): parte de su posición en el DOM.
    const following = tabbable.findIndex((node) => (
      active.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING
    ));
    index = following === -1 ? tabbable.length : following;
    if (!event.shiftKey) index -= 1;
  }
  let next;
  if (event.shiftKey) {
    next = index <= 0 ? tabbable.length - 1 : index - 1;
  } else {
    next = index === -1 || index >= tabbable.length - 1 ? 0 : index + 1;
  }
  tabbable[next].focus();
}
