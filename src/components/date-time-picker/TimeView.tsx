'use client';
import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import '@rubenchodev/materix-ui/components/date-time-picker.css';
import { cx, useControlled, useEventCallback, useForkRef } from '../../core';
import { useT } from '../../i18n';
import { setMeridiem } from '../../utils/dates';
import type { Meridiem } from '../../utils/dates';
import { CLOCK_SWITCH_DELAY, TimeClock } from './time-clock';
import { displayValue, getTimeKeyValue, getTimeParts, isTimeValueDisabled, setTimeUnit } from './time-utils';
import type { TimeConstraints, TimeViewName } from './time-utils';

export type { TimeViewName } from './time-utils';

/** Metadatos de un cambio de {@link TimeView}. */
export interface TimeViewChangeMeta {
  /** Unidad que cambió. */
  view: TimeViewName;
  /** `true` al completar la unidad: soltar el gesto o Enter/Espacio en el reloj; Enter en la última tarjeta (`digital`). */
  done: boolean;
}

/** Props de {@link TimeView}. */
export interface TimeViewProps {
  /** Hora seleccionada (`null` usa `referenceDate` o la hora actual). */
  value: Date | null;
  /** Cambio de hora; `meta.done` indica que se completó la unidad `meta.view`. */
  onChange: (date: Date, meta: TimeViewChangeMeta) => void;
  /** Vista activa (modo controlado). */
  view?: TimeViewName;
  /** Cambio de vista solicitado por la tarjeta, el teclado o el fin del gesto. */
  onViewChange?: (view: TimeViewName) => void;
  /** Vistas disponibles, en orden (por defecto `['hours', 'minutes']`). */
  views?: TimeViewName[];
  /** Formato de 12 horas con selector AM/PM. */
  ampm?: boolean;
  /** Paso de los minutos (por defecto `1`). */
  minutesStep?: number;
  /** Hora mínima (solo cuenta la hora del día). */
  minTime?: Date;
  /** Hora máxima (solo cuenta la hora del día). */
  maxTime?: Date;
  /** Fecha base cuando `value` es `null`. */
  referenceDate?: Date;
  /** Deshabilita la vista. */
  disabled?: boolean;
  /** Muestra la hora sin permitir cambios. */
  readOnly?: boolean;
  /** Idioma de los textos (prevalece sobre el contexto). */
  locale?: string;
  /** Enfoca el reloj (o la primera tarjeta en `digital`) al montar. */
  autoFocus?: boolean;
  /** `clock`: reloj radial ("Select time"); `digital`: tarjetas editables ("Enter time"). */
  variant?: 'clock' | 'digital';
  /** Clase adicional de la raíz `.mtx-time-picker`. */
  className?: string;
}

const DEFAULT_VIEWS: TimeViewName[] = ['hours', 'minutes'];
const ORDER: TimeViewName[] = ['hours', 'minutes', 'seconds'];

/**
 * Selector de hora MD2: tarjetas HH:MM, AM/PM y reloj radial o entrada por teclado.
 */
