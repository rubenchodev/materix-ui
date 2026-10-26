'use client';
/**
 * Grupo de botones de alternancia (`ToggleButtonGroup` de MUI): selección exclusiva o múltiple.
 */
import { forwardRef, useMemo, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, MouseEvent } from 'react';
import '@rubenchodev/materix-ui/components/toggle-button.css';
import { cx, useControlled, useEventCallback, useForkRef } from '../../core';
import { ToggleButtonGroupContext } from './ToggleButtonGroupContext';
import type { ToggleButtonColor, ToggleButtonGroupContextValue, ToggleButtonSize } from './ToggleButtonGroupContext';

/** Valor del grupo: `string | null` en modo exclusivo; `string[]` en modo múltiple. */
export type ToggleButtonGroupValue = string | string[] | null;

/** Props de {@link ToggleButtonGroup}. El resto de atributos va al `<div>` raíz. */
export interface ToggleButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color'> {
  /** Solo un botón activo; el valor es `string | null`. Sin él, la selección es múltiple (`string[]`). */
  exclusive?: boolean;
  /** Valor seleccionado (modo controlado). */
  value?: ToggleButtonGroupValue;
  /** Valor inicial (modo no controlado). */
  defaultValue?: ToggleButtonGroupValue;
  /** Se invoca cuando el usuario cambia la selección (equivale a `mtx:toggle-button-group:change`). */
  onChange?: (event: MouseEvent<HTMLButtonElement>, value: ToggleButtonGroupValue) => void;
  /** Impide deseleccionar el último botón activo: el grupo siempre tiene valor. */
  enforceValueSet?: boolean;
  /** Dirección del grupo y de las flechas del teclado. */
  orientation?: 'horizontal' | 'vertical';
  /** Tamaño heredado por los botones que no fijan el suyo. */
  size?: ToggleButtonSize;
  /** Color heredado por los botones que no fijan el suyo. */
  color?: ToggleButtonColor;
  /** Ocupa todo el ancho y reparte el espacio entre los botones. */
  fullWidth?: boolean;
  /** Deshabilita todos los botones y marca `aria-disabled` en el grupo. */
  disabled?: boolean;
  /** Nombre accesible (`aria-label`). */
  label?: string;
}

/**
 * Normaliza un valor al formato del modo.
 * @param {ToggleButtonGroupValue | undefined} raw Valor recibido.
 * @param {boolean} exclusive Modo exclusivo.
 * @returns {string[]} Valores seleccionados (máximo uno en modo exclusivo).
 */
function toList(raw: ToggleButtonGroupValue | undefined, exclusive: boolean): string[] {
  if (raw === null || raw === undefined || raw === '') return [];
  const list = (Array.isArray(raw) ? raw : [raw]).map(String);
  return exclusive ? list.slice(0, 1) : list;
}

/**
 * Botones habilitados que pertenecen a este grupo (no a grupos anidados).
 * @param {HTMLElement} root Contenedor del grupo.
 * @returns {HTMLButtonElement[]} Botones en orden del DOM.
 */
function groupButtons(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>('button.mtx-toggle-button')).filter(
    (btn) => btn.parentElement?.closest('.mtx-toggle-button-group') === root && !btn.disabled,
  );
}

/**
 * Agrupa ToggleButton con bordes unidos; gestiona la selección y la navegación con flechas, Inicio y Fin.
 */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(props, ref) {
  const {
    exclusive = false,
    value: valueProp,
    defaultValue,
    onChange,
    enforceValueSet = false,
    orientation = 'horizontal',
    size,
    color,
    fullWidth = false,
    disabled = false,
    label,
    role = 'group',
    className,
    children,
    onKeyDown,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootRef, ref);
  const [rawValue, setRawValue] = useControlled<ToggleButtonGroupValue | undefined>({
    controlled: valueProp,
    default: defaultValue ?? (exclusive ? null : []),
    name: 'ToggleButtonGroup',
  });
  const selectedList = toList(rawValue, exclusive);
  const selectedKey = selectedList.join('\u0000');

  /** Elementos de los botones por valor, para ordenar el valor múltiple según el DOM. */
  const registry = useRef(new Map<string, HTMLButtonElement>());
  const register = useEventCallback((buttonValue: string, element: HTMLButtonElement) => {
    registry.current.set(buttonValue, element);
    return () => {
      if (registry.current.get(buttonValue) === element) registry.current.delete(buttonValue);
    };
  });

  const handleButtonClick = useEventCallback((event: MouseEvent<HTMLButtonElement>, buttonValue: string): boolean => {
    let next: ToggleButtonGroupValue;
    if (exclusive) {
      next = selectedList[0] === buttonValue ? null : buttonValue;
      if (next === null && enforceValueSet) return false;
    } else {
      const has = selectedList.includes(buttonValue);
      const list = has ? selectedList.filter((v) => v !== buttonValue) : [...selectedList, buttonValue];
      if (list.length === 0 && enforceValueSet) return false;
      // Orden del DOM, como vanilla; los valores sin botón van al final.
      const position = (a: string, b: string) => {
        const ea = registry.current.get(a);
        const eb = registry.current.get(b);
        if (!ea || !eb) return ea ? -1 : eb ? 1 : 0;
        return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      };
      next = [...list].sort(position);
    }
    setRawValue(next);
    onChange?.(event, next);
    return true;
  });

  const context = useMemo<ToggleButtonGroupContextValue>(() => {
    const set = new Set(selectedKey ? selectedKey.split('\u0000') : []);
    return {
      size,
      color,
      disabled,
      isSelected: (v: string) => set.has(v),
      onButtonClick: handleButtonClick,
      register,
    };
  }, [size, color, disabled, selectedKey, handleButtonClick, register]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const root = rootRef.current;
    if (event.defaultPrevented || !root) return;
    const enabled = groupButtons(root);
    const index = enabled.indexOf(event.target as HTMLButtonElement);
    if (index === -1) return;
    const vertical = orientation === 'vertical';
    const rtl = getComputedStyle(root).direction === 'rtl';
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    let target: HTMLButtonElement | undefined;
    if (event.key === nextKey) target = enabled[(index + 1) % enabled.length];
    else if (event.key === prevKey) target = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  return (
    <div
      ref={handleRef}
      role={role}
      aria-label={label}
      aria-disabled={disabled ? true : undefined}
      {...rest}
      className={cx(
        'mtx-toggle-button-group',
        orientation === 'vertical' && 'mtx-toggle-button-group--vertical',
        fullWidth && 'mtx-toggle-button-group--full-width',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      <ToggleButtonGroupContext.Provider value={context}>{children}</ToggleButtonGroupContext.Provider>
    </div>
  );
});
ToggleButtonGroup.displayName = 'ToggleButtonGroup';
