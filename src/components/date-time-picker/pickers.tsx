'use client';
/**
 * Alias del DateTimePicker unificado (equivalen a `data-mtx="date-picker"`, `time-picker`,
 * `date-range-picker`, `datetime-range-picker` y a `data-static`).
 */
import { forwardRef } from 'react';
import { DateTimePicker } from './DateTimePicker';
import type { DateTimePickerProps } from './DateTimePicker';

/** Props de los alias con modo fijo. */
export type DatePickerProps = Omit<DateTimePickerProps, 'mode' | 'range'>;
/** Props de {@link TimePicker}. */
export type TimePickerProps = Omit<DateTimePickerProps, 'mode' | 'range' | 'shouldDisableDate' | 'openTo'>;
/** Props de los rangos. */
export type DateRangePickerProps = Omit<DateTimePickerProps, 'mode' | 'range'>;
/** Props de los pickers estáticos (sin campo ni popover). */
export type StaticDatePickerProps = Omit<DateTimePickerProps, 'mode' | 'range' | 'displayStatic' | 'display' | 'open' | 'defaultOpen'>;

/** Selector de fecha (`data-mtx="date-picker"`). */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="date" />;
});

/** Selector de hora (`data-mtx="time-picker"`). */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="time" />;
});

/** Rango de fechas (`data-mtx="date-range-picker"`). */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="date" range />;
});

/** Rango de fecha y hora (`data-mtx="datetime-range-picker"`). */
export const DateTimeRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateTimeRangePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="datetime" range />;
});

/** Calendario incrustado (`data-mtx="date-picker" data-static`). */
export const StaticDatePicker = forwardRef<HTMLDivElement, StaticDatePickerProps>(function StaticDatePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="date" displayStatic />;
});

/** Reloj incrustado (`data-mtx="time-picker" data-static`). */
export const StaticTimePicker = forwardRef<HTMLDivElement, StaticDatePickerProps>(function StaticTimePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="time" displayStatic />;
});

/** Fecha y hora incrustadas (`data-mtx="datetime-picker" data-static`). */
export const StaticDateTimePicker = forwardRef<HTMLDivElement, StaticDatePickerProps>(function StaticDateTimePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="datetime" displayStatic />;
});

/** Rango incrustado (`data-mtx="date-range-picker" data-static`). */
export const StaticDateRangePicker = forwardRef<HTMLDivElement, StaticDatePickerProps>(function StaticDateRangePicker(props, ref) {
  return <DateTimePicker ref={ref} {...props} mode="date" range displayStatic />;
});
