/**
 * Auto-inicialización para los módulos por componente (`materix-ui/components/*`).
 *
 * Cada entrada por componente la invoca tras registrarse: agrupa las llamadas
 * y ejecuta un único `initAll()` al cargar el DOM (o en la siguiente microtarea
 * si ya está cargado). `initAll()` es idempotente.
 */
import { initAll } from './registry.js';

let scheduled = false;

/**
 * Programa un `initAll()` del documento; varias llamadas seguidas se agrupan.
 */
export function scheduleAutoInit() {
  if (typeof document === 'undefined' || scheduled) return;
  scheduled = true;
  const run = () => {
    scheduled = false;
    initAll();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    queueMicrotask(run);
  }
}
