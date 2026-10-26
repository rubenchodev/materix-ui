'use client';
import { Children, Fragment, forwardRef, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  CSSProperties,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/select.css';
import '@rubenchodev/materix-ui/components/typography.css';
import {
  Portal,
  TRANSITION_DURATION,
  cx,
  isRtl,
  prefersReducedMotion,
  useClickAway,
  useControlled,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  usePosition,
  useTransition,
} from '../../core';
import { useT } from '../../i18n';
import { getSelectedDisplayKind, normalizeText } from '../../utils/text';
import type { SelectedTextFormat } from '../../utils/text';
import { useFormControl } from '../form-helper-text/FormControlContext';

/** Variantes de {@link Select}; `outlined` es la predeterminada, como en vanilla. */
export type SelectVariant = 'outlined' | 'filled' | 'standard';

/** Tamaños de {@link Select}: `medium` (56px) o `small` (40px). */
export type SelectSize = 'medium' | 'small';

/** Colores de la paleta MUI admitidos (foco y opción seleccionada). */
export type SelectColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Opción declarada mediante la prop `options`. */
export interface SelectOption {
  /** Valor enviado con el formulario. */
  value: string | number;
  /** Texto visible (también se usa en la búsqueda y el typeahead). */
  label: string;
  /** Icono: nombre de Material Icons, URL de imagen o nodo React (`data-icon`). */
  icon?: ReactNode;
  /** URL de imagen (`data-image`). */
  image?: string;
  /** Texto secundario bajo la etiqueta en el menú. */
  secondary?: ReactNode;
  /** Deshabilita la opción. */
  disabled?: boolean;
}

/** Grupo de opciones (`<optgroup>`) declarado mediante la prop `options`. */
export interface SelectOptionGroup {
  /** Título del grupo. */
  label: string;
  /** Opciones del grupo. */
  options: readonly SelectOption[];
  /** Deshabilita el grupo completo. */
  disabled?: boolean;
}

/** Opción normalizada que recibe `renderValue` (valor siempre como texto). */
export interface SelectResolvedOption {
  value: string;
  label: string;
  icon?: ReactNode;
  image?: string;
  secondary?: ReactNode;
  disabled: boolean;
}

/** Evento que provoca la apertura, el cierre o el cambio. */
export type SelectEvent = SyntheticEvent | Event;

/** Props de {@link Select}. `className`, `style` y el resto de atributos van al `<div>` raíz. */
export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color' | 'placeholder' | 'onFocus' | 'onBlur'> {
  /** Variante visual (`data-variant`). */
  variant?: SelectVariant;
  /** Tamaño (`data-size`). */
  size?: SelectSize;
  /** Color de foco y selección (`data-color`). */
  color?: SelectColor;
  /** Label flotante (`data-label`). */
  label?: ReactNode;
  /** Borde outlined sin muesca (`data-hidden-label`); útil con `aria-label` y sin label visible. */
  hiddenLabel?: boolean;
  /** Opciones como datos; alternativa a `<option>`/`<optgroup>` como children. */
  options?: ReadonlyArray<SelectOption | SelectOptionGroup>;
  /** Selección múltiple con casillas; el menú permanece abierto. */
  multiple?: boolean;
  /** Valor (modo controlado); un array con `multiple`. */
  value?: string | number | ReadonlyArray<string | number>;
  /** Valor inicial (modo no controlado). */
  defaultValue?: string | number | ReadonlyArray<string | number>;
  /** Se invoca cuando el usuario cambia la selección. */
  onChange?: (event: SelectEvent, value: string | string[]) => void;
  /** Apertura del menú (modo controlado). */
  open?: boolean;
  /** Apertura inicial (modo no controlado). */
  defaultOpen?: boolean;
  /** Se invoca al pedir la apertura. */
  onOpen?: (event: SelectEvent) => void;
  /** Se invoca al pedir el cierre (clic fuera, Escape, Tab o selección única). */
  onClose?: (event: SelectEvent) => void;
  /** Texto cuando no hay selección (`data-placeholder`). */
  placeholder?: string;
  /** Icono inicial del control: nombre de Material Icons, URL o nodo (`data-start-icon`). */
  startIcon?: ReactNode;
  /** Caja de búsqueda que filtra por texto y valor (`data-search`). */
  search?: boolean;
  /** Placeholder de la búsqueda (por defecto i18n `select.searchPlaceholder`). */
  searchPlaceholder?: string;
  /** Texto sin coincidencias; `{0}` es el término (`data-none-results-text`). */
  noResultsText?: string;
  /** Botones seleccionar todo / deseleccionar todo, solo múltiple (`data-actions-box`). */
  actionsBox?: boolean;
  /** Texto del botón seleccionar todo (`data-select-all-text`). */
  selectAllText?: string;
  /** Texto del botón deseleccionar todo (`data-deselect-all-text`). */
  deselectAllText?: string;
  /** Cabecera dentro del menú (`data-header`). */
  header?: ReactNode;
  /** Máximo de opciones seleccionables en múltiple (`data-max-options`). */
  maxOptions?: number;
  /** Texto de la selección múltiple: `values`, `count`, `count > N` o `static`. */
  selectedTextFormat?: SelectedTextFormat;
  /** Contenido personalizado del control cuando hay selección (p. ej. chips). */
  renderValue?: (selected: SelectResolvedOption[]) => ReactNode;
  /** Estado de error (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Texto de ayuda o error bajo el campo (`data-helper-text`). */
  helperText?: ReactNode;
  /** Deshabilita el campo (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Solo lectura: muestra el valor pero no abre el menú (`data-readonly`). */
  readOnly?: boolean;
  /** Campo obligatorio: `required` nativo y asterisco en el label. */
  required?: boolean;
  /** Ocupa todo el ancho del contenedor (por defecto `true`, como vanilla). */
  fullWidth?: boolean;
  /** Nombre del campo en el formulario (`<select>` nativo oculto). */
  name?: string;
  /** Formulario asociado. */
  form?: string;
  /** Enfoca el combobox al montar. */
  autoFocus?: boolean;
  /** Idioma de los textos propios (prevalece sobre el `I18nProvider`). */
  locale?: string;
  /** Ref al `<select>` nativo oculto. */
  inputRef?: Ref<HTMLSelectElement>;
  /** Atributos extra del `<select>` nativo oculto. */
  inputProps?: SelectHTMLAttributes<HTMLSelectElement> & { [key: `data-${string}`]: string | undefined };
  /** Ref al combobox visible (`.mtx-select__control`), útil para `focus()`. */
  controlRef?: Ref<HTMLDivElement>;
  /** Clase extra del menú portado. */
  menuClassName?: string;
  /** Foco del combobox. */
  onFocus?: FocusEventHandler<HTMLDivElement>;
  /** Pérdida de foco del combobox. */
  onBlur?: FocusEventHandler<HTMLDivElement>;
}

