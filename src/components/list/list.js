import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { emit } from '../../core/events.js';

/**
 * Lista de Materix UI (familia `List` de MUI).
 *
 * Registra los elementos: `list`, `list-item`, `list-item-button`,
 * `list-item-text`, `list-item-icon`, `list-item-avatar`,
 * `list-item-secondary-action` y `list-subheader`. Son principalmente
 * visuales; solo `list-item-button` añade interacción (ripple y selección).
 *
 * Uso declarativo:
 * ```html
 * <ul class="mtx-list" data-mtx="list">
 *   <li class="mtx-list-item" data-mtx="list-item">
 *     <span class="mtx-list-item-icon" data-mtx="list-item-icon">✦</span>
 *     <span class="mtx-list-item-text" data-mtx="list-item-text">Elemento</span>
 *   </li>
 * </ul>
 * ```
 */
export class List extends ComponentBase {
  /**
   * Crea una instancia de la lista.
   *
   * @param {HTMLElement} element Elemento `<ul>` o `<nav>` asociado.
   */
  constructor(element) {
    super(element);
    if (!element.classList.contains('mtx-list')) element.classList.add('mtx-list');
    if (element.hasAttribute('data-dense')) element.classList.add('mtx-list--dense');
    if (element.hasAttribute('data-nested')) element.classList.add('mtx-list--nested');
    if (element.hasAttribute('data-disable-padding')) element.classList.add('mtx-list--disable-padding');
  }
}

/** Hijos que conservan su posición al construir el texto (no son texto principal). */
const LIST_ITEM_SLOT_SELECTOR = [
  '.mtx-list-item-icon',
  '.mtx-list-item-avatar',
  '.mtx-list-item-secondary-action',
  '.mtx-ripple-container',
  '[data-mtx]',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'ul',
  'ol',
  'nav',
].join(',');

/** Roles en los que `aria-selected` es válido según WAI-ARIA. */
const SELECTABLE_ROLES = ['option', 'tab', 'treeitem', 'gridcell', 'row', 'columnheader', 'rowheader'];

/**
 * Crea un contenedor de icono de lista con un Material Icon decorativo.
 *
 * @param {string} iconName Nombre del icono.
 * @returns {HTMLElement} Elemento `.mtx-list-item-icon`.
 */
function createListIcon(iconName) {
  const iconContainer = document.createElement('span');
  iconContainer.className = 'mtx-list-item-icon';
  const iconSpan = document.createElement('span');
  iconSpan.className = 'material-icons';
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.textContent = iconName;
  iconContainer.appendChild(iconSpan);
  return iconContainer;
}

/**
 * Envuelve los nodos de texto en `__primary` y añade `__secondary` si se indica.
 *
 * @param {HTMLElement} textContainer Elemento `.mtx-list-item-text`.
 * @param {Node[]} nodes Nodos que forman el texto principal.
 * @param {string|null} primaryText Texto principal explícito (`data-primary`).
 * @param {string|null} secondaryText Texto secundario (`data-secondary`).
 */
function fillListItemText(textContainer, nodes, primaryText, secondaryText) {
  const primarySpan = document.createElement('span');
  primarySpan.className = 'mtx-list-item-text__primary';
  if (primaryText !== null) primarySpan.textContent = primaryText;
  else nodes.forEach((node) => primarySpan.appendChild(node));
  textContainer.appendChild(primarySpan);
  if (secondaryText) {
    const secondarySpan = document.createElement('span');
    secondarySpan.className = 'mtx-list-item-text__secondary';
    secondarySpan.textContent = secondaryText;
    textContainer.appendChild(secondarySpan);
  }
}

/**
 * Construye la anatomía de una fila desde la sintaxis simplificada.
 *
 * Inserta icono (`data-icon`) o avatar (`data-avatar`), envuelve los avatares
 * sueltos en `.mtx-list-item-avatar` y agrupa el texto en `.mtx-list-item-text`
 * (con `data-secondary`), sin borrar acciones, controles ni otros componentes.
 *
 * @param {HTMLElement} element Fila (`list-item` o `list-item-button`).
 */
