'use client';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx } from '../../core';
import { FormControlContext } from './FormControlContext';
import type { FormControlState } from './FormControlContext';

/** Props de {@link FormControl}. */
export interface FormControlProps extends HTMLAttributes<HTMLDivElement> {
  /** Marca el grupo como inválido (`.mtx-form-control--error`); lo heredan sus controles. */
  error?: boolean;
  /** Deshabilita el grupo (`.mtx-form-control--disabled`); lo heredan sus controles. */
  disabled?: boolean;
  /** Marca los controles del grupo como obligatorios. */
  required?: boolean;
}

/**
 * Contenedor `.mtx-form-control` (FormControl de MUI) que agrupa label, control y FormHelperText
 * y comparte `error`, `disabled` y `required` mediante {@link FormControlContext}.
 */
export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  { error = false, disabled = false, required = false, className, children, ...rest },
  ref,
) {
  const [helperTextIds, setHelperTextIds] = useState<string[]>([]);

  const registerHelperText = useCallback((id: string) => {
    setHelperTextIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    return () => setHelperTextIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const value = useMemo<FormControlState>(
    () => ({ error, disabled, required, helperTextIds, registerHelperText }),
    [error, disabled, required, helperTextIds, registerHelperText],
  );

  return (
    <FormControlContext.Provider value={value}>
      <div
        ref={ref}
        className={cx(
          'mtx-form-control',
          error && 'mtx-form-control--error',
          disabled && 'mtx-form-control--disabled',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </FormControlContext.Provider>
  );
});
