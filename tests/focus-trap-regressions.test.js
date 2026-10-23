import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initAll, getInstance } from '../src/core/registry.js';
import { getTabbable, trapTab } from '../src/core/focus-manager.js';
import '../src/components/popover/popover.js';
import '../src/components/drawer/drawer.js';
import '../src/components/dialog/dialog.js';
import '../src/components/date-time-picker/date-time-picker.js';

/** JSDOM no calcula layout: simula que todo elemento conectado es visible. */
function mockLayout() {
  const original = Element.prototype.getClientRects;
  Element.prototype.getClientRects = function getClientRects() {
    return this.isConnected ? [{ width: 1, height: 1 }] : [];
  };
  return () => { Element.prototype.getClientRects = original; };
}

/** Lanza un Tab sobre el contenedor y devuelve el evento. */
function pressTab(container, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
  trapTab(event, container);
  return event;
}

describe('trapTab (WebKit: Tab no enfoca enlaces por defecto)', () => {
  let restore;
  beforeEach(() => {
    restore = mockLayout();
    document.body.innerHTML = `
      <div id="panel" tabindex="-1">
        <button id="a">A</button>
        <a id="link" href="#x">Enlace</a>
        <button id="skip" tabindex="-1">Roving</button>
        <div inert><button id="inert">Inerte</button></div>
        <input type="radio" name="g" id="r1"><input type="radio" name="g" id="r2" checked>
        <button id="z">Z</button>
      </div>`;
  });
  afterEach(() => {
    restore();
    document.body.innerHTML = '';
  });

  it('getTabbable excluye tabindex=-1, inert y radios no activos de un grupo con selección', () => {
    const ids = getTabbable(document.getElementById('panel')).map((node) => node.id);
    expect(ids).toEqual(['a', 'link', 'r2', 'z']);
  });

  it('intercepta siempre Tab y mueve el foco explícitamente (incluye enlaces)', () => {
    const panel = document.getElementById('panel');
    document.getElementById('a').focus();
    const event = pressTab(panel);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement.id).toBe('link');
    pressTab(panel);
    expect(document.activeElement.id).toBe('r2');
    pressTab(panel);
    expect(document.activeElement.id).toBe('z');
    pressTab(panel);
    expect(document.activeElement.id).toBe('a');
    pressTab(panel, true);
    expect(document.activeElement.id).toBe('z');
  });

  it('desde el propio panel (no tabulable) va al primero o, con Shift, al último', () => {
    const panel = document.getElementById('panel');
    panel.focus();
    pressTab(panel);
    expect(document.activeElement.id).toBe('a');
    panel.focus();
    pressTab(panel, true);
    expect(document.activeElement.id).toBe('z');
  });
});

