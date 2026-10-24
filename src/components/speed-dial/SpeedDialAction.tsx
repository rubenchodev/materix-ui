'use client';
/**
 * SpeedDialAction: FAB pequeño de una acción del SpeedDial con etiqueta persistente o Tooltip.
 */
import { forwardRef, useContext, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../core';
import type { Placement } from '../../core';
import { Fab } from '../fab';
import type { FabColor, FabProps } from '../fab';
import { Tooltip } from '../tooltip';
import type { TooltipActions, TooltipProps } from '../tooltip';
import { SpeedDialActionIndexContext, useSpeedDialContext } from './context';

/** Acciones con retardo escalonado definido en `speed-dial.css` (`nth-child(1..5)`). */
const CSS_STAGGERED = 5;
/** Paso del retardo escalonado de vanilla (ms). */
export const SPEED_DIAL_STAGGER = 30;

/** Propiedades de {@link SpeedDialAction}. */
export interface SpeedDialActionProps extends Omit<FabProps, 'size' | 'variant' | 'label' | 'position' | 'color'> {
  /** Icono de la acción: nombre de Material Icons o nodo. */
  icon?: ReactNode;
  /** Etiqueta de la acción; también su `aria-label` si no tiene uno. */
  tooltipTitle?: ReactNode;
  /** Colocación del Tooltip (modo hover); por defecto `left` en vertical y `top` en horizontal. */
  tooltipPlacement?: Placement;
  /** Etiqueta persistente visible mientras está abierto; por defecto `true` salvo `tooltipHover` en el SpeedDial. */
  tooltipOpen?: boolean;
  /** Color del FAB de la acción. */
  color?: FabColor;
  /** Props extra del Tooltip (modo hover). */
  TooltipProps?: Partial<Omit<TooltipProps, 'children' | 'title'>>;
}

/**
 * Acción del SpeedDial: `<button class="mtx-fab mtx-fab--small mtx-speed-dial__action">`,
 * envuelta en `mtx-speed-dial__action-wrapper` cuando tiene `tooltipTitle`.
 */
export const SpeedDialAction = forwardRef<HTMLElement, SpeedDialActionProps>(function SpeedDialAction(props, ref) {
  const {
    icon,
    tooltipTitle,
    tooltipPlacement,
    tooltipOpen: tooltipOpenProp,
    color = 'secondary',
    TooltipProps: tooltipProps,
    className,
    tabIndex,
    'aria-label': ariaLabelProp,
    ...rest
  } = props;
  const context = useSpeedDialContext();
  const index = useContext(SpeedDialActionIndexContext);
  const open = context?.open ?? true;
  const direction = context?.direction ?? 'up';
  const tooltipOpen = tooltipOpenProp ?? !(context?.tooltipHover ?? false);
  const tooltipActions = useRef<TooltipActions>(null);

  const hasTitle = tooltipTitle !== undefined && tooltipTitle !== null && tooltipTitle !== false && tooltipTitle !== '';
  const ariaLabel =
    ariaLabelProp ?? (typeof tooltipTitle === 'string' || typeof tooltipTitle === 'number' ? String(tooltipTitle) : undefined);

  // Al cerrar el SpeedDial se ocultan los Tooltip de sus acciones (vanilla: tooltip.hide).
  useEffect(() => {
    if (!open) tooltipActions.current?.close({ immediate: true });
  }, [open]);

  const fab = (
    <Fab
      ref={ref}
      size="small"
      color={color}
      icon={icon}
      className={cx('mtx-speed-dial__action', className)}
      aria-label={ariaLabel}
      tabIndex={open ? tabIndex : -1}
      {...rest}
    />
  );

  if (!hasTitle) return fab;

  // Más de 5 acciones: prolonga el escalonado de la hoja de estilos.
  const wrapperStyle: CSSProperties | undefined =
    open && index >= CSS_STAGGERED ? { transitionDelay: `${(index + 1) * SPEED_DIAL_STAGGER}ms` } : undefined;
  const placement: Placement = tooltipPlacement ?? (direction === 'left' || direction === 'right' ? 'top' : 'left');

  return (
    <div className="mtx-speed-dial__action-wrapper" style={wrapperStyle}>
      {tooltipOpen ? (
        <>
          <span className="mtx-speed-dial__tooltip" aria-hidden="true">
            {tooltipTitle}
          </span>
          {fab}
        </>
      ) : (
        <Tooltip title={tooltipTitle} placement={placement} action={tooltipActions} {...tooltipProps}>
          {fab}
        </Tooltip>
      )}
    </div>
  );
});
