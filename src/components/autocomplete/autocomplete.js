import { ComponentBase } from '../../core/component-base.js';
import {
  registerComponent,
  registerInstance,
  unregisterInstance,
  getInstance,
} from '../../core/registry.js';
import { getPortalContainer } from '../../core/portal.js';
import { computePosition, autoUpdate } from '../../core/position.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { pushLayer, removeLayer, getTopLayer, markEscapeHandled } from '../../core/layers.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { TextField } from '../text-field/text-field.js';
import { Chip } from '../chip/chip.js';
import { createCircularProgress } from '../progress/progress.js';

/** Salto de PageUp/PageDown (igual que `pageSize` de MUI). */
const PAGE_SIZE = 5;

/** Atributos de configuración que se trasladan al TextField interno. */
const FIELD_ATTRIBUTES = [
  'data-label',
  'data-variant',
  'data-size',
  'data-small',
  'data-color',
  'data-start-icon',
  'data-helper-text',
  'data-error',
];

const CLOSE_SVG =
  '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
  '<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

const ARROW_SVG =
  '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';

/**
 * Normaliza texto para comparar: sin tildes ni diacríticos y en minúsculas.
 *
 * @param {*} text Texto de entrada.
 * @returns {string} Texto normalizado.
 */
export function normalizeText(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Localiza la primera coincidencia de `query` en `label` ignorando mayúsculas y tildes.
 *
 * @param {string} label Texto donde buscar.
 * @param {string} query Texto buscado.
 * @param {boolean} [fromStart=false] Solo coincidencias al inicio.
 * @returns {{start: number, end: number}|null} Rango en `label` o `null`.
 */
export function findMatch(label, query, fromStart = false) {
  const needle = normalizeText(query);
  if (!needle.trim() || !label) return null;
  let haystack = '';
  const map = [];
  let offset = 0;
  for (const char of String(label)) {
    for (const piece of normalizeText(char)) {
      haystack += piece;
      map.push({ start: offset, end: offset + char.length });
    }
    offset += char.length;
  }
  const index = haystack.indexOf(needle);
  if (index === -1 || (fromStart && index !== 0)) return null;
  return { start: map[index].start, end: map[index + needle.length - 1].end };
}

/**
 * Convierte una opción cruda (texto u objeto) en el formato interno.
 *
 * @param {string|number|Object} raw Opción de entrada.
 * @returns {Object|null} Opción `{value, label, group?, disabled?, icon?, description?}`.
 */
export function normalizeOption(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'object') {
    const text = String(raw);
    return { value: text, label: text };
  }
  const value = raw.value !== undefined && raw.value !== null ? String(raw.value) : String(raw.label ?? '');
  const label = raw.label !== undefined && raw.label !== null ? String(raw.label) : value;
  const option = { ...raw, value, label };
  if (raw.group !== undefined && raw.group !== null && raw.group !== '') option.group = String(raw.group);
  else delete option.group;
  option.disabled = Boolean(raw.disabled);
  if (!option.disabled) delete option.disabled;
  return option;
}

/**
 * Lee opciones desde un `<datalist>` o `<select>` (incluidos `<optgroup>`).
 *
 * @param {HTMLElement} source Elemento con `<option>`.
 * @returns {Object[]} Opciones normalizadas.
 */
export function optionsFromElement(source) {
  if (!source || !source.querySelectorAll) return [];
  return Array.from(source.querySelectorAll('option'))
    .map((opt) => {
      const value = opt.hasAttribute('value') ? opt.getAttribute('value') : opt.textContent.trim();
      if (value === '') return null;
      const optgroup = opt.parentElement && opt.parentElement.tagName === 'OPTGROUP' ? opt.parentElement : null;
      return normalizeOption({
        value,
        label: opt.getAttribute('label') || opt.textContent.trim() || value,
        group: optgroup ? optgroup.label : opt.getAttribute('data-group') || undefined,
        disabled: opt.disabled || Boolean(optgroup && optgroup.disabled),
        icon: opt.getAttribute('data-icon') || undefined,
        description: opt.getAttribute('data-description') || undefined,
      });
    })
    .filter(Boolean);
}

/**
 * Campo de texto con lista de sugerencias filtrable (Autocomplete de MUI).
 *
 * Sigue el patrón WAI-ARIA combobox 1.2 con listbox: el foco permanece en el
 * input y la opción activa se comunica con `aria-activedescendant`.
 *
 * Uso declarativo:
 * ```html
 * <input data-mtx="autocomplete" data-label="País" data-options="#countries" name="country">
 * <datalist id="countries"><option value="co">Colombia</option></datalist>
 * ```
 */
export class Autocomplete extends ComponentBase {
  /**
   * Crea una instancia del Autocomplete.
   *
   * @param {HTMLElement} element `<input>`, `<select>` o contenedor `.mtx-autocomplete`.
   * @throws {TypeError} Si no hay un `<input>` o `<select>` utilizable.
   */
  constructor(element) {
    let root = element;
    let source = null;
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
      source = element;
      root = element.closest('.mtx-autocomplete');
      if (!root) {
        root = document.createElement('div');
        root.className = 'mtx-autocomplete';
        // AGENTS §6.3: las clases del elemento se concatenan, nunca se sustituyen.
        if (element.getAttribute('class')) root.className += ` ${element.getAttribute('class')}`;
        if (element.parentNode) element.parentNode.insertBefore(root, element);
      }
    } else {
      source = element.querySelector('select') || element.querySelector('input:not([type="hidden"])');
    }
    if (!source) throw new TypeError('Autocomplete requiere un <input> o <select>.');

    super(root);
    root.classList.add('mtx-autocomplete');
    this._configSource = source;
    this._source = source;
    this._timers = new Set();
    this._readConfig();
    this._buildInput(source);
    this._buildField();
    this._buildAdornments();
    this._buildPopup();
    this._loadOptions(source);
    this._loadInitialValue(source);
    this._bindEvents();

    if (source instanceof HTMLSelectElement && source.parentNode) source.remove();
    registerInstance(this.input, this);
    if (this.input !== source) registerInstance(source, this);

