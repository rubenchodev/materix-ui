'use client';
/**
 * Enlace de Materix UI (`Link` de MUI): colores, subrayado, deshabilitado y `component` polimórfico.
 */
import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  MouseEvent,
  ReactElement,
} from 'react';
import '@rubenchodev/materix-ui/components/link.css';
import { cx } from '../../core';

/** Colores del enlace: paleta, texto e `inherit`. */
export type LinkColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'text-primary'
  | 'text-secondary'
  | 'inherit';

/** Propiedades propias de {@link Link}. */
export interface LinkOwnProps {
  /** Color (por defecto, primario). */
  color?: LinkColor;
  /** Subrayado: `always` (por defecto en CSS), `hover` o `none`. */
  underline?: 'always' | 'hover' | 'none';
  /** Deshabilita el enlace: `disabled` en `<button>`; `aria-disabled` y fuera del tabulado en el resto. */
  disabled?: boolean;
}

/** Propiedades de {@link Link}; `component="button"` para acciones que no navegan. */
export type LinkProps<C extends ElementType = 'a'> = LinkOwnProps & {
  /** Elemento o componente raíz (por defecto `a`). */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof LinkOwnProps | 'component'>;

type LinkComponent = (<C extends ElementType = 'a'>(
  props: LinkProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/**
 * Enlace de texto con el estilo de MUI (Link).
 */
export const Link = forwardRef(function Link(
  { component, color, underline, disabled = false, className, onClick, type, tabIndex, ...rest }: LinkProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const Root: ElementType = component ?? 'a';
  const isButton = Root === 'button';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    (onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };

  const stateProps: Record<string, unknown> = isButton
    ? { type: type ?? 'button', disabled: disabled || undefined, tabIndex }
    : { type, 'aria-disabled': disabled ? 'true' : undefined, tabIndex: disabled ? -1 : tabIndex };

  const classes = cx(
    'mtx-link',
    color && `mtx-link--${color}`,
    color && `mtx-link--color-${color}`,
    underline && `mtx-link--underline-${underline}`,
    className,
  );

  return <Root ref={ref} className={classes} {...rest} {...stateProps} onClick={handleClick} />;
}) as LinkComponent;

Link.displayName = 'Link';