export const TimeView = forwardRef<HTMLDivElement, TimeViewProps>(function TimeView(props, ref) {
  const {
    value,
    onChange,
    view: viewProp,
    onViewChange,
    views: viewsProp = DEFAULT_VIEWS,
    ampm = false,
    minutesStep = 1,
    minTime,
    maxTime,
    referenceDate,
    disabled = false,
    readOnly = false,
    locale,
    autoFocus = false,
    variant = 'clock',
    className,
  } = props;

  const t = useT('dateTimePicker', locale);
  const views = ORDER.filter((name) => viewsProp.includes(name));
  if (!views.length) views.push('hours');
  const [fallbackDate] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  });
  const base = value ?? referenceDate ?? fallbackDate;
  const parts = getTimeParts(base);
  const constraints: TimeConstraints = { minTime, maxTime, minutesStep: Math.max(1, Math.floor(minutesStep) || 1) };

  const [viewState, setViewState] = useControlled<TimeViewName>({
    controlled: viewProp,
    default: views[0],
    name: 'TimeView',
    state: 'view',
  });
  const view = views.includes(viewState) ? viewState : views[0];
  const isDigital = variant === 'digital';

  const rootRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useForkRef(ref, rootRef);
  const clockRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<Partial<Record<TimeViewName, HTMLInputElement | null>>>({});
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Última fecha emitida: el gesto sigue aunque el padre aún no haya re-renderizado.
  const latest = useRef(base);
  latest.current = base;
  const [drafts, setDrafts] = useState<Partial<Record<TimeViewName, string>>>({});

  const clearSwitch = () => {
    if (switchTimer.current !== null) clearTimeout(switchTimer.current);
    switchTimer.current = null;
  };
  useEffect(() => clearSwitch, []);

  const changeView = useEventCallback((next: TimeViewName) => {
    clearSwitch();
    if (next === view) return;
    setViewState(next);
    onViewChange?.(next);
  });

  const nextView = (unit: TimeViewName): TimeViewName | undefined => views[views.indexOf(unit) + 1];

  const emit = useEventCallback((unit: TimeViewName, amount: number) => {
    const date = setTimeUnit(latest.current, unit, amount);
    latest.current = date;
    onChange(date, { view: unit, done: false });
  });

  /** Completa la unidad (`done: true`) y pasa a la siguiente vista, con retardo tras el gesto. */
  const finishUnit = useEventCallback((unit: TimeViewName, delayed: boolean) => {
    onChange(new Date(latest.current.getTime()), { view: unit, done: true });
    const next = nextView(unit);
    if (!next) return;
    if (!delayed) {
      changeView(next);
      return;
    }
    clearSwitch();
    switchTimer.current = setTimeout(() => {
      switchTimer.current = null;
      changeView(next);
    }, CLOCK_SWITCH_DELAY);
  });

  const handleMeridiem = (meridiem: Meridiem) => {
    if (disabled || readOnly || meridiem === parts.meridiem) return;
    emit('hours', setMeridiem(parts.hour24, meridiem));
  };

  const handleClockKeyDown = useEventCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      finishUnit(view, false);
      return;
    }
    if (readOnly) return;
    const next = getTimeKeyValue(view, parts, event.key, ampm, constraints);
    if (next === null) {
      if (getTimeKeyValue(view, parts, event.key, ampm, { minutesStep: 1 }) !== null) event.preventDefault();
      return;
    }
    event.preventDefault();
    if (next !== (view === 'hours' ? parts.hour24 : view === 'minutes' ? parts.minute : parts.second)) emit(view, next);
  });

  useEffect(() => {
    if (!autoFocus) return;
    if (isDigital) {
      const input = inputRefs.current[views[0]];
      input?.focus();
      input?.select();
    } else clockRef.current?.focus();
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Etiqueta de cada unidad (`Hour`, `Minute`, `Second`). */
  const unitLabel = (unit: TimeViewName) =>
    unit === 'hours' ? t('hour', null, 'Hour') : unit === 'minutes' ? t('minute', null, 'Minute') : t('second', null, 'Second');
  const shownText = (unit: TimeViewName) => String(displayValue(unit, parts, ampm)).padStart(2, '0');
  const unitMax = (unit: TimeViewName) => (unit === 'hours' ? (ampm ? 12 : 23) : 59);

  /** Entrada de teclado de una tarjeta (`digital`): filtra, limita y avanza como vanilla. */
  const handleInput = (unit: TimeViewName, event: ChangeEvent<HTMLInputElement>) => {
    const clean = event.target.value.replace(/\D/g, '').slice(0, 2);
    let text = clean;
    if (clean.length > 0) {
      let amount = parseInt(clean, 10);
      if (amount > unitMax(unit)) {
        amount = unitMax(unit);
        text = String(amount);
      }
      const real = unit === 'hours' && ampm ? setMeridiem(amount % 12, parts.meridiem) : amount;
      if (!readOnly && !isTimeValueDisabled(unit, real, parts, constraints)) emit(unit, real);
      const advance = unit === 'hours' ? clean.length === 2 || (ampm && amount > 1) : clean.length === 2;
      const next = nextView(unit);
      if (advance && next && unit !== 'minutes') {
        const target = inputRefs.current[next];
        target?.focus();
        target?.select();
      }
    }
    setDrafts((prev) => ({ ...prev, [unit]: text }));
  };

  const handleInputKeyDown = (unit: TimeViewName, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const next = nextView(unit);
      if (next) {
        const target = inputRefs.current[next];
        target?.focus();
        target?.select();
      } else finishUnit(unit, false);
      return;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (readOnly || disabled) return;
    const next = getTimeKeyValue(unit, parts, event.key, ampm, constraints);
    if (next === null) return;
    setDrafts((prev) => ({ ...prev, [unit]: undefined }));
    emit(unit, next);
    requestAnimationFrame(() => inputRefs.current[unit]?.select());
  };

  const renderCard = (unit: TimeViewName) => {
    const active = unit === view;
    if (isDigital) {
      return (
        <div className="mtx-time-picker__card-wrapper" key={unit}>
          <input
            ref={(node) => {
              inputRefs.current[unit] = node;
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            className={cx('mtx-time-picker__digit-card', 'mtx-time-picker__digit-card--input', active && 'mtx-time-picker__digit-card--active')}
            value={drafts[unit] ?? shownText(unit)}
            aria-label={unitLabel(unit)}
            data-focus-key={`${unit === 'hours' ? 'hour' : unit === 'minutes' ? 'minute' : 'second'}-card`}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={(event: FocusEvent<HTMLInputElement>) => {
              changeView(unit);
              event.target.select();
            }}
            onBlur={() => setDrafts((prev) => ({ ...prev, [unit]: undefined }))}
            onChange={(event) => handleInput(unit, event)}
            onKeyDown={(event) => handleInputKeyDown(unit, event)}
          />
          <span className="mtx-time-picker__card-label">{unitLabel(unit)}</span>
        </div>
      );
    }
    const text = shownText(unit);
    return (
      <div className="mtx-time-picker__card-wrapper" key={unit}>
        <button
          type="button"
          className={cx('mtx-time-picker__digit-card', active && 'mtx-time-picker__digit-card--active')}
          aria-label={`${unitLabel(unit)} ${text}`}
          aria-pressed={active}
          data-focus-key={`${unit === 'hours' ? 'hour' : unit === 'minutes' ? 'minute' : 'second'}-card`}
          disabled={disabled}
          onClick={() => changeView(unit)}
        >
          {text}
        </button>
      </div>
    );
  };

  const hours12 = displayValue('hours', parts, true);
  const valueText =
    view === 'hours'
      ? t('hoursValue', { value: ampm ? `${hours12} ${parts.meridiem}` : parts.hour24 }, `${ampm ? hours12 : parts.hour24} hours`)
      : view === 'minutes'
        ? t('minutesValue', { value: parts.minute }, `${parts.minute} minutes`)
        : t('secondsValue', { value: parts.second }, `${parts.second} seconds`);
  const clockLabel =
    view === 'hours'
      ? t('selectHours', null, 'Select hours')
      : view === 'minutes'
        ? t('selectMinutes', null, 'Select minutes')
        : t('selectSeconds', null, 'Select seconds');

  return (
    <div ref={handleRef} className={cx('mtx-time-picker', className)}>
      <div className="mtx-time-picker__header-box">
        <span className="mtx-time-picker__title">{isDigital ? t('enterTime', null, 'Enter time') : t('selectTime', null, 'Select time')}</span>
        <div className="mtx-time-picker__cards-row">
          {views.map((unit, index) => (
            <Fragment key={unit}>
              {index > 0 && <span className="mtx-time-picker__colon">:</span>}
              {renderCard(unit)}
            </Fragment>
          ))}
          {ampm && (
            <div className="mtx-time-picker__ampm-stack">
              {(['AM', 'PM'] as const).map((meridiem) => (
                <button
                  key={meridiem}
                  type="button"
                  className={cx('mtx-time-picker__ampm-opt', parts.meridiem === meridiem && 'mtx-time-picker__ampm-opt--active')}
                  aria-pressed={parts.meridiem === meridiem}
                  data-focus-key={`ampm-${meridiem.toLowerCase()}`}
                  disabled={disabled}
                  onClick={() => handleMeridiem(meridiem)}
                >
                  {meridiem}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {!isDigital && (
        <TimeClock
          ref={clockRef}
          unit={view}
          parts={parts}
          ampm={ampm}
          constraints={constraints}
          disabled={disabled}
          readOnly={readOnly}
          label={clockLabel}
          valueText={valueText}
          onSelect={(unit, amount) => emit(unit, amount)}
          onCommit={(unit) => finishUnit(unit, true)}
          onKeyDown={handleClockKeyDown}
        />
      )}
    </div>
  );
});
