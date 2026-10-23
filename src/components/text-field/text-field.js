import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, registerInstance, initElement } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit } from '../../core/events.js';
import { parseErrorAttribute } from '../form-helper-text/form-helper-text.js';
import { uniqueId } from '../../core/id.js';


/**
 * Representa un campo de texto de Materix UI.

 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-text-field mtx-text-field--outlined" data-mtx="text-field">
 *   <label class="mtx-text-field__label" for="nombre">Nombre</label>
 *   <div class="mtx-text-field__container">
 *     <input class="mtx-text-field__input" id="nombre" type="text" placeholder=" " />
 *   </div>
 * </div>
 * ```
 *
 * En la variante `outlined`, el componente inyecta automáticamente el
 * `fieldset` que dibuja la muesca del borde (NotchedOutline de MUI).
 */
export class TextField extends ComponentBase {
  /**
   * Crea una instancia del campo de texto.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    // 1. Si el elemento pasado es directamente un <input>, <select> o <textarea>, auto-envolverlo
    // Si el control ya vive dentro de un wrapper (re-init tras destroy o BEM), se reutiliza.
    const isControl = element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;
    const existingRoot = isControl && element.parentElement ? element.parentElement.closest('.mtx-text-field') : null;
    if (existingRoot) {
      element = existingRoot;
    } else if (isControl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mtx-text-field';
      
      // Transferir atributos data-* y class (AGENTS §6.3: class se concatena)
      Array.from(element.attributes).forEach(attr => {
        if (attr.name === 'class') {
          wrapper.className += ' ' + attr.value;
        } else if (attr.name.startsWith('data-') || attr.name === 'label') {
          wrapper.setAttribute(attr.name, attr.value);
        }
      });

      if (element.parentNode) {
        element.parentNode.insertBefore(wrapper, element);
      }
      wrapper.appendChild(element);
      element = wrapper;
    }

    super(element);

    this.input = element.querySelector('.mtx-text-field__input')
      || element.querySelector('input, textarea, select')
      || (element.matches('input, textarea, select') ? element : null);

    if (!this.input) {
      throw new TypeError('TextField requiere un <input>, <textarea> o <select>.');
    }
    if (!this.input.id) this.input.id = uniqueId('mtx-text-field');

    this._autoBuildStructure();

    this._createdSupport = false;
    this._hasCustomError = false;
    this._helperText = this.helperEl ? this.helperEl.textContent : (this.support ? this.support.textContent : '');
    this._helperId = this.support
      ? (this.support.id || `${this.input.id}-helper-text`)
      : '';
    this._baseDescribedBy = (this.input.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter(Boolean);
    if (this.support) {
      this.support.id = this._helperId;
      this._syncDescribedBy();
    }

    if (this.element.classList.contains('mtx-text-field--outlined')) {
      this._buildOutline();
    }

    const initialError = parseErrorAttribute(this.element.getAttribute('data-error'));
    if (initialError.error) this.setError(initialError.message || true);

    this._syncActionsDisabled();
    this._handleLocaleChange = () => {
      this._updateCounter();
      this._syncPasswordToggle();
    };
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this._initMask();

    this._handleInput = (e) => {
      if (this._mask) {
        this._handleMaskInput(e);
      }
      this._syncAria();
      this._updateCounter();
      this._adjustAutoResize();
    };
    ['input', 'change', 'focus', 'blur', 'keyup'].forEach((type) => this.listen(this.input, type, this._handleInput));
    this.listen(this.input, 'paste', () => {
      const timer = setTimeout(() => { if (!this.destroyed) this._handleInput(); }, 0);
      this.onDestroy(() => clearTimeout(timer));
    });
    this._syncAria();
    this._updateCounter();
    this._adjustAutoResize();
    if (this._hasAutoResize && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (!this.destroyed) this._adjustAutoResize(); });
    }

    // El control interno también resuelve a esta instancia: evita que initAll lo
    // re-envuelva cuando el wrapper (que hereda data-mtx) se inicializa primero.
    registerInstance(this.input, this);
    if (this.input.hasAttribute('data-mtx')) this.input.setAttribute('data-mtx-initialized', '');
  }

  /**
   * Construye automáticamente la estructura HTML requerida (label, container, adornments, helper text)
   * cuando el desarrollador utiliza la sintaxis simplificada de un solo elemento.
   * @private
   */
  _autoBuildStructure() {
    const el = this.element;
    if (!el.classList.contains('mtx-text-field')) {
      el.classList.add('mtx-text-field');
    }

    // Variantes desde data-variant o clases
    const variant = el.getAttribute('data-variant');
    if (variant) {
      if (variant === 'no-label') {
        el.classList.add('mtx-text-field--outlined', 'mtx-text-field--no-label');
      } else {
        el.classList.add(`mtx-text-field--${variant}`);
      }
    } else if (!el.className.match(/mtx-text-field--(outlined|filled|standard|no-label)/)) {
      el.classList.add('mtx-text-field--outlined');
    }

    // Tamaños desde data-size o data-small
    const size = el.getAttribute('data-size') || this.input.getAttribute('data-size');
    if (size === 'small' || size === 'compact' || el.hasAttribute('data-small') || this.input.hasAttribute('data-small')) {
      el.classList.add('mtx-text-field--small');
    } else if (size === 'large' || el.hasAttribute('data-large') || this.input.hasAttribute('data-large')) {
      el.classList.add('mtx-text-field--large');
    } else if (size === 'medium') {
      el.classList.add('mtx-text-field--medium');
    }

    // Color desde data-color
    const color = el.getAttribute('data-color');
    if (color) {
      el.classList.add(`mtx-text-field--${color}`);
    }

    // Asegurar clase mtx-text-field__input
    if (this.input && !this.input.classList.contains('mtx-text-field__input')) {
      this.input.classList.add('mtx-text-field__input');
    }

    // Asegurar contenedor .mtx-text-field__container
    let container = el.querySelector('.mtx-text-field__container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'mtx-text-field__container';
      this.input.parentNode.insertBefore(container, this.input);
      container.appendChild(this.input);
    }
    this.container = container;

    // Icono de inicio desde data-start-icon
    const startIcon = el.getAttribute('data-start-icon') || this.input.getAttribute('data-start-icon');
    if (startIcon && !container.querySelector('.mtx-text-field__adornment--start')) {
      const startEl = this._createIconOrImage(startIcon, 'mtx-text-field__adornment mtx-text-field__adornment--start');
      if (startEl) {
        container.insertBefore(startEl, container.firstChild);
      }
    }

    // Adornos interactivos: data-start-action / data-end-action / data-password-toggle
    const cfg = (name) => (el.hasAttribute(name) ? el.getAttribute(name) : this.input.getAttribute(name));
    // Re-init: vincula los botones de acción ya generados en lugar de duplicarlos.
    const existingStart = container.querySelector('.mtx-text-field__action--start');
    if (existingStart) {
      this.startAction = existingStart;
      this._bindActionButton(existingStart, 'start');
    }
    const startAction = cfg('data-start-action');
    if (startAction && !container.querySelector('.mtx-text-field__adornment--start')) {
      this.startAction = this._createActionAdornment('start', startAction, cfg('data-start-action-label'));
      el.classList.add('mtx-text-field--adorned-start');
    }
    const pwToggleAttr = cfg('data-password-toggle');
    const wantsPasswordToggle = pwToggleAttr !== null && pwToggleAttr !== 'false' &&
      (this.input.getAttribute('type') || '').toLowerCase() === 'password';
    const endAction = cfg('data-end-action');
    const existingEnd = container.querySelector('.mtx-text-field__action--end');
    if (existingEnd) {
      if (wantsPasswordToggle) this.passwordToggle = existingEnd;
      else this.endAction = existingEnd;
      this._bindActionButton(existingEnd, 'end');
    }
    if (!container.querySelector('.mtx-text-field__adornment--end')) {
      if (wantsPasswordToggle) {
        this.passwordToggle = this._createActionAdornment('end', 'visibility', '');
        this.passwordToggle.setAttribute('aria-controls', this.input.id);
        this._syncPasswordToggle();
      } else if (endAction) {
        this.endAction = this._createActionAdornment('end', endAction, cfg('data-end-action-label'));
      }
    }

    // Icono de fin desde data-end-icon
    const endIcon = el.getAttribute('data-end-icon') || this.input.getAttribute('data-end-icon');
    if (endIcon && !container.querySelector('.mtx-text-field__adornment--end')) {
      const endEl = this._createIconOrImage(endIcon, 'mtx-text-field__adornment mtx-text-field__adornment--end');
      if (endEl) {
        container.appendChild(endEl);
      }
    }

    // Sincronizar clases BEM de adornment en el elemento raíz
    if (container.querySelector('.mtx-text-field__adornment--start')) {
      el.classList.add('mtx-text-field--adorned-start');
    }
    if (container.querySelector('.mtx-text-field__adornment--end')) {
      el.classList.add('mtx-text-field--adorned-end');
    }

    // Label desde data-label, atributo label o placeholder nativo
    let labelText = el.getAttribute('data-label') || el.getAttribute('label') ||
                    this.input.getAttribute('data-label') || this.input.getAttribute('label');
    const isNoLabel = el.classList.contains('mtx-text-field--no-label') ||
                      el.getAttribute('data-variant') === 'no-label' ||
                      this.input.getAttribute('data-variant') === 'no-label';

    if (!labelText && !isNoLabel && this.input.hasAttribute('placeholder')) {
      const rawPlaceholder = this.input.getAttribute('placeholder').trim();
      if (rawPlaceholder) {
        labelText = rawPlaceholder;
        this.input.setAttribute('placeholder', ' ');
      }
    }

    let label = el.querySelector('.mtx-text-field__label');
    if (labelText && !label) {
      label = document.createElement('label');
      label.className = 'mtx-text-field__label';
      label.setAttribute('for', this.input.id);
      label.textContent = labelText;
      el.insertBefore(label, container);
    }
    this.label = label;

    // Placeholder por defecto para animación de flotado
    if (this.input && !this.input.hasAttribute('placeholder')) {
      this.input.setAttribute('placeholder', ' ');
    }

    // Multiline: textarea o data-multiline
    const isTextarea = this.input instanceof HTMLTextAreaElement;
    const isMultiline = isTextarea || el.hasAttribute('data-multiline') || this.input.hasAttribute('data-multiline');

    if (isMultiline) {
      el.classList.add('mtx-text-field--multiline');
      if (!isTextarea && (el.hasAttribute('data-multiline') || this.input.hasAttribute('data-multiline'))) {
        const textarea = document.createElement('textarea');
        Array.from(this.input.attributes).forEach(attr => {
          textarea.setAttribute(attr.name, attr.value);
        });
        textarea.value = this.input.value;
        if (this.input.parentNode) {
          this.input.parentNode.replaceChild(textarea, this.input);
        }
        this.input = textarea;
      }
      if (!this.input.hasAttribute('rows')) {
        const rows = el.getAttribute('data-rows') || el.getAttribute('rows') ||
                     this.input.getAttribute('data-rows') || this.input.getAttribute('rows') || '3';
        this.input.setAttribute('rows', rows);
      }

      // Auto-resize condicional solo si tiene el atributo correspondiente
      const autoResizeAttr = el.getAttribute('data-auto-resize') ?? el.getAttribute('data-autoresize') ??
                             el.getAttribute('data-autosize') ??
                             this.input.getAttribute('data-auto-resize') ?? this.input.getAttribute('data-autoresize') ??
                             this.input.getAttribute('data-autosize');
      const hasAutoResize = autoResizeAttr !== null && autoResizeAttr !== 'false';
      this._hasAutoResize = hasAutoResize;
      if (this._hasAutoResize) {
        el.classList.add('mtx-text-field--auto-resize');
      }
    }

    // Helper text y Contador de caracteres / palabras
    const helperText = el.getAttribute('data-helper-text') || this.input.getAttribute('data-helper-text');

    const counterAttr = (el.getAttribute('data-counter') || this.input.getAttribute('data-counter') || '').toLowerCase();
    const maxCharsAttr = el.getAttribute('data-max-characters') || el.getAttribute('data-max-chars') ||
                         this.input.getAttribute('data-max-characters') || this.input.getAttribute('data-max-chars') ||
                         (this.input.hasAttribute('maxlength') ? this.input.getAttribute('maxlength') : null);
    const maxWordsAttr = el.getAttribute('data-max-words') || this.input.getAttribute('data-max-words');

    this._maxChars = maxCharsAttr ? parseInt(maxCharsAttr, 10) : null;
    this._maxWords = maxWordsAttr ? parseInt(maxWordsAttr, 10) : null;

    if (counterAttr === 'words' || (!counterAttr && this._maxWords && !this._maxChars)) {
      this._counterType = 'words';
    } else if (counterAttr === 'both' || (this._maxWords && this._maxChars)) {
      this._counterType = 'both';
    } else if (counterAttr || this._maxChars) {
      this._counterType = 'characters';
    } else {
      this._counterType = null;
    }

    const hasCounter = Boolean(this._counterType);
    let support = el.querySelector('.mtx-text-field__supporting-text');

    if ((helperText || hasCounter) && !support) {
      support = document.createElement('div');
      support.className = 'mtx-text-field__supporting-text';
      el.appendChild(support);
    }
    this.support = support;

    if (this.support) {
      let helperEl = this.support.querySelector('.mtx-text-field__helper-text');
      if (!helperEl) {
        helperEl = document.createElement('span');
        helperEl.className = 'mtx-text-field__helper-text';
        const existingText = helperText || (this.support.childNodes.length === 1 && this.support.firstChild.nodeType === Node.TEXT_NODE ? this.support.textContent.trim() : '');
        if (existingText) helperEl.textContent = existingText;
        this.support.textContent = '';
        this.support.appendChild(helperEl);
      }
      this.helperEl = helperEl;

      if (hasCounter) {
        let counterEl = this.support.querySelector('.mtx-text-field__counter');
        if (!counterEl) {
          counterEl = document.createElement('span');
          counterEl.className = 'mtx-text-field__counter';
          counterEl.setAttribute('aria-live', 'polite');
          this.support.appendChild(counterEl);
        }
        this.counterEl = counterEl;
      }
    }

    // Si el elemento es un <select>, agregar la clase mtx-text-field--select e icono chevron
    if (this.input instanceof HTMLSelectElement) {
      el.classList.add('mtx-text-field--select');
      if (!container.querySelector('.mtx-text-field__chevron')) {
        const chevron = document.createElement('span');
        chevron.className = 'mtx-text-field__chevron';
        chevron.innerHTML =
          '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';
        container.appendChild(chevron);
      }
    }
  }

