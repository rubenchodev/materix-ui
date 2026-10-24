import {
  closestThumb,
  formatValue,
  getBigStep,
  getDecimals,
  getKeyboardValue,
  getMarks,
  normalize,
  parseMarks,
  percent,
  roundStep,
  setThumbValue,
  snap,
  stepFrom,
  valueFromRatio,
} from './slider';

const scale = { min: 0, max: 100, step: 1 };

describe('getDecimals / roundStep', () => {
  it('cuenta decimales incluso en notación exponencial', () => {
    expect(getDecimals(1)).toBe(0);
    expect(getDecimals(0.1)).toBe(1);
    expect(getDecimals(0.25)).toBe(2);
    expect(getDecimals(1.5)).toBe(1);
    expect(getDecimals(1e-7)).toBe(7);
    expect(getDecimals(0)).toBe(0);
  });

  it('redondea al step desde min sin errores de coma flotante', () => {
    expect(roundStep(23, 10, 5)).toBe(25);
    expect(roundStep(0.30000000000000004, 0, 0.1)).toBe(0.3);
    expect(roundStep(7, 1, 3)).toBe(7);
  });
});

describe('snap / normalize (casos de vanilla)', () => {
  it('redondea al step y acota a min/max', () => {
    const opts = { min: 10, max: 50, step: 5 };
    expect(snap(23, opts)).toBe(25);
    expect(snap(999, opts)).toBe(50);
    expect(snap(-3, opts)).toBe(10);
    expect(snap('abc', opts)).toBe(10);
    expect(snap(48, { min: 0, max: 49, step: 5 })).toBe(49);
  });

  it('marksOnly restringe a la marca más cercana', () => {
    const marks = parseMarks('0:A,20:B,37:C,100:D', scale);
    expect(snap(30, { ...scale, marks, marksOnly: true })).toBe(37);
    expect(snap(5, { ...scale, marks, marksOnly: true })).toBe(0);
  });

  it('normalize ordena en rango', () => {
    expect(normalize([60, '20'], { ...scale, range: true })).toEqual([20, 60]);
    expect(normalize([60, 20], scale)).toEqual([60, 20]);
  });
});

describe('closestThumb / percent / valueFromRatio', () => {
  it('elige el thumb más cercano y desempata hacia el puntero', () => {
    expect(closestThumb(30, [20, 60])).toBe(0);
    expect(closestThumb(50, [20, 60])).toBe(1);
    expect(closestThumb(40, [20, 60])).toBe(0);
    expect(closestThumb(10, [50, 50])).toBe(0);
    expect(closestThumb(70, [50, 50])).toBe(1);
    expect(closestThumb(90, [20])).toBe(0);
    expect(closestThumb(90, [20, 60], false)).toBe(0);
  });

  it('percent y valueFromRatio', () => {
    expect(percent(37, 0, 100)).toBe(37);
    expect(percent(15, 10, 20)).toBe(50);
    expect(percent(5, 5, 5)).toBe(0);
    expect(valueFromRatio(0.3, 0, 100)).toBe(30);
    expect(valueFromRatio(0.3, 0, 100, true)).toBe(70);
    expect(valueFromRatio(1.5, 0, 100)).toBe(100);
  });
});

