'use client';
/**
 * Autocomplete: campo de texto con lista de sugerencias filtrable (patrón WAI-ARIA 1.2 combobox + listbox),
 * port de `autocomplete.js` de Materix UI vanilla con la API de `Autocomplete` de MUI.
 */
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/text-field.css';
import '@rubenchodev/materix-ui/components/autocomplete.css';
import {
  Portal,
  autoUpdate,
  cx,
  markEscapeHandled,
  positionDropdown,
  useControlled,
  useEnhancedEffect,
  useForkRef,
  useLayer,
} from '../../core';
import type { Side } from '../../core';
import { useT } from '../../i18n';
import { normalizeText, splitMatch } from '../../utils/text';
import { Chip } from '../chip';
import { CircularProgress } from '../progress';
import { isImageUrl } from '../text-field/TextField';
import { useFormControl } from '../form-helper-text/FormControlContext';

/** Salto de PageUp/PageDown (igual que `pageSize` de MUI). */
const PAGE_SIZE = 5;

/** Colores de foco que entiende TextField. */
const FIELD_COLORS = ['secondary', 'success', 'warning', 'info'];

/** Valor vacío estable de `multiple`. */
const EMPTY: readonly unknown[] = [];

/** Marca de "ninguna opción activa a propósito" (no aplica `autoHighlight`). */
const NONE = '\u0000none';

/** Opción como objeto (formato de vanilla); también se admiten textos y objetos arbitrarios con `getOptionLabel`. */
export interface AutocompleteOption {
  /** Valor enviado con el formulario (por defecto, la etiqueta). */
  value?: string | number;
  /** Texto visible (por defecto, el valor). */
  label?: string;
  /** Grupo (cabecera fija); agrupa opciones consecutivas, como MUI. */
  group?: string;
  /** Opción no seleccionable. */
  disabled?: boolean;
  /** Icono de Material Icons en la opción y en su chip. */
  icon?: string;
  /** Texto secundario bajo la etiqueta. */
  description?: ReactNode;
  [extra: string]: unknown;
}

/** Variantes del campo (como TextField). */
export type AutocompleteVariant = 'outlined' | 'filled' | 'standard';
/** Tamaños: `medium` 56px (por defecto) y `small` 40px. */
export type AutocompleteSize = 'medium' | 'small';
/** Color de foco del campo y de la opción seleccionada. */
export type AutocompleteColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
/** Motivos de `onChange` (`mtx:autocomplete:change`). */
export type AutocompleteChangeReason = 'selectOption' | 'createOption' | 'removeOption' | 'clear' | 'blur';
/** Motivos de `onInputChange` (`mtx:autocomplete:input`). */
export type AutocompleteInputChangeReason = 'input' | 'reset' | 'clear';
/** Motivos de `onOpen` (`mtx:autocomplete:open`). */
export type AutocompleteOpenReason = 'input' | 'keyboard' | 'toggleInput' | 'focus';
/** Motivos de `onClose` (`mtx:autocomplete:close`). */
export type AutocompleteCloseReason =
  | 'escape'
  | 'blur'
  | 'selectOption'
  | 'createOption'
  | 'toggleInput'
  | 'reset'
  | 'disabled';
/** Motivos de `onHighlightChange` (`mtx:autocomplete:highlight`). */
export type AutocompleteHighlightReason = 'keyboard' | 'mouse' | 'auto';

/** Evento de origen de los callbacks (`null` cuando el cambio no viene de una interacción). */
export type AutocompleteEvent = SyntheticEvent | Event | null;

/** Valor según `multiple` y `freeSolo` (como MUI). */
export type AutocompleteValue<T, Multiple, FreeSolo> = Multiple extends true
  ? Array<T | (FreeSolo extends true ? string : never)>
  : T | null | (FreeSolo extends true ? string : never);

/** Estado que recibe `filterOptions`. */
export interface AutocompleteFilterState<T> {
  /** Texto de búsqueda (vacío si el input muestra la selección sin editar). */
  inputValue: string;
  /** Etiqueta de una opción. */
  getOptionLabel: (option: T) => string;
}

/** Estado que recibe `renderOption`. */
export interface AutocompleteRenderOptionState {
  /** Índice en la lista filtrada. */
  index: number;
  /** La opción forma parte del valor. */
  selected: boolean;
  /** Texto buscado (para resaltar). */
  inputValue: string;
}

