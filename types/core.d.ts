/**
 * API del núcleo de Materix UI (`materix-ui/core` y parte de `materix-ui`).
 *
 * Registro de componentes, ciclo de vida, eventos, tema, i18n y posicionamiento.
 */
import type * as M from './lib/index.js';
import type { ComponentBase } from './lib/core/component-base.js';
import type {
  MtxEventDetailMap,
  MtxEventDetail,
  MtxDeprecatedEventDetailMap,
  MtxThemeName,
  MtxThemeMode,
} from './events.js';

export { ComponentBase } from './lib/core/component-base.js';
export { createRipple } from './lib/core/ripple.js';
export type * from './events.js';

// --- Registro y ciclo de vida ------------------------------------------------

/** Clase de componente registrable (`new Clase(element)`). */
export type ComponentConstructor<T extends object = ComponentBase> = new (element: HTMLElement, ...args: any[]) => T;

/** Instancia creada para cada valor de `data-mtx` registrado por la librería. */
export interface MtxComponentMap {
  'accordion': M.Accordion;
  'accordion-actions': M.AccordionActions;
  'accordion-group': M.AccordionGroup;
  'alert': M.Alert;
  'alert-title': M.ComponentBase;
  'app-bar': M.AppBar;
  'autocomplete': M.Autocomplete;
  'avatar': M.Avatar;
  'avatar-group': M.AvatarGroup;
  'backdrop': M.Backdrop;
  'badge': M.Badge;
  'breadcrumbs': M.Breadcrumbs;
  'button': M.Button;
  'button-group': M.ButtonGroup;
  'card': M.Card;
  'card-action-area': M.CardActionArea;
  'card-actions': M.CardActions;
  'card-content': M.CardContent;
  'card-header': M.CardHeader;
  'card-media': M.CardMedia;
  'checkbox': M.Checkbox;
  'chip': M.Chip;
  'circular-progress': M.CircularProgress;
  'container': M.Container;
  'css-baseline': M.CssBaseline;
  'date-picker': M.DateTimePicker;
  'date-range-picker': M.DateTimePicker;
  'date-time-picker': M.DateTimePicker;
  'datepicker': M.DateTimePicker;
  'daterangepicker': M.DateTimePicker;
  'datetime-picker': M.DateTimePicker;
  'datetime-range-picker': M.DateTimePicker;
  'datetimepicker': M.DateTimePicker;
  'datetimerangepicker': M.DateTimePicker;
  'dialog': M.Dialog;
  'dialog-actions': M.DialogActions;
  'divider': M.Divider;
  'drawer': M.Drawer;
  'fab': M.Fab;
  'form-helper-text': M.FormHelperText;
  'grid': M.Grid;
  'grid-container': M.Grid;
  'grid-item': M.Grid;
  'icon-button': M.IconButton;
  'input': M.TextField;
  'linear-progress': M.LinearProgress;
  'link': M.Link;
  'list': M.List;
  'list-item': M.ListItem;
  'list-item-avatar': M.ListItemAvatar;
  'list-item-button': M.ListItemButton;
  'list-item-icon': M.ListItemIcon;
  'list-item-secondary-action': M.ListItemSecondaryAction;
  'list-item-text': M.ListItemText;
  'list-subheader': M.ListSubheader;
  'menu': M.Menu;
  'menu-item': M.MenuItem;
  'mobile-stepper': M.MobileStepper;
  'native-select': M.NativeSelect;
  'pagination': M.Pagination;
  'paper': M.Paper;
  'popover': M.Popover;
  'radio': M.Radio;
  'radio-group': M.RadioGroup;
  'rating': M.Rating;
  'select': M.Select;
  'skeleton': M.Skeleton;
  'slider': M.Slider;
  'snackbar': M.Snackbar;
  'speed-dial': M.SpeedDial;
  'stack': M.Stack;
  'stepper': M.Stepper;
  'switch': M.Switch;
  'tab': M.Tab;
  'tab-panel': M.ComponentBase;
  'table': M.Table;
  'table-body': M.TableBody;
  'table-cell': M.TableCell;
  'table-container': M.TableContainer;
  'table-foot': M.TableFooter;
  'table-footer': M.TableFooter;
  'table-head': M.TableHead;
  'table-pagination': M.TablePagination;
  'table-row': M.TableRow;
  'table-sort-label': M.TableSortLabel;
  'table-toolbar': M.TableToolbar;
  'tabs': M.Tabs;
  'text-field': M.TextField;
  'textarea': M.TextField;
  'time-picker': M.DateTimePicker;
  'timepicker': M.DateTimePicker;
  'toggle-button': M.ToggleButton;
  'toggle-button-group': M.ToggleButtonGroup;
  'tooltip': M.Tooltip;
  'typography': M.Typography;
}

