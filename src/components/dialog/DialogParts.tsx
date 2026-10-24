'use client';
/**
 * Piezas del diálogo (MUI): DialogTitle, DialogContent, DialogContentText y DialogActions.
 */
import { forwardRef, useContext, useId } from 'react';
import type { HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/dialog.css';
import { cx, isDev, useEnhancedEffect } from '../../core';
import { DialogContext } from './DialogContext';
import type { DialogActionsAlign } from './DialogContext';

const ALIGNMENTS: DialogActionsAlign[] = ['start', 'center', 'end', 'between'];

/** Propiedades de {@link DialogTitle}. */
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Cabecera fija con divisor: solo el contenido hace scroll (`mtx-dialog__title--sticky`). */
  sticky?: boolean;
}

/**
 * Título del diálogo (`h2`); dentro de un Dialog le da el nombre accesible (`aria-labelledby`).
 */
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { sticky = false, id: idProp, className, children, ...rest },
  ref,
) {
  const ctx = useContext(DialogContext);
  const autoId = useId();
  const id = idProp ?? (ctx ? `${ctx.baseId}-title` : autoId);
  const register = ctx?.registerTitle;
  useEnhancedEffect(() => (register ? register(id) : undefined), [register, id]);
  return (
    <h2 {...rest} ref={ref} id={id} className={cx('mtx-dialog__title', sticky && 'mtx-dialog__title--sticky', className)}>
      {children}
    </h2>
  );
});

/** Propiedades de {@link DialogContent}. */
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Divisores arriba y abajo (MUI `dividers`). */
  dividers?: boolean;
}

/**
 * Zona de contenido del diálogo; hace scroll con `scroll="paper"`.
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { dividers = false, className, children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('mtx-dialog__content', dividers && 'mtx-dialog__content--dividers', className)}>
      {children}
    </div>
  );
});

/** Propiedades de {@link DialogContentText}. */
export type DialogContentTextProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Texto descriptivo (`p`); el primero de un Dialog le da la descripción accesible (`aria-describedby`).
 */
export const DialogContentText = forwardRef<HTMLParagraphElement, DialogContentTextProps>(function DialogContentText(
  { id: idProp, className, children, ...rest },
  ref,
) {
  const ctx = useContext(DialogContext);
  const autoId = useId();
  const id = idProp ?? (ctx ? `${ctx.baseId}-description-${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}` : autoId);
  const register = ctx?.registerDescription;
  useEnhancedEffect(() => (register ? register(id) : undefined), [register, id]);
  return (
    <p {...rest} ref={ref} id={id} className={cx('mtx-dialog__content-text', className)}>
      {children}
    </p>
  );
});

/** Propiedades de {@link DialogActions}. */
export interface DialogActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Alineación: `end` (por defecto, o la de `actionsAlign` del Dialog), `start`, `center` o `between`. */
  align?: DialogActionsAlign;
  /** Sin separación entre acciones (MUI `disableSpacing`). */
  disableSpacing?: boolean;
  /** Barra fija con divisor superior (`mtx-dialog__actions--sticky`). */
  sticky?: boolean;
}

/**
 * Contenedor de acciones del diálogo (MUI DialogActions), a la derecha por defecto.
 */
export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(function DialogActions(
  { align: alignProp, disableSpacing = false, sticky = false, className, children, ...rest },
  ref,
) {
  const ctx = useContext(DialogContext);
  if (isDev && alignProp !== undefined && !ALIGNMENTS.includes(alignProp)) {
    console.warn(`DialogActions: align no válido "${String(alignProp)}"`);
  }
  const align = [alignProp, ctx?.actionsAlign].find((value) => value && ALIGNMENTS.includes(value)) || 'end';
  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        'mtx-dialog__actions',
        align !== 'end' && `mtx-dialog__actions--${align}`,
        disableSpacing && 'mtx-dialog__actions--disable-spacing',
        sticky && 'mtx-dialog__actions--sticky',
        className,
      )}
    >
      {children}
    </div>
  );
});
