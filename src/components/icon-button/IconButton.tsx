'use client';
/**
 * IconButton: botón circular de solo icono (port de `icon-button.js` de Materix UI vanilla).
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
import '@rubenchodev/materix-ui/components/icon-button.css';
import { cx, useRipple } from '../../core';

/** Tamaños canónicos: small 32px, medium 40px (por defecto) y large 48px. */
export type IconButtonSize = 'small' | 'medium' | 'large';

/** Color del icono; `default` usa el gris de acción activa de MUI. */
export type IconButtonColor = 'default' | 'inherit' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Propiedades de {@link IconButton}. */
export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLElement>, 'color'>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'download' | 'hrefLang'> {
  /** Icono: nombre de Material Icons (`"search"`) o un nodo (SVG, Material Symbols…). Se ignora si hay `children`. */
  icon?: ReactNode;
  /** Tamaño del área táctil; el icono mantiene siempre su cuadrícula de 24px. */
  size?: IconButtonSize;
  /** Color del icono. */
  color?: IconButtonColor;
  /** Margen negativo de 12px para alinear el glifo con el borde del contenido. */
  edge?: 'start' | 'end' | false;
  /** Deshabilita el botón (`disabled` nativo o `aria-disabled` en enlaces). */
  disabled?: boolean;
  /** Desactiva el ripple centrado. */
  disableRipple?: boolean;
  /** Elemento raíz; por defecto `<button>`, o `<a>` si hay `href`. */
  component?: ElementType;
  /** Contenido propio (icono anidado); tiene prioridad sobre `icon`. */
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
 * Botón de solo icono con ripple centrado. Requiere `aria-label` (o `aria-labelledby`).
 */
export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(props, ref) {
  const {
    icon,
    size = 'medium',
    color = 'default',
    edge = false,
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
  const ripple = useRipple<HTMLElement>({ centered: true, disabled: disabled || disableRipple });

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
        'mtx-icon-button',
        size !== 'medium' && `mtx-icon-button--${size}`,
        color !== 'default' && `mtx-icon-button--${color}`,
        edge && `mtx-icon-button--edge-${edge}`,
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
      {children ?? renderMaterialIcon(icon)}
      {ripple.element}
    </Tag>
  );
});
