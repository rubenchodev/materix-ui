import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  I18nProvider,
  addLocale,
  en,
  es,
  getDictionary,
  hasLocale,
  interpolate,
  resolveLocaleCode,
  translate,
  updateLocale,
  useIntlLocale,
  useLocale,
  useT,
} from './index';

afterEach(() => {
  // Desmonta antes de tocar <html lang> para que el observer no actualice componentes vivos.
  cleanup();
  document.documentElement.removeAttribute('lang');
});

describe('diccionarios', () => {
  it('es tiene exactamente las mismas secciones y claves que en', () => {
    const shape = (dict: Record<string, unknown>) =>
      Object.keys(dict).sort().map((k) => {
        const v = dict[k];
        return v && typeof v === 'object' && !Array.isArray(v) ? `${k}:${Object.keys(v).sort().join(',')}` : k;
      });
    expect(shape(es)).toEqual(shape(en));
    expect(en.code).toBe('en');
    expect(es.code).toBe('es');
    expect(es.dateTimePicker.months).toHaveLength(12);
    expect(es.dateTimePicker.weekdays).toHaveLength(7);
  });
});

describe('registro puro', () => {
  it('interpolate admite posicionales y con nombre y conserva marcadores sin valor', () => {
    expect(interpolate('{0} de {1}', [1, 5])).toBe('1 de 5');
    expect(interpolate('Paso {n} de {total}', { n: 2, total: 4 })).toBe('Paso 2 de 4');
    expect(interpolate('{0} y {1}', ['a'])).toBe('a y {1}');
    expect(interpolate('{name}', {})).toBe('{name}');
    expect(interpolate('sin params', null)).toBe('sin params');
  });

  it('resolveLocaleCode reduce a idiomas registrados', () => {
    expect(resolveLocaleCode('es-MX')).toBe('es');
    expect(resolveLocaleCode('ES_co')).toBe('es');
    expect(resolveLocaleCode('en')).toBe('en');
    expect(resolveLocaleCode('fr')).toBeNull();
    expect(resolveLocaleCode('')).toBeNull();
    expect(hasLocale('es-AR')).toBe(true);
  });

  it('getDictionary con un idioma inexistente retorna en', () => {
    expect(getDictionary('xx').code).toBe('en');
    expect(getDictionary('es-MX').code).toBe('es');
  });

  it('translate: idioma, fallback a inglés, fallback explícito y clave', () => {
    expect(translate('dialog', 'cancel', null, null, 'es')).toBe('Cancelar');
    expect(translate('dialog', 'cancel')).toBe('Cancel');
    expect(translate('select', 'noneResultsText', ['abc'], null, 'es')).toBe('No se encontraron resultados para "abc"');
    expect(translate('pagination', 'goToPage', { page: 3 }, null, 'es')).toBe('Ir a la página 3');
    expect(translate('dialog', 'missing', null, 'Respaldo', 'es')).toBe('Respaldo');
    expect(translate('dialog', 'missing')).toBe('missing');
    expect(translate<string[]>('dateTimePicker', 'months', null, null, 'es')[0]).toBe('Enero');
  });

  it('translate aplica overrides por idioma sobre el registro', () => {
    const overrides = { es: { dialog: { ok: 'Vale' } } };
    expect(translate('dialog', 'ok', null, null, 'es', overrides)).toBe('Vale');
    expect(translate('dialog', 'cancel', null, null, 'es', overrides)).toBe('Cancelar');
  });

  it('addLocale registra un idioma con fallback a inglés y updateLocale lo extiende', () => {
    addLocale('fr', { dialog: { cancel: 'Annuler' } });
    expect(translate('dialog', 'cancel', null, null, 'fr')).toBe('Annuler');
    expect(translate('dialog', 'ok', null, null, 'fr')).toBe('OK');
    updateLocale('fr', { dialog: { ok: "D'accord" } });
    expect(translate('dialog', 'ok', null, null, 'fr')).toBe("D'accord");
    expect(translate('dialog', 'cancel', null, null, 'fr')).toBe('Annuler');
    updateLocale('pt', { dialog: { ok: 'Certo' } });
    expect(translate('dialog', 'ok', null, null, 'pt-BR')).toBe('Certo');
  });

  it('updateLocale extiende un idioma existente sin borrar claves previas', () => {
    updateLocale('en', { dialog: { custom: 'Custom' } });
    expect(translate('dialog', 'custom')).toBe('Custom');
    expect(translate('dialog', 'ok')).toBe('OK');
  });
});

