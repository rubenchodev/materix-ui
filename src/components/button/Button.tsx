'use client';
/**
 * Botón de Materix UI (`Button` de MUI): variantes, colores, tamaños, iconos, carga y ripple.
 */
import { forwardRef, useContext } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ElementType,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/button.css';
import '@rubenchodev/materix-ui/components/progress.css';
import { cx, useRipple } from '../../core';
import { CircularProgress } from '../progress/CircularProgress';
import { ButtonGroupButtonContext, ButtonGroupContext } from '../button-group/ButtonGroupContext';

/** Variantes visuales. */
export type ButtonVariant = 'text' | 'outlined' | 'contained';
/** Colores de la paleta o `inherit`. */
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
/** Tamaños canónicos: 32 / 40 / 48px. */
export type ButtonSize = 'small' | 'medium' | 'large';
/** Posición del indicador de carga. */
export type ButtonLoadingPosition = 'center' | 'start' | 'end';
/** Superficie de color sobre la que se coloca el botón. */
export type ButtonSurface = 'primary' | 'secondary';

/** Props propias de {@link Button}. */
export interface ButtonOwnProps {
  /** Variante: `text` (por defecto), `outlined` o `contained`. */
  variant?: ButtonVariant;
  /** Color de la paleta (`primary` por defecto) o `inherit`. */
  color?: ButtonColor;
  /** Tamaño: `small` 32px, `medium` 40px (por defecto) o `large` 48px. */
  size?: ButtonSize;
  /** Deshabilita el botón (`disabled` nativo o `aria-disabled` en enlaces). */
  disabled?: boolean;
  /** Ocupa el 100% del contenedor. */
  fullWidth?: boolean;
  /** Quita la sombra de la variante contained. */
  disableElevation?: boolean;
  /** Texto en mayúsculas (estilo MD2). */
  uppercase?: boolean;
  /** Botón cuadrado de solo icono (`mtx-button--icon`); requiere `aria-label`. */
  iconOnly?: boolean;
  /** Adapta el botón a un fondo `primary` o `secondary`. */
  surface?: ButtonSurface;
  /** Icono inicial: nombre de Material Icons o un nodo. */
  startIcon?: ReactNode;
  /** Icono final: nombre de Material Icons o un nodo. */
  endIcon?: ReactNode;
  /** Estado de carga: deshabilita, marca `aria-busy` y muestra el indicador. */
  loading?: boolean;
  /** Posición del indicador: `center` (por defecto), `start` o `end`. */
  loadingPosition?: ButtonLoadingPosition;
  /** Indicador alternativo: un texto o un nodo en lugar del spinner. */
  loadingIndicator?: ReactNode;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
  /** URL: renderiza un `<a>`. */
  href?: string;
  children?: ReactNode;
  className?: string;
}

type DefaultRootProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonHTMLAttributes<HTMLButtonElement>>;

/** Props de {@link Button}; `component` cambia el elemento raíz. */
export type ButtonProps<C extends ElementType = 'button'> = ButtonOwnProps & {
  /** Elemento o componente raíz (por defecto `button`, o `a` con `href`). */
  component?: C;
} & Omit<C extends 'button' ? DefaultRootProps : ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | 'component'>;

/** Firma polimórfica del Button. */
export interface ButtonComponent {
  <C extends ElementType = 'button'>(props: ButtonProps<C> & { ref?: Ref<HTMLElement> }): ReactElement | null;
  displayName?: string;
}

const LOADING_POSITIONS: readonly ButtonLoadingPosition[] = ['center', 'start', 'end'];

/**
 * Renderiza un icono del botón (ligadura Material si es texto).
 * @param {ReactNode} icon Icono.
 * @param {'start'|'end'} side Extremo.
 * @param {boolean} hidden Oculto por el indicador de carga.
 * @returns {ReactNode} Icono envuelto.
 */
function renderIcon(icon: ReactNode, side: 'start' | 'end', hidden: boolean): ReactNode {
  if (icon === undefined || icon === null || icon === false || icon === '') return null;
  const isName = typeof icon === 'string';
  return (
    <span
      className={cx(
        'mtx-button__icon',
        `mtx-button__icon--${side}`,
        isName && 'material-icons',
        hidden && 'mtx-button__icon--loading-hidden',
      )}
      aria-hidden="true"
    >
      {isName ? icon.trim() : icon}
    </span>
  );
}

type InnerProps = ButtonOwnProps & { component?: ElementType } & Omit<DefaultRootProps, keyof ButtonOwnProps>;

