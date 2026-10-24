/**
 * Utilidades internas de los pickers de fecha: deshabilitado con `shouldDisableDate`, foco del grid,
 * normalización de valores y textos de hora (complementan `src/utils/dates.ts`).
 */
import { daysInMonth, isDateDisabled, parseDate } from '../../utils/dates';
import type { ParseDateOptions } from '../../utils/dates';

/** Vista del calendario: días, meses o años. */
export type CalendarView = 'day' | 'month' | 'year';

/** Rango de fechas (inicio y fin). */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Entrada de fecha admitida: `Date`, timestamp o texto (ISO, formato activo, `today`). */
export type PickerDateInput = Date | number | string | null | undefined;

/** Entrada de rango: objeto `{ start, end }`, tupla o texto `inicio - fin`. */
export type PickerRangeInput =
  | { start?: PickerDateInput; end?: PickerDateInput }
  | [PickerDateInput, PickerDateInput]
  | string
  | null
  | undefined;

/** Límites y filtro de días. */
export interface DayFilter {
  min?: Date | null;
  max?: Date | null;
  shouldDisableDate?: (date: Date) => boolean;
}

/**
 * Indica si un día está deshabilitado por min/max o por `shouldDisableDate`.
 * @param {Date} date Día.
 * @param {DayFilter} filter Límites y filtro.
 * @returns {boolean} `true` si no se puede elegir.
 */
export function isDayDisabled(date: Date, filter: DayFilter): boolean {
  if (isDateDisabled(date, filter)) return true;
  return Boolean(filter.shouldDisableDate && filter.shouldDisableDate(date));
}

/**
 * Primer día habilitado desde `target` avanzando en `step` (máx. 366 días).
 * @param {Date} target Día de partida.
 * @param {number} step Dirección (1 o -1).
 * @param {DayFilter} filter Límites y filtro.
 * @returns {Date|null} Día habilitado o `null`.
 */
export function findEnabledDay(target: Date, step: number, filter: DayFilter): Date | null {
  let date = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  for (let guard = 0; guard < 366 && isDayDisabled(date, filter); guard++) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + step);
  }
  return isDayDisabled(date, filter) ? null : date;
}

/**
 * Día con `tabindex=0` del grid: enfocado > seleccionado > hoy > primer día habilitado.
 * @param {number} year Año visible.
 * @param {number} month Mes visible (0-11).
 * @param {{focused?: Date|null, selected?: Date|null, today?: Date}} state Estado.
 * @param {DayFilter} filter Límites y filtro.
 * @returns {Date} Día enfocable.
 */
export function getRovingDay(
  year: number,
  month: number,
  state: { focused?: Date | null; selected?: Date | null; today?: Date },
  filter: DayFilter,
): Date {
  const usable = (d: Date | null | undefined): d is Date =>
    Boolean(d) && d!.getFullYear() === year && d!.getMonth() === month && !isDayDisabled(d!, filter);
  if (usable(state.focused)) return state.focused;
  if (usable(state.selected)) return state.selected;
  const today = state.today ?? new Date();
  if (usable(today)) return today;
  const total = daysInMonth(year, month);
  for (let day = 1; day <= total; day++) {
    const d = new Date(year, month, day);
    if (!isDayDisabled(d, filter)) return d;
  }
  return new Date(year, month, 1);
}

/**
 * Normaliza una entrada de rango a `{ start, end }` ordenado.
 * @param {PickerRangeInput} input Entrada.
 * @param {string} separator Separador del texto.
 * @param {ParseDateOptions} options Formato y locale del parseo.
 * @returns {DateRange} Rango.
 */
export function toRange(input: PickerRangeInput, separator: string, options: ParseDateOptions): DateRange {
  if (input === null || input === undefined || input === '') return { start: null, end: null };
  let rawStart: PickerDateInput;
  let rawEnd: PickerDateInput;
  if (typeof input === 'string') {
    const sep = input.includes(separator) ? separator : ' - ';
    if (input.includes(sep)) [rawStart, rawEnd] = input.split(sep);
    else rawStart = input;
  } else if (Array.isArray(input)) {
    [rawStart, rawEnd] = input;
  } else {
    rawStart = input.start;
    rawEnd = input.end;
  }
  const start = parseDate(rawStart, options);
  const end = parseDate(rawEnd, options);
  if (start && end && start.getTime() > end.getTime()) return { start: end, end: start };
  return { start, end };
}

/**
 * Texto `HH:mm` o `hh:mm AM` de una hora.
 * @param {number} hour Hora 0-23.
 * @param {number} minute Minuto.
 * @param {boolean} ampm Formato de 12 horas.
 * @returns {string} Hora formateada.
 */
export function timeText(hour: number, minute: number, ampm: boolean): string {
  const mm = String(minute).padStart(2, '0');
  if (!ampm) return `${String(hour).padStart(2, '0')}:${mm}`;
  return `${String(hour % 12 || 12).padStart(2, '0')}:${mm} ${hour >= 12 ? 'PM' : 'AM'}`;
}

/**
 * Clave estable de una fecha (o `''`) para comparar valores en efectos.
 * @param {Date|null|undefined} date Fecha.
 * @returns {string} Timestamp en texto.
 */
export function timeKey(date: Date | null | undefined): string {
  return date && !isNaN(date.getTime()) ? String(date.getTime()) : '';
}
