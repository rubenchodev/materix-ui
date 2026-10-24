import {
  addMonths,
  angleToHour,
  angleToMinute,
  clockHandAngle,
  clockPosition,
  dayKey,
  findEnabledDate,
  formatDate,
  formatDayLabel,
  formatToMask,
  getClockKeyValue,
  getDateOrder,
  getDatePattern,
  getDayRangeState,
  getDefaultFormat,
  getGridFocusDate,
  getGridKeyTarget,
  getMonthGrid,
  getMonthNames,
  getWeekdayNames,
  getYearRange,
  isAmPmFormat,
  isDateDisabled,
  isMonthDisabled,
  isSameDay,
  localeDateOrder,
  matchesLang,
  orderRange,
  parseDate,
  pointToClockAngle,
  resolvePickerMode,
  setMeridiem,
  to12Hour,
  to24Hour,
  toBaseLang,
  toIntlLocale,
} from './dates';

const d = (y: number, m: number, day: number, h = 0, mi = 0, s = 0) => new Date(y, m, day, h, mi, s);

describe('locale', () => {
  it('matchesLang, toBaseLang y toIntlLocale', () => {
    expect(matchesLang('es-MX', 'es')).toBe(true);
    expect(matchesLang('es_MX', 'es')).toBe(true);
    expect(matchesLang('en', 'es')).toBe(false);
    expect(matchesLang('esx', 'es')).toBe(false);
    expect(toBaseLang('PT_br')).toBe('pt');
    expect(toBaseLang(null)).toBe('en');
    expect(toIntlLocale('es_MX')).toBe('es-MX');
    expect(toIntlLocale('###')).toBe('en');
  });

  it('localeDateOrder por región', () => {
    expect(localeDateOrder('en-US')).toEqual(['MM', 'DD', 'YYYY']);
    expect(localeDateOrder('es')).toEqual(['DD', 'MM', 'YYYY']);
    expect(localeDateOrder('en-GB')).toEqual(['DD', 'MM', 'YYYY']);
    expect(localeDateOrder('ja-JP')).toEqual(['YYYY', 'MM', 'DD']);
  });

  it('orden desde el formato o el locale, patrón y formato por defecto', () => {
    expect(getDateOrder('YYYY-MM-DD HH:mm', 'es')).toEqual(['YYYY', 'MM', 'DD']);
    expect(getDateOrder('DD/MM/YY', 'en-US')).toEqual(['DD', 'MM', 'YYYY']);
    expect(getDateOrder('HH:mm', 'en-US')).toEqual(['MM', 'DD', 'YYYY']);
    expect(getDatePattern(null, 'es')).toBe('DD/MM/YYYY');
    expect(getDefaultFormat('date', false, 'es')).toBe('DD/MM/YYYY');
    expect(getDefaultFormat('datetime', false, 'en-US')).toBe('MM/DD/YYYY HH:mm');
    expect(getDefaultFormat('time', true, 'es')).toBe('hh:mm A');
  });

  it('isAmPmFormat y resolvePickerMode', () => {
    expect(isAmPmFormat('hh:mm A')).toBe(true);
    expect(isAmPmFormat('HH:mm a')).toBe(true);
    expect(isAmPmFormat('HH:mm')).toBe(false);
    expect(isAmPmFormat('')).toBe(false);
    expect(resolvePickerMode('datetimepicker')).toBe('datetime');
    expect(resolvePickerMode('date-time-picker')).toBe('datetime');
    expect(resolvePickerMode('timepicker')).toBe('time');
    expect(resolvePickerMode('datepicker')).toBe('date');
    expect(resolvePickerMode('datepicker', 'time-range')).toBe('time');
    expect(resolvePickerMode('x', 'date-time')).toBe('datetime');
  });
});

describe('comparación y aritmética', () => {
  it('isSameDay, dayKey y addMonths', () => {
    expect(isSameDay(d(2026, 9, 20, 8), d(2026, 9, 20, 23))).toBe(true);
    expect(isSameDay(d(2026, 9, 20), d(2026, 9, 21))).toBe(false);
    expect(isSameDay(null, d(2026, 9, 20))).toBe(false);
    expect(dayKey(d(2026, 0, 5))).toBe('2026-01-05');
    expect(addMonths(d(2026, 0, 31), 1)).toEqual(d(2026, 1, 28));
    expect(addMonths(d(2024, 0, 31), 1)).toEqual(d(2024, 1, 29));
    expect(addMonths(d(2026, 2, 15), -12)).toEqual(d(2025, 2, 15));
  });
});

