'use client';
/**
 * DateCalendar de Materix UI (MUI X DateCalendar): calendario mensual con el patrón WAI-ARIA
 * Date Picker Dialog (grid con roving tabindex), vistas de meses y años, min/max, filtro de días
 * y selección de rangos con vista previa. Reproduce el DOM y las clases de vanilla.
 */
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import '@rubenchodev/materix-ui/components/date-time-picker.css';
import { cx, useControlled, useEnhancedEffect, useForkRef } from '../../core';
import { useIntlLocale, useT } from '../../i18n';
import {
  dayKey,
  daysInMonth,
  formatDayLabel,
  getDayRangeState,
  getGridKeyTarget,
  getMonthGrid,
  getMonthNames,
  getWeekdayNames,
  getYearRange,
  isMonthDisabled,
  isSameDay,
} from '../../utils/dates';
import { findEnabledDay, getRovingDay, isDayDisabled } from './picker-utils';
import type { CalendarView, DateRange } from './picker-utils';

/** Metadatos de un cambio de rango. */
export interface DateRangeChangeMeta {
  /** `true` cuando el clic fija el fin del rango. */
  complete: boolean;
}

/** Propiedades de {@link DateCalendar}. Los atributos extra van al nodo raíz de la vista activa. */
export interface DateCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Fecha seleccionada (controlado). */
  value?: Date | null;
  /** Fecha inicial (no controlado). */
  defaultValue?: Date | null;
  /** Elección de un día (conserva la hora del valor actual o de `referenceDate`). */
  onChange?: (date: Date) => void;
  /** Selección de rango con dos clics. */
  range?: boolean;
  /** Rango seleccionado (controlado). */
  rangeValue?: DateRange;
  /** Rango inicial (no controlado). */
  defaultRangeValue?: DateRange;
  /** Cambio de rango: primer clic (inicio) o segundo (fin, `complete`). */
  onRangeChange?: (range: DateRange, meta: DateRangeChangeMeta) => void;
  /** Vista activa (controlado). */
  view?: CalendarView;
  /** Vista inicial (`day`). */
  defaultView?: CalendarView;
  /** Cambio de vista. */
  onViewChange?: (view: CalendarView) => void;
  /** Mes visible (controlado; se usan año y mes). */
  month?: Date;
  /** Cambio del mes visible. */
  onMonthChange?: (month: Date) => void;
  /** Fecha de referencia sin valor (mes inicial y hora de los días elegidos). */
  referenceDate?: Date;
  /** Fecha mínima (`data-min`). */
  minDate?: Date | null;
  /** Fecha máxima (`data-max`). */
  maxDate?: Date | null;
  /** Deshabilita días concretos (p. ej. fines de semana). */
  shouldDisableDate?: (date: Date) => boolean;
  /** Deshabilita todo el calendario. */
  disabled?: boolean;
  /** Muestra el calendario sin permitir elegir. */
  readOnly?: boolean;
  /** Locale con región para `Intl` y textos (`es-MX`); por defecto el del contexto. */
  locale?: string;
  /** Enfoca el día (mes o año) activo al montar. */
  autoFocus?: boolean;
}

/** Selector del elemento enfocable de cada vista. */
const VIEW_FOCUS: Record<CalendarView, string> = {
  day: '.mtx-date-picker__day[tabindex="0"]',
  month: '.mtx-date-picker__month[tabindex="0"]',
  year: '.mtx-date-picker__year[tabindex="0"]',
};

/**
 * Enfoca el elemento activo de una vista dentro de un nodo.
 * @param {HTMLElement|null} root Nodo raíz de la vista.
 * @param {CalendarView} view Vista.
 */
export function focusCalendarView(root: ParentNode | null, view: CalendarView): void {
  const el = root?.querySelector<HTMLElement>(VIEW_FOCUS[view]);
  if (!el) return;
  el.focus();
  if (view === 'year' && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'center' });
}

/**
 * Calendario mensual con vistas de meses y años y selección simple o de rango.
 */
