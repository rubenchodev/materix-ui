import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/button/button.js';
import '../src/components/progress/progress.js';
import { Stepper, MobileStepper } from '../src/components/stepper/stepper.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.body.querySelector('[data-mtx="stepper"], [data-mtx="mobile-stepper"]');
}

const BASIC = '<ol data-mtx="stepper" data-active-step="1"><li data-label="Email"></li><li data-label="Code"></li><li data-label="Password"></li></ol>';

describe('Stepper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('construye la anatomía desde la sintaxis simplificada', () => {
    const el = mount(BASIC);
    const stepper = getInstance(el);
    expect(stepper).toBeInstanceOf(Stepper);
    expect(el.classList.contains('mtx-stepper')).toBe(true);
    expect(el.classList.contains('mtx-stepper--horizontal')).toBe(true);
    const steps = el.querySelectorAll(':scope > .mtx-step');
    expect(steps).toHaveLength(3);
    expect(steps[0].querySelector('.mtx-step-connector')).toBeNull();
    expect(steps[1].querySelector(':scope > .mtx-step-connector').getAttribute('aria-hidden')).toBe('true');
    expect(steps[0].querySelector('.mtx-step__label').textContent).toBe('Email');
    expect(steps[0].querySelector('.mtx-step__icon-container').getAttribute('aria-hidden')).toBe('true');
  });

  it('estado lineal: completados anteriores, activo con aria-current y futuros deshabilitados', () => {
    const el = mount(BASIC);
    const [a, b, c] = el.querySelectorAll('.mtx-step');
    expect(a.classList.contains('mtx-step--completed')).toBe(true);
    expect(a.querySelector('svg.mtx-step-icon--completed')).not.toBeNull();
    expect(b.classList.contains('mtx-step--active')).toBe(true);
    expect(b.getAttribute('aria-current')).toBe('step');
    expect(b.querySelector('.mtx-step-icon--number').textContent).toBe('2');
    expect(c.classList.contains('mtx-step--disabled')).toBe(true);
    expect(a.hasAttribute('aria-current')).toBe(false);
  });

  it('textos accesibles con posición y estado, traducidos', () => {
    let el = mount(BASIC);
    const first = el.querySelector('.mtx-step__label-container');
    expect(first.textContent).toBe('Step 1 of 3: Email, completed');
    document.documentElement.setAttribute('lang', 'es');
    el = mount(BASIC);
    expect(el.querySelector('.mtx-step__label-container').textContent).toBe('Paso 1 de 3: Email, completado');
  });

  it('next, back, goTo y getter activeStep; alcanza el estado terminado', () => {
    const el = mount(BASIC);
    const stepper = getInstance(el);
    expect(stepper.activeStep).toBe(1);
    expect(stepper.next()).toBe(true);
    expect(stepper.activeStep).toBe(2);
    expect(stepper.next()).toBe(true);
    expect(stepper.activeStep).toBe(3);
    expect(stepper.finished).toBe(true);
    expect(el.classList.contains('mtx-stepper--finished')).toBe(true);
    expect(el.querySelectorAll('.mtx-step--completed')).toHaveLength(3);
    expect(stepper.next()).toBe(false);
    expect(stepper.back()).toBe(true);
    expect(stepper.activeStep).toBe(2);
    expect(stepper.goTo(0)).toBe(true);
    expect(el.getAttribute('data-active-step')).toBe('0');
    expect(stepper.goTo(9)).toBe(false);
    expect(stepper.back()).toBe(false);
  });

  it('emite mtx:stepper:change cancelable', () => {
    const el = mount(BASIC);
    const stepper = getInstance(el);
    const spy = vi.fn((event) => {
      if (event.detail.activeStep === 2) event.preventDefault();
    });
    el.addEventListener('mtx:stepper:change', spy);
    expect(stepper.next()).toBe(false);
    expect(stepper.activeStep).toBe(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ activeStep: 2, previousStep: 1 });
    expect(stepper.back()).toBe(true);
    expect(spy.mock.calls[1][0].detail).toEqual({ activeStep: 0, previousStep: 1 });
  });

  it('data-optional, data-error con mensaje y data-disabled', () => {
    const el = mount(`<ol data-mtx="stepper" data-active-step="0" data-non-linear>
      <li data-label="A" data-optional></li>
      <li data-label="B" data-error="Invalid card"></li>
      <li data-label="C" data-disabled></li>
      <li data-label="D" data-optional="Skippable"></li></ol>`);
    const steps = el.querySelectorAll('.mtx-step');
    expect(steps[0].querySelector('.mtx-step__optional').textContent).toBe('Optional');
    expect(steps[1].classList.contains('mtx-step--error')).toBe(true);
    expect(steps[1].querySelector('.mtx-step__optional').textContent).toBe('Invalid card');
    expect(steps[1].querySelector('svg.mtx-step-icon--error')).not.toBeNull();
    expect(steps[2].querySelector('.mtx-step-button').disabled).toBe(true);
    expect(steps[3].querySelector('.mtx-step__optional').textContent).toBe('Skippable');
    const stepper = getInstance(el);
    expect(stepper.goTo(2)).toBe(false);
    stepper.goTo(1);
    expect(stepper.next()).toBe(true);
    expect(stepper.activeStep).toBe(3);
  });

  it('setCompleted y setError actualizan icono, clases y atributos', () => {
    const el = mount(BASIC);
    const stepper = getInstance(el);
    const steps = el.querySelectorAll('.mtx-step');
    stepper.setCompleted(0, false);
    expect(steps[0].classList.contains('mtx-step--completed')).toBe(false);
    expect(steps[0].getAttribute('data-completed')).toBe('false');
    stepper.setError(1, 'Required');
    expect(steps[1].querySelector('.mtx-step__optional').textContent).toBe('Required');
    stepper.setError(1, true);
    expect(steps[1].querySelector('.mtx-step__label-container').textContent).toContain(', error');
    stepper.setError(1, false);
    expect(steps[1].classList.contains('mtx-step--error')).toBe(false);
    expect(steps[1].querySelector('.mtx-step__optional')).toBeNull();
  });

  it('reset vuelve al primer paso y limpia estados', () => {
    const el = mount(BASIC);
    const stepper = getInstance(el);
    stepper.setError(2, 'x');
    stepper.setCompleted(1, true);
    expect(stepper.reset()).toBe(true);
    expect(stepper.activeStep).toBe(0);
    expect(el.querySelectorAll('.mtx-step--error, .mtx-step--completed')).toHaveLength(0);
  });

  it('modo no lineal: pasos como botones con clic y aria-current en el botón', () => {
    const el = mount('<ol data-mtx="stepper" data-non-linear><li data-label="A"></li><li data-label="B"></li><li data-label="C"></li></ol>');
    const buttons = el.querySelectorAll('button.mtx-step-button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0].type).toBe('button');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
    expect(el.querySelector('.mtx-step--disabled')).toBeNull();
    buttons[2].click();
    expect(getInstance(el).activeStep).toBe(2);
    expect(buttons[2].getAttribute('aria-current')).toBe('step');
    expect(el.querySelectorAll('.mtx-step--completed')).toHaveLength(0);
  });

  it('vertical: el contenido del li pasa a StepContent y solo el activo está expandido', () => {
    const el = mount(`<ol data-mtx="stepper" data-orientation="vertical">
      <li data-label="One"><p>First content</p></li>
      <li data-label="Two"><p>Second content</p></li></ol>`);
    expect(el.classList.contains('mtx-stepper--vertical')).toBe(true);
    const contents = el.querySelectorAll('.mtx-step__content');
    expect(contents).toHaveLength(2);
    expect(contents[0].querySelector('.mtx-step__content-inner p').textContent).toBe('First content');
    expect(contents[0].getAttribute('aria-hidden')).toBe('false');
    expect(contents[1].hasAttribute('inert')).toBe(true);
    getInstance(el).next();
    expect(contents[0].hasAttribute('inert')).toBe(true);
    expect(contents[1].getAttribute('aria-hidden')).toBe('false');
  });

  it('etiqueta alternativa y li con solo texto como etiqueta', () => {
    const el = mount('<ol data-mtx="stepper" data-alternative-label><li>Cart</li><li>Pay</li></ol>');
    expect(el.classList.contains('mtx-stepper--alternative-label')).toBe(true);
    expect(el.querySelectorAll('.mtx-step__label')[1].textContent).toBe('Pay');
    expect(el.querySelector('.mtx-step__content')).toBeNull();
  });

  it('data-icon usa un icono propio y data-panel alterna paneles', () => {
    document.body.innerHTML = `<ol data-mtx="stepper" data-finished-panel="#done">
      <li data-label="A" data-icon="person" data-panel="#p1"></li>
      <li data-label="B" data-panel="#p2"></li></ol>
      <div id="p1"></div><div id="p2"></div><div id="done"></div>`;
    initAll();
    const el = document.querySelector('.mtx-stepper');
    expect(el.querySelector('.mtx-step-icon--custom').textContent).toBe('person');
    expect(document.getElementById('p1').hidden).toBe(false);
    expect(document.getElementById('p2').hidden).toBe(true);
    expect(document.getElementById('done').hidden).toBe(true);
    getInstance(el).next();
    getInstance(el).next();
    expect(document.getElementById('p2').hidden).toBe(true);
    expect(document.getElementById('done').hidden).toBe(false);
  });

  it('disparadores declarativos data-mtx-stepper-action con data-target', () => {
    document.body.innerHTML = `${BASIC.replace('<ol', '<ol id="s1"')}
      <button data-mtx-stepper-action="back" data-target="#s1">Back</button>
      <button data-mtx-stepper-action="next" data-target="#s1">Next</button>`;
    initAll();
    const stepper = getInstance(document.getElementById('s1'));
    const [back, next] = document.querySelectorAll('button[data-mtx-stepper-action]');
    next.click();
    expect(stepper.activeStep).toBe(2);
    back.click();
    back.click();
    expect(stepper.activeStep).toBe(0);
    expect(back.disabled).toBe(true);
  });

  it('BEM manual: reutiliza la estructura existente sin duplicar', () => {
    const el = mount(`<ol class="mtx-stepper" data-mtx="stepper">
      <li class="mtx-step"><span class="mtx-step__label-container"><span class="mtx-step__icon-container"></span><span class="mtx-step__label-text"><span class="mtx-step__label">A</span></span></span></li>
      <li class="mtx-step"><span class="mtx-step-connector"><span class="mtx-step-connector__line"></span></span><span class="mtx-step__label-container"><span class="mtx-step__icon-container"></span><span class="mtx-step__label-text"><span class="mtx-step__label">B</span></span></span></li></ol>`);
    expect(el.querySelectorAll('.mtx-step-connector')).toHaveLength(1);
    expect(el.querySelectorAll('.mtx-step__label-container')).toHaveLength(2);
    expect(el.querySelectorAll('.mtx-step-icon')).toHaveLength(2);
  });

  it('inicialización idempotente y refresh() con pasos nuevos', () => {
    const el = mount(BASIC);
    initAll();
    expect(el.querySelectorAll('.mtx-step__label-container')).toHaveLength(3);
    const li = document.createElement('li');
    li.setAttribute('data-label', 'Done');
    el.appendChild(li);
    getInstance(el).refresh();
    expect(getInstance(el).length).toBe(4);
    expect(li.querySelector('.mtx-step-connector')).not.toBeNull();
    expect(el.querySelector('.mtx-step__label-container').textContent).toContain('Step 1 of 4');
  });
});

