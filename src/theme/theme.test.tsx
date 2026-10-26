import { act, render, renderHook, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import { useT } from '../i18n';
import {
  MaterixProvider,
  ThemeProvider,
  ThemeScript,
  getThemeScript,
  normalizeThemeMode,
  resolveThemeMode,
  useTheme,
} from './index';
import type { ThemeProviderProps } from './index';

const html = document.documentElement;

/** Simula `prefers-color-scheme` y devuelve un disparador de cambios. */
function mockScheme(dark: boolean) {
  const listeners = new Set<() => void>();
  const state = { dark };
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    get matches() { return query.includes('dark') ? state.dark : false; },
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  return {
    set(value: boolean) { state.dark = value; listeners.forEach((cb) => cb()); },
    restore() { window.matchMedia = original; },
  };
}

const wrap = (props: Omit<ThemeProviderProps, 'children'> = {}) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
  };

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  html.removeAttribute('data-mtx-theme-mode');
});

describe('utilidades puras', () => {
  it('normaliza y resuelve modos', () => {
    expect(normalizeThemeMode(' DARK ')).toBe('dark');
    expect(normalizeThemeMode('blue')).toBeNull();
    expect(resolveThemeMode('system', true)).toBe('dark');
    expect(resolveThemeMode('system', false)).toBe('light');
    expect(resolveThemeMode('dark', false)).toBe('dark');
  });

  it('getThemeScript aplica URL > storage > defecto y escapa la clave', () => {
    const run = (code: string) => new Function(code)();
    run(getThemeScript());
    expect(html.getAttribute('data-mtx-theme')).toBe('light');
    expect(html.getAttribute('data-mtx-theme-mode')).toBe('light');

    localStorage.setItem('mtx-theme', 'dark');
    run(getThemeScript());
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');

    window.history.replaceState(null, '', '/?theme=light');
    run(getThemeScript());
    expect(html.getAttribute('data-mtx-theme')).toBe('light');
    run(getThemeScript('mtx-theme', { query: false }));
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');

    localStorage.clear();
    window.history.replaceState(null, '', '/');
    const scheme = mockScheme(true);
    run(getThemeScript('k', { defaultMode: 'system' }));
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    expect(html.getAttribute('data-mtx-theme-mode')).toBe('system');
    scheme.restore();

    expect(getThemeScript('</script><script>')).not.toContain('</script>');
  });

  it('ThemeScript renderiza el script en SSR', () => {
    const out = renderToString(<ThemeScript storageKey="app-theme" />);
    expect(out).toContain('<script>');
    expect(out).toContain('app-theme');
  });
});

