'use client';
/**
 * Popover de Materix UI (MUI Popover): superficie flotante anclada a un elemento, a un punto
 * o centrada, con cierre por clic fuera, Escape o Tab, retorno del foco y modo modal opcional.
 * Es la base flotante reutilizable por otros componentes (DateTimePicker, filtros, tarjetas).
 */
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/popover.css';
import {
  Portal,
  autoUpdate,
  computePosition,
  cx,
  getFocusable,
  onClickAway,
  parsePlacement,
  resolveFocusTarget,
  resolveTarget,
  trapTab,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  useScrollLock,
} from '../../core';
import type { ElementTarget, Placement, PortalProps, PositionAnchor, VirtualElement } from '../../core';

/** Margen mínimo con el viewport (MUI `marginThreshold`). */
export const POPOVER_MARGIN_THRESHOLD = 16;
/** Duración de la salida (ms) antes de ocultar/desmontar, como vanilla. */
export const POPOVER_EXIT_DURATION = 150;
/** Elevaciones canónicas admitidas (la más cercana se aplica). */
const ELEVATIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 24];
const FALLBACK_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Eje vertical de un origen: palabra clave o píxeles. */
export type PopoverVertical = 'top' | 'center' | 'bottom' | number;
/** Eje horizontal de un origen: palabra clave o píxeles. */
export type PopoverHorizontal = 'left' | 'center' | 'right' | number;

/** Origen MUI (`anchorOrigin`/`transformOrigin`). */
export interface PopoverOrigin {
  vertical: PopoverVertical;
  horizontal: PopoverHorizontal;
}

/** Punto del viewport (MUI `anchorPosition`). */
export interface PopoverPosition {
  top: number;
  left: number;
}

/** Ancla aceptada: elemento, ancla virtual, ref o función que la devuelve. */
export type PopoverAnchor = ElementTarget<PositionAnchor>;

/**
 * Motivo del cierre: Escape, clic fuera, Tab fuera (no modal),
 * botón interno `[data-mtx-popover-close]` (`action`) o disparador de `usePopover` (`trigger`).
 */
export type PopoverCloseReason = 'escapeKeyDown' | 'clickaway' | 'tabOut' | 'action' | 'trigger';

/** Acciones imperativas expuestas por la prop `action`. */
export interface PopoverActions {
  /** Recalcula la posición (equivale a `update()` de vanilla). */
  updatePosition: () => void;
}

/** Propiedades de {@link Popover}. */
export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose'> {
  /** Abierto (controlado; equivale a `open()`/`close()`). */
  open: boolean;
  /** Ancla: elemento, ref, función o ancla virtual (`getBoundingClientRect`). */
  anchorEl?: PopoverAnchor;
  /** Qué ancla usar: `anchorEl` (por defecto), `anchorPosition` o `none` (centrado). */
  anchorReference?: 'anchorEl' | 'anchorPosition' | 'none';
  /** Punto del viewport con `anchorReference="anchorPosition"` (equivale a `open({ x, y })`). */
  anchorPosition?: PopoverPosition;
  /** Punto del ancla (`data-anchor-origin`); con él o `transformOrigin` se usa el algoritmo de MUI. */
  anchorOrigin?: PopoverOrigin;
  /** Punto del popover unido al ancla (`data-transform-origin`). */
  transformOrigin?: PopoverOrigin;
  /** Colocación con flip y shift si no hay orígenes (`data-placement`, `bottom-start`). */
  placement?: Placement;
  /** Separación en px con `placement` (`data-offset`, 0). */
  offset?: number;
  /** Distancia mínima con los bordes del viewport (16). */
  marginThreshold?: number;
  /** Elevación 0–24 (8 por defecto; `data-elevation`). */
  elevation?: number;
  /** Modal: atrapa Tab, bloquea el scroll y añade `aria-modal` (`data-modal`). */
  modal?: boolean;
  /** Nombre accesible (`data-label`); sin él se usa el primer encabezado interno. */
  label?: string;
  /** Solicita el cierre; el padre actualiza `open` (equivale a `mtx:popover:close`). */
  onClose?: (event: Event | SyntheticEvent, reason: PopoverCloseReason) => void;
  /** Tras abrirse y posicionarse (equivale a `mtx:popover:open`). */
  onOpen?: (anchor: PositionAnchor | null) => void;
  /** Al terminar la salida (nodo oculto o desmontado). */
  onExited?: () => void;
  /** No mueve el foco al abrir. */
  disableAutoFocus?: boolean;
  /** No devuelve el foco al disparador al cerrar. */
  disableRestoreFocus?: boolean;
  /** Ignora Escape. */
  disableEscapeKeyDown?: boolean;
  /** Renderiza en su sitio, sin portal a `document.body`. */
  disablePortal?: boolean;
  /** Contenedor del portal. */
  container?: PortalProps['container'];
  /** Mantiene el nodo montado (con `hidden`) mientras está cerrado. */
  keepMounted?: boolean;
  /** Duración de la salida en ms antes de ocultarlo (150). */
  transitionDuration?: number;
  /** Ref con acciones imperativas (`updatePosition`). */
  action?: Ref<PopoverActions>;
  /** Contenido arbitrario. */
  children?: ReactNode;
}

