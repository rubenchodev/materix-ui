'use client';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx } from '../../core';

/** Props de {@link FormLabel}. */
export type FormLabelProps = HTMLAttributes<HTMLDivElement>;

/**
 * Rótulo de un grupo de controles (`.mtx-form-label`, FormLabel de MUI). Toma el color primario con
 * foco, de error con `FormControl error` y atenuado con `FormControl disabled` (todo por CSS).
 */
export const FormLabel = forwardRef<HTMLDivElement, FormLabelProps>(function FormLabel(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('mtx-form-label', className)} {...rest}>
      {children}
    </div>
  );
});
