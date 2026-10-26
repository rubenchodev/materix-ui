'use client';
import { forwardRef, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/menu.css';
import {
  Grow,
  Portal,
  cx,
  isRtl,
  resolveTarget,
  useClickAway,
  useEnhancedEffect,
  useEventCallback,
  useForkRef,
  useLayer,
  usePosition,
} from '../../core';
import type { ElementTarget, Placement, PositionAnchor, VirtualElement } from '../../core';
import { MenuInternalContext, SubmenuFlagContext } from './MenuContext';
import type { MenuCloseEvent, MenuCloseReason, MenuInternalContextValue, MenuSelectDetail } from './MenuContext';
import { MenuList } from './MenuList';
import { focusInitial, installModality, isKeyboardModality } from './utils';

/** Coordenadas de viewport para anclar el menú a un punto (p. ej. el cursor). */
export interface MenuAnchorPosition {
  top: number;
  left: number;
}

/** Props de las piezas internas del menú. */
export interface MenuSlotProps {
  /** Contenedor posicionado (`.mtx-menu__popper`). */
  popper?: HTMLAttributes<HTMLDivElement>;
  /** Superficie (`.mtx-menu__paper`). */
  paper?: HTMLAttributes<HTMLDivElement>;
}

/** Props de {@link Menu}. `ref`, `id`, `className` y el resto de atributos van al elemento `role="menu"`. */
export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Menú abierto (controlado). */
  open: boolean;
  /** Ancla de posición: elemento, ref o ancla virtual. */
  anchorEl?: ElementTarget<PositionAnchor>;
  /** Ancla en un punto del viewport (menú contextual); tiene prioridad sobre `anchorEl`. */
  anchorPosition?: MenuAnchorPosition | null;
  /** Petición de cierre con su motivo (equivale a `mtx:menu:close`). */
  onClose?: (event: MenuCloseEvent, reason: MenuCloseReason) => void;
  /** Se abrió el menú (equivale a `mtx:menu:open`). */
  onOpen?: () => void;
  /** Selección de un ítem, también de submenús (equivale a `mtx:menu:select`). */
  onSelect?: (detail: MenuSelectDetail, event: SyntheticEvent) => void;
  /** Cierra al seleccionar un ítem (`true` por defecto). */
  closeOnSelect?: boolean;
  /** Mueve el foco al menú al abrirse (`true` por defecto). */
  autoFocus?: boolean;
  /** Enfoca el ítem seleccionado o el primero; por defecto solo si se abrió con teclado. */
  autoFocusItem?: boolean;
  /** Ítems compactos (32px). */
  dense?: boolean;
  /** Ancho mínimo igual al del ancla (equivale a `data-match-width`). */
  matchWidth?: boolean;
  /** Colocación preferida (`bottom-start` por defecto); voltea si no cabe. */
  placement?: Placement;
  /** Separación con el ancla en px (4 por defecto). */
  offset?: number;
  /** Origen de la animación (por defecto el que fija el posicionamiento). */
  transformOrigin?: string;
  /** Mantiene el menú en el DOM cerrado. */
  keepMounted?: boolean;
  /** Renderiza en su sitio, sin portal. */
  disablePortal?: boolean;
  /** Contenedor del portal (`document.body` por defecto). */
  container?: ElementTarget<Element>;
  /** Elemento que recibe el foco al cerrar; por defecto el enfocado al abrir o el ancla. */
  restoreFocusTo?: ElementTarget<HTMLElement>;
  /** Props de `.mtx-menu__popper` y `.mtx-menu__paper`. */
  slotProps?: MenuSlotProps;
  /** Ítems del menú. */
  children?: ReactNode;
}

/** Motivos que no devuelven el foco al disparador (como `restoreFocus: false` en vanilla). */
const NO_RESTORE: MenuCloseReason[] = ['backdropClick', 'anchorHidden', 'tabKeyDown'];

/** Etiquetas que conservan el foco al pulsarse dentro del menú. */
const FOCUSABLE_INPUT = 'input, textarea, select, [contenteditable="true"]';