/** Props de {@link Autocomplete}. `className`, `style` y el resto de atributos van al `<div>` raíz. */
export interface AutocompleteProps<T, Multiple extends boolean | undefined = false, FreeSolo extends boolean | undefined = false>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color' | 'placeholder' | 'children'> {
  /** Opciones: textos u objetos `{ value, label, group?, disabled?, icon?, description? }`. */
  options: readonly T[];
  /** Etiqueta visible de una opción (por defecto `label`, `value` o el propio texto). */
  getOptionLabel?: (option: T) => string;
  /** Clave única de una opción (inputs ocultos, comparación); por defecto `value` o la etiqueta. */
  getOptionValue?: (option: T) => string;
  /** Igualdad entre opción y valor; por defecto compara sus claves. */
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  /** Opción deshabilitada (por defecto `option.disabled`). */
  getOptionDisabled?: (option: T) => boolean;
  /** Grupo de una opción (por defecto `option.group`). */
  groupBy?: (option: T) => string;
  /** Contenido propio de cada opción (sustituye icono, etiqueta resaltada y descripción). */
  renderOption?: (option: T, state: AutocompleteRenderOptionState) => ReactNode;
  /** Filtro propio, o `false` para no filtrar ni resaltar (filtrado en servidor, como `data-filter="false"`). */
  filterOptions?: ((options: T[], state: AutocompleteFilterState<T>) => T[]) | false;
  /** `start` solo coincide al inicio de la etiqueta (`data-match-from`). */
  matchFrom?: 'any' | 'start';
  /** Selección múltiple con chips. */
  multiple?: Multiple;
  /** Acepta valores que no están en la lista. */
  freeSolo?: FreeSolo;
  /** Valor (modo controlado): opción, clave de opción o texto libre; array en `multiple`. */
  value?: NoInfer<AutocompleteValue<T, Multiple, FreeSolo> | (Multiple extends true ? string[] : string)>;
  /** Valor inicial (modo no controlado); también admite claves (`'co'`). */
  defaultValue?: NoInfer<AutocompleteValue<T, Multiple, FreeSolo> | (Multiple extends true ? string[] : string)>;
  /** Cambio del valor por el usuario (`mtx:autocomplete:change`). */
  onChange?: (
    event: AutocompleteEvent,
    value: AutocompleteValue<T, Multiple, FreeSolo>,
    reason: AutocompleteChangeReason,
    details: { option: T | string | null },
  ) => void;
  /** Texto del input (modo controlado). */
  inputValue?: string;
  /** Cambio del texto (`mtx:autocomplete:input`); con `debounce`, el motivo `input` espera a que el usuario pare. */
  onInputChange?: (event: AutocompleteEvent, value: string, reason: AutocompleteInputChangeReason) => void;
  /** Espera en ms antes de notificar `onInputChange` al escribir (solo con `inputValue` no controlado). */
  debounce?: number;
  /** Popup abierto (modo controlado). */
  open?: boolean;
  /** Petición de apertura (`mtx:autocomplete:open`). */
  onOpen?: (event: AutocompleteEvent, reason: AutocompleteOpenReason) => void;
  /** Petición de cierre (`mtx:autocomplete:close`). */
  onClose?: (event: AutocompleteEvent, reason: AutocompleteCloseReason) => void;
  /** Cambio de la opción activa (`mtx:autocomplete:highlight`). */
  onHighlightChange?: (event: AutocompleteEvent, option: T | null, reason: AutocompleteHighlightReason) => void;
  /** Chips visibles sin foco (`+N` para el resto). */
  limitTags?: number;
  /** Oculta de la lista las opciones ya elegidas (múltiple). */
  filterSelectedOptions?: boolean;
  /** Sin botón de limpiar. */
  disableClearable?: boolean;
  /** Escape con el popup cerrado limpia el valor. */
  clearOnEscape?: boolean;
  /** Mantiene el popup abierto al elegir (múltiple). */
  disableCloseOnSelect?: boolean;
  /** Abre al enfocar. */
  openOnFocus?: boolean;
  /** Activa la primera opción al filtrar. */
  autoHighlight?: boolean;
  /** Tab o la pérdida de foco aceptan la opción activa. */
  autoSelect?: boolean;
  /** Las flechas pasan por el input (ninguna opción activa) al llegar a los extremos. */
  includeInputInList?: boolean;
  /** Muestra el botón abrir/cerrar (`auto`: oculto en `freeSolo`). */
  forcePopupIcon?: boolean | 'auto';
  /** Deshabilita el componente (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Muestra el valor sin permitir cambiarlo. */
  readOnly?: boolean;
  /** Obligatorio (validación nativa mientras no haya valor; por defecto lo hereda de FormControl). */
  required?: boolean;
  /** Indicador de carga (CircularProgress y texto "Loading…" sin opciones). */
  loading?: boolean;
  /** Texto de carga (por defecto i18n). */
  loadingText?: ReactNode;
  /** Texto sin opciones (por defecto i18n). */
  noOptionsText?: ReactNode;
  /** Variante del campo. */
  variant?: AutocompleteVariant;
  /** Tamaño del campo y de los chips. */
  size?: AutocompleteSize;
  /** Color de foco y de la opción seleccionada. */
  color?: AutocompleteColor;
  /** Label flotante. */
  label?: ReactNode;
  /** Placeholder (sin `label` se usa como label, como TextField). */
  placeholder?: string;
  /** Texto de ayuda (en rojo con `error`). */
  helperText?: ReactNode;
  /** Estado de error (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Icono inicial: nombre de Material Icons, URL de imagen o nodo. */
  startIcon?: ReactNode;
  /** Nombre del campo: se envía en inputs ocultos (uno por valor, o CSV). */
  name?: string;
  /** Formulario asociado a los inputs ocultos. */
  form?: string;
  /** `multiple`: un input por valor (por defecto) o uno solo separado (`csv`). */
  valueFormat?: 'multiple' | 'csv';
  /** Separador de `valueFormat="csv"`. */
  separator?: string;
  /** Idioma propio de los textos. */
  locale?: string;
  /** Id del input (el listbox, label y opciones derivan de él). */
  id?: string;
  /** Enfoca el input al montar. */
  autoFocus?: boolean;
  /** Ref al `<input>` visible. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos extra del `<input>`. */
  inputProps?: InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: string | undefined };
  /** Clase extra del popup (en el portal). */
  popperClassName?: string;
}

type AnyOption = unknown;

/**
 * Convierte el valor recibido en lista.
 * @param {unknown} value Valor.
 * @returns {unknown[]} Lista sin vacíos.
 */
function toList(value: unknown): unknown[] {
  const list = Array.isArray(value) ? value : [value];
  return list.filter((item) => item !== null && item !== undefined && item !== '');
}

/**
 * Indica si una opción es un objeto.
 * @param {unknown} option Opción.
 * @returns {boolean} `true` si es un objeto.
 */
function isObject(option: unknown): option is Record<string, unknown> {
  return typeof option === 'object' && option !== null;
}

const CLOSE_ICON = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const ARROW_ICON = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

/**
 * Autocomplete de MUI: búsqueda sin tildes, grupos, múltiple con chips, free solo y carga asíncrona.
 */
