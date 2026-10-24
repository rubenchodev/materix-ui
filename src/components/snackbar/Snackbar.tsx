'use client';
/**
 * Snackbar de Materix UI: aviso breve y flotante con acción opcional (patrón `Snackbar` de MUI).
 */
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode, SyntheticEvent } from 'react';
import '@rubenchodev/materix-ui/components/snackbar.css';
import {
  cx,
  useClickAway,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  useTransition,
} from '../../core';

/** Motivo de cierre (igual que `detail.reason` de `mtx:snackbar:close`); `api` solo lo usa `useSnackbar().close()`. */
export type SnackbarCloseReason = 'timeout' | 'clickaway' | 'escapeKeyDown' | 'action' | 'api';

/** Origen de anclaje en pantalla. */
export interface SnackbarOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

/** Duración de la transición CSS de vanilla (`--mtx-duration-standard`, 300 ms). */
export const SNACKBAR_TRANSITION_DURATION = 300;

const VERTICAL = ['top', 'bottom'];
const HORIZONTAL = ['left', 'center', 'right'];

/**
 * Clase de anclaje validada (valores no válidos usan `bottom-center`, como vanilla).
 * @param {SnackbarOrigin} [origin] Origen.
 * @returns {string} Sufijo `vertical-horizontal`.
 */
export function snackbarAnchor(origin?: Partial<SnackbarOrigin>): string {
  const vertical = origin?.vertical && VERTICAL.includes(origin.vertical) ? origin.vertical : 'bottom';
  const horizontal = origin?.horizontal && HORIZONTAL.includes(origin.horizontal) ? origin.horizontal : 'center';
  return `${vertical}-${horizontal}`;
}

/** Propiedades de {@link Snackbar}. */
export interface SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'onClose'> {
  /** Muestra el snackbar (controlado; equivale a `open()`/`close()`). */
  open: boolean;
  /** Solicita el cierre con su motivo; el padre actualiza `open`. */
  onClose?: (event: Event | SyntheticEvent | null, reason: SnackbarCloseReason) => void;
  /** Milisegundos de auto-cierre (`data-duration`); `null`/sin valor no se cierra solo. */
  autoHideDuration?: number | null;
  /** Posición (`data-anchor`): `bottom`/`top` y `left`/`center`/`right`; por defecto abajo al centro. */
  anchorOrigin?: SnackbarOrigin;
  /** Mensaje (`data-message`); genera `.mtx-snackbar__message`. */
  message?: ReactNode;
  /** Acción: un texto genera `.mtx-snackbar__action` (`data-action`); un nodo se pinta tal cual. */
  action?: ReactNode;
  /** Clic en la acción generada (equivale a `mtx:snackbar:action`). */
  onAction?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  /** Cierra (`reason: 'action'`) al pulsar la acción generada (`data-close-on-action`). */
  closeOnAction?: boolean;
  /** Rol vivo del mensaje (`data-role`): `alert` (por defecto) o `status` para avisos no urgentes. */
  role?: 'alert' | 'status';
  /** No solicita el cierre al hacer clic fuera. */
  disableClickAway?: boolean;
  /** Al pasar de cerrado a abierto (equivale a `mtx:snackbar:open`). */
  onOpen?: () => void;
  /** Tras terminar la transición de salida (el nodo se desmonta). */
  onExited?: () => void;
  /** Contenido extra entre el mensaje y la acción (p. ej. un `Alert`). */
  children?: ReactNode;
}

/**
 * Aviso flotante en un borde de la pantalla; se cierra solo, con Escape, clic fuera o la acción.
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(props, ref) {
  const {
    open,
    onClose,
    autoHideDuration = null,
    anchorOrigin,
    message,
    action,
    onAction,
    closeOnAction = false,
    role = 'alert',
    disableClickAway = false,
    onOpen,
    onExited,
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useForkRef(rootRef, ref);
  const requestClose = useEventCallback((event: Event | SyntheticEvent | null, reason: SnackbarCloseReason) =>
    onClose?.(event, reason),
  );

  const { mounted } = useTransition(open, SNACKBAR_TRANSITION_DURATION, {
    mountOnEnter: true,
    unmountOnExit: true,
    onExited: useEventCallback(() => onExited?.()),
  });

  // Clase `--open` un frame después del montaje para que la transición CSS arranque desde el estado oculto.
  const [shown, setShown] = useState(open);
  useEnhancedEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const node = rootRef.current;
    if (shown || !node) return;
    void node.offsetWidth; // eslint-disable-line no-void
    setShown(true);
  }, [open, mounted, shown]);

  // Temporizador de auto-cierre: se pausa con puntero o foco dentro y se reinicia al salir (como vanilla).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const startTimer = useEventCallback(() => {
    clearTimer();
    if (!open || autoHideDuration == null || !Number.isFinite(autoHideDuration) || autoHideDuration < 0) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      requestClose(null, 'timeout');
    }, autoHideDuration);
  });
  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [open, autoHideDuration, startTimer, clearTimer]);

  // Prioridad mínima en la pila de capas: Escape solo lo cierra sin diálogos, menús ni popovers encima.
  useLayer({ open, kind: 'snackbar', nodes: rootRef, onEscape: (event) => requestClose(event, 'escapeKeyDown') });
  useClickAway(rootRef, (event) => requestClose(event, 'clickaway'), { enabled: open && !disableClickAway });

  const prevOpen = useRef(open);
  const handleOpen = useEventCallback(() => onOpen?.());
  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    if (open) handleOpen();
  }, [open, handleOpen]);

  if (!mounted) return null;

  const handleAction = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onAction?.(event);
    if (closeOnAction) requestClose(event, 'action');
  };

  const isTextAction = typeof action === 'string' || typeof action === 'number';

  return (
    <div
      {...rest}
      ref={handleRef}
      className={cx('mtx-snackbar', `mtx-snackbar--${snackbarAnchor(anchorOrigin)}`, shown && 'mtx-snackbar--open', className)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        clearTimer();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        startTimer();
      }}
      onFocus={(event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        clearTimer();
      }}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);
        startTimer();
      }}
    >
      {message != null && message !== false && message !== '' && (
        <div className="mtx-snackbar__message" role={role}>
          {message}
        </div>
      )}
      {children}
      {isTextAction ? (
        <button type="button" className="mtx-snackbar__action" onClick={handleAction}>
          {action}
        </button>
      ) : (
        action
      )}
    </div>
  );
});
