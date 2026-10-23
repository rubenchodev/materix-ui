import { describe, it, expect, beforeEach, vi } from 'vitest';
import { theme } from '../src/core/theme.js';

const root = document.documentElement;

/** Espera a que el MutationObserver procese los cambios. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('theme (Materix.theme)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    theme.configure({ persist: false, query: false });
    theme.set('light');
    try { localStorage.clear(); } catch (e) { /* sin almacenamiento */ }
  });

  it('get(), set() y toggle() actualizan data-mtx-theme', () => {
    expect(theme.get()).toBe('light');
    expect(theme.set('dark')).toBe('dark');
    expect(root.getAttribute('data-mtx-theme')).toBe('dark');
    expect(theme.toggle()).toBe('light');
    expect(root.getAttribute('data-mtx-theme')).toBe('light');
    expect(theme.getMode()).toBe('light');
  });

  it('rechaza modos no válidos', () => {
    expect(() => theme.set('blue')).toThrow(TypeError);
  });

  it('emite mtx:theme:change con theme, mode y previous', () => {
    const spy = vi.fn();
    document.addEventListener('mtx:theme:change', spy);
    theme.set('dark');
    document.removeEventListener('mtx:theme:change', spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ theme: 'dark', mode: 'dark', previous: 'light' });
  });

  it("'system' sigue prefers-color-scheme y conserva el modo", () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn((query) => ({
      matches: query.includes('dark'), media: query, addEventListener() {}, removeEventListener() {},
    }));
    theme.set('system');
    window.matchMedia = original;
    expect(theme.getMode()).toBe('system');
    expect(root.getAttribute('data-mtx-theme-mode')).toBe('system');
    expect(theme.get()).toBe('dark');
  });

  it('persiste en localStorage solo si se activa', () => {
    theme.set('dark');
    expect(localStorage.getItem('mtx-theme')).toBeNull();
    theme.configure({ persist: 'my-theme' });
    theme.set('light');
    expect(localStorage.getItem('my-theme')).toBe('light');
    theme.set('dark', { persist: false });
    expect(localStorage.getItem('my-theme')).toBe('light');
  });

  it('configure({ persist }) restaura el modo guardado', () => {
    localStorage.setItem('mtx-theme', 'dark');
    theme.configure({ persist: true });
    expect(theme.get()).toBe('dark');
  });

  it('los botones [data-mtx-theme-toggle] alternan y sincronizan icono, aria-pressed y aria-label', () => {
    document.body.innerHTML = '<button type="button" data-mtx-theme-toggle><span class="material-icons" aria-hidden="true">dark_mode</span></button>';
    const button = document.querySelector('button');
    theme.sync();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Dark theme');
    expect(button.getAttribute('title')).toBe('Switch to dark theme');
    button.click();
    expect(theme.get()).toBe('dark');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.querySelector('.material-icons').textContent).toBe('light_mode');
    expect(button.getAttribute('title')).toBe('Switch to light theme');
  });

  it('traduce las etiquetas según el locale del botón y respeta el aria-label del autor', () => {
    document.body.innerHTML = '<div lang="es"><button data-mtx-theme-toggle><span class="material-icons">dark_mode</span></button></div>'
      + '<button id="own" data-mtx-theme-toggle aria-label="Night mode"><span class="material-icons">dark_mode</span></button>';
    theme.sync();
    expect(document.querySelector('[lang] button').getAttribute('aria-label')).toBe('Tema oscuro');
    expect(document.getElementById('own').getAttribute('aria-label')).toBe('Night mode');
  });

  it('los botones con valor fijan el modo y marcan aria-pressed', () => {
    document.body.innerHTML = '<button data-mtx-theme-toggle="light">L</button><button data-mtx-theme-toggle="dark">D</button>';
    const [light, dark] = document.querySelectorAll('button');
    dark.click();
    expect(theme.get()).toBe('dark');
    expect(dark.getAttribute('aria-pressed')).toBe('true');
    expect(light.getAttribute('aria-pressed')).toBe('false');
    expect(dark.hasAttribute('aria-label')).toBe(false);
  });

  it('detecta cambios externos de data-mtx-theme', async () => {
    const spy = vi.fn();
    document.addEventListener('mtx:theme:change', spy);
    root.setAttribute('data-mtx-theme', 'dark');
    await flush();
    document.removeEventListener('mtx:theme:change', spy);
    expect(theme.get()).toBe('dark');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('?theme= solo se aplica si query está activo', () => {
    window.history.replaceState(null, '', '/?theme=dark');
    theme.configure({ query: false });
    expect(theme.get()).toBe('light');
    theme.configure({ query: true });
    expect(theme.get()).toBe('dark');
    window.history.replaceState(null, '', '/');
  });
});
