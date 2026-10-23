/**
 * Mapa tipado de los eventos `mtx:*` de Materix UI.
 *
 * Convención: `mtx:{componente}:{acción}`. Los nombres antiguos se siguen emitiendo
 * como alias deprecados (mismo `detail`) hasta la versión 1.0.
 *
 * Al importar `materix-ui` (o cualquier `materix-ui/components/*`) se amplían
 * `HTMLElementEventMap` y `DocumentEventMap`, de modo que
 * `element.addEventListener('mtx:tabs:change', (e) => e.detail.tab)` queda tipado.
 */
import type { DateTimePicker } from './lib/components/date-time-picker/date-time-picker.js';
import type { Popover } from './lib/components/popover/popover.js';
import type { SpeedDial } from './lib/components/speed-dial/speed-dial.js';
import type { Tooltip } from './lib/components/tooltip/tooltip.js';

/** Tema efectivo. */
export type MtxThemeName = 'light' | 'dark';
/** Modo de tema solicitado (`system` sigue a `prefers-color-scheme`). */
export type MtxThemeMode = MtxThemeName | 'system';

/** Opción de Autocomplete tal como la normaliza el componente. */
export interface MtxAutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: string;
  description?: string;
  /** Las propiedades extra de la opción original se conservan. */
  [key: string]: unknown;
}

/** Ítem de Breadcrumbs (`getItems()` / `setItems()`). */
export interface MtxBreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
  data?: Record<string, string>;
}

/** `detail` de `mtx:date-time-picker:change`. */
export interface MtxDateTimePickerChangeDetail {
  isRange: boolean;
  date: Date | null;
  dateTime: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  range: { start: Date | null; end: Date | null };
  /** Hora `HH:mm`. */
  time: string | null;
  /** Valor formateado escrito en el `<input>`. */
  value: string;
  iso: string | null;
  picker: DateTimePicker;
}

/** `detail` de cada evento `mtx:*` (`null` cuando el evento no lleva datos). */
export interface MtxEventDetailMap {
  'mtx:accordion:change': { expanded: boolean };

  'mtx:alert:open': null;
  'mtx:alert:close': null;

  'mtx:autocomplete:input': { inputValue: string; reason: string };
  'mtx:autocomplete:open': { reason: string };
  'mtx:autocomplete:close': { reason: string };
  'mtx:autocomplete:highlight': { option: MtxAutocompleteOption | null; reason: string };
  'mtx:autocomplete:change': {
    value: string | string[];
    /** Opción seleccionada (simple) u opción afectada (múltiple). */
    option: MtxAutocompleteOption | null;
    /** Solo en modo múltiple. */
    options?: MtxAutocompleteOption[];
    reason: string;
  };

  'mtx:backdrop:open': null;
  'mtx:backdrop:close': { reason: string };

  'mtx:breadcrumbs:expand': null;
  /** Cancelable: `preventDefault()` evita la navegación. */
  'mtx:breadcrumbs:navigate': {
    index: number;
    href: string | undefined;
    label: string;
    current: boolean | undefined;
    item: MtxBreadcrumbItem;
    originalEvent: Event;
  };

  'mtx:date-time-picker:open': { picker: DateTimePicker };
  'mtx:date-time-picker:close': { picker: DateTimePicker };
  'mtx:date-time-picker:change': MtxDateTimePickerChangeDetail;

  'mtx:dialog:open': null;
  'mtx:dialog:close': { reason: string };

  'mtx:drawer:open': null;
  'mtx:drawer:close': { reason: string };
  'mtx:drawer:mode-change': { mode: 'temporary' | 'permanent'; previousMode: 'temporary' | 'permanent' | null };

  'mtx:list:select': { item: HTMLElement };

  'mtx:menu:open': null;
  'mtx:menu:close': null;
  'mtx:menu:select': { item: HTMLElement; checked?: boolean };

  /** Cancelable cuando lo origina un clic en modo enlaces. */
  'mtx:pagination:change': { page: number; previousPage: number; href?: string | null };

  'mtx:popover:open': { popover: Popover; anchor: Element | null };
  'mtx:popover:close': { popover: Popover; reason: string };

  'mtx:radio-group:change': { value: string };

  'mtx:rating:active': { value: number | null };
  'mtx:rating:change': { value: number | null };

  'mtx:skeleton:change': { loading: boolean };

  'mtx:slider:input': { value: number | number[]; activeThumb: number };
  'mtx:slider:change': { value: number | number[] };

  'mtx:snackbar:open': null;
  'mtx:snackbar:close': { reason: string };
  'mtx:snackbar:action': null;