/** Opción interna. */
interface Item extends SelectResolvedOption {
  index: number;
}

/** Entrada del árbol de opciones: opción suelta o grupo. */
type Entry = { kind: 'item'; item: Item } | { kind: 'group'; label: string; disabled: boolean; items: Item[] };

const COLORS: SelectColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const TYPEAHEAD_TIMEOUT = 500;
const SEARCH_DEBOUNCE = 150;
const ENTER_EASING = 'cubic-bezier(0, 0, 0.2, 1)';

/**
 * Indica si un valor es una URL o ruta de imagen (`_isImageUrl` de vanilla).
 * @param {unknown} src Valor.
 * @returns {boolean} `true` si es una imagen.
 */
function isImageUrl(src: unknown): src is string {
  return (
    typeof src === 'string' &&
    (/^(https?:|\/|\.\/|\.\.\/|data:image\/)/i.test(src) || /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(src))
  );
}

/**
 * Texto plano de un nodo React (contenido de `<option>`).
 * @param {ReactNode} node Nodo.
 * @returns {string} Texto concatenado.
 */
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return '';
    })
    .join('');
}

/**
 * Construye el árbol de opciones desde `options` y desde children `<option>`/`<optgroup>`.
 * @param {ReadonlyArray} options Opciones como datos.
 * @param {ReactNode} children Children declarativos.
 * @returns {{entries: Entry[], items: Item[]}} Árbol y lista plana.
 */
