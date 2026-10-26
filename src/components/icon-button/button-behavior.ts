'use client';
/**
 * Comportamiento de botón compartido por IconButton y Fab cuando la raíz no es un `<button>` nativo.
 */
import type {
  AriaRole,
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';

/** Entradas de {@link getButtonBehavior}. */
export interface ButtonBehaviorOptions {
  /** Elemento raíz resuelto. */
  tag: ElementType;
  /** Deshabilitado. */
  disabled: boolean;
  /** `href` recibido. */
  href?: string;
  /** `to` recibido (enlaces de router). */
  to?: unknown;
  /** `type` recibido. */
  type?: string;
  /** `tabIndex` recibido. */
  tabIndex?: number;
  /** `role` recibido. */
  role?: AriaRole;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

/**
 * Calcula atributos y manejadores: `<button>` nativo, enlace (`href`/`to`) o botón ARIA
 * (`role="button"`, `tabIndex=0`, Enter en keydown y Espacio en keyup).
 * @param {ButtonBehaviorOptions} options Opciones.
 * @returns {Record<string, unknown>} Props para la raíz.
 */
export function getButtonBehavior(options: ButtonBehaviorOptions): Record<string, unknown> {
  const { tag, disabled, href, to, type, tabIndex, role, onClick, onKeyDown, onKeyUp } = options;
  const isNativeButton = tag === 'button';
  const isLink = !isNativeButton && (href != null || to != null);
  const isAriaButton = !isNativeButton && !isLink;

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (disabled && !isNativeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  if (isNativeButton) {
    return { type: type ?? 'button', disabled, tabIndex, role, onClick: handleClick, onKeyDown, onKeyUp };
  }

  const shared = {
    href,
    to,
    type,
    role: role ?? (isAriaButton ? 'button' : undefined),
    'aria-disabled': disabled ? true : undefined,
    tabIndex: disabled ? -1 : (tabIndex ?? (isAriaButton ? 0 : undefined)),
    onClick: handleClick,
  };
  if (!isAriaButton) return { ...shared, onKeyDown, onKeyUp };

  const isSelf = (event: ReactKeyboardEvent<HTMLElement>) => event.target === event.currentTarget;
  return {
    ...shared,
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || !isSelf(event)) return;
      if (event.key === ' ') event.preventDefault();
      else if (event.key === 'Enter') {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    onKeyUp: (event: ReactKeyboardEvent<HTMLElement>) => {
      onKeyUp?.(event);
      if (event.defaultPrevented || disabled || !isSelf(event)) return;
      if (event.key === ' ') event.currentTarget.click();
    },
  };
}
