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
  /** Contenedor destino (elemento, ref o función); `document.body` por defecto. */
  container?: ElementTarget<Element>;
  /** Renderiza el contenido en su sitio, sin portal. */
  disablePortal?: boolean;
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
    setMountNode(resolveTarget(container) || document.body);
  }, [container, disablePortal]);

  if (disablePortal) return <>{children}</>;
  return mountNode ? createPortal(children, mountNode) : null;
}
