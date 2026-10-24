/**
 * Lógica pura de fechas y horas del DateTimePicker (portada de `date-time-picker.js` de vanilla):
 * locale, orden de segmentos, parseo, formato, nombres con `Intl`, cuadrícula mensual,
 * rango min/max, navegación por teclado y geometría del reloj radial.
 */
import { getDictionary, resolveLocaleCode } from '../i18n/registry';

/** Modo del picker. */
export type PickerMode = 'date' | 'time' | 'datetime';

/** Segmento de fecha. */
export type DateToken = 'DD' | 'MM' | 'YYYY';

/** Período de 12 horas. */
export type Meridiem = 'AM' | 'PM';

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------

/**
 * Indica si un locale crudo pertenece al idioma (`es-MX` ∈ `es`).
 * @param {string} raw Locale crudo.
 * @param {string} lang Idioma.
 * @returns {boolean} `true` si coinciden.
 */
export function matchesLang(raw: string, lang: string): boolean {
  const r = String(raw).toLowerCase().replace('_', '-');
  const l = String(lang).toLowerCase();
  return r === l || r.startsWith(`${l}-`);
}

/**
 * Idioma base de un locale (`es-MX` → `es`).
 * @param {string} raw Locale crudo.
 * @returns {string} Idioma en minúsculas (`en` si falta).
 */
export function toBaseLang(raw: string | null | undefined): string {
  return String(raw || 'en').toLowerCase().trim().split(/[-_]/)[0] || 'en';
}

/**
 * Locale válido para `Intl` (o `en` si el runtime no lo admite).
 * @param {string} raw Locale crudo.
 * @returns {string} Locale aceptado por `Intl`.
 */
export function toIntlLocale(raw: string | null | undefined): string {
  try {
    const supported = Intl.DateTimeFormat.supportedLocalesOf([String(raw ?? 'en').replace('_', '-')]);
    return supported[0] || 'en';
  } catch {
    return 'en';
  }
}

/**
 * Orden de los segmentos de fecha del locale (`en-US` → MM/DD/YYYY, `es` → DD/MM/YYYY).
 * @param {string} raw Locale crudo.
 * @returns {DateToken[]} Tokens ordenados.
 */
