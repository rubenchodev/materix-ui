import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { Select } from '../src/components/select/select.js';
import '../src/components/select/select.js';

function createSelect(attrs = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'mtx-select';
  wrap.setAttribute('data-mtx', 'select');
  if (attrs.variant) wrap.setAttribute('data-variant', attrs.variant);
  if (attrs.error) wrap.setAttribute('data-error', '');
  if (attrs.search) wrap.setAttribute('data-search', '');
  const searchField = attrs.search
    ? ''
    : '<span class="mtx-select__label">Ciudad</span>';
  wrap.innerHTML =
    searchField +
    '<div class="mtx-select__control">' +
    '<select class="mtx-select__native">' +
    '<option value="mdx">Ciudad de México</option>' +
    '<option value="gdl">Guadalajara</option>' +
    '</select>' +
    '<span class="mtx-select__chevron"></span></div>';
  document.body.appendChild(wrap);
  return wrap;
}

function createMultipleSelect(selected = [], attrs = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'mtx-select';
  wrap.setAttribute('data-mtx', 'select');
  if (attrs.variant) wrap.setAttribute('data-variant', attrs.variant);
  if (attrs.actionsBox) wrap.setAttribute('data-actions-box', '');
  if (attrs.maxOptions) wrap.setAttribute('data-max-options', attrs.maxOptions);
  if (attrs.textFormat) wrap.setAttribute('data-selected-text-format', attrs.textFormat);
  const opts = ['a', 'b', 'c']
    .map((v) => {
      const sel = selected.includes(v) ? ' selected' : '';
      return `<option value="${v}"${sel}>${v.toUpperCase()}</option>`;
    })
    .join('');
  wrap.innerHTML =
    `<div class="mtx-select__control">` +
    `<select multiple class="mtx-select__native">${opts}</select>` +
    `<span class="mtx-select__chevron"></span></div>`;
  document.body.appendChild(wrap);
  return wrap;
}

