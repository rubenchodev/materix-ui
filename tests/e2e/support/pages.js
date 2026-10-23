/**
 * Descubrimiento dinámico de páginas de /examples y /templates para las specs E2E.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

/**
 * Lista las subcarpetas de `dir` que contienen index.html (excluye `shared`).
 * @param {string} dir Carpeta relativa a la raíz (examples|templates).
 * @returns {{id: string, kind: string, slug: string, url: string}[]} Páginas encontradas.
 */
const listPages = (dir) => {
  const abs = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const pages = [];
  if (fs.existsSync(path.join(abs, 'index.html'))) {
    pages.push({ id: `${dir}-index`, kind: dir, slug: 'index', url: `/${dir}/index.html` });
  }
  for (const name of fs.readdirSync(abs).sort()) {
    if (name === 'shared') continue;
    if (fs.existsSync(path.join(abs, name, 'index.html'))) {
      pages.push({ id: `${dir}-${name}`, kind: dir, slug: name, url: `/${dir}/${name}/index.html` });
    }
  }
  return pages;
};

/** Todas las páginas de ejemplos y plantillas (incluye las portadas index.html). */
export const ALL_PAGES = [...listPages('examples'), ...listPages('templates')];

/** Temas a verificar. */
export const THEMES = /** @type {const} */ (['light', 'dark']);

/**
 * Indica si existe un ejemplo (componente creado por otro agente quizá aún no).
 * @param {string} slug Carpeta dentro de /examples.
 * @returns {boolean} true si existe examples/{slug}/index.html.
 */
export const exampleExists = (slug) => fs.existsSync(path.join(REPO_ROOT, 'examples', slug, 'index.html'));

/**
 * Construye la URL de una página con el tema forzado (`?theme=` lo soportan theme.js y template.js).
 * @param {string} url Ruta de la página.
 * @param {'light'|'dark'} theme Tema.
 * @returns {string} URL final.
 */
export const withTheme = (url, theme) => `${url}?theme=${theme}`;
