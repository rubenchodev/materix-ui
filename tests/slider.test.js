import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { Slider } from '../src/components/slider/slider.js';
import { setLocale } from '../src/i18n/index.js';

/** Simula el tamaño del rail (jsdom no hace layout). */
const mockRail = (root, rect = { left: 0, top: 0, width: 200, height: 200 }) => {
  const rail = root.querySelector('.mtx-slider__rail');
  rail.getBoundingClientRect = () => ({
    ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height, x: rect.left, y: rect.top,
  });
};

const pointer = (target, type, init) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...init }));

const key = (input, k) => input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

describe('Slider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    setLocale('en');
  });

  it('auto-construye rail, track, thumb y value label desde un único input range', () => {
    document.body.innerHTML = '<form><input type="range" id="vol" name="volume" data-mtx="slider" min="0" max="100" value="30" data-label="Volume" class="extra"></form>';
    initAll();
    const input = document.getElementById('vol');
    const root = input.closest('.mtx-slider');
    expect(root).not.toBeNull();
    expect(root.classList.contains('extra')).toBe(true);
    const slider = getInstance(input);
    expect(slider).toBeInstanceOf(Slider);
    expect(getInstance(root)).toBe(slider);
    expect(root.querySelector('.mtx-slider__rail')).not.toBeNull();
    expect(root.querySelector('.mtx-slider__track').style.width).toBe('30%');
    expect(input.parentElement.classList.contains('mtx-slider__thumb')).toBe(true);
    expect(input.parentElement.style.insetInlineStart).toBe('30%');
    expect(input.getAttribute('aria-label')).toBe('Volume');
    expect(input.name).toBe('volume');
    expect(slider.value).toBe(30);
    expect(new FormData(document.querySelector('form')).get('volume')).toBe('30');
    expect(root.classList.contains('mtx-slider--label-off')).toBe(true);
  });

  it('es idempotente', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="10">';
    initAll();
    initAll();
    expect(document.querySelectorAll('.mtx-slider').length).toBe(1);
    expect(document.querySelectorAll('.mtx-slider__thumb').length).toBe(1);
  });

  it('aplica tamaño, color, orientación y modo de value label', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-size="small" data-color="secondary" data-orientation="vertical" data-value-label-display="on" value="40">';
    initAll();
    const root = document.querySelector('.mtx-slider');
    expect(root.classList.contains('mtx-slider--small')).toBe(true);
    expect(root.classList.contains('mtx-slider--secondary')).toBe(true);
    expect(root.classList.contains('mtx-slider--vertical')).toBe(true);
    expect(root.classList.contains('mtx-slider--label-on')).toBe(true);
    const input = root.querySelector('input');
    expect(input.getAttribute('aria-orientation')).toBe('vertical');
    expect(input.parentElement.style.bottom).toBe('40%');
    expect(root.querySelector('.mtx-slider__track').style.height).toBe('40%');
    expect(root.querySelector('.mtx-slider__value-label-text').textContent).toBe('40');
  });

  it('redondea al step y acota a min/max', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" min="10" max="50" step="5" value="23">';
    initAll();
    const slider = getInstance(document.querySelector('input'));
    expect(slider.value).toBe(25);
    slider.value = 999;
    expect(slider.value).toBe(50);
    slider.value = -3;
    expect(slider.value).toBe(10);
  });

  it('formatea el valor con data-value-label-format y aria-valuetext', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="20" data-value-label-format="{value} °C">';
    initAll();
    const input = document.querySelector('input');
    expect(input.getAttribute('aria-valuetext')).toBe('20 °C');
    expect(document.querySelector('.mtx-slider__value-label-text').textContent).toBe('20 °C');
    expect(document.querySelector('.mtx-slider__value-label').getAttribute('aria-hidden')).toBe('true');
  });

  it('teclado: flechas, PageUp/PageDown (10 %), Home/End y eventos', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="50">';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    const onInput = vi.fn();
    const onChange = vi.fn();
    slider.element.addEventListener('mtx:slider:input', onInput);
    slider.element.addEventListener('mtx:slider:change', onChange);
    key(input, 'ArrowRight');
    expect(slider.value).toBe(51);
    key(input, 'ArrowDown');
    expect(slider.value).toBe(50);
    key(input, 'PageUp');
    expect(slider.value).toBe(60);
    key(input, 'PageDown');
    key(input, 'PageDown');
    expect(slider.value).toBe(40);
    key(input, 'End');
    expect(slider.value).toBe(100);
    key(input, 'Home');
    expect(slider.value).toBe(0);
    expect(onChange).toHaveBeenCalledTimes(7);
    expect(onChange.mock.calls[6][0].detail).toEqual({ value: 0 });
    expect(onInput).toHaveBeenCalledTimes(7);
  });

  it('teclado en RTL horizontal: ArrowLeft incrementa', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="50">';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    slider.element.style.direction = 'rtl';
    key(input, 'ArrowLeft');
    expect(slider.value).toBe(51);
  });

  it('arrastre con puntero: emite input durante el arrastre y change al soltar', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="10">';
    initAll();
    const slider = getInstance(document.querySelector('input'));
    const root = slider.element;
    mockRail(root);
    const onInput = vi.fn();
    const onChange = vi.fn();
    root.addEventListener('mtx:slider:input', onInput);
    root.addEventListener('mtx:slider:change', onChange);
    pointer(root.querySelector('.mtx-slider__rail'), 'pointerdown', { clientX: 100 });
    expect(slider.value).toBe(50);
    expect(root.classList.contains('mtx-slider--dragging')).toBe(true);
    expect(root.querySelector('.mtx-slider__thumb').classList.contains('mtx-slider__thumb--active')).toBe(true);
    pointer(document, 'pointermove', { clientX: 150 });
    expect(slider.value).toBe(75);
    expect(onChange).not.toHaveBeenCalled();
    pointer(document, 'pointerup', { clientX: 150 });
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 75 });
    expect(root.classList.contains('mtx-slider--dragging')).toBe(false);
    // Tras soltar, el movimiento ya no afecta.
    pointer(document, 'pointermove', { clientX: 20 });
    expect(slider.value).toBe(75);
  });

  it('arrastre vertical usa el eje Y desde abajo', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-orientation="vertical" value="0">';
    initAll();
    const slider = getInstance(document.querySelector('input'));
    mockRail(slider.element);
    pointer(slider.element, 'pointerdown', { clientY: 50 });
    expect(slider.value).toBe(75);
    pointer(document, 'pointerup', {});
  });

  it('rango: dos inputs con names -start/-end, etiquetas Minimum/Maximum y valor [a, b]', () => {
    document.body.innerHTML = '<form><input type="range" data-mtx="slider" name="price" data-range data-value="20,60" data-label="Price"></form>';
    initAll();
    const root = document.querySelector('.mtx-slider');
    const slider = getInstance(root);
    const inputs = root.querySelectorAll('input[type="range"]');
    expect(inputs.length).toBe(2);
    expect(inputs[0].name).toBe('price-start');
    expect(inputs[1].name).toBe('price-end');
    expect(inputs[0].getAttribute('aria-label')).toBe('Price: Minimum');
    expect(inputs[1].getAttribute('aria-label')).toBe('Price: Maximum');
    expect(slider.value).toEqual([20, 60]);
    const track = root.querySelector('.mtx-slider__track');
    expect(track.style.insetInlineStart).toBe('20%');
    expect(track.style.width).toBe('40%');
    const data = new FormData(document.querySelector('form'));
    expect(data.get('price-start')).toBe('20');
    expect(data.get('price-end')).toBe('60');
  });

  it('rango en español usa Mínimo/Máximo', () => {
    document.body.innerHTML = '<div lang="es"><input type="range" data-mtx="slider" data-range data-value="10,20"></div>';
    initAll();
    const inputs = document.querySelectorAll('input[type="range"]');
    expect(inputs[0].getAttribute('aria-label')).toBe('Mínimo');
    expect(inputs[1].getAttribute('aria-label')).toBe('Máximo');
  });

  it('rango: el thumb más cercano se mueve y cruza intercambiándose (swap)', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-range data-value="20,60">';
    initAll();
    const slider = getInstance(document.querySelector('.mtx-slider'));
    mockRail(slider.element);
    pointer(slider.element, 'pointerdown', { clientX: 60 }); // 30 → thumb 0
    expect(slider.value).toEqual([30, 60]);
    pointer(document, 'pointermove', { clientX: 160 }); // 80 → cruza
    expect(slider.value).toEqual([60, 80]);
    expect(document.activeElement).toBe(slider.inputs[1]);
    pointer(document, 'pointerup', {});
  });

  it('rango con data-disable-swap y data-min-distance acota el thumb activo', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-range data-value="20,60" data-disable-swap data-min-distance="10">';
    initAll();
    const slider = getInstance(document.querySelector('.mtx-slider'));
    mockRail(slider.element);
    pointer(slider.element, 'pointerdown', { clientX: 40 });
    pointer(document, 'pointermove', { clientX: 190 });
    expect(slider.value).toEqual([50, 60]);
    pointer(document, 'pointerup', {});
    key(slider.inputs[1], 'Home');
    expect(slider.value).toEqual([50, 60]);
    key(slider.inputs[1], 'End');
    expect(slider.value).toEqual([50, 100]);
  });

  it('marcas: data-marks="true" crea una por step y la lista crea etiquetas activas', () => {
    document.body.innerHTML = `
      <input type="range" id="a" data-mtx="slider" min="0" max="50" step="10" value="20" data-marks="true">
      <input type="range" id="b" data-mtx="slider" min="0" max="100" value="37" data-marks="0:0°C,20:20°C,37:37°C,100:100°C">`;
    initAll();
    const a = document.getElementById('a').closest('.mtx-slider');
    expect(a.querySelectorAll('.mtx-slider__mark').length).toBe(6);
    expect(a.querySelectorAll('.mtx-slider__mark--active').length).toBe(3);
    expect(a.classList.contains('mtx-slider--marked')).toBe(false);
    const b = document.getElementById('b').closest('.mtx-slider');
    const labels = b.querySelectorAll('.mtx-slider__mark-label');
    expect(labels.length).toBe(4);
    expect(labels[2].textContent).toBe('37°C');
    expect(labels[2].style.insetInlineStart).toBe('37%');
    expect(b.querySelectorAll('.mtx-slider__mark-label--active').length).toBe(3);
    expect(b.classList.contains('mtx-slider--marked')).toBe(true);
  });

  it('data-marks-inset alinea hacia dentro las etiquetas de los extremos', () => {
    document.body.innerHTML = `
      <input type="range" id="a" data-mtx="slider" value="37" data-marks="0:0 °C,37:37 °C,100:100 °C" data-marks-inset>
      <input type="range" id="b" data-mtx="slider" value="37" data-marks="0:0 °C,37:37 °C,100:100 °C">`;
    initAll();
    const a = document.getElementById('a').closest('.mtx-slider');
    const b = document.getElementById('b').closest('.mtx-slider');
    expect(a.classList.contains('mtx-slider--marks-inset')).toBe(true);
    expect(b.classList.contains('mtx-slider--marks-inset')).toBe(false);
    const labels = a.querySelectorAll('.mtx-slider__mark-label');
    expect(labels[0].classList.contains('mtx-slider__mark-label--start')).toBe(true);
    expect(labels[1].classList.contains('mtx-slider__mark-label--start')).toBe(false);
    expect(labels[1].classList.contains('mtx-slider__mark-label--end')).toBe(false);
    expect(labels[2].classList.contains('mtx-slider__mark-label--end')).toBe(true);
    expect(getInstance(document.getElementById('a')).marksInset).toBe(true);
  });

  it('data-marks-inset recalcula los extremos al cambiar la escala', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" step="25" value="50" data-marks="0:A,25:B,50:C,75:D,100:E" data-marks-inset>';
    initAll();
    const slider = getInstance(document.querySelector('input'));
    slider.max = 75;
    const root = slider.element;
    const ends = Array.from(root.querySelectorAll('.mtx-slider__mark-label--end')).map((n) => n.textContent);
    const starts = Array.from(root.querySelectorAll('.mtx-slider__mark-label--start')).map((n) => n.textContent);
    expect(ends).toEqual(['D']);
    expect(starts).toEqual(['A']);
  });

  it('data-marks-only restringe los valores a las marcas', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="30" data-marks="0:A,20:B,37:C,100:D" data-marks-only>';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    expect(slider.value).toBe(37);
    key(input, 'ArrowRight');
    expect(slider.value).toBe(100);
    key(input, 'ArrowLeft');
    key(input, 'ArrowLeft');
    expect(slider.value).toBe(20);
  });

  it('track invertido y sin track', () => {
    document.body.innerHTML = `
      <input type="range" id="i" data-mtx="slider" value="30" data-track="inverted">
      <input type="range" id="f" data-mtx="slider" value="30" data-track="false">`;
    initAll();
    const inv = document.getElementById('i').closest('.mtx-slider');
    expect(inv.classList.contains('mtx-slider--track-inverted')).toBe(true);
    expect(inv.querySelector('.mtx-slider__track').style.insetInlineStart).toBe('30%');
    expect(inv.querySelector('.mtx-slider__track').style.width).toBe('70%');
    expect(document.getElementById('f').closest('.mtx-slider').classList.contains('mtx-slider--track-false')).toBe(true);
  });

  it('disable()/enable() y data-disabled', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="30" data-disabled>';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    expect(slider.disabled).toBe(true);
    expect(input.disabled).toBe(true);
    mockRail(slider.element);
    pointer(slider.element, 'pointerdown', { clientX: 180 });
    key(input, 'End');
    expect(slider.value).toBe(30);
    slider.enable();
    expect(input.disabled).toBe(false);
    expect(slider.element.classList.contains('mtx-slider--disabled')).toBe(false);
  });

  it('setters min/max/step re-acotan el valor y actualizan los inputs', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="80" data-marks="true" step="20">';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    slider.max = 60;
    expect(slider.value).toBe(60);
    expect(input.max).toBe('60');
    slider.min = 20;
    slider.step = 10;
    expect(input.min).toBe('20');
    expect(input.step).toBe('10');
    expect(slider.element.querySelectorAll('.mtx-slider__mark').length).toBe(5);
    slider.value = 33;
    expect(slider.value).toBe(30);
  });

  it('value setter en rango acepta array o "a,b" y ordena', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" data-range>';
    initAll();
    const slider = getInstance(document.querySelector('.mtx-slider'));
    expect(slider.value).toEqual([0, 100]);
    slider.value = [70, 10];
    expect(slider.value).toEqual([10, 70]);
    slider.value = '5,15';
    expect(slider.value).toEqual([5, 15]);
  });

  it('sincroniza cambios escritos en el input nativo (tecnologías de apoyo)', () => {
    document.body.innerHTML = '<input type="range" data-mtx="slider" value="10">';
    initAll();
    const input = document.querySelector('input');
    const slider = getInstance(input);
    const onInput = vi.fn();
    slider.element.addEventListener('mtx:slider:input', onInput);
    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(slider.value).toBe(42);
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it('sintaxis BEM completa: se vincula sin duplicar nodos', () => {
    document.body.innerHTML = `
      <span class="mtx-slider" data-mtx="slider" data-value-label-display="auto">
        <span class="mtx-slider__rail"></span>
        <span class="mtx-slider__track"></span>
        <span class="mtx-slider__thumb"><input type="range" class="mtx-slider__input" min="0" max="10" value="4" aria-label="Brillo"></span>
      </span>`;
    initAll();
    const root = document.querySelector('.mtx-slider');
    expect(root.querySelectorAll('.mtx-slider__rail').length).toBe(1);
    expect(root.querySelectorAll('.mtx-slider__thumb').length).toBe(1);
    expect(root.querySelectorAll('.mtx-slider__value-label').length).toBe(1);
    expect(getInstance(root).value).toBe(4);
    expect(root.querySelector('.mtx-slider__track').style.width).toBe('40%');
  });

  it('destroy() retira listeners y restaura el input original', () => {
    document.body.innerHTML = '<input type="range" id="s" name="price" data-mtx="slider" data-range data-value="10,20">';
    initAll();
    const input = document.getElementById('s');
    const slider = getInstance(input);
    const onInput = vi.fn();
    document.addEventListener('mtx:slider:input', onInput);
    expect(destroy(input)).toBe(true);
    expect(document.querySelector('.mtx-slider')).toBeNull();
    expect(input.parentElement).toBe(document.body);
    expect(input.name).toBe('price');
    expect(input.hasAttribute('data-mtx-initialized')).toBe(false);
    expect(getInstance(input)).toBeUndefined();
    key(input, 'End');
    expect(onInput).not.toHaveBeenCalled();
    document.removeEventListener('mtx:slider:input', onInput);
    expect(slider.destroyed).toBe(true);
    // Se puede volver a inicializar.
    initAll();
    expect(getInstance(input)).toBeInstanceOf(Slider);
  });
});
