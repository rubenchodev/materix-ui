'use client';
/**
 * TextField: campo de texto con label flotante, NotchedOutline, adornos, contadores, máscaras y validación
 * (port de `text-field.js` de Materix UI vanilla).
 */
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';
import type {
  ChangeEvent,
  FocusEventHandler,
  HTMLAttributes,
  InputHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/text-field.css';
import '@rubenchodev/materix-ui/components/icon-button.css';
import { cx, useControlled, useEnhancedEffect, useForkRef } from '../../core';
import { useT } from '../../i18n';
import { applyMaskInput, countWords, formatMasked, isMaskComplete, resolveMask, unmaskValue } from '../../utils/masks';
import type { CurrencyMaskOptions } from '../../utils/masks';
import { useFormControl } from '../form-helper-text/FormControlContext';
import { hasContent } from '../form-helper-text/FormHelperText';
import { IconButton } from '../icon-button/IconButton';

/** Variantes: `outlined` (por defecto), `filled`, `standard` y `no-label` (outlined sin label, para buscadores). */
export type TextFieldVariant = 'outlined' | 'filled' | 'standard' | 'no-label';

/** Tamaños: `small` 40px, `medium` 56px (por defecto) y `large` 48px. */
export type TextFieldSize = 'small' | 'medium' | 'large';

/** Color de foco (label, borde y subrayado). */
export type TextFieldColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info';

/** Margen vertical como el prop `margin` de MUI. */
export type TextFieldMargin = 'none' | 'dense' | 'normal';

/** Tipo de contador bajo el campo. */
export type TextFieldCounter = 'characters' | 'words' | 'both';

/** Posición de un adorno. */
export type TextFieldAdornmentPosition = 'start' | 'end';

/** Elemento nativo del campo. */
export type TextFieldInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Detalle de {@link TextFieldProps.onAdornmentClick} (equivale a `mtx:text-field:adornment-click`). */
export interface TextFieldAdornmentClickDetail {
  /** Posición del adorno pulsado. */
  position: TextFieldAdornmentPosition;
  /** Botón pulsado. */
  button: HTMLButtonElement;
  /** Control nativo del campo. */
  input: TextFieldInputElement | null;
}

/** Datos extra de {@link TextFieldProps.onChange}. */
export interface TextFieldChangeDetails {
  /** Valor sin el formato de la máscara (igual a `value` si no hay máscara). */
  unmaskedValue: string;
  /** `true` si la máscara tiene todos sus slots llenos (siempre `true` sin máscara). */
  isMaskComplete: boolean;
}

/** Props de {@link TextField}. `className`, `style` y el resto de atributos van al `<div>` raíz. */
export interface TextFieldProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue' | 'color' | 'onFocus' | 'onBlur' | 'placeholder' | 'inputMode' | 'autoFocus'
  > {
  /** Variante visual. */
  variant?: TextFieldVariant;
  /** Tamaño; sin valor usa medium (56px) sin clase. */
  size?: TextFieldSize;
  /** Color de foco. */
  color?: TextFieldColor;
  /** Texto del label flotante (también dibuja la muesca del borde outlined). */
  label?: ReactNode;
  /** Valor (modo controlado). Con máscara se muestra formateado. */
  value?: string | number | null;
  /** Valor inicial (modo no controlado). */
  defaultValue?: string | number | null;
  /** Se invoca en cada cambio con el valor (ya formateado si hay máscara) y el valor limpio. */
  onChange?: (event: ChangeEvent<TextFieldInputElement>, value: string, details: TextFieldChangeDetails) => void;
  /** Placeholder; sin `label` se usa como label (como vanilla). */
  placeholder?: string;
  /** Texto de ayuda bajo el campo (en rojo si hay error). */
  helperText?: ReactNode;
  /** Estado de error (`--error` + `aria-invalid`); por defecto lo hereda de FormControl. */
  error?: boolean;
  /** Deshabilita el campo y sus adornos (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Solo lectura. */
  readOnly?: boolean;
  /** Obligatorio: añade el asterisco al label (por defecto lo hereda de FormControl). */
  required?: boolean;
  /** Ocupa todo el ancho disponible. */
  fullWidth?: boolean;
  /** Margen vertical (`dense` 8/4px, `normal` 16/8px). */
  margin?: TextFieldMargin;
  /** Label siempre arriba con el placeholder visible. */
  staticLabel?: boolean;
  /** Oculta el label visualmente (sin muesca); requiere `aria-label` o `placeholder`. */
  hiddenLabel?: boolean;
  /** Sin borde ni fondo. */
  borderless?: boolean;
  /** Icono inicial: nombre de Material Icons, URL de imagen o nodo. */
  startIcon?: ReactNode;
  /** Icono final: nombre de Material Icons, URL de imagen o nodo. */
  endIcon?: ReactNode;
  /** Adorno inicial libre (prefijo de texto como `$`). Prevalece sobre `startIcon` y mantiene el label flotando. */
  startAdornment?: ReactNode;
  /** Adorno final libre. Prevalece sobre el resto de adornos finales. */
  endAdornment?: ReactNode;
  /** Botón de acción inicial (IconButton): nombre de Material Icons o nodo. */
  startAction?: ReactNode;
  /** Nombre accesible del botón de acción inicial. */
  startActionLabel?: string;
  /** Botón de acción final (IconButton): nombre de Material Icons o nodo. */
  endAction?: ReactNode;
  /** Nombre accesible del botón de acción final. */
  endActionLabel?: string;
  /** Clic en un botón de acción (`mtx:text-field:adornment-click`). */
  onAdornmentClick?: (detail: TextFieldAdornmentClickDetail) => void;
  /** Botón mostrar/ocultar contraseña (solo con `type="password"`). */
  passwordToggle?: boolean;
  /** Nombre accesible del botón de contraseña (por defecto, traducido). */
  passwordToggleLabel?: string;
  /** Contraseña visible (modo controlado). */
  passwordVisible?: boolean;
  /** Contraseña visible al montar (modo no controlado). */
  defaultPasswordVisible?: boolean;
  /** Cambio de visibilidad de la contraseña (`mtx:text-field:password-visibility`). */
  onPasswordVisibilityChange?: (visible: boolean) => void;
  /** Renderiza un `<textarea>`. */
  multiline?: boolean;
  /** Filas del `<textarea>` (por defecto 3). */
  rows?: number;
  /** Filas mínimas: fija `rows` y activa el auto-resize. */
  minRows?: number;
  /** Filas máximas del auto-resize antes de mostrar scroll; activa el auto-resize. */
  maxRows?: number;
  /** Crece con el contenido (solo multiline). */
  autoResize?: boolean;
  /** Contador bajo el campo; se activa solo con `maxChars`/`maxWords`. */
  counter?: TextFieldCounter | boolean;
  /** Límite de caracteres del contador (sin bloquear la escritura); por defecto `maxLength`. */
  maxChars?: number;
  /** Límite de palabras del contador. */
  maxWords?: number;
  /** Máscara: patrón (`0` dígito, `a`/`A` letra, `*` alfanumérico), atajo (`phone`, `date`…) o `currency`. */
  mask?: string;
  /** Opciones de la máscara `currency` (prefijo, sufijo, separadores y decimales). */
  currencyOptions?: Partial<CurrencyMaskOptions>;
  /** Renderiza un `<select>` nativo con chevron; las opciones van en `children`. */
  select?: boolean;
  /** Opciones `<option>` cuando `select` es `true`. */
  children?: ReactNode;
  /** Idioma propio del componente (textos del contador y del botón de contraseña). */
  locale?: string;
  /** Id del control nativo (se genera si falta). */
  id?: string;
  /** Nombre del campo en el formulario. */
  name?: string;
  /** Tipo del `<input>` (`text` por defecto). */
  type?: string;
  /** Autocompletado nativo. */
  autoComplete?: string;
  /** Enfoca el campo al montar. */
  autoFocus?: boolean;
  /** Teclado virtual. */
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  /** Longitud máxima nativa (también fija el límite del contador). */
  maxLength?: number;
  /** Longitud mínima nativa. */
  minLength?: number;
  /** Formulario asociado. */
  form?: string;
  /** Ref al control nativo. */
  inputRef?: Ref<TextFieldInputElement> | Ref<HTMLInputElement> | Ref<HTMLTextAreaElement> | Ref<HTMLSelectElement>;
  /** Atributos extra del control nativo. */
  inputProps?: InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: string | undefined };
  /** Foco del control. */
  onFocus?: FocusEventHandler<TextFieldInputElement>;
  /** Pérdida de foco del control. */
  onBlur?: FocusEventHandler<TextFieldInputElement>;
}

