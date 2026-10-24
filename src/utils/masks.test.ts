import {
  MASK_PRESETS,
  applyCurrencyMask,
  applyMaskInput,
  applyPatternMask,
  countSlotChars,
  countWords,
  formatMasked,
  getCursorIndexFromSlotCount,
  isMaskComplete,
  isSlotToken,
  matchesSlot,
  resolveMask,
  unmaskCurrency,
  unmaskPattern,
  unmaskValue,
} from './masks';

describe('tokens', () => {
  it('reconoce slots y coincidencias', () => {
    expect(['0', 'a', 'A', '*'].every(isSlotToken)).toBe(true);
    expect(isSlotToken('-')).toBe(false);
    expect(matchesSlot('0', '5')).toBe(true);
    expect(matchesSlot('0', 'x')).toBe(false);
    expect(matchesSlot('a', 'X')).toBe(true);
    expect(matchesSlot('*', '_')).toBe(false);
    expect(matchesSlot('0', undefined)).toBe(false);
    expect(matchesSlot('-', '-')).toBe(false);
  });
});

describe('máscara de patrón', () => {
  it('teléfono: formatea, desenmascara y valida completitud (casos de vanilla)', () => {
    const config = resolveMask('(000) 000-0000');
    expect(isMaskComplete('', config)).toBe(false);
    const formatted = formatMasked('3001234567', config);
    expect(formatted).toBe('(300) 123-4567');
    expect(unmaskValue(formatted, config)).toBe('3001234567');
    expect(isMaskComplete(formatted, config)).toBe(true);
    expect(formatMasked('3109876543', config)).toBe('(310) 987-6543');
  });

  it('atajos credit-card y date', () => {
    const card = resolveMask('credit-card');
    expect(card).toEqual({ type: 'pattern', pattern: MASK_PRESETS['credit-card'] });
    const value = formatMasked('1234567890123456', card);
    expect(value).toBe('1234 5678 9012 3456');
    expect(unmaskValue(value, card)).toBe('1234567890123456');
    expect(isMaskComplete(value, card)).toBe(true);
    expect(formatMasked('25122026', resolveMask('DATE'))).toBe('25/12/2026');
  });

  it('añade literales tras el último slot, salta caracteres inválidos y transforma mayúsculas', () => {
    expect(applyPatternMask('300', '(000) 000-0000')).toBe('(300) ');
    expect(applyPatternMask('1', '(000)')).toBe('(1');
    expect(applyPatternMask('ab12cd', '00-00')).toBe('12-');
    expect(applyPatternMask('0930pm', '00:00 AA')).toBe('09:30 PM');
    expect(applyPatternMask('XY', 'aa')).toBe('xy');
    expect(applyPatternMask('a1b2', '****')).toBe('a1b2');
    expect(applyPatternMask('---', '000')).toBe('');
    expect(applyPatternMask('', '000')).toBe('');
    expect(applyPatternMask('123', '')).toBe('');
    expect(applyPatternMask('123456789', '000')).toBe('123');
  });

  it('unmaskPattern ignora literales', () => {
    expect(unmaskPattern('(300) 12', '(000) 000-0000')).toBe('30012');
    expect(unmaskPattern('', '000')).toBe('');
    expect(unmaskPattern('abc', '')).toBe('abc');
  });
});

describe('máscara monetaria', () => {
  it('formato con separadores y precisión (caso de vanilla)', () => {
    const config = resolveMask('currency', { prefix: '$ ', thousands: ',', decimal: '.' });
    const value = formatMasked('125000', config);
    expect(value).toBe('$ 1,250.00');
    expect(unmaskValue(value, config)).toBe('1250.00');
    expect(isMaskComplete(value, config)).toBe(true);
    expect(isMaskComplete('$ 0.00', config)).toBe(false);
  });

  it('precisión, separadores europeos, sufijo y ceros a la izquierda', () => {
    expect(applyCurrencyMask('5')).toBe('$ 0.05');
    expect(applyCurrencyMask('0005')).toBe('$ 0.05');
    expect(applyCurrencyMask('123456789', { prefix: '', suffix: ' €', thousands: '.', decimal: ',' })).toBe('1.234.567,89 €');
    expect(applyCurrencyMask('001234', { precision: 0 })).toBe('$ 1,234');
    expect(applyCurrencyMask('000', { precision: 0 })).toBe('$ 0');
    expect(applyCurrencyMask('abc')).toBe('');
    expect(applyCurrencyMask('')).toBe('');
    expect(applyCurrencyMask(1999)).toBe('$ 19.99');
  });

  it('unmaskCurrency', () => {
    expect(unmaskCurrency('$ 1,250.00')).toBe('1250.00');
    expect(unmaskCurrency('$ 0.05')).toBe('0.05');
    expect(unmaskCurrency('1.234', 0)).toBe('1234');
    expect(unmaskCurrency('')).toBe('');
    expect(unmaskCurrency('$')).toBe('');
  });

  it('money es alias de currency y respeta opciones parciales', () => {
    const config = resolveMask('money', { precision: 0, prefix: undefined });
    expect(config).toEqual({ type: 'currency', options: { prefix: '$ ', suffix: '', thousands: ',', decimal: '.', precision: 0 } });
    expect(resolveMask('currency', { precision: NaN })).toMatchObject({ options: { precision: 2 } });
  });
});

