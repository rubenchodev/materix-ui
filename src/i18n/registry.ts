/**
 * Registro global de idiomas (puro, sin React): diccionarios, interpolación y traducción.
 * Portado de `src/i18n/index.js` de Materix UI vanilla.
 */
import en from './locales/en';
import es from './locales/es';
import type {
  BaseDictionaryShape,
  InterpolationParams,
  LocaleDictionary,
  LocaleMessages,
  PartialDictionary,
} from './types';

/** Idioma por defecto y de respaldo. */
export const DEFAULT_LOCALE = 'en';

const locales: Record<string, BaseDictionaryShape> = { en, es };

let version = 0;
const listeners = new Set<() => void>();

/** Notifica a los suscriptores (hooks) que el registro cambió. */
function notify(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

/**
 * Suscribe un callback a los cambios del registro (`addLocale`/`updateLocale`).
 * @param {() => void} listener Callback.
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeLocales(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** @returns {number} Versión del registro (cambia en cada alta o actualización). */
export function getLocalesVersion(): number {
  return version;
}

/**
 * Indica si un valor es un objeto plano (no array).
 * @param {unknown} item Valor.
 * @returns {boolean} `true` si es objeto plano.
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Merge recursivo profundo (los arrays se reemplazan).
 * @param {object} target Destino.
 * @param {object} source Fuente.
 * @returns {object} Nuevo objeto combinado.
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown> | null | undefined): T {
  const output: Record<string, unknown> = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const value = source[key];
      if (isObject(value)) {
        output[key] = key in target && isObject(target[key])
          ? deepMerge(target[key] as Record<string, unknown>, value)
          : value;
      } else {
        output[key] = value;
      }
    });
  }
  return output as T;
}

/**
 * Reemplaza `{0}`, `{1}` o `{name}` en una plantilla.
 * @param {string} text Plantilla.
 * @param {InterpolationParams} [params] Parámetros.
 * @returns {string} Texto interpolado (los marcadores sin valor se conservan).
 */
export function interpolate(text: string, params?: InterpolationParams | null): string {
  if (typeof text !== 'string' || !params) return text;
  if (Array.isArray(params)) {
    return text.replace(/\{(\d+)\}/g, (match, index: string) => {
      const value = params[parseInt(index, 10)];
      return value !== undefined ? String(value) : match;
    });
  }
  if (typeof params === 'object') {
    const named = params as Record<string, unknown>;
    return text.replace(/\{([a-zA-Z0-9_-]+)\}/g, (match, key: string) =>
      named[key] !== undefined ? String(named[key]) : match);
  }
  return text;
}

/**
 * Reduce un código de idioma a uno registrado (`es-MX` → `es`).
 * @param {string|null|undefined} raw Código recibido.
 * @returns {string|null} Código registrado o `null`.
 */
export function resolveLocaleCode(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const normalized = raw.toLowerCase().trim().replace('_', '-');
  if (locales[normalized]) return normalized;
  const prefix = normalized.split('-')[0];
  return locales[prefix] ? prefix : null;
}

/**
 * Indica si hay un diccionario registrado para el código (o su idioma base).
 * @param {string} code Código de idioma.
 * @returns {boolean} `true` si está registrado.
 */
export function hasLocale(code: string): boolean {
  return resolveLocaleCode(code) !== null;
}

/** @returns {string[]} Códigos de idioma registrados. */
export function getLocales(): string[] {
  return Object.keys(locales);
}

/**
 * Registra un idioma completo o reemplaza uno existente.
 * @param {string} code Código (`fr`, `pt`).
 * @param {PartialDictionary} dictionary Diccionario (las claves ausentes caen a inglés).
 */
export function addLocale(code: string, dictionary: PartialDictionary | Record<string, unknown>): void {
  if (!code || typeof code !== 'string' || !dictionary) return;
  const normalized = code.toLowerCase().trim();
  locales[normalized] = { name: normalized, ...dictionary, code: normalized } as BaseDictionaryShape;
  notify();
}

/**
 * Sobrescribe cadenas de un idioma sin borrar las demás (lo crea si no existe).
 * @param {string} code Código de idioma.
 * @param {PartialDictionary} partialDictionary Cambios parciales.
 */
export function updateLocale(code: string, partialDictionary: PartialDictionary | Record<string, unknown>): void {
  if (!code || typeof code !== 'string' || !partialDictionary) return;
  const normalized = code.toLowerCase().trim();
  if (locales[normalized]) {
    locales[normalized] = deepMerge(locales[normalized], partialDictionary as Record<string, unknown>);
    notify();
  } else {
    addLocale(normalized, partialDictionary);
  }
}

/**
 * Diccionario completo de un idioma (o el inglés si no existe).
 * @param {string} [locale] Código; se reduce al idioma base registrado.
 * @returns {LocaleDictionary} Diccionario.
 */
export function getDictionary(locale?: string | null): LocaleDictionary {
  const code = resolveLocaleCode(locale) ?? DEFAULT_LOCALE;
  return (locales[code] ?? locales.en) as LocaleDictionary;
}

/**
 * Traduce una clave de un componente con fallback a inglés (misma semántica que vanilla `t()`).
 * @param {string} component Sección del diccionario (`dialog`, `select`…).
 * @param {string} key Clave.
 * @param {InterpolationParams} [params] Parámetros de interpolación.
 * @param {*} [fallback] Respaldo si la clave no existe en el idioma ni en inglés (por defecto, la clave).
 * @param {string} [locale] Locale crudo (`es-MX`, `fr`); por defecto `en`.
 * @param {LocaleMessages} [overrides] Textos por idioma que prevalecen sobre el registro.
 * @returns {*} Traducción.
 */
export function translate<R = string>(
  component: string,
  key: string,
  params: InterpolationParams | null = null,
  fallback: R | null = null,
  locale: string | null = DEFAULT_LOCALE,
  overrides?: LocaleMessages | null,
): R {
  const code = resolveLocaleCode(locale) ?? DEFAULT_LOCALE;
  const section = (dict: unknown): Record<string, unknown> | undefined => {
    const value = isObject(dict) ? dict[component] : undefined;
    return isObject(value) ? value : undefined;
  };
  const english = section(locales.en);
  const normalizeKey = (raw: string) => raw.toLowerCase().trim().replace(/_/g, '-');
  // Overrides con claves normalizadas (`es_MX` ≡ `es-mx`).
  const overrideFor = (lang: string): unknown => {
    if (!overrides) return undefined;
    const match = Object.keys(overrides).find((k) => normalizeKey(k) === lang);
    const override = match ? section(overrides[match]) : undefined;
    return override ? override[key] : undefined;
  };
  const fromRegistry = (lang: string): unknown => {
    const base = section(locales[lang]);
    return base ? base[key] : undefined;
  };

  // Precedencia: override del locale exacto > override del idioma base > override del código
  // registrado > registro > inglés.
  const raw = normalizeKey(typeof locale === 'string' ? locale : '');
  const candidates = Array.from(new Set([raw, raw.split('-')[0], code].filter(Boolean)));
  let value: unknown;
  for (const lang of candidates) {
    value = overrideFor(lang);
    if (value !== undefined) break;
  }
  if (value === undefined) value = fromRegistry(code);
  if (value === undefined && code !== DEFAULT_LOCALE) value = overrideFor(DEFAULT_LOCALE) ?? fromRegistry(DEFAULT_LOCALE);
  if (value === undefined && english) value = english[key];
  if (value === undefined) value = fallback !== null ? fallback : key;

  if (typeof value === 'string' && params) return interpolate(value, params) as R;
  return value as R;
}