/** Valor de `data-mtx` reconocido por la librería. */
export type MtxComponentName = keyof MtxComponentMap;

/** Raíz admitida por `initAll`, `destroyAll` y `watch`. */
export type MtxRoot = Document | Element | DocumentFragment;

/**
 * Registra una clase de componente por su nombre `data-mtx`.
 * @param name Valor de `data-mtx`.
 * @param ComponentClass Clase del componente.
 */
export function registerComponent(name: string, ComponentClass: ComponentConstructor<object>): void;

/**
 * Obtiene la instancia asociada a un elemento (original o raíz generada).
 * @example const dialog = getInstance<Dialog>(document.getElementById('confirm'));
 */
export function getInstance<T extends object = ComponentBase>(element: Element | null | undefined): T | undefined;

/** Inicializa un elemento (idempotente). Con `componentName` fija el componente aunque no tenga `data-mtx`. */
export function initElement<K extends MtxComponentName>(element: HTMLElement, componentName: K): MtxComponentMap[K] | null;
export function initElement<T extends object = ComponentBase>(element: HTMLElement, componentName?: string): T | null;

/** Alias de `initElement`. */
export function init<K extends MtxComponentName>(element: HTMLElement, name: K): MtxComponentMap[K] | null;
export function init<T extends object = ComponentBase>(element: HTMLElement, name?: string): T | null;

/** Inicializa todos los `[data-mtx]` pendientes dentro de `root` (idempotente). */
export function initAll(root?: MtxRoot): void;

/** Opciones de `watch()`. */
export interface WatchOptions {
  /** Destruye las instancias de los nodos eliminados que sigan desconectados (por defecto `false`). */
  destroyOnRemove?: boolean;
}

/** Observa `root` e inicializa los componentes añadidos dinámicamente. Se detiene con `disconnect()`. */
export function watch(root?: MtxRoot, options?: WatchOptions): MutationObserver;

/** Destruye la instancia de un elemento. Devuelve `true` si existía. */
export function destroy(element: Element): boolean;

/** Destruye todas las instancias dentro de `root` (incluido). Devuelve cuántas destruyó. */
export function destroyAll(root?: MtxRoot): number;

// --- Eventos -------------------------------------------------------------------