function scaffoldListItemContent(element) {
  const iconName = element.getAttribute('data-icon');
  if (iconName && !element.querySelector(':scope > .mtx-list-item-icon')) {
    element.insertBefore(createListIcon(iconName), element.firstChild);
  }

  const avatarSrc = element.getAttribute('data-avatar');
  if (avatarSrc && !element.querySelector(':scope > .mtx-list-item-avatar')) {
    const avatarContainer = document.createElement('span');
    avatarContainer.className = 'mtx-list-item-avatar';
    const avatar = document.createElement('span');
    avatar.setAttribute('data-mtx', 'avatar');
    avatar.setAttribute('data-src', avatarSrc);
    avatar.setAttribute('data-alt', element.getAttribute('data-avatar-alt') || '');
    avatarContainer.appendChild(avatar);
    element.insertBefore(avatarContainer, element.firstChild);
  }

  // Avatares directos sin contenedor: se envuelven como ListItemAvatar.
  Array.from(element.children).forEach((child) => {
    if (child.matches('.mtx-avatar, [data-mtx="avatar"]')) {
      const avatarContainer = document.createElement('span');
      avatarContainer.className = 'mtx-list-item-avatar';
      element.insertBefore(avatarContainer, child);
      avatarContainer.appendChild(child);
    }
  });

  if (element.querySelector(':scope > .mtx-list-item-text')) return;

  const textNodes = Array.from(element.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) return true;
    return node.nodeType === Node.ELEMENT_NODE && !node.matches(LIST_ITEM_SLOT_SELECTOR);
  });
  const hasText = textNodes.some((node) => node.textContent.trim() !== '');
  const primaryText = element.getAttribute('data-primary');
  const secondaryText = element.getAttribute('data-secondary');
  if (!hasText && primaryText === null && !secondaryText) return;

  const textContainer = document.createElement('span');
  textContainer.className = 'mtx-list-item-text';
  // Se inserta donde estaba el texto; si no hay texto, antes de la primera acción.
  const reference = textNodes.find((node) => node.textContent.trim() !== '')
    || Array.from(element.children).find((child) => !child.matches('.mtx-list-item-icon, .mtx-list-item-avatar'))
    || null;
  element.insertBefore(textContainer, reference);
  if (primaryText !== null) {
    textNodes.forEach((node) => { if (node.textContent.trim() === '') node.remove(); });
    fillListItemText(textContainer, [], primaryText, secondaryText);
  } else {
    fillListItemText(textContainer, textNodes, null, secondaryText);
  }
}

/**
 * Sincroniza la clase y el estado ARIA de selección de una fila.
 *
 * `<a>` recibe `aria-current="page"`; los roles seleccionables (option, tab…)
 * reciben `aria-selected`; el resto de filas (`<button>`) `aria-current="true"`.
 *
 * @param {HTMLElement} item Fila interactiva.
 * @param {boolean} selected Nuevo estado.
 */
export function setListItemSelected(item, selected) {
  item.classList.toggle('mtx-list-item--selected', selected);
  const role = item.getAttribute('role') || '';
  if (SELECTABLE_ROLES.includes(role)) {
    item.setAttribute('aria-selected', String(selected));
    item.removeAttribute('aria-current');
    return;
  }
  item.removeAttribute('aria-selected');
  if (selected) {
    item.setAttribute('aria-current', item.tagName === 'A' || role === 'link' ? 'page' : 'true');
  } else {
    item.removeAttribute('aria-current');
  }
}

/**
 * Item de lista.
 */
