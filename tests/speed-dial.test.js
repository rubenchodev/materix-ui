import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { SpeedDial } from '../src/components/speed-dial/speed-dial.js';
import { tooltip } from '../src/components/tooltip/tooltip.js';

function createSpeedDial(attrs = {}) {
  const container = document.createElement('div');
  container.className = 'mtx-speed-dial';
  container.setAttribute('data-mtx', 'speed-dial');
  Object.entries(attrs).forEach(([k, v]) => container.setAttribute(k, v));

  container.innerHTML = `
    <button class="mtx-fab mtx-fab--primary mtx-speed-dial__fab" aria-label="Acciones">
      <span class="material-icons">add</span>
    </button>
    <div class="mtx-speed-dial__actions">
      <button class="mtx-fab mtx-fab--small mtx-speed-dial__action" data-tooltip="Estadísticas">
        <span class="material-icons">insert_chart</span>
      </button>
      <button class="mtx-fab mtx-fab--small mtx-speed-dial__action" data-tooltip="Publicar">
        <span class="material-icons">publish</span>
      </button>
    </div>
  `;
  document.body.appendChild(container);
  return container;
}

describe('SpeedDial', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa automáticamente vía data-mtx="speed-dial"', () => {
    const el = createSpeedDial();
    initAll();
    const instance = getInstance(el);
    expect(instance).toBeInstanceOf(SpeedDial);
  });

  it('abre y cierra mediante .open(), .close() y .toggle()', () => {
    const el = createSpeedDial();
    initAll();
    const instance = getInstance(el);

    expect(instance.isOpen).toBe(false);

    instance.open();
    expect(instance.isOpen).toBe(true);
    expect(el.classList.contains('mtx-speed-dial--open')).toBe(true);

    instance.close();
    expect(instance.isOpen).toBe(false);
    expect(el.classList.contains('mtx-speed-dial--open')).toBe(false);

    instance.toggle();
    expect(instance.isOpen).toBe(true);
  });

  it('aplica las clases de dirección (up, down, left, right)', () => {
    const el = createSpeedDial({ 'data-direction': 'down' });
    initAll();
    const instance = getInstance(el);

    expect(el.classList.contains('mtx-speed-dial--direction-down')).toBe(true);

    instance.direction = 'right';
    expect(el.classList.contains('mtx-speed-dial--direction-right')).toBe(true);
  });

  it('genera wrappers y tooltips automáticos para acciones con data-tooltip', () => {
    const el = createSpeedDial();
    initAll();

    const tooltips = el.querySelectorAll('.mtx-speed-dial__tooltip');
    expect(tooltips.length).toBe(2);
    expect(tooltips[0].textContent).toBe('Estadísticas');
    expect(tooltips[1].textContent).toBe('Publicar');
  });

  it('cierra al presionar la tecla Escape', () => {
    const el = createSpeedDial();
    initAll();
    const instance = getInstance(el);

    instance.open();
    expect(instance.isOpen).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(instance.isOpen).toBe(false);
  });

  it('las etiquetas persistentes son decorativas (aria-hidden) y la acción conserva su aria-label', () => {
    const el = createSpeedDial();
    initAll();
    const label = el.querySelector('.mtx-speed-dial__tooltip');
    expect(label.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.mtx-speed-dial__action').getAttribute('aria-label')).toBe('Estadísticas');
  });

  it('data-tooltip-hover usa el Tooltip global (hover y foco) con colocación según la dirección', () => {
    const el = createSpeedDial({ 'data-tooltip-hover': '' });
    initAll();
    const instance = getInstance(el);
    const actions = el.querySelectorAll('.mtx-speed-dial__action');
    expect(el.querySelectorAll('.mtx-speed-dial__tooltip').length).toBe(0);
    expect(actions[0].getAttribute('data-mtx-tooltip')).toBe('Estadísticas');
    expect(actions[0].getAttribute('data-tooltip-placement')).toBe('left');
    instance.direction = 'right';
    expect(actions[0].getAttribute('data-tooltip-placement')).toBe('top');

    instance.open();
    tooltip.show(actions[1]);
    expect(document.querySelector('.mtx-tooltip--open').textContent).toBe('Publicar');
    instance.close();
    expect(document.querySelector('.mtx-tooltip--open')).toBeNull();
  });

  it('destroy() retira los listeners del documento', () => {
    const el = createSpeedDial();
    initAll();
    const instance = getInstance(el);
    instance.open();
    instance.destroy();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(instance.isOpen).toBe(true);
  });

  it('emite mtx:speed-dial:open/close y los alias deprecados', () => {
    const el = createSpeedDial();
    initAll();
    const names = [];
    ['mtx:speed-dial:open', 'mtx-speed-dial-open', 'mtx:speed-dial:close', 'mtx-speed-dial-close']
      .forEach((n) => el.addEventListener(n, () => names.push(n)));
    const instance = getInstance(el);
    instance.open();
    instance.close();
    expect(names).toEqual(['mtx:speed-dial:open', 'mtx-speed-dial-open', 'mtx:speed-dial:close', 'mtx-speed-dial-close']);
  });
});
