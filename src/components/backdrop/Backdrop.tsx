'use client';
/**
 * Backdrop de Materix UI: capa fija que oscurece la pantalla y centra un contenido (patrón `Backdrop` de MUI).
 * No es un diálogo: no atrapa el foco ni tiene rol. Dialog y Drawer lo reutilizan como fondo.
 */
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/backdrop.css';
import {
  Fade,
  Portal,
  cx,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  useScrollLock,
} from '../../core';
import type { PortalProps, TransitionTimeout } from '../../core';

/** Motivo del cierre solicitado. */
export type BackdropCloseReason = 'click' | 'escape';

/** Duraciones MUI: entrada 225 ms (enteringScreen) y salida 195 ms (leavingScreen). */
export const BACKDROP_TRANSITION_DURATION = { enter: 225, exit: 195 } as const;

/** Elementos interactivos del contenido que no cierran con `closeOnClick` (igual que vanilla). */
const INTERACTIVE = 'a[href], button, input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/** Propiedades de {@link Backdrop}. */
export interface BackdropProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'inert'> {
  /** Muestra la capa (controlado; equivale a `open()`/`close()` y `data-open`). */
  open: boolean;
  /** Capa transparente: bloquea clics sin oscurecer (`data-invisible`); la usan Popover/Menu. */
  invisible?: boolean;
  /** Clic en la capa (siempre se llama; Dialog/Drawer lo usan para cerrar por clic en el fondo). */
  onClick?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  /** Solicita el cierre por clic (`click`) o Escape (`escape`); el padre actualiza `open`. */
  onClose?: (event: ReactMouseEvent<HTMLDivElement> | KeyboardEvent, reason: BackdropCloseReason) => void;
  /** Al pasar de cerrado a abierto (equivale a `mtx:backdrop:open`). */
  onOpen?: () => void;
  /** Tras terminar el fundido de salida (la capa ya no se ve). */
  onExited?: () => void;
  /** Cierra con un clic en la capa o en texto no interactivo (`data-close-on-click`). */
  closeOnClick?: boolean;
  /** Cierra con Escape a través de la pila de capas (`data-close-on-escape`). */
  closeOnEscape?: boolean;
  /** Bloquea el scroll del `body` mientras está abierto (`data-lock-scroll`). */
  lockScroll?: boolean;
  /** Marca como `inert` el resto del documento mientras está abierto (`data-inert`). */
  inertOthers?: boolean;
  /** Duración del fundido en ms, común o por fase (por defecto 225/195 ms). */
  transitionDuration?: TransitionTimeout;
  /** Renderiza la capa en su sitio, sin portal a `document.body` (Dialog/Drawer la ponen dentro de su portal). */
  disablePortal?: boolean;
  /** Contenedor del portal (por defecto `document.body`). */
  container?: PortalProps['container'];
  /** Mantiene el nodo montado (con `hidden`) mientras está cerrado. */
  keepMounted?: boolean;
  /** Clases adicionales de la capa. */
  className?: string;
  /** Contenido centrado (p. ej. un `CircularProgress color="inherit"`). */
  children?: ReactNode;
}

/**
 * Marca como `inert` los hermanos de la capa y de sus ancestros hasta `body` (patrón aria-hidden de MUI).
 * @param {HTMLElement} element Capa.
 * @returns {Function} Restaura los nodos marcados.
 */
function inertSiblings(element: HTMLElement): () => void {
  const marked: Element[] = [];
  let node: HTMLElement | null = element;
  while (node && node.parentElement && node !== node.ownerDocument.body) {
    Array.from(node.parentElement.children).forEach((sibling) => {
      if (sibling === node || sibling.hasAttribute('inert')) return;
      if (/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(sibling.tagName)) return;
      sibling.setAttribute('inert', '');
      marked.push(sibling);
    });
    node = node.parentElement;
  }
  return () => marked.forEach((sibling) => sibling.removeAttribute('inert'));
}

/**
 * Capa a pantalla completa con fundido; centra su contenido.
 */
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(props, ref) {
  const {
    open,
    invisible = false,
    onClick,
    onClose,
    onOpen,
    onExited,
    closeOnClick = false,
    closeOnEscape = false,
    lockScroll = false,
    inertOthers = false,
    transitionDuration = BACKDROP_TRANSITION_DURATION,
    disablePortal = false,
    container,
    keepMounted = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, setNode);
  const [exited, setExited] = useState(!open);
  const requestClose = useEventCallback(
    (event: ReactMouseEvent<HTMLDivElement> | KeyboardEvent, reason: BackdropCloseReason) => onClose?.(event, reason),
  );

  // Pila común de capas: solo si cierra con Escape o bloquea la página (como vanilla).
  useLayer({
    open: open && (closeOnEscape || lockScroll || inertOthers),
    kind: 'modal',
    nodes: () => node,
    onEscape: (event) => {
      if (closeOnEscape) requestClose(event, 'escape');
    },
  });
  useScrollLock(open && lockScroll);

  useEnhancedEffect(() => {
    if (!open || !inertOthers || !node) return undefined;
    return inertSiblings(node);
  }, [open, inertOthers, node]);

  // `onOpen` solo al pasar de cerrado a abierto (la apertura inicial es silenciosa, como `data-open`).
  const prevOpen = useRef(open);
  const handleOpen = useEventCallback(() => onOpen?.());
  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    if (open) handleOpen();
  }, [open, handleOpen]);

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!open || event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest('[data-mtx-backdrop-close]')) {
      requestClose(event, 'click');
      return;
    }
    if (!closeOnClick) return;
    const interactive = target && target !== event.currentTarget ? target.closest(INTERACTIVE) : null;
    if (interactive && event.currentTarget.contains(interactive)) return;
    requestClose(event, 'click');
  };

  const mergedStyle: CSSProperties = { ...style, visibility: 'visible' };

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <Fade
        in={open}
        timeout={transitionDuration}
        mountOnEnter={!keepMounted}
        unmountOnExit={!keepMounted}
        onEnter={() => setExited(false)}
        onExited={() => {
          setExited(true);
          onExited?.();
        }}
      >
        <div
          {...rest}
          ref={handleRef}
          className={cx('mtx-backdrop', invisible && 'mtx-backdrop--invisible', open && 'mtx-backdrop--open', className)}
          style={mergedStyle}
          data-open={open ? '' : undefined}
          aria-hidden={open ? rest['aria-hidden'] : true}
          hidden={!open && exited}
          onClick={handleClick}
        >
          {children}
        </div>
      </Fade>
    </Portal>
  );
});
