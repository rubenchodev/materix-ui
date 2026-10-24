'use client';
import { forwardRef, useId, useMemo } from 'react';
import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/radio.css';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx, useEventCallback } from '../../core';
import { FormLabel } from '../form-helper-text/FormLabel';
import { hasContent } from '../form-helper-text/FormHelperText';
import { useHelperField } from '../checkbox/toggle-shared';
import { RadioGroupContext } from './RadioGroupContext';
import type { RadioGroupState } from './RadioGroupContext';

/** Props de {@link RadioGroup}. `className`, `style` y el resto de atributos van al `role="radiogroup"`. */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Valor seleccionado (modo controlado; `null` = ninguno). */
  value?: string | null;
  /** Valor inicial (modo no controlado). */
  defaultValue?: string | null;
  /** Se invoca al seleccionar un radio (equivale a `mtx:radio-group:change`). */
  onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  /** Nombre compartido por los radios; si se omite se genera uno único. */
  name?: string;
  /** Distribuye los radios en fila (`.mtx-radio-group--row`). */
  row?: boolean;
  /** Rótulo visible del grupo (`.mtx-form-label`), enlazado con `aria-labelledby`. */
  label?: ReactNode;
  /** Texto de ayuda o de error bajo el grupo. */
  helperText?: ReactNode;
  /** Estado de error: `aria-invalid` en el grupo y bordes de error (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Deshabilita todos los radios del grupo (`aria-disabled`). */
  disabled?: boolean;
  /** Radios del grupo. */
  children?: ReactNode;
}

/**
 * Grupo de radios (RadioGroup + FormLabel + FormHelperText de MUI) con `role="radiogroup"`,
 * selección controlada o no controlada, `name` automático y texto de ayuda/error.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const {
    value: valueProp,
    defaultValue = null,
    onChange,
    name: nameProp,
    row = false,
    label,
    helperText,
    error: errorProp,
    disabled: disabledProp,
    id,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledByProp,
    'aria-describedby': ariaDescribedByProp,
    ...rest
  } = props;

  const autoId = useId().replace(/:/g, '');
  const name = nameProp ?? `mtx-radio-group-${autoId}`;
  const labelId = `${id ?? `mtx-radio-group-${autoId}`}-label`;
  const { error, disabled, ariaDescribedBy, wrap } = useHelperField({
    error: errorProp,
    disabled: disabledProp,
    helperText,
    describedBy: ariaDescribedByProp,
  });

  const handleChange = useEventCallback((event: ChangeEvent<HTMLInputElement>, next: string) => {
    onChange?.(event, next);
  });

  const context = useMemo<RadioGroupState>(
    () => ({ name, value: valueProp, defaultValue, disabled, onChange: handleChange }),
    [name, valueProp, defaultValue, disabled, handleChange],
  );

  const hasLabel = hasContent(label);
  const labelledBy = ariaLabelledByProp ?? (hasLabel && !ariaLabel ? labelId : undefined);

  const group = (
    <div
      ref={ref}
      id={id}
      className={cx('mtx-radio-group', row && 'mtx-radio-group--row', className)}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      {...rest}
    >
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </div>
  );

  return <>{wrap(group, hasLabel ? <FormLabel id={labelId}>{label}</FormLabel> : undefined)}</>;
});
