'use client';
/**
 * Fab: botón de acción flotante circular o extendido (port de `fab.js` de Materix UI vanilla).
 */
import { forwardRef } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/fab.css';
import { cx, useRipple } from '../../core';

/** Tamaños: large 56px (por defecto), medium 48px y small 40px; extendido 48/40/34px. */
export type FabSize = 'small' | 'medium' | 'large';

/** Color de la paleta; `default` es una superficie neutra con borde. */
export type FabColor = 'primary' | 'secondary' | 'default' | 'error' | 'warning' | 'info' | 'success' | 'inherit';

/** Variante: circular (solo icono) o extendida (con texto). */
export type FabVariant = 'circular' | 'extended';

/** Posiciones utilitarias de vanilla (`mtx-fab--fixed-br`, `--fixed-bl`, `--absolute-center`). */
export type FabPosition = 'fixed-br' | 'fixed-bl' | 'absolute-center';

/** Propiedades de {@link Fab}. */
export interface FabProps
  extends Omit<ButtonHTMLAttributes<HTMLElement>, 'color'>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'download' | 'hrefLang'> {
  /** Icono inicial: nombre de Material Icons (`"add"`) o un nodo (SVG…). */
  icon?: ReactNode;
  /** Texto del FAB; lo convierte en extendido. */
  label?: ReactNode;
  /** Variante; con `label` siempre es `extended`. */
  variant?: FabVariant;
  /** Tamaño. */
  size?: FabSize;
  /** Color. */
  color?: FabColor;
  /** Posición fija o centrada sobre el borde del contenedor. */
  position?: FabPosition;
  /** Deshabilita el FAB (`disabled` nativo o `aria-disabled` en enlaces). */
  disabled?: boolean;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
  /** Elemento raíz; por defecto `<button>`, o `<a>` si hay `href`. */
  component?: ElementType;
  /** Contenido adicional tras el icono y el texto. */
  children?: ReactNode;
}

/**
 * Renderiza el icono: un string se convierte en `<span class="material-icons" aria-hidden="true">`.
 * @param {ReactNode} icon Icono.
 * @returns {ReactNode} Nodo del icono.
 */
function renderMaterialIcon(icon: ReactNode): ReactNode {
  if (typeof icon === 'string') {
    return (
      <span className="material-icons" aria-hidden="true">
        {icon}
      </span>
    );
  }
  return icon;
}

/**
 * Botón de acción flotante. El circular requiere `aria-label` porque solo muestra un icono.
 */
export const Fab = forwardRef<HTMLElement, FabProps>(function Fab(props, ref) {
  const {
    icon,
    label,
    variant = 'circular',
    size = 'large',
    color = 'primary',
    position,
    disabled = false,
    disableRipple = false,
    component,
    className,
    children,
    type,
    href,
    tabIndex,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  const Tag: ElementType = component ?? (href ? 'a' : 'button');
  const isNativeButton = Tag === 'button';
  const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
  const extended = variant === 'extended' || hasLabel;
  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (disabled && !isNativeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  /** Encadena el manejador del ripple con el del usuario. */
  const chain =
    (own: (event: ReactPointerEvent<HTMLElement>) => void, user?: (event: ReactPointerEvent<HTMLElement>) => void) =>
    (event: ReactPointerEvent<HTMLElement>) => {
      user?.(event);
      own(event);
    };

  const nativeProps = isNativeButton
    ? { type: type ?? 'button', disabled, tabIndex }
    : {
        href,
        type,
        'aria-disabled': disabled ? true : undefined,
        tabIndex: disabled ? -1 : tabIndex,
      };

  return (
    <Tag
      ref={ref}
      className={cx(
        'mtx-fab',
        size !== 'large' && `mtx-fab--${size}`,
        color !== 'primary' && `mtx-fab--${color}`,
        extended && 'mtx-fab--extended',
        position && `mtx-fab--${position}`,
        className,
      )}
      {...nativeProps}
      {...rest}
      onClick={handleClick}
      onPointerDown={chain(ripple.handlers.onPointerDown, onPointerDown)}
      onPointerUp={chain(ripple.handlers.onPointerUp, onPointerUp)}
      onPointerLeave={chain(ripple.handlers.onPointerLeave, onPointerLeave)}
      onPointerCancel={chain(ripple.handlers.onPointerCancel, onPointerCancel)}
    >
      {renderMaterialIcon(icon)}
      {hasLabel ? <span>{label}</span> : null}
      {children}
      {ripple.element}
    </Tag>
  );
});
