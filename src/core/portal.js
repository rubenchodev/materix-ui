/**
 * Portal: renderiza contenido en un contenedor distinto del documento.
 *
 * Equivalente al `Portal` de MUI. Evita problemas de `overflow`, `z-index`
 * y `transform` del contenedor padre al mantener el contenido cerca del
 * `body`. Devuelve una función de limpieza.
 */

/**
 * Crea un portal y monta `content` en un contenedor.
 *
 * @param {Node} content Nodo a mover al contenedor.
 * @param {HTMLElement} [container=document.body] Contenedor destino.
 * @returns {Function} Función que restaura el nodo a su posición original (antes de su hermano siguiente).
 */
export function createPortal(content, container = document.body) {
  const originalParent = content.parentElement;
  const originalNext = content.nextSibling;

  container.appendChild(content);

  return function destroy() {
    if (content.parentElement === container && originalParent) {
      // Vuelve a su posición original; si el hermano ya no está ahí, al final del padre.
      if (originalNext && originalNext.parentNode === originalParent) {
        originalParent.insertBefore(content, originalNext);
      } else {
        originalParent.appendChild(content);
      }
    } else if (content.parentElement) {
      content.remove();
    }
  };
}

/**
 * Crea (o reutiliza) un contenedor de portal bajo el `body`.
 *
 * @param {string} [id='mtx-portal'] Identificador del contenedor.
 * @returns {HTMLElement} Contenedor del portal.
 */
export function getPortalContainer(id = 'mtx-portal') {
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    // Fijo en el origen del viewport: los hijos absolutos (menús, dropdowns)
    // se posicionan con coordenadas de `getBoundingClientRect()` sin desfase.
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'visible';
    container.style.zIndex = '1300';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }
  return container;
}