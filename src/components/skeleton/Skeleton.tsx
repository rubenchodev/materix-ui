import { Children, forwardRef, isValidElement } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ForwardedRef,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/skeleton.css';
import { cx } from '../../core';

/** Formas del bloque. */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

/** Animación: `pulse` (por defecto), `wave` o `false` (estática). */
export type SkeletonAnimation = 'pulse' | 'wave' | false | 'false';

/** Propiedades propias de {@link Skeleton}. */
export interface SkeletonOwnProps {
  /** Forma del bloque (por defecto `text`). Sin efecto con `lines`. */
  variant?: SkeletonVariant;
  /** Animación del bloque o de las líneas. */
  animation?: SkeletonAnimation;
  /** Ancho: un número son px; también cualquier unidad CSS (`60%`, `10rem`). */
  width?: number | string;
  /** Alto: un número son px; sin efecto con `lines`. */
  height?: number | string;
  /** Genera N líneas de texto (párrafo) cuando es mayor que 1. */
  lines?: number;
  /** Ancho de la última línea con `lines` (por defecto `60%`). */
  lastWidth?: number | string;
  /** Contenido cuya forma toma el bloque (se oculta con `visibility: hidden`). */
  children?: ReactNode;
}

/** Propiedades de {@link Skeleton}; `component` cambia la etiqueta raíz (`span`, o `div` con `lines`). */
export type SkeletonProps<C extends ElementType = 'span'> = SkeletonOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof SkeletonOwnProps | 'component'>;

type SkeletonComponent = (<C extends ElementType = 'span'>(
  props: SkeletonProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

const VARIANTS: SkeletonVariant[] = ['text', 'circular', 'rectangular', 'rounded'];

/**
 * Convierte una dimensión: un número (o cadena numérica) se interpreta en px.
 * @param {number|string} [value] Valor crudo.
 * @returns {string|undefined} Valor CSS.
 */
export function toCssSize(value?: number | string | null): string | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  return /^-?\d+(\.\d+)?$/.test(raw) ? `${raw}px` : raw;
}

/**
 * Clase de animación equivalente a vanilla.
 * @param {SkeletonAnimation} [animation] Animación.
 * @returns {string} Clase BEM.
 */
function animationClass(animation?: SkeletonAnimation): string {
  if (animation === false || animation === 'false') return 'mtx-skeleton--no-animation';
  return animation === 'wave' ? 'mtx-skeleton--wave' : 'mtx-skeleton--pulse';
}

/**
 * Placeholder de carga con la forma del contenido (Skeleton de MUI). Es decorativo (`aria-hidden`):
 * el estado de carga se anuncia en el contenedor con {@link SkeletonRegion}.
 */
export const Skeleton = forwardRef(function Skeleton(
  { component, variant = 'text', animation = 'pulse', width, height, lines, lastWidth, className, style, children, ...rest }: SkeletonProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const lineCount = typeof lines === 'number' && Number.isFinite(lines) && lines > 1 ? Math.floor(lines) : 0;
  const anim = animationClass(animation);
  const cssWidth = toCssSize(width);

  if (lineCount) {
    const Root: ElementType = component ?? 'div';
    const last = toCssSize(lastWidth) ?? '60%';
    return (
      <Root
        ref={ref}
        className={cx('mtx-skeleton-lines', className)}
        style={cssWidth ? { width: cssWidth, ...style } : style}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <span
            key={i}
            className={cx('mtx-skeleton', 'mtx-skeleton--text', anim)}
            style={i === lineCount - 1 ? { width: last } : undefined}
          />
        ))}
      </Root>
    );
  }

  const Root: ElementType = component ?? 'span';
  const shape = VARIANTS.includes(variant) ? variant : 'text';
  const items = Children.toArray(children);
  const hasChildren = items.some((child) =>
    (typeof child === 'string' ? child.trim() !== '' : typeof child === 'number' || isValidElement(child)));
  // El texto directo se envuelve para ocultarlo con `visibility` (no texto transparente que falla el contraste).
  const content = hasChildren
    ? items.map((child, i) =>
      ((typeof child === 'string' && child.trim() !== '') || typeof child === 'number' ? (
        <span key={`t${i}`} className="mtx-skeleton__text">
          {child}
        </span>
      ) : (
        child
      )))
    : children;

  const cssHeight = toCssSize(height);
  const sizeStyle: CSSProperties | undefined = cssWidth || cssHeight
    ? { ...(cssWidth ? { width: cssWidth } : null), ...(cssHeight ? { height: cssHeight } : null) }
    : undefined;

  return (
    <Root
      ref={ref}
      className={cx('mtx-skeleton', `mtx-skeleton--${shape}`, hasChildren && 'mtx-skeleton--with-children', anim, className)}
      style={sizeStyle ? { ...sizeStyle, ...style } : style}
      aria-hidden="true"
      {...rest}
    >
      {content}
    </Root>
  );
}) as SkeletonComponent;

Skeleton.displayName = 'Skeleton';
