import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/index.js';
import Materix from '../src/index.js';
import { parseErrorAttribute } from '../src/components/form-helper-text/form-helper-text.js';

describe('FormHelperText', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('parseErrorAttribute distingue booleano y mensaje', () => {
    expect(parseErrorAttribute(null)).toEqual({ error: false, message: '' });
    expect(parseErrorAttribute('false')).toEqual({ error: false, message: '' });
    expect(parseErrorAttribute('')).toEqual({ error: true, message: '' });
    expect(parseErrorAttribute('true')).toEqual({ error: true, message: '' });
    expect(parseErrorAttribute('Obligatorio')).toEqual({ error: true, message: 'Obligatorio' });
  });

  it('se inicializa de forma declarativa con data-error', () => {
    document.body.innerHTML = '<p data-mtx="form-helper-text" data-error>Requerido</p>';
    initAll();
    const el = document.querySelector('p');
    const helper = getInstance(el);
    expect(el.classList.contains('mtx-form-helper-text')).toBe(true);
    expect(el.classList.contains('mtx-form-helper-text--error')).toBe(true);
    expect(el.id).toMatch(/^mtx-form-helper-text-/);
    helper.error = false;
    helper.setText('Opcional');
    expect(el.classList.contains('mtx-form-helper-text--error')).toBe(false);
    expect(el.textContent).toBe('Opcional');
  });

  it('se expone en Materix junto a RadioGroup', () => {
    expect(typeof Materix.FormHelperText).toBe('function');
    expect(typeof Materix.RadioGroup).toBe('function');
  });

  it('Checkbox con data-helper-text crea FormControl y aria-describedby', () => {
    document.body.innerHTML =
      '<input id="cb" type="checkbox" data-mtx="checkbox" data-label="Acepto" data-helper-text="Lee las condiciones" />';
    initAll();
    const input = document.getElementById('cb');
    const control = input.closest('.mtx-form-control');
    expect(control).not.toBeNull();
    const helper = control.querySelector('.mtx-form-helper-text');
    expect(helper.textContent).toBe('Lee las condiciones');
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
    // El helper queda fuera del <label> (no forma parte del nombre accesible).
    expect(input.closest('label').contains(helper)).toBe(false);
  });

  it('Checkbox setError/clearError alterna mensaje, clase y aria-invalid', () => {
    document.body.innerHTML =
      '<input id="cb" type="checkbox" data-mtx="checkbox" data-label="Acepto" data-helper-text="Ayuda" />';
    initAll();
    const input = document.getElementById('cb');
    const cb = getInstance(input);
    cb.setError('Debes aceptar');
    const helper = input.closest('.mtx-form-control').querySelector('.mtx-form-helper-text');
    expect(helper.textContent).toBe('Debes aceptar');
    expect(helper.classList.contains('mtx-form-helper-text--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(cb.error).toBe(true);
    cb.clearError();
    expect(helper.textContent).toBe('Ayuda');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('Checkbox con data-error de texto crea el mensaje sin helper previo', () => {
    document.body.innerHTML =
      '<input id="cb" type="checkbox" data-mtx="checkbox" data-label="Acepto" aria-describedby="ext" data-error="Obligatorio" />';
    initAll();
    const input = document.getElementById('cb');
    const helper = input.closest('.mtx-form-control').querySelector('.mtx-form-helper-text');
    expect(helper.textContent).toBe('Obligatorio');
    expect(input.getAttribute('aria-describedby')).toBe(`ext ${helper.id}`);
    getInstance(input).clearError();
    expect(input.closest('.mtx-form-control').querySelector('.mtx-form-helper-text')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('ext');
  });

  it('Checkbox BEM dentro de .mtx-form-control enlaza el helper existente', () => {
    document.body.innerHTML = `
      <div class="mtx-form-control">
        <label class="mtx-checkbox" data-mtx="checkbox"><input type="checkbox" /><span class="mtx-checkbox__label">X</span></label>
        <p class="mtx-form-helper-text">Texto previo</p>
      </div>`;
    initAll();
    const input = document.querySelector('input');
    const helper = document.querySelector('.mtx-form-helper-text');
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('Switch con data-helper-text y data-error booleano', () => {
    document.body.innerHTML =
      '<input id="sw" type="checkbox" data-mtx="switch" data-label="Wifi" data-helper-text="Consume batería" data-error />';
    initAll();
    const input = document.getElementById('sw');
    const helper = input.closest('.mtx-form-control').querySelector('.mtx-form-helper-text');
    expect(helper.textContent).toBe('Consume batería');
    expect(helper.classList.contains('mtx-form-helper-text--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('RadioGroup con data-label, data-helper-text y error', () => {
    document.body.innerHTML = `
      <div id="g" data-mtx="radio-group" data-name="plan" data-label="Plan" data-helper-text="Puedes cambiarlo">
        <input type="radio" data-mtx="radio" value="a" data-label="A" />
        <input type="radio" data-mtx="radio" value="b" data-label="B" />
      </div>`;
    initAll();
    const group = document.getElementById('g');
    const control = group.closest('.mtx-form-control');
    const label = control.querySelector('.mtx-form-label');
    const helper = control.querySelector('.mtx-form-helper-text');
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-labelledby')).toBe(label.id);
    expect(group.getAttribute('aria-describedby')).toBe(helper.id);
    // data-name asigna name a los radios sin él.
    expect([...group.querySelectorAll('input')].every((r) => r.name === 'plan')).toBe(true);

    const instance = getInstance(group);
    instance.setError('Elige un plan');
    expect(helper.textContent).toBe('Elige un plan');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(control.classList.contains('mtx-form-control--error')).toBe(true);
    instance.clearError();
    expect(group.hasAttribute('aria-invalid')).toBe(false);
  });

  it('respeta aria-invalid escrito por el autor si no hay error gestionado', () => {
    document.body.innerHTML =
      '<input id="cb" type="checkbox" data-mtx="checkbox" data-label="X" aria-invalid="true" data-helper-text="h" />';
    initAll();
    expect(document.getElementById('cb').getAttribute('aria-invalid')).toBe('true');
  });

  it('marca aria-disabled en el texto de ayuda de un control deshabilitado y lo sincroniza', () => {
    document.body.innerHTML =
      '<input id="sw" type="checkbox" data-mtx="switch" data-label="X" data-helper-text="Siempre activo" disabled />';
    initAll();
    const input = document.getElementById('sw');
    const helper = document.getElementById(input.getAttribute('aria-describedby'));
    expect(helper.getAttribute('aria-disabled')).toBe('true');
    const sw = getInstance(input.closest('.mtx-switch') || input);
    sw.enable();
    expect(helper.hasAttribute('aria-disabled')).toBe(false);
    sw.disable();
    expect(helper.getAttribute('aria-disabled')).toBe('true');
  });
});
