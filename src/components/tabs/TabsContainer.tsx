'use client';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import '@rubenchodev/materix-ui/components/tabs.css';
import { cx } from '../../core';

/** Props de {@link TabsContainer}. El resto de atributos va al `<div>`. */
export interface TabsContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Sin borde ni fondo (`mtx-tabs-container--borderless`). */
  borderless?: boolean;
}

/**
 * Superficie opcional (`.mtx-tabs-container`) que agrupa `Tabs` y sus `TabPanel` con borde,
 * radio y fondo `paper`.
 */
export const TabsContainer = forwardRef<HTMLDivElement, TabsContainerProps>(function TabsContainer(props, ref) {
  const { borderless = false, className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cx('mtx-tabs-container', borderless && 'mtx-tabs-container--borderless', className)}
      {...rest}
    />
  );
});
