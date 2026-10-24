'use client';
import { createContext, useContext } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from 'react';

/** Detalle de la selección (equivalente al `detail` de `mtx:menu:select`). */
export interface MenuSelectDetail {
  /** Ítem activado. */
  item: HTMLElement;
  /** Valor del ítem (`value` de `MenuItem`). */
  value?: string;
  /** Nuevo estado en `menuitemcheckbox` / `menuitemradio`. */
  checked?: boolean;
}

/**
 * Motivo del cierre solicitado con `onClose`: Escape, clic fuera, Tab, selección de un ítem,
 * ancla fuera de la vista o vuelta atrás desde un submenú (flecha izquierda, derecha en RTL).
 */
export type MenuCloseReason =
  | 'escapeKeyDown'
  | 'backdropClick'
  | 'tabKeyDown'
  | 'itemClick'
  | 'anchorHidden'
  | 'submenuClose';

/** Evento que acompaña a una petición de cierre. */
export type MenuCloseEvent = Event | SyntheticEvent | null;

/** Foco al abrir un submenú: ninguno (hover), el contenedor (clic) o el primer ítem (teclado). */
export type SubmenuFocus = 'none' | 'menu' | 'item';

/** Contexto interno que un `Menu` ofrece a su `MenuList` y a sus submenús. */
export interface MenuInternalContextValue {
  /** Menú abierto. */
  open: boolean;
  /** Dirección resuelta del menú. */
  rtl: boolean;
  /** Indica si es un submenú. */
  isSubmenu: boolean;
  /** Notifica la selección de un ítem (sube por la cadena de submenús hasta la raíz). */
  select: (detail: MenuSelectDetail, event: SyntheticEvent) => void;
  /** Solicita el cierre de este menú. */
  requestClose: (event: MenuCloseEvent, reason: MenuCloseReason) => void;
  /** Gestiona Tab: cierra la cadena completa y devuelve el foco al disparador raíz. */
  requestTab: (event: ReactKeyboardEvent) => void;
}

/** Contexto que una `MenuList` ofrece a sus ítems. */
export interface MenuListContextValue {
  /** Ítems compactos heredados. */
  dense: boolean;
  /** Dirección de la lista. */
  rtl: boolean;
  /** Clave del submenú abierto (o `null`). */
  openKey: string | null;
  /** Foco solicitado para el submenú abierto. */
  submenuFocus: SubmenuFocus;
  /** Abre el submenú de una clave. */
  openSubmenu: (key: string, focus: SubmenuFocus) => void;
  /** Cierra el submenú abierto (o solo el de la clave indicada). */
  closeSubmenu: (key?: string) => void;
  /** Hover sobre un ítem: cierra a los 50 ms el submenú de otro ítem. */
  hoverItem: (key: string) => void;
  /** Fin del hover: cancela el cierre pendiente. */
  leaveItem: () => void;
  /** Selección de un ítem. */
  select: (detail: MenuSelectDetail, event: SyntheticEvent) => void;
}

/** Contexto de un grupo de opciones `menuitemradio`. */
export interface MenuGroupContextValue {
  /** Valor marcado del grupo (`undefined` = el grupo no controla la selección). */
  value: string | null | undefined;
  /** Marca un valor. */
  setValue: (value: string) => void;
}

/** Datos del ítem que abre un submenú. */
export interface SubmenuTriggerContextValue {
  /** Clave compartida con la lista padre (hover). */
  itemKey: string;
}

export const MenuInternalContext = createContext<MenuInternalContextValue | null>(null);
export const MenuListContext = createContext<MenuListContextValue | null>(null);
export const MenuGroupContext = createContext<MenuGroupContextValue | null>(null);
export const SubmenuTriggerContext = createContext<SubmenuTriggerContextValue | null>(null);

/**
 * Lee el contexto de la lista de menú contenedora.
 * @returns {MenuListContextValue|null} Contexto o `null` fuera de una lista.
 */
export function useMenuListContext(): MenuListContextValue | null {
  return useContext(MenuListContext);
}
