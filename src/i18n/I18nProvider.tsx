'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_LOCALE,
  deepMerge,
  getLocalesVersion,
  resolveLocaleCode,
  subscribeLocales,
  translate,
} from './registry';
import type { I18nComponent, LocaleMessages, TranslateFn } from './types';

/** Valor del contexto de idioma. */
export interface I18nContextValue {
  /** Código de idioma registrado (`es`). */
  locale: string;
  /** Locale crudo apto para `Intl`, con región si se conoce (`es-MX`). */
  intlLocale: string;
  /** Overrides de textos por idioma. */
  messages: LocaleMessages | null;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Props de {@link I18nProvider}. */
export interface I18nProviderProps {
  /** Idioma (`es`, `es-MX`). Prevalece sobre `<html lang>`; si falta, se hereda del provider padre. */
  locale?: string;
  /** Textos que sobrescriben el registro, por idioma: `{ es: { dialog: { ok: 'Vale' } } }`. */
  messages?: LocaleMessages;
  children?: ReactNode;
}

/** Suscriptores de `<html lang>`: un único MutationObserver compartido. */
const htmlLangListeners = new Set<() => void>();
let htmlLangObserver: MutationObserver | null = null;

/**
 * Suscribe a cambios de `<html lang>` con un observer compartido (se desconecta sin suscriptores).
 * @param {() => void} callback Callback de React.
 * @returns {() => void} Cancelación.
 */
function subscribeHtmlLang(callback: () => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  htmlLangListeners.add(callback);
  if (!htmlLangObserver) {
    htmlLangObserver = new MutationObserver(() => htmlLangListeners.forEach((listener) => listener()));
    htmlLangObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  return () => {
    htmlLangListeners.delete(callback);
    if (!htmlLangListeners.size && htmlLangObserver) {
      htmlLangObserver.disconnect();
      htmlLangObserver = null;
    }
  };
}

/** @returns {string} Valor actual de `<html lang>`. */
function getHtmlLang(): string {
  return typeof document !== 'undefined' ? (document.documentElement.getAttribute('lang') || '').trim() : '';
}

/** @returns {string} Snapshot vacío: servidor, hidratación o `<html lang>` innecesario. */
function getEmptyLang(): string {
  return '';
}

/** Suscripción vacía para cuando el contexto ya decide el idioma. */
function subscribeNone(): () => void {
  return () => {};
}

/**
 * `<html lang>` reactivo y apto para SSR. Con `enabled=false` no se suscribe (hay contexto que decide).
 * @param {boolean} [enabled=true] Si hace falta leer `<html lang>`.
 * @returns {string} Idioma del documento (o `''`).
 */
function useHtmlLang(enabled = true): string {
  return useSyncExternalStore(enabled ? subscribeHtmlLang : subscribeNone, enabled ? getHtmlLang : getEmptyLang, getEmptyLang);
}

/** Versión del registro de idiomas para re-renderizar tras `addLocale`/`updateLocale`. */
function useLocalesVersion(): number {
  return useSyncExternalStore(subscribeLocales, getLocalesVersion, getLocalesVersion);
}

/**
 * Indica si un locale crudo pertenece al idioma registrado (`es-MX` ∈ `es`).
 * @param {string} raw Locale crudo.
 * @param {string} lang Idioma registrado.
 * @returns {boolean} `true` si coinciden.
 */
function belongsTo(raw: string, lang: string): boolean {
  const r = raw.toLowerCase().replace('_', '-');
  return r === lang || r.startsWith(`${lang}-`);
}

/**
 * Resuelve idioma registrado y locale `Intl` a partir de un valor crudo.
 * Un idioma no registrado (`fr-FR`) usa textos en inglés pero conserva `Intl` en su idioma.
 * @param {string} raw Locale crudo.
 * @returns {{locale: string, intlLocale: string}} Resultado.
 */
function resolvePair(raw: string): { locale: string; intlLocale: string } {
  return { locale: resolveLocaleCode(raw) ?? DEFAULT_LOCALE, intlLocale: raw.trim() };
}

/**
 * Proveedor de idioma de Materix UI.
 * Precedencia: prop `locale` > provider padre > `<html lang>` > `en`.
 */
export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  const parent = useContext(I18nContext);
  const htmlLang = useHtmlLang(!(locale && locale.trim()) && !parent);

  const value = useMemo<I18nContextValue>(() => {
    let pair: { locale: string; intlLocale: string };
    if (locale && locale.trim()) pair = resolvePair(locale);
    else if (parent) pair = { locale: parent.locale, intlLocale: parent.intlLocale };
    else pair = resolveFromHtml(htmlLang);
    let merged: LocaleMessages | null = parent?.messages ?? null;
    if (messages) {
      merged = { ...(merged ?? {}) };
      Object.keys(messages).forEach((code) => {
        const key = code.toLowerCase().trim().replace(/_/g, '-');
        merged![key] = merged![key] ? deepMerge(merged![key], messages[code]) : messages[code];
      });
    }
    return { ...pair, messages: merged };
  }, [locale, messages, parent, htmlLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Idioma efectivo a partir de `<html lang>` (o `en`).
 * @param {string} htmlLang Valor de `<html lang>`.
 * @returns {{locale: string, intlLocale: string}} Resultado.
 */
function resolveFromHtml(htmlLang: string): { locale: string; intlLocale: string } {
  const locale = resolveLocaleCode(htmlLang) ?? DEFAULT_LOCALE;
  return { locale, intlLocale: htmlLang && belongsTo(htmlLang, locale) ? htmlLang : locale };
}

/**
 * Contexto de idioma efectivo, con o sin provider.
 * @returns {I18nContextValue} Idioma, locale `Intl` y overrides.
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  const htmlLang = useHtmlLang(!ctx);
  return useMemo(
    () => ctx ?? { ...resolveFromHtml(htmlLang), messages: null },
    [ctx, htmlLang],
  );
}

/**
 * Código de idioma registrado efectivo (`en`, `es`).
 * @returns {string} Idioma.
 */
export function useLocale(): string {
  return useI18n().locale;
}

/**
 * Locale apto para `Intl` con región si se conoce (`es-MX`); útil para fechas y números.
 * @returns {string} Locale crudo.
 */
export function useIntlLocale(): string {
  return useI18n().intlLocale;
}

/**
 * Traductor de un componente: `t(key, params?, fallback?)` con interpolación `{0}`/`{name}`.
 * @param {string} component Sección del diccionario (`dialog`, `pagination`…).
 * @param {string} [localeOverride] Idioma local del componente (prop `locale`), prevalece sobre el contexto.
 * @returns {TranslateFn} Función de traducción estable mientras no cambie el idioma.
 */
export function useT(component: I18nComponent | (string & {}), localeOverride?: string | null): TranslateFn {
  const { intlLocale, messages } = useI18n();
  const version = useLocalesVersion();
  // Se pasa el locale crudo: `translate` busca los overrides por región e idioma antes del registro.
  const code = (localeOverride && localeOverride.trim()) || intlLocale;
  return useCallback<TranslateFn>(
    (key, params = null, fallback = null) => translate(component, key, params, fallback, code, messages),
    // `version` invalida el traductor tras addLocale/updateLocale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [component, code, messages, version],
  );
}