function openMenu(el) {
  el.querySelector('.mtx-select__control').dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('Select', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createSelect();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('lee el valor seleccionado en modo único', () => {
    const el = createSelect();
    initAll();
    expect(getInstance(el).value).toBe('mdx');
  });

  it('set value actualiza el select en modo único', () => {
    const el = createSelect();
    initAll();
    getInstance(el).value = 'gdl';
    expect(el.querySelector('select').value).toBe('gdl');
  });

  it('aplica la variante indicada', () => {
    const el = createSelect({ variant: 'filled' });
    initAll();
    expect(el.classList.contains('mtx-select--filled')).toBe(true);
  });

  it('aplica el estado de error', () => {
    const el = createSelect({ error: true });
    initAll();
    expect(el.classList.contains('mtx-select--error')).toBe(true);
  });

  it('en modo único muestra el texto del valor seleccionado', () => {
    const el = createSelect();
    initAll();
    expect(el.querySelector('.mtx-select__display').textContent).toBe('Ciudad de México');
  });

  it('devuelve lista en selección múltiple', () => {
    const el = createMultipleSelect(['a', 'b']);
    initAll();
    const sel = getInstance(el);
    expect(sel.multiple).toBe(true);
    expect(sel.value).toEqual(['a', 'b']);
  });

  it('en múltiple muestra los valores separados por coma (formato values)', () => {
    const el = createMultipleSelect(['a', 'b']);
    initAll();
    expect(el.querySelector('.mtx-select__display').textContent).toBe('A, B');
  });

  it('en múltiple muestra el conteo con formato count', () => {
    const el = createMultipleSelect(['a', 'b', 'c'], { textFormat: 'count' });
    initAll();
    expect(el.querySelector('.mtx-select__display').textContent).toBe('3 selected');
  });

  it('clic en el control abre y cierra el menú', () => {
    const el = createMultipleSelect();
    initAll();
    openMenu(el);
    expect(el.classList.contains('mtx-select--open')).toBe(true);
    openMenu(el);
    expect(el.classList.contains('mtx-select--open')).toBe(false);
  });

  it('construye el menú y marca opciones seleccionadas', () => {
    const el = createMultipleSelect(['a']);
    initAll();
    const options = el.querySelectorAll('.mtx-select__option');
    expect(options.length).toBe(3);
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');
  });

  it('clic en una opción alterna su selección en múltiple', () => {
    const el = createMultipleSelect(['a']);
    initAll();
    const sel = getInstance(el);
    openMenu(el);
    const optionB = document.querySelector('.mtx-select__menu [data-value="b"]');
    optionB.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(sel.value).toEqual(['a', 'b']);
    expect(optionB.getAttribute('aria-selected')).toBe('true');
  });

  it('clic en una opción selecciona y cierra en modo único', () => {
    const el = createSelect();
    initAll();
    const sel = getInstance(el);
    openMenu(el);
    const option = document.querySelector('.mtx-select__menu [data-value="gdl"]');
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(sel.value).toBe('gdl');
    expect(el.classList.contains('mtx-select--open')).toBe(false);
  });

  it('soporta optgroups como encabezados del menú', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select multiple class="mtx-select__native">' +
      '<optgroup label="Frontend"><option value="js" selected>JS</option></optgroup>' +
      '<optgroup label="Backend"><option value="py">Python</option></optgroup>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();
    expect(el.querySelectorAll('.mtx-select__optgroup').length).toBe(2);
    expect(el.querySelectorAll('.mtx-select__option').length).toBe(2);
  });

  it('las acciones seleccionar todo y limpiar actualizan la selección', () => {
    const el = createMultipleSelect([], { actionsBox: true });
    initAll();
    const sel = getInstance(el);
    openMenu(el);
    const actions = document.querySelectorAll('.mtx-select__action');
    actions[0].click(); // Seleccionar todo
    expect(sel.value).toEqual(['a', 'b', 'c']);
    actions[1].click(); // Limpiar
    expect(sel.value).toEqual([]);
  });

  it('data-max-options deshabilita opciones no seleccionadas al llegar al límite', () => {
    const el = createMultipleSelect(['a'], { maxOptions: 2 });
    initAll();
    const sel = getInstance(el);
    openMenu(el);
    const optionB = document.querySelector('.mtx-select__menu [data-value="b"]');
    optionB.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const optionC = document.querySelector('.mtx-select__menu [data-value="c"]');
    expect(optionC.classList.contains('mtx-select__option--disabled')).toBe(true);
    expect(sel.value).toEqual(['a', 'b']);
  });

  it('la búsqueda filtra las opciones del menú', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.setAttribute('data-search', '');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native">' +
      '<option value="mdx">Ciudad de México</option>' +
      '<option value="gdl">Guadalajara</option>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();
    openMenu(el);
    const input = document.querySelector('.mtx-select__menu .mtx-select__search');
    input.value = 'guad';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(200);
    const gdl = document.querySelector('.mtx-select__menu [data-value="gdl"]');
    const mdx = document.querySelector('.mtx-select__menu [data-value="mdx"]');
    expect(gdl.classList.contains('mtx-select__option--hidden')).toBe(false);
    expect(mdx.classList.contains('mtx-select__option--hidden')).toBe(true);
    vi.useRealTimers();
  });

  it('genera NotchedOutline con fieldset y legend en variante outlined', () => {
    const el = createSelect({ variant: 'outlined' });
    initAll();
    const outline = el.querySelector('.mtx-select__outline');
    expect(outline).not.toBeNull();
    expect(outline.tagName).toBe('FIELDSET');
    const legend = outline.querySelector('.mtx-select__legend');
    expect(legend).not.toBeNull();
    expect(legend.querySelector('span').textContent).toBe('Ciudad');
  });

  it('soporta data-start-icon e inyecta adornment accesible', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.setAttribute('data-start-icon', 'public');
    el.innerHTML =
      '<span class="mtx-select__label">País</span>' +
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native"><option value="1">Opción</option></select>' +
      '</div>';
    document.body.appendChild(el);
    initAll();

    expect(el.classList.contains('mtx-select--adorned-start')).toBe(true);
    const adornment = el.querySelector('.mtx-select__adornment--start');
    expect(adornment).not.toBeNull();
    expect(adornment.classList.contains('material-icons')).toBe(true);
    expect(adornment.textContent).toBe('public');
    expect(adornment.getAttribute('aria-hidden')).toBe('true');
  });

  it('soporta data-helper-text y vincula aria-describedby', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.setAttribute('data-helper-text', 'Selecciona tu destino');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native"><option value="1">Opción</option></select>' +
      '</div>';
    document.body.appendChild(el);
    initAll();

    const helper = el.querySelector('.mtx-select__helper-text');
    expect(helper).not.toBeNull();
    expect(helper.textContent).toBe('Selecciona tu destino');
    const control = el.querySelector('.mtx-select__control');
    expect(control.getAttribute('aria-describedby')).toBe(helper.id);

    const instance = getInstance(el);
    expect(instance.helperText).toBe('Selecciona tu destino');
    instance.helperText = 'Nuevo mensaje de ayuda';
    expect(helper.textContent).toBe('Nuevo mensaje de ayuda');
  });

  it('soporta single-element con data-start-icon, data-label y data-helper-text', () => {
    const select = document.createElement('select');
    select.setAttribute('data-mtx', 'select');
    select.setAttribute('data-label', 'Región');
    select.setAttribute('data-start-icon', 'place');
    select.setAttribute('data-helper-text', 'Campo obligatorio');
    select.innerHTML = '<option value="north">Norte</option><option value="south">Sur</option>';
    document.body.appendChild(select);

    initAll();

    const wrapper = select.closest('.mtx-select');
    expect(wrapper).not.toBeNull();
    expect(wrapper.querySelector('.mtx-select__label').textContent).toBe('Región');
    expect(wrapper.querySelector('.mtx-select__outline')).not.toBeNull();
    expect(wrapper.querySelector('.mtx-select__adornment--start').textContent).toBe('place');
    expect(wrapper.querySelector('.mtx-select__helper-text').textContent).toBe('Campo obligatorio');
    expect(wrapper.classList.contains('mtx-select--adorned-start')).toBe(true);
  });

  it('muestra mensaje cuando la búsqueda no produce coincidencias (parametrizable)', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.setAttribute('data-search', '');
    el.setAttribute('data-none-results-text', 'No hubo coincidencias para "{0}"');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native">' +
      '<option value="a">Manzana</option>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();

    openMenu(el);
    const noResults = document.querySelector('.mtx-select__no-results');
    expect(noResults).not.toBeNull();
    expect(noResults.hidden).toBe(true);

    const input = document.querySelector('.mtx-select__menu .mtx-select__search');
    input.value = 'pera';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(200);

    expect(noResults.hidden).toBe(false);
    expect(noResults.textContent).toBe('No hubo coincidencias para "pera"');

    // Al limpiar la búsqueda, se oculta de nuevo
    input.value = 'manz';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(200);

    expect(noResults.hidden).toBe(true);
    vi.useRealTimers();
  });

  it('permite personalizar los textos de los botones seleccionar todo y deseleccionar todo', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.setAttribute('data-actions-box', '');
    el.setAttribute('data-select-all-text', 'Marcar todos');
    el.setAttribute('data-deselect-all-text', 'Desmarcar todos');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select multiple class="mtx-select__native">' +
      '<option value="1">Opción 1</option>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();

    openMenu(el);
    const btnSelectAll = document.querySelector('.mtx-select__action--select-all');
    const btnDeselectAll = document.querySelector('.mtx-select__action--deselect-all');
    expect(btnSelectAll.textContent).toBe('Marcar todos');
    expect(btnDeselectAll.textContent).toBe('Desmarcar todos');
  });

  it('soporta data-icon en elementos option y los renderiza en menú y display', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native">' +
      '<option value="email" data-icon="email" selected>Correo</option>' +
      '<option value="phone" data-icon="phone">Teléfono</option>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();

    // En el menú desplegable
    const optionEmail = el.querySelector('.mtx-select__menu [data-value="email"]');
    const iconEmail = optionEmail.querySelector('.mtx-select__option-icon');
    expect(iconEmail).not.toBeNull();
    expect(iconEmail.classList.contains('material-icons')).toBe(true);
    expect(iconEmail.textContent).toBe('email');

    // En el display visible
    const displayIcon = el.querySelector('.mtx-select__display-icon');
    const displayText = el.querySelector('.mtx-select__display-text');
    expect(displayIcon).not.toBeNull();
    expect(displayIcon.textContent).toBe('email');
    expect(displayText.textContent).toBe('Correo');

    // Al cambiar de opción
    getInstance(el).value = 'phone';
    expect(el.querySelector('.mtx-select__display-icon').textContent).toBe('phone');
    expect(el.querySelector('.mtx-select__display-text').textContent).toBe('Teléfono');
  });

  it('soporta URLs de imágenes (png/svg/jpg/webp) en data-icon o data-image', () => {
    const el = document.createElement('div');
    el.className = 'mtx-select';
    el.setAttribute('data-mtx', 'select');
    el.innerHTML =
      '<div class="mtx-select__control">' +
      '<select class="mtx-select__native">' +
      '<option value="co" data-icon="https://flagcdn.com/24x18/co.png" selected>Colombia</option>' +
      '<option value="mx" data-image="/images/flags/mx.svg">México</option>' +
      '</select><span class="mtx-select__chevron"></span></div>';
    document.body.appendChild(el);
    initAll();

    // En el menú desplegable
    const optionCo = el.querySelector('.mtx-select__menu [data-value="co"]');
    const imgCo = optionCo.querySelector('img.mtx-select__option-image');
    expect(imgCo).not.toBeNull();
    expect(imgCo.src).toBe('https://flagcdn.com/24x18/co.png');

    // En el display visible
    const displayImg = el.querySelector('img.mtx-select__display-image');
    expect(displayImg).not.toBeNull();
    expect(displayImg.src).toBe('https://flagcdn.com/24x18/co.png');
    expect(el.querySelector('.mtx-select__display-text').textContent).toBe('Colombia');

    // Al cambiar a México con data-image
    getInstance(el).value = 'mx';
    expect(el.querySelector('img.mtx-select__display-image').getAttribute('src')).toBe('/images/flags/mx.svg');
    expect(el.querySelector('.mtx-select__display-text').textContent).toBe('México');
  });

  it('selección única con data-placeholder muestra el placeholder hasta elegir', () => {
    document.body.innerHTML = '<select data-mtx="select" data-label="Rol" data-placeholder="Elige un rol"><option value="admin">Admin</option><option value="editor">Editor</option></select>';
    initAll();
    const wrap = document.querySelector('.mtx-select');
    const select = wrap.querySelector('select');
    const display = wrap.querySelector('.mtx-select__display');
    expect(select.selectedIndex).toBe(-1);
    expect(display.textContent).toBe('Elige un rol');
    expect(display.classList.contains('mtx-select__display--empty')).toBe(true);
    getInstance(wrap).value = 'editor';
    expect(display.textContent).toBe('Editor');
    expect(display.classList.contains('mtx-select__display--empty')).toBe(false);
    getInstance(wrap).value = 'none';
    expect(select.selectedIndex).toBe(-1);
    expect(display.textContent).toBe('Elige un rol');
  });

  it('respeta la opción marcada con selected aunque haya placeholder', () => {
    document.body.innerHTML = '<select data-mtx="select" data-placeholder="Elige"><option value="a">A</option><option value="b" selected>B</option></select>';
    initAll();
    expect(document.querySelector('.mtx-select__display').textContent).toBe('B');
  });

  it('el texto del display va en un span para aplicar ellipsis', () => {
    createSelect();
    initAll();
    const text = document.querySelector('.mtx-select__display > .mtx-select__display-text');
    expect(text).not.toBeNull();
    expect(text.textContent).toBe('Ciudad de México');
  });

  it('data-color aplica la clase de color al control y al menú', () => {
    ['primary', 'secondary', 'error', 'warning', 'info', 'success'].forEach((color) => {
      document.body.innerHTML = `<select data-mtx="select" data-color="${color}"><option value="1">Uno</option></select>`;
      initAll();
      const wrap = document.querySelector('.mtx-select');
      expect(wrap.classList.contains(`mtx-select--color-${color}`)).toBe(true);
      expect(getInstance(wrap).menu.classList.contains(`mtx-select__menu--color-${color}`)).toBe(true);
      expect(wrap.classList.contains('mtx-select--error') && color === 'error').toBe(false);
    });
  });

  it('data-size="small" reduce el control y "medium" es el predeterminado', () => {
    document.body.innerHTML = '<select data-mtx="select" data-size="small"><option>1</option></select><select data-mtx="select" data-size="medium"><option>1</option></select>';
    initAll();
    const [small, medium] = document.querySelectorAll('.mtx-select');
    expect(small.classList.contains('mtx-select--small')).toBe(true);
    expect(medium.classList.contains('mtx-select--small')).toBe(false);
  });
});