describe('min/max', () => {
  const bounds = { min: d(2026, 9, 10, 15), max: d(2026, 9, 20, 1) };
  it('isDateDisabled compara por día', () => {
    expect(isDateDisabled(d(2026, 9, 10), bounds)).toBe(false);
    expect(isDateDisabled(d(2026, 9, 9, 23), bounds)).toBe(true);
    expect(isDateDisabled(d(2026, 9, 20, 23), bounds)).toBe(false);
    expect(isDateDisabled(d(2026, 9, 21), bounds)).toBe(true);
    expect(isDateDisabled(d(1800, 0, 1))).toBe(false);
  });

  it('isMonthDisabled y getYearRange', () => {
    expect(isMonthDisabled(2026, 8, bounds)).toBe(true);
    expect(isMonthDisabled(2026, 9, bounds)).toBe(false);
    expect(isMonthDisabled(2026, 10, bounds)).toBe(true);
    expect(getYearRange(bounds)).toEqual([2026]);
    const all = getYearRange();
    expect(all[0]).toBe(1900);
    expect(all[all.length - 1]).toBe(2100);
  });

  it('findEnabledDate salta días deshabilitados', () => {
    expect(findEnabledDate(d(2026, 9, 5), 1, bounds)).toEqual(d(2026, 9, 10));
    expect(findEnabledDate(d(2026, 9, 25), -1, bounds)).toEqual(d(2026, 9, 20));
    expect(findEnabledDate(d(2026, 9, 25), 1, bounds)).toBeNull();
  });
});

describe('parseDate', () => {
  it('Date, timestamp, vacíos e inválidos', () => {
    const src = d(2026, 9, 25, 14, 30);
    const copy = parseDate(src)!;
    expect(copy).toEqual(src);
    expect(copy).not.toBe(src);
    expect(parseDate(src.getTime())).toEqual(src);
    expect(parseDate(new Date('x'))).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate('   ')).toBeNull();
    expect(parseDate(null)).toBeNull();
    expect(parseDate('no es fecha')).toBeNull();
  });

  it('ISO con y sin hora; rechaza desbordes', () => {
    expect(parseDate('2027-05-18')).toEqual(d(2027, 4, 18));
    expect(parseDate('2026-09-07T12:05:09')).toEqual(d(2026, 8, 7, 12, 5, 9));
    expect(parseDate('2026-09-07 08:30 PM')).toEqual(d(2026, 8, 7, 20, 30));
    expect(parseDate('2026-02-31')).toBeNull();
  });

  it('orden según formato o locale (casos de vanilla)', () => {
    expect(parseDate('01/01/2028', { locale: 'es' })).toEqual(d(2028, 0, 1));
    expect(parseDate('25/10/2026', { locale: 'es' })).toEqual(d(2026, 9, 25));
    expect(parseDate('10/25/2026', { locale: 'en-US' })).toEqual(d(2026, 9, 25));
    expect(parseDate('03/04/2026', { locale: 'en-US' })).toEqual(d(2026, 2, 4));
    expect(parseDate('03/04/2026', { format: 'DD/MM/YYYY', locale: 'en-US' })).toEqual(d(2026, 3, 3));
    // Tolerancia: mes imposible → se intercambia con el día.
    expect(parseDate('25/10/2026', { locale: 'en-US' })).toEqual(d(2026, 9, 25));
    expect(parseDate('25.10.26 14:30', { locale: 'es' })).toEqual(d(2026, 9, 25, 14, 30));
    expect(parseDate('2026/10/25', { locale: 'es' })).toEqual(d(2026, 9, 25));
  });

  it('horas sueltas y palabras clave con fecha base', () => {
    const now = d(2026, 9, 20, 9, 0);
    expect(parseDate('14:30', { now })).toEqual(d(2026, 9, 20, 14, 30));
    expect(parseDate('02:15 pm', { now })).toEqual(d(2026, 9, 20, 14, 15));
    expect(parseDate('12:00 AM', { now })).toEqual(d(2026, 9, 20, 0, 0));
    expect(parseDate('12:00 p.m.', { now })).toEqual(d(2026, 9, 20, 12, 0));
    expect(parseDate('25:00', { now })).toBeNull();
    expect(parseDate('hoy', { now })).toEqual(now);
    expect(parseDate('TODAY')).toBeInstanceOf(Date);
  });
});