describe('hooks', () => {
  it('sin provider usa en', () => {
    const { result } = renderHook(() => useT('dialog'));
    expect(result.current('cancel')).toBe('Cancel');
    expect(renderHook(() => useLocale()).result.current).toBe('en');
  });

  it('sin provider respeta <html lang> y reacciona a sus cambios', async () => {
    document.documentElement.setAttribute('lang', 'es-MX');
    const { result } = renderHook(() => ({ t: useT('dialog'), locale: useLocale(), intl: useIntlLocale() }));
    expect(result.current.t('cancel')).toBe('Cancelar');
    expect(result.current.locale).toBe('es');
    expect(result.current.intl).toBe('es-MX');
    await act(async () => {
      document.documentElement.setAttribute('lang', 'en');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(result.current.locale).toBe('en');
  });

  it('la prop locale del provider prevalece sobre <html lang>', () => {
    document.documentElement.setAttribute('lang', 'en');
    const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider locale="es-CO">{children}</I18nProvider>;
    const { result } = renderHook(() => ({ t: useT('stepper'), locale: useLocale(), intl: useIntlLocale() }), { wrapper });
    expect(result.current.t('step', { n: 1, total: 3 })).toBe('Paso 1 de 3');
    expect(result.current.locale).toBe('es');
    expect(result.current.intl).toBe('es-CO');
  });

  it('un idioma no registrado usa textos en inglés pero conserva el locale Intl', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider locale="de-DE">{children}</I18nProvider>;
    const { result } = renderHook(() => ({ t: useT('dialog'), locale: useLocale(), intl: useIntlLocale() }), { wrapper });
    expect(result.current.t('cancel')).toBe('Cancel');
    expect(result.current.locale).toBe('en');
    expect(result.current.intl).toBe('de-DE');
  });

  it('provider anidado hereda el idioma y combina messages', () => {
    function Probe() {
      const t = useT('dialog');
      return <span data-testid="out">{`${t('ok')}|${t('cancel')}`}</span>;
    }
    render(
      <I18nProvider locale="es" messages={{ es: { dialog: { ok: 'Vale' } } }}>
        <I18nProvider messages={{ es: { dialog: { cancel: 'Anular' } } }}>
          <Probe />
        </I18nProvider>
      </I18nProvider>,
    );
    expect(screen.getByTestId('out').textContent).toBe('Vale|Anular');
  });

  it('useT con idioma local del componente', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider locale="en">{children}</I18nProvider>;
    const { result } = renderHook(() => useT('chip', 'es'), { wrapper });
    expect(result.current('delete')).toBe('Eliminar');
  });

  it('re-renderiza tras updateLocale', () => {
    function Probe() {
      const t = useT('progress');
      return <span data-testid="out">{t('loading')}</span>;
    }
    render(<I18nProvider locale="es"><Probe /></I18nProvider>);
    expect(screen.getByTestId('out').textContent).toBe('Cargando');
    act(() => updateLocale('es', { progress: { loading: 'Cargando datos' } }));
    expect(screen.getByTestId('out').textContent).toBe('Cargando datos');
    act(() => updateLocale('es', { progress: { loading: 'Cargando' } }));
  });
});

describe('regresiones', () => {
  it('messages de un idioma no registrado y con región tienen prioridad', () => {
    function Probe() {
      return <span data-testid="out">{useT('drawer')('close')}</span>;
    }
    const a = render(<I18nProvider locale="fr" messages={{ fr: { drawer: { close: 'Fermer' } } }}><Probe /></I18nProvider>);
    expect(screen.getByTestId('out').textContent).toBe('Fermer');
    a.unmount();
    const b = render(
      <I18nProvider locale="es-MX" messages={{ 'es-MX': { drawer: { close: 'Cerrar (MX)' } }, es: { drawer: { close: 'Cerrar (ES)' } } }}>
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByTestId('out').textContent).toBe('Cerrar (MX)');
    b.unmount();
    render(<I18nProvider locale="es-AR" messages={{ es: { drawer: { close: 'Cerrar (ES)' } } }}><Probe /></I18nProvider>);
    expect(screen.getByTestId('out').textContent).toBe('Cerrar (ES)');
  });

  it('translate: override exacto > idioma base > código registrado > registro', () => {
    const overrides = { es_MX: { chip: { delete: 'Borrar MX' } }, es: { chip: { delete: 'Borrar' } } };
    expect(translate('chip', 'delete', null, null, 'es-MX', overrides)).toBe('Borrar MX');
    expect(translate('chip', 'delete', null, null, 'es-CO', overrides)).toBe('Borrar');
    expect(translate('chip', 'delete', null, null, 'es', {})).toBe('Eliminar');
    expect(translate('chip', 'delete', null, null, 'pt', { pt: { chip: { delete: 'Excluir' } } })).toBe('Excluir');
  });

  it('con provider no se crean observers de <html lang> por componente', () => {
    const spy = vi.spyOn(window, 'MutationObserver');
    function Probe() {
      useT('dialog');
      return null;
    }
    render(<I18nProvider locale="es">{Array.from({ length: 5 }, (_, i) => <Probe key={i} />)}</I18nProvider>);
    expect(spy).not.toHaveBeenCalled();
    cleanup();
    render(<>{Array.from({ length: 5 }, (_, i) => <Probe key={i} />)}</>);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('diccionarios incluyen las claves de segundos del TimePicker', () => {
    expect(translate('dateTimePicker', 'secondsValue', { value: 5 }, null, 'es')).toBe('5 segundos');
    expect(translate('dateTimePicker', 'selectSeconds', null, null, 'en')).toBe('Select seconds');
    expect(translate('dateTimePicker', 'second', null, null, 'es')).toBe('Segundo');
  });
});

