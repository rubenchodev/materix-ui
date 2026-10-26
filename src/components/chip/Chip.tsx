'use client';
/**
 * Chip de Materix UI: etiqueta compacta con icono, avatar, acción de clic y borrado (patrón `Chip` de MUI).
 */
import { cloneElement, forwardRef, isValidElement } from 'react';
import type {
  ElementType,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/chip.css';
import { cx, mtxClasses } from '../../core';
import { useT } from '../../i18n';

/** Colores de la paleta aceptados por el chip. */
export type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
/** Variantes visuales. */
export type ChipVariant = 'filled' | 'outlined';
/** Tamaños canónicos: medium (32px) y small (24px). */
export type ChipSize = 'medium' | 'small';

/** Evento de clic o teclado que dispara `onClick`/`onDelete`. */
export type ChipEvent = ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>;

/** Propiedades de {@link Chip}. */
export interface ChipProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'onClick'> {
  /** Texto del chip (equivale a `data-label`); si se omite se usan los `children`. */
  label?: ReactNode;
  /** Variante: `filled` (por defecto) u `outlined`. */
  variant?: ChipVariant;
  /** Tamaño: `medium` (32px, por defecto) o `small` (24px). */
  size?: ChipSize;
  /** Color de la paleta (por defecto `default`). */
  color?: ChipColor;
  /** Icono inicial: nombre de Material Icons (`data-icon`) o nodo React. */
  icon?: ReactNode;
  /** Avatar inicial (p. ej. un `.mtx-avatar`); recibe la clase `mtx-chip__avatar`. */
  avatar?: ReactNode;
  /** Hace el chip interactivo (`data-clickable`). Por defecto `true` si hay `onClick` o `href` (como MUI). */
  clickable?: boolean;
  /** Clic o Enter/Espacio en un chip clickable (equivale a `mtx:chip:click`). */
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  /** Muestra el icono de borrado; se invoca con clic o Delete/Backspace (equivale a `mtx:chip:delete`). */
  onDelete?: (event: ChipEvent) => void;
  /** Icono de borrado personalizado (`data-delete-icon`). */
  deleteIcon?: ReactNode;
  /** Pista del icono de borrado (`data-delete-label`); por defecto i18n `chip.delete`. */
  deleteLabel?: string;
  /** Deshabilita la interacción (`data-disabled`). */
  disabled?: boolean;
  /** Elemento raíz (`div` por defecto; `button` o `a` para chips nativos). */
  component?: ElementType;
  /** Idioma de los textos propios (prevalece sobre el `I18nProvider`). */
  locale?: string;
  /** Contenido alternativo a `label`. */
  children?: ReactNode;
  /** Atributos de enlace cuando `component="a"`. */
  href?: string;
  /** Tipo cuando `component="button"`. */
  type?: 'button' | 'submit' | 'reset';
}

/** X circular por defecto del icono de borrado (igual que vanilla). */
const DEFAULT_DELETE_ICON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z" />
  </svg>
);

/**
 * Añade una clase BEM a un nodo: clona el elemento o lo envuelve en un `<span>`.
 * @param {ReactNode} node Nodo del usuario.
 * @param {string} className Clase a añadir.
 * @returns {ReactNode} Nodo con la clase.
 */
function withSlotClass(node: ReactNode, className: string): ReactNode {
  if (isValidElement<{ className?: string }>(node)) {
    const element = node as ReactElement<{ className?: string }>;
    return cloneElement(element, { className: cx(element.props.className, className) });
  }
  return <span className={className}>{node}</span>;
}

/**
 * Chip: etiqueta, filtro, entrada o acción compacta.
 */
export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(props, ref) {
  const {
    label,
    variant = 'filled',
    size = 'medium',
    color = 'default',
    icon,
    avatar,
    clickable: clickableProp,
    onClick,
    onDelete,
    deleteIcon,
    deleteLabel,
    disabled = false,
    component,
    locale,
    children,
    className,
    onKeyDown,
    tabIndex,
    role,
    type,
    href,
    ...rest
  } = props;

  const t = useT('chip', locale);
  const Root: ElementType = component ?? (href ? 'a' : 'div');
  const nativeInteractive = Root === 'button' || Root === 'a';
  const clickable = clickableProp ?? Boolean(onClick || href);
  const deletable = Boolean(onDelete);
  const interactive = clickable || deletable;

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (disabled) return;
    const target = event.target as Element | null;
    if (target?.closest?.('.mtx-chip__delete')) return;
    if (clickable) onClick?.(event);
  };

  const handleDelete = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) return;
    onDelete?.(event);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || !interactive || event.target !== event.currentTarget) return;
    const { key } = event;
    if ((key === 'Enter' || key === ' ') && clickable) {
      // El <button> nativo ya se activa con Enter/Espacio.
      if (Root === 'button') return;
      event.preventDefault();
      event.currentTarget.click();
    } else if ((key === 'Delete' || key === 'Backspace') && deletable) {
      event.preventDefault();
      onDelete?.(event);
    } else if (key === 'Escape') {
      event.currentTarget.blur();
    }
  };

  const content = label ?? children;
  const resolvedTabIndex =
    tabIndex !== undefined ? (disabled ? -1 : tabIndex) : interactive && !nativeInteractive ? (disabled ? -1 : 0) : undefined;

  return (
    <Root
      ref={ref}
      className={cx(
        mtxClasses('chip', {
          clickable,
          disabled,
          size: size !== 'medium' && size,
          variant: variant !== 'filled' && variant,
          color: color !== 'default' && color,
        }),
        className,
      )}
      role={role ?? (interactive && !nativeInteractive ? 'button' : undefined)}
      tabIndex={resolvedTabIndex}
      aria-disabled={disabled ? 'true' : undefined}
      aria-keyshortcuts={deletable ? 'Delete Backspace' : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive || onKeyDown ? handleKeyDown : undefined}
      type={Root === 'button' ? (type ?? 'button') : type}
      href={href}
      {...rest}
    >
      {avatar ? withSlotClass(avatar, 'mtx-chip__avatar') : null}
      {icon ? (
        typeof icon === 'string' ? (
          <span className="mtx-chip__icon material-icons" aria-hidden="true">
            {icon}
          </span>
        ) : (
          withSlotClass(icon, 'mtx-chip__icon')
        )
      ) : null}
      <span className="mtx-chip__label">{content}</span>
      {deletable ? (
        <span className="mtx-chip__delete" aria-hidden="true" title={deleteLabel ?? t('delete', null, 'Delete')} onClick={handleDelete}>
          {deleteIcon ?? DEFAULT_DELETE_ICON}
        </span>
      ) : null}
    </Root>
  );
});
