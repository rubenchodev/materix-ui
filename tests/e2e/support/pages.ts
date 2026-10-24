/**
 * Descubrimiento de páginas de examples/ para las specs E2E (servidas desde dist-examples/).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export interface ExamplePageInfo {
  slug: string;
  url: string;
}

/**
 * Lista el índice y cada examples/{slug}/index.html (excluye `shared` y carpetas `_*`).
 * @returns {ExamplePageInfo[]} Páginas encontradas.
 */
const listPages = (): ExamplePageInfo[] => {
  const dir = path.join(REPO_ROOT, 'examples');
  if (!fs.existsSync(dir)) return [];
  const pages: ExamplePageInfo[] = [];
  if (fs.existsSync(path.join(dir, 'index.html'))) pages.push({ slug: 'index', url: '/index.html' });
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === 'shared' || name.startsWith('_')) continue;
    if (fs.existsSync(path.join(dir, name, 'index.html'))) pages.push({ slug: name, url: `/${name}/index.html` });
  }
  return pages;
};

/** Todas las páginas de ejemplo, incluido el índice. */
export const ALL_PAGES = listPages();

/** Temas a verificar. */
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/**
 * URL con el tema forzado (`?theme=` lo aplica examples/shared/theme.ts).
 * @param {string} url Ruta de la página.
 * @param {Theme} theme Tema.
 * @returns {string} URL final.
 */
export const withTheme = (url: string, theme: Theme): string => `${url}?theme=${theme}`;