/**
 * Convierte un eje de origen a desplazamiento en px.
 * @param {string|number} token Palabra clave o px.
 * @param {number} size Tamaño de la caja en ese eje.
 * @param {Record<string, number>} map Fracciones por palabra clave.
 * @returns {number} Desplazamiento.
 */
function axis(token: string | number, size: number, map: Record<string, number>): number {
  if (typeof token === 'number') return Number.isFinite(token) ? token : 0;
  if (token in map) return map[token] * size;
  const num = parseFloat(token);
  return Number.isFinite(num) ? num : 0;
}

/**
 * Convierte un origen MUI en desplazamiento desde la esquina superior izquierda.
 * @param {PopoverOrigin|undefined} origin Origen.
 * @param {number} width Ancho.
 * @param {number} height Alto.
 * @param {PopoverOrigin} fallback Valor por defecto.
 * @returns {{x:number, y:number}} Desplazamiento.
 */
export function resolveOrigin(
  origin: PopoverOrigin | undefined,
  width: number,
  height: number,
  fallback: PopoverOrigin,
): { x: number; y: number } {
  const value = origin || fallback;
  return {
    y: axis(value.vertical ?? fallback.vertical, height, { top: 0, center: 0.5, bottom: 1 }),
    x: axis(value.horizontal ?? fallback.horizontal, width, { left: 0, center: 0.5, right: 1 }),
  };
}

/** Elevación canónica más cercana. */
function nearestElevation(value: number): number {
  return ELEVATIONS.reduce((best, level) => (Math.abs(level - value) < Math.abs(best - value) ? level : best), 8);
}

/** Indica si un valor es un elemento DOM. */
function isElement(value: unknown): value is HTMLElement {
  return Boolean(value && typeof value === 'object' && (value as Node).nodeType === 1);
}

/** Opciones de posicionamiento vigentes. */
interface PlacementOptions {
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  placement: string;
  offset: number;
  margin: number;
}

/**
 * Posiciona el popover (algoritmo de vanilla): centrado sin ancla, orígenes MUI o `computePosition`.
 * @param {HTMLElement} el Popover.
 * @param {PositionAnchor|null} anchor Ancla.
 * @param {PlacementOptions} opts Opciones.
 */