export function localeDateOrder(raw: string | null | undefined): DateToken[] {
  try {
    const parts = new Intl.DateTimeFormat(toIntlLocale(raw), { year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date(2026, 9, 20));
    const map: Partial<Record<string, DateToken>> = { day: 'DD', month: 'MM', year: 'YYYY' };
    const order = parts.filter((p) => map[p.type]).map((p) => map[p.type] as DateToken);
    if (order.length === 3) return order;
  } catch {
    /* sin Intl: regla por idioma */
  }
  return toBaseLang(raw) === 'en' ? ['MM', 'DD', 'YYYY'] : ['DD', 'MM', 'YYYY'];
}

/**
 * Orden de segmentos de un formato (o del locale si el formato no los define todos).
 * @param {string} format Formato (`YYYY-MM-DD`).
 * @param {string} locale Locale crudo.
 * @returns {DateToken[]} Tokens ordenados.
 */
export function getDateOrder(format: string | null | undefined, locale: string | null | undefined): DateToken[] {
  const tokens = (format || '').match(/YYYY|AAAA|YY|MM|DD/g) || [];
  const norm = tokens.map((tk) => (tk === 'AAAA' || tk === 'YY' ? 'YYYY' : tk)) as DateToken[];
  if (norm.length === 3 && new Set(norm).size === 3) return norm;
  return localeDateOrder(locale);
}

/**
 * Patrón de solo fecha (`MM/DD/YYYY`).
 * @param {string} format Formato activo.
 * @param {string} locale Locale crudo.
 * @returns {string} Patrón.
 */
export function getDatePattern(format: string | null | undefined, locale: string | null | undefined): string {
  return getDateOrder(format, locale).join('/');
}

/**
 * Indica si un formato usa 12 horas (`hh`, `A`, `AM`, `aa`…).
 * @param {string} format Formato.
 * @returns {boolean} `true` si es AM/PM.
 */
export function isAmPmFormat(format: string | null | undefined): boolean {
  if (!format) return false;
  return /(?:^|[\s/_-])(?:a|A|am|pm|AM|PM|aa|AA)(?:[\s/_-]|$)/.test(format) || format.includes('hh');
}

/**
 * Formato por defecto según modo, 12/24 h y locale.
 * @param {PickerMode} mode Modo.
 * @param {boolean} ampm Formato de 12 horas.
 * @param {string} locale Locale crudo.
 * @returns {string} Formato (`DD/MM/YYYY HH:mm`).
 */
export function getDefaultFormat(mode: PickerMode, ampm: boolean, locale: string | null | undefined): string {
  const timeFmt = ampm ? 'hh:mm A' : 'HH:mm';
  if (mode === 'time') return timeFmt;
  const dateFmt = localeDateOrder(locale).join('/');
  return mode === 'datetime' ? `${dateFmt} ${timeFmt}` : dateFmt;
}

/**
 * Determina el modo a partir del nombre (`datetimepicker`, `time-range`…).
 * @param {string} name Valor tipo `data-mtx`.
 * @param {string} [picker] Valor explícito tipo `data-picker` (prevalece).
 * @returns {PickerMode} Modo.
 */
export function resolvePickerMode(name: string, picker = ''): PickerMode {
  const explicit = picker.toLowerCase().replace(/-?range/, '').replace('date-time', 'datetime');
  if (explicit === 'date' || explicit === 'time' || explicit === 'datetime') return explicit;
  const lower = name.toLowerCase();
  if (/date-?time/.test(lower)) return 'datetime';
  if (lower.includes('time')) return 'time';
  return 'date';
}

// ---------------------------------------------------------------------------
// Comparación y claves
// ---------------------------------------------------------------------------

/**
 * Indica si dos fechas caen en el mismo día natural.
 * @param {Date|null} a Primera fecha.
 * @param {Date|null} b Segunda fecha.
 * @returns {boolean} `true` si coinciden año, mes y día.
 */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return Boolean(a && b) && a!.getFullYear() === b!.getFullYear()
    && a!.getMonth() === b!.getMonth() && a!.getDate() === b!.getDate();
}

/**
 * Clave estable `YYYY-MM-DD` de una fecha.
 * @param {Date} date Fecha.
 * @returns {string} Clave del día.
 */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Inicio del día (00:00) como timestamp.
 * @param {Date} date Fecha.
 * @returns {number} Milisegundos.
 */
export function dayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Copia de la fecha a las 00:00.
 * @param {Date} date Fecha.
 * @returns {Date} Inicio del día.
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Número de días de un mes.
 * @param {number} year Año.
 * @param {number} month Mes (0-11).
 * @returns {number} Días.
 */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Suma meses conservando el día cuando existe (31 ene + 1 → 28/29 feb).
 * @param {Date} date Fecha.
 * @param {number} count Meses (negativo resta).
 * @returns {Date} Nueva fecha (00:00).
 */
export function addMonths(date: Date, count: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth();
  return new Date(y, m + count, Math.min(date.getDate(), daysInMonth(y, m + count)));
}

/**
 * Suma días.
 * @param {Date} date Fecha.
 * @param {number} count Días.
 * @returns {Date} Nueva fecha (00:00).
 */
export function addDays(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
}

// ---------------------------------------------------------------------------
// Rango min/max
// ---------------------------------------------------------------------------

/** Límites de fecha. */
export interface DateBounds {
  min?: Date | null;
  max?: Date | null;
}

/**
 * Indica si un día está fuera de [min, max] (comparación por día).
 * @param {Date} date Fecha.
 * @param {DateBounds} bounds Límites.
 * @returns {boolean} `true` si está deshabilitado.
 */
export function isDateDisabled(date: Date, { min, max }: DateBounds = {}): boolean {
  const cur = dayTime(date);
  if (min && cur < dayTime(min)) return true;
  if (max && cur > dayTime(max)) return true;
  return false;
}

