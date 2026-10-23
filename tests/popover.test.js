import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { Popover } from '../src/components/popover/popover.js';

function mount(extra = '') {
  document.body.innerHTML = `
    <main>
      <button id="trigger" data-open-popover="#pop">Abrir</button>
      <button id="other">Otro</button>
      <div data-mtx="popover" id="pop" ${extra}>
        <h3>Filtros</h3>
        <input id="first" type="text">
        <button id="close" data-mtx-popover-close>Cerrar</button>
      </div>
    </main>`;
  initAll();
  return {
    trigger: document.getElementById('trigger'),
    pop: document.getElementById('pop'),
    instance: getInstance(document.getElementById('pop')),
  };
}

describe('Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('se inicializa oculto con role="dialog", nombre desde el encabezado y prepara el disparador', () => {
    const { trigger, pop, instance } = mount();
    expect(instance).toBeInstanceOf(Popover);
    expect(pop.hidden).toBe(true);
    expect(pop.getAttribute('role')).toBe('dialog');
    expect(pop.getAttribute('aria-labelledby')).toBe(pop.querySelector('h3').id);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe('pop');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('data-label se usa como aria-label', () => {
    const { pop } = mount('data-label="Opciones"');
    expect(pop.getAttribute('aria-label')).toBe('Opciones');
    expect(pop.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('abre con el disparador, se porta a body, enfoca el primer control y emite mtx:popover:open', () => {
    const { trigger, pop } = mount();
    const onOpen = vi.fn();
    pop.addEventListener('mtx:popover:open', onOpen);
    trigger.focus();
    trigger.click();
    expect(pop.hidden).toBe(false);
    expect(pop.parentElement).toBe(document.body);
    expect(pop.classList.contains('mtx-popover--open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(document.getElementById('first'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('enfoca el panel si no hay controles y respeta data-autofocus', () => {
    document.body.innerHTML = '<button id="t" data-open-popover="#p">t</button><div data-mtx="popover" id="p"><p>Solo texto</p></div>';
    initAll();
    getInstance(document.getElementById('p')).open(document.getElementById('t'));
    expect(document.activeElement).toBe(document.getElementById('p'));

    document.body.innerHTML = '<button id="t2" data-open-popover="#p2">t</button><div data-mtx="popover" id="p2"><input id="a"><input id="b" data-autofocus></div>';
    initAll();
    document.getElementById('t2').click();
    expect(document.activeElement).toBe(document.getElementById('b'));
  });

  it('Escape cierra y devuelve el foco al disparador', () => {
    const { trigger, pop, instance } = mount();
    const onClose = vi.fn();
    pop.addEventListener('mtx:popover:close', onClose);
    trigger.focus();
    trigger.click();
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(instance.isOpen).toBe(false);
    expect(onClose.mock.calls[0][0].detail.reason).toBe('escape');
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    vi.advanceTimersByTime(200);
    expect(pop.hidden).toBe(true);
  });

  it('clic fuera cierra sin robar el foco; clic dentro no', () => {
    const { trigger, instance } = mount();
    trigger.click();
    document.getElementById('first').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(instance.isOpen).toBe(true);
    const other = document.getElementById('other');
    other.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    other.focus();
    expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(other);
  });

  it('el disparador alterna y los botones data-mtx-popover-close cierran', () => {
    const { trigger, instance } = mount();
    trigger.click();
    expect(instance.isOpen).toBe(true);
    trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    trigger.click();
    expect(instance.isOpen).toBe(false);
    trigger.click();
    document.getElementById('close').click();
    expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('API open(anchor)/close()/toggle() y disparadores añadidos dinámicamente', () => {
    const { pop, instance } = mount();
    const dynamic = document.createElement('button');
    dynamic.setAttribute('data-open-popover', '#pop');
    document.body.appendChild(dynamic);
    dynamic.click();
    expect(instance.isOpen).toBe(true);
    expect(dynamic.getAttribute('aria-expanded')).toBe('true');
    instance.close();
    instance.toggle({ x: 100, y: 120 });
    expect(instance.isOpen).toBe(true);
    expect(pop.style.top).toBe('120px');
    instance.toggle();
    expect(instance.isOpen).toBe(false);
  });

  it('posiciona con data-anchor-origin/data-transform-origin (algoritmo MUI)', () => {
    const { trigger, pop, instance } = mount('data-anchor-origin="bottom right" data-transform-origin="top right"');
    trigger.getBoundingClientRect = () => ({ left: 200, top: 100, right: 300, bottom: 140, width: 100, height: 40 });
    pop.getBoundingClientRect = () => ({ left: 0, top: 0, right: 150, bottom: 80, width: 150, height: 80 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1000 });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    instance.open(trigger);
    expect(pop.style.top).toBe('140px');
    expect(pop.style.left).toBe('150px');
    expect(pop.style.transformOrigin).toBe('150px 0px');
  });

  it('modo modal atrapa Tab y fija aria-modal', () => {
    const { trigger, pop } = mount('data-modal');
    expect(pop.getAttribute('aria-modal')).toBe('true');
    trigger.click();
    expect(document.body.style.overflow).toBe('hidden');
    getInstance(pop).close();
    expect(document.body.style.overflow).toBe('');
  });

  it('destroy() restaura la posición original y retira listeners', () => {
    const { trigger, pop } = mount();
    trigger.click();
    destroy(pop);
    expect(pop.parentElement.tagName).toBe('MAIN');
    trigger.click();
    expect(pop.classList.contains('mtx-popover--open')).toBe(false);
  });
  it('destroy() cancela los temporizadores diferidos de foco tras un clic fuera', () => {
    const { trigger, instance } = mount();
    trigger.click();
    vi.runOnlyPendingTimers();
    vi.clearAllTimers();
    document.getElementById('other').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(instance.isOpen).toBe(false);
    const spy = vi.spyOn(instance, '_restoreLostFocus');
    instance.destroy();
    vi.runAllTimers();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Popover — estado final al destruir', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('destroy() con el popover abierto aplica hidden y limpia la posición en línea', () => {
    const { trigger, pop } = mount();
    trigger.click();
    expect(pop.hidden).toBe(false);
    destroy(pop);
    expect(pop.hidden).toBe(true);
    expect(pop.style.left).toBe('');
    expect(pop.style.top).toBe('');
    expect(pop.style.transformOrigin).toBe('');
  });

  it('destroy() durante la animación de salida también aplica hidden', () => {
    const { trigger, pop, instance } = mount();
    trigger.click();
    instance.close();
    vi.advanceTimersByTime(100);
    expect(pop.hidden).toBe(false);
    destroy(pop);
    expect(pop.hidden).toBe(true);
  });

  it('close() libera el bloqueo de scroll aunque se retire data-modal estando abierto', () => {
    const { trigger, pop, instance } = mount('data-modal');
    trigger.click();
    expect(document.body.style.overflow).toBe('hidden');
    pop.removeAttribute('data-modal');
    instance.close();
    expect(document.body.style.overflow).toBe('');
  });
});
