import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/drawer/drawer.js';
import '../src/components/app-bar/app-bar.js';

/**
 * Crea un matchMedia controlable para simular el cruce de breakpoint.
 * @param {boolean} initial Estado inicial de la media query.
 * @returns {{set: Function, queries: string[]}} Control del mock.
 */
function mockMatchMedia(initial) {
  const lists = [];
  const queries = [];
  window.matchMedia = vi.fn((query) => {
    queries.push(query);
    const listeners = new Set();
    const mql = {
      matches: initial,
      media: query,
      addEventListener: (type, fn) => listeners.add(fn),
      removeEventListener: (type, fn) => listeners.delete(fn),
      listeners,
    };
    lists.push(mql);
    return mql;
  });
  return {
    queries,
    set(value) {
      lists.forEach((mql) => {
        mql.matches = value;
        mql.listeners.forEach((fn) => fn({ matches: value }));
      });
    },
  };
}

/**
 * Monta el app shell de referencia y devuelve el drawer y su disparador.
 * @param {string} [attrs] Atributos extra del drawer.
 * @returns {{el: HTMLElement, drawer: object, trigger: HTMLElement}} Piezas del shell.
 */
function shell(attrs = '') {
  document.body.innerHTML = `
    <header data-mtx="app-bar" data-position="fixed" data-color="primary">
      <button id="menu-btn" data-mtx-drawer-toggle="app-nav" aria-label="Open navigation">menu</button>
      <span class="mtx-toolbar__title">App</span>
    </header>
    <div>
      <div data-mtx="drawer" id="app-nav" data-variant="responsive" data-clipped aria-label="Main" ${attrs}>
        <nav aria-label="Main navigation"><a href="#a" id="link-a">A</a><a href="#b">B</a></nav>
      </div>
      <main><div class="mtx-toolbar-offset"></div></main>
    </div>`;
  initAll();
  const el = document.getElementById('app-nav');
  return { el, drawer: getInstance(el), trigger: document.getElementById('menu-btn') };
}

