import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/index.js';

describe('Checkbox / Switch / Radio — configuración y ARIA (A10)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['checkbox', 'checkbox', 'mtx-checkbox'],
    ['switch', 'checkbox', 'mtx-switch'],
    ['radio', 'radio', 'mtx-radio'],
  ])('%s no copia data-* de configuración al <label> generado', (name, type, base) => {
    document.body.innerHTML =
      `<input id="x" type="${type}" class="${base}--small extra" data-mtx="${name}" data-label="L" data-size="small" data-color="secondary" data-helper-text="H" />`;
    initAll();
    const input = document.getElementById('x');
    const label = input.closest(`.${base}`);
    expect(label.tagName).toBe('LABEL');
    expect(label.classList.contains(base)).toBe(true);
    expect(label.classList.contains('extra')).toBe(true);
    expect(label.classList.contains(`${base}--small`)).toBe(true);
    expect(label.classList.contains(`${base}--secondary`)).toBe(true);
    ['data-mtx', 'data-label', 'data-size', 'data-color', 'data-helper-text'].forEach((attr) => {
      expect(label.hasAttribute(attr)).toBe(false);
    });
    expect(label.querySelector(`.${base}__label`).textContent).toBe('L');
    // Idempotencia: una segunda pasada no duplica nada.
    initAll();
    expect(document.querySelectorAll(`.${base}`).length).toBe(1);
    expect(getInstance(input)).toBe(getInstance(label));
  });

  it('Checkbox: setters sincronizan aria-checked y toggle limpia indeterminate', () => {
    document.body.innerHTML = '<input id="c" type="checkbox" data-mtx="checkbox" data-label="C" data-indeterminate />';
    initAll();
    const input = document.getElementById('c');
    const cb = getInstance(input);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    cb.indeterminate = false;
    expect(input.getAttribute('aria-checked')).toBe('false');
    cb.indeterminate = true;
    cb.toggle();
    expect(cb.indeterminate).toBe(false);
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('Switch: role="switch" y aria-checked sincronizado', () => {
    document.body.innerHTML = '<input id="s" type="checkbox" data-mtx="switch" data-label="S" checked />';
    initAll();
    const input = document.getElementById('s');
    const sw = getInstance(input);
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.getAttribute('aria-checked')).toBe('true');
    sw.checked = false;
    expect(input.getAttribute('aria-checked')).toBe('false');
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('Radio no añade aria-checked (estado nativo)', () => {
    document.body.innerHTML = '<input id="r" type="radio" name="g" data-mtx="radio" aria-checked="true" />';
    initAll();
    expect(document.getElementById('r').hasAttribute('aria-checked')).toBe(false);
  });

  it('RadioGroup añade role="radiogroup", respeta un role existente y data-row', () => {
    document.body.innerHTML = `
      <div id="g1" data-mtx="radio-group" data-row><input type="radio" name="a" data-mtx="radio" /></div>
      <div id="g2" data-mtx="radio-group" role="group"><input type="radio" name="b" data-mtx="radio" /></div>`;
    initAll();
    const g1 = document.getElementById('g1');
    expect(g1.getAttribute('role')).toBe('radiogroup');
    expect(g1.classList.contains('mtx-radio-group--row')).toBe(true);
    expect(document.getElementById('g2').getAttribute('role')).toBe('group');
  });

  it('RadioGroup disable()/enable() afecta a todos los radios', () => {
    document.body.innerHTML = `
      <div id="g" data-mtx="radio-group" data-name="p">
        <input type="radio" name="p" value="1" data-mtx="radio" />
        <input type="radio" name="p" value="2" data-mtx="radio" />
      </div>`;
    initAll();
    const group = getInstance(document.getElementById('g'));
    group.disable();
    expect(group.disabled).toBe(true);
    expect(document.getElementById('g').getAttribute('aria-disabled')).toBe('true');
    group.enable();
    expect(group.disabled).toBe(false);
  });
});
