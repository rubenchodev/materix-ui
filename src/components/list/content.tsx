import { Children } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { RippleHandlers } from '../../core';
import { Avatar } from '../avatar';
import { ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from './ListParts';

/** Atajos de contenido compartidos por `ListItem` y `ListItemButton` (sintaxis simplificada de vanilla). */
export interface ListItemContentProps {
  /** Icono inicial: nombre de Material Icon o nodo (se envuelve en `ListItemIcon`). */
  icon?: ReactNode;
  /** Avatar inicial: URL de imagen o nodo (p. ej. un `Avatar`), envuelto en `ListItemAvatar`. */
  avatar?: ReactNode;
  /** Texto alternativo del avatar cuando `avatar` es una URL (decorativo por defecto). */
  avatarAlt?: string;
  /** Texto principal explícito; sin él, los `children` de solo texto hacen de texto principal. */
  primary?: ReactNode;
  /** Texto secundario. */
  secondary?: ReactNode;
  /** Acción al final de la fila (envuelta en `ListItemSecondaryAction`). */
  secondaryAction?: ReactNode;
}

/** `true` si los hijos son solo texto (cadenas o números). */
function isTextOnly(children: ReactNode): boolean {
  const items = Children.toArray(children);
  return items.length > 0 && items.every((child) => typeof child === 'string' || typeof child === 'number');
}

/**
 * Construye la anatomía de la fila: avatar, icono, texto, resto de hijos y acción secundaria.
 * @param {ListItemContentProps & {children?: ReactNode}} props Atajos e hijos.
 * @returns {ReactNode} Contenido.
 */
export function renderListItemContent({
  icon,
  avatar,
  avatarAlt,
  primary,
  secondary,
  secondaryAction,
  children,
}: ListItemContentProps & { children?: ReactNode }): ReactNode {
  const hasSecondary = secondary != null && secondary !== '' && secondary !== false;
  let text: ReactNode = null;
  let rest: ReactNode = children;
  if (primary !== undefined) {
    text = <ListItemText primary={primary} secondary={secondary} />;
  } else if (hasSecondary || isTextOnly(children)) {
    text = <ListItemText primary={children} secondary={secondary} />;
    rest = null;
  }
  return (
    <>
      {avatar != null && (
        <ListItemAvatar>
          {typeof avatar === 'string' ? (
            <Avatar component="span" src={avatar} alt={avatarAlt ?? ''} />
          ) : (
            avatar
          )}
        </ListItemAvatar>
      )}
      {icon != null && (typeof icon === 'string' ? <ListItemIcon icon={icon} /> : <ListItemIcon>{icon}</ListItemIcon>)}
      {text}
      {rest}
      {secondaryAction != null && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
    </>
  );
}

/** Manejadores de puntero del usuario que se combinan con el ripple. */
export interface PointerHandlers {
  onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLElement>) => void;
}

/**
 * Combina los manejadores de puntero del usuario con los del ripple.
 * @param {RippleHandlers} ripple Manejadores de `useRipple`.
 * @param {PointerHandlers} user Manejadores recibidos por props.
 * @returns {Required<PointerHandlers>} Manejadores combinados.
 */
export function composePointerHandlers(
  ripple: RippleHandlers<HTMLElement>,
  user: PointerHandlers,
): Required<PointerHandlers> {
  return {
    onPointerDown: (event) => {
      user.onPointerDown?.(event);
      ripple.onPointerDown(event);
    },
    onPointerUp: (event) => {
      user.onPointerUp?.(event);
      ripple.onPointerUp(event);
    },
    onPointerLeave: (event) => {
      user.onPointerLeave?.(event);
      ripple.onPointerLeave(event);
    },
    onPointerCancel: (event) => {
      user.onPointerCancel?.(event);
      ripple.onPointerCancel(event);
    },
  };
}
