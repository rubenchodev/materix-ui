import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import Materix, {
  initAll,
  getInstance,
  destroy,
  destroyAll,
  watch,
  ComponentBase,
  registerComponent,
} from '../src/index.js';
import { emit } from '../src/core/events.js';

/**
 * Intercepta add/removeEventListener en `document` y `window` y lleva la cuenta
 * de los listeners activos registrados desde que se llamó.
 */
function trackGlobalListeners() {
  const active = [];
  const restores = [];
  [document, window].forEach((target) => {
    const add = target.addEventListener;
    const remove = target.removeEventListener;
    const capture = (opts) => (typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture));
    const find = (type, handler, opts) => active.findIndex((r) => r.target === target
      && r.type === type && r.handler === handler && r.capture === capture(opts));
    target.addEventListener = function patchedAdd(type, handler, opts) {
      if (handler && find(type, handler, opts) < 0) active.push({ target, type, handler, capture: capture(opts) });
      return add.call(this, type, handler, opts);
    };
    target.removeEventListener = function patchedRemove(type, handler, opts) {
      const index = find(type, handler, opts);
      if (index >= 0) active.splice(index, 1);
      return remove.call(this, type, handler, opts);
    };
    restores.push(() => {
      target.addEventListener = add;
      target.removeEventListener = remove;
    });
  });
  return {
    active,
    restore: () => restores.forEach((fn) => fn()),
  };
}

/** Fixtures de todos los componentes del núcleo (excepto SpeedDial y DateTimePicker). */
const FIXTURES = {
  accordion: `<div data-mtx="accordion-group"><div data-mtx="accordion" data-summary="A">a</div></div>
    <div data-mtx="accordion" data-summary="B">b</div>`,
  alert: '<div data-mtx="alert" data-severity="success" data-title="OK" data-dismissible>Hecho</div>',
  'app-bar': '<header data-mtx="app-bar" data-title="App" data-elevate-on-scroll data-hide-on-scroll></header>',
  avatar: `<div data-mtx="avatar-group" data-max="2"><span data-mtx="avatar">A</span><span data-mtx="avatar">B</span>
    <span data-mtx="avatar">C</span></div><span data-mtx="avatar" data-src="x.png" data-alt="X"></span>`,
  badge: '<div data-mtx="badge" data-content="4"><span class="material-icons">mail</span></div>',
  breadcrumbs: '<nav data-mtx="breadcrumbs"><a href="#a">A</a><a href="#b">B</a><span>C</span></nav>',
  button: '<button data-mtx="button">OK</button><a href="#x" data-mtx="button">Link</a>',
  card: `<div data-mtx="card" data-title="T" data-subheader="S"><div data-mtx="card-action-area">x</div>
    <div data-mtx="card-content">c</div><div data-mtx="card-actions"></div></div>`,
  checkbox: '<input type="checkbox" data-mtx="checkbox" data-label="Check">',
  chip: '<div data-mtx="chip" data-label="React" data-deletable="true" data-clickable></div>',
  container: '<div data-mtx="container"><div data-mtx="stack"><div data-mtx="paper">p</div></div></div>',
  dialog: '<div id="dlg" data-mtx="dialog" data-title="Hola"><p>Contenido</p></div>',
  divider: '<div data-mtx="divider"></div><hr data-mtx="divider">',
  drawer: '<aside id="drw" data-mtx="drawer" data-variant="temporary"><p>Menú</p></aside>',
  responsive: '<aside id="rdrw" data-mtx="drawer" data-variant="responsive"><p>Menú</p></aside>',
  fab: '<button data-mtx="fab" data-icon="add" aria-label="Añadir"></button>',
  grid: '<div data-mtx="grid" data-container><div data-mtx="grid" data-xs="auto">a</div></div>',
  'icon-button': '<button data-mtx="icon-button" data-icon="edit" aria-label="Editar"></button>',
  link: '<a href="#l" data-mtx="link">Link</a>',
  list: `<ul data-mtx="list"><li data-mtx="list-item"><button data-mtx="list-item-button">Uno</button></li></ul>`,
  menu: `<button id="mtrig" data-mtx-menu-trigger="#mnu">Abrir</button>
    <div id="mnu" data-mtx="menu"><div data-mtx="menu-item">Uno</div></div>`,
  'native-select': '<select data-mtx="native-select" data-label="País"><option>A</option></select>',
  pagination: '<nav data-mtx="pagination" data-count="10"></nav>',
  progress: '<div data-mtx="circular-progress"></div><div data-mtx="linear-progress"></div>',
  radio: `<div data-mtx="radio-group"><input type="radio" name="r" value="a" data-mtx="radio" data-label="A">
    <input type="radio" name="r" value="b" data-mtx="radio" data-label="B"></div>`,
  rating: '<div data-mtx="rating" data-value="3"></div>',
  select: '<select data-mtx="select" data-label="País"><option value="1">Colombia</option><option value="2">Perú</option></select>',
  snackbar: '<div id="snk" data-mtx="snackbar" data-message="Guardado"></div>',
  stepper: `<ol data-mtx="stepper"><li data-label="A"></li><li data-label="B"></li></ol>
    <div data-mtx="mobile-stepper" data-steps="3"></div>`,
  switch: '<input type="checkbox" data-mtx="switch" data-label="Wifi">',
  table: `<table data-mtx="table" data-selectable><thead><tr><th data-mtx="table-sort-label">A</th></tr></thead>
    <tbody><tr data-id="1"><td>1</td></tr></tbody></table><div data-mtx="table-pagination" data-count="40"></div>`,
  tabs: `<div data-mtx="tabs"><button data-mtx="tab" data-panel="#tp1">A</button><button data-mtx="tab" data-panel="#tp2">B</button></div>
    <div id="tp1">1</div><div id="tp2">2</div>`,
  'text-field': '<input data-mtx="text-field" data-label="Nombre" type="text" data-counter="20">',
  'toggle-button': `<div data-mtx="toggle-button-group"><button data-mtx="toggle-button" value="a">A</button>
    <button data-mtx="toggle-button" value="b">B</button></div>`,
  typography: '<h1 data-mtx="typography">Título</h1><div data-mtx="css-baseline"></div>',
};