describe('Popover: retorno del foco al disparador (WebKit no enfoca botones al hacer clic)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <main id="main" tabindex="-1">
        <button id="trigger" data-open-popover="#pop">Abrir</button>
        <p id="text">Texto</p>
        <div data-mtx="popover" id="pop" data-label="Filtros"><button id="inside">Dentro</button></div>
      </main>`;
    initAll();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('si el clic deja el foco en un ancestro con tabindex=-1, Escape lo devuelve al disparador', () => {
    const trigger = document.getElementById('trigger');
    document.getElementById('main').focus();
    trigger.click();
    const instance = getInstance(document.getElementById('pop'));
    expect(instance.isOpen).toBe(true);
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('un clic fuera en una zona no enfocable devuelve el foco perdido al disparador', () => {
    const trigger = document.getElementById('trigger');
    trigger.click();
    const instance = getInstance(document.getElementById('pop'));
    expect(instance.isOpen).toBe(true);
    document.getElementById('text').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.activeElement.blur();
    vi.runOnlyPendingTimers();
    expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('un clic fuera sobre otro control no le roba el foco', () => {
    document.body.insertAdjacentHTML('beforeend', '<button id="other">Otro</button>');
    document.getElementById('trigger').click();
    const other = document.getElementById('other');
    other.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    other.focus();
    vi.runOnlyPendingTimers();
    expect(document.activeElement).toBe(other);
  });
});

describe('Drawer temporal: retorno del foco al disparador pulsado (WebKit)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('si el clic deja el foco en un ancestro con tabindex=-1, al cerrar vuelve al disparador', () => {
    document.body.innerHTML = `
      <main id="main" tabindex="-1">
        <button id="toggle" data-mtx-drawer-toggle="nav">Menú</button>
      </main>
      <div data-mtx="drawer" id="nav" aria-label="Navegación"><a href="#a">A</a></div>`;
    initAll();
    const toggle = document.getElementById('toggle');
    const instance = getInstance(document.getElementById('nav'));
    document.getElementById('main').focus();
    toggle.click();
    expect(instance.isOpen).toBe(true);
    instance.close('escapeKeyDown');
    expect(document.activeElement).toBe(toggle);
  });
});

describe('Dialog: retorno del foco al disparador pulsado (WebKit)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('si el clic deja el foco en un ancestro con tabindex=-1, Escape lo devuelve al botón', () => {
    document.body.innerHTML = `
      <main id="main" tabindex="-1">
        <button id="open" data-mtx-dialog-open="dlg">Abrir</button>
      </main>
      <div data-mtx="dialog" id="dlg" data-title="Hola"><button id="ok">OK</button></div>`;
    initAll();
    const trigger = document.getElementById('open');
    const instance = getInstance(document.getElementById('dlg'));
    document.getElementById('main').focus();
    trigger.click();
    expect(instance.isOpen).toBe(true);
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('con el foco en un control tabulable lo conserva como destino (apertura programática)', () => {
    document.body.innerHTML = `
      <button id="other">Otro</button>
      <div data-mtx="dialog" id="dlg" data-title="Hola"><button id="ok">OK</button></div>`;
    initAll();
    const other = document.getElementById('other');
    other.focus();
    const instance = getInstance(document.getElementById('dlg'));
    instance.open();
    instance.close();
    expect(document.activeElement).toBe(other);
  });
});

describe('DateTimePicker: retorno explícito del foco (WebKit)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('abierto con clic en el botón sin foco, Escape devuelve el foco al campo (nunca se pierde)', () => {
    document.body.innerHTML = '<main id="main" tabindex="-1"><input id="d" data-mtx="datepicker"></main>';
    initAll();
    const instance = getInstance(document.getElementById('d'));
    const button = instance._getToggleButton();
    expect(button).not.toBeNull();
    document.getElementById('main').focus();
    button.click();
    expect(instance._isOpen).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(instance._isOpen).toBe(false);
    expect(document.activeElement).toBe(document.getElementById('d'));
  });
});

describe('Raíces fijas: margin 0 frente a estilos ajenos', () => {
  const css = (path) => readFileSync(resolve(__dirname, '..', path), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  /** Devuelve el primer bloque de reglas cuyo selector empieza exactamente así. */
  const block = (source, selector) => {
    const start = source.indexOf(`${selector} {`);
    expect(start, selector).toBeGreaterThan(-1);
    return source.slice(start, source.indexOf('}', start));
  };

  it.each([
    ['src/components/dialog/dialog.css', '.mtx-dialog'],
    ['src/components/drawer/drawer.css', '[data-mtx="drawer"]'],
    ['src/components/drawer/drawer.css', '.mtx-drawer__backdrop'],
    ['src/components/backdrop/backdrop.css', '.mtx-backdrop'],
    ['src/components/snackbar/snackbar.css', '.mtx-snackbar'],
    ['src/components/menu/menu.css', '.mtx-menu__popper'],
    ['src/components/popover/popover.css', '.mtx-popover'],
    ['src/components/autocomplete/autocomplete.css', '.mtx-autocomplete__popper'],
    ['src/components/date-time-picker/date-time-picker.css', '.mtx-picker-backdrop'],
    ['src/components/date-time-picker/date-time-picker.css', '.mtx-picker-backdrop-mobile'],
  ])('%s %s fija margin: 0', (path, selector) => {
    expect(block(css(path), selector)).toMatch(/\bmargin:\s*0;/);
  });

  it('un submenú expandido hereda la visibilidad del drawer (no visible forzado)', () => {
    const rule = block(css('src/components/drawer/drawer.css'), '.mtx-collapse.mtx-collapse--open,\n.mtx-collapse:not([hidden])');
    expect(rule).toMatch(/visibility:\s*inherit;/);
  });
});