  /**
   * Crea el `fieldset` que dibuja la muesca del borde y sincroniza su
   * contenido con el texto del label.
   */
  _buildOutline() {
    if (this.container.querySelector('.mtx-text-field__outline')) return;

    const outline = document.createElement('fieldset');
    outline.className = 'mtx-text-field__outline';
    outline.setAttribute('aria-hidden', 'true');

    // La muesca (legend + span) solo se crea si hay un label flotante visible.
    // Sin label (o con `--hidden-label`), un fieldset sin legend dibuja un
    // borde completo y limpio, sin la muesca vacía.
    const hasLabel =
      this.label && !this.element.classList.contains('mtx-text-field--hidden-label');
    if (hasLabel) {
      const legend = document.createElement('legend');
      legend.className = 'mtx-text-field__legend';

      const span = document.createElement('span');
      span.textContent = this.label.textContent;
      legend.appendChild(span);
      outline.appendChild(legend);
    }

    this.container.appendChild(outline);
  }

  /**
   * Valor actual del campo.
   *
   * @returns {string} Valor del input.
   */
  get value() {
    return this.input.value;
  }

  /**
   * Establece el valor del campo.
   *
   * @param {string} value Nuevo valor.
   */
  set value(value) {
    if (this._mask) {
      this.input.value = this._formatValue(value != null ? String(value) : '');
    } else {
      this.input.value = value;
    }
    this._syncAria();
    this._updateCounter();
    this._adjustAutoResize();
  }

