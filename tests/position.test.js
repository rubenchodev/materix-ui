import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computePosition, autoUpdate, parsePlacement, positionDropdown } from '../src/core/position.js';

/** Crea un elemento con un rectángulo simulado. */
function mockRect(el, { left = 0, top = 0, width = 0, height = 0 }) {
  el.getBoundingClientRect = () => ({
    left, top, width, height, right: left + width, bottom: top + height, x: left, y: top,
  });
  return el;
}

function setViewport(width, height) {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: height });
}

describe('position: computePosition', () => {
  let anchor;
  let floating;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
    setViewport(1000, 800);
    anchor = mockRect(document.createElement('button'), { left: 400, top: 300, width: 100, height: 40 });
    floating = mockRect(document.createElement('div'), { width: 120, height: 30 });
    document.body.append(anchor, floating);
  });

  it('parsePlacement normaliza lado y alineación', () => {
    expect(parsePlacement('top-start')).toEqual({ side: 'top', align: 'start' });
    expect(parsePlacement('nope')).toEqual({ side: 'bottom', align: '' });
  });

  it('coloca debajo y centrado por defecto con offset 8', () => {
    const r = computePosition(anchor, floating);
    expect(r).toMatchObject({ x: 390, y: 348, placement: 'bottom', side: 'bottom' });
  });

  it('soporta top/left/right y alineaciones start/end', () => {
    expect(computePosition(anchor, floating, { placement: 'top', offset: 10 })).toMatchObject({ x: 390, y: 260 });
    expect(computePosition(anchor, floating, { placement: 'bottom-start', offset: 0 })).toMatchObject({ x: 400, y: 340 });
    expect(computePosition(anchor, floating, { placement: 'bottom-end', offset: 0 })).toMatchObject({ x: 380 });
    expect(computePosition(anchor, floating, { placement: 'left', offset: 4 })).toMatchObject({ x: 276, y: 305, side: 'left' });
    expect(computePosition(anchor, floating, { placement: 'right-start', offset: 4 })).toMatchObject({ x: 504, y: 300 });
  });

  it('voltea al lado opuesto cuando no cabe (flip)', () => {
    mockRect(anchor, { left: 400, top: 760, width: 100, height: 30 });
    const r = computePosition(anchor, floating, { placement: 'bottom' });
    expect(r.side).toBe('top');
    expect(r.placement).toBe('top');
    expect(r.y).toBe(760 - 30 - 8);
    const noFlip = computePosition(anchor, floating, { placement: 'bottom', flip: false });
    expect(noFlip.side).toBe('bottom');
  });

  it('desplaza en el eje cruzado para no salir del viewport (shift)', () => {
    mockRect(anchor, { left: 0, top: 300, width: 20, height: 20 });
    const r = computePosition(anchor, floating, { placement: 'bottom', padding: 8 });
    expect(r.x).toBe(8);
    // La flecha sigue apuntando al centro del ancla.
    expect(r.arrowOffset).toBe(12);
    const raw = computePosition(anchor, floating, { placement: 'bottom', shift: false });
    expect(raw.x).toBe(-50);
  });

  it('refleja start/end en RTL', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const r = computePosition(anchor, floating, { placement: 'bottom-start', offset: 0 });
    expect(r.x).toBe(380);
    expect(r.placement).toBe('bottom-start');
    const forced = computePosition(anchor, floating, { placement: 'bottom-start', offset: 0, rtl: false });
    expect(forced.x).toBe(400);
  });

  it('acepta anclas virtuales (cursor)', () => {
    const virtual = { getBoundingClientRect: () => ({ left: 100, top: 100, right: 100, bottom: 100, width: 0, height: 0 }) };
    const r = computePosition(virtual, floating, { placement: 'bottom', offset: 14 });
    expect(r).toMatchObject({ x: 40, y: 114 });
  });
});

describe('position: autoUpdate', () => {
  afterEach(() => vi.restoreAllMocks());

  it('ejecuta update al empezar, en scroll y resize, y se limpia', () => {
    const anchor = document.createElement('div');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);
    const update = vi.fn();
    const cleanup = autoUpdate(anchor, floating, update);
    expect(update).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('resize'));
    document.dispatchEvent(new Event('scroll'));
    expect(update).toHaveBeenCalledTimes(3);
    cleanup();
    window.dispatchEvent(new Event('resize'));
    expect(update).toHaveBeenCalledTimes(3);
  });
});

