'use client';
/**
 * Icono de 24px de un paso (StepIcon de MUI): número, check, aviso o icono propio.
 */
import type { ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/stepper.css';
import { cx } from '../../core';

/** Trazados SVG de 24px (CheckCircle y Warning de MUI). */
const CHECK_PATH = 'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z';
const WARNING_PATH = 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z';

/** Props de {@link StepIcon}. */
export interface StepIconProps {
  /** Número del paso o icono propio (nombre de Material Icons o nodo). */
  icon: ReactNode;
  /** Paso activo. */
  active?: boolean;
  /** Paso completado (muestra el check). */
  completed?: boolean;
  /** Paso con error (muestra el aviso). */
  error?: boolean;
  /** Clases adicionales. */
  className?: string;
}

/**
 * Icono de 24px del paso; el error y el completado sustituyen al número o icono.
 */
export function StepIcon({ icon, active = false, completed = false, error = false, className }: StepIconProps) {
  if (error || completed) {
    const kind = error ? 'error' : 'completed';
    return (
      <svg
        viewBox="0 0 24 24"
        className={cx('mtx-step-icon', `mtx-step-icon--${kind}`, active && 'mtx-step-icon--active', className)}
        aria-hidden="true"
        focusable="false"
        data-kind={kind}
      >
        <path d={error ? WARNING_PATH : CHECK_PATH} />
      </svg>
    );
  }
  if (typeof icon === 'number' || (typeof icon === 'string' && /^\d+$/.test(icon))) {
    return (
      <span
        className={cx('mtx-step-icon', 'mtx-step-icon--number', active && 'mtx-step-icon--active', className)}
        data-kind={`n:${icon}`}
      >
        {String(icon)}
      </span>
    );
  }
  const isName = typeof icon === 'string';
  return (
    <span
      className={cx(
        'mtx-step-icon',
        'mtx-step-icon--custom',
        isName && 'material-icons',
        active && 'mtx-step-icon--active',
        className,
      )}
      data-kind={isName ? `icon:${icon}` : 'icon'}
    >
      {icon}
    </span>
  );
}

StepIcon.displayName = 'StepIcon';
