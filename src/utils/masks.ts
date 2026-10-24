/**
 * Motor de máscaras de TextField (pattern y currency), cursor y conteo de palabras.
 * Portado 1:1 de `text-field.js` de vanilla.
 *
 * Tokens de patrón: `0` dígito, `a` letra (minúscula), `A` letra (mayúscula), `*` alfanumérico;
 * cualquier otro carácter es un literal.
 */

/** Atajos de máscara (`data-mask="phone"`). */
export const MASK_PRESETS: Readonly<Record<string, string>> = {
  'credit-card': '0000 0000 0000 0000',
  date: '00/00/0000',
  'date-short': '00/00',
  time: '00:00',
  'time-ampm': '00:00 AA',
  'time-seconds': '00:00:00',
  phone: '(000) 000-0000',
  'phone-intl': '+00 (000) 000-0000',
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  zip: '00000-000',
  'postal-code': '00000-0000',
};

/** Opciones de la máscara monetaria. */
export interface CurrencyMaskOptions {
  prefix: string;
  suffix: string;
  thousands: string;
  decimal: string;
  precision: number;
}

/** Valores por defecto de la máscara monetaria (iguales a vanilla). */
export const DEFAULT_CURRENCY_OPTIONS: Readonly<CurrencyMaskOptions> = {
  prefix: '$ ',
  suffix: '',
  thousands: ',',
  decimal: '.',
  precision: 2,
};

/** Configuración resuelta de una máscara. */
export type MaskConfig =
  | { type: 'pattern'; pattern: string }
  | { type: 'currency'; options: CurrencyMaskOptions };

/**
 * Indica si un carácter es un token de slot.
 * @param {string} char Carácter.
 * @returns {boolean} `true` si es `0`, `a`, `A` o `*`.
 */
export function isSlotToken(char: string | undefined): boolean {
  return char === '0' || char === 'a' || char === 'A' || char === '*';
}

/**
 * Indica si un carácter encaja en un token.
 * @param {string} token Token.
 * @param {string} char Carácter.
 * @returns {boolean} `true` si coincide.
 */
export function matchesSlot(token: string, char: string | undefined): boolean {
  if (!char) return false;
  if (token === '0') return /\d/.test(char);
  if (token === 'a' || token === 'A') return /[a-zA-Z]/.test(char);
  if (token === '*') return /[0-9a-zA-Z]/.test(char);
  return false;
}

/**
 * Aplica una máscara de patrón.
 * @param {string} rawText Texto sin formato o parcialmente formateado.
 * @param {string} pattern Patrón (`(000) 000-0000`).
 * @returns {string} Texto formateado (añade los literales siguientes al último slot lleno).
 */
export function applyPatternMask(rawText: string, pattern: string): string {
  if (!pattern || !rawText) return '';
  let rawChars = '';
  for (let i = 0; i < rawText.length; i++) {
    if (/[0-9a-zA-Z]/.test(rawText[i])) rawChars += rawText[i];
  }
  if (!rawChars) return '';

  let rawIdx = 0;
  let formatted = '';
  let hasSlotFilled = false;
  for (let pIdx = 0; pIdx < pattern.length && rawIdx < rawChars.length; pIdx++) {
    const pChar = pattern[pIdx];
    if (isSlotToken(pChar)) {
      while (rawIdx < rawChars.length && !matchesSlot(pChar, rawChars[rawIdx])) rawIdx++;
      if (rawIdx < rawChars.length) {
        let ch = rawChars[rawIdx++];
        if (pChar === 'A') ch = ch.toUpperCase();
        else if (pChar === 'a') ch = ch.toLowerCase();
        formatted += ch;
        hasSlotFilled = true;
      }
    } else {
      formatted += pChar;
    }
  }

  if (hasSlotFilled) {
    let nextPIdx = formatted.length;
    while (nextPIdx < pattern.length && !isSlotToken(pattern[nextPIdx])) formatted += pattern[nextPIdx++];
  }
  return formatted;
}

/**
 * Extrae los caracteres de slot de un valor formateado.
 * @param {string} formattedValue Valor formateado.
 * @param {string} pattern Patrón.
 * @returns {string} Valor sin literales.
 */
