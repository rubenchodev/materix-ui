import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance, destroyAll } from '../src/core/registry.js';
import { setLocale } from '../src/i18n/index.js';
import '../src/components/autocomplete/autocomplete.js';
import {
  Autocomplete,
  normalizeText,
  findMatch,
  normalizeOption,
  optionsFromElement,
} from '../src/components/autocomplete/autocomplete.js';

const COUNTRIES = `
  <datalist id="countries">
    <option value="co">Colombia</option>
    <option value="mx">México</option>
    <option value="pe">Perú</option>
    <option value="es">España</option>
    <option value="ar" disabled>Argentina</option>
    <option value="cl">Chile</option>
  </datalist>`;

/**
 * Monta HTML en el body e inicializa.
 * @param {string} html Marcado.
 * @returns {Autocomplete} Instancia del primer autocomplete.
 */
function mount(html) {
  document.body.innerHTML = html;
  initAll();
  const el = document.querySelector('[data-mtx="autocomplete"]') || document.querySelector('.mtx-autocomplete');
  return getInstance(el);
}

/**
 * Pulsa una tecla en el input.
 * @param {HTMLElement} target Destino.
 * @param {string} key Tecla.
 * @returns {KeyboardEvent} Evento despachado.
 */
function press(target, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

/**
 * Escribe texto en el input y dispara `input`.
 * @param {Autocomplete} ac Instancia.
 * @param {string} text Texto.
 */
function type(ac, text) {
  ac.input.value = text;
  ac.input.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Opciones visibles en el listbox.
 * @param {Autocomplete} ac Instancia.
 * @returns {string[]} Textos.
 */
function visibleLabels(ac) {
  return Array.from(ac.listbox.querySelectorAll('[role="option"]')).map(
    (el) => el.querySelector('.mtx-autocomplete__option-label').textContent,
  );
}

describe('Autocomplete — utilidades', () => {
  it('normalizeText quita tildes y pasa a minúsculas', () => {
    expect(normalizeText('MÉXICO Perú Ñandú')).toBe('mexico peru nandu');
    expect(normalizeText(null)).toBe('');
  });

  it('findMatch localiza el rango en el texto original ignorando tildes', () => {
    expect(findMatch('México', 'mex')).toEqual({ start: 0, end: 3 });
    expect(findMatch('Perú', 'RU')).toEqual({ start: 2, end: 4 });
    expect(findMatch('Colombia', 'xyz')).toBeNull();
    expect(findMatch('Colombia', 'lom', true)).toBeNull();
    expect(findMatch('Colombia', '  ')).toBeNull();
  });

  it('normalizeOption admite texto y objetos conservando datos extra', () => {
    expect(normalizeOption('Lima')).toEqual({ value: 'Lima', label: 'Lima' });
    expect(normalizeOption({ value: 1, label: 'Uno', group: 'G', id: 9 })).toEqual({
      value: '1', label: 'Uno', group: 'G', id: 9,
    });
    expect(normalizeOption({ label: 'Solo label' }).value).toBe('Solo label');
    expect(normalizeOption({ value: 'x', disabled: true }).disabled).toBe(true);
    expect(normalizeOption(null)).toBeNull();
  });

  it('optionsFromElement lee datalist, optgroup, disabled, data-icon y data-description', () => {
    const select = document.createElement('select');
    select.innerHTML = `
      <option value="">Elige…</option>
      <optgroup label="Frutas"><option value="a" data-icon="eco" data-description="Roja">Manzana</option></optgroup>
      <optgroup label="Otros" disabled><option value="b">Pan</option></optgroup>`;
    const opts = optionsFromElement(select);
    expect(opts).toHaveLength(2);
    expect(opts[0]).toMatchObject({ value: 'a', label: 'Manzana', group: 'Frutas', icon: 'eco', description: 'Roja' });
    expect(opts[1].disabled).toBe(true);
    expect(optionsFromElement(null)).toEqual([]);
  });
});

describe('Autocomplete — scaffolding single-element', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  it('envuelve un <input> en TextField con combobox accesible', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-label="País" data-options="#countries" name="country" class="extra">`);
    expect(ac).toBeInstanceOf(Autocomplete);
    const root = ac.element;
    expect(root.classList.contains('mtx-autocomplete')).toBe(true);
    expect(root.classList.contains('extra')).toBe(true);
    expect(root.querySelector('.mtx-text-field.mtx-text-field--outlined')).not.toBeNull();
    expect(root.querySelector('.mtx-text-field__label').textContent).toBe('País');
    expect(root.querySelector('fieldset.mtx-text-field__outline')).not.toBeNull();
    const input = ac.input;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.hasAttribute('name')).toBe(false);
    expect(root.querySelector('input[type="hidden"][name="country"]')).not.toBeNull();
    expect(ac.listbox.getAttribute('role')).toBe('listbox');
    expect(ac.listbox.getAttribute('aria-labelledby')).toBe(root.querySelector('.mtx-text-field__label').id);
    expect(root.querySelector('.mtx-autocomplete__live').getAttribute('aria-live')).toBe('polite');
    expect(getInstance(input)).toBe(ac);
    expect(getInstance(root)).toBe(ac);
  });

  it('es idempotente: initAll dos veces no duplica la estructura', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-label="País" data-options="#countries">`);
    initAll();
    expect(document.querySelectorAll('.mtx-autocomplete')).toHaveLength(1);
    expect(document.querySelectorAll('.mtx-text-field')).toHaveLength(1);
    expect(getInstance(ac.input)).toBe(ac);
  });

  it('toma opciones del atributo list y lo retira (sin datalist nativo)', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" list="countries" data-label="País">`);
    expect(ac.input.hasAttribute('list')).toBe(false);
    expect(ac.options).toHaveLength(6);
  });

  it('acepta data-options en JSON', () => {
    const ac = mount(`<input data-mtx="autocomplete" data-label="Fruta" data-options='[{"value":"a","label":"Apple"},"Banana"]'>`);
    expect(ac.options.map((o) => o.label)).toEqual(['Apple', 'Banana']);
  });

  it('avisa sin romper si data-options no es JSON válido', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ac = mount('<input data-mtx="autocomplete" data-label="X" data-options="[oops">');
    expect(ac.options).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('convierte un <select> (optgroup, selected, multiple) en autocomplete', () => {
    const ac = mount(`
      <label for="langs">Ext</label>
      <select data-mtx="autocomplete" id="langs" name="langs" multiple data-label="Lenguajes">
        <optgroup label="Front"><option value="js" selected>JavaScript</option><option value="ts">TypeScript</option></optgroup>
        <optgroup label="Back"><option value="py" selected>Python</option></optgroup>
      </select>`);
    expect(document.querySelector('select')).toBeNull();
    expect(ac.multiple).toBe(true);
    expect(ac.input.id).toBe('langs');
    expect(ac.value).toEqual(['js', 'py']);
    const hidden = ac.element.querySelectorAll('input[type="hidden"][name="langs"]');
    expect(Array.from(hidden).map((h) => h.value)).toEqual(['js', 'py']);
    expect(ac.element.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(2);
    expect(ac.options[0].group).toBe('Front');
  });

  it('un <select> simple sin selected explícito no elige la primera opción', () => {
    const ac = mount('<select data-mtx="autocomplete" data-label="X"><option value="a">A</option><option value="b">B</option></select>');
    expect(ac.value).toBe('');
    expect(ac.input.value).toBe('');
  });

  it('aplica variantes, tamaño, color, icono inicial, helper y error de TextField', () => {
    document.body.innerHTML = `
      <input data-mtx="autocomplete" id="a1" data-variant="filled" data-size="small" data-label="A">
      <input data-mtx="autocomplete" id="a2" data-variant="standard" data-start-icon="search" data-label="B">
      <input data-mtx="autocomplete" id="a3" data-color="secondary" data-helper-text="Ayuda" data-error="Obligatorio" data-label="C">`;
    initAll();
    const f1 = document.getElementById('a1').closest('.mtx-text-field');
    expect(f1.classList.contains('mtx-text-field--filled')).toBe(true);
    expect(f1.classList.contains('mtx-text-field--small')).toBe(true);
    const f2 = document.getElementById('a2').closest('.mtx-text-field');
    expect(f2.classList.contains('mtx-text-field--standard')).toBe(true);
    expect(f2.querySelector('.mtx-text-field__adornment--start').textContent).toBe('search');
    const f3 = document.getElementById('a3').closest('.mtx-text-field');
    expect(f3.classList.contains('mtx-text-field--secondary')).toBe(true);
    expect(f3.classList.contains('mtx-text-field--error')).toBe(true);
    expect(f3.querySelector('.mtx-text-field__helper-text').textContent).toBe('Obligatorio');
    expect(document.getElementById('a3').getAttribute('aria-invalid')).toBe('true');
    expect(getInstance(document.getElementById('a3')).popper.classList.contains('mtx-autocomplete__popper--secondary')).toBe(true);
  });

  it('soporta la sintaxis BEM completa con contenedor y datalist interno', () => {
    const ac = mount(`
      <div class="mtx-autocomplete" data-mtx="autocomplete" data-label="Ciudad">
        <div class="mtx-text-field mtx-text-field--outlined">
          <label class="mtx-text-field__label" for="city">Ciudad</label>
          <div class="mtx-text-field__container"><input class="mtx-text-field__input" id="city" name="city"></div>
        </div>
        <datalist><option value="bog">Bogotá</option><option value="med">Medellín</option></datalist>
      </div>`);
    expect(ac.input.id).toBe('city');
    expect(document.querySelectorAll('.mtx-text-field__label')).toHaveLength(1);
    expect(ac.options.map((o) => o.label)).toEqual(['Bogotá', 'Medellín']);
    expect(ac.element.querySelector('input[type="hidden"][name="city"]')).not.toBeNull();
  });

  it('lanza TypeError sin input ni select', () => {
    const div = document.createElement('div');
    expect(() => new Autocomplete(div)).toThrow(TypeError);
  });
});

