/**
 * Título de una alerta (`.mtx-alert__title`), equivalente a `AlertTitle` de MUI.
 */
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/alert.css';
import { cx } from '../../core';

/** Propiedades de {@link AlertTitle}. */
export type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

/**
 * Título en negrita que se coloca al inicio del mensaje de un `Alert`.
 */
export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('mtx-alert__title', className)} {...rest} />;
});
