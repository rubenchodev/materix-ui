'use client';
/**
 * Hook `usePopover`: estado y props listas para un disparador y su Popover
 * (equivalente React de `data-open-popover="#id"`).
 */
import { useCallback, useId, useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, SyntheticEvent } from 'react';
import type { PositionAnchor } from '../../core';
import type { PopoverCloseReason } from './Popover';

/** Opciones de {@link usePopover}. */
export interface UsePopoverOptions {
  /** Id del popover (por defecto uno generado). */
  id?: string;
  /** Al abrirse (con el ancla usada). */
  onOpen?: (anchor: PositionAnchor) => void;
  /** Al cerrarse, con el motivo. */
  onClose?: (reason: PopoverCloseReason | 'api') => void;
}

/** Props para el disparador (botón). */
export interface PopoverTriggerProps {
  'aria-haspopup': 'dialog';
  'aria-controls': string;
  'aria-expanded': boolean;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Props para el Popover controlado por el hook. */
export interface PopoverStateProps {
  id: string;
  open: boolean;
  anchorEl: PositionAnchor | null;
  onClose: (event: Event | SyntheticEvent, reason: PopoverCloseReason) => void;
}

/** Opciones de `getTriggerProps`. */
export interface PopoverTriggerOptions {
  /** Clave del disparador cuando hay varios (solo el activo recibe `aria-expanded="true"`). */
  key?: string;
  /** Clic adicional del disparador; `preventDefault()` evita abrir. */
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

/** Resultado de {@link usePopover}. */
export interface UsePopoverResult {
  /** Estado abierto. */
  open: boolean;
  /** Ancla actual (elemento o punto virtual). */
  anchor: PositionAnchor | null;
  /** Abre anclado a un elemento, a un punto `{ x, y }` o a un ancla virtual (`open(anchor)`). */
  openPopover: (anchor: PositionAnchor | { x: number; y: number }) => void;
  /** Cierra (motivo `api`). */
  close: () => void;
  /** Alterna: cierra si está abierto o abre anclado a `anchor`. */
  toggle: (anchor: PositionAnchor | { x: number; y: number }) => void;
  /** Props de un disparador (`data-open-popover`); cada disparador es su propia ancla. */
  getTriggerProps: (options?: PopoverTriggerOptions) => PopoverTriggerProps;
  /** Props para `<Popover {...popoverProps}>`. */
  popoverProps: PopoverStateProps;
}

/** Convierte un punto `{ x, y }` en ancla virtual. */
function toAnchor(value: PositionAnchor | { x: number; y: number }): PositionAnchor {
  if ('getBoundingClientRect' in value && typeof value.getBoundingClientRect === 'function') return value;
  const { x, y } = value as { x: number; y: number };
  return { getBoundingClientRect: () => ({ top: y, bottom: y, left: x, right: x, width: 0, height: 0, x, y }) };
}

interface PopoverHookState {
  open: boolean;
  anchor: PositionAnchor | null;
  key: string | null;
}

/**
 * Gestiona un popover con disparadores declarativos (`aria-haspopup`, `aria-controls`, `aria-expanded`).
 * @param {UsePopoverOptions} [options] Id y callbacks.
 * @returns {UsePopoverResult} Estado, acciones y props.
 */
export function usePopover(options: UsePopoverOptions = {}): UsePopoverResult {
  const { onOpen, onClose } = options;
  const autoId = useId();
  const id = options.id || `mtx-popover-${autoId.replace(/:/g, '')}`;
  const [state, setState] = useState<PopoverHookState>({ open: false, anchor: null, key: null });

  const show = useCallback(
    (value: PositionAnchor | { x: number; y: number }, key: string | null) => {
      const anchor = toAnchor(value);
      setState({ open: true, anchor, key });
      onOpen?.(anchor);
    },
    [onOpen],
  );

  const closeWith = useCallback(
    (reason: PopoverCloseReason | 'api') => {
      setState((prev) => (prev.open ? { ...prev, open: false } : prev));
      onClose?.(reason);
    },
    [onClose],
  );

  const openPopover = useCallback((value: PositionAnchor | { x: number; y: number }) => show(value, null), [show]);
  const close = useCallback(() => closeWith('api'), [closeWith]);
  const toggle = useCallback(
    (value: PositionAnchor | { x: number; y: number }) => {
      if (state.open) closeWith('api');
      else show(value, null);
    },
    [state.open, closeWith, show],
  );

  const getTriggerProps = useCallback(
    ({ key = 'default', onClick }: PopoverTriggerOptions = {}): PopoverTriggerProps => ({
      'aria-haspopup': 'dialog',
      'aria-controls': id,
      'aria-expanded': state.open && state.key === key,
      onClick: (event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const trigger = event.currentTarget;
        if (state.open && state.anchor === trigger) closeWith('trigger');
        else show(trigger, key);
      },
    }),
    [id, state, closeWith, show],
  );

  const popoverProps = useMemo<PopoverStateProps>(
    () => ({
      id,
      open: state.open,
      anchorEl: state.anchor,
      onClose: (_event, reason) => closeWith(reason),
    }),
    [id, state, closeWith],
  );

  return { open: state.open, anchor: state.anchor, openPopover, close, toggle, getTriggerProps, popoverProps };
}
