'use client';
/**
 * Stepper móvil (MobileStepper de MUI): progreso compacto con botones Atrás/Siguiente.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import '@rubenchodev/materix-ui/components/stepper.css';
import { cx, useControlled, useEventCallback } from '../../core';
import { useT } from '../../i18n';
import { Button } from '../button/Button';
import { LinearProgress } from '../progress/LinearProgress';
import { allowChange, createChangeDetail } from './context';
import type { StepperBaseApi, StepperChangeHandler } from './context';

/** Indicador del stepper móvil. */
export type MobileStepperVariant = 'dots' | 'text' | 'progress';
/** Posición: en el flujo (`static`) o fija al borde del viewport. */
export type MobileStepperPosition = 'static' | 'bottom' | 'top';

/** Props de {@link MobileStepper}. */
export interface MobileStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Número total de pasos (≥ 1). */
  steps: number;
  /** Paso activo controlado (desde 0). */
  activeStep?: number;
  /** Paso activo inicial no controlado. */
  defaultActiveStep?: number;
  /** Cambio de paso cancelable: devolver `false` lo impide. */
  onChange?: StepperChangeHandler;
  /** Indicador: `dots` (por defecto), `text` o `progress`. */
  variant?: MobileStepperVariant;
  /** Posición (`static` por defecto). */
  position?: MobileStepperPosition;
  /** Botón Atrás propio; con la clase `mtx-mobile-stepper__back` retrocede al pulsarlo. */
  backButton?: ReactNode;
  /** Botón Siguiente propio; con la clase `mtx-mobile-stepper__next` avanza al pulsarlo. */
  nextButton?: ReactNode;
  /** Texto del botón Atrás generado (por defecto traducido). */
  backLabel?: string;
  /** Texto del botón Siguiente generado (por defecto traducido). */
  nextLabel?: string;
  /** Idioma local de los textos. */
  locale?: string;
  /** API imperativa: next, back, goTo y reset. */
  apiRef?: Ref<StepperBaseApi>;
}

/**
 * Stepper compacto con indicador `dots`, `text` o `progress` y estado accesible (`aria-live`).
 */
export const MobileStepper = forwardRef<HTMLDivElement, MobileStepperProps>(function MobileStepper(props, ref) {
  const {
    steps: stepsProp,
    activeStep: activeProp,
    defaultActiveStep = 0,
    onChange,
    variant: variantProp = 'dots',
    position: positionProp = 'static',
    backButton,
    nextButton,
    backLabel,
    nextLabel,
    locale,
    apiRef,
    className,
    onClick,
    ...rest
  } = props;
  const t = useT('stepper', locale);
  const variant: MobileStepperVariant = ['dots', 'text', 'progress'].includes(variantProp) ? variantProp : 'dots';
  const position: MobileStepperPosition = ['bottom', 'top', 'static'].includes(positionProp) ? positionProp : 'static';
  const total = Math.max(1, Math.round(Number(stepsProp)) || 1);

  const [activeState, setActiveState] = useControlled<number>({
    controlled: activeProp,
    default: defaultActiveStep,
    name: 'MobileStepper',
    state: 'activeStep',
  });
  const raw = Math.round(Number(activeState));
  const current = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), total - 1) : 0;
  // En modo controlado solo el render (la prop) actualiza el índice activo.
  const isControlled = useRef(activeProp !== undefined).current;
  const activeRef = useRef(current);
  activeRef.current = current;
  const totalRef = useRef(total);
  totalRef.current = total;

  const goTo = useEventCallback((index: number): boolean => {
    const target = Math.round(Number(index));
    if (!Number.isFinite(target) || target < 0 || target > totalRef.current - 1) return false;
    const previous = activeRef.current;
    if (target === previous) return false;
    if (!allowChange(onChange, createChangeDetail(target, previous))) return false;
    if (!isControlled) activeRef.current = target;
    setActiveState(target);
    return true;
  });
  const next = useEventCallback(() => goTo(activeRef.current + 1));
  const back = useEventCallback(() => goTo(activeRef.current - 1));
  const reset = useEventCallback(() => goTo(0));

  const api = useMemo<StepperBaseApi>(
    () => ({
      get activeStep() {
        return activeRef.current;
      },
      get length() {
        return totalRef.current;
      },
      get finished() {
        return false;
      },
      get maxStep() {
        return totalRef.current - 1;
      },
      next,
      back,
      goTo,
      reset,
    }),
    [next, back, goTo, reset],
  );
  useImperativeHandle(
    apiRef,
    () => Object.defineProperties({}, Object.getOwnPropertyDescriptors(api)) as StepperBaseApi,
    [api, current, total],
  );

  // Delegación como en vanilla: cualquier botón con la clase back/next navega.
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as Element;
    const button = target.closest?.('.mtx-mobile-stepper__back, .mtx-mobile-stepper__next') as HTMLButtonElement | null;
    if (!button || button.disabled || !event.currentTarget.contains(button)) return;
    if (button.classList.contains('mtx-mobile-stepper__back')) back();
    else next();
  };

  const value = total > 1 ? (current / (total - 1)) * 100 : 100;
  let indicator: ReactNode = null;
  if (variant === 'dots') {
    indicator = Array.from({ length: total }, (_, index) => (
      <span key={index} className={cx('mtx-mobile-stepper__dot', index === current && 'mtx-mobile-stepper__dot--active')} />
    ));
  } else if (variant === 'text') {
    indicator = t('fraction', { n: current + 1, total }, `${current + 1} / ${total}`);
  } else {
    indicator = <LinearProgress component="div" className="mtx-mobile-stepper__progress" value={value} decorative />;
  }

  return (
    <div
      ref={ref}
      className={cx(
        'mtx-mobile-stepper',
        `mtx-mobile-stepper--${variant}`,
        `mtx-mobile-stepper--${position}`,
        className,
      )}
      data-active-step={current}
      onClick={handleClick}
      {...rest}
    >
      {backButton !== undefined ? (
        backButton
      ) : (
        <Button size="small" className="mtx-mobile-stepper__back" disabled={current <= 0}>
          <span className="mtx-button__icon material-icons" aria-hidden="true">
            keyboard_arrow_left
          </span>
          <span className="mtx-mobile-stepper__button-label">{backLabel || t('back', null, 'Back')}</span>
        </Button>
      )}
      <div className="mtx-mobile-stepper__indicator" aria-hidden="true">
        {indicator}
      </div>
      {nextButton !== undefined ? (
        nextButton
      ) : (
        <Button size="small" className="mtx-mobile-stepper__next" disabled={current >= total - 1}>
          <span className="mtx-mobile-stepper__button-label">{nextLabel || t('next', null, 'Next')}</span>
          <span className="mtx-button__icon material-icons" aria-hidden="true">
            keyboard_arrow_right
          </span>
        </Button>
      )}
      <span className="mtx-mobile-stepper__status" aria-live="polite">
        {t('step', { n: current + 1, total }, `Step ${current + 1} of ${total}`)}
      </span>
    </div>
  );
});