  /**
   * Obtiene el valor limpio sin caracteres de formato de la máscara.
   *
   * @returns {string} Valor desmascarado.
   */
  get unmaskedValue() {
    if (!this._mask) return this.input.value;
    if (this._maskType === 'currency') {
      return this._unmaskCurrency(this.input.value);
    }
    return this._unmaskPattern(this.input.value, this._pattern);
  }

  /**
   * Establece el valor limpio y lo formatea automáticamente según la máscara.
   *
   * @param {string|number} val Valor sin formato.
   */
  set unmaskedValue(val) {
    if (!this._mask) {
      this.value = val;
      return;
    }
    const str = val == null ? '' : String(val);
    this.value = this._formatValue(str);
  }

  /**
   * Indica si la máscara actual ha sido completada en todos sus slots.
   *
   * @returns {boolean} `true` si está completa.
   */
  get isMaskComplete() {
    if (!this._mask) return true;
    if (this._maskType === 'currency') {
      return Boolean(this.unmaskedValue && parseFloat(this.unmaskedValue) > 0);
    }
    if (!this._pattern) return true;
    const requiredSlots = (this._pattern.match(/[0aA*]/g) || []).length;
    return this.unmaskedValue.length >= requiredSlots;
  }

  /**
   * Indica si el campo está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.input.disabled;
  }

  /**
   * Deshabilita el campo.
   */
  disable() {
    this.input.disabled = true;
    this._syncActionsDisabled();
  }

