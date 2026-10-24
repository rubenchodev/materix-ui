'use client';
/**
 * SpeedDialIcon: icono del FAB principal que rota 45° al abrir o cambia a `openIcon` (patrón MUI).
 */
import { forwardRef, useRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx, useEnhancedEffect, useForkRef, usePrefersReducedMotion } from '../../core';
import { useSpeedDialContext } from './context';

/** Propiedades de {@link SpeedDialIcon}. */
export interface SpeedDialIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Icono cerrado: nombre de Material Icons o nodo (SVG…). Por defecto `"add"`. */
  icon?: ReactNode;
  /** Icono mostrado al abrir; sin él, `icon` rota 45°. */
  openIcon?: ReactNode;
  /** Fuerza el estado (por defecto lo toma del SpeedDial). */
  open?: boolean;
}

const TRANSITION = 'transform var(--mtx-duration-short) var(--mtx-easing-standard), opacity var(--mtx-duration-short) var(--mtx-easing-standard)';

/**
 * Pinta un icono: un nombre se convierte en `<span class="material-icons">`.
 * @param {ReactNode} icon Icono.
 * @returns {ReactNode} Nodo.
 */
function renderIcon(icon: ReactNode): ReactNode {
  if (typeof icon === 'string') {
    return (
      <span className="material-icons" aria-hidden="true">
        {icon}
      </span>
    );
  }
  return icon;
}

/** Selector de los iconos que `speed-dial.css` rota al abrir. */
const ROTATED = '.material-icons, .material-symbols-outlined, svg';

/**
 * Icono del SpeedDial. Sin `openIcon` delega la rotación de 45° en `speed-dial.css`;
 * con `openIcon` el icono rota y se desvanece mientras aparece el de apertura.
 */
export const SpeedDialIcon = forwardRef<HTMLSpanElement, SpeedDialIconProps>(function SpeedDialIcon(props, ref) {
  const { icon = 'add', openIcon, open: openProp, className, style, ...rest } = props;
  const context = useSpeedDialContext();
  const open = openProp ?? context?.open ?? false;
  const reducedMotion = usePrefersReducedMotion();
  const transition = reducedMotion ? 'none' : TRANSITION;
  const rootRef = useRef<HTMLSpanElement>(null);
  const handleRef = useForkRef(rootRef, ref);
  const layered = openIcon !== undefined && openIcon !== null && openIcon !== false;

  // Con dos capas la rotación la aplican las capas: anula la de la hoja de estilos en los iconos internos.
  useEnhancedEffect(() => {
    if (!layered || !rootRef.current) return;
    rootRef.current.querySelectorAll<HTMLElement | SVGElement>(ROTATED).forEach((node) => {
      node.style.transform = 'none';
      node.style.transition = 'none';
    });
  });

  if (!layered) {
    if (typeof icon === 'string') {
      return (
        <span ref={handleRef} className={cx('material-icons', className)} aria-hidden="true" style={style} {...rest}>
          {icon}
        </span>
      );
    }
    return (
      <span ref={handleRef} className={cx('mtx-speed-dial__icon', className)} aria-hidden="true" style={{ display: 'inline-flex', ...style }} {...rest}>
        {icon}
      </span>
    );
  }

  const layer: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition };
  return (
    <span
      ref={handleRef}
      className={cx('mtx-speed-dial__icon', open && 'mtx-speed-dial__icon--open', className)}
      aria-hidden="true"
      style={{ position: 'relative', display: 'inline-flex', width: 24, height: 24, ...style }}
      {...rest}
    >
      <span
        className="mtx-speed-dial__icon-closed"
        style={{ ...layer, transform: open ? 'rotate(45deg)' : 'none', opacity: open ? 0 : 1 }}
      >
        {renderIcon(icon)}
      </span>
      <span
        className="mtx-speed-dial__icon-open"
        style={{ ...layer, position: 'absolute', inset: 0, transform: open ? 'none' : 'rotate(-45deg)', opacity: open ? 1 : 0 }}
      >
        {renderIcon(openIcon)}
      </span>
    </span>
  );
});
