'use client';
/**
 * Stepper (Stepper de MUI): horizontal, vertical, etiqueta alternativa y modo no lineal.
 */
import { Children, forwardRef, isValidElement, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { OlHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import '@rubenchodev/materix-ui/components/stepper.css';
import { cx, useControlled, useEventCallback } from '../../core';
import { useT } from '../../i18n';
import { allowChange, createChangeDetail, StepIndexContext, StepperContext } from './context';
import type {
  StepperApi,
  StepperChangeHandler,
  StepperContextValue,
  StepperOrientation,
  StepState,
} from './context';
import { Step } from './Step';
import type { StepOwnProps, StepProps } from './Step';

/** Definición de un paso para la prop `steps`: texto (etiqueta) u objeto con props de `Step`. */
export type StepDefinition = string | (StepOwnProps & { content?: ReactNode; key?: string | number });

/** Props de {@link Stepper}. */
export interface StepperProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** Paso activo controlado (índice desde 0; igual al número de pasos al terminar). */
  activeStep?: number;
  /** Paso activo inicial no controlado. */
  defaultActiveStep?: number;
  /** Cambio de paso cancelable (`mtx:stepper:change`): devolver `false` lo impide. */
  onChange?: StepperChangeHandler;
  /** Orientación (`horizontal` por defecto). */
  orientation?: StepperOrientation;
  /** Etiqueta bajo el icono (solo horizontal). */
  alternativeLabel?: boolean;
  /** Pasos clicables (StepButton) y completado no inferido del orden. */
  nonLinear?: boolean;
  /** Pasos como datos (sintaxis simplificada) en lugar de hijos `Step`. */
  steps?: StepDefinition[];
  /** Nombre accesible de la lista (`aria-label`). */
  label?: string;
  /** Idioma local de los textos. */
  locale?: string;
  /** API imperativa: next, back, goTo, reset, setCompleted, setError, setDisabled. */
  apiRef?: Ref<StepperApi>;
  children?: ReactNode;
}

/** Ajustes aplicados por la API imperativa (prevalecen sobre las props). */
interface StepOverride {
  /** `null` = inferido del orden. */
  completed?: boolean | null;
  error?: string | false;
  disabled?: boolean;
}

/**
 * Normaliza el error de las props.
 * @param {boolean|string} [error] Valor.
 * @returns {string|false} Error normalizado.
 */
function normalizeError(error: boolean | string | null | undefined): string | false {
  if (error === true) return '';
  if (typeof error === 'string') return error;
  return false;
}

/**
 * Acota el índice a [0, max].
 * @param {number} value Índice.
 * @param {number} max Máximo.
 * @returns {number} Índice válido.
 */
function clampIndex(value: number, max: number): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
}

