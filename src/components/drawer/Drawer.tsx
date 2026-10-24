'use client';
/**
 * Drawer de Materix UI: cajón lateral temporal (modal), persistente, permanente o responsive (patrón `Drawer` de MUI).
 */
import { Children, forwardRef, isValidElement, useEffect, useId, useRef, useState } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/drawer.css';
import {
  Portal,
  cx,
  useClickAway,
  useEnhancedEffect,
  useEventCallback,
  useFocusTrap,
  useForkRef,
  useLayer,
  useScrollLock,
} from '../../core';
import type { PortalProps } from '../../core';
import { useT } from '../../i18n';
import { Avatar } from '../avatar';
import { Backdrop } from '../backdrop';
import type { BackdropProps } from '../backdrop';
import { Button } from '../button';
import { DrawerContent, DrawerFooter, DrawerHeader } from './DrawerParts';
import type { DrawerContentProps } from './DrawerParts';
import { useDrawerMode } from './useDrawerMode';
import type { DrawerBreakpoint, DrawerMode, DrawerVariant } from './useDrawerMode';

/** Borde de la pantalla desde el que se desliza. */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

/** Ancho canónico (`narrow` 200px, `wide` 360px, `full` 100vw) o longitud CSS / px. */
export type DrawerWidth = 'narrow' | 'wide' | 'full' | 'full-width' | number | (string & {});

/** Motivo de la solicitud de cierre (los cuatro primeros, iguales a `mtx:drawer:close` de vanilla). */
export type DrawerCloseReason = 'backdropClick' | 'escapeKeyDown' | 'clickaway' | 'closeButtonClick' | 'breakpoint';

/** Evento que origina un cierre. */
export type DrawerCloseEvent = SyntheticEvent | Event;

/** Duración del deslizamiento (`--mtx-duration-standard`): tras ella se desmonta el temporal cerrado. */
export const DRAWER_TRANSITION_DURATION = 300;

/** Props de {@link Drawer}. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Abierto (controlado). Se ignora en modo permanente, que siempre está abierto. */
  open?: boolean;
  /** Solicita el cierre; el padre actualiza `open` (equivale a `mtx:drawer:close` con `detail.reason`). */
  onClose?: (event: DrawerCloseEvent, reason: DrawerCloseReason) => void;
  /** `open` pasa de `false` a `true` (equivale a `mtx:drawer:open`). */
  onOpen?: () => void;
  /** Variante (por defecto `temporary`). */
  variant?: DrawerVariant;
  /** Breakpoint de la variante `responsive`: temporal por debajo, permanente desde él (por defecto `md`). */
  breakpoint?: DrawerBreakpoint;
  /** El modo efectivo cambia al cruzar el breakpoint (equivale a `mtx:drawer:mode-change`). */
  onModeChange?: (mode: DrawerMode, previousMode: DrawerMode) => void;
  /** Borde de anclaje (por defecto `left`). */
  anchor?: DrawerAnchor;
  /** Ancho: `narrow`, `wide`, `full` o cualquier longitud (fija `--mtx-drawer-width`). */
  width?: DrawerWidth;
  /** Sombra `0`–`24` (`--mtx-elevation-N`). */
  elevation?: number;
  /** Bajo la AppBar (`permanent`, `persistent` o `responsive`). */
  clipped?: boolean;
  /** Contenido en el contenedor padre posicionado (drawer y fondo `absolute`, sin bloqueo de scroll). */
  absolute?: boolean;
  /** Título de la cabecera generada. */
  title?: ReactNode;
  /** Subtítulo bajo el título. */
  subtitle?: ReactNode;
  /** Nombre del usuario (cabecera de perfil). */
  userName?: ReactNode;
  /** Correo del usuario (cabecera de perfil). */
  userEmail?: ReactNode;
  /** Texto o nodo del avatar (por defecto, la inicial de `userName`). */
  userAvatar?: ReactNode;
  /** Muestra el botón de cierre en la cabecera generada (por defecto `true`; nunca en `permanent`). */
  closeButton?: boolean;
  /** `temporary`: la cabecera solo se ve mientras el drawer es temporal (útil en `responsive`). */
  headerMode?: 'always' | 'temporary';
  /** Texto informativo del pie generado (p. ej. la versión). */
  footerInfo?: ReactNode;
  /** Texto de la acción del pie generado (botón que además cierra el drawer). */
  footerAction?: ReactNode;
  /** Icono de la acción del pie (por defecto `logout`). */
  footerActionIcon?: ReactNode;
  /** Clic en la acción del pie. */
  onFooterActionClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  /** Relleno de 20px en el panel (`.mtx-drawer__content--padded`). */
  padded?: boolean;
  /** Props del panel desplazable `.mtx-drawer__content`. */
  contentProps?: DrawerContentProps;
  /** Sin fondo en el modo temporal (`data-backdrop="false"`). */
  hideBackdrop?: boolean;
  /** Ni el fondo ni un clic fuera cierran el drawer. */
  disableBackdropClick?: boolean;
  /** Escape no cierra el drawer. */
  disableEscapeKeyDown?: boolean;
  /** Mantiene montado el temporal cerrado (oculto con `visibility` y `aria-hidden`). */
  keepMounted?: boolean;
  /** Props adicionales del Backdrop del modo temporal. */
  backdropProps?: Partial<Omit<BackdropProps, 'open'>>;
  /** Renderiza el temporal en su sitio en lugar de en `document.body`. */
  disablePortal?: boolean;
  /** Contenedor del portal (por defecto `document.body`). */
  container?: PortalProps['container'];
  /** Contenido; `DrawerHeader`, `DrawerContent` y `DrawerFooter` se respetan (sintaxis BEM). */
  children?: ReactNode;
}

