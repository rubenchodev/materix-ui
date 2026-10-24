'use client';
/**
 * Grupo de botones con bordes unidos (`ButtonGroup` de MUI).
 */
import { Children, forwardRef, isValidElement, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/button.css';
import '@rubenchodev/materix-ui/components/button-group.css';
import { cx } from '../../core';
import { ButtonGroupButtonContext, ButtonGroupContext } from './ButtonGroupContext';
import type { ButtonGroupContextValue } from './ButtonGroupContext';

/** Props de {@link ButtonGroup}. */
export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Variante heredada por los botones: `outlined` (por defecto), `contained` o `text`. */
  variant?: 'text' | 'outlined' | 'contained';
  /** Tamaño heredado: `small`, `medium` (por defecto) o `large`. */
  size?: 'small' | 'medium' | 'large';
  /** Color heredado (`primary` por defecto) o `inherit`. */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  /** Orientación: `horizontal` (por defecto) o `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ocupa todo el ancho y reparte el espacio. */
  fullWidth?: boolean;
  /** Deshabilita todos los botones del grupo. */
  disabled?: boolean;
  /** Quita la sombra del grupo contained. */
  disableElevation?: boolean;
  /** Nombre accesible del grupo (`aria-label`). */
  label?: string;
  /** Botones del grupo. */
  children?: ReactNode;
}

const VARIANTS = ['contained', 'outlined', 'text'] as const;

/**
 * Agrupa botones relacionados; variante, tamaño, color, ancho completo y estado deshabilitado se
 * propagan a los `Button` hijos salvo que estos declaren los suyos.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(props, ref) {
  const {
    variant: variantProp = 'outlined',
    size = 'medium',
    color = 'primary',
    orientation = 'horizontal',
    fullWidth = false,
    disabled = false,
    disableElevation = false,
    label,
    className,
    children,
    role = 'group',
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const variant = VARIANTS.includes(variantProp) ? variantProp : 'outlined';
  const vertical = orientation === 'vertical';

  const context = useMemo<ButtonGroupContextValue>(
    () => ({
      variant,
      size: size === 'medium' ? undefined : size,
      color: color === 'primary' ? undefined : color,
      fullWidth,
      disableElevation,
      disabled,
    }),
    [variant, size, color, fullWidth, disableElevation, disabled],
  );

  const items = Children.toArray(children).filter(isValidElement);
  const positionOf = (index: number): string => {
    if (items.length === 1) return 'mtx-button-group__first mtx-button-group__last';
    if (index === 0) return 'mtx-button-group__first';
    if (index === items.length - 1) return 'mtx-button-group__last';
    return 'mtx-button-group__middle';
  };

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel ?? label}
      aria-disabled={disabled ? true : undefined}
      aria-orientation={vertical && role === 'toolbar' ? 'vertical' : undefined}
      className={cx(
        'mtx-button-group',
        `mtx-button-group--${variant}`,
        `mtx-button-group--${vertical ? 'vertical' : 'horizontal'}`,
        color !== 'primary' && `mtx-button-group--${color}`,
        size !== 'medium' && `mtx-button-group--${size}`,
        fullWidth && 'mtx-button-group--full-width',
        disableElevation && 'mtx-button-group--disable-elevation',
        disabled && 'mtx-button-group--disabled',
        className,
      )}
      {...rest}
    >
      <ButtonGroupContext.Provider value={context}>
        {items.map((child, index) => (
          <ButtonGroupButtonContext.Provider key={child.key ?? index} value={positionOf(index)}>
            {child}
          </ButtonGroupButtonContext.Provider>
        ))}
      </ButtonGroupContext.Provider>
    </div>
  );
});