/**
 * Indica si un mes completo está fuera de [min, max] (selector de meses).
 * @param {number} year Año.
 * @param {number} month Mes (0-11).
 * @param {DateBounds} bounds Límites.
 * @returns {boolean} `true` si el mes está deshabilitado.
 */
export function isMonthDisabled(year: number, month: number, { min, max }: DateBounds = {}): boolean {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  if (min && monthEnd < startOfDay(min)) return true;
  if (max && monthStart > max) return true;
  return false;
}

/**
 * Años disponibles en el selector (1900–2100 o los de min/max).
 * @param {DateBounds} bounds Límites.
 * @returns {number[]} Años ascendentes.
 */
export function getYearRange({ min, max }: DateBounds = {}): number[] {
  const from = min ? min.getFullYear() : 1900;
  const to = max ? max.getFullYear() : 2100;
  const years: number[] = [];
  for (let y = from; y <= to; y++) years.push(y);
  return years;
}

/**
 * Busca el primer día habilitado desde `target` avanzando en `step` (máx. 366 días).
 * @param {Date} target Fecha destino.
 * @param {number} step Dirección (1 o -1).
 * @param {DateBounds} bounds Límites.
 * @returns {Date|null} Día habilitado o `null`.
 */
export function findEnabledDate(target: Date, step: number, bounds: DateBounds = {}): Date | null {
  let date = new Date(target);
  let guard = 0;
  while (isDateDisabled(date, bounds) && guard < 366) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + step);
    guard++;
  }
  return isDateDisabled(date, bounds) ? null : date;
}

// ---------------------------------------------------------------------------
// Parseo y formato
// ---------------------------------------------------------------------------

/** Opciones de {@link parseDate}. */
export interface ParseDateOptions {
  /** Formato activo (define el orden DD/MM o MM/DD). */
  format?: string | null;
  /** Locale crudo (orden por defecto si el formato no lo define). */
  locale?: string | null;
  /** Fecha base para horas sueltas y `today` (por defecto, ahora). */
  now?: Date;
}

/**
 * Parsea Date, timestamp o texto: ISO `YYYY-MM-DD[THH:mm]`, fecha según orden del formato/locale,
 * `HH:mm [AM|PM]` y `today`/`hoy`/`now`/`ahora`. Rechaza desbordes (31/02).
 * @param {Date|number|string|null} value Valor.
 * @param {ParseDateOptions} [options] Formato, locale y fecha base.
 * @returns {Date|null} Fecha válida o `null`.
 */
export function parseDate(value: Date | number | string | null | undefined, options: ParseDateOptions = {}): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : new Date(value);
  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const now = () => (options.now ? new Date(options.now) : new Date());

  if (/^(today|hoy|now|ahora)$/i.test(trimmed)) return now();

  const applyMeridiem = (hour: number): number => {
    const m = trimmed.match(/\b(a|p)\.?\s?m?\.?$/i) || trimmed.match(/(am|pm)$/i);
    if (!m) return hour;
    const isPm = m[0].toLowerCase().startsWith('p');
    if (isPm && hour < 12) return hour + 12;
    if (!isPm && hour === 12) return 0;
    return hour;
  };
  const build = (year: number, month: number, day: number, hour = 0, min = 0, sec = 0): Date | null => {
    const d = new Date(year, month, day, hour, min, sec);
    if (isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
    return d;
  };
  const readTime = (chunk: string | undefined): [number, number, number] => {
    const tp = (chunk || '').match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!tp) return [0, 0, 0];
    return [applyMeridiem(parseInt(tp[1], 10)), parseInt(tp[2], 10), tp[3] ? parseInt(tp[3], 10) : 0];
  };

  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
  if (iso) {
    const [h, mi, se] = readTime(iso[4]);
    return build(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10), h, mi, se);
  }

  const dateMatch = trimmed.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})(?:[\sT]+(.*))?$/);
  if (dateMatch) {
    const order: DateToken[] = /^\d{4}$/.test(dateMatch[1]) ? ['YYYY', 'MM', 'DD'] : getDateOrder(options.format, options.locale);
    const values = {} as Record<DateToken, number>;
    order.forEach((token, i) => { values[token] = parseInt(dateMatch[i + 1], 10); });
    let year = values.YYYY;
    if (dateMatch[order.indexOf('YYYY') + 1].length <= 2) year += 2000;
    let month = values.MM;
    let day = values.DD;
    // Tolerancia: mes imposible pero día válido como mes → se intercambian.
    if (month > 12 && day <= 12) [month, day] = [day, month];
    const [h, mi, se] = readTime(dateMatch[4]);
    return build(year, month - 1, day, h, mi, se);
  }

  if (/^\d{1,2}:\d{2}/.test(trimmed)) {
    const [hour, min, sec] = readTime(trimmed);
    if (hour > 23 || min > 59) return null;
    const d = now();
    d.setHours(hour, min, sec, 0);
    return d;
  }

  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formatea una fecha: `YYYY`/`AAAA`, `YY`, `MM`, `DD`, `HH`, `hh`, `mm`, `ss`, `A`/`AM`/`AA` y `a`/`am`/`aa`.
 * @param {Date|null} date Fecha.
 * @param {string} format Patrón.
 * @returns {string} Texto (vacío si la fecha no es válida).
 */
