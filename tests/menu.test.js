import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance, destroy, destroyAll } from '../src/core/registry.js';
import { Menu } from '../src/components/menu/menu.js';


function createMenuWithTrigger() {
  const btn = document.createElement('button');
  btn.id = 'triggerBtn';
  btn.textContent = 'Abrir Menú';
  btn.setAttribute('data-open-menu', '#myMenu');
  document.body.appendChild(btn);

  const menuEl = document.createElement('div');
  menuEl.id = 'myMenu';
  menuEl.className = 'mtx-menu';
  menuEl.setAttribute('data-mtx', 'menu');

  const item1 = document.createElement('div');
  item1.className = 'mtx-menu-item';
  item1.setAttribute('data-mtx', 'menu-item');
  item1.setAttribute('data-value', 'opcion1');
  item1.textContent = 'Opción 1';

  const item2 = document.createElement('div');
  item2.className = 'mtx-menu-item';
  item2.setAttribute('data-mtx', 'menu-item');
  item2.setAttribute('data-value', 'opcion2');
  item2.textContent = 'Opción 2';

  menuEl.appendChild(item1);
  menuEl.appendChild(item2);
  document.body.appendChild(menuEl);

  return { btn, menuEl, item1, item2 };
}

describe('Menu & MenuItem', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y vincula el disparador', () => {
    const { btn, menuEl } = createMenuWithTrigger();
    initAll();

    const menu = getInstance(menuEl);
    expect(menu).toBeInstanceOf(Menu);
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('abre y cierra al hacer clic en el disparador', () => {
    const { btn, menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);

    btn.click();
    expect(menu.isOpen).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');

    menu.close();
    expect(menu.isOpen).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('dispara el evento mtx:menu:select al hacer clic en una opción', () => {
    const { btn, menuEl, item1 } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);
    const selectSpy = vi.fn();
    menuEl.addEventListener('mtx:menu:select', selectSpy);

    menu.open();
    item1.click();

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(menu.isOpen).toBe(false);
  });

  it('permite alternar y reabrir en clics repetidos simulando mousedown y click', async () => {
    const { btn, menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);

    // Clic 1: Abrir
    btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.isOpen).toBe(true);

    // Clic 2: Cerrar por toggle en el mismo botón
    btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.isOpen).toBe(false);

    // Clic 3: Reabrir una segunda vez
    btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.isOpen).toBe(true);
  });

  it('permanece accesible en el DOM mediante getElementById incluso al estar cerrado', () => {
    const { menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);
    expect(document.getElementById('myMenu')).toBe(menuEl);
    expect(menu.isOpen).toBe(false);

    menu.open();
    expect(document.getElementById('myMenu')).toBe(menuEl);

    menu.close();
    expect(document.getElementById('myMenu')).toBe(menuEl);
  });

  it('reposiciona el menú al emitir eventos de scroll', () => {
    const { menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);

    menu.open();
    expect(menu.isOpen).toBe(true);

    const positionSpy = vi.spyOn(menu, '_position');
    window.dispatchEvent(new Event('scroll'));
    // En el siguiente tick de requestAnimationFrame
    expect(positionSpy).toBeDefined();
  });
});