export class ListItem extends ComponentBase {
  /**
   * Crea una instancia del item.
   *
   * @param {HTMLElement} element Elemento `<li>` asociado.
   */
  constructor(element) {
    super(element);
    if (!element.classList.contains('mtx-list-item')) element.classList.add('mtx-list-item');
    if (element.hasAttribute('data-disabled')) element.classList.add('mtx-list-item--disabled');
    // Fila estática deshabilitada: aria-disabled para que el texto atenuado se exponga como deshabilitado.
    if (element.classList.contains('mtx-list-item--disabled') && !element.hasAttribute('aria-disabled')) {
      element.setAttribute('aria-disabled', 'true');
    }
    if (element.hasAttribute('data-dense') || element.closest('.mtx-list--dense')) element.classList.add('mtx-list-item--dense');
    if (element.hasAttribute('data-disable-padding')) element.classList.add('mtx-list-item--disable-padding');
    if (element.hasAttribute('data-align-start')) element.classList.add('mtx-list-item--align-start');
    if (element.hasAttribute('data-divider')) element.classList.add('mtx-list-item--divider');
    if (element.hasAttribute('data-disable-gutters')) element.classList.add('mtx-list-item--disable-gutters');

    scaffoldListItemContent(element);
  }
}

/**
 * Item de lista interactivo (equivalente a `ListItemButton` de MUI).
 */
export class ListItemButton extends ComponentBase {
  /**
   * Crea una instancia del item interactivo.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    if (!element.classList.contains('mtx-list-item')) element.classList.add('mtx-list-item');
    if (!element.classList.contains('mtx-list-item-button')) element.classList.add('mtx-list-item-button');
    this._isLink = element.tagName === 'A';
    if (element.hasAttribute('data-dense') || element.closest('.mtx-list--dense')) {
      element.classList.add('mtx-list-item--dense');
    }
    if (element.hasAttribute('data-disable-gutters')) element.classList.add('mtx-list-item--disable-gutters');
    if (element.hasAttribute('data-divider')) element.classList.add('mtx-list-item--divider');
    if (element.hasAttribute('data-align-start')) element.classList.add('mtx-list-item--align-start');
    if (element.hasAttribute('data-disabled')) this.disable();

    scaffoldListItemContent(element);

    this._handlePointerDown = (event) => {
      if (this.disabled || event.button !== 0) return;
      event._mtxRippleHandled = true;
      createRipple(element, event);
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
    if (element.hasAttribute('data-selected') || element.classList.contains('mtx-list-item--selected')) {
      setListItemSelected(element, true);
    }
    this._handleClick = (event) => {
      if (!this.disabled) return;
      event.preventDefault();
      event.stopPropagation();
    };
    element.addEventListener('click', this._handleClick);
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.element.disabled === true || this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita el item interactivo. */
  disable() {
    this.element.classList.add('mtx-list-item--disabled');
    if ('disabled' in this.element) this.element.disabled = true;
    else {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.tabIndex = -1;
    }
  }

  /** Habilita el item interactivo. */
  enable() {
    this.element.classList.remove('mtx-list-item--disabled');
    if ('disabled' in this.element) this.element.disabled = false;
    else {
      this.element.removeAttribute('aria-disabled');
      this.element.tabIndex = 0;
    }
  }

  /** @returns {boolean} Estado seleccionado. */
  get selected() {
    return this.element.classList.contains('mtx-list-item--selected');
  }

  /** @param {boolean} value Nuevo estado seleccionado (sincroniza `aria-current` / `aria-selected`). */
  set selected(value) {
    setListItemSelected(this.element, Boolean(value));
  }

