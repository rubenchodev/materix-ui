/**
 * Utilidades internas de {@link TimeView}: unidades, límites y valores de la vista de hora.
 */
import { getClockKeyValue, to24Hour } from '../../utils/dates';
import type { Meridiem } from '../../utils/dates';

/** Vista (unidad) de la hora. */
export type TimeViewName = 'hours' | 'minutes' | 'seconds';

/** Restricciones de selección de la vista de hora. */
export interface TimeConstraints {
  /** Hora mínima (solo cuenta la hora del día). */
  minTime?: Date;
  /** Hora máxima (solo cuenta la hora del día). */
  maxTime?: Date;
  /** Paso de los minutos (`1` = libre). */
  minutesStep: number;
}

/** Componentes de la hora mostrada. */
export interface TimeParts {
  hour24: number;
  minute: number;
  second: number;
  meridiem: Meridiem;
}

/**
 * Segundos transcurridos del día de una fecha.
 * @param {Date} date Fecha.
 * @returns {number} Segundos 0-86399.
 */
export function secondsOfDay(date: Date): number {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

/**
 * Descompone una fecha en hora, minuto, segundo y período.
 * @param {Date} date Fecha.
 * @returns {TimeParts} Partes.
 */
export function getTimeParts(date: Date): TimeParts {
  const hour24 = date.getHours();
  return { hour24, minute: date.getMinutes(), second: date.getSeconds(), meridiem: hour24 >= 12 ? 'PM' : 'AM' };
}

/**
 * Copia de la fecha con una unidad cambiada.
 * @param {Date} base Fecha de partida.
 * @param {TimeViewName} unit Unidad.
 * @param {number} value Hora 0-23, minuto o segundo.
 * @returns {Date} Nueva fecha.
 */
export function setTimeUnit(base: Date, unit: TimeViewName, value: number): Date {
  const next = new Date(base.getTime());
  if (unit === 'hours') next.setHours(value);
  else if (unit === 'minutes') next.setMinutes(value);
  else next.setSeconds(value);
  return next;
}

/**
 * Indica si un valor de la unidad queda fuera de minTime/maxTime o del paso de minutos.
 * @param {TimeViewName} unit Unidad.
 * @param {number} value Hora 0-23, minuto o segundo.
 * @param {TimeParts} parts Hora actual (contexto de minutos y segundos).
 * @param {TimeConstraints} constraints Restricciones.
 * @returns {boolean} `true` si no se puede elegir.
 */
export function isTimeValueDisabled(unit: TimeViewName, value: number, parts: TimeParts, constraints: TimeConstraints): boolean {
  const min = constraints.minTime ? secondsOfDay(constraints.minTime) : -Infinity;
  const max = constraints.maxTime ? secondsOfDay(constraints.maxTime) : Infinity;
  let start: number;
  let end: number;
  if (unit === 'hours') {
    start = value * 3600;
    end = start + 3599;
  } else if (unit === 'minutes') {
    if (constraints.minutesStep > 1 && value % constraints.minutesStep !== 0) return true;
    start = parts.hour24 * 3600 + value * 60;
    end = start + 59;
  } else {
    start = parts.hour24 * 3600 + parts.minute * 60 + value;
    end = start;
  }
  return end < min || start > max;
}

/**
 * Valor mostrado en el reloj para una unidad (hora 1-12 con AM/PM, 0-23 sin él).
 * @param {TimeViewName} unit Unidad.
 * @param {TimeParts} parts Hora actual.
 * @param {boolean} ampm Formato de 12 horas.
 * @returns {number} Valor mostrado.
 */
export function displayValue(unit: TimeViewName, parts: TimeParts, ampm: boolean): number {
  if (unit === 'hours') return ampm ? parts.hour24 % 12 || 12 : parts.hour24;
  return unit === 'minutes' ? parts.minute : parts.second;
}

/**
 * Valor de la unidad tras una tecla, saltando los valores deshabilitados (`getClockKeyValue`).
 * @param {TimeViewName} unit Unidad.
 * @param {TimeParts} parts Hora actual.
 * @param {string} key `event.key`.
 * @param {boolean} ampm Formato de 12 horas.
 * @param {TimeConstraints} constraints Restricciones.
 * @returns {number|null} Hora 0-23, minuto o segundo; `null` si la tecla no aplica o no hay opción válida.
 */
export function getTimeKeyValue(
  unit: TimeViewName,
  parts: TimeParts,
  key: string,
  ampm: boolean,
  constraints: TimeConstraints,
): number | null {
  const clockUnit = unit === 'hours' ? 'hours' : 'minutes';
  const current = displayValue(unit, parts, ampm);
  let next = getClockKeyValue(clockUnit, current, key, ampm);
  if (next === null) return null;
  const toValue = (shown: number) => (unit === 'hours' && ampm ? to24Hour(shown, parts.meridiem) : shown);
  const forward = ['ArrowUp', 'ArrowRight', 'PageUp', 'Home'].includes(key);
  const stepKey = forward ? 'ArrowUp' : 'ArrowDown';
  for (let i = 0; i < 60; i++) {
    if (!isTimeValueDisabled(unit, toValue(next), parts, constraints)) return toValue(next);
    next = getClockKeyValue(clockUnit, next, stepKey, ampm) as number;
  }
  return null;
}