  /**
   * Habilita el campo.
   */
  enable() {
    this.input.disabled = false;
    this._syncActionsDisabled();
  }

  /**
   * Indica si la contraseña se muestra en claro (solo con `data-password-toggle`).
   *
   * @returns {boolean} `true` si el input es de tipo texto.
   */
  get passwordVisible() {
    return Boolean(this.passwordToggle) && this.input.type === 'text';
  }

  /**
   * Muestra u oculta la contraseña y sincroniza el botón (icono y `aria-pressed`).
   *
   * @param {boolean} [force] Estado deseado; si se omite, alterna.
   * @returns {boolean} `true` si la contraseña queda visible.
   */
  togglePasswordVisibility(force) {
    if (!this.passwordToggle) return false;
    const show = typeof force === 'boolean' ? force : this.input.type === 'password';
    const hadFocus = document.activeElement === this.input;
    const { selectionStart, selectionEnd } = this.input;
    this.input.type = show ? 'text' : 'password';
    if (hadFocus && selectionStart !== null) {
      try { this.input.setSelectionRange(selectionStart, selectionEnd); } catch (e) { /* sin selección */ }
    }
    this._syncPasswordToggle();
    emit(this.element, 'mtx:text-field:password-visibility', { visible: show },
      { aliases: ['mtx:password-visibility'] });
    return show;
  }

  /**
   * Crea un adorno interactivo (IconButton edge-start/edge-end) dentro del contenedor.
   *
   * @param {'start'|'end'} position Posición del adorno.
   * @param {string} icon Nombre del Material Icon.
   * @param {string|null} label Nombre accesible del botón.
   * @returns {HTMLButtonElement} Botón creado.
   * @private
   */
  _createActionAdornment(position, icon, label) {
    const adornment = document.createElement('span');
    adornment.className =
      `mtx-text-field__adornment mtx-text-field__adornment--${position} mtx-text-field__adornment--action`;

    const button = document.createElement('button');
    button.type = 'button';
    const isSmall = this.element.classList.contains('mtx-text-field--small');
    button.className = `mtx-icon-button mtx-text-field__action mtx-text-field__action--${position}` +
      (isSmall ? ' mtx-icon-button--small' : '');
    button.setAttribute('data-mtx', 'icon-button');
    if (label) button.setAttribute('aria-label', label);

    const iconEl = document.createElement('span');
    iconEl.className = 'material-icons';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = icon;
    button.appendChild(iconEl);
    adornment.appendChild(button);

    if (position === 'start') this.container.insertBefore(adornment, this.container.firstChild);
    else this.container.appendChild(adornment);

    this._bindActionButton(button, position);
    return button;
  }

