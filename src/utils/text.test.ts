import {
  filterOptions,
  filterSelectOptions,
  findMatch,
  getSelectSearchText,
  getSelectedDisplayKind,
  matchesSelectSearch,
  normalizeOption,
  normalizeText,
  parseCountFormat,
  splitMatch,
} from './text';

describe('normalizeText / findMatch (casos de vanilla)', () => {
  it('normalizeText quita tildes y pasa a minúsculas', () => {
    expect(normalizeText('MÉXICO Perú Ñandú')).toBe('mexico peru nandu');
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(42)).toBe('42');
  });

  it('findMatch localiza el rango en el texto original ignorando tildes', () => {
    expect(findMatch('México', 'mex')).toEqual({ start: 0, end: 3 });
    expect(findMatch('Perú', 'RU')).toEqual({ start: 2, end: 4 });
    expect(findMatch('Colombia', 'xyz')).toBeNull();
    expect(findMatch('Colombia', 'lom', true)).toBeNull();
    expect(findMatch('Colombia', '  ')).toBeNull();
    expect(findMatch('', 'a')).toBeNull();
    expect(findMatch('Colombia', 'col', true)).toEqual({ start: 0, end: 3 });
  });

  it('findMatch respeta caracteres compuestos (NFD) y emoji', () => {
    const decomposed = 'Pérez';
    expect(findMatch(decomposed, 'perez')).toEqual({ start: 0, end: 6 });
    expect(findMatch('😀 Ñu', 'nu')).toEqual({ start: 3, end: 5 });
  });

  it('splitMatch segmenta para resaltar', () => {
    expect(splitMatch('Bogotá', 'gota')).toEqual([
      { text: 'Bo', match: false },
      { text: 'gotá', match: true },
    ]);
    expect(splitMatch('Lima', 'x')).toEqual([{ text: 'Lima', match: false }]);
    expect(splitMatch('', 'x')).toEqual([]);
  });
});

describe('normalizeOption (caso de vanilla)', () => {
  it('admite texto y objetos conservando datos extra', () => {
    expect(normalizeOption('Lima')).toEqual({ value: 'Lima', label: 'Lima' });
    expect(normalizeOption({ value: 1, label: 'Uno', group: 'G', id: 9 })).toEqual({ value: '1', label: 'Uno', group: 'G', id: 9 });
    expect(normalizeOption({ label: 'Solo label' })!.value).toBe('Solo label');
    expect(normalizeOption({ value: 'x', disabled: true })!.disabled).toBe(true);
    expect(normalizeOption({ value: 'x', group: '' })).toEqual({ value: 'x', label: 'x' });
    expect(normalizeOption(null)).toBeNull();
    expect(normalizeOption(7)).toEqual({ value: '7', label: '7' });
  });
});

describe('filtrado de Autocomplete', () => {
  const options = [{ label: 'Bogotá' }, { label: 'Medellín' }, { label: 'Cali' }];
  it('filtra sin tildes, por contenido o por inicio', () => {
    expect(filterOptions(options, 'LI').map((o) => o.label)).toEqual(['Medellín', 'Cali']);
    expect(filterOptions(options, 'me', 'start').map((o) => o.label)).toEqual(['Medellín']);
    expect(filterOptions(options, 'bogota').map((o) => o.label)).toEqual(['Bogotá']);
    const all = filterOptions(options, '  ');
    expect(all).toEqual(options);
    expect(all).not.toBe(options);
  });
});

describe('filtrado de Select', () => {
  it('busca en texto y valor en minúsculas', () => {
    const searchable = getSelectSearchText('Colombia', 'CO');
    expect(searchable).toBe('colombia co');
    expect(matchesSelectSearch(searchable, ' COL ')).toBe(true);
    expect(matchesSelectSearch(searchable, 'co')).toBe(true);
    expect(matchesSelectSearch(searchable, 'peru')).toBe(false);
    expect(matchesSelectSearch(searchable, '')).toBe(true);
    expect(matchesSelectSearch(searchable, null)).toBe(true);
    const opts = [{ label: 'Colombia', value: 'co' }, { label: 'Perú', value: 'pe' }];
    expect(filterSelectOptions(opts, 'pe')).toEqual([opts[1]]);
  });

  it('parseCountFormat y tipo de texto mostrado', () => {
    expect(parseCountFormat('count > 3')).toBe(3);
    expect(parseCountFormat('count>10')).toBe(10);
    expect(parseCountFormat('values')).toBe(Infinity);
    expect(parseCountFormat(null)).toBe(Infinity);
    expect(getSelectedDisplayKind(0, 'values')).toBe('placeholder');
    expect(getSelectedDisplayKind(2, 'static')).toBe('placeholder');
    expect(getSelectedDisplayKind(2, 'count')).toBe('count');
    expect(getSelectedDisplayKind(2)).toBe('values');
    expect(getSelectedDisplayKind(3, 'count > 3')).toBe('values');
    expect(getSelectedDisplayKind(4, 'count > 3')).toBe('count');
  });
});