export function unmaskPattern(formattedValue: string, pattern: string): string {
  if (!formattedValue || !pattern) return formattedValue || '';
  let unmasked = '';
  let pIdx = 0;
  for (let i = 0; i < formattedValue.length && pIdx < pattern.length; i++) {
    const ch = formattedValue[i];
    const pChar = pattern[pIdx];
    if (isSlotToken(pChar)) {
      if (matchesSlot(pChar, ch)) {
        unmasked += ch;
        pIdx++;
      }
    } else if (ch === pChar) {
      pIdx++;
    }
  }
  return unmasked;
}

/**
 * Formato monetario: los dígitos llenan desde los decimales (`125000` → `$ 1,250.00`).
 * @param {string|number} value Entrada.
 * @param {Partial<CurrencyMaskOptions>} [options] Prefijo, sufijo, separadores y precisión.
 * @returns {string} Valor formateado (vacío si no hay dígitos).
 */
export function applyCurrencyMask(value: string | number | null | undefined, options: Partial<CurrencyMaskOptions> = {}): string {
  if (value === null || value === undefined || value === '') return '';
  const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  const digitsOnly = String(value).replace(/\D/g, '');
  if (!digitsOnly) return '';
  const { precision } = opts;
  let intPart: string;
  let decPart = '';
  if (precision > 0) {
    const padded = digitsOnly.padStart(precision + 1, '0');
    intPart = padded.slice(0, padded.length - precision).replace(/^0+(?=\d)/, '');
    decPart = padded.slice(padded.length - precision);
  } else {
    intPart = digitsOnly.replace(/^0+(?=\d)/, '') || '0';
  }
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousands);
  const numString = precision > 0 ? `${formattedInt}${opts.decimal}${decPart}` : formattedInt;
  return `${opts.prefix}${numString}${opts.suffix}`;
}

/**
 * Valor numérico limpio de una cadena monetaria (`$ 1,250.00` → `1250.00`).
 * @param {string} value Cadena formateada.
 * @param {number} [precision=2] Decimales.
 * @returns {string} Número como texto.
 */
export function unmaskCurrency(value: string | null | undefined, precision = 2): string {
  if (!value) return '';
  const digitsOnly = String(value).replace(/\D/g, '');
  if (!digitsOnly) return '';
  if (precision > 0) {
    const padded = digitsOnly.padStart(precision + 1, '0');
    const intPart = padded.slice(0, padded.length - precision).replace(/^0+(?=\d)/, '');
    const decPart = padded.slice(padded.length - precision);
    return `${intPart}.${decPart}`;
  }
  return digitsOnly;
}

/**
 * Cuenta los caracteres alfanuméricos (slots) de un texto.
 * @param {string} str Texto.
 * @returns {number} Conteo.
 */
export function countSlotChars(str: string): number {
  return (str.match(/[0-9a-zA-Z]/g) || []).length;
}

/**
 * Posición del cursor tras `targetSlotCount` slots en la cadena formateada.
 * @param {string} formatted Cadena formateada.
 * @param {number} targetSlotCount Slots antes del cursor.
 * @returns {number} Índice del cursor.
 */
export function getCursorIndexFromSlotCount(formatted: string, targetSlotCount: number): number {
  // Sin slots antes del cursor: se queda delante del primer slot (vanilla saltaba al final).
  if (targetSlotCount <= 0) {
    const first = formatted.search(/[0-9a-zA-Z]/);
    return first === -1 ? formatted.length : first;
  }
  let slotsFound = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[0-9a-zA-Z]/.test(formatted[i])) slotsFound++;
    if (slotsFound === targetSlotCount) return i + 1;
  }
  return formatted.length;
}

/**
 * Cuenta palabras separadas por espacios.
 * @param {string} text Texto.
 * @returns {number} Número de palabras.
 */