export function formatDate(date: Date | null | undefined, format: string): string {
  if (!date || isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  const yy = yyyy.slice(-2);
  const rawHours = date.getHours();
  const HH = String(rawHours).padStart(2, '0');
  const hh = String(rawHours % 12 || 12).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ampmUpper = rawHours >= 12 ? 'PM' : 'AM';
  const ampmLower = rawHours >= 12 ? 'pm' : 'am';

  return format
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

/**
 * Máscara numérica de TextField para un formato (`YYYY-MM-DD HH:mm` → `0000-00-00 00:00`).
 * @param {string} format Formato.
 * @returns {string} Patrón de máscara.
 */
export function formatToMask(format: string | null | undefined): string {
  if (!format) return '';
  const m = format
    .replace(/YYYY|AAAA/g, '0000')
    .replace(/YY/g, '00')
    .replace(/MM/g, '00')
    .replace(/DD/g, '00')
    .replace(/HH|hh/g, '00')
    .replace(/mm/g, '00')
    .replace(/ss/g, '00');
  return m.replace(/\b[aA]\b|(?<=\s|^)[aA](?=\s|$)|AM|PM|aa|AA/g, 'AA');
}

// ---------------------------------------------------------------------------
// Nombres localizados
// ---------------------------------------------------------------------------

/**
 * Nombres de meses o días con `Intl` (capitalizados; semana empezando en domingo).
 * @param {'month'|'weekday'} kind Tipo.
 * @param {'long'|'short'|'narrow'} width Longitud.
 * @param {string} locale Locale crudo.
 * @returns {string[]|null} Nombres o `null` sin `Intl`.
 */
export function intlNames(kind: 'month' | 'weekday', width: 'long' | 'short' | 'narrow', locale: string | null | undefined): string[] | null {
  try {
    const fmt = new Intl.DateTimeFormat(toIntlLocale(locale), { [kind]: width });
    const count = kind === 'month' ? 12 : 7;
    // 2026-02-01 es domingo.
    const names = Array.from({ length: count }, (_, i) => fmt.format(kind === 'month' ? new Date(2026, i, 1) : new Date(2026, 1, 1 + i)));
    return names.map((n) => n.charAt(0).toUpperCase() + n.slice(1));
  } catch {
    return null;
  }
}

type PickerDict = { months: string[]; monthsShort: string[]; weekdays: string[]; weekdaysShort: string[] };

/**
 * Textos del picker del idioma registrado que corresponde al locale (o `null` → `Intl`).
 * @param {string} locale Locale crudo.
 * @returns {PickerDict|null} Diccionario.
 */
function pickerDict(locale: string | null | undefined): PickerDict | null {
  const lang = resolveLocaleCode(locale);
  if (!lang || !matchesLang(String(locale), lang)) return null;
  const dict = getDictionary(lang);
  return dict && dict.code === lang && dict.dateTimePicker ? (dict.dateTimePicker as PickerDict) : null;
}

/**
 * Nombres de meses: diccionario registrado, luego `Intl`, luego inglés.
 * @param {string} locale Locale crudo.
 * @param {'long'|'short'} [width='long'] Longitud.
 * @returns {string[]} 12 nombres.
 */
export function getMonthNames(locale: string | null | undefined, width: 'long' | 'short' = 'long'): string[] {
  const dict = pickerDict(locale);
  const fromDict = dict && (width === 'long' ? dict.months : dict.monthsShort);
  const en = getDictionary('en').dateTimePicker;
  return fromDict || intlNames('month', width, locale) || (width === 'long' ? en.months : en.monthsShort);
}

/**
 * Nombres de días (domingo primero): `narrow` y `short` del diccionario o `Intl`; `long` siempre con `Intl`.
 * @param {string} locale Locale crudo.
 * @param {'narrow'|'short'|'long'} [width='narrow'] Longitud.
 * @returns {string[]} 7 nombres.
 */
export function getWeekdayNames(locale: string | null | undefined, width: 'narrow' | 'short' | 'long' = 'narrow'): string[] {
  if (width === 'long') return intlNames('weekday', 'long', locale) || getWeekdayNames(locale, 'short');
  const dict = pickerDict(locale);
  const fromDict = dict && (width === 'narrow' ? dict.weekdays : dict.weekdaysShort);
  const en = getDictionary('en').dateTimePicker;
  return fromDict || intlNames('weekday', width, locale) || (width === 'narrow' ? en.weekdays : en.weekdaysShort);
}

/**
 * Etiqueta accesible de un día ("Tuesday, October 20, 2026").
 * @param {Date} date Fecha.
 * @param {string} locale Locale crudo.
 * @returns {string} Texto localizado.
 */
export function formatDayLabel(date: Date, locale: string | null | undefined): string {
  try {
    return new Intl.DateTimeFormat(toIntlLocale(locale), {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(date);
  } catch {
    return `${getWeekdayNames(locale, 'short')[date.getDay()]}, ${getMonthNames(locale)[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}

// ---------------------------------------------------------------------------
// Cuadrícula del mes
// ---------------------------------------------------------------------------

/** Celda de la cuadrícula mensual. */
export interface CalendarDay {
  date: Date;
  /** Clave `YYYY-MM-DD`. */
  key: string;
  /** Pertenece al mes anterior o siguiente. */
  outside: boolean;
}

/**
 * Semanas del mes (domingo primero), completando con días de los meses vecinos.
 * @param {number} year Año.
 * @param {number} month Mes (0-11).
 * @returns {CalendarDay[][]} Filas de 7 días (4 a 6 semanas).
 */
export function getMonthGrid(year: number, month: number): CalendarDay[][] {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalCells = Math.ceil((firstDayIndex + daysInMonth(year, month)) / 7) * 7;
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i % 7 === 0) weeks.push([]);
    const date = new Date(year, month, 1 - firstDayIndex + i);
    weeks[weeks.length - 1].push({ date, key: dayKey(date), outside: date.getMonth() !== month });
  }
  return weeks;
}

/** Opciones de {@link getGridFocusDate}. */
export interface GridFocusOptions extends DateBounds {
  /** Día enfocado previamente. */
  focused?: Date | null;
  /** Día seleccionado (o inicio/fin del rango). */
  selected?: Date | null;
  /** Hoy (inyectable en pruebas). */
  today?: Date;
}

/**
 * Día con `tabindex=0` del grid: enfocado > seleccionado > hoy > primer día habilitado del mes.
 * @param {number} year Año visible.
 * @param {number} month Mes visible (0-11).
 * @param {GridFocusOptions} [options] Estado.
 * @returns {Date} Día enfocable.
 */
export function getGridFocusDate(year: number, month: number, options: GridFocusOptions = {}): Date {
  const usable = (d: Date | null | undefined): d is Date =>
    Boolean(d) && d!.getFullYear() === year && d!.getMonth() === month && !isDateDisabled(d!, options);
  if (usable(options.focused)) return options.focused;
  if (usable(options.selected)) return options.selected;
  const today = options.today ?? new Date();
  if (usable(today)) return today;
  const total = daysInMonth(year, month);
  for (let day = 1; day <= total; day++) {
    const d = new Date(year, month, day);
    if (!isDateDisabled(d, options)) return d;
  }
  return new Date(year, month, 1);
}

/**
 * Destino de una tecla en el grid (flechas, Inicio/Fin de semana, RePág/AvPág, Mayús = año).
 * @param {Date} current Día enfocado.
 * @param {string} key `event.key`.
 * @param {boolean} [shiftKey=false] Mayúsculas pulsada.
 * @returns {{date: Date, step: number}|null} Fecha y dirección para saltar deshabilitados, o `null`.
 */
export function getGridKeyTarget(current: Date, key: string, shiftKey = false): { date: Date; step: number } | null {
  const y = current.getFullYear();
  const m = current.getMonth();
  const d = current.getDate();
  switch (key) {
    case 'ArrowLeft': return { date: new Date(y, m, d - 1), step: -1 };
    case 'ArrowRight': return { date: new Date(y, m, d + 1), step: 1 };
    case 'ArrowUp': return { date: new Date(y, m, d - 7), step: -1 };
    case 'ArrowDown': return { date: new Date(y, m, d + 7), step: 1 };
    case 'Home': return { date: new Date(y, m, d - current.getDay()), step: 1 };
    case 'End': return { date: new Date(y, m, d + (6 - current.getDay())), step: -1 };
    case 'PageUp': return { date: addMonths(current, shiftKey ? -12 : -1), step: -1 };
    case 'PageDown': return { date: addMonths(current, shiftKey ? 12 : 1), step: 1 };
    default: return null;
  }
}

// ---------------------------------------------------------------------------
// Rangos de fechas
// ---------------------------------------------------------------------------

/** Estado visual de un día en un picker de rango. */
export interface DayRangeState {
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  /** Entre el inicio y el día bajo el puntero mientras falta el fin. */
  inPreview: boolean;
}

/**
 * Estado de un día respecto a un rango (inicio, fin, intermedio y vista previa).
 * @param {Date} date Día.
 * @param {{start?: Date|null, end?: Date|null, hover?: Date|null}} range Rango y día bajo el puntero.
 * @returns {DayRangeState} Estado.
 */
export function getDayRangeState(
  date: Date,
  { start, end, hover }: { start?: Date | null; end?: Date | null; hover?: Date | null },
): DayRangeState {
  const t = dayTime(date);
  const s = start ? dayTime(start) : null;
  const e = end ? dayTime(end) : null;
  const isStart = s !== null && t === s;
  const isEnd = e !== null && t === e;
  const inRange = s !== null && e !== null && t > s && t < e;
  let inPreview = false;
  if (s !== null && e === null && hover) {
    const h = dayTime(hover);
    inPreview = t > Math.min(s, h) && t < Math.max(s, h);
  }
  return { isStart, isEnd, inRange, inPreview };
}

/**
 * Ordena el segundo clic de un rango: si es anterior al inicio, se intercambian.
 * @param {Date} start Inicio elegido.
 * @param {Date} clicked Segundo día.
 * @returns {[Date, Date]} `[inicio, fin]`.
 */
export function orderRange(start: Date, clicked: Date): [Date, Date] {
  return dayTime(clicked) < dayTime(start) ? [clicked, start] : [start, clicked];
}

// ---------------------------------------------------------------------------
// Horas y reloj radial
// ---------------------------------------------------------------------------

/**
 * Hora de 24 h a 12 h.
 * @param {number} hour24 Hora 0-23.
 * @returns {{hour: number, meridiem: Meridiem}} Hora 1-12 y período.
 */
export function to12Hour(hour24: number): { hour: number; meridiem: Meridiem } {
  return { hour: hour24 % 12 || 12, meridiem: hour24 >= 12 ? 'PM' : 'AM' };
}

/**
 * Hora de 12 h a 24 h.
 * @param {number} hour12 Hora 1-12.
 * @param {Meridiem} meridiem Período.
 * @returns {number} Hora 0-23.
 */
export function to24Hour(hour12: number, meridiem: Meridiem): number {
  return (hour12 % 12) + (meridiem === 'PM' ? 12 : 0);
}

/**
 * Cambia el período de una hora de 24 h (`_setAmPm` de vanilla).
 * @param {number} hour24 Hora 0-23.
 * @param {Meridiem} meridiem Nuevo período.
 * @returns {number} Hora 0-23 ajustada.
 */
export function setMeridiem(hour24: number, meridiem: Meridiem): number {
  if (meridiem === 'PM' && hour24 < 12) return hour24 + 12;
  if (meridiem === 'AM' && hour24 >= 12) return hour24 - 12;
  return hour24;
}

/** Geometría del reloj de vanilla: radio de los números y centro (px). */
export const CLOCK_RADIUS = 104;
export const CLOCK_CENTER = 128;

/**
 * Ángulo (0° arriba, sentido horario) de un punto relativo al centro del reloj.
 * @param {number} dx Desplazamiento X desde el centro.
 * @param {number} dy Desplazamiento Y desde el centro.
 * @returns {number} Grados 0-360.
 */
export function pointToClockAngle(dx: number, dy: number): number {
  let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  if (deg < 0) deg += 360;
  return deg;
}

/**
 * Hora (1-12) correspondiente a un ángulo.
 * @param {number} deg Grados.
 * @returns {number} Hora 1-12.
 */
export function angleToHour(deg: number): number {
  return Math.round(deg / 30) % 12 || 12;
}

/**
 * Minuto (0-59) correspondiente a un ángulo.
 * @param {number} deg Grados.
 * @returns {number} Minuto.
 */
export function angleToMinute(deg: number): number {
  return Math.round(deg / 6) % 60;
}

/**
 * Ángulo de la aguja para una hora o un minuto.
 * @param {'hours'|'minutes'} unit Unidad.
 * @param {number} value Hora (0-23 o 1-12) o minuto.
 * @returns {number} Grados.
 */
export function clockHandAngle(unit: 'hours' | 'minutes', value: number): number {
  return unit === 'hours' ? (value % 12) * 30 : value * 6;
}

/**
 * Posición (left/top en px) de un número del reloj.
 * @param {number} deg Ángulo (horas: `h * 30`, minutos: `m * 6`).
 * @param {number} [radius=CLOCK_RADIUS] Radio.
 * @param {number} [center=CLOCK_CENTER] Centro.
 * @returns {{x: number, y: number}} Coordenadas.
 */
export function clockPosition(deg: number, radius = CLOCK_RADIUS, center = CLOCK_CENTER): { x: number; y: number } {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
}

/**
 * Valor del reloj tras una tecla: flechas ±1, RePág/AvPág ±5 min, Inicio/Fin extremos.
 * @param {'hours'|'minutes'} unit Unidad.
 * @param {number} value Valor mostrado (hora 1-12 con AM/PM, 0-23 sin él; minuto 0-59).
 * @param {string} key `event.key`.
 * @param {boolean} [ampm=false] Formato de 12 horas.
 * @returns {number|null} Nuevo valor o `null` si la tecla no aplica.
 */
export function getClockKeyValue(unit: 'hours' | 'minutes', value: number, key: string, ampm = false): number | null {
  const deltas: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
  if (unit === 'hours') {
    const min = ampm ? 1 : 0;
    const max = ampm ? 12 : 23;
    const current = ampm ? (value % 12 || 12) : value;
    if (deltas[key] !== undefined) {
      const span = max - min + 1;
      return ((current - min + Math.sign(deltas[key]) + span) % span) + min;
    }
    if (key === 'Home') return min;
    if (key === 'End') return max;
    return null;
  }
  if (deltas[key] !== undefined) return (value + deltas[key] + 60) % 60;
  if (key === 'Home') return 0;
  if (key === 'End') return 59;
  return null;
}
