'use client';
/**
 * DateTimePicker de Materix UI: componente unificado para DatePicker, TimePicker, DateTimePicker y
 * sus versiones de rango. Campo TextField con máscara y botón de apertura; calendario (DateCalendar)
 * y reloj MD2 (TimeView) en popover, diálogo modal o modo estático (patrón WAI-ARIA Date Picker Dialog).
 */
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type {
  ClipboardEvent as ReactClipboardEvent,
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/button.css';
import '@rubenchodev/materix-ui/components/date-time-picker.css';
import {
  Portal,
  cx,
  onClickAway,
  trapTab,
  useControlled,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
} from '../../core';
import { useIntlLocale, useT } from '../../i18n';
import { formatDate, formatToMask, getDefaultFormat, isAmPmFormat, parseDate } from '../../utils/dates';
import type { PickerMode } from '../../utils/dates';
import { TextField } from '../text-field';
import type { TextFieldProps } from '../text-field';
import { DateCalendar, focusCalendarView } from './DateCalendar';
import { PickerActions, PickerHeader, PickerTabs } from './PickerParts';
import type { PickerAction, PickerTab } from './PickerParts';
import { TimeView } from './TimeView';
import type { TimeViewChangeMeta, TimeViewName } from './TimeView';
import { timeKey, timeText, toRange } from './picker-utils';
import type { CalendarView, DateRange, PickerDateInput, PickerRangeInput } from './picker-utils';

export type { PickerMode };

/** Presentación del picker. */
export type PickerDisplay = 'popover' | 'modal';
/** Vista inicial de la hora: tarjetas editables (`input`) o reloj radial (`dial`). */
export type PickerTimeView = 'input' | 'keyboard' | 'dial' | 'clock';
/** Valor emitido: fecha simple o rango. */
export type DateTimePickerValue = Date | null | DateRange;
/** Motivo del cierre. */
export type DateTimePickerCloseReason = 'accept' | 'cancel' | 'select' | 'escapeKeyDown' | 'clickaway' | 'backdropClick' | 'tabOut' | 'toggle' | 'api';

/** Datos de un cambio (equivale al `detail` de `mtx:date-time-picker:change`). */
export interface DateTimePickerChangeDetail {
  isRange: boolean;
  date: Date | null;
  dateTime: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  range: DateRange;
  /** `HH:mm` (`hh:mm AM` en 12 h); en rangos `inicio - fin`. */
  time: string | null;
  /** Texto formateado del campo. */
  value: string;
  iso: string | null;
}

/** Acciones imperativas (equivalen a `open()`, `close()`, `toggle()` y `clear()` de vanilla). */
export interface DateTimePickerActions {
  open: (options?: { focus?: boolean }) => void;
  close: (focusInput?: boolean) => void;
  toggle: () => void;
  clear: () => void;
}

/** Props de TextField que no aplican al picker. */
type OmittedFieldProps =
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'select'
  | 'multiline'
  | 'rows'
  | 'minRows'
  | 'maxRows'
  | 'autoResize'
  | 'children'
  | 'endAction'
  | 'endActionLabel'
  | 'endAdornment'
  | 'onAdornmentClick'
  | 'passwordToggle'
  | 'passwordToggleLabel'
  | 'passwordVisible'
  | 'defaultPasswordVisible'
  | 'onPasswordVisibilityChange'
  | 'currencyOptions'
  | 'counter'
  | 'maxChars'
  | 'maxWords'
  | 'locale'
  | 'type';

/** Propiedades de {@link DateTimePicker}. El resto de props de TextField van al campo. */
export interface DateTimePickerProps extends Omit<TextFieldProps, OmittedFieldProps> {
  /** Modo: fecha, hora o fecha y hora (`data-picker`). */
  mode?: PickerMode;
  /** Selección de rango (`data-range`). */
  range?: boolean;
  /** Valor (controlado): `Date`, timestamp, ISO o texto en el formato activo; en rango `{ start, end }`. */
  value?: PickerDateInput | PickerRangeInput;
  /** Valor inicial (no controlado; `data-value`/`data-default-value`). */
  defaultValue?: PickerDateInput | PickerRangeInput;
  /** Cambio aplicado (`mtx:date-time-picker:change`). */
  onChange?: (value: DateTimePickerValue, detail: DateTimePickerChangeDetail) => void;
  /** Selección confirmada: Aceptar o una elección que cierra el picker. */
  onAccept?: (value: DateTimePickerValue, detail: DateTimePickerChangeDetail) => void;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Apertura (`mtx:date-time-picker:open`). */
  onOpen?: () => void;
  /** Cierre (`mtx:date-time-picker:close`). */
  onClose?: (reason: DateTimePickerCloseReason) => void;
  /** Formato de visualización y escritura (`data-format`); por defecto según modo y locale. */
  format?: string;
  /** Locale con región para textos, `Intl` y orden de fecha (`data-locale`). */
  locale?: string;
  /** Formato de 12 horas (`data-ampm`); por defecto, según el formato. */
  ampm?: boolean;
  /** Vista inicial del calendario. */
  openTo?: CalendarView;
  /** Vistas de la hora (`hours`, `minutes`, `seconds`). */
  views?: TimeViewName[];
  /** Fecha mínima (`data-min`; admite `today`). */
  minDate?: PickerDateInput;
  /** Fecha máxima (`data-max`). */
  maxDate?: PickerDateInput;
  /** Deshabilita días concretos. */
  shouldDisableDate?: (date: Date) => boolean;
  /** Hora mínima del reloj. */
  minTime?: Date;
  /** Hora máxima del reloj. */
  maxTime?: Date;
  /** Paso de los minutos. */
  minutesStep?: number;
  /** Popover (por defecto) o diálogo modal (`data-display`). */
  display?: PickerDisplay;
  /** Picker incrustado sin campo (`data-static`). */
  displayStatic?: boolean;
  /** Vista inicial de la hora (`data-time-view`): `input` (por defecto) o `dial`. */
  timeView?: PickerTimeView;
  /** Separador del rango (`data-range-separator`, `" - "`). */
  rangeSeparator?: string;
  /** Botones de la barra (por defecto `today`, `cancel`, `accept`; estático solo `today`). */
  actions?: PickerAction[];
  /** Texto del botón Hoy (`data-today-text`). */
  todayText?: ReactNode;
  /** Texto del botón Borrar. */
  clearText?: ReactNode;
  /** Texto del botón Cancelar (`data-cancel-text`). */
  cancelText?: ReactNode;
  /** Texto del botón Aceptar (`data-ok-text`). */
  okText?: ReactNode;
  /** Icono del botón de apertura (`data-end-icon`); por defecto según el modo. */
  endIcon?: string;
  /** Máscara del campo (`data-mask`); por defecto derivada del formato. */
  mask?: string;
  /** Acciones imperativas. */
  action?: Ref<DateTimePickerActions>;
}

/** Selección interna normalizada. */
interface Selection {
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

/** Hora y minuto. */
interface HM {
  hour: number;
  minute: number;
  second: number;
}

/** Borrador de trabajo mientras el picker está abierto (o en modo estático). */
interface Draft extends Selection {
  time: HM;
  startTime: HM;
  endTime: HM;
}

const EMPTY: Selection = { date: null, start: null, end: null };
const DEFAULT_ICONS: Record<PickerMode, string> = { date: 'event', time: 'schedule', datetime: 'calendar_month' };
/** Retardo antes de desmontar el contenido tras cerrar (transiciones CSS). */
const EXIT_DELAY = 200;

/** Picker abierto en la página (solo uno a la vez, como vanilla). */
let activePicker: { owner: object; close: () => void } | null = null;

/**
 * Pone o quita el atributo `inert` (compatible con React 18 y 19).
 * @param {HTMLElement|null} el Elemento.
 * @param {boolean} on Activar.
 */
function setInert(el: HTMLElement | null, on: boolean): void {
  if (!el) return;
  if (on) el.setAttribute('inert', '');
  else el.removeAttribute('inert');
}

/**
 * Hora de una fecha (o el valor por defecto).
 * @param {Date|null} date Fecha.
 * @param {number} hour Hora por defecto.
 * @returns {HM} Hora.
 */
function hmOf(date: Date | null, hour: number): HM {
  return date ? { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() } : { hour, minute: 0, second: 0 };
}

/**
 * Copia de una fecha con la hora indicada.
 * @param {Date} date Fecha.
 * @param {HM} hm Hora.
 * @returns {Date} Nueva fecha.
 */
function withTime(date: Date, hm: HM): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hm.hour, hm.minute, hm.second);
}