function applyPosition(el: HTMLElement, anchor: PositionAnchor | null, opts: PlacementOptions): void {
  const root = document.documentElement;
  const viewportWidth = root.clientWidth || window.innerWidth;
  const viewportHeight = root.clientHeight || window.innerHeight;
  const width = el.offsetWidth || el.getBoundingClientRect().width;
  const height = el.offsetHeight || el.getBoundingClientRect().height;
  const margin = opts.margin;

  if (!anchor) {
    el.style.left = `${Math.max(margin, (viewportWidth - width) / 2)}px`;
    el.style.top = `${Math.max(margin, (viewportHeight - height) / 2)}px`;
    el.style.transformOrigin = 'center center';
    el.removeAttribute('data-placement');
    return;
  }

  if (opts.anchorOrigin || opts.transformOrigin) {
    // Algoritmo de MUI: punto del ancla − punto de transformación, limitado al viewport.
    const rect = anchor.getBoundingClientRect();
    const a = resolveOrigin(opts.anchorOrigin, rect.width, rect.height, { vertical: 'bottom', horizontal: 'left' });
    const t = resolveOrigin(opts.transformOrigin, width, height, { vertical: 'top', horizontal: 'left' });
    let top = rect.top + a.y - t.y;
    let left = rect.left + a.x - t.x;
    let originX = t.x;
    let originY = t.y;
    const bottom = top + height;
    const right = left + width;
    if (top < margin) {
      originY -= margin - top;
      top = margin;
    } else if (bottom > viewportHeight - margin) {
      const diff = bottom - (viewportHeight - margin);
      top -= diff;
      originY += diff;
    }
    if (left < margin) {
      originX -= margin - left;
      left = margin;
    } else if (right > viewportWidth - margin) {
      const diff = right - (viewportWidth - margin);
      left -= diff;
      originX += diff;
    }
    el.style.top = `${Math.round(top)}px`;
    el.style.left = `${Math.round(left)}px`;
    el.style.transformOrigin = `${Math.round(originX)}px ${Math.round(originY)}px`;
    el.setAttribute('data-placement', 'origin');
    return;
  }

  const result = computePosition(anchor, el, { placement: opts.placement, offset: opts.offset, padding: margin });
  el.style.left = `${result.x}px`;
  el.style.top = `${result.y}px`;
  const { side, align } = parsePlacement(`${result.side}-${result.align}`);
  const vertical = side === 'top' || side === 'bottom';
  const cross =
    align === 'start' ? (vertical ? 'left' : 'top') : align === 'end' ? (vertical ? 'right' : 'bottom') : 'center';
  const main = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side];
  el.style.transformOrigin = vertical ? `${cross} ${main}` : `${main} ${cross}`;
  el.setAttribute('data-placement', result.placement);
}