function buildEntries(options: SelectProps['options'], children: ReactNode): { entries: Entry[]; items: Item[] } {
  const entries: Entry[] = [];
  const items: Item[] = [];
  const makeItem = (source: Omit<SelectResolvedOption, 'disabled'> & { disabled?: boolean }, groupDisabled: boolean): Item => {
    const item: Item = {
      value: String(source.value),
      label: source.label,
      icon: source.icon,
      image: source.image,
      secondary: source.secondary,
      disabled: Boolean(source.disabled) || groupDisabled,
      index: items.length,
    };
    items.push(item);
    return item;
  };

  (options ?? []).forEach((entry) => {
    if ('options' in entry) {
      const disabled = Boolean(entry.disabled);
      entries.push({
        kind: 'group',
        label: entry.label,
        disabled,
        items: entry.options.map((option) => makeItem({ ...option, value: String(option.value) }, disabled)),
      });
    } else {
      entries.push({ kind: 'item', item: makeItem({ ...entry, value: String(entry.value) }, false) });
    }
  });

  type OptionProps = {
    value?: string | number;
    label?: string;
    disabled?: boolean;
    children?: ReactNode;
    'data-icon'?: string;
    'data-image'?: string;
    'data-secondary'?: string;
  };
  const fromOption = (props: OptionProps, groupDisabled: boolean): Item => {
    const text = textOf(props.children) || props.label || '';
    return makeItem(
      {
        value: props.value !== undefined ? String(props.value) : text,
        label: text,
        icon: props['data-icon'],
        image: props['data-image'],
        secondary: props['data-secondary'],
        disabled: props.disabled,
      },
      groupDisabled,
    );
  };
  const walk = (nodes: ReactNode) => {
    Children.toArray(nodes).forEach((child) => {
      if (!isValidElement(child)) return;
      if (child.type === Fragment) {
        walk((child.props as { children?: ReactNode }).children);
      } else if (child.type === 'optgroup') {
        const props = child.props as { label?: string; disabled?: boolean; children?: ReactNode };
        const disabled = Boolean(props.disabled);
        const groupItems: Item[] = [];
        Children.toArray(props.children).forEach((option) => {
          if (isValidElement(option) && option.type === 'option') {
            groupItems.push(fromOption(option.props as OptionProps, disabled));
          }
        });
        entries.push({ kind: 'group', label: props.label ?? '', disabled, items: groupItems });
      } else if (child.type === 'option') {
        entries.push({ kind: 'item', item: fromOption(child.props as OptionProps, false) });
      }
    });
  };
  walk(children);
  return { entries, items };
}

/**
 * Icono o imagen de una opción o del control (`_createIconOrImage` de vanilla).
 * @param {ReactNode} value Nombre de icono, URL o nodo.
 * @param {string} prefix Prefijo BEM (`mtx-select__option`, `mtx-select__display`).
 * @returns {ReactNode} Nodo visual.
 */
function renderMedia(value: ReactNode, prefix: string): ReactNode {
  if (value === null || value === undefined || value === false || value === '') return null;
  if (isImageUrl(value)) return <img className={`${prefix}-image`} src={value} alt="" aria-hidden="true" />;
  if (typeof value === 'string') {
    return (
      <span className={`${prefix}-icon material-icons`} aria-hidden="true">
        {value}
      </span>
    );
  }
  return (
    <span className={`${prefix}-icon`} aria-hidden="true">
      {value}
    </span>
  );
}

/**
 * Normaliza un valor externo al formato interno.
 * @param {unknown} value Valor recibido.
 * @param {boolean} multiple Selección múltiple.
 * @returns {string|string[]} Texto o lista de textos.
 */
function normalizeValue(value: SelectProps['value'], multiple: boolean): string | string[] {
  if (multiple) {
    if (value === undefined || value === null || value === '') return [];
    return (Array.isArray(value) ? value : [value]).map(String);
  }
  if (Array.isArray(value)) return value.length ? String(value[0]) : '';
  return value === undefined || value === null ? '' : String(value);
}

/** Chevron de vanilla (`arrow_drop_down`). */
const Chevron = () => (
  <span className="mtx-select__chevron">
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  </span>
);

