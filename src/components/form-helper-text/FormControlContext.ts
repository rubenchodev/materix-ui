'use client';
/**
 * Contexto compartido de FormControl: estado de error, deshabilitado y requerido, más los ids de los
 * textos de ayuda registrados. Lo consumen Checkbox, Switch, RadioGroup y TextField.
 *
 * Uso desde un control (TextField, Select…):
 * ```tsx
 * const fc = useFormControl();
 * const error = props.error ?? fc?.error ?? false;
 * const describedBy = [props['aria-describedby'], ...(fc?.helperTextIds ?? [])];
 * ```
 */
import { createContext, useContext } from 'react';

/** Valor de {@link FormControlContext}. */
export interface FormControlState {
  /** Estado de error del grupo (`.mtx-form-control--error`). */
  error: boolean;
  /** Estado deshabilitado del grupo (`.mtx-form-control--disabled`). */
  disabled: boolean;
  /** Indica que el control es obligatorio. */
  required: boolean;
  /** Ids de los FormHelperText con contenido dentro del FormControl (para `aria-describedby`). */
  helperTextIds: string[];
  /**
   * Registra el id de un FormHelperText; devuelve la función que lo retira.
   * @param {string} id Id del texto de ayuda.
   * @returns {Function} Desregistro.
   */
  registerHelperText: (id: string) => () => void;
}

/** Contexto de FormControl (`undefined` fuera de un FormControl). */
export const FormControlContext = createContext<FormControlState | undefined>(undefined);
FormControlContext.displayName = 'MtxFormControlContext';

/**
 * Devuelve el estado del FormControl más cercano o `undefined` si no hay ninguno.
 * @returns {FormControlState|undefined} Estado del contexto.
 */
export function useFormControl(): FormControlState | undefined {
  return useContext(FormControlContext);
}
