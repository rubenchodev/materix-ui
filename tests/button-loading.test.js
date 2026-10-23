import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/button/button.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.body.firstElementChild;
}

describe('Button loading', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('data-loading: deshabilita, marca aria-busy y añade un spinner decorativo centrado', () => {
    const el = mount('<button class="mtx-button mtx-button--contained" data-mtx="button" data-loading>Guardar</button>');
    const btn = getInstance(el);
    expect(btn.loading).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.classList.contains('mtx-button--loading-center')).toBe(true);
    const indicator = el.querySelector('.mtx-button__loading-indicator--center');
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    const spinner = indicator.querySelector('.mtx-circular-progress');
    expect(spinner.classList.contains('mtx-circular-progress--inherit')).toBe(true);
    expect(spinner.hasAttribute('role')).toBe(false);
    expect(spinner.style.getPropertyValue('--mtx-circular-progress-size')).toBe('16px');
  });

  it('center conserva el texto en el DOM (ancho y nombre accesible estables)', () => {
    const el = mount('<button class="mtx-button" data-mtx="button">Guardar</button>');
    getInstance(el).setLoading(true);
    expect(el.textContent.trim()).toBe('Guardar');
    expect(el.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    expect(el.querySelectorAll('.mtx-button__loading-indicator')).toHaveLength(1);
  });

  it('setLoading(false) restaura el estado y es idempotente', () => {
    const el = mount('<button class="mtx-button" data-mtx="button">Guardar</button>');
    const btn = getInstance(el);
    btn.setLoading(true).setLoading(true);
    expect(el.querySelectorAll('.mtx-button__loading-indicator')).toHaveLength(1);
    initAll();
    expect(getInstance(el)).toBe(btn);
    btn.loading = false;
    btn.setLoading(false);
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('aria-busy')).toBe(false);
    expect(el.hasAttribute('data-loading')).toBe(false);
    expect(el.querySelector('.mtx-button__loading-indicator')).toBeNull();
    expect(el.className).toBe('mtx-button');
  });

  it('respeta un disabled previo al terminar la carga', () => {
    const el = mount('<button class="mtx-button" data-mtx="button" disabled>Guardar</button>');
    const btn = getInstance(el);
    btn.setLoading(true);
    btn.setLoading(false);
    expect(el.disabled).toBe(true);
  });

  it('start sustituye el icono inicial y lo restaura', () => {
    const el = mount(`<button class="mtx-button" data-mtx="button" data-loading-position="start">
      <span class="mtx-button__icon material-icons" aria-hidden="true">save</span>Guardar</button>`);
    const icon = el.querySelector('.mtx-button__icon');
    getInstance(el).setLoading(true);
    const indicator = el.querySelector('.mtx-button__loading-indicator--start');
    expect(indicator.nextElementSibling).toBe(icon);
    expect(icon.classList.contains('mtx-button__icon--loading-hidden')).toBe(true);
    expect(el.classList.contains('mtx-button--loading-start')).toBe(true);
    getInstance(el).setLoading(false);
    expect(icon.classList.contains('mtx-button__icon--loading-hidden')).toBe(false);
  });

  it('end sustituye el icono final', () => {
    const el = mount(`<button class="mtx-button" data-mtx="button" data-loading-position="end" data-loading>Enviar
      <span class="mtx-button__icon material-icons" aria-hidden="true">send</span></button>`);
    const icon = el.querySelector('.mtx-button__icon');
    const indicator = el.querySelector('.mtx-button__loading-indicator--end');
    expect(icon.nextElementSibling).toBe(indicator);
    expect(icon.classList.contains('mtx-button__icon--loading-hidden')).toBe(true);
  });

  it('start sin icono inserta el indicador al inicio', () => {
    const el = mount('<button class="mtx-button" data-mtx="button" data-loading-position="start" data-loading>Guardar</button>');
    expect(el.firstElementChild.classList.contains('mtx-button__loading-indicator--start')).toBe(true);
    expect(el.firstChild).toBe(el.firstElementChild);
  });

  it('data-loading-indicator muestra texto en lugar del spinner', () => {
    const el = mount('<button class="mtx-button" data-mtx="button" data-loading data-loading-indicator="Cargando…">Pagar</button>');
    const indicator = el.querySelector('.mtx-button__loading-indicator');
    expect(indicator.textContent).toBe('Cargando…');
    expect(indicator.classList.contains('mtx-button__loading-indicator--text')).toBe(true);
    expect(indicator.querySelector('.mtx-circular-progress')).toBeNull();
  });

  it('en <a> usa aria-disabled y restaura el tabindex original', () => {
    const el = mount('<a class="mtx-button" data-mtx="button" href="#x">Ir</a>');
    const btn = getInstance(el);
    btn.setLoading(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('tabindex')).toBe('-1');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    el.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    btn.setLoading(false);
    expect(el.hasAttribute('aria-disabled')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('data-loading="false" no activa la carga', () => {
    const el = mount('<button class="mtx-button" data-mtx="button" data-loading="false">Guardar</button>');
    expect(getInstance(el).loading).toBe(false);
    expect(el.disabled).toBe(false);
  });
});
