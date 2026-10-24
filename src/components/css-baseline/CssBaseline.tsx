'use client';

import type { ReactNode } from 'react';
import '@rubenchodev/materix-ui/base.css';
import '@rubenchodev/materix-ui/components/css-baseline.css';
import { useEnhancedEffect } from '../../core';

/** Elemento global al que se aplica la línea base. */
export type CssBaselineTarget = 'body' | 'html';

/** Propiedades de {@link CssBaseline}. */
export interface CssBaselineProps {
  /** Elemento global que recibe `mtx-root` (por defecto `body`, equivalente a `<body data-mtx="css-baseline">`). */
  target?: CssBaselineTarget;
  /** Contenido que se renderiza tal cual (opcional). */
  children?: ReactNode;
}

/** Instancias montadas por elemento: la clase se retira al desmontar la última. */
const mounted = new WeakMap<Element, { count: number; added: boolean }>();

/**
 * Añade `mtx-root` a un elemento global mientras haya instancias montadas.
 * @param {Element} el Elemento (`<body>` o `<html>`).
 * @returns {() => void} Limpieza.
 */
function retainRoot(el: Element): () => void {
  const entry = mounted.get(el) ?? { count: 0, added: false };
  if (entry.count === 0) {
    entry.added = !el.classList.contains('mtx-root');
    if (entry.added) el.classList.add('mtx-root');
  }
  entry.count += 1;
  mounted.set(el, entry);
  return () => {
    entry.count -= 1;
    if (entry.count > 0) return;
    if (entry.added) el.classList.remove('mtx-root');
    mounted.delete(el);
  };
}

/**
 * Línea base global de Materix (CssBaseline de MUI): marca `<body>` con `mtx-root` (tipografía Roboto,
 * colores del tema, `box-sizing`, foco visible y `color-scheme`) y la retira al desmontarse.
 */
export function CssBaseline({ target = 'body', children }: CssBaselineProps) {
  useEnhancedEffect(() => {
    const el = target === 'html' ? document.documentElement : document.body;
    return retainRoot(el);
  }, [target]);
  return children === undefined ? null : <>{children}</>;
}

CssBaseline.displayName = 'CssBaseline';
