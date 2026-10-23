import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { uniqueId } from '../../core/id.js';


/**
 * Interpreta el atributo `data-error`: vacío o `"true"` activa el estado sin
 * mensaje; `"false"` o ausente lo desactiva; cualquier otro texto es el mensaje.
 *
 * @param {string|null} value Valor del atributo.
 * @returns {{error: boolean, message: string}} Estado y mensaje.
 */
export function parseErrorAttribute(value) {
  if (value === null || value === undefined || value === 'false') {
    return { error: false, message: '' };
  }
  if (value === '' || value === 'true') return { error: true, message: '' };
  return { error: true, message: String(value) };
}

/**
 * Texto de ayuda o de error bajo un control de formulario (FormHelperText de MUI).
 *
 * Uso declarativo:
 * ```html
 * <p class="mtx-form-helper-text" data-mtx="form-helper-text" data-error>Campo obligatorio</p>
 * ```
 */
export class FormHelperText extends ComponentBase {
  /**
   * @param {HTMLElement} element Elemento del texto de ayuda.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-form-helper-text');
    if (!element.id) element.id = uniqueId('mtx-form-helper-text');
    const { error } = parseErrorAttribute(element.getAttribute('data-error'));
    this.error = error;
  }

  /** @returns {boolean} `true` si el texto está en estado de error. */
  get error() {
    return this.element.classList.contains('mtx-form-helper-text--error');
  }

  /**
   * Activa o desactiva el estado de error.
   * @param {boolean} value Nuevo estado.
   */
  set error(value) {
    this.element.classList.toggle('mtx-form-helper-text--error', Boolean(value));
  }

  /**
   * Reemplaza el texto visible.
   * @param {string} text Nuevo texto.
   */
  setText(text) {
    this.element.textContent = text == null ? '' : String(text);
  }
}

/**
 * Gestiona el texto de ayuda/error de un control (Checkbox, Switch, RadioGroup):
 * envuelve el control en `.mtx-form-control`, crea `.mtx-form-helper-text`
 * y mantiene `aria-describedby` y `aria-invalid` sincronizados.
 */
export class HelperTextController {
  /**
   * @param {object} options Opciones.
   * @param {HTMLElement} options.host Elemento visual que se envuelve (label o grupo).
   * @param {HTMLElement} options.target Elemento que recibe aria-describedby/aria-invalid.
   * @param {string} [options.helperText] Texto de ayuda inicial.
   * @param {string|null} [options.errorAttr] Valor inicial de `data-error`.
   */
  constructor({ host, target, helperText = '', errorAttr = null }) {
    this.host = host;
    this.target = target;
    this.wrapper = host.parentElement && host.parentElement.classList.contains('mtx-form-control')
      ? host.parentElement
      : null;
    this.helperEl = this.wrapper
      ? this.wrapper.querySelector(':scope > .mtx-form-helper-text')
      : null;
    this._helperText = helperText || (this.helperEl ? this.helperEl.textContent : '');
    this._error = false;
    this._baseDescribedBy = (target.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter(Boolean);

    if (this.helperEl) {
      this._prepareHelper(this.helperEl);
      if (this.helperEl.classList.contains('mtx-form-helper-text--error')) this._error = true;
    }
    if (helperText) this.setHelperText(helperText);

    const { error, message } = parseErrorAttribute(errorAttr);
    if (error) this.setError(message || true);
    else this._sync();
  }

  /** @returns {boolean} `true` si el control está en estado de error. */
  get error() {
    return this._error;
  }

  /**
   * Cambia el texto de ayuda base (se muestra cuando no hay mensaje de error).
   * @param {string} text Texto de ayuda; vacío lo elimina.
   */
  setHelperText(text) {
    this._helperText = text ? String(text) : '';
    if (!this._errorMessage) this._render(this._helperText);
    this._sync();
  }

  /**
   * Activa el estado de error.
   * @param {string|boolean} [message=true] Mensaje que reemplaza al texto de ayuda, o `true` sin mensaje.
   */
  setError(message = true) {
    if (message === false || message === null) {
      this.clearError();
      return;
    }
    this._error = true;
    this._errorMessage = typeof message === 'string' ? message : '';
    this._render(this._errorMessage || this._helperText);
    this._sync();
  }

  /** Limpia el estado de error y restaura el texto de ayuda. */
  clearError() {
    this._error = false;
    this._errorMessage = '';
    this._render(this._helperText);
    this._sync();
  }

  /**
   * Sincroniza el estado deshabilitado del contenedor.
   * @param {boolean} disabled Estado.
   */
  setDisabled(disabled) {
    this._disabled = Boolean(disabled);
    if (this.wrapper) this.wrapper.classList.toggle('mtx-form-control--disabled', this._disabled);
    this._syncDisabled();
  }

  /**
   * Marca el texto de ayuda con `aria-disabled` cuando el control está deshabilitado,
   * para que su color atenuado (text-disabled) se trate como contenido deshabilitado.
   * @private
   */
  _syncDisabled() {
    if (!this.helperEl) return;
    const disabled = this._disabled ?? this.target.disabled === true;
    if (disabled) this.helperEl.setAttribute('aria-disabled', 'true');
    else this.helperEl.removeAttribute('aria-disabled');
  }

  /** Crea el contenedor `.mtx-form-control` si aún no existe. */
  ensureWrapper() {
    if (this.wrapper) return this.wrapper;
    const wrapper = document.createElement('div');
    wrapper.className = 'mtx-form-control';
    if (this.host.parentNode) this.host.parentNode.insertBefore(wrapper, this.host);
    wrapper.appendChild(this.host);
    this.wrapper = wrapper;
    return wrapper;
  }

  /** @private */
  _prepareHelper(el) {
    el.classList.add('mtx-form-helper-text');
    if (!el.id) el.id = uniqueId('mtx-form-helper-text');
  }

  /** @private */
  _render(text) {
    if (!text) {
      if (this.helperEl && this.helperEl.dataset.mtxGenerated === '') {
        this.helperEl.remove();
        this.helperEl = null;
      } else if (this.helperEl) {
        this.helperEl.textContent = '';
      }
      return;
    }
    if (!this.helperEl) {
      const wrapper = this.ensureWrapper();
      const p = document.createElement('p');
      p.dataset.mtxGenerated = '';
      this._prepareHelper(p);
      wrapper.appendChild(p);
      this.helperEl = p;
    }
    this.helperEl.textContent = text;
  }

  /** @private */
  _sync() {
    if (this.helperEl) {
      this.helperEl.classList.toggle('mtx-form-helper-text--error', this._error);
    }
    this._syncDisabled();
    if (this.wrapper) this.wrapper.classList.toggle('mtx-form-control--error', this._error);

    const ids = [...this._baseDescribedBy];
    if (this.helperEl && this.helperEl.id && this.helperEl.textContent) ids.push(this.helperEl.id);
    const unique = [...new Set(ids)];
    if (unique.length) this.target.setAttribute('aria-describedby', unique.join(' '));
    else this.target.removeAttribute('aria-describedby');

    // Solo retira aria-invalid si lo puso este controlador (respeta el marcado del autor).
    if (this._error) {
      this.target.setAttribute('aria-invalid', 'true');
      this._ownsInvalid = true;
    } else if (this._ownsInvalid) {
      this.target.removeAttribute('aria-invalid');
      this._ownsInvalid = false;
    }
  }
}

registerComponent('form-helper-text', FormHelperText);
