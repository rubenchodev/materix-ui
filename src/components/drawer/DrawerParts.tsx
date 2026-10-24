'use client';
/**
 * Piezas BEM del Drawer (cabecera, panel y pie) y submenú colapsable para la navegación.
 */
import { forwardRef, useId } from 'react';
import type { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { Collapse, cx, useControlled } from '../../core';
import { List, ListItemButton } from '../list';
import type { ListItemButtonProps } from '../list';

/** Props de {@link DrawerHeader}. */
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

/**
 * Cabecera manual (`.mtx-drawer__header`); el Drawer la coloca fuera del panel desplazable.
 */
export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('mtx-drawer__header', className)} {...rest} />;
});

/** Props de {@link DrawerContent}. */
export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Relleno de 20px para formularios o texto (`.mtx-drawer__content--padded`). */
  padded?: boolean;
}

/**
 * Panel desplazable manual (`.mtx-drawer__content`). Dentro de un Drawer actúa como marcador:
 * el Drawer renderiza el panel con estas props y le añade la semántica de diálogo.
 */
export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  { padded = false, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('mtx-drawer__content', padded && 'mtx-drawer__content--padded', className)} {...rest} />
  );
});

/** Props de {@link DrawerFooter}. */
export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Apila el contenido en columna (`.mtx-drawer__footer--column`). */
  column?: boolean;
}

/**
 * Pie manual (`.mtx-drawer__footer`), fijo bajo el panel desplazable.
 */
export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { column = false, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('mtx-drawer__footer', column && 'mtx-drawer__footer--column', className)} {...rest} />;
});

/** Props de {@link DrawerSubmenu}. */
export interface DrawerSubmenuProps {
  /** Texto del elemento que despliega el submenú. */
  label: ReactNode;
  /** Icono inicial (nombre de Material Icons o nodo). */
  icon?: ReactNode;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto inicialmente (no controlado). */
  defaultOpen?: boolean;
  /** Cambio de estado solicitado por el usuario. */
  onToggle?: (open: boolean, event: ReactMouseEvent<HTMLElement>) => void;
  /** Nivel de anidación de la lista interna (`true` = 1, `2` = segundo nivel). */
  nested?: true | 2;
  /** Id del contenedor colapsable (por defecto, generado). */
  id?: string;
  /** Props extra del botón que despliega. */
  buttonProps?: Partial<ListItemButtonProps<'button'>>;
  /** Elementos del submenú (normalmente `ListItemButton`). */
  children?: ReactNode;
}

/**
 * Submenú colapsable de navegación (equivale a `data-mtx-collapse-trigger` + `.mtx-collapse` de vanilla):
 * botón con `aria-expanded`/`aria-controls`, indicador que rota 90° y lista anidada con `Collapse`.
 */
export function DrawerSubmenu({
  label,
  icon,
  open: openProp,
  defaultOpen = false,
  onToggle,
  nested = true,
  id: idProp,
  buttonProps,
  children,
}: DrawerSubmenuProps) {
  const autoId = useId();
  const id = idProp ?? `mtx-drawer-submenu-${autoId.replace(/:/g, '')}`;
  const [open, setOpen] = useControlled({ controlled: openProp, default: defaultOpen, name: 'DrawerSubmenu', state: 'open' });

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    const next = !open;
    setOpen(next);
    onToggle?.(next, event);
  };

  return (
    <>
      <ListItemButton
        {...buttonProps}
        icon={icon}
        primary={label}
        disableSelect
        aria-expanded={open}
        aria-controls={id}
        onClick={handleClick}
      >
        <span className="material-icons mtx-collapse-indicator" aria-hidden="true">
          chevron_right
        </span>
      </ListItemButton>
      <Collapse in={open}>
        <div id={id}>
          <List component="div" nested={nested}>
            {children}
          </List>
        </div>
      </Collapse>
    </>
  );
}