/**
 * Select de Materix UI: combobox WAI-ARIA con menú propio portado (búsqueda, múltiple con casillas,
 * acciones, grupos, límite e iconos), variantes outlined/filled/standard con muesca y un `<select>`
 * nativo oculto como fuente para formularios.
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(props, ref) {
  const {
    variant = 'outlined',
    size = 'medium',
    color: colorProp,
    label,
    hiddenLabel = false,
    options,
    multiple = false,
    value: valueProp,
    defaultValue,
    onChange,
    open: openProp,
    defaultOpen = false,
    onOpen,
    onClose,
    placeholder = '',
    startIcon,
    search = false,
    searchPlaceholder,
    noResultsText,
    actionsBox = false,
    selectAllText,
    deselectAllText,
    header,
    maxOptions,
    selectedTextFormat = 'values',
    renderValue,
    error: errorProp,
    helperText,
    disabled: disabledProp,
    readOnly = false,
    required: requiredProp,
    fullWidth = true,
    name,
    form,
    autoFocus,
    locale,
    inputRef,
    inputProps,
    controlRef: controlRefProp,
    menuClassName,
    onFocus,
    onBlur,
    id: idProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedByProp,
    className,
    style,
    children,
    ...rest
  } = props;

  const t = useT('select', locale);
  const formControl = useFormControl();
  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const required = requiredProp ?? formControl?.required ?? false;
  const color: SelectColor = colorProp && COLORS.includes(colorProp) ? colorProp : 'primary';
  const limit = maxOptions && maxOptions > 0 ? maxOptions : Infinity;

  const autoId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const baseId = idProp ?? `mtx-select-${autoId}`;
  const controlId = `${baseId}-control`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const helperId = `${baseId}-helper-text`;
  const optionId = (item: Item) => `${baseId}-option-${item.index}`;

  const { entries, items } = useMemo(() => buildEntries(options, children), [options, children]);

  // Valor: sin `defaultValue` la selección única toma la primera opción habilitada (como el <select> nativo),
  // salvo que haya placeholder.
  const initialValue = useMemo(() => {
    if (defaultValue !== undefined) return normalizeValue(defaultValue, multiple);
    if (multiple) return [];
    if (placeholder) return '';
    return items.find((item) => !item.disabled)?.value ?? '';
    // Solo cuenta el valor del primer render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [valueState, setValueState] = useControlled<string | string[]>({
    controlled: valueProp === undefined ? undefined : normalizeValue(valueProp, multiple),
    default: initialValue,
    name: 'Select',
  });
  const selectedValues = useMemo<string[]>(() => {
    if (Array.isArray(valueState)) return valueState;
    return items.some((item) => item.value === valueState) ? [valueState] : [];
  }, [valueState, items]);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedItems = useMemo(() => items.filter((item) => selectedSet.has(item.value)), [items, selectedSet]);
  const reachedLimit = multiple && selectedItems.length >= limit;

  const [openState, setOpenState] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen,
    name: 'Select',
    state: 'open',
  });
  const isOpen = openState && !disabled && !readOnly;
  const { mounted } = useTransition(isOpen, TRANSITION_DURATION, { mountOnEnter: true, unmountOnExit: true });

  const controlRef = useRef<HTMLDivElement>(null);
  const handleControlRef = useForkRef(controlRef, controlRefProp);
  const selectRef = useRef<HTMLSelectElement>(null);
  const handleSelectRef = useForkRef(selectRef, inputRef);
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);
  const [rtl, setRtl] = useState(false);
  const [shown, setShown] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [term, setTerm] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeahead = useRef({ buffer: '', timer: null as ReturnType<typeof setTimeout> | null });

  const isItemDisabled = (item: Item) => item.disabled || (reachedLimit && !selectedSet.has(item.value));
  const visibleItems = useMemo(
    () => {
      if (!search) return items;
      // Igual que vanilla (texto + valor) pero además sin tildes.
      const needle = normalizeText(term).trim();
      return needle ? items.filter((item) => normalizeText(`${item.label} ${item.value}`).includes(needle)) : items;
    },
    [items, search, term],
  );
  const visibleSet = useMemo(() => new Set(visibleItems), [visibleItems]);
  const navigable = visibleItems.filter((item) => !isItemDisabled(item));
  const activeItem = navigable.find((item) => item.value === activeValue) ?? null;

  /** Valor inicial del elemento activo: la primera opción seleccionada visible o la primera disponible. */
  const initialActive = () =>
    (navigable.find((item) => selectedSet.has(item.value)) ?? navigable[0] ?? null)?.value ?? null;

  const commit = (next: string | string[], event: SelectEvent) => {
    setValueState(next);
    onChange?.(event, next);
  };

  const setOpen = useEventCallback((next: boolean, event: SelectEvent) => {
    if (next && (disabled || readOnly)) return;
    if (next === isOpen) return;
    setOpenState(next);
    if (next) onOpen?.(event);
    else onClose?.(event);
  });

  // Al abrir: búsqueda vacía, dirección del contexto y opción activa inicial.
  useEnhancedEffect(() => {
    if (!isOpen) return;
    setSearchInput('');
    setTerm('');
    if (controlRef.current) setRtl(isRtl(controlRef.current));
    // Con búsqueda no hay opción activa hasta la primera flecha.
    setActiveValue(search ? null : initialActive());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Animación de vanilla: escala 0.85 → 1 y opacidad en 225 ms.
  useEffect(() => {
    if (!isOpen || !menuEl) {
      setShown(false);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen, menuEl]);

  // Con búsqueda, el foco pasa a la caja al montar el menú.
  useEffect(() => {
    if (isOpen && search && menuEl) searchRef.current?.focus();
  }, [isOpen, search, menuEl]);

  // Al filtrar, la opción activa pasa a la primera visible si la anterior desaparece.
  useEffect(() => {
    if (!isOpen) return;
    if (!activeItem) setActiveValue(search ? null : initialActive());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  // Mantiene visible la opción activa dentro del menú.
  useEffect(() => {
    if (!menuEl || !activeItem) return;
    const node = menuEl.querySelector<HTMLElement>(`[id="${optionId(activeItem)}"]`);
    if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuEl, activeItem]);

  // Temporizadores de búsqueda y typeahead cancelados al desmontar.
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (typeahead.current.timer) clearTimeout(typeahead.current.timer);
    },
    [],
  );

  useEffect(() => {
    if (autoFocus) controlRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El <select> nativo oculto refleja la selección (formularios y validación `required`).
  const nativeState = useRef({ set: selectedSet, empty: !selectedValues.length });
  nativeState.current = { set: selectedSet, empty: !selectedValues.length };
  const syncNative = () => {
    const select = selectRef.current;
    if (!select) return;
    const { set, empty } = nativeState.current;
    Array.from(select.options).forEach((option) => {
      option.selected = set.has(option.value);
    });
    if (!multiple && empty) select.selectedIndex = -1;
  };
  useEnhancedEffect(syncNative);

  // `reset` del formulario: vuelve al valor inicial (modo no controlado). El evento llega antes de que el
  // navegador restablezca el <select>, así que el nativo se resincroniza después.
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const owner = selectRef.current?.form;
    if (!owner) return undefined;
    const handleReset = () => {
      setValueState(initialValue);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        resetTimer.current = null;
        syncNative();
      }, 0);
    };
    owner.addEventListener('reset', handleReset);
    return () => {
      owner.removeEventListener('reset', handleReset);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, setValueState]);

  // Al cerrar con el foco dentro del menú (búsqueda u `open` controlado), el foco vuelve al combobox.
  useEnhancedEffect(() => {
    if (isOpen || !menuEl) return;
    const active = document.activeElement;
    if (active && menuEl.contains(active)) controlRef.current?.focus();
  }, [isOpen]);

  // Cierra el menú si el control sale del viewport (scroll o resize), como vanilla.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleViewport = (event: Event) => {
      const control = controlRef.current;
      if (!control) return;
      const rect = control.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) setOpen(false, event);
    };
    window.addEventListener('scroll', handleViewport, true);
    window.addEventListener('resize', handleViewport);
    return () => {
      window.removeEventListener('scroll', handleViewport, true);
      window.removeEventListener('resize', handleViewport);
    };
  }, [isOpen, setOpen]);

  const layer = useLayer({
    open: isOpen,
    kind: 'popup',
    nodes: () => menuEl,
    stack: () => (menuEl ? [{ node: menuEl }] : []),
    onEscape: (event) => {
      setOpen(false, event);
      controlRef.current?.focus();
    },
  });

  useClickAway(
    () => [controlRef.current, menuEl],
    (event) => {
      if (layer.isInUpperLayer(event.target)) return;
      setOpen(false, event);
    },
    { enabled: isOpen },
  );

  usePosition(controlRef, menuEl, {
    open: mounted && Boolean(menuEl),
    placement: 'bottom-start',
    offset: 4,
    padding: 16,
    rtl,
    dropdown: { matchWidth: true },
  });

  /**
   * Selecciona o alterna una opción (`_onOptionClick` de vanilla).
   * @param {Item} item Opción.
   * @param {SelectEvent} event Evento de origen.
   */
  const chooseItem = (item: Item, event: SelectEvent) => {
    if (readOnly || disabled || isItemDisabled(item)) return;
    setActiveValue(item.value);
    if (multiple) {
      const next = new Set(selectedSet);
      if (next.has(item.value)) next.delete(item.value);
      else {
        if (selectedItems.length >= limit) return;
        next.add(item.value);
      }
      commit(
        items.filter((option) => next.has(option.value)).map((option) => option.value),
        event,
      );
      return;
    }
    if (valueState !== item.value) commit(item.value, event);
    setOpen(false, event);
    controlRef.current?.focus();
  };

  const selectAll = (event: SelectEvent) => {
    if (!multiple || readOnly || disabled) return;
    let count = 0;
    const next: string[] = [];
    items.forEach((item) => {
      if (!item.disabled && count < limit) {
        next.push(item.value);
        count += 1;
      }
    });
    commit(next, event);
  };

  const clearAll = (event: SelectEvent) => {
    if (!multiple || readOnly || disabled) return;
    commit([], event);
  };

  /**
   * Mueve la opción activa.
   * @param {number|'first'|'last'} step Desplazamiento o extremo.
   */
  const moveActive = (step: number | 'first' | 'last') => {
    if (!navigable.length) return;
    if (step === 'first') return setActiveValue(navigable[0].value);
    if (step === 'last') return setActiveValue(navigable[navigable.length - 1].value);
    let index = activeItem ? navigable.indexOf(activeItem) : -1;
    index += step;
    if (index < 0) index = navigable.length - 1;
    if (index >= navigable.length) index = 0;
    setActiveValue(navigable[index].value);
  };

  /**
   * Typeahead: salta a la opción cuyo texto empieza por lo tecleado.
   * @param {string} char Carácter pulsado.
   */
  const runTypeahead = (char: string, event: SelectEvent, closed = false) => {
    const state = typeahead.current;
    if (state.timer) clearTimeout(state.timer);
    state.buffer += normalizeText(char);
    state.timer = setTimeout(() => {
      state.buffer = '';
      state.timer = null;
    }, TYPEAHEAD_TIMEOUT);
    // Cerrado (selección única) recorre todas las opciones y selecciona la coincidencia.
    const list = closed ? items.filter((item) => !item.disabled) : navigable;
    const current = closed ? (list.find((item) => item.value === valueState) ?? null) : activeItem;
    if (!list.length) return;
    const start = current ? list.indexOf(current) + (state.buffer.length === 1 ? 1 : 0) : 0;
    for (let offset = 0; offset < list.length; offset += 1) {
      const item = list[(start + offset) % list.length];
      if (normalizeText(item.label).startsWith(state.buffer)) {
        if (closed) {
          if (item.value !== valueState) commit(item.value, event);
        } else setActiveValue(item.value);
        return;
      }
    }
  };

  /**
   * Teclado con el menú abierto (combobox o caja de búsqueda).
   * @param {ReactKeyboardEvent} event Evento.
   * @param {boolean} fromSearch El foco está en la búsqueda.
   */
  const handleOpenKeyDown = (event: ReactKeyboardEvent<HTMLElement>, fromSearch: boolean) => {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      moveActive(key === 'ArrowDown' ? 1 : -1);
    } else if ((key === 'Home' || key === 'End') && !fromSearch) {
      event.preventDefault();
      moveActive(key === 'Home' ? 'first' : 'last');
    } else if (key === 'Enter' || (key === ' ' && !fromSearch)) {
      event.preventDefault();
      if (activeItem) chooseItem(activeItem, event);
      else if (!fromSearch) setOpen(false, event);
    } else if (key === 'Tab') {
      // Desde la búsqueda, el foco vuelve al combobox antes de la acción por defecto de Tab.
      if (fromSearch) controlRef.current?.focus();
      setOpen(false, event);
    } else if (!fromSearch && key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      runTypeahead(key, event);
    }
  };

  const handleControlKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly || event.defaultPrevented) return;
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setOpen(true, event);
      } else if (!multiple && (event.key === 'Home' || event.key === 'End')) {
        // Patrón select-only: con el menú cerrado Home/End seleccionan la primera/última opción.
        event.preventDefault();
        const enabled = items.filter((item) => !item.disabled);
        const target = event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1];
        if (target && target.value !== valueState) commit(target.value, event);
      } else if (
        !multiple &&
        event.key.length === 1 &&
        event.key !== ' ' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        runTypeahead(event.key, event, true);
      }
      return;
    }
    handleOpenKeyDown(event, false);
  };

  const handleControlClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    setOpen(!isOpen, event);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setSearchInput(next);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      searchTimer.current = null;
      setTerm(next);
    }, SEARCH_DEBOUNCE);
  };

  // Cambios del <select> nativo ajenos al menú (autocompletado del navegador).
  const handleNativeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    inputProps?.onChange?.(event);
    const target = event.target;
    commit(multiple ? Array.from(target.selectedOptions, (option) => option.value) : target.value, event);
  };

  // ---- Display del control (`_renderDisplay` de vanilla) ----
  let displayText: string = placeholder;
  let displayMedia: ReactNode = null;
  let empty = !selectedItems.length;
  let custom: ReactNode = null;
  if (renderValue && selectedItems.length) {
    custom = renderValue(
      selectedItems.map((item) => ({
        value: item.value,
        label: item.label,
        icon: item.icon,
        image: item.image,
        secondary: item.secondary,
        disabled: item.disabled,
      })),
    );
  } else if (multiple) {
    const kind = getSelectedDisplayKind(selectedItems.length, selectedTextFormat);
    const count = selectedItems.length;
    if (kind === 'values') displayText = selectedItems.map((item) => item.label).join(', ');
    else if (kind === 'count') {
      const key = selectedTextFormat === 'count' && count === 1 ? 'selectedCountSingular' : 'selectedCountPlural';
      displayText = t(key, [count], `${count} selected`);
    }
  } else if (selectedItems[0]) {
    const current = selectedItems[0];
    // Una opción con valor vacío equivale a "sin selección" si hay placeholder.
    if (current.value === '' && placeholder) empty = true;
    else {
      displayText = current.label;
      displayMedia = current.icon ?? current.image;
    }
  }

  const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false && helperText !== '';
  const hasStart = startIcon !== undefined && startIcon !== null && startIcon !== false && startIcon !== '';
  const describedBy = Array.from(
    new Set(
      [...(ariaDescribedByProp ?? '').split(/\s+/), hasHelper ? helperId : '', ...(hasHelper ? [] : (formControl?.helperTextIds ?? []))].filter(
        Boolean,
      ),
    ),
  ).join(' ');

  const startAdornment = hasStart
    ? isImageUrl(startIcon)
      ? (
        <img
          className="mtx-select__adornment mtx-select__adornment--start mtx-select__adornment--image"
          src={startIcon}
          alt=""
          aria-hidden="true"
        />
      )
      : (
        <span
          className={cx('mtx-select__adornment mtx-select__adornment--start', typeof startIcon === 'string' && 'material-icons')}
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )
    : null;

  const renderNativeOption = (item: Item) => (
    <option key={item.index} value={item.value} disabled={item.disabled || undefined}>
      {item.label}
    </option>
  );

  const renderOption = (item: Item) => {
    const isSelected = selectedSet.has(item.value);
    const isDisabled = isItemDisabled(item);
    const isActive = activeItem === item;
    const activeStyle: CSSProperties | undefined = isActive
      ? {
          backgroundColor: isSelected
            ? 'color-mix(in srgb, var(--mtx-select-accent) 12%, transparent)'
            : 'var(--mtx-color-action-hover)',
        }
      : undefined;
    return (
      <div
        key={item.index}
        id={optionId(item)}
        className={cx(
          'mtx-select__option',
          isSelected && 'mtx-select__option--selected',
          isDisabled && 'mtx-select__option--disabled',
          isActive && 'mtx-select__option--focused',
        )}
        role="option"
        aria-selected={isSelected ? 'true' : 'false'}
        aria-disabled={isDisabled ? 'true' : undefined}
        data-value={item.value}
        style={activeStyle}
        onClick={(event) => chooseItem(item, event)}
        onMouseMove={() => {
          if (!isDisabled && activeValue !== item.value) setActiveValue(item.value);
        }}
      >
        {multiple ? <span className="mtx-select__check" /> : null}
        {renderMedia(item.icon ?? item.image, 'mtx-select__option')}
        <span className="mtx-select__option-text">
          {item.label}
          {item.secondary ? (
            <>
              <br />
              <span className="mtx-select__option-secondary mtx-typography mtx-typography--body2 mtx-typography--color-text-secondary">
                {item.secondary}
              </span>
            </>
          ) : null}
        </span>
      </div>
    );
  };

  const noMatches = search && term.trim() !== '' && visibleItems.length === 0;
  const noResultsMessage = noMatches
    ? (() => {
        const template = noResultsText ?? t('noneResultsText', null, 'No results found for "{0}"');
        return template.includes('{0}') ? template.replace('{0}', term) : template;
      })()
    : '';

  const menu = mounted ? (
    <Portal>
      <div
        ref={setMenuEl}
        className={cx('mtx-select__menu', `mtx-select__menu--color-${color}`, menuClassName)}
        dir={rtl ? 'rtl' : 'ltr'}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'scale(1, 1)' : 'scale(0.85, 0.85)',
          transition: prefersReducedMotion()
            ? undefined
            : `transform ${TRANSITION_DURATION}ms ${ENTER_EASING}, opacity ${TRANSITION_DURATION}ms ${ENTER_EASING}`,
        }}
        onMouseDown={(event) => {
          // Conserva el foco en el combobox o en la búsqueda.
          if (event.target !== searchRef.current) event.preventDefault();
        }}
      >
        {header ? <div className="mtx-select__header">{header}</div> : null}
        {search ? (
          <div className="mtx-select__search-wrap">
            <input
              ref={searchRef}
              type="text"
              className="mtx-select__search"
              placeholder={searchPlaceholder ?? t('searchPlaceholder', null, 'Search…')}
              aria-label={t('searchAriaLabel', null, 'Search options')}
              aria-controls={listboxId}
              aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
              autoComplete="off"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(event) => handleOpenKeyDown(event, true)}
            />
          </div>
        ) : null}
        {actionsBox && multiple ? (
          <div className="mtx-select__actions">
            <button type="button" className="mtx-select__action mtx-select__action--select-all" onClick={selectAll}>
              {selectAllText ?? t('selectAllText', null, 'Select all')}
            </button>
            <button type="button" className="mtx-select__action mtx-select__action--deselect-all" onClick={clearAll}>
              {deselectAllText ?? t('deselectAllText', null, 'Deselect all')}
            </button>
          </div>
        ) : null}
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple ? 'true' : undefined}
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-label={!hasLabel ? ariaLabel : undefined}
        >
          {entries.map((entry, index) => {
            if (entry.kind === 'item') return visibleSet.has(entry.item) ? renderOption(entry.item) : null;
            const groupItems = entry.items.filter((item) => visibleSet.has(item));
            if (!groupItems.length) return null;
            const groupLabelId = `${baseId}-group-${index}`;
            return (
              <div key={`group-${index}`} role="group" aria-labelledby={groupLabelId}>
                <div className="mtx-select__optgroup" id={groupLabelId}>
                  {entry.label}
                </div>
                {groupItems.map(renderOption)}
              </div>
            );
          })}
        </div>
        {noMatches ? (
          <div className="mtx-select__no-results" role="status">
            {noResultsMessage}
          </div>
        ) : null}
      </div>
    </Portal>
  ) : null;

  return (
    <>
      <div
        ref={ref}
        id={baseId}
        className={cx(
          'mtx-select',
          className,
          `mtx-select--${variant}`,
          `mtx-select--color-${color}`,
          colorProp && color !== 'primary' && color !== 'error' && `mtx-select--${color}`,
          error && 'mtx-select--error',
          size === 'small' && 'mtx-select--small',
          hiddenLabel && 'mtx-select--hidden-label',
          hasStart && 'mtx-select--adorned-start',
          isOpen && 'mtx-select--open',
        )}
        style={fullWidth ? style : { width: 'auto', ...style }}
        {...rest}
      >
        {hasLabel ? (
          <label className="mtx-select__label" id={labelId}>
            {label}
          </label>
        ) : null}
        <div
          ref={handleControlRef}
          id={controlId}
          className="mtx-select__control"
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={mounted ? listboxId : undefined}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-labelledby={ariaLabelledBy ?? (hasLabel ? labelId : undefined)}
          aria-label={!hasLabel && !ariaLabelledBy ? ariaLabel : undefined}
          aria-activedescendant={isOpen && !search && activeItem ? optionId(activeItem) : undefined}
          aria-disabled={disabled ? 'true' : 'false'}
          aria-readonly={readOnly ? 'true' : undefined}
          aria-required={required ? 'true' : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          tabIndex={disabled ? -1 : 0}
          // Con el menú abierto el borde de 2px ya marca el foco: sin anillo global duplicado.
          style={isOpen ? { outline: 'none' } : undefined}
          onClick={handleControlClick}
          onKeyDown={handleControlKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {startAdornment}
          <select
            {...inputProps}
            ref={handleSelectRef}
            className={cx('mtx-select__native', inputProps?.className)}
            tabIndex={-1}
            aria-hidden="true"
            name={name ?? inputProps?.name}
            form={form ?? inputProps?.form}
            multiple={multiple || undefined}
            disabled={disabled || undefined}
            required={required || undefined}
            onChange={handleNativeChange}
          >
            {entries.map((entry, index) =>
              entry.kind === 'item' ? (
                renderNativeOption(entry.item)
              ) : (
                <optgroup key={`group-${index}`} label={entry.label} disabled={entry.disabled || undefined}>
                  {entry.items.map(renderNativeOption)}
                </optgroup>
              ),
            )}
          </select>
          <span className={cx('mtx-select__display', empty && 'mtx-select__display--empty')}>
            {custom ?? (
              <>
                {renderMedia(displayMedia, 'mtx-select__display')}
                <span className="mtx-select__display-text">{displayText}</span>
              </>
            )}
          </span>
          <Chevron />
          {variant === 'outlined' ? (
            <fieldset className="mtx-select__outline" aria-hidden="true">
              {hasLabel && !hiddenLabel ? (
                <legend className="mtx-select__legend">
                  <span>{label}</span>
                </legend>
              ) : null}
            </fieldset>
          ) : null}
        </div>
        {hasHelper ? (
          <div className="mtx-select__helper-text" id={helperId}>
            {helperText}
          </div>
        ) : null}
      </div>
      {menu}
    </>
  );
});