describe('formatDate / formatToMask', () => {
  const date = d(2026, 8, 7, 14, 5, 9);
  it('tokens de fecha y hora (casos de vanilla)', () => {
    expect(formatDate(d(2026, 9, 25), 'DD/MM/YYYY')).toBe('25/10/2026');
    expect(formatDate(d(2026, 9, 25), 'YYYY-MM-DD')).toBe('2026-10-25');
    expect(formatDate(d(2026, 8, 7, 12, 0), 'YYYY-MM-DD HH:mm')).toBe('2026-09-07 12:00');
    expect(formatDate(date, 'DD/MM/YY HH:mm:ss')).toBe('07/09/26 14:05:09');
    expect(formatDate(date, 'hh:mm A')).toBe('02:05 PM');
    expect(formatDate(date, 'hh:mm a')).toBe('02:05 pm');
    expect(formatDate(d(2026, 0, 1, 0, 0), 'hh:mm AA')).toBe('12:00 AM');
    expect(formatDate(date, 'DD/MM/AAAA')).toBe('07/09/2026');
    expect(formatDate(null, 'DD')).toBe('');
    expect(formatDate(new Date('x'), 'DD')).toBe('');
  });

  it('formatToMask (caso de vanilla)', () => {
    expect(formatToMask('YYYY-MM-DD HH:mm')).toBe('0000-00-00 00:00');
    expect(formatToMask('DD/MM/YY')).toBe('00/00/00');
    expect(formatToMask('hh:mm A')).toBe('00:00 AA');
    expect(formatToMask('hh:mm:ss aa')).toBe('00:00:00 AA');
    expect(formatToMask('')).toBe('');
  });
});

describe('nombres localizados', () => {
  it('usa el diccionario registrado si el locale pertenece al idioma', () => {
    expect(getMonthNames('es')[0]).toBe('Enero');
    expect(getMonthNames('es-MX', 'short')[11]).toBe('Dic');
    expect(getWeekdayNames('es')).toEqual(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
    expect(getWeekdayNames('en', 'short')[0]).toBe('Sun');
  });

  it('usa Intl para idiomas no registrados y para nombres largos', () => {
    expect(getMonthNames('fr-FR')[0]).toBe('Janvier');
    expect(getWeekdayNames('de', 'short')).toHaveLength(7);
    expect(getWeekdayNames('en', 'long')[0]).toBe('Sunday');
    expect(getWeekdayNames('es', 'long')[1]).toBe('Lunes');
  });

  it('formatDayLabel', () => {
    expect(formatDayLabel(d(2026, 9, 20), 'en-US')).toBe('Tuesday, October 20, 2026');
    expect(formatDayLabel(d(2026, 9, 20), 'es')).toMatch(/martes, 20 de octubre de 2026/);
  });
});

describe('cuadrícula del mes', () => {
  it('semanas completas con días exteriores (octubre 2026 empieza en jueves)', () => {
    const weeks = getMonthGrid(2026, 9);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0][0]).toMatchObject({ key: '2026-09-27', outside: true });
    expect(weeks[0][4]).toMatchObject({ key: '2026-10-01', outside: false });
    expect(weeks[4][6]).toMatchObject({ key: '2026-10-31', outside: false });
    expect(getMonthGrid(2026, 1)).toHaveLength(4); // feb 2026: 1 = domingo, 28 días.
    expect(getMonthGrid(2026, 7)).toHaveLength(6); // ago 2026: empieza en sábado.
  });

  it('getGridFocusDate: enfocado > seleccionado > hoy > primer habilitado', () => {
    const today = d(2026, 9, 15);
    expect(getGridFocusDate(2026, 9, { focused: d(2026, 9, 3), selected: d(2026, 9, 9), today })).toEqual(d(2026, 9, 3));
    expect(getGridFocusDate(2026, 9, { focused: d(2026, 8, 3), selected: d(2026, 9, 9), today })).toEqual(d(2026, 9, 9));
    expect(getGridFocusDate(2026, 9, { today })).toEqual(today);
    expect(getGridFocusDate(2026, 9, { today, min: d(2026, 9, 20) })).toEqual(d(2026, 9, 20));
    expect(getGridFocusDate(2026, 9, { today, max: d(2026, 0, 1) })).toEqual(d(2026, 9, 1));
  });

  it('getGridKeyTarget', () => {
    const cur = d(2026, 9, 21); // miércoles
    expect(getGridKeyTarget(cur, 'ArrowLeft')).toEqual({ date: d(2026, 9, 20), step: -1 });
    expect(getGridKeyTarget(cur, 'ArrowRight')).toEqual({ date: d(2026, 9, 22), step: 1 });
    expect(getGridKeyTarget(cur, 'ArrowUp')).toEqual({ date: d(2026, 9, 14), step: -1 });
    expect(getGridKeyTarget(cur, 'ArrowDown')).toEqual({ date: d(2026, 9, 28), step: 1 });
    expect(getGridKeyTarget(cur, 'Home')).toEqual({ date: d(2026, 9, 18), step: 1 });
    expect(getGridKeyTarget(cur, 'End')).toEqual({ date: d(2026, 9, 24), step: -1 });
    expect(getGridKeyTarget(d(2026, 2, 31), 'PageUp')).toEqual({ date: d(2026, 1, 28), step: -1 });
    expect(getGridKeyTarget(cur, 'PageDown', true)).toEqual({ date: d(2027, 9, 21), step: 1 });
    expect(getGridKeyTarget(cur, 'Enter')).toBeNull();
  });
});