  /**
   * Enlaza clic y mousedown de un botón de adorno (liberados en `destroy()`).
   *
   * @param {HTMLButtonElement} button Botón del adorno.
   * @param {'start'|'end'} position Posición del adorno.
   * @private
   */
  _bindActionButton(button, position) {
    this.listen(button, 'click', () => {
      if (button === this.passwordToggle) {
        this.togglePasswordVisibility();
        return;
      }
      emit(this.element, 'mtx:text-field:adornment-click', { position, button, input: this.input },
        { aliases: ['mtx:adornment-click'] });
    });
    // Evita que el clic con ratón robe el foco del input (patrón MUI onMouseDown).
    this.listen(button, 'mousedown', (event) => event.preventDefault());

    // Ripple y estados de IconButton cuando el componente está registrado.
    initElement(button, 'icon-button');
  }

  /**
   * Refleja en el botón de contraseña el estado actual (icono, aria-pressed y nombre i18n).
   * @private
   */
  _syncPasswordToggle() {
    const button = this.passwordToggle;
    if (!button) return;
    const visible = this.input.type === 'text';
    const custom = this.element.getAttribute('data-password-toggle-label') ||
      this.input.getAttribute('data-password-toggle-label');
    const label = custom || t('textField', 'showPassword', null, 'Show password', getComponentLocale(this.element));
    button.setAttribute('aria-pressed', String(visible));
    button.setAttribute('aria-label', label);
    const iconEl = button.querySelector('.material-icons');
    if (iconEl) iconEl.textContent = visible ? 'visibility_off' : 'visibility';
  }

  /**
   * Sincroniza el estado deshabilitado de los adornos interactivos con el input.
   * @private
   */
  _syncActionsDisabled() {
    [this.startAction, this.endAction, this.passwordToggle].forEach((button) => {
      if (button) button.disabled = this.input.disabled;
    });
  }

  /**
   * Libera los listeners de la instancia (input, botones y documento).
   */
  destroy() {
    super.destroy();
  }

  /**
   * Enfoca el input.
   */
  focus() {
    this.input.focus();
  }

  /**
   * Muestra el estado de error.
   *
   * @param {string|boolean} message Mensaje de error, `true` para error sin mensaje
   *   (conserva el helper text) o cadena vacía/`false` para limpiar.
   */
  setError(message) {
    if (!message) {
      this.clearError();
      return;
    }

    this._hasCustomError = true;
    this.element.classList.add('mtx-text-field--error');
    this.input.setAttribute('aria-invalid', 'true');
    if (message === true) {
      // Error booleano (prop `error` de MUI): el helper existente se pinta en rojo.
      this._syncDescribedBy();
      return;
    }
    const errorId = `${this.input.id}-error`;

    if (!this.support) {
      this.support = document.createElement('div');
      this.support.className = 'mtx-text-field__supporting-text';
      this.element.appendChild(this.support);
      this._createdSupport = true;
    }
    this.support.id = errorId;
    this.support.dataset.mtxError = '';

    if (!this.helperEl) {
      this.helperEl = document.createElement('span');
      this.helperEl.className = 'mtx-text-field__helper-text';
      this.support.insertBefore(this.helperEl, this.support.firstChild);
    }

    this.helperEl.id = errorId;
    this.helperEl.textContent = message;
    this.helperEl.dataset.mtxError = '';
    this._syncDescribedBy();
  }

  /**
   * Limpia el estado de error.
   */
  clearError() {
    this._hasCustomError = false;
    this.element.classList.remove('mtx-text-field--error');
    this.input.removeAttribute('aria-invalid');

    if (this.support) {
      if (this._createdSupport && !this.counterEl) {
        this.support.remove();
        this.support = null;
        this.helperEl = null;
        this._createdSupport = false;
      } else {
        this.support.id = this._helperId || '';
        delete this.support.dataset.mtxError;
        if (this.helperEl) {
          this.helperEl.textContent = this._helperText || '';
          this.helperEl.id = this._helperId || '';
          delete this.helperEl.dataset.mtxError;
        } else {
          this.support.textContent = this._helperText || '';
        }
      }
    }

    this._updateCounter();
    this._syncDescribedBy();
  }

  /** Sincroniza los ids de ayuda y error sin borrar referencias externas. */
  _syncDescribedBy() {
    const ids = [...this._baseDescribedBy];
    if (this.support && this.support.id) ids.push(this.support.id);
    const unique = [...new Set(ids)];
    if (unique.length) this.input.setAttribute('aria-describedby', unique.join(' '));
    else this.input.removeAttribute('aria-describedby');
  }

  /** Quita el foco del control. */
  blur() {
    this.input.blur();
  }

