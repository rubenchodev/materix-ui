/**
 * Utilidades de texto para búsqueda y filtrado (Autocomplete y Select de vanilla).
 */

/** Rango de una coincidencia en el texto original. */
export interface TextMatch {
  start: number;
  end: number;
}

/**
 * Normaliza texto para comparar: sin tildes ni diacríticos y en minúsculas.
 * @param {unknown} text Texto de entrada.
 * @returns {string} Texto normalizado.
 */
export function normalizeText(text: unknown): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Localiza la primera coincidencia de `query` en `label` ignorando mayúsculas y tildes.
 * @param {string} label Texto donde buscar.
 * @param {string} query Texto buscado.
 * @param {boolean} [fromStart=false] Solo coincidencias al inicio.
 * @returns {TextMatch|null} Rango en `label` o `null`.
 */
export function findMatch(label: string | null | undefined, query: string | null | undefined, fromStart = false): TextMatch | null {
  const needle = normalizeText(query);
  if (!needle.trim() || !label) return null;
  let haystack = '';
  const map: TextMatch[] = [];
  let offset = 0;
  for (const char of String(label)) {
    for (const piece of normalizeText(char)) {
      haystack += piece;
      // Una entrada por unidad UTF-16 (los emoji ocupan dos): corrige el desfase de vanilla.
      for (let i = 0; i < piece.length; i++) map.push({ start: offset, end: offset + char.length });
    }
    offset += char.length;
  }
  const index = haystack.indexOf(needle);
  if (index === -1 || (fromStart && index !== 0)) return null;
  return { start: map[index].start, end: map[index + needle.length - 1].end };
}

/**
 * Divide un texto en segmentos resaltados según {@link findMatch} (para pintar `<mark>`).
 * @param {string} label Texto.
 * @param {string} query Búsqueda.
 * @param {boolean} [fromStart=false] Solo al inicio.
 * @returns {{text: string, match: boolean}[]} Segmentos en orden.
 */
export function splitMatch(label: string, query: string, fromStart = false): { text: string; match: boolean }[] {
  const range = findMatch(label, query, fromStart);
  if (!range) return label ? [{ text: label, match: false }] : [];
  return [
    { text: label.slice(0, range.start), match: false },
    { text: label.slice(range.start, range.end), match: true },
    { text: label.slice(range.end), match: false },
  ].filter((part) => part.text !== '');
}

/** Opción normalizada de Autocomplete. */
export interface NormalizedOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  [extra: string]: unknown;
}

/**
 * Convierte una opción cruda (texto u objeto) al formato interno de Autocomplete.
 * @param {unknown} raw Opción de entrada.
 * @returns {NormalizedOption|null} Opción `{ value, label, group?, disabled? }` conservando datos extra.
 */
export function normalizeOption(raw: unknown): NormalizedOption | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'object') {
    const text = String(raw);
    return { value: text, label: text };
  }
  const source = raw as Record<string, unknown>;
  const value = source.value !== undefined && source.value !== null ? String(source.value) : String(source.label ?? '');
  const label = source.label !== undefined && source.label !== null ? String(source.label) : value;
  const option: NormalizedOption = { ...source, value, label };
  if (source.group !== undefined && source.group !== null && source.group !== '') option.group = String(source.group);
  else delete option.group;
  option.disabled = Boolean(source.disabled);
  if (!option.disabled) delete option.disabled;
  return option;
}

/**
 * Filtra opciones por etiqueta sin tildes ni mayúsculas (`_computeFiltered` de Autocomplete).
 * @param {T[]} options Opciones con `label`.
 * @param {string} query Búsqueda.
 * @param {'any'|'start'} [matchFrom='any'] `start` solo coincide al inicio.
 * @returns {T[]} Copia filtrada (todas si la búsqueda está vacía).
 */
export function filterOptions<T extends { label: string }>(options: readonly T[], query: string | null | undefined, matchFrom: 'any' | 'start' = 'any'): T[] {
  const needle = normalizeText(query);
  if (!needle.trim()) return options.slice();
  return options.filter((opt) => {
    const label = normalizeText(opt.label);
    return matchFrom === 'start' ? label.startsWith(needle) : label.includes(needle);
  });
}

/**
 * Texto indexable de una opción de Select: `texto + ' ' + valor` en minúsculas.
 * @param {string} text Texto visible.
 * @param {string} value Valor.
 * @returns {string} Texto de búsqueda.
 */
export function getSelectSearchText(text: string, value: string): string {
  return `${text} ${value}`.toLowerCase();
}

/**
 * Indica si una opción de Select coincide con la búsqueda (`_filterOptions` de vanilla).
 * @param {string} searchable Texto indexable ({@link getSelectSearchText}).
 * @param {string} term Búsqueda.
 * @returns {boolean} `true` si coincide (o la búsqueda está vacía).
 */
export function matchesSelectSearch(searchable: string, term: string | null | undefined): boolean {
  const query = (term || '').toLowerCase().trim();
  return !query || searchable.includes(query);
}

/**
 * Filtra opciones de Select por texto y valor.
 * @param {T[]} options Opciones `{ label, value }`.
 * @param {string} term Búsqueda.
 * @returns {T[]} Opciones visibles.
 */
export function filterSelectOptions<T extends { label: string; value: string }>(options: readonly T[], term: string | null | undefined): T[] {
  return options.filter((opt) => matchesSelectSearch(getSelectSearchText(opt.label, opt.value), term));
}

/**
 * Interpreta `data-selected-text-format="count > N"` de Select.
 * @param {string} format Formato.
 * @returns {number} `N`, o `Infinity` si el formato no es `count > N`.
 */
export function parseCountFormat(format: string | null | undefined): number {
  const match = /^count\s*>\s*(\d+)$/.exec(format || '');
  return match ? parseInt(match[1], 10) : Infinity;
}

/** Formatos del texto mostrado en Select múltiple. */
export type SelectedTextFormat = 'values' | 'count' | 'static' | `count > ${number}` | (string & {});

/**
 * Decide qué mostrar en un Select múltiple (`_renderDisplay` de vanilla).
 * @param {number} selectedCount Opciones seleccionadas.
 * @param {SelectedTextFormat} format Formato (`values`, `count`, `static`, `count > N`).
 * @returns {'placeholder'|'values'|'count'} Qué debe pintarse.
 */
export function getSelectedDisplayKind(selectedCount: number, format: SelectedTextFormat = 'values'): 'placeholder' | 'values' | 'count' {
  if (!selectedCount || format === 'static') return 'placeholder';
  if (format === 'count') return 'count';
  if (format === 'values' || selectedCount <= parseCountFormat(format)) return 'values';
  return 'count';
}
