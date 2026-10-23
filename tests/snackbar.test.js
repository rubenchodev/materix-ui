import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Snackbar } from '../src/components/snackbar/snackbar.js';

function createSnackbar(attrs = {}, messageText = 'Notificación guardada') {
  const el = document.createElement('div');
  el.className = 'mtx-snackbar';
  el.setAttribute('data-mtx', 'snackbar');
  if (messageText) el.setAttribute('data-message', messageText);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  document.body.appendChild(el);
  return el;
}

describe('Snackbar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  it('se inicializa y crea la estructura del mensaje', () => {
    const el = createSnackbar();
    initAll();
    const snackbar = getInstance(el);
    expect(snackbar).toBeInstanceOf(Snackbar);
    expect(el.querySelector('.mtx-snackbar__message').textContent).toBe('Notificación guardada');
  });

  it('se abre y emite evento mtx:snackbar:open', () => {
    const el = createSnackbar();
    initAll();
    const snackbar = getInstance(el);
    const openSpy = vi.fn();
    el.addEventListener('mtx:snackbar:open', openSpy);

    snackbar.open();
    expect(snackbar.isOpen).toBe(true);
    expect(el.classList.contains('mtx-snackbar--open')).toBe(true);
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('se cierra automáticamente después de la duración configurada', () => {
    const el = createSnackbar({ 'data-duration': '3000' });
    initAll();
    const snackbar = getInstance(el);
    const closeSpy = vi.fn();
    el.addEventListener('mtx:snackbar:close', closeSpy);

    snackbar.open();
    vi.advanceTimersByTime(3100);

    expect(snackbar.isOpen).toBe(false);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('cierra con la tecla Escape', () => {
    const el = createSnackbar();
    initAll();
    const snackbar = getInstance(el);

    snackbar.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(snackbar.isOpen).toBe(false);
  });

  it('limpia timers y eventos en destroy()', () => {
    const el = createSnackbar({ 'data-duration': '3000' });
    initAll();
    const snackbar = getInstance(el);
    snackbar.open();

    snackbar.destroy();
    expect(snackbar.isOpen).toBe(false);
  });
});

describe('Snackbar — A19 (API de contenido, Escape y helper)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  it('setMessage() cambia el texto y crea el nodo si falta', () => {
    const el = createSnackbar({}, '');
    initAll();
    const sb = getInstance(el);
    expect(sb.setMessage('Saved')).toBe(sb);
    const msg = el.querySelector('.mtx-snackbar__message');
    expect(msg.textContent).toBe('Saved');
    expect(msg.getAttribute('role')).toBe('alert');
  });

  it('open({ message, action, duration }) actualiza el contenido y usa la duración solo en esa apertura', () => {
    const el = createSnackbar({ 'data-duration': '10000' });
    initAll();
    const sb = getInstance(el);
    sb.open({ message: 'File deleted', action: 'Undo', duration: 1000 });
    expect(el.querySelector('.mtx-snackbar__message').textContent).toBe('File deleted');
    expect(el.querySelector('.mtx-snackbar__action').textContent).toBe('Undo');
    vi.advanceTimersByTime(1100);
    expect(sb.isOpen).toBe(false);

    sb.open({ action: null });
    expect(el.querySelector('.mtx-snackbar__action').hidden).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(sb.isOpen).toBe(true);
  });

  it('onAction se ejecuta, emite mtx:snackbar:action y cierra con reason "action"', () => {
    const el = createSnackbar();
    initAll();
    const sb = getInstance(el);
    const onAction = vi.fn();
    const actionSpy = vi.fn();
    const closeSpy = vi.fn();
    el.addEventListener('mtx:snackbar:action', actionSpy);
    el.addEventListener('mtx:snackbar:close', closeSpy);
    sb.open({ message: 'Archived', action: 'Undo', onAction });
    el.querySelector('.mtx-snackbar__action').click();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0][0].detail.reason).toBe('action');
  });

  it('Escape no cierra el snackbar si hay un modal abierto encima (pila de capas)', async () => {
    const { pushLayer, removeLayer } = await import('../src/core/layers.js');
    const el = createSnackbar();
    initAll();
    const sb = getInstance(el);
    sb.open();
    const modal = { name: 'modal' };
    const onEscape = vi.fn();
    pushLayer(modal, { kind: 'modal', onEscape });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(sb.isOpen).toBe(true);
    removeLayer(modal);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(sb.isOpen).toBe(false);
  });

  it('Escape ya gestionado (defaultPrevented) no cierra el snackbar', () => {
    const el = createSnackbar();
    initAll();
    const sb = getInstance(el);
    sb.open();
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);
    expect(sb.isOpen).toBe(true);
  });

  it('con varios abiertos, Escape cierra solo el más reciente', () => {
    const a = createSnackbar({}, 'A');
    const b = createSnackbar({}, 'B');
    initAll();
    getInstance(a).open();
    getInstance(b).open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(getInstance(b).isOpen).toBe(false);
    expect(getInstance(a).isOpen).toBe(true);
  });

  it('el anclaje se valida y se puede cambiar', () => {
    const el = createSnackbar({ 'data-anchor': 'top-right' });
    initAll();
    const sb = getInstance(el);
    expect(el.classList.contains('mtx-snackbar--top-right')).toBe(true);
    sb.anchor = 'bottom-left';
    expect(el.classList.contains('mtx-snackbar--top-right')).toBe(false);
    expect(el.classList.contains('mtx-snackbar--bottom-left')).toBe(true);
  });

  it('showSnackbar() crea un snackbar compartido y lo reutiliza', async () => {
    const { showSnackbar } = await import('../src/components/snackbar/snackbar.js');
    const first = showSnackbar({ message: 'Saved', duration: 2000 });
    const second = showSnackbar('Copied');
    expect(first).toBe(second);
    expect(document.querySelectorAll('.mtx-snackbar').length).toBe(1);
    expect(first.element.querySelector('.mtx-snackbar__message').textContent).toBe('Copied');
    expect(first.element.querySelector('.mtx-snackbar__message').getAttribute('role')).toBe('status');
    vi.advanceTimersByTime(4100);
    expect(first.isOpen).toBe(false);
  });

  it('usa tokens de color (sin #fff fijo)', () => {
    const css = readFileSync('src/components/snackbar/snackbar.css', 'utf8');
    expect(css).toContain('var(--mtx-snackbar-bg)');
    expect(css).not.toMatch(/color:\s*#fff/);
  });
});
