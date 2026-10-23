/**
 * Sistema centralizado de Internacionalización (i18n) para Materix UI.
 * Idioma por defecto: Inglés ('en').
 */
import { emit } from '../core/events.js';
import en from './locales/en.js';
import es from './locales/es.js';

/**
 * Registro interno de diccionarios de idiomas disponibles.
 * @type {Record<string, object>}
 */
const locales = {
  en,
  es
};

/**
 * Idioma activo global.
 * @type {string}
 */
let currentLocale = 'en';

/**
 * Indica si el idioma global se fijó explícitamente con `setLocale()`.
 * Solo entonces prevalece sobre `<html lang>`.
 * @type {boolean}
 */
let explicitLocale = false;

/**
 * Reduce un código de idioma a uno registrado (`es-MX` → `es`).
 *
 * @param {string|null} raw Código recibido.
 * @returns {string|null} Código registrado o `null`.
 */
function toRegistered(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const normalized = raw.toLowerCase().trim();
  if (locales[normalized]) return normalized;
  const prefix = normalized.split('-')[0];
  return locales[prefix] ? prefix : null;
}

/**
 * Realiza un merge recursivo profundo de objetos.
 *
 * @param {object} target Objeto destino.
 * @param {object} source Objeto fuente.
 * @returns {object}
 */
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Reemplaza marcadores de posición como {0}, {1} o {name} en una cadena.
 *
 * @param {string} text Texto plantilla.
 * @param {Array|object} [params] Parámetros a interpolar.
 * @returns {string} Texto formateado.
 */
