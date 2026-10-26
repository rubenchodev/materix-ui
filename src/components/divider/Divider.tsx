/**
 * Línea divisoria de Materix UI (`Divider` de MUI): orientación, variantes, texto y uso en listas.
 */
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ForwardedRef, ReactElement, ReactNode } from 'react';
import '@rubenchodev/materix-ui/components/divider.css';
import { cx } from '../../core';

/** Propiedades propias de {@link Divider}. */
export interface DividerOwnProps {
  /** Orientación de la línea. */
  orientation?: 'horizontal' | 'vertical';
  /** `fullWidth` (por defecto), `middle` (16px por lado) o `inset` (72px a la izquierda). */
  variant?: 'fullWidth' | 'middle' | 'inset';
  /** Estira la línea vertical a la altura de su fila flex. */
  flexItem?: boolean;
  /** Alineación del texto (con `children`). */
  textAlign?: 'center' | 'left' | 'right';
  /** Texto central: genera `.mtx-divider__text` y la variante con texto. */
  children?: ReactNode;
}

/**
 * Propiedades de {@link Divider}. `component` cambia la etiqueta: por defecto `hr`, o `div`
 * si es vertical o lleva texto. Con `component="li"` se comporta como elemento de lista.
 */
export type DividerProps<C extends ElementType = 'hr'> = DividerOwnProps & {
  /** Elemento o componente raíz. */
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof DividerOwnProps | 'component'>;

type DividerComponent = (<C extends ElementType = 'hr'>(
  props: DividerProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] },
) => ReactElement | null) & { displayName?: string };

/** Indica si `children` aporta contenido visible. */
const hasContent = (children: ReactNode): boolean =>
  children !== undefined && children !== null && children !== false && children !== '' && !(Array.isArray(children) && children.length === 0);

/**
 * Línea divisoria de Materix UI (Divider de MUI).
 */
export const Divider = forwardRef(function Divider(
  {
    component,
    orientation = 'horizontal',
    variant = 'fullWidth',
    flexItem = false,
    textAlign = 'center',
    children,
    className,
    ...rest
  }: DividerProps<ElementType>,
  ref: ForwardedRef<Element>,
) {
  const vertical = orientation === 'vertical';
  const withText = hasContent(children);
  const Root: ElementType = component ?? (vertical || withText ? 'div' : 'hr');
  const props = rest as Record<string, unknown>;

  // Semántica (igual que vanilla): <hr> es separador nativo; un <li> conserva su rol de lista
  // y, vacío, es decorativo; el resto recibe role="separator".
  const a11y: Record<string, string | undefined> = {};
  if (Root === 'li') {
    if (!withText && props.role === undefined && props['aria-hidden'] === undefined) a11y['aria-hidden'] = 'true';
  } else if (Root !== 'hr' && props.role === undefined) {
    a11y.role = 'separator';
  }
  if (vertical && props['aria-orientation'] === undefined) a11y['aria-orientation'] = 'vertical';

  const classes = cx(
    'mtx-divider',
    vertical && 'mtx-divider--vertical',
    variant === 'inset' && 'mtx-divider--inset',
    variant === 'middle' && 'mtx-divider--middle',
    flexItem && 'mtx-divider--flex-item',
    withText && 'mtx-divider--text',
    withText && textAlign !== 'center' && `mtx-divider--text-${textAlign}`,
    className,
  );

  return (
    <Root ref={ref} className={classes} {...a11y} {...rest}>
      {withText ? <span className="mtx-divider__text">{children}</span> : null}
    </Root>
  );
}) as DividerComponent;

Divider.displayName = 'Divider';