  /**
   * Sincroniza la clase de estado si hay un valor, un placeholder de texto visible o tipo fecha/hora.
   */
  _syncAria() {
    const rawVal = this.input.value;
    const hasValue = Boolean(rawVal && String(rawVal).trim() !== '');
    const placeholder = this.input.getAttribute('placeholder');
    const hasPlaceholder = Boolean(placeholder && placeholder.trim() !== '' && placeholder.trim() !== ' ');
    const inputType = (this.input.getAttribute('type') || '').toLowerCase();
    const isDateTime = ['date', 'time', 'datetime-local', 'month', 'week'].includes(inputType);
    const isSelect = this.input instanceof HTMLSelectElement;

    if (hasValue || hasPlaceholder || isDateTime || isSelect) {
      this.element.classList.add('mtx-text-field--has-value');
    } else {
      this.element.classList.remove('mtx-text-field--has-value');
    }
  }

  /**
   * Determina si una cadena corresponde a una URL o ruta de imagen.
   *
   * @param {string} src Ruta o valor a evaluar.
   * @returns {boolean} `true` si es una imagen.
   * @private
   */
  _isImageUrl(src) {
    return typeof src === 'string' && (
      src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('/') ||
      src.startsWith('./') ||
      src.startsWith('../') ||
      src.startsWith('data:image/') ||
      /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(src)
    );
  }

  /**
   * Crea un elemento <img> para URLs o un <span> con Material Icons.
   *
   * @param {string} val Nombre del icono o URL de la imagen.
   * @param {string} className Clases CSS a aplicar.
   * @param {string} [defaultIconClass] Clase por defecto para iconos de texto.
   * @returns {HTMLElement|null} Elemento DOM generado.
   * @private
   */
  _createIconOrImage(val, className, defaultIconClass) {
    if (!val) return null;
    if (this._isImageUrl(val)) {
      const img = document.createElement('img');
      img.src = val;
      img.alt = '';
      img.className = className ? `${className} mtx-text-field__adornment--image` : 'mtx-text-field__adornment--image';
      return img;
    }
    const span = document.createElement('span');
    span.className = className ? `${className} ${defaultIconClass || 'material-icons'}` : (defaultIconClass || 'material-icons');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = val;
    return span;
  }

  /**
   * Inicializa el sistema de máscaras declarativas si data-mask está presente.
   * @private
   */
  _initMask() {
    const el = this.element;
    const maskAttr = el.getAttribute('data-mask') || this.input.getAttribute('data-mask');
    if (!maskAttr) {
      this._mask = null;
      return;
    }

    this._mask = maskAttr.trim();
    const PRESETS = {
      'credit-card': '0000 0000 0000 0000',
      'date': '00/00/0000',
      'date-short': '00/00',
      'time': '00:00',
      'time-ampm': '00:00 AA',
      'time-seconds': '00:00:00',
      'phone': '(000) 000-0000',
      'phone-intl': '+00 (000) 000-0000',
      'cpf': '000.000.000-00',
      'cnpj': '00.000.000/0000-00',
      'zip': '00000-000',
      'postal-code': '00000-0000'
    };

    if (this._mask === 'currency' || this._mask === 'money') {
      this._maskType = 'currency';
      this._currencyOptions = {
        prefix: el.getAttribute('data-currency-prefix') ?? this.input.getAttribute('data-currency-prefix') ?? '$ ',
        suffix: el.getAttribute('data-currency-suffix') ?? this.input.getAttribute('data-currency-suffix') ?? '',
        thousands: el.getAttribute('data-thousands') ?? this.input.getAttribute('data-thousands') ?? ',',
        decimal: el.getAttribute('data-decimal') ?? this.input.getAttribute('data-decimal') ?? '.',
        precision: parseInt(el.getAttribute('data-precision') ?? this.input.getAttribute('data-precision') ?? '2', 10)
      };
    } else {
      this._maskType = 'pattern';
      this._pattern = PRESETS[this._mask.toLowerCase()] || this._mask;
    }

    // Si ya tenía valor inicial, formatearlo
    if (this.input.value) {
      this.input.value = this._formatValue(this.input.value);
    }
  }

  /**
   * Formatea un valor según la máscara configurada.
   *
   * @param {string} val Valor a formatear.
   * @returns {string} Valor formateado.
   * @private
   */
  _formatValue(val) {
    if (!this._mask) return val;
    if (this._maskType === 'currency') {
      return this._applyCurrencyMask(val, this._currencyOptions);
    }
    return this._applyPatternMask(val, this._pattern);
  }

  /**
   * Evalúa si un carácter es un token de slot en la máscara.
   *
   * @param {string} char Carácter.
   * @returns {boolean} `true` si es token.
   * @private
   */
  _isSlotToken(char) {
    return char === '0' || char === 'a' || char === 'A' || char === '*';
  }

