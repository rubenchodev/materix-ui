'use client';
/**
 * Botón de alternancia (`ToggleButton` de MUI): estado seleccionado expuesto con `aria-pressed`.
 */
import { forwardRef, isValidElement, useContext, useEffect, useId } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, PointerEvent, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/toggle-button.css';
import { cx, isDev, useControlled, useRipple } from '../../core';
import { ToggleButtonGroupContext } from './ToggleButtonGroupContext';
import type { ToggleButtonColor, ToggleButtonSize } from './ToggleButtonGroupContext';

const SIZES: readonly ToggleButtonSize[] = ['small', 'medium', 'large'];
const COLORS: readonly ToggleButtonColor[] = ['standard', 'primary', 'secondary', 'error', 'warning', 'info', 'success'];

/** Props de {@link ToggleButton}. El resto de atributos va al `<button>` nativo. */
export interface ToggleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'color' | 'type'> {
  /** Valor del botón; obligatorio dentro de un grupo (si falta, aviso en desarrollo y valor generado). Por defecto, el texto si `children` es un string. */
  value?: string;
  /** Estado seleccionado (modo controlado; ignorado dentro de un grupo). */
  selected?: boolean;
  /** Estado seleccionado inicial (modo no controlado, como `data-selected`). */
  defaultSelected?: boolean;
  /** Se invoca al alternar el botón (equivale a `mtx:toggle-button:change`); dentro de un grupo, antes del `onChange` del grupo. */
  onChange?: (event: MouseEvent<HTMLButtonElement>, selected: boolean, value: string) => void;
  /** Icono antes del texto: nombre de Material Icons o un nodo (24px, `aria-hidden`). */
  icon?: ReactNode;
  /** Tamaño: `small` 40px, `medium` 48px (por defecto) o `large` 56px. */
  size?: ToggleButtonSize;
  /** Color del estado seleccionado: `standard` (por defecto) o de la paleta. */
  color?: ToggleButtonColor;
  /** Deshabilita el botón (`disabled` nativo). */
  disabled?: boolean;
  /** Desactiva el efecto ripple. */
  disableRipple?: boolean;
}

/**
 * Renderiza el icono del botón.
 * @param {ReactNode} icon Nombre de Material Icons o nodo.
 * @returns {ReactNode} Icono decorativo.
 */
function renderIcon(icon: ReactNode): ReactNode {
  if (icon === undefined || icon === null || icon === false || icon === '') return null;
  if (typeof icon === 'string') {
    return (
      <span className="material-icons mtx-toggle-button__icon" aria-hidden="true">
        {icon.trim()}
      </span>
    );
  }
  return isValidElement(icon) ? icon : <span className="mtx-toggle-button__icon" aria-hidden="true">{icon}</span>;
}

/**
 * Botón de alternancia: independiente alterna su propio estado; dentro de un
 * {@link ToggleButtonGroup} el grupo decide la selección.
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(props, ref) {
  const group = useContext(ToggleButtonGroupContext);
  const {
    value: valueProp,
    selected: selectedProp,
    defaultSelected = false,
    onChange,
    icon,
    size: sizeProp,
    color: colorProp,
    disabled: disabledProp = false,
    disableRipple = false,
    className,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  const autoValue = useId();
  const textValue = typeof children === 'string' ? children.trim() : '';
  // Dentro de un grupo, un botón sin `value` ni texto recibe un valor estable y único.
  const missingValue = Boolean(group) && valueProp === undefined && !textValue;
  const value = valueProp ?? (textValue || (group ? `mtx-tb-${autoValue}` : ''));

  useEffect(() => {
    if (missingValue && isDev) {
      console.warn('Materix ToggleButton: dentro de ToggleButtonGroup cada botón necesita `value`; se generó uno automático.');
    }
  }, [missingValue]);
  const [ownSelected, setOwnSelected] = useControlled({
    controlled: group ? undefined : selectedProp,
    default: defaultSelected,
    name: 'ToggleButton',
    state: 'selected',
  });
  const selected = group ? group.isSelected(value) : Boolean(ownSelected);
  const disabled = Boolean(disabledProp || group?.disabled);
  const size = sizeProp ?? group?.size ?? 'medium';
  const color = colorProp ?? group?.color ?? 'standard';

  const ripple = useRipple<HTMLButtonElement>({ disabled: disabled || disableRipple });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (group) {
      onChange?.(event, !selected, value);
      group.onButtonClick(event, value);
      return;
    }
    const next = !selected;
    setOwnSelected(next);
    onChange?.(event, next, value);
  };

  const compose =
    (user: ((e: PointerEvent<HTMLButtonElement>) => void) | undefined, own: (e: PointerEvent<HTMLButtonElement>) => void) =>
    (event: PointerEvent<HTMLButtonElement>) => {
      user?.(event);
      own(event);
    };

  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        'mtx-toggle-button',
        SIZES.includes(size) && size !== 'medium' && `mtx-toggle-button--${size}`,
        COLORS.includes(color) && color !== 'standard' && `mtx-toggle-button--${color}`,
        className,
      )}
      value={value}
      disabled={disabled}
      aria-pressed={selected}
      {...rest}
      onClick={handleClick}
      onPointerDown={compose(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={compose(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={compose(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={compose(onPointerCancel, ripple.handlers.onPointerCancel)}
    >
      {renderIcon(icon)}
      {children}
      {ripple.element}
    </button>
  );
});
ToggleButton.displayName = 'ToggleButton';
