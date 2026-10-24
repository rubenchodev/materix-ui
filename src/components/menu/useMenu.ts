'use client';
import { useCallback, useId, useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { MenuAnchorPosition } from './Menu';
import type { MenuCloseEvent, MenuCloseReason } from './MenuContext';

/** Opciones de {@link useMenu}. */
export interface UseMenuOptions {
  /** Id del menú (por defecto uno generado). */
  id?: string;
  /** Estado inicial. */
  defaultOpen?: boolean;
}

/** Props para el disparador devueltas por {@link useMenu}. */
export interface MenuTriggerProps {
  ref: (node: HTMLElement | null) => void;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Props para el `Menu` devueltas por {@link useMenu}. */
export interface MenuBindingProps {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  autoFocusItem: boolean;
  'aria-labelledby': string;
  onClose: (event: MenuCloseEvent, reason: MenuCloseReason) => void;
}

/** Resultado de {@link useMenu}. */
export interface UseMenuResult {
  /** Menú abierto. */
  open: boolean;
  /** Abre el menú (con `focusItem` enfoca el primer ítem). */
  openMenu: (options?: { focusItem?: boolean }) => void;
  /** Cierra el menú. */
  closeMenu: () => void;
  /** Alterna el menú. */
  toggleMenu: () => void;
  /** Esparcir en el disparador: ref, `aria-haspopup`, `aria-expanded`, `aria-controls` y `onClick`. */
  triggerProps: MenuTriggerProps;
  /** Esparcir en el `Menu`: `open`, `anchorEl`, `onClose`, id y etiqueta. */
  menuProps: MenuBindingProps;
}

/**
 * Conecta un disparador con un `Menu` (equivale a `data-open-menu`): alterna al hacer clic,
 * enfoca el primer ítem si se abrió con teclado y mantiene `aria-expanded`/`aria-controls`.
 * @param {UseMenuOptions} [options] Id y estado inicial.
 * @returns {UseMenuResult} Estado, acciones y props para el disparador y el menú.
 */
export function useMenu(options: UseMenuOptions = {}): UseMenuResult {
  const autoId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const menuId = options.id ?? `mtx-menu-${autoId}`;
  const triggerId = `${menuId}-trigger`;
  const [open, setOpen] = useState(Boolean(options.defaultOpen));
  const [focusItem, setFocusItem] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  const openMenu = useCallback((opts: { focusItem?: boolean } = {}) => {
    setFocusItem(Boolean(opts.focusItem));
    setOpen(true);
  }, []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((value) => !value), []);

  const triggerProps = useMemo<MenuTriggerProps>(
    () => ({
      ref: setTrigger,
      id: triggerId,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'aria-controls': open ? menuId : undefined,
      onClick: (event) => {
        // `detail === 0`: activado con teclado (Enter/Espacio) → foco en el primer ítem.
        setFocusItem(event.detail === 0);
        setOpen((value) => !value);
      },
    }),
    [open, menuId, triggerId],
  );

  const menuProps = useMemo<MenuBindingProps>(
    () => ({
      id: menuId,
      open,
      anchorEl: trigger,
      autoFocusItem: focusItem,
      'aria-labelledby': triggerId,
      onClose: () => setOpen(false),
    }),
    [menuId, open, trigger, focusItem, triggerId],
  );

  return { open, openMenu, closeMenu, toggleMenu, triggerProps, menuProps };
}

/** Resultado de {@link useContextMenu}. */
export interface UseContextMenuResult {
  /** Menú abierto. */
  open: boolean;
  /** Cierra el menú. */
  closeMenu: () => void;
  /** Manejador para `onContextMenu` del área (o un listener nativo). */
  onContextMenu: (event: MouseEvent | ReactMouseEvent<Element>) => void;
  /** Esparcir en el `Menu`: `open`, `anchorPosition`/`anchorEl`, `onClose` y foco. */
  menuProps: {
    open: boolean;
    anchorPosition: MenuAnchorPosition | null;
    anchorEl: HTMLElement | null;
    autoFocusItem: boolean;
    onClose: (event: MenuCloseEvent, reason: MenuCloseReason) => void;
  };
}

/**
 * Menú contextual: abre el `Menu` en la posición del puntero con clic derecho; con el teclado
 * (tecla Menú o Mayús+F10) lo ancla al área y enfoca el primer ítem.
 * @returns {UseContextMenuResult} Estado, manejador y props para el `Menu`.
 */
export function useContextMenu(): UseContextMenuResult {
  const [state, setState] = useState<{
    open: boolean;
    position: MenuAnchorPosition | null;
    element: HTMLElement | null;
    keyboard: boolean;
  }>({ open: false, position: null, element: null, keyboard: false });

  const onContextMenu = useCallback((event: MouseEvent | ReactMouseEvent<Element>) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement | null;
    const keyboard = event.button !== 2 && event.clientX === 0 && event.clientY === 0;
    setState({
      open: true,
      position: keyboard ? null : { top: event.clientY, left: event.clientX },
      element: keyboard ? target : null,
      keyboard,
    });
  }, []);
  const closeMenu = useCallback(() => setState((prev) => ({ ...prev, open: false })), []);

  return {
    open: state.open,
    closeMenu,
    onContextMenu,
    menuProps: {
      open: state.open,
      anchorPosition: state.position,
      anchorEl: state.element,
      autoFocusItem: state.keyboard,
      onClose: closeMenu,
    },
  };
}
