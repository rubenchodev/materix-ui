import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance } from '../../core/registry.js';
import { onClickAway } from '../../core/click-away-listener.js';
import { pushLayer, removeLayer } from '../../core/layers.js';
import { emit } from '../../core/events.js';

const ANCHORS = ['bottom-left', 'bottom-center', 'bottom-right', 'top-left', 'top-center', 'top-right'];


/**
 * Normaliza una duración en milisegundos.
 *
 * @param {*} value Valor recibido (`number`, texto, `'none'` o `null`).
 * @returns {number|null} Milisegundos o `null` si no hay auto-cierre.
 */
function parseDuration(value) {
  if (value === null || value === undefined || value === 'none' || value === false) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/**
 * Representa un snackbar de Materix UI.
 *
 * Sigue el patrón de `Snackbar` de MUI: mensaje breve y flotante con una acción
 * opcional que se cierra solo (con `data-duration`), con Escape o por acción.
 *
 * Atributos `data-*`:
 * - `data-message`: texto del mensaje (genera `.mtx-snackbar__message`).
 * - `data-action`: texto del botón de acción (genera `.mtx-snackbar__action`).
 * - `data-duration`: milisegundos de auto-cierre; sin el atributo (o `none`) no se cierra solo.
 * - `data-open`: muestra el snackbar al inicializarse.
 * - `data-anchor`: `bottom-center` (por defecto), `bottom-left`, `bottom-right`,
 *   `top-center`, `top-left` o `top-right`.
 * - `data-role`: rol del mensaje (`alert` por defecto, `status` para avisos no urgentes).
 * - `data-close-on-action`: cierra el snackbar al pulsar la acción.
 *
 * Uso declarativo:
 * ```html
 * <div data-mtx="snackbar" data-message="Archivo guardado" data-action="Deshacer" data-duration="4000"></div>
 * ```
 */
export class Snackbar extends ComponentBase {
  /**
   * Crea una instancia del snackbar.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    if (!element.classList.contains('mtx-snackbar')) {
      element.classList.add('mtx-snackbar');
    }

    this.duration = parseDuration(element.getAttribute('data-duration'));
    this._activeDuration = this.duration;
    this.anchor = element.getAttribute('data-anchor') || 'bottom-center';

    const actionText = element.getAttribute('data-action');
    if (actionText && !element.querySelector('.mtx-snackbar__action')) {
      this._createAction().textContent = actionText;
    }

    const message = element.getAttribute('data-message');
    if (message && !element.querySelector('.mtx-snackbar__message')) {
      this._createMessage().textContent = message;
    }
    this.message = element.querySelector('.mtx-snackbar__message');
    this._applyMessageRole();

    this._handleAction = (event) => this._onAction(event);
    this._bindAction(element.querySelector('.mtx-snackbar__action'));

    this._handlePause = () => this._clearTimer();
    this._handleResume = () => this._startTimer();
    element.addEventListener('mouseenter', this._handlePause);
    element.addEventListener('mouseleave', this._handleResume);
    element.addEventListener('focusin', this._handlePause);
    element.addEventListener('focusout', this._handleResume);

    if (element.hasAttribute('data-open')) {
      this.open();
    }
  }

  /** @returns {boolean} `true` cuando está visible. */
  get isOpen() {
    return this.element.classList.contains('mtx-snackbar--open');
  }

  /** @returns {string} Anclaje actual (`bottom-center`, `top-right`…). */
  get anchor() {
    return this._anchor;
  }

  /** @param {string} value Anclaje; valores no válidos usan `bottom-center`. */
  set anchor(value) {
    const next = ANCHORS.includes(value) ? value : 'bottom-center';
    ANCHORS.forEach((name) => this.element.classList.remove(`mtx-snackbar--${name}`));
    this.element.classList.add(`mtx-snackbar--${next}`);
    this._anchor = next;
  }

  /**
   * Cambia el texto del mensaje (crea `.mtx-snackbar__message` si no existe).
   *
   * @param {string} text Texto plano del mensaje.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setMessage(text) {
    if (!this.message) {
      this.message = this._createMessage();
      this._applyMessageRole();
    }
    this.message.textContent = text == null ? '' : String(text);
    return this;
  }

  /**
   * Cambia, muestra u oculta la acción.
   *
   * @param {string|null|false} label Texto del botón; `null`/`false`/`''` la oculta.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  setAction(label) {
    if (!label) {
      if (this.action) this.action.hidden = true;
      return this;
    }
    if (!this.action) this._bindAction(this._createAction());
    this.action.textContent = String(label);
    this.action.hidden = false;
    return this;
  }

  /**
   * Muestra el snackbar. Si ya está abierto, actualiza el contenido y reinicia el temporizador.
   *
   * @param {Object} [options] Contenido de esta apertura.
   * @param {string} [options.message] Texto del mensaje.
   * @param {string|null|false} [options.action] Texto de la acción; `null`/`false` la oculta.
   * @param {Function} [options.onAction] Se ejecuta al pulsar la acción y después cierra (`reason: 'action'`).
   * @param {number|null|'none'} [options.duration] Auto-cierre solo para esta apertura.
   * @returns {Snackbar} La instancia, para encadenar.
   */
  open(options = {}) {
    const opts = options && typeof options === 'object' && !(options instanceof Event) ? options : {};
    if (Object.prototype.hasOwnProperty.call(opts, 'message')) this.setMessage(opts.message);
    if (Object.prototype.hasOwnProperty.call(opts, 'action')) this.setAction(opts.action);
    this._onActionCallback = typeof opts.onAction === 'function' ? opts.onAction : null;
    this._activeDuration = Object.prototype.hasOwnProperty.call(opts, 'duration')
      ? parseDuration(opts.duration)
      : this.duration;

    // Prioridad mínima en la pila de capas: Escape solo lo cierra sin diálogos, menús ni popovers encima.
    pushLayer(this, { kind: 'snackbar', nodes: this.element, onEscape: () => this.close('escapeKeyDown') });

    if (this.isOpen) {
      this._startTimer();
      return this;
    }
    this.element.classList.add('mtx-snackbar--open');
    this._clickAwayCleanup = onClickAway(this.element, () => this.close('clickaway'));
    this._startTimer();
    emit(this.element, 'mtx:snackbar:open');
    return this;
  }

  /**
   * Oculta el snackbar.
   *
   * @param {string} [reason='programmatic'] Motivo: `timeout`, `clickaway`, `escapeKeyDown`, `action` o propio.
   */
  close(reason = 'programmatic') {
    if (!this.isOpen) return;
    this.element.classList.remove('mtx-snackbar--open');
    removeLayer(this);
    if (this._clickAwayCleanup) this._clickAwayCleanup();
    this._clickAwayCleanup = null;
    this._clearTimer();
    emit(this.element, 'mtx:snackbar:close', { reason });
  }

  /** Inicia el autocierre si hay duración activa. */
  _startTimer() {
    this._clearTimer();
    if (this._activeDuration === null || !this.isOpen) return;
    this._timer = setTimeout(() => this.close('timeout'), this._activeDuration);
  }

  /** Cancela el temporizador activo. */
  _clearTimer() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = null;
  }

  /**
   * Crea el nodo del mensaje al inicio del snackbar.
   * @returns {HTMLElement} Mensaje creado.
   */
  _createMessage() {
    const msg = document.createElement('div');
    msg.className = 'mtx-snackbar__message';
    this.element.insertBefore(msg, this.element.firstChild);
    return msg;
  }

  /**
   * Crea el botón de acción al final del snackbar.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createAction() {
    const actBtn = document.createElement('button');
    actBtn.type = 'button';
    actBtn.className = 'mtx-snackbar__action';
    this.element.appendChild(actBtn);
    return actBtn;
  }

  /** Aplica el rol vivo al mensaje (`data-role` o `alert`). */
  _applyMessageRole() {
    if (this.message && !this.message.hasAttribute('role')) {
      this.message.setAttribute('role', this.element.getAttribute('data-role') || 'alert');
    }
  }

  /**
   * Conecta el botón de acción.
   * @param {HTMLElement|null} action Botón de acción.
   */
  _bindAction(action) {
    if (!action) return;
    if (action.tagName === 'BUTTON' && !action.getAttribute('type')) action.type = 'button';
    action.addEventListener('click', this._handleAction);
    this.action = action;
  }

  /**
   * Gestiona el clic en la acción: emite `mtx:snackbar:action` y cierra si corresponde.
   * @param {MouseEvent} event Evento de clic.
   */
  _onAction(event) {
    const callback = this._onActionCallback;
    emit(this.element, 'mtx:snackbar:action');
    if (callback) {
      this._onActionCallback = null;
      callback(event, this);
      this.close('action');
    } else if (this.element.hasAttribute('data-close-on-action')) {
      this.close('action');
    }
  }

  /**
   * Cierra el snackbar, cancela el temporizador y libera sus listeners.
   */
  destroy() {
    this.close();
    this.element.removeEventListener('mouseenter', this._handlePause);
    this.element.removeEventListener('mouseleave', this._handleResume);
    this.element.removeEventListener('focusin', this._handlePause);
    this.element.removeEventListener('focusout', this._handleResume);
    if (this.action) this.action.removeEventListener('click', this._handleAction);
    super.destroy();
  }
}