describe('Menu — correcciones de plantillas (A12 y menu-item)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('no usa el hermano anterior como disparador implícito', () => {
    document.body.innerHTML = `
      <button id="sibling">Hermano</button>
      <div id="m" data-mtx="menu"><div data-mtx="menu-item">Uno</div></div>`;
    initAll();
    const menu = getInstance(document.getElementById('m'));
    expect(menu.triggers.length).toBe(0);
    expect(document.getElementById('sibling').hasAttribute('aria-haspopup')).toBe(false);
    document.getElementById('sibling').click();
    expect(menu.isOpen).toBe(false);
  });

  it('acepta data-mtx-menu-trigger y aria-controls y añade aria-controls al disparador', () => {
    document.body.innerHTML = `
      <button id="t1" data-mtx-menu-trigger="#m">A</button>
      <button id="t2" aria-controls="m">B</button>
      <div id="m" data-mtx="menu"><div data-mtx="menu-item">Uno</div></div>`;
    initAll();
    const menu = getInstance(document.getElementById('m'));
    const t1 = document.getElementById('t1');
    expect(menu.triggers).toContain(t1);
    expect(menu.triggers).toContain(document.getElementById('t2'));
    expect(t1.getAttribute('aria-controls')).toBe('m');
    t1.click();
    expect(menu.isOpen).toBe(true);
    expect(t1.getAttribute('aria-expanded')).toBe('true');
  });

  it('abre desde disparadores añadidos después de inicializar (delegación)', () => {
    document.body.innerHTML = '<div id="m" data-mtx="menu"><div data-mtx="menu-item">Uno</div></div>';
    initAll();
    const menu = getInstance(document.getElementById('m'));
    const late = document.createElement('button');
    late.setAttribute('data-open-menu', '#m');
    document.body.appendChild(late);
    late.click();
    expect(menu.isOpen).toBe(true);
    expect(late.getAttribute('aria-expanded')).toBe('true');
    expect(late.getAttribute('aria-haspopup')).toBe('menu');
    late.click();
    expect(menu.isOpen).toBe(false);
    expect(late.getAttribute('aria-expanded')).toBe('false');
  });

  it('data-divider genera un separador no enfocable (ni menuitem)', () => {
    document.body.innerHTML = `
      <button data-open-menu="#m">Abrir</button>
      <div id="m" data-mtx="menu">
        <div data-mtx="menu-item">Uno</div>
        <div id="d" data-mtx="menu-item" data-divider></div>
        <div data-mtx="menu-item">Dos</div>
      </div>`;
    initAll();
    const d = document.getElementById('d');
    expect(d.getAttribute('role')).toBe('separator');
    expect(d.classList.contains('mtx-menu-item')).toBe(false);
    expect(d.classList.contains('mtx-menu-item--divider')).toBe(true);
    expect(d.hasAttribute('tabindex')).toBe(false);
    expect(getInstance(document.getElementById('m')).menuItems.length).toBe(2);
  });

  it('data-icon genera .mtx-menu-item__icon sin estilos inline', () => {
    document.body.innerHTML = `
      <div id="m" data-mtx="menu"><div id="i" data-mtx="menu-item" data-icon="edit">Editar</div></div>`;
    initAll();
    const icon = document.querySelector('#i .mtx-menu-item__icon');
    expect(icon).not.toBeNull();
    expect(icon.querySelector('.material-icons').textContent).toBe('edit');
    expect(document.querySelector('#i [style]')).toBeNull();
    expect(document.querySelectorAll('#i .mtx-menu-item__icon').length).toBe(1);
  });

  it('alterna aria-checked en menuitemcheckbox y menuitemradio', () => {
    document.body.innerHTML = `
      <button data-open-menu="#m">Abrir</button>
      <div id="m" data-mtx="menu">
        <div id="c" data-mtx="menu-item" role="menuitemcheckbox">Regla</div>
        <div role="group">
          <div id="r1" data-mtx="menu-item" role="menuitemradio" data-checked>Lista</div>
          <div id="r2" data-mtx="menu-item" role="menuitemradio">Cuadrícula</div>
        </div>
      </div>`;
    initAll();
    const menuEl = document.getElementById('m');
    const menu = getInstance(menuEl);
    const details = [];
    menuEl.addEventListener('mtx:menu:select', (e) => details.push(e.detail));
    const c = document.getElementById('c');
    expect(c.getAttribute('aria-checked')).toBe('false');
    expect(c.querySelector('.mtx-menu-item__check')).not.toBeNull();
    menu.open();
    c.click();
    expect(c.getAttribute('aria-checked')).toBe('true');
    expect(details[0].checked).toBe(true);
    menu.open();
    c.click();
    expect(c.getAttribute('aria-checked')).toBe('false');
    menu.open();
    document.getElementById('r2').click();
    expect(document.getElementById('r2').getAttribute('aria-checked')).toBe('true');
    expect(document.getElementById('r1').getAttribute('aria-checked')).toBe('false');
    getInstance(document.getElementById('r1')).checked = true;
    expect(document.getElementById('r2').getAttribute('aria-checked')).toBe('false');
  });
});

