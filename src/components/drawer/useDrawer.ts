'use client';
/**
 * Hook `useDrawer`: estado y props listas para los disparadores y su Drawer
 * (equivalente React de `data-mtx-drawer-open` / `data-mtx-drawer-toggle`).
 */
import { useCallback, useId, useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { DrawerCloseEvent, DrawerCloseReason } from './Drawer';

/** Opciones de {@link useDrawer}. */
export interface UseDrawerOptions {
  /** Id del drawer (por defecto uno generado). */
  id?: string;
  /** Abierto inicialmente. */
  defaultOpen?: boolean;
  /** Al abrirse. */
  onOpen?: () => void;
  /** Al cerrarse, con el motivo (`api` si lo cierra el código o un disparador). */
  onClose?: (reason: DrawerCloseReason | 'api') => void;
}

/** Props para un disparador. */
export interface DrawerTriggerProps {
  'aria-controls': string;
  'aria-expanded': boolean;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Opciones de `getTriggerProps`. */
export interface DrawerTriggerOptions {
  /** `open` solo abre (`data-mtx-drawer-open`); `toggle` alterna (por defecto). */
  action?: 'open' | 'toggle';
  /** Clic adicional; `preventDefault()` evita la acción. */
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Props para el Drawer controlado por el hook. */
export interface DrawerStateProps {
  id: string;
  open: boolean;
  onClose: (event: DrawerCloseEvent, reason: DrawerCloseReason) => void;
}

/** Resultado de {@link useDrawer}. */
export interface UseDrawerResult {
  /** Estado abierto. */
  open: boolean;
  /** Fija el estado. */
  setOpen: (open: boolean) => void;
  /** Alterna el estado. */
  toggle: () => void;
  /** Props de un disparador: `aria-controls`, `aria-expanded` y `onClick`. */
  getTriggerProps: (options?: DrawerTriggerOptions) => DrawerTriggerProps;
  /** Props para `<Drawer {...drawerProps}>`. */
  drawerProps: DrawerStateProps;
}

/**
 * Gestiona un drawer con disparadores accesibles; con `aria-controls` el disparador queda fuera del clic exterior.
 * @param {UseDrawerOptions} [options] Id, estado inicial y callbacks.
 * @returns {UseDrawerResult} Estado, acciones y props.
 */
export function useDrawer(options: UseDrawerOptions = {}): UseDrawerResult {
  const { defaultOpen = false, onOpen, onClose } = options;
  const autoId = useId();
  const id = options.id || `mtx-drawer-${autoId.replace(/:/g, '')}`;
  const [open, setOpenState] = useState(defaultOpen);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      setOpenState(next);
      if (next) onOpen?.();
      else onClose?.('api');
    },
    [open, onOpen, onClose],
  );
  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const getTriggerProps = useCallback(
    ({ action = 'toggle', onClick }: DrawerTriggerOptions = {}): DrawerTriggerProps => ({
      'aria-controls': id,
      'aria-expanded': open,
      onClick: (event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(action === 'open' ? true : !open);
      },
    }),
    [id, open, setOpen],
  );

  const drawerProps = useMemo<DrawerStateProps>(
    () => ({
      id,
      open,
      onClose: (_event, reason) => {
        setOpenState(false);
        onClose?.(reason);
      },
    }),
    [id, open, onClose],
  );

  return { open, setOpen, toggle, getTriggerProps, drawerProps };
}
