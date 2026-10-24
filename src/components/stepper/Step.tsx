'use client';
/**
 * Paso del Stepper (Step de MUI): `<li>` con conector, etiqueta y contenido.
 */
import { Children, forwardRef, isValidElement, useContext } from 'react';
import type { LiHTMLAttributes, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/stepper.css';
import { cx } from '../../core';
import { StepContext, StepIndexContext, useStepperContext } from './context';
import type { StepState } from './context';
import { StepConnector, StepContent, StepLabel } from './StepParts';

/** Props de estado y contenido de un paso (también válidas en `Stepper steps`). */
export interface StepOwnProps {
  /** Etiqueta visible (equivale a `data-label`). */
  label?: ReactNode;
  /** Caption opcional: `true` usa el texto "Optional" traducido; un texto lo sustituye. */
  optional?: ReactNode;
  /** Completado explícito; sin él, en modo lineal se infiere del orden. */
  completed?: boolean;
  /** Error: `true` sin mensaje o un texto que se muestra bajo la etiqueta. */
  error?: boolean | string;
  /** Deshabilita el paso (no se puede activar). */
  disabled?: boolean;
  /** Icono propio (nombre de Material Icons o nodo) en lugar del número. */
  icon?: ReactNode;
  /** Mantiene expandido el contenido en el stepper vertical. */
  expanded?: boolean;
}

/** Props de {@link Step}. */
export interface StepProps extends StepOwnProps, Omit<LiHTMLAttributes<HTMLLIElement>, 'color'> {
  /** Contenido del paso (StepContent en vertical) o partes manuales (`StepLabel`, `StepContent`). */
  children?: ReactNode;
}

const PART_TYPES: unknown[] = [StepLabel, StepContent, StepConnector];

/**
 * Indica si los hijos son partes manuales del paso.
 * @param {ReactNode} children Hijos.
 * @returns {{parts: boolean, connector: boolean, content: boolean}} Resultado.
 */
function inspectChildren(children: ReactNode) {
  const items = Children.toArray(children);
  return {
    parts: items.some((child) => isValidElement(child) && PART_TYPES.includes(child.type)),
    connector: items.some((child) => isValidElement(child) && child.type === StepConnector),
    content: items.length > 0,
  };
}

/** Estado por defecto fuera de un Stepper. */
function fallbackState(index: number, props: StepOwnProps): StepState {
  const error = props.error === true ? '' : typeof props.error === 'string' ? props.error : false;
  return {
    index,
    active: false,
    completed: Boolean(props.completed),
    error,
    disabled: Boolean(props.disabled),
    visuallyDisabled: Boolean(props.disabled),
    expanded: Boolean(props.expanded),
    last: false,
    optional: props.optional,
    icon: props.icon,
  };
}

/**
 * Paso de un {@link Stepper}: genera el conector, la etiqueta (`label`) y el StepContent con los hijos.
 */
export const Step = forwardRef<HTMLLIElement, StepProps>(function Step(props, ref) {
  const { label, optional, completed, error, disabled, icon, expanded, children, className, ...rest } = props;
  const stepper = useStepperContext();
  const index = useContext(StepIndexContext);
  const state = stepper ? stepper.getState(index) : fallbackState(index, props);
  const info = inspectChildren(children);

  let body: ReactNode;
  if (label !== undefined) {
    body = (
      <>
        <StepLabel>{label}</StepLabel>
        {info.parts ? children : info.content ? <StepContent>{children}</StepContent> : null}
      </>
    );
  } else {
    body = info.parts ? children : <StepLabel>{children}</StepLabel>;
  }

  return (
    <StepContext.Provider value={state}>
      <li
        ref={ref}
        className={cx(
          'mtx-step',
          state.active && 'mtx-step--active',
          state.completed && 'mtx-step--completed',
          state.error !== false && 'mtx-step--error',
          state.visuallyDisabled && 'mtx-step--disabled',
          state.last && 'mtx-step--last',
          state.expanded && 'mtx-step--expanded',
          className,
        )}
        data-disabled={state.disabled ? '' : undefined}
        aria-current={state.active && !stepper?.nonLinear ? 'step' : undefined}
        {...rest}
      >
        {index > 0 && !info.connector ? <StepConnector /> : null}
        {body}
      </li>
    </StepContext.Provider>
  );
});
