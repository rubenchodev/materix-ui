import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { Backdrop } from '../src/components/backdrop/backdrop.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.getElementById('bd');
}

describe('Backdrop', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('se inicializa cerrado, oculto y con aria-hidden', () => {
    const el = mount('<div data-mtx="backdrop" id="bd"><span>Cargando</span></div>');
    const bd = getInstance(el);
    expect(bd).toBeInstanceOf(Backdrop);
    expect(el.classList.contains('mtx-backdrop')).toBe(true);
    expect(el.hidden).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(bd.isOpen).toBe(false);
  });

  it('open/close/toggle emiten eventos y gestionan estado', () => {
    const el = mount('<div data-mtx="backdrop" id="bd"></div>');
    const bd = getInstance(el);
    const onOpen = vi.fn();
    const onClose = vi.fn();
    el.addEventListener('mtx:backdrop:open', onOpen);
    el.addEventListener('mtx:backdrop:close', onClose);
    bd.open();
    expect(el.hidden).toBe(false);
    expect(el.classList.contains('mtx-backdrop--open')).toBe(true);
    expect(el.hasAttribute('aria-hidden')).toBe(false);
    expect(onOpen).toHaveBeenCalledTimes(1);
    bd.open();
    expect(onOpen).toHaveBeenCalledTimes(1);
    bd.toggle();
    expect(bd.isOpen).toBe(false);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(onClose.mock.calls[0][0].detail).toEqual({ reason: 'api' });
    bd.toggle();
    expect(bd.isOpen).toBe(true);
  });

  it('data-open lo abre al iniciar; data-invisible y data-z', () => {
    const el = mount('<div data-mtx="backdrop" id="bd" data-open data-invisible data-z="2000"></div>');
    expect(getInstance(el).isOpen).toBe(true);
    expect(el.classList.contains('mtx-backdrop--invisible')).toBe(true);
    expect(el.style.zIndex).toBe('2000');
  });

  it('data-close-on-click cierra con clic en la capa pero no en controles del contenido', () => {
    const el = mount('<div data-mtx="backdrop" id="bd" data-close-on-click><button id="b">Cancelar</button><span id="s">Texto</span></div>');
    const bd = getInstance(el);
    const onClose = vi.fn();
    el.addEventListener('mtx:backdrop:close', onClose);
    bd.open();
    document.getElementById('b').click();
    expect(bd.isOpen).toBe(true);
    document.getElementById('s').click();
    expect(bd.isOpen).toBe(false);
    expect(onClose.mock.calls[0][0].detail.reason).toBe('click');
  });

  it('sin data-close-on-click el clic no cierra; data-mtx-backdrop-close sí', () => {
    const el = mount('<div data-mtx="backdrop" id="bd"><button data-mtx-backdrop-close id="c">Cerrar</button></div>');
    const bd = getInstance(el);
    bd.open();
    el.click();
    expect(bd.isOpen).toBe(true);
    document.getElementById('c').click();
    expect(bd.isOpen).toBe(false);
  });

  it('Escape solo cierra con data-close-on-escape', () => {
    const el = mount('<div data-mtx="backdrop" id="bd" data-close-on-escape></div>');
    const bd = getInstance(el);
    bd.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(bd.isOpen).toBe(false);

    const other = mount('<div data-mtx="backdrop" id="bd"></div>');
    getInstance(other).open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(getInstance(other).isOpen).toBe(true);
    getInstance(other).destroy();
  });

  it('data-lock-scroll bloquea el scroll del body y lo restaura', () => {
    const el = mount('<div data-mtx="backdrop" id="bd" data-lock-scroll></div>');
    const bd = getInstance(el);
    bd.open();
    expect(document.body.style.overflow).toBe('hidden');
    bd.close();
    expect(document.body.style.overflow).toBe('');
  });

  it('data-inert marca el resto de la página y lo restaura al cerrar', () => {
    document.body.innerHTML = '<main id="m"><button>X</button></main><div id="already" inert></div><div data-mtx="backdrop" id="bd" data-inert></div>';
    initAll();
    const bd = getInstance(document.getElementById('bd'));
    bd.open();
    expect(document.getElementById('m').hasAttribute('inert')).toBe(true);
    expect(document.getElementById('bd').hasAttribute('inert')).toBe(false);
    bd.close();
    expect(document.getElementById('m').hasAttribute('inert')).toBe(false);
    expect(document.getElementById('already').hasAttribute('inert')).toBe(true);
  });

  it('el disparador data-mtx-backdrop-open alterna el backdrop', () => {
    document.body.innerHTML = '<button id="t" data-mtx-backdrop-open="#bd">Abrir</button><div data-mtx="backdrop" id="bd"></div>';
    initAll();
    const bd = getInstance(document.getElementById('bd'));
    document.getElementById('t').click();
    expect(bd.isOpen).toBe(true);
    bd.close();
  });

  it('destroy() libera listeners y el bloqueo de scroll', () => {
    const el = mount('<div data-mtx="backdrop" id="bd" data-lock-scroll data-close-on-escape></div>');
    const bd = getInstance(el);
    bd.open();
    destroy(el);
    expect(document.body.style.overflow).toBe('');
    expect(el.hasAttribute('data-mtx-initialized')).toBe(false);
  });
});
