'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEventHandler, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, Ref } from 'react';
import '@rubenchodev/materix-ui/components/checkbox.css';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx, useEnhancedEffect, useForkRef } from '../../core';
import { hasContent } from '../form-helper-text/FormHelperText';
import { chain, toggleModifiers, useHelperField, useToggleRipple } from './toggle-shared';
import type { ToggleColor, ToggleSize } from './toggle-shared';

/** Props de {@link Checkbox}. `className`, `style` y el resto de atributos van al `<label>` raíz. */
export interface CheckboxProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultChecked' | 'color' | 'form' | 'htmlFor' | 'onFocus' | 'onBlur'> {
  /** Estado marcado (modo controlado). */
  checked?: boolean;
  /** Estado marcado inicial (modo no controlado). */
  defaultChecked?: boolean;
  /** Se invoca al cambiar el estado por interacción del usuario. */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /** Muestra el guion de estado parcial y `aria-checked="mixed"` (controlado por el padre, como en MUI). */
  indeterminate?: boolean;
  /** Texto visible (`.mtx-checkbox__label`); sin él, da nombre accesible con `aria-label`. */
  label?: ReactNode;
  /** Tamaño: `medium` (caja de 18px, por defecto) o `small` (16px). */
  size?: ToggleSize;
  /** Color de la paleta cuando está marcada. */
  color?: ToggleColor;
  /** Deshabilita la casilla (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Marca la casilla como obligatoria. */
  required?: boolean;
  /** Estado de error: `aria-invalid` y borde de error (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Texto de ayuda o de error bajo la casilla (FormHelperText enlazado con `aria-describedby`). */
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
  /** Enfoca la casilla al montar. */
  autoFocus?: boolean;
  /** Ref al `<input type="checkbox">` nativo. */
  inputRef?: Ref<HTMLInputElement>;
  /** Atributos extra del `<input>` nativo. */
  inputProps?: InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: string | undefined };
  /** Foco del `<input>`. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Pérdida de foco del `<input>`. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

/**
 * Casilla de verificación (Checkbox de MUI) sobre un `<input type="checkbox">` nativo envuelto en
 * `<label class="mtx-checkbox">`, con estado indeterminado, ripple y texto de ayuda/error.
 */
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    indeterminate = false,
    label,
    size = 'medium',
    color = 'primary',
    disabled: disabledProp,
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

  // Estado mixto efectivo: sigue a la prop, y un clic del usuario lo limpia como hace el navegador
  // (equivale a `_syncAria` de vanilla); vuelve a activarse cuando la prop cambia.
  const [mixed, setMixed] = useState(indeterminate);
  useEffect(() => {
    setMixed(indeterminate);
  }, [indeterminate]);

  // `indeterminate` solo existe como propiedad DOM: se reaplica tras cada render.
  useEnhancedEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = mixed;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    setMixed(false);
    inputProps?.onChange?.(event);
    onChange?.(event, next);
  };

  const text = label ?? children;

  const control = (
    <label
      ref={ref}
      className={cx('mtx-checkbox', ...toggleModifiers('checkbox', size, color), className)}
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
        className={cx('mtx-checkbox__input', inputProps?.className)}
        id={id ?? inputProps?.id}
        name={name ?? inputProps?.name}
        value={value ?? inputProps?.value}
        form={form ?? inputProps?.form}
        autoFocus={autoFocus ?? inputProps?.autoFocus}
        {...checkedAttrs}
        disabled={disabled}
        required={required || undefined}
        aria-checked={mixed ? 'mixed' : undefined}
        aria-label={ariaLabel ?? inputProps?.['aria-label']}
        aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
        aria-describedby={ariaDescribedBy}
        onChange={handleChange}
        onFocus={onFocus ?? inputProps?.onFocus}
        onBlur={onBlur ?? inputProps?.onBlur}
      />
      <span className="mtx-checkbox__box" ref={ripple.targetRef}>
        {ripple.element}
      </span>
      {hasContent(text) ? <span className="mtx-checkbox__label">{text}</span> : null}
    </label>
  );

  return <>{wrap(control)}</>;
});
