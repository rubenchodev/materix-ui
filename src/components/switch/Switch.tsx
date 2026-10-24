'use client';
import { forwardRef, useRef } from 'react';
import type {
  ChangeEvent,
  FocusEventHandler,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import '@rubenchodev/materix-ui/components/switch.css';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx, useForkRef } from '../../core';
import { hasContent } from '../form-helper-text/FormHelperText';
import { chain, toggleModifiers, useHelperField, useToggleRipple } from '../checkbox/toggle-shared';
import type { ToggleColor, ToggleSize } from '../checkbox/toggle-shared';

/** Props de {@link Switch}. `className`, `style` y el resto de atributos van al `<label>` raíz. */
export interface SwitchProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultChecked' | 'color' | 'form' | 'htmlFor' | 'onFocus' | 'onBlur'> {
  /** Estado activado (modo controlado). */
  checked?: boolean;
  /** Estado activado inicial (modo no controlado). */
  defaultChecked?: boolean;
  /** Se invoca al cambiar el estado por interacción del usuario. */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /** Texto visible (`.mtx-switch__label`); sin él, da nombre accesible con `aria-label`. */
  label?: ReactNode;
  /** Tamaño: `medium` (pista de 34×20px, por defecto) o `small` (28×16px). */
  size?: ToggleSize;
  /** Color de la paleta cuando está activado. */
  color?: ToggleColor;
  /** Deshabilita el interruptor (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Solo lectura: enfocable y anunciado, pero el usuario no puede cambiarlo. */
  readOnly?: boolean;
  /** Marca el interruptor como obligatorio. */
  required?: boolean;
  /** Estado de error con `aria-invalid` (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Texto de ayuda o de error bajo el interruptor (FormHelperText enlazado con `aria-describedby`). */
  helperText?: ReactNode;
  /** Desactiva el efecto ripple. */
  disableRipple?: boolean;
  /** Id del `<input>` nativo. */
  id?: string;
  /** Nombre del campo en el formulario. */
  name?: string;
  /** Valor enviado con el formulario. */
  value?: string;
  /** Formulario asociado al `<input>`. */
  form?: string;
  /** Enfoca el interruptor al montar. */
  autoFocus?: boolean;
  /** Ref al `<input type="checkbox" role="switch">` nativo. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos extra del `<input>` nativo. */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Foco del `<input>`. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Pérdida de foco del `<input>`. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

/**
 * Interruptor (Switch de MUI) sobre un `<input type="checkbox" role="switch">` nativo envuelto en
 * `<label class="mtx-switch">` con pista, thumb, ripple, solo lectura y texto de ayuda/error.
 */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch(props, ref) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    label,
    size = 'medium',
    color = 'primary',
    disabled: disabledProp,
    readOnly = false,
    required: requiredProp,
    error: errorProp,
    helperText,
    disableRipple = false,
    id,
    name,
    value,
    form,
    autoFocus,
    inputRef: inputRefProp,
    inputProps,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedByProp,
    className,
    children,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  // No controlado: estado nativo (`defaultChecked`), así `form.reset()` restaura la casilla sin desincronizar nada.
  const isControlled = checkedProp !== undefined;
  const checkedAttrs = isControlled ? { checked: checkedProp } : { defaultChecked };
  const { error, disabled, required, ariaDescribedBy, wrap } = useHelperField({
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    helperText,
    describedBy: ariaDescribedByProp ?? inputProps?.['aria-describedby'],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputRef = useForkRef(inputRef, inputRefProp);
  const ripple = useToggleRipple(disabled || disableRipple);

  // Solo lectura: el checkbox nativo ignora `readonly`. Controlado, basta con no avisar al padre (React
  // restaura el valor); no controlado, se cancela el clic como en vanilla.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const next = event.target.checked;
    inputProps?.onChange?.(event);
    onChange?.(event, next);
  };

  const text = label ?? children;

  const control = (
    <label
      ref={ref}
      className={cx('mtx-switch', ...toggleModifiers('switch', size, color), className)}
      onPointerDown={chain(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={chain(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={chain(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={chain(onPointerCancel, ripple.handlers.onPointerCancel)}
      {...rest}
    >
      <input
        aria-invalid={error ? true : undefined}
        {...inputProps}
        ref={handleInputRef}
        type="checkbox"
        role="switch"
        className={cx('mtx-switch__input', inputProps?.className)}
        id={id ?? inputProps?.id}
        name={name ?? inputProps?.name}
        value={value ?? inputProps?.value}
        form={form ?? inputProps?.form}
        autoFocus={autoFocus ?? inputProps?.autoFocus}
        {...checkedAttrs}
        disabled={disabled}
        readOnly={readOnly || undefined}
        required={required || undefined}
        aria-label={ariaLabel ?? inputProps?.['aria-label']}
        aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
        aria-describedby={ariaDescribedBy}
        onChange={handleChange}
        onClick={(event) => {
          inputProps?.onClick?.(event);
          if (readOnly && !isControlled) event.preventDefault();
        }}
        onFocus={onFocus ?? inputProps?.onFocus}
        onBlur={onBlur ?? inputProps?.onBlur}
      />
      <span className="mtx-switch__track">
        <span className="mtx-switch__thumb" ref={ripple.targetRef}>
          {ripple.element}
        </span>
      </span>
      {hasContent(text) ? <span className="mtx-switch__label">{text}</span> : null}
    </label>
  );

  return <>{wrap(control)}</>;
});
