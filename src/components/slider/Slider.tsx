'use client';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  FocusEventHandler,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/slider.css';
import { cx, isRtl, useControlled, useEnhancedEffect, useEventCallback, useForkRef } from '../../core';
import { useIntlLocale, useT } from '../../i18n';
import {
  closestThumb,
  formatValue,
  getKeyboardValue,
  getMarks,
  normalize,
  percent,
  setThumbValue,
  valueFromRatio,
} from '../../utils/slider';
import type { SliderSnapOptions } from '../../utils/slider';
import { flushSync } from 'react-dom';

/** Colores de la paleta. */
export type SliderColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Marca con etiqueta opcional (texto o nodo). */
export interface SliderMarkItem {
  value: number;
  label?: ReactNode;
}

/** Valor del slider: número o `[inicio, fin]` en rango. */
export type SliderValue = number | number[];

/** Props de {@link Slider}. `className`, `style` y el resto de atributos van a la raíz `<span>`. */
export interface SliderProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'onChange' | 'defaultValue' | 'color' | 'onFocus' | 'onBlur' | 'tabIndex' | 'id'
  > {
  /** Valor (modo controlado): número o `[inicio, fin]` (rango). */
  value?: number | readonly number[];
  /** Valor inicial (modo no controlado). Por defecto, el punto medio o `[min, max]` en rango. */
  defaultValue?: number | readonly number[];
  /** Fuerza el modo rango aunque no haya valor inicial (`[min, max]`). */
  range?: boolean;
  /** Se invoca durante el arrastre o con el teclado (`mtx:slider:input` de vanilla). */
  onChange?: (event: Event, value: SliderValue, activeThumb: number) => void;
  /** Se invoca al soltar el puntero o tras el teclado con un valor nuevo (`mtx:slider:change`). */
  onChangeCommitted?: (event: Event, value: SliderValue) => void;
  /** Mínimo (por defecto `0`). */
  min?: number;
  /** Máximo (por defecto `100`). */
  max?: number;
  /** Incremento (por defecto `1`); `null` restringe los valores a las marcas. */
  step?: number | null;
  /** Marcas: `true` (una por step), lista `"0:0 °C,20:20 °C"`, JSON o array `{ value, label }`. */
  marks?: boolean | string | readonly SliderMarkItem[];
  /** Alinea hacia dentro las etiquetas de las marcas de `min` y `max`. */
  marksInset?: boolean;
  /** Orientación. */
  orientation?: 'horizontal' | 'vertical';
  /** Modo del track: `normal`, `inverted` o `false` (sin track). */
  track?: 'normal' | 'inverted' | false;
  /** Visibilidad del value label. */
  valueLabelDisplay?: 'on' | 'auto' | 'off';
  /** Formato del value label: plantilla con `{value}` o función. */
  valueLabelFormat?: string | ((value: number, index: number) => ReactNode);
  /** Tamaño. */
  size?: 'medium' | 'small';
  /** Color de la paleta. */
  color?: SliderColor;
  /** Deshabilita el slider. */
  disabled?: boolean;
  /** Rango: el thumb activo se detiene en el otro en lugar de intercambiarse. */
  disableSwap?: boolean;
  /** Rango: distancia mínima entre thumbs. */
  minDistance?: number;
  /** Nombre del campo; en rango se envían `{name}-start` y `{name}-end`. */
  name?: string;
  /** Id del `<input>` del primer thumb. */
  id?: string;
  /** Formulario asociado a los inputs. */
  form?: string;
  /** Enfoca el primer thumb al montar. */
  autoFocus?: boolean;
  /** `tabIndex` de los inputs. */
  tabIndex?: number;
  /** Nombre accesible por thumb (prevalece sobre `aria-label`). */
  getAriaLabel?: (index: number) => string;
  /** Texto accesible del valor (`aria-valuetext`). */
  getAriaValueText?: (value: number, index: number) => string;
  /** Ref al `<input>` del primer thumb. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos extra de cada `<input type="range">`. */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Foco de un thumb. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Pérdida de foco de un thumb. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

const COLORS: readonly SliderColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

/**
 * Lista de valores a partir de un número o array.
 * @param {number|readonly number[]|undefined} value Valor.
 * @returns {number[]|null} Lista o `null` si no hay valor.
 */
const toList = (value: number | readonly number[] | undefined): number[] | null => {
  if (value === undefined || value === null) return null;
  return Array.isArray(value) ? value.slice() : [value as number];
};

/**
 * Compara dos listas de valores.
 * @param {number[]} a Lista A.
 * @param {number[]} b Lista B.
 * @returns {boolean} `true` si son iguales.
 */
const sameValues = (a: readonly number[], b: readonly number[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

/**
 * Enfoca un input sin desplazar la página.
 * @param {HTMLInputElement|null|undefined} input Input.
 */
const focusInput = (input: HTMLInputElement | null | undefined): void => {
  if (!input) return;
  try {
    input.focus({ preventScroll: true });
  } catch {
    input.focus();
  }
};

/**
 * Deslizador (Slider de MUI) basado en `<input type="range">` nativos, uno por thumb, con rail,
 * track, marcas, value label, rango, teclado, arrastre con puntero y RTL.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(props, ref) {
  const {
    value: valueProp,
    defaultValue,
    range: rangeProp = false,
    onChange,
    onChangeCommitted,
    min: minProp = 0,
    max: maxProp = 100,
    step: stepProp = 1,
    marks: marksProp,
    marksInset = false,
    orientation = 'horizontal',
    track = 'normal',
    valueLabelDisplay = 'off',
    valueLabelFormat,
    size = 'medium',
    color = 'primary',
    disabled = false,
    disableSwap = false,
    minDistance: minDistanceProp = 0,
    name,
    id,
    form,
    autoFocus,
    tabIndex,
    getAriaLabel,
    getAriaValueText,
    inputRef: inputRefProp,
    inputProps,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    style,
    onPointerDown,
    ...rest
  } = props;

  const t = useT('slider');
  const intlLocale = useIntlLocale();

  // Escala (como vanilla: max >= min y step > 0).
  const min = Number.isFinite(minProp) ? minProp : 0;
  const max = Number.isFinite(maxProp) && maxProp >= min ? maxProp : min;
  const marksOnly = stepProp === null;
  const step = typeof stepProp === 'number' && stepProp > 0 ? stepProp : 1;
  const minDistance = Math.max(0, Number(minDistanceProp) || 0);
  const vertical = orientation === 'vertical';

  const initialList = toList(valueProp) ?? toList(defaultValue);
  const range = rangeProp || (initialList !== null && initialList.length > 1);

  // Marcas dentro de la escala (las etiquetas ReactNode se conservan con arrays).
  const marks = useMemo<SliderMarkItem[]>(() => {
    if (Array.isArray(marksProp)) {
      return (marksProp as readonly SliderMarkItem[])
        .filter((m) => m && Number.isFinite(Number(m.value)))
        .map((m) => ({ value: Number(m.value), label: m.label ?? null }))
        .filter((m) => m.value >= min && m.value <= max);
    }
    return getMarks(marksProp as boolean | string | undefined, { min, max, step }).map((m) => ({ value: m.value, label: m.label }));
  }, [marksProp, min, max, step]);

  const snapOptions: SliderSnapOptions & { range: boolean } = {
    min,
    max,
    step,
    marks: marks.map((m) => ({ value: m.value, label: null })),
    marksOnly,
    range,
  };

  /** Valores por defecto de vanilla: punto medio (simple) o `[min, max]` (rango). */
  const fallbackValues = (list: number[] | null): number[] => {
    if (range) {
      const a = list && Number.isFinite(list[0]) ? list[0] : min;
      const b = list && Number.isFinite(list[1]) ? list[1] : max;
      return [a, b];
    }
    return [list && Number.isFinite(list[0]) ? list[0] : (min + max) / 2];
  };

  const [rawValues, setRawValues] = useControlled<number[]>({
    controlled: valueProp === undefined ? undefined : fallbackValues(toList(valueProp)),
    default: fallbackValues(toList(defaultValue)),
    name: 'Slider',
  });
  const values = normalize(rawValues, snapOptions);

  const [dragging, setDragging] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const handleRootRef = useForkRef(rootRef, ref);
  const setFirstInput = useCallback((node: HTMLInputElement | null) => {
    inputsRef.current[0] = node;
  }, []);
  const setSecondInput = useCallback((node: HTMLInputElement | null) => {
    inputsRef.current[1] = node;
  }, []);
  const handleFirstInputRef = useForkRef<HTMLInputElement>(setFirstInput, inputRefProp);

  // Valores más recientes para los manejadores del arrastre (antes de que React re-renderice).
  const controlled = valueProp !== undefined;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const draggingRef = useRef(-1);
  const cleanupDragRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupDragRef.current?.(), []);

  // Rango con aria-labelledby: el texto externo se usa como prefijo de "Mínimo"/"Máximo" (como vanilla).
  const [labelledText, setLabelledText] = useState<string | null>(null);
  useEnhancedEffect(() => {
    if (!range || ariaLabel || !ariaLabelledBy) {
      setLabelledText(null);
      return;
    }
    const external = rootRef.current?.ownerDocument.getElementById(ariaLabelledBy);
    setLabelledText(external ? (external.textContent || '').trim() || null : null);
  }, [range, ariaLabel, ariaLabelledBy]);

  /** Valor público: número o `[a, b]`. */
  const publicValue = (list: readonly number[]): SliderValue => (range ? list.slice() : list[0]);

  /**
   * Aplica un valor elegido por el usuario a un thumb (swap / disableSwap / minDistance).
   * Teclado e input nativo no intercambian thumbs (`noSwap`); el nativo notifica siempre.
   * @returns {boolean} `true` si el valor cambió.
   */
  const setFromUser = useEventCallback((event: Event, index: number, raw: number, noSwap: boolean, fromNative = false): boolean => {
    const current = valuesRef.current;
    const result = setThumbValue(current, index, raw, {
      ...snapOptions,
      minDistance,
      disableSwap,
      noSwap,
    });
    const changed = !sameValues(result.values, current);
    const active = result.activeThumb;
    // Controlado: el valor mostrado lo deciden las props (el padre puede rechazarlo o recortarlo).
    if (!controlled) valuesRef.current = result.values;
    if (active !== index) {
      if (draggingRef.current >= 0) {
        draggingRef.current = active;
        setDragging(active);
      }
      setActiveIndex(active);
      focusInput(inputsRef.current[active]);
    }
    if (changed || fromNative) {
      setRawValues(result.values);
      onChange?.(event, publicValue(result.values), active);
    }
    return changed;
  });

  /** Valor bajo el puntero (horizontal, vertical y RTL). */
  const valueFromPointer = (event: { clientX: number; clientY: number }): number | null => {
    const rail = railRef.current;
    if (!rail) return null;
    const rect = rail.getBoundingClientRect();
    if (vertical) {
      if (!rect.height) return null;
      return valueFromRatio((rect.bottom - event.clientY) / rect.height, min, max);
    }
    if (!rect.width) return null;
    return valueFromRatio((event.clientX - rect.left) / rect.width, min, max, isRtl(rootRef.current));
  };

  /** Notifica el valor confirmado con el callback más reciente (estable durante el arrastre). */
  const commit = useEventCallback((event: Event, list: readonly number[]) => {
    onChangeCommitted?.(event, publicValue(list));
  });

  const handlePointerDown = useEventCallback((event: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled || (event.button !== undefined && event.button !== 0)) return;
    const target = event.target as Element | null;
    if (target && target.closest && target.closest('.mtx-slider__value-label')) return;
    event.preventDefault();
    const value = valueFromPointer(event);
    if (value === null) return;
    const root = rootRef.current!;
    const index = closestThumb(value, valuesRef.current, range);
    const startValues = valuesRef.current.slice();
    draggingRef.current = index;
    setDragging(index);
    setActiveIndex(index);
    focusInput(inputsRef.current[index]);
    setFromUser(event.nativeEvent, index, value, false);

    // Captura del puntero: el arrastre continúa aunque el puntero salga del slider.
    const pointerId = event.pointerId;
    try {
      if (pointerId !== undefined) root.setPointerCapture(pointerId);
    } catch {
      /* jsdom o puntero ya liberado */
    }
    const doc = root.ownerDocument;
    const move = (ev: PointerEvent) => {
      if (draggingRef.current < 0) return;
      const v = valueFromPointer(ev);
      if (v !== null) setFromUser(ev, draggingRef.current, v, false);
    };
    const cleanup = () => {
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerup', up);
      doc.removeEventListener('pointercancel', up);
      try {
        if (pointerId !== undefined && root.hasPointerCapture?.(pointerId)) root.releasePointerCapture(pointerId);
      } catch {
        /* sin captura */
      }
      cleanupDragRef.current = null;
    };
    const up = (ev: PointerEvent) => {
      cleanup();
      draggingRef.current = -1;
      setDragging(-1);
      if (!sameValues(startValues, valuesRef.current)) commit(ev, valuesRef.current);
    };
    cleanupDragRef.current?.();
    doc.addEventListener('pointermove', move);
    doc.addEventListener('pointerup', up);
    doc.addEventListener('pointercancel', up);
    cleanupDragRef.current = cleanup;
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    inputProps?.onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;
    const rtl = !vertical && isRtl(rootRef.current);
    const next = getKeyboardValue(event.key, valuesRef.current[index], { ...snapOptions, rtl });
    if (next === null) return;
    event.preventDefault();
    const before = valuesRef.current.slice();
    // flushSync: el padre controlado re-renderiza antes de comparar y confirmar.
    flushSync(() => {
      setFromUser(event.nativeEvent, index, next, true);
    });
    if (!sameValues(before, valuesRef.current)) onChangeCommitted?.(event.nativeEvent, publicValue(valuesRef.current));
  };

  // Cambios escritos en el input nativo (tecnologías de apoyo).
  const handleNativeChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    inputProps?.onChange?.(event);
    if (disabled) return;
    const raw = parseFloat(event.target.value);
    if (!Number.isFinite(raw)) return;
    const before = valuesRef.current.slice();
    flushSync(() => {
      setFromUser(event.nativeEvent, index, raw, true, true);
    });
    if (!sameValues(before, valuesRef.current)) onChangeCommitted?.(event.nativeEvent, publicValue(valuesRef.current));
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>, index: number) => {
    setActiveIndex(index);
    (onFocus ?? inputProps?.onFocus)?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (draggingRef.current < 0) setActiveIndex(-1);
    (onBlur ?? inputProps?.onBlur)?.(event);
  };

  // Texto del value label y aria-valuetext.
  const formatText = (value: number): string =>
    formatValue(value, { locale: intlLocale, step, format: typeof valueLabelFormat === 'string' ? valueLabelFormat : null });
  const labelContent = (value: number, index: number): ReactNode =>
    typeof valueLabelFormat === 'function' ? valueLabelFormat(value, index) : formatText(value);
  const valueText = (value: number, index: number): string | undefined => {
    if (getAriaValueText) return getAriaValueText(value, index);
    if (typeof valueLabelFormat === 'string' && valueLabelFormat) return formatText(value);
    if (typeof valueLabelFormat === 'function') {
      const node = valueLabelFormat(value, index);
      return typeof node === 'string' || typeof node === 'number' ? String(node) : undefined;
    }
    return undefined;
  };

  // Nombre accesible por thumb (rango: "Precio: Mínimo" / "Precio: Máximo").
  const thumbAria = (index: number): { label?: string; labelledBy?: string } => {
    if (getAriaLabel) return { label: getAriaLabel(index) };
    const ownLabel = inputProps?.['aria-label'];
    const ownLabelledBy = inputProps?.['aria-labelledby'];
    if (!range) {
      if (ariaLabel ?? ownLabel) return { label: ariaLabel ?? ownLabel };
      return { labelledBy: ariaLabelledBy ?? ownLabelledBy };
    }
    const base = ariaLabel ?? ownLabel ?? labelledText;
    const thumb = t(index === 0 ? 'minimum' : 'maximum', null, index === 0 ? 'Minimum' : 'Maximum');
    return { label: base ? t('thumbLabel', { label: base, thumb }, `${base}: ${thumb}`) : thumb };
  };

  // Geometría (como `_render` de vanilla).
  const pcts = values.map((v) => percent(v, min, max));
  const start = range ? pcts[0] : 0;
  const end = range ? pcts[1] : pcts[0];
  const inverted = track === 'inverted';
  const trackStart = inverted && !range ? end : start;
  const trackLen = inverted && !range ? 100 - end : end - start;
  const trackStyle: CSSProperties = vertical
    ? { bottom: `${trackStart}%`, height: `${trackLen}%` }
    : { insetInlineStart: `${trackStart}%`, width: `${trackLen}%` };
  const place = (pct: number): CSSProperties => (vertical ? { bottom: `${pct}%` } : { insetInlineStart: `${pct}%` });

  const lo = range ? values[0] : min;
  const hi = range ? values[1] : values[0];
  const markActive = (value: number): boolean => {
    if (track === false) return false;
    if (inverted) return range ? value <= lo || value >= hi : value >= hi;
    return value >= lo && value <= hi;
  };
  const hasLabels = marks.some((m) => m.label !== null && m.label !== undefined && m.label !== '' && m.label !== false);

  const rootClass = cx(
    'mtx-slider',
    size === 'small' && 'mtx-slider--small',
    COLORS.includes(color) && color !== 'primary' && `mtx-slider--${color}`,
    vertical && 'mtx-slider--vertical',
    inverted && 'mtx-slider--track-inverted',
    track === false && 'mtx-slider--track-false',
    marksInset && 'mtx-slider--marks-inset',
    `mtx-slider--label-${valueLabelDisplay}`,
    hasLabels && 'mtx-slider--marked',
    dragging >= 0 && 'mtx-slider--dragging',
    disabled && 'mtx-slider--disabled',
    className,
  );

  const inputName = (index: number): string | undefined => {
    const base = name ?? inputProps?.name;
    if (!base) return undefined;
    return range ? `${base}-${index === 0 ? 'start' : 'end'}` : base;
  };

  return (
    <span
      {...rest}
      ref={handleRootRef}
      className={rootClass}
      style={style}
      aria-disabled={disabled ? true : undefined}
      onPointerDown={handlePointerDown}
    >
      <span className="mtx-slider__rail" ref={railRef} />
      <span className="mtx-slider__track" style={trackStyle} />
      {marks.map((mark, i) => {
        const pct = percent(mark.value, min, max);
        const hasLabel = mark.label !== null && mark.label !== undefined && mark.label !== '' && mark.label !== false;
        return [
          <span
            key={`dot-${i}`}
            className={cx('mtx-slider__mark', markActive(mark.value) && 'mtx-slider__mark--active')}
            data-value={String(mark.value)}
            aria-hidden="true"
            style={place(pct)}
          />,
          hasLabel ? (
            <span
              key={`label-${i}`}
              className={cx(
                'mtx-slider__mark-label',
                pct <= 0 && 'mtx-slider__mark-label--start',
                pct >= 100 && 'mtx-slider__mark-label--end',
                mark.value >= lo && mark.value <= hi && 'mtx-slider__mark-label--active',
              )}
              aria-hidden="true"
              style={place(pct)}
            >
              {mark.label}
            </span>
          ) : null,
        ];
      })}
      {values.map((value, index) => {
        const aria = thumbAria(index);
        return (
          <span
            key={index}
            className={cx(
              'mtx-slider__thumb',
              dragging === index && 'mtx-slider__thumb--active',
              activeIndex === index && 'mtx-slider__thumb--focused',
            )}
            data-index={index}
            style={place(pcts[index])}
          >
            <input
              {...inputProps}
              ref={index === 0 ? handleFirstInputRef : setSecondInput}
              type="range"
              className={cx('mtx-slider__input', inputProps?.className)}
              data-index={index}
              id={index === 0 ? id ?? inputProps?.id : undefined}
              name={inputName(index)}
              form={form ?? inputProps?.form}
              autoFocus={index === 0 ? autoFocus ?? inputProps?.autoFocus : undefined}
              tabIndex={tabIndex ?? inputProps?.tabIndex}
              min={min}
              max={max}
              step={marksOnly ? 'any' : step}
              value={value}
              disabled={disabled}
              aria-label={aria.label}
              aria-labelledby={aria.label ? undefined : aria.labelledBy}
              aria-describedby={ariaDescribedBy ?? inputProps?.['aria-describedby']}
              aria-orientation={vertical ? 'vertical' : undefined}
              aria-valuetext={valueText(value, index)}
              onChange={(event) => handleNativeChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={(event) => handleFocus(event, index)}
              onBlur={handleBlur}
            />
            <span className="mtx-slider__value-label" aria-hidden="true">
              <span className="mtx-slider__value-label-text">{labelContent(value, index)}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
});
