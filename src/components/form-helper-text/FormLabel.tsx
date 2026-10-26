'use client';
import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx } from '../../core';
import { useFormControl } from './FormControlContext';

/** Props de {@link FormLabel}. */
export interface FormLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Añade el asterisco de obligatorio (por defecto lo hereda del FormControl). */
  required?: boolean;
  /** Color de error (por defecto lo hereda del FormControl). */
  error?: boolean;
  /** Color atenuado (por defecto lo hereda del FormControl). */
  disabled?: boolean;
}

/** Colores de estado: vanilla solo los aplica vía `.mtx-form-control--*`, así también funcionan sueltos. */
const ERROR_STYLE: CSSProperties = { color: 'var(--mtx-color-error-text)' };
const DISABLED_STYLE: CSSProperties = { color: 'var(--mtx-color-text-disabled)' };

/**
 * Rótulo de un grupo de controles (`.mtx-form-label`, FormLabel de MUI). Toma el color primario con
 * foco, de error o atenuado según `error`/`disabled` (props o FormControl) y muestra ` *` si es requerido.
 */
export const FormLabel = forwardRef<HTMLDivElement, FormLabelProps>(function FormLabel(
  { required: requiredProp, error: errorProp, disabled: disabledProp, className, style, children, ...rest },
  ref,
) {
  const formControl = useFormControl();
  const required = requiredProp ?? formControl?.required ?? false;
  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const stateStyle = disabled ? DISABLED_STYLE : error ? ERROR_STYLE : undefined;

  return (
    <div ref={ref} className={cx('mtx-form-label', className)} style={stateStyle ? { ...stateStyle, ...style } : style} {...rest}>
      {children}
      {required ? <span aria-hidden="true">{' *'}</span> : null}
    </div>
  );
});
