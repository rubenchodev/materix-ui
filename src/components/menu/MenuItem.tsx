'use client';
import { forwardRef, useContext, useId, useMemo } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  HTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/menu.css';
import '@rubenchodev/materix-ui/components/list.css';
import '@rubenchodev/materix-ui/components/typography.css';
import { cx, useControlled, useRipple } from '../../core';
import { MenuGroupContext, SubmenuTriggerContext, useMenuListContext } from './MenuContext';
import type { MenuGroupContextValue } from './MenuContext';

/** Rol del ítem: acción, casilla o opción única. */
export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

/** Propiedades propias de {@link MenuItem}. */
export interface MenuItemOwnProps {
  /** Icono inicial: nombre de Material Icons o nodo (equivale a `data-icon`). */
  icon?: ReactNode;
  /** Imagen inicial de 24px (alternativa a `icon`). */
  image?: string;
  /** Texto alternativo de `image` (decorativa por defecto). */
  imageAlt?: string;
  /** Texto secundario bajo el principal. */
  secondary?: ReactNode;
  /** Atajo de teclado o metadato alineado al final (p. ej. `⌘X`). */
  shortcut?: ReactNode;
  /** Valor del ítem (en `onSelect` y en `MenuGroup`). */
  value?: string;
  /** Rol ARIA: `menuitem` (por defecto), `menuitemcheckbox` o `menuitemradio`. */
  role?: MenuItemRole;
  /** Estado marcado controlado (`menuitemcheckbox` / `menuitemradio`). */
  checked?: boolean;
  /** Estado marcado inicial no controlado. */
  defaultChecked?: boolean;
  /** Cambio del estado marcado. */
  onCheckedChange?: (checked: boolean) => void;
  /** Resaltado como opción actual; recibe el foco al abrir con teclado. */
  selected?: boolean;
  /** Deshabilitado (`aria-disabled`, fuera de la navegación). */
  disabled?: boolean;
  /** Compacto (32px); se hereda de `Menu dense`. */
  dense?: boolean;
  /** Quita el padding horizontal. */
  disableGutters?: boolean;
  /** Se pinta como separador `role="separator"` (equivale a `data-divider`). */
  divider?: boolean;
  /** Desactiva el ripple. */
  disableRipple?: boolean;
  /** Con `href` el ítem es un `<a>`. */
  href?: string;
  /** Texto principal. */
  children?: ReactNode;
}

/** Props de {@link MenuItem}; `component` cambia la etiqueta (por defecto `div`, o `a` con `href`). */
export type MenuItemProps<C extends ElementType = 'div'> = MenuItemOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof MenuItemOwnProps | 'component'>;

type MenuItemComponent = (<C extends ElementType = 'div'>(
  props: MenuItemProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Pinta el icono inicial (`.mtx-menu-item__icon`).
 * @param {ReactNode} icon Nombre o nodo.
 * @returns {ReactNode} Icono.
 */
function renderIcon(icon: ReactNode): ReactNode {
  return (
    <span className="mtx-menu-item__icon">
      {typeof icon === 'string' ? (
        <span className="material-icons" aria-hidden="true">
          {icon}
        </span>
      ) : (
        icon
      )}
    </span>
  );
}

/**
 * Opción de un menú (MenuItem de MUI): icono, texto secundario o atajo, selección, casillas
 * y opciones únicas, estado deshabilitado, densidad y ripple.
 */
export const MenuItem = forwardRef(function MenuItem(
  {
    component,
    icon,
    image,
    imageAlt = '',
    secondary,
    shortcut,
    value,
    role = 'menuitem',
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    selected = false,
    disabled = false,
    dense,
    disableGutters = false,
    divider = false,
    disableRipple = false,
    href,
    className,
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  }: MenuItemProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const list = useMenuListContext();
  const group = useContext(MenuGroupContext);
  const trigger = useContext(SubmenuTriggerContext);
  const ownKey = useId();
  const key = trigger?.itemKey ?? ownKey;
  const checkable = role === 'menuitemcheckbox' || role === 'menuitemradio';
  const groupControls = role === 'menuitemradio' && group != null && group.value !== undefined && value !== undefined;
  const [checkedState, setChecked] = useControlled({
    controlled: groupControls ? group!.value === value : checkedProp,
    default: defaultChecked,
    name: 'MenuItem',
    state: 'checked',
  });
  const checked = groupControls ? group!.value === value : checkedState;
  const ripple = useRipple<HTMLElement>({ disabled: disabled || disableRipple });

  if (divider) {
    const dividerRest = rest as HTMLAttributes<HTMLElement>;
    return (
      <div ref={ref as ForwardedRef<HTMLDivElement>} {...dividerRest} role="separator" className={cx('mtx-menu-item--divider', className)} />
    );
  }

  const Root: ElementType = component ?? (href ? 'a' : 'div');
  const isDense = dense ?? Boolean(list?.dense);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented || trigger) return;
    let next: boolean | undefined;
    if (checkable) {
      next = role === 'menuitemradio' ? true : !checked;
      setChecked(next);
      if (role === 'menuitemradio' && value !== undefined) group?.setValue(value);
      if (next !== checked) onCheckedChange?.(next);
    }
    const detail = { item: event.currentTarget, value, ...(next !== undefined ? { checked: next } : {}) };
    list?.select(detail, event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    onMouseEnter?.(event);
    list?.hoverItem(key);
  };
  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    onMouseLeave?.(event);
    list?.leaveItem();
  };

  const compose =
    (own: ((e: PointerEvent<HTMLElement>) => void) | undefined, rippleHandler: (e: PointerEvent<HTMLElement>) => void) =>
    (event: PointerEvent<HTMLElement>) => {
      own?.(event);
      rippleHandler(event);
    };

  const extra: Record<string, unknown> = {};
  if (disabled) extra['aria-disabled'] = 'true';
  if (checkable) extra['aria-checked'] = checked ? 'true' : 'false';
  if (href !== undefined) extra.href = href;
  const expandIcon = list?.rtl ? 'chevron_left' : 'chevron_right';

  return (
    <Root
      ref={ref}
      tabIndex={-1}
      {...rest}
      {...extra}
      role={role}
      className={cx(
        'mtx-menu-item',
        isDense && 'mtx-menu-item--dense',
        disableGutters && 'mtx-menu-item--disable-gutters',
        selected && 'mtx-menu-item--selected',
        disabled && 'mtx-menu-item--disabled',
        checkable && checked && 'mtx-menu-item--checked',
        className,
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={compose(onPointerDown, ripple.handlers.onPointerDown)}
      onPointerUp={compose(onPointerUp, ripple.handlers.onPointerUp)}
      onPointerLeave={compose(onPointerLeave, ripple.handlers.onPointerLeave)}
      onPointerCancel={compose(onPointerCancel, ripple.handlers.onPointerCancel)}
    >
      {icon != null && icon !== false ? renderIcon(icon) : image ? <img className="mtx-menu-item__image" src={image} alt={imageAlt} /> : null}
      {secondary != null ? (
        <span className="mtx-list-item-text">
          <span className="mtx-list-item-text__primary">{children}</span>
          <span className="mtx-list-item-text__secondary">{secondary}</span>
        </span>
      ) : (
        children
      )}
      {shortcut != null ? (
        <span
          className="mtx-menu-item__shortcut mtx-typography mtx-typography--body2 mtx-typography--color-text-secondary"
          style={{ marginInlineStart: 'auto', paddingInlineStart: 16 }}
        >
          {shortcut}
        </span>
      ) : null}
      {trigger ? (
        <span className="material-icons mtx-menu-item__expand" aria-hidden="true">
          {expandIcon}
        </span>
      ) : null}
      {checkable ? (
        <span className="material-icons mtx-menu-item__check" aria-hidden="true">
          check
        </span>
      ) : null}
      {ripple.element}
    </Root>
  );
}) as MenuItemComponent;

MenuItem.displayName = 'MenuItem';

/** Props de {@link MenuDivider}. */
export type MenuDividerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Separador entre grupos de opciones (`role="separator"`, no enfocable).
 */
export const MenuDivider = forwardRef<HTMLDivElement, MenuDividerProps>(function MenuDivider({ className, ...rest }, ref) {
  return <div ref={ref} {...rest} role="separator" className={cx('mtx-menu-item--divider', className)} />;
});

MenuDivider.displayName = 'MenuDivider';

/** Props de {@link MenuGroup}. */
export interface MenuGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Valor marcado de los `menuitemradio` del grupo (controlado). */
  value?: string | null;
  /** Valor marcado inicial (no controlado). */
  defaultValue?: string | null;
  /** Cambio del valor marcado. */
  onChange?: (value: string) => void;
  /** Nombre accesible del grupo. */
  label?: string;
  /** Ítems del grupo. */
  children?: ReactNode;
}

/**
 * Agrupa opciones (`role="group"`); con `value`/`defaultValue` gestiona la opción única
 * de sus `MenuItem role="menuitemradio"`.
 */
export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { value: valueProp, defaultValue, onChange, label, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const managed = valueProp !== undefined || defaultValue !== undefined;
  const [value, setValue] = useControlled<string | null | undefined>({
    controlled: valueProp,
    default: defaultValue,
    name: 'MenuGroup',
  });
  const context = useMemo<MenuGroupContextValue>(
    () => ({
      value: managed ? (value ?? null) : undefined,
      setValue: (next) => {
        if (next === value) return;
        setValue(next);
        onChange?.(next);
      },
    }),
    [managed, value, setValue, onChange],
  );
  return (
    <MenuGroupContext.Provider value={context}>
      <div ref={ref} role="group" aria-label={ariaLabel ?? label} {...rest}>
        {children}
      </div>
    </MenuGroupContext.Provider>
  );
});

MenuGroup.displayName = 'MenuGroup';
