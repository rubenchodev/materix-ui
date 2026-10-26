'use client';
/**
 * Portal: renderiza contenido fuera de la jerarquía DOM del padre (equivalente al `Portal` de MUI).
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { resolveTarget } from './dom';
import type { ElementTarget } from './dom';
import { useEnhancedEffect } from './hooks';

/** Props de `Portal`. */
export interface PortalProps {
  /** Contenido a portar. */
  children?: ReactNode;
  /** Contenedor destino (elemento, ref o función); por defecto `body` si ya es `.mtx-root`, si no un `div.mtx-root` compartido al final de `body`. */
  container?: ElementTarget<Element>;
  /** Renderiza el contenido en su sitio, sin portal. */
  disablePortal?: boolean;
}

/**
 * Contenedor compartido de los portales: un `<div class="mtx-root">` al final de `body`, para que
 * el contenido portado herede la tipografía y los estilos base de Materix aunque `body` no sea `.mtx-root`.
 * @returns {Element} Contenedor (se crea la primera vez).
 */
export function getPortalRoot(): Element {
  const existing = document.querySelector('body > [data-mtx-portal-root]');
  if (existing) return existing;
  const root = document.createElement('div');
  root.className = 'mtx-root';
  root.setAttribute('data-mtx-portal-root', '');
  document.body.appendChild(root);
  return root;
}

/**
 * Monta `children` en `container` tras el primer efecto (no renderiza nada en el servidor).
 * @param {PortalProps} props Props.
 * @returns {ReactNode} Portal o contenido en línea.
 */
export function Portal({ children, container, disablePortal = false }: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEnhancedEffect(() => {
    if (disablePortal) return;
    setMountNode(resolveTarget(container) || (document.body.classList.contains('mtx-root') ? document.body : getPortalRoot()));
  }, [container, disablePortal]);

  if (disablePortal) return <>{children}</>;
  return mountNode ? createPortal(children, mountNode) : null;
}
