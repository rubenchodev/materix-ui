/**
 * Tema de Materix UI para React: `ThemeProvider`, `useTheme`, `MaterixProvider` y script anti-parpadeo.
 */
export { ThemeProvider, ThemeScript, useTheme } from './ThemeProvider';
export type {
  SetThemeModeOptions,
  ThemeContextValue,
  ThemeProviderProps,
  ThemeScriptProps,
  ThemeTarget,
} from './ThemeProvider';
export { MaterixProvider } from './MaterixProvider';
export type { MaterixProviderProps } from './MaterixProvider';
export {
  DARK_SCHEME_QUERY,
  DEFAULT_THEME_QUERY,
  DEFAULT_THEME_STORAGE_KEY,
  THEME_MODES,
  getThemeScript,
  normalizeThemeMode,
  readQueryThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  systemPrefersDark,
  writeStoredThemeMode,
} from './themeScript';
export type { ResolvedThemeMode, ThemeMode, ThemeScriptOptions } from './themeScript';
