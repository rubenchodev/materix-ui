'use client';
import { forwardRef, useContext } from 'react';
import type {
  ButtonHTMLAttributes,
  FocusEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import { cx, useRipple } from '../../core';
import { TabsContext, idSegment } from './TabContext';
import type { TabValue } from './TabContext';

/** Posición del icono respecto al texto. */
export type TabIconPosition = 'start' | 'end';

/** Props de {@link Tab}. El resto de atributos va al `<button role="tab">`. */
export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Valor de la pestaña (por defecto, su índice dentro de `Tabs`). */
  value?: TabValue;
  /** Texto de la pestaña (`children` también sirve). */
  label?: ReactNode;
  /** Icono: nombre de Material Icons o nodo propio (SVG…). Sin texto, añade `aria-label`. */
  icon?: ReactNode;
  /** Posición del icono: `start` (por defecto) o `end`. */
  iconPosition?: TabIconPosition;
  /** Deshabilita la pestaña (`disabled` + `aria-disabled`); el teclado la salta. */
  disabled?: boolean;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
}

/**
 * Pestaña (Tab de MUI): `<button role="tab">` con ripple, icono opcional y roving tabindex.
 * Debe usarse dentro de {@link Tabs}.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(props, ref) {
  const {
    value,
    label,
    icon,
    iconPosition = 'start',
    disabled = false,
    disableRipple = false,
    className,
    children,
    id: idProp,
    'aria-controls': ariaControls,
    onClick,
    onFocus,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props;

  const tabs = useContext(TabsContext);
  const ripple = useRipple<HTMLButtonElement>({ disabled: disabled || disableRipple });
  const selected = !!tabs && value !== undefined && tabs.value === value;
  const segment = value !== undefined ? idSegment(value) : undefined;
  const id = idProp ?? (tabs && segment !== undefined ? `${tabs.idPrefix}-tab-${segment}` : undefined);
  const controls =
    ariaControls ??
    (tabs && value !== undefined && segment !== undefined && tabs.hasPanel(value)
      ? `${tabs.idPrefix}-panel-${segment}`
      : undefined);

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || !tabs || value === undefined) return;
    tabs.select(event, value);
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event);
    if (tabs?.selectionFollowsFocus && !selected && !disabled && value !== undefined) tabs.select(event, value);
  };

  const iconNode =
    typeof icon === 'string' ? (
      <span className="material-icons mtx-tab__icon" aria-hidden="true">
        {icon}
      </span>
    ) : (
      icon
    );
  const text = label ?? children;

  return (
    <button
      type="button"
      {...rest}
      ref={ref}
      id={id}
      className={cx('mtx-tab', selected && 'mtx-tab--active', className)}
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      tabIndex={!disabled && tabs?.tabStop === value && value !== undefined ? 0 : -1}
      onClick={handleClick}
      onFocus={handleFocus}
      onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(event);
        ripple.handlers.onPointerDown(event);
      }}
      onPointerUp={(event: ReactPointerEvent<HTMLButtonElement>) => {
        onPointerUp?.(event);
        ripple.handlers.onPointerUp(event);
      }}
      onPointerLeave={(event: ReactPointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);
        ripple.handlers.onPointerLeave(event);
      }}
      onPointerCancel={(event: ReactPointerEvent<HTMLButtonElement>) => {
        onPointerCancel?.(event);
        ripple.handlers.onPointerCancel(event);
      }}
    >
      {iconPosition === 'start' ? iconNode : null}
      {text}
      {iconPosition === 'end' ? iconNode : null}
      {ripple.element}
    </button>
  );
});
