'use client';
import { forwardRef } from 'react';
import type { ChangeEvent, FocusEventHandler, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, Ref } from 'react';
import '@rubenchodev/materix-ui/components/radio.css';
import { cx } from '../../core';
import { hasContent } from '../form-helper-text/FormHelperText';
import { useFormControl } from '../form-helper-text/FormControlContext';
import { chain, toggleModifiers, useToggleRipple } from '../checkbox/toggle-shared';
import type { ToggleColor, ToggleSize } from '../checkbox/toggle-shared';
import { useRadioGroup } from './RadioGroupContext';

/** Props de {@link Radio}. `className`, `style` y el resto de atributos van al `<label>` raíz. */
export interface RadioProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultChecked' | 'color' | 'form' | 'htmlFor' | 'onFocus' | 'onBlur'> {
  /** Valor del radio (se compara con el `value` del RadioGroup). */
  value?: string;
  /** Estado seleccionado (controlado). Dentro de un RadioGroup lo calcula el grupo. */
  checked?: boolean;
  /** Estado seleccionado inicial (no controlado, fuera de un RadioGroup). */
  defaultChecked?: boolean;
  /** Se invoca al seleccionar el radio. */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /** Texto visible (`.mtx-radio__label`). */
  label?: ReactNode;
  /** Tamaño: `medium` (20px, por defecto) o `small` (16px). */
  size?: ToggleSize;
  /** Color de la paleta cuando está seleccionado. */
  color?: ToggleColor;
  /** Deshabilita el radio (por defecto lo hereda del RadioGroup o FormControl). */
  disabled?: boolean;
  /** Marca el radio como obligatorio. */
  required?: boolean;
  /** Desactiva el efecto ripple. */
  disableRipple?: boolean;
  /** Id del `<input>` nativo. */
  id?: string;
  /** Nombre del grupo nativo; dentro de un RadioGroup lo asigna el grupo. */
  name?: string;
  /** Formulario asociado al `<input>`. */
  form?: string;
  /** Enfoca el radio al montar. */
  autoFocus?: boolean;
  /** Ref al `<input type="radio">` nativo. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos extra del `<input>` nativo. */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Foco del `<input>`. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Pérdida de foco del `<input>`. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

/**
 * Botón de radio (Radio de MUI) sobre un `<input type="radio">` nativo envuelto en `<label class="mtx-radio">`.
 * Dentro de un {@link RadioGroup} toma `name`, selección y `disabled` del grupo; el teclado es el nativo.
 */
export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(props, ref) {
  const {
    value,
    checked: checkedProp,
    defaultChecked,
    onChange,
    label,
    size = 'medium',
    color = 'primary',
    disabled: disabledProp,
    required: requiredProp,
    disableRipple = false,
    id,
    name: nameProp,
    form,
    autoFocus,
    inputRef,
    inputProps,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    children,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  const group = useRadioGroup();
  const formControl = useFormControl();
  const disabled = disabledProp ?? (group?.disabled || formControl?.disabled) ?? false;
  const required = requiredProp ?? formControl?.required ?? false;
  const inputValue = value ?? inputProps?.value;
  const ripple = useToggleRipple(disabled || disableRipple);

  // Controlado con `checked` o con el `value` del grupo; si no, nativo con `defaultChecked` (el reset funciona).
  const optionValue = String(inputValue ?? 'on');
  let checkedAttrs: { checked?: boolean; defaultChecked?: boolean };
  if (checkedProp !== undefined) checkedAttrs = { checked: checkedProp };
  else if (group && group.value !== undefined) checkedAttrs = { checked: group.value !== null && group.value === optionValue };
  else if (group) checkedAttrs = { defaultChecked: defaultChecked ?? (group.defaultValue !== null && group.defaultValue === optionValue) };
  else checkedAttrs = { defaultChecked };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    onChange?.(event, event.target.checked);
    group?.onChange(event, event.target.value);
  };

  const text = label ?? children;

  return (
    <label
      ref={ref}
      className={cx('mtx-radio', ...toggleModifiers('radio', size, color), className)}
      onPointerDown={chain(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={chain(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={chain(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={chain(onPointerCancel, ripple.handlers.onPointerCancel)}
      {...rest}
    >
      <input
        {...inputProps}
        ref={inputRef}
        type="radio"
        className={cx('mtx-radio__input', inputProps?.className)}
        id={id ?? inputProps?.id}
        name={group?.name ?? nameProp ?? inputProps?.name}
        value={inputValue}
        form={form ?? inputProps?.form}
        autoFocus={autoFocus ?? inputProps?.autoFocus}
        {...checkedAttrs}
        disabled={disabled}
        required={required || undefined}
        aria-label={ariaLabel ?? inputProps?.['aria-label']}
        aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
        aria-describedby={ariaDescribedBy ?? inputProps?.['aria-describedby']}
        onChange={handleChange}
        onFocus={onFocus ?? inputProps?.onFocus}
        onBlur={onBlur ?? inputProps?.onBlur}
      />
      <span className="mtx-radio__box" ref={ripple.targetRef}>
        {ripple.element}
      </span>
      {hasContent(text) ? <span className="mtx-radio__label">{text}</span> : null}
    </label>
  );
});
