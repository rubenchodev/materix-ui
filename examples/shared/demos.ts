/**
 * Carga de demos: convierte el resultado de `import.meta.glob(..., { eager: true })` en una lista ordenada.
 * Contrato de cada archivo `demos/{slug}/NN-name.tsx`:
 *   export default function Demo() { ... }
 *   export const title = { en: 'Basic usage', es: 'Uso básico' };
 *   export const description = { en: '...', es: '...' }; // opcional
 */
import type { ComponentType } from 'react';

/** Texto bilingüe. */
export interface LocalizedText {
  en: string;
  es: string;
}

/** Módulo de demo tal como lo exporta cada archivo. */
export interface DemoModule {
  default?: ComponentType;
  title?: LocalizedText;
  description?: LocalizedText;
}

/** Demo normalizada lista para pintar. */
export interface DemoEntry {
  /** Id de ancla derivado del nombre sin prefijo (`01-basic.tsx` → `basic`). */
  id: string;
  /** Prefijo numérico NN usado para ordenar. */
  order: number;
  /** Nombre de archivo original. */
  file: string;
  title: LocalizedText;
  description?: LocalizedText;
  Component: ComponentType;
}

const FILE_RE = /(?:^|\/)(\d+)-([^/]+)\.tsx$/;
const LOCALIZED_RE = /\.[a-z]{2}\.tsx$/;

/**
 * Normaliza y ordena por prefijo NN los módulos de un glob eager.
 * @param {Record<string, unknown>} globResult Resultado de `import.meta.glob` con `eager: true`.
 * @returns {DemoEntry[]} Demos ordenadas.
 * @throws {Error} Si un archivo no sigue el patrón `NN-name.tsx` o le falta `default`/`title`.
 */
export const loadDemos = (globResult: Record<string, unknown>): DemoEntry[] =>
  Object.entries(globResult)
    // Las variantes traducidas (`NN-name.es.tsx`) solo las usa la documentación.
    .filter(([path]) => !LOCALIZED_RE.test(path))
    .map(([path, raw]): DemoEntry => {
      const match = FILE_RE.exec(path);
      if (!match) throw new Error(`[examples] "${path}" debe llamarse NN-name.tsx`);
      const mod = raw as DemoModule;
      if (typeof mod.default !== 'function' && typeof mod.default !== 'object') {
        throw new Error(`[examples] "${path}" no exporta un componente por defecto`);
      }
      if (!mod.title?.en || !mod.title?.es) {
        throw new Error(`[examples] "${path}" debe exportar title = { en, es }`);
      }
      return {
        id: match[2],
        order: Number(match[1]),
        file: path.slice(path.lastIndexOf('/') + 1),
        title: mod.title,
        description: mod.description,
        Component: mod.default as ComponentType,
      };
    })
    .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