export function countWords(text: string | null | undefined): number {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Resuelve una máscara declarativa: `currency`/`money`, un atajo de {@link MASK_PRESETS} o un patrón.
 * @param {string|null|undefined} mask Valor de la máscara.
 * @param {Partial<CurrencyMaskOptions>} [currency] Opciones monetarias.
 * @returns {MaskConfig|null} Configuración o `null` si no hay máscara.
 */
export function resolveMask(mask: string | null | undefined, currency: Partial<CurrencyMaskOptions> = {}): MaskConfig | null {
  if (!mask || !mask.trim()) return null;
  const value = mask.trim();
  if (value === 'currency' || value === 'money') {
    const options = { ...DEFAULT_CURRENCY_OPTIONS };
    (Object.keys(currency) as (keyof CurrencyMaskOptions)[]).forEach((key) => {
      if (currency[key] !== undefined && currency[key] !== null) (options as Record<string, unknown>)[key] = currency[key];
    });
    if (!Number.isFinite(options.precision)) options.precision = DEFAULT_CURRENCY_OPTIONS.precision;
    return { type: 'currency', options };
  }
  return { type: 'pattern', pattern: MASK_PRESETS[value.toLowerCase()] || value };
}

/**
 * Formatea un valor según la máscara.
 * @param {string} value Valor.
 * @param {MaskConfig|null} config Máscara.
 * @returns {string} Valor formateado (sin máscara, el original).
 */
export function formatMasked(value: string, config: MaskConfig | null): string {
  if (!config) return value;
  return config.type === 'currency' ? applyCurrencyMask(value, config.options) : applyPatternMask(value, config.pattern);
}

/**
 * Valor sin formato de la máscara (`unmaskedValue` de vanilla).
 * @param {string} value Valor formateado.
 * @param {MaskConfig|null} config Máscara.
 * @returns {string} Valor limpio.
 */
export function unmaskValue(value: string, config: MaskConfig | null): string {
  if (!config) return value;
  return config.type === 'currency' ? unmaskCurrency(value, config.options.precision) : unmaskPattern(value, config.pattern);
}

/**
 * Indica si la máscara está completa (`isMaskComplete` de vanilla).
 * @param {string} value Valor formateado.
 * @param {MaskConfig|null} config Máscara.
 * @returns {boolean} `true` si todos los slots están llenos (currency: valor > 0).
 */
export function isMaskComplete(value: string, config: MaskConfig | null): boolean {
  if (!config) return true;
  const unmasked = unmaskValue(value, config);
  if (config.type === 'currency') return Boolean(unmasked && parseFloat(unmasked) > 0);
  if (!config.pattern) return true;
  const requiredSlots = (config.pattern.match(/[0aA*]/g) || []).length;
  return unmasked.length >= requiredSlots;
}

/** Resultado de {@link applyMaskInput}. */
export interface MaskInputResult {
  value: string;
  cursor: number;
}

/** Opciones de {@link applyMaskInput}. */
export interface MaskInputOptions {
  /** Valor formateado anterior a la edición (detecta el borrado de un literal). */
  previousValue?: string;
  /** `InputEvent.inputType` (`deleteContentBackward`…). */
  inputType?: string;
}

/**
 * Reformatea la entrada del usuario conservando el cursor (`_handleMaskInput` de vanilla).
 * Si un retroceso solo borra un literal (`"(123) "` → `"(123)"`), arrastra el slot anterior
 * para no tener que pulsarlo dos veces.
 * @param {string} value Valor actual del input.
 * @param {number} cursor `selectionStart` actual.
 * @param {MaskConfig|null} config Máscara.
 * @param {MaskInputOptions} [options] Valor previo y tipo de entrada.
 * @returns {MaskInputResult} Valor formateado y nueva posición del cursor.
 */
export function applyMaskInput(value: string, cursor: number, config: MaskConfig | null, options: MaskInputOptions = {}): MaskInputResult {
  if (!config) return { value, cursor };
  if (config.type === 'currency') {
    const formatted = applyCurrencyMask(value, config.options);
    const suffixLen = (config.options.suffix || '').length;
    const end = Math.max(0, formatted.length - suffixLen);
    return { value: formatted, cursor: end };
  }
  let text = value;
  let pos = cursor || 0;
  const { previousValue, inputType } = options;
  const backward = inputType ? inputType === 'deleteContentBackward'
    : previousValue !== undefined && value.length < previousValue.length;
  if (backward && previousValue !== undefined && value.length < previousValue.length
    && countSlotChars(value) === countSlotChars(previousValue)) {
    // Solo se borró un literal: se elimina también el slot que lo precede.
    const before = text.slice(0, pos);
    const index = before.search(/[0-9a-zA-Z][^0-9a-zA-Z]*$/);
    if (index !== -1) {
      text = text.slice(0, index) + text.slice(index + 1);
      pos = index;
    }
  }
  const slotsBefore = countSlotChars(text.slice(0, pos));
  const formatted = applyPatternMask(text, config.pattern);
  return { value: formatted, cursor: getCursorIndexFromSlotCount(formatted, slotsBefore) };
}
