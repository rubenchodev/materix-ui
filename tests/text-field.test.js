import { describe, it, expect, beforeEach } from 'vitest';
import { init, initAll, getInstance } from '../src/core/registry.js';
import { TextField } from '../src/components/text-field/text-field.js';

function createField(attrs = {}, inputAttrs = {}) {
  const el = document.createElement('div');
  el.className = 'mtx-text-field mtx-text-field--outlined';
  el.setAttribute('data-mtx', 'text-field');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));

  const label = document.createElement('label');
  label.className = 'mtx-text-field__label';
  label.setAttribute('for', 'tf-test');
  label.textContent = 'Nombre';
  el.appendChild(label);

  const container = document.createElement('div');
  container.className = 'mtx-text-field__container';

  const input = document.createElement('input');
  input.className = 'mtx-text-field__input';
  input.id = 'tf-test';
  input.type = 'text';
  input.placeholder = ' ';
  Object.entries(inputAttrs).forEach(([k, v]) => {
    if (k === 'disabled') {
      input.disabled = v;
    } else {
      input.setAttribute(k, v);
    }
  });
  container.appendChild(input);
  el.appendChild(container);

  document.body.appendChild(el);
  return el;
}

describe('TextField', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createField();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('expone value y sincroniza el estado has-value', () => {
    const el = createField();
    initAll();
    const field = getInstance(el);

    expect(field.value).toBe('');
    expect(el.classList.contains('mtx-text-field--has-value')).toBe(false);

    field.value = 'Hola';
    expect(el.classList.contains('mtx-text-field--has-value')).toBe(true);
    expect(field.value).toBe('Hola');
  });

  it('detecta un valor inicial en el input', () => {
    const el = createField({}, { value: 'Inicial' });
    initAll();
    const field = getInstance(el);

    expect(field.value).toBe('Inicial');
    expect(el.classList.contains('mtx-text-field--has-value')).toBe(true);
  });

  it('muestra error declarativo con data-error', () => {
    const el = createField({ 'data-error': 'Correo inválido' });
    initAll();

    expect(el.classList.contains('mtx-text-field--error')).toBe(true);
    expect(el.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    const support = el.querySelector('.mtx-text-field__supporting-text');
    expect(support).not.toBeNull();
    expect(support.textContent).toBe('Correo inválido');
  });

  it('setError() y clearError() gestionan el estado de error', () => {
    const el = createField();
    initAll();
    const field = getInstance(el);

    field.setError('Obligatorio');
    const input = el.querySelector('input');
    expect(el.classList.contains('mtx-text-field--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('tf-test-error');

    field.clearError();
    expect(el.classList.contains('mtx-text-field--error')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('disable() y enable() controlan el input', () => {
    const el = createField();
    initAll();
    const field = getInstance(el);

    field.disable();
    expect(el.querySelector('input').disabled).toBe(true);

    field.enable();
    expect(el.querySelector('input').disabled).toBe(false);
  });

  it('inyecta el fieldset en la variante outlined', () => {
    const el = createField();
    initAll();

    expect(el.querySelector('.mtx-text-field__outline')).not.toBeNull();
    expect(el.querySelector('.mtx-text-field__outline').getAttribute('aria-hidden')).toBe('true');
  });

  it('inyecta el legend cuando hay un label', () => {
    const el = createField();
    initAll();

    expect(el.querySelector('.mtx-text-field__legend')).not.toBeNull();
  });

  it('no inyecta legend en un campo outlined sin label', () => {
    const el = document.createElement('div');
    el.className = 'mtx-text-field mtx-text-field--outlined mtx-text-field--hidden-label';
    el.setAttribute('data-mtx', 'text-field');

    const container = document.createElement('div');
    container.className = 'mtx-text-field__container';

    const input = document.createElement('input');
    input.className = 'mtx-text-field__input';
    input.type = 'text';
    input.placeholder = ' ';
    container.appendChild(input);
    el.appendChild(container);
    document.body.appendChild(el);

    initAll();

    expect(el.querySelector('.mtx-text-field__outline')).not.toBeNull();
    expect(el.querySelector('.mtx-text-field__legend')).toBeNull();
  });

  it('auto-construye la estructura HTML a partir de un solo elemento <input> con data-mtx', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'text-field');
    input.setAttribute('data-label', 'Correo');
    input.setAttribute('data-variant', 'outlined');
    input.setAttribute('data-start-icon', 'email');
    input.setAttribute('data-helper-text', 'Texto de ayuda');
    input.type = 'email';
    document.body.appendChild(input);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    expect(wrapper).not.toBeNull();
    expect(wrapper.querySelector('.mtx-text-field__label').textContent).toBe('Correo');
    expect(wrapper.querySelector('.mtx-text-field__adornment--start').textContent).toBe('email');
    expect(wrapper.querySelector('.mtx-text-field__supporting-text').textContent).toBe('Texto de ayuda');
    expect(wrapper.querySelector('.mtx-text-field__outline')).not.toBeNull();
  });

  it('auto-construye la estructura a partir de un elemento <select> con data-mtx="text-field"', () => {
    const select = document.createElement('select');
    select.setAttribute('data-mtx', 'text-field');
    select.setAttribute('data-label', 'País');
    const opt = document.createElement('option');
    opt.value = 'co';
    opt.textContent = 'Colombia';
    select.appendChild(opt);
    document.body.appendChild(select);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field--select');
    expect(wrapper).not.toBeNull();
    expect(wrapper.querySelector('.mtx-text-field__label').textContent).toBe('País');
    expect(wrapper.querySelector('.mtx-text-field__chevron')).not.toBeNull();
    expect(wrapper.classList.contains('mtx-text-field--has-value')).toBe(true);
  });

  it('permite inicialización manual individual con init(input)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'text-field');
    input.setAttribute('data-label', 'Manual Init');
    document.body.appendChild(input);

    const instance = init(input);
    expect(instance).toBeInstanceOf(TextField);
    expect(instance.value).toBe('');
    instance.value = 'Probando';
    expect(instance.value).toBe('Probando');
  });

  it('permite instanciación directa con new TextField(input)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-label', 'Clase Directa');
    document.body.appendChild(input);

    const instance = new TextField(input);
    expect(instance).toBeInstanceOf(TextField);
    expect(getInstance(instance.element)).toBe(instance);
  });

  it('soporta URL de imagen en data-start-icon creando un elemento <img>', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'text-field');
    input.setAttribute('data-label', 'Teléfono');
    input.setAttribute('data-start-icon', 'https://flagcdn.com/w20/co.png');
    document.body.appendChild(input);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    const img = wrapper.querySelector('.mtx-text-field__adornment--image');
    expect(img).not.toBeNull();
    expect(img.tagName.toLowerCase()).toBe('img');
    expect(img.getAttribute('src')).toBe('https://flagcdn.com/w20/co.png');
  });

  it('permite inicialización ultra-fácil con placeholder como label automático y data-mtx="input"', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'input');
    input.setAttribute('placeholder', 'Nombre completo');
    input.type = 'text';
    document.body.appendChild(input);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    expect(wrapper).not.toBeNull();
    const label = wrapper.querySelector('.mtx-text-field__label');
    expect(label).not.toBeNull();
    expect(label.textContent).toBe('Nombre completo');
    expect(wrapper.classList.contains('mtx-text-field--outlined')).toBe(true);
  });

  it('permite inicializar textarea directamente con data-mtx="textarea"', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-mtx', 'textarea');
    textarea.setAttribute('placeholder', 'Comentarios');
    document.body.appendChild(textarea);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    expect(wrapper).not.toBeNull();
    expect(wrapper.classList.contains('mtx-text-field--multiline')).toBe(true);
    expect(wrapper.querySelector('.mtx-text-field__label').textContent).toBe('Comentarios');
    expect(textarea.getAttribute('rows')).toBe('3');
  });

  it('soporta contador de caracteres y valida límite máximo', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'text-field');
    input.setAttribute('data-label', 'Mensaje');
    input.setAttribute('data-counter', 'characters');
    input.setAttribute('data-max-characters', '10');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    const counter = instance.counterEl;
    expect(counter).not.toBeNull();
    expect(counter.textContent).toBe('0 / 10');

    instance.value = 'Hola';
    expect(counter.textContent).toBe('4 / 10');
    expect(counter.classList.contains('mtx-text-field__counter--error')).toBe(false);

    instance.value = 'Hola mundo más de diez';
    expect(counter.textContent).toBe('22 / 10');
    expect(counter.classList.contains('mtx-text-field__counter--error')).toBe(true);
    expect(instance.element.classList.contains('mtx-text-field--error')).toBe(true);

    instance.value = 'Menos';
    expect(counter.classList.contains('mtx-text-field__counter--error')).toBe(false);
    expect(instance.element.classList.contains('mtx-text-field--error')).toBe(false);
  });

  it('soporta contador de palabras y valida límite de palabras', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-mtx', 'textarea');
    textarea.setAttribute('data-label', 'Resumen');
    textarea.setAttribute('data-counter', 'words');
    textarea.setAttribute('data-max-words', '3');
    document.body.appendChild(textarea);

    initAll();

    const instance = getInstance(textarea);
    const counter = instance.counterEl;
    expect(counter).not.toBeNull();
    expect(counter.textContent).toBe('0 / 3');

    instance.value = 'Uno dos';
    expect(counter.textContent).toBe('2 / 3');
    expect(counter.classList.contains('mtx-text-field__counter--error')).toBe(false);

    instance.value = 'Uno dos tres cuatro palabras';
    expect(counter.textContent).toBe('5 / 3');
    expect(counter.classList.contains('mtx-text-field__counter--error')).toBe(true);
    expect(instance.element.classList.contains('mtx-text-field--error')).toBe(true);
  });

  it('convierte input con data-multiline="true" a textarea automáticamente', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'input');
    input.setAttribute('data-label', 'Notas');
    input.setAttribute('data-multiline', 'true');
    input.setAttribute('data-rows', '5');
    document.body.appendChild(input);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    expect(wrapper.classList.contains('mtx-text-field--multiline')).toBe(true);
    const textarea = wrapper.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea.getAttribute('rows')).toBe('5');
  });

  it('aplica máscara basada en patrón y extrae unmaskedValue', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'input');
    input.setAttribute('data-mask', '(000) 000-0000');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance.isMaskComplete).toBe(false);

    instance.value = '3001234567';
    expect(instance.value).toBe('(300) 123-4567');
    expect(instance.unmaskedValue).toBe('3001234567');
    expect(instance.isMaskComplete).toBe(true);

    instance.unmaskedValue = '3109876543';
    expect(instance.value).toBe('(310) 987-6543');
    expect(instance.unmaskedValue).toBe('3109876543');
  });

  it('soporta atajos de máscara como credit-card y date', () => {
    const cardInput = document.createElement('input');
    cardInput.setAttribute('data-mtx', 'input');
    cardInput.setAttribute('data-mask', 'credit-card');
    document.body.appendChild(cardInput);

    initAll();

    const card = getInstance(cardInput);
    card.value = '1234567890123456';
    expect(card.value).toBe('1234 5678 9012 3456');
    expect(card.unmaskedValue).toBe('1234567890123456');
    expect(card.isMaskComplete).toBe(true);
  });

  it('soporta máscara monetaria (currency) con separadores y precisión', () => {
    const moneyInput = document.createElement('input');
    moneyInput.setAttribute('data-mtx', 'input');
    moneyInput.setAttribute('data-mask', 'currency');
    moneyInput.setAttribute('data-currency-prefix', '$ ');
    moneyInput.setAttribute('data-thousands', ',');
    moneyInput.setAttribute('data-decimal', '.');
    document.body.appendChild(moneyInput);

    initAll();

    const money = getInstance(moneyInput);
    money.value = '125000';
    expect(money.value).toBe('$ 1,250.00');
    expect(money.unmaskedValue).toBe('1250.00');
    expect(money.isMaskComplete).toBe(true);
  });

  it('no activa auto-resize si el atributo data-auto-resize no está presente', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-mtx', 'textarea');
    document.body.appendChild(textarea);

    initAll();

    const instance = getInstance(textarea);
    expect(instance._hasAutoResize).toBe(false);
    expect(instance.element.classList.contains('mtx-text-field--auto-resize')).toBe(false);
  });

  it('activa auto-resize solo cuando tiene data-auto-resize o data-autoresize', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-mtx', 'textarea');
    textarea.setAttribute('data-auto-resize', 'true');
    document.body.appendChild(textarea);

    initAll();

    const instance = getInstance(textarea);
    expect(instance._hasAutoResize).toBe(true);
    expect(instance.element.classList.contains('mtx-text-field--auto-resize')).toBe(true);

    // Simular cambio de scrollHeight y validar ajuste de altura
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: 120 });
    instance.value = 'Línea 1\nLínea 2\nLínea 3\nLínea 4';
    expect(textarea.style.height).toBe('120px');
    expect(textarea.style.overflowY).toBe('hidden');
  });

  it('respeta data-max-rows en auto-resize activando scroll vertical al exceder', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('data-mtx', 'textarea');
    textarea.setAttribute('data-autoresize', '');
    textarea.setAttribute('data-max-rows', '3');
    document.body.appendChild(textarea);

    initAll();

    const instance = getInstance(textarea);
    expect(instance._hasAutoResize).toBe(true);

    // scrollHeight mayor al maxHeight calculado (24 * 3 = 72)
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: 200 });
    instance.value = 'Mucho texto para exceder las 3 filas';
    expect(textarea.style.overflowY).toBe('auto');
    expect(parseInt(textarea.style.height, 10)).toBeLessThanOrEqual(100);
  });
});