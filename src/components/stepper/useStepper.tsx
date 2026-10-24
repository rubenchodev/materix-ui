'use client';
/**
 * Controlador de un Stepper o MobileStepper desde fuera (acciones y paneles declarativos).
 */
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Button } from '../button/Button';
import type { ButtonProps } from '../button/Button';
import { useStepperContext } from './context';
import type { StepperApi, StepperBaseApi } from './context';

/** Instantánea del estado observado. */
interface StepperSnapshot {
  activeStep: number;
  length: number;
  finished: boolean;
  maxStep: number;
}

/** Controlador devuelto por {@link useStepper}. */
export interface StepperController extends StepperSnapshot {
  /** Ref que se pasa como `apiRef` al Stepper o MobileStepper. */
  apiRef: (api: StepperApi | StepperBaseApi | null) => void;
  /** `true` si se puede retroceder. */
  canBack: boolean;
  /** `true` si se puede avanzar. */
  canNext: boolean;
  /** API imperativa enlazada (o `null` antes de montar). */
  readonly api: StepperApi | StepperBaseApi | null;
  next: () => boolean;
  back: () => boolean;
  goTo: (index: number) => boolean;
  reset: () => boolean;
  setCompleted: (index: number, completed?: boolean) => void;
  setError: (index: number, message: string | boolean | null) => void;
  setDisabled: (index: number, disabled?: boolean) => void;
  isCompleted: (index: number) => boolean;
}

const EMPTY: StepperSnapshot = { activeStep: 0, length: 0, finished: false, maxStep: 0 };

/**
 * Enlaza un Stepper o MobileStepper (vía `apiRef`) y expone su estado y acciones para botones y paneles externos.
 * @returns {StepperController} Controlador.
 */
export function useStepper(): StepperController {
  const apiStore = useRef<StepperApi | StepperBaseApi | null>(null);
  const [snapshot, setSnapshot] = useState<StepperSnapshot>(EMPTY);

  const apiRef = useCallback((api: StepperApi | StepperBaseApi | null) => {
    if (!api) return;
    apiStore.current = api;
    const next: StepperSnapshot = {
      activeStep: api.activeStep,
      length: api.length,
      finished: api.finished,
      maxStep: api.maxStep,
    };
    setSnapshot((prev) =>
      prev.activeStep === next.activeStep &&
      prev.length === next.length &&
      prev.finished === next.finished &&
      prev.maxStep === next.maxStep
        ? prev
        : next,
    );
  }, []);

  const actions = useMemo(() => {
    const full = () => apiStore.current as Partial<StepperApi> | null;
    return {
      next: () => apiStore.current?.next() ?? false,
      back: () => apiStore.current?.back() ?? false,
      goTo: (index: number) => apiStore.current?.goTo(index) ?? false,
      reset: () => apiStore.current?.reset() ?? false,
      setCompleted: (index: number, completed?: boolean) => full()?.setCompleted?.(index, completed),
      setError: (index: number, message: string | boolean | null) => full()?.setError?.(index, message),
      setDisabled: (index: number, disabled?: boolean) => full()?.setDisabled?.(index, disabled),
      isCompleted: (index: number) => full()?.isCompleted?.(index) ?? false,
    };
  }, []);

  return {
    ...snapshot,
    ...actions,
    apiRef,
    get api() {
      return apiStore.current;
    },
    canBack: snapshot.length > 0 && snapshot.activeStep > 0,
    canNext: snapshot.length > 0 && snapshot.activeStep < snapshot.maxStep,
  };
}

/** Acción declarativa de un {@link StepperButton}. */
export type StepperAction = 'next' | 'back' | 'reset';

/** Props de {@link StepperButton}. */
export type StepperButtonProps = ButtonProps<'button'> & {
  /** Acción: `next`, `back` o `reset` (equivale a `data-mtx-stepper-action`). */
  action: StepperAction;
  /** Stepper destino (fuera de él); dentro de un Stepper actúa sobre el suyo (equivale a `data-target`). */
  stepper?: StepperController;
  /** No se deshabilita en los extremos (equivale a `data-keep-enabled`). */
  keepEnabled?: boolean;
};

/**
 * Botón que navega el Stepper (`next`/`back`/`reset`) y se deshabilita en los extremos.
 */
export const StepperButton = forwardRef<HTMLElement, StepperButtonProps>(function StepperButton(
  { action, stepper, keepEnabled = false, disabled, onClick, ...rest },
  ref,
) {
  const context = useStepperContext();
  const target = stepper ?? (context ? { api: context.api, activeStep: context.activeStep, maxStep: context.length } : null);
  let auto = false;
  if (!keepEnabled && target) {
    if (action === 'back') auto = target.activeStep <= 0;
    if (action === 'next') auto = target.activeStep >= target.maxStep;
  }
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !target) return;
    const api = stepper ?? context?.api;
    api?.[action]();
  };
  return <Button ref={ref} {...rest} disabled={disabled || auto} onClick={handleClick} />;
});

/** Props de {@link StepPanel}. */
export interface StepPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlador del Stepper. */
  stepper: StepperController;
  /** Índice del paso cuyo panel es, o `finished` para el panel final (`data-finished-panel`). */
  index: number | 'finished';
  children?: ReactNode;
}

/**
 * Panel asociado a un paso (equivale a `data-panel`): visible solo con su paso activo.
 */
export const StepPanel = forwardRef<HTMLDivElement, StepPanelProps>(function StepPanel(
  { stepper, index, children, ...rest },
  ref,
) {
  const visible = index === 'finished' ? stepper.finished : !stepper.finished && stepper.activeStep === index;
  return (
    <div ref={ref} hidden={!visible} {...rest}>
      {children}
    </div>
  );
});
