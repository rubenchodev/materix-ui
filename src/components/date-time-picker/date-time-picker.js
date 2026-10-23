import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, registerInstance, unregisterInstance, getInstance } from '../../core/registry.js';
import { emit } from '../../core/events.js';
import { uniqueId } from '../../core/id.js';
import { pushLayer, removeLayer } from '../../core/layers.js';
import { TextField } from '../text-field/text-field.js';
import { t, getComponentLocale, getDictionary } from '../../i18n/index.js';


/** Selector de elementos enfocables usado por la trampa de foco del picker. */
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', 'a[href]', '[tabindex]',
].join(',');

/**
 * Resuelve el locale crudo (p. ej. `es-MX`) para `Intl`. El idioma de los textos lo decide
 * `getComponentLocale()`. Un locale local (`data-locale`/`data-lang`/`lang` de un ancestro)
 * se conserva para `Intl` aunque no esté registrado (`fr-FR`: nombres y orden por `Intl`);
 * el `lang` de `<html>` solo aporta la región si su idioma coincide con el resuelto.
 *
 * @param {HTMLElement|null} element Elemento de referencia.
 * @returns {string} Locale crudo, o el código de idioma resuelto.
 */
function resolveRawLocale(element) {
  const lang = getComponentLocale(element);
  const html = typeof document !== 'undefined' ? document.documentElement : null;
  if (element && typeof element.getAttribute === 'function') {
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const raw = node.getAttribute('data-locale')
        || node.getAttribute('data-lang')
        || (node !== html ? node.getAttribute('lang') : null);
      if (raw && raw.trim()) return raw.trim();
    }
  }
  const htmlLang = html ? (html.getAttribute('lang') || '').trim() : '';
  return htmlLang && matchesLang(htmlLang, lang) ? htmlLang : lang;
}

/**
 * Indica si un locale crudo pertenece al idioma registrado (`es-MX` ∈ `es`).
 *
 * @param {string} raw Locale crudo.
 * @param {string} lang Código de idioma registrado.
 * @returns {boolean} `true` si coinciden.
 */
function matchesLang(raw, lang) {
  const r = String(raw).toLowerCase().replace('_', '-');
  const l = String(lang).toLowerCase();
  return r === l || r.startsWith(`${l}-`);
}

/**
 * Normaliza un locale a su idioma base (`es-MX` → `es`).
 *
 * @param {string} raw Locale crudo.
 * @returns {string} Idioma base en minúsculas.
 */
function toBaseLang(raw) {
  return String(raw || 'en').toLowerCase().trim().split(/[-_]/)[0] || 'en';
}

/**
 * Devuelve un locale válido para `Intl` (o `en` si el runtime no lo admite).
 *
 * @param {string} raw Locale crudo.
 * @returns {string} Locale aceptado por `Intl`.
 */
function toIntlLocale(raw) {
  try {
    const supported = Intl.DateTimeFormat.supportedLocalesOf([String(raw).replace('_', '-')]);
    return supported[0] || 'en';
  } catch (e) {
    return 'en';
  }
}

/**
 * Orden de los segmentos de fecha según el locale (`en-US` → MM/DD/YYYY, `es` → DD/MM/YYYY).
 *
 * @param {string} raw Locale crudo.
 * @returns {string[]} Tokens ordenados, p. ej. `['DD', 'MM', 'YYYY']`.
 */