registerComponent('snackbar', Snackbar);

/** Snackbar compartido que crea `showSnackbar()` bajo demanda. */
let sharedSnackbar = null;

/**
 * Muestra un aviso con un snackbar compartido (lo crea en `<body>` la primera vez y luego lo reutiliza).
 *
 * @param {string|{message?: string, action?: string|null|false, onAction?: Function, duration?: number|null|'none', anchor?: string, role?: string}} [options]
 *   Texto del mensaje u opciones de `Snackbar#open`, más `anchor` (anclaje del snackbar compartido) y `role` (`status` por defecto).
 * @returns {Snackbar|null} Instancia usada, o `null` sin DOM.
 */
export function showSnackbar(options = {}) {
  if (typeof document === 'undefined') return null;
  const opts = typeof options === 'string' ? { message: options } : { ...options };
  if (!sharedSnackbar || sharedSnackbar.destroyed || !sharedSnackbar.element.isConnected) {
    const el = document.createElement('div');
    el.className = 'mtx-snackbar';
    el.setAttribute('data-mtx', 'snackbar');
    el.setAttribute('data-role', opts.role || 'status');
    el.setAttribute('data-duration', '4000');
    document.body.appendChild(el);
    sharedSnackbar = getInstance(el) || new Snackbar(el);
  }
  if (opts.anchor) sharedSnackbar.anchor = opts.anchor;
  if (opts.role && sharedSnackbar.message) sharedSnackbar.message.setAttribute('role', opts.role);
  if (!Object.prototype.hasOwnProperty.call(opts, 'action')) opts.action = null;
  delete opts.anchor;
  delete opts.role;
  return sharedSnackbar.open(opts);
}

/** API de conveniencia expuesta como `Materix.snackbar`. */
export const snackbar = {
  show: showSnackbar,
};