/**
 * Superficie flotante anclada con gestión de foco, cierre y modo modal.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const {
    open,
    anchorEl,
    anchorReference = 'anchorEl',
    anchorPosition,
    anchorOrigin,
    transformOrigin,
    placement = 'bottom-start',
    offset = 0,
    marginThreshold = POPOVER_MARGIN_THRESHOLD,
    elevation,
    modal = false,
    label,
    onClose,
    onOpen,
    onExited,
    disableAutoFocus = false,
    disableRestoreFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    container,
    keepMounted = false,
    transitionDuration = POPOVER_EXIT_DURATION,
    action,
    id: idProp,
    className,
    style,
    onClick,
    children,
    ...rest
  } = props;

  const autoId = useId();
  const id = idProp || `mtx-popover-${autoId.replace(/:/g, '')}`;
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, setNode);
  const [exited, setExited] = useState(!open);
  const [visible, setVisible] = useState(false);
  const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastReason = useRef<PopoverCloseReason | null>(null);

  // Ancla virtual memorizada por coordenadas (evita re-suscribir autoUpdate en cada commit).
  const pointTop = anchorPosition?.top;
  const pointLeft = anchorPosition?.left;
  const pointAnchor = useMemo<VirtualElement | null>(() => {
    if (pointTop === undefined || pointLeft === undefined) return null;
    const top = pointTop;
    const left = pointLeft;
    return {
      getBoundingClientRect: () => ({ top, bottom: top, left, right: left, width: 0, height: 0, x: left, y: top }),
    };
  }, [pointTop, pointLeft]);

  /** Ancla efectiva según `anchorReference`. */
  const getAnchor = useEventCallback((): PositionAnchor | null => {
    if (anchorReference === 'none') return null;
    if (anchorReference === 'anchorPosition') return pointAnchor;
    return resolveTarget(anchorEl) || null;
  });

  const placementOptions = useRef<PlacementOptions>({ placement, offset, margin: marginThreshold });
  placementOptions.current = { anchorOrigin, transformOrigin, placement, offset, margin: marginThreshold };

  const update = useCallback(() => {
    if (!node || !open) return;
    applyPosition(node, getAnchor(), placementOptions.current);
  }, [node, open, getAnchor]);

  useImperativeHandle(action, () => ({ updatePosition: update }), [update]);

  const requestClose = useEventCallback((event: Event | SyntheticEvent, reason: PopoverCloseReason) => {
    lastReason.current = reason;
    onClose?.(event, reason);
  });

  const layer = useLayer({
    open,
    kind: modal ? 'modal' : 'popup',
    nodes: () => node,
    // Por encima de las capas abiertas debajo (p. ej. un Dialog), también con keepMounted.
    stack: () => (node ? [{ node }] : []),
    onEscape: (event) => {
      if (!disableEscapeKeyDown) requestClose(event, 'escapeKeyDown');
    },
  });
  useScrollLock(open && modal);

  /** Nodo en una capa abierta encima (popover hijo, menú, diálogo, tooltip). */
  const inUpperLayer = useEventCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    if (target.closest('.mtx-tooltip')) return true;
    return layer.isInUpperLayer(target);
  });

  /** Devuelve el foco al disparador si quedó perdido. */
  const restoreLostFocus = useEventCallback(() => {
    if (disableRestoreFocus) return;
    const anchor = resolveTarget(anchorEl);
    const fallback = isElement(anchor) ? anchor : null;
    const target = returnFocus.current && returnFocus.current.isConnected ? returnFocus.current : fallback;
    if (!target || typeof target.focus !== 'function') return;
    const active = document.activeElement as HTMLElement | null;
    const lost =
      !active ||
      active === document.body ||
      Boolean(node && node.contains(active)) ||
      (active.tabIndex < 0 && active.contains(target));
    if (lost) target.focus();
  });

  // Posicionamiento: re-suscribe autoUpdate si cambia el nodo, el ancla o las opciones.
  const subscription = useRef<{ anchor: PositionAnchor | null; key: string; node: HTMLElement; stop: () => void } | null>(
    null,
  );
  const positionKey = [
    anchorReference,
    anchorPosition?.top,
    anchorPosition?.left,
    anchorOrigin?.vertical,
    anchorOrigin?.horizontal,
    transformOrigin?.vertical,
    transformOrigin?.horizontal,
    placement,
    offset,
    marginThreshold,
  ].join('|');
  useEnhancedEffect(() => {
    const anchor = open && node ? getAnchor() : null;
    const current = subscription.current;
    if (current && open && node && current.node === node && current.anchor === anchor && current.key === positionKey) {
      return;
    }
    current?.stop();
    subscription.current = null;
    if (!open || !node) return;
    const stop = autoUpdate(isElement(anchor) ? anchor : null, node, () => {
      applyPosition(node, getAnchor(), placementOptions.current);
    });
    subscription.current = { anchor, key: positionKey, node, stop };
  });
  useEffect(
    () => () => {
      subscription.current?.stop();
      subscription.current = null;
    },
    [],
  );

  // Apertura: foco de retorno, clase de entrada tras un reflow, foco inicial y `onOpen`.
  const handleOpen = useEventCallback((el: HTMLDivElement) => {
    const active = document.activeElement as HTMLElement | null;
    const anchor = getAnchor();
    // En WebKit un clic no enfoca el botón: solo se conserva el foco activo si es tabulable.
    returnFocus.current =
      active && active !== document.body && active.tabIndex >= 0 && !el.contains(active)
        ? active
        : isElement(anchor)
          ? anchor
          : active;
    lastReason.current = null;
    void el.offsetWidth;
    setVisible(true);
    if (!disableAutoFocus) {
      const explicit = resolveFocusTarget(el.querySelector<HTMLElement>('[data-autofocus]'));
      const target = explicit || getFocusable(el)[0] || el.querySelector<HTMLElement>(FALLBACK_FOCUSABLE) || el;
      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }
    }
    onOpen?.(anchor);
  });

  const wasOpen = useRef(false);
  useEnhancedEffect(() => {
    if (open && node && !wasOpen.current) {
      wasOpen.current = true;
      setExited(false);
      handleOpen(node);
      return undefined;
    }
    if (!open && wasOpen.current) {
      wasOpen.current = false;
      setVisible(false);
      const reason = lastReason.current;
      lastReason.current = null;
      // Tras un clic fuera se respeta el control pulsado; si el foco se pierde, vuelve al disparador.
      if (reason !== 'clickaway' && reason !== 'tabOut') restoreLostFocus();
      const focusTimer = reason === 'clickaway' ? setTimeout(restoreLostFocus, 0) : null;
      const exitTimer = setTimeout(() => {
        setExited(true);
        onExited?.();
      }, Math.max(0, transitionDuration));
      return () => {
        if (focusTimer) clearTimeout(focusTimer);
        clearTimeout(exitTimer);
      };
    }
    return undefined;
  }, [open, node]);

  // Nombre accesible automático: primer encabezado interno (`data-popover-title` o h1–h6).
  useEnhancedEffect(() => {
    if (!node || label || rest['aria-label'] || rest['aria-labelledby']) {
      setLabelledBy(undefined);
      return;
    }
    const heading = node.querySelector<HTMLElement>('[data-popover-title], h1, h2, h3, h4, h5, h6');
    if (!heading) {
      setLabelledBy(undefined);
      return;
    }
    if (!heading.id) heading.id = `${id}-title`;
    setLabelledBy(heading.id);
  });

  // Clic fuera (modal y no modal, como vanilla).
  useEffect(() => {
    if (!open || !node || typeof document === 'undefined') return undefined;
    return onClickAway(
      () => [node],
      (event) => {
        const target = event.target as Node | null;
        if (inUpperLayer(target)) return;
        const anchor = resolveTarget(anchorEl);
        if (isElement(anchor) && target && anchor.contains(target)) return;
        if (target instanceof Element) {
          const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id;
          const trigger = target.closest(`[aria-controls="${escaped}"]`);
          if (trigger && !node.contains(trigger)) return;
        }
        requestClose(event, 'clickaway');
      },
    );
  }, [open, node, id, anchorEl, inUpperLayer, requestClose]);

  // Tab: modal lo atrapa; no modal cierra al salir sin robar el foco.
  useEffect(() => {
    if (!open || !node) return undefined;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onDocKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !layer.isTopLayer()) return;
      if (modal) {
        trapTab(event, node);
        return;
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        const active = document.activeElement;
        if (active && active !== document.body && !node.contains(active) && !inUpperLayer(active)) {
          requestClose(event, 'tabOut');
        }
      }, 0);
    };
    document.addEventListener('keydown', onDocKeyDown);
    return () => {
      document.removeEventListener('keydown', onDocKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [open, node, modal, layer, inUpperLayer, requestClose]);

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const closer = event.target instanceof Element ? event.target.closest('[data-mtx-popover-close]') : null;
    if (closer && event.currentTarget.contains(closer)) requestClose(event, 'action');
  };

  const mounted = open || keepMounted || !exited;
  if (!mounted) return null;

  const elevationStyle: Record<string, string> = {};
  if (typeof elevation === 'number' && Number.isFinite(elevation)) {
    const level = nearestElevation(elevation);
    elevationStyle['--mtx-popover-shadow'] = level === 0 ? 'none' : `var(--mtx-elevation-${level})`;
    elevationStyle['--mtx-popover-overlay'] = `var(--mtx-overlay-elevation-${level})`;
  }
  const mergedStyle = { ...elevationStyle, ...style } as CSSProperties;

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <div
        role="dialog"
        tabIndex={-1}
        aria-label={label}
        aria-labelledby={labelledBy}
        {...rest}
        ref={handleRef}
        id={id}
        aria-modal={modal ? true : undefined}
        className={cx('mtx-popover', open && visible && 'mtx-popover--open', className)}
        style={mergedStyle}
        hidden={!open && exited}
        onClick={handleClick}
      >
        {children}
      </div>
    </Portal>
  );
});