function localeDateOrder(raw) {
  try {
    const parts = new Intl.DateTimeFormat(toIntlLocale(raw), { year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date(2026, 9, 20));
    const map = { day: 'DD', month: 'MM', year: 'YYYY' };
    const order = parts.filter((p) => map[p.type]).map((p) => map[p.type]);
    if (order.length === 3) return order;
  } catch (e) { /* sin Intl: se usa la regla por idioma */ }
  return toBaseLang(raw) === 'en' ? ['MM', 'DD', 'YYYY'] : ['DD', 'MM', 'YYYY'];
}

/**
 * Determina el modo del picker. `data-picker` tiene prioridad sobre el nombre de `data-mtx`.
 *
 * @param {string} mtxAttr Valor de `data-mtx` en minúsculas.
 * @param {string} pickerAttr Valor de `data-picker` en minúsculas.
 * @returns {'date'|'time'|'datetime'} Modo resuelto.
 */
function resolveMode(mtxAttr, pickerAttr) {
  const explicit = pickerAttr.replace(/-?range/, '').replace('date-time', 'datetime');
  if (explicit === 'date' || explicit === 'time' || explicit === 'datetime') return explicit;
  if (/date-?time/.test(mtxAttr)) return 'datetime';
  if (mtxAttr.includes('time')) return 'time';
  return 'date';
}

/**
 * Indica si dos fechas caen en el mismo día natural.
 *
 * @param {Date|null} a Primera fecha.
 * @param {Date|null} b Segunda fecha.
 * @returns {boolean} `true` si coinciden año, mes y día.
 */
function isSameDay(a, b) {
  return Boolean(a && b) && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Clave estable `YYYY-MM-DD` de una fecha (para `data-date`).
 *
 * @param {Date} date Fecha.
 * @returns {string} Clave del día.
 */
function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Convierte un patrón de formato (ej. 'YYYY-MM-DD HH:mm') a una máscara numérica de TextField (ej. '0000-00-00 00:00').
 *
 * @param {string} format Patrón de formato.
 * @returns {string} Patrón de máscara numérico.
 */
function formatToMask(format) {
  if (!format) return '';
  let m = format
    .replace(/YYYY|AAAA/g, '0000')
    .replace(/YY/g, '00')
    .replace(/MM/g, '00')
    .replace(/DD/g, '00')
    .replace(/HH|hh/g, '00')
    .replace(/mm/g, '00')
    .replace(/ss/g, '00');
  m = m.replace(/\b[aA]\b|(?<=\s|^)[aA](?=\s|$)|AM|PM|aa|AA/g, 'AA');
  return m;
}

/**
 * Representa un componente de selección de Fecha y/o Hora de Materix UI.
 * Soporta DatePicker, TimePicker y DateTimePicker con vistas de calendario,
 * reloj radial Material Design 2, popover o modal.
 */
export class DateTimePicker extends ComponentBase {
  /** @type {DateTimePicker|null} Referencia al selector actualmente abierto en la página */
  static _activePicker = null;

  /**
   * Destruye un picker previo sobre el elemento o su TextField contenedor, para que
   * `new DateTimePicker(el)` repetido no deje dos popovers vivos.
   *
   * @param {HTMLElement} element Elemento que se va a inicializar.
   */
  static _destroyPrevious(element) {
    if (!element || !element.nodeType) return;
    const wrapper = typeof element.closest === 'function' ? element.closest('.mtx-text-field') : null;
    [getInstance(element), wrapper ? getInstance(wrapper) : null].forEach((existing) => {
      if (!(existing instanceof DateTimePicker) || existing.destroyed) return;
      try {
        existing.destroy();
      } catch (e) {
        /* una destrucción fallida no impide crear la nueva instancia */
      }
    });
  }

  /**
   * Crea una instancia de DateTimePicker.
   *
   * @param {HTMLElement} element Elemento asociado (input, div o contenedor).
   */
  constructor(element) {
    DateTimePicker._destroyPrevious(element);
    const isStatic = element.hasAttribute('data-static') || element.classList.contains('mtx-picker-static');
    const mtxAttr = (element.getAttribute('data-mtx') || '').toLowerCase();
    const pickerAttr = (element.getAttribute('data-picker') || '').toLowerCase();
    const isRange = element.getAttribute('data-range') === 'true' ||
                    element.hasAttribute('data-range') ||
                    mtxAttr.includes('range') ||
                    pickerAttr.includes('range');
    const mode = resolveMode(mtxAttr, pickerAttr);

    let textField = null;
    let rawInitial = '';

    // 1. Si es un <input> directo no estático, se construye un TextField a su alrededor
    if (!isStatic && (element instanceof HTMLInputElement || !element.classList.contains('mtx-text-field'))) {
      rawInitial = (element.value || element.getAttribute('data-value') || element.getAttribute('data-default-value') || '').trim();
      // El valor se reescribe tras crear la instancia: la máscara no debe ver el ISO crudo.
      if ('value' in element) element.value = '';

      // El icono final pasa a ser un IconButton accesible que abre el picker.
      const defaultIcon = mode === 'time' ? 'schedule' : (mode === 'datetime' ? 'calendar_month' : 'event');
      if (!element.hasAttribute('data-end-action')) {
        element.setAttribute('data-end-action', element.getAttribute('data-end-icon') || defaultIcon);
        element.removeAttribute('data-end-icon');
      }

      const formatAttr = element.getAttribute('data-format') || '';
      const isAmPm = element.getAttribute('data-ampm') === 'true' ||
                     (element.hasAttribute('data-ampm') && element.getAttribute('data-ampm') !== 'false') ||
                     Boolean(formatAttr && (/(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(formatAttr) || formatAttr.includes('hh')));
      const format = formatAttr || DateTimePicker._defaultFormatFor(mode, isAmPm, resolveRawLocale(element));

      // Máscara derivada del formato salvo que se declare data-mask
      if (!element.hasAttribute('data-mask')) {
        let mask;
        if (!formatAttr && mode === 'time') mask = isAmPm ? 'time-ampm' : 'time';
        else mask = formatToMask(format);
        if (mask === '00/00/0000') mask = 'date';
        if (isRange) {
          const single = mask === 'date' ? '00/00/0000' : (mask === 'time' ? '00:00' : (mask === 'time-ampm' ? '00:00 AA' : mask));
          mask = (format.includes(' - ') || format.includes(' / ')) ? single : `${single} - ${single}`;
        }
        element.setAttribute('data-mask', mask);
      }

      textField = new TextField(element);
      element = textField.element;
    }

    super(element);

    this._textField = textField;
    this._mode = mode;
    this._isRange = isRange;
    this._isStatic = isStatic;
    this._isOpen = false;
    this.input = isStatic ? null : this.element.querySelector('.mtx-text-field__input, input');
    // El input queda vinculado al picker, no al TextField interno.
    if (this.input && this.input !== this.element) registerInstance(this.input, this);

    /** Lee un atributo del contenedor o, si no existe, del input. */
    const attr = (name) => this.element.getAttribute(name) ?? (this.input ? this.input.getAttribute(name) : null);

    this._rangeSeparator = attr('data-range-separator') || ' - ';
    this._rangeStart = null;
    this._rangeEnd = null;
    this._rangeStep = 'start';
    this._hoverDate = null;
    this._focusedDate = null;
    const timeViewAttr = attr('data-time-view') || attr('data-time-mode');
    this._timeInputMode = (timeViewAttr === 'dial' || timeViewAttr === 'clock') ? 'dial' : 'input';
    this._timeUnit = 'hours';
    this._currentView = mode === 'time' ? 'time' : 'calendar';
    this._activeTab = mode === 'time' ? 'time' : 'date';

    // Configuración de formato y límites (el formato debe existir antes de parsear)
    this._format = attr('data-format') || this._getDefaultFormat();
    this._minDate = this._parseDate(attr('data-min') || attr('min'));
    this._maxDate = this._parseDate(attr('data-max') || attr('max'));
    this._displayMode = attr('data-display') === 'modal' ? 'modal' : 'popover';

    // Horas y minutos independientes para fecha simple y para rangos
    this._selectedHour = 12;
    this._selectedMinute = 0;
    this._selectedAmPm = 'PM';

    this._startHour = 9;
    this._startMinute = 0;
    this._startAmPm = 'AM';

    this._endHour = 18;
    this._endMinute = 0;
    this._endAmPm = 'PM';

    // Valor inicial: value del input, data-value o data-default-value (ISO o formato activo)
    const initialVal = rawInitial || (this.input ? this.input.value : '') ||
                       attr('data-value') || attr('data-default-value') || '';

    if (this._isRange && initialVal && (initialVal.includes(this._rangeSeparator) || initialVal.includes(' - '))) {
      const sep = initialVal.includes(this._rangeSeparator) ? this._rangeSeparator : ' - ';
      const [sPart, ePart] = initialVal.split(sep);
      this._rangeStart = this._parseDate(sPart);
      this._rangeEnd = this._parseDate(ePart);
      this._selectedDate = this._rangeStart;
      if (this._rangeStart) {
        this._startHour = this._rangeStart.getHours();
        this._startMinute = this._rangeStart.getMinutes();
        this._startAmPm = this._startHour >= 12 ? 'PM' : 'AM';
      }
      if (this._rangeEnd) {
        this._endHour = this._rangeEnd.getHours();
        this._endMinute = this._rangeEnd.getMinutes();
        this._endAmPm = this._endHour >= 12 ? 'PM' : 'AM';
      }
    } else {
      this._selectedDate = initialVal ? this._parseDate(initialVal) : null;
      if (this._selectedDate) {
        this._selectedHour = this._selectedDate.getHours();
        this._selectedMinute = this._selectedDate.getMinutes();
        this._selectedAmPm = this._selectedHour >= 12 ? 'PM' : 'AM';
        if (this._isRange) {
          this._rangeStart = this._selectedDate;
          this._startHour = this._selectedHour;
          this._startMinute = this._selectedMinute;
          this._startAmPm = this._selectedAmPm;
        }
      }
    }

    this._viewDate = this._selectedDate ? new Date(this._selectedDate) : new Date();

    if (this.input) {
      if (this._isRange && this._rangeStart) {
        this.input.value = this._rangeEnd
          ? `${this._formatDate(this._rangeStart)}${this._rangeSeparator}${this._formatDate(this._rangeEnd)}`
          : this._formatDate(this._rangeStart);
      } else if (!this._isRange && this._selectedDate) {
        this.input.value = this._formatDate(this._selectedDate);
      } else if (rawInitial && !this.input.value) {
        // Valor no interpretable: se conserva tal cual para que el usuario lo corrija.
        this.input.value = rawInitial;
      }
      this._syncFieldState();
    }

    this._okText = attr('data-ok-text');
    this._cancelText = attr('data-cancel-text');
    this._todayText = attr('data-today-text');

    this.element.mtxDateTimePicker = this;
    if (this.input) {
      this.input.mtxDateTimePicker = this;
    }

    this._buildPickerDOM();
    this._bindEvents();
    this._syncToggleButton();

    if (this._isStatic) {
      this._renderCurrentView();
    }
  }

  /**
   * Formato por defecto según modo, AM/PM y locale (`en` → MM/DD/YYYY, `es` → DD/MM/YYYY).
   *
   * @param {'date'|'time'|'datetime'} mode Modo del picker.
   * @param {boolean} isAmPm Formato de 12 horas.
   * @param {string} rawLocale Locale crudo.
   * @returns {string} Patrón de formato.
   */
  static _defaultFormatFor(mode, isAmPm, rawLocale) {
    const timeFmt = isAmPm ? 'hh:mm A' : 'HH:mm';
    if (mode === 'time') return timeFmt;
    const dateFmt = localeDateOrder(rawLocale).join('/');
    return mode === 'datetime' ? `${dateFmt} ${timeFmt}` : dateFmt;
  }

  /**
   * Locale crudo de la instancia (p. ej. `es-MX`).
   * @private
   * @returns {string}
   */
  _getLocale() {
    return resolveRawLocale(this.element);
  }

  /**
   * Idioma registrado en i18n para los textos (resuelto con `getComponentLocale()`).
   * @private
   * @returns {string}
   */
  _getLang() {
    return getComponentLocale(this.element);
  }

  /**
   * Obtiene una traducción del componente DateTimePicker.
   * @private
   */
  _t(key, params = null, fallback = null) {
    return t('dateTimePicker', key, params, fallback, this._getLang());
  }

  /**
   * Diccionario i18n del idioma base, solo si está registrado (si no, se usa `Intl`).
   * @private
   * @returns {object|null}
   */
  _getLangDict() {
    const lang = this._getLang();
    // Un locale local sin diccionario (p. ej. `fr-FR`) toma meses y días de `Intl`.
    if (!matchesLang(this._getLocale(), lang)) return null;
    const dict = getDictionary(lang);
    return dict && dict.code === lang && dict.dateTimePicker ? dict.dateTimePicker : null;
  }

  /**
   * Nombres de meses o días generados con `Intl` para el locale activo.
   * @private
   * @param {'month'|'weekday'} kind Tipo de nombre.
   * @param {'long'|'short'|'narrow'} width Longitud.
   * @returns {string[]|null} Lista de nombres o `null` si `Intl` no está disponible.
   */
  _intlNames(kind, width) {
    try {
      const fmt = new Intl.DateTimeFormat(toIntlLocale(this._getLocale()), { [kind]: width });
      const count = kind === 'month' ? 12 : 7;
      // 2026-02-01 es domingo: base para los días de la semana
      const names = Array.from({ length: count }, (_, i) => fmt.format(kind === 'month' ? new Date(2026, i, 1) : new Date(2026, 1, 1 + i)));
      return names.map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    } catch (e) {
      return null;
    }
  }

  /**
   * Retorna la lista de nombres completos de meses según el idioma activo.
   * @private
   */
  _getMonthNames() {
    const dict = this._getLangDict();
    return (dict && dict.months) || this._intlNames('month', 'long') || getDictionary('en').dateTimePicker.months;
  }

  /**
   * Retorna la lista de nombres abreviados de meses según el idioma activo.
   * @private
   */
  _getMonthNamesShort() {
    const dict = this._getLangDict();
    return (dict && dict.monthsShort) || this._intlNames('month', 'short') || getDictionary('en').dateTimePicker.monthsShort;
  }

  /**
   * Retorna la lista de iniciales de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNames() {
    const dict = this._getLangDict();
    return (dict && dict.weekdays) || this._intlNames('weekday', 'narrow') || getDictionary('en').dateTimePicker.weekdays;
  }

  /**
   * Retorna la lista de nombres abreviados de días de la semana según el idioma activo.
   * @private
   */
  _getWeekdayNamesShort() {
    const dict = this._getLangDict();
    return (dict && dict.weekdaysShort) || this._intlNames('weekday', 'short') || getDictionary('en').dateTimePicker.weekdaysShort;
  }

  /**
   * Nombres completos de los días de la semana (cabeceras accesibles del grid).
   * @private
   */
  _getWeekdayNamesLong() {
    return this._intlNames('weekday', 'long') || this._getWeekdayNamesShort();
  }

  /**
   * Etiqueta accesible completa de un día ("Tuesday, October 20, 2026").
   * @private
   * @param {Date} date Fecha.
   * @returns {string} Texto localizado.
   */
  _formatDayLabel(date) {
    try {
      return new Intl.DateTimeFormat(toIntlLocale(this._getLocale()), {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }).format(date);
    } catch (e) {
      return `${this._getWeekdayNamesShort()[date.getDay()]}, ${this._getMonthNames()[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  }

  /**
   * Determina si el componente está configurado en formato 12 horas AM/PM.
   * @private
   * @returns {boolean}
   */
  _isAmPmMode() {
    const elVal = this.element ? this.element.getAttribute('data-ampm') : null;
    if (elVal === 'true' || (this.element && this.element.hasAttribute('data-ampm') && elVal !== 'false')) {
      return true;
    }
    const inputVal = this.input ? this.input.getAttribute('data-ampm') : null;
    if (inputVal === 'true' || (this.input && this.input.hasAttribute('data-ampm') && inputVal !== 'false')) {
      return true;
    }
    if (this._format) {
      return /(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(this._format) || this._format.includes('hh');
    }
    return false;
  }

  /**
   * Retorna el formato de fecha por defecto según el modo y el locale activos.
   * @private
   */
  _getDefaultFormat() {
    return DateTimePicker._defaultFormatFor(this._mode, this._isAmPmMode(), this._getLocale());
  }

  /**
   * Orden de los segmentos de fecha del formato activo (o del locale si el formato no los define).
   * @private
   * @returns {string[]} Tokens `DD`, `MM`, `YYYY` ordenados.
   */
  _getDateOrder() {
    const tokens = (this._format || '').match(/YYYY|AAAA|YY|MM|DD/g) || [];
    const norm = tokens.map((tk) => (tk === 'AAAA' || tk === 'YY' ? 'YYYY' : tk));
    if (norm.length === 3 && new Set(norm).size === 3) return norm;
    return localeDateOrder(this._getLocale());
  }

  /**
   * Patrón de solo fecha del locale/formato activo (p. ej. `MM/DD/YYYY`).
   * @private
   * @returns {string}
   */
  _getDatePattern() {
    return this._getDateOrder().join('/');
  }

  /**
   * Sincroniza la clase `--has-value` del TextField tras escribir el valor por código.
   * @private
   */
  _syncFieldState() {
    if (!this.input) return;
    if (this._textField && typeof this._textField._syncAria === 'function') {
      this._textField._syncAria();
    } else if (this.element.classList.contains('mtx-text-field')) {
      this.element.classList.toggle('mtx-text-field--has-value', Boolean(this.input.value.trim()));
    }
  }

  /**
   * Botón que abre el picker (IconButton final o adorno heredado del marcado BEM).
   * @private
   * @returns {HTMLElement|null}
   */
  _getToggleButton() {
    if (this._isStatic) return null;
    if (this._textField && this._textField.endAction) return this._textField.endAction;
    return this.element.querySelector('.mtx-text-field__action--end, .mtx-text-field__adornment--end');
  }

  /**
   * Nombre accesible del diálogo y del botón según el modo.
   * @private
   * @returns {string}
   */
  _getDialogLabel() {
    if (this._mode === 'time') return this._t('chooseTime', null, 'Choose time');
    if (this._isRange) return this._t('chooseDateRange', null, 'Choose date range');
    if (this._mode === 'datetime') return this._t('chooseDateTime', null, 'Choose date and time');
    return this._t('chooseDate', null, 'Choose date');
  }

  /**
   * Refleja en el botón de apertura su nombre, `aria-expanded` y el estado deshabilitado/solo lectura.
   * @private
   */
  _syncToggleButton() {
    const btn = this._getToggleButton();
    if (!btn) return;
    const label = this._getDialogLabel();
    const value = this.input ? this.input.value.trim() : '';
    btn.setAttribute('aria-label', value ? this._t('chooseWithValue', { label, value }, `${label}, ${value}`) : label);
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', String(this._isOpen));
    if (this._container && this._container.id) btn.setAttribute('aria-controls', this._container.id);
    const locked = Boolean(this.input && (this.input.disabled || this.input.readOnly));
    if (btn.tagName === 'BUTTON') {
      btn.disabled = locked;
    } else {
      // Adorno heredado (span) del marcado BEM: se convierte en botón accesible
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', locked ? '-1' : '0');
      btn.removeAttribute('aria-hidden');
    }
    if (locked) btn.setAttribute('aria-disabled', 'true');
    else btn.removeAttribute('aria-disabled');
  }

  /**
   * Construye el contenedor DOM del picker (popover, diálogo modal o estático).
   * @private
   */
  _buildPickerDOM() {
    if (this._isStatic) {
      this.element.classList.add('mtx-picker-static');
      this._container = this.element;
      if (!this.element.hasAttribute('role')) {
        this.element.setAttribute('role', 'group');
        this._addedRole = true;
      }
      if (!this.element.hasAttribute('aria-label') && !this.element.hasAttribute('aria-labelledby')) {
        this.element.setAttribute('aria-label', this._getDialogLabel());
        this._addedLabel = true;
      }
      this.listen(this._container, 'keydown', (e) => this._handleContainerKeyDown(e));
      return;
    }

    const stop = (e) => e.stopPropagation();
    if (this._displayMode === 'modal') {
      this._backdrop = document.createElement('div');
      this._backdrop.className = 'mtx-picker-backdrop';
      this._dialog = document.createElement('div');
      this._dialog.className = 'mtx-picker-dialog';
      this._dialog.setAttribute('aria-modal', 'true');
      this._dialog.addEventListener('click', stop);
      this._dialog.addEventListener('mousedown', stop);
      this._backdrop.appendChild(this._dialog);
      document.body.appendChild(this._backdrop);
      this._container = this._dialog;
    } else {
      // Backdrop semitransparente para pantallas móviles (< 600px)
      this._mobileBackdrop = document.createElement('div');
      this._mobileBackdrop.className = 'mtx-picker-backdrop-mobile';
      this._mobileBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close(true);
      });
      document.body.appendChild(this._mobileBackdrop);

      this._popover = document.createElement('div');
      this._popover.className = 'mtx-picker-popover';
      this._popover.addEventListener('click', stop);
      this._popover.addEventListener('mousedown', stop);
      this.element.appendChild(this._popover);
      this._container = this._popover;
    }

    // Patrón WAI-ARIA "Date Picker Dialog"
    this._container.id = uniqueId('mtx-picker-dialog');
    this._container.setAttribute('role', 'dialog');
    this._container.setAttribute('aria-label', this._getDialogLabel());
    this.listen(this._container, 'keydown', (e) => this._handleContainerKeyDown(e));
    this.listen(this._container, 'focusout', (e) => this._handleFocusOut(e));
  }

  /**
   * Asocia los eventos interactivos del picker. Todo listener pasa por `listen()` para liberarse en `destroy()`.
   * @private
   */
  _bindEvents() {
    // Cambios de idioma global: textos y nombres accesibles
    this.listen(document, 'mtx:locale:change', () => {
      if (this._container && this._container.getAttribute('role') === 'dialog') {
        this._container.setAttribute('aria-label', this._getDialogLabel());
      }
      this._syncToggleButton();
      if (this._isOpen || this._isStatic) this._renderCurrentView();
    });

    if (this._isStatic || !this.input) return;

    const toggleBtn = this._getToggleButton();
    if (toggleBtn) {
      toggleBtn.style.cursor = 'pointer';
      this.listen(toggleBtn, 'click', (e) => {
        e.stopPropagation();
        if (this._isLocked()) return;
        if (this._isOpen) this.close(true);
        else this.open({ focus: true });
      });
      if (toggleBtn.tagName !== 'BUTTON') {
        this.listen(toggleBtn, 'keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBtn.click();
          }
        });
      }
    }

    // Clic en el campo: abre sin mover el foco (permite seguir escribiendo)
    this.listen(this.input, 'click', (e) => {
      e.stopPropagation();
      if (!this._isOpen) this.open({ focus: false });
    });

    // Validación estricta de caracteres según el tipo de selector
    const allowedCharRegex = this._mode === 'time'
      ? /^[0-9:\sAPMapm]$/
      : (this._mode === 'date' ? /^[0-9/\-.\s]$/ : /^[0-9/\-.:\sAPMapm]$/);

    const invalidFilterRegex = this._mode === 'time'
      ? /[^0-9:\sAPMapm]/g
      : (this._mode === 'date' ? /[^0-9/\-.\s]/g : /[^0-9/\-.:\sAPMapm]/g);

    this.listen(this.input, 'keydown', (e) => {
      // Alt+↓ abre el picker y mueve el foco; ↓ con el picker abierto entra en él
      if (e.key === 'ArrowDown' && (e.altKey || this._isOpen)) {
        e.preventDefault();
        if (!this._isOpen) this.open({ focus: true });
        else this._focusActiveView();
        return;
      }
      // Permitir teclas de función/control y combinaciones con Ctrl / Meta / Alt
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
        return;
      }
      if (!allowedCharRegex.test(e.key)) {
        e.preventDefault();
      }
    });

    this.listen(this.input, 'paste', (e) => {
      const pasteData = (e.clipboardData || window.clipboardData)?.getData('text');
      if (pasteData && new RegExp(invalidFilterRegex.source).test(pasteData)) {
        e.preventDefault();
        const sanitized = pasteData.replace(invalidFilterRegex, '');
        if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, sanitized);
        } else {
          const start = this.input.selectionStart || 0;
          const end = this.input.selectionEnd || 0;
          const val = this.input.value;
          this.input.value = val.slice(0, start) + sanitized + val.slice(end);
          this.input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });

    const handleInputChange = () => {
      if (this._isInternalChange) return;
      if (new RegExp(invalidFilterRegex.source).test(this.input.value)) {
        this.input.value = this.input.value.replace(invalidFilterRegex, '');
      }
      const val = this.input.value.trim();
      if (!val) {
        this._selectedDate = null;
        this._rangeStart = null;
        this._rangeEnd = null;
        if (this._isOpen) this._renderCurrentView();
        return;
      }

      if (this._isRange && (val.includes(this._rangeSeparator) || val.includes(' - '))) {
        const sep = val.includes(this._rangeSeparator) ? this._rangeSeparator : ' - ';
        const [sPart, ePart] = val.split(sep);
        const sDate = this._parseDate(sPart);
        const eDate = this._parseDate(ePart);
        if (sDate) this._rangeStart = sDate;
        if (eDate) this._rangeEnd = eDate;
        this._selectedDate = this._rangeStart || this._rangeEnd;
        if (this._isOpen) this._renderCurrentView();
        return;
      }

      const d = this._parseDate(val);
      if (d) {
        this._selectedDate = d;
        if (this._isRange) {
          this._rangeStart = d;
        }
        this._viewDate = new Date(d);
        this._selectedHour = d.getHours();
        this._selectedMinute = d.getMinutes();
        this._selectedAmPm = this._selectedHour >= 12 ? 'PM' : 'AM';
        if (this._isOpen) this._renderCurrentView();
      }
    };

    this.listen(this.input, 'change', handleInputChange);
    this.listen(this.input, 'input', handleInputChange);

    // Cerrar por click afuera
    this.listen(document, 'click', (e) => {
      if (!this._isOpen) return;
      if (this._displayMode === 'modal') {
        if (e.target === this._backdrop) this.close(true);
        return;
      }
      if (this._mobileBackdrop && e.target === this._mobileBackdrop) {
        this.close(true);
        return;
      }
      const path = e.composedPath ? e.composedPath() : [];
      if (path.includes(this.element) || path.includes(this._container)) return;
      if (this.element.contains(e.target) || this._container.contains(e.target)) return;
      this.close();
    });

    // Reposicionar al cambiar tamaño de pantalla
    this.listen(window, 'resize', () => {
      if (!this._isOpen) return;
      this._syncModalState();
      this._positionPopover();
    });
  }

  /**
   * Indica si el viewport es móvil (≤ 600px), donde el popover se comporta como modal.
   * @private
   * @returns {boolean}
   */
  _isMobileViewport() {
    return typeof window !== 'undefined' && window.innerWidth <= 600;
  }

  /**
   * Indica si el picker actúa como modal (diálogo o popover en móvil).
   * @private
   * @returns {boolean}
   */
  _isModal() {
    return this._displayMode === 'modal' || Boolean(this._popover && this._isMobileViewport());
  }

  /**
   * Ajusta `aria-modal` del popover según el viewport.
   * @private
   */
  _syncModalState() {
    if (!this._popover) return;
    if (this._isMobileViewport()) this._popover.setAttribute('aria-modal', 'true');
    else this._popover.removeAttribute('aria-modal');
  }

  /**
   * Indica si el campo está deshabilitado o es de solo lectura.
   * @private
   * @returns {boolean}
   */
  _isLocked() {
    if (this._isStatic) return this.element.getAttribute('aria-disabled') === 'true';
    return Boolean(this.input && (this.input.disabled || this.input.readOnly));
  }

  /**
   * Cierra el popover cuando el foco sale con Tab fuera del campo y del picker (modo no modal).
   * @private
   * @param {FocusEvent} e Evento focusout.
   */
  _handleFocusOut(e) {
    if (!this._isOpen || this._isModal()) return;
    const next = e.relatedTarget;
    if (!next || !(next instanceof Node)) return;
    if (this.element.contains(next) || this._container.contains(next)) return;
    this.close(false);
  }

  /**
   * Teclado dentro del picker: trampa de foco, grid de días, meses, años, pestañas y reloj.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleContainerKeyDown(e) {
    if (e.key === 'Tab' && this._isOpen && this._isModal()) {
      this._trapTab(e);
      return;
    }
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('mtx-date-picker__day')) this._handleGridKeyDown(e, target);
    else if (target.classList.contains('mtx-date-picker__month') || target.classList.contains('mtx-date-picker__year')) this._handleOptionGridKeyDown(e, target);
    else if (target.getAttribute('role') === 'tab') this._handleTabKeyDown(e, target);
    else if (target.classList.contains('mtx-time-picker__clock')) this._handleClockKeyDown(e);
  }

  /**
   * Mantiene el foco dentro del contenedor modal.
   * @private
   * @param {KeyboardEvent} e Evento Tab.
   */
  _trapTab(e) {
    const focusable = Array.from(this._container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => (
      el.getAttribute('tabindex') !== '-1' && !el.hidden && el.getAttribute('aria-hidden') !== 'true'
    ));
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !this._container.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !this._container.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  /**
   * Posiciona el popover adaptándolo al espacio disponible de la pantalla para evitar desbordamientos.
   * @private
   */
  _positionPopover() {
    if (!this._popover || this._displayMode === 'modal' || this._isMobileViewport()) {
      return;
    }
    this._popover.style.left = '0';
    this._popover.style.right = 'auto';
    this._popover.style.top = '100%';
    this._popover.style.bottom = 'auto';
    this._popover.style.marginTop = '4px';
    this._popover.style.marginBottom = '0';

    if (typeof window === 'undefined') return;

    const elRect = this.element.getBoundingClientRect();

    // Colisión con el borde derecho de la ventana
    if (elRect.left + 320 > window.innerWidth) {
      this._popover.style.left = 'auto';
      this._popover.style.right = '0';
    }

    // Colisión con el borde inferior de la ventana
    const spaceBelow = window.innerHeight - elRect.bottom;
    const spaceAbove = elRect.top;
    if (spaceBelow < 380 && spaceAbove > spaceBelow) {
      this._popover.style.top = 'auto';
      this._popover.style.bottom = '100%';
      this._popover.style.marginTop = '0';
      this._popover.style.marginBottom = '4px';
    }
  }

  /**
   * Abre el selector visual de fecha/hora.
   *
   * @param {{focus?: boolean}} [options] `focus: false` mantiene el foco en el campo (apertura por clic en el input).
   */
  open(options = {}) {
    if (this._isOpen || this._isStatic || this._isLocked()) return;

    // 1. Cerrar cualquier otro selector que se encuentre abierto actualmente
    if (DateTimePicker._activePicker && DateTimePicker._activePicker !== this) {
      DateTimePicker._activePicker.close(false);
    }
    DateTimePicker._activePicker = this;

    this._isOpen = true;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    this._returnFocusEl = active && active !== document.body && this.element.contains(active) ? active : null;

    // Restablecer siempre a la vista original por defecto
    const timeViewAttr = this.element.getAttribute('data-time-view') ||
                         this.element.getAttribute('data-time-mode') ||
                         (this.input ? (this.input.getAttribute('data-time-view') || this.input.getAttribute('data-time-mode')) : null);
    this._timeInputMode = (timeViewAttr === 'dial' || timeViewAttr === 'clock') ? 'dial' : 'input';

    if (this._mode === 'time') {
      this._activeTab = 'time';
      this._timeUnit = 'hours';
      this._currentView = 'time';
    } else {
      this._activeTab = 'date';
      this._currentView = 'calendar';
    }

    // Sincronizar la vista con la fecha seleccionada o hoy
    if (this._selectedDate) {
      this._viewDate = new Date(this._selectedDate);
      this._selectedHour = this._selectedDate.getHours();
      this._selectedMinute = this._selectedDate.getMinutes();
      this._selectedAmPm = this._selectedHour >= 12 ? 'PM' : 'AM';
    } else {
      this._viewDate = new Date();
    }
    this._focusedDate = null;

    this._renderCurrentView();

    if (this._displayMode === 'modal') {
      this._backdrop.classList.add('mtx-picker-backdrop--open');
    } else {
      if (this._mobileBackdrop) {
        // Solo es visible en pantallas ≤ 600px (media query del CSS)
        this._mobileBackdrop.classList.add('mtx-picker-backdrop-mobile--open');
      }
      this._syncModalState();
      this._positionPopover();
      this._popover.classList.add('mtx-picker-popover--open');
    }
    this._syncToggleButton();
    // Escape (pila de capas) cierra solo si es la capa superior y devuelve el foco.
    pushLayer(this, {
      kind: this._displayMode === 'modal' ? 'modal' : 'popup',
      nodes: () => [this._container, this._backdrop, this._mobileBackdrop],
      stack: () => [{ node: this._backdrop }, { node: this._mobileBackdrop, offset: -1 }],
      onEscape: () => this.close(true),
    });

    // Foco inicial: día seleccionado/hoy (o la vista de hora). En modal siempre.
    if (options.focus !== false || this._isModal()) {
      this._focusActiveView();
    }

    emit(this.input || this.element, 'mtx:date-time-picker:open', { picker: this }, { aliases: ['mtx:open'] });
  }

  /**
   * Cierra el selector visual de fecha/hora.
   *
   * @param {boolean} [focusInput=false] Si es true, devuelve el foco al elemento que lo abrió (botón o campo).
   */
  close(focusInput = false) {
    if (!this._isOpen || this._isStatic) return;
    this._isOpen = false;
    if (this._activeDragEnd) this._activeDragEnd(false);
    this._clearTimer(this._clockSwitchTimer);
    this._clockSwitchTimer = null;

    if (DateTimePicker._activePicker === this) {
      DateTimePicker._activePicker = null;
    }
    removeLayer(this);

    if (this._displayMode === 'modal') {
      this._backdrop.classList.remove('mtx-picker-backdrop--open');
    } else {
      if (this._mobileBackdrop) {
        this._mobileBackdrop.classList.remove('mtx-picker-backdrop-mobile--open');
      }
      this._popover.classList.remove('mtx-picker-popover--open');
    }
    this._syncToggleButton();

    if (focusInput) {
      const target = this._returnFocusEl && this._returnFocusEl.isConnected && !this._returnFocusEl.disabled
        ? this._returnFocusEl
        : this.input;
      if (target && typeof target.focus === 'function') {
        try {
          target.focus({ preventScroll: true });
        } catch (_) {
          target.focus();
        }
      }
    }
    this._returnFocusEl = null;

    emit(this.input || this.element, 'mtx:date-time-picker:close', { picker: this }, { aliases: ['mtx:close'] });
  }

  /**
   * Alterna entre abierto y cerrado.
   */
  toggle() {
    if (this._isOpen) this.close(true);
    else this.open();
  }

  /**
   * Cierra cualquier selector de fecha/hora actualmente abierto en la página.
   *
   * @param {boolean} [focusInput=false]
   */
  static closeAll(focusInput = false) {
    if (DateTimePicker._activePicker) {
      DateTimePicker._activePicker.close(focusInput);
    }
  }

  /**
   * Indica si el componente está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    if (this.input) return this.input.disabled === true;
    return this.element.getAttribute('aria-disabled') === 'true';
  }

  /**
   * Deshabilita el campo, el botón de apertura y cierra el picker si estaba abierto.
   */
  disable() {
    if (this._isOpen) this.close(false);
    if (this.input) {
      if (this._textField && typeof this._textField.disable === 'function') this._textField.disable();
      else this.input.disabled = true;
    } else {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.setAttribute('inert', '');
      this.element.classList.add('mtx-picker-static--disabled');
    }
    this._syncToggleButton();
  }

  /**
   * Vuelve a habilitar el campo y el botón de apertura.
   */
  enable() {
    if (this.input) {
      if (this._textField && typeof this._textField.enable === 'function') this._textField.enable();
      else this.input.disabled = false;
    } else {
      this.element.removeAttribute('aria-disabled');
      this.element.removeAttribute('inert');
      this.element.classList.remove('mtx-picker-static--disabled');
    }
    this._syncToggleButton();
  }

  /**
   * Programa un temporizador que se cancela en `destroy()`.
   *
   * @param {Function} callback Función a ejecutar.
   * @param {number} delay Retardo en milisegundos.
   * @returns {number|null} Id del temporizador, o `null` si la instancia ya se destruyó.
   */
  _setTimer(callback, delay) {
    if (this.destroyed) return null;
    if (!this._timers) this._timers = new Set();
    const id = setTimeout(() => {
      this._timers.delete(id);
      if (!this.destroyed) callback();
    }, delay);
    this._timers.add(id);
    return id;
  }

  /**
   * Cancela un temporizador programado con `_setTimer()`.
   *
   * @param {number|null} id Id del temporizador.
   */
  _clearTimer(id) {
    if (id == null) return;
    clearTimeout(id);
    if (this._timers) this._timers.delete(id);
  }

  /**
   * Cancela todos los temporizadores pendientes.
   */
  _clearTimers() {
    if (!this._timers) return;
    this._timers.forEach((id) => clearTimeout(id));
    this._timers.clear();
    this._clockSwitchTimer = null;
  }

  /**
   * Libera listeners, nodos generados (popover, backdrops portados a `<body>`) y el registro.
   */
  destroy() {
    if (this.destroyed) return;
    if (this._activeDragEnd) this._activeDragEnd(false);
    if (this._isOpen) this.close(false);
    if (DateTimePicker._activePicker === this) DateTimePicker._activePicker = null;
    this._clearTimers();
    super.destroy();

    if (this._backdrop) this._backdrop.remove();
    if (this._mobileBackdrop) this._mobileBackdrop.remove();
    if (this._popover) this._popover.remove();
    if (this._isStatic && this._container) {
      this._container.innerHTML = '';
      this._container.classList.remove('mtx-picker-static', 'mtx-picker-static--disabled');
      if (this._addedRole) this._container.removeAttribute('role');
      if (this._addedLabel) this._container.removeAttribute('aria-label');
    }
    const btn = this._getToggleButton();
    if (btn) ['aria-haspopup', 'aria-expanded', 'aria-controls'].forEach((a) => btn.removeAttribute(a));

    if (this._textField && typeof this._textField.destroy === 'function' && !this._textField.destroyed) {
      this._textField.destroy();
    }
    if (this.input) {
      unregisterInstance(this.input);
      this.input.removeAttribute('data-mtx-initialized');
      delete this.input.mtxDateTimePicker;
    }
    delete this.element.mtxDateTimePicker;
    this._backdrop = null;
    this._mobileBackdrop = null;
    this._popover = null;
    this._dialog = null;
    this._container = null;
  }

  /**
   * Renderiza el contenido del picker según el modo y la vista activa, conservando el foco.
   * @private
   */
  _renderCurrentView() {
    if (!this._container) return;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    const hadFocus = Boolean(active && this._container.contains(active));
    const focusKey = hadFocus ? active.getAttribute('data-focus-key') : null;

    this._container.innerHTML = '';

    // 1. Cabecera Material Design para modo modal o estático
    if (this._displayMode === 'modal' || this._isStatic) {
      this._renderHeader();
    }

    // 2. Pestañas de DateTimePicker si corresponde
    if (this._mode === 'datetime') {
      this._renderTabs();
    }

    // 3. Contenedor de contenido de vista
    const content = document.createElement('div');
    content.className = 'mtx-picker-content';

    if (this._activeTab === 'date') {
      if (this._currentView === 'years') {
        content.appendChild(this._createYearPicker());
      } else if (this._currentView === 'months') {
        content.appendChild(this._createMonthPicker());
      } else {
        content.appendChild(this._createCalendar());
      }
    } else {
      content.appendChild(this._createTimePicker());
    }

    this._container.appendChild(content);

    // 4. Barra de acciones inferior
    this._renderActions();

    if (hadFocus) this._restoreFocus(focusKey);
  }

  /**
   * Devuelve el foco al control equivalente tras re-renderizar (o a la vista activa).
   * @private
   * @param {string|null} key Valor de `data-focus-key` del elemento que tenía el foco.
   */
  _restoreFocus(key) {
    if (!this._container) return;
    let el = null;
    if (key === 'grid' || key === 'month' || key === 'year') {
      el = this._container.querySelector(`[data-focus-key="${key}"][tabindex="0"]`);
    } else if (key) {
      el = this._container.querySelector(`[data-focus-key="${key}"]`);
    }
    if (el && !el.disabled) el.focus();
    else this._focusActiveView();
  }

  /**
   * Enfoca el elemento principal de la vista activa (día con tabindex 0, mes, año, reloj u hora).
   * @private
   */
  _focusActiveView() {
    if (!this._container) return;
    const selectors = {
      calendar: '.mtx-date-picker__day[tabindex="0"]',
      months: '.mtx-date-picker__month[tabindex="0"]',
      years: '.mtx-date-picker__year[tabindex="0"]',
    };
    let el = null;
    if (this._activeTab === 'date') {
      el = this._container.querySelector(selectors[this._currentView] || selectors.calendar);
    } else {
      el = this._container.querySelector('.mtx-time-picker__clock, .mtx-time-picker__digit-card--input');
    }
    if (!el) {
      el = Array.from(this._container.querySelectorAll(FOCUSABLE_SELECTOR))
        .find((node) => node.getAttribute('tabindex') !== '-1');
    }
    if (el) {
      el.focus();
      if (el.classList.contains('mtx-date-picker__year') && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'center' });
      }
    }
  }

  /**
   * Renderiza la cabecera Material Design.
   * @private
   */
  _renderHeader() {
    if (this._mode === 'time' || this._activeTab !== 'date') {
      return;
    }

    const header = document.createElement('div');
    header.className = 'mtx-picker-header';

    // 1. Caso Range DateTimePicker
    if (this._isRange && this._mode === 'datetime') {
      const topLabel = document.createElement('div');
      topLabel.className = 'mtx-picker-header__year';
      if (this._activeTab === 'date') {
        const yr = this._rangeStart ? this._rangeStart.getFullYear() : (this._rangeEnd ? this._rangeEnd.getFullYear() : new Date().getFullYear());
        topLabel.textContent = yr;
        topLabel.addEventListener('click', () => {
          this._activeTab = 'date';
          this._currentView = 'years';
          this._renderCurrentView();
        });
      } else if (this._activeTab === 'time-start') {
        topLabel.textContent = this._t('startTimeHeader', null, 'START TIME');
      } else if (this._activeTab === 'time-end') {
        topLabel.textContent = this._t('endTimeHeader', null, 'END TIME');
      }
      header.appendChild(topLabel);

      if (this._activeTab === 'date') {
        const dateText = document.createElement('div');
        dateText.className = 'mtx-picker-header__date';
        dateText.style.fontSize = '1.05rem';
        if (this._rangeStart && this._rangeEnd) {
          const sDay = this._rangeStart.getDate();
          const sMonth = this._getMonthNamesShort()[this._rangeStart.getMonth()];
          const eDay = this._rangeEnd.getDate();
          const eMonth = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
          dateText.textContent = `${sDay} ${sMonth} - ${eDay} ${eMonth}`;
        } else if (this._rangeStart) {
          const sDay = this._rangeStart.getDate();
          const sMonth = this._getMonthNamesShort()[this._rangeStart.getMonth()];
          dateText.textContent = `${sDay} ${sMonth} - ${this._t('selectEnd', null, 'Select end date')}`;
        } else {
          dateText.textContent = this._t('selectRange', null, 'Select range');
        }
        header.appendChild(dateText);
      } else {
        const isEnd = this._activeTab === 'time-end';
        const h24 = isEnd ? this._endHour : this._startHour;
        const minVal = isEnd ? this._endMinute : this._startMinute;
        const ampmVal = isEnd ? this._endAmPm : this._startAmPm;

        let displayHours = h24 % 12;
        if (displayHours === 0) displayHours = 12;
        const hoursStr = String(displayHours).padStart(2, '0');
        const minStr = String(minVal).padStart(2, '0');

        const timeContainer = document.createElement('div');
        timeContainer.className = 'mtx-picker-header__time';

        const hourSpan = document.createElement('span');
        hourSpan.className = `mtx-picker-header__time-unit ${this._currentView === 'clock-hours' ? 'mtx-picker-header__time-unit--active' : ''}`;
        hourSpan.textContent = hoursStr;
        hourSpan.addEventListener('click', () => {
          this._currentView = 'clock-hours';
          this._renderCurrentView();
        });

        const sep = document.createElement('span');
        sep.textContent = ':';

        const minSpan = document.createElement('span');
        minSpan.className = `mtx-picker-header__time-unit ${this._currentView === 'clock-minutes' ? 'mtx-picker-header__time-unit--active' : ''}`;
        minSpan.textContent = minStr;
        minSpan.addEventListener('click', () => {
          this._currentView = 'clock-minutes';
          this._renderCurrentView();
        });

        const ampmGroup = document.createElement('div');
        ampmGroup.className = 'mtx-picker-header__ampm-group';

        const amBtn = document.createElement('span');
        amBtn.className = `mtx-picker-header__ampm-btn ${ampmVal === 'AM' ? 'mtx-picker-header__ampm-btn--active' : ''}`;
        amBtn.textContent = 'AM';
        amBtn.addEventListener('click', () => {
          this._setAmPm('AM');
        });

        const pmBtn = document.createElement('span');
        pmBtn.className = `mtx-picker-header__ampm-btn ${ampmVal === 'PM' ? 'mtx-picker-header__ampm-btn--active' : ''}`;
        pmBtn.textContent = 'PM';
        pmBtn.addEventListener('click', () => {
          this._setAmPm('PM');
        });

        ampmGroup.appendChild(amBtn);
        ampmGroup.appendChild(pmBtn);

        timeContainer.appendChild(hourSpan);
        timeContainer.appendChild(sep);
        timeContainer.appendChild(minSpan);
        timeContainer.appendChild(ampmGroup);
        header.appendChild(timeContainer);
      }

      this._enhanceHeader(header);
      this._container.appendChild(header);
      return;
    }

    // 2. Caso DateRangePicker (solo fechas)
    if (this._isRange) {
      const topLabel = document.createElement('div');
      topLabel.className = 'mtx-picker-header__year';
      const yr = this._rangeStart ? this._rangeStart.getFullYear() : (this._rangeEnd ? this._rangeEnd.getFullYear() : new Date().getFullYear());
      topLabel.textContent = yr;
      topLabel.addEventListener('click', () => {
        this._activeTab = 'date';
        this._currentView = 'years';
        this._renderCurrentView();
      });
      header.appendChild(topLabel);

      const dateText = document.createElement('div');
      dateText.className = 'mtx-picker-header__date';
      dateText.style.fontSize = '1.05rem';
      if (this._rangeStart && this._rangeEnd) {
        const sDay = this._rangeStart.getDate();
        const sMonth = this._getMonthNamesShort()[this._rangeStart.getMonth()];
        const eDay = this._rangeEnd.getDate();
        const eMonth = this._getMonthNamesShort()[this._rangeEnd.getMonth()];
        dateText.textContent = `${sDay} ${sMonth} - ${eDay} ${eMonth}`;
      } else if (this._rangeStart) {
        const sDay = this._rangeStart.getDate();
        const sMonth = this._getMonthNamesShort()[this._rangeStart.getMonth()];
        dateText.textContent = `${sDay} ${sMonth} - ${this._t('selectEnd', null, 'Select end date')}`;
      } else {
        dateText.textContent = this._t('selectRange', null, 'Select range');
      }
      header.appendChild(dateText);
      this._enhanceHeader(header);
      this._container.appendChild(header);
      return;
    }

    // 3. Caso normal DatePicker, TimePicker o DateTimePicker (single)
    const cur = this._selectedDate || new Date();
    const yearBtn = document.createElement('div');
    yearBtn.className = 'mtx-picker-header__year';
    yearBtn.textContent = cur.getFullYear();
    yearBtn.addEventListener('click', () => {
      this._activeTab = 'date';
      this._currentView = 'years';
      this._renderCurrentView();
    });
    header.appendChild(yearBtn);

    if (this._mode === 'date' || (this._mode === 'datetime' && this._activeTab === 'date')) {
      const dateText = document.createElement('div');
      dateText.className = 'mtx-picker-header__date';
      const dayName = this._getWeekdayNamesShort()[cur.getDay()];
      const monthShort = this._getMonthNamesShort()[cur.getMonth()];
      dateText.textContent = `${dayName}, ${cur.getDate()} ${monthShort}`;
      header.appendChild(dateText);
    } else {
      const timeContainer = document.createElement('div');
      timeContainer.className = 'mtx-picker-header__time';

      let displayHours = this._selectedHour % 12;
      if (displayHours === 0) displayHours = 12;
      const hoursStr = String(displayHours).padStart(2, '0');
      const minStr = String(this._selectedMinute).padStart(2, '0');

      const hourSpan = document.createElement('span');
      hourSpan.className = `mtx-picker-header__time-unit ${this._currentView === 'clock-hours' ? 'mtx-picker-header__time-unit--active' : ''}`;
      hourSpan.textContent = hoursStr;
      hourSpan.addEventListener('click', () => {
        this._currentView = 'clock-hours';
        this._renderCurrentView();
      });

      const sep = document.createElement('span');
      sep.textContent = ':';

      const minSpan = document.createElement('span');
      minSpan.className = `mtx-picker-header__time-unit ${this._currentView === 'clock-minutes' ? 'mtx-picker-header__time-unit--active' : ''}`;
      minSpan.textContent = minStr;
      minSpan.addEventListener('click', () => {
        this._currentView = 'clock-minutes';
        this._renderCurrentView();
      });

      const ampmGroup = document.createElement('div');
      ampmGroup.className = 'mtx-picker-header__ampm-group';

      const amBtn = document.createElement('span');
      amBtn.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === 'AM' ? 'mtx-picker-header__ampm-btn--active' : ''}`;
      amBtn.textContent = 'AM';
      amBtn.addEventListener('click', () => {
        this._setAmPm('AM');
      });

      const pmBtn = document.createElement('span');
      pmBtn.className = `mtx-picker-header__ampm-btn ${this._selectedAmPm === 'PM' ? 'mtx-picker-header__ampm-btn--active' : ''}`;
      pmBtn.textContent = 'PM';
      pmBtn.addEventListener('click', () => {
        this._setAmPm('PM');
      });

      ampmGroup.appendChild(amBtn);
      ampmGroup.appendChild(pmBtn);

      timeContainer.appendChild(hourSpan);
      timeContainer.appendChild(sep);
      timeContainer.appendChild(minSpan);
      timeContainer.appendChild(ampmGroup);
      header.appendChild(timeContainer);
    }

    this._enhanceHeader(header);
      this._container.appendChild(header);
  }

  /**
   * Renderiza las pestañas de navegación de DateTimePicker.
   * @private
   */
  _renderTabs() {
    const tabs = document.createElement('div');
    tabs.className = 'mtx-picker-tabs';

    if (this._isRange && this._mode === 'datetime') {
      let startH = this._startHour % 12;
      if (startH === 0) startH = 12;
      const startHStr = String(startH).padStart(2, '0');
      const startMStr = String(this._startMinute).padStart(2, '0');
      const startTimeStr = `${startHStr}:${startMStr} ${this._startAmPm}`;

      let endH = this._endHour % 12;
      if (endH === 0) endH = 12;
      const endHStr = String(endH).padStart(2, '0');
      const endMStr = String(this._endMinute).padStart(2, '0');
      const endTimeStr = `${endHStr}:${endMStr} ${this._endAmPm}`;

      const dateTab = document.createElement('button');
      dateTab.className = `mtx-picker-tab ${this._activeTab === 'date' ? 'mtx-picker-tab--active' : ''}`;
      dateTab.type = 'button';
      dateTab.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t('dates', null, 'Dates')}`;
      dateTab.addEventListener('click', (e) => {
        e.stopPropagation();
        this._activeTab = 'date';
        this._currentView = 'calendar';
        this._renderCurrentView();
      });

      const startTimeTab = document.createElement('button');
      startTimeTab.className = `mtx-picker-tab ${this._activeTab === 'time-start' ? 'mtx-picker-tab--active' : ''}`;
      startTimeTab.type = 'button';
      startTimeTab.innerHTML = `<span class="material-icons">schedule</span> ${this._t('start', null, 'Start')} (${startTimeStr})`;
      startTimeTab.addEventListener('click', (e) => {
        e.stopPropagation();
        this._activeTab = 'time-start';
        this._currentView = 'clock-hours';
        this._renderCurrentView();
      });

      const endTimeTab = document.createElement('button');
      endTimeTab.className = `mtx-picker-tab ${this._activeTab === 'time-end' ? 'mtx-picker-tab--active' : ''}`;
      endTimeTab.type = 'button';
      endTimeTab.innerHTML = `<span class="material-icons">schedule</span> ${this._t('end', null, 'End')} (${endTimeStr})`;
      endTimeTab.addEventListener('click', (e) => {
        e.stopPropagation();
        this._activeTab = 'time-end';
        this._currentView = 'clock-hours';
        this._renderCurrentView();
      });

      tabs.appendChild(dateTab);
      tabs.appendChild(startTimeTab);
      tabs.appendChild(endTimeTab);
      this._enhanceTabs(tabs);
      this._container.appendChild(tabs);
      return;
    }

    const dateTab = document.createElement('button');
    dateTab.className = `mtx-picker-tab ${this._activeTab === 'date' ? 'mtx-picker-tab--active' : ''}`;
    dateTab.type = 'button';
    dateTab.innerHTML = `<span class="material-icons">calendar_today</span> ${this._t('date', null, 'Date')}`;
    dateTab.addEventListener('click', (e) => {
      e.stopPropagation();
      this._activeTab = 'date';
      this._currentView = 'calendar';
      this._renderCurrentView();
    });

    const timeTab = document.createElement('button');
    timeTab.className = `mtx-picker-tab ${this._activeTab === 'time' ? 'mtx-picker-tab--active' : ''}`;
    timeTab.type = 'button';
    timeTab.innerHTML = `<span class="material-icons">schedule</span> ${this._t('time', null, 'Time')}`;
    timeTab.addEventListener('click', (e) => {
      e.stopPropagation();
      this._activeTab = 'time';
      this._currentView = 'clock-hours';
      this._renderCurrentView();
    });

    tabs.appendChild(dateTab);
    tabs.appendChild(timeTab);
    this._enhanceTabs(tabs);
      this._container.appendChild(tabs);
  }

  /**
   * Hace accesibles por teclado los elementos clicables de la cabecera MD2.
   * @private
   * @param {HTMLElement} header Cabecera renderizada.
   */
  _enhanceHeader(header) {
    header.querySelectorAll('.mtx-picker-header__year, .mtx-picker-header__time-unit, .mtx-picker-header__ampm-btn').forEach((el, index) => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('data-focus-key', `header-${index}`);
      if (el.classList.contains('mtx-picker-header__year')) {
        el.setAttribute('aria-label', this._t('yearViewLabel', { year: el.textContent }, `${el.textContent}, choose year`));
      }
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  /**
   * Aplica el patrón WAI-ARIA Tabs a las pestañas Fecha/Hora (roving tabindex).
   * @private
   * @param {HTMLElement} tabs Contenedor de pestañas.
   */
  _enhanceTabs(tabs) {
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', this._getDialogLabel());
    tabs.querySelectorAll('.mtx-picker-tab').forEach((tab, index) => {
      const selected = tab.classList.contains('mtx-picker-tab--active');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      tab.setAttribute('data-focus-key', `tab-${index}`);
      tab.querySelectorAll('.material-icons').forEach((icon) => icon.setAttribute('aria-hidden', 'true'));
    });
  }

  /**
   * Flechas izquierda/derecha, Inicio y Fin entre pestañas (activación automática).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} tab Pestaña enfocada.
   */
  _handleTabKeyDown(e, tab) {
    const tabs = Array.from(tab.parentElement.querySelectorAll('[role="tab"]'));
    const index = tabs.indexOf(tab);
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    const key = next.getAttribute('data-focus-key');
    next.click();
    const again = this._container && this._container.querySelector(`[data-focus-key="${key}"]`);
    if (again) again.focus();
  }

  /**
   * Día que recibe `tabindex="0"` en el grid: enfocado, seleccionado, hoy o primer día habilitado.
   * @private
   * @returns {Date} Fecha objetivo del roving tabindex.
   */
  _getGridFocusDate() {
    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    const usable = (d) => d && d.getFullYear() === year && d.getMonth() === month && !this._isDateDisabled(d);
    if (usable(this._focusedDate)) return this._focusedDate;
    const selected = this._isRange ? (this._rangeStart || this._rangeEnd) : this._selectedDate;
    if (usable(selected)) return selected;
    const today = new Date();
    if (usable(today)) return today;
    const total = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= total; day++) {
      const d = new Date(year, month, day);
      if (!this._isDateDisabled(d)) return d;
    }
    return new Date(year, month, 1);
  }

  /**
   * Crea el calendario interactivo mensual como `role="grid"` (filas de semanas y roving tabindex).
   * @private
   */
  _createCalendar() {
    const cal = document.createElement('div');
    cal.className = 'mtx-date-picker';

    const monthNames = this._getMonthNames();
    const titleId = uniqueId('mtx-picker-title');

    // Barra de navegación de mes y año
    const nav = document.createElement('div');
    nav.className = 'mtx-date-picker__nav';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'mtx-date-picker__title-group';
    titleGroup.id = titleId;
    titleGroup.setAttribute('aria-live', 'polite');

    const monthName = monthNames[this._viewDate.getMonth()];
    const monthBtn = document.createElement('button');
    monthBtn.className = 'mtx-date-picker__title mtx-date-picker__title--month';
    monthBtn.type = 'button';
    monthBtn.setAttribute('data-focus-key', 'month-title');
    monthBtn.setAttribute('aria-label', this._t('monthViewLabel', { month: monthName }, `${monthName}, choose month`));
    monthBtn.innerHTML = `<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>`;
    monthBtn.firstChild.textContent = monthName;
    monthBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._currentView = 'months';
      this._renderCurrentView();
    });

    const yearText = String(this._viewDate.getFullYear());
    const yearBtn = document.createElement('button');
    yearBtn.className = 'mtx-date-picker__title mtx-date-picker__title--year';
    yearBtn.type = 'button';
    yearBtn.setAttribute('data-focus-key', 'year-title');
    yearBtn.setAttribute('aria-label', this._t('yearViewLabel', { year: yearText }, `${yearText}, choose year`));
    yearBtn.innerHTML = `<span class="mtx-date-picker__title-text"></span><span class="material-icons" aria-hidden="true">arrow_drop_down</span>`;
    yearBtn.firstChild.textContent = yearText;
    yearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._currentView = 'years';
      this._renderCurrentView();
    });

    titleGroup.appendChild(monthBtn);
    titleGroup.appendChild(yearBtn);

    const navButton = (dir) => {
      const btn = document.createElement('button');
      btn.className = 'mtx-date-picker__nav-btn';
      btn.type = 'button';
      const key = dir < 0 ? 'previousMonth' : 'nextMonth';
      btn.setAttribute('data-focus-key', key);
      btn.setAttribute('aria-label', this._t(key, null, dir < 0 ? 'Previous month' : 'Next month'));
      btn.innerHTML = `<span class="material-icons" aria-hidden="true">${dir < 0 ? 'chevron_left' : 'chevron_right'}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + dir, 1);
        this._focusedDate = null;
        this._renderCurrentView();
      });
      return btn;
    };

    const btnGroup = document.createElement('div');
    btnGroup.className = 'mtx-date-picker__nav-group';
    btnGroup.appendChild(navButton(-1));
    btnGroup.appendChild(navButton(1));

    nav.appendChild(titleGroup);
    nav.appendChild(btnGroup);
    cal.appendChild(nav);

    // Grid accesible: fila de cabeceras + grupo de filas (semanas)
    const grid = document.createElement('div');
    grid.className = 'mtx-date-picker__grid';
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-labelledby', titleId);

    const weekdays = document.createElement('div');
    weekdays.className = 'mtx-date-picker__weekdays';
    weekdays.setAttribute('role', 'row');
    const longNames = this._getWeekdayNamesLong();
    this._getWeekdayNames().forEach((w, i) => {
      const el = document.createElement('div');
      el.className = 'mtx-date-picker__weekday';
      el.setAttribute('role', 'columnheader');
      el.setAttribute('aria-label', longNames[i]);
      el.title = longNames[i];
      el.textContent = w;
      weekdays.appendChild(el);
    });
    grid.appendChild(weekdays);

    const daysContainer = document.createElement('div');
    daysContainer.className = 'mtx-date-picker__days';
    daysContainer.setAttribute('role', 'rowgroup');

    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayIndex + totalDaysInMonth) / 7) * 7;
    const today = new Date();
    const focusDate = this._getGridFocusDate();
    this._focusedDate = focusDate;

    let row = null;
    for (let i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        row = document.createElement('div');
        row.className = 'mtx-date-picker__week';
        row.setAttribute('role', 'row');
        daysContainer.appendChild(row);
      }
      const dateObj = new Date(year, month, 1 - firstDayIndex + i);
      const outside = dateObj.getMonth() !== month;
      row.appendChild(this._createDayCell(dateObj, outside, today, focusDate, daysContainer));
    }

    if (this._isRange) {
      daysContainer.addEventListener('mouseleave', () => {
        if (this._rangeStart && !this._rangeEnd) {
          this._hoverDate = null;
          this._renderRangePreview(daysContainer);
        }
      });
    }

    grid.appendChild(daysContainer);
    cal.appendChild(grid);
    return cal;
  }

  /**
   * Crea una celda del grid (`role="gridcell"`) con estado, etiqueta completa y selección.
   * @private
   * @param {Date} dateObj Fecha de la celda.
   * @param {boolean} outside Si pertenece al mes anterior/siguiente.
   * @param {Date} today Fecha actual.
   * @param {Date} focusDate Fecha con tabindex 0.
   * @param {HTMLElement} daysContainer Contenedor de semanas (vista previa de rango).
   * @returns {HTMLElement} Celda creada.
   */
  _createDayCell(dateObj, outside, today, focusDate, daysContainer) {
    const cell = document.createElement('div');
    cell.className = 'mtx-date-picker__day-cell';
    cell.setAttribute('role', 'presentation');

    const dayBtn = document.createElement('button');
    dayBtn.className = 'mtx-date-picker__day';
    dayBtn.type = 'button';
    dayBtn.textContent = dateObj.getDate();
    dayBtn._cellDate = dateObj;
    dayBtn.setAttribute('role', 'gridcell');
    dayBtn.setAttribute('data-date', dayKey(dateObj));
    dayBtn.setAttribute('data-focus-key', outside ? 'grid-outside' : 'grid');
    dayBtn.setAttribute('aria-label', this._formatDayLabel(dateObj));
    dayBtn.setAttribute('tabindex', !outside && isSameDay(dateObj, focusDate) ? '0' : '-1');

    if (isSameDay(dateObj, today)) {
      dayBtn.classList.add('mtx-date-picker__day--today');
      dayBtn.setAttribute('aria-current', 'date');
    }

    let selected = false;
    if (outside) {
      dayBtn.classList.add('mtx-date-picker__day--outside');
    } else if (this._isRange) {
      const dTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
      const startTime = this._rangeStart
        ? new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime()
        : null;
      const endTime = this._rangeEnd
        ? new Date(this._rangeEnd.getFullYear(), this._rangeEnd.getMonth(), this._rangeEnd.getDate()).getTime()
        : null;

      const isStart = startTime !== null && dTime === startTime;
      const isEnd = endTime !== null && dTime === endTime;
      const inRange = startTime !== null && endTime !== null && dTime > startTime && dTime < endTime;

      if (isStart) {
        cell.classList.add('mtx-date-picker__day-cell--range-start');
        dayBtn.classList.add('mtx-date-picker__day--selected', 'mtx-date-picker__day--range-start');
      }
      if (isEnd) {
        cell.classList.add('mtx-date-picker__day-cell--range-end');
        dayBtn.classList.add('mtx-date-picker__day--selected', 'mtx-date-picker__day--range-end');
      }
      if (inRange) {
        cell.classList.add('mtx-date-picker__day-cell--in-range');
        dayBtn.classList.add('mtx-date-picker__day--in-range');
      }
      selected = isStart || isEnd || inRange;

      if (this._rangeStart && !this._rangeEnd && this._hoverDate) {
        const hoverTime = new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime();
        if (dTime > Math.min(startTime, hoverTime) && dTime < Math.max(startTime, hoverTime)) {
          cell.classList.add('mtx-date-picker__day-cell--range-preview');
          dayBtn.classList.add('mtx-date-picker__day--range-preview');
        }
      }

      if (!this._isDateDisabled(dateObj)) {
        dayBtn.addEventListener('mouseenter', () => {
          if (this._rangeStart && !this._rangeEnd) {
            this._hoverDate = dateObj;
            this._renderRangePreview(daysContainer);
          }
        });
      }
    } else if (isSameDay(dateObj, this._selectedDate)) {
      dayBtn.classList.add('mtx-date-picker__day--selected');
      selected = true;
    }
    dayBtn.setAttribute('aria-selected', String(selected));

    if (this._isDateDisabled(dateObj)) {
      dayBtn.disabled = true;
      dayBtn.setAttribute('aria-disabled', 'true');
      dayBtn.classList.add('mtx-date-picker__day--disabled');
    } else {
      dayBtn.addEventListener('click', () => {
        this._focusedDate = new Date(dateObj);
        if (outside) this._viewDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        this._selectDay(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      });
    }

    cell.appendChild(dayBtn);
    return cell;
  }

  /**
   * Navegación por teclado del grid de días (flechas, Inicio/Fin, RePág/AvPág, Mayús+RePág/AvPág, Enter/Espacio).
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} dayBtn Día enfocado.
   */
  _handleGridKeyDown(e, dayBtn) {
    const current = dayBtn._cellDate ? new Date(dayBtn._cellDate) : new Date(this._focusedDate || new Date());
    const y = current.getFullYear();
    const m = current.getMonth();
    const d = current.getDate();
    const addMonths = (count) => {
      const lastDay = new Date(y, m + count + 1, 0).getDate();
      return new Date(y, m + count, Math.min(d, lastDay));
    };
    let next = null;
    let step = 1;
    switch (e.key) {
      case 'ArrowLeft': next = new Date(y, m, d - 1); step = -1; break;
      case 'ArrowRight': next = new Date(y, m, d + 1); break;
      case 'ArrowUp': next = new Date(y, m, d - 7); step = -1; break;
      case 'ArrowDown': next = new Date(y, m, d + 7); break;
      case 'Home': next = new Date(y, m, d - current.getDay()); break;
      case 'End': next = new Date(y, m, d + (6 - current.getDay())); step = -1; break;
      case 'PageUp': next = addMonths(e.shiftKey ? -12 : -1); step = -1; break;
      case 'PageDown': next = addMonths(e.shiftKey ? 12 : 1); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!dayBtn.disabled) dayBtn.click();
        return;
      default:
        return;
    }
    e.preventDefault();
    this._moveGridFocus(next, step);
  }

  /**
   * Mueve el foco del grid a una fecha (saltando días deshabilitados) y cambia de mes si hace falta.
   * @private
   * @param {Date} target Fecha destino.
   * @param {number} step Dirección de búsqueda si el destino está deshabilitado (1 o -1).
   */
  _moveGridFocus(target, step) {
    let date = new Date(target);
    let guard = 0;
    while (this._isDateDisabled(date) && guard < 366) {
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + step);
      guard++;
    }
    if (this._isDateDisabled(date)) return;

    this._focusedDate = date;
    if (this._isRange && this._rangeStart && !this._rangeEnd) this._hoverDate = date;

    const sameMonth = date.getFullYear() === this._viewDate.getFullYear() && date.getMonth() === this._viewDate.getMonth();
    if (!sameMonth) {
      this._viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
      this._renderCurrentView();
    } else if (this._isRange && this._hoverDate) {
      this._renderRangePreview(this._container.querySelector('.mtx-date-picker__days'));
    }

    const key = dayKey(date);
    this._container.querySelectorAll('.mtx-date-picker__day').forEach((btn) => {
      const isTarget = btn.getAttribute('data-date') === key && !btn.classList.contains('mtx-date-picker__day--outside');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');
      if (isTarget) btn.focus();
    });
  }

  /**
   * Actualiza el resaltado visual interactivo de rango en hover sin reconstruir el calendario.
   *
   * @param {HTMLElement} container Contenedor de días.
   * @private
   */
  _renderRangePreview(container) {
    if (!container || !this._rangeStart || this._rangeEnd) return;
    const startTime = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime();
    const hoverTime = this._hoverDate
      ? new Date(this._hoverDate.getFullYear(), this._hoverDate.getMonth(), this._hoverDate.getDate()).getTime()
      : null;

    const minT = hoverTime !== null ? Math.min(startTime, hoverTime) : null;
    const maxT = hoverTime !== null ? Math.max(startTime, hoverTime) : null;

    const cells = container.querySelectorAll('.mtx-date-picker__day-cell');
    cells.forEach((cell) => {
      const btn = cell.querySelector('.mtx-date-picker__day');
      if (!btn || !btn._cellDate || btn.classList.contains('mtx-date-picker__day--outside')) return;
      const dTime = new Date(btn._cellDate.getFullYear(), btn._cellDate.getMonth(), btn._cellDate.getDate()).getTime();

      if (minT !== null && maxT !== null && dTime > minT && dTime < maxT) {
        cell.classList.add('mtx-date-picker__day-cell--range-preview');
        btn.classList.add('mtx-date-picker__day--range-preview');
      } else {
        cell.classList.remove('mtx-date-picker__day-cell--range-preview');
        btn.classList.remove('mtx-date-picker__day--range-preview');
      }
    });
  }

  /**
   * Crea el selector de meses (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createMonthPicker() {
    const container = document.createElement('div');
    container.className = 'mtx-date-picker__months';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', this._t('chooseMonth', null, 'Choose month'));

    const selectedYear = this._viewDate.getFullYear();
    const currentMonth = this._selectedDate && this._selectedDate.getFullYear() === selectedYear
      ? this._selectedDate.getMonth()
      : this._viewDate.getMonth();
    const shortNames = this._getMonthNamesShort();

    this._getMonthNames().forEach((mName, mIndex) => {
      const mBtn = document.createElement('button');
      const isSelected = mIndex === currentMonth;
      mBtn.className = `mtx-date-picker__month ${isSelected ? 'mtx-date-picker__month--selected' : ''}`;
      mBtn.type = 'button';
      mBtn.textContent = shortNames[mIndex];
      mBtn.title = mName;
      mBtn.setAttribute('role', 'radio');
      mBtn.setAttribute('aria-checked', String(isSelected));
      mBtn.setAttribute('aria-label', mName);
      mBtn.setAttribute('tabindex', isSelected ? '0' : '-1');
      mBtn.setAttribute('data-focus-key', 'month');

      // Validar si el mes completo está fuera del rango min/max
      const monthStart = new Date(selectedYear, mIndex, 1);
      const monthEnd = new Date(selectedYear, mIndex + 1, 0);
      let isDisabled = false;
      if (this._minDate && monthEnd < new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate())) isDisabled = true;
      if (this._maxDate && monthStart > this._maxDate) isDisabled = true;

      if (isDisabled) {
        mBtn.disabled = true;
        mBtn.setAttribute('aria-disabled', 'true');
      } else {
        mBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const lastDay = new Date(selectedYear, mIndex + 1, 0).getDate();
          this._viewDate = new Date(selectedYear, mIndex, Math.min(this._viewDate.getDate(), lastDay));
          this._focusedDate = null;
          this._currentView = 'calendar';
          this._renderCurrentView();
        });
      }

      container.appendChild(mBtn);
    });

    this._ensureRovingStop(container, '.mtx-date-picker__month');
    return container;
  }

  /**
   * Crea el selector de años (`role="radiogroup"` con roving tabindex).
   * @private
   */
  _createYearPicker() {
    const container = document.createElement('div');
    container.className = 'mtx-date-picker__years';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', this._t('chooseYear', null, 'Choose year'));

    const currentYear = this._viewDate.getFullYear();
    const selectedYear = this._selectedDate ? this._selectedDate.getFullYear() : currentYear;

    const minYear = this._minDate ? this._minDate.getFullYear() : 1900;
    const maxYear = this._maxDate ? this._maxDate.getFullYear() : 2100;

    for (let y = minYear; y <= maxYear; y++) {
      const yBtn = document.createElement('button');
      const isSelected = y === selectedYear;
      yBtn.className = `mtx-date-picker__year ${isSelected ? 'mtx-date-picker__year--selected' : ''}`;
      yBtn.type = 'button';
      yBtn.textContent = y;
      yBtn.setAttribute('role', 'radio');
      yBtn.setAttribute('aria-checked', String(isSelected));
      yBtn.setAttribute('tabindex', isSelected ? '0' : '-1');
      yBtn.setAttribute('data-focus-key', 'year');
      yBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lastDay = new Date(y, this._viewDate.getMonth() + 1, 0).getDate();
        this._viewDate = new Date(y, this._viewDate.getMonth(), Math.min(this._viewDate.getDate(), lastDay));
        this._focusedDate = null;
        this._currentView = 'calendar';
        this._renderCurrentView();
      });
      container.appendChild(yBtn);
    }

    this._ensureRovingStop(container, '.mtx-date-picker__year');

    // Auto-scroll al año seleccionado
    this._setTimer(() => {
      const sel = container.querySelector('.mtx-date-picker__year--selected');
      if (sel && typeof sel.scrollIntoView === 'function') {
        sel.scrollIntoView({ block: 'center' });
      }
    }, 0);

    return container;
  }

  /**
   * Garantiza que exista un único elemento con `tabindex="0"` en una lista con roving tabindex.
   * @private
   * @param {HTMLElement} container Lista.
   * @param {string} selector Selector de las opciones.
   */
  _ensureRovingStop(container, selector) {
    if (container.querySelector(`${selector}[tabindex="0"]:not(:disabled)`)) return;
    const first = container.querySelector(`${selector}:not(:disabled)`);
    container.querySelectorAll(selector).forEach((el) => el.setAttribute('tabindex', '-1'));
    if (first) first.setAttribute('tabindex', '0');
  }

  /**
   * Teclado en las vistas de meses y años: flechas (±1 / ±3 filas), Inicio/Fin y Enter/Espacio.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   * @param {HTMLElement} option Opción enfocada.
   */
  _handleOptionGridKeyDown(e, option) {
    const options = Array.from(option.parentElement.children).filter((el) => !el.disabled);
    const index = options.indexOf(option);
    const columns = 3;
    let next = null;
    switch (e.key) {
      case 'ArrowLeft': next = options[index - 1]; break;
      case 'ArrowRight': next = options[index + 1]; break;
      case 'ArrowUp': next = options[index - columns]; break;
      case 'ArrowDown': next = options[index + columns]; break;
      case 'Home': next = options[0]; break;
      case 'End': next = options[options.length - 1]; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        option.click();
        return;
      default:
        return;
    }
    e.preventDefault();
    if (!next) return;
    options.forEach((el) => el.setAttribute('tabindex', el === next ? '0' : '-1'));
    next.focus();
  }

  /**
   * Crea el selector de hora canónico Material Design (MUI / MD2):
   * Modo 1: Dial analógico con tarjetas interactivas superiores ("Select time").
   * Modo 2: Entrada directa por teclado con tarjetas editables ("Enter time").
   * @private
   * @returns {HTMLElement}
   */
  _createTimePicker() {
    const wrap = document.createElement('div');
    wrap.className = 'mtx-time-picker';

    let curHour, curMinute, curAmPm;
    if (this._isRange && this._mode === 'datetime') {
      if (this._activeTab === 'time-end') {
        curHour = this._endHour;
        curMinute = this._endMinute;
        curAmPm = this._endAmPm;
      } else {
        curHour = this._startHour;
        curMinute = this._startMinute;
        curAmPm = this._startAmPm;
      }
    } else {
      curHour = this._selectedHour;
      curMinute = this._selectedMinute;
      curAmPm = this._selectedAmPm;
    }

    const isAmPm = this._isAmPmMode();
    let displayHour = curHour;
    if (isAmPm) {
      displayHour = curHour % 12;
      if (displayHour === 0) displayHour = 12;
    }

    const isInputMode = this._timeInputMode === 'input' || this._timeInputMode === 'keyboard';
    const isHours = this._timeUnit === 'hours';

    // 1. Cabecera con título ("Select time" / "Enter time") y tarjetas
    const headerBox = document.createElement('div');
    headerBox.className = 'mtx-time-picker__header-box';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'mtx-time-picker__title';
    titleSpan.textContent = isInputMode ? this._t('enterTime', null, 'Enter time') : this._t('selectTime', null, 'Select time');
    headerBox.appendChild(titleSpan);

    const cardsRow = document.createElement('div');
    cardsRow.className = 'mtx-time-picker__cards-row';

    // Tarjeta Horas
    const hourWrapper = document.createElement('div');
    hourWrapper.className = 'mtx-time-picker__card-wrapper';

    let hourCard;
    let minuteCard;

    if (isInputMode) {
      hourCard = document.createElement('input');
      hourCard.type = 'text';
      hourCard.inputMode = 'numeric';
      hourCard.maxLength = 2;
      hourCard.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${isHours ? 'mtx-time-picker__digit-card--active' : ''}`;
      hourCard.value = String(displayHour).padStart(2, '0');
      hourCard.setAttribute('aria-label', this._t('hour', null, 'Hour'));
      hourCard.setAttribute('data-focus-key', 'hour-card');

      hourCard.addEventListener('focus', () => {
        this._timeUnit = 'hours';
        hourCard.classList.add('mtx-time-picker__digit-card--active');
        if (minuteCard) minuteCard.classList.remove('mtx-time-picker__digit-card--active');
        hourCard.select();
      });

      hourCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (minuteCard) {
            minuteCard.focus();
            minuteCard.select();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          let h = parseInt(hourCard.value, 10) || 0;
          h = isAmPm ? (h % 12) + 1 : (h + 1) % 24;
          hourCard.value = String(h).padStart(2, '0');
          this._setHour(h);
          hourCard.select();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          let h = parseInt(hourCard.value, 10) || 0;
          h = isAmPm ? (h <= 1 ? 12 : h - 1) : (h <= 0 ? 23 : h - 1);
          hourCard.value = String(h).padStart(2, '0');
          this._setHour(h);
          hourCard.select();
        }
      });

      hourCard.addEventListener('input', () => {
        let clean = hourCard.value.replace(/\D/g, '');
        hourCard.value = clean;
        if (clean.length > 0) {
          let hNum = parseInt(clean, 10);
          if (isAmPm) {
            if (hNum > 12) {
              hNum = 12;
              hourCard.value = '12';
            }
          } else {
            if (hNum > 23) {
              hNum = 23;
              hourCard.value = '23';
            }
          }
          this._setHour(hNum);
          if (clean.length === 2 || (isAmPm && hNum > 1)) {
            if (minuteCard) {
              minuteCard.focus();
              minuteCard.select();
            }
          }
        }
      });

      hourCard.addEventListener('blur', () => {
        if (hourCard.value) {
          hourCard.value = hourCard.value.padStart(2, '0');
        }
      });

      // Auto-foco inmediato al renderizar la vista de hora para navegación inmediata con Tab
      this._setTimer(() => {
        if (hourCard && document.body.contains(hourCard)) {
          hourCard.focus();
          hourCard.select();
        }
      }, 30);
    } else {
      hourCard = document.createElement('button');
      hourCard.type = 'button';
      hourCard.className = `mtx-time-picker__digit-card ${isHours ? 'mtx-time-picker__digit-card--active' : ''}`;
      hourCard.textContent = String(displayHour).padStart(2, '0');
      hourCard.setAttribute('aria-label', `${this._t('hour', null, 'Hour')} ${String(displayHour).padStart(2, '0')}`);
      hourCard.setAttribute('aria-pressed', String(isHours));
      hourCard.setAttribute('data-focus-key', 'hour-card');
      hourCard.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._timeUnit !== 'hours') {
          this._timeUnit = 'hours';
          this._renderCurrentView();
        }
      });
    }

    hourWrapper.appendChild(hourCard);
    if (isInputMode) {
      const hourLabel = document.createElement('span');
      hourLabel.className = 'mtx-time-picker__card-label';
      hourLabel.textContent = this._t('hour', null, 'Hour');
      hourWrapper.appendChild(hourLabel);
    }
    cardsRow.appendChild(hourWrapper);

    // Separador ':'
    const colon = document.createElement('span');
    colon.className = 'mtx-time-picker__colon';
    colon.textContent = ':';
    cardsRow.appendChild(colon);

    // Tarjeta Minutos
    const minuteWrapper = document.createElement('div');
    minuteWrapper.className = 'mtx-time-picker__card-wrapper';

    if (isInputMode) {
      minuteCard = document.createElement('input');
      minuteCard.type = 'text';
      minuteCard.inputMode = 'numeric';
      minuteCard.maxLength = 2;
      minuteCard.className = `mtx-time-picker__digit-card mtx-time-picker__digit-card--input ${!isHours ? 'mtx-time-picker__digit-card--active' : ''}`;
      minuteCard.value = String(curMinute).padStart(2, '0');
      minuteCard.setAttribute('aria-label', this._t('minute', null, 'Minute'));
      minuteCard.setAttribute('data-focus-key', 'minute-card');

      minuteCard.addEventListener('focus', () => {
        this._timeUnit = 'minutes';
        minuteCard.classList.add('mtx-time-picker__digit-card--active');
        if (hourCard) hourCard.classList.remove('mtx-time-picker__digit-card--active');
        minuteCard.select();
      });

      minuteCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this._applySelection();
          if (!this._isStatic) {
            this.close(true);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          let m = parseInt(minuteCard.value, 10) || 0;
          m = (m + 1) % 60;
          minuteCard.value = String(m).padStart(2, '0');
          this._setMinute(m);
          minuteCard.select();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          let m = parseInt(minuteCard.value, 10) || 0;
          m = m <= 0 ? 59 : m - 1;
          minuteCard.value = String(m).padStart(2, '0');
          this._setMinute(m);
          minuteCard.select();
        }
      });

      minuteCard.addEventListener('input', () => {
        let clean = minuteCard.value.replace(/\D/g, '');
        minuteCard.value = clean;
        if (clean.length > 0) {
          let mNum = parseInt(clean, 10);
          if (mNum > 59) {
            mNum = 59;
            minuteCard.value = '59';
          }
          this._setMinute(mNum);
        }
      });

      minuteCard.addEventListener('blur', () => {
        if (minuteCard.value) {
          minuteCard.value = minuteCard.value.padStart(2, '0');
        }
      });
    } else {
      minuteCard = document.createElement('button');
      minuteCard.type = 'button';
      minuteCard.className = `mtx-time-picker__digit-card ${!isHours ? 'mtx-time-picker__digit-card--active' : ''}`;
      minuteCard.textContent = String(curMinute).padStart(2, '0');
      minuteCard.setAttribute('aria-label', `${this._t('minute', null, 'Minute')} ${String(curMinute).padStart(2, '0')}`);
      minuteCard.setAttribute('aria-pressed', String(!isHours));
      minuteCard.setAttribute('data-focus-key', 'minute-card');
      minuteCard.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._timeUnit !== 'minutes') {
          this._timeUnit = 'minutes';
          this._renderCurrentView();
        }
      });
    }

    minuteWrapper.appendChild(minuteCard);
    if (isInputMode) {
      const minLabel = document.createElement('span');
      minLabel.className = 'mtx-time-picker__card-label';
      minLabel.textContent = this._t('minute', null, 'Minute');
      minuteWrapper.appendChild(minLabel);
    }
    cardsRow.appendChild(minuteWrapper);

    // Selector AM / PM apilado (Segmented vertical stack)
    if (isAmPm) {
      const ampmStack = document.createElement('div');
      ampmStack.className = 'mtx-time-picker__ampm-stack';

      const amBtn = document.createElement('button');
      amBtn.type = 'button';
      amBtn.className = `mtx-time-picker__ampm-opt ${curAmPm === 'AM' ? 'mtx-time-picker__ampm-opt--active' : ''}`;
      amBtn.textContent = 'AM';
      amBtn.setAttribute('aria-pressed', String(curAmPm === 'AM'));
      amBtn.setAttribute('data-focus-key', 'ampm-am');
      amBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._setAmPm('AM');
        amBtn.classList.add('mtx-time-picker__ampm-opt--active');
        pmBtn.classList.remove('mtx-time-picker__ampm-opt--active');
        amBtn.setAttribute('aria-pressed', 'true');
        pmBtn.setAttribute('aria-pressed', 'false');
      });

      const pmBtn = document.createElement('button');
      pmBtn.type = 'button';
      pmBtn.className = `mtx-time-picker__ampm-opt ${curAmPm === 'PM' ? 'mtx-time-picker__ampm-opt--active' : ''}`;
      pmBtn.textContent = 'PM';
      pmBtn.setAttribute('aria-pressed', String(curAmPm === 'PM'));
      pmBtn.setAttribute('data-focus-key', 'ampm-pm');
      pmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._setAmPm('PM');
        pmBtn.classList.add('mtx-time-picker__ampm-opt--active');
        amBtn.classList.remove('mtx-time-picker__ampm-opt--active');
        pmBtn.setAttribute('aria-pressed', 'true');
        amBtn.setAttribute('aria-pressed', 'false');
      });

      ampmStack.appendChild(amBtn);
      ampmStack.appendChild(pmBtn);
      cardsRow.appendChild(ampmStack);
    }

    headerBox.appendChild(cardsRow);
    wrap.appendChild(headerBox);

    // 2. Reloj analógico (ÚNICAMENTE en modo dial)
    if (!isInputMode) {
      const clock = document.createElement('div');
      clock.className = 'mtx-time-picker__clock';
      // Reloj accesible como slider: flechas cambian la hora/minuto, Enter confirma la unidad
      const sliderHour = isAmPm ? displayHour : curHour;
      clock.setAttribute('role', 'slider');
      clock.setAttribute('tabindex', '0');
      clock.setAttribute('data-focus-key', 'clock');
      clock.setAttribute('aria-orientation', 'horizontal');
      clock.setAttribute('aria-label', isHours ? this._t('selectHours', null, 'Select hours') : this._t('selectMinutes', null, 'Select minutes'));
      clock.setAttribute('aria-valuemin', isHours ? (isAmPm ? '1' : '0') : '0');
      clock.setAttribute('aria-valuemax', isHours ? (isAmPm ? '12' : '23') : '59');
      clock.setAttribute('aria-valuenow', String(isHours ? sliderHour : curMinute));
      clock.setAttribute('aria-valuetext', isHours
        ? this._t('hoursValue', { value: isAmPm ? `${sliderHour} ${curAmPm}` : sliderHour }, `${sliderHour} hours`)
        : this._t('minutesValue', { value: curMinute }, `${curMinute} minutes`));

      const centerDot = document.createElement('div');
      centerDot.className = 'mtx-time-picker__center';
      clock.appendChild(centerDot);

      const hand = document.createElement('div');
      hand.className = 'mtx-time-picker__hand';
      const pointer = document.createElement('div');
      pointer.className = 'mtx-time-picker__pointer';
      hand.appendChild(pointer);
      clock.appendChild(hand);

      const radius = 104;
      const centerX = 128;
      const centerY = 128;

      let activeAngle = 0;

      if (isHours) {
        let dHours = curHour % 12;
        if (dHours === 0) dHours = 12;
        activeAngle = (dHours % 12) * 30;

        for (let h = 1; h <= 12; h++) {
          const num = document.createElement('div');
          num.setAttribute('aria-hidden', 'true');
          num.className = `mtx-time-picker__number ${h === dHours ? 'mtx-time-picker__number--selected' : ''}`;
          num.textContent = h;

          const angleRad = (h * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angleRad);
          const y = centerY + radius * Math.sin(angleRad);

          num.style.left = `${x}px`;
          num.style.top = `${y}px`;
          clock.appendChild(num);
        }
      } else {
        activeAngle = curMinute * 6;

        for (let m = 0; m < 60; m += 5) {
          const num = document.createElement('div');
          num.setAttribute('aria-hidden', 'true');
          const isSelected = Math.round(curMinute / 5) * 5 === m;
          num.className = `mtx-time-picker__number ${isSelected ? 'mtx-time-picker__number--selected' : ''}`;
          num.textContent = String(m).padStart(2, '0');

          const angleRad = (m * 6 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angleRad);
          const y = centerY + radius * Math.sin(angleRad);

          num.style.left = `${x}px`;
          num.style.top = `${y}px`;
          clock.appendChild(num);
        }
      }

      hand.style.height = `${radius}px`;
      hand.style.transform = `rotate(${activeAngle}deg)`;

      const handleClockInteraction = (e) => {
        const rect = clock.getBoundingClientRect();
        const clickX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - centerX;
        const clickY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - centerY;

        let deg = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90;
        if (deg < 0) deg += 360;

        if (isHours) {
          let hour = Math.round(deg / 30) % 12;
          if (hour === 0) hour = 12;
          this._setHour(hour);
          hand.style.transform = `rotate(${(hour % 12) * 30}deg)`;
          clock.querySelectorAll('.mtx-time-picker__number').forEach((num) => {
            num.classList.toggle('mtx-time-picker__number--selected', parseInt(num.textContent, 10) === hour);
          });
          hourCard.textContent = String(hour).padStart(2, '0');
        } else {
          let min = Math.round(deg / 6) % 60;
          this._setMinute(min);
          hand.style.transform = `rotate(${min * 6}deg)`;
          const nearest5 = Math.round(min / 5) * 5;
          clock.querySelectorAll('.mtx-time-picker__number').forEach((num) => {
            num.classList.toggle('mtx-time-picker__number--selected', parseInt(num.textContent, 10) === nearest5);
          });
          minuteCard.textContent = String(min).padStart(2, '0');
        }
      };

      /**
       * Avanza de vista una sola vez al soltar el gesto (horas → minutos; en rango, inicio → fin).
       */
      const scheduleViewSwitch = () => {
        let delay = 0;
        let next = null;
        if (isHours) {
          delay = 200;
          next = () => { this._timeUnit = 'minutes'; };
        } else if (this._isRange && this._mode === 'datetime' && this._activeTab === 'time-start') {
          delay = 300;
          next = () => {
            this._activeTab = 'time-end';
            this._timeUnit = 'hours';
          };
        }
        if (!next) return;
        this._clearTimer(this._clockSwitchTimer);
        this._clockSwitchTimer = this._setTimer(() => {
          this._clockSwitchTimer = null;
          next();
          this._renderCurrentView();
        }, delay);
      };

      const startDrag = (e) => {
        // Cierra cualquier gesto previo para no acumular listeners en window.
        if (this._activeDragEnd) this._activeDragEnd(false);
        const isTouch = !!e.touches;
        // Evita los eventos de ratón emulados tras el toque, que repetirían el gesto.
        if (isTouch && e.cancelable) e.preventDefault();
        hand.classList.add('mtx-time-picker__hand--dragging');
        handleClockInteraction(e);
        const onMove = (moveEv) => {
          if (isTouch && moveEv.cancelable) moveEv.preventDefault();
          handleClockInteraction(moveEv);
        };
        const endEvents = isTouch ? ['touchend', 'touchcancel'] : ['mouseup'];
        const moveEvent = isTouch ? 'touchmove' : 'mousemove';
        const moveOptions = isTouch ? { passive: false } : undefined;
        /**
         * Termina el gesto y retira los listeners de window.
         * @param {boolean|Event} [commit] `false` para no avanzar de vista (cancelación o destroy).
         */
        const onUp = (commit) => {
          if (this._activeDragEnd === onUp) this._activeDragEnd = null;
          hand.classList.remove('mtx-time-picker__hand--dragging');
          window.removeEventListener(moveEvent, onMove, moveOptions);
          endEvents.forEach((type) => window.removeEventListener(type, onUp));
          const cancelled = commit === false || (commit && commit.type === 'touchcancel');
          if (!cancelled && !this.destroyed) scheduleViewSwitch();
        };
        this._activeDragEnd = onUp;
        window.addEventListener(moveEvent, onMove, moveOptions);
        endEvents.forEach((type) => window.addEventListener(type, onUp));
      };

      clock.addEventListener('mousedown', startDrag);
      clock.addEventListener('touchstart', startDrag, { passive: false });

      wrap.appendChild(clock);
    }

    return wrap;
  }

  /**
   * Hora (0-23) y minuto activos según la pestaña (simple, inicio o fin de rango).
   * @private
   * @returns {{hour: number, minute: number}}
   */
  _getActiveTime() {
    if (this._isRange && this._mode === 'datetime') {
      const isEnd = this._activeTab === 'time-end';
      return { hour: isEnd ? this._endHour : this._startHour, minute: isEnd ? this._endMinute : this._startMinute };
    }
    return { hour: this._selectedHour, minute: this._selectedMinute };
  }

  /**
   * Fija la hora en formato 24 h (teclado del reloj sin AM/PM).
   * @private
   * @param {number} hour24 Hora 0-23.
   */
  _setHour24(hour24) {
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    if (this._isRange && this._mode === 'datetime') {
      if (this._activeTab === 'time-end') this._endAmPm = ampm;
      else this._startAmPm = ampm;
    } else {
      this._selectedAmPm = ampm;
    }
    this._setHour(hour24 % 12 === 0 ? 12 : hour24 % 12);
    if (!(this._isRange && this._mode === 'datetime')) {
      // _setHour aplica el desplazamiento PM: corregir las 12 h (mediodía / medianoche)
      this._selectedHour = hour24;
      if (this._selectedDate) this._selectedDate.setHours(hour24);
      this._applySelection();
    }
  }

  /**
   * Teclado del reloj radial: flechas ±1, RePág/AvPág ±5 minutos, Inicio/Fin y Enter para pasar a minutos.
   * @private
   * @param {KeyboardEvent} e Evento de teclado.
   */
  _handleClockKeyDown(e) {
    const isHours = this._timeUnit === 'hours';
    const isAmPm = this._isAmPmMode();
    const { hour, minute } = this._getActiveTime();
    const deltas = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isHours) {
        this._timeUnit = 'minutes';
        this._renderCurrentView();
      } else if (this._isRange && this._mode === 'datetime' && this._activeTab === 'time-start') {
        this._activeTab = 'time-end';
        this._timeUnit = 'hours';
        this._renderCurrentView();
      }
      return;
    }

    if (isHours) {
      const min = isAmPm ? 1 : 0;
      const max = isAmPm ? 12 : 23;
      let value = isAmPm ? (hour % 12 || 12) : hour;
      if (deltas[e.key] !== undefined) {
        const span = max - min + 1;
        value = ((value - min + Math.sign(deltas[e.key]) + span) % span) + min;
      } else if (e.key === 'Home') value = min;
      else if (e.key === 'End') value = max;
      else return;
      e.preventDefault();
      if (!isAmPm) this._setHour24(value);
      else {
        this._setHour(value);
        if (!(this._isRange && this._mode === 'datetime')) this._applySelection();
      }
    } else {
      let value = minute;
      if (deltas[e.key] !== undefined) value = (minute + deltas[e.key] + 60) % 60;
      else if (e.key === 'Home') value = 0;
      else if (e.key === 'End') value = 59;
      else return;
      e.preventDefault();
      this._setMinute(value);
    }
    this._renderCurrentView();
  }

  /**
   * Renderiza la barra de acciones inferiores ("Hoy", "Cancelar", "Aceptar", o botón de alternancia Dial/Teclado).
   * @private
   */
  _renderActions() {
    const actions = document.createElement('div');
    actions.className = 'mtx-picker-actions';

    // Botón de alternancia de vista (Dial <-> Teclado) en la esquina inferior izquierda
    if (this._mode === 'time' || this._activeTab !== 'date') {
      const isInput = this._timeInputMode === 'input' || this._timeInputMode === 'keyboard';
      const iconBtn = document.createElement('button');
      iconBtn.type = 'button';
      iconBtn.className = 'mtx-picker-icon-btn';
      iconBtn.title = isInput ? this._t('switchToClock', null, 'Switch to clock view') : this._t('switchToKeyboard', null, 'Enter time with keyboard');
      iconBtn.setAttribute('aria-label', iconBtn.title);
      iconBtn.setAttribute('data-focus-key', 'time-view-toggle');
      iconBtn.innerHTML = `<span class="material-icons" aria-hidden="true">${isInput ? 'schedule' : 'keyboard'}</span>`;
      iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._timeInputMode = isInput ? 'dial' : 'input';
        this._renderCurrentView();
      });
      actions.appendChild(iconBtn);
    } else {
      const todayBtn = document.createElement('button');
      todayBtn.className = 'mtx-button mtx-button--text mtx-button--small';
      todayBtn.type = 'button';
      todayBtn.textContent = this._todayText || this._t('today', null, 'Today');
      todayBtn.setAttribute('data-focus-key', 'today');
      todayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const now = new Date();
        this.setDate(now);
        if (!this._isStatic && this._mode !== 'datetime') {
          this.close(true);
        }
      });
      actions.appendChild(todayBtn);
    }

    if (!this._isStatic) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'mtx-button mtx-button--text mtx-button--small';
      cancelBtn.type = 'button';
      cancelBtn.textContent = this._cancelText || this._t('cancel', null, 'Cancel');
      cancelBtn.addEventListener('click', () => {
        this.close(true);
      });

      const okBtn = document.createElement('button');
      okBtn.className = 'mtx-button mtx-button--contained mtx-button--small';
      okBtn.type = 'button';
      okBtn.textContent = this._okText || this._t('ok', null, 'OK');
      okBtn.addEventListener('click', () => {
        this._applySelection();
        this.close(true);
      });

      actions.appendChild(cancelBtn);
      actions.appendChild(okBtn);
    }

    this._container.appendChild(actions);
  }

  /**
   * Selecciona un día del calendario.
   * @private
   */
  _selectDay(year, month, day) {
    if (this._isRange) {
      if (this._rangeStep === 'start' || !this._rangeStart || (this._rangeStart && this._rangeEnd)) {
        // Primer clic: fijar inicio del rango
        const h = this._mode === 'datetime' ? this._startHour : 0;
        const m = this._mode === 'datetime' ? this._startMinute : 0;
        const clickedDate = new Date(year, month, day, h, m);

        this._rangeStart = clickedDate;
        this._rangeEnd = null;
        this._rangeStep = 'end';
        this._selectedDate = this._rangeStart;

        // En datetime range picker, mantener al usuario en el calendario para seleccionar el día final
        this._renderCurrentView();
        return;
      } else {
        // Segundo clic: fijar fin del rango
        const h = this._mode === 'datetime' ? this._endHour : 0;
        const m = this._mode === 'datetime' ? this._endMinute : 0;
        const clickedDate = new Date(year, month, day, h, m);
        const clickedDayTime = new Date(year, month, day).getTime();
        const startDayTime = new Date(this._rangeStart.getFullYear(), this._rangeStart.getMonth(), this._rangeStart.getDate()).getTime();

        if (clickedDayTime < startDayTime) {
          this._rangeEnd = new Date(this._rangeStart);
          this._rangeStart = clickedDate;
          if (this._mode === 'datetime') {
            this._rangeStart.setHours(this._startHour, this._startMinute);
            this._rangeEnd.setHours(this._endHour, this._endMinute);
          }
        } else {
          this._rangeEnd = clickedDate;
        }
        this._rangeStep = 'start';
        this._selectedDate = this._rangeEnd;
        this._hoverDate = null;

        if (this._mode === 'datetime') {
          // Ahora que ambas fechas están elegidas, avanzar suavemente a la pestaña de Hora Inicio
          this._activeTab = 'time-start';
          this._timeUnit = 'hours';
          this._currentView = this._timeInputMode === 'dial' ? 'clock-hours' : 'digital-time';
          this._applySelection();
          this._renderCurrentView();
          return;
        }

        this._applySelection();
        if (!this._isStatic && this._displayMode !== 'modal') {
          this.close(true);
        } else {
          this._renderCurrentView();
        }
        return;
      }
    }

    if (!this._selectedDate) {
      this._selectedDate = new Date(year, month, day, this._selectedHour, this._selectedMinute);
    } else {
      this._selectedDate.setFullYear(year, month, day);
    }

    if (this._mode === 'datetime') {
      this._activeTab = 'time';
      this._timeUnit = 'hours';
      this._currentView = this._timeInputMode === 'dial' ? 'clock-hours' : 'digital-time';
      this._renderCurrentView();
    } else {
      this._applySelection();
      if (!this._isStatic && this._displayMode !== 'modal') {
        this.close(true);
      } else {
        this._renderCurrentView();
      }
    }
  }

  /**
   * Modifica la hora seleccionada.
   * @private
   */
  _setHour(hour12) {
    if (this._isRange && this._mode === 'datetime') {
      const isEnd = this._activeTab === 'time-end';
      const ampm = isEnd ? this._endAmPm : this._startAmPm;
      let hour24 = hour12 % 12;
      if (ampm === 'PM') hour24 += 12;

      if (isEnd) {
        this._endHour = hour24;
        if (this._rangeEnd) this._rangeEnd.setHours(hour24);
      } else {
        this._startHour = hour24;
        if (this._rangeStart) this._rangeStart.setHours(hour24);
      }
      this._applySelection();
      return;
    }

    let hour24 = hour12 % 12;
    if (this._selectedAmPm === 'PM') hour24 += 12;
    this._selectedHour = hour24;

    if (this._selectedDate) {
      this._selectedDate.setHours(this._selectedHour);
    }
  }

  /**
   * Modifica el minuto seleccionado.
   * @private
   */
  _setMinute(minute) {
    if (this._isRange && this._mode === 'datetime') {
      const isEnd = this._activeTab === 'time-end';
      if (isEnd) {
        this._endMinute = minute;
        if (this._rangeEnd) this._rangeEnd.setMinutes(minute);
      } else {
        this._startMinute = minute;
        if (this._rangeStart) this._rangeStart.setMinutes(minute);
      }
      this._applySelection();
      return;
    }

    this._selectedMinute = minute;
    if (this._selectedDate) {
      this._selectedDate.setMinutes(minute);
    }
    this._applySelection();
  }

  /**
   * Alterna el período AM/PM.
   * @private
   */
  _setAmPm(ampm) {
    if (this._isRange && this._mode === 'datetime') {
      const isEnd = this._activeTab === 'time-end';
      if (isEnd) {
        if (this._endAmPm === ampm) return;
        this._endAmPm = ampm;
        if (ampm === 'PM' && this._endHour < 12) this._endHour += 12;
        else if (ampm === 'AM' && this._endHour >= 12) this._endHour -= 12;
        if (this._rangeEnd) this._rangeEnd.setHours(this._endHour);
      } else {
        if (this._startAmPm === ampm) return;
        this._startAmPm = ampm;
        if (ampm === 'PM' && this._startHour < 12) this._startHour += 12;
        else if (ampm === 'AM' && this._startHour >= 12) this._startHour -= 12;
        if (this._rangeStart) this._rangeStart.setHours(this._startHour);
      }
      this._applySelection();
      return;
    }

    if (this._selectedAmPm === ampm) return;
    this._selectedAmPm = ampm;
    if (ampm === 'PM' && this._selectedHour < 12) {
      this._selectedHour += 12;
    } else if (ampm === 'AM' && this._selectedHour >= 12) {
      this._selectedHour -= 12;
    }

    if (this._selectedDate) {
      this._selectedDate.setHours(this._selectedHour);
      this._applySelection();
    }
  }

  /**
   * Aplica la selección actual al campo de texto y dispara los eventos correspondientes.
   * @private
   */
  _applySelection() {
    this._isInternalChange = true;
    try {
      let formatted = '';
      if (this._isRange) {
        if (this._mode === 'datetime') {
          if (this._rangeStart) {
            this._rangeStart.setHours(this._startHour, this._startMinute, 0, 0);
          }
          if (this._rangeEnd) {
            this._rangeEnd.setHours(this._endHour, this._endMinute, 0, 0);
          }
        }
        const startStr = this._rangeStart ? this._formatDate(this._rangeStart) : '';
        const endStr = this._rangeEnd ? this._formatDate(this._rangeEnd) : '';
        if (startStr && endStr) {
          formatted = `${startStr}${this._rangeSeparator}${endStr}`;
        } else if (startStr) {
          formatted = startStr;
        }
      } else {
        if (!this._selectedDate) {
          this._selectedDate = new Date();
          this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0);
        }
        formatted = this._formatDate(this._selectedDate);
      }

      const detail = {
        isRange: this._isRange,
        date: this._selectedDate ? new Date(this._selectedDate) : null,
        dateTime: this._selectedDate ? new Date(this._selectedDate) : null,
        startDate: this._rangeStart ? new Date(this._rangeStart) : null,
        endDate: this._rangeEnd ? new Date(this._rangeEnd) : null,
        range: {
          start: this._rangeStart ? new Date(this._rangeStart) : null,
          end: this._rangeEnd ? new Date(this._rangeEnd) : null
        },
        time: this.getTime(),
        value: formatted,
        iso: this.getISOString(),
        picker: this
      };

      if (this.input) {
        this.input.value = formatted;
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this._syncFieldState();
        this._syncToggleButton();
      }

      this._emitChange(detail);
    } finally {
      this._isInternalChange = false;
    }
  }

  /**
   * Emite una única vez `mtx:date-time-picker:change` (y el alias deprecado `mtx:change`).
   * Se despacha en el `<input>` (burbujea al contenedor) o en el contenedor en modo estático.
   * @private
   * @param {object} detail Datos de la selección.
   */
  _emitChange(detail) {
    emit(this.input || this.element, 'mtx:date-time-picker:change', detail, { aliases: ['mtx:change'] });
  }

  /**
   * Determina si una fecha está fuera del rango min/max permitido.
   * @private
   */
  _isDateDisabled(date) {
    const curTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    if (this._minDate) {
      const minTime = new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate()).getTime();
      if (curTime < minTime) return true;
    }
    if (this._maxDate) {
      const maxTime = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate()).getTime();
      if (curTime > maxTime) return true;
    }
    return false;
  }

  /**
   * Parsea una entrada (Date, timestamp o texto) a Date. Admite ISO `YYYY-MM-DD[THH:mm]`,
   * el formato activo (orden DD/MM o MM/DD según locale/`data-format`) y horas `HH:mm [AM|PM]`.
   *
   * @param {Date|number|string} str Valor a parsear.
   * @returns {Date|null} Objeto Date nativo válido o null.
   * @private
   */
  _parseDate(str) {
    if (str instanceof Date) {
      return isNaN(str.getTime()) ? null : new Date(str);
    }
    if (typeof str === 'number') {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    }
    if (!str || typeof str !== 'string') return null;
    const trimmed = str.trim();
    if (!trimmed) return null;

    if (/^(today|hoy|now|ahora)$/i.test(trimmed)) {
      return new Date();
    }

    /** Aplica AM/PM a una hora si el texto lo indica. */
    const applyMeridiem = (hour) => {
      const m = trimmed.match(/\b(a|p)\.?\s?m?\.?$/i) || trimmed.match(/(am|pm)$/i);
      if (!m) return hour;
      const isPm = m[0].toLowerCase().startsWith('p');
      if (isPm && hour < 12) return hour + 12;
      if (!isPm && hour === 12) return 0;
      return hour;
    };
    /** Construye la fecha validando que no haya desbordes (31/02 → null). */
    const build = (year, month, day, hour = 0, min = 0, sec = 0) => {
      const d = new Date(year, month, day, hour, min, sec);
      if (isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
      return d;
    };
    /** Lee `HH:mm(:ss)` de un fragmento. */
    const readTime = (chunk) => {
      const tp = (chunk || '').match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (!tp) return [0, 0, 0];
      return [applyMeridiem(parseInt(tp[1], 10)), parseInt(tp[2], 10), tp[3] ? parseInt(tp[3], 10) : 0];
    };

    // Formato ISO YYYY-MM-DD o YYYY-MM-DDTHH:mm(:ss)
    const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
    if (iso) {
      const [h, mi, se] = readTime(iso[4]);
      return build(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10), h, mi, se);
    }

    // Fecha con separadores según el orden del formato/locale activo
    const dateMatch = trimmed.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})(?:[\sT]+(.*))?$/);
    if (dateMatch) {
      const order = /^\d{4}$/.test(dateMatch[1]) ? ['YYYY', 'MM', 'DD'] : this._getDateOrder();
      const values = {};
      order.forEach((token, i) => { values[token] = parseInt(dateMatch[i + 1], 10); });
      let year = values.YYYY;
      if (dateMatch[order.indexOf('YYYY') + 1].length <= 2) year += 2000;
      let month = values.MM;
      let day = values.DD;
      // Tolerancia: si el mes es imposible pero el día no, se interpretan al revés
      if (month > 12 && day <= 12) [month, day] = [day, month];
      const [h, mi, se] = readTime(dateMatch[4]);
      return build(year, month - 1, day, h, mi, se);
    }

    // Formato HH:mm(:ss) [AM|PM]
    if (/^\d{1,2}:\d{2}/.test(trimmed)) {
      const [hour, min, sec] = readTime(trimmed);
      if (hour > 23 || min > 59) return null;
      const d = new Date();
      d.setHours(hour, min, sec, 0);
      return d;
    }

    // Fallback nativo
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Formatea un objeto Date según el formato configurado o uno personalizado.
   *
   * @param {Date} date Objeto Date a formatear.
   * @param {string} [customFormat] Patrón opcional alternativo.
   * @returns {string} Cadena formateada.
   * @private
   */
  _formatDate(date, customFormat = null) {
    if (!date || isNaN(date.getTime())) return '';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = String(date.getFullYear());
    const yy = yyyy.slice(-2);

    const rawHours = date.getHours();
    const HH = String(rawHours).padStart(2, '0');
    let h12 = rawHours % 12;
    if (h12 === 0) h12 = 12;
    const hh = String(h12).padStart(2, '0');

    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    const ampmUpper = rawHours >= 12 ? 'PM' : 'AM';
    const ampmLower = rawHours >= 12 ? 'pm' : 'am';

    let fmt = customFormat || this._format;

    return fmt
      .replace(/YYYY|AAAA/g, yyyy)
      .replace(/YY|AA(?!$|[ -])/g, yy)
      .replace(/MM/g, mm)
      .replace(/DD/g, dd)
      .replace(/HH/g, HH)
      .replace(/hh/g, hh)
      .replace(/mm/g, min)
      .replace(/ss/g, ss)
      .replace(/\bA\b|(?<=\s|^)A(?=\s|$)|AM|PM|(?<=\d|\s)AA(?=\s|$)/g, ampmUpper)
      .replace(/\ba\b|(?<=\s|^)a(?=\s|$)|am|pm|(?<=\d|\s)aa(?=\s|$)/g, ampmLower);
  }

  // =========================================================================
  // API Pública (Obtener e Insertar Fecha / Fecha y Hora)
  // =========================================================================

  /**
   * Obtiene la fecha seleccionada.
   *
   * @param {string|boolean} [format=false] Si es true o un patrón (ej. 'YYYY-MM-DD'),
   *                                        retorna la cadena formateada. Si es 'iso',
   *                                        retorna cadena ISO 8601. Si es false/omitido,
   *                                        retorna una copia del objeto Date nativo.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDate(format = false) {
    if (!this._selectedDate) return null;
    if (format === true) {
      return this._formatDate(this._selectedDate, this._mode === 'datetime' ? this._getDatePattern() : null);
    }
    if (typeof format === 'string' && format) {
      if (format.toLowerCase() === 'iso') {
        return this.getISOString();
      }
      return this._formatDate(this._selectedDate, format);
    }
    return new Date(this._selectedDate);
  }

  /**
   * Obtiene la fecha y hora seleccionada como objeto Date o cadena formateada.
   *
   * @param {string|boolean} [format=false] Si es true, retorna fecha y hora con el orden del locale
   *                                        (p. ej. 'MM/DD/YYYY HH:mm' en inglés, 'DD/MM/YYYY HH:mm' en español).
   *                                        Si es 'iso', retorna formato ISO 8601.
   *                                        Si se omite o es false, retorna el objeto Date.
   * @returns {Date|string|null} Objeto Date seleccionado o cadena formateada.
   */
  getDateTime(format = false) {
    if (!this._selectedDate) return null;
    if (format === true) {
      return this._formatDate(this._selectedDate, `${this._getDatePattern()} ${this._isAmPmMode() ? 'hh:mm A' : 'HH:mm'}`);
    }
    if (typeof format === 'string' && format) {
      if (format.toLowerCase() === 'iso') {
        return this.getISOString();
      }
      return this._formatDate(this._selectedDate, format);
    }
    return new Date(this._selectedDate);
  }

  /**
   * Obtiene la hora seleccionada como cadena ('HH:mm') o como objeto { hours, minutes }.
   *
   * @param {boolean} [asObject=false] Si es true, retorna { hours, minutes }.
   * @returns {string|{hours: number, minutes: number}|null} Hora formateada o desglose.
   */
  getTime(asObject = false) {
    const isAmPm = this._isAmPmMode();

    if (this._isRange) {
      if (isAmPm) {
        let sH = this._startHour % 12;
        if (sH === 0) sH = 12;
        let eH = this._endHour % 12;
        if (eH === 0) eH = 12;
        const sHStr = String(sH).padStart(2, '0');
        const sMStr = String(this._startMinute).padStart(2, '0');
        const eHStr = String(eH).padStart(2, '0');
        const eMStr = String(this._endMinute).padStart(2, '0');
        if (asObject) {
          return {
            start: { hours: this._startHour, minutes: this._startMinute, ampm: this._startAmPm },
            end: { hours: this._endHour, minutes: this._endMinute, ampm: this._endAmPm }
          };
        }
        return `${sHStr}:${sMStr} ${this._startAmPm} - ${eHStr}:${eMStr} ${this._endAmPm}`;
      }
      const sH = String(this._startHour).padStart(2, '0');
      const sM = String(this._startMinute).padStart(2, '0');
      const eH = String(this._endHour).padStart(2, '0');
      const eM = String(this._endMinute).padStart(2, '0');
      if (asObject) {
        return {
          start: { hours: this._startHour, minutes: this._startMinute },
          end: { hours: this._endHour, minutes: this._endMinute }
        };
      }
      return `${sH}:${sM} - ${eH}:${eM}`;
    }

    if (!this._selectedDate && !this._selectedHour) return null;
    if (asObject) {
      if (isAmPm) {
        return { hours: this._selectedHour, minutes: this._selectedMinute, ampm: this._selectedAmPm };
      }
      return { hours: this._selectedHour, minutes: this._selectedMinute };
    }
    if (isAmPm) {
      let h12 = this._selectedHour % 12;
      if (h12 === 0) h12 = 12;
      const hh = String(h12).padStart(2, '0');
      const mm = String(this._selectedMinute).padStart(2, '0');
      return `${hh}:${mm} ${this._selectedAmPm}`;
    }
    const hh = String(this._selectedHour).padStart(2, '0');
    const mm = String(this._selectedMinute).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  /**
   * Obtiene la fecha seleccionada en formato ISO 8601 estándar (UTC).
   *
   * @returns {string|null} Cadena ISO o null si no hay fecha seleccionada.
   */
  getISOString() {
    return this._selectedDate ? this._selectedDate.toISOString() : null;
  }

  /**
   * Obtiene el valor textual actual mostrado en el campo de texto.
   *
   * @returns {string} Valor formateado actual.
   */
  getValue() {
    return this.value;
  }

  /**
   * Inserta o establece programáticamente una fecha (y hora opcional).
   * Admite objetos Date nativos, strings (ISO, local) o timestamps numéricos.
   *
   * @param {Date|string|number|null} date Nueva fecha a asignar.
   * @returns {DateTimePicker} La instancia para permitir encadenamiento.
   */
  setDate(date) {
    if (date === null || date === undefined || date === '') {
      this.clear();
      return this;
    }

    const d = this._parseDate(date);
    if (!d || isNaN(d.getTime())) return this;

    this._selectedDate = d;
    this._viewDate = new Date(d);
    this._selectedHour = d.getHours();
    this._selectedMinute = d.getMinutes();
    this._selectedAmPm = this._selectedHour >= 12 ? 'PM' : 'AM';

    this._applySelection();
    if (this._container) {
      this._renderCurrentView();
    }
    return this;
  }

  /**
   * Inserta o establece programáticamente la fecha y hora completa.
   * Alias explícito de setDate para flujos de DateTimePicker.
   *
   * @param {Date|string|number|null} dateTime Fecha y hora a asignar.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setDateTime(dateTime) {
    return this.setDate(dateTime);
  }

  /**
   * Modifica o inserta únicamente la hora en la selección actual.
   *
   * @param {string|{hours?: number, minutes?: number}|Date} time Hora en formato 'HH:mm', objeto o Date.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setTime(time) {
    if (!time) return this;
    let h = 0;
    let m = 0;

    if (time instanceof Date) {
      h = time.getHours();
      m = time.getMinutes();
    } else if (typeof time === 'string') {
      const match = time.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
      if (match) {
        h = parseInt(match[1], 10);
        m = parseInt(match[2], 10);
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          else if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
        }
      }
    } else if (typeof time === 'object') {
      h = parseInt(time.hours ?? time.hour ?? 0, 10);
      m = parseInt(time.minutes ?? time.minute ?? 0, 10);
    }

    this._selectedHour = Math.max(0, Math.min(23, h));
    this._selectedMinute = Math.max(0, Math.min(59, m));
    this._selectedAmPm = this._selectedHour >= 12 ? 'PM' : 'AM';

    if (!this._selectedDate) {
      this._selectedDate = new Date();
    }
    this._selectedDate.setHours(this._selectedHour, this._selectedMinute, 0, 0);

    this._applySelection();
    if (this._container) {
      this._renderCurrentView();
    }
    return this;
  }

  /**
   * Inserta o establece el valor textual actual en el campo.
   *
   * @param {string|Date|number} val Cadena formateada o fecha.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setValue(val) {
    return this.setDate(val);
  }

  /**
   * Propiedad getter para la fecha seleccionada.
   *
   * @returns {Date|null}
   */
  get date() {
    return this.getDate();
  }

  /**
   * Propiedad setter para la fecha seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set date(val) {
    this.setDate(val);
  }

  /**
   * Propiedad getter para la fecha y hora seleccionada.
   *
   * @returns {Date|null}
   */
  get dateTime() {
    return this.getDateTime();
  }

  /**
   * Propiedad setter para la fecha y hora seleccionada.
   *
   * @param {Date|string|number|null} val
   */
  set dateTime(val) {
    this.setDateTime(val);
  }

  /**
   * Propiedad getter para la hora en formato 'HH:mm'.
   *
   * @returns {string|null}
   */
  get time() {
    return this.getTime();
  }

  /**
   * Propiedad setter para la hora.
   *
   * @param {string|object|Date} val
   */
  set time(val) {
    this.setTime(val);
  }

  /**
   * Propiedad getter para la cadena ISO 8601.
   *
   * @returns {string|null}
   */
  get isoString() {
    return this.getISOString();
  }

  /**
   * Propiedad getter para el valor textual del campo.
   *
   * @returns {string}
   */
  get value() {
    return this.input ? this.input.value : (this._selectedDate ? this._formatDate(this._selectedDate) : '');
  }

  /**
   * Propiedad setter para el valor textual o fecha.
   *
   * @param {string|Date|number} val
   */
  set value(val) {
    this.setDate(val);
  }

  /**
   * Obtiene el rango de fechas seleccionado.
   *
   * @param {string|boolean} [format=false] Si es true, retorna valores formateados.
   *                                        Si es 'iso', retorna cadenas ISO 8601.
   *                                        Si es false/omitido, retorna objetos Date nativos.
   * @returns {{start: Date|string|null, end: Date|string|null, value?: string}}
   */
  getRange(format = false) {
    if (format === true) {
      const startStr = this._rangeStart ? this._formatDate(this._rangeStart) : null;
      const endStr = this._rangeEnd ? this._formatDate(this._rangeEnd) : null;
      return {
        start: startStr,
        end: endStr,
        value: startStr && endStr ? `${startStr}${this._rangeSeparator}${endStr}` : (startStr || '')
      };
    }
    if (typeof format === 'string' && format.toLowerCase() === 'iso') {
      return {
        start: this._rangeStart ? this._rangeStart.toISOString() : null,
        end: this._rangeEnd ? this._rangeEnd.toISOString() : null
      };
    }
    return {
      start: this._rangeStart ? new Date(this._rangeStart) : null,
      end: this._rangeEnd ? new Date(this._rangeEnd) : null
    };
  }

  /**
   * Inserta o establece programáticamente un rango de fechas.
   *
   * @param {Date|string|number|null|{start?: any, end?: any}} start Fecha inicial, cadena u objeto con { start, end }.
   * @param {Date|string|number|null} [end=null] Fecha final o cadena.
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  setRange(start, end = null) {
    if (!start && !end) {
      this._rangeStart = null;
      this._rangeEnd = null;
      this.clear();
      return this;
    }

    if (start && typeof start === 'object' && !(start instanceof Date) && ('start' in start || 'end' in start)) {
      end = start.end;
      start = start.start;
    }

    const s = this._parseDate(start);
    const e = end ? this._parseDate(end) : null;

    if (s && e && s.getTime() > e.getTime()) {
      this._rangeStart = e;
      this._rangeEnd = s;
    } else {
      this._rangeStart = s;
      this._rangeEnd = e;
    }

    if (this._rangeStart) {
      this._startHour = this._rangeStart.getHours();
      this._startMinute = this._rangeStart.getMinutes();
      this._startAmPm = this._startHour >= 12 ? 'PM' : 'AM';
    }
    if (this._rangeEnd) {
      this._endHour = this._rangeEnd.getHours();
      this._endMinute = this._rangeEnd.getMinutes();
      this._endAmPm = this._endHour >= 12 ? 'PM' : 'AM';
    }

    this._selectedDate = this._rangeStart || this._rangeEnd;
    if (this._selectedDate) {
      this._viewDate = new Date(this._selectedDate);
    }

    this._applySelection();
    if (this._container) {
      this._renderCurrentView();
    }
    return this;
  }

  /**
   * Propiedad getter para el rango.
   *
   * @returns {{start: Date|null, end: Date|null}}
   */
  get range() {
    return this.getRange();
  }

  /**
   * Propiedad setter para el rango.
   *
   * @param {{start: Date|string|null, end: Date|string|null}} val
   */
  set range(val) {
    if (val && typeof val === 'object') {
      this.setRange(val.start, val.end);
    }
  }

  /**
   * Indica si el picker opera en modo de selección de rango.
   *
   * @returns {boolean}
   */
  get isRange() {
    return this._isRange;
  }

  /**
   * Limpia la fecha seleccionada y vacía el campo de texto.
   *
   * @returns {DateTimePicker} La instancia para encadenamiento.
   */
  clear() {
    this._selectedDate = null;
    this._rangeStart = null;
    this._rangeEnd = null;
    this._rangeStep = 'start';
    this._hoverDate = null;

    if (this.input) {
      this.input.value = '';
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this._syncFieldState();
      this._syncToggleButton();
    }
    this._emitChange({
      isRange: this._isRange,
      date: null,
      dateTime: null,
      startDate: null,
      endDate: null,
      range: { start: null, end: null },
      time: null,
      value: '',
      iso: null,
      picker: this
    });
    if (this._container) {
      this._renderCurrentView();
    }
    return this;
  }
}

// Registro oficial en Materix UI
registerComponent('date-time-picker', DateTimePicker);
registerComponent('datetime-picker', DateTimePicker);
registerComponent('datetimepicker', DateTimePicker);
registerComponent('date-picker', DateTimePicker);
registerComponent('datepicker', DateTimePicker);
registerComponent('time-picker', DateTimePicker);
registerComponent('timepicker', DateTimePicker);
registerComponent('date-range-picker', DateTimePicker);
registerComponent('daterangepicker', DateTimePicker);
registerComponent('datetime-range-picker', DateTimePicker);
registerComponent('datetimerangepicker', DateTimePicker);
