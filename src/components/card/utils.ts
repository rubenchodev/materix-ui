import type { PointerEvent as ReactPointerEvent } from 'react';
import type { RippleHandlers } from '../../core';

/** Manejadores de puntero del usuario que se combinan con el ripple. */
export interface PointerHandlers {
  onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLElement>) => void;
}

/**
 * Combina los manejadores de puntero del usuario con los del ripple (primero los del usuario).
 * @param {RippleHandlers} ripple Manejadores de `useRipple`.
 * @param {PointerHandlers} user Manejadores recibidos por props.
 * @returns {Required<PointerHandlers>} Manejadores combinados.
 */
export function composePointerHandlers(
  ripple: RippleHandlers<HTMLElement>,
  user: PointerHandlers,
): Required<PointerHandlers> {
  return {
    onPointerDown: (event) => {
      user.onPointerDown?.(event);
      ripple.onPointerDown(event);
    },
    onPointerUp: (event) => {
      user.onPointerUp?.(event);
      ripple.onPointerUp(event);
    },
    onPointerLeave: (event) => {
      user.onPointerLeave?.(event);
      ripple.onPointerLeave(event);
    },
    onPointerCancel: (event) => {
      user.onPointerCancel?.(event);
      ripple.onPointerCancel(event);
    },
  };
}
