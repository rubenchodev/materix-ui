import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getLocale,
  setLocale,
  addLocale,
  updateLocale,
  getDictionary,
  t,
  getComponentLocale,
  resetLocale
} from '../src/i18n/index.js';

describe('i18n', () => {
  let originalLocale;

  beforeEach(() => {
    originalLocale = getLocale();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.documentElement.removeAttribute('lang');
    setLocale(originalLocale);
  });

  // --- getLocale / setLocale ---

  it('el locale por defecto es "en"', () => {
    expect(getLocale()).toBe('en');
  });

  it('setLocale cambia el idioma activo a "es"', () => {
    const result = setLocale('es');
    expect(result).toBe(true);
    expect(getLocale()).toBe('es');
  });

  it('setLocale normaliza mayúsculas y variantes regionales (es-ES → es)', () => {
    const result = setLocale('ES-CO');
    expect(result).toBe(true);
    expect(getLocale()).toBe('es');
  });

  it('setLocale retorna false y mantiene el idioma actual si el código no está registrado', () => {
    setLocale('en');
    const result = setLocale('zz');
    expect(result).toBe(false);
    expect(getLocale()).toBe('en');
  });

  it('setLocale emite el evento mtx:locale:change', () => {
    let fired = false;
    let detail = null;
    const handler = (e) => {
      fired = true;
      detail = e.detail;
    };
    document.addEventListener('mtx:locale:change', handler);

    setLocale('es');
    expect(fired).toBe(true);
    expect(detail).toEqual({ locale: 'es' });

    document.removeEventListener('mtx:locale:change', handler);
  });

  // --- getDictionary ---

  it('getDictionary retorna el diccionario del idioma activo', () => {
    setLocale('en');
    const dict = getDictionary();
    expect(dict.code).toBe('en');
    expect(dict.dateTimePicker.today).toBe('Today');
  });

  it('getDictionary("es") retorna el diccionario español', () => {
    const dict = getDictionary('es');
    expect(dict.code).toBe('es');
    expect(dict.dateTimePicker.today).toBe('Hoy');
  });

  it('getDictionary con un idioma inexistente retorna el fallback "en"', () => {
    const dict = getDictionary('xx');
    expect(dict.code).toBe('en');
  });

  // --- t() (traducción) ---

  it('t() obtiene una clave del componente en el idioma activo', () => {
    setLocale('en');
    expect(t('dateTimePicker', 'today')).toBe('Today');
    expect(t('dateTimePicker', 'cancel')).toBe('Cancel');
    expect(t('dateTimePicker', 'ok')).toBe('OK');
  });

  it('t() retorna la traducción en español cuando locale es "es"', () => {
    setLocale('es');
    expect(t('dateTimePicker', 'today')).toBe('Hoy');
    expect(t('dateTimePicker', 'cancel')).toBe('Cancelar');
    expect(t('dateTimePicker', 'ok')).toBe('Aceptar');
  });

  it('t() con locale explícito ignora el idioma global', () => {
    setLocale('en');
    expect(t('dateTimePicker', 'today', null, null, 'es')).toBe('Hoy');
  });

  it('t() retorna el fallback cuando la clave no existe', () => {
    expect(t('dateTimePicker', 'nonExistentKey', null, 'FALLBACK')).toBe('FALLBACK');
  });

  it('t() retorna el nombre de la clave si no existe fallback', () => {
    expect(t('dateTimePicker', 'missingKey')).toBe('missingKey');
  });

  it('t() interpola parámetros posicionales {0}', () => {
    setLocale('en');
    const result = t('select', 'noneResultsText', ['React']);
    expect(result).toBe('No results found for "React"');
  });

  it('t() interpola parámetros posicionales en español', () => {
    setLocale('es');
    const result = t('select', 'noneResultsText', ['Vue']);
    expect(result).toBe('No se encontraron resultados para "Vue"');
  });

  it('t() retorna arrays directamente (ej. months)', () => {
    setLocale('en');
    const months = t('dateTimePicker', 'months');
    expect(Array.isArray(months)).toBe(true);
    expect(months).toHaveLength(12);
    expect(months[0]).toBe('January');
  });

  // --- Select keys ---

  it('t() resuelve claves del componente Select en inglés', () => {
    setLocale('en');
    expect(t('select', 'searchPlaceholder')).toBe('Search…');
    expect(t('select', 'selectAllText')).toBe('Select all');
    expect(t('select', 'deselectAllText')).toBe('Deselect all');
    expect(t('select', 'selectedCountSingular', [1])).toBe('1 selected');
    expect(t('select', 'selectedCountPlural', [5])).toBe('5 selected');
  });

  it('t() resuelve claves del componente Select en español', () => {
    setLocale('es');
    expect(t('select', 'searchPlaceholder')).toBe('Buscar…');
    expect(t('select', 'selectAllText')).toBe('Seleccionar todo');
    expect(t('select', 'deselectAllText')).toBe('Deseleccionar todo');
    expect(t('select', 'selectedCountSingular', [1])).toBe('1 seleccionado');
    expect(t('select', 'selectedCountPlural', [5])).toBe('5 seleccionados');
  });

  // --- TablePagination keys ---

  it('t() resuelve claves de TablePagination en inglés', () => {
    setLocale('en');
    expect(t('tablePagination', 'rowsPerPage')).toBe('Rows per page:');
    expect(t('tablePagination', 'all')).toBe('All');
    expect(t('tablePagination', 'of')).toBe('of');
    expect(t('tablePagination', 'moreThan')).toBe('more than');
    expect(t('tablePagination', 'firstPage')).toBe('First page');
    expect(t('tablePagination', 'nextPage')).toBe('Next page');
  });

  it('t() resuelve claves de TablePagination en español', () => {
    setLocale('es');
    expect(t('tablePagination', 'rowsPerPage')).toBe('Filas por página:');
    expect(t('tablePagination', 'all')).toBe('Todas');
    expect(t('tablePagination', 'of')).toBe('de');
    expect(t('tablePagination', 'moreThan')).toBe('más de');
    expect(t('tablePagination', 'firstPage')).toBe('Primera página');
  });

  // --- Dialog keys ---

  it('t() resuelve claves de Dialog', () => {
    setLocale('en');
    expect(t('dialog', 'cancel')).toBe('Cancel');
    expect(t('dialog', 'ok')).toBe('OK');

    setLocale('es');
    expect(t('dialog', 'cancel')).toBe('Cancelar');
    expect(t('dialog', 'ok')).toBe('Aceptar');
  });

  // --- addLocale ---

  it('addLocale registra un nuevo idioma y setLocale lo activa', () => {
    addLocale('fr', {
      code: 'fr',
      name: 'Français',
      dateTimePicker: {
        today: "Aujourd'hui",
        cancel: 'Annuler',
        ok: 'OK'
      }
    });

    const result = setLocale('fr');
    expect(result).toBe(true);
    expect(getLocale()).toBe('fr');
    expect(t('dateTimePicker', 'today')).toBe("Aujourd'hui");
    expect(t('dateTimePicker', 'cancel')).toBe('Annuler');
  });

  // --- updateLocale ---

  it('updateLocale extiende un idioma existente sin borrar claves previas', () => {
    setLocale('en');
    const originalCancel = t('dateTimePicker', 'cancel');

    updateLocale('en', {
      dateTimePicker: { customKey: 'Custom Value' }
    });

    // La clave original sigue existiendo
    expect(t('dateTimePicker', 'cancel')).toBe(originalCancel);
    // La nueva clave está disponible
    expect(t('dateTimePicker', 'customKey')).toBe('Custom Value');
  });

  // --- getComponentLocale ---

  it('getComponentLocale retorna el locale global si el elemento no tiene atributo', () => {
    setLocale('en');
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(getComponentLocale(div)).toBe('en');
  });

  it('getComponentLocale respeta data-locale en el elemento', () => {
    setLocale('en');
    const div = document.createElement('div');
    div.setAttribute('data-locale', 'es');
    document.body.appendChild(div);
    expect(getComponentLocale(div)).toBe('es');
  });

  it('getComponentLocale respeta data-lang en un ancestro', () => {
    setLocale('en');
    const parent = document.createElement('div');
    parent.setAttribute('data-lang', 'es');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);
    expect(getComponentLocale(child)).toBe('es');
  });

  it('getComponentLocale ignora idiomas no registrados y cae al global', () => {
    setLocale('en');
    const div = document.createElement('div');
    div.setAttribute('data-locale', 'zz');
    document.body.appendChild(div);
    expect(getComponentLocale(div)).toBe('en');
  });

  it('getComponentLocale retorna el locale global si recibe null', () => {
    setLocale('es');
    expect(getComponentLocale(null)).toBe('es');
  });

  // --- Precedencia: lang local > setLocale() explícito > <html lang> > en ---

  it('sin setLocale(), <html lang> decide el idioma', () => {
    resetLocale();
    document.documentElement.setAttribute('lang', 'es-ES');
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(getComponentLocale(div)).toBe('es');
    expect(getComponentLocale(null)).toBe('es');
  });

  it('setLocale() explícito prevalece sobre <html lang>', () => {
    document.documentElement.setAttribute('lang', 'es');
    setLocale('en');
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(getComponentLocale(div)).toBe('en');
  });

  it('un lang en un ancestro distinto de <html> prevalece sobre setLocale()', () => {
    setLocale('en');
    document.body.innerHTML = '<section lang="es"><span></span></section>';
    expect(getComponentLocale(document.querySelector('span'))).toBe('es');
  });

  it('un lang local no registrado pasa a setLocale() y luego a <html lang>', () => {
    resetLocale();
    document.documentElement.setAttribute('lang', 'es');
    document.body.innerHTML = '<section lang="zz"><span></span></section>';
    const span = document.querySelector('span');
    expect(getComponentLocale(span)).toBe('es');
    setLocale('en');
    expect(getComponentLocale(span)).toBe('en');
  });

  it('sin setLocale(), getLocale(), getDictionary() y t() siguen <html lang>', () => {
    resetLocale();
    document.documentElement.setAttribute('lang', 'es-MX');
    expect(getLocale()).toBe('es');
    expect(getDictionary().select.searchPlaceholder).toBe('Buscar…');
    expect(t('select', 'searchPlaceholder')).toBe('Buscar…');
    setLocale('en');
    expect(getLocale()).toBe('en');
    expect(t('select', 'searchPlaceholder')).toBe('Search…');
  });

  it('resetLocale() vuelve a "en" sin lang y emite mtx:locale:change', () => {
    setLocale('es');
    let detail = null;
    const handler = (event) => { detail = event.detail; };
    document.addEventListener('mtx:locale:change', handler);
    resetLocale();
    document.removeEventListener('mtx:locale:change', handler);
    expect(getLocale()).toBe('en');
    expect(getComponentLocale(null)).toBe('en');
    expect(detail).toEqual({ locale: 'en' });
  });
});