/**
 * Lista de pasos (`<ol>`): estado lineal o no lineal, textos accesibles y API imperativa.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(props, ref) {
  const {
    activeStep: activeProp,
    defaultActiveStep = 0,
    onChange,
    orientation: orientationProp = 'horizontal',
    alternativeLabel: alternativeProp = false,
    nonLinear = false,
    steps,
    label,
    locale,
    apiRef,
    children,
    className,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const orientation: StepperOrientation = orientationProp === 'vertical' ? 'vertical' : 'horizontal';
  const alternativeLabel = orientation === 'horizontal' && alternativeProp;
  const t = useT('stepper', locale);

  // Pasos: desde `steps` o desde los hijos `Step`.
  const elements: ReactElement<StepProps>[] = steps
    ? steps.map((def, index) => {
        if (typeof def === 'string') return <Step key={index} label={def} />;
        const { content, key, ...stepProps } = def;
        return (
          <Step key={key ?? index} {...stepProps}>
            {content}
          </Step>
        );
      })
    : (Children.toArray(children).filter(isValidElement) as ReactElement<StepProps>[]);
  const metas: StepOwnProps[] = elements.map((element) => element.props);
  const length = metas.length;

  const [activeState, setActiveState] = useControlled<number>({
    controlled: activeProp,
    default: defaultActiveStep,
    name: 'Stepper',
    state: 'activeStep',
  });
  const active = clampIndex(activeState, length);
  const [overrides, setOverrides] = useState<Record<number, StepOverride>>({});

  // Refs para que la API imperativa lea siempre el estado más reciente.
  // En modo controlado solo el render (la prop) actualiza el índice activo.
  const isControlled = useRef(activeProp !== undefined).current;
  const activeRef = useRef(active);
  activeRef.current = active;
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const metasRef = useRef(metas);
  metasRef.current = metas;
  const nonLinearRef = useRef(nonLinear);
  nonLinearRef.current = nonLinear;

  const isDisabled = (index: number): boolean => {
    const override = overridesRef.current[index];
    if (override && override.disabled !== undefined) return override.disabled;
    return Boolean(metasRef.current[index]?.disabled);
  };
  const isCompleted = (index: number): boolean => {
    const meta = metasRef.current[index];
    if (!meta) return false;
    const override = overridesRef.current[index];
    const setting = override && override.completed !== undefined ? override.completed : meta.completed ?? null;
    if (setting !== null) return setting;
    return !nonLinearRef.current && index < activeRef.current;
  };
  const getError = (index: number): string | false => {
    const override = overridesRef.current[index];
    if (override && override.error !== undefined) return override.error;
    return normalizeError(metasRef.current[index]?.error);
  };
  const updateOverride = (index: number, patch: StepOverride) => {
    if (index < 0 || index >= metasRef.current.length) return;
    const next = { ...overridesRef.current, [index]: { ...overridesRef.current[index], ...patch } };
    overridesRef.current = next;
    setOverrides(next);
  };

  const goTo = useEventCallback((index: number): boolean => {
    const total = metasRef.current.length;
    const target = Math.round(Number(index));
    if (!Number.isFinite(target) || target < 0 || target > total) return false;
    const previous = activeRef.current;
    if (target === previous || (target < total && isDisabled(target))) return false;
    if (!allowChange(onChange, createChangeDetail(target, previous))) return false;
    if (!isControlled) activeRef.current = target;
    setActiveState(target);
    return true;
  });
  const next = useEventCallback((): boolean => {
    let index = activeRef.current + 1;
    while (index < metasRef.current.length && isDisabled(index)) index += 1;
    return goTo(index);
  });
  const back = useEventCallback((): boolean => {
    let index = activeRef.current - 1;
    while (index > 0 && isDisabled(index)) index -= 1;
    return goTo(index);
  });
  const reset = useEventCallback((): boolean => {
    const previous = activeRef.current;
    if (previous !== 0 && !allowChange(onChange, createChangeDetail(0, previous, true))) return false;
    const cleared: Record<number, StepOverride> = {};
    metasRef.current.forEach((_, index) => {
      cleared[index] = { ...overridesRef.current[index], completed: null, error: false };
    });
    overridesRef.current = cleared;
    setOverrides(cleared);
    if (!isControlled) activeRef.current = 0;
    setActiveState(0);
    return true;
  });
  const setCompleted = useEventCallback((index: number, completed = true) => {
    updateOverride(index, { completed: Boolean(completed) });
  });
  const setError = useEventCallback((index: number, message: string | boolean | null) => {
    const error = message === false || message === null || message === undefined ? false : message === true ? '' : String(message);
    updateOverride(index, { error });
  });
  const setDisabled = useEventCallback((index: number, disabled = true) => {
    updateOverride(index, { disabled: Boolean(disabled) });
  });
  const isCompletedApi = useEventCallback((index: number) => isCompleted(index));

  const api = useMemo<StepperApi>(
    () => ({
      get activeStep() {
        return activeRef.current;
      },
      get length() {
        return metasRef.current.length;
      },
      get finished() {
        return activeRef.current >= metasRef.current.length;
      },
      get maxStep() {
        return metasRef.current.length;
      },
      next,
      back,
      goTo,
      reset,
      setCompleted,
      setError,
      setDisabled,
      isCompleted: isCompletedApi,
    }),
    [next, back, goTo, reset, setCompleted, setError, setDisabled, isCompletedApi],
  );
  // Se renueva la identidad con cada cambio de estado para notificar a `useStepper`.
  useImperativeHandle(apiRef, () => descriptorsOf(api), [api, active, length, overrides]);

  const finished = active >= length;
  const context = useMemo<StepperContextValue>(() => {
    const getState = (index: number): StepState => {
      const meta = metas[index] ?? {};
      const isActive = index === active;
      const disabled = isDisabled(index);
      return {
        index,
        active: isActive,
        completed: isCompleted(index),
        error: getError(index),
        disabled,
        visuallyDisabled: disabled || (!nonLinear && index > active),
        expanded: isActive || Boolean(meta.expanded),
        last: index === length - 1,
        optional: meta.optional,
        icon: meta.icon,
      };
    };
    return { orientation, alternativeLabel, nonLinear, activeStep: active, length, t, api, getState };
    // `metas` cambia en cada render; el contexto también debe hacerlo para reflejar las props de los pasos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientation, alternativeLabel, nonLinear, active, length, t, api, overrides, metas]);

  return (
    <StepperContext.Provider value={context}>
      <ol
        ref={ref}
        className={cx(
          'mtx-stepper',
          `mtx-stepper--${orientation}`,
          alternativeLabel && 'mtx-stepper--alternative-label',
          nonLinear && 'mtx-stepper--non-linear',
          finished && 'mtx-stepper--finished',
          className,
        )}
        aria-label={ariaLabel ?? label}
        data-active-step={active}
        {...rest}
      >
        {elements.map((element, index) => (
          <StepIndexContext.Provider key={element.key ?? index} value={index}>
            {element}
          </StepIndexContext.Provider>
        ))}
      </ol>
    </StepperContext.Provider>
  );
});

/**
 * Copia una API conservando sus getters (nueva identidad, mismo comportamiento).
 * @param {T} source API original.
 * @returns {T} Copia con getters.
 */
function descriptorsOf<T extends object>(source: T): T {
  return Object.defineProperties({}, Object.getOwnPropertyDescriptors(source)) as T;
}
