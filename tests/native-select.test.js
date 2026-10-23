import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { NativeSelect } from '../src/components/native-select/native-select.js';

function createNativeSelect(attrs = {}, options = ['Opción 1', 'Opción 2']) {
  const container = document.createElement('div');
  container.className = 'mtx-native-select';
  container.setAttribute('data-mtx', 'native-select');
  Object.entries(attrs).forEach(([k, v]) => container.setAttribute(k, v));

  const select = document.createElement('select');
  options.forEach((opt, i) => {
    const option = document.createElement('option');
    option.value = String(i + 1);
    option.textContent = opt;
    select.appendChild(option);
  });
  container.appendChild(select);
  document.body.appendChild(container);
  return container;
}

describe('NativeSelect', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa e inserta el icono chevron', () => {
    const container = createNativeSelect();
    initAll();
    const nativeSelect = getInstance(container);
    expect(nativeSelect).toBeInstanceOf(NativeSelect);

    const chevron = container.querySelector('.mtx-native-select__chevron');
    expect(chevron).not.toBeNull();
  });

  it('permite leer y modificar el valor', () => {
    const container = createNativeSelect();
    initAll();
    const nativeSelect = getInstance(container);

    expect(nativeSelect.value).toBe('1');
    nativeSelect.value = '2';
    expect(nativeSelect.value).toBe('2');
  });

  it('aplica estado de error y atributo aria-invalid', () => {
    const container = createNativeSelect({ 'data-error': '' });
    initAll();
    const select = container.querySelector('select');
    expect(container.classList.contains('mtx-native-select--error')).toBe(true);
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });

  it('permite habilitar y deshabilitar', () => {
    const container = createNativeSelect();
    initAll();
    const nativeSelect = getInstance(container);

    nativeSelect.disable();
    expect(nativeSelect.disabled).toBe(true);

    nativeSelect.enable();
    expect(nativeSelect.disabled).toBe(false);
  });

  it('soporta sintaxis single-element y autoconstruye etiqueta', () => {
    const select = document.createElement('select');
    select.setAttribute('data-mtx', 'native-select');
    select.setAttribute('data-label', 'País');
    const opt = document.createElement('option');
    opt.value = 'co';
    opt.textContent = 'Colombia';
    select.appendChild(opt);
    document.body.appendChild(select);

    initAll();
    const label = document.querySelector('.mtx-native-select__label');
    expect(label).not.toBeNull();
    expect(label.textContent).toBe('País');
  });

  it('single-element: concatena class (AGENTS §6.3), variante standard por defecto y label con for/id', () => {
    document.body.innerHTML = '<select class="mtx-native-select--small extra" data-mtx="native-select" data-label="País"><option value="co">Colombia</option></select>';
    initAll();
    const wrapper = document.querySelector('.mtx-native-select');
    const select = wrapper.querySelector('select');
    const label = wrapper.querySelector('label');
    expect(wrapper.classList.contains('mtx-native-select')).toBe(true);
    expect(wrapper.classList.contains('extra')).toBe(true);
    expect(wrapper.classList.contains('mtx-native-select--small')).toBe(true);
    expect(wrapper.classList.contains('mtx-native-select--standard')).toBe(true);
    expect(wrapper.classList.contains('mtx-native-select--has-label')).toBe(true);
    expect(select.id).not.toBe('');
    expect(label.htmlFor).toBe(select.id);
    expect(select.labels[0]).toBe(label);
  });

  it('respeta data-variant y la variante declarada por clase BEM', () => {
    const a = createNativeSelect({ 'data-variant': 'filled' });
    const b = createNativeSelect();
    b.classList.add('mtx-native-select--outlined');
    initAll();
    expect(a.classList.contains('mtx-native-select--filled')).toBe(true);
    expect(a.classList.contains('mtx-native-select--standard')).toBe(false);
    expect(b.classList.contains('mtx-native-select--outlined')).toBe(true);
    expect(b.classList.contains('mtx-native-select--standard')).toBe(false);
  });

  it('rellena un chevron BEM vacío y marca la variante múltiple', () => {
    const container = createNativeSelect({ 'data-variant': 'outlined' });
    const chevron = document.createElement('span');
    chevron.className = 'mtx-native-select__chevron';
    container.appendChild(chevron);
    container.querySelector('select').multiple = true;
    initAll();
    expect(chevron.querySelector('svg')).not.toBeNull();
    expect(chevron.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.mtx-native-select__chevron')).toHaveLength(1);
    expect(container.classList.contains('mtx-native-select--multiple')).toBe(true);
  });
});
