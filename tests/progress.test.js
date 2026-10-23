import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { CircularProgress, LinearProgress, createCircularProgress } from '../src/components/progress/progress.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.body.firstElementChild;
}

describe('CircularProgress', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('construye el SVG desde un único elemento (indeterminate por defecto)', () => {
    const el = mount('<div data-mtx="circular-progress"></div>');
    expect(getInstance(el)).toBeInstanceOf(CircularProgress);
    expect(el.classList.contains('mtx-circular-progress')).toBe(true);
    expect(el.classList.contains('mtx-circular-progress--indeterminate')).toBe(true);
    expect(el.classList.contains('mtx-circular-progress--primary')).toBe(true);
    const svg = el.querySelector('svg.mtx-circular-progress__svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('22 22 44 44');
    const circle = el.querySelector('.mtx-circular-progress__circle');
    expect(circle.getAttribute('r')).toBe(String((44 - 3.6) / 2));
    expect(el.style.getPropertyValue('--mtx-circular-progress-size')).toBe('40px');
  });

  it('indeterminate: role y aria-label por defecto sin aria-valuenow', () => {
    const el = mount('<div data-mtx="circular-progress"></div>');
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-label')).toBe('Loading');
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.hasAttribute('aria-valuemin')).toBe(false);
  });

  it('traduce el aria-label según el idioma del documento', () => {
    document.documentElement.setAttribute('lang', 'es');
    const el = mount('<div data-mtx="circular-progress"></div>');
    expect(el.getAttribute('aria-label')).toBe('Cargando');
  });

  it('respeta aria-label, aria-labelledby y data-label', () => {
    document.body.innerHTML = `
      <div data-mtx="circular-progress" aria-label="Subiendo"></div>
      <div data-mtx="circular-progress" aria-labelledby="t"></div>
      <div data-mtx="circular-progress" data-label="Sincronizando"></div>`;
    initAll();
    const [a, b, c] = document.querySelectorAll('[data-mtx]');
    expect(a.getAttribute('aria-label')).toBe('Subiendo');
    expect(b.hasAttribute('aria-label')).toBe(false);
    expect(c.getAttribute('aria-label')).toBe('Sincronizando');
  });

  it('determinate: aria-value* y dashoffset proporcional', () => {
    const el = mount('<div data-mtx="circular-progress" data-value="75"></div>');
    const p = getInstance(el);
    expect(p.variant).toBe('determinate');
    expect(el.getAttribute('aria-valuenow')).toBe('75');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    const circ = 2 * Math.PI * ((44 - 3.6) / 2);
    expect(parseFloat(p.circleEl.style.strokeDashoffset)).toBeCloseTo(circ * 0.25, 2);
  });

  it('size, thickness, color y disable-shrink', () => {
    const el = mount('<div data-mtx="circular-progress" data-size="24" data-thickness="5" data-color="success" data-disable-shrink></div>');
    expect(el.style.getPropertyValue('--mtx-circular-progress-size')).toBe('24px');
    expect(el.querySelector('circle').getAttribute('stroke-width')).toBe('5');
    expect(el.classList.contains('mtx-circular-progress--success')).toBe(true);
    expect(el.classList.contains('mtx-circular-progress--disable-shrink')).toBe(true);
  });

  it('data-show-label muestra el porcentaje oculto a lectores de pantalla', () => {
    const el = mount('<div data-mtx="circular-progress" data-value="42.4" data-show-label></div>');
    const label = el.querySelector('.mtx-circular-progress__label');
    expect(label.textContent).toBe('42%');
    expect(label.getAttribute('aria-hidden')).toBe('true');
    getInstance(el).value = 90;
    expect(label.textContent).toBe('90%');
  });

  it('data-track añade el círculo de pista antes del arco', () => {
    const el = mount('<div data-mtx="circular-progress" data-value="30" data-track></div>');
    const circles = el.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
    expect(circles[0].classList.contains('mtx-circular-progress__track')).toBe(true);
  });

  it('setValue acota, pasa a determinate y actualiza ARIA', () => {
    const el = mount('<div data-mtx="circular-progress"></div>');
    const p = getInstance(el);
    expect(p.setValue(150)).toBe(p);
    expect(p.value).toBe(100);
    expect(p.variant).toBe('determinate');
    expect(el.getAttribute('aria-valuenow')).toBe('100');
    p.value = -5;
    expect(p.value).toBe(0);
    p.variant = 'indeterminate';
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.classList.contains('mtx-circular-progress--indeterminate')).toBe(true);
  });

  it('setter color cambia la clase de paleta e ignora valores inválidos', () => {
    const el = mount('<div data-mtx="circular-progress"></div>');
    const p = getInstance(el);
    p.color = 'error';
    expect(p.color).toBe('error');
    expect(el.classList.contains('mtx-circular-progress--error')).toBe(true);
    expect(el.classList.contains('mtx-circular-progress--primary')).toBe(false);
    p.color = 'rainbow';
    expect(p.color).toBe('primary');
  });

  it('data-min/data-max escalan el porcentaje', () => {
    const el = mount('<div data-mtx="circular-progress" data-min="0" data-max="10" data-value="7" data-show-label></div>');
    expect(el.getAttribute('aria-valuemax')).toBe('10');
    expect(el.getAttribute('aria-valuenow')).toBe('7');
    expect(el.querySelector('.mtx-circular-progress__label').textContent).toBe('70%');
  });

  it('es idempotente', () => {
    const el = mount('<div data-mtx="circular-progress" data-value="10" data-show-label data-track></div>');
    const first = getInstance(el);
    initAll();
    initAll();
    expect(getInstance(el)).toBe(first);
    expect(el.querySelectorAll('svg')).toHaveLength(1);
    expect(el.querySelectorAll('circle')).toHaveLength(2);
    expect(el.querySelectorAll('.mtx-circular-progress__label')).toHaveLength(1);
  });

  it('reutiliza la estructura BEM manual sin duplicarla', () => {
    const el = mount(`<span class="mtx-circular-progress" data-mtx="circular-progress" data-value="50">
      <svg class="mtx-circular-progress__svg" viewBox="22 22 44 44"><circle class="mtx-circular-progress__circle"></circle></svg>
    </span>`);
    expect(el.querySelectorAll('svg')).toHaveLength(1);
    expect(el.querySelectorAll('circle')).toHaveLength(1);
    expect(getInstance(el).circleEl.getAttribute('r')).toBe(String((44 - 3.6) / 2));
  });
});

