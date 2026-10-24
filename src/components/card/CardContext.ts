'use client';
import { createContext, useContext } from 'react';

/** Alineación de una fila de acciones de tarjeta. */
export type CardActionsAlign = 'start' | 'center' | 'end' | 'between';

/** Valor compartido por una tarjeta con sus partes. */
export interface CardContextValue {
  /** Alineación por defecto de las `CardActions` de la tarjeta. */
  actionsAlign?: CardActionsAlign;
}

/** Contexto de la tarjeta más cercana (o `null` fuera de una). */
export const CardContext = createContext<CardContextValue | null>(null);

/**
 * Lee el contexto de la tarjeta contenedora.
 * @returns {CardContextValue|null} Contexto o `null`.
 */
export function useCardContext(): CardContextValue | null {
  return useContext(CardContext);
}