describe('Autocomplete — apertura, filtrado y render', () => {
  let ac;
  beforeEach(() => {
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-label="País" data-options="#countries" name="country">`);
  });
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  it('open() muestra el listbox en el portal y actualiza ARIA', () => {
    const onOpen = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:open', onOpen);
    ac.open();
    expect(ac.isOpen).toBe(true);
    expect(ac.popper.isConnected).toBe(true);
    expect(document.getElementById('mtx-portal').contains(ac.popper)).toBe(true);
    expect(ac.input.getAttribute('aria-expanded')).toBe('true');
    expect(ac.input.getAttribute('aria-controls')).toBe(ac.listbox.id);
    expect(visibleLabels(ac)).toHaveLength(6);
    expect(ac.element.classList.contains('mtx-autocomplete--open')).toBe(true);
    expect(ac.popupButton.getAttribute('aria-label')).toBe('Close');
    expect(onOpen).toHaveBeenCalledTimes(1);
    ac.close();
    expect(ac.popper.isConnected).toBe(false);
    expect(ac.input.getAttribute('aria-expanded')).toBe('false');
    expect(ac.input.hasAttribute('aria-controls')).toBe(false);
    expect(ac.popupButton.getAttribute('aria-label')).toBe('Open');
  });

  it('filtra sin distinguir mayúsculas ni tildes y resalta la coincidencia', () => {
    type(ac, 'MEX');
    expect(ac.isOpen).toBe(true);
    expect(visibleLabels(ac)).toEqual(['México']);
    const mark = ac.listbox.querySelector('mark.mtx-autocomplete__highlight');
    expect(mark.textContent).toBe('Méx');
    type(ac, 'peru');
    expect(visibleLabels(ac)).toEqual(['Perú']);
  });

  it('data-match-from="start" filtra solo por el inicio', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-match-from="start">`);
    type(ac, 'l');
    expect(visibleLabels(ac)).toEqual([]);
    type(ac, 'c');
    expect(visibleLabels(ac)).toEqual(['Colombia', 'Chile']);
  });

  it('muestra "No options" (i18n) cuando no hay coincidencias', () => {
    type(ac, 'zzz');
    expect(ac.listbox.hidden).toBe(true);
    expect(ac.status.hidden).toBe(false);
    expect(ac.status.textContent).toBe('No options');
    expect(ac.input.getAttribute('aria-expanded')).toBe('false');
  });

  it('data-no-options-text personaliza el mensaje', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-no-options-text="Nada">`);
    type(ac, 'zzz');
    expect(ac.status.textContent).toBe('Nada');
  });

  it('opción deshabilitada con aria-disabled y no seleccionable por clic', () => {
    ac.open();
    const disabled = ac.listbox.querySelector('[aria-disabled="true"]');
    expect(disabled.textContent).toContain('Argentina');
    disabled.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ac.value).toBe('');
  });

  it('al abrir con un valor muestra todas las opciones y activa la seleccionada', () => {
    ac.value = 'pe';
    expect(ac.input.value).toBe('Perú');
    ac.open();
    expect(visibleLabels(ac)).toHaveLength(6);
    const active = document.getElementById(ac.input.getAttribute('aria-activedescendant'));
    expect(active.textContent).toContain('Perú');
    expect(active.getAttribute('aria-selected')).toBe('true');
  });

  it('anuncia el número de resultados en la región viva', () => {
    vi.useFakeTimers();
    type(ac, 'c');
    vi.advanceTimersByTime(400);
    expect(ac.live.textContent).toBe('3 results available');
    type(ac, 'colo');
    vi.advanceTimersByTime(400);
    expect(ac.live.textContent).toBe('1 result available');
    type(ac, 'qq');
    vi.advanceTimersByTime(400);
    expect(ac.live.textContent).toBe('No options');
    vi.useRealTimers();
  });

  it('mousedown en el input alterna el popup', () => {
    ac.input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    expect(ac.isOpen).toBe(true);
    ac.input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    expect(ac.isOpen).toBe(false);
  });

  it('el botón popup alterna y el mousedown del popper no roba el foco', () => {
    ac.popupButton.click();
    expect(ac.isOpen).toBe(true);
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    ac.listbox.querySelector('[role="option"]').dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    ac.popupButton.click();
    expect(ac.isOpen).toBe(false);
  });

  it('clic en una opción selecciona, cierra y emite change', () => {
    const onChange = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:change', onChange);
    ac.open();
    ac.listbox.querySelectorAll('[role="option"]')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ac.value).toBe('mx');
    expect(ac.input.value).toBe('México');
    expect(ac.isOpen).toBe(false);
    expect(ac.element.querySelector('input[type="hidden"]').value).toBe('mx');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toMatchObject({ value: 'mx', option: { value: 'mx', label: 'México' }, reason: 'selectOption' });
  });

  it('mousemove sobre una opción la activa sin desplazar', () => {
    ac.open();
    const opt = ac.listbox.querySelectorAll('[role="option"]')[2];
    opt.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    expect(ac.input.getAttribute('aria-activedescendant')).toBe(opt.id);
    expect(opt.classList.contains('mtx-autocomplete__option--focused')).toBe(true);
  });

  it('borrar el texto limpia el valor en selección única', () => {
    ac.value = 'co';
    type(ac, '');
    expect(ac.value).toBe('');
  });

  it('blur restaura el texto al valor (clearOnBlur) y cierra', () => {
    ac.value = 'co';
    ac.input.focus();
    type(ac, 'Col');
    ac.input.blur();
    expect(ac.input.value).toBe('Colombia');
    expect(ac.isOpen).toBe(false);
  });

  it('blur sin valor vacía el texto escrito', () => {
    ac.input.focus();
    type(ac, 'abc');
    ac.input.blur();
    expect(ac.input.value).toBe('');
  });
});

describe('Autocomplete — teclado', () => {
  let ac;
  beforeEach(() => {
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-label="País" data-options="#countries">`);
    ac.input.focus();
  });
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  const active = () => {
    const id = ac.input.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id).textContent : null;
  };

  it('ArrowDown abre sin activar; luego navega con aria-activedescendant', () => {
    press(ac.input, 'ArrowDown');
    expect(ac.isOpen).toBe(true);
    expect(active()).toBeNull();
    press(ac.input, 'ArrowDown');
    expect(active()).toBe('Colombia');
    press(ac.input, 'ArrowDown');
    expect(active()).toBe('México');
  });

  it('ArrowUp desde ninguna activa va a la última y envuelve', () => {
    press(ac.input, 'ArrowUp');
    press(ac.input, 'ArrowUp');
    expect(active()).toBe('Chile');
    press(ac.input, 'ArrowDown');
    expect(active()).toBe('Colombia');
  });

  it('salta opciones deshabilitadas', () => {
    press(ac.input, 'ArrowDown');
    for (let i = 0; i < 4; i += 1) press(ac.input, 'ArrowDown');
    expect(active()).toBe('España');
    press(ac.input, 'ArrowDown');
    expect(active()).toBe('Chile');
  });

  it('Home/End y PageUp/PageDown', () => {
    press(ac.input, 'ArrowDown');
    const end = press(ac.input, 'End');
    expect(end.defaultPrevented).toBe(true);
    expect(active()).toBe('Chile');
    press(ac.input, 'Home');
    expect(active()).toBe('Colombia');
    press(ac.input, 'PageDown');
    expect(active()).toBe('Chile');
    press(ac.input, 'PageUp');
    expect(active()).toBe('Colombia');
  });

  it('Enter selecciona la activa y previene el envío', () => {
    press(ac.input, 'ArrowDown');
    press(ac.input, 'ArrowDown');
    const enter = press(ac.input, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    expect(ac.value).toBe('co');
    expect(ac.isOpen).toBe(false);
  });

  it('Enter sin opción activa no previene el envío del formulario', () => {
    const enter = press(ac.input, 'Enter');
    expect(enter.defaultPrevented).toBe(false);
  });

  it('Escape cierra el popup y detiene la propagación', () => {
    const outer = vi.fn();
    press(ac.input, 'ArrowDown');
    document.body.addEventListener('keydown', outer);
    const esc = press(ac.input, 'Escape');
    expect(esc.defaultPrevented).toBe(true);
    expect(ac.isOpen).toBe(false);
    expect(outer).not.toHaveBeenCalled();
    document.body.removeEventListener('keydown', outer);
  });

  it('Escape con popup cerrado no limpia sin data-clear-on-escape', () => {
    ac.value = 'co';
    press(ac.input, 'Escape');
    expect(ac.value).toBe('co');
  });

  it('data-auto-highlight activa la primera opción al filtrar', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-auto-highlight>`);
    type(ac, 'e');
    expect(active()).toBe('México');
  });

  it('data-auto-select selecciona la activa con Tab', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-auto-highlight data-auto-select>`);
    ac.input.focus();
    type(ac, 'chi');
    press(ac.input, 'Tab');
    expect(ac.value).toBe('cl');
  });

  it('emite mtx:autocomplete:highlight con la opción activa', () => {
    const onHighlight = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:highlight', onHighlight);
    press(ac.input, 'ArrowDown');
    press(ac.input, 'ArrowDown');
    const last = onHighlight.mock.calls.at(-1)[0].detail;
    expect(last.option.value).toBe('co');
    expect(last.reason).toBe('keyboard');
  });
});