const COLORS: TextFieldColor[] = ['secondary', 'success', 'warning', 'info'];
const DATE_TYPES = ['date', 'time', 'datetime-local', 'month', 'week'];

/** Padding horizontal del input por variante: posición de un adorno inicial de texto. */
const TEXT_ADORNMENT_INSET: Record<Exclude<TextFieldVariant, 'no-label'>, number> = { outlined: 14, filled: 12, standard: 0 };

/**
 * Indica si un valor es una URL o ruta de imagen (`_isImageUrl` de vanilla).
 * @param {unknown} src Valor.
 * @returns {boolean} `true` si es una imagen.
 */
export function isImageUrl(src: unknown): src is string {
  return (
    typeof src === 'string' &&
    (src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('/') ||
      src.startsWith('./') ||
      src.startsWith('../') ||
      src.startsWith('data:image/') ||
      /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(src))
  );
}

/**
 * Icono decorativo de adorno: imagen, Material Icon o nodo dentro de `.mtx-text-field__adornment`.
 * @param {ReactNode} icon Icono.
 * @param {TextFieldAdornmentPosition} position Posición.
 * @returns {ReactElement} Adorno.
 */
function renderIconAdornment(icon: ReactNode, position: TextFieldAdornmentPosition): ReactElement {
  const base = `mtx-text-field__adornment mtx-text-field__adornment--${position}`;
  if (isImageUrl(icon)) return <img src={icon} alt="" className={`${base} mtx-text-field__adornment--image`} />;
  if (typeof icon === 'string') {
    return (
      <span className={`${base} material-icons`} aria-hidden="true">
        {icon}
      </span>
    );
  }
  return (
    <span className={base} aria-hidden="true">
      {icon}
    </span>
  );
}

