'use client';
import { forwardRef, useId } from 'react';
import type { ChangeEvent, FocusEventHandler, HTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/native-select.css';
import '@rubenchodev/materix-ui/components/form-helper-text.css';
import { cx } from '../../core';
import { hasContent } from '../form-helper-text/FormHelperText';
import { useHelperField } from '../checkbox/toggle-shared';

/** Variantes de {@link NativeSelect}; `standard` es la predeterminada, como en MUI. */
export type NativeSelectVariant = 'standard' | 'outlined' | 'filled';

/** Tamaños de {@link NativeSelect}: `medium` (56px) o `small` (40px). */
export type NativeSelectSize = 'medium' | 'small';

/** Opción declarada mediante la prop `options`. */
export interface NativeSelectOption {
  /** Valor enviado con el formulario. */
  value: string | number;
  /** Texto visible. */
  label: ReactNode;
  /** Deshabilita la opción. */
  disabled?: boolean;
}

/** Grupo de opciones (`<optgroup>`) declarado mediante la prop `options`. */
export interface NativeSelectOptionGroup {
  /** Título del grupo. */
  label: string;
  /** Opciones del grupo. */
  options: NativeSelectOption[];
  /** Deshabilita el grupo completo. */
  disabled?: boolean;
}

/** Props de {@link NativeSelect}. `className`, `style` y el resto de atributos van al `<div>` raíz. */
export interface NativeSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'onFocus' | 'onBlur'> {
  /** Variante visual. */
  variant?: NativeSelectVariant;
  /** Tamaño: `medium` (56px) o `small` (40px y texto de 14px). */
  size?: NativeSelectSize;
  /** Label flotante asociado con `for`/`id`. */
  label?: ReactNode;
  /** Valor (modo controlado); un array con `multiple`. */
  value?: string | number | readonly string[];
  /** Valor inicial (modo no controlado). */
  defaultValue?: string | number | readonly string[];
  /** Se invoca cuando el usuario cambia la opción; `value` es un array con `multiple`. */
  onChange?: (event: ChangeEvent<HTMLSelectElement>, value: string | string[]) => void;
  /** Opciones como datos; alternativa a escribir `<option>`/`<optgroup>` como children. */
  options?: ReadonlyArray<NativeSelectOption | NativeSelectOptionGroup>;
  /** Lista nativa de selección múltiple (sin chevron). */
  multiple?: boolean;
  /** Filas visibles con `multiple` (atributo `size` nativo). */
  htmlSize?: number;
  /** Estado de error: `aria-invalid` y colores de error (por defecto lo hereda de FormControl). */
  error?: boolean;
  /** Texto de ayuda o de error bajo el campo, enlazado con `aria-describedby`. */
  helperText?: ReactNode;
  /** Deshabilita el select (por defecto lo hereda de FormControl). */
  disabled?: boolean;
  /** Campo obligatorio: `required` nativo y asterisco en el label. */
  required?: boolean;
  /** Ocupa todo el ancho del contenedor (por defecto `true`, como vanilla). */
  fullWidth?: boolean;
  /** Id del `<select>` nativo. */
  id?: string;
  /** Nombre del campo en el formulario. */
  name?: string;
  /** Formulario asociado. */
  form?: string;
  /** Autocompletado nativo. */
  autoComplete?: string;
  /** Enfoca el select al montar. */
  autoFocus?: boolean;
  /** Ref al `<select>` nativo. */
  inputRef?: Ref<HTMLSelectElement>;
  /** Atributos extra del `<select>` nativo. */
  inputProps?: SelectHTMLAttributes<HTMLSelectElement> & { [key: `data-${string}`]: string | undefined };
  /** Foco del `<select>`. */
  onFocus?: FocusEventHandler<HTMLSelectElement>;
  /** Pérdida de foco del `<select>`. */
  onBlur?: FocusEventHandler<HTMLSelectElement>;
}

/** Chevron decorativo de vanilla (`arrow_drop_down`). */
const Chevron = () => (
  <span className="mtx-native-select__chevron" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  </span>
);

/**
 * Renderiza las opciones declaradas como datos.
 * @param {ReadonlyArray<NativeSelectOption | NativeSelectOptionGroup>} options Opciones y grupos.
 * @returns {ReactNode} Nodos `<option>`/`<optgroup>`.
 */
function renderOptions(options: ReadonlyArray<NativeSelectOption | NativeSelectOptionGroup>): ReactNode {
  return options.map((item, index) =>
    'options' in item ? (
      <optgroup key={`group-${index}-${item.label}`} label={item.label} disabled={item.disabled}>
        {item.options.map((option) => (
          <option key={String(option.value)} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </optgroup>
    ) : (
      <option key={String(item.value)} value={item.value} disabled={item.disabled}>
        {item.label}
      </option>
    ),
  );
}

/**
 * Select nativo (NativeSelect de MUI): el `<select>` del navegador con variantes standard/outlined/filled,
 * label flotante, chevron, tamaños y texto de ayuda o error.
 */
export const NativeSelect = forwardRef<HTMLDivElement, NativeSelectProps>(function NativeSelect(props, ref) {
  const {
    variant = 'standard',
    size = 'medium',
    label,
    value,
    defaultValue,
    onChange,
    options,
    multiple = false,
    htmlSize,
    error: errorProp,
    helperText,
    disabled: disabledProp,
    required: requiredProp,
    fullWidth = true,
    id: idProp,
    name,
    form,
    autoComplete,
    autoFocus,
    inputRef,
    inputProps,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedByProp,
    className,
    style,
    children,
    ...rest
  } = props;

  const autoId = useId();
  const { error, disabled, required, ariaDescribedBy, wrap } = useHelperField({
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    helperText,
    describedBy: ariaDescribedByProp ?? inputProps?.['aria-describedby'],
    fullWidth,
  });
  const hasLabel = hasContent(label);
  const userId = idProp ?? inputProps?.id;
  const id = userId ?? (hasLabel ? `mtx-native-select-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}` : undefined);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    const next = target.multiple ? Array.from(target.selectedOptions, (option) => option.value) : target.value;
    inputProps?.onChange?.(event);
    onChange?.(event, next);
  };

  const control = (
    <div
      ref={ref}
      className={cx(
        'mtx-native-select',
        className,
        `mtx-native-select--${variant}`,
        size === 'small' && 'mtx-native-select--small',
        hasLabel && 'mtx-native-select--has-label',
        error && 'mtx-native-select--error',
        multiple && 'mtx-native-select--multiple',
      )}
      style={fullWidth ? style : { width: 'auto', ...style }}
      {...rest}
    >
      {hasLabel ? (
        <label className="mtx-native-select__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <select
        aria-invalid={error ? true : undefined}
        {...inputProps}
        ref={inputRef}
        className={cx('mtx-native-select__input', inputProps?.className)}
        id={id}
        name={name ?? inputProps?.name}
        form={form ?? inputProps?.form}
        autoComplete={autoComplete ?? inputProps?.autoComplete}
        autoFocus={autoFocus ?? inputProps?.autoFocus}
        size={htmlSize ?? inputProps?.size}
        multiple={multiple || undefined}
        value={value as SelectHTMLAttributes<HTMLSelectElement>['value']}
        defaultValue={defaultValue as SelectHTMLAttributes<HTMLSelectElement>['defaultValue']}
        disabled={disabled}
        required={required || undefined}
        aria-label={ariaLabel ?? inputProps?.['aria-label']}
        aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
        aria-describedby={ariaDescribedBy}
        onChange={handleChange}
        onFocus={onFocus ?? inputProps?.onFocus}
        onBlur={onBlur ?? inputProps?.onBlur}
      >
        {options ? renderOptions(options) : null}
        {children}
      </select>
      <Chevron />
    </div>
  );

  return <>{wrap(control)}</>;
});
