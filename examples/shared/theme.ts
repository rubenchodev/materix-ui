/**
 * Tema claro/oscuro de las páginas de ejemplo (autocontenido, sin depender de src/theme).
 * Equivale a materix-ui-vainilla/examples/shared/theme.js: alterna `data-mtx-theme` en <html>,
 * persiste en localStorage `mtx-theme` y acepta `?theme=dark|light` sin persistir.
 */
import { useSyncExternalStore } from 'react';

export type ExampleTheme = 'light' | 'dark';

const STORAGE_KEY = 'mtx-theme';
const CHANGE_EVENT = 'demo:themechange';

/**
 * Lee el tema persistido sin romper en modo privado.
 * @returns {string | null} Tema guardado.
 */
const readStored = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Devuelve el tema activo en <html>.
 * @returns {ExampleTheme} Tema actual.
 */
export const getTheme = (): ExampleTheme =>
  document.documentElement.getAttribute('data-mtx-theme') === 'dark' ? 'dark' : 'light';

/**
 * Aplica un tema y opcionalmente lo persiste.
 * @param {ExampleTheme} theme Tema a aplicar.
 * @param {boolean} [persist=false] Guardar en localStorage.
 * @returns {void}
 */
export const applyTheme = (theme: ExampleTheme, persist = false): void => {
  const next: ExampleTheme = theme === 'dark' ? 'dark' : 'light';
  const root = document.documentElement;
  root.setAttribute('data-mtx-theme', next);
  root.style.colorScheme = next;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* almacenamiento no disponible */
    }
  }
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { theme: next } }));
};

/**
 * Alterna entre claro y oscuro persistiendo la elección.
 * @returns {void}
 */
export const toggleTheme = (): void => applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);

/**
 * Suscribe un callback a los cambios de tema.
 * @param {() => void} callback Función a invocar.
 * @returns {() => void} Cancelación.
 */
const subscribe = (callback: () => void): (() => void) => {
  document.addEventListener(CHANGE_EVENT, callback);
  return () => document.removeEventListener(CHANGE_EVENT, callback);
};

/**
 * Hook con el tema activo de la página de ejemplo.
 * @returns {ExampleTheme} Tema actual (se re-renderiza al cambiar).
 */
export const useExampleTheme = (): ExampleTheme => useSyncExternalStore(subscribe, getTheme, () => 'light');

// Tema inicial al importar el módulo (antes del primer render): `?theme=` > localStorage > atributo > light.
const forced = /[?&]theme=(dark|light)\b/.exec(window.location.search);
applyTheme(
  (forced?.[1] ?? readStored() ?? document.documentElement.getAttribute('data-mtx-theme') ?? 'light') as ExampleTheme,
);
