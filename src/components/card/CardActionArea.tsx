'use client';
import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx, useRipple } from '../../core';
import { composePointerHandlers } from './utils';

/** Propiedades propias de {@link CardActionArea}. */
export interface CardActionAreaOwnProps {
  /** Deshabilita el área (`disabled`/`aria-disabled`, sin foco ni clic). */
  disabled?: boolean;
  /** Con `href` el área se renderiza como `<a>`. */
  href?: string;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
}

/** Propiedades de {@link CardActionArea}; `component` cambia la etiqueta (por defecto `button`, o `a` con `href`). */
export type CardActionAreaProps<C extends ElementType = 'button'> = CardActionAreaOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof CardActionAreaOwnProps | 'component'>;

type CardActionAreaComponent = (<C extends ElementType = 'button'>(
  props: CardActionAreaProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Zona interactiva principal de una tarjeta con ripple, hover y foco (`.mtx-card-action-area`).
 */
export const CardActionArea = forwardRef(function CardActionArea(
  {
    component,
    disabled = false,
    href,
    disableRipple = false,
    className,
    children,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  }: CardActionAreaProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? (href ? 'a' : 'button');
  const isButton = Root === 'button';
  const isAnchor = Root === 'a';
  const nativeInteractive = isButton || isAnchor;
  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });
  const props = rest as Record<string, unknown>;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || nativeInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const extra: Record<string, unknown> = {};
  if (isButton) {
    extra.type = (props.type as string | undefined) ?? 'button';
    if (disabled) extra.disabled = true;
  }
  if (isAnchor && href !== undefined) extra.href = href;
  if (!nativeInteractive) extra.role = (props.role as string | undefined) ?? 'button';
  if (disabled) extra['aria-disabled'] = 'true';
  if (!isButton) {
    const userTabIndex = props.tabIndex as number | undefined;
    if (disabled) extra.tabIndex = -1;
    else if (!nativeInteractive) extra.tabIndex = userTabIndex ?? 0;
  }

  return (
    <Root
      ref={ref}
      {...rest}
      {...extra}
      className={cx('mtx-card-action-area', disabled && 'mtx-card-action-area--disabled', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...composePointerHandlers(ripple.handlers, { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel })}
    >
      {children}
      {ripple.element}
    </Root>
  );
}) as CardActionAreaComponent;

CardActionArea.displayName = 'CardActionArea';