    this.loading = this._flag('data-loading');
    this._syncDisabled();
    this._resetInputValue(false);
    this._syncState();
  }

  // ------------------------------------------------------------------
  // Configuración y construcción
  // ------------------------------------------------------------------

  /**
   * Lee un atributo de configuración del contenedor o del elemento de origen.
   *
   * @param {string} name Nombre del atributo.
   * @returns {string|null} Valor o `null`.
   */
  _cfg(name) {
    if (this.element.hasAttribute(name)) return this.element.getAttribute(name);
    const src = this._configSource;
    return src && src.hasAttribute(name) ? src.getAttribute(name) : null;
  }

  /**
   * Interpreta un atributo booleano (`data-x`, `data-x="true"`; `"false"` lo desactiva).
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} Valor booleano.
   */
  _flag(name) {
    const value = this._cfg(name);
    return value !== null && value !== 'false';
  }

  /** Lee todas las opciones de comportamiento desde `data-*`. */
  _readConfig() {
    const src = this._configSource;
    this.multiple = this._flag('data-multiple') || (src instanceof HTMLSelectElement && src.multiple);
    this.freeSolo = this._flag('data-free-solo');
    this.disableCloseOnSelect = this._flag('data-disable-close-on-select');
    this.clearOnEscape = this._flag('data-clear-on-escape');
    this.disableClearable = this._flag('data-disable-clearable');
    this.autoHighlight = this._flag('data-auto-highlight');
    this.autoSelect = this._flag('data-auto-select');
    this.openOnFocus = this._flag('data-open-on-focus');
    this.filterSelectedOptions = this._flag('data-filter-selected-options');
    this.selectOnFocus = !this.freeSolo;
    this.handleHomeEndKeys = !this.freeSolo;
    const limit = parseInt(this._cfg('data-limit-tags'), 10);
    this.limitTags = Number.isFinite(limit) && limit >= 0 ? limit : -1;
    this.matchFrom = this._cfg('data-match-from') === 'start' ? 'start' : 'any';
    const filter = this._cfg('data-filter');
    this.filterEnabled = filter !== 'false' && filter !== 'none';
    const debounce = parseInt(this._cfg('data-debounce'), 10);
    this.debounce = Number.isFinite(debounce) && debounce > 0 ? debounce : 0;
    this.valueFormat = this._cfg('data-value-format') === 'csv' ? 'csv' : 'multiple';
    this.separator = this._cfg('data-separator') ?? ',';
    const force = this._cfg('data-force-popup-icon');
    this.hasPopupIcon = force === null ? !this.freeSolo : force !== 'false';
    this.small = this._cfg('data-size') === 'small' || this._flag('data-small');
    const color = this._cfg('data-color');
    this.color = ['secondary', 'error', 'warning', 'info', 'success'].includes(color) ? color : 'primary';
    this.required = Boolean(src.required) || this._flag('data-required');
    this.readOnly = src.hasAttribute('readonly') || this._flag('data-read-only') || this._flag('data-readonly');
    this._disabled = Boolean(src.disabled) || this._flag('data-disabled');
  }

  /**
   * Prepara el `<input>` visible (lo crea si el origen es un `<select>`).
   *
   * @param {HTMLInputElement|HTMLSelectElement} source Elemento de origen.
   */
  _buildInput(source) {
    let input = source;
    if (source instanceof HTMLSelectElement) {
      input = this.element.querySelector('input.mtx-autocomplete__input') || document.createElement('input');
      input.type = 'text';
      ['id', 'placeholder', 'aria-label', 'aria-labelledby', 'aria-describedby', 'form', 'autofocus'].forEach((name) => {
        if (source.hasAttribute(name) && !input.hasAttribute(name)) input.setAttribute(name, source.getAttribute(name));
      });
      if (source.id) source.removeAttribute('id');
      if (!input.parentNode && source.parentNode) source.parentNode.insertBefore(input, source);
    }
    this.input = input;
    if (!input.id) input.id = uniqueId('mtx-autocomplete');
    this._id = input.id;

    // `name` pasa a los inputs ocultos: el texto visible no se envía con el formulario.
    this.name = source.getAttribute('name') || this._cfg('data-name') || null;
    if (input.hasAttribute('name')) input.removeAttribute('name');
    this._formAttr = source.getAttribute('form');
    this._listId = input.getAttribute('list');
    if (this._listId) input.removeAttribute('list');
    input.removeAttribute('required');
    input.required = false;
    input.disabled = false;

    input.classList.add('mtx-autocomplete__input');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'none');
    input.setAttribute('spellcheck', 'false');
    if (this.readOnly) input.readOnly = true;
  }

  /** Envuelve el input en un TextField (variantes, tamaños, label, helper y error). */
  _buildField() {
    let field = this.element.querySelector('.mtx-text-field');
    if (!field) {
      field = document.createElement('div');
      field.className = 'mtx-text-field';
      if (this.input.parentNode && this.element.contains(this.input)) {
        this.input.parentNode.insertBefore(field, this.input);
      } else {
        this.element.appendChild(field);
      }
      field.appendChild(this.input);
    }
    field.classList.add('mtx-autocomplete__field');
    FIELD_ATTRIBUTES.forEach((name) => {
      const value = this._cfg(name);
      if (value !== null && !field.hasAttribute(name)) field.setAttribute(name, value);
    });
    if (this.small && !field.hasAttribute('data-size')) field.setAttribute('data-size', 'small');

    this.textField = getInstance(field) instanceof TextField ? getInstance(field) : new TextField(field);
    this.field = field;
    this.container = this.textField.container;
    this.container.classList.add('mtx-autocomplete__input-root');
    this.label = this.textField.label || null;
    if (this.label && !this.label.id) this.label.id = `${this._id}-label`;

    // Con etiquetas (chips) el label debe quedar flotando aunque el texto esté vacío.
    const baseSync = this.textField._syncAria.bind(this.textField);
    this.textField._syncAria = () => {
      baseSync();
      if (this.multiple && this._values && this._values.length) {
        this.field.classList.add('mtx-text-field--has-value');
      }
    };
  }

  /** Crea el adorno final (cargando, limpiar, abrir), los valores ocultos y la región viva. */
  _buildAdornments() {
    this.element.querySelectorAll(
      '.mtx-autocomplete__end-adornment, .mtx-autocomplete__values, .mtx-autocomplete__live',
    ).forEach((node) => node.remove());
    this.container.querySelectorAll('.mtx-autocomplete__tag, .mtx-autocomplete__tag-more')
      .forEach((node) => node.remove());

    const end = document.createElement('span');
    end.className = 'mtx-autocomplete__end-adornment';
    this.loadingSlot = document.createElement('span');
    this.loadingSlot.className = 'mtx-autocomplete__loading-indicator';
    this.loadingSlot.hidden = true;

    this.clearButton = this._createIndicator('clear', CLOSE_SVG);
    this.popupButton = this._createIndicator('popup', ARROW_SVG);
    this.popupButton.hidden = !this.hasPopupIcon;
    end.append(this.loadingSlot, this.clearButton, this.popupButton);
    this.container.appendChild(end);
    this.endAdornment = end;

    this.valuesHost = document.createElement('span');
    this.valuesHost.className = 'mtx-autocomplete__values';
    this.valuesHost.hidden = true;
    this.element.appendChild(this.valuesHost);

    this.live = document.createElement('div');
    this.live.className = 'mtx-autocomplete__live';
    this.live.setAttribute('role', 'status');
    this.live.setAttribute('aria-live', 'polite');
    this.live.setAttribute('aria-atomic', 'true');
    this.element.appendChild(this.live);
    this._refreshTexts();
  }

  /**
   * Crea un botón indicador (limpiar o abrir) fuera del orden de tabulación, como MUI.
   *
   * @param {'clear'|'popup'} kind Tipo de indicador.
   * @param {string} svg Icono SVG.
   * @returns {HTMLButtonElement} Botón creado.
   */
  _createIndicator(kind, svg) {
    const button = document.createElement('button');
    button.type = 'button';
    button.tabIndex = -1;
    button.className = `mtx-autocomplete__indicator mtx-autocomplete__${kind}-indicator`;
    button.innerHTML = svg;
    return button;
  }

  /** Crea la superficie flotante (Paper + listbox + mensaje de estado). */
  _buildPopup() {
    this.popper = document.createElement('div');
    this.popper.className = `mtx-autocomplete__popper mtx-autocomplete__popper--${this.color}`;
    this.paper = document.createElement('div');
    this.paper.className = 'mtx-autocomplete__paper';
    this.listbox = document.createElement('ul');
    this.listbox.className = 'mtx-autocomplete__listbox';
    this.listbox.id = `${this._id}-listbox`;
    this.listbox.setAttribute('role', 'listbox');
    if (this.label) this.listbox.setAttribute('aria-labelledby', this.label.id);
    else if (this.input.getAttribute('aria-label')) this.listbox.setAttribute('aria-label', this.input.getAttribute('aria-label'));
    if (this.multiple) this.listbox.setAttribute('aria-multiselectable', 'true');
    this.status = document.createElement('div');
    this.status.className = 'mtx-autocomplete__status';
    this.paper.append(this.listbox, this.status);
    this.popper.appendChild(this.paper);
    this._optionEls = [];
  }

  /**
   * Carga las opciones iniciales: `<select>`, `data-options` (selector o JSON) o `list`.
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadOptions(source) {
    let options = [];
    const attr = this._cfg('data-options');
    if (source instanceof HTMLSelectElement) {
      options = optionsFromElement(source);
    } else if (attr && attr.trim().startsWith('[')) {
      try {
        options = JSON.parse(attr);
      } catch (error) {
        console.warn('[Materix UI] Autocomplete: data-options no es un JSON válido.', error);
      }
    } else if (attr) {
      let target = null;
      try { target = document.querySelector(attr); } catch (error) { target = null; }
      options = optionsFromElement(target);
    } else if (this._listId) {
      options = optionsFromElement(document.getElementById(this._listId));
    } else {
      options = optionsFromElement(this.element.querySelector('datalist'));
    }
    this._options = (Array.isArray(options) ? options : []).map(normalizeOption).filter(Boolean);
    this._filtered = [];
    this._highlighted = -1;
  }

  /**
   * Determina el valor inicial (`data-value`, `value` del input u opciones `selected`).
   *
   * @param {HTMLElement} source Elemento de origen.
   */
  _loadInitialValue(source) {
    let raw = this._cfg('data-value');
    if (raw === null) {
      if (source instanceof HTMLSelectElement) {
        const selected = Array.from(source.options)
          .filter((opt) => opt.defaultSelected && opt.value !== '')
          .map((opt) => opt.value);
        raw = this.multiple ? selected : (selected[0] ?? '');
      } else {
        raw = source.value || '';
      }
    }
    let list = raw;
    if (typeof raw === 'string') {
      const text = raw.trim();
      if (!text) list = [];
      else if (this.multiple && text.startsWith('[')) {
        try { list = JSON.parse(text); } catch (error) { list = [text]; }
      } else if (this.multiple) {
        list = text.split(this.separator).map((item) => item.trim()).filter(Boolean);
      } else list = [text];
    }
    this._values = this._resolveValues(list);
    if (!this.multiple) this._values = this._values.slice(0, 1);
    this._initialValues = this._values.slice();
    this._syncHiddenInputs();
  }

  // ------------------------------------------------------------------
  // Eventos
  // ------------------------------------------------------------------

  /** Registra todos los listeners (se retiran solos en `destroy()`). */
  _bindEvents() {
    this._selectOnFocusPending = true;
    this.listen(this.input, 'input', (event) => this._onInput(event));
    this.listen(this.input, 'keydown', (event) => this._onKeyDown(event));
    this.listen(this.input, 'focus', () => this._onFocus());
    this.listen(this.input, 'blur', (event) => this._onBlur(event));
    this.listen(this.input, 'mousedown', (event) => this._onInputMouseDown(event));
    this.listen(this.input, 'click', () => {
      if (this.selectOnFocus && this._selectOnFocusPending
        && this.input.selectionStart === this.input.selectionEnd && this.input.value) {
        this.input.select();
      }
      this._selectOnFocusPending = false;
    });

    // Clic en la caja (fuera del input): enfoca el input sin perder el foco actual.
    this.listen(this.container, 'mousedown', (event) => {
      if (event.target === this.input) return;
      if (event.target.closest('.mtx-autocomplete__tag, .mtx-autocomplete__indicator')) return;
      event.preventDefault();
      if (this._disabled) return;
      if (document.activeElement !== this.input) this.input.focus();
      this._onInputMouseDown(event);
    });

    this.listen(this.clearButton, 'mousedown', (event) => event.preventDefault());
    this.listen(this.clearButton, 'click', () => {
      if (this._disabled || this.readOnly) return;
      this.input.focus();
      this._clear('clear');
    });
    this.listen(this.popupButton, 'mousedown', (event) => event.preventDefault());
    this.listen(this.popupButton, 'click', () => {
      if (this._disabled || this.readOnly) return;
      this.input.focus();
      this._setOpen(!this._open, 'toggleInput');
    });

    this.listen(this.popper, 'mousedown', (event) => event.preventDefault());
    this.listen(this.popper, 'click', (event) => {
      const el = event.target.closest('.mtx-autocomplete__option');
      if (!el || el.getAttribute('aria-disabled') === 'true') return;
      const option = this._filtered[Number(el.dataset.optionIndex)];
      if (option) this._selectOption(option, 'selectOption');
    });
    this.listen(this.popper, 'mousemove', (event) => {
      const el = event.target.closest('.mtx-autocomplete__option');
      if (!el || el.getAttribute('aria-disabled') === 'true') return;
      const index = Number(el.dataset.optionIndex);
      if (index !== this._highlighted) this._setHighlight(index, { scroll: false, reason: 'mouse' });
    });

    // Chips (multiple): eliminar y navegar con flechas.
    this.listen(this.element, 'mtx:chip:delete', (event) => {
      const tag = event.target.closest('.mtx-autocomplete__tag');
      if (!tag || this._disabled || this.readOnly) return;
      event.stopPropagation();
      this._removeValueAt(Number(tag.dataset.tagIndex));
      this.input.focus();
    });
    this.listen(this.element, 'keydown', (event) => this._onTagKeyDown(event));
    this.listen(this.element, 'focusin', () => this._setFocused(true));
    this.listen(this.element, 'focusout', (event) => {
      if (event.relatedTarget && this.element.contains(event.relatedTarget)) return;
      this._setFocused(false);
    });

    this.listen(document, 'mtx:localechange', () => this._refreshTexts());
    if (this.input.form) {
      this.listen(this.input.form, 'reset', () => {
        this._defer(() => {
          this._values = this._initialValues.slice();
          this._afterValueChange();
          this._resetInputValue(false);
          this._setOpen(false, 'reset');
        }, 0);
      });
    }
  }

  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} fn Función a ejecutar.
   * @param {number} ms Milisegundos.
   * @returns {number} Identificador del temporizador.
   */
  _defer(fn, ms) {
    const id = setTimeout(() => {
      this._timers.delete(id);
      fn();
    }, ms);
    this._timers.add(id);
    return id;
  }

  /**
   * Gestiona la escritura: filtra, abre el popup y emite `mtx:autocomplete:input`.
   */
  _onInput() {
    const text = this.input.value;
    if (!this._open && text !== '') this._setOpen(true, 'input', { silentRefresh: true });
    this._dirty = true;
    if (text === '' && !this.multiple && !this.disableClearable && this._values.length) {
      this._setValues([], 'clear');
    }
    this._emitInput('input');
    this._refresh();
    this._syncState();
  }

  /**
   * Emite `mtx:autocomplete:input`, con debounce opcional (`data-debounce`) para escritura.
   *
   * @param {string} reason `input`, `reset` o `clear`.
   */
  _emitInput(reason) {
    const fire = () => emit(this.element, 'mtx:autocomplete:input', { inputValue: this.input.value, reason });
    if (reason === 'input' && this.debounce) {
      if (this._debounceTimer) {
        clearTimeout(this._debounceTimer);
        this._timers.delete(this._debounceTimer);
      }
      this._debounceTimer = this._defer(fire, this.debounce);
    } else {
      fire();
    }
  }

  /**
   * Clic sobre el input: alterna el popup (como `handleInputMouseDown` de MUI).
   *
   * @param {MouseEvent} event Evento de ratón.
   */
  _onInputMouseDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (this._disabled || this.readOnly) return;
    if (this.input.value === '' || !this._open) this._setOpen(!this._open, 'toggleInput');
  }

  /** Foco en el input: abre si `data-open-on-focus`. */
  _onFocus() {
    this._setFocused(true);
    if (this.openOnFocus && !this._open) this._setOpen(true, 'focus');
  }

  /**
   * Pérdida de foco: autoSelect, confirmación en free solo o restauración del texto.
   */
  _onBlur() {
    this._selectOnFocusPending = true;
    if (this._disabled) return;
    const option = this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
    if (this._open && this.autoSelect && option && !option.disabled) {
      this._selectOption(option, 'blur');
    } else if (this.freeSolo && !this.multiple) {
      const text = this.input.value;
      const current = this._values[0];
      if (text !== '' && (!current || current.label !== text)) {
        this._setValues([this._freeOption(text)], 'createOption');
      }
    } else if (!this.freeSolo) {
      this._resetInputValue();
    }
    this._setOpen(false, 'blur');
    this._syncState();
  }

  /**
   * Teclado del combobox (patrón WAI-ARIA + atajos de MUI).
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(event) {
    if (event.isComposing || event.keyCode === 229 || this._disabled) return;
    switch (event.key) {
      case 'Home':
      case 'End':
        if (this._open && this.handleHomeEndKeys && this._filtered.length) {
          event.preventDefault();
          this._setHighlight(this._nextIndex(event.key === 'Home' ? 'start' : 'end'));
        }
        break;
      case 'PageUp':
      case 'PageDown':
        event.preventDefault();
        this._openOrMove(event.key === 'PageUp' ? -PAGE_SIZE : PAGE_SIZE);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        this._openOrMove(event.key === 'ArrowUp' ? -1 : 1);
        break;
      case 'ArrowLeft':
        if (this.multiple && this._values.length && this.input.selectionStart === 0
          && this.input.selectionEnd === 0) {
          const tags = this._tagElements();
          if (tags.length) {
            event.preventDefault();
            tags[tags.length - 1].focus();
          }
        }
        break;
      case 'Enter': {
        const option = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
        if (option) {
          event.preventDefault();
          if (!option.disabled) this._selectOption(option, 'selectOption');
        } else if (this.freeSolo && this.input.value !== '' && !this._inputIsSelectedValue()) {
          if (this.multiple) event.preventDefault();
          this._selectOption(this._freeOption(this.input.value), 'createOption');
        }
        break;
      }
      case 'Escape':
        if (this._open) {
          // Solo si es la capa superior (un tooltip visible se cierra antes); como MUI,
          // el Escape no se propaga a los contenedores (p. ej. un Dialog).
          if (getTopLayer() === this) {
            markEscapeHandled(event);
            event.stopPropagation();
            this._setOpen(false, 'escape');
          }
          break;
        }
        if (this.clearOnEscape && !this.readOnly
          && (this.input.value !== '' || (this.multiple && this._values.length))) {
          event.preventDefault();
          event.stopPropagation();
          this._clear('clear');
        }
        break;
      case 'Backspace':
        if (this.multiple && !this.readOnly && this.input.value === '' && this._values.length) {
          event.preventDefault();
          this._removeValueAt(this._values.length - 1);
        }
        break;
      case 'Tab': {
        const option = this._open && this._highlighted >= 0 ? this._filtered[this._highlighted] : null;
        if (this.autoSelect && option && !option.disabled) this._selectOption(option, 'selectOption');
        break;
      }
      default:
        break;
    }
  }

  /**
   * Teclado sobre los chips: flechas para moverse y volver al input.
   *
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onTagKeyDown(event) {
    const tag = event.target.closest && event.target.closest('.mtx-autocomplete__tag');
    if (!tag) return;
    const tags = this._tagElements();
    const index = tags.indexOf(tag);
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      tags[index - 1].focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (index < tags.length - 1) tags[index + 1].focus();
      else this.input.focus();
    }
  }

  /**
   * Abre el popup o, si ya está abierto, mueve la opción activa.
   *
   * @param {number} diff Desplazamiento (±1 o ±PAGE_SIZE).
   */
  _openOrMove(diff) {
    if (!this._open) {
      this._setOpen(true, 'keyboard');
      return;
    }
    this._setHighlight(this._nextIndex(diff));
  }

  /**
   * Calcula el siguiente índice activo saltando opciones deshabilitadas.
   *
   * @param {number|'start'|'end'} diff Desplazamiento o extremo.
   * @returns {number} Índice o `-1`.
   */
  _nextIndex(diff) {
    const length = this._filtered.length;
    if (!length) return -1;
    const max = length - 1;
    let index;
    let step;
    if (diff === 'start') {
      index = 0;
      step = 1;
    } else if (diff === 'end') {
      index = max;
      step = -1;
    } else {
      step = diff > 0 ? 1 : -1;
      index = this._highlighted + diff;
      // Envuelve con ±1; con saltos de página se queda en el extremo (MUI).
      if (index < 0) index = Math.abs(diff) > 1 ? 0 : max;
      else if (index > max) index = Math.abs(diff) > 1 ? max : 0;
    }
    for (let i = 0; i < length; i += 1) {
      if (!this._filtered[index].disabled) return index;
      index = (index + step + length) % length;
    }
    return -1;
  }

  // ------------------------------------------------------------------
  // Estado: apertura, filtrado, render
  // ------------------------------------------------------------------

  /**
   * Abre o cierra el popup.
   *
   * @param {boolean} open Estado deseado.
   * @param {string} [reason] Motivo (`keyboard`, `toggleInput`, `escape`, `blur`, `selectOption`…).
   * @param {{silentRefresh?: boolean}} [options] Evita el refresco (lo hace quien llama).
   */
  _setOpen(open, reason = 'api', options = {}) {
    if (open && (this._disabled || this.readOnly)) return;
    if (Boolean(open) === Boolean(this._open)) return;
    this._open = Boolean(open);
    if (this._open) {
      pushLayer(this, {
        kind: 'popup',
        nodes: () => [this.popper, this.element],
        stack: () => [{ node: getPortalContainer() }],
        onEscape: () => this._setOpen(false, 'escape'),
      });
      this._dirty = false;
      if (!options.silentRefresh) this._refresh({ sync: true });
      else this._renderPopup();
      emit(this.element, 'mtx:autocomplete:open', { reason });
    } else {
      removeLayer(this);
      this._setHighlight(-1, { silent: true });
      this._renderPopup();
      emit(this.element, 'mtx:autocomplete:close', { reason });
    }
  }

  /**
   * Indica si el texto visible coincide con la etiqueta del valor (selección única).
   *
   * @returns {boolean} `true` si coincide.
   */
  _inputIsSelectedValue() {
    return !this.multiple && this._values.length > 0 && this.input.value === this._values[0].label;
  }

  /**
   * Aplica el filtro (sin tildes ni mayúsculas) sobre las opciones.
   *
   * @returns {Object[]} Opciones visibles.
   */
  _computeFiltered() {
    let options = this._options;
    if (this.multiple && this.filterSelectedOptions) {
      options = options.filter((opt) => !this._isSelected(opt));
    }
    // Recién abierto con la selección intacta: se muestran todas las opciones (MUI).
    const query = this._inputIsSelectedValue() && !this._dirty ? '' : this.input.value;
    this._query = this.filterEnabled ? query : '';
    const needle = normalizeText(query);
    if (!this.filterEnabled || !needle.trim()) return options.slice();
    return options.filter((opt) => {
      const label = normalizeText(opt.label);
      return this.matchFrom === 'start' ? label.startsWith(needle) : label.includes(needle);
    });
  }

  /**
   * Recalcula las opciones filtradas y, si está abierto, vuelve a pintar la lista.
   *
   * @param {{sync?: boolean, keepValue?: string|null}} [options] Sincroniza la opción activa con el valor.
   */
  _refresh({ sync = false, keepValue = null } = {}) {
    this._filtered = this._computeFiltered();
    if (this._open) {
      this._renderListbox();
      let index = -1;
      if (keepValue !== null) {
        index = this._filtered.findIndex((opt) => opt.value === keepValue && !opt.disabled);
      } else if (sync && this._values.length) {
        const current = this._values[0];
        index = this._filtered.findIndex((opt) => opt.value === current.value && !opt.disabled);
      }
      if (index === -1 && this.autoHighlight) index = this._nextIndex('start');
      this._highlighted = -1;
      this._setHighlight(index, { reason: 'auto' });
      this._announce();
    }
    this._renderPopup();
  }

  /** Pinta las opciones filtradas (con grupos, iconos, descripción y resaltado). */
  _renderListbox() {
    this.listbox.textContent = '';
    let groupList = null;
    let currentGroup;
    this._optionEls = this._filtered.map((opt, index) => {
      let parent = this.listbox;
      if (opt.group !== undefined) {
        if (opt.group !== currentGroup || !groupList) {
          currentGroup = opt.group;
          const groupItem = document.createElement('li');
          groupItem.className = 'mtx-autocomplete__group';
          groupItem.setAttribute('role', 'presentation');
          const header = document.createElement('div');
          header.className = 'mtx-autocomplete__group-label';
          header.id = `${this._id}-group-${index}`;
          header.textContent = opt.group;
          groupList = document.createElement('ul');
          groupList.className = 'mtx-autocomplete__group-list';
          groupList.setAttribute('role', 'group');
          groupList.setAttribute('aria-labelledby', header.id);
          groupItem.append(header, groupList);
          this.listbox.appendChild(groupItem);
        }
        parent = groupList;
      } else {
        currentGroup = undefined;
        groupList = null;
      }
      const el = this._createOptionElement(opt, index);
      parent.appendChild(el);
      return el;
    });
  }

  /**
   * Crea el `<li role="option">` de una opción.
   *
   * @param {Object} opt Opción.
   * @param {number} index Índice en la lista filtrada.
   * @returns {HTMLLIElement} Elemento creado.
   */
  _createOptionElement(opt, index) {
    const li = document.createElement('li');
    li.id = `${this._id}-option-${index}`;
    li.className = 'mtx-autocomplete__option';
    li.setAttribute('role', 'option');
    li.dataset.optionIndex = String(index);
    const selected = this._isSelected(opt);
    li.setAttribute('aria-selected', String(selected));
    if (opt.disabled) {
      li.setAttribute('aria-disabled', 'true');
      li.classList.add('mtx-autocomplete__option--disabled');
    }
    if (opt.icon) {
      const icon = document.createElement('span');
      icon.className = 'mtx-autocomplete__option-icon material-icons';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = opt.icon;
      li.appendChild(icon);
    }
    const content = document.createElement('span');
    content.className = 'mtx-autocomplete__option-content';
    const label = document.createElement('span');
    label.className = 'mtx-autocomplete__option-label';
    this._appendHighlighted(label, opt.label);
    content.appendChild(label);
    if (opt.description) {
      const description = document.createElement('span');
      description.className = 'mtx-autocomplete__option-description';
      description.textContent = opt.description;
      content.appendChild(description);
    }
    li.appendChild(content);
    return li;
  }

  /**
   * Inserta el texto marcando en negrita el fragmento que coincide con la búsqueda.
   *
   * @param {HTMLElement} target Nodo destino.
   * @param {string} text Texto de la opción.
   */
  _appendHighlighted(target, text) {
    const match = this._query ? findMatch(text, this._query, this.matchFrom === 'start') : null;
    if (!match) {
      target.textContent = text;
      return;
    }
    const mark = document.createElement('mark');
    mark.className = 'mtx-autocomplete__highlight';
    mark.textContent = text.slice(match.start, match.end);
    target.append(text.slice(0, match.start), mark, text.slice(match.end));
  }

  /** Muestra u oculta la superficie flotante según opciones, carga y free solo. */
  _renderPopup() {
    const hasOptions = this._filtered.length > 0;
    const showStatus = !hasOptions && (this._loading || !this.freeSolo);
    const visible = Boolean(this._open) && (hasOptions || showStatus);
    this.element.classList.toggle('mtx-autocomplete--open', Boolean(this._open));
    this.input.setAttribute('aria-expanded', String(Boolean(this._open) && hasOptions));
    if (this._open && hasOptions) this.input.setAttribute('aria-controls', this.listbox.id);
    else this.input.removeAttribute('aria-controls');
    this._refreshPopupLabel();

    if (visible) {
      this.listbox.hidden = !hasOptions;
      this.status.hidden = hasOptions;
      if (!hasOptions) {
        this.status.textContent = this._loading ? this._text('loading') : this._text('noOptions');
        this.status.classList.toggle('mtx-autocomplete__status--loading', Boolean(this._loading));
      }
      this.listbox.setAttribute('aria-busy', String(Boolean(this._loading)));
      if (!this.popper.isConnected) {
        getPortalContainer().appendChild(this.popper);
        this._stopAutoUpdate = autoUpdate(this.container, this.popper, () => this._position());
      } else {
        this._position();
      }
    } else if (this.popper.isConnected) {
      if (this._stopAutoUpdate) this._stopAutoUpdate();
      this._stopAutoUpdate = null;
      this.popper.remove();
    }
  }

  /** Coloca el popup bajo el campo (o encima si no cabe), con el ancho del campo. */
  _position() {
    if (!this.popper.isConnected) return;
    const rect = this.container.getBoundingClientRect();
    this.popper.style.width = `${rect.width}px`;
    const { x, y, side } = computePosition(this.container, this.popper, {
      placement: 'bottom-start',
      offset: 4,
      flip: true,
      shift: true,
      padding: 8,
    });
    this.popper.style.left = `${x}px`;
    this.popper.style.top = `${y}px`;
    this.popper.dataset.placement = side;
  }

  /**
   * Activa una opción (clase visual + `aria-activedescendant`) y la desplaza a la vista.
   *
   * @param {number} index Índice o `-1` para ninguna.
   * @param {{scroll?: boolean, reason?: string, silent?: boolean}} [options] Opciones.
   */
  _setHighlight(index, { scroll = true, reason = 'keyboard', silent = false } = {}) {
    const previousIndex = this._highlighted;
    const previous = this._optionEls[previousIndex];
    if (previous) previous.classList.remove('mtx-autocomplete__option--focused');
    const el = index >= 0 ? this._optionEls[index] : null;
    this._highlighted = el ? index : -1;
    if (this._highlighted === -1 && previousIndex === -1) silent = true;
    if (!el) {
      this.input.removeAttribute('aria-activedescendant');
    } else {
      el.classList.add('mtx-autocomplete__option--focused');
      this.input.setAttribute('aria-activedescendant', el.id);
      if (scroll && reason !== 'mouse') this._scrollIntoView(el);
    }
    if (!silent) {
      emit(this.element, 'mtx:autocomplete:highlight', {
        option: el ? this._filtered[index] : null,
        reason,
      });
    }
  }

  /**
   * Desplaza el listbox para mostrar la opción (deja hueco para la cabecera de grupo fija).
   *
   * @param {HTMLElement} el Opción activa.
   */
  _scrollIntoView(el) {
    const list = this.listbox;
    if (list.scrollHeight <= list.clientHeight) return;
    const grouped = this._filtered.some((opt) => opt.group !== undefined);
    const top = el.offsetTop - (grouped ? el.offsetHeight * 1.3 : 0);
    const bottom = el.offsetTop + el.offsetHeight;
    if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    else if (top < list.scrollTop) list.scrollTop = Math.max(0, top);
  }

  /** Anuncia en la región viva el número de resultados (con retardo para no saturar). */
  _announce() {
    if (this._announceTimer) {
      clearTimeout(this._announceTimer);
      this._timers.delete(this._announceTimer);
    }
    this._announceTimer = this._defer(() => {
      if (!this._open) return;
      const count = this._filtered.length;
      if (!count) this.live.textContent = this._loading ? this._text('loading') : this._text('noOptions');
      else this.live.textContent = count === 1 ? this._text('result') : this._text('results', [count]);
    }, 300);
  }

  // ------------------------------------------------------------------
  // Valor
  // ------------------------------------------------------------------

  /**
   * Indica si una opción forma parte del valor.
   *
   * @param {Object} opt Opción.
   * @returns {boolean} `true` si está seleccionada.
   */
  _isSelected(opt) {
    return this._values.some((value) => value.value === opt.value);
  }

  /**
   * Busca o crea opciones para una lista de valores (texto, objetos u opciones).
   *
   * @param {Array} list Valores.
   * @returns {Object[]} Opciones resueltas.
   */
  _resolveValues(list) {
    const seen = new Set();
    return (Array.isArray(list) ? list : [list])
      .map((item) => {
        if (item === null || item === undefined || item === '') return null;
        const key = typeof item === 'object' ? String(item.value ?? item.label ?? '') : String(item);
        const byValue = this._options.find((opt) => opt.value === key);
        if (byValue) return byValue;
        const normalized = normalizeText(key);
        const byLabel = this._options.find((opt) => normalizeText(opt.label) === normalized);
        if (byLabel) return byLabel;
        const option = normalizeOption(item);
        if (option && this.freeSolo) option.freeSolo = true;
        return option;
      })
      .filter((opt) => {
        if (!opt || seen.has(opt.value)) return false;
        seen.add(opt.value);
        return true;
      });
  }

  /**
   * Opción para un texto libre (reutiliza una opción con la misma etiqueta).
   *
   * @param {string} text Texto escrito.
   * @returns {Object} Opción.
   */
  _freeOption(text) {
    const normalized = normalizeText(text);
    const existing = this._options.find((opt) => normalizeText(opt.label) === normalized);
    return existing || { value: text, label: text, freeSolo: true };
  }

  /**
   * Selecciona (o alterna, en múltiple) una opción tras una interacción.
   *
   * @param {Object} option Opción elegida.
   * @param {string} reason Motivo (`selectOption`, `createOption`, `blur`).
   */
  _selectOption(option, reason) {
    if (this.readOnly) return;
    let next;
    let changeReason = reason;
    if (this.multiple) {
      const index = this._values.findIndex((value) => value.value === option.value);
      if (index === -1) next = [...this._values, option];
      else if (reason === 'createOption') next = this._values;
      else {
        next = this._values.filter((_, i) => i !== index);
        changeReason = 'removeOption';
      }
    } else {
      next = [option];
    }
    this._setValues(next, changeReason, option);
    this._resetInputValue();
    if (this.multiple && this.disableCloseOnSelect) {
      this._dirty = false;
      this._refresh({ keepValue: option.value });
    } else {
      this._setOpen(false, reason === 'createOption' ? 'createOption' : 'selectOption');
      this._refresh();
    }
    this._syncState();
  }

  /**
   * Quita el valor en una posición (múltiple).
   *
   * @param {number} index Índice del chip.
   */
  _removeValueAt(index) {
    const option = this._values[index];
    if (!option) return;
    this._setValues(this._values.filter((_, i) => i !== index), 'removeOption', option);
    this._refresh({ keepValue: this._highlighted >= 0 ? this._filtered[this._highlighted]?.value ?? null : null });
    this._syncState();
  }

  /**
   * Vacía el valor y el texto.
   *
   * @param {string} reason Motivo del cambio.
   */
  _clear(reason) {
    if (this.input.value !== '') {
      this.input.value = '';
      this._emitInput('clear');
    }
    this._setValues([], reason);
    this._dirty = false;
    this._refresh();
    this._syncState();
  }

  /**
   * Sustituye el valor y emite `mtx:autocomplete:change` si cambió.
   *
   * @param {Object[]} next Nuevas opciones seleccionadas.
   * @param {string} reason Motivo.
   * @param {Object} [option] Opción afectada.
   * @param {boolean} [silent=false] No emite evento (cambios por API).
   * @returns {boolean} `true` si el valor cambió.
   */
  _setValues(next, reason, option = null, silent = false) {
    const before = this._values.map((value) => value.value).join('\u0000');
    const after = next.map((value) => value.value).join('\u0000');
    this._values = next.slice();
    this._afterValueChange();
    if (before === after) return false;
    if (!silent) {
      const detail = this.multiple
        ? { value: this.value, options: this.selectedOptions, option, reason }
        : { value: this.value, option: this.selectedOption, reason };
      emit(this.element, 'mtx:autocomplete:change', detail);
    }
    return true;
  }

  /** Sincroniza todo lo que depende del valor (inputs ocultos, chips, label, validez). */
  _afterValueChange() {
    this._syncHiddenInputs();
    this._renderTags();
    this.textField._syncAria();
    this._syncState();
  }

  /**
   * Restablece el texto visible al valor (etiqueta en único, vacío en múltiple).
   *
   * @param {boolean} [notify=true] Emite `mtx:autocomplete:input` con `reason: 'reset'`.
   */
  _resetInputValue(notify = true) {
    const text = !this.multiple && this._values[0] ? this._values[0].label : '';
    if (this.input.value !== text) {
      this.input.value = text;
      if (notify) this._emitInput('reset');
    }
    this.textField._syncAria();
  }

  /** Crea los inputs ocultos con `name` (uno por valor, o CSV con `data-value-format="csv"`). */
  _syncHiddenInputs() {
    this.valuesHost.textContent = '';
    if (!this.name) return;
    const values = this._values.map((value) => value.value);
    const add = (value) => {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = this.name;
      hidden.value = value;
      if (this._formAttr) hidden.setAttribute('form', this._formAttr);
      hidden.disabled = Boolean(this._disabled);
      this.valuesHost.appendChild(hidden);
    };
    if (!this.multiple) add(values[0] ?? '');
    else if (this.valueFormat === 'csv') add(values.join(this.separator));
    else values.forEach(add);
  }

  /** Pinta los chips de la selección múltiple (respeta `data-limit-tags` sin foco). */
  _renderTags() {
    this._tagElements().forEach((el) => {
      const chip = getInstance(el);
      if (chip && typeof chip.destroy === 'function') chip.destroy();
      el.remove();
    });
    this.container.querySelectorAll('.mtx-autocomplete__tag-more').forEach((el) => el.remove());
    if (!this.multiple) return;

    const focused = this.element.classList.contains('mtx-autocomplete--focused');
    const limit = this.limitTags >= 0 && !focused ? this.limitTags : Infinity;
    const deletable = !this._disabled && !this.readOnly;
    this._values.forEach((opt, index) => {
      if (index >= limit) return;
      const tag = document.createElement('div');
      tag.className = 'mtx-autocomplete__tag';
      tag.setAttribute('data-mtx', 'chip');
      tag.setAttribute('data-label', opt.label);
      tag.dataset.tagIndex = String(index);
      if (this.small) tag.setAttribute('data-size', 'small');
      if (opt.icon) tag.setAttribute('data-icon', opt.icon);
      if (deletable) tag.setAttribute('data-deletable', '');
      const chip = new Chip(tag);
      if (tag.hasAttribute('tabindex')) tag.tabIndex = -1;
      if (this._disabled) chip.disable();
      this.container.insertBefore(tag, this.input);
    });
    if (this._values.length > limit) {
      const more = document.createElement('span');
      more.className = 'mtx-autocomplete__tag-more';
      more.textContent = this._text('more', [this._values.length - limit]);
      this.container.insertBefore(more, this.input);
    }
  }

  /**
   * Chips actuales en orden.
   *
   * @returns {HTMLElement[]} Elementos `.mtx-autocomplete__tag`.
   */
  _tagElements() {
    return Array.from(this.container.querySelectorAll('.mtx-autocomplete__tag'));
  }

  /**
   * Marca el estado de foco del componente (muestra todos los chips con foco).
   *
   * @param {boolean} focused Estado de foco.
   */
  _setFocused(focused) {
    const was = this.element.classList.contains('mtx-autocomplete--focused');
    if (was === focused) return;
    this.element.classList.toggle('mtx-autocomplete--focused', focused);
    if (this.multiple && this.limitTags >= 0) {
      const active = document.activeElement;
      const keepTag = active && active.closest && active.closest('.mtx-autocomplete__tag');
      if (!keepTag) this._renderTags();
    }
  }

  /** Clases de estado, botón limpiar, validez y requerido. */
  _syncState() {
    const dirty = this._values.length > 0 || this.input.value !== '';
    const hasClear = !this.disableClearable && !this._disabled && !this.readOnly && dirty;
    this.clearButton.hidden = !hasClear;
    this.element.classList.toggle('mtx-autocomplete--has-clear', hasClear);
    this.element.classList.toggle('mtx-autocomplete--has-popup', this.hasPopupIcon);
    this.element.classList.toggle('mtx-autocomplete--has-end', hasClear || this.hasPopupIcon || Boolean(this._loading));
    this.element.classList.toggle('mtx-autocomplete--multiple', this.multiple);
    this.element.classList.toggle('mtx-autocomplete--required', this.required);
    this.element.classList.toggle('mtx-autocomplete--readonly', this.readOnly);

    const hasValue = this._values.length > 0;
    this.input.required = this.required && !hasValue;
    if (this.required) this.input.setAttribute('aria-required', 'true');
    else this.input.removeAttribute('aria-required');
    if (this.readOnly) this.input.setAttribute('aria-readonly', 'true');
    if (typeof this.input.setCustomValidity === 'function') {
      const invalid = this.required && !hasValue && !this.freeSolo && this.input.value.trim() !== '';
      this.input.setCustomValidity(invalid ? this._text('invalid') : '');
    }
  }

  /** Aplica el estado deshabilitado a input, botones, chips y valores ocultos. */
  _syncDisabled() {
    const disabled = Boolean(this._disabled);
    this.input.disabled = disabled;
    this.clearButton.disabled = disabled;
    this.popupButton.disabled = disabled;
    this.element.classList.toggle('mtx-autocomplete--disabled', disabled);
    if (disabled) this._setOpen(false, 'disabled');
    this._syncHiddenInputs();
    this._renderTags();
    this._syncState();
  }

  // ------------------------------------------------------------------
  // Textos (i18n)
  // ------------------------------------------------------------------

  /**
   * Texto traducido del componente (con anulaciones por `data-*`).
   *
   * @param {string} key Clave del diccionario `autocomplete`.
   * @param {Array} [params] Parámetros de interpolación.
   * @returns {string} Texto.
   */
  _text(key, params = null) {
    const overrides = { noOptions: 'data-no-options-text', loading: 'data-loading-text' };
    const custom = overrides[key] ? this._cfg(overrides[key]) : null;
    if (custom) return custom;
    const fallbacks = {
      clear: 'Clear',
      open: 'Open',
      close: 'Close',
      noOptions: 'No options',
      loading: 'Loading…',
      more: '+{0}',
      result: '1 result available',
      results: '{0} results available',
      invalid: 'Select an option from the list.',
    };
    return t('autocomplete', key, params, fallbacks[key] ?? key, getComponentLocale(this.element));
  }

  /** Actualiza el nombre accesible del botón abrir/cerrar. */
  _refreshPopupLabel() {
    const label = this._text(this._open ? 'close' : 'open');
    this.popupButton.setAttribute('aria-label', label);
    this.popupButton.setAttribute('title', label);
  }

  /** Refresca todos los textos tras un cambio de idioma. */
  _refreshTexts() {
    const clear = this._text('clear');
    this.clearButton.setAttribute('aria-label', clear);
    this.clearButton.setAttribute('title', clear);
    this._refreshPopupLabel();
    if (this.popper && this.popper.isConnected) this._renderPopup();
    if (this._values) this._renderTags();
  }

  // ------------------------------------------------------------------
  // API pública
  // ------------------------------------------------------------------

  /**
   * Valor actual: `string` (vacío si no hay selección) o `string[]` en múltiple.
   *
   * @returns {string|string[]} Valor.
   */
  get value() {
    if (this.multiple) return this._values.map((opt) => opt.value);
    return this._values[0] ? this._values[0].value : '';
  }

  /**
   * Establece el valor sin emitir `mtx:autocomplete:change`.
   *
   * @param {string|string[]|Object|Object[]|null} value Valor(es) u opción(es).
   */
  set value(value) {
    let list = value === null || value === undefined || value === '' ? [] : value;
    if (!Array.isArray(list)) list = [list];
    let resolved = this._resolveValues(list);
    if (!this.multiple) resolved = resolved.slice(0, 1);
    this._setValues(resolved, 'api', null, true);
    this._resetInputValue();
    this._refresh();
  }

  /** @returns {Object|null} Opción seleccionada (selección única). */
  get selectedOption() {
    return this._values[0] ? { ...this._values[0] } : null;
  }

  /** @returns {Object[]} Opciones seleccionadas (copia). */
  get selectedOptions() {
    return this._values.map((opt) => ({ ...opt }));
  }

  /** @returns {string} Texto escrito en el input. */
  get inputValue() {
    return this.input.value;
  }

  /**
   * Cambia el texto del input y refiltra (sin emitir eventos).
   *
   * @param {string} text Texto nuevo.
   */
  set inputValue(text) {
    this.input.value = text ?? '';
    this._dirty = true;
    this.textField._syncAria();
    this._refresh();
    this._syncState();
  }

  /** @returns {Object[]} Copia de las opciones disponibles. */
  get options() {
    return this._options.map((opt) => ({ ...opt }));
  }

  /**
   * Sustituye las opciones (carga asíncrona) y conserva el valor actual.
   *
   * @param {Array<string|Object>} options Opciones `{value, label, group?, disabled?, icon?, description?}`.
   */
  setOptions(options) {
    this._options = (Array.isArray(options) ? options : []).map(normalizeOption).filter(Boolean);
    const previousLabel = this._values[0] ? this._values[0].label : null;
    this._values = this._values.map((current) => this._options.find((opt) => opt.value === current.value) || current);
    this._afterValueChange();
    if (!this.multiple && previousLabel !== null && this.input.value === previousLabel) this._resetInputValue(false);
    this._refresh({ keepValue: this._highlighted >= 0 ? this._filtered[this._highlighted]?.value ?? null : null });
  }

  /** @returns {boolean} `true` si se muestra el indicador de carga. */
  get loading() {
    return Boolean(this._loading);
  }

  /**
   * Activa o desactiva el estado de carga (CircularProgress + texto "Loading…").
   *
   * @param {boolean} value Estado de carga.
   */
  set loading(value) {
    this._loading = Boolean(value);
    if (this._loading && !this.loadingSlot.firstChild) {
      this.loadingSlot.appendChild(createCircularProgress({ size: 20, color: 'inherit', decorative: true }));
    }
    this.loadingSlot.hidden = !this._loading;
    this.element.classList.toggle('mtx-autocomplete--loading', this._loading);
    this._syncState();
    if (this._open) {
      this._renderPopup();
      this._announce();
    }
  }

  /**
   * Alias de `loading` para uso encadenado.
   *
   * @param {boolean} value Estado de carga.
   */
  setLoading(value) {
    this.loading = value;
  }

  /** @returns {boolean} `true` si el popup está abierto. */
  get isOpen() {
    return Boolean(this._open);
  }

  /** Abre el popup de opciones. */
  open() {
    this._setOpen(true, 'api');
  }

  /** Cierra el popup de opciones. */
  close() {
    this._setOpen(false, 'api');
  }

  /** Vacía valor y texto (emite `change` con `reason: 'clear'`). */
  clear() {
    this._clear('clear');
  }

  /** Enfoca el input. */
  focus() {
    this.input.focus();
  }

  /** Quita el foco del input. */
  blur() {
    this.input.blur();
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return Boolean(this._disabled);
  }

  /** Deshabilita el componente. */
  disable() {
    this._disabled = true;
    this._syncDisabled();
  }

  /** Habilita el componente. */
  enable() {
    this._disabled = false;
    this._syncDisabled();
  }

  /**
   * Muestra un error con mensaje (delegado en TextField).
   *
   * @param {string|boolean} message Mensaje, `true` sin mensaje o vacío para limpiar.
   */
  setError(message) {
    this.textField.setError(message);
  }

  /** Limpia el estado de error. */
  clearError() {
    this.textField.clearError();
  }

  /** Libera listeners, temporizadores, chips y el popup. */
  destroy() {
    if (this.destroyed) return;
    this._timers.forEach((id) => clearTimeout(id));
    this._timers.clear();
    if (this._stopAutoUpdate) this._stopAutoUpdate();
    this._stopAutoUpdate = null;
    if (this.popper.isConnected) this.popper.remove();
    this._open = false;
    removeLayer(this);
    this.element.classList.remove('mtx-autocomplete--open', 'mtx-autocomplete--focused');
    this._tagElements().forEach((el) => {
      const chip = getInstance(el);
      if (chip && typeof chip.destroy === 'function') chip.destroy();
    });
    if (this.name && !this.input.hasAttribute('name') && this.input === this._source) {
      this.input.setAttribute('name', this.name);
      this.valuesHost.textContent = '';
    }
    if (this.textField && typeof this.textField.destroy === 'function') this.textField.destroy();
    unregisterInstance(this.input);
    unregisterInstance(this._source);
    if (this._source.removeAttribute) this._source.removeAttribute('data-mtx-initialized');
    super.destroy();
  }
}

registerComponent('autocomplete', Autocomplete);
