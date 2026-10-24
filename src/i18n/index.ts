/**
 * Internacionalización de Materix UI para React: diccionarios `en`/`es`, registro global y hooks.
 */
export { default as en } from './locales/en';
export { default as es } from './locales/es';
export {
  DEFAULT_LOCALE,
  addLocale,
  updateLocale,
  getDictionary,
  getLocales,
  hasLocale,
  interpolate,
  resolveLocaleCode,
  translate,
  deepMerge,
  subscribeLocales,
  getLocalesVersion,
} from './registry';
export { I18nProvider, useI18n, useLocale, useIntlLocale, useT } from './I18nProvider';
export type { I18nContextValue, I18nProviderProps } from './I18nProvider';
export type {
  BaseDictionaryShape,
  DeepPartial,
  I18nComponent,
  I18nKey,
  InterpolationParams,
  LocaleDictionary,
  LocaleMessages,
  PartialDictionary,
  TranslateFn,
} from './types';
