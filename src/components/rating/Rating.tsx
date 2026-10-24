'use client';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/rating.css';
import { cx, useControlled } from '../../core';
import { useIntlLocale, useT } from '../../i18n';

/** Trazados SVG (24×24, Material Icons) de los iconos escalables de vanilla. */
export const RATING_SVG_PATHS: Readonly<Record<string, string>> = {
  star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  star_border: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
  star_outline: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
  favorite: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  favorite_border: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
  circle: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z',
  radio_button_unchecked: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
  thumb_up: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  thumb_up_off_alt: 'M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z',
};

/** Tamaños MUI de {@link Rating}: 18, 24 y 30px. */
export type RatingSize = 'small' | 'medium' | 'large';

/** Props de {@link Rating}. `className`, `style` y el resto de atributos van al `<span>` raíz. */
export interface RatingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** Valor (modo controlado); `null` = sin valoración. */
  value?: number | null;
  /** Valor inicial (modo no controlado). */
  defaultValue?: number | null;
  /** Se invoca cuando el usuario cambia o borra la valoración (`mtx:rating:change`). */
  onChange?: (event: SyntheticEvent, value: number | null) => void;
  /** Se invoca cuando cambia el valor activo por hover o foco; `null` al salir (`mtx:rating:active`). */
  onChangeActive?: (event: SyntheticEvent, value: number | null) => void;
  /** Número de iconos. */
  max?: number;
  /** Paso mínimo (1, 0.5, 0.25…; debe dividir la unidad en partes enteras). */
  precision?: number;
  /** Solo lectura: sin radios, `role="img"` y `aria-label` "Rated X out of N". */
  readOnly?: boolean;
  /** Deshabilita los radios y atenúa el componente. */
  disabled?: boolean;
  /** Tamaño de los iconos SVG. */
  size?: RatingSize;
  /** Icono lleno: nombre de Material Icons (SVG si es conocido) o nodo propio. */
  icon?: string | ReactNode;
  /** Icono vacío; por defecto `star_border`, o el mismo `icon` si se indicó. */
  emptyIcon?: string | ReactNode;
  /** Resalta solo el icono seleccionado. */
  highlightSelectedOnly?: boolean;
  /** `name` de los radios (envío en formularios); por defecto se genera. */
  name?: string;
  /** Nombre accesible del grupo (`aria-label`), equivalente a `data-label`. */
  label?: string;
  /** Etiqueta accesible de cada valor; por defecto "3 Stars" traducido. */
  getLabelText?: (value: number) => string;
  /** Etiqueta del radio "sin valoración"; por defecto "Empty" traducido. */
  emptyLabelText?: string;
  /** Idioma local del componente (prevalece sobre I18nProvider). */
  locale?: string;
}

/**
 * Valida la precisión: solo valores que dividen la unidad en partes enteras.
 * @param {number} [precision] Precisión pedida.
 * @returns {number} Precisión válida (1 si no lo es).
 */
function normalizePrecision(precision?: number): number {
  return precision !== undefined && precision > 0 && precision <= 1
    && Number.isInteger(Math.round((1 / precision) * 1e6) / 1e6)
    ? precision
    : 1;
}

/**
 * Redondea y acota un valor a la precisión y al máximo (`null` = sin valoración).
 * @param {number|null|undefined} value Valor bruto.
 * @param {number} precision Precisión.
 * @param {number} max Máximo.
 * @returns {number|null} Valor normalizado.
 */
export function roundRatingValue(value: number | null | undefined, precision: number, max: number): number | null {
  if (value === null || value === undefined || !Number.isFinite(value) || value <= 0) return null;
  const steps = Math.round(value / precision);
  const rounded = Math.min(max, Number((steps * precision).toFixed(4)));
  return rounded > 0 ? rounded : null;
}

/**
 * Icono de una valoración: SVG escalable si el nombre es conocido; si no, glifo Material Icons (24px).
 * @param {object} props Icono y modificador.
 * @returns {JSX.Element} Nodo del icono.
 */
function RatingIcon({ icon, kind }: { icon: string | ReactNode; kind: 'filled' | 'empty' }) {
  let content: ReactNode = icon;
  if (typeof icon === 'string') {
    const path = RATING_SVG_PATHS[icon];
    content = path ? (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={path} />
      </svg>
    ) : (
      <span className="material-icons">{icon}</span>
    );
  }
  return (
    <span className={`mtx-rating__icon mtx-rating__icon--${kind}`} aria-hidden="true">
      {content}
    </span>
  );
}

/**
 * Valoración con iconos (Rating de MUI) sobre radios nativos ocultos con etiquetas accesibles,
 * precisión fraccionaria, vista previa al pasar el cursor y borrado al repetir el clic.
 */
