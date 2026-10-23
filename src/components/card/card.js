import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { createRipple } from '../../core/ripple.js';

/**
 * Representa una tarjeta de Materix UI según la especificación de Material UI (MUI).
 *
 * Uso declarativo simplificado (Single-Element):
 * ```html
 * <div data-mtx="card" data-title="Paella" data-subheader="Receta" data-image="...">
 *   <div data-mtx="card-content">Contenido...</div>
 * </div>
 * ```
 */
export class Card extends ComponentBase {
  /**
   * Crea una instancia de la tarjeta.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-card')) {
      element.classList.add('mtx-card');
    }

    const title = element.getAttribute('data-title');
    const subheader = element.getAttribute('data-subheader');
    const avatar = element.getAttribute('data-avatar');
    const image = element.getAttribute('data-image') || element.getAttribute('data-media');

    // Auto-scaffolding de Header estructurado correctamente
    if ((title || subheader || avatar) && !element.querySelector('.mtx-card__header, .mtx-card-header')) {
      const header = document.createElement('div');
      header.className = 'mtx-card__header';

      if (avatar) {
        const avatarWrap = document.createElement('div');
        avatarWrap.className = 'mtx-card__header-avatar';
        const av = document.createElement('div');
        av.className = 'mtx-avatar mtx-avatar--primary';
        av.setAttribute('data-mtx', 'avatar');
        av.textContent = avatar;
        avatarWrap.appendChild(av);
        header.appendChild(avatarWrap);
      }

      const content = document.createElement('div');
      content.className = 'mtx-card__header-content';

      if (title) {
        const titleEl = document.createElement('span');
        titleEl.className = 'mtx-card__title';
        titleEl.textContent = title;
        content.appendChild(titleEl);
      }

      if (subheader) {
        const subEl = document.createElement('span');
        subEl.className = 'mtx-card__subheader';
        subEl.textContent = subheader;
        content.appendChild(subEl);
      }

      header.appendChild(content);

      if (element.hasAttribute('data-action-icon')) {
        const actionWrap = document.createElement('div');
        actionWrap.className = 'mtx-card__header-action';
        const btn = document.createElement('button');
        btn.className = 'mtx-icon-button';
        btn.setAttribute('data-mtx', 'icon-button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', element.getAttribute('data-action-label') || t('card', 'actions', null, 'Actions', getComponentLocale(element)));
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = element.getAttribute('data-action-icon');
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);
        actionWrap.appendChild(btn);
        header.appendChild(actionWrap);
      }

      element.insertBefore(header, element.firstChild);
    }

    // Auto-scaffolding de Media si se suministra data-image
    if (image && !element.querySelector('.mtx-card__media, .mtx-card-media')) {
      const media = document.createElement('div');
      media.className = 'mtx-card__media';
      media.setAttribute('data-mtx', 'card-media');
      media.style.backgroundImage = `url("${image}")`;
      // Texto alternativo: CardMedia lo convierte en role="img" + aria-label (o lo marca decorativo).
      const imageAlt = element.getAttribute('data-image-alt');
      if (imageAlt) media.setAttribute('data-alt', imageAlt);
      const mediaHeight = element.getAttribute('data-media-height') || element.getAttribute('data-height');
      if (mediaHeight) {
        media.style.height = `${mediaHeight}px`;
      }
      const existingHeader = element.querySelector('.mtx-card__header, .mtx-card-header');
      if (existingHeader && !element.hasAttribute('data-media-top')) {
        existingHeader.after(media);
      } else {
        element.insertBefore(media, element.firstChild);
      }
    }

    // data-actions-align: alineación por defecto de las acciones de esta tarjeta.
    const actionsAlign = element.getAttribute('data-actions-align');
    element.querySelectorAll('.mtx-card__actions, .mtx-card-actions, [data-mtx="card-actions"]').forEach((actions) => {
      if (actions.closest('.mtx-card, [data-mtx="card"]') === element) applyCardActionsAlign(actions, actionsAlign);
    });

    const variant = element.getAttribute('data-variant');
    if (variant === 'outlined') element.classList.add('mtx-card--outlined');
    const elevation = element.getAttribute('data-elevation');
    if (elevation !== null) element.classList.add(`mtx-card--elevation-${elevation}`);
    if (element.hasAttribute('data-raised')) element.classList.add('mtx-card--raised');
    if (element.hasAttribute('data-square')) element.classList.add('mtx-card--square');

    this.interactive = element.hasAttribute('data-clickable')
      || element.classList.contains('mtx-card--clickable');
    if (this.interactive) {
      element.classList.add('mtx-card--clickable');
      if (!/^(BUTTON|A)$/.test(element.tagName)) element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
      this._handlePointerDown = (event) => {
        if (this.disabled || event.button !== 0) return;
        createRipple(element, event);
      };
      this._handleKeydown = (event) => {
        if (this.disabled) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      };
      element.addEventListener('pointerdown', this._handlePointerDown);
      element.addEventListener('keydown', this._handleKeydown);
    }
    if (element.hasAttribute('data-disabled')) this.disable();
  }

  /** @returns {boolean} Estado deshabilitado de una tarjeta interactiva. */
  get disabled() {
    return this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita una tarjeta interactiva. */
  disable() {
    this.element.setAttribute('aria-disabled', 'true');
    this.element.classList.add('mtx-card--disabled');
    this.element.tabIndex = -1;
  }

  /** Habilita una tarjeta interactiva. */
  enable() {
    this.element.removeAttribute('aria-disabled');
    this.element.classList.remove('mtx-card--disabled');
    if (this.interactive) this.element.tabIndex = 0;
  }

  /** Enfoca la tarjeta (útil en tarjetas interactivas). */
  focus() {
    this.element.focus();
  }

  /** Elimina listeners de una tarjeta interactiva. */
  destroy() {
    if (this._handlePointerDown) this.element.removeEventListener('pointerdown', this._handlePointerDown);
    if (this._handleKeydown) this.element.removeEventListener('keydown', this._handleKeydown);
    super.destroy();
  }
}

/** Representa el área de acción principal de una tarjeta. */
export class CardActionArea extends ComponentBase {
  /**
   * Crea un área interactiva con teclado, foco y ripple.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-card-action-area');
    this._nativeInteractive = /^(BUTTON|A)$/.test(element.tagName);
    if (element.tagName === 'BUTTON' && !element.hasAttribute('type')) element.type = 'button';
    if (!this._nativeInteractive) {
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
    }
    this._handlePointerDown = (event) => {
      if (!this.disabled && event.button === 0) createRipple(element, event);
    };
    this._handleKeydown = (event) => {
      if (this.disabled || this._nativeInteractive) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    };
    this._handleClick = (event) => {
      if (!this.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
    element.addEventListener('keydown', this._handleKeydown);
    element.addEventListener('click', this._handleClick);
    if (element.hasAttribute('data-disabled') || element.getAttribute('aria-disabled') === 'true') {
      this.disable();
    }
  }

  /** @returns {boolean} Indica si el área está deshabilitada. */
  get disabled() {
    return this.element.disabled === true || this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita el área de acción. */
  disable() {
    if ('disabled' in this.element) this.element.disabled = true;
    this.element.setAttribute('aria-disabled', 'true');
    this.element.classList.add('mtx-card-action-area--disabled');
    if (!this._nativeInteractive || this.element.tagName === 'A') this.element.tabIndex = -1;
  }

  /** Habilita el área de acción. */
  enable() {
    if ('disabled' in this.element) this.element.disabled = false;
    this.element.removeAttribute('aria-disabled');
    this.element.classList.remove('mtx-card-action-area--disabled');
    if (!this._nativeInteractive || this.element.tagName === 'A') this.element.tabIndex = 0;
  }

  /** Enfoca el área de acción. */
  focus() {
    this.element.focus();
  }

  /** Elimina los listeners instalados. */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    this.element.removeEventListener('keydown', this._handleKeydown);
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

/** Representa el encabezado compuesto de una tarjeta. */
export class CardHeader extends ComponentBase {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-card__header');
  }
}

/** Representa el contenido principal de una tarjeta. */
export class CardContent extends ComponentBase {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-card__content');
  }
}

const ACTIONS_ALIGNMENTS = ['start', 'center', 'end', 'between'];

/**
 * Aplica la alineación a un contenedor de acciones de tarjeta (idempotente).
 *
 * @param {HTMLElement} actions Contenedor `.mtx-card__actions`.
 * @param {string|null} [fallbackAlign] Alineación heredada de la tarjeta (`data-actions-align`).
 * @returns {string} Alineación efectiva (`end` por defecto).
 */
export function applyCardActionsAlign(actions, fallbackAlign = null) {
  const own = actions.getAttribute('data-align');
  const fromClass = ACTIONS_ALIGNMENTS.find((value) => actions.classList.contains(`mtx-card__actions--${value}`));
  const align = [own, fromClass, fallbackAlign].find((value) => ACTIONS_ALIGNMENTS.includes(value)) || 'end';
  ACTIONS_ALIGNMENTS.forEach((value) => {
    actions.classList.toggle(`mtx-card__actions--${value}`, value === align && value !== 'end');
  });
  return align;
}

/**
 * Representa el contenedor de acciones de una tarjeta.
 *
 * `data-align="start|center|end|between"` (por defecto `end`) y `data-disable-spacing`.
 */
export class CardActions extends ComponentBase {
  /** @param {HTMLElement} element Elemento asociado. */
  constructor(element) {
    super(element);
    element.classList.add('mtx-card__actions');
    const spacing = element.getAttribute('data-disable-spacing');
    if (spacing !== null && spacing !== 'false') {
      element.classList.add('mtx-card__actions--disable-spacing');
    }
    const card = element.closest('.mtx-card, [data-mtx="card"]');
    this._align = applyCardActionsAlign(element, card ? card.getAttribute('data-actions-align') : null);
  }

