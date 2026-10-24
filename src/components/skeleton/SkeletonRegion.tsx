'use client';
import { forwardRef, useEffect, useRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import '@rubenchodev/materix-ui/components/skeleton.css';
import { useEventCallback } from '../../core';

/** Detalle del cambio de carga (equivale a `mtx:skeleton:change`). */
export interface SkeletonRegionChangeDetail {
  loading: boolean;
}

/** Propiedades propias de {@link SkeletonRegion}. */
export interface SkeletonRegionOwnProps {
  /** `true` mientras se carga: muestra `placeholder`, oculta el contenido y fija `aria-busy`. */
  loading?: boolean;
  /** Placeholders (normalmente `Skeleton`) visibles durante la carga. */
  placeholder?: ReactNode;
  /** Contenido real, visible cuando termina la carga. */
  children?: ReactNode;
  /** Atributos del contenedor del placeholder (`[data-skeleton-placeholder]`). */
  placeholderProps?: HTMLAttributes<HTMLDivElement>;
  /** Atributos del contenedor del contenido (`[data-skeleton-content]`). */
  contentProps?: HTMLAttributes<HTMLDivElement>;
  /** Se invoca cuando cambia `loading` tras el montaje (evento `mtx:skeleton:change`). */
  onChange?: (detail: SkeletonRegionChangeDetail) => void;
}

/** Propiedades de {@link SkeletonRegion}; `component` cambia la etiqueta raíz (por defecto `div`). */
export type SkeletonRegionProps<C extends ElementType = 'div'> = SkeletonRegionOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof SkeletonRegionOwnProps | 'component'>;

type SkeletonRegionComponent = (<C extends ElementType = 'div'>(
  props: SkeletonRegionProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Región de carga (equivalente a `Materix.skeleton.set()` de vanilla): alterna placeholder y contenido
 * con `data-loading` y sincroniza `aria-busy`. Ambos se mantienen montados; el CSS oculta el inactivo.
 */
export const SkeletonRegion = forwardRef(function SkeletonRegion(
  { component, loading = true, placeholder, placeholderProps, contentProps, onChange, children, ...rest }: SkeletonRegionProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'div';
  const handleChange = useEventCallback((detail: SkeletonRegionChangeDetail) => onChange?.(detail));
  const previous = useRef(loading);

  useEffect(() => {
    if (previous.current === loading) return;
    previous.current = loading;
    handleChange({ loading });
  }, [loading, handleChange]);

  return (
    <Root ref={ref} {...rest} data-loading={loading ? '' : undefined} aria-busy={loading ? 'true' : undefined}>
      <div {...placeholderProps} data-skeleton-placeholder="" aria-hidden="true">
        {placeholder}
      </div>
      <div {...contentProps} data-skeleton-content="">
        {children}
      </div>
    </Root>
  );
}) as SkeletonRegionComponent;

SkeletonRegion.displayName = 'SkeletonRegion';