describe('Select — ciclo de vida y posicionamiento', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('cancela el debounce de búsqueda en destroy', () => {
    vi.useFakeTimers();
    const wrap = createSelect({ search: true });
    initAll();
    const select = getInstance(wrap);
    const filterSpy = vi.spyOn(select, '_filterOptions');
    select.open();
    select.search.value = 'gua';
    select.search.dispatchEvent(new Event('input'));
    select.destroy();
    vi.advanceTimersByTime(300);
    expect(filterSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('retira scroll/resize al destruir con el menú abierto', () => {
    const wrap = createSelect();
    initAll();
    const select = getInstance(wrap);
    const removeWin = vi.spyOn(window, 'removeEventListener');
    select.open();
    select.destroy();
    expect(removeWin.mock.calls.some(([type]) => type === 'scroll')).toBe(true);
    expect(removeWin.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    removeWin.mockRestore();
  });

  it('posiciona el menú bajo el control con ancho mínimo igual al control', () => {
    const wrap = createSelect();
    initAll();
    const select = getInstance(wrap);
    select.control.getBoundingClientRect = () => ({ left: 20, top: 20, right: 220, bottom: 76, width: 200, height: 56 });
    select.open();
    expect(select.menu.style.position).toBe('fixed');
    expect(select.menu.style.top).toBe('80px');
    expect(select.menu.style.minWidth).toBe('200px');
    expect(select.menu.style.zIndex).toBe('');
    select.close();
  });
});

describe('Select — re-inicialización y lado estable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('destroy() + initAll() reutiliza el wrapper sin anidar ni lanzar', () => {
    document.body.innerHTML = `
      <select id="s" class="extra" data-mtx="select" data-label="País">
        <option value="co">Colombia</option><option value="mx">México</option>
      </select>`;
    initAll();
    const sel = document.getElementById('s');
    const wrap = sel.closest('.mtx-select');
    expect(wrap.classList.contains('mtx-select')).toBe(true);
    expect(wrap.classList.contains('extra')).toBe(true);
    expect(getInstance(sel)).toBe(getInstance(wrap));
    destroy(wrap);
    expect(() => initAll()).not.toThrow();
    const again = getInstance(wrap);
    expect(again).toBeTruthy();
    expect(getInstance(sel)).toBe(again);
    expect(document.querySelectorAll('.mtx-select').length).toBe(1);
    expect(wrap.querySelectorAll('.mtx-select__control').length).toBe(1);
    expect(document.querySelectorAll('.mtx-select__menu').length).toBe(1);
  });

  it('new Select(sel) dos veces reemplaza la instancia previa', () => {
    document.body.innerHTML = '<select id="s"><option value="a">A</option></select>';
    const sel = document.getElementById('s');
    const first = new Select(sel);
    const second = new Select(sel);
    expect(first.destroyed).toBe(true);
    expect(second.element).toBe(first.element);
    expect(document.querySelectorAll('.mtx-select').length).toBe(1);
    expect(document.querySelectorAll('.mtx-select__control').length).toBe(1);
    expect(document.querySelectorAll('.mtx-select__menu').length).toBe(1);
  });

  it('con búsqueda, abierto hacia arriba se mantiene arriba al filtrar', () => {
    const wrap = createSelect({ search: true });
    initAll();
    const select = getInstance(wrap);
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    select.control.getBoundingClientRect = () => ({ left: 20, top: 700, right: 220, bottom: 756, width: 200, height: 56 });
    Object.defineProperty(select.menu, 'scrollHeight', { configurable: true, value: 300 });
    select.open();
    expect(select.menu.dataset.placement).toBe('top');
    Object.defineProperty(select.menu, 'scrollHeight', { configurable: true, value: 20 });
    select._handleReposition();
    expect(select.menu.dataset.placement).toBe('top');
    select.close();
  });
});
