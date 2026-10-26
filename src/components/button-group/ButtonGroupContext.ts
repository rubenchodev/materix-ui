'use client';
/**
 * Contextos que ButtonGroup comparte con sus Button hijos.
 * @internal No forman parte de la API pública.
 */
import { createContext } from 'react';

/** Valores heredados del grupo. */
export interface ButtonGroupContextValue {
  variant: 'text' | 'outlined' | 'contained';
  /** Solo se hereda si no es `medium`. */
  size?: 'small' | 'large';
  /** Solo se hereda si no es `primary`. */
  color?: 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  fullWidth: boolean;
  disableElevation: boolean;
  disabled: boolean;
}

/** Contexto del grupo (null fuera de un ButtonGroup). */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/** Clases de posición del botón dentro del grupo (`mtx-button-group__first`…). */
export const ButtonGroupButtonContext = createContext<string | undefined>(undefined);