describe('Autocomplete — clearOnEscape, botón limpiar y free solo', () => {
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  it('data-clear-on-escape limpia con Escape cuando está cerrado', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-clear-on-escape data-value="co">`);
    expect(ac.input.value).toBe('Colombia');
    const onChange = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:change', onChange);
    press(ac.input, 'Escape');
    expect(ac.value).toBe('');
    expect(ac.input.value).toBe('');
    expect(onChange.mock.calls[0][0].detail.reason).toBe('clear');
  });

  it('botón limpiar: oculto sin valor, con aria-label i18n, limpia y emite', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries">`);
    expect(ac.clearButton.hidden).toBe(true);
    expect(ac.clearButton.getAttribute('aria-label')).toBe('Clear');
    expect(ac.clearButton.tabIndex).toBe(-1);
    ac.value = 'mx';
    expect(ac.clearButton.hidden).toBe(false);
    expect(ac.element.classList.contains('mtx-autocomplete--has-clear')).toBe(true);
    const onInput = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:input', onInput);
    ac.clearButton.click();
    expect(ac.value).toBe('');
    expect(ac.input.value).toBe('');
    expect(onInput.mock.calls[0][0].detail).toEqual({ inputValue: '', reason: 'clear' });
  });

  it('data-disable-clearable nunca muestra el botón limpiar', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-disable-clearable data-value="co">`);
    expect(ac.clearButton.hidden).toBe(true);
    type(ac, '');
    expect(ac.value).toBe('co');
  });

  it('free solo: Enter crea un valor libre, sin botón popup ni "No options"', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-free-solo name="q">`);
    expect(ac.popupButton.hidden).toBe(true);
    ac.input.focus();
    type(ac, 'Uruguay');
    expect(ac.popper.isConnected).toBe(false);
    press(ac.input, 'Enter');
    expect(ac.value).toBe('Uruguay');
    expect(ac.selectedOption.freeSolo).toBe(true);
    expect(ac.element.querySelector('input[type="hidden"]').value).toBe('Uruguay');
  });

  it('free solo: el texto se confirma al salir del campo y reutiliza opciones con igual etiqueta', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-free-solo>`);
    ac.input.focus();
    type(ac, 'mexico');
    ac.input.blur();
    expect(ac.value).toBe('mx');
  });

  it('data-force-popup-icon muestra el botón en free solo', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-free-solo data-force-popup-icon>`);
    expect(ac.popupButton.hidden).toBe(false);
  });
});