describe('ThemeProvider', () => {
  it('aplica data-mtx-theme y data-mtx-theme-mode en <html> por defecto', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrap() });
    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedMode).toBe('light');
    expect(html.getAttribute('data-mtx-theme')).toBe('light');
    expect(html.getAttribute('data-mtx-theme-mode')).toBe('light');
  });

  it('setMode y toggle actualizan, persisten y notifican', () => {
    const onModeChange = vi.fn();
    const { result } = renderHook(() => useTheme(), { wrapper: wrap({ onModeChange }) });
    act(() => result.current.setMode('dark'));
    expect(result.current.resolvedMode).toBe('dark');
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    expect(localStorage.getItem('mtx-theme')).toBe('dark');
    expect(onModeChange).toHaveBeenLastCalledWith('dark', 'dark');
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('light');
    act(() => result.current.setMode('dark', { persist: false }));
    expect(localStorage.getItem('mtx-theme')).toBe('light');
    expect(() => result.current.setMode('blue' as never)).toThrow(TypeError);
  });

  it('lee localStorage y ?theme= (la URL prevalece y no se persiste)', () => {
    localStorage.setItem('mtx-theme', 'dark');
    const a = renderHook(() => useTheme(), { wrapper: wrap() });
    expect(a.result.current.mode).toBe('dark');
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    a.unmount();

    window.history.replaceState(null, '', '/?theme=light');
    const b = renderHook(() => useTheme(), { wrapper: wrap() });
    expect(b.result.current.mode).toBe('light');
    expect(localStorage.getItem('mtx-theme')).toBe('dark');
    b.unmount();

    const c = renderHook(() => useTheme(), { wrapper: wrap({ query: false, storageKey: null }) });
    expect(c.result.current.mode).toBe('light');
  });

  it('defaultMode y storageKey personalizada', () => {
    localStorage.setItem('app', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper: wrap({ defaultMode: 'light', storageKey: 'app' }) });
    expect(result.current.mode).toBe('dark');
    act(() => result.current.setMode('light'));
    expect(localStorage.getItem('app')).toBe('light');
    expect(localStorage.getItem('mtx-theme')).toBeNull();
  });

  it('modo system sigue a prefers-color-scheme', () => {
    const scheme = mockScheme(false);
    const { result } = renderHook(() => useTheme(), { wrapper: wrap({ defaultMode: 'system', storageKey: null }) });
    expect(result.current.resolvedMode).toBe('light');
    act(() => scheme.set(true));
    expect(result.current.mode).toBe('system');
    expect(result.current.resolvedMode).toBe('dark');
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    expect(html.getAttribute('data-mtx-theme-mode')).toBe('system');
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('light');
    scheme.restore();
  });

  it('modo controlado: ignora almacenamiento y solo notifica', () => {
    localStorage.setItem('mtx-theme', 'dark');
    const onModeChange = vi.fn();
    const { result } = renderHook(() => useTheme(), { wrapper: wrap({ mode: 'light', onModeChange }) });
    expect(result.current.mode).toBe('light');
    act(() => result.current.setMode('dark'));
    expect(result.current.mode).toBe('light');
    expect(onModeChange).toHaveBeenCalledWith('dark', 'dark');
  });

  it('target="none" no toca <html>', () => {
    html.removeAttribute('data-mtx-theme');
    const { result } = renderHook(() => useTheme(), { wrapper: wrap({ target: 'none', defaultMode: 'dark' }) });
    expect(result.current.resolvedMode).toBe('dark');
    expect(html.hasAttribute('data-mtx-theme')).toBe(false);
  });

  it('sincroniza el evento storage de otra pestaña', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrap() });
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'mtx-theme', newValue: 'dark' }));
    });
    expect(result.current.mode).toBe('dark');
  });

  it('useTheme sin provider devuelve light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('light');
    expect(() => result.current.toggle()).not.toThrow();
  });

  it('SSR: renderiza sin acceder a window', () => {
    const out = renderToString(
      <MaterixProvider defaultMode="dark" target="none" locale="es">
        <span>hola</span>
      </MaterixProvider>,
    );
    expect(out).toContain('class="mtx-root"');
    expect(out).toContain('data-mtx-theme="dark"');
    expect(out).toContain('lang="es"');
  });
});

describe('MaterixProvider', () => {
  it('envuelve en .mtx-root y combina tema e idioma', () => {
    function Probe() {
      const t = useT('dialog');
      const { resolvedMode } = useTheme();
      return <span data-testid="out">{`${t('cancel')}|${resolvedMode}`}</span>;
    }
    const { container } = render(
      <MaterixProvider locale="es" defaultMode="dark" className="app" id="root">
        <Probe />
      </MaterixProvider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.className).toBe('mtx-root app');
    expect(root.id).toBe('root');
    expect(root.getAttribute('lang')).toBe('es');
    expect(root.hasAttribute('data-mtx-theme')).toBe(false);
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    expect(screen.getByTestId('out').textContent).toBe('Cancelar|dark');
  });

  it('as, disableRoot y tema acotado con target="none"', () => {
    const a = render(<MaterixProvider as="main" target="none" defaultMode="dark"><p>x</p></MaterixProvider>);
    const root = a.container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('MAIN');
    expect(root.getAttribute('data-mtx-theme')).toBe('dark');
    a.unmount();

    const b = render(<MaterixProvider disableRoot messages={{ en: { dialog: { ok: 'Fine' } } }}><p>y</p></MaterixProvider>);
    expect(b.container.firstElementChild?.tagName).toBe('P');
  });
});

describe('hidratación SSR', () => {
  it('con mode="system" y sistema oscuro no hay transición a light', async () => {
    const scheme = mockScheme(true);
    const app = <ThemeProvider mode="system" storageKey={null}><span>x</span></ThemeProvider>;
    const markup = renderToString(app);
    new Function(getThemeScript(null, { defaultMode: 'system' }))();
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');

    const written: string[] = [];
    const original = html.setAttribute.bind(html);
    const spy = vi.spyOn(html, 'setAttribute').mockImplementation((name: string, value: string) => {
      if (name === 'data-mtx-theme') written.push(value);
      original(name, value);
    });
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.appendChild(container);
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, app);
    });
    expect(written).not.toContain('light');
    expect(html.getAttribute('data-mtx-theme')).toBe('dark');
    spy.mockRestore();
    act(() => root!.unmount());
    container.remove();
    scheme.restore();
  });
});