export const DateCalendar = forwardRef<HTMLDivElement, DateCalendarProps>(function DateCalendar(props, ref) {
  const {
    value: valueProp,
    defaultValue = null,
    onChange,
    range = false,
    rangeValue: rangeProp,
    defaultRangeValue,
    onRangeChange,
    view: viewProp,
    defaultView = 'day',
    onViewChange,
    month: monthProp,
    onMonthChange,
    referenceDate,
    minDate = null,
    maxDate = null,
    shouldDisableDate,
    disabled = false,
    readOnly = false,
    locale: localeProp,
    autoFocus = false,
    className,
    ...rest
  } = props;

  const contextLocale = useIntlLocale();
  const locale = localeProp || contextLocale;
  const t = useT('dateTimePicker', localeProp);
  const titleId = `mtx-picker-title-${useId().replace(/:/g, '')}`;

  const [value, setValue] = useControlled<Date | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'DateCalendar',
  });
  const [rangeValue, setRangeValue] = useControlled<DateRange>({
    controlled: rangeProp,
    default: defaultRangeValue ?? { start: null, end: null },
    name: 'DateCalendar',
    state: 'rangeValue',
  });
  const [view, setViewState] = useControlled<CalendarView>({
    controlled: viewProp,
    default: defaultView,
    name: 'DateCalendar',
    state: 'view',
  });
  const selected = range ? rangeValue.start || rangeValue.end : value;
  // Default fijado al montar: `new Date()` cambiaría en cada render.
  const [initialMonth] = useState(() => new Date(selected ?? referenceDate ?? new Date()));
  const [month, setMonthState] = useControlled<Date>({
    controlled: monthProp,
    default: initialMonth,
    name: 'DateCalendar',
    state: 'month',
  });

  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedOption, setFocusedOption] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, rootRef);
  const pendingDayFocus = useRef<string | null>(null);
  const pendingViewFocus = useRef(autoFocus);

  const filter = { min: minDate, max: maxDate, shouldDisableDate };
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const setMonth = (next: Date) => {
    setMonthState(next);
    onMonthChange?.(next);
  };
  const setView = (next: CalendarView, focus = true) => {
    pendingViewFocus.current = focus;
    setFocusedOption(null);
    setViewState(next);
    onViewChange?.(next);
  };

  // Foco tras cambiar de vista (o al montar con autoFocus) y tras navegar con teclado a otro mes.
  useEnhancedEffect(() => {
    if (!pendingViewFocus.current) return;
    pendingViewFocus.current = false;
    focusCalendarView(rootRef.current?.parentNode ?? null, view);
  }, [view]);
  useEnhancedEffect(() => {
    const key = pendingDayFocus.current;
    if (!key || !rootRef.current) return;
    pendingDayFocus.current = null;
    const btn = rootRef.current.querySelector<HTMLElement>(
      `.mtx-date-picker__day[data-date="${key}"]:not(.mtx-date-picker__day--outside)`,
    );
    btn?.focus();
  });

  // Vista de años: desplaza el año seleccionado al centro.
  useEffect(() => {
    if (view !== 'year') return undefined;
    const timer = setTimeout(() => {
      const sel = rootRef.current?.querySelector<HTMLElement>('.mtx-date-picker__year--selected');
      if (sel && typeof sel.scrollIntoView === 'function') sel.scrollIntoView({ block: 'center' });
    }, 0);
    return () => clearTimeout(timer);
  }, [view]);

  /** Elige un día (simple o rango). */
  const selectDay = (date: Date) => {
    if (readOnly || disabled) return;
    if (range) {
      const { start, end } = rangeValue;
      let next: DateRange;
      let complete = false;
      if (!start || end) {
        next = { start: new Date(date.getFullYear(), date.getMonth(), date.getDate()), end: null };
      } else {
        const clicked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        next = clicked.getTime() < new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
          ? { start: clicked, end: start }
          : { start, end: clicked };
        complete = true;
        setHoverDate(null);
      }
      setRangeValue(next);
      onRangeChange?.(next, { complete });
      return;
    }
    const base = value ?? referenceDate ?? null;
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), base?.getHours() ?? 0, base?.getMinutes() ?? 0, base?.getSeconds() ?? 0);
    setValue(next);
    onChange?.(next);
  };

  /** Mueve el foco del grid (saltando días deshabilitados) y cambia de mes si hace falta. */
  const moveGridFocus = (target: Date, step: number) => {
    const date = findEnabledDay(target, step, filter);
    if (!date) return;
    setFocusedDate(date);
    if (range && rangeValue.start && !rangeValue.end) setHoverDate(date);
    pendingDayFocus.current = dayKey(date);
    if (date.getFullYear() !== year || date.getMonth() !== monthIndex) {
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const handleDayKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!event.currentTarget.disabled) event.currentTarget.click();
      return;
    }
    const target = getGridKeyTarget(date, event.key, event.shiftKey);
    if (!target) return;
    event.preventDefault();
    moveGridFocus(target.date, target.step);
  };

  /** Teclado en meses y años: ±1, ±3 filas, Inicio/Fin y Enter/Espacio. */
  const handleOptionKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, toKey: (el: HTMLElement) => number) => {
    const option = event.currentTarget;
    const options = Array.from(option.parentElement?.children ?? []).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement && !el.disabled,
    );
    const index = options.indexOf(option);
    let next: HTMLButtonElement | undefined;
    switch (event.key) {
      case 'ArrowLeft': next = options[index - 1]; break;
      case 'ArrowRight': next = options[index + 1]; break;
      case 'ArrowUp': next = options[index - 3]; break;
      case 'ArrowDown': next = options[index + 3]; break;
      case 'Home': next = options[0]; break;
      case 'End': next = options[options.length - 1]; break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        option.click();
        return;
      default:
        return;
    }
    event.preventDefault();
    if (!next) return;
    setFocusedOption(toKey(next));
    next.focus();
  };

  const rootClass = (base: string) => cx(base, className);

  // ---------------------------------------------------------------- Meses
  if (view === 'month') {
    const shortNames = getMonthNames(locale, 'short');
    const longNames = getMonthNames(locale, 'long');
    const current = selected && selected.getFullYear() === year ? selected.getMonth() : monthIndex;
    const enabled = (m: number) => !isMonthDisabled(year, m, filter);
    let roving = focusedOption ?? current;
    if (!enabled(roving)) roving = longNames.findIndex((_, m) => enabled(m));
    return (
      <div
        role="radiogroup"
        aria-label={t('chooseMonth', null, 'Choose month')}
        {...rest}
        ref={handleRef}
        className={rootClass('mtx-date-picker__months')}
      >
        {longNames.map((name, m) => {
          const isSelected = m === current;
          const isDisabled = disabled || !enabled(m);
          return (
            <button
              key={name}
              type="button"
              className={cx('mtx-date-picker__month', isSelected && 'mtx-date-picker__month--selected')}
              title={name}
              role="radio"
              aria-checked={isSelected}
              aria-label={name}
              tabIndex={m === roving ? 0 : -1}
              data-focus-key="month"
              data-month={m}
              disabled={isDisabled}
              aria-disabled={isDisabled ? true : undefined}
              onClick={(event) => {
                event.stopPropagation();
                if (readOnly) return;
                setFocusedDate(null);
                setMonth(new Date(year, m, Math.min(month.getDate(), daysInMonth(year, m))));
                setView('day');
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, (el) => Number(el.getAttribute('data-month')))}
            >
              {shortNames[m]}
            </button>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------------- Años
  if (view === 'year') {
    const years = getYearRange(filter);
    const selectedYear = selected ? selected.getFullYear() : year;
    const roving = focusedOption !== null && years.includes(focusedOption)
      ? focusedOption
      : years.includes(selectedYear) ? selectedYear : years[0];
    return (
      <div
        role="radiogroup"
        aria-label={t('chooseYear', null, 'Choose year')}
        {...rest}
        ref={handleRef}
        className={rootClass('mtx-date-picker__years')}
      >
        {years.map((y) => {
          const isSelected = y === selectedYear;
          return (
            <button
              key={y}
              type="button"
              className={cx('mtx-date-picker__year', isSelected && 'mtx-date-picker__year--selected')}
              role="radio"
              aria-checked={isSelected}
              tabIndex={y === roving ? 0 : -1}
              data-focus-key="year"
              disabled={disabled || undefined}
              onClick={(event) => {
                event.stopPropagation();
                if (readOnly) return;
                setFocusedDate(null);
                setMonth(new Date(y, monthIndex, Math.min(month.getDate(), daysInMonth(y, monthIndex))));
                setView('day');
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, (el) => Number(el.textContent))}
            >
              {y}
            </button>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------------- Días
  const monthNames = getMonthNames(locale, 'long');
  const monthName = monthNames[monthIndex];
  const yearText = String(year);
  const narrow = getWeekdayNames(locale, 'narrow');
  const longDays = getWeekdayNames(locale, 'long');
  const today = new Date();
  const focusDate = getRovingDay(year, monthIndex, { focused: focusedDate, selected }, filter);
  const previewActive = range && Boolean(rangeValue.start) && !rangeValue.end;

  const navButton = (dir: -1 | 1): ReactElement => {
    const key = dir < 0 ? 'previousMonth' : 'nextMonth';
    return (
      <button
        type="button"
        className="mtx-date-picker__nav-btn"
        data-focus-key={key}
        aria-label={t(key, null, dir < 0 ? 'Previous month' : 'Next month')}
        disabled={disabled || undefined}
        onClick={(event) => {
          event.stopPropagation();
          setFocusedDate(null);
          setMonth(new Date(year, monthIndex + dir, 1));
        }}
      >
        <span className="material-icons" aria-hidden="true">
          {dir < 0 ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    );
  };

  return (
    <div {...rest} ref={handleRef} className={rootClass('mtx-date-picker')}>
      <div className="mtx-date-picker__nav">
        <div className="mtx-date-picker__title-group" id={titleId} aria-live="polite">
          <button
            type="button"
            className="mtx-date-picker__title mtx-date-picker__title--month"
            data-focus-key="month-title"
            aria-label={t('monthViewLabel', { month: monthName }, `${monthName}, choose month`)}
            disabled={disabled || undefined}
            onClick={(event) => {
              event.stopPropagation();
              setView('month');
            }}
          >
            <span className="mtx-date-picker__title-text">{monthName}</span>
            <span className="material-icons" aria-hidden="true">arrow_drop_down</span>
          </button>
          <button
            type="button"
            className="mtx-date-picker__title mtx-date-picker__title--year"
            data-focus-key="year-title"
            aria-label={t('yearViewLabel', { year: yearText }, `${yearText}, choose year`)}
            disabled={disabled || undefined}
            onClick={(event) => {
              event.stopPropagation();
              setView('year');
            }}
          >
            <span className="mtx-date-picker__title-text">{yearText}</span>
            <span className="material-icons" aria-hidden="true">arrow_drop_down</span>
          </button>
        </div>
        <div className="mtx-date-picker__nav-group">
          {navButton(-1)}
          {navButton(1)}
        </div>
      </div>
      <div className="mtx-date-picker__grid" role="grid" aria-labelledby={titleId}>
        <div className="mtx-date-picker__weekdays" role="row">
          {narrow.map((name, i) => (
            <div key={i} className="mtx-date-picker__weekday" role="columnheader" aria-label={longDays[i]} title={longDays[i]}>
              {name}
            </div>
          ))}
        </div>
        <div
          className="mtx-date-picker__days"
          role="rowgroup"
          onMouseLeave={range ? () => { if (previewActive) setHoverDate(null); } : undefined}
        >
          {getMonthGrid(year, monthIndex).map((week) => (
            <div key={week[0].key} className="mtx-date-picker__week" role="row">
              {week.map(({ date, key, outside }) => {
                const isDisabled = isDayDisabled(date, filter);
                const isToday = isSameDay(date, today);
                let cellClass = '';
                let dayClass = '';
                let isSelected = false;
                if (outside) {
                  dayClass = 'mtx-date-picker__day--outside';
                } else if (range) {
                  const state = getDayRangeState(date, {
                    start: rangeValue.start,
                    end: rangeValue.end,
                    hover: previewActive ? hoverDate : null,
                  });
                  cellClass = cx(
                    state.isStart && 'mtx-date-picker__day-cell--range-start',
                    state.isEnd && 'mtx-date-picker__day-cell--range-end',
                    state.inRange && 'mtx-date-picker__day-cell--in-range',
                    state.inPreview && 'mtx-date-picker__day-cell--range-preview',
                  );
                  dayClass = cx(
                    (state.isStart || state.isEnd) && 'mtx-date-picker__day--selected',
                    state.isStart && 'mtx-date-picker__day--range-start',
                    state.isEnd && 'mtx-date-picker__day--range-end',
                    state.inRange && 'mtx-date-picker__day--in-range',
                    state.inPreview && 'mtx-date-picker__day--range-preview',
                  );
                  isSelected = state.isStart || state.isEnd || state.inRange;
                } else if (isSameDay(date, value)) {
                  dayClass = 'mtx-date-picker__day--selected';
                  isSelected = true;
                }
                return (
                  <div key={key} className={cx('mtx-date-picker__day-cell', cellClass)} role="presentation">
                    <button
                      type="button"
                      className={cx(
                        'mtx-date-picker__day',
                        isToday && 'mtx-date-picker__day--today',
                        dayClass,
                        isDisabled && 'mtx-date-picker__day--disabled',
                      )}
                      role="gridcell"
                      data-date={key}
                      data-focus-key={outside ? 'grid-outside' : 'grid'}
                      aria-label={formatDayLabel(date, locale)}
                      aria-current={isToday ? 'date' : undefined}
                      aria-selected={isSelected}
                      aria-disabled={isDisabled ? true : undefined}
                      tabIndex={!outside && isSameDay(date, focusDate) ? 0 : -1}
                      disabled={isDisabled || disabled}
                      onMouseEnter={
                        range && !outside && !isDisabled
                          ? () => { if (previewActive) setHoverDate(date); }
                          : undefined
                      }
                      onClick={() => {
                        setFocusedDate(new Date(date));
                        if (outside) setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                        selectDay(date);
                      }}
                      onKeyDown={(event) => handleDayKeyDown(event, date)}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
