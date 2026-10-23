import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance, watch, destroyAll } from '../src/core/registry.js';
import {
  pushLayer,
  removeLayer,
  isTopLayer,
  getTopLayer,
  isInUpperLayer,
  isEscapeHandled,
  layerCount,
} from '../src/core/layers.js';
import { uniqueId } from '../src/core/id.js';
import '../src/components/dialog/dialog.js';
import '../src/components/popover/popover.js';
import '../src/components/menu/menu.js';
import '../src/components/drawer/drawer.js';
import '../src/components/accordion/accordion.js';
import '../src/components/snackbar/snackbar.js';
import '../src/components/date-time-picker/date-time-picker.js';
import { tooltip } from '../src/components/tooltip/tooltip.js';

/** Pulsa Escape sobre el elemento activo (burbujea hasta `document`). */
function pressEscape(target = document.activeElement || document.body) {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

/** Espera a que se procesen los MutationObserver. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Pila de capas (src/core/layers.js)', () => {
  afterEach(() => {
    ['a', 'b', 'c', 't', 's'].forEach((key) => removeLayer(owners[key]));
  });
  const owners = { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' }, t: { id: 't' }, s: { id: 's' } };

  it('la última capa abierta es la superior y Escape solo la cierra a ella', () => {
    const closeA = vi.fn();
    const closeB = vi.fn(() => removeLayer(owners.b));
    pushLayer(owners.a, { onEscape: closeA });
    pushLayer(owners.b, { onEscape: closeB });
    expect(isTopLayer(owners.b)).toBe(true);
    expect(isTopLayer(owners.a)).toBe(false);
    const event = pressEscape(document.body);
    expect(closeB).toHaveBeenCalledTimes(1);
    expect(closeA).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    expect(isEscapeHandled(event)).toBe(true);
    expect(getTopLayer()).toBe(owners.a);
  });

  it('un tooltip visible recibe Escape primero pero no bloquea isTopLayer de las demás', () => {
    const closeA = vi.fn();
    const closeT = vi.fn(() => removeLayer(owners.t));
    pushLayer(owners.a, { kind: 'modal', onEscape: closeA });
    pushLayer(owners.t, { kind: 'tooltip', onEscape: closeT });
    pushLayer(owners.b, { kind: 'popup', onEscape: () => {} });
    // El tooltip se abrió antes que b, pero tiene prioridad para Escape.
    expect(getTopLayer()).toBe(owners.t);
    expect(isTopLayer(owners.b)).toBe(true);
    pressEscape(document.body);
    expect(closeT).toHaveBeenCalledTimes(1);
    expect(closeA).not.toHaveBeenCalled();
  });

  it('un snackbar solo recibe Escape cuando no hay otras capas', () => {
    const closeS = vi.fn();
    pushLayer(owners.s, { kind: 'snackbar', onEscape: closeS });
    pushLayer(owners.a, { kind: 'modal', onEscape: () => removeLayer(owners.a) });
    pressEscape(document.body);
    expect(closeS).not.toHaveBeenCalled();
    pressEscape(document.body);
    expect(closeS).toHaveBeenCalledTimes(1);
  });

  it('respeta un Escape ya cancelado por el consumidor (preventDefault)', () => {
    const closeA = vi.fn();
    pushLayer(owners.a, { onEscape: closeA });
    const stop = (event) => event.preventDefault();
    document.body.addEventListener('keydown', stop);
    pressEscape(document.body);
    document.body.removeEventListener('keydown', stop);
    expect(closeA).not.toHaveBeenCalled();
  });

  it('isInUpperLayer detecta nodos de capas abiertas después y retira capas desconectadas', () => {
    const lower = document.createElement('div');
    const upper = document.createElement('div');
    const inner = document.createElement('button');
    upper.appendChild(inner);
    document.body.append(lower, upper);
    pushLayer(owners.a, { nodes: lower });
    pushLayer(owners.b, { nodes: upper });
    expect(isInUpperLayer(owners.a, inner)).toBe(true);
    expect(isInUpperLayer(owners.b, lower)).toBe(false);
    upper.remove();
    expect(getTopLayer()).toBe(owners.a);
    expect(layerCount()).toBe(1);
    lower.remove();
  });
});

describe('Escape en capas: integración', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    tooltip.hideAll();
    document.body.innerHTML = '';
  });

  it('dialog → popover dentro → tooltip visible: tres Escape cierran tooltip, popover y dialog', () => {
    document.body.innerHTML = `
      <div data-mtx="dialog" id="dlg" data-title="Filtros">
        <button id="open-pop" data-open-popover="#pop">Opciones</button>
      </div>
      <div data-mtx="popover" id="pop" data-label="Opciones">
        <button id="tip" data-mtx-tooltip="Ayuda">Aplicar</button>
      </div>`;
    initAll();
    const dialog = getInstance(document.getElementById('dlg'));
    const popover = getInstance(document.getElementById('pop'));
    dialog.open();
    document.getElementById('open-pop').focus();
    document.getElementById('open-pop').click();
    expect(popover.isOpen).toBe(true);
    const tipTarget = document.getElementById('tip');
    tooltip.show(tipTarget);
    expect(tooltip.get(tipTarget).isOpen).toBe(true);

    pressEscape(tipTarget);
    expect(tooltip.get(tipTarget).isOpen).toBe(false);
    expect(popover.isOpen).toBe(true);
    expect(dialog.isOpen).toBe(true);

    pressEscape(tipTarget);
    expect(popover.isOpen).toBe(false);
    expect(dialog.isOpen).toBe(true);
    // El foco vuelve al disparador dentro del diálogo.
    expect(document.activeElement).toBe(document.getElementById('open-pop'));

    pressEscape(document.activeElement);
    expect(dialog.isOpen).toBe(false);
  });

  it('menú dentro de un dialog: Escape cierra el menú y después el dialog', () => {
    document.body.innerHTML = `
      <div data-mtx="dialog" id="dlg" data-title="Acciones">
        <button id="menu-btn" data-open-menu="#menu">Más</button>
        <div data-mtx="menu" id="menu">
          <div data-mtx="menu-item">Copiar</div>
          <div data-mtx="menu-item">Pegar</div>
        </div>
      </div>`;
    initAll();
    const dialog = getInstance(document.getElementById('dlg'));
    const menu = getInstance(document.getElementById('menu'));
    dialog.open();
    document.getElementById('menu-btn').click();
    expect(menu.isOpen).toBe(true);
    // El foco en el menú portado no lo devuelve el focus-trap del diálogo.
    const item = menu.menuItems[0];
    item.focus();
    expect(document.activeElement).toBe(item);

    pressEscape(item);
    expect(menu.isOpen).toBe(false);
    expect(dialog.isOpen).toBe(true);
    expect(document.activeElement).toBe(document.getElementById('menu-btn'));

    pressEscape(document.activeElement);
    expect(dialog.isOpen).toBe(false);
  });

  it('drawer temporal + menú: clic en el menú no cierra el drawer y Escape va por capas', () => {
    document.body.innerHTML = `
      <div data-mtx="drawer" id="drw">
        <button id="menu-btn" data-open-menu="#menu">Más</button>
        <div data-mtx="menu" id="menu"><div data-mtx="menu-item">Uno</div></div>
      </div>`;
    initAll();
    const drawer = getInstance(document.getElementById('drw'));
    const menu = getInstance(document.getElementById('menu'));
    drawer.open();
    document.getElementById('menu-btn').click();
    menu.menuItems[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(drawer.isOpen).toBe(true);
    pressEscape(menu.menuItems[0]);
    expect(menu.isOpen).toBe(false);
    expect(drawer.isOpen).toBe(true);
    pressEscape(document.activeElement || document.body);
    expect(drawer.isOpen).toBe(false);
  });

  it('snackbar abierto bajo un dialog: Escape cierra antes el dialog', () => {
    document.body.innerHTML = `
      <div data-mtx="snackbar" id="sb" data-message="Guardado"></div>
      <div data-mtx="dialog" id="dlg" data-title="Editar"><button>Ok</button></div>`;
    initAll();
    const snack = getInstance(document.getElementById('sb'));
    const dialog = getInstance(document.getElementById('dlg'));
    dialog.open();
    snack.open();
    pressEscape(document.body);
    expect(dialog.isOpen).toBe(false);
    expect(snack.isOpen).toBe(true);
    pressEscape(document.body);
    expect(snack.isOpen).toBe(false);
  });
});

describe('Dialog abierto desde un Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('el popover sigue abierto al interactuar con el dialog y el foco vuelve a su botón', () => {
    document.body.innerHTML = `
      <button id="trigger" data-open-popover="#pop">Filtros</button>
      <div data-mtx="popover" id="pop" data-label="Filtros">
        <button id="open-dlg" data-mtx-dialog-open="dlg">Avanzado…</button>
      </div>
      <div data-mtx="dialog" id="dlg" data-title="Avanzado">
        <input id="field" type="text">
        <button id="dlg-close" data-mtx-dialog-close>Cerrar</button>
      </div>`;
    initAll();
    const popover = getInstance(document.getElementById('pop'));
    const dialog = getInstance(document.getElementById('dlg'));
    document.getElementById('trigger').click();
    expect(popover.isOpen).toBe(true);

    const openBtn = document.getElementById('open-dlg');
    openBtn.focus();
    openBtn.click();
    expect(dialog.isOpen).toBe(true);
    expect(isTopLayer(dialog)).toBe(true);
    // Queda por encima del popover portado (mismo z-index base, posterior en el DOM).
    expect(dialog.element.style.zIndex).toBe('calc(var(--mtx-z-index-modal, 1300) + 2)');

    // Interactuar con el dialog (portado o no) no es "clic fuera" del popover.
    const field = document.getElementById('field');
    field.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    field.focus();
    // Tab dentro del dialog no cierra el popover (no es su capa superior).
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    vi.runOnlyPendingTimers();
    expect(popover.isOpen).toBe(true);

    pressEscape(field);
    expect(dialog.isOpen).toBe(false);
    expect(dialog.element.style.zIndex).toBe('');
    expect(popover.isOpen).toBe(true);
    expect(document.activeElement).toBe(openBtn);

    pressEscape(openBtn);
    expect(popover.isOpen).toBe(false);
  });

  it('cerrar el dialog con su botón deja el popover abierto', () => {
    document.body.innerHTML = `
      <button id="trigger" data-open-popover="#pop">Filtros</button>
      <div data-mtx="popover" id="pop" data-label="Filtros">
        <button id="open-dlg" data-mtx-dialog-open="dlg">Avanzado…</button>
      </div>
      <div data-mtx="dialog" id="dlg" data-title="Avanzado">
        <button id="dlg-close" data-mtx-dialog-close>Cerrar</button>
      </div>`;
    initAll();
    const popover = getInstance(document.getElementById('pop'));
    const dialog = getInstance(document.getElementById('dlg'));
    document.getElementById('trigger').click();
    document.getElementById('open-dlg').click();
    const close = document.getElementById('dlg-close');
    close.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    close.click();
    expect(dialog.isOpen).toBe(false);
    expect(popover.isOpen).toBe(true);
  });
});

describe('Split button: menú anclado al grupo', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('data-position-anchor posiciona respecto del grupo sin convertirlo en disparador', () => {
    document.body.innerHTML = `
      <div id="group"><button id="main">Merge</button><button id="arrow" data-open-menu="#menu">▼</button></div>
      <div data-mtx="menu" id="menu" data-position-anchor="#group"><div data-mtx="menu-item">Squash</div></div>`;
    initAll();
    const group = document.getElementById('group');
    const arrow = document.getElementById('arrow');
    const rect = (left, width) => () => ({ left, right: left + width, top: 100, bottom: 140, width, height: 40, x: left, y: 100 });
    group.getBoundingClientRect = rect(20, 220);
    arrow.getBoundingClientRect = rect(200, 40);
    const menu = getInstance(document.getElementById('menu'));
    expect(menu._getPositionAnchor()).toBe(group);

    document.getElementById('main').click();
    expect(menu.isOpen).toBe(false);

    arrow.click();
    expect(menu.isOpen).toBe(true);
    expect(parseFloat(menu.container.style.left)).toBe(20);
    expect(arrow.getAttribute('aria-expanded')).toBe('true');
    menu.close();
    expect(document.activeElement).toBe(arrow);
  });

  it('open(trigger, { anchorEl }) ancla solo esa apertura', () => {
    document.body.innerHTML = `
      <div id="box"></div><button id="btn">Abrir</button>
      <div data-mtx="menu" id="menu"><div data-mtx="menu-item">Uno</div></div>`;
    initAll();
    const menu = getInstance(document.getElementById('menu'));
    const box = document.getElementById('box');
    const btn = document.getElementById('btn');
    menu.open(btn, { anchorEl: box });
    expect(menu._getPositionAnchor()).toBe(box);
    menu.close();
    menu.open(btn);
    expect(menu._getPositionAnchor()).toBe(btn);
    menu.close();
  });
});

describe('SPA: watch({ destroyOnRemove }) con superficies portadas', () => {
  let observer;
  afterEach(() => {
    if (observer) observer.disconnect();
    observer = null;
    tooltip.hideAll();
    document.body.innerHTML = '';
  });

  it('destruye el Menu portado al eliminar su ubicación original', async () => {
    document.body.innerHTML = `<div id="app"><section id="view">
      <button id="menu-btn" data-open-menu="#menu">Más</button>
      <div data-mtx="menu" id="menu"><div data-mtx="menu-item">Uno</div></div>
    </section></div>`;
    initAll();
    const menuEl = document.getElementById('menu');
    const menu = getInstance(menuEl);
    expect(menuEl.closest('#mtx-portal')).not.toBeNull();
    observer = watch(document.getElementById('app'), { destroyOnRemove: true });
    document.getElementById('menu-btn').click();
    expect(menu.isOpen).toBe(true);
    document.getElementById('view').remove();
    await flush();
    expect(menu.destroyed).toBe(true);
    expect(menu.container.isConnected).toBe(false);
    expect(getInstance(menuEl)).toBeUndefined();
    expect(getTopLayer()).toBeNull();
  });

  it('destruye el Popover portado (abierto) al eliminar su ubicación original', async () => {
    document.body.innerHTML = `<div id="app"><section id="view">
      <button id="trigger" data-open-popover="#pop">Abrir</button>
      <div data-mtx="popover" id="pop" data-label="Pop"><button>Dentro</button></div>
    </section></div>`;
    initAll();
    const pop = document.getElementById('pop');
    const instance = getInstance(pop);
    observer = watch(document.getElementById('app'), { destroyOnRemove: true });
    document.getElementById('trigger').click();
    expect(pop.parentElement).toBe(document.body);
    document.getElementById('view').remove();
    await flush();
    expect(instance.destroyed).toBe(true);
    expect(pop.isConnected).toBe(false);
  });

  it('destroyAll(contenedor) también alcanza menús portados', () => {
    document.body.innerHTML = `<section id="view">
      <div data-mtx="menu" id="menu"><div data-mtx="menu-item">Uno</div></div>
    </section>`;
    initAll();
    const menu = getInstance(document.getElementById('menu'));
    destroyAll(document.getElementById('view'));
    expect(menu.destroyed).toBe(true);
    expect(menu.container.isConnected).toBe(false);
  });

  it('cierra el tooltip portado cuando su disparador sale del DOM', async () => {
    document.body.innerHTML = '<div id="app"><button id="tip" data-mtx-tooltip="Ayuda">?</button></div>';
    const target = document.getElementById('tip');
    tooltip.show(target);
    const popup = tooltip.get(target).popup;
    expect(popup.isConnected).toBe(true);
    target.remove();
    await flush();
    expect(popup.isConnected).toBe(false);
  });

  it('destruye el DateTimePicker modal y retira su backdrop portado', async () => {
    document.body.innerHTML = `<div id="app"><section id="view">
      <input data-mtx="date-picker" data-display="modal" id="date">
    </section></div>`;
    initAll();
    const input = document.getElementById('date');
    const picker = getInstance(input);
    expect(picker).toBeTruthy();
    const backdrop = picker._backdrop;
    expect(backdrop.isConnected).toBe(true);
    observer = watch(document.getElementById('app'), { destroyOnRemove: true });
    document.getElementById('view').remove();
    await flush();
    expect(picker.destroyed).toBe(true);
    expect(backdrop.isConnected).toBe(false);
  });
});

describe('Ids generados con uniqueId()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Accordion y Drawer no colisionan con ids existentes', () => {
    // Ocupa el siguiente id que daría el contador global.
    const probe = uniqueId('mtx-accordion');
    const next = Number(probe.split('-').pop()) + 1;
    document.body.innerHTML = `
      <div id="mtx-accordion-${next}"></div>
      <div data-mtx="accordion" data-summary="Uno">Contenido</div>
      <div data-mtx="accordion" data-summary="Dos">Contenido</div>
      <div data-mtx="drawer" data-title="Menú"></div>
      <div data-mtx="drawer" data-title="Ajustes"></div>`;
    initAll();
    const ids = Array.from(document.querySelectorAll('[id]')).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(document.getElementById(`mtx-accordion-${next}-summary`)).toBeNull();
  });
});
