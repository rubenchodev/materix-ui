import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Alert } from '../src/components/alert/alert.js';

function createAlert(attrs = {}, innerHTML = '<div class="mtx-alert__message">Mensaje de alerta</div>') {
  const el = document.createElement('div');
  el.className = 'mtx-alert';
  el.setAttribute('data-mtx', 'alert');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}

describe('Alert', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  it('se inicializa y registra correctamente', () => {
    const el = createAlert();
    initAll();
    const alert = getInstance(el);
    expect(alert).toBeInstanceOf(Alert);
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('aplica las clases de severidad y variante por defecto', () => {
    const el = createAlert();
    initAll();
    expect(el.classList.contains('mtx-alert--success')).toBe(true);
    expect(el.classList.contains('mtx-alert--standard')).toBe(true);
  });

  it('aplica severidad y variante personalizadas', () => {
    const el = createAlert({ 'data-severity': 'error', 'data-variant': 'filled' });
    initAll();
    expect(el.classList.contains('mtx-alert--error')).toBe(true);
    expect(el.classList.contains('mtx-alert--filled')).toBe(true);
  });

  it('genera un icono SVG según la severidad si no tiene uno explícito', () => {
    const el = createAlert({ 'data-severity': 'warning' });
    initAll();
    const icon = el.querySelector('.mtx-alert__icon');
    expect(icon).not.toBeNull();
    expect(icon.querySelector('svg')).not.toBeNull();
  });

  it('no inserta icono automático si data-icon es false', () => {
    const el = createAlert({ 'data-icon': 'false' });
    initAll();
    expect(el.querySelector('.mtx-alert__icon')).toBeNull();
  });

  it('añade un botón de cierre cuando data-dismissible está presente', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    const closeBtn = el.querySelector('.mtx-alert__close');
    expect(closeBtn).not.toBeNull();
    expect(closeBtn.getAttribute('aria-label')).toBe('Close');
  });

  it('permite cerrar y reabrir la alerta con eventos', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    const alert = getInstance(el);
    const closeSpy = vi.fn();
    const openSpy = vi.fn();

    el.addEventListener('mtx:alert:close', closeSpy);
    el.addEventListener('mtx:alert:open', openSpy);

    alert.close();
    vi.advanceTimersByTime(250);
    expect(el.hidden).toBe(true);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    alert.open();
    expect(el.hidden).toBe(false);
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('cierra la alerta al hacer clic en el botón de cierre', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    const closeBtn = el.querySelector('.mtx-alert__close');
    closeBtn.click();
    vi.advanceTimersByTime(250);
    expect(el.hidden).toBe(true);
  });

  it('limpia los listeners en destroy()', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    const alert = getInstance(el);
    alert.destroy();
    expect(() => alert.destroy()).not.toThrow();
  });
});

describe('Alert — A21 (icono, hidden, i18n)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    vi.useFakeTimers();
  });

  it('genera el icono SVG de 22px como MUI', () => {
    const el = createAlert({ 'data-severity': 'warning' });
    initAll();
    const svg = el.querySelector('.mtx-alert__icon svg');
    expect(svg.getAttribute('width')).toBe('22');
    expect(svg.getAttribute('height')).toBe('22');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('traduce el aria-label del cierre según el locale del elemento', () => {
    const el = createAlert({ 'data-dismissible': '', lang: 'es' });
    initAll();
    expect(el.querySelector('.mtx-alert__close').getAttribute('aria-label')).toBe('Cerrar');
  });

  it('respeta data-close-label', () => {
    const el = createAlert({ 'data-dismissible': '', 'data-close-label': 'Dismiss warning' });
    initAll();
    expect(el.querySelector('.mtx-alert__close').getAttribute('aria-label')).toBe('Dismiss warning');
  });

  it('close() termina con hidden y la hoja de estilos lo saca del flujo', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    getInstance(el).close();
    vi.advanceTimersByTime(250);
    expect(el.hidden).toBe(true);
    const css = readFileSync('src/components/alert/alert.css', 'utf8');
    expect(css).toMatch(/\.mtx-alert\[hidden\]\s*\{\s*display:\s*none\s*!important;/);
  });

  it('con prefers-reduced-motion cierra sin esperar la animación', () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} });
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    getInstance(el).close();
    expect(el.hidden).toBe(true);
    window.matchMedia = original;
  });
});

describe('Alert — reinicialización y destroy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  it('no duplica el botón de cierre al reinicializar y el botón sigue funcionando', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    getInstance(el).destroy();
    initAll();
    new Alert(el);
    const buttons = el.querySelectorAll('.mtx-alert__close');
    expect(buttons).toHaveLength(1);
    buttons[0].click();
    vi.advanceTimersByTime(250);
    expect(el.hidden).toBe(true);
  });

  it('destroy() durante el fundido de cierre aplica hidden', () => {
    const el = createAlert({ 'data-dismissible': '' });
    initAll();
    const alert = getInstance(el);
    alert.close();
    expect(el.hidden).toBe(false);
    alert.destroy();
    expect(el.hidden).toBe(true);
    vi.runAllTimers();
  });

  it('destroy() sin cierre pendiente no oculta la alerta', () => {
    const el = createAlert();
    initAll();
    getInstance(el).destroy();
    expect(el.hidden).toBe(false);
  });
});