  /** @returns {string} Alineación actual (`start`, `center`, `end` o `between`). */
  get align() {
    return this._align;
  }

  /**
   * Cambia la alineación de las acciones.
   *
   * @param {string} value `start`, `center`, `end` o `between`.
   * @throws {RangeError} Si el valor no es una alineación válida.
   */
  set align(value) {
    if (!ACTIONS_ALIGNMENTS.includes(value)) {
      throw new RangeError(`Alineación no válida: ${value}`);
    }
    this.element.setAttribute('data-align', value);
    this._align = applyCardActionsAlign(this.element);
  }
}

/** Representa el recurso visual de una tarjeta. */
export class CardMedia extends ComponentBase {
  /**
   * Crea el media y aplica `data-image`, `data-alt` y `data-height`.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-card__media');
    const height = Number.parseFloat(element.getAttribute('data-height') || element.getAttribute('data-media-height'));
    if (Number.isFinite(height) && height >= 0) element.style.height = `${height}px`;
    const alt = element.getAttribute('data-alt');
    if (element.tagName === 'IMG') {
      if (alt) element.alt = alt;
      else if (!element.hasAttribute('alt')) element.alt = '';
    } else if (alt) {
      element.setAttribute('role', 'img');
      element.setAttribute('aria-label', alt);
    } else if (!element.hasAttribute('role') && !element.hasAttribute('aria-label')
      && !element.hasAttribute('aria-labelledby') && !element.children.length
      && (element.hasAttribute('data-image') || element.style.backgroundImage)) {
      // Imagen de fondo sin texto alternativo: se trata como decorativa.
      element.setAttribute('aria-hidden', 'true');
    }
    if (element.hasAttribute('data-image')) this.image = element.getAttribute('data-image');
  }

  /** @returns {string} URL actual del recurso. */
  get image() {
    return this.element.tagName === 'IMG'
      ? this.element.getAttribute('src') || ''
      : this.element.style.backgroundImage.replace(/^url\(["']?|["']?\)$/g, '');
  }

  /** @param {string} value URL del recurso. */
  set image(value) {
    if (this.element.tagName === 'IMG') {
      this.element.src = value;
    } else {
      const safeUrl = String(value).replace(/["\\\n\r]/g, encodeURIComponent);
      this.element.style.backgroundImage = `url("${safeUrl}")`;
    }
  }
}

registerComponent('card', Card);
registerComponent('card-action-area', CardActionArea);
registerComponent('card-header', CardHeader);
registerComponent('card-content', CardContent);
registerComponent('card-actions', CardActions);
registerComponent('card-media', CardMedia);