/**
 * Ajusta la altura del `<textarea>` a su contenido, con tope opcional de filas (`_adjustAutoResize`).
 * @param {HTMLTextAreaElement} input Textarea.
 * @param {number} [maxRows] Filas máximas.
 */
function adjustAutoResize(input: HTMLTextAreaElement, maxRows?: number): void {
  input.style.height = 'auto';
  const { scrollHeight } = input;
  if (scrollHeight <= 0) return;
  if (maxRows && maxRows > 0) {
    const computed = window.getComputedStyle(input);
    const lineHeight = parseFloat(computed.lineHeight) || 24;
    const paddingTop = parseFloat(computed.paddingTop) || 0;
    const paddingBottom = parseFloat(computed.paddingBottom) || 0;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
    if (scrollHeight > maxHeight) {
      input.style.height = `${maxHeight}px`;
      input.style.overflowY = 'auto';
      return;
    }
  }
  input.style.height = `${scrollHeight}px`;
  input.style.overflowY = 'hidden';
}

/**
 * Convierte un valor externo en texto.
 * @param {unknown} value Valor.
 * @returns {string} Texto.
 */
function toText(value: string | number | null | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

/**
 * Campo de texto de MUI (outlined/filled/standard) con label flotante, NotchedOutline, iconos y adornos de
 * acción, contraseña, multiline con auto-resize, contadores, máscaras y validación. Controlado o no controlado.
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(function TextField(props, ref) {
  const {
    variant = 'outlined',
    size,
    color = 'primary',
    label: labelProp,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder: placeholderProp,
    helperText,
    error: errorProp,
    disabled: disabledProp,
    readOnly,
    required: requiredProp,
    fullWidth = false,
    margin = 'none',
    staticLabel = false,
    hiddenLabel = false,
    borderless = false,
    startIcon,
    endIcon,
    startAdornment,
    endAdornment,
    startAction,
    startActionLabel,
    endAction,
    endActionLabel,
    onAdornmentClick,
    passwordToggle = false,
    passwordToggleLabel,
    passwordVisible: passwordVisibleProp,
    defaultPasswordVisible = false,
    onPasswordVisibilityChange,
    multiline = false,
    rows,
    minRows,
    maxRows,
    autoResize: autoResizeProp,
    counter,
    maxChars: maxCharsProp,
    maxWords,
    mask: maskProp,
    currencyOptions,
    select = false,
    children,
    locale,
    id: idProp,
    name,
    type: typeProp,
    autoComplete,
    autoFocus,
    inputMode,
    maxLength,
    minLength,
    form,
    inputRef: inputRefProp,
    inputProps,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedByProp,
    className,
    ...rest
  } = props;

  const t = useT('textField', locale);
  const formControl = useFormControl();
  const autoId = useId();
  const id = idProp ?? inputProps?.id ?? `mtx-text-field-${autoId.replace(/:/g, '')}`;
  const supportId = `${id}-helper-text`;

  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const required = requiredProp ?? formControl?.required ?? false;

  const inputElRef = useRef<TextFieldInputElement>(null);
  const freeStartRef = useRef<HTMLSpanElement>(null);
  const handleInputRef = useForkRef<TextFieldInputElement>(inputElRef, inputRefProp as Ref<TextFieldInputElement>);

  // Máscara (las opciones se comparan por contenido para no recrearla en cada render).
  const currencyKey = JSON.stringify(currencyOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mask = useMemo(() => (select ? null : resolveMask(maskProp, currencyOptions)), [select, maskProp, currencyKey]);

  const isControlled = valueProp !== undefined;
  const initialValue = useRef(formatMasked(toText(defaultValue), mask)).current;
  const [stateValue, setStateValue] = useControlled<string>({
    controlled: isControlled ? toText(valueProp) : undefined,
    default: initialValue,
    name: 'TextField',
  });
  const value = mask ? formatMasked(stateValue, mask) : stateValue;

  // Contraseña.
  const type = typeProp ?? inputProps?.type ?? 'text';
  const hasPasswordToggle = passwordToggle && type.toLowerCase() === 'password' && !multiline && !select;
  const [passwordVisible, setPasswordVisible] = useControlled<boolean>({
    controlled: passwordVisibleProp,
    default: defaultPasswordVisible,
    name: 'TextField',
    state: 'passwordVisible',
  });
  const showPassword = hasPasswordToggle && passwordVisible;
  const pendingSelection = useRef<[number, number] | null>(null);

  // Label: `label` o, sin él, el placeholder (como vanilla).
  const isNoLabel = variant === 'no-label';
  const placeholderText = (placeholderProp ?? '').trim();
  const labelFromPlaceholder = !hasContent(labelProp) && !isNoLabel && placeholderText !== '';
  const label: ReactNode = hasContent(labelProp) ? labelProp : labelFromPlaceholder ? placeholderText : null;
  const placeholder = labelFromPlaceholder || !placeholderProp ? ' ' : placeholderProp;

  // Multiline y auto-resize.
  const autoResize = multiline && (autoResizeProp ?? (minRows !== undefined || maxRows !== undefined));
  const textareaRows = rows ?? minRows ?? 3;

  // Contador.
  const maxChars = maxCharsProp ?? maxLength ?? inputProps?.maxLength ?? undefined;
  const counterMode = counter === true ? 'characters' : counter || '';
  let counterType: TextFieldCounter | null = null;
  if (counterMode === 'words' || (!counterMode && maxWords && !maxChars)) counterType = 'words';
  else if (counterMode === 'both' || (maxWords && maxChars)) counterType = 'both';
  else if (counterMode || maxChars) counterType = 'characters';

  let counterText = '';
  let overMax = false;
  if (counterType) {
    const charCount = value.length;
    const wordCount = countWords(value);
    if (counterType === 'both') {
      const words = maxWords ? `${wordCount}/${maxWords}` : `${wordCount}`;
      const chars = maxChars ? `${charCount}/${maxChars}` : `${charCount}`;
      counterText = `${t('counterWordsShort', { value: words }, '{value} words')} | ${t('counterCharsShort', { value: chars }, '{value} chars')}`;
      overMax = Boolean((maxWords && wordCount > maxWords) || (maxChars && charCount > maxChars));
    } else if (counterType === 'words') {
      counterText = maxWords ? `${wordCount} / ${maxWords}` : t('counterWords', { count: wordCount }, '{count} words');
      overMax = Boolean(maxWords && wordCount > maxWords);
    } else {
      counterText = maxChars ? `${charCount} / ${maxChars}` : `${charCount}`;
      overMax = Boolean(maxChars && charCount > maxChars);
    }
  }
  const invalid = error || overMax;

  const hasSupport = hasContent(helperText) || Boolean(counterType);
  const describedBy = Array.from(
    new Set(
      [
        ...(ariaDescribedByProp ?? inputProps?.['aria-describedby'] ?? '').split(/\s+/),
        hasSupport ? supportId : '',
        // Con helperText propio no se enlazan los helpers del FormControl (serían de otros campos).
        ...(hasContent(helperText) ? [] : (formControl?.helperTextIds ?? [])),
      ].filter(Boolean),
    ),
  ).join(' ');

  // Estado `--has-value`.
  const isDateTime = DATE_TYPES.includes(type.toLowerCase());
  const hasVisiblePlaceholder = placeholder.trim() !== '';
  // Un adorno inicial libre (texto de ancho variable) mantiene el label flotando, como `shrink` en MUI.
  const hasValue = value.trim() !== '' || hasVisiblePlaceholder || isDateTime || select || hasContent(startAdornment);

  // Adornos: inicio (libre > icono > acción) y fin (libre > contraseña > acción > icono), como vanilla.
  const fireAction = (position: TextFieldAdornmentPosition) => (event: ReactMouseEvent<HTMLElement>) => {
    onAdornmentClick?.({ position, button: event.currentTarget as HTMLButtonElement, input: inputElRef.current });
  };
  const keepFocus = (event: ReactMouseEvent<HTMLElement>) => event.preventDefault();
  const actionButton = (position: TextFieldAdornmentPosition, icon: ReactNode, buttonLabel: string | undefined, extra: Record<string, unknown> = {}) => (
    <span className={`mtx-text-field__adornment mtx-text-field__adornment--${position} mtx-text-field__adornment--action`}>
      <IconButton
        className={`mtx-text-field__action mtx-text-field__action--${position}`}
        size={size === 'small' ? 'small' : 'medium'}
        icon={icon}
        aria-label={buttonLabel || undefined}
        disabled={disabled}
        onMouseDown={keepFocus}
        {...extra}
      />
    </span>
  );

  let startNode: ReactNode = null;
  // Adorno inicial de texto: sin `--start` para que el CSS de icono (translate 32px) no desplace el label;
  // se sitúa en el padding horizontal del input y el label flotado queda al inicio del campo, como MUI.
  const freeStart = hasContent(startAdornment);
  if (freeStart) {
    startNode = (
      <span
        ref={freeStartRef}
        className="mtx-text-field__adornment"
        style={{ marginInlineStart: TEXT_ADORNMENT_INSET[isNoLabel ? 'outlined' : variant], marginInlineEnd: 8 }}
      >
        {startAdornment}
      </span>
    );
  } else if (hasContent(startIcon)) {
    startNode = renderIconAdornment(startIcon, 'start');
  } else if (hasContent(startAction)) {
    startNode = actionButton('start', startAction, startActionLabel, { onClick: fireAction('start') });
  }

  const togglePassword = () => {
    const input = inputElRef.current;
    if (input && input.ownerDocument.activeElement === input && 'selectionStart' in input && input.selectionStart !== null) {
      pendingSelection.current = [input.selectionStart, (input as HTMLInputElement).selectionEnd ?? input.selectionStart];
    }
    const next = !passwordVisible;
    setPasswordVisible(next);
    onPasswordVisibilityChange?.(next);
  };

  let endNode: ReactNode = null;
  if (hasContent(endAdornment)) {
    endNode = <span className="mtx-text-field__adornment mtx-text-field__adornment--end">{endAdornment}</span>;
  } else if (hasPasswordToggle) {
    endNode = actionButton('end', showPassword ? 'visibility_off' : 'visibility', passwordToggleLabel || t('showPassword', null, 'Show password'), {
      'aria-pressed': showPassword,
      'aria-controls': id,
      onClick: togglePassword,
    });
  } else if (hasContent(endAction)) {
    endNode = actionButton('end', endAction, endActionLabel, { onClick: fireAction('end') });
  } else if (hasContent(endIcon)) {
    endNode = renderIconAdornment(endIcon, 'end');
  }

  // Restaura la selección tras cambiar el tipo del input (vanilla `togglePasswordVisibility`).
  useEnhancedEffect(() => {
    const selection = pendingSelection.current;
    const input = inputElRef.current as HTMLInputElement | null;
    if (!selection || !input) return;
    pendingSelection.current = null;
    try {
      input.setSelectionRange(selection[0], selection[1]);
    } catch {
      /* tipo sin selección */
    }
  }, [showPassword]);

  // Adorno de texto: lo baja lo mismo que el texto del input (padding superior − inferior), como el marginTop de MUI.
  useEnhancedEffect(() => {
    const adornment = freeStartRef.current;
    const input = inputElRef.current;
    if (!adornment || !input || multiline) return;
    const computed = window.getComputedStyle(input);
    const offset = (parseFloat(computed.paddingTop) || 0) - (parseFloat(computed.paddingBottom) || 0);
    adornment.style.marginTop = offset ? `${offset}px` : '';
  }, [freeStart, variant, size, hiddenLabel, multiline]);

  // Auto-resize del textarea en cada cambio de valor y tras el primer pintado.
  useEnhancedEffect(() => {
    const input = inputElRef.current;
    if (autoResize && input instanceof HTMLTextAreaElement) adjustAutoResize(input, maxRows);
  }, [value, autoResize, maxRows]);
  useEffect(() => {
    if (!autoResize) return undefined;
    const frame = requestAnimationFrame(() => {
      const input = inputElRef.current;
      if (input instanceof HTMLTextAreaElement) adjustAutoResize(input, maxRows);
    });
    return () => cancelAnimationFrame(frame);
  }, [autoResize, maxRows]);

  // Modo no controlado: un `reset` del formulario restaura el valor nativo; se resincroniza el estado.
  useEffect(() => {
    const input = inputElRef.current;
    const owner = input?.form;
    if (isControlled || !input || !owner) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleReset = () => {
      timer = setTimeout(() => {
        if (inputElRef.current) setStateValue(inputElRef.current.value);
      }, 0);
    };
    owner.addEventListener('reset', handleReset);
    return () => {
      owner.removeEventListener('reset', handleReset);
      if (timer) clearTimeout(timer);
    };
  }, [isControlled, setStateValue]);

  const handleChange = (event: ChangeEvent<TextFieldInputElement>) => {
    const input = event.target;
    let next = input.value;
    if (mask && !(input instanceof HTMLSelectElement)) {
      const result = applyMaskInput(input.value, input.selectionStart ?? input.value.length, mask, {
        previousValue: value,
        inputType: (event.nativeEvent as InputEvent).inputType,
      });
      if (result.value !== input.value) input.value = result.value;
      try {
        if (input.ownerDocument.activeElement === input) input.setSelectionRange(result.cursor, result.cursor);
      } catch {
        /* tipos sin selección (email, number) */
      }
      next = result.value;
    }
    setStateValue(next);
    (inputProps?.onChange as ((e: ChangeEvent<TextFieldInputElement>) => void) | undefined)?.(event);
    onChange?.(event, next, { unmaskedValue: unmaskValue(next, mask), isMaskComplete: isMaskComplete(next, mask) });
  };

  const rootClassName = cx(
    'mtx-text-field',
    className,
    isNoLabel ? 'mtx-text-field--outlined mtx-text-field--no-label' : `mtx-text-field--${variant}`,
    size && `mtx-text-field--${size}`,
    COLORS.includes(color) && `mtx-text-field--${color}`,
    startNode && !freeStart && 'mtx-text-field--adorned-start',
    endNode && 'mtx-text-field--adorned-end',
    multiline && !select && 'mtx-text-field--multiline',
    autoResize && 'mtx-text-field--auto-resize',
    select && 'mtx-text-field--select',
    staticLabel && 'mtx-text-field--static-label',
    hiddenLabel && 'mtx-text-field--hidden-label',
    borderless && 'mtx-text-field--borderless',
    margin !== 'none' && `mtx-text-field--margin-${margin}`,
    fullWidth && 'mtx-text-field--full-width',
    hasValue && 'mtx-text-field--has-value',
    invalid && 'mtx-text-field--error',
  );

  // Valor: controlado con `value`; no controlado con `defaultValue` (el reset nativo del formulario funciona).
  const valueProps = isControlled
    ? { value }
    : { defaultValue: select && defaultValue === undefined ? undefined : initialValue };
  const commonProps = {
    ...(inputProps as Record<string, unknown>),
    style: freeStart ? { ...inputProps?.style, paddingInlineStart: 0 } : inputProps?.style,
    ref: handleInputRef,
    className: cx('mtx-text-field__input', inputProps?.className),
    id,
    name: name ?? inputProps?.name,
    form: form ?? inputProps?.form,
    autoFocus: autoFocus ?? inputProps?.autoFocus,
    disabled,
    required: required || undefined,
    'aria-invalid': invalid ? true : undefined,
    'aria-label': ariaLabel ?? inputProps?.['aria-label'],
    'aria-labelledby': ariaLabelledBy ?? inputProps?.['aria-labelledby'],
    'aria-describedby': describedBy || undefined,
    onChange: handleChange,
    onFocus: onFocus ?? inputProps?.onFocus,
    onBlur: onBlur ?? inputProps?.onBlur,
    ...valueProps,
  } as Record<string, unknown>;

  const textProps = {
    placeholder,
    readOnly: readOnly ?? inputProps?.readOnly,
    autoComplete: autoComplete ?? inputProps?.autoComplete,
    inputMode: inputMode ?? inputProps?.inputMode,
    maxLength: maxLength ?? inputProps?.maxLength,
    minLength: minLength ?? inputProps?.minLength,
  };

  let control: ReactElement;
  if (select) {
    control = <select {...(commonProps as HTMLAttributes<HTMLSelectElement>)}>{children}</select>;
  } else if (multiline) {
    control = <textarea {...(commonProps as HTMLAttributes<HTMLTextAreaElement>)} {...textProps} rows={textareaRows} />;
  } else {
    control = <input {...(commonProps as InputHTMLAttributes<HTMLInputElement>)} {...textProps} type={showPassword ? 'text' : type} />;
  }

  const showLegend = label !== null && !hiddenLabel;
  const isOutlined = variant === 'outlined' || isNoLabel;

  return (
    <div ref={ref} className={rootClassName} {...rest}>
      {label !== null ? (
        <label className="mtx-text-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="mtx-text-field__container">
        {startNode}
        {control}
        {endNode}
        {select ? (
          <span className="mtx-text-field__chevron">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" focusable="false" aria-hidden="true">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </span>
        ) : null}
        {isOutlined ? (
          <fieldset className="mtx-text-field__outline" aria-hidden="true">
            {showLegend ? (
              <legend className="mtx-text-field__legend">
                <span>{label}</span>
              </legend>
            ) : null}
          </fieldset>
        ) : null}
      </div>
      {hasSupport ? (
        <div className="mtx-text-field__supporting-text" id={supportId}>
          <span className="mtx-text-field__helper-text">{hasContent(helperText) ? helperText : null}</span>
          {counterType ? (
            <span className={cx('mtx-text-field__counter', overMax && 'mtx-text-field__counter--error')} aria-live="polite">
              {counterText}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