/**
 * Busca hijos marcadores por tipo y separa el resto.
 * @param {ReactNode} children Hijos.
 * @returns {object} Cabecera, panel, pie y resto.
 */
function partition(children: ReactNode): {
  header: ReactElement<HTMLAttributes<HTMLDivElement>> | null;
  content: ReactElement<DrawerContentProps> | null;
  footer: ReactElement<HTMLAttributes<HTMLDivElement>> | null;
  rest: ReactNode[];
} {
  const found: Record<'header' | 'content' | 'footer', ReactElement | null> = { header: null, content: null, footer: null };
  const rest: ReactNode[] = [];
  Children.toArray(children).forEach((child) => {
    const slot = !isValidElement(child)
      ? null
      : child.type === DrawerHeader
        ? 'header'
        : child.type === DrawerContent
          ? 'content'
          : child.type === DrawerFooter
            ? 'footer'
            : null;
    if (slot && !found[slot]) found[slot] = child as ReactElement;
    else rest.push(child);
  });
  return {
    header: found.header as ReactElement<HTMLAttributes<HTMLDivElement>> | null,
    content: found.content as ReactElement<DrawerContentProps> | null,
    footer: found.footer as ReactElement<HTMLAttributes<HTMLDivElement>> | null,
    rest,
  };
}

/**
 * Clase y estilos del ancho declarado.
 * @param {DrawerWidth} [width] Ancho.
 * @returns {{className?: string, style?: CSSProperties}} Modificador o estilo en línea.
 */
function resolveWidth(width?: DrawerWidth): { className?: string; style?: CSSProperties } {
  if (width == null || width === '') return {};
  if (width === 'narrow' || width === 'wide') return { className: `mtx-drawer--${width}` };
  if (width === 'full' || width === 'full-width') return { className: 'mtx-drawer--full-width' };
  const value = typeof width === 'number' ? `${width}px` : width;
  return { style: { width: value, '--mtx-drawer-width': value } as CSSProperties };
}

