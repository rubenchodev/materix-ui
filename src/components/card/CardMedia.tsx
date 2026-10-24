import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ForwardedRef,
  ReactElement,
} from 'react';
import '@rubenchodev/materix-ui/components/card.css';
import { cx } from '../../core';

/** Etiquetas que usan `src` en lugar de imagen de fondo (como MUI). */
const MEDIA_COMPONENTS = ['img', 'video', 'audio', 'picture', 'iframe'];

/** Propiedades propias de {@link CardMedia}. */
export interface CardMediaOwnProps {
  /** URL del recurso: imagen de fondo, o `src` si `component` es `img`, `video`, `audio`, `picture` o `iframe`. */
  image?: string;
  /** Texto alternativo: `alt` en `<img>`; en otro elemento, `role="img"` + `aria-label`. Sin él es decorativa. */
  alt?: string;
  /** Alto en píxeles o con unidad (194px por defecto en CSS). */
  height?: number | string;
}

/** Propiedades de {@link CardMedia}; `component` cambia la etiqueta (por defecto `div`). */
export type CardMediaProps<C extends ElementType = 'div'> = CardMediaOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof CardMediaOwnProps | 'component'>;

type CardMediaComponent = (<C extends ElementType = 'div'>(
  props: CardMediaProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Convierte una URL en `url("…")` escapando comillas y saltos.
 * @param {string} value URL.
 * @returns {string} Valor CSS.
 */
export function cssUrl(value: string): string {
  return `url("${String(value).replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

/**
 * Normaliza un alto: los números (o cadenas numéricas) se toman en píxeles.
 * @param {number|string} value Alto.
 * @returns {string} Alto CSS.
 */
export function toCssSize(value: number | string): string {
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

/**
 * Recurso visual de una tarjeta (`.mtx-card__media`): imagen de fondo, `<img>`, `<video>`…
 */
export const CardMedia = forwardRef(function CardMedia(
  { component, image, alt, height, className, style, children, ...rest }: CardMediaProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const isMedia = typeof Root === 'string' && MEDIA_COMPONENTS.includes(Root);
  const props = rest as Record<string, unknown>;
  const mergedStyle: CSSProperties = { ...(style as CSSProperties | undefined) };
  if (height !== undefined && height !== null && height !== '') mergedStyle.height = toCssSize(height);
  const extra: Record<string, unknown> = {};
  if (isMedia && image) extra.src = image;
  if (Root === 'img') {
    extra.alt = alt ?? '';
  } else if (!isMedia) {
    if (image) mergedStyle.backgroundImage = cssUrl(image);
    if (alt) {
      extra.role = 'img';
      extra['aria-label'] = alt;
    } else if (
      image &&
      children == null &&
      props.role === undefined &&
      props['aria-label'] === undefined &&
      props['aria-labelledby'] === undefined
    ) {
      // Imagen de fondo sin texto alternativo: decorativa.
      extra['aria-hidden'] = 'true';
    }
  }
  return (
    <Root
      ref={ref}
      className={cx('mtx-card__media', className)}
      {...extra}
      {...rest}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
    >
      {children}
    </Root>
  );
}) as CardMediaComponent;

CardMedia.displayName = 'CardMedia';
