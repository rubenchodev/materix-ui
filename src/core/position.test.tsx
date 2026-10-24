import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { useState } from 'react';
import { computePosition, isRtl, parsePlacement, positionDropdown } from './position';
import { usePosition } from './use-position';

const VIEWPORT = { width: 1000, height: 800 };

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} } as DOMRect;
}

function anchorAt(left: number, top: number, width = 100, height = 40) {
  return { getBoundingClientRect: () => rect(left, top, width, height) };
}

function floatingOf(width: number, height: number, scrollHeight = height) {
  const el = document.createElement('div');
  Object.defineProperty(el, 'offsetWidth', { configurable: true, value: width });
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: height });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight });
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: VIEWPORT.width });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: VIEWPORT.height });
});
afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('dir');
});

describe('parsePlacement', () => {
  it('descompone y normaliza', () => {
    expect(parsePlacement('top-start')).toEqual({ side: 'top', align: 'start' });
    expect(parsePlacement('foo-bar')).toEqual({ side: 'bottom', align: '' });
    expect(parsePlacement(undefined)).toEqual({ side: 'bottom', align: '' });
  });
});

describe('computePosition', () => {
  it('bottom centrado con offset', () => {
    const r = computePosition(anchorAt(400, 100), floatingOf(200, 50), { placement: 'bottom' });
    expect(r).toMatchObject({ x: 350, y: 148, placement: 'bottom', side: 'bottom', align: '' });
    expect(r.arrowOffset).toBe(100);
  });

  it('voltea al lado opuesto si no cabe', () => {
    const r = computePosition(anchorAt(400, 740), floatingOf(200, 100), { placement: 'bottom-start' });
    expect(r.side).toBe('top');
    expect(r.placement).toBe('top-start');
    expect(r.y).toBe(740 - 100 - 8);
    expect(r.x).toBe(400);
  });

  it('shift mantiene la superficie dentro del viewport', () => {
    const r = computePosition(anchorAt(950, 100, 40), floatingOf(200, 50), { placement: 'bottom' });
    expect(r.x).toBe(1000 - 8 - 200);
  });

  it('RTL refleja start/end en top/bottom', () => {
    const r = computePosition(anchorAt(400, 100), floatingOf(200, 50), { placement: 'bottom-start', rtl: true });
    expect(r.align).toBe('end');
    expect(r.x).toBe(500 - 200);
    expect(r.placement).toBe('bottom-start');
  });

  it('lados horizontales y alineación end', () => {
    const r = computePosition(anchorAt(100, 300), floatingOf(150, 60), { placement: 'right-end', offset: 0 });
    expect(r).toMatchObject({ x: 200, y: 340 - 60, side: 'right' });
  });
});

describe('isRtl', () => {
  it('detecta dir en ancestros', () => {
    const wrap = document.createElement('div');
    wrap.setAttribute('dir', 'rtl');
    const child = document.createElement('span');
    wrap.appendChild(child);
    document.body.appendChild(wrap);
    expect(isRtl(child)).toBe(true);
    expect(isRtl(document.body)).toBe(false);
  });
});

describe('positionDropdown', () => {
  it('elige el lado con más espacio y limita el alto', () => {
    const floating = floatingOf(200, 300, 600);
    const r = positionDropdown(anchorAt(100, 600), floating, { placement: 'bottom-start', rtl: false });
    expect(r.side).toBe('top');
    expect(r.maxHeight).toBe(600 - 8 - 4);
    expect(floating.style.position).toBe('fixed');
    expect(floating.style.maxHeight).toBe(`${600 - 8 - 4}px`);
    expect(floating.style.transformOrigin).toBe('bottom');
    expect(floating.dataset.placement).toBe('top');
  });

  it('lockSide conserva el lado y matchWidth iguala el ancho', () => {
    const floating = floatingOf(200, 300, 600);
    const r = positionDropdown(anchorAt(100, 600, 250), floating, { lockSide: 'bottom', matchWidth: true, rtl: false });
    expect(r.side).toBe('bottom');
    expect(r.maxHeight).toBe(800 - 8 - 640 - 4);
    expect(floating.style.minWidth).toBe('250px');
  });

  it('submenú en RTL se abre a la izquierda', () => {
    const floating = floatingOf(150, 100);
    const r = positionDropdown(anchorAt(500, 100), floating, { placement: 'right-start', offset: 0, rtl: true });
    expect(r.side).toBe('left');
    expect(floating.style.transformOrigin).toBe('right top');
  });

  it('usa content para medir el alto natural', () => {
    const floating = floatingOf(200, 100, 100);
    const content = floatingOf(200, 100, 700);
    const r = positionDropdown(anchorAt(100, 500), floating, { content, rtl: false });
    expect(r.side).toBe('top');
  });
});

function Floating({ open, dropdown }: { open: boolean; dropdown?: boolean }) {
  const [floating, setFloating] = useState<HTMLDivElement | null>(null);
  const anchor = useState(() => anchorAt(400, 100))[0];
  const { placement } = usePosition(anchor, floating, { open, placement: 'bottom', dropdown });
  return (
    <div
      ref={(node) => {
        if (node) {
          Object.defineProperty(node, 'offsetWidth', { configurable: true, value: 200 });
          Object.defineProperty(node, 'offsetHeight', { configurable: true, value: 50 });
        }
        setFloating(node);
      }}
      data-testid="floating"
      data-result={placement ?? ''}
    />
  );
}

describe('usePosition', () => {
  it('aplica estilos al abrir y devuelve la colocación', () => {
    const { getByTestId, rerender } = render(<Floating open={false} />);
    const el = getByTestId('floating');
    expect(el.style.left).toBe('');
    rerender(<Floating open />);
    expect(el.style.position).toBe('fixed');
    expect(el.style.left).toBe('350px');
    expect(el.style.top).toBe('148px');
    expect(el.dataset.placement).toBe('bottom');
    expect(el.getAttribute('data-result')).toBe('bottom');
  });

  it('recoloca en resize y deja de escuchar al cerrar', () => {
    const { getByTestId, rerender } = render(<Floating open />);
    const el = getByTestId('floating');
    el.style.left = '0px';
    window.dispatchEvent(new Event('resize'));
    expect(el.style.left).toBe('350px');
    rerender(<Floating open={false} />);
    el.style.left = '0px';
    window.dispatchEvent(new Event('resize'));
    expect(el.style.left).toBe('0px');
  });

  it('modo desplegable usa positionDropdown', () => {
    const { getByTestId } = render(<Floating open dropdown />);
    const el = getByTestId('floating');
    expect(el.style.maxHeight).not.toBe('');
    expect(el.style.transformOrigin).toBe('top');
  });
});
