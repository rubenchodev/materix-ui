'use client';
/**
 * SpeedDial: FAB principal que despliega acciones secundarias etiquetadas
 * (patrón `SpeedDial` de MUI, port de `speed-dial.js` de Materix UI vanilla).
 */
import { Children, forwardRef, isValidElement, useEffect, useId, useMemo, useRef } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import '@rubenchodev/materix-ui/components/speed-dial.css';
import { cx, useControlled, useClickAway, useEventCallback, useForkRef, useLayer } from '../../core';
import { useT } from '../../i18n';
import { Fab } from '../fab';
import type { FabColor, FabProps } from '../fab';
import { SpeedDialActionIndexContext, SpeedDialContext } from './context';
import type { SpeedDialContextValue, SpeedDialDirection } from './context';
import { SpeedDialIcon } from './SpeedDialIcon';

/** Modo de apertura: clic (por defecto) o también al pasar el puntero (`data-event`). */
export type SpeedDialEvent = 'click' | 'hover';

/** Posiciones fijas utilitarias (`mtx-speed-dial--fixed-br|bl`). */
export type SpeedDialPosition = 'fixed-br' | 'fixed-bl';

/** Motivo de apertura. */
export type SpeedDialOpenReason = 'toggle' | 'mouseEnter';

/** Motivo de cierre. */
export type SpeedDialCloseReason = 'toggle' | 'mouseLeave' | 'escapeKeyDown' | 'clickaway';

/** Evento que origina el cambio. */
export type SpeedDialChangeEvent = SyntheticEvent | Event;

/** Propiedades de {@link SpeedDial}. */
export interface SpeedDialProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Nombre accesible del FAB principal; por defecto i18n `speedDial.actions`. */
  ariaLabel?: string;
  /** Icono del FAB: nombre de Material Icons, nodo o `<SpeedDialIcon />`. Por defecto `<SpeedDialIcon />` (`add`). */
  icon?: ReactNode;
  /** Icono de apertura cuando `icon` es un nombre o se omite (usa `SpeedDialIcon`). */
  openIcon?: ReactNode;
  /** Dirección de despliegue. */
  direction?: SpeedDialDirection;
  /** Estado abierto controlado. */
  open?: boolean;
  /** Estado inicial no controlado. */
  defaultOpen?: boolean;
  /** Solicitud de apertura (equivale a `mtx:speed-dial:open`). */
  onOpen?: (event: SpeedDialChangeEvent, reason: SpeedDialOpenReason) => void;
  /** Solicitud de cierre (equivale a `mtx:speed-dial:close`). */
  onClose?: (event: SpeedDialChangeEvent, reason: SpeedDialCloseReason) => void;
  /** `hover` abre al entrar el puntero y cierra al salir; el clic sigue alternando. */
  event?: SpeedDialEvent;
  /** Etiquetas como Tooltip en hover/foco en lugar de persistentes (`data-tooltip-hover`). */
  tooltipHover?: boolean;
  /** Color del FAB principal. */
  color?: FabColor;
  /** Oculta el FAB con una transición de escala (y cierra las acciones). */
  hidden?: boolean;
  /** Fija el SpeedDial a 24px de la esquina inferior derecha o izquierda. */
  position?: SpeedDialPosition;
  /** Props extra del FAB principal. */
  FabProps?: Partial<FabProps>;
  /** Idioma local del texto por defecto. */
  locale?: string;
  /** Acciones (`SpeedDialAction`). */
  children?: ReactNode;
}

const ARROW_ORIENTATION: Record<string, 'vertical' | 'horizontal'> = {
  ArrowUp: 'vertical',
  ArrowDown: 'vertical',
  ArrowLeft: 'horizontal',
  ArrowRight: 'horizontal',
};

const NEXT_KEY: Record<SpeedDialDirection, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

/**
 * Botón de acción flotante que despliega de tres a seis acciones relacionadas.
 */