describe('Menu — ciclo de vida, eventos y posicionamiento', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('emite open/select/close con bubbles y detail', () => {
    const { menuEl, item1 } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);
    const events = [];
    const names = ['mtx:menu:open', 'mtx:menu:select', 'mtx:menu:close'];
    const record = (e) => events.push([e.type, e.bubbles, e.cancelable, e.detail]);
    names.forEach((name) => document.addEventListener(name, record));
    menu.open();
    item1.click();
    names.forEach((name) => document.removeEventListener(name, record));
    expect(events.map((e) => e[0])).toEqual(['mtx:menu:open', 'mtx:menu:close', 'mtx:menu:select']);
    events.forEach((e) => {
      expect(e[1]).toBe(true);
      expect(e[2]).toBe(false);
    });
    expect(events[2][3].item).toBe(item1);
  });

  it('retira los listeners de ventana y documento al destruir el menú abierto', () => {
    const { menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);
    const removeWin = vi.spyOn(window, 'removeEventListener');
    const removeDoc = vi.spyOn(document, 'removeEventListener');
    menu.open();
    destroy(menuEl);
    expect(removeWin.mock.calls.some(([type]) => type === 'scroll')).toBe(true);
    expect(removeWin.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    expect(removeDoc.mock.calls.some(([type]) => type === 'keydown')).toBe(true);
    removeWin.mockRestore();
    removeDoc.mockRestore();
  });

  it('cancela los temporizadores de hover del submenú en destroy', () => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div id="root" data-mtx="menu">
        <div data-mtx="menu-item" data-submenu-trigger data-open-menu="#sub">Más</div>
      </div>
      <div id="sub" data-mtx="menu" data-submenu><div data-mtx="menu-item">Hijo</div></div>`;
    initAll();
    const sub = getInstance(document.getElementById('sub'));
    const openSpy = vi.spyOn(sub, 'open');
    sub.triggers[0].dispatchEvent(new MouseEvent('mouseenter'));
    destroy(document.getElementById('sub'));
    vi.advanceTimersByTime(200);
    expect(openSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('createContextMenu genera ids únicos con uniqueId', () => {
    document.body.innerHTML = '<div class="area"></div>';
    const items = [{ label: 'Uno' }, { label: 'Dos', submenu: [{ label: 'Tres' }] }];
    const a = Menu.createContextMenu('.area', items);
    const b = Menu.createContextMenu('.area', items);
    expect(a.element.id).toMatch(/^mtx-context-menu-\d+$/);
    expect(a.element.id).not.toBe(b.element.id);
    const values = Array.from(document.querySelectorAll('[data-value]')).map((el) => el.getAttribute('data-value'));
    expect(new Set(values).size).toBe(values.length);
  });

  it('posiciona con position.js sin z-index inline', () => {
    const { btn, menuEl } = createMenuWithTrigger();
    btn.getBoundingClientRect = () => ({ left: 10, top: 10, right: 110, bottom: 50, width: 100, height: 40 });
    initAll();
    const menu = getInstance(menuEl);
    menu.open(btn);
    expect(menu.container.style.position).toBe('fixed');
    expect(menu.container.style.top).toBe('54px');
    expect(menu.container.style.zIndex).toBe('');
    expect(menu.container.dataset.placement).toBe('bottom');
    menu.close({ restoreFocus: false });
  });
});

describe('Menu — re-instanciación, transición y RTL', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
  });

  it('new Menu(el) dos veces conserva el marcador y destroyAll(section) destruye la nueva', () => {
    document.body.innerHTML = `
      <section id="s">
        <button data-open-menu="#m">Abrir</button>
        <div id="m" data-mtx="menu"><div data-mtx="menu-item">Uno</div></div>
      </section>`;
    const section = document.getElementById('s');
    const el = document.getElementById('m');
    const first = new Menu(el);
    const second = new Menu(el);
    expect(first.destroyed).toBe(true);
    expect(getInstance(el)).toBe(second);
    const comments = Array.from(section.childNodes).filter((n) => n.nodeType === 8);
    expect(comments.length).toBe(1);
    expect(second._placeholder).toBe(comments[0]);
    expect(second.container.isConnected).toBe(true);
    destroyAll(section);
    expect(second.destroyed).toBe(true);
  });

  it('close() cancela la transición grow en curso', () => {
    vi.useFakeTimers();
    const { menuEl } = createMenuWithTrigger();
    initAll();
    const menu = getInstance(menuEl);
    menu.open();
    menu.close({ restoreFocus: false });
    vi.advanceTimersByTime(300);
    expect(menu.container.classList.contains('mtx-transition--entered')).toBe(false);
    expect(menu.container.classList.contains('mtx-transition--entering')).toBe(false);
    vi.useRealTimers();
  });

  it('submenú en contenedor dir="rtl" se abre a la izquierda aunque esté en el portal', () => {
    document.body.innerHTML = `
      <div dir="rtl">
        <button id="t" data-open-menu="#root">Abrir</button>
        <div id="root" data-mtx="menu">
          <div id="more" data-mtx="menu-item" data-submenu-trigger data-open-menu="#sub">Más</div>
        </div>
        <div id="sub" data-mtx="menu" data-submenu><div data-mtx="menu-item">Hijo</div></div>
      </div>`;
    initAll();
    const root = getInstance(document.getElementById('root'));
    const sub = getInstance(document.getElementById('sub'));
    const trigger = document.getElementById('t');
    const more = document.getElementById('more');
    trigger.getBoundingClientRect = () => ({ left: 400, top: 10, right: 500, bottom: 50, width: 100, height: 40 });
    more.getBoundingClientRect = () => ({ left: 400, top: 60, right: 520, bottom: 100, width: 120, height: 40 });
    root.open(trigger);
    expect(root.container.getAttribute('dir')).toBe('rtl');
    sub.open(more, { focusFirstItem: false });
    expect(sub.container.getAttribute('dir')).toBe('rtl');
    expect(sub.container.dataset.placement).toBe('left');
  });
});
