'use client';
/**
 * Partes de un paso: StepConnector, StepLabel (o StepButton en modo no lineal) y StepContent.
 */
import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import '@rubenchodev/materix-ui/components/stepper.css';
import { cx, useEnhancedEffect, useForkRef, useRipple } from '../../core';
import { StepIcon } from './StepIcon';
import { useStepContext, useStepperContext } from './context';

/** Props de {@link StepConnector}. */
export type StepConnectorProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Línea decorativa que une un paso con el anterior.
 */
export const StepConnector = forwardRef<HTMLSpanElement, StepConnectorProps>(function StepConnector(
  { className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('mtx-step-connector', className)} aria-hidden="true" {...rest}>
      <span className="mtx-step-connector__line" />
    </span>
  );
});

/** Props de {@link StepLabel}. */
export interface StepLabelProps extends HTMLAttributes<HTMLElement> {
  /** Texto de la etiqueta. */
  children?: ReactNode;
  /** Sustituye el caption opcional del `Step` (`true` = texto "Optional" traducido). */
  optional?: ReactNode;
  /** Sustituye el icono del `Step`. */
  icon?: ReactNode;
  /** Desactiva el ripple del StepButton. */
  disableRipple?: boolean;
}

/**
 * Resuelve el caption: mensaje de error o texto opcional.
 * @param {string|false} error Error del paso.
 * @param {ReactNode} optional Valor opcional.
 * @param {string} fallback Texto "Optional" traducido.
 * @returns {ReactNode} Caption o `null`.
 */
function resolveCaption(error: string | false, optional: ReactNode, fallback: string): ReactNode {
  if (error) return error;
  if (optional === undefined || optional === null || optional === false) return null;
  if (optional === true || optional === '') return fallback;
  return optional;
}

/**
 * Etiqueta del paso con icono, textos accesibles y caption; en modo no lineal es un `<button>` (StepButton).
 */
export const StepLabel = forwardRef<HTMLElement, StepLabelProps>(function StepLabel(
  { children, optional: optionalProp, icon: iconProp, disableRipple = false, className, onClick, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, ...rest },
  ref,
) {
  const stepper = useStepperContext();
  const state = useStepContext();
  const isButton = Boolean(stepper?.nonLinear);
  const disabled = Boolean(state?.disabled);
  const ripple = useRipple<HTMLElement>({ disabled: !isButton || disabled || disableRipple });

  const index = state?.index ?? 0;
  const total = stepper?.length ?? 1;
  const completed = Boolean(state?.completed);
  const error = state ? state.error : false;
  const hasError = error !== false;
  const active = Boolean(state?.active);
  const t = stepper?.t;
  const icon = iconProp ?? state?.icon ?? index + 1;
  const caption = resolveCaption(
    error,
    optionalProp !== undefined ? optionalProp : state?.optional,
    t ? t('optional', null, 'Optional') : 'Optional',
  );
  const status: string[] = [];
  if (completed) status.push(t ? t('completed', null, 'completed') : 'completed');
  if (hasError && !error) status.push(t ? t('error', null, 'error') : 'error');
  const prefix = t ? t('step', { n: index + 1, total }, `Step ${index + 1} of ${total}`) : `Step ${index + 1} of ${total}`;

  const content = (
    <>
      <span className="mtx-step__icon-container" aria-hidden="true">
        <StepIcon icon={icon} active={active} completed={completed} error={hasError} />
      </span>
      <span className="mtx-step__label-text">
        <span className="mtx-step__sr mtx-step__sr-prefix">{`${prefix}: `}</span>
        <span className="mtx-step__label">{children}</span>
        {caption !== null ? <span className="mtx-step__optional">{caption}</span> : null}
        <span className="mtx-step__sr mtx-step__sr-status">{status.length ? `, ${status.join(', ')}` : ''}</span>
      </span>
    </>
  );

  if (!isButton) {
    return (
      <span ref={ref} className={cx('mtx-step__label-container', className)} onClick={onClick} {...rest}>
        {content}
      </span>
    );
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || !stepper) return;
    stepper.api.goTo(index);
  };
  const compose =
    <E,>(own: ((event: E) => void) | undefined, inner: (event: E) => void) =>
    (event: E) => {
      own?.(event);
      inner(event);
    };

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      className={cx('mtx-step__label-container', 'mtx-step-button', className)}
      disabled={disabled}
      aria-current={active ? 'step' : undefined}
      {...rest}
      onClick={handleClick}
      onPointerDown={compose(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={compose(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={compose(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={compose(onPointerCancel, ripple.handlers.onPointerCancel)}
    >
      {content}
      {ripple.element}
    </button>
  );
});

/** Props de {@link StepContent}. */
export interface StepContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Contenido de un paso del stepper vertical: se expande solo en el paso activo (o con `expanded`).
 */
export const StepContent = forwardRef<HTMLDivElement, StepContentProps>(function StepContent(
  { children, className, ...rest },
  ref,
) {
  const stepper = useStepperContext();
  const state = useStepContext();
  const visible = stepper?.orientation === 'vertical' && Boolean(state?.expanded);
  const ownRef = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef<HTMLDivElement>(ownRef, ref);
  // `inert` por DOM: React 18 no pinta la prop booleana (React 19 sí).
  useEnhancedEffect(() => {
    const node = ownRef.current;
    if (!node) return;
    if (visible) node.removeAttribute('inert');
    else node.setAttribute('inert', '');
  }, [visible]);
  return (
    <div ref={handleRef} className={cx('mtx-step__content', className)} aria-hidden={!visible} {...rest}>
      <div className="mtx-step__content-inner">{children}</div>
    </div>
  );
});
