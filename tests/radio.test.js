import { describe, it, expect, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/radio/radio.js';

describe('Radio', () => {
  it('inicializa correctamente a partir de un input envuelto en label', () => {
    const label = document.createElement('label');
    label.className = 'mtx-radio';
    label.setAttribute('data-mtx', 'radio');
    const input = document.createElement('input');
    input.type = 'radio';
    input.checked = true;
    label.appendChild(input);
    document.body.appendChild(label);
    
    initAll();

    const radio = getInstance(label);
    expect(radio).toBeDefined();
    expect(radio.checked).toBe(true);
    expect(label.querySelector('.mtx-radio__box')).not.toBeNull();
  });

  it('permite auto-construcción a partir de un input simple', () => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.setAttribute('data-mtx', 'radio');
    input.setAttribute('data-label', 'AutoLabel');
    document.body.appendChild(input);

    initAll();

    const wrapper = input.parentElement;
    expect(wrapper.classList.contains('mtx-radio')).toBe(true);
    expect(wrapper.querySelector('.mtx-radio__label').textContent).toBe('AutoLabel');
  });

  it('cambia el estado y lo expone a través del getter/setter', () => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.setAttribute('data-mtx', 'radio');
    document.body.appendChild(input);
    initAll();

    const radio = getInstance(input);
    expect(radio.checked).toBe(false);

    radio.checked = true;
    expect(radio.checked).toBe(true);
    expect(input.checked).toBe(true);
  });

  it('respeta la inicialización con tamaño small', () => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.setAttribute('data-mtx', 'radio');
    input.setAttribute('data-size', 'small');
    document.body.appendChild(input);
    initAll();

    const wrapper = input.parentElement;
    expect(wrapper.classList.contains('mtx-radio--small')).toBe(true);
  });

  it('puede destruirse correctamente', () => {
    const label = document.createElement('label');
    label.setAttribute('data-mtx', 'radio');
    label.innerHTML = '<input type="radio" />';
    document.body.appendChild(label);
    initAll();
    
    const radio = getInstance(label);
    expect(() => radio.destroy()).not.toThrow();
  });

  describe('RadioGroup', () => {
    it('agrupa radios y obtiene/establece el valor correctamente', () => {
      const groupDiv = document.createElement('div');
      groupDiv.setAttribute('data-mtx', 'radio-group');
      groupDiv.setAttribute('data-name', 'opciones');
      groupDiv.innerHTML = `
        <label><input type="radio" name="opciones" value="op1" /></label>
        <label><input type="radio" name="opciones" value="op2" /></label>
      `;
      document.body.appendChild(groupDiv);
      initAll();
      
      const group = getInstance(groupDiv);
      expect(group.value).toBe('');

      group.value = 'op2';
      expect(group.value).toBe('op2');
      const radio2 = groupDiv.querySelectorAll('input[type="radio"]')[1];
      expect(radio2.checked).toBe(true);
    });

    it('emite el evento mtx:radio-group:change cuando cambia el radio seleccionado', () => {
      const groupDiv = document.createElement('div');
      groupDiv.setAttribute('data-mtx', 'radio-group');
      groupDiv.innerHTML = `
        <label><input type="radio" name="g2" value="A" /></label>
        <label><input type="radio" name="g2" value="B" /></label>
      `;
      document.body.appendChild(groupDiv);
      initAll();
      
      const spy = vi.fn();
      groupDiv.addEventListener('mtx:radio-group:change', spy);

      const radioB = groupDiv.querySelectorAll('input[type="radio"]')[1];
      radioB.checked = true;
      radioB.dispatchEvent(new Event('change', { bubbles: true }));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.value).toBe('B');
    });
  });
});