function AutocompleteInner<T, Multiple extends boolean | undefined = false, FreeSolo extends boolean | undefined = false>(
  props: AutocompleteProps<T, Multiple, FreeSolo>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    options,
    getOptionLabel,
    getOptionValue,
    isOptionEqualToValue,
    getOptionDisabled,
    groupBy,
    renderOption,
    filterOptions,
    matchFrom = 'any',
    multiple: multipleProp,
    freeSolo: freeSoloProp,
    value: valueProp,
    defaultValue,
    onChange,
    inputValue: inputValueProp,
    onInputChange,
    debounce = 0,
    open: openProp,
    onOpen,
    onClose,
    onHighlightChange,
    limitTags = -1,
    filterSelectedOptions = false,
    disableClearable = false,
    clearOnEscape = false,
    disableCloseOnSelect = false,
    openOnFocus = false,
    autoHighlight = false,
    autoSelect = false,
    includeInputInList = false,
    forcePopupIcon = 'auto',
    disabled: disabledProp,
    readOnly = false,
    required: requiredProp,
    loading = false,
    loadingText,
    noOptionsText,
    variant = 'outlined',
    size = 'medium',
    color = 'primary',
    label: labelProp,
    placeholder: placeholderProp,
    helperText,
    error: errorProp,
    startIcon,
    name,
    form,
    valueFormat = 'multiple',
    separator = ',',
    locale,
    id: idProp,
    autoFocus,
    inputRef: inputRefProp,
    inputProps,
    popperClassName,
    className,
    onFocus: onRootFocus,
    onBlur: onRootBlur,
    onKeyDown: onRootKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;

  const multiple = Boolean(multipleProp);
  // Estados: prop explícita, luego FormControl, luego `false` (como TextField).
  const formControl = useFormControl();
  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const required = requiredProp ?? formControl?.required ?? false;
  const freeSolo = Boolean(freeSoloProp);
  const t = useT('autocomplete', locale);
  const autoId = useId();
  const id = idProp ?? inputProps?.id ?? `mtx-autocomplete-${autoId.replace(/:/g, '')}`;
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;
  const helperId = `${id}-helper-text`;

  // ---------------------------------------------------------------- opciones
  /** Etiqueta visible de una opción o valor libre. */
  const labelOf = (option: AnyOption): string => {
    if (option === null || option === undefined) return '';
    if (!isObject(option)) return String(option);
    if (getOptionLabel) return String(getOptionLabel(option as T) ?? '');
    if (option.label !== undefined && option.label !== null) return String(option.label);
    return option.value !== undefined && option.value !== null ? String(option.value) : '';
  };
  /** Clave única de una opción o valor libre. */
  const keyOf = (option: AnyOption): string => {
    if (!isObject(option)) return option === null || option === undefined ? '' : String(option);
    if (getOptionValue) return String(getOptionValue(option as T));
    if (option.value !== undefined && option.value !== null) return String(option.value);
    return labelOf(option);
  };
  const isEqual = (option: AnyOption, value: AnyOption): boolean => {
    if (isOptionEqualToValue && isObject(option) && isObject(value)) return isOptionEqualToValue(option as T, value as T);
    return keyOf(option) === keyOf(value);
  };
  const disabledOf = (option: AnyOption): boolean =>
    getOptionDisabled ? Boolean(getOptionDisabled(option as T)) : isObject(option) && Boolean(option.disabled);
  const groupOf = (option: AnyOption): string | undefined => {
    const group = groupBy ? groupBy(option as T) : isObject(option) ? option.group : undefined;
    return group === undefined || group === null || group === '' ? undefined : String(group);
  };

  /** Busca la opción de un valor (por igualdad o, si es texto, por etiqueta sin tildes). */
  const resolve = (value: AnyOption): AnyOption => {
    const byValue = options.find((option) => isEqual(option, value));
    if (byValue !== undefined) return byValue;
    if (typeof value === 'string') {
      const normalized = normalizeText(value);
      const byLabel = options.find((option) => normalizeText(labelOf(option)) === normalized);
      if (byLabel !== undefined) return byLabel;
    }
    return value;
  };

  // ---------------------------------------------------------------- valor
  const [valueState, setValueState] = useControlled<unknown>({
    controlled: valueProp,
    default: defaultValue ?? (multiple ? EMPTY : null),
    name: 'Autocomplete',
  });
  const selected = useMemo(() => {
    const seen = new Set<string>();
    const list = toList(valueState)
      .map(resolve)
      .filter((option) => {
        const key = keyOf(option);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return multiple ? list : list.slice(0, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueState, options, multiple]);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const isSelected = (option: AnyOption) => selected.some((value) => isEqual(option, value));

  // ---------------------------------------------------------------- texto
  const initialSelection = useRef(selected).current;
  const initialText = !multiple && initialSelection[0] !== undefined ? labelOf(initialSelection[0]) : '';
  const inputControlled = inputValueProp !== undefined;
  const [inputText, setInputState] = useControlled<string>({
    controlled: inputValueProp,
    default: initialText,
    name: 'Autocomplete',
    state: 'inputValue',
  });
  const inputTextRef = useRef(inputText);
  inputTextRef.current = inputText;

  // ---------------------------------------------------------------- apertura
  const [openState, setOpenState] = useControlled<boolean>({
    controlled: openProp,
    default: false,
    name: 'Autocomplete',
    state: 'open',
  });
  const openRef = useRef(openState);
  openRef.current = openState;
  const popupOpen = openState && !disabled && !readOnly;

  const [dirty, setDirty] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlightState] = useState<string | null>(null);
  const highlightReason = useRef<AutocompleteHighlightReason>('auto');
  const highlightEvent = useRef<AutocompleteEvent>(null);
  const [liveText, setLiveText] = useState('');

  const inputElRef = useRef<HTMLInputElement>(null);
  const handleInputRef = useForkRef<HTMLInputElement>(inputElRef, inputRefProp);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectOnFocusPending = useRef(true);

  // ---------------------------------------------------------------- filtrado
  const inputIsSelectedValue = !multiple && selected.length > 0 && inputText === labelOf(selected[0]);
  // Recién abierto con la selección intacta: se muestran todas las opciones (MUI).
  const query = inputIsSelectedValue && !dirty ? '' : inputText;
  const highlightQuery = filterOptions === false ? '' : query;
  const filtered = useMemo<AnyOption[]>(() => {
    let base: AnyOption[] = options.slice();
    if (multiple && filterSelectedOptions) base = base.filter((option) => !isSelected(option));
    if (filterOptions === false) return base;
    if (filterOptions) return filterOptions(base as T[], { inputValue: query, getOptionLabel: (o: T) => labelOf(o) });
    const needle = normalizeText(query);
    if (!needle.trim()) return base;
    return base.filter((option) => {
      const text = normalizeText(labelOf(option));
      return matchFrom === 'start' ? text.startsWith(needle) : text.includes(needle);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, query, multiple, filterSelectedOptions, filterOptions, matchFrom, selected]);

  const firstEnabled = (list: AnyOption[]) => list.findIndex((option) => !disabledOf(option));
  let activeIndex = -1;
  if (popupOpen && filtered.length) {
    if (highlight !== null && highlight !== NONE) {
      activeIndex = filtered.findIndex((option) => keyOf(option) === highlight && !disabledOf(option));
    }
    if (activeIndex === -1 && highlight !== NONE && autoHighlight) activeIndex = firstEnabled(filtered);
  }
  const activeOption = activeIndex >= 0 ? filtered[activeIndex] : null;
  const activeKey = activeIndex >= 0 ? keyOf(activeOption) : null;

  const hasOptions = filtered.length > 0;
  const showStatus = !hasOptions && (loading || !freeSolo);
  const popupVisible = popupOpen && (hasOptions || showStatus);
  const expanded = popupOpen && hasOptions;
  const hasPopupIcon = forcePopupIcon === 'auto' ? !freeSolo : Boolean(forcePopupIcon);
  const hasClear = !disableClearable && !disabled && !readOnly && (selected.length > 0 || inputText !== '');

  // ---------------------------------------------------------------- textos
  const noOptionsMessage = noOptionsText ?? t('noOptions', null, 'No options');
  const loadingMessage = loadingText ?? t('loading', null, 'Loading…');
  const clearLabel = t('clear', null, 'Clear');
  const popupLabel = popupOpen ? t('close', null, 'Close') : t('open', null, 'Open');

  // ---------------------------------------------------------------- acciones
  /** Fija la opción activa por clave (`null` = automática, `NONE` = ninguna). */
  const setHighlight = (key: string | null, reason: AutocompleteHighlightReason, event: AutocompleteEvent = null) => {
    highlightReason.current = reason;
    highlightEvent.current = event;
    setHighlightState(key);
  };

  /** Cambia el texto y notifica (con debounce opcional al escribir). */
  const changeInput = (event: AutocompleteEvent, text: string, reason: AutocompleteInputChangeReason) => {
    if (text === inputTextRef.current) return;
    inputTextRef.current = text;
    setInputState(text);
    if (!onInputChange) return;
    if (reason === 'input' && debounce > 0 && !inputControlled) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        debounceTimer.current = null;
        onInputChange(event, text, reason);
      }, debounce);
    } else {
      onInputChange(event, text, reason);
    }
  };

  /** Restablece el texto al valor (etiqueta en único, vacío en múltiple). */
  const resetInput = (event: AutocompleteEvent, values: AnyOption[]) => {
    changeInput(event, !multiple && values[0] !== undefined ? labelOf(values[0]) : '', 'reset');
  };

  /** Abre o cierra el popup y notifica. */
  const setOpen = (next: boolean, reason: string, event: AutocompleteEvent = null) => {
    if (next && (disabled || readOnly)) return;
    if (next === openRef.current) return;
    openRef.current = next;
    setOpenState(next);
    if (next) {
      setDirty(false);
      const current = selectedRef.current[0];
      setHighlight(current !== undefined ? keyOf(current) : null, 'auto', event);
      onOpen?.(event, reason as AutocompleteOpenReason);
    } else {
      setHighlight(null, 'auto', event);
      onClose?.(event, reason as AutocompleteCloseReason);
    }
  };

  /** Sustituye el valor y notifica si cambió. */
  const setValues = (next: AnyOption[], reason: AutocompleteChangeReason, option: AnyOption, event: AutocompleteEvent) => {
    const before = selectedRef.current.map(keyOf).join('\u0000');
    const after = next.map(keyOf).join('\u0000');
    selectedRef.current = next;
    const value = multiple ? next.slice() : next[0] ?? null;
    setValueState(value);
    if (before === after) return;
    onChange?.(event, value as AutocompleteValue<T, Multiple, FreeSolo>, reason, {
      option: (option ?? null) as T | string | null,
    });
  };

  /** Opción para un texto libre (reutiliza una opción con la misma etiqueta). */
  const freeOption = (text: string): AnyOption => {
    const normalized = normalizeText(text);
    const existing = options.find((option) => normalizeText(labelOf(option)) === normalized);
    return existing !== undefined ? existing : text;
  };

  /** Selecciona (o alterna, en múltiple) una opción tras una interacción. */
  const selectOption = (option: AnyOption, reason: 'selectOption' | 'createOption' | 'blur', event: AutocompleteEvent) => {
    if (readOnly) return;
    const current = selectedRef.current;
    let next: AnyOption[];
    let changeReason: AutocompleteChangeReason = reason;
    if (multiple) {
      const index = current.findIndex((value) => isEqual(option, value));
      if (index === -1) next = [...current, option];
      else if (reason === 'createOption') next = current;
      else {
        next = current.filter((_, i) => i !== index);
        changeReason = 'removeOption';
      }
    } else {
      next = [option];
    }
    setValues(next, changeReason, option, event);
    resetInput(event, next);
    if (multiple && disableCloseOnSelect) {
      setDirty(false);
      setHighlight(keyOf(option), 'auto', event);
    } else {
      setOpen(false, reason === 'createOption' ? 'createOption' : 'selectOption', event);
    }
  };

  /** Quita el valor en una posición (múltiple). */
  const removeValueAt = (index: number, event: AutocompleteEvent) => {
    const current = selectedRef.current;
    const option = current[index];
    if (option === undefined) return;
    setValues(
      current.filter((_, i) => i !== index),
      'removeOption',
      option,
      event,
    );
  };

  /** Vacía valor y texto. */
  const clear = (event: AutocompleteEvent) => {
    changeInput(event, '', 'clear');
    setValues([], 'clear', null, event);
    setDirty(false);
    setHighlight(null, 'auto', event);
  };

  /** Índice siguiente saltando opciones deshabilitadas (`-1` = input con `includeInputInList`). */
  const nextIndex = (diff: number | 'start' | 'end'): number => {
    const length = filtered.length;
    if (!length) return -1;
    const max = length - 1;
    let index: number;
    let step: number;
    if (diff === 'start') {
      index = 0;
      step = 1;
    } else if (diff === 'end') {
      index = max;
      step = -1;
    } else {
      step = diff > 0 ? 1 : -1;
      index = activeIndex + diff;
      if (includeInputInList && Math.abs(diff) === 1 && activeIndex !== -1 && (index < 0 || index > max)) return -1;
      // Envuelve con ±1; con saltos de página se queda en el extremo (MUI).
      if (index < 0) index = Math.abs(diff) > 1 ? 0 : max;
      else if (index > max) index = Math.abs(diff) > 1 ? max : 0;
    }
    for (let i = 0; i < length; i += 1) {
      if (!disabledOf(filtered[index])) return index;
      index = (index + step + length) % length;
    }
    return -1;
  };

  const highlightIndex = (index: number, reason: AutocompleteHighlightReason, event: AutocompleteEvent) => {
    setHighlight(index >= 0 ? keyOf(filtered[index]) : NONE, reason, event);
  };

  const openOrMove = (diff: number, event: AutocompleteEvent) => {
    if (!openRef.current) {
      setOpen(true, 'keyboard', event);
      return;
    }
    highlightIndex(nextIndex(diff), 'keyboard', event);
  };

  const tagElements = (): HTMLElement[] =>
    Array.from(containerRef.current?.querySelectorAll<HTMLElement>('.mtx-autocomplete__tag') ?? []);

  // ---------------------------------------------------------------- manejadores del input
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (!openRef.current && text !== '') setOpen(true, 'input', event);
    if (text === '' && !multiple && !disableClearable && selectedRef.current.length) setValues([], 'clear', null, event);
    changeInput(event, text, 'input');
    setDirty(true);
    setHighlight(null, 'auto', event);
    inputProps?.onChange?.(event);
  };

  const toggleFromMouse = (event: ReactMouseEvent<HTMLElement>) => {
    if (event.button !== 0 || disabled || readOnly) return;
    if (inputTextRef.current === '' || !openRef.current) setOpen(!openRef.current, 'toggleInput', event);
  };

  const handleInputFocus = (event: ReactFocusEvent<HTMLInputElement>) => {
    if (openOnFocus && !openRef.current) setOpen(true, 'focus', event);
    inputProps?.onFocus?.(event);
  };

  const handleInputBlur = (event: ReactFocusEvent<HTMLInputElement>) => {
    selectOnFocusPending.current = true;
    inputProps?.onBlur?.(event);
    if (disabled) return;
    if (openRef.current && autoSelect && activeOption !== null && !disabledOf(activeOption)) {
      selectOption(activeOption, 'blur', event);
    } else if (freeSolo && !multiple) {
      const text = inputTextRef.current;
      const current = selectedRef.current[0];
      if (text !== '' && (current === undefined || labelOf(current) !== text)) {
        setValues([freeOption(text)], 'createOption', null, event);
      }
    } else if (!freeSolo) {
      resetInput(event, selectedRef.current);
    }
    setOpen(false, 'blur', event);
  };

  const handleInputClick = (event: ReactMouseEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (!freeSolo && selectOnFocusPending.current && input.selectionStart === input.selectionEnd && input.value) {
      input.select();
    }
    selectOnFocusPending.current = false;
    inputProps?.onClick?.(event);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(event);
    const native = event.nativeEvent;
    if (event.defaultPrevented || native.isComposing || native.keyCode === 229 || disabled) return;
    const open = openRef.current;
    switch (event.key) {
      case 'Home':
      case 'End':
        if (open && !freeSolo && filtered.length) {
          event.preventDefault();
          highlightIndex(nextIndex(event.key === 'Home' ? 'start' : 'end'), 'keyboard', event);
        }
        break;
      case 'PageUp':
      case 'PageDown':
        event.preventDefault();
        openOrMove(event.key === 'PageUp' ? -PAGE_SIZE : PAGE_SIZE, event);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        openOrMove(event.key === 'ArrowUp' ? -1 : 1, event);
        break;
      case 'ArrowLeft': {
        const input = event.currentTarget;
        if (multiple && selected.length && input.selectionStart === 0 && input.selectionEnd === 0) {
          const tags = tagElements();
          if (tags.length) {
            event.preventDefault();
            tags[tags.length - 1].focus();
          }
        }
        break;
      }
      case 'Enter':
        if (open && activeOption !== null) {
          event.preventDefault();
          if (!disabledOf(activeOption)) selectOption(activeOption, 'selectOption', event);
        } else if (freeSolo && inputTextRef.current !== '' && !inputIsSelectedValue) {
          if (multiple) event.preventDefault();
          selectOption(freeOption(inputTextRef.current), 'createOption', event);
        }
        break;
      case 'Escape':
        if (open) {
          // Solo si es la capa superior; como MUI, el Escape no llega a los contenedores (Dialog).
          if (layer.isTopLayer()) {
            markEscapeHandled(event);
            event.stopPropagation();
            setOpen(false, 'escape', event);
          }
          break;
        }
        if (clearOnEscape && !readOnly && (inputTextRef.current !== '' || (multiple && selected.length))) {
          event.preventDefault();
          event.stopPropagation();
          clear(event);
        }
        break;
      case 'Backspace':
        if (multiple && !readOnly && inputTextRef.current === '' && selected.length) {
          event.preventDefault();
          removeValueAt(selected.length - 1, event);
        }
        break;
      case 'Tab':
        if (autoSelect && open && activeOption !== null && !disabledOf(activeOption)) {
          selectOption(activeOption, 'selectOption', event);
        }
        break;
      default:
        break;
    }
  };

  // ---------------------------------------------------------------- raíz y caja
  const handleRootKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onRootKeyDown?.(event);
    const target = event.target as HTMLElement;
    const tag = target.closest?.('.mtx-autocomplete__tag');
    if (!tag) return;
    const tags = tagElements();
    const index = tags.indexOf(tag as HTMLElement);
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      tags[index - 1].focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (index < tags.length - 1) tags[index + 1].focus();
      else inputElRef.current?.focus();
    }
  };

  const handleRootFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    onRootFocus?.(event);
    setFocused(true);
  };

  const handleRootBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    onRootBlur?.(event);
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setFocused(false);
  };

  const handleContainerMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target === inputElRef.current) return;
    if (target.closest('.mtx-autocomplete__tag, .mtx-autocomplete__indicator')) return;
    event.preventDefault();
    if (disabled) return;
    if (document.activeElement !== inputElRef.current) inputElRef.current?.focus();
    toggleFromMouse(event);
  };

  const keepFocus = (event: ReactMouseEvent) => event.preventDefault();

  const handleClearClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    inputElRef.current?.focus();
    clear(event);
  };

  const handlePopupClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    inputElRef.current?.focus();
    setOpen(!openRef.current, 'toggleInput', event);
  };

  const handleOptionClick = (event: ReactMouseEvent<HTMLElement>) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>('.mtx-autocomplete__option');
    if (!el || el.getAttribute('aria-disabled') === 'true') return;
    const option = filtered[Number(el.dataset.optionIndex)];
    if (option !== undefined) selectOption(option, 'selectOption', event);
  };

  const handleOptionMove = (event: ReactMouseEvent<HTMLElement>) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>('.mtx-autocomplete__option');
    if (!el || el.getAttribute('aria-disabled') === 'true') return;
    const index = Number(el.dataset.optionIndex);
    if (index !== activeIndex) highlightIndex(index, 'mouse', event);
  };

  // ---------------------------------------------------------------- capa, posición y efectos
  const layer = useLayer({
    open: popupOpen,
    kind: 'popup',
    nodes: () => [popperEl, containerRef.current?.closest('.mtx-autocomplete') ?? null].filter(Boolean) as Node[],
    stack: () => (popperEl ? [{ node: popperEl }] : []),
    onEscape: (event) => setOpen(false, 'escape', event),
  });

  // Popup bajo el campo (o encima si no cabe), con su ancho y el lado fijo al filtrar.
  const repositionRef = useRef<(() => void) | null>(null);
  useEnhancedEffect(() => {
    const anchor = containerRef.current;
    if (!popperEl || !anchor) return undefined;
    let locked: Side | null = null;
    const paper = popperEl.firstElementChild as HTMLElement | null;
    const run = () => {
      popperEl.style.width = `${anchor.getBoundingClientRect().width}px`;
      const result = positionDropdown(anchor, popperEl, {
        placement: 'bottom-start',
        offset: 4,
        padding: 8,
        matchWidth: true,
        // Alto natural ya limitado por el CSS del listbox (40vh), como mide vanilla.
        content: paper,
        lockSide: locked,
      });
      locked = result.side;
      if (paper) paper.style.maxHeight = popperEl.style.maxHeight;
    };
    repositionRef.current = run;
    const stop = autoUpdate(anchor, popperEl, run);
    return () => {
      stop();
      repositionRef.current = null;
    };
  }, [popperEl]);
  useEnhancedEffect(() => {
    repositionRef.current?.();
  }, [filtered, loading, selected.length]);

  // Notifica la opción activa (silencioso al cerrar o sin cambios).
  const lastHighlight = useRef<string | null>(null);
  useEffect(() => {
    if (!popupOpen) {
      lastHighlight.current = null;
      return;
    }
    if (activeKey === lastHighlight.current) return;
    lastHighlight.current = activeKey;
    onHighlightChange?.(highlightEvent.current, (activeOption as T | null) ?? null, highlightReason.current);
  });

  // Desplaza el listbox para mostrar la opción activa (con hueco para la cabecera de grupo fija).
  useEnhancedEffect(() => {
    const list = listboxRef.current;
    if (!list || activeIndex < 0 || highlightReason.current === 'mouse') return;
    if (list.scrollHeight <= list.clientHeight) return;
    const el = list.querySelector<HTMLElement>(`[data-option-index="${activeIndex}"]`);
    if (!el) return;
    const grouped = filtered.some((option) => groupOf(option) !== undefined);
    const top = el.offsetTop - (grouped ? el.offsetHeight * 1.3 : 0);
    const bottom = el.offsetTop + el.offsetHeight;
    if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    else if (top < list.scrollTop) list.scrollTop = Math.max(0, top);
  }, [activeIndex, popperEl]);

  // Región viva: número de resultados (con retardo para no saturar).
  const announce = !popupOpen
    ? ''
    : !filtered.length
      ? loading
        ? String(loadingText ?? t('loading', null, 'Loading…'))
        : String(noOptionsText ?? t('noOptions', null, 'No options'))
      : filtered.length === 1
        ? t('result', null, '1 result available')
        : t('results', [filtered.length], '{0} results available');
  useEffect(() => {
    if (!announce) return undefined;
    const timer = setTimeout(() => setLiveText(announce), 300);
    return () => clearTimeout(timer);
  }, [announce]);

  // El texto sigue al valor cuando cambia desde fuera (modo controlado) o llega su etiqueta (opciones asíncronas).
  const selectedKey = multiple ? '' : selected.map(keyOf).join('\u0000');
  const selectedLabel = multiple || !selected.length ? '' : labelOf(selected[0]);
  const lastSelection = useRef({ key: selectedKey, label: selectedLabel });
  useEffect(() => {
    const previous = lastSelection.current;
    lastSelection.current = { key: selectedKey, label: selectedLabel };
    if (multiple) return;
    if (previous.key !== selectedKey || (previous.label !== selectedLabel && inputTextRef.current === previous.label)) {
      changeInput(null, selectedLabel, 'reset');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, selectedLabel]);

  // Deshabilitar cierra el popup.
  useEffect(() => {
    if (disabled && openRef.current) setOpen(false, 'disabled');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // `reset` del formulario: restaura el valor inicial (no controlado), el texto y cierra.
  const resetRef = useRef<() => void>(() => undefined);
  resetRef.current = () => {
    if (valueProp === undefined) {
      selectedRef.current = initialSelection;
      setValueState(multiple ? initialSelection.slice() : initialSelection[0] ?? null);
    }
    resetInput(null, valueProp === undefined ? initialSelection : selectedRef.current);
    setOpen(false, 'reset');
  };
  useEffect(() => {
    const owner = inputElRef.current?.form;
    if (!owner) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleReset = () => {
      timer = setTimeout(() => resetRef.current(), 0);
    };
    owner.addEventListener('reset', handleReset);
    return () => {
      owner.removeEventListener('reset', handleReset);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Validación nativa: con `required`, un texto que no es una opción no es válido.
  const hasValue = selected.length > 0;
  useEffect(() => {
    const input = inputElRef.current;
    if (!input || typeof input.setCustomValidity !== 'function') return;
    const invalid = required && !hasValue && !freeSolo && inputText.trim() !== '';
    input.setCustomValidity(invalid ? t('invalid', null, 'Select an option from the list.') : '');
  }, [required, hasValue, freeSolo, inputText, t]);

  useEffect(() => {
    if (autoFocus) inputElRef.current?.focus();
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------- render
  const small = size === 'small';
  const placeholderText = (placeholderProp ?? '').trim();
  const hasLabelProp = labelProp !== undefined && labelProp !== null && labelProp !== false && labelProp !== '';
  const label: ReactNode = hasLabelProp ? labelProp : placeholderText !== '' ? placeholderText : null;
  const placeholder = !hasLabelProp || !placeholderProp ? ' ' : placeholderProp;
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false && helperText !== '';
  const describedBy = [
    ariaDescribedBy ?? inputProps?.['aria-describedby'],
    hasHelper ? helperId : '',
    ...(hasHelper ? [] : (formControl?.helperTextIds ?? [])),
  ]
    .filter(Boolean)
    .join(' ');
  const fieldHasValue = inputText.trim() !== '' || placeholder.trim() !== '' || (multiple && hasValue);

  let startNode: ReactNode = null;
  if (startIcon !== undefined && startIcon !== null && startIcon !== false && startIcon !== '') {
    const base = 'mtx-text-field__adornment mtx-text-field__adornment--start';
    if (isImageUrl(startIcon)) startNode = <img src={startIcon} alt="" className={`${base} mtx-text-field__adornment--image`} />;
    else if (typeof startIcon === 'string') {
      startNode = (
        <span className={`${base} material-icons`} aria-hidden="true">
          {startIcon}
        </span>
      );
    } else {
      startNode = (
        <span className={base} aria-hidden="true">
          {startIcon}
        </span>
      );
    }
  }

  // Chips (múltiple): respeta `limitTags` sin foco.
  let tags: ReactNode = null;
  if (multiple) {
    const limit = limitTags >= 0 && !focused ? limitTags : Infinity;
    const deletable = !disabled && !readOnly;
    tags = (
      <>
        {selected.map((option, index) => {
          if (index >= limit) return null;
          const icon = isObject(option) && typeof option.icon === 'string' ? option.icon : undefined;
          return (
            <Chip
              key={keyOf(option)}
              className="mtx-autocomplete__tag"
              data-tag-index={index}
              label={labelOf(option)}
              size={small ? 'small' : 'medium'}
              icon={icon}
              disabled={disabled}
              locale={locale}
              tabIndex={deletable ? -1 : undefined}
              onDelete={
                deletable
                  ? (event) => {
                      removeValueAt(index, event);
                      inputElRef.current?.focus();
                    }
                  : undefined
              }
            />
          );
        })}
        {selected.length > limit ? (
          <span className="mtx-autocomplete__tag-more">{t('more', [selected.length - limit], '+{0}')}</span>
        ) : null}
      </>
    );
  }

  // Opciones agrupadas (grupos consecutivos, como MUI).
  const renderOptionItem = (option: AnyOption, index: number) => {
    const isSel = isSelected(option);
    const isDisabled = disabledOf(option);
    const icon = isObject(option) && typeof option.icon === 'string' ? option.icon : null;
    const description = isObject(option) ? (option.description as ReactNode) : null;
    const text = labelOf(option);
    return (
      <li
        key={`${keyOf(option)}-${index}`}
        id={`${id}-option-${index}`}
        className={cx(
          'mtx-autocomplete__option',
          isDisabled && 'mtx-autocomplete__option--disabled',
          index === activeIndex && 'mtx-autocomplete__option--focused',
        )}
        role="option"
        data-option-index={index}
        aria-selected={isSel}
        aria-disabled={isDisabled ? 'true' : undefined}
      >
        {renderOption ? (
          renderOption(option as T, { index, selected: isSel, inputValue: highlightQuery })
        ) : (
          <>
            {icon ? (
              <span className="mtx-autocomplete__option-icon material-icons" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className="mtx-autocomplete__option-content">
              <span className="mtx-autocomplete__option-label">
                {highlightQuery
                  ? splitMatch(text, highlightQuery, matchFrom === 'start').map((part, i) =>
                      part.match ? (
                        <mark key={i} className="mtx-autocomplete__highlight">
                          {part.text}
                        </mark>
                      ) : (
                        part.text
                      ),
                    )
                  : text}
              </span>
              {description !== null && description !== undefined && description !== '' ? (
                <span className="mtx-autocomplete__option-description">{description}</span>
              ) : null}
            </span>
          </>
        )}
      </li>
    );
  };

  const listItems: ReactElement[] = [];
  let groupItems: ReactElement[] | null = null;
  let currentGroup: string | undefined;
  filtered.forEach((option, index) => {
    const group = groupOf(option);
    if (group === undefined) {
      currentGroup = undefined;
      groupItems = null;
      listItems.push(renderOptionItem(option, index));
      return;
    }
    if (group !== currentGroup || !groupItems) {
      currentGroup = group;
      const headerId = `${id}-group-${index}`;
      const items: ReactElement[] = [];
      groupItems = items;
      listItems.push(
        <li key={`group-${index}`} className="mtx-autocomplete__group" role="presentation">
          <div className="mtx-autocomplete__group-label" id={headerId}>
            {group}
          </div>
          <ul className="mtx-autocomplete__group-list" role="group" aria-labelledby={headerId}>
            {items}
          </ul>
        </li>,
      );
    }
    groupItems.push(renderOptionItem(option, index));
  });

  // Inputs ocultos con `name`: el texto visible no se envía.
  const keys = selected.map(keyOf);
  let hiddenValues: string[] = [];
  if (name) {
    if (!multiple) hiddenValues = [keys[0] ?? ''];
    else if (valueFormat === 'csv') hiddenValues = [keys.join(separator)];
    else hiddenValues = keys;
  }

  const listboxLabel = label !== null ? { 'aria-labelledby': labelId } : ariaLabel ? { 'aria-label': ariaLabel } : {};

  const popper = popupVisible ? (
    <Portal>
      <div
        ref={setPopperEl}
        className={cx('mtx-autocomplete__popper', `mtx-autocomplete__popper--${color}`, popperClassName)}
        onMouseDown={keepFocus}
        onClick={handleOptionClick}
        onMouseMove={handleOptionMove}
      >
        <div className="mtx-autocomplete__paper">
          <ul
            ref={listboxRef}
            className="mtx-autocomplete__listbox"
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple ? 'true' : undefined}
            aria-busy={loading ? 'true' : 'false'}
            hidden={!hasOptions}
            {...listboxLabel}
          >
            {listItems}
          </ul>
          <div
            className={cx('mtx-autocomplete__status', !hasOptions && loading && 'mtx-autocomplete__status--loading')}
            hidden={hasOptions}
          >
            {hasOptions ? null : loading ? loadingMessage : noOptionsMessage}
          </div>
        </div>
      </div>
    </Portal>
  ) : null;

  return (
    <div
      ref={ref}
      className={cx(
        'mtx-autocomplete',
        className,
        loading && 'mtx-autocomplete--loading',
        hasClear && 'mtx-autocomplete--has-clear',
        hasPopupIcon && 'mtx-autocomplete--has-popup',
        (hasClear || hasPopupIcon || loading) && 'mtx-autocomplete--has-end',
        multiple && 'mtx-autocomplete--multiple',
        required && 'mtx-autocomplete--required',
        readOnly && 'mtx-autocomplete--readonly',
        disabled && 'mtx-autocomplete--disabled',
        focused && 'mtx-autocomplete--focused',
        popupOpen && 'mtx-autocomplete--open',
      )}
      onFocus={handleRootFocus}
      onBlur={handleRootBlur}
      onKeyDown={handleRootKeyDown}
      {...rest}
    >
      <div
        className={cx(
          'mtx-text-field',
          'mtx-autocomplete__field',
          `mtx-text-field--${variant}`,
          small && 'mtx-text-field--small',
          FIELD_COLORS.includes(color) && `mtx-text-field--${color}`,
          startNode && 'mtx-text-field--adorned-start',
          fieldHasValue && 'mtx-text-field--has-value',
          error && 'mtx-text-field--error',
        )}
      >
        {label !== null ? (
          <label className="mtx-text-field__label" htmlFor={id} id={labelId}>
            {label}
          </label>
        ) : null}
        <div
          ref={containerRef}
          className="mtx-text-field__container mtx-autocomplete__input-root"
          onMouseDown={handleContainerMouseDown}
        >
          {startNode}
          {tags}
          <input
            {...inputProps}
            ref={handleInputRef}
            id={id}
            className={cx('mtx-autocomplete__input', 'mtx-text-field__input', inputProps?.className)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded ? 'true' : 'false'}
            aria-controls={expanded ? listboxId : undefined}
            aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
            aria-label={ariaLabel ?? inputProps?.['aria-label']}
            aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            aria-required={required ? 'true' : undefined}
            aria-readonly={readOnly ? 'true' : undefined}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={placeholder}
            form={form}
            value={inputText}
            disabled={disabled}
            readOnly={readOnly}
            required={required && !hasValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onMouseDown={(event) => {
              inputProps?.onMouseDown?.(event);
              toggleFromMouse(event);
            }}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
          />
          {variant === 'outlined' ? (
            <fieldset className="mtx-text-field__outline" aria-hidden="true">
              {label !== null ? (
                <legend className="mtx-text-field__legend">
                  <span>{label}</span>
                </legend>
              ) : null}
            </fieldset>
          ) : null}
          <span className="mtx-autocomplete__end-adornment">
            <span className="mtx-autocomplete__loading-indicator" hidden={!loading}>
              {loading ? <CircularProgress size={20} color="inherit" decorative /> : null}
            </span>
            <button
              type="button"
              tabIndex={-1}
              className="mtx-autocomplete__indicator mtx-autocomplete__clear-indicator"
              aria-label={clearLabel}
              title={clearLabel}
              hidden={!hasClear}
              disabled={disabled}
              onMouseDown={keepFocus}
              onClick={handleClearClick}
            >
              {CLOSE_ICON}
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="mtx-autocomplete__indicator mtx-autocomplete__popup-indicator"
              aria-label={popupLabel}
              title={popupLabel}
              hidden={!hasPopupIcon}
              disabled={disabled}
              onMouseDown={keepFocus}
              onClick={handlePopupClick}
            >
              {ARROW_ICON}
            </button>
          </span>
        </div>
        {hasHelper ? (
          <div className="mtx-text-field__supporting-text" id={helperId}>
            <span className="mtx-text-field__helper-text">{helperText}</span>
          </div>
        ) : null}
      </div>
      <span className="mtx-autocomplete__values" hidden>
        {hiddenValues.map((value, index) => (
          <input key={index} type="hidden" name={name} value={value} form={form} disabled={disabled} />
        ))}
      </span>
      <div className="mtx-autocomplete__live" role="status" aria-live="polite" aria-atomic="true">
        {popupOpen ? liveText : ''}
      </div>
      {popper}
    </div>
  );
}

/**
 * Autocomplete de Materix UI (patrón `Autocomplete` de MUI): combobox WAI-ARIA 1.2 con listbox en portal.
 */
export const Autocomplete = forwardRef(AutocompleteInner) as <
  T,
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(
  props: AutocompleteProps<T, Multiple, FreeSolo> & { ref?: Ref<HTMLDivElement> },
) => ReactElement | null;
