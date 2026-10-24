'use client';
/**
 * Contexto que ToggleButtonGroup comparte con sus ToggleButton hijos.
 */
import { createContext } from 'react';
import type { MouseEvent } from 'react';

/** Tamaños: 40 / 48 / 56px. */
export type ToggleButtonSize = 'small' | 'medium' | 'large';
/** Color del estado seleccionado. */
export type ToggleButtonColor = 'standard' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Valores que el grupo propaga a sus botones. */
export interface ToggleButtonGroupContextValue {
  /** Tamaño heredado (el botón puede sobrescribirlo). */
  size?: ToggleButtonSize;
  /** Color heredado (el botón puede sobrescribirlo). */
  color?: ToggleButtonColor;
  /** Deshabilita todos los botones. */
  disabled: boolean;
  /**
   * Indica si un valor está seleccionado en el grupo.
   * @param {string} value Valor del botón.
   * @returns {boolean} `true` si está seleccionado.
   */
  isSelected: (value: string) => boolean;
  /**
   * Notifica el clic de un botón para que el grupo decida la selección.
   * @param {MouseEvent<HTMLButtonElement>} event Clic.
   * @param {string} value Valor del botón.
   */
  onButtonClick: (event: MouseEvent<HTMLButtonElement>, value: string) => void;
}

/** Contexto del grupo (null fuera de un ToggleButtonGroup). */
export const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | null>(null);
