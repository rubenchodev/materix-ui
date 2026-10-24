'use client';
import { Children, forwardRef, isValidElement, useEffect, useRef, useState } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ForwardedRef,
  ImgHTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/avatar.css';
import { cx } from '../../core';

/** Colores de fondo del avatar. */
export type AvatarColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

/** Forma del avatar. */
export type AvatarVariant = 'circular' | 'rounded' | 'square';

/** Tamaños canónicos (24/40/56px) o un número en píxeles. */
export type AvatarSize = 'small' | 'medium' | 'large' | number;

/** Propiedades propias de {@link Avatar}. */
export interface AvatarOwnProps {
  /** Origen de la imagen (equivale a `data-src`). */
  src?: string;
  /** Texto alternativo; su inicial es el fallback si la imagen falla. */
  alt?: string;
  /** `srcset` de la imagen. */
  srcSet?: string;
  /** `sizes` de la imagen. */
  sizes?: string;
  /** Atributos extra del `<img>`. */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  /** Icono sin imagen: nombre de Material Icons o un nodo. */
  icon?: ReactNode;
  /** Forma: `circular` (por defecto), `rounded` o `square`. */
  variant?: AvatarVariant;
  /** Color de fondo de la paleta. */
  color?: AvatarColor;
  /** `small` (24px), `medium` (40px), `large` (56px) o píxeles. */
  size?: AvatarSize;
  /** Iniciales o contenido alternativo. */
  children?: ReactNode;
}

/** Propiedades de {@link Avatar}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type AvatarProps<C extends ElementType = 'div'> = AvatarOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof AvatarOwnProps | 'component'>;

type AvatarComponent = (<C extends ElementType = 'div'>(
  props: AvatarProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Inicial de respaldo como en vanilla: primera letra del `alt` en mayúscula o `●`.
 * @param {string} [alt] Texto alternativo.
 * @returns {string} Inicial.
 */
export function getAvatarInitial(alt?: string): string {
  return (alt ?? '').trim().charAt(0).toUpperCase() || '●';
}

/**
 * Indica si los hijos aportan texto o elementos visibles.
 * @param {ReactNode} children Hijos.
 * @returns {boolean} `true` si hay contenido.
 */
function hasContent(children: ReactNode): boolean {
  return Children.toArray(children).some((child) =>
    (typeof child === 'string' ? child.trim() !== '' : typeof child === 'number' || isValidElement(child)));
}

/**
 * Avatar de Materix UI (Avatar de MUI): imagen, iniciales o icono con fallback automático.
 */
export const Avatar = forwardRef(function Avatar(
  {
    component,
    src,
    alt,
    srcSet,
    sizes,
    imgProps,
    icon,
    variant = 'circular',
    color,
    size,
    className,
    style,
    children,
    ...rest
  }: AvatarProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const hasImage = Boolean(src || srcSet);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Nuevo origen: se reintenta la carga.
  useEffect(() => {
    setFailed(false);
  }, [src, srcSet]);

  // La imagen pudo fallar antes de hidratar (SSR): se comprueba tras montar.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.getAttribute('src') && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src, srcSet]);

  const showIcon = !hasImage && icon !== undefined && icon !== null && icon !== false;
  const fallback = (!hasImage && !showIcon) || (hasImage && failed);
  const showInitial = hasImage && failed && !hasContent(children);

  const numericSize = typeof size === 'number' && Number.isFinite(size) ? size : null;
  const sizeStyle: CSSProperties | undefined = numericSize !== null
    ? { width: `${numericSize}px`, height: `${numericSize}px`, fontSize: `${Math.round(numericSize * 0.45)}px` }
    : undefined;

  const classes = cx(
    'mtx-avatar',
    fallback && 'mtx-avatar--fallback',
    variant !== 'circular' && `mtx-avatar--${variant}`,
    color && `mtx-avatar--${color}`,
    (size === 'small' || size === 'medium' || size === 'large') && `mtx-avatar--${size}`,
    className,
  );

  const handleError: ImgHTMLAttributes<HTMLImageElement>['onError'] = (event) => {
    setFailed(true);
    imgProps?.onError?.(event);
  };

  return (
    <Root ref={ref} className={classes} style={sizeStyle ? { ...sizeStyle, ...style } : style} {...rest}>
      {children}
      {hasImage ? (
        <img
          {...imgProps}
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt ?? imgProps?.alt ?? ''}
          hidden={failed || imgProps?.hidden}
          onError={handleError}
        />
      ) : null}
      {showInitial ? <span className="mtx-avatar__fallback">{getAvatarInitial(alt ?? imgProps?.alt)}</span> : null}
      {showIcon ? (
        typeof icon === 'string' ? (
          <span className="material-icons" aria-hidden="true">
            {icon}
          </span>
        ) : (
          icon
        )
      ) : null}
    </Root>
  );
}) as AvatarComponent;

Avatar.displayName = 'Avatar';
