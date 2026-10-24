'use client';
/**
 * Diálogo modal de Materix UI (patrón `Dialog` de MUI): portal, fondo, foco atrapado, Escape y pila de capas.
 */
import { Children, forwardRef, isValidElement, useCallback, useId, useMemo, useRef, useState } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/dialog.css';
import {
  Portal,
  cx,
  isDev,
  prefersReducedMotion,
  useEnhancedEffect,
  useEventCallback,
  useFocusTrap,
  useForkRef,
  useLayer,
  useScrollLock,
  useTransition,
} from '../../core';
import type { PortalProps, TransitionTimeout } from '../../core';
import { Backdrop } from '../backdrop/Backdrop';
import type { BackdropProps } from '../backdrop/Backdrop';
import { DialogContext } from './DialogContext';
import type { DialogActionsAlign, DialogContextValue } from './DialogContext';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from './DialogParts';

/** Motivo del cierre solicitado (`closeButtonClick`: elemento con `data-mtx-dialog-close`). */
export type DialogCloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick';
/** Ancho máximo del panel; `false` lo quita. */
export type DialogMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
/** Zona que hace scroll: el panel (`paper`) o el contenedor (`body`). */
export type DialogScroll = 'paper' | 'body';

/** Duración de la animación del panel (`--mtx-duration-short`, igual que vanilla). */
export const DIALOG_TRANSITION_DURATION = 250;

/** Estado inicial de la animación del panel (mismo valor que `.mtx-dialog__paper` en vanilla). */
const PAPER_HIDDEN_STYLE: CSSProperties = { opacity: 0, transform: 'scale(0.9) translateY(10px)' };

/** Anchos sin clase en el CSS compartido (vanilla solo define sm–xl). */
const INLINE_MAX_WIDTH: Partial<Record<string, string>> = { xs: '20rem', false: 'none' };
const MAX_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Quita la primera aparición de un id de la lista.
 * @param {string[]} list Lista de ids.
 * @param {string} id Id a retirar.
 * @returns {string[]} Nueva lista.
 */
function removeOnce(list: string[], id: string): string[] {
  const index = list.indexOf(id);
  return index < 0 ? list : [...list.slice(0, index), ...list.slice(index + 1)];
}

/** Props del panel (`.mtx-dialog__paper`). */
export type DialogPaperProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

/** Propiedades de {@link Dialog}. */
export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role' | 'onClose'> {
  /** Abre el diálogo (controlado; equivale a `open()`/`close()`). */
  open: boolean;
  /** Solicita el cierre; el padre actualiza `open` (equivale a `mtx:dialog:close` con `reason`). */
  onClose?: (event: ReactMouseEvent<HTMLElement> | KeyboardEvent, reason: DialogCloseReason) => void;
  /** Al abrirse (equivale a `mtx:dialog:open`). */
  onOpen?: () => void;
  /** Al terminar la animación de entrada. */
  onEntered?: () => void;
  /** Al terminar la animación de salida. */
  onExited?: () => void;
  /** Rol del panel: `dialog` (por defecto) o `alertdialog`. */
  role?: 'dialog' | 'alertdialog';
  /** Sintaxis simplificada: genera un `DialogTitle` (equivale a `data-title`). */
  title?: ReactNode;
  /** Sintaxis simplificada: genera un `DialogContentText` (equivale a `data-description`). */
  description?: ReactNode;
  /** Sintaxis simplificada: botones que se envuelven en un `DialogActions`. */
  actions?: ReactNode;
  /** Alineación heredada por las acciones sin `align` (equivale a `data-actions-align`). */
  actionsAlign?: DialogActionsAlign;
  /** Ancho máximo: `xs`, `sm` (24rem), `md` (32rem, por defecto), `lg` (48rem), `xl` (64rem) o `false`. */
  maxWidth?: DialogMaxWidth;
  /** El panel ocupa el ancho disponible hasta `maxWidth` (por defecto `true`, como vanilla). */
  fullWidth?: boolean;
  /** Pantalla completa sin esquinas (`mtx-dialog--full`). */
  fullScreen?: boolean;
  /** Zona de scroll: `paper` (por defecto) o `body` (equivale a `data-scroll`). */
  scroll?: DialogScroll;
  /** Escape no cierra (la capa lo consume igualmente; equivale a `data-disable-escape`). */
  disableEscapeKeyDown?: boolean;
  /** El clic en el fondo no cierra (equivale a `data-disable-backdrop-close`). */
  disableBackdropClose?: boolean;
  /** No bloquea el scroll del `body`. */
  disableScrollLock?: boolean;
  /** No devuelve el foco al disparador al cerrar. */
  disableRestoreFocus?: boolean;
  /** Permite que el foco salga del panel. */
  disableEnforceFocus?: boolean;
  /** No renderiza el fondo. */
  hideBackdrop?: boolean;
  /** Mantiene el diálogo en el DOM mientras está cerrado. */
  keepMounted?: boolean;
  /** Renderiza en su sitio, sin portal a `document.body`. */
  disablePortal?: boolean;
  /** Contenedor del portal (por defecto `document.body`). */
  container?: PortalProps['container'];
  /** Duración de la animación del panel en ms (por defecto 250). */
  transitionDuration?: TransitionTimeout;
  /** Props del panel (`className`, `style`, `ref`…). */
  paperProps?: DialogPaperProps;
  /** Props del fondo reutilizado ({@link Backdrop}). */
  backdropProps?: Partial<Omit<BackdropProps, 'open'>>;
  children?: ReactNode;
}