export const Rating = forwardRef<HTMLSpanElement, RatingProps>(function Rating(props, ref) {
  const {
    value: valueProp,
    defaultValue = null,
    onChange,
    onChangeActive,
    max: maxProp = 5,
    precision: precisionProp = 1,
    readOnly = false,
    disabled = false,
    size = 'medium',
    icon: iconProp,
    emptyIcon: emptyIconProp,
    highlightSelectedOnly = false,
    name: nameProp,
    label,
    getLabelText,
    emptyLabelText,
    locale,
    className,
    role: roleProp,
    'aria-label': ariaLabelProp,
    'aria-labelledby': ariaLabelledBy,
    onPointerDown,
    onPointerMove,
    onPointerLeave,
    onBlur,
    ...rest
  } = props;

  const max = Math.max(1, Math.floor(Number(maxProp)) || 5);
  const precision = normalizePrecision(precisionProp);
  const steps = Math.round(1 / precision);
  const icon = iconProp ?? 'star';
  const emptyIcon = emptyIconProp ?? (iconProp !== undefined ? iconProp : 'star_border');

  const t = useT('rating', locale);
  const contextIntl = useIntlLocale();
  const intlLocale = locale || contextIntl;
  const autoId = useId();
  const name = nameProp || `mtx-rating-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [rawValue, setValue] = useControlled<number | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'Rating',
  });
  const value = roundRatingValue(rawValue, precision, max);
  const [hover, setHover] = useState<number | null>(null);
  const [focusValue, setFocusValue] = useState<number | null>(null);

  const itemsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const activeRef = useRef<number | null>(null);
  const pointerClickRef = useRef(false);
  const pointerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (pointerTimerRef.current) clearTimeout(pointerTimerRef.current);
  }, []);

  const format = useMemo(() => {
    let formatter: Intl.NumberFormat | null = null;
    try {
      formatter = new Intl.NumberFormat(intlLocale);
    } catch {
      formatter = null;
    }
    return (n: number) => (formatter ? formatter.format(n) : String(n));
  }, [intlLocale]);

  const labelFor = (n: number) =>
    getLabelText ? getLabelText(n) : t(n === 1 ? 'star' : 'stars', { value: format(n) }, `${n} Stars`);

  const interactive = !readOnly && !disabled;

  /**
   * Notifica el valor activo (hover o, en su defecto, foco) solo cuando cambia.
   * @param {SyntheticEvent} event Evento de origen.
   * @param {number|null} nextHover Hover nuevo.
   * @param {number|null} nextFocus Foco nuevo.
   */
  const notifyActive = (event: SyntheticEvent, nextHover: number | null, nextFocus: number | null) => {
    const active = nextHover !== null ? nextHover : nextFocus;
    if (active === activeRef.current) return;
    activeRef.current = active;
    onChangeActive?.(event, active);
  };

  const updateHover = (event: SyntheticEvent, next: number | null) => {
    if (next === hover) return;
    setHover(next);
    notifyActive(event, next, focusValue);
  };

  const commit = (event: SyntheticEvent, next: number | null) => {
    if (next === value) return;
    setValue(next);
    onChange?.(event, next);
  };

  /**
   * Calcula el valor bajo el puntero según la posición horizontal (respeta RTL).
   * @param {HTMLElement} root Contenedor.
   * @param {number} clientX Coordenada X.
   * @returns {number|null} Valor resaltado.
   */
  const valueFromPointer = (root: HTMLElement, clientX: number): number | null => {
    const rtl = getComputedStyle(root).direction === 'rtl';
    const items = itemsRef.current;
    for (let i = 0; i < max; i += 1) {
      const item = items[i];
      if (!item) continue;
      const rect = item.getBoundingClientRect();
      if (rect.width === 0) continue;
      if (clientX >= rect.left && clientX <= rect.right) {
        let ratio = (clientX - rect.left) / rect.width;
        if (rtl) ratio = 1 - ratio;
        const part = Math.min(steps, Math.max(1, Math.ceil(ratio * steps)));
        return Number((i + part / steps).toFixed(4));
      }
    }
    return null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    pointerClickRef.current = true;
    if (pointerTimerRef.current) clearTimeout(pointerTimerRef.current);
    pointerTimerRef.current = setTimeout(() => {
      pointerTimerRef.current = null;
      pointerClickRef.current = false;
    }, 600);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerMove?.(event);
    if (!interactive || event.pointerType === 'touch') return;
    updateHover(event, valueFromPointer(event.currentTarget, event.clientX));
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerLeave?.(event);
    if (!interactive) return;
    updateHover(event, null);
  };

  const handleRootBlur = (event: ReactFocusEvent<HTMLSpanElement>) => {
    onBlur?.(event);
    if (readOnly) return;
    const leaving = !event.currentTarget.contains(event.relatedTarget as Node | null);
    if (hover !== null) setHover(null);
    if (leaving) {
      setFocusValue(null);
      notifyActive(event, null, null);
    } else if (hover !== null) {
      notifyActive(event, null, focusValue);
    }
  };

  const handleInputFocus = (event: ReactFocusEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const next = raw === '' ? null : roundRatingValue(parseFloat(raw), precision, max);
    setFocusValue(next);
    notifyActive(event, hover, next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    commit(event, raw === '' ? null : roundRatingValue(parseFloat(raw), precision, max));
  };

  const handleInputClick = (event: ReactMouseEvent<HTMLInputElement>) => {
    const raw = event.currentTarget.value;
    if (!pointerClickRef.current || raw === '') return;
    // Clic con el puntero sobre el valor ya elegido: lo borra (MUI).
    if (roundRatingValue(parseFloat(raw), precision, max) === value) {
      pointerClickRef.current = false;
      commit(event, null);
    }
  };

  const display = hover !== null ? hover : value;
  const hasName = Boolean(label || ariaLabelProp || ariaLabelledBy);
  const ariaLabel = readOnly
    ? t('readOnly', { value: format(value || 0), max: format(max) }, `Rated ${value || 0} out of ${max}`)
    : ariaLabelProp ?? (ariaLabelledBy ? undefined : label);
  const role = readOnly ? 'img' : roleProp ?? (hasName ? 'radiogroup' : undefined);
  const inputId = (n: number | null) => `${name}-${n === null ? 'empty' : String(n).replace('.', '_')}`;

  const items: ReactNode[] = [];
  for (let i = 1; i <= max; i += 1) {
    const nodes: ReactNode[] = [];
    let itemActive = false;
    for (let k = 1; k <= steps; k += 1) {
      const itemValue = Number((i - 1 + k / steps).toFixed(4));
      if (hover !== null && itemValue === hover) itemActive = true;
      const filled = display !== null && (highlightSelectedOnly ? itemValue === display : itemValue <= display);
      const partial = k < steps;
      const visualClass = cx(
        'mtx-rating__label',
        partial && 'mtx-rating__label--partial',
        filled && 'mtx-rating__label--filled',
        hover !== null && itemValue === hover && 'mtx-rating__label--hover',
      );
      const visualStyle = partial ? { width: `${(k / steps) * 100}%`, zIndex: steps - k } : undefined;
      const icons = (
        <>
          <RatingIcon icon={icon} kind="filled" />
          <RatingIcon icon={emptyIcon} kind="empty" />
        </>
      );
      if (readOnly) {
        nodes.push(
          <span key={k} className={visualClass} style={visualStyle} data-rating-value={String(itemValue)}>
            {icons}
          </span>,
        );
      } else {
        const id = inputId(itemValue);
        nodes.push(
          <input
            key={`input-${k}`}
            type="radio"
            className="mtx-rating__input"
            name={name}
            value={String(itemValue)}
            id={id}
            checked={value === itemValue}
            disabled={disabled || undefined}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputFocus}
          />,
          <label key={`label-${k}`} className={visualClass} style={visualStyle} data-rating-value={String(itemValue)} htmlFor={id}>
            {icons}
            <span className="mtx-rating__visually-hidden">{labelFor(itemValue)}</span>
          </label>,
        );
      }
    }
    items.push(
      <span
        key={i}
        ref={(node) => {
          itemsRef.current[i - 1] = node;
        }}
        className={cx('mtx-rating__item', steps > 1 && 'mtx-rating__item--decimal', itemActive && 'mtx-rating__item--active')}
      >
        {nodes}
      </span>,
    );
  }

  return (
    <span
      ref={ref}
      className={cx(
        'mtx-rating',
        size !== 'medium' && `mtx-rating--${size}`,
        readOnly && 'mtx-rating--read-only',
        hover !== null && 'mtx-rating--hovering',
        disabled && 'mtx-rating--disabled',
        className,
      )}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled ? true : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onBlur={handleRootBlur}
      {...rest}
    >
      {items}
      {readOnly ? null : (
        <>
          <input
            type="radio"
            className="mtx-rating__input mtx-rating__input--empty"
            name={name}
            value=""
            id={inputId(null)}
            checked={value === null}
            disabled={disabled || undefined}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <label className="mtx-rating__visually-hidden" htmlFor={inputId(null)}>
            {emptyLabelText ?? t('empty', null, 'Empty')}
          </label>
        </>
      )}
    </span>
  );
});