describe('resolveMask / sin máscara', () => {
  it('sin máscara devuelve null y las funciones son identidad', () => {
    expect(resolveMask('')).toBeNull();
    expect(resolveMask(null)).toBeNull();
    expect(formatMasked('abc', null)).toBe('abc');
    expect(unmaskValue('abc', null)).toBe('abc');
    expect(isMaskComplete('', null)).toBe(true);
    expect(applyMaskInput('abc', 2, null)).toEqual({ value: 'abc', cursor: 2 });
  });
});

describe('cursor', () => {
  it('cuenta slots y ubica el cursor', () => {
    expect(countSlotChars('(30')).toBe(2);
    expect(getCursorIndexFromSlotCount('(300) 123', 3)).toBe(4);
    expect(getCursorIndexFromSlotCount('(300) 123', 4)).toBe(7);
    expect(getCursorIndexFromSlotCount('(300)', 9)).toBe(5);
  });

  it('applyMaskInput conserva la posición lógica del cursor', () => {
    const phone = resolveMask('phone');
    expect(applyMaskInput('3001', 4, phone)).toEqual({ value: '(300) 1', cursor: 7 });
    // Edición en medio: "(300) 1|23" con un dígito insertado.
    expect(applyMaskInput('(3009) 123', 5, phone)).toEqual({ value: '(300) 912-3', cursor: 7 });
  });

  it('applyMaskInput monetario deja el cursor antes del sufijo', () => {
    const config = resolveMask('currency', { suffix: ' USD' });
    expect(applyMaskInput('1234', 4, config)).toEqual({ value: '$ 12.34 USD', cursor: 7 });
  });
});

describe('countWords', () => {
  it('cuenta palabras separadas por espacios', () => {
    expect(countWords('  hola   mundo\nnuevo ')).toBe(3);
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countWords(null)).toBe(0);
  });
});

describe('regresiones del cursor', () => {
  it('Supr en la posición 0 deja el cursor al inicio (no al final)', () => {
    const date = resolveMask('date');
    expect(applyMaskInput('2/34/5678', 0, date)).toEqual({ value: '23/45/678', cursor: 0 });
    expect(getCursorIndexFromSlotCount('(300) 123', 0)).toBe(1);
    expect(getCursorIndexFromSlotCount('', 0)).toBe(0);
  });

  it('retroceso sobre un literal final arrastra el slot anterior', () => {
    const phone = resolveMask('phone');
    expect(applyMaskInput('(123)', 5, phone, { previousValue: '(123) ', inputType: 'deleteContentBackward' }))
      .toEqual({ value: '(12', cursor: 3 });
    // Sin inputType se deduce por la longitud.
    expect(applyMaskInput('(123)', 5, phone, { previousValue: '(123) ' })).toEqual({ value: '(12', cursor: 3 });
    // Literal intermedio: borra el dígito que lo precede.
    expect(applyMaskInput('(123)456', 5, phone, { previousValue: '(123) 456', inputType: 'deleteContentBackward' }))
      .toEqual({ value: '(124) 56', cursor: 3 });
    // Supr (hacia delante) sobre un literal no arrastra nada.
    expect(applyMaskInput('(123)', 5, phone, { previousValue: '(123) ', inputType: 'deleteContentForward' }).value)
      .toBe('(123) ');
    // Borrado de un dígito: comportamiento normal.
    expect(applyMaskInput('(12) ', 3, phone, { previousValue: '(123) ', inputType: 'deleteContentBackward' }))
      .toEqual({ value: '(12', cursor: 3 });
  });
});
