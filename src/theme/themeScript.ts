/**
 * Utilidades puras del tema (aptas para SSR): modos, lectura inicial y script anti-parpadeo.
 */

/** Modo de tema elegido. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Tema efectivo aplicado. */
export type ResolvedThemeMode = 'light' | 'dark';

/** Modos válidos. */
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

/** Clave de localStorage por defecto (igual que vanilla). */
export const DEFAULT_THEME_STORAGE_KEY = 'mtx-theme';

/** Parámetro de URL por defecto (`?theme=dark`). */
export const DEFAULT_THEME_QUERY = 'theme';

/** Media query del tema del sistema. */
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * Normaliza un modo de tema.
 * @param {unknown} value Valor recibido.
 * @returns {ThemeMode|null} Modo válido o `null`.
 */
export function normalizeThemeMode(value: unknown): ThemeMode | null {
  const mode = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return (THEME_MODES as readonly string[]).includes(mode) ? (mode as ThemeMode) : null;
}

/** @returns {boolean} `true` si el sistema prefiere el tema oscuro (falso en SSR). */
export function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia(DARK_SCHEME_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * Resuelve un modo al tema efectivo.
 * @param {ThemeMode} mode Modo.
 * @param {boolean} [prefersDark] Preferencia del sistema (por defecto se consulta `matchMedia`).
 * @returns {ResolvedThemeMode} Tema efectivo.
 */
export function resolveThemeMode(mode: ThemeMode, prefersDark: boolean = systemPrefersDark()): ResolvedThemeMode {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode === 'dark' ? 'dark' : 'light';
}

/**
 * Lee el modo guardado en localStorage.
 * @param {string|null|false} storageKey Clave (falsy desactiva la persistencia).
 * @returns {ThemeMode|null} Modo guardado.
 */
export function readStoredThemeMode(storageKey: string | null | false | undefined): ThemeMode | null {
  if (!storageKey || typeof window === 'undefined') return null;
  try {
    return normalizeThemeMode(window.localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

/**
 * Guarda el modo en localStorage (silencioso si no hay almacenamiento).
 * @param {string|null|false} storageKey Clave.
 * @param {ThemeMode} mode Modo.
 */
export function writeStoredThemeMode(storageKey: string | null | false | undefined, mode: ThemeMode): void {
  if (!storageKey || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    /* almacenamiento no disponible */
  }
}

/**
 * Lee el modo forzado por la URL (`?theme=dark`).
 * @param {string|null|false} query Nombre del parámetro (falsy lo desactiva).
 * @returns {ThemeMode|null} Modo de la URL.
 */
export function readQueryThemeMode(query: string | null | false | undefined): ThemeMode | null {
  if (!query || typeof window === 'undefined' || !window.location) return null;
  try {
    return normalizeThemeMode(new URLSearchParams(window.location.search).get(query));
  } catch {
    return null;
  }
}

/** Opciones de {@link getThemeScript}. */
export interface ThemeScriptOptions {
  /** Modo si no hay URL ni almacenamiento (por defecto `light`). */
  defaultMode?: ThemeMode;
  /** Parámetro de URL (`theme`); `false` lo desactiva. */
  query?: string | false;
}

/**
 * Script inline para el `<head>` que aplica `data-mtx-theme` y `data-mtx-theme-mode` en `<html>`
 * antes del primer pintado (sin parpadeo en SSR). Precedencia: `?theme=` > localStorage > `defaultMode`.
 * Añade `suppressHydrationWarning` a `<html>` porque el script modifica sus atributos.
 * @param {string|null|false} [storageKey='mtx-theme'] Clave de localStorage (falsy la ignora).
 * @param {ThemeScriptOptions} [options] Modo por defecto y parámetro de URL.
 * @returns {string} Código JavaScript (sin etiqueta `<script>`).
 */
export function getThemeScript(
  storageKey: string | null | false = DEFAULT_THEME_STORAGE_KEY,
  options: ThemeScriptOptions = {},
): string {
  const defaultMode = normalizeThemeMode(options.defaultMode) ?? 'light';
  const query = options.query === undefined ? DEFAULT_THEME_QUERY : options.query;
  // JSON escapado: impide cerrar la etiqueta `<script>` desde la clave.
  const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
  return `(function(){try{var k=${json(storageKey || null)},q=${json(query || null)},m=null,M=['light','dark','system'];`
    + 'function n(v){v=typeof v==="string"?v.trim().toLowerCase():"";return M.indexOf(v)>-1?v:null}'
    + 'if(q){try{m=n(new URLSearchParams(window.location.search).get(q))}catch(e){}}'
    + 'if(!m&&k){try{m=n(window.localStorage.getItem(k))}catch(e){}}'
    + `m=m||${json(defaultMode)};`
    + `var r=m==="system"?(window.matchMedia&&window.matchMedia(${json(DARK_SCHEME_QUERY)}).matches?"dark":"light"):m;`
    + 'var h=document.documentElement;h.setAttribute("data-mtx-theme",r);h.setAttribute("data-mtx-theme-mode",m)'
    + '}catch(e){}})();';
}