/** Opciones de `emit()`. */
export interface EmitOptions {
  /** Nombres deprecados que se emiten también con el mismo `detail`. */
  aliases?: string[];
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

/** Emite un `CustomEvent` (y sus alias). Devuelve `false` si se canceló. */
export function emit<K extends keyof MtxEventDetailMap | keyof MtxDeprecatedEventDetailMap>(
  target: EventTarget, name: K, detail?: MtxEventDetail<K>, options?: EmitOptions): boolean;
export function emit(target: EventTarget, name: string, detail?: unknown, options?: EmitOptions): boolean;

// --- Tema ----------------------------------------------------------------------

export type ThemeName = MtxThemeName;
export type ThemeMode = MtxThemeMode;

/** Opciones de `theme.set()`. */
export interface ThemeSetOptions {
  /** Guarda el modo en `localStorage` (clave configurada). */
  persist?: boolean;
}

/** Opciones de `theme.configure()`. */
export interface ThemeConfigureOptions {
  /** `true` usa la clave `mtx-theme`; un string usa esa clave; `false` desactiva la persistencia. */
  persist?: boolean | string;
  /** `true` lee `?theme=`; un string usa ese parámetro; `false` lo desactiva. */
  query?: boolean | string;
}

/** API de tema (`Materix.theme`). Emite `mtx:theme:change` en `document`. */
export interface ThemeAPI {
  /** Tema efectivo. */
  get(): ThemeName;
  /** Modo solicitado (incluye `system`). */
  getMode(): ThemeMode;
  /** Cambia el modo y devuelve el tema efectivo. */
  set(mode: ThemeMode, options?: ThemeSetOptions): ThemeName;
  /** Alterna claro/oscuro. */
  toggle(): ThemeName;
  configure(options?: ThemeConfigureOptions): ThemeName;
  /** Sincroniza los botones `[data-mtx-theme-toggle]` de `root`. */
  sync(root?: ParentNode): void;
}

export const theme: ThemeAPI;

// --- i18n ----------------------------------------------------------------------

/** Diccionario de un idioma: `{ componente: { clave: texto } }`. */
export type LocaleDictionary = Record<string, Record<string, unknown>>;

/** Idioma global actual (`en` por defecto). */
export function getLocale(): string;
/** Cambia el idioma global y emite `mtx:locale:change`. Devuelve `false` si no existe. */
export function setLocale(locale: string): boolean;
/** Anula el `setLocale()` explícito: vuelve a mandar `<html lang>`. Emite `mtx:locale:change`. */
export function resetLocale(): void;
/** Registra un idioma completo. */
export function addLocale(code: string, dictionary: LocaleDictionary): void;
/** Fusiona textos en un idioma existente. */
export function updateLocale(code: string, partialDictionary: LocaleDictionary): void;
/** Diccionario de un idioma (o del actual). */
export function getDictionary(locale?: string | null): LocaleDictionary;
/** Traducción de `component.key` con interpolación `{0}` / `{nombre}`. */
export function t<T = string>(
  component: string, key: string, params?: unknown[] | Record<string, unknown> | null,
  fallback?: unknown, locale?: string | null): T;
/** Idioma efectivo de un elemento (`data-locale`, `lang`, global). */
export function getComponentLocale(element: Element | null): string;

/** API de i18n (`Materix.i18n`). */
export interface I18nAPI {
  getLocale: typeof getLocale;
  setLocale: typeof setLocale;
  resetLocale: typeof resetLocale;
  addLocale: typeof addLocale;
  updateLocale: typeof updateLocale;
  getDictionary: typeof getDictionary;
  t: typeof t;
  getComponentLocale: typeof getComponentLocale;
}

export const i18n: I18nAPI;

// --- Posicionamiento -----------------------------------------------------------

export type Side = 'top' | 'bottom' | 'left' | 'right';
/** Lado con alineación opcional (`start`/`end` son lógicos: respetan RTL). */
export type Placement = Side | `${Side}-start` | `${Side}-end`;

/** Ancla virtual (p. ej. la posición del cursor). */
export interface VirtualElement {
  getBoundingClientRect(): DOMRect | { top: number; left: number; right: number; bottom: number; width: number; height: number };
}

/** Opciones de `computePosition()`. */
export interface ComputePositionOptions {
  /** Por defecto `bottom`. */
  placement?: Placement;
  /** Separación con el ancla en px (8). */
  offset?: number;
  /** Cambia al lado opuesto si no cabe (`true`). */
  flip?: boolean;
  /** Desplaza en el eje cruzado para no salir del viewport (`true`). */
  shift?: boolean;
  /** Margen mínimo con el viewport en px (8). */
  padding?: number;
  /** Fuerza RTL (por defecto se detecta en el ancla). */
  rtl?: boolean;
}

/** Resultado de `computePosition()`. */
export interface ComputePositionResult {
  /** Coordenadas de viewport (para `position: fixed`). */
  x: number;
  y: number;
  /** Colocación final (lógica) tras `flip`. */
  placement: Placement;
  side: Side;
  align: '' | 'start' | 'end';
  /** Centro del ancla en el eje cruzado relativo a la superficie (flecha). */
  arrowOffset: number;
}

/** Calcula la posición de una superficie flotante respecto de un ancla. */
export function computePosition(
  anchor: Element | VirtualElement, floating: HTMLElement, options?: ComputePositionOptions): ComputePositionResult;

/** Recalcula la posición en scroll/resize mientras esté activo. Devuelve la función de limpieza. */
export function autoUpdate(anchor: Element | VirtualElement, floating: HTMLElement, update: () => void): () => void;