/**
 * Borrador a partir de una selección.
 * @param {Selection} sel Selección.
 * @returns {Draft} Borrador.
 */
function toDraft(sel: Selection): Draft {
  return { ...sel, time: hmOf(sel.date, 12), startTime: hmOf(sel.start, 9), endTime: hmOf(sel.end, 18) };
}

/**
 * Selector de fecha y/u hora con calendario, reloj, rangos, popover, modal o modo estático.
 */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(function DateTimePicker(props, ref) {
  const {
    mode = 'datetime',
    range = false,
    value: valueProp,
    defaultValue,
    onChange,
    onAccept,
    open: openProp,
    defaultOpen = false,
    onOpen,
    onClose,
    format: formatProp,
    locale: localeProp,
    ampm: ampmProp,
    openTo = 'day',
    views,
    minDate: minProp,
    maxDate: maxProp,
    shouldDisableDate,
    minTime,
    maxTime,
    minutesStep,
    display = 'popover',
    displayStatic = false,
    timeView = 'input',
    rangeSeparator = ' - ',
    actions: actionsProp,
    todayText,
    clearText,
    cancelText,
    okText,
    endIcon,
    mask: maskProp,
    action,
    disabled = false,
    readOnly = false,
    inputProps,
    inputRef: inputRefProp,
    className,
    style,
    id: idProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...fieldProps
  } = props;

  const contextLocale = useIntlLocale();
  const locale = localeProp || contextLocale;
  const t = useT('dateTimePicker', localeProp);
  const ampm = ampmProp ?? isAmPmFormat(formatProp);
  const format = formatProp || getDefaultFormat(mode, ampm, locale);
  const parseOptions = useMemo(() => ({ format, locale }), [format, locale]);
  const minDate = useMemo(() => parseDate(minProp, parseOptions), [minProp, parseOptions]);
  const maxDate = useMemo(() => parseDate(maxProp, parseOptions), [maxProp, parseOptions]);
  const dialogId = `mtx-picker-dialog-${useId().replace(/:/g, '')}`;
  const owner = useRef({}).current;

  // ------------------------------------------------------------- Valor
  /** Normaliza una entrada de valor a selección. */
  const normalize = (input: PickerDateInput | PickerRangeInput): Selection => {
    if (range) {
      const r = toRange(input as PickerRangeInput, rangeSeparator, parseOptions);
      return { date: r.start || r.end, start: r.start, end: r.end };
    }
    if (input !== null && typeof input === 'object' && !(input instanceof Date)) return EMPTY;
    return { ...EMPTY, date: parseDate(input as PickerDateInput, parseOptions) };
  };
  const formatSel = (sel: Selection): string => {
    if (range) {
      const s = sel.start ? formatDate(sel.start, format) : '';
      const e = sel.end ? formatDate(sel.end, format) : '';
      return s && e ? `${s}${rangeSeparator}${e}` : s;
    }
    return sel.date ? formatDate(sel.date, format) : '';
  };
  const selKey = (sel: Selection) => (range ? `${timeKey(sel.start)}|${timeKey(sel.end)}` : timeKey(sel.date));

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState<Selection>(() => normalize(defaultValue));
  const committed = isControlled ? normalize(valueProp) : uncontrolled;
  const committedKey = selKey(committed);

  const [draft, setDraft] = useState<Draft>(() => toDraft(committed));
  const [inputText, setInputText] = useState<string>(() => {
    const initial = isControlled ? valueProp : defaultValue;
    return formatSel(committed) || (typeof initial === 'string' ? initial : '');
  });
  const lastKey = useRef(committedKey);
  /** Clave emitida en modo controlado pendiente de que el padre la acepte. */
  const pendingKey = useRef<string | null>(null);

  // Valor controlado cambiado desde fuera: se resincronizan borrador y texto.
  useEnhancedEffect(() => {
    if (committedKey === lastKey.current) return;
    lastKey.current = committedKey;
    setDraft(toDraft(committed));
    setInputText(formatSel(committed));
  }, [committedKey]);

  // Controlado: si el padre ignora `onChange`, se vuelve a mostrar `value` (como MUI).
  useEnhancedEffect(() => {
    const pending = pendingKey.current;
    if (pending === null) return;
    pendingKey.current = null;
    if (pending !== committedKey) {
      setDraft(toDraft(committed));
      setInputText(formatSel(committed));
    }
  });

  // Formato o locale cambiados: se reformatea el texto.
  const formatKey = `${format}|${rangeSeparator}`;
  const lastFormat = useRef(formatKey);
  useEffect(() => {
    if (lastFormat.current === formatKey) return;
    lastFormat.current = formatKey;
    const text = formatSel(committed);
    if (text) setInputText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatKey]);

  /** Construye el detalle de un cambio. */
  const buildDetail = (sel: Selection, d: Draft | null, text: string): DateTimePickerChangeDetail => {
    let time: string | null = null;
    if (d) {
      time = range
        ? `${timeText(d.startTime.hour, d.startTime.minute, ampm)} - ${timeText(d.endTime.hour, d.endTime.minute, ampm)}`
        : timeText(d.time.hour, d.time.minute, ampm);
    }
    const copy = (x: Date | null) => (x ? new Date(x) : null);
    return {
      isRange: range,
      date: copy(sel.date),
      dateTime: copy(sel.date),
      startDate: copy(sel.start),
      endDate: copy(sel.end),
      range: { start: copy(sel.start), end: copy(sel.end) },
      time,
      value: text,
      iso: sel.date ? sel.date.toISOString() : null,
    };
  };
  const toValue = (sel: Selection): DateTimePickerValue =>
    range ? { start: sel.start ? new Date(sel.start) : null, end: sel.end ? new Date(sel.end) : null } : sel.date ? new Date(sel.date) : null;

  /**
   * Aplica una selección (`_applySelection` de vanilla): fija horas, actualiza el campo y emite `onChange`.
   * @returns {[DateTimePickerValue, DateTimePickerChangeDetail]} Valor y detalle emitidos.
   */
  const commit = useEventCallback((next: Draft, options: { keepText?: boolean } = {}) => {
    const d: Draft = { ...next };
    if (range) {
      if (mode === 'datetime') {
        if (d.start) d.start = withTime(d.start, { ...d.startTime, second: 0 });
        if (d.end) d.end = withTime(d.end, { ...d.endTime, second: 0 });
      }
      // Como vanilla: con el rango completo la fecha de referencia es el fin.
      d.date = d.end || d.start;
    } else if (!d.date) {
      d.date = withTime(new Date(), d.time);
    }
    const sel: Selection = { date: d.date, start: d.start, end: d.end };
    const text = formatSel(sel);
    if (isControlled) pendingKey.current = selKey(sel);
    else {
      lastKey.current = selKey(sel);
      setUncontrolled(sel);
    }
    setDraft(d);
    if (!options.keepText) setInputText(text);
    const result: [DateTimePickerValue, DateTimePickerChangeDetail] = [toValue(sel), buildDetail(sel, d, text)];
    onChange?.(...result);
    return result;
  });

  /** Limpia la selección (`clear()`). */
  const clear = useEventCallback(() => {
    const d = { ...draft, ...EMPTY };
    if (isControlled) pendingKey.current = selKey(EMPTY);
    else {
      lastKey.current = selKey(EMPTY);
      setUncontrolled(EMPTY);
    }
    setDraft(d);
    setInputText('');
    const result: [DateTimePickerValue, DateTimePickerChangeDetail] = [
      range ? { start: null, end: null } : null,
      buildDetail(EMPTY, null, ''),
    ];
    onChange?.(...result);
    return result;
  });

  // ------------------------------------------------------------- Apertura
  const [open, setOpenState] = useControlled<boolean>({
    controlled: displayStatic ? undefined : openProp,
    default: defaultOpen && !displayStatic,
    name: 'DateTimePicker',
    state: 'open',
  });
  const isOpen = open && !displayStatic;
  const [activeTab, setActiveTab] = useState<PickerTab>(mode === 'time' ? 'time' : 'date');
  const [calendarView, setCalendarView] = useState<CalendarView>(openTo);
  const [month, setMonth] = useState<Date>(() => new Date(committed.date ?? new Date()));
  const [timeUnit, setTimeUnit] = useState<TimeViewName>('hours');
  const dialMode = (v: PickerTimeView) => v === 'dial' || v === 'clock';
  const [timeInputDial, setTimeInputDial] = useState(dialMode(timeView));
  const [contentMounted, setContentMounted] = useState(isOpen || displayStatic);
  const [isMobile, setIsMobile] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [focusRequest, setFocusRequest] = useState(0);

  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const handleRootRef = useForkRef<HTMLDivElement>(ref, rootRef, setRootEl);
  const inputElRef = useRef<HTMLInputElement | null>(null);
  const handleInputRef = useForkRef<HTMLInputElement>(inputElRef, inputRefProp as Ref<HTMLInputElement>);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleStaticRef = useForkRef<HTMLDivElement>(handleRootRef, containerRef);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  /** Modal cerrado y sin contenido: fuera del árbol de accesibilidad (`inert`). */
  const modalHiddenRef = useRef(true);
  const handleBackdropRef = useCallback((el: HTMLDivElement | null) => {
    backdropRef.current = el;
    setInert(el, modalHiddenRef.current);
  }, []);
  const mobileBackdropRef = useRef<HTMLDivElement | null>(null);
  const returnFocusEl = useRef<HTMLElement | null>(null);
  const focusOnOpen = useRef(true);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locked = disabled || readOnly;
  const isModal = display === 'modal' || (!displayStatic && isMobile);

  /** Enfoca el control principal de la vista activa (`_focusActiveView`). */
  const focusActiveView = useEventCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const content = container.querySelector('.mtx-picker-content');
    if (activeTab === 'date') {
      focusCalendarView(content, calendarView);
      if (content?.contains(document.activeElement)) return;
    } else {
      const el = container.querySelector<HTMLElement>('.mtx-time-picker__clock, .mtx-time-picker__digit-card--input');
      if (el) {
        el.focus();
        return;
      }
    }
    const fallback = Array.from(
      container.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex]'),
    ).find((node) => node.getAttribute('tabindex') !== '-1');
    fallback?.focus();
  });
  const requestFocus = () => setFocusRequest((n) => n + 1);
  useEffect(() => {
    if (focusRequest) focusActiveView();
  }, [focusRequest, focusActiveView]);

  const clearSwitchTimer = () => {
    if (switchTimer.current) clearTimeout(switchTimer.current);
    switchTimer.current = null;
  };

  /** Cierra devolviendo el foco opcionalmente (`close(focusInput)`). */
  const requestClose = useEventCallback((focusInput: boolean, reason: DateTimePickerCloseReason) => {
    if (!isOpen) return;
    clearSwitchTimer();
    setOpenState(false);
    onClose?.(reason);
    if (focusInput) {
      const target = returnFocusEl.current && returnFocusEl.current.isConnected && !(returnFocusEl.current as HTMLButtonElement).disabled
        ? returnFocusEl.current
        : inputElRef.current;
      try {
        target?.focus({ preventScroll: true });
      } catch {
        target?.focus();
      }
    }
    returnFocusEl.current = null;
  });

  /** Abre el picker (`open({ focus })`). */
  const requestOpen = useEventCallback((options: { focus?: boolean } = {}) => {
    if (isOpen || displayStatic || locked) return;
    focusOnOpen.current = options.focus !== false;
    setOpenState(true);
    onOpen?.();
  });

  // Al abrir: cierra otro picker, reinicia vistas y borrador, posiciona y enfoca.
  const wasOpen = useRef(false);
  useEnhancedEffect(() => {
    if (isOpen && !wasOpen.current) {
      wasOpen.current = true;
      if (activePicker && activePicker.owner !== owner) activePicker.close();
      activePicker = { owner, close: () => requestClose(false, 'api') };
      const active = document.activeElement as HTMLElement | null;
      returnFocusEl.current = active && active !== document.body && rootRef.current?.contains(active) ? active : null;
      setActiveTab(mode === 'time' ? 'time' : 'date');
      setCalendarView(openTo);
      setTimeUnit('hours');
      setTimeInputDial(dialMode(timeView));
      setDraft(toDraft(committed));
      setMonth(new Date(committed.date ?? new Date()));
      setContentMounted(true);
      const mobile = typeof window !== 'undefined' && window.innerWidth <= 600;
      setIsMobile(mobile);
      if (focusOnOpen.current || display === 'modal' || mobile) requestFocus();
      focusOnOpen.current = true;
      return undefined;
    }
    if (!isOpen && wasOpen.current) {
      wasOpen.current = false;
      if (activePicker?.owner === owner) activePicker = null;
      clearSwitchTimer();
      const timer = setTimeout(() => setContentMounted(false), EXIT_DELAY);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  useEffect(
    () => () => {
      clearSwitchTimer();
      if (activePicker?.owner === owner) activePicker = null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Bloqueado mientras está abierto: se cierra.
  useEffect(() => {
    if (locked && isOpen) requestClose(false, 'api');
  }, [locked, isOpen, requestClose]);

  /** Coloca el popover arriba o alineado a la derecha si no cabe (`_positionPopover`). */
  const positionPopover = useEventCallback(() => {
    const root = rootRef.current;
    if (!root || display === 'modal' || typeof window === 'undefined') return;
    const mobile = window.innerWidth <= 600;
    setIsMobile(mobile);
    if (mobile) {
      setPopoverStyle({});
      return;
    }
    const rect = root.getBoundingClientRect();
    const next: CSSProperties = { left: '0', right: 'auto', top: '100%', bottom: 'auto', marginTop: '4px', marginBottom: '0' };
    if (rect.left + 320 > window.innerWidth) {
      next.left = 'auto';
      next.right = '0';
    }
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 380 && rect.top > spaceBelow) {
      next.top = 'auto';
      next.bottom = '100%';
      next.marginTop = '0';
      next.marginBottom = '4px';
    }
    setPopoverStyle(next);
  });
  useEffect(() => {
    if (!isOpen) return undefined;
    positionPopover();
    window.addEventListener('resize', positionPopover);
    return () => window.removeEventListener('resize', positionPopover);
  }, [isOpen, positionPopover]);

  // Escape (pila de capas) y clic fuera.
  const layer = useLayer({
    open: isOpen,
    kind: display === 'modal' ? 'modal' : 'popup',
    nodes: () => [containerRef.current, backdropRef.current, mobileBackdropRef.current].filter(Boolean) as Node[],
    onEscape: () => requestClose(true, 'escapeKeyDown'),
  });
  useEffect(() => {
    if (!isOpen || display === 'modal') return undefined;
    return onClickAway(
      () => [rootRef.current, containerRef.current, mobileBackdropRef.current].filter(Boolean) as Node[],
      (event) => {
        if (layer.isInUpperLayer(event.target as Node)) return;
        requestClose(false, 'clickaway');
      },
    );
  }, [isOpen, display, layer, requestClose]);

  useImperativeHandle(
    action,
    () => ({
      open: (options) => requestOpen(options),
      close: (focusInput = false) => requestClose(focusInput, 'api'),
      toggle: () => (isOpen ? requestClose(true, 'toggle') : requestOpen()),
      clear: () => {
        clear();
      },
    }),
    [isOpen, requestOpen, requestClose, clear],
  );

  // Botón de apertura: aria-haspopup, aria-expanded, aria-controls y bloqueo en solo lectura.
  useEnhancedEffect(() => {
    const btn = rootEl?.querySelector<HTMLButtonElement>('.mtx-text-field__action--end');
    if (!btn) return;
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-controls', dialogId);
    btn.disabled = locked;
    if (locked) btn.setAttribute('aria-disabled', 'true');
    else btn.removeAttribute('aria-disabled');
  });

  // ------------------------------------------------------------- Selección
  const dialogLabel =
    mode === 'time'
      ? t('chooseTime', null, 'Choose time')
      : range
        ? t('chooseDateRange', null, 'Choose date range')
        : mode === 'datetime'
          ? t('chooseDateTime', null, 'Choose date and time')
          : t('chooseDate', null, 'Choose date');

  /** Cierra tras una elección automática y notifica `onAccept`. */
  const acceptAndClose = (result: [DateTimePickerValue, DateTimePickerChangeDetail]) => {
    onAccept?.(...result);
    requestClose(true, 'select');
  };
  const closesOnSelect = !displayStatic && display !== 'modal';

  const handleDayChange = (date: Date) => {
    const next: Draft = { ...draft, date: withTime(date, draft.time) };
    if (mode === 'datetime') {
      setDraft(next);
      setActiveTab('time');
      setTimeUnit('hours');
      requestFocus();
      return;
    }
    const result = commit(next);
    if (closesOnSelect) acceptAndClose(result);
  };

  const handleRangeChange = (r: DateRange, meta: { complete: boolean }) => {
    const datetime = mode === 'datetime';
    const start = r.start ? withTime(r.start, datetime ? draft.startTime : { hour: 0, minute: 0, second: 0 }) : null;
    const end = r.end ? withTime(r.end, datetime ? draft.endTime : { hour: 0, minute: 0, second: 0 }) : null;
    const next: Draft = { ...draft, start, end, date: meta.complete ? end : start };
    if (!meta.complete) {
      setDraft(next);
      return;
    }
    const result = commit(next);
    if (datetime) {
      setActiveTab('time-start');
      setTimeUnit('hours');
      requestFocus();
      return;
    }
    if (closesOnSelect) acceptAndClose(result);
  };

  const timeViews = (views && views.length ? views : ['hours', 'minutes']) as TimeViewName[];
  const isRangeTime = range && mode === 'datetime';
  const editingEnd = activeTab === 'time-end';

  const handleTimeChange = (date: Date, meta: TimeViewChangeMeta) => {
    const hm: HM = { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
    let next: Draft;
    if (isRangeTime) {
      next = editingEnd
        ? { ...draft, endTime: hm, end: draft.end ? withTime(draft.end, hm) : null }
        : { ...draft, startTime: hm, start: draft.start ? withTime(draft.start, hm) : null };
    } else {
      next = { ...draft, time: hm, date: withTime(draft.date ?? new Date(), hm) };
    }
    const result = commit(next);
    const lastView = meta.view === timeViews[timeViews.length - 1];
    if (!meta.done || !lastView) return;
    if (!timeInputDial) {
      // Enter en la última tarjeta: aplica y cierra (vanilla).
      if (!displayStatic) {
        onAccept?.(...result);
        requestClose(true, 'accept');
      }
      return;
    }
    if (isRangeTime && activeTab === 'time-start') {
      clearSwitchTimer();
      switchTimer.current = setTimeout(() => {
        switchTimer.current = null;
        setActiveTab('time-end');
        setTimeUnit('hours');
        if (containerRef.current?.contains(document.activeElement)) requestFocus();
      }, 300);
    }
  };

  const texts = {
    today: todayText ?? t('today', null, 'Today'),
    clear: clearText ?? t('clear'),
    cancel: cancelText ?? t('cancel', null, 'Cancel'),
    accept: okText ?? t('ok', null, 'OK'),
  };
  const actions = actionsProp ?? (displayStatic ? ['today'] : ['today', 'cancel', 'accept']);

  const handleAction = (act: PickerAction) => {
    if (act === 'cancel') {
      setDraft(toDraft(committed));
      requestClose(true, 'cancel');
      return;
    }
    if (act === 'clear') {
      onAccept?.(...clear());
      requestClose(true, 'accept');
      return;
    }
    if (act === 'accept') {
      const result = commit(draft);
      onAccept?.(...result);
      requestClose(true, 'accept');
      return;
    }
    // Hoy
    const now = new Date();
    const hm = hmOf(now, 0);
    const next: Draft = range
      ? { ...draft, start: withTime(now, mode === 'datetime' ? draft.startTime : { hour: 0, minute: 0, second: 0 }), end: withTime(now, mode === 'datetime' ? draft.endTime : { hour: 0, minute: 0, second: 0 }) }
      : { ...draft, date: now, time: hm };
    setMonth(new Date(now));
    const result = commit(next);
    if (!displayStatic && mode !== 'datetime') acceptAndClose(result);
  };

  // ------------------------------------------------------------- Campo
  const allowedChar = mode === 'time' ? /^[0-9:\sAPMapm]$/ : mode === 'date' ? /^[0-9/\-.\s]$/ : /^[0-9/\-.:\sAPMapm]$/;
  const invalidChars = mode === 'time' ? /[^0-9:\sAPMapm]/g : mode === 'date' ? /[^0-9/\-.\s]/g : /[^0-9/\-.:\sAPMapm]/g;

  let mask = maskProp;
  if (mask === undefined) {
    mask = !formatProp && mode === 'time' ? (ampm ? 'time-ampm' : 'time') : formatToMask(format);
    if (mask === '00/00/0000') mask = 'date';
    if (range) {
      const single = mask === 'date' ? '00/00/0000' : mask === 'time' ? '00:00' : mask === 'time-ampm' ? '00:00 AA' : mask;
      mask = format.includes(' - ') || format.includes(' / ') ? single : `${single}${rangeSeparator}${single}`;
    }
  }

  const handleFieldChange = (text: string, complete: boolean) => {
    const clean = text.replace(invalidChars, '');
    setInputText(clean);
    const val = clean.trim();
    if (!val) {
      if (committedKey !== selKey(EMPTY)) clear();
      return;
    }
    if (!complete) return;
    if (range) {
      if (!val.includes(rangeSeparator) && !val.includes(' - ')) return;
      const r = toRange(val, rangeSeparator, parseOptions);
      if (!r.start || !r.end) return;
      const next = toDraft({ date: r.start, start: r.start, end: r.end });
      setMonth(new Date(r.start));
      commit(next, { keepText: true });
      return;
    }
    const d = parseDate(val, parseOptions);
    if (!d) return;
    setMonth(new Date(d));
    commit(toDraft({ ...EMPTY, date: d }), { keepText: true });
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown' && (event.altKey || isOpen)) {
      event.preventDefault();
      if (!isOpen) requestOpen({ focus: true });
      else focusActiveView();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length > 1) return;
    if (!allowedChar.test(event.key)) event.preventDefault();
  };
  const handleInputPaste = (event: ReactClipboardEvent<HTMLInputElement>) => {
    inputProps?.onPaste?.(event);
    const data = event.clipboardData?.getData('text');
    if (!data || !new RegExp(invalidChars.source).test(data)) return;
    event.preventDefault();
    const input = event.currentTarget;
    const sanitized = data.replace(invalidChars, '');
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, input.value.slice(0, start) + sanitized + input.value.slice(end));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // ------------------------------------------------------------- Contenedor
  const handleContainerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && isOpen && isModal && containerRef.current) trapTab(event.nativeEvent, containerRef.current);
  };
  const handleContainerBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!isOpen || isModal) return;
    const next = event.relatedTarget as Node | null;
    if (!next) return;
    if (rootRef.current?.contains(next) || containerRef.current?.contains(next)) return;
    requestClose(false, 'tabOut');
  };

  const showHeader = (display === 'modal' || displayStatic) && mode !== 'time' && activeTab === 'date';
  const timeTab = mode === 'time' || activeTab !== 'date';
  const timeTarget = isRangeTime ? (editingEnd ? draft.end : draft.start) : draft.date;
  const timeHm = isRangeTime ? (editingEnd ? draft.endTime : draft.startTime) : draft.time;
  const timeValue = withTime(timeTarget ?? new Date(), timeHm);

  const content = contentMounted ? (
    <>
      {showHeader ? (
        <PickerHeader
          range={range}
          date={draft.date}
          start={draft.start}
          end={draft.end}
          locale={locale}
          t={t}
          onYearClick={() => {
            setActiveTab('date');
            setCalendarView('year');
          }}
        />
      ) : null}
      {mode === 'datetime' ? (
        <PickerTabs
          range={range}
          activeTab={activeTab}
          label={dialogLabel}
          startTime={draft.startTime}
          endTime={draft.endTime}
          t={t}
          onSelect={(tab) => {
            clearSwitchTimer();
            setActiveTab(tab);
            if (tab === 'date') setCalendarView('day');
            else setTimeUnit('hours');
          }}
        />
      ) : null}
      <div className="mtx-picker-content">
        {timeTab ? (
          <TimeView
            key={activeTab}
            value={timeValue}
            referenceDate={timeValue}
            onChange={handleTimeChange}
            view={timeUnit}
            onViewChange={setTimeUnit}
            views={timeViews}
            ampm={ampm}
            minutesStep={minutesStep}
            minTime={minTime}
            maxTime={maxTime}
            disabled={displayStatic && disabled}
            readOnly={displayStatic && readOnly}
            locale={localeProp}
            variant={timeInputDial ? 'clock' : 'digital'}
          />
        ) : (
          <DateCalendar
            value={draft.date}
            range={range}
            rangeValue={{ start: draft.start, end: draft.end }}
            onChange={handleDayChange}
            onRangeChange={handleRangeChange}
            view={calendarView}
            onViewChange={setCalendarView}
            month={month}
            onMonthChange={setMonth}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={shouldDisableDate}
            readOnly={displayStatic && readOnly}
            locale={localeProp || locale}
          />
        )}
      </div>
      <PickerActions
        timeTab={timeTab}
        timeInput={!timeInputDial}
        actions={actions}
        texts={texts}
        t={t}
        onToggleTimeInput={() => setTimeInputDial((v) => !v)}
        onAction={handleAction}
      />
    </>
  ) : null;

  // `inert` por atributo (React 18 no admite la prop): estático deshabilitado y modal cerrado.
  modalHiddenRef.current = !isOpen && !contentMounted;
  useEnhancedEffect(() => {
    if (displayStatic) setInert(containerRef.current, disabled);
    else setInert(backdropRef.current, modalHiddenRef.current);
  });

  // ------------------------------------------------------------- Estático
  if (displayStatic) {
    const staticLocked = disabled;
    return (
      <div
        ref={handleStaticRef}
        id={idProp}
        role="group"
        aria-label={ariaLabelledBy ? ariaLabel : ariaLabel ?? dialogLabel}
        aria-labelledby={ariaLabelledBy}
        aria-disabled={staticLocked ? true : undefined}
        className={cx('mtx-picker-static', staticLocked && 'mtx-picker-static--disabled', className)}
        style={style}
      >
        {content}
      </div>
    );
  }

  const containerProps = {
    ref: containerRef,
    id: dialogId,
    role: 'dialog',
    'aria-label': dialogLabel,
    onKeyDown: handleContainerKeyDown,
    onBlur: handleContainerBlur,
  };

  const popover =
    display === 'popover' && rootEl
      ? createPortal(
          <div
            {...containerProps}
            className={cx('mtx-picker-popover', isOpen && 'mtx-picker-popover--open')}
            aria-modal={isOpen && isMobile ? true : undefined}
            style={isMobile ? undefined : popoverStyle}
          >
            {content}
          </div>,
          rootEl,
        )
      : null;

  const value = inputText;
  const buttonLabel = value.trim()
    ? t('chooseWithValue', { label: dialogLabel, value }, `${dialogLabel}, ${value}`)
    : dialogLabel;

  return (
    <>
      <TextField
        {...fieldProps}
        ref={handleRootRef}
        id={idProp}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={className}
        style={style}
        value={value}
        onChange={(_, text, details) => handleFieldChange(text, details.isMaskComplete)}
        mask={mask || undefined}
        disabled={disabled}
        readOnly={readOnly}
        locale={localeProp}
        inputRef={handleInputRef}
        endAction={endIcon || DEFAULT_ICONS[mode]}
        endActionLabel={buttonLabel}
        onAdornmentClick={({ position }) => {
          if (position !== 'end' || locked) return;
          if (isOpen) requestClose(true, 'toggle');
          else requestOpen({ focus: true });
        }}
        inputProps={{
          ...inputProps,
          onKeyDown: handleInputKeyDown,
          onPaste: handleInputPaste,
          onClick: (event) => {
            inputProps?.onClick?.(event);
            if (!isOpen) requestOpen({ focus: false });
          },
        }}
      />
      {popover}
      {display === 'popover' ? (
        <Portal>
          <div
            ref={mobileBackdropRef}
            className={cx('mtx-picker-backdrop-mobile', isOpen && 'mtx-picker-backdrop-mobile--open')}
            onClick={(event) => {
              event.stopPropagation();
              requestClose(true, 'backdropClick');
            }}
          />
        </Portal>
      ) : (
        <Portal>
          <div
            ref={handleBackdropRef}
            className={cx('mtx-picker-backdrop', isOpen && 'mtx-picker-backdrop--open')}
            onClick={(event) => {
              if (event.target === event.currentTarget) requestClose(true, 'backdropClick');
            }}
          >
            <div {...containerProps} className="mtx-picker-dialog" aria-modal="true">
              {content}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
});
