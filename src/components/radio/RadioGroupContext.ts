'use client';
import { createContext, useContext } from 'react';
import type { ChangeEvent } from 'react';

/** Valor de {@link RadioGroupContext}. */
export interface RadioGroupState {
  /** Nombre compartido por los radios del grupo. */
  name: string;
  /** Valor seleccionado en modo controlado (`null` = ninguno; `undefined` = grupo no controlado). */
  value: string | null | undefined;
  /** Valor inicial en modo no controlado (los radios usan `defaultChecked` y el reset nativo funciona). */
  defaultValue: string | null;
  /** Deshabilita todos los radios del grupo. */
  disabled: boolean;
  /**
   * Notifica la selección de un radio.
   * @param {ChangeEvent} event Evento nativo.
   * @param {string} value Valor del radio seleccionado.
   */
  onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}

/** Contexto de RadioGroup (`undefined` fuera de un grupo). */
export const RadioGroupContext = createContext<RadioGroupState | undefined>(undefined);
RadioGroupContext.displayName = 'MtxRadioGroupContext';

/**
 * Devuelve el estado del RadioGroup más cercano o `undefined`.
 * @returns {RadioGroupState|undefined} Estado del grupo.
 */
export function useRadioGroup(): RadioGroupState | undefined {
  return useContext(RadioGroupContext);
}
