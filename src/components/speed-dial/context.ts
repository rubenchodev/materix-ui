'use client';
/**
 * Contextos internos de SpeedDial: estado compartido con acciones e icono.
 */
import { createContext, useContext } from 'react';

/** Dirección de despliegue de las acciones. */
export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';

/** Estado del SpeedDial visible para sus hijos. */
export interface SpeedDialContextValue {
  /** Abierto (y no oculto). */
  open: boolean;
  /** Dirección de despliegue. */
  direction: SpeedDialDirection;
  /** Etiquetas como Tooltip en hover/foco en lugar de persistentes (`data-tooltip-hover`). */
  tooltipHover: boolean;
}

/** Contexto del SpeedDial (`null` fuera de él). */
export const SpeedDialContext = createContext<SpeedDialContextValue | null>(null);

/** Posición de la acción entre sus hermanas (para el retardo escalonado). */
export const SpeedDialActionIndexContext = createContext<number>(-1);

/**
 * Lee el contexto del SpeedDial.
 * @returns {SpeedDialContextValue|null} Estado o `null` fuera de un SpeedDial.
 */
export function useSpeedDialContext(): SpeedDialContextValue | null {
  return useContext(SpeedDialContext);
}
