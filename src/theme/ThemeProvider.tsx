'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import {
  DARK_SCHEME_QUERY,
  DEFAULT_THEME_QUERY,
  DEFAULT_THEME_STORAGE_KEY,
  getThemeScript,
  normalizeThemeMode,
  readQueryThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  writeStoredThemeMode,
} from './themeScript';
import type { ResolvedThemeMode, ThemeMode, ThemeScriptOptions } from './themeScript';

/** Opciones de `setMode`. */
export interface SetThemeModeOptions {
  /** `false` evita guardar en localStorage aunque haya `storageKey`. */
  persist?: boolean;
}

/** Valor devuelto por {@link useTheme}. */
export interface ThemeContextValue {
  /** Modo elegido (`light`, `dark` o `system`). */
  mode: ThemeMode;
  /** Tema efectivo (`light` o `dark`). */
  resolvedMode: ResolvedThemeMode;
  /** Fija el modo. Lanza `TypeError` si no es válido. */
  setMode: (mode: ThemeMode, options?: SetThemeModeOptions) => void;
  /** Alterna claro/oscuro (desde `system`, al opuesto del tema efectivo). */
  toggle: () => void;
  /** Dónde se aplica el tema: `<html>` (`document`) o nada (`none`). */
  target: ThemeTarget;
}

/** Destino del atributo `data-mtx-theme`. */
export type ThemeTarget = 'document' | 'none';

/** Props de {@link ThemeProvider}. */
export interface ThemeProviderProps {
  /** Modo controlado. Si se pasa, el provider no lee URL ni almacenamiento. */
  mode?: ThemeMode;
  /** Modo inicial no controlado (por defecto `light`). */
  defaultMode?: ThemeMode;
  /** Clave de localStorage (`mtx-theme`); `null`/`false` desactiva la persistencia. */
  storageKey?: string | null | false;
  /** Parámetro de URL que fuerza el modo (`theme`); `false` lo desactiva. */
  query?: string | false;
  /** `document` aplica `data-mtx-theme`/`data-mtx-theme-mode` en `<html>`; `none` no toca el DOM. */
  target?: ThemeTarget;
  /** Notifica cada cambio de modo pedido por `setMode`/`toggle`. */
  onModeChange?: (mode: ThemeMode, resolvedMode: ResolvedThemeMode) => void;
  children?: ReactNode;
}

const noop = () => {};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** `useLayoutEffect` en el cliente y `useEffect` en el servidor (sin avisos SSR). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Suscribe a cambios de `prefers-color-scheme`.
 * @param {() => void} callback Callback de React.
 * @returns {() => void} Cancelación.
 */
function subscribeScheme(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return noop;
  const media = window.matchMedia(DARK_SCHEME_QUERY);
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }
  media.addListener?.(callback);
  return () => media.removeListener?.(callback);
}

/** @returns {boolean} Preferencia oscura del sistema. */
function getSchemeSnapshot(): boolean {
  return resolveThemeMode('system') === 'dark';
}

/** @returns {boolean} En servidor no hay preferencia: claro. */
function getSchemeServerSnapshot(): boolean {
  return false;
}

/**
 * Proveedor de tema de Materix UI (claro, oscuro o sistema), portado de `Materix.theme`.
 * Precedencia inicial (no controlado): `?theme=` > localStorage > `defaultMode` > `light`.
 */
export function ThemeProvider({
  mode: controlledMode,
  defaultMode = 'light',
  storageKey = DEFAULT_THEME_STORAGE_KEY,
  query = DEFAULT_THEME_QUERY,
  target = 'document',
  onModeChange,
  children,
}: ThemeProviderProps) {
  const controlled = normalizeThemeMode(controlledMode);
  const [innerMode, setInnerMode] = useState<ThemeMode>(() => normalizeThemeMode(defaultMode) ?? 'light');
  const mode = controlled ?? innerMode;
  const prefersDark = useSyncExternalStore(subscribeScheme, getSchemeSnapshot, getSchemeServerSnapshot);
  const resolvedMode = resolveThemeMode(mode, prefersDark);
  // Evita escribir en <html> el modo por defecto si la lectura inicial lo va a cambiar.
  const skipApply = useRef(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const changeRef = useRef(onModeChange);
  changeRef.current = onModeChange;

  // Lectura inicial tras hidratar: el render de servidor y el primero del cliente coinciden.
  useIsomorphicLayoutEffect(() => {
    if (controlled) return;
    const initial = readQueryThemeMode(query) ?? readStoredThemeMode(storageKey);
    if (initial && initial !== modeRef.current) {
      skipApply.current = true;
      setInnerMode(initial);
    }
    // Solo al montar: los cambios posteriores llegan por setMode o el evento storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (target !== 'document' || typeof document === 'undefined') return;
    if (skipApply.current) {
      skipApply.current = false;
      return;
    }
    const root = document.documentElement;
    root.setAttribute('data-mtx-theme', resolvedMode);
    root.setAttribute('data-mtx-theme-mode', mode);
  }, [target, mode, resolvedMode]);

  // Sincroniza pestañas: otra pestaña cambió la clave de almacenamiento.
  useEffect(() => {
    if (controlled || !storageKey || typeof window === 'undefined') return undefined;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const next = normalizeThemeMode(event.newValue);
      if (next) setInnerMode(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [controlled, storageKey]);

  const setMode = useCallback(
    (next: ThemeMode, options: SetThemeModeOptions = {}) => {
      const normalized = normalizeThemeMode(next);
      if (!normalized) {
        throw new TypeError(`[Materix UI theme] Modo no válido: "${String(next)}". Usa light, dark o system.`);
      }
      if (!controlled) setInnerMode(normalized);
      if (options.persist !== false) writeStoredThemeMode(storageKey, normalized);
      changeRef.current?.(normalized, resolveThemeMode(normalized));
    },
    [controlled, storageKey],
  );

  const toggle = useCallback(() => {
    setMode(resolveThemeMode(modeRef.current) === 'dark' ? 'light' : 'dark');
  }, [setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedMode, setMode, toggle, target }),
    [mode, resolvedMode, setMode, toggle, target],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const FALLBACK: ThemeContextValue = {
  mode: 'light',
  resolvedMode: 'light',
  setMode: noop,
  toggle: noop,
  target: 'none',
};

/**
 * Tema actual y acciones. Sin `ThemeProvider` devuelve `light` y acciones vacías.
 * @returns {ThemeContextValue} `{ mode, resolvedMode, setMode, toggle, target }`.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? FALLBACK;
}

/** Props de {@link ThemeScript}. */
export interface ThemeScriptProps extends ThemeScriptOptions {
  /** Clave de localStorage (debe coincidir con la del `ThemeProvider`). */
  storageKey?: string | null | false;
  /** Nonce de CSP. */
  nonce?: string;
}

/**
 * `<script>` anti-parpadeo para el `<head>` en SSR (ver {@link getThemeScript}).
 */
export function ThemeScript({ storageKey = DEFAULT_THEME_STORAGE_KEY, nonce, ...options }: ThemeScriptProps) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: getThemeScript(storageKey, options) }} />;
}