function interpolate(text, params) {
  if (typeof text !== 'string' || !params) return text;

  if (Array.isArray(params)) {
    return text.replace(/\{(\d+)\}/g, (match, index) => {
      const idx = parseInt(index, 10);
      return params[idx] !== undefined ? String(params[idx]) : match;
    });
  }

  if (typeof params === 'object') {
    return text.replace(/\{([a-zA-Z0-9_-]+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  return text;
}

/**
 * Obtiene el idioma global efectivo: `setLocale()` explícito > `<html lang>` > `en`.
 *
 * @returns {string} Código de idioma (ej. 'en', 'es').
 */
export function getLocale() {
  return resolveGlobalLocale();
}

/**
 * Establece el idioma activo globalmente en Materix UI.
 * Prevalece sobre `<html lang>`, pero no sobre un `lang`/`data-locale` local del componente.
 *
 * @param {string} locale Código de idioma a activar.
 * @returns {boolean} true si se activó, false si el idioma no está registrado.
 */
export function setLocale(locale) {
  if (!locale || typeof locale !== 'string') return false;
  const normalized = locale.toLowerCase().trim();

  if (!locales[normalized]) {
    // Si contiene guión (ej. es-ES, en-US), intentar con el prefijo
    const prefix = normalized.split('-')[0];
    if (locales[prefix]) {
      currentLocale = prefix;
    } else {
      console.warn(`[Materix UI i18n] El idioma "${locale}" no está registrado. Manteniendo "${getLocale()}".`);
      return false;
    }
  } else {
    currentLocale = normalized;
  }
  explicitLocale = true;

  // Notificar cambio de idioma a través de evento DOM
  if (typeof document !== 'undefined') {
    emit(document, 'mtx:locale:change', { locale: currentLocale }, { aliases: ['mtx:localechange'] });
  }

  return true;
}

/**
 * Anula el idioma fijado con `setLocale()`: vuelve a decidir `<html lang>` y,
 * en su defecto, `en`. Emite `mtx:locale:change`.
 */
export function resetLocale() {
  currentLocale = 'en';
  explicitLocale = false;
  if (typeof document !== 'undefined') {
    emit(document, 'mtx:locale:change', { locale: getLocale() }, { aliases: ['mtx:localechange'] });
  }
}

/**
 * Registra un nuevo idioma completo o reemplaza uno existente.
 *
 * @param {string} code Código de idioma (ej. 'fr', 'pt').
 * @param {object} dictionary Diccionario de traducciones.
 */
export function addLocale(code, dictionary) {
  if (!code || typeof code !== 'string' || !dictionary) return;
  const normalized = code.toLowerCase().trim();
  locales[normalized] = {
    ...dictionary,
    code: normalized
  };
}

/**
 * Actualiza o sobreescribe cadenas específicas de un idioma existente sin borrar las demás.
 *
 * @param {string} code Código de idioma (ej. 'es', 'en').
 * @param {object} partialDictionary Diccionario parcial con los cambios.
 */
export function updateLocale(code, partialDictionary) {
  if (!code || typeof code !== 'string' || !partialDictionary) return;
  const normalized = code.toLowerCase().trim();
  if (locales[normalized]) {
    locales[normalized] = deepMerge(locales[normalized], partialDictionary);
  } else {
    addLocale(normalized, partialDictionary);
  }
}

/**
 * Obtiene el diccionario completo de un idioma.
 *
 * @param {string} [locale] Código de idioma opcional. Si se omite, usa el global efectivo (`getLocale()`).
 * @returns {object} Diccionario del idioma.
 */
export function getDictionary(locale = null) {
  const code = locale ? String(locale).toLowerCase().trim() : resolveGlobalLocale();
  return locales[code] || locales.en;
}

/**
 * Obtiene una traducción específica de un componente.
 *
 * @param {string} component Nombre del componente en el diccionario (ej. 'dateTimePicker', 'select').
 * @param {string} key Clave del texto (ej. 'cancel', 'ok', 'today').
 * @param {Array|object} [params] Parámetros para interpolar {0} o {nombre}.
 * @param {*} [fallback] Valor de respaldo si la clave no existe.
 * @param {string} [locale] Locale específico a consultar (opcional).
 * @returns {*} Traducción obtenida o fallback.
 */
export function t(component, key, params = null, fallback = null, locale = null) {
  const dict = getDictionary(locale);
  const compDict = dict[component] || (locales.en && locales.en[component]) || {};

  let val = compDict[key];
  if (val === undefined) {
    // Buscar en el diccionario en inglés como fallback
    if (locales.en && locales.en[component] && locales.en[component][key] !== undefined) {
      val = locales.en[component][key];
    } else {
      val = fallback !== null ? fallback : key;
    }
  }

  if (typeof val === 'string' && params) {
    return interpolate(val, params);
  }

  return val;
}

/**
 * Idioma global: `setLocale()` explícito > `<html lang>` > idioma por defecto (`en`).
 *
 * @returns {string} Código de idioma.
 */
function resolveGlobalLocale() {
  if (explicitLocale) return currentLocale;
  const html = typeof document !== 'undefined' ? document.documentElement : null;
  return (html && toRegistered(html.getAttribute('lang'))) || currentLocale;
}

/**
 * Resuelve el código de idioma para un elemento HTML específico.
 *
 * Precedencia: `data-locale`/`data-lang`/`lang` en el elemento o en el ancestro más
 * cercano que los declare (el `lang` de `<html>` no cuenta aquí) > `setLocale()` explícito
 * > `<html lang>` > `en`. Un idioma local no registrado pasa al siguiente nivel.
 *
 * @param {HTMLElement|null} element Elemento DOM.
 * @returns {string} Código de idioma resuelto.
 */
export function getComponentLocale(element) {
  if (!element || typeof element.getAttribute !== 'function') {
    return resolveGlobalLocale();
  }

  const html = typeof document !== 'undefined' ? document.documentElement : null;
  for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
    const raw = node.getAttribute('data-locale')
      || node.getAttribute('data-lang')
      || (node !== html ? node.getAttribute('lang') : null);
    if (raw) {
      const local = toRegistered(raw);
      if (local) return local;
      break;
    }
  }

  return resolveGlobalLocale();
}

export const i18n = {
  getLocale,
  setLocale,
  resetLocale,
  addLocale,
  updateLocale,
  getDictionary,
  t,
  getComponentLocale
};

export default i18n;
