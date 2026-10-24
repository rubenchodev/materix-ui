'use client';
/**
 * Toolbar y ToolbarOffset: fila de la AppBar y espaciador con su altura.
 */
import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/app-bar.css';
import { cx } from '../../core';

/** Altura de la Toolbar: `regular` 56/64px, `dense` 48px y `prominent` 128px. */
export type ToolbarVariant = 'regular' | 'dense' | 'prominent';

/** Props de {@link Toolbar}. */
export interface ToolbarProps extends HTMLAttributes<HTMLElement> {
  /** Altura de la fila. */
  variant?: ToolbarVariant;
  /** Quita los márgenes laterales de 16/24px. */
  disableGutters?: boolean;
  /** Elemento raíz (por defecto `div`). */
  component?: ElementType;
}

/**
 * Fila flexible de la AppBar (`.mtx-toolbar`) con sus modificadores de altura.
 */
export const Toolbar = forwardRef<HTMLElement, ToolbarProps>(function Toolbar(props, ref) {
  const { variant = 'regular', disableGutters = false, component: Tag = 'div', className, ...rest } = props;
  return (
    <Tag
      ref={ref}
      className={cx(
        'mtx-toolbar',
        variant !== 'regular' && `mtx-toolbar--${variant}`,
        disableGutters && 'mtx-toolbar--disable-gutters',
        className,
      )}
      {...rest}
    />
  );
});

/** Props de {@link ToolbarTitle}. */
export interface ToolbarTitleProps extends HTMLAttributes<HTMLElement> {
  /** Elemento raíz (por defecto `span`; usa `h1` si es el título de la página). */
  component?: ElementType;
}

/**
 * Título de la Toolbar (`.mtx-toolbar__title`): ocupa el espacio libre con elipsis.
 */
export const ToolbarTitle = forwardRef<HTMLElement, ToolbarTitleProps>(function ToolbarTitle(
  { component: Tag = 'span', className, ...rest },
  ref,
) {
  return <Tag ref={ref} className={cx('mtx-toolbar__title', className)} {...rest} />;
});

/** Props de {@link ToolbarOffset}. */
export interface ToolbarOffsetProps extends HTMLAttributes<HTMLDivElement> {
  /** Altura de la Toolbar densa (48px). */
  dense?: boolean;
}

/**
 * Espaciador con la altura de una AppBar fija (56px, 64px desde 600px; 48px densa).
 */
export const ToolbarOffset = forwardRef<HTMLDivElement, ToolbarOffsetProps>(function ToolbarOffset(
  { dense = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('mtx-toolbar-offset', dense && 'mtx-toolbar-offset--dense', className)}
      {...rest}
    />
  );
});