/**
 * Ventana modal que interrumpe la tarea para pedir una decisión o mostrar información crítica.
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const {
    open,
    onClose,
    onOpen,
    onEntered,
    onExited,
    role = 'dialog',
    title,
    description,
    actions,
    actionsAlign,
    maxWidth,
    fullWidth = true,
    fullScreen = false,
    scroll = 'paper',
    disableEscapeKeyDown = false,
    disableBackdropClose = false,
    disableScrollLock = false,
    disableRestoreFocus = false,
    disableEnforceFocus = false,
    hideBackdrop = false,
    keepMounted = false,
    disablePortal = false,
    container,
    transitionDuration = DIALOG_TRANSITION_DURATION,
    paperProps,
    backdropProps,
    id: idProp,
    className,
    onClick,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    children,
    ...rest
  } = props;

  const autoId = useId();
  const baseId = idProp || `mtx-dialog-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [rootNode, setRootNode] = useState<HTMLDivElement | null>(null);
  const [paperNode, setPaperNode] = useState<HTMLDivElement | null>(null);
  const handleRootRef = useForkRef<HTMLDivElement>(ref, setRootNode);
  const { ref: paperRefProp, className: paperClassName, style: paperStyle, ...paperRest } = paperProps || {};
  const handlePaperRef = useForkRef<HTMLDivElement>(paperRefProp, setPaperNode);
  const paperRef = useRef<HTMLDivElement | null>(null);
  paperRef.current = paperNode;

  // Título y descripción registrados por DialogTitle / DialogContentText.
  const [titleIds, setTitleIds] = useState<string[]>([]);
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);
  const registerTitle = useCallback((id: string) => {
    setTitleIds((list) => [...list, id]);
    return () => setTitleIds((list) => removeOnce(list, id));
  }, []);
  const registerDescription = useCallback((id: string) => {
    setDescriptionIds((list) => [...list, id]);
    return () => setDescriptionIds((list) => removeOnce(list, id));
  }, []);
  const context = useMemo<DialogContextValue>(
    () => ({ baseId, registerTitle, registerDescription, actionsAlign }),
    [baseId, registerTitle, registerDescription, actionsAlign],
  );

  const { status, mounted } = useTransition(open, transitionDuration, {
    mountOnEnter: !keepMounted,
    unmountOnExit: !keepMounted,
    onEntered: () => onEntered?.(),
    onExited: () => onExited?.(),
  });
  const visible = open || status !== 'exited';
  const ready = open && Boolean(rootNode && paperNode);

  const requestClose = useEventCallback(
    (event: ReactMouseEvent<HTMLElement> | KeyboardEvent, reason: DialogCloseReason) => onClose?.(event, reason),
  );

  // Pila común de capas: Escape solo llega al diálogo superior; un diálogo anidado se apila encima.
  const layer = useLayer({
    open: ready,
    kind: 'modal',
    nodes: () => rootNode,
    stack: () => (rootNode ? [{ node: rootNode }] : []),
    onEscape: (event) => {
      if (!disableEscapeKeyDown) requestClose(event, 'escapeKeyDown');
    },
  });
  useScrollLock(open && !disableScrollLock);
  useFocusTrap(paperRef, {
    active: ready,
    restoreFocus: !disableRestoreFocus,
    enforceFocus: !disableEnforceFocus,
    initialFocus: () => paperRef.current?.querySelector<HTMLElement>('[data-dialog-autofocus]') ?? null,
    ignore: (node) => layer.isInUpperLayer(node),
  });

  // Animación del panel: se pinta en el estado inicial y se "arma" en el siguiente commit.
  const [armed, setArmed] = useState(open);
  useEnhancedEffect(() => {
    if (!open) {
      setArmed(false);
      return;
    }
    if (armed || !paperNode) return;
    if (!prefersReducedMotion()) void paperNode.offsetWidth;
    setArmed(true);
  }, [open, armed, paperNode]);

  // `onOpen` cada vez que pasa a abierto (también si se monta abierto).
  const wasOpen = useRef(false);
  const handleOpen = useEventCallback(() => onOpen?.());
  useEnhancedEffect(() => {
    if (open && !wasOpen.current) handleOpen();
    wasOpen.current = open;
  }, [open, handleOpen]);

  if (isDev && maxWidth !== undefined && maxWidth !== false && !MAX_WIDTHS.includes(maxWidth)) {
    console.warn(`Dialog: maxWidth no válido "${String(maxWidth)}"`);
  }

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!open || event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    // Solo nodos del propio diálogo (un diálogo anidado burbujea por el árbol de React).
    if (!target || !event.currentTarget.contains(target)) return;
    const closer = target.closest('[data-mtx-dialog-close]');
    if (closer && event.currentTarget.contains(closer)) requestClose(event, 'closeButtonClick');
  };

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    backdropProps?.onClick?.(event);
    if (!open || event.defaultPrevented || disableBackdropClose) return;
    requestClose(event, 'backdropClick');
  };

  // Sintaxis simplificada: título y acciones conservan su sitio; el resto va a DialogContent.
  const items = Children.toArray(children);
  const isPart = (node: ReactNode, type: unknown) => isValidElement(node) && node.type === type;
  const hasTitle = items.some((node) => isPart(node, DialogTitle));
  const hasContent = items.some((node) => isPart(node, DialogContent));
  let body: ReactNode;
  if (hasContent) {
    body = children;
  } else {
    const titles = items.filter((node) => isPart(node, DialogTitle));
    const actionItems = items.filter((node) => isPart(node, DialogActions));
    const others = items.filter((node) => !isPart(node, DialogTitle) && !isPart(node, DialogActions));
    body = (
      <>
        {titles}
        {(others.length > 0 || description != null) && (
          <DialogContent>
            {description != null && <DialogContentText>{description}</DialogContentText>}
            {others}
          </DialogContent>
        )}
        {actionItems}
      </>
    );
  }

  const maxWidthKey = String(maxWidth);
  const inlineMaxWidth = maxWidth === undefined ? undefined : INLINE_MAX_WIDTH[maxWidthKey];
  const mergedPaperStyle: CSSProperties = {
    ...(inlineMaxWidth && !fullScreen ? { maxWidth: inlineMaxWidth } : null),
    ...(!fullWidth && !fullScreen ? { width: 'auto' } : null),
    ...(armed ? null : PAPER_HIDDEN_STYLE),
    ...paperStyle,
  };

  if (!mounted && !open) return null;

  const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : titleIds[0]);
  const describedBy = ariaDescribedBy ?? descriptionIds[0];

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <DialogContext.Provider value={context}>
        <div
          {...rest}
          ref={handleRootRef}
          id={idProp}
          className={cx(
            'mtx-dialog',
            `mtx-dialog--scroll-${scroll}`,
            maxWidth && !INLINE_MAX_WIDTH[maxWidthKey] && `mtx-dialog--max-${maxWidth}`,
            fullScreen && 'mtx-dialog--full',
            visible && 'mtx-dialog--open',
            className,
          )}
          onClick={handleClick}
        >
          {!hideBackdrop && (
            <Backdrop
              {...backdropProps}
              open={open}
              keepMounted={keepMounted}
              disablePortal
              className={cx('mtx-dialog__backdrop', backdropProps?.className)}
              style={{ zIndex: 0, ...backdropProps?.style }}
              onClick={handleBackdropClick}
            />
          )}
          <div
            tabIndex={-1}
            {...paperRest}
            ref={handlePaperRef}
            className={cx('mtx-dialog__paper', paperClassName)}
            style={mergedPaperStyle}
            role={role}
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            aria-label={ariaLabel}
          >
            {!hasTitle && title != null && <DialogTitle>{title}</DialogTitle>}
            {body}
            {actions != null && <DialogActions>{actions}</DialogActions>}
          </div>
        </div>
      </DialogContext.Provider>
    </Portal>
  );
});
