'use client';
import { forwardRef, useId } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from 'react';
import '@rubenchodev/materix-ui/components/list.css';
import { cx, useRipple } from '../../core';
import { composePointerHandlers, renderListItemContent } from './content';
import type { ListItemContentProps } from './content';
import { useListContext } from './ListContext';

/** Roles en los que `aria-selected` es válido según WAI-ARIA. */
const SELECTABLE_ROLES = ['option', 'tab', 'treeitem', 'gridcell', 'row', 'columnheader', 'rowheader'];

/** Propiedades propias de {@link ListItemButton}. */
export interface ListItemButtonOwnProps extends Omit<ListItemContentProps, 'secondaryAction'> {
  /** Selección controlada; sin ella la decide la `List` (valor seleccionado). */
  selected?: boolean;
  /** Deshabilita la fila (`disabled` en `<button>`, `aria-disabled` y `tabindex=-1` en otros). */
  disabled?: boolean;
  /** Valor de la fila para la selección de la `List` (por defecto un id generado). */
  value?: string;
  /** No se selecciona al hacer clic (equivale a `data-no-select`). */
  disableSelect?: boolean;
  /** Con `href` la fila es un `<a>`. */
  href?: string;
  /** Fila compacta (se hereda de `List dense`). */
  dense?: boolean;
  /** Quita el padding horizontal. */
  disableGutters?: boolean;
  /** Borde inferior de 1px. */
  divider?: boolean;
  /** `flex-start` alinea el icono o avatar con la primera línea. */
  alignItems?: 'center' | 'flex-start';
  /** Desactiva el ripple. */
  disableRipple?: boolean;
}

/** Propiedades de {@link ListItemButton}; `component` cambia la etiqueta (por defecto `button`, o `a` con `href`). */
export type ListItemButtonProps<C extends ElementType = 'button'> = ListItemButtonOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListItemButtonOwnProps | 'component'>;

type ListItemButtonComponent = (<C extends ElementType = 'button'>(
  props: ListItemButtonProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Fila interactiva de una lista (ListItemButton de MUI): hover, foco, ripple y selección.
 */
export const ListItemButton = forwardRef(function ListItemButton(
  {
    component,
    selected: selectedProp,
    disabled = false,
    value,
    disableSelect = false,
    href,
    dense,
    disableGutters = false,
    divider = false,
    alignItems = 'center',
    disableRipple = false,
    icon,
    avatar,
    avatarAlt,
    primary,
    secondary,
    className,
    children,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  }: ListItemButtonProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? (href ? 'a' : 'button');
  const isButton = Root === 'button';
  const isAnchor = Root === 'a';
  const list = useListContext();
  const autoValue = useId();
  const key = value ?? autoValue;
  const selection = list?.selection;
  const selected = selectedProp ?? (selection ? selection.value === key : false);
  const isDense = dense ?? Boolean(list?.dense);
  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });
  const props = rest as Record<string, unknown>;
  const role = props.role as string | undefined;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented || disableSelect || !selection || !selection.selectable) return;
    selection.select(key, event.currentTarget);
  };

  const extra: Record<string, unknown> = {};
  if (isButton) {
    extra.type = (props.type as string | undefined) ?? 'button';
    if (disabled) extra.disabled = true;
  } else if (disabled) {
    extra['aria-disabled'] = 'true';
    extra.tabIndex = -1;
  } else if (!isAnchor && !role) {
    // Elemento no nativo sin rol: se comporta como botón (foco, Enter y Espacio).
    extra.role = 'button';
    if (props.tabIndex === undefined) extra.tabIndex = 0;
  }
  const emulateButton = !isButton && !isAnchor && !role;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!emulateButton || disabled || event.defaultPrevented || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  if (isAnchor && href !== undefined) extra.href = href;
  if (role && SELECTABLE_ROLES.includes(role)) {
    extra['aria-selected'] = selected ? 'true' : 'false';
  } else if (selected && props['aria-current'] === undefined) {
    extra['aria-current'] = isAnchor || role === 'link' ? 'page' : 'true';
  }

  return (
    <Root
      ref={ref}
      {...rest}
      {...extra}
      className={cx(
        'mtx-list-item',
        'mtx-list-item-button',
        isDense && 'mtx-list-item--dense',
        disableGutters && 'mtx-list-item--disable-gutters',
        divider && 'mtx-list-item--divider',
        alignItems === 'flex-start' && 'mtx-list-item--align-start',
        disabled && 'mtx-list-item--disabled',
        selected && 'mtx-list-item--selected',
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...composePointerHandlers(ripple.handlers, { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel })}
    >
      {renderListItemContent({ icon, avatar, avatarAlt, primary, secondary, children })}
      {ripple.element}
    </Root>
  );
}) as ListItemButtonComponent;

ListItemButton.displayName = 'ListItemButton';