  /**
   * Destruye la instancia.
   */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

/**
 * Subcabecera de lista.
 */
export class ListSubheader extends ComponentBase {
  /**
   * Crea una instancia de la subcabecera.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-list-subheader');
    if (element.hasAttribute('data-inset')) element.classList.add('mtx-list-subheader--inset');
    if (element.hasAttribute('data-sticky')) element.classList.add('mtx-list-subheader--sticky');
  }
}

/**
 * Texto de una fila (`ListItemText` de MUI): principal y secundario.
 */
export class ListItemText extends ComponentBase {
  /**
   * Crea una instancia del texto; envuelve el contenido en `__primary` si falta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-list-item-text');
    if (element.querySelector(':scope > .mtx-list-item-text__primary')) return;
    const primaryText = element.getAttribute('data-primary');
    const nodes = Array.from(element.childNodes);
    if (primaryText !== null) nodes.forEach((node) => node.remove());
    fillListItemText(element, primaryText !== null ? [] : nodes, primaryText, element.getAttribute('data-secondary'));
  }
}

/**
 * Contenedor de icono de una fila (`ListItemIcon` de MUI).
 */
export class ListItemIcon extends ComponentBase {
  /**
   * Crea una instancia; con `data-icon` y sin contenido genera el Material Icon.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-list-item-icon');
    const iconName = element.getAttribute('data-icon');
    if (iconName && element.children.length === 0 && element.textContent.trim() === '') {
      element.appendChild(createListIcon(iconName).firstChild);
    }
  }
}

/**
 * Contenedor de avatar de una fila (`ListItemAvatar` de MUI, 56px).
 */
export class ListItemAvatar extends ComponentBase {
  /**
   * Crea una instancia del contenedor de avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-list-item-avatar');
  }
}

/**
 * Acción secundaria al final de la fila (`ListItemSecondaryAction` de MUI).
 */
export class ListItemSecondaryAction extends ComponentBase {
  /**
   * Crea una instancia de la acción secundaria.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-list-item-secondary-action');
  }
}

registerComponent('list', List);
registerComponent('list-item', ListItem);
registerComponent('list-item-button', ListItemButton);
registerComponent('list-item-text', ListItemText);
registerComponent('list-item-icon', ListItemIcon);
registerComponent('list-item-avatar', ListItemAvatar);
registerComponent('list-item-secondary-action', ListItemSecondaryAction);
registerComponent('list-subheader', ListSubheader);

// --- Delegación de eventos para interacción y selección de ítems ---
if (typeof document !== 'undefined') {
  // 1. Efecto Ripple delegado para cualquier botón de lista interactivo
  document.addEventListener('pointerdown', (event) => {
    if (event._mtxRippleHandled || event.button !== 0) return;
    const itemBtn = event.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
    if (!itemBtn) return;
    if (
      itemBtn.classList.contains('mtx-list-item--disabled') ||
      itemBtn.disabled ||
      itemBtn.getAttribute('aria-disabled') === 'true'
    ) {
      return;
    }
    event._mtxRippleHandled = true;
    createRipple(itemBtn, event);
  });

  // 2. Selección activa declarativa al hacer clic en ítems de menú o lista
  document.addEventListener('click', (event) => {
    const itemBtn = event.target.closest('.mtx-list-item-button, [data-mtx="list-item-button"]');
    if (!itemBtn) return;

    if (
      itemBtn.classList.contains('mtx-list-item--disabled') ||
      itemBtn.disabled ||
      itemBtn.getAttribute('aria-disabled') === 'true'
    ) {
      return;
    }

    // Permitir desactivar la selección automática si el elemento o su lista tienen data-no-select o data-selectable="false"
    if (
      itemBtn.hasAttribute('data-no-select') ||
      itemBtn.getAttribute('data-selectable') === 'false' ||
      itemBtn.closest('[data-selectable="false"]')
    ) {
      return;
    }

    // Ámbito de selección: Drawer, Nav, Lista raíz o el padre contenedor directo
    const container = itemBtn.closest('.mtx-drawer, [data-mtx="drawer"], nav, [data-mtx="nav"]')
      || itemBtn.closest('.mtx-list:not(.mtx-list--nested)')
      || itemBtn.closest('.mtx-list')
      || itemBtn.parentElement;

    if (container) {
      container.querySelectorAll('.mtx-list-item-button.mtx-list-item--selected, [data-mtx="list-item-button"].mtx-list-item--selected').forEach((el) => {
        if (el !== itemBtn) setListItemSelected(el, false);
      });
    }

    setListItemSelected(itemBtn, true);

    // Notificar evento personalizado
    emit(itemBtn, 'mtx:list:select', { item: itemBtn }, { aliases: ['mtx-select'] });
  });
}