/**
 * Utilidades DOM compartidas por Menu, MenuList y Submenu.
 */

let lastModality: 'keyboard' | 'pointer' = 'pointer';
let modalityInstalled = false;

/**
 * Instala (una vez) el seguimiento de la última modalidad de entrada (teclado o puntero).
 */
export function installModality(): void {
  if (modalityInstalled || typeof document === 'undefined') return;
  modalityInstalled = true;
  document.addEventListener(
    'keydown',
    (event) => {
      if (!event.metaKey && !event.altKey && !event.ctrlKey) lastModality = 'keyboard';
    },
    true,
  );
  const pointer = () => {
    lastModality = 'pointer';
  };
  document.addEventListener('pointerdown', pointer, true);
  document.addEventListener('mousedown', pointer, true);
}

/**
 * Indica si la última interacción fue con el teclado.
 * @returns {boolean} `true` tras un `keydown`.
 */
export function isKeyboardModality(): boolean {
  return lastModality === 'keyboard';
}

/**
 * Ítems de una lista de menú (sin los de listas anidadas en el DOM).
 * @param {HTMLElement} list Elemento `role="menu"`.
 * @returns {HTMLElement[]} Ítems `.mtx-menu-item`.
 */
export function getMenuItems(list: HTMLElement): HTMLElement[] {
  return Array.from(list.querySelectorAll<HTMLElement>('.mtx-menu-item')).filter(
    (item) => item.closest('[role="menu"]') === list,
  );
}

/**
 * Ítems navegables: sin deshabilitar ni ocultos.
 * @param {HTMLElement} list Elemento `role="menu"`.
 * @returns {HTMLElement[]} Ítems habilitados.
 */
export function getEnabledItems(list: HTMLElement): HTMLElement[] {
  return getMenuItems(list).filter(
    (item) =>
      !item.classList.contains('mtx-menu-item--disabled') && item.getAttribute('aria-disabled') !== 'true' && !item.hidden,
  );
}

/**
 * Enfoca el ítem seleccionado, el primero habilitado o la propia lista.
 * @param {HTMLElement} list Elemento `role="menu"`.
 * @param {boolean} focusItem Prioriza un ítem sobre el contenedor.
 */
export function focusInitial(list: HTMLElement, focusItem: boolean): void {
  if (!focusItem) {
    list.focus({ preventScroll: true });
    return;
  }
  const enabled = getEnabledItems(list);
  const selected = enabled.find((item) => item.classList.contains('mtx-menu-item--selected'));
  (selected || enabled[0] || list).focus({ preventScroll: true });
}

/**
 * Texto visible de un ítem para la búsqueda por tipeo (omite iconos `aria-hidden`).
 * @param {Node} node Nodo.
 * @returns {string} Texto.
 */
export function getItemText(node: Node): string {
  if (node.nodeType === 3) return node.textContent || '';
  if (node.nodeType !== 1) return '';
  const el = node as Element;
  if (el.getAttribute('aria-hidden') === 'true') return '';
  return Array.from(el.childNodes).map(getItemText).join('');
}