  /**
   * Evalúa si un carácter coincide con el token de slot.
   *
   * @param {string} token Token de la máscara.
   * @param {string} char Carácter a validar.
   * @returns {boolean} `true` si coincide.
   * @private
   */
  _matchesSlot(token, char) {
    if (!char) return false;
    if (token === '0') return /\d/.test(char);
    if (token === 'a' || token === 'A') return /[a-zA-Z]/.test(char);
    if (token === '*') return /[0-9a-zA-Z]/.test(char);
    return false;
  }

  /**
   * Aplica la máscara basada en patrón al texto.
   *
   * @param {string} rawText Texto sin formatear o parcialmente formateado.
   * @param {string} pattern Patrón de máscara.
   * @returns {string} Texto formateado.
   * @private
   */
  _applyPatternMask(rawText, pattern) {
    if (!pattern || !rawText) return '';

    let rawChars = '';
    for (let i = 0; i < rawText.length; i++) {
      const ch = rawText[i];
      if (/[0-9a-zA-Z]/.test(ch)) {
        rawChars += ch;
      }
    }

    if (!rawChars) return '';

    let rawIdx = 0;
    let formatted = '';
    let hasSlotFilled = false;

    for (let pIdx = 0; pIdx < pattern.length && rawIdx < rawChars.length; pIdx++) {
      const pChar = pattern[pIdx];

      if (this._isSlotToken(pChar)) {
        while (rawIdx < rawChars.length && !this._matchesSlot(pChar, rawChars[rawIdx])) {
          rawIdx++;
        }
        if (rawIdx < rawChars.length) {
          let ch = rawChars[rawIdx++];
          if (pChar === 'A') ch = ch.toUpperCase();
          else if (pChar === 'a') ch = ch.toLowerCase();
          formatted += ch;
          hasSlotFilled = true;
        }
      } else {
        formatted += pChar;
      }
    }

    if (hasSlotFilled) {
      let nextPIdx = formatted.length;
      while (nextPIdx < pattern.length && !this._isSlotToken(pattern[nextPIdx])) {
        formatted += pattern[nextPIdx++];
      }
    }

    return formatted;
  }

  /**
   * Extrae los caracteres de slots sin literales.
   *
   * @param {string} formattedValue Valor formateado.
   * @param {string} pattern Patrón.
   * @returns {string} Cadena limpia.
   * @private
   */
  _unmaskPattern(formattedValue, pattern) {
    if (!formattedValue || !pattern) return formattedValue || '';
    let unmasked = '';
    let pIdx = 0;
    for (let i = 0; i < formattedValue.length && pIdx < pattern.length; i++) {
      const ch = formattedValue[i];
      const pChar = pattern[pIdx];
      if (this._isSlotToken(pChar)) {
        if (this._matchesSlot(pChar, ch)) {
          unmasked += ch;
          pIdx++;
        }
      } else {
        if (ch === pChar) {
          pIdx++;
        }
      }
    }
    return unmasked;
  }

  /**
   * Aplica formato monetario con prefijo, sufijo y separadores.
   *
   * @param {string} value Valor de entrada.
   * @param {Object} opts Opciones de moneda.
   * @returns {string} Valor formateado.
   * @private
   */
  _applyCurrencyMask(value, opts) {
    if (!value) return '';
    const digitsOnly = String(value).replace(/\D/g, '');
    if (!digitsOnly) return '';

    const precision = opts.precision;
    let intPart = '';
    let decPart = '';

    if (precision > 0) {
      const padded = digitsOnly.padStart(precision + 1, '0');
      intPart = padded.slice(0, padded.length - precision).replace(/^0+(?=\d)/, '');
      decPart = padded.slice(padded.length - precision);
    } else {
      intPart = digitsOnly.replace(/^0+(?=\d)/, '') || '0';
    }

    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousands);
    const numString = precision > 0 ? `${formattedInt}${opts.decimal}${decPart}` : formattedInt;