describe('position: positionDropdown', () => {
  let anchor;
  let floating;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
    setViewport(1000, 800);
    anchor = mockRect(document.createElement('button'), { left: 400, top: 300, width: 100, height: 40 });
    floating = mockRect(document.createElement('div'), { width: 120, height: 200 });
    Object.defineProperty(floating, 'scrollHeight', { configurable: true, value: 200 });
    document.body.append(anchor, floating);
  });

  it('abre debajo, limita el alto al espacio inferior e iguala el ancho mínimo', () => {
    const r = positionDropdown(anchor, floating, { offset: 4, padding: 8, matchWidth: true });
    expect(r).toMatchObject({ side: 'bottom', x: 400, y: 344, maxHeight: 800 - 8 - 340 - 4 });
    expect(floating.style.position).toBe('fixed');
    expect(floating.style.maxHeight).toBe(`${r.maxHeight}px`);
    expect(floating.style.minWidth).toBe('100px');
    expect(floating.style.top).toBe('344px');
    expect(floating.dataset.placement).toBe('bottom');
    expect(floating.style.transformOrigin).toBe('top');
  });

  it('cambia arriba si no cabe debajo y arriba hay más espacio', () => {
    mockRect(anchor, { left: 400, top: 700, width: 100, height: 40 });
    const r = positionDropdown(anchor, floating, { offset: 4, padding: 8 });
    expect(r.side).toBe('top');
    expect(r.maxHeight).toBe(700 - 8 - 4);
    expect(r.y).toBe(700 - 200 - 4);
    expect(floating.style.transformOrigin).toBe('bottom');
  });

  it('submenú right-start: alto limitado al viewport aunque el ancla salga por arriba', () => {
    mockRect(anchor, { left: 400, top: -50, width: 100, height: 40 });
    const r = positionDropdown(anchor, floating, { placement: 'right-start', offset: 0, padding: 8 });
    expect(r.side).toBe('right');
    expect(r.x).toBe(500);
    expect(r.y).toBe(8);
    expect(r.maxHeight).toBe(800 - 16);
  });

  it('submenú: voltea a la izquierda sin espacio y se refleja en RTL', () => {
    mockRect(anchor, { left: 800, top: 100, width: 150, height: 40 });
    expect(positionDropdown(anchor, floating, { placement: 'right-start', offset: 0 }).side).toBe('left');
    mockRect(anchor, { left: 400, top: 100, width: 100, height: 40 });
    document.documentElement.setAttribute('dir', 'rtl');
    const r = positionDropdown(anchor, floating, { placement: 'right-start', offset: 0 });
    expect(r).toMatchObject({ side: 'left', x: 280 });
    expect(floating.style.transformOrigin).toBe('right top');
  });
});

describe('position: positionDropdown (lockSide y content)', () => {
  let anchor;
  let floating;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
    setViewport(1000, 800);
    anchor = mockRect(document.createElement('button'), { left: 400, top: 700, width: 100, height: 40 });
    floating = mockRect(document.createElement('div'), { width: 120, height: 200 });
    document.body.append(anchor, floating);
  });

  it('lockSide conserva el lado aunque el contenido encoja', () => {
    Object.defineProperty(floating, 'scrollHeight', { configurable: true, value: 200 });
    const first = positionDropdown(anchor, floating, { offset: 4, padding: 8 });
    expect(first.side).toBe('top');
    // La lista se filtra y ya cabría debajo: sin bloqueo volvería a bottom.
    Object.defineProperty(floating, 'scrollHeight', { configurable: true, value: 20 });
    mockRect(floating, { width: 120, height: 20 });
    expect(positionDropdown(anchor, floating, { offset: 4, padding: 8 }).side).toBe('bottom');
    const kept = positionDropdown(anchor, floating, { offset: 4, padding: 8, lockSide: 'top' });
    expect(kept.side).toBe('top');
    expect(kept.y).toBe(700 - 20 - 4);
    expect(kept.maxHeight).toBe(700 - 8 - 4);
  });

  it('mide el alto natural en `content` (no en el flotante recortado)', () => {
    // El popper quedó recortado por un maxHeight previo; el contenido real es más alto.
    Object.defineProperty(floating, 'scrollHeight', { configurable: true, value: 40 });
    const content = document.createElement('div');
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 300 });
    floating.appendChild(content);
    expect(positionDropdown(anchor, floating, { offset: 4, padding: 8 }).side).toBe('bottom');
    expect(positionDropdown(anchor, floating, { offset: 4, padding: 8, content }).side).toBe('top');
  });
});