describe('Drawer responsive (temporary < breakpoint, permanent >= breakpoint)', () => {
  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('usa md (900px) por defecto y data-breakpoint para sm/lg/xl', () => {
    const mm = mockMatchMedia(false);
    shell();
    expect(mm.queries).toContain('(min-width: 900px)');
    document.body.innerHTML = '<div data-mtx="drawer" id="x" data-variant="responsive" data-breakpoint="lg"></div>';
    initAll();
    expect(mm.queries).toContain('(min-width: 1200px)');
  });

  it('en escritorio arranca permanente: abierto, role navigation, sin diálogo y trigger oculto', () => {
    mockMatchMedia(true);
    const { el, drawer, trigger } = shell();
    expect(drawer.mode).toBe('permanent');
    expect(el.classList.contains('mtx-drawer--responsive')).toBe(true);
    expect(el.classList.contains('mtx-drawer--permanent')).toBe(true);
    expect(el.classList.contains('mtx-drawer--clipped')).toBe(true);
    expect(drawer.isOpen).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('false');
    expect(el.getAttribute('role')).toBe('navigation');
    expect(drawer.panel.getAttribute('role')).toBeNull();
    expect(drawer.panel.hasAttribute('aria-modal')).toBe(false);
    expect(trigger.classList.contains('mtx-drawer-trigger--hidden')).toBe(true);
    drawer.close();
    expect(drawer.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe('');
  });

  it('en móvil arranca temporal: cerrado, panel dialog modal con nombre accesible y trigger visible', () => {
    mockMatchMedia(false);
    const { el, drawer, trigger } = shell();
    expect(drawer.mode).toBe('temporary');
    expect(el.classList.contains('mtx-drawer--temporary')).toBe(true);
    expect(drawer.isOpen).toBe(false);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(drawer.panel.getAttribute('role')).toBe('dialog');
    expect(drawer.panel.getAttribute('aria-modal')).toBe('true');
    expect(drawer.panel.getAttribute('aria-label')).toBe('Main');
    expect(trigger.classList.contains('mtx-drawer-trigger--hidden')).toBe(false);
    expect(document.querySelector('.mtx-drawer__backdrop')).not.toBeNull();

    trigger.click();
    expect(drawer.isOpen).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe('app-nav');
    expect(document.body.style.overflow).toBe('hidden');
    drawer.close();
    expect(document.body.style.overflow).toBe('');
  });

  it('al cruzar a escritorio con el temporal abierto libera el modal y emite mode-change', () => {
    const mm = mockMatchMedia(false);
    const { el, drawer, trigger } = shell();
    const spy = vi.fn();
    el.addEventListener('mtx:drawer:mode-change', spy);
    drawer.open();
    expect(document.body.style.overflow).toBe('hidden');

    mm.set(true);
    expect(drawer.mode).toBe('permanent');
    expect(drawer.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('.mtx-drawer__backdrop').classList.contains('mtx-drawer__backdrop--open')).toBe(false);
    expect(trigger.classList.contains('mtx-drawer-trigger--hidden')).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ mode: 'permanent', previousMode: 'temporary' });

    // Escape ya no cierra (no hay modal activo)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(drawer.isOpen).toBe(true);
  });

  it('al volver a móvil queda cerrado y el foco interior pasa al disparador', () => {
    const mm = mockMatchMedia(true);
    const { el, drawer, trigger } = shell();
    // jsdom no calcula layout: el disparador se considera visible si tiene rects
    trigger.getClientRects = () => [{}];
    const link = document.getElementById('link-a');
    link.focus();
    expect(document.activeElement).toBe(link);

    mm.set(false);
    expect(drawer.mode).toBe('temporary');
    expect(drawer.isOpen).toBe(false);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(drawer.panel.getAttribute('role')).toBe('dialog');
    expect(trigger.classList.contains('mtx-drawer-trigger--hidden')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('respeta un role propio del consumidor en ambos modos', () => {
    const mm = mockMatchMedia(true);
    const { el } = shell('role="complementary"');
    expect(el.getAttribute('role')).toBe('complementary');
    mm.set(false);
    expect(el.getAttribute('role')).toBe('complementary');
  });

  it('data-header="temporary" marca la cabecera generada como solo-temporal', () => {
    mockMatchMedia(true);
    const { drawer } = shell('data-title="Lumen" data-header="temporary"');
    expect(drawer.header.classList.contains('mtx-drawer__temporary-only')).toBe(true);
    expect(drawer.header.querySelector('.mtx-drawer__close')).not.toBeNull();
  });

  it('el AppBar con data-drawer genera un disparador que el drawer oculta en modo permanente', () => {
    mockMatchMedia(true);
    document.body.innerHTML = `
      <div data-mtx="drawer" id="nav-2" data-variant="responsive"><p>x</p></div>
      <header data-mtx="app-bar" data-start-icon="menu" data-drawer="nav-2" data-title="App"></header>`;
    initAll();
    const btn = document.querySelector('.mtx-toolbar__navigation-icon');
    expect(btn.classList.contains('mtx-drawer-trigger--hidden')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('sin matchMedia (SSR / entornos sin layout) se comporta como temporal', () => {
    window.matchMedia = undefined;
    const { drawer } = shell();
    expect(drawer.mode).toBe('temporary');
  });

  it('destroy() deja de escuchar el breakpoint y restaura los disparadores', () => {
    const mm = mockMatchMedia(true);
    const { drawer, trigger } = shell();
    drawer.destroy();
    expect(trigger.classList.contains('mtx-drawer-trigger--hidden')).toBe(false);
    mm.set(false);
    expect(drawer.mode).toBe('permanent');
  });

  /**
   * Cuenta los listeners `keydown` de `document` activos (añadidos menos retirados).
   * @returns {{count: Function, restore: Function}} Control del espía.
   */
  const trackKeydown = () => {
    const active = new Set();
    const add = vi.spyOn(document, 'addEventListener').mockImplementation(function (type, fn, opts) {
      if (type === 'keydown') active.add(fn);
      return EventTarget.prototype.addEventListener.call(this, type, fn, opts);
    });
    const remove = vi.spyOn(document, 'removeEventListener').mockImplementation(function (type, fn, opts) {
      if (type === 'keydown') active.delete(fn);
      return EventTarget.prototype.removeEventListener.call(this, type, fn, opts);
    });
    return { count: () => active.size, restore: () => { add.mockRestore(); remove.mockRestore(); } };
  };

  it('destroy() retira el keydown del modo temporal abierto', () => {
    mockMatchMedia(false);
    const tracker = trackKeydown();
    try {
      const { drawer } = shell();
      const base = tracker.count();
      drawer.open();
      expect(tracker.count()).toBe(base + 1);
      drawer.destroy();
      expect(tracker.count()).toBe(base);
    } finally {
      tracker.restore();
    }
  });

  it('destroy() no deja keydown tras un cambio en caliente temporary→permanent→temporary', () => {
    const mm = mockMatchMedia(false);
    const tracker = trackKeydown();
    try {
      const { drawer } = shell();
      const base = tracker.count();
      drawer.open();
      mm.set(true);
      expect(drawer.mode).toBe('permanent');
      expect(tracker.count()).toBe(base);
      mm.set(false);
      drawer.open();
      expect(tracker.count()).toBe(base + 1);
      drawer.destroy();
      expect(tracker.count()).toBe(base);
      expect(document.body.style.overflow).toBe('');
    } finally {
      tracker.restore();
    }
  });
});

describe('Drawer: botón de cierre i18n y cabecera', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('el aria-label del cierre sale del diccionario según el idioma del contenedor', () => {
    document.body.innerHTML = `
      <div data-mtx="drawer" id="d-en" data-title="Menu"></div>
      <div lang="es"><div data-mtx="drawer" id="d-es" data-title="Menú"></div></div>`;
    initAll();
    expect(document.querySelector('#d-en .mtx-drawer__close').getAttribute('aria-label')).toBe('Close');
    expect(document.querySelector('#d-es .mtx-drawer__close').getAttribute('aria-label')).toBe('Cerrar');
  });

  it('título y subtítulo se apilan en .mtx-drawer__heading y nombran el diálogo', () => {
    document.body.innerHTML = '<div data-mtx="drawer" id="d" data-title="Cuenta" data-subtitle="Ajustes"></div>';
    initAll();
    const drawer = getInstance(document.getElementById('d'));
    const heading = drawer.header.querySelector('.mtx-drawer__heading');
    const title = heading.querySelector('.mtx-drawer__title');
    expect(title.textContent).toBe('Cuenta');
    expect(heading.querySelector('.mtx-drawer__subtitle').textContent).toBe('Ajustes');
    expect(drawer.panel.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('el drawer permanente no genera botón de cierre', () => {
    document.body.innerHTML = '<div data-mtx="drawer" data-variant="permanent" data-title="Nav"></div>';
    initAll();
    expect(document.querySelector('.mtx-drawer__close')).toBeNull();
  });
});

describe('Orden de apilamiento y app shell (CSS)', () => {
  const read = (rel) => fs.readFileSync(path.resolve(__dirname, '..', rel), 'utf8').replace(/\r\n/g, '\n');
  const tokens = read('src/styles/tokens.css');
  const drawerCss = read('src/components/drawer/drawer.css');
  const appBarCss = read('src/components/app-bar/app-bar.css');
  const token = (name) => Number(tokens.match(new RegExp(`--mtx-z-index-${name}:\\s*(\\d+)`))[1]);

  /**
   * Devuelve las declaraciones de la primera regla cuyo selector contiene el texto dado.
   * @param {string} css Hoja de estilos.
   * @param {string} selector Fragmento de selector.
   * @returns {string} Declaraciones de la regla.
   */
  const rule = (css, selector) => {
    const index = css.indexOf(selector);
    expect(index, selector).toBeGreaterThan(-1);
    const open = css.indexOf('{', index);
    return css.slice(open + 1, css.indexOf('}', open));
  };

  it('temporal = modal (1300) por encima de la AppBar clipped (drawer + 1) y de su fondo', () => {
    const modal = token('modal');
    const appBar = token('app-bar');
    const drawer = token('drawer');
    expect(rule(drawerCss, '.mtx-drawer,\n[data-mtx="drawer"] {')).toMatch(/z-index:\s*var\(--mtx-z-index-modal, 1300\)/);
    expect(rule(drawerCss, '.mtx-drawer__backdrop {')).toMatch(/z-index:\s*calc\(var\(--mtx-z-index-modal, 1300\) - 1\)/);
    expect(rule(appBarCss, '.mtx-app-bar--clipped {')).toMatch(/--mtx-z-index-drawer, 1200\) \+ 1/);
    // fondo (modal - 1) > AppBar clipped (drawer + 1) > AppBar > permanente clipped (app bar - 1)
    expect(modal - 1).toBeGreaterThan(drawer + 1);
    expect(drawer + 1).toBeGreaterThan(appBar);
    expect(rule(drawerCss, '.mtx-drawer--clipped.mtx-drawer--permanent {')).toMatch(/z-index:\s*calc\(var\(--mtx-z-index-app-bar, 1100\) - 1\)/);
  });

  it('permanente: caja sticky en el flujo; clipped bajo --mtx-app-bar-height (56/64)', () => {
    const permanent = rule(drawerCss, '.mtx-drawer--permanent,\n[data-mtx="drawer"][data-variant="permanent"] {');
    expect(permanent).toMatch(/position:\s*sticky/);
    expect(permanent).toMatch(/flex-shrink:\s*0/);
    expect(permanent).toMatch(/height:\s*100dvh/);
    const clipped = rule(drawerCss, '.mtx-drawer--clipped.mtx-drawer--permanent {');
    expect(clipped).toMatch(/top:\s*var\(--mtx-app-bar-height, 56px\)/);
    expect(clipped).toMatch(/margin-top:\s*var\(--mtx-app-bar-height, 56px\)/);
    expect(drawerCss).toMatch(/@media \(min-width: 600px\) \{\s*\.mtx-drawer--clipped\.mtx-drawer--permanent \{\s*top:\s*var\(--mtx-app-bar-height, 64px\)/);
  });

  it('.mtx-drawer__content es columna flex (permite pie con margin-top: auto)', () => {
    const content = rule(drawerCss, '.mtx-drawer__content {');
    expect(content).toMatch(/display:\s*flex/);
    expect(content).toMatch(/flex-direction:\s*column/);
  });

  it('.mtx-toolbar-offset reserva la altura de la AppBar (56px móvil / 64px desde 600px)', () => {
    expect(rule(appBarCss, '.mtx-toolbar-offset {')).toMatch(/min-height:\s*var\(--mtx-app-bar-height, 56px\)/);
    expect(appBarCss).toMatch(/@media \(min-width: 600px\) \{\s*\.mtx-toolbar-offset \{\s*min-height:\s*var\(--mtx-app-bar-height, 64px\)/);
    expect(appBarCss).toMatch(/\.mtx-toolbar-offset\.mtx-toolbar-offset--dense \{\s*min-height:\s*48px/);
  });

  it('búsqueda: --grow sin salto de ancho al foco y sin blancos fijos', () => {
    expect(rule(appBarCss, '.mtx-app-bar-search--grow,\n.mtx-app-bar-search--grow:focus-within {')).toMatch(/flex:\s*1 1 0%/);
    expect(appBarCss).not.toMatch(/rgba\(255,\s*255,\s*255/);
    expect(appBarCss).not.toMatch(/#ffffff/i);
    expect(rule(appBarCss, '.mtx-toolbar .mtx-text-field {')).toMatch(/min-width:\s*0/);
  });
});

describe('Drawer responsive — sin animación al cargar en escritorio', () => {
  const originalMatchMedia = window.matchMedia;
  const drawerCss = fs.readFileSync(path.resolve(__dirname, '../src/components/drawer/drawer.css'), 'utf8')
    .replace(/\r\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('el modo permanente inicial no lleva --animated', () => {
    mockMatchMedia(true);
    const { el } = shell();
    expect(el.classList.contains('mtx-drawer--permanent')).toBe(true);
    expect(el.classList.contains('mtx-drawer--animated')).toBe(false);
  });

  it('la transición de transform solo existe con --animated (no en .mtx-drawer--open a secas)', () => {
    const transitionSelectors = [...drawerCss.matchAll(/([^{}]+)\{[^}]*transition:\s*transform[^}]*\}/g)]
      .map((m) => m[1].trim())
      .filter((sel) => sel.includes('mtx-drawer--open') || sel === '.mtx-drawer--animated');
    expect(transitionSelectors).toContain('.mtx-drawer--animated.mtx-drawer--open');
    transitionSelectors.forEach((sel) => expect(sel).toMatch(/mtx-drawer--animated/));
  });
});
