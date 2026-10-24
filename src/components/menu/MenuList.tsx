'use client';
import { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from 'react';
import '@rubenchodev/materix-ui/components/menu.css';
import { cx, useEnhancedEffect, useEventCallback, useForkRef } from '../../core';
import { MenuInternalContext, MenuListContext } from './MenuContext';
import type { MenuListContextValue, MenuSelectDetail, SubmenuFocus } from './MenuContext';
import { focusInitial, getEnabledItems, getItemText, installModality, isKeyboardModality } from './utils';

/** Props de {@link MenuList}. */
export interface MenuListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Ítems compactos (32px). */
  dense?: boolean;
  /** Enfoca la lista al montarse (uso independiente, fuera de `Menu`). */
  autoFocus?: boolean;
  /** Con `autoFocus`, enfoca el ítem seleccionado o el primero (por defecto si se llegó con teclado). */
  autoFocusItem?: boolean;
  /** Selección de un ítem (equivalente a `mtx:menu:select`). */
  onSelect?: (detail: MenuSelectDetail, event: SyntheticEvent) => void;
  /** Ítems (`MenuItem`, `MenuDivider`, `MenuGroup`, `Submenu`). */
  children?: ReactNode;
}

/**
 * Lista `role="menu"` con navegación WAI-ARIA (flechas, Home/End, búsqueda por tipeo, Enter/Espacio)
 * y foco itinerante. `Menu` la usa internamente; también sirve sola dentro de un `Paper`.
 */
export const MenuList = forwardRef<HTMLDivElement, MenuListProps>(function MenuList(props, ref) {
  const {
    dense = false,
    autoFocus = false,
    autoFocusItem,
    onSelect,
    className,
    children,
    onKeyDown,
    tabIndex = -1,
    ...rest
  } = props;
  const internal = useContext(MenuInternalContext);
  const listRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useForkRef(listRef, ref);
  const rtl = internal?.rtl ?? false;
  const [sub, setSub] = useState<{ key: string | null; focus: SubmenuFocus }>({ key: null, focus: 'none' });
  const subKey = useRef<string | null>(null);
  subKey.current = sub.key;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    installModality();
    return () => clearTimeout(closeTimer.current);
  }, []);

  // Al cerrarse el menú se cierra también el submenú abierto.
  const menuOpen = internal ? internal.open : true;
  useEnhancedEffect(() => {
    if (!menuOpen) {
      clearTimeout(closeTimer.current);
      setSub((prev) => (prev.key === null ? prev : { key: null, focus: 'none' }));
    }
  }, [menuOpen]);

  // Uso independiente: foco inicial al montar.
  useEnhancedEffect(() => {
    if (internal || !autoFocus || !listRef.current) return;
    focusInitial(listRef.current, autoFocusItem ?? isKeyboardModality());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useEventCallback((detail: MenuSelectDetail, event: SyntheticEvent) => {
    onSelect?.(detail, event);
    internal?.select(detail, event);
  });

  const context = useMemo<MenuListContextValue>(
    () => ({
      dense,
      rtl,
      openKey: sub.key,
      submenuFocus: sub.focus,
      openSubmenu: (key, focus) => {
        clearTimeout(closeTimer.current);
        setSub({ key, focus });
      },
      closeSubmenu: (key) => {
        clearTimeout(closeTimer.current);
        setSub((prev) => (prev.key === null || (key && prev.key !== key) ? prev : { key: null, focus: 'none' }));
      },
      hoverItem: (key) => {
        if (!subKey.current || subKey.current === key) return;
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
          setSub((prev) => (prev.key && prev.key !== key ? { key: null, focus: 'none' } : prev));
        }, 50);
      },
      leaveItem: () => clearTimeout(closeTimer.current),
      select,
    }),
    [dense, rtl, sub.key, sub.focus, select],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const list = listRef.current;
    const target = event.target as Element;
    // Los eventos de submenús portados llegan por el árbol de React: solo se atienden los propios.
    if (event.defaultPrevented || !list || !list.contains(target) || target.closest('[role="menu"]') !== list) return;
    const { key } = event;
    if (key === 'Tab') {
      internal?.requestTab(event);
      return;
    }
    const enabled = getEnabledItems(list);
    const active = document.activeElement as HTMLElement | null;
    if (key === (rtl ? 'ArrowRight' : 'ArrowLeft') && internal?.isSubmenu) {
      event.preventDefault();
      internal.requestClose(event, 'submenuClose');
      return;
    }
    if (!enabled.length) return;
    const current = active ? enabled.indexOf(active) : -1;
    let next = -1;
    if (key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % enabled.length;
    else if (key === 'ArrowUp') next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
    else if (key === 'Home') next = 0;
    else if (key === 'End') next = enabled.length - 1;
    if (next >= 0) {
      event.preventDefault();
      // El foco vuelve a esta lista: se cierra el submenú abierto con hover.
      if (subKey.current) context.closeSubmenu();
      enabled[next].focus();
      return;
    }
    if (key === 'Enter' || key === ' ') {
      if (active && active.classList.contains('mtx-menu-item') && list.contains(active)) {
        event.preventDefault();
        active.click();
      }
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const query = key.toLocaleLowerCase();
      const ordered = enabled.slice(current + 1).concat(enabled.slice(0, current + 1));
      const match = ordered.find((item) => getItemText(item).trim().toLocaleLowerCase().startsWith(query));
      if (match) {
        event.preventDefault();
        match.focus();
      }
    }
  };

  return (
    <MenuListContext.Provider value={context}>
      <div
        ref={handleRef}
        role="menu"
        tabIndex={tabIndex}
        {...rest}
        className={cx('mtx-menu', className)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </MenuListContext.Provider>
  );
});

MenuList.displayName = 'MenuList';