const ButtonInner = forwardRef<HTMLElement, InnerProps>(function Button(props, ref) {
  const group = useContext(ButtonGroupContext);
  const positionClass = useContext(ButtonGroupButtonContext);
  const {
    variant = group?.variant ?? 'text',
    color = group?.color ?? 'primary',
    size = group?.size ?? 'medium',
    disabled: disabledProp = false,
    fullWidth = group?.fullWidth ?? false,
    disableElevation = group?.disableElevation ?? false,
    uppercase = false,
    iconOnly = false,
    surface,
    startIcon,
    endIcon,
    loading = false,
    loadingPosition: loadingPositionProp = 'center',
    loadingIndicator,
    disableRipple = false,
    href,
    component,
    className,
    children,
    type,
    tabIndex,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  const Component: ElementType = component ?? (href ? 'a' : 'button');
  const isNativeButton = Component === 'button';
  const isLink = Boolean(href) || Component === 'a';
  const disabled = Boolean(disabledProp || group?.disabled || loading);
  const loadingPosition = LOADING_POSITIONS.includes(loadingPositionProp) ? loadingPositionProp : 'center';

  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });

  const hasStart = startIcon !== undefined && startIcon !== null && startIcon !== false && startIcon !== '';
  const hasEnd = endIcon !== undefined && endIcon !== null && endIcon !== false && endIcon !== '';
  const hiddenSide = loading
    ? loadingPosition === 'start' && hasStart
      ? 'start'
      : loadingPosition === 'end' && hasEnd
        ? 'end'
        : null
    : null;

  let indicator: ReactNode = null;
  if (loading) {
    const isText = typeof loadingIndicator === 'string' || typeof loadingIndicator === 'number';
    const hasCustom = loadingIndicator !== undefined && loadingIndicator !== null && loadingIndicator !== false;
    indicator = (
      <span
        className={cx(
          'mtx-button__loading-indicator',
          `mtx-button__loading-indicator--${loadingPosition}`,
          isText && 'mtx-button__loading-indicator--text',
          hiddenSide && `mtx-button__icon--${hiddenSide}`,
        )}
        aria-hidden="true"
      >
        {hasCustom ? loadingIndicator : <CircularProgress size={16} thickness={3.6} color="inherit" decorative />}
      </span>
    );
  }

  /** Bloquea la acción de enlaces o roles deshabilitados. */
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled && !isNativeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    (onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };

  /** Activa con teclado los elementos sin semántica de botón ni enlace. */
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    (onKeyDown as ((e: KeyboardEvent<HTMLElement>) => void) | undefined)?.(event);
    if (event.defaultPrevented || isNativeButton || isLink || disabled) return;
    if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const compose =
    (user: unknown, own: (event: PointerEvent<HTMLElement>) => void) => (event: PointerEvent<HTMLElement>) => {
      (user as ((e: PointerEvent<HTMLElement>) => void) | undefined)?.(event);
      own(event);
    };

  const rootProps: Record<string, unknown> = {};
  if (isNativeButton) {
    rootProps.type = type ?? 'button';
    rootProps.disabled = disabled;
    rootProps.tabIndex = tabIndex;
  } else {
    if (href) rootProps.href = href;
    if (!isLink) rootProps.role = 'button';
    if (disabled) {
      rootProps['aria-disabled'] = true;
      rootProps.tabIndex = -1;
    } else {
      rootProps.tabIndex = tabIndex ?? (isLink ? undefined : 0);
    }
  }
  if (loading) rootProps['aria-busy'] = true;

  return (
    <Component
      ref={ref}
      className={cx(
        'mtx-button',
        `mtx-button--${variant}`,
        size !== 'medium' && `mtx-button--${size}`,
        color !== 'primary' && `mtx-button--${color}`,
        surface && (surface === 'primary' || surface === 'secondary') && `mtx-button--on-${surface}`,
        fullWidth && 'mtx-button--full-width',
        disableElevation && 'mtx-button--disable-elevation',
        uppercase && 'mtx-button--uppercase',
        iconOnly && 'mtx-button--icon',
        loading && 'mtx-button--loading',
        loading && `mtx-button--loading-${loadingPosition}`,
        group && 'mtx-button-group__grouped',
        positionClass,
        className,
      )}
      {...rootProps}
      {...rest}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={compose(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={compose(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={compose(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={compose(onPointerCancel, ripple.handlers.onPointerCancel)}
    >
      {loading && loadingPosition === 'start' ? indicator : null}
      {renderIcon(startIcon, 'start', hiddenSide === 'start')}
      {children}
      {renderIcon(endIcon, 'end', hiddenSide === 'end')}
      {loading && loadingPosition !== 'start' ? indicator : null}
      {ripple.element}
    </Component>
  );
});

/**
 * Botón de acción con variantes `text`/`outlined`/`contained`, iconos, carga y ripple.
 * Con `href` renderiza un `<a>`; con `component`, cualquier elemento o componente.
 */
export const Button = ButtonInner as unknown as ButtonComponent;
Button.displayName = 'Button';
