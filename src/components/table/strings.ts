'use client';
import { useCallback } from 'react';
import { resolveLocaleCode, useLocale, useT } from '../../i18n';
import type { InterpolationParams } from '../../i18n';

/**
 * Textos por defecto de la tabla (idénticos a vanilla). Los diccionarios centrales (`table.*`)
 * tienen prioridad cuando existan.
 */
export const TABLE_STRINGS: Record<string, Record<string, string>> = {
  en: {
    selectAllRows: 'Select all rows',
    selectRow: 'Select {0}',
    selectedCountSingular: '{0} selected',
    selectedCountPlural: '{0} selected',
    toolbar: 'Table toolbar',
    scrollRegion: 'Scrollable table',
  },
  es: {
    selectAllRows: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar {0}',
    selectedCountSingular: '{0} seleccionado',
    selectedCountPlural: '{0} seleccionados',
    toolbar: 'Barra de herramientas de la tabla',
    scrollRegion: 'Tabla desplazable',
  },
};

/** Traductor de textos de la tabla. */
export type TableTranslate = (key: string, params?: InterpolationParams | null) => string;

/**
 * Traductor de la sección `table` con respaldo local en/es.
 * @param {string} [locale] Idioma forzado.
 * @returns {TableTranslate} Traductor.
 */
export function useTableStrings(locale?: string | null): TableTranslate {
  const t = useT('table', locale);
  const contextLocale = useLocale();
  const code = (locale && resolveLocaleCode(locale)) || contextLocale;
  return useCallback<TableTranslate>(
    (key, params = null) => {
      const local = TABLE_STRINGS[code]?.[key] ?? TABLE_STRINGS.en[key] ?? key;
      return t(key, params, local);
    },
    [t, code],
  );
}
