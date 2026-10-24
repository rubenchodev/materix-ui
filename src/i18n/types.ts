import type en from './locales/en';

/** Forma mínima de cualquier diccionario: código, nombre y secciones por componente. */
export interface BaseDictionaryShape {
  code: string;
  name: string;
  [component: string]: unknown;
}

/** Diccionario completo de un idioma (misma forma que el inglés). */
export type LocaleDictionary = typeof en;

/** Componentes con textos traducibles (`dialog`, `select`, `dateTimePicker`…). */
export type I18nComponent = Exclude<keyof LocaleDictionary, 'code' | 'name'>;

/** Claves disponibles para un componente. */
export type I18nKey<C extends I18nComponent> = Extract<keyof LocaleDictionary[C], string>;

/** Parcial profundo de un diccionario (para `updateLocale` y overrides del provider). */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/** Diccionario parcial: claves conocidas parciales más secciones propias. */
export type PartialDictionary = DeepPartial<LocaleDictionary> & Record<string, unknown>;

/** Overrides de textos por código de idioma: `{ es: { dialog: { ok: 'Vale' } } }`. */
export type LocaleMessages = Record<string, PartialDictionary>;

/** Parámetros de interpolación: posicionales (`{0}`) o con nombre (`{name}`). */
export type InterpolationParams = ReadonlyArray<unknown> | Record<string, unknown>;

/**
 * Traductor ligado a un componente.
 * @returns {*} Texto (o lista, p. ej. `months`) traducido.
 */
export type TranslateFn = <R = string>(
  key: string,
  params?: InterpolationParams | null,
  fallback?: R | null,
) => R;
