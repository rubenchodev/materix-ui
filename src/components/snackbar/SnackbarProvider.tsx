'use client';
/**
 * API imperativa del Snackbar (equivalente a `showSnackbar()` / `Materix.snackbar.show()` de vanilla):
 * `SnackbarProvider` pinta un snackbar compartido y `useSnackbar().enqueue()` muestra avisos de uno en uno.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode, SyntheticEvent } from 'react';
import { Snackbar } from './Snackbar';
import type { SnackbarCloseReason, SnackbarOrigin } from './Snackbar';

/** Opciones de un aviso encolado. */
export interface SnackbarOptions {
  /** Texto o nodo del mensaje. */
  message?: ReactNode;
  /** Texto del botón de acción; `null`/`false` sin acción. */
  action?: string | null | false;
  /** Se ejecuta al pulsar la acción y después cierra el aviso (`reason: 'action'`); sin ella la acción no cierra. */
  onAction?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  /** Auto-cierre en ms para este aviso; `null` no se cierra solo (por defecto el del proveedor, 4000). */
  duration?: number | null;
  /** Posición de este aviso (por defecto la del proveedor). */
  anchorOrigin?: SnackbarOrigin;
  /** Rol vivo del mensaje (por defecto `status`, como `showSnackbar`). */
  role?: 'alert' | 'status';
  /** Al cerrarse el aviso, con su motivo (`api` si se cerró con `close()`, `replaced` si lo sustituye otro aviso). */
  onClose?: (reason: SnackbarCloseReason | 'replaced') => void;
  /** Identificador propio (por defecto uno incremental). */
  key?: string | number;
}

/** API devuelta por {@link useSnackbar}. */
export interface SnackbarApi {
  /** Encola un aviso (texto u opciones) y devuelve su clave; el actual se cierra para dejarle paso. */
  enqueue: (options: SnackbarOptions | string) => string | number;
  /** Cierra el aviso indicado (o el visible) y lo retira de la cola. */
  close: (key?: string | number) => void;
}

/** Propiedades de {@link SnackbarProvider}. */
export interface SnackbarProviderProps {
  /** Posición por defecto de los avisos (abajo al centro). */
  anchorOrigin?: SnackbarOrigin;
  /** Auto-cierre por defecto en ms (4000, como el snackbar compartido de vanilla). */
  autoHideDuration?: number | null;
  /** Rol por defecto del mensaje (`status`). */
  role?: 'alert' | 'status';
  /** Clases adicionales del snackbar compartido. */
  className?: string;
  children?: ReactNode;
}

interface QueueItem extends SnackbarOptions {
  key: string | number;
}

const SnackbarContext = createContext<SnackbarApi | null>(null);

/** Estilos de `.mtx-visually-hidden` en línea, por si la app no carga `utilities.css`. */
const VISUALLY_HIDDEN: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Indica si el mensaje es texto plano (anunciable desde la región viva estable).
 * @param {ReactNode} value Mensaje.
 * @returns {boolean} `true` si es cadena o número no vacío.
 */
function isText(value: ReactNode): value is string | number {
  return (typeof value === 'string' && value !== '') || typeof value === 'number';
}

/**
 * Proveedor del snackbar compartido: muestra los avisos encolados de uno en uno.
 */
export function SnackbarProvider({
  anchorOrigin,
  autoHideDuration = 4000,
  role = 'status',
  className,
  children,
}: SnackbarProviderProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [current, setCurrent] = useState<QueueItem | null>(null);
  const [open, setOpen] = useState(false);
  const sequence = useRef(0);
  const closedReason = useRef<SnackbarCloseReason | 'replaced' | null>(null);

  // Patrón "Consecutive Snackbars" de MUI: un aviso nuevo cierra el visible y entra al terminar su salida.
  useEffect(() => {
    if (queue.length && !current) {
      setCurrent(queue[0]);
      setQueue((list) => list.slice(1));
      closedReason.current = null;
      setOpen(true);
    } else if (queue.length && current && open) {
      closedReason.current = 'replaced';
      setOpen(false);
    }
  }, [queue, current, open]);

  const enqueue = useCallback((options: SnackbarOptions | string) => {
    const opts: SnackbarOptions = typeof options === 'string' ? { message: options } : options;
    sequence.current += 1;
    const key = opts.key ?? sequence.current;
    setQueue((list) => [...list, { ...opts, key }]);
    return key;
  }, []);

  // Ref al aviso visible: `close` y la API mantienen identidad estable entre avisos.
  const currentRef = useRef<QueueItem | null>(null);
  currentRef.current = current;

  const close = useCallback((key?: string | number) => {
    if (key !== undefined) setQueue((list) => list.filter((item) => item.key !== key));
    const visible = currentRef.current;
    if (key === undefined || (visible && visible.key === key)) {
      if (visible) closedReason.current = 'api';
      setOpen(false);
    }
  }, []);

  const api = useMemo<SnackbarApi>(() => ({ enqueue, close }), [enqueue, close]);

  // Regiones vivas estables (siempre montadas): solo cambia su texto en cada aviso.
  const visibleRole = current?.role ?? role;
  const announceable = isText(current?.message);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (!open || !current || !isText(current.message)) {
      setAnnouncement('');
      return undefined;
    }
    // Se vacía y se rellena en el frame siguiente para que se anuncie aunque el texto se repita.
    setAnnouncement('');
    const text = String(current.message);
    if (typeof requestAnimationFrame !== 'function') {
      setAnnouncement(text);
      return undefined;
    }
    const frame = requestAnimationFrame(() => setAnnouncement(text));
    return () => cancelAnimationFrame(frame);
  }, [open, current]);

  const handleClose = (_event: Event | SyntheticEvent | null, reason: SnackbarCloseReason) => {
    closedReason.current = reason;
    setOpen(false);
  };

  const handleExited = () => {
    const item = current;
    setCurrent(null);
    item?.onClose?.(closedReason.current ?? 'api');
  };

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        open={open && Boolean(current)}
        className={className}
        message={current?.message}
        action={current?.action || undefined}
        onAction={(event) => {
          // Como `showSnackbar`: sin `onAction` la acción no cierra el aviso.
          if (!current?.onAction) return;
          current.onAction(event);
          handleClose(event, 'action');
        }}
        closeOnAction={false}
        autoHideDuration={current && current.duration !== undefined ? current.duration : autoHideDuration}
        anchorOrigin={current?.anchorOrigin ?? anchorOrigin}
        role={announceable ? null : visibleRole}
        onClose={handleClose}
        onExited={handleExited}
      />
      <div className="mtx-visually-hidden" style={VISUALLY_HIDDEN} role="status" aria-live="polite" aria-atomic="true">
        {visibleRole === 'status' ? announcement : ''}
      </div>
      <div className="mtx-visually-hidden" style={VISUALLY_HIDDEN} role="alert" aria-live="assertive" aria-atomic="true">
        {visibleRole === 'alert' ? announcement : ''}
      </div>
    </SnackbarContext.Provider>
  );
}

/**
 * Accede a la API imperativa del snackbar compartido.
 * @returns {SnackbarApi} `enqueue` y `close`.
 * @throws {Error} Si no hay un `SnackbarProvider` por encima.
 */
export function useSnackbar(): SnackbarApi {
  const api = useContext(SnackbarContext);
  if (!api) throw new Error('Materix: useSnackbar() must be used inside a <SnackbarProvider>.');
  return api;
}
