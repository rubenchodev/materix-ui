import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/icon-button/icon-button.js';
import { Tooltip, tooltip, getTooltip } from '../src/components/tooltip/tooltip.js';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function pointer(type, target, init = {}) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, ...init });
  if (init.pointerType) Object.defineProperty(event, 'pointerType', { value: init.pointerType });
  target.dispatchEvent(event);
}

function popupOf(el) {
  const id = (el.getAttribute('aria-describedby') || '').split(' ').find((v) => v.startsWith('mtx-tooltip-'));
  return id ? document.getElementById(id) : document.querySelector('.mtx-tooltip');
}

describe('Tooltip', () => {
  beforeEach(() => {
    tooltip.hideAll();
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    tooltip.hideAll();
    if (vi.isFakeTimers()) vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('delegación global: muestra en hover tras enterDelay (100ms) sin inicializar el elemento', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Guardar cambios">Guardar</button>';
    const btn = document.getElementById('b');
    pointer('pointerover', btn);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
    vi.advanceTimersByTime(99);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
    vi.advanceTimersByTime(1);
    const popup = document.querySelector('.mtx-tooltip');
    expect(popup).not.toBeNull();
    expect(popup.getAttribute('role')).toBe('tooltip');
    expect(popup.textContent).toBe('Guardar cambios');
    expect(popup.parentElement).toBe(document.body);
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(true);
    // No se registra en el registro (no pisa otros componentes).
    expect(getInstance(btn)).toBeUndefined();
  });

  it('funciona con contenido añadido dinámicamente', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Nuevo';
    btn.setAttribute('data-mtx-tooltip', 'Creado después');
    document.body.appendChild(btn);
    pointer('pointerover', btn);
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.mtx-tooltip').textContent).toBe('Creado después');
  });

  it('usa aria-describedby si el disparador ya tiene nombre accesible', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Se guarda en la nube">Guardar</button>';
    const btn = document.getElementById('b');
    expect(btn.hasAttribute('aria-label')).toBe(false);
    tooltip.show(btn);
    const popup = document.querySelector('.mtx-tooltip');
    expect(btn.getAttribute('aria-describedby')).toBe(popup.id);
    tooltip.hide(btn);
    expect(btn.hasAttribute('aria-describedby')).toBe(false);
  });

  it('pone aria-label si el disparador es solo icono y no tiene nombre', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Eliminar"><span class="material-icons">delete</span></button>';
    const btn = document.getElementById('b');
    tooltip.sync();
    expect(btn.getAttribute('aria-label')).toBe('Eliminar');
    tooltip.show(btn);
    // El nombre ya coincide con el texto: no se duplica como descripción.
    expect(btn.hasAttribute('aria-describedby')).toBe(false);
  });

  it('no sustituye un aria-label existente', () => {
    document.body.innerHTML = '<button id="b" aria-label="Borrar factura" data-mtx-tooltip="Eliminar"><span class="material-icons">delete</span></button>';
    const btn = document.getElementById('b');
    tooltip.show(btn);
    expect(btn.getAttribute('aria-label')).toBe('Borrar factura');
    expect(btn.getAttribute('aria-describedby')).toMatch(/^mtx-tooltip-/);
  });

  it('el observador aplica aria-label a disparadores añadidos después', async () => {
    vi.useRealTimers();
    const btn = document.createElement('button');
    btn.innerHTML = '<span class="material-icons" aria-hidden="true">share</span>';
    btn.setAttribute('data-mtx-tooltip', 'Compartir');
    document.body.appendChild(btn);
    await flush();
    expect(btn.getAttribute('aria-label')).toBe('Compartir');
    btn.setAttribute('data-mtx-tooltip', 'Compartir enlace');
    await flush();
    expect(btn.getAttribute('aria-label')).toBe('Compartir enlace');
  });

  it('se oculta al salir el puntero y es hoverable', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Info">i</button><p id="out">fuera</p>';
    const btn = document.getElementById('b');
    const out = document.getElementById('out');
    pointer('pointerover', btn);
    vi.advanceTimersByTime(100);
    const popup = document.querySelector('.mtx-tooltip');
    // Del disparador al tooltip: no se cierra.
    pointer('pointerout', btn, { relatedTarget: popup });
    pointer('pointerover', popup, { relatedTarget: btn });
    vi.advanceTimersByTime(500);
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(true);
    // Del tooltip hacia fuera: se cierra y se retira tras la transición.
    pointer('pointerout', popup, { relatedTarget: out });
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(false);
    vi.advanceTimersByTime(200);
    expect(popup.isConnected).toBe(false);
  });

  it('respeta data-tooltip-leave-delay y data-tooltip-enter-delay', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Info" data-tooltip-enter-delay="500" data-tooltip-leave-delay="300">i</button>';
    const btn = document.getElementById('b');
    pointer('pointerover', btn);
    vi.advanceTimersByTime(400);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
    vi.advanceTimersByTime(100);
    const popup = document.querySelector('.mtx-tooltip');
    expect(popup).not.toBeNull();
    pointer('pointerout', btn, { relatedTarget: document.body });
    vi.advanceTimersByTime(299);
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(true);
    vi.advanceTimersByTime(1);
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(false);
  });

  it('salir antes del retardo cancela la apertura', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Info">i</button>';
    const btn = document.getElementById('b');
    pointer('pointerover', btn);
    vi.advanceTimersByTime(50);
    pointer('pointerout', btn, { relatedTarget: document.body });
    vi.advanceTimersByTime(200);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
  });

  it('abre al instante el siguiente tooltip poco después de cerrar otro (histéresis MUI)', () => {
    document.body.innerHTML = '<button id="a" data-mtx-tooltip="A">a</button><button id="c" data-mtx-tooltip="C">c</button>';
    const a = document.getElementById('a');
    const c = document.getElementById('c');
    pointer('pointerover', a);
    vi.advanceTimersByTime(100);
    pointer('pointerout', a, { relatedTarget: c });
    pointer('pointerover', c, { relatedTarget: a });
    const open = document.querySelector('.mtx-tooltip--open');
    expect(open && open.textContent).toBe('C');
  });

  it('aparece con foco de teclado y no con foco de puntero; se oculta en blur', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Ayuda">?</button><button id="n">n</button>';
    const btn = document.getElementById('b');
    pointer('pointerdown', btn);
    btn.focus();
    vi.advanceTimersByTime(200);
    expect(document.querySelector('.mtx-tooltip--open')).toBeNull();
    btn.blur();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    btn.focus();
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.mtx-tooltip--open')).not.toBeNull();
    document.getElementById('n').focus();
    expect(document.querySelector('.mtx-tooltip--open')).toBeNull();
  });

  it('Escape oculta el tooltip sin mover el foco', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Ayuda">?</button>';
    const btn = document.getElementById('b');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    btn.focus();
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.mtx-tooltip--open')).not.toBeNull();
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.mtx-tooltip--open')).toBeNull();
    expect(document.activeElement).toBe(btn);
  });

  it('táctil: aparece con pulsación larga (700ms) con estilo táctil', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Mantener">m</button>';
    const btn = document.getElementById('b');
    pointer('pointerdown', btn, { pointerType: 'touch' });
    vi.advanceTimersByTime(699);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
    vi.advanceTimersByTime(1);
    const popup = document.querySelector('.mtx-tooltip');
    expect(popup.classList.contains('mtx-tooltip--touch')).toBe(true);
    pointer('pointerup', btn, { pointerType: 'touch' });
    vi.advanceTimersByTime(1500);
    expect(popup.classList.contains('mtx-tooltip--open')).toBe(false);
  });

  it('aplica colocación, flecha y data-side', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Arriba" data-tooltip-placement="top" data-tooltip-arrow>t</button>';
    const btn = document.getElementById('b');
    tooltip.show(btn);
    const popup = document.querySelector('.mtx-tooltip');
    expect(popup.querySelector('.mtx-tooltip__arrow')).not.toBeNull();
    expect(['top', 'bottom']).toContain(popup.getAttribute('data-side'));
    expect(popup.style.left).toMatch(/px$/);
  });

  it('respeta la instancia de otro componente en el mismo elemento', () => {
    document.body.innerHTML = '<button id="b" data-mtx="icon-button" data-icon="edit" data-mtx-tooltip="Editar"></button>';
    initAll();
    const btn = document.getElementById('b');
    const iconButton = getInstance(btn);
    tooltip.show(btn);
    expect(getInstance(btn)).toBe(iconButton);
    expect(btn.getAttribute('aria-label')).toBe('Editar');
  });

  it('forma avanzada data-mtx="tooltip": open/close/setTitle y eventos', () => {
    document.body.innerHTML = '<span id="w" data-mtx="tooltip" data-title="Acción no disponible" data-placement="right"><button id="d" disabled>Enviar</button></span>';
    initAll();
    const wrapper = document.getElementById('w');
    const instance = getInstance(wrapper);
    expect(instance).toBeInstanceOf(Tooltip);
    expect(instance.placement).toBe('right');
    const onOpen = vi.fn();
    wrapper.addEventListener('mtx:tooltip:open', onOpen);
    pointer('pointerover', wrapper);
    vi.advanceTimersByTime(100);
    expect(onOpen).toHaveBeenCalledTimes(1);
    const popup = document.querySelector('.mtx-tooltip');
    expect(popup.textContent).toBe('Acción no disponible');
    expect(document.getElementById('d').getAttribute('aria-describedby')).toBe(popup.id);
    instance.setTitle('Completa el formulario');
    expect(popup.textContent).toBe('Completa el formulario');
    expect(wrapper.getAttribute('data-title')).toBe('Completa el formulario');
    instance.close();
    expect(instance.isOpen).toBe(false);
    expect(getTooltip(wrapper)).toBe(instance);
  });

  it('destroy() retira la superficie y el aria-label generado', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="Cerrar"><span class="material-icons">close</span></button>';
    const btn = document.getElementById('b');
    const instance = tooltip.show(btn);
    expect(btn.getAttribute('aria-label')).toBe('Cerrar');
    instance.destroy();
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
    expect(btn.hasAttribute('aria-label')).toBe(false);
  });

  it('título vacío no muestra nada', () => {
    document.body.innerHTML = '<button id="b" data-mtx-tooltip="">x</button>';
    const btn = document.getElementById('b');
    tooltip.show(btn);
    expect(document.querySelector('.mtx-tooltip')).toBeNull();
  });
});
