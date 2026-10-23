import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';

/**
 * Representa un avatar de Materix UI.
 *
 * Sigue la anatomía de `Avatar` de MUI. Si contiene una `<img>`, la
 * utiliza; en caso contrario muestra las iniciales.
 *
 * Atributos `data-*`:
 * - `data-alt`: texto alternativo de la imagen.
 * - `data-src`: origen de la imagen (alternativa a `<img>`).
 * - `data-variant`: `circular` (por defecto), `rounded` o `square`.
 * - `data-color`: color de fondo del avatar de iniciales.
 * - `data-size`: tamaño en píxeles (opcional).
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-avatar" data-mtx="avatar">RD</div>
 * ```
 */
export class Avatar extends ComponentBase {
  /**
   * Crea una instancia del avatar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-avatar')) {
      element.classList.add('mtx-avatar');
    }

    const img = element.querySelector('img');
    const src = element.getAttribute('data-src');
    if (img) {
      this.img = img;
      if (element.hasAttribute('data-alt') && !img.hasAttribute('alt')) {
        img.alt = element.getAttribute('data-alt');
      }
    } else if (src) {
      this.img = document.createElement('img');
      this.img.alt = element.getAttribute('data-alt') || '';
      const srcSet = element.getAttribute('data-srcset');
      const sizes = element.getAttribute('data-sizes');
      if (srcSet) this.img.srcset = srcSet;
      if (sizes) this.img.sizes = sizes;
      this.img.src = src;
      element.appendChild(this.img);
    } else {
      element.classList.add('mtx-avatar--fallback');
    }

    if (this.img) {
      this._handleImageError = () => {
        this.img.hidden = true;
        element.classList.add('mtx-avatar--fallback');
        const hasFallback = Array.from(element.childNodes).some(
          (node) => node !== this.img && node.textContent && node.textContent.trim()
        );
        if (!hasFallback) {
          const fallback = document.createElement('span');
          fallback.className = 'mtx-avatar__fallback';
          const alt = this.img.alt || element.getAttribute('data-alt') || '';
          fallback.textContent = alt.trim().charAt(0).toUpperCase() || '●';
          element.appendChild(fallback);
        }
      };
      this.img.addEventListener('error', this._handleImageError);
      if (this.img.complete && this.img.naturalWidth === 0) this._handleImageError();
    }

    const iconName = element.getAttribute('data-icon');
    if (iconName && !this.img && !element.querySelector('.material-icons') && !element.querySelector('svg')) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'material-icons';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = iconName;
      element.appendChild(iconSpan);
      element.classList.remove('mtx-avatar--fallback');
    }

    const variant = element.getAttribute('data-variant');
    if (variant && variant !== 'circular') element.classList.add(`mtx-avatar--${variant}`);
    const color = element.getAttribute('data-color');
    if (color) element.classList.add(`mtx-avatar--${color}`);
    const size = element.getAttribute('data-size');
    if (size) {
      if (size === 'small') {
        element.classList.add('mtx-avatar--small');
      } else if (size === 'medium') {
        element.classList.add('mtx-avatar--medium');
      } else if (size === 'large') {
        element.classList.add('mtx-avatar--large');
      } else if (!isNaN(Number(size))) {
        element.style.width = element.style.height = `${size}px`;
        element.style.fontSize = `${Math.round(Number(size) * 0.45)}px`;
      }
    }
  }

  /** Elimina el listener de error de imagen. */
  destroy() {
    if (this.img && this._handleImageError) {
      this.img.removeEventListener('error', this._handleImageError);
    }
    super.destroy();
  }
}

/**
 * Agrupa avatares y representa visualmente los elementos excedentes.
 *
 * `data-max` limita el número total de elementos visibles, incluido el
 * indicador de excedente. `data-total` permite indicar usuarios no montados.
 */