describe('rangos', () => {
  it('getDayRangeState y orderRange', () => {
    const start = d(2026, 9, 10, 9);
    const end = d(2026, 9, 12);
    expect(getDayRangeState(d(2026, 9, 10), { start, end })).toEqual({ isStart: true, isEnd: false, inRange: false, inPreview: false });
    expect(getDayRangeState(d(2026, 9, 11), { start, end }).inRange).toBe(true);
    expect(getDayRangeState(d(2026, 9, 12), { start, end }).isEnd).toBe(true);
    expect(getDayRangeState(d(2026, 9, 8), { start, hover: d(2026, 9, 5) }).inPreview).toBe(true);
    expect(getDayRangeState(d(2026, 9, 8), { start, end, hover: d(2026, 9, 5) }).inPreview).toBe(false);
    expect(orderRange(start, d(2026, 9, 1))).toEqual([d(2026, 9, 1), start]);
    expect(orderRange(start, end)).toEqual([start, end]);
  });
});

describe('horas y reloj', () => {
  it('conversión 12/24 h y meridiano', () => {
    expect(to12Hour(0)).toEqual({ hour: 12, meridiem: 'AM' });
    expect(to12Hour(13)).toEqual({ hour: 1, meridiem: 'PM' });
    expect(to12Hour(12)).toEqual({ hour: 12, meridiem: 'PM' });
    expect(to24Hour(12, 'AM')).toBe(0);
    expect(to24Hour(12, 'PM')).toBe(12);
    expect(to24Hour(3, 'PM')).toBe(15);
    expect(setMeridiem(9, 'PM')).toBe(21);
    expect(setMeridiem(21, 'AM')).toBe(9);
    expect(setMeridiem(21, 'PM')).toBe(21);
  });

  it('geometría del reloj', () => {
    expect(pointToClockAngle(0, -10)).toBe(0);
    expect(pointToClockAngle(10, 0)).toBe(90);
    expect(pointToClockAngle(0, 10)).toBe(180);
    expect(pointToClockAngle(-10, 0)).toBe(270);
    expect(angleToHour(0)).toBe(12);
    expect(angleToHour(90)).toBe(3);
    expect(angleToHour(350)).toBe(12);
    expect(angleToMinute(90)).toBe(15);
    expect(angleToMinute(359)).toBe(0);
    expect(clockHandAngle('hours', 15)).toBe(90);
    expect(clockHandAngle('minutes', 20)).toBe(120);
    const top = clockPosition(0);
    expect(top.x).toBeCloseTo(128);
    expect(top.y).toBeCloseTo(24);
    const right = clockPosition(90);
    expect(right.x).toBeCloseTo(232);
  });

  it('getClockKeyValue', () => {
    expect(getClockKeyValue('hours', 23, 'ArrowUp')).toBe(0);
    expect(getClockKeyValue('hours', 0, 'ArrowDown')).toBe(23);
    expect(getClockKeyValue('hours', 12, 'ArrowUp', true)).toBe(1);
    expect(getClockKeyValue('hours', 13, 'ArrowDown', true)).toBe(12);
    expect(getClockKeyValue('hours', 5, 'PageUp')).toBe(6);
    expect(getClockKeyValue('hours', 5, 'Home', true)).toBe(1);
    expect(getClockKeyValue('hours', 5, 'End')).toBe(23);
    expect(getClockKeyValue('minutes', 58, 'PageUp')).toBe(3);
    expect(getClockKeyValue('minutes', 0, 'ArrowLeft')).toBe(59);
    expect(getClockKeyValue('minutes', 30, 'End')).toBe(59);
    expect(getClockKeyValue('minutes', 30, 'x')).toBeNull();
  });
});