describe('Autocomplete — múltiple con chips', () => {
  let ac;
  beforeEach(() => {
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple data-label="Países" name="countries" data-value="co,mx">`);
  });
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  it('pinta chips eliminables y un input oculto por valor', () => {
    expect(ac.value).toEqual(['co', 'mx']);
    const tags = ac.element.querySelectorAll('.mtx-autocomplete__tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].classList.contains('mtx-chip')).toBe(true);
    expect(tags[0].querySelector('.mtx-chip__delete')).not.toBeNull();
    expect(tags[0].tabIndex).toBe(-1);
    expect(Array.from(ac.element.querySelectorAll('input[type="hidden"]')).map((h) => h.value)).toEqual(['co', 'mx']);
    expect(ac.listbox.getAttribute('aria-multiselectable')).toBe('true');
    expect(ac.field.classList.contains('mtx-text-field--has-value')).toBe(true);
  });

  it('seleccionar añade, volver a seleccionar quita (removeOption) y el texto se vacía', () => {
    const onChange = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:change', onChange);
    type(ac, 'per');
    ac.listbox.querySelector('[role="option"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ac.value).toEqual(['co', 'mx', 'pe']);
    expect(ac.input.value).toBe('');
    expect(onChange.mock.calls[0][0].detail).toMatchObject({ value: ['co', 'mx', 'pe'], reason: 'selectOption', option: { value: 'pe' } });
    expect(onChange.mock.calls[0][0].detail.options).toHaveLength(3);
    ac.open();
    ac.listbox.querySelectorAll('[role="option"]')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ac.value).toEqual(['mx', 'pe']);
    expect(onChange.mock.calls[1][0].detail.reason).toBe('removeOption');
  });

  it('Backspace con el texto vacío elimina el último chip', () => {
    ac.input.focus();
    press(ac.input, 'Backspace');
    expect(ac.value).toEqual(['co']);
  });

  it('el botón eliminar de un chip quita ese valor', () => {
    const tag = ac.element.querySelectorAll('.mtx-autocomplete__tag')[0];
    tag.querySelector('.mtx-chip__delete').click();
    expect(ac.value).toEqual(['mx']);
  });

  it('ArrowLeft lleva el foco a los chips y Backspace sobre un chip lo elimina', () => {
    ac.input.focus();
    ac.input.setSelectionRange(0, 0);
    press(ac.input, 'ArrowLeft');
    const tags = ac.element.querySelectorAll('.mtx-autocomplete__tag');
    expect(document.activeElement).toBe(tags[1]);
    press(tags[1], 'ArrowLeft');
    expect(document.activeElement).toBe(tags[0]);
    press(tags[0], 'ArrowRight');
    expect(document.activeElement).toBe(tags[1]);
    press(tags[1], 'ArrowRight');
    expect(document.activeElement).toBe(ac.input);
    press(ac.element.querySelectorAll('.mtx-autocomplete__tag')[0], 'Backspace');
    expect(ac.value).toEqual(['mx']);
  });

  it('marca aria-selected en las opciones elegidas', () => {
    ac.open();
    const selected = Array.from(ac.listbox.querySelectorAll('[aria-selected="true"]')).map((el) => el.textContent);
    expect(selected).toEqual(['Colombia', 'México']);
  });

  it('data-disable-close-on-select mantiene el popup abierto', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple data-disable-close-on-select>`);
    ac.open();
    ac.listbox.querySelectorAll('[role="option"]')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    ac.listbox.querySelectorAll('[role="option"]')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ac.isOpen).toBe(true);
    expect(ac.value).toEqual(['co', 'mx']);
  });

  it('data-filter-selected-options oculta las ya elegidas', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple data-filter-selected-options data-value='["co"]'>`);
    ac.open();
    expect(visibleLabels(ac)).not.toContain('Colombia');
  });

  it('data-limit-tags muestra +N sin foco y todos con foco', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple data-limit-tags="1" data-value="co,mx,pe">`);
    expect(ac.element.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(1);
    expect(ac.element.querySelector('.mtx-autocomplete__tag-more').textContent).toBe('+2');
    ac.input.focus();
    expect(ac.element.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(3);
    expect(ac.element.querySelector('.mtx-autocomplete__tag-more')).toBeNull();
    ac.input.blur();
    expect(ac.element.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(1);
  });

  it('free solo múltiple: Enter crea chips sin duplicados', () => {
    destroyAll(document.body);
    ac = mount('<input data-mtx="autocomplete" data-multiple data-free-solo data-options=\'["react"]\'>');
    type(ac, 'vue');
    const enter = press(ac.input, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    type(ac, 'vue');
    press(ac.input, 'Enter');
    expect(ac.value).toEqual(['vue']);
  });

  it('data-value-format="csv" envía un único campo separado', () => {
    destroyAll(document.body);
    ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple name="c" data-value-format="csv" data-separator="|" data-value="co|pe">`);
    const hidden = ac.element.querySelectorAll('input[type="hidden"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0].value).toBe('co|pe');
  });

  it('value admite arrays y objetos sin emitir change', () => {
    const onChange = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:change', onChange);
    ac.value = [{ value: 'pe' }, 'cl', 'cl'];
    expect(ac.value).toEqual(['pe', 'cl']);
    expect(ac.selectedOptions.map((o) => o.label)).toEqual(['Perú', 'Chile']);
    expect(onChange).not.toHaveBeenCalled();
    ac.value = null;
    expect(ac.value).toEqual([]);
  });
});

describe('Autocomplete — estados', () => {
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
  });

  it('disabled: input y botones deshabilitados, no abre, hidden deshabilitado', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" disabled name="c" data-value="co">`);
    expect(ac.disabled).toBe(true);
    expect(ac.input.disabled).toBe(true);
    expect(ac.popupButton.disabled).toBe(true);
    expect(ac.clearButton.hidden).toBe(true);
    expect(ac.element.querySelector('input[type="hidden"]').disabled).toBe(true);
    ac.open();
    expect(ac.isOpen).toBe(false);
    ac.enable();
    expect(ac.input.disabled).toBe(false);
    ac.open();
    expect(ac.isOpen).toBe(true);
    ac.disable();
    expect(ac.isOpen).toBe(false);
  });

  it('readonly: no abre, sin botón limpiar ni chips eliminables', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" readonly data-multiple data-value="co">`);
    expect(ac.input.readOnly).toBe(true);
    expect(ac.input.getAttribute('aria-readonly')).toBe('true');
    ac.open();
    expect(ac.isOpen).toBe(false);
    expect(ac.clearButton.hidden).toBe(true);
    expect(ac.element.querySelector('.mtx-chip__delete')).toBeNull();
    ac.input.focus();
    press(ac.input, 'Backspace');
    expect(ac.value).toEqual(['co']);
  });

  it('required: validación nativa según haya valor y texto no válido', () => {
    const ac = mount(`<form>${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" required name="c"></form>`);
    expect(ac.input.getAttribute('aria-required')).toBe('true');
    expect(ac.element.classList.contains('mtx-autocomplete--required')).toBe(true);
    expect(ac.input.checkValidity()).toBe(false);
    type(ac, 'zzz');
    expect(ac.input.validationMessage).toBe('Select an option from the list.');
    ac.value = 'co';
    expect(ac.input.checkValidity()).toBe(true);
    expect(ac.input.required).toBe(false);
  });

  it('required múltiple: válido en cuanto hay un chip', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple required>`);
    expect(ac.input.checkValidity()).toBe(false);
    ac.value = ['co'];
    expect(ac.input.checkValidity()).toBe(true);
  });

  it('loading: CircularProgress y texto "Loading…" sin opciones', () => {
    const ac = mount('<input data-mtx="autocomplete" data-label="Usuarios" data-loading>');
    expect(ac.loading).toBe(true);
    expect(ac.element.querySelector('.mtx-autocomplete__loading-indicator .mtx-circular-progress, .mtx-autocomplete__loading-indicator [data-mtx="circular-progress"]')).not.toBeNull();
    expect(ac.element.classList.contains('mtx-autocomplete--loading')).toBe(true);
    ac.open();
    expect(ac.status.textContent).toBe('Loading…');
    expect(ac.listbox.getAttribute('aria-busy')).toBe('true');
    ac.setLoading(false);
    expect(ac.status.textContent).toBe('No options');
    expect(ac.loadingSlot.hidden).toBe(true);
  });

  it('setError y clearError delegan en TextField', () => {
    const ac = mount('<input data-mtx="autocomplete" data-label="X">');
    ac.setError('Mal');
    expect(ac.field.classList.contains('mtx-text-field--error')).toBe(true);
    expect(ac.input.getAttribute('aria-invalid')).toBe('true');
    ac.clearError();
    expect(ac.field.classList.contains('mtx-text-field--error')).toBe(false);
  });
});

describe('Autocomplete — carga asíncrona y API', () => {
  afterEach(() => {
    destroyAll(document.body);
    document.querySelectorAll('.mtx-autocomplete__popper').forEach((el) => el.remove());
    vi.useRealTimers();
  });

  it('emite mtx:autocomplete:input con debounce y setOptions actualiza la lista', () => {
    vi.useFakeTimers();
    const ac = mount('<input data-mtx="autocomplete" data-label="Repos" data-debounce="300" data-filter="false">');
    const onInput = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:input', onInput);
    type(ac, 'm');
    type(ac, 'ma');
    type(ac, 'mat');
    expect(onInput).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput.mock.calls[0][0].detail).toEqual({ inputValue: 'mat', reason: 'input' });
    ac.setOptions([{ value: 1, label: 'materix-ui' }, { value: 2, label: 'mui' }]);
    expect(ac.isOpen).toBe(true);
    // data-filter="false": el servidor decide; no se filtra localmente.
    expect(visibleLabels(ac)).toEqual(['materix-ui', 'mui']);
  });

  it('setOptions conserva el valor y actualiza su etiqueta', () => {
    const ac = mount('<input data-mtx="autocomplete" data-value="co">');
    expect(ac.input.value).toBe('co');
    ac.setOptions([{ value: 'co', label: 'Colombia' }]);
    expect(ac.input.value).toBe('Colombia');
    expect(ac.selectedOption.label).toBe('Colombia');
  });

  it('inputValue get/set refiltra sin emitir eventos', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries">`);
    const onInput = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:input', onInput);
    ac.open();
    ac.inputValue = 'chi';
    expect(ac.inputValue).toBe('chi');
    expect(visibleLabels(ac)).toEqual(['Chile']);
    expect(onInput).not.toHaveBeenCalled();
  });

  it('clear() vacía y emite change con reason clear', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-value="co">`);
    const onChange = vi.fn();
    ac.element.addEventListener('mtx:autocomplete:change', onChange);
    ac.clear();
    expect(ac.value).toBe('');
    expect(onChange.mock.calls[0][0].detail).toMatchObject({ value: '', option: null, reason: 'clear' });
  });

  it('emite open y close con el motivo', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries">`);
    const reasons = [];
    ac.element.addEventListener('mtx:autocomplete:close', (e) => reasons.push(e.detail.reason));
    ac.open();
    press(ac.input, 'Escape');
    expect(reasons).toEqual(['escape']);
  });

  it('data-open-on-focus abre al enfocar', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-open-on-focus>`);
    ac.input.focus();
    expect(ac.isOpen).toBe(true);
  });

  it('el reset del formulario restaura el valor inicial', () => {
    vi.useFakeTimers();
    const ac = mount(`<form id="f">${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" name="c" data-value="co"></form>`);
    ac.value = 'mx';
    document.getElementById('f').reset();
    vi.advanceTimersByTime(1);
    expect(ac.value).toBe('co');
    expect(ac.input.value).toBe('Colombia');
  });

  it('envía el valor con FormData', () => {
    const ac = mount(`<form id="f">${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" data-multiple name="c"></form>`);
    ac.value = ['pe', 'cl'];
    expect(new FormData(document.getElementById('f')).getAll('c')).toEqual(['pe', 'cl']);
  });

  it('textos i18n en español y refresco con mtx:localechange', () => {
    const ac = mount(`<div lang="es">${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries"></div>`);
    expect(ac.clearButton.getAttribute('aria-label')).toBe('Borrar');
    expect(ac.popupButton.getAttribute('aria-label')).toBe('Abrir');
    type(ac, 'zzz');
    expect(ac.status.textContent).toBe('Sin opciones');
    ac.element.closest('[lang]').setAttribute('lang', 'en');
    setLocale('en');
    expect(ac.clearButton.getAttribute('aria-label')).toBe('Clear');
  });

  it('destroy libera el popup, desregistra y permite reinicializar sin duplicar', () => {
    const ac = mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries" name="c">`);
    ac.open();
    const input = ac.input;
    ac.destroy();
    expect(ac.popper.isConnected).toBe(false);
    expect(getInstance(input)).toBeUndefined();
    expect(input.hasAttribute('data-mtx-initialized')).toBe(false);
    expect(input.getAttribute('name')).toBe('c');
    type(ac, 'col');
    expect(ac.isOpen).toBe(false);
    initAll();
    const again = getInstance(input);
    expect(again).toBeInstanceOf(Autocomplete);
    expect(again).not.toBe(ac);
    expect(document.querySelectorAll('.mtx-autocomplete')).toHaveLength(1);
    expect(document.querySelectorAll('.mtx-autocomplete__end-adornment')).toHaveLength(1);
    expect(again.element.querySelectorAll('input[type="hidden"][name="c"]')).toHaveLength(1);
  });

  it('destroyAll no falla aunque la instancia esté registrada en varios nodos', () => {
    mount(`${COUNTRIES}<input data-mtx="autocomplete" data-options="#countries">`);
    expect(() => destroyAll(document.body)).not.toThrow();
  });
});