describe('MobileStepper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('dots: genera botones, puntos y estado accesible', () => {
    const el = mount('<div data-mtx="mobile-stepper" data-steps="4"></div>');
    const stepper = getInstance(el);
    expect(stepper).toBeInstanceOf(MobileStepper);
    expect(el.querySelectorAll('.mtx-mobile-stepper__dot')).toHaveLength(4);
    expect(el.querySelector('.mtx-mobile-stepper__dot--active')).toBe(el.querySelector('.mtx-mobile-stepper__dot'));
    const back = el.querySelector('.mtx-mobile-stepper__back');
    const next = el.querySelector('.mtx-mobile-stepper__next');
    expect(back.disabled).toBe(true);
    expect(back.textContent).toContain('Back');
    expect(next.textContent).toContain('Next');
    expect(el.querySelector('.mtx-mobile-stepper__status').textContent).toBe('Step 1 of 4');
    next.click();
    expect(stepper.activeStep).toBe(1);
    expect(back.disabled).toBe(false);
    stepper.goTo(3);
    expect(next.disabled).toBe(true);
    expect(stepper.next()).toBe(false);
  });

  it('text y progress', () => {
    document.body.innerHTML = '<div data-mtx="mobile-stepper" data-variant="text" data-steps="5" data-active-step="2"></div>'
      + '<div data-mtx="mobile-stepper" data-variant="progress" data-steps="5"></div>';
    initAll();
    const [text, progress] = document.querySelectorAll('.mtx-mobile-stepper');
    expect(text.querySelector('.mtx-mobile-stepper__indicator').textContent).toBe('3 / 5');
    const bar = progress.querySelector('.mtx-linear-progress');
    expect(bar).not.toBeNull();
    getInstance(progress).goTo(4);
    expect(getInstance(bar).value).toBe(100);
  });

  it('traduce botones y emite el evento cancelable', () => {
    document.documentElement.setAttribute('lang', 'es');
    const el = mount('<div data-mtx="mobile-stepper" data-steps="3"></div>');
    expect(el.querySelector('.mtx-mobile-stepper__back').textContent).toContain('Atrás');
    el.addEventListener('mtx:stepper:change', (event) => event.preventDefault());
    expect(getInstance(el).next()).toBe(false);
    expect(getInstance(el).activeStep).toBe(0);
  });
});