describe('parseMarks', () => {
  it('true crea una marca por step (caso de vanilla)', () => {
    const marks = parseMarks('true', { min: 0, max: 50, step: 10 });
    expect(marks.map((m) => m.value)).toEqual([0, 10, 20, 30, 40, 50]);
    expect(parseMarks(true, { min: 0, max: 1, step: 0.25 }).map((m) => m.value)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(parseMarks('', { min: 0, max: 2, step: 1 })).toHaveLength(3);
    expect(parseMarks(true, { min: 0, max: 1000, step: 1 })).toEqual([]);
  });

  it('lista con etiquetas, JSON y array', () => {
    expect(parseMarks('0:0°C,20:20°C,37:37°C,100:100°C', scale)[2]).toEqual({ value: 37, label: '37°C' });
    expect(parseMarks('10,x:bad,20:a:b', scale)).toEqual([{ value: 10, label: null }, { value: 20, label: 'a:b' }]);
    expect(parseMarks('[{"value":5,"label":"Cinco"},{"value":"x"}]', scale)).toEqual([{ value: 5, label: 'Cinco' }]);
    expect(parseMarks('[bad json', scale)).toEqual([]);
    expect(parseMarks([{ value: 1 }, { value: '2', label: 2 }], scale)).toEqual([{ value: 1, label: null }, { value: 2, label: '2' }]);
  });

  it('false/null no crean marcas y getMarks filtra por escala', () => {
    expect(parseMarks(null, scale)).toEqual([]);
    expect(parseMarks('false', scale)).toEqual([]);
    expect(parseMarks(false, scale)).toEqual([]);
    expect(getMarks('-5,50,150', scale)).toEqual([{ value: 50, label: null }]);
  });
});

describe('formatValue', () => {
  it('aplica plantilla {value} (caso de vanilla) y decimales del step', () => {
    expect(formatValue(20, { format: '{value} °C' })).toBe('20 °C');
    expect(formatValue(1234.5, { locale: 'en', step: 0.5 })).toBe('1,234.5');
    expect(formatValue(1234.5, { locale: 'es', step: 1 })).toMatch(/^1\.?235$/);
    expect(formatValue(3, { format: (text) => `${text}%` })).toBe('3%');
    expect(formatValue(7, { locale: 'not a locale!!' })).toBe('7');
  });
});

describe('teclado y thumbs', () => {
  it('stepFrom por incremento o por marcas', () => {
    const marks = parseMarks('0,20,37,100', scale);
    expect(stepFrom(10, 1, 5)).toBe(15);
    expect(stepFrom(37, 1, 1, marks, true)).toBe(100);
    expect(stepFrom(37, -1, 1, marks, true)).toBe(20);
    expect(stepFrom(100, 1, 1, marks, true)).toBe(100);
  });

  it('getKeyboardValue: flechas, RTL, PageUp/PageDown 10 % y Home/End', () => {
    expect(getBigStep(scale)).toBe(10);
    expect(getBigStep({ min: 0, max: 10, step: 5 })).toBe(5);
    expect(getKeyboardValue('ArrowRight', 50, scale)).toBe(51);
    expect(getKeyboardValue('ArrowLeft', 50, scale)).toBe(49);
    expect(getKeyboardValue('ArrowLeft', 50, { ...scale, rtl: true })).toBe(51);
    expect(getKeyboardValue('ArrowUp', 50, scale)).toBe(51);
    expect(getKeyboardValue('ArrowDown', 50, scale)).toBe(49);
    expect(getKeyboardValue('PageUp', 50, scale)).toBe(60);
    expect(getKeyboardValue('PageDown', 50, scale)).toBe(40);
    expect(getKeyboardValue('Home', 50, scale)).toBe(0);
    expect(getKeyboardValue('End', 50, scale)).toBe(100);
    expect(getKeyboardValue('a', 50, scale)).toBeNull();
  });

  it('setThumbValue: swap al cruzar (caso de vanilla)', () => {
    const opts = { ...scale, range: true };
    expect(setThumbValue([20, 60], 0, 30, opts)).toEqual({ values: [30, 60], activeThumb: 0 });
    expect(setThumbValue([30, 60], 0, 80, opts)).toEqual({ values: [60, 80], activeThumb: 1 });
    expect(setThumbValue([30, 60], 0, 60, opts).values).toEqual([60, 60]);
  });

  it('setThumbValue: disableSwap y minDistance (caso de vanilla)', () => {
    const opts = { ...scale, range: true, disableSwap: true, minDistance: 10 };
    expect(setThumbValue([20, 60], 0, 95, opts)).toEqual({ values: [50, 60], activeThumb: 0 });
    expect(setThumbValue([50, 60], 1, 0, opts).values).toEqual([50, 60]);
    expect(setThumbValue([50, 60], 1, 100, opts).values).toEqual([50, 100]);
    expect(setThumbValue([20, 60], 0, 95, { ...scale, range: true, noSwap: true }).values).toEqual([60, 60]);
  });

  it('setThumbValue simple', () => {
    expect(setThumbValue([10], 0, 33.4, scale)).toEqual({ values: [33], activeThumb: 0 });
  });
});
