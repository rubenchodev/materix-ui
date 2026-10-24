'use client';
/**
 * Contexto interno del Dialog: ids accesibles, registro de título/descripción y alineación de acciones.
 */
import { createContext } from 'react';

/** Alineación de {@link DialogActions}: `end` por defecto (MUI). */
export type DialogActionsAlign = 'start' | 'center' | 'end' | 'between';

/** Valor del contexto del diálogo. */
export interface DialogContextValue {
  /** Id base para generar los ids del título y la descripción. */
  baseId: string;
  /** Registra un título; devuelve la función que lo retira. */
  registerTitle: (id: string) => () => void;
  /** Registra un texto descriptivo; devuelve la función que lo retira. */
  registerDescription: (id: string) => () => void;
  /** Alineación heredada por las acciones sin `align` propio. */
  actionsAlign?: DialogActionsAlign;
}

/** Contexto compartido por las piezas del diálogo (`null` fuera de un Dialog). */
export const DialogContext = createContext<DialogContextValue | null>(null);