export const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(function SpeedDial(props, ref) {
  const {
    ariaLabel,
    icon,
    openIcon,
    direction = 'up',
    open: openProp,
    defaultOpen = false,
    onOpen,
    onClose,
    event: eventMode = 'click',
    tooltipHover = false,
    color = 'primary',
    hidden = false,
    position,
    FabProps: fabProps = {},
    locale,
    className,
    children,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    ...rest
  } = props;

  const t = useT('speedDial', locale);
  const [openState, setOpenState] = useControlled({ controlled: openProp, default: defaultOpen, name: 'SpeedDial', state: 'open' });
  const open = openState && !hidden;
  const rootRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootRef, ref);
  const hiddenSeen = useRef(hidden);
  if (hidden) hiddenSeen.current = true;
  const actionsId = `mtx-speed-dial-actions-${useId().replace(/:/g, '')}`;

  const requestOpen = useEventCallback((event: SpeedDialChangeEvent, reason: SpeedDialOpenReason) => {
    if (open || hidden) return;
    setOpenState(true);
    onOpen?.(event, reason);
  });

  const requestClose = useEventCallback((event: SpeedDialChangeEvent, reason: SpeedDialCloseReason) => {
    if (!open) return;
    setOpenState(false);
    onClose?.(event, reason);
  });

  // Escape (pila de capas) cierra y devuelve el foco al FAB.
  useLayer({
    open,
    kind: 'popup',
    nodes: rootRef,
    onEscape: (event) => {
      requestClose(event, 'escapeKeyDown');
      fabRef.current?.focus();
    },
  });

  useClickAway([rootRef], (event) => requestClose(event, 'clickaway'), { enabled: open });

  // Acciones cerradas: inert + aria-hidden; al cerrar con el foco dentro, vuelve al FAB.
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) return;
    actions.inert = !open;
    if (!open && actions.contains(document.activeElement)) fabRef.current?.focus();
  }, [open]);

  const handleFabClick = (event: ReactMouseEvent<HTMLElement>) => {
    fabProps.onClick?.(event);
    if (event.defaultPrevented) return;
    if (open) requestClose(event, 'toggle');
    else requestOpen(event, 'toggle');
  };

  // Hover solo con ratón o lápiz: en táctil el clic ya alterna.
  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    rest.onPointerEnter?.(event);
    if (eventMode === 'hover' && event.pointerType !== 'touch') requestOpen(event, 'mouseEnter');
  };

  const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    if (eventMode === 'hover') requestClose(event, 'mouseLeave');
  };

  // Flechas: la de la dirección avanza hacia las acciones y la opuesta vuelve hacia el FAB.
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !open) return;
    const orientation = ARROW_ORIENTATION[event.key];
    const nextKey = NEXT_KEY[direction];
    if (!orientation || orientation !== ARROW_ORIENTATION[nextKey]) return;
    const fab = fabRef.current;
    const actions = Array.from(
      actionsRef.current?.querySelectorAll<HTMLElement>('.mtx-speed-dial__action') ?? [],
    ).filter((el) => !(el as HTMLButtonElement).disabled && el.getAttribute('aria-disabled') !== 'true');
    const items = fab ? [fab, ...actions] : actions;
    if (items.length < 2) return;
    event.preventDefault();
    const current = items.findIndex((el) => el === document.activeElement || el.contains(document.activeElement));
    const step = event.key === nextKey ? 1 : -1;
    const next = Math.min(Math.max((current < 0 ? 0 : current) + step, 0), items.length - 1);
    items[next].focus();
  };

  const contextValue = useMemo<SpeedDialContextValue>(() => ({ open, direction, tooltipHover }), [open, direction, tooltipHover]);

  const fabIcon =
    icon === undefined || typeof icon === 'string' ? (
      <SpeedDialIcon icon={icon ?? 'add'} openIcon={openIcon} />
    ) : (
      icon
    );

  const actions = Children.toArray(children).filter(isValidElement);
  const { onClick: _ignored, className: fabClassName, style: fabStyle, ...fabRest } = fabProps;
  // Zoom de `hidden`: conserva las transiciones propias de `.mtx-fab` y añade escala y visibilidad.
  const hiddenStyle = hiddenSeen.current
    ? {
        transform: hidden ? 'scale(0)' : 'scale(1)',
        visibility: hidden ? ('hidden' as const) : undefined,
        transition: [
          'background-color var(--mtx-duration-shorter) var(--mtx-easing-standard)',
          'box-shadow var(--mtx-duration-shorter) var(--mtx-easing-standard)',
          'color var(--mtx-duration-shorter) var(--mtx-easing-standard)',
          'transform var(--mtx-duration-short) var(--mtx-easing-standard)',
          `visibility 0s linear ${hidden ? 'var(--mtx-duration-short)' : '0s'}`,
        ].join(', '),
      }
    : undefined;

  return (
    <SpeedDialContext.Provider value={contextValue}>
      <div
        ref={handleRef}
        className={cx(
          'mtx-speed-dial',
          `mtx-speed-dial--direction-${direction}`,
          open && 'mtx-speed-dial--open',
          tooltipHover && 'mtx-speed-dial--tooltip-hover',
          position && `mtx-speed-dial--${position}`,
          className,
        )}
        {...rest}
        onKeyDown={handleKeyDown}
        onMouseEnter={onMouseEnter}
        onPointerEnter={handlePointerEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Fab
          ref={fabRef}
          color={color}
          aria-label={ariaLabel ?? t('actions', null, 'Actions')}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={actionsId}
          {...fabRest}
          icon={fabIcon}
          className={cx(color === 'primary' && 'mtx-fab--primary', 'mtx-speed-dial__fab', fabClassName)}
          style={hiddenStyle || fabStyle ? { ...hiddenStyle, ...fabStyle } : undefined}
          onClick={handleFabClick}
        />
        <div
          ref={actionsRef}
          id={actionsId}
          className="mtx-speed-dial__actions"
          aria-hidden={open ? undefined : 'true'}
        >
          {actions.map((child, index) => (
            <SpeedDialActionIndexContext.Provider key={child.key ?? index} value={index}>
              {child}
            </SpeedDialActionIndexContext.Provider>
          ))}
        </div>
      </div>
    </SpeedDialContext.Provider>
  );
});
