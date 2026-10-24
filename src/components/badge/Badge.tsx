import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/badge.css';
import { cx } from '../../core';

/** Colores de la insignia; `default` es el gris neutro de MUI. */
export type BadgeColor = 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Esquina en la que se ancla la insignia. */
export type BadgeAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/** Origen de anclaje estilo MUI (`anchorOrigin`). */
export interface BadgeAnchorOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right';
}

/** Propiedades propias de {@link Badge}. */
export interface BadgeOwnProps {
  /** Contenido de la insignia (número o texto corto); equivale a `data-content`. */
  badgeContent?: ReactNode;
  /** `standard` (por defecto) muestra el contenido; `dot` muestra un punto de 8px. */
  variant?: 'standard' | 'dot';
  /** Color de la paleta (por defecto `default`). */
  color?: BadgeColor;
  /** Esquina de anclaje (por defecto `top-right`). */
  anchor?: BadgeAnchor;
  /** Alternativa MUI a `anchor`; prevalece si se indica. */
  anchorOrigin?: BadgeAnchorOrigin;
  /** `rectangular` (por defecto) o `circular` para formas redondas como Avatar. */
  overlap?: 'rectangular' | 'circular';
  /** Valor máximo; por encima se muestra `max+` (por defecto 99). */
  max?: number;
  /** Muestra la insignia cuando el contenido es `0`. */
  showZero?: boolean;
  /** Oculta siempre la insignia. */
  invisible?: boolean;
  /** Insignia en línea, sin elemento anclado (contadores de navegación o listas). */
  standalone?: boolean;
  /** Texto accesible para lectores de pantalla; `{0}` se sustituye por el contenido. */
  label?: string;
  /** Elemento anclado (icono, avatar, botón). */
  children?: ReactNode;
}

/** Propiedades de {@link Badge}; `component` cambia la etiqueta raíz (por defecto `span`). */
export type BadgeProps<C extends ElementType = 'span'> = BadgeOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BadgeOwnProps | 'component'>;

type BadgeComponent = (<C extends ElementType = 'span'>(
  props: BadgeProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

const NUMERIC_RE = /^-?\d+$/;

/**
 * Calcula el texto mostrado aplicando `max` como en vanilla.
 * @param {ReactNode} content Contenido.
 * @param {number} max Máximo.
 * @returns {ReactNode} Contenido a mostrar.
 */
export function formatBadgeContent(content: ReactNode, max: number): ReactNode {
  if (content === null || content === undefined || typeof content === 'boolean') return '';
  if (typeof content === 'number' || (typeof content === 'string' && NUMERIC_RE.test(content))) {
    const value = Number(content);
    if (Number.isFinite(max) && value > max) return `${max}+`;
    return String(content);
  }
  return content;
}

/**
 * Indica si el contenido equivale a vacío (nulo o cero sin `showZero`).
 * @param {ReactNode} content Contenido.
 * @param {boolean} showZero Muestra el cero.
 * @returns {boolean} `true` si la insignia debe ocultarse.
 */
function isEmptyContent(content: ReactNode, showZero: boolean): boolean {
  if (content === null || content === undefined || typeof content === 'boolean') return true;
  const zeroLike = (typeof content === 'number' || typeof content === 'string') && Number(content) === 0;
  return zeroLike && !showZero;
}

/**
 * Insignia de Materix UI (Badge de MUI): número o punto en la esquina de su hijo.
 */
export const Badge = forwardRef(function Badge(
  {
    component,
    badgeContent,
    variant = 'standard',
    color = 'default',
    anchor,
    anchorOrigin,
    overlap = 'rectangular',
    max = 99,
    showZero = false,
    invisible: invisibleProp = false,
    standalone = false,
    label,
    className,
    children,
    ...rest
  }: BadgeProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'span';
  const isDot = variant === 'dot';
  const resolvedAnchor: BadgeAnchor = anchorOrigin
    ? (`${anchorOrigin.vertical}-${anchorOrigin.horizontal}` as BadgeAnchor)
    : anchor ?? 'top-right';
  const display = isDot ? null : formatBadgeContent(badgeContent, max);
  const invisible = invisibleProp || (!isDot && isEmptyContent(badgeContent, showZero));
  const hasLabel = typeof label === 'string' && label !== '';
  const labelText = hasLabel && !invisible
    ? label.replace('{0}', typeof display === 'string' ? display : String(badgeContent ?? ''))
    : '';

  const classes = cx(
    'mtx-badge',
    standalone && 'mtx-badge--standalone',
    isDot && 'mtx-badge--dot',
    `mtx-badge--${color}`,
    resolvedAnchor !== 'top-right' && `mtx-badge--${resolvedAnchor}`,
    overlap === 'circular' && 'mtx-badge--overlap-circular',
    invisible && 'mtx-badge--invisible',
    className,
  );

  return (
    <Root ref={ref} className={classes} {...rest}>
      {children}
      {/* Anclada es decorativa; en línea (standalone) sin label su número es contenido. */}
      <span className="mtx-badge__badge" aria-hidden={standalone && !hasLabel ? undefined : 'true'}>
        {display}
      </span>
      {hasLabel ? <span className="mtx-badge__label">{labelText}</span> : null}
    </Root>
  );
}) as BadgeComponent;

Badge.displayName = 'Badge';