/**
 * Menú desplegable (Menu de MUI: Popper + Paper + MenuList) anclado a un elemento o a un punto.
 * Posicionamiento con volteo, alto limitado y RTL, animación Grow, capa con Escape, clic fuera,
 * cierre si el ancla sale de la vista, navegación por teclado y foco devuelto al cerrar.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const {
    open,
    anchorEl,
    anchorPosition,
    onClose,
    onOpen,
    onSelect,
    closeOnSelect = true,
    autoFocus = true,
    autoFocusItem,
    dense = false,
    matchWidth = false,
    placement = 'bottom-start',
    offset = 4,
    transformOrigin,
    keepMounted = false,
    disablePortal = false,
    container,
    restoreFocusTo,
    slotProps,
    id: idProp,
    className,
    children,
    ...rest
  } = props;
  const parent = useContext(MenuInternalContext);
  // Un `Submenu` lo indica por contexto: se abre al lado, sin animación, y la selección sube al padre.
  const submenu = useContext(SubmenuFlagContext);
  const isSubmenu = submenu && parent != null;
  const autoId = useId();
  const id = idProp ?? `mtx-menu-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const popperRef = useRef<HTMLDivElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const handlePopperRef = useForkRef<HTMLDivElement>(popperRef, setPopperEl);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const handleListRef = useForkRef(listRef, ref);
  const lastReason = useRef<MenuCloseReason | null>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const [rtl, setRtl] = useState(false);

  const top = anchorPosition?.top;
  const left = anchorPosition?.left;
  const virtualAnchor = useMemo<VirtualElement | null>(
    () =>
      top === undefined || left === undefined
        ? null
        : { getBoundingClientRect: () => ({ top, left, right: left, bottom: top, width: 0, height: 0 }) },
    [top, left],
  );
  const anchor: ElementTarget<PositionAnchor> = virtualAnchor ?? anchorEl;

  useEffect(() => installModality(), []);

  const requestClose = useEventCallback((event: MenuCloseEvent, reason: MenuCloseReason) => {
    lastReason.current = reason;
    onClose?.(event, reason);
  });

  /** Ancla resuelta si es un elemento del DOM. */
  const anchorElement = (): HTMLElement | null => {
    const a = resolveTarget(anchor);
    return a && (a as Node).nodeType === 1 ? (a as HTMLElement) : null;
  };

  /** Devuelve el foco al disparador. */
  const restoreFocus = () => {
    const explicit = resolveTarget(restoreFocusTo);
    const previous = prevFocus.current;
    const usable = (el: HTMLElement | null) =>
      Boolean(el && el.isConnected && el !== document.body && !popperRef.current?.contains(el));
    const target = usable(explicit) ? explicit : usable(previous) ? previous : anchorElement();
    if (target && typeof target.focus === 'function') target.focus();
  };

  // Dirección del contexto: la del menú padre, la del ancla o la del documento.
  useEnhancedEffect(() => {
    if (!open) return;
    let next: boolean;
    if (isSubmenu && parent) next = parent.rtl;
    else {
      const a = anchorElement();
      next = a && a.isConnected ? isRtl(a) : isRtl(document.documentElement);
    }
    setRtl(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchor, isSubmenu, parent?.rtl]);

  usePosition(anchor, popperEl, {
    open,
    placement: isSubmenu ? 'right-start' : placement,
    offset: isSubmenu ? 0 : offset,
    padding: 8,
    rtl,
    dropdown: { matchWidth: !isSubmenu && matchWidth, content: paperRef, lockSide: true },
  });

  const layer = useLayer({
    open,
    kind: 'popup',
    nodes: popperRef,
    stack: [{ node: popperRef }],
    onEscape: (event) => requestClose(event, 'escapeKeyDown'),
  });

  useClickAway(
    () => [popperRef, anchorElement(), resolveTarget(restoreFocusTo)],
    (event) => {
      if (layer.isInUpperLayer(event.target)) return;
      requestClose(event, 'backdropClick');
    },
    { enabled: open },
  );

  // Cierre si el ancla sale de la vista (scroll o resize).
  useEffect(() => {
    if (!open || typeof window === 'undefined') return undefined;
    let frame = 0;
    const check = (event: Event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const a = resolveTarget(anchor);
        if (!a) return;
        const rect = a.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < 0 || rect.top > vh) requestClose(event, 'anchorHidden');
      });
    };
    const options: AddEventListenerOptions = { capture: true, passive: true };
    window.addEventListener('scroll', check, options);
    window.addEventListener('resize', check, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', check, options);
      window.removeEventListener('resize', check);
    };
  }, [open, anchor, requestClose]);

  // Foco inicial: una vez por apertura, cuando la lista está montada.
  const focused = useRef(false);
  useEnhancedEffect(() => {
    if (!open) {
      focused.current = false;
      return;
    }
    if (focused.current || !listRef.current) return;
    focused.current = true;
    const active = document.activeElement as HTMLElement | null;
    prevFocus.current = active && !popperRef.current?.contains(active) ? active : null;
    if (!autoFocus) return;
    focusInitial(listRef.current, autoFocusItem ?? isKeyboardModality());
  });

  // Transiciones abierto ↔ cerrado: `onOpen` y devolución del foco.
  const wasOpen = useRef(false);
  const handleOpen = useEventCallback(() => onOpen?.());
  useEnhancedEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;
    if (open) {
      lastReason.current = null;
      handleOpen();
      return;
    }
    const reason = lastReason.current;
    lastReason.current = null;
    if (reason && NO_RESTORE.includes(reason)) return;
    const active = document.activeElement;
    const focusInside = !active || active === document.body || Boolean(popperRef.current?.contains(active));
    if (reason || focusInside) restoreFocus();
  }, [open]);

  const select = useEventCallback((detail: MenuSelectDetail, event: SyntheticEvent) => {
    onSelect?.(detail, event);
    if (isSubmenu && parent) parent.select(detail, event);
    else if (closeOnSelect) requestClose(event, 'itemClick');
  });

  const requestTab = useEventCallback((event: ReactKeyboardEvent) => {
    if (isSubmenu && parent) {
      parent.requestTab(event);
      return;
    }
    // El foco vuelve al disparador antes de la acción por defecto: Tab continúa desde él.
    restoreFocus();
    requestClose(event, 'tabKeyDown');
  });

  const internal = useMemo<MenuInternalContextValue>(
    () => ({ open, rtl, isSubmenu, select, requestClose, requestTab }),
    [open, rtl, isSubmenu, select, requestClose, requestTab],
  );

  const { popper: popperSlot, paper: paperSlot } = slotProps ?? {};

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    popperSlot?.onMouseDown?.(event);
    // El foco permanece en el menú al pulsar su superficie o ítems deshabilitados.
    const target = event.target as Element;
    if (!target.closest(FOCUSABLE_INPUT)) event.preventDefault();
  };

  return (
    <Portal container={container} disablePortal={disablePortal}>
      <Grow
        in={open}
        timeout={isSubmenu ? 0 : { enter: 225, exit: 0 }}
        transformOrigin={transformOrigin}
        mountOnEnter={!keepMounted}
        unmountOnExit={!keepMounted}
      >
        <div
          {...popperSlot}
          ref={handlePopperRef as Ref<HTMLDivElement>}
          className={cx('mtx-menu__popper', popperSlot?.className)}
          dir={rtl ? 'rtl' : 'ltr'}
          onMouseDown={handleMouseDown}
        >
          <div {...paperSlot} ref={paperRef} role="presentation" className={cx('mtx-menu__paper', paperSlot?.className)}>
            <MenuInternalContext.Provider value={internal}>
              <MenuList
                ref={handleListRef}
                id={id}
                dense={dense}
                aria-hidden={open ? undefined : true}
                {...rest}
                className={cx(open && 'mtx-menu--open', className)}
              >
                <SubmenuFlagContext.Provider value={false}>{children}</SubmenuFlagContext.Provider>
              </MenuList>
            </MenuInternalContext.Provider>
          </div>
        </div>
      </Grow>
    </Portal>
  );
});

Menu.displayName = 'Menu';
