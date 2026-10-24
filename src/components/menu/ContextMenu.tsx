'use client';
import { useEffect } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import { resolveTarget, useEventCallback } from '../../core';
import type { ElementTarget } from '../../core';
import { Menu } from './Menu';
import type { MenuProps } from './Menu';
import type { MenuSelectDetail } from './MenuContext';
import { MenuDivider, MenuItem } from './MenuItem';
import { Submenu } from './Submenu';
import { useContextMenu } from './useMenu';

/** Definición de un ítem de {@link ContextMenu} (formato de `createContextMenu` de vanilla). */
export interface ContextMenuItem {
  /** Texto del ítem. */
  label?: ReactNode;
  /** Icono de Material Icons o nodo. */
  icon?: ReactNode;
  /** Imagen de 24px (si no hay `icon`). */
  image?: string;
  /** Atajo alineado al final. */
  shortcut?: ReactNode;
  /** Valor devuelto en `onSelect`. */
  value?: string;
  /** Deshabilitado. */
  disabled?: boolean;
  /** Separador en lugar de ítem. */
  divider?: boolean;
  /** Acción al elegir el ítem. */
  action?: (detail: MenuSelectDetail, event: SyntheticEvent) => void;
  /** Ítems de un submenú. */
  submenu?: ContextMenuItem[];
}

/** Props de {@link ContextMenu}. */
export interface ContextMenuProps
  extends Omit<MenuProps, 'open' | 'anchorEl' | 'anchorPosition' | 'children' | 'autoFocusItem'> {
  /** Área (o áreas) que abren el menú con clic derecho: elemento, ref o selector CSS. */
  target: ElementTarget<Element> | string;
  /** Definición de los ítems. */
  items: ContextMenuItem[];
}

/**
 * Pinta recursivamente los ítems de un menú contextual.
 * @param {ContextMenuItem[]} items Definición.
 * @param {string} prefix Prefijo de las claves.
 * @returns {ReactNode[]} Ítems.
 */
function renderItems(items: ContextMenuItem[], prefix: string): ReactNode[] {
  return items.map((item, index) => {
    const key = `${prefix}${index}`;
    if (item.divider) return <MenuDivider key={key} />;
    if (item.submenu && item.submenu.length > 0) {
      return (
        <Submenu key={key} label={item.label} icon={item.icon} image={item.image} disabled={item.disabled}>
          {renderItems(item.submenu, `${key}-`)}
        </Submenu>
      );
    }
    return (
      <MenuItem
        key={key}
        icon={item.icon}
        image={item.image}
        shortcut={item.shortcut}
        value={item.value}
        disabled={item.disabled}
        onClick={(event) => item.action?.({ item: event.currentTarget, value: item.value }, event)}
      >
        {item.label}
      </MenuItem>
    );
  });
}

/**
 * Menú contextual declarativo (equivale a `Menu.createContextMenu(selector, items)`): se abre con
 * clic derecho en la posición del puntero, admite submenús y ejecuta la `action` de cada ítem.
 */
export function ContextMenu({ target, items, onClose, ...menuProps }: ContextMenuProps) {
  const context = useContextMenu();
  const handleContextMenu = useEventCallback((event: MouseEvent) => context.onContextMenu(event));

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const nodes: Element[] =
      typeof target === 'string'
        ? Array.from(document.querySelectorAll(target))
        : ([resolveTarget(target)].filter(Boolean) as Element[]);
    nodes.forEach((node) => node.addEventListener('contextmenu', handleContextMenu as EventListener));
    return () => nodes.forEach((node) => node.removeEventListener('contextmenu', handleContextMenu as EventListener));
  }, [target, handleContextMenu]);

  return (
    <Menu
      {...menuProps}
      {...context.menuProps}
      onClose={(event, reason) => {
        context.closeMenu();
        onClose?.(event, reason);
      }}
    >
      {renderItems(items, 'item-')}
    </Menu>
  );
}
