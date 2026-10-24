'use client';
/**
 * Contextos y tipos compartidos de Stepper, Step y sus partes.
 */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { TranslateFn } from '../../i18n';

/** Orientación del stepper. */
export type StepperOrientation = 'horizontal' | 'vertical';

/** Detalle del cambio de paso (equivale al `detail` de `mtx:stepper:change`). */
export interface StepperChangeDetail {
  /** Índice destino. */
  activeStep: number;
  /** Índice anterior. */
  previousStep: number;
  /** `true` si el cambio lo provoca `reset()`. */
  reset?: boolean;
  /** Cancela el cambio (igual que devolver `false`). */
  preventDefault: () => void;
  /** Indica si se canceló. */
  readonly defaultPrevented: boolean;
}

/** Callback de cambio cancelable: devolver `false` o llamar a `preventDefault()` lo impide. */
export type StepperChangeHandler = (activeStep: number, detail: StepperChangeDetail) => boolean | void;

/** API imperativa común de Stepper y MobileStepper. */
export interface StepperBaseApi {
  /** Índice activo (igual a `length` al terminar un Stepper). */
  readonly activeStep: number;
  /** Número de pasos. */
  readonly length: number;
  /** `true` si todos los pasos se han superado. */
  readonly finished: boolean;
  /** Último índice alcanzable (`length` en Stepper, `length - 1` en MobileStepper). */
  readonly maxStep: number;
  /** Avanza al siguiente paso habilitado. */
  next: () => boolean;
  /** Retrocede al paso habilitado anterior. */
  back: () => boolean;
  /** Activa un paso. */
  goTo: (index: number) => boolean;
  /** Vuelve al primer paso. */
  reset: () => boolean;
}

/** API imperativa del Stepper (`apiRef`). */
export interface StepperApi extends StepperBaseApi {
  /** Marca o desmarca un paso como completado. */
  setCompleted: (index: number, completed?: boolean) => void;
  /** Activa (`string`/`true`) o limpia (`false`) el error de un paso. */
  setError: (index: number, message: string | boolean | null) => void;
  /** Habilita o deshabilita un paso. */
  setDisabled: (index: number, disabled?: boolean) => void;
  /** Indica si un paso está completado. */
  isCompleted: (index: number) => boolean;
}

/** Estado resuelto de un paso. */
export interface StepState {
  index: number;
  active: boolean;
  completed: boolean;
  /** `false` sin error; `''` error sin mensaje; texto con mensaje. */
  error: string | false;
  /** Deshabilitado explícitamente (no activable). */
  disabled: boolean;
  /** Deshabilitado visualmente (explícito o futuro en modo lineal). */
  visuallyDisabled: boolean;
  expanded: boolean;
  last: boolean;
  optional: ReactNode;
  icon: ReactNode;
}

/** Valor del contexto del Stepper. */
export interface StepperContextValue {
  orientation: StepperOrientation;
  alternativeLabel: boolean;
  nonLinear: boolean;
  activeStep: number;
  length: number;
  t: TranslateFn;
  api: StepperApi;
  getState: (index: number) => StepState;
}

export const StepperContext = createContext<StepperContextValue | null>(null);
StepperContext.displayName = 'StepperContext';

/** Índice del paso actual (lo provee el Stepper alrededor de cada `Step`). */
export const StepIndexContext = createContext<number>(0);
StepIndexContext.displayName = 'StepIndexContext';

/** Estado del paso actual (lo provee `Step` a `StepLabel`, `StepContent`…). */
export const StepContext = createContext<StepState | null>(null);
StepContext.displayName = 'StepContext';

/**
 * Devuelve el contexto del Stepper más cercano (o `null` fuera de él).
 * @returns {StepperContextValue|null} Contexto.
 */
export function useStepperContext(): StepperContextValue | null {
  return useContext(StepperContext);
}

/**
 * Devuelve el estado del Step más cercano (o `null` fuera de él).
 * @returns {StepState|null} Estado del paso.
 */
export function useStepContext(): StepState | null {
  return useContext(StepContext);
}

/**
 * Crea el detalle cancelable de un cambio de paso.
 * @param {number} activeStep Destino.
 * @param {number} previousStep Anterior.
 * @param {boolean} [reset] Cambio por `reset()`.
 * @returns {StepperChangeDetail} Detalle.
 */
export function createChangeDetail(activeStep: number, previousStep: number, reset?: boolean): StepperChangeDetail {
  let prevented = false;
  const detail: StepperChangeDetail = {
    activeStep,
    previousStep,
    preventDefault: () => {
      prevented = true;
    },
    get defaultPrevented() {
      return prevented;
    },
  };
  if (reset) detail.reset = true;
  return detail;
}

/**
 * Ejecuta el callback cancelable y devuelve si el cambio está permitido.
 * @param {StepperChangeHandler} [handler] Callback.
 * @param {StepperChangeDetail} detail Detalle.
 * @returns {boolean} `true` si no se canceló.
 */
export function allowChange(handler: StepperChangeHandler | undefined, detail: StepperChangeDetail): boolean {
  if (!handler) return true;
  const result = handler(detail.activeStep, detail);
  return result !== false && !detail.defaultPrevented;
}
