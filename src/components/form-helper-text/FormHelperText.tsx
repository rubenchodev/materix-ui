'use client';
import { forwardRef, useEffect, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx } from '../../core';
import { useFormControl } from './FormControlContext';

/** Props de {@link FormHelperText}. */
export interface FormHelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Estado de error (`--error`); por defecto lo hereda del FormControl. */
  error?: boolean;
  /** Atenúa el texto (`--disabled` + `aria-disabled`); por defecto lo hereda del FormControl (solo `aria-disabled`). */
  disabled?: boolean;
  /** Alinea el texto con el de un TextField outlined/filled (`--contained`). */
  contained?: boolean;
  /** Contenido del texto de ayuda o de error. */
  children?: ReactNode;
}

/**
 * Indica si un nodo tiene contenido visible.
 * @param {ReactNode} node Nodo.
 * @returns {boolean} `true` si no es vacío.
 */
export function hasContent(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== true && node !== '';
}

/**
 * Texto de ayuda o de error bajo un control (`.mtx-form-helper-text`, FormHelperText de MUI).
 * Dentro de un FormControl hereda `error`/`disabled` y registra su id para `aria-describedby`.
 */
export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(function FormHelperText(
  { error: errorProp, disabled: disabledProp, contained = false, id: idProp, className, children, ...rest },
  ref,
) {
  const formControl = useFormControl();
  const autoId = useId();
  const id = idProp ?? `mtx-form-helper-text-${autoId.replace(/:/g, '')}`;
  const error = errorProp ?? formControl?.error ?? false;
  const disabled = disabledProp ?? formControl?.disabled ?? false;
  const filled = hasContent(children);
  const register = formControl?.registerHelperText;

  useEffect(() => {
    if (!register || !filled) return undefined;
    return register(id);
  }, [register, filled, id]);

  return (
    <p
      ref={ref}
      id={id}
      className={cx(
        'mtx-form-helper-text',
        error && 'mtx-form-helper-text--error',
        contained && 'mtx-form-helper-text--contained',
        disabledProp && 'mtx-form-helper-text--disabled',
        className,
      )}
      aria-disabled={disabled ? true : undefined}
      {...rest}
    >
      {children}
    </p>
  );
});