  'mtx:speed-dial:open': { speedDial: SpeedDial };
  'mtx:speed-dial:close': { speedDial: SpeedDial };

  /** Cancelable: `preventDefault()` impide el cambio de paso. */
  'mtx:stepper:change': { activeStep: number; previousStep: number; reset?: boolean };

  'mtx:table:selection-change': { selected: string[]; rows: HTMLTableRowElement[]; count: number; reason: string };
  'mtx:table:sort': { direction: 'asc' | 'desc'; active: boolean; key: string | null };
  'mtx:table:page-change': { page: number; previousPage: number; reason: string };
  'mtx:table:rows-per-page-change': { rowsPerPage: number; previousRowsPerPage: number; page: number };

  /** Cancelable: `preventDefault()` impide el cambio de pestaña. */
  'mtx:tabs:before-change': { tab: HTMLElement; panel: HTMLElement | null; previousTab: HTMLElement | null; previousPanel: HTMLElement | null };
  'mtx:tabs:change': { tab: HTMLElement; panel: HTMLElement | null; previousTab: HTMLElement | null; previousPanel: HTMLElement | null };

  'mtx:text-field:password-visibility': { visible: boolean };
  'mtx:text-field:adornment-click': {
    position: 'start' | 'end';
    button: HTMLButtonElement;
    input: HTMLInputElement | HTMLTextAreaElement;
  };

  'mtx:toggle-button:change': { selected: boolean; value: string };
  'mtx:toggle-button-group:change': { value: string | string[] | null };

  'mtx:tooltip:open': { tooltip: Tooltip };
  'mtx:tooltip:close': { tooltip: Tooltip };

  /** Se emite en `document` (no burbujea). */
  'mtx:theme:change': { theme: MtxThemeName; mode: MtxThemeMode; previous: MtxThemeName };
  /** Se emite en `document`. */
  'mtx:locale:change': { locale: string };
}

/** Alias deprecados (se emiten junto al nombre canónico hasta 1.0). */
export interface MtxDeprecatedEventDetailMap {
  /** @deprecated Usa `mtx:list:select`. */
  'mtx-select': MtxEventDetailMap['mtx:list:select'];
  /** @deprecated Usa `mtx:radio-group:change` o `mtx:date-time-picker:change`. */
  'mtx:change': MtxEventDetailMap['mtx:radio-group:change'] | MtxEventDetailMap['mtx:date-time-picker:change'];
  /** @deprecated Usa `mtx:date-time-picker:open`. */
  'mtx:open': MtxEventDetailMap['mtx:date-time-picker:open'];
  /** @deprecated Usa `mtx:date-time-picker:close`. */
  'mtx:close': MtxEventDetailMap['mtx:date-time-picker:close'];
  /** @deprecated Usa `mtx:text-field:password-visibility`. */
  'mtx:password-visibility': MtxEventDetailMap['mtx:text-field:password-visibility'];
  /** @deprecated Usa `mtx:text-field:adornment-click`. */
  'mtx:adornment-click': MtxEventDetailMap['mtx:text-field:adornment-click'];
  /** @deprecated Usa `mtx:drawer:mode-change`. */
  'mtx:drawer:modechange': MtxEventDetailMap['mtx:drawer:mode-change'];
  /** @deprecated Usa `mtx:locale:change`. */
  'mtx:localechange': MtxEventDetailMap['mtx:locale:change'];
  /** @deprecated Usa `mtx:theme:change`. */
  'mtx:theme-change': MtxEventDetailMap['mtx:theme:change'];
  /** @deprecated Usa `mtx:speed-dial:open`. */
  'mtx-speed-dial-open': MtxEventDetailMap['mtx:speed-dial:open'];
  /** @deprecated Usa `mtx:speed-dial:close`. */
  'mtx-speed-dial-close': MtxEventDetailMap['mtx:speed-dial:close'];
}

/** Nombre de un evento canónico de Materix UI. */
export type MtxEventName = keyof MtxEventDetailMap;

/** `detail` de un evento (canónico o alias deprecado). */
export type MtxEventDetail<K extends keyof MtxAllEventDetailMap> = MtxAllEventDetailMap[K];

type MtxAllEventDetailMap = MtxEventDetailMap & MtxDeprecatedEventDetailMap;

/** Eventos de Materix UI como `CustomEvent` tipados. */
export type MtxEventMap = { [K in keyof MtxAllEventDetailMap]: CustomEvent<MtxAllEventDetailMap[K]> };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLElementEventMap extends MtxEventMap {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DocumentEventMap extends MtxEventMap {}
}