    return `${opts.prefix}${numString}${opts.suffix}`;
  }

  /**
   * Extrae el valor numérico limpio de una cadena de moneda.
   *
   * @param {string} value Cadena formateada.
   * @returns {string} Número como string (ej. "1250.50").
   * @private
   */
  _unmaskCurrency(value) {
    if (!value) return '';
    const digitsOnly = String(value).replace(/\D/g, '');
    if (!digitsOnly) return '';
    const precision = this._currencyOptions?.precision ?? 2;
    if (precision > 0) {
      const padded = digitsOnly.padStart(precision + 1, '0');
      const intPart = padded.slice(0, padded.length - precision).replace(/^0+(?=\d)/, '');
      const decPart = padded.slice(padded.length - precision);
      return `${intPart}.${decPart}`;
    }
    return digitsOnly;
  }

  /**
   * Cuenta cuántos caracteres pertenecen a slots antes de una posición dada.
   *
   * @param {string} str Subcadena.
   * @returns {number} Conteo.
   * @private
   */
  _countSlotChars(str) {
    return (str.match(/[0-9a-zA-Z]/g) || []).length;
  }

  /**
   * Calcula la posición del cursor en la cadena formateada basándose en el conteo de slots.
   *
   * @param {string} formatted Cadena formateada.
   * @param {number} targetSlotCount Cantidad de caracteres de slot.
   * @returns {number} Índice del cursor.
   * @private
   */
  _getCursorIndexFromSlotCount(formatted, targetSlotCount) {
    let slotsFound = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/[0-9a-zA-Z]/.test(formatted[i])) {
        slotsFound++;
      }
      if (slotsFound === targetSlotCount) {
        return i + 1;
      }
    }
    return formatted.length;
  }

  /**
   * Gestiona el evento de entrada para actualizar la máscara y preservar la posición del cursor.
   *
   * @param {Event} e Evento de input.
   * @private
   */
  _handleMaskInput(e) {
    if (!this._mask) return;

    const input = this.input;
    const oldVal = input.value;
    const cursor = input.selectionStart || 0;

    if (this._maskType === 'currency') {
      const formatted = this._formatValue(oldVal);
      input.value = formatted;
      const suffixLen = (this._currencyOptions?.suffix || '').length;
      const endPos = Math.max(0, formatted.length - suffixLen);
      input.setSelectionRange(endPos, endPos);
    } else {
      const slotsBefore = this._countSlotChars(oldVal.slice(0, cursor));
      const formatted = this._applyPatternMask(oldVal, this._pattern);
      input.value = formatted;

      const newCursor = this._getCursorIndexFromSlotCount(formatted, slotsBefore);
      input.setSelectionRange(newCursor, newCursor);
    }
  }

  /**
   * Cuenta las palabras contenidas en una cadena de texto.
   *
   * @param {string} text Cadena a evaluar.
   * @returns {number} Número de palabras.
   * @private
   */
  _countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }

  /**
   * Actualiza el contenido visual del contador y valida límites máximos.
   * @private
   */
  _updateCounter() {
    if (!this.counterEl) return;

    const text = this.input.value || '';
    const charCount = text.length;
    const wordCount = this._countWords(text);

    let isOverMax = false;
    let counterText = '';

    const locale = getComponentLocale(this.element);
    if (this._counterType === 'both') {
      const words = this._maxWords ? `${wordCount}/${this._maxWords}` : `${wordCount}`;
      const chars = this._maxChars ? `${charCount}/${this._maxChars}` : `${charCount}`;
      const wordPart = t('textField', 'counterWordsShort', { value: words }, '{value} words', locale);
      const charPart = t('textField', 'counterCharsShort', { value: chars }, '{value} chars', locale);
      counterText = `${wordPart} | ${charPart}`;
      if (this._maxWords && wordCount > this._maxWords) isOverMax = true;
      if (this._maxChars && charCount > this._maxChars) isOverMax = true;
    } else if (this._counterType === 'words') {
      counterText = this._maxWords
        ? `${wordCount} / ${this._maxWords}`
        : t('textField', 'counterWords', { count: wordCount }, '{count} words', locale);
      if (this._maxWords && wordCount > this._maxWords) isOverMax = true;
    } else {
      counterText = this._maxChars ? `${charCount} / ${this._maxChars}` : `${charCount}`;
      if (this._maxChars && charCount > this._maxChars) isOverMax = true;
    }

    this.counterEl.textContent = counterText;
    this.counterEl.classList.toggle('mtx-text-field__counter--error', isOverMax);

    if (isOverMax) {
      this.element.classList.add('mtx-text-field--error');
      this.input.setAttribute('aria-invalid', 'true');
    } else if (!this._hasCustomError) {
      this.element.classList.remove('mtx-text-field--error');
      this.input.removeAttribute('aria-invalid');
    }
  }

  /**
   * Ajusta automáticamente la altura del textarea según su contenido solo si tiene auto-resize activo.
   * @private
   */
  _adjustAutoResize() {
    if (!this._hasAutoResize || !(this.input instanceof HTMLTextAreaElement)) {
      return;
    }

    const input = this.input;
    input.style.height = 'auto';

    const scrollHeight = input.scrollHeight;
    if (scrollHeight <= 0) return;

    // Límite opcional de filas máximas (data-max-rows) antes de activar scroll vertical
    const maxRowsAttr = this.element.getAttribute('data-max-rows') || input.getAttribute('data-max-rows');
    if (maxRowsAttr) {
      const maxRows = parseInt(maxRowsAttr, 10);
      if (!isNaN(maxRows) && maxRows > 0) {
        const computed = typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(input) : null;
        const lineHeight = computed ? (parseFloat(computed.lineHeight) || 24) : 24;
        const paddingTop = computed ? (parseFloat(computed.paddingTop) || 0) : 0;
        const paddingBottom = computed ? (parseFloat(computed.paddingBottom) || 0) : 0;
        const maxHeight = (lineHeight * maxRows) + paddingTop + paddingBottom;

        if (scrollHeight > maxHeight) {
          input.style.height = `${maxHeight}px`;
          input.style.overflowY = 'auto';
          return;
        }
      }
    }

    input.style.height = `${scrollHeight}px`;
    input.style.overflowY = 'hidden';
  }
}

registerComponent('text-field', TextField);
registerComponent('input', TextField);
registerComponent('textarea', TextField);