/**
 * Cajón lateral con cabecera, panel desplazable y pie generados; el temporal es modal (fondo, foco, Escape).
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(props, ref) {
  const {
    open: openProp = false,
    onClose,
    onOpen,
    variant = 'temporary',
    breakpoint = 'md',
    onModeChange,
    anchor = 'left',
    width,
    elevation,
    clipped = false,
    absolute = false,
    title,
    subtitle,
    userName,
    userEmail,
    userAvatar,
    closeButton = true,
    headerMode = 'always',
    footerInfo,
    footerAction,
    footerActionIcon = 'logout',
    onFooterActionClick,
    padded = false,
    contentProps,
    hideBackdrop = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    keepMounted = false,
    backdropProps,
    disablePortal = false,
    container,
    id: idProp,
    role: roleProp,
    className,
    style,
    onClick,
    children,
    ...rest
  } = props;

  const t = useT('drawer');
  const autoId = useId().replace(/:/g, '');
  const id = idProp ?? `mtx-drawer-${autoId}`;
  const titleId = `${id}-title`;

  const mode = useDrawerMode(variant, breakpoint);
  const isTemporary = mode === 'temporary';
  const isPermanent = mode === 'permanent';
  const open = isPermanent || openProp;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, rootRef);
  // El panel en estado: el portal lo monta tras el primer commit y la trampa de foco debe esperarlo.
  const [panelNode, setPanelNode] = useState<HTMLDivElement | null>(null);
  const handlePanelRef = useForkRef<HTMLDivElement>(panelRef, setPanelNode);
  const backdropHandleRef = useForkRef<HTMLDivElement>(
    backdropRef,
    (backdropProps as { ref?: Ref<HTMLDivElement> } | undefined)?.ref,
  );
  // El responsive se mantiene montado (como vanilla): no pierde estado al cruzar el breakpoint.
  const keepMountedEff = keepMounted || variant === 'responsive';

  const [mounted, setMounted] = useState(() => open || keepMountedEff || !isTemporary);
  const [shown, setShown] = useState(open);
  // Como vanilla, la apertura inicial ya lleva --animated (sin efecto visible: no hay pintado previo).
  const [animated, setAnimated] = useState(() => openProp && mode !== 'permanent');

  const requestClose = useEventCallback((event: DrawerCloseEvent, reason: DrawerCloseReason) => {
    if (isPermanent) return;
    onClose?.(event, reason);
  });

  // Cambio de modo (responsive): sin animación, libera el modal y solicita cerrar el temporal.
  const prevMode = useRef(mode);
  const modeChanged = useRef(false);
  const handleModeChange = useEventCallback((next: DrawerMode, previous: DrawerMode) => onModeChange?.(next, previous));
  useEnhancedEffect(() => {
    const previous = prevMode.current;
    if (previous === mode) return;
    prevMode.current = mode;
    modeChanged.current = true;
    setAnimated(false);
    setMounted(true);
    setShown(mode === 'permanent');
    // Directo a onClose: requestClose ya ve el modo nuevo (permanente) y lo ignoraría.
    if (openProp && previous !== 'permanent') onClose?.(new Event('change'), 'breakpoint');
    handleModeChange(mode, previous);
  }, [mode]);

  // Al volver a temporal con el foco dentro, el foco pasa al disparador visible (aria-controls) o se libera.
  const prevModeForFocus = useRef(mode);
  useEffect(() => {
    const previous = prevModeForFocus.current;
    prevModeForFocus.current = mode;
    if (previous === mode || mode !== 'temporary') return;
    const root = rootRef.current;
    const active = root?.ownerDocument.activeElement as HTMLElement | null;
    if (!root || !active || !root.contains(active)) return;
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id;
    const trigger = Array.from(root.ownerDocument.querySelectorAll<HTMLElement>(`[aria-controls~="${escaped}"]`)).find(
      (node) => !root.contains(node) && node.getClientRects().length > 0,
    );
    if (trigger) trigger.focus();
    else active.blur();
  }, [mode, id]);

  // Montaje, deslizamiento (clase --open tras pintar cerrado) y desmontaje del temporal cerrado.
  useEnhancedEffect(() => {
    if (modeChanged.current) {
      modeChanged.current = false;
      return undefined;
    }
    if ((!isTemporary || keepMountedEff) && !mounted) {
      setMounted(true);
      return undefined;
    }
    if (open) {
      if (!mounted) {
        setMounted(true);
        return undefined;
      }
      if (!shown) {
        // Fuerza el estilo cerrado antes de añadir --open para que la transición se ejecute.
        rootRef.current?.getBoundingClientRect();
        setAnimated(true);
        setShown(true);
      }
      return undefined;
    }
    if (shown) {
      setAnimated(true);
      setShown(false);
      return undefined;
    }
    if (mounted && isTemporary && !keepMountedEff) {
      const timer = setTimeout(() => setMounted(false), DRAWER_TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, mounted, shown, isTemporary, keepMountedEff]);

  // onOpen solo al pasar de cerrado a abierto (la apertura inicial es silenciosa, como `data-open`).
  const prevOpen = useRef(openProp);
  const handleOpen = useEventCallback(() => onOpen?.());
  useEffect(() => {
    if (prevOpen.current === openProp) return;
    prevOpen.current = openProp;
    if (openProp && !isPermanent) handleOpen();
  }, [openProp, isPermanent, handleOpen]);

  // Modal: pila de capas (Escape), bloqueo de scroll, trampa de foco y clic fuera.
  const modalActive = isTemporary && open && mounted;
  const layer = useLayer({
    open: modalActive,
    kind: 'modal',
    nodes: () => [rootRef.current, backdropRef.current].filter(Boolean) as Node[],
    stack: () => [{ node: rootRef }, { node: backdropRef, offset: -1 }],
    onEscape: (event) => {
      if (!disableEscapeKeyDown) requestClose(event, 'escapeKeyDown');
    },
  });
  useScrollLock(modalActive && !absolute);
  useFocusTrap(panelRef, {
    active: modalActive && shown && panelNode !== null,
    initialFocus: () => panelRef.current?.querySelector<HTMLElement>('[data-drawer-autofocus]') ?? null,
    enforceFocus: false,
    ignore: (node) => layer.isInUpperLayer(node),
  });
  useClickAway(
    [rootRef],
    (event) => {
      const target = event.target as Node | null;
      if (!target || backdropRef.current?.contains(target)) return;
      if (layer.isInUpperLayer(target)) return;
      // El disparador (aria-controls) alterna por su cuenta: no es "fuera".
      if (target instanceof Element) {
        const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id;
        if (target.closest(`[aria-controls~="${escaped}"]`)) return;
      }
      if (!disableBackdropClick) requestClose(event, 'clickaway');
    },
    { enabled: modalActive && shown },
  );

  // `[data-mtx-drawer-close]` dentro del drawer cierra (sin valor o con el id de este drawer).
  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-mtx-drawer-close]');
    if (!trigger || !event.currentTarget.contains(trigger)) return;
    const target = trigger.getAttribute('data-mtx-drawer-close');
    if (!target || target === id) requestClose(event, 'closeButtonClick');
  };

  const { header: headerEl, content: contentEl, footer: footerEl, rest: loose } = partition(children);

  // Cabecera: manual, de perfil o de título.
  const hasUser = userName != null || userEmail != null;
  const temporaryOnly = headerMode === 'temporary' ? 'mtx-drawer__temporary-only' : undefined;
  let header: ReactNode = null;
  if (headerEl) {
    header = <DrawerHeader {...headerEl.props} className={cx(headerEl.props.className, temporaryOnly)} />;
  } else if (title != null || hasUser) {
    const avatarContent = userAvatar ?? (typeof userName === 'string' && userName ? userName.charAt(0).toUpperCase() : null);
    header = (
      <div className={cx('mtx-drawer__header', temporaryOnly)}>
        {hasUser ? (
          <div className="mtx-drawer__user">
            {avatarContent != null && avatarContent !== '' && (
              <Avatar className="mtx-avatar--circular mtx-drawer__user-avatar">{avatarContent}</Avatar>
            )}
            <div className="mtx-drawer__user-info">
              {userName != null && (
                <div className="mtx-drawer__user-name" id={titleId}>
                  {userName}
                </div>
              )}
              {userEmail != null && <div className="mtx-drawer__user-email">{userEmail}</div>}
            </div>
          </div>
        ) : (
          <div className="mtx-drawer__heading">
            <h3 className="mtx-drawer__title" id={titleId}>
              {title}
            </h3>
            {subtitle != null && <div className="mtx-drawer__subtitle">{subtitle}</div>}
          </div>
        )}
        {closeButton && variant !== 'permanent' && (
          <button type="button" className="mtx-icon-button mtx-drawer__close" aria-label={t('close', null, 'Close')} data-mtx-drawer-close="">
            <span className="material-icons" aria-hidden="true">
              close
            </span>
          </button>
        )}
      </div>
    );
  }
  const generatedLabel = !headerEl && (userName != null || (!hasUser && title != null));

  // Pie: manual o generado.
  let footer: ReactNode = null;
  if (footerEl) {
    footer = <DrawerFooter {...footerEl.props} />;
  } else if (footerInfo != null || footerAction != null) {
    footer = (
      <div className="mtx-drawer__footer">
        {footerInfo != null && <div className="mtx-drawer__footer-info">{footerInfo}</div>}
        {footerAction != null && (
          <div className="mtx-drawer__footer-actions">
            <Button
              variant="text"
              size="small"
              color="error"
              startIcon={footerActionIcon}
              data-mtx-drawer-close=""
              onClick={onFooterActionClick}
            >
              {footerAction}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Padding del contenedor raíz al panel: cabecera y pie quedan de borde a borde (como vanilla).
  const { padding: rootPadding, ...rootStyleRest } = style ?? {};
  const widthInfo = resolveWidth(width);
  const rootStyle: CSSProperties = {
    ...widthInfo.style,
    ...(elevation !== undefined ? { boxShadow: `var(--mtx-elevation-${elevation})` } : null),
    ...rootStyleRest,
  };

  // Semántica del panel: diálogo modal en temporal, foco programático en persistente.
  const panelSource: DrawerContentProps = { ...contentProps, ...(contentEl ? contentEl.props : null) };
  const { padded: panelPadded = false, className: panelClassName, style: panelStyle, ...panelRest } = panelSource;
  const ariaLabel = rest['aria-label'];
  const panelAria: Record<string, unknown> = {};
  if (isTemporary) {
    panelAria.role = panelRest.role ?? 'dialog';
    panelAria['aria-modal'] = 'true';
    panelAria.tabIndex = panelRest.tabIndex ?? -1;
    if (!panelRest['aria-label'] && !panelRest['aria-labelledby']) {
      if (ariaLabel) panelAria['aria-label'] = ariaLabel;
      else if (rest['aria-labelledby']) panelAria['aria-labelledby'] = rest['aria-labelledby'];
      else if (generatedLabel) panelAria['aria-labelledby'] = titleId;
    }
  } else if (mode === 'persistent') {
    panelAria.tabIndex = panelRest.tabIndex ?? -1;
  }
  const panel = (
    <div
      {...panelRest}
      {...panelAria}
      ref={handlePanelRef}
      className={cx('mtx-drawer__content', (padded || panelPadded) && 'mtx-drawer__content--padded', panelClassName)}
      style={rootPadding !== undefined ? { padding: rootPadding, ...panelStyle } : panelStyle}
    >
      {contentEl ? contentEl.props.children : loose}
    </div>
  );

  const isOpenClass = isPermanent || shown;
  const role = roleProp ?? (isPermanent ? 'navigation' : mode === 'persistent' ? 'region' : undefined);

  const drawer = mounted ? (
    <div
      {...rest}
      ref={handleRef}
      id={id}
      role={role}
      aria-hidden={isOpenClass ? 'false' : 'true'}
      className={cx(
        'mtx-drawer',
        `mtx-drawer--${anchor}`,
        variant === 'responsive' && 'mtx-drawer--responsive',
        absolute && 'mtx-drawer--absolute',
        clipped && 'mtx-drawer--clipped',
        widthInfo.className,
        `mtx-drawer--${mode}`,
        isOpenClass && 'mtx-drawer--open',
        animated && !isPermanent && 'mtx-drawer--animated',
        className,
      )}
      style={rootStyle}
      onClick={handleClick}
    >
      {header}
      {panel}
      {contentEl && loose}
      {footer}
    </div>
  ) : null;

  // El temporal (no responsive ni contenido) va a un portal; el responsive se queda en su sitio para no remontarse.
  const portalDrawer = isTemporary && variant !== 'responsive' && !absolute && !disablePortal;
  const backdropStyle: CSSProperties = absolute
    ? { position: 'absolute', zIndex: 9, ...backdropProps?.style }
    : { zIndex: 'calc(var(--mtx-z-index-modal, 1300) - 1)' as unknown as number, ...backdropProps?.style };
  const backdrop =
    isTemporary && !hideBackdrop ? (
      <Backdrop
        {...backdropProps}
        ref={backdropHandleRef}
        open={open && mounted}
        disablePortal={portalDrawer || absolute || disablePortal}
        container={container}
        style={backdropStyle}
        onClick={(event) => {
          backdropProps?.onClick?.(event);
          if (!event.defaultPrevented && !disableBackdropClick) requestClose(event, 'backdropClick');
        }}
      />
    ) : null;

  return (
    <Portal disablePortal={!portalDrawer} container={container}>
      {backdrop}
      {drawer}
    </Portal>
  );
});
