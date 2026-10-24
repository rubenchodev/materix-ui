'use client';
/**
 * Contextos compartidos por Accordion, sus partes y AccordionGroup.
 */
import { createContext, useContext } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode, Ref, SyntheticEvent } from 'react';

/** Variante de superficie del acordeón. */
export type AccordionVariant = 'elevation' | 'outlined';

/** Estilo del resumen: `emphasized` (Materix, por defecto) o `plain` (MUI plano). */
export type AccordionSummaryStyle = 'emphasized' | 'plain';

/** Elevaciones admitidas por el CSS del acordeón. */
export type AccordionElevation = 0 | 1 | 2 | 3 | 4 | 6 | 8;

/** Opciones que un panel hereda de su grupo cuando no las declara. */
export interface AccordionInheritedOptions {
  variant?: AccordionVariant;
  elevation?: AccordionElevation;
  square?: boolean;
  disableGutters?: boolean;
  summaryStyle?: AccordionSummaryStyle;
}

/** Panel registrado en un grupo. */
export interface AccordionGroupItem {
  key: string;
  getSummary: () => HTMLElement | null;
  isDisabled: () => boolean;
  isExpanded: () => boolean;
  setExpanded: (expanded: boolean, event: SyntheticEvent | null) => void;
}

/** Valor del contexto de AccordionGroup. */
export interface AccordionGroupContextValue extends AccordionInheritedOptions {
  exclusive: boolean;
  /** Registra un panel; devuelve la función para darlo de baja. */
  register: (item: AccordionGroupItem) => () => void;
  /** Reserva el estado abierto inicial (solo el primer panel lo obtiene si el grupo es exclusivo). */
  claimInitial: (key: string) => boolean;
  /** Cierra los demás paneles (grupo exclusivo). */
  notifyExpand: (key: string, event: SyntheticEvent | null) => void;
  /** Mueve el foco entre resúmenes (flechas, Home y End). */
  focusSibling: (key: string, navKey: string) => boolean;
}

export const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(null);

/** Valor del contexto de un Accordion para sus partes. */
export interface AccordionContextValue {
  expanded: boolean;
  disabled: boolean;
  isDetails: boolean;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
  expandIcon: ReactNode;
  ripple: boolean;
  summaryId: string;
  regionId: string;
  summaryRef: Ref<HTMLElement>;
  onSummaryClick: (event: MouseEvent<HTMLElement>) => void;
  onSummaryKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Devuelve el contexto del Accordion padre.
 * @param {string} part Nombre de la parte (para el mensaje de error).
 * @returns {AccordionContextValue} Contexto.
 * @throws {Error} Si la parte se usa fuera de un Accordion.
 */
export function useAccordionContext(part: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error(`Materix: <${part}> must be used inside <Accordion>.`);
  return ctx;
}