describe('createCircularProgress', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('crea un span inicializado con las opciones', () => {
    const el = createCircularProgress({ size: 20, color: 'inherit', label: 'Guardando' });
    expect(el.tagName).toBe('SPAN');
    const p = getInstance(el);
    expect(p).toBeInstanceOf(CircularProgress);
    expect(p.size).toBe(20);
    expect(el.classList.contains('mtx-circular-progress--inherit')).toBe(true);
    expect(el.getAttribute('aria-label')).toBe('Guardando');
    document.body.appendChild(el);
    initAll();
    expect(getInstance(el)).toBe(p);
  });

  it('decorative oculta el indicador y no recupera role al actualizar', () => {
    const el = createCircularProgress({ size: 16, decorative: true, label: 'x' });
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);
    getInstance(el).setValue(50);
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
  });
});

describe('LinearProgress', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('single-element: genera pista y dos barras (indeterminate)', () => {
    const el = mount('<div data-mtx="linear-progress"></div>');
    expect(getInstance(el)).toBeInstanceOf(LinearProgress);
    expect(el.classList.contains('mtx-linear-progress--indeterminate')).toBe(true);
    const track = el.querySelector('.mtx-linear-progress__track');
    expect(track).not.toBeNull();
    expect(track.querySelectorAll('.mtx-linear-progress__bar')).toHaveLength(2);
    expect(track.querySelector('.mtx-linear-progress__dashed')).not.toBeNull();
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-label')).toBe('Loading');
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('determinate: transform de la barra y ARIA', () => {
    const el = mount('<div data-mtx="linear-progress" data-value="40"></div>');
    const p = getInstance(el);
    expect(p.variant).toBe('determinate');
    expect(p.bar1El.style.transform).toBe('translateX(-60.000%)');
    expect(el.getAttribute('aria-valuenow')).toBe('40');
  });

  it('buffer: se deduce de data-value-buffer y traslada la segunda barra', () => {
    const el = mount('<div data-mtx="linear-progress" data-value="30" data-value-buffer="60"></div>');
    const p = getInstance(el);
    expect(p.variant).toBe('buffer');
    expect(el.classList.contains('mtx-linear-progress--buffer')).toBe(true);
    expect(p.bar2El.style.transform).toBe('translateX(-40.000%)');
    expect(el.getAttribute('aria-valuenow')).toBe('30');
    p.setBuffer(80);
    expect(p.valueBuffer).toBe(80);
    expect(p.bar2El.style.transform).toBe('translateX(-20.000%)');
  });

  it('query: variante explícita sin aria-valuenow', () => {
    const el = mount('<div data-mtx="linear-progress" data-variant="query" data-color="secondary"></div>');
    expect(el.classList.contains('mtx-linear-progress--query')).toBe(true);
    expect(el.classList.contains('mtx-linear-progress--secondary')).toBe(true);
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('data-show-label, data-rounded y setValue', () => {
    const el = mount('<div data-mtx="linear-progress" data-value="10" data-show-label data-rounded data-label="Subida"></div>');
    const label = el.querySelector('.mtx-linear-progress__label');
    expect(label.textContent).toBe('10%');
    expect(el.classList.contains('mtx-linear-progress--rounded')).toBe(true);
    expect(el.getAttribute('aria-label')).toBe('Subida');
    getInstance(el).setValue(55.6);
    expect(label.textContent).toBe('56%');
    expect(el.getAttribute('aria-valuenow')).toBe('55.6');
  });

  it('setValue sobre indeterminate pasa a determinate', () => {
    const el = mount('<div data-mtx="linear-progress"></div>');
    const p = getInstance(el);
    p.value = 25;
    expect(p.variant).toBe('determinate');
    expect(el.getAttribute('aria-valuenow')).toBe('25');
    expect(p.bar1El.style.transform).toBe('translateX(-75.000%)');
  });

  it('es idempotente y reutiliza BEM manual', () => {
    const el = mount(`<div class="mtx-linear-progress" data-mtx="linear-progress" data-value="50">
      <span class="mtx-linear-progress__track"><span class="mtx-linear-progress__bar mtx-linear-progress__bar1"></span></span>
    </div>`);
    const first = getInstance(el);
    initAll();
    expect(getInstance(el)).toBe(first);
    expect(el.querySelectorAll('.mtx-linear-progress__track')).toHaveLength(1);
    expect(el.querySelectorAll('.mtx-linear-progress__bar1')).toHaveLength(1);
    expect(el.querySelectorAll('.mtx-linear-progress__bar2')).toHaveLength(1);
  });
});