export class AvatarGroup extends ComponentBase {
  /**
   * Crea un grupo de avatares.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-avatar-group');
    if (element.hasAttribute('data-label') && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', element.getAttribute('data-label'));
    }
    this._max = this._readInteger('data-max', 5, 2);
    this._total = this._readInteger('data-total', null, 0);
    this._applySpacing(element.getAttribute('data-spacing') || 'medium');
    this.refresh();
  }

  /** @returns {number} Máximo de avatares visibles, incluido el excedente. */
  get max() {
    return this._max;
  }

  /** @param {number} value Nuevo máximo visible. */
  set max(value) {
    this._max = Math.max(2, Number.parseInt(value, 10) || 5);
    this.element.setAttribute('data-max', String(this._max));
    this.refresh();
  }

  /** @returns {number} Total lógico de avatares. */
  get total() {
    return Math.max(this._total ?? 0, this._getAvatars().length);
  }

  /** @param {number|null} value Nuevo total lógico. */
  set total(value) {
    if (value === null || value === undefined) {
      this._total = null;
      this.element.removeAttribute('data-total');
    } else {
      this._total = Math.max(0, Number.parseInt(value, 10) || 0);
      this.element.setAttribute('data-total', String(this._total));
    }
    this.refresh();
  }

  /** Recalcula avatares visibles e indicador de excedente. */
  refresh() {
    if (this._surplus) this._surplus.remove();
    this._surplus = null;
    const avatars = this._getAvatars();
    avatars.forEach((avatar) => { avatar.hidden = false; });

    const total = Math.max(this._total ?? avatars.length, avatars.length);
    if (total <= this._max) return;

    const visibleCount = Math.max(1, this._max - 1);
    avatars.slice(visibleCount).forEach((avatar) => { avatar.hidden = true; });
    const surplus = total - visibleCount;
    this._surplus = document.createElement('span');
    this._surplus.className = 'mtx-avatar mtx-avatar--surplus';
    this._surplus.textContent = `+${surplus}`;
    this._surplus.setAttribute('aria-label', this._surplusLabel(surplus));
    this.element.appendChild(this._surplus);
  }

  /** Restaura todos los avatares del grupo. */
  destroy() {
    if (this._surplus) this._surplus.remove();
    this._getAvatars().forEach((avatar) => { avatar.hidden = false; });
    this.element.style.removeProperty('--mtx-avatar-group-overlap');
    super.destroy();
  }

  /** @returns {HTMLElement[]} Avatares originales del grupo. */
  _getAvatars() {
    // Incluye hijos aún sin inicializar (sintaxis simplificada `data-mtx="avatar"`).
    return Array.from(this.element.children).filter((child) => (
      (child.classList.contains('mtx-avatar') || child.getAttribute('data-mtx') === 'avatar')
      && !child.classList.contains('mtx-avatar--surplus')
    ));
  }

  /**
   * Lee un entero acotado desde el elemento.
   *
   * @param {string} name Nombre del atributo.
   * @param {number|null} fallback Valor alternativo.
   * @param {number} minimum Mínimo permitido.
   * @returns {number|null} Entero normalizado.
   */
  _readInteger(name, fallback, minimum) {
    if (!this.element.hasAttribute(name)) return fallback;
    const value = Number.parseInt(this.element.getAttribute(name), 10);
    return Number.isFinite(value) ? Math.max(minimum, value) : fallback;
  }

  /** @param {string} spacing Espaciado MUI o valor numérico en píxeles. */
  _applySpacing(spacing) {
    const presets = { small: 16, medium: 8 };
    const parsed = Number.parseFloat(spacing);
    const overlap = Object.prototype.hasOwnProperty.call(presets, spacing)
      ? presets[spacing]
      : Math.max(0, parsed || 0);
    this.element.style.setProperty('--mtx-avatar-group-overlap', `${overlap}px`);
  }

  /** @param {number} surplus Cantidad excedente. @returns {string} Etiqueta accesible. */
  _surplusLabel(surplus) {
    const template = this.element.getAttribute('data-surplus-label')
      || t('avatarGroup', 'surplus', null, '{count} more', getComponentLocale(this.element));
    return template.replace('{count}', String(surplus));
  }
}

registerComponent('avatar', Avatar);
registerComponent('avatar-group', AvatarGroup);