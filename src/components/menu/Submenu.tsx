'use client';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useForkRef } from '../../core';
import { Menu } from './Menu';
import type { MenuProps } from './Menu';
import { SubmenuTriggerContext, useMenuListContext } from './MenuContext';
import type { SubmenuTriggerContextValue } from './MenuContext';
import { MenuItem } from './MenuItem';
import type { MenuItemOwnProps } from './MenuItem';
import { focusInitial } from './utils';

/** Retardo (ms) del hover antes de abrir el submenú (como vanilla). */
const HOVER_DELAY = 100;

/** Props de {@link Submenu}. Las props de ítem van al disparador. */
export interface SubmenuProps
  extends Omit<MenuItemOwnProps, 'children' | 'role' | 'checked' | 'defaultChecked' | 'onCheckedChange' | 'divider' | 'href'> {
  /** Texto del ítem que abre el submenú. */
  label: ReactNode;
  /** Ítems del submenú. */
  children?: ReactNode;
  /** Props del `Menu` anidado (id, className, slotProps…). */
  menuProps?: Partial<Omit<MenuProps, 'open' | 'anchorEl' | 'submenu' | 'children'>>;
  /** Clases del disparador. */
  className?: string;
}

/**
 * Ítem que despliega un menú anidado a su lado: hover (100 ms), clic, flecha derecha, Enter o Espacio;
 * la flecha izquierda o Escape vuelven al ítem. En RTL se abre hacia la izquierda y las flechas se invierten.
 */
export const Submenu = forwardRef<HTMLDivElement, SubmenuProps>(function Submenu(
  { label, children, menuProps, disabled = false, ...itemProps },
  ref,
) {
  const list = useMenuListContext();
  const key = useId();
  const menuIdAuto = useId();
  const menuId = menuProps?.id ?? `mtx-submenu-${menuIdAuto.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [triggerEl, setTriggerEl] = useState<HTMLDivElement | null>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, setTriggerEl);
  const childListRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const open = Boolean(list && list.openKey === key);
  const focus = list?.submenuFocus ?? 'none';
  const rtl = list?.rtl ?? false;

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const trigger = useMemo<SubmenuTriggerContextValue>(() => ({ itemKey: key }), [key]);

  const openWith = (mode: 'none' | 'menu' | 'item') => {
    if (disabled || !list) return;
    clearTimeout(hoverTimer.current);
    if (open) {
      if (mode === 'item' && childListRef.current) focusInitial(childListRef.current, true);
      else if (mode === 'menu' && childListRef.current) childListRef.current.focus({ preventScroll: true });
      return;
    }
    list.openSubmenu(key, mode);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => openWith('none'), HOVER_DELAY);
  };
  const handleMouseLeave = () => clearTimeout(hoverTimer.current);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    openWith(event.detail === 0 ? 'item' : 'menu');
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openWith('item');
    }
  };

  return (
    <>
      <SubmenuTriggerContext.Provider value={trigger}>
        <MenuItem
          {...itemProps}
          ref={handleRef}
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {label}
        </MenuItem>
      </SubmenuTriggerContext.Provider>
      <SubmenuTriggerContext.Provider value={null}>
        <Menu
          {...menuProps}
          ref={childListRef}
          id={menuId}
          submenu
          open={open}
          anchorEl={triggerEl}
          restoreFocusTo={triggerEl}
          autoFocus={focus !== 'none'}
          autoFocusItem={focus === 'item'}
          onClose={(event, reason) => {
            menuProps?.onClose?.(event, reason);
            list?.closeSubmenu(key);
          }}
        >
          {children}
        </Menu>
      </SubmenuTriggerContext.Provider>
    </>
  );
});

Submenu.displayName = 'Submenu';