/** Abre los componentes que solo registran listeners globales mientras están abiertos. */
function exercise() {
  const byId = (id) => {
    const el = document.getElementById(id);
    return el ? getInstance(el) : null;
  };
  byId('dlg')?.open();
  byId('drw')?.open();
  byId('mnu')?.open(document.getElementById('mtrig'));
  byId('snk')?.open();
  document.querySelectorAll('.mtx-select').forEach((el) => {
    const instance = getInstance(el);
    if (instance && typeof instance.open === 'function') instance.open();
  });
}

/** Destruye todo lo inicializado en el documento (incluidos poppers portados a body). */
function destroyEverything() {
  return destroyAll(document.body);
}

describe('ciclo de vida (destroy)', () => {
  let tracker;

  // Calentamiento: instala las delegaciones globales únicas (singletons perezosos,
  // p. ej. data-mtx-stepper-action) para que no cuenten como fugas por instancia.
  beforeAll(() => {
    document.body.innerHTML = Object.values(FIXTURES).join('');
    initAll(document.body);
    exercise();
    destroyEverything();
    document.body.innerHTML = '';
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    tracker = trackGlobalListeners();
  });

  afterEach(() => {
    tracker.restore();
    destroyEverything();
    document.body.innerHTML = '';
  });

  Object.entries(FIXTURES).forEach(([name, html]) => {
    it(`${name}: destroy() retira los listeners de document/window y desvincula la instancia`, () => {
      document.body.innerHTML = html;
      initAll(document.body);
      const elements = Array.from(document.querySelectorAll('[data-mtx]'));
      expect(elements.some((el) => getInstance(el))).toBe(true);
      exercise();

      destroyEverything();

      expect(tracker.active.map((r) => `${r.target === window ? 'window' : 'document'}:${r.type}`)).toEqual([]);
      elements.forEach((el) => {
        expect(getInstance(el)).toBeUndefined();
        expect(el.hasAttribute('data-mtx-initialized')).toBe(false);
      });
    });
  });

  it('destroy() es idempotente y getInstance devuelve undefined', () => {
    document.body.innerHTML = '<div id="d" data-mtx="dialog" data-title="X">x</div>';
    initAll();
    const el = document.getElementById('d');
    const instance = getInstance(el);
    expect(destroy(el)).toBe(true);
    expect(destroy(el)).toBe(false);
    instance.destroy();
    expect(getInstance(el)).toBeUndefined();
    expect(instance.destroyed).toBe(true);
  });

  it('instance.destroy() desvincula también el elemento original del auto-scaffolding', () => {
    document.body.innerHTML = '<input id="i" data-mtx="text-field" data-label="A">';
    initAll();
    const input = document.getElementById('i');
    const instance = getInstance(input);
    expect(instance.element).not.toBe(input);
    expect(getInstance(instance.element)).toBe(instance);
    instance.destroy();
    expect(getInstance(input)).toBeUndefined();
    expect(getInstance(instance.element)).toBeUndefined();
  });

  it('un componente destruido puede volver a inicializarse', () => {
    document.body.innerHTML = '<button id="b" data-mtx="button">OK</button>';
    initAll();
    const el = document.getElementById('b');
    const first = getInstance(el);
    destroy(el);
    initAll();
    const second = getInstance(el);
    expect(second).toBeDefined();
    expect(second).not.toBe(first);
  });

  it('this.listen() y this.onDestroy() se liberan en destroy() de componentes propios', () => {
    let cleaned = 0;
    let calls = 0;
    class Probe extends ComponentBase {
      constructor(element) {
        super(element);
        this.listen(document, 'keydown', () => { calls += 1; });
        this.onDestroy(() => { cleaned += 1; });
      }
    }
    registerComponent('lifecycle-probe', Probe);
    document.body.innerHTML = '<div id="p" data-mtx="lifecycle-probe"></div>';
    initAll();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(calls).toBe(1);
    destroy(document.getElementById('p'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(calls).toBe(1);
    expect(cleaned).toBe(1);
    expect(tracker.active).toEqual([]);
  });

  it('SPA: montar y desmontar 100 veces no hace crecer los listeners globales', async () => {
    const app = document.createElement('div');
    document.body.appendChild(app);
    const observer = watch(app, { destroyOnRemove: true });
    const view = [
      FIXTURES.dialog, FIXTURES.drawer, FIXTURES.menu, FIXTURES.select, FIXTURES.snackbar,
      FIXTURES.tabs, FIXTURES['text-field'], FIXTURES.pagination, FIXTURES['app-bar'], FIXTURES.table,
    ].join('');
    const baseline = tracker.active.length;

    for (let i = 0; i < 100; i += 1) {
      const page = document.createElement('section');
      page.innerHTML = view;
      app.appendChild(page);
      await Promise.resolve();
      exercise();
      // Los poppers portados a <body> se destruyen con su instancia, no con el nodo de la vista.
      const menu = document.getElementById('mnu');
      if (menu) destroy(menu);
      page.remove();
      await Promise.resolve();
    }

    observer.disconnect();
    expect(tracker.active.length).toBe(baseline);
    expect(document.querySelectorAll('[data-mtx-initialized]').length).toBe(0);
  });

  it('watch() sin destroyOnRemove no destruye nodos eliminados; mover un nodo no lo destruye', async () => {
    const app = document.createElement('div');
    document.body.appendChild(app);
    const observer = watch(app, { destroyOnRemove: true });
    app.innerHTML = '<div id="a"><button id="b" data-mtx="button">OK</button></div><div id="c"></div>';
    await Promise.resolve();
    const button = document.getElementById('b');
    const instance = getInstance(button);
    expect(instance).toBeDefined();
    // Mover: se elimina y se vuelve a insertar en el mismo lote de mutaciones.
    document.getElementById('c').appendChild(button);
    await Promise.resolve();
    expect(getInstance(button)).toBe(instance);
    button.remove();
    await Promise.resolve();
    expect(getInstance(button)).toBeUndefined();
    observer.disconnect();

    const plain = watch(app);
    app.innerHTML = '<button id="b2" data-mtx="button">OK</button>';
    await Promise.resolve();
    const b2 = document.getElementById('b2');
    expect(getInstance(b2)).toBeDefined();
    b2.remove();
    await Promise.resolve();
    expect(getInstance(b2)).toBeDefined();
    plain.disconnect();
  });
});

describe('eventos: convención mtx:{componente}:{acción} y alias deprecados', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('emit() emite el nombre canónico y sus alias con el mismo detail', () => {
    const el = document.createElement('div');
    const seen = [];
    el.addEventListener('mtx:demo:go', (e) => seen.push(['new', e.detail.x]));
    el.addEventListener('old-go', (e) => seen.push(['old', e.detail.x]));
    const allowed = emit(el, 'mtx:demo:go', { x: 1 }, { aliases: ['old-go'] });
    expect(allowed).toBe(true);
    expect(seen).toEqual([['new', 1], ['old', 1]]);
  });

  it('emit() devuelve false si el evento o un alias cancelable se cancela', () => {
    const el = document.createElement('div');
    el.addEventListener('old', (e) => e.preventDefault());
    expect(emit(el, 'mtx:demo:x', {}, { cancelable: true, aliases: ['old'] })).toBe(false);
  });

  it('ListItemButton emite mtx:list:select y el alias mtx-select', () => {
    document.body.innerHTML = '<ul data-mtx="list"><li data-mtx="list-item"><button id="lb" data-mtx="list-item-button">Uno</button></li></ul>';
    initAll();
    const names = [];
    document.addEventListener('mtx:list:select', () => names.push('mtx:list:select'), { once: true });
    document.addEventListener('mtx-select', () => names.push('mtx-select'), { once: true });
    document.getElementById('lb').click();
    expect(names).toEqual(['mtx:list:select', 'mtx-select']);
  });

  it('RadioGroup emite mtx:radio-group:change y el alias mtx:change', () => {
    document.body.innerHTML = FIXTURES.radio;
    initAll();
    const names = [];
    const group = document.querySelector('[data-mtx="radio-group"]');
    group.addEventListener('mtx:radio-group:change', (e) => names.push(['new', e.detail.value]));
    group.addEventListener('mtx:change', (e) => names.push(['old', e.detail.value]));
    const radio = group.querySelector('input[value="b"]');
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    expect(names).toEqual([['new', 'b'], ['old', 'b']]);
  });

  it('setLocale emite mtx:locale:change y el alias mtx:localechange', () => {
    const names = [];
    const a = () => names.push('new');
    const b = () => names.push('old');
    document.addEventListener('mtx:locale:change', a);
    document.addEventListener('mtx:localechange', b);
    Materix.setLocale('es');
    Materix.setLocale('en');
    document.removeEventListener('mtx:locale:change', a);
    document.removeEventListener('mtx:localechange', b);
    expect(names).toEqual(['new', 'old', 'new', 'old']);
  });
});
