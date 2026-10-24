'use client';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx, useEnhancedEffect } from '../../core';
import { idSegment, useTabContext } from './TabContext';
import type { TabValue } from './TabContext';

/** Props de {@link TabPanel}. El resto de atributos va al `<div role="tabpanel">`. */
export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor de la pestaña que muestra este panel (dentro de `TabContext`). */
  value?: TabValue;
}

/**
 * Panel de contenido de una pestaña (`.mtx-tab-panel`). Dentro de {@link TabContext} se enlaza con su
 * pestaña (`id`, `aria-labelledby`) y se oculta con `hidden` cuando no está activa; fuera de él,
 * controla `hidden` y los ids a mano.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(props, ref) {
  const { value, className, id: idProp, hidden: hiddenProp, 'aria-labelledby': labelledBy, ...rest } = props;
  const context = useTabContext();
  const registerPanel = context?.registerPanel;

  useEnhancedEffect(() => {
    if (!registerPanel || value === undefined) return undefined;
    return registerPanel(value);
  }, [registerPanel, value]);

  const linked = context && value !== undefined;
  const segment = value !== undefined ? idSegment(value) : '';
  const hidden = linked ? context.value !== value : !!hiddenProp;

  return (
    <div
      {...rest}
      ref={ref}
      id={idProp ?? (linked ? `${context.idPrefix}-panel-${segment}` : undefined)}
      className={cx('mtx-tab-panel', className)}
      role="tabpanel"
      aria-labelledby={labelledBy ?? (linked ? `${context.idPrefix}-tab-${segment}` : undefined)}
      hidden={hidden}
      aria-hidden={hidden}
    />
  );
});
