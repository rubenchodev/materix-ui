import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import {
  getTopLayer,
  hasLayer,
  isEscapeHandled,
  isInUpperLayer,
  isTopLayer,
  layerCount,
  pushLayer,
  removeLayer,
  useLayer,
} from './layers';
import type { LayerKind } from './layers';

function escape() {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  document.dispatchEvent(event);
  return event;
}

describe('pila de capas (funciones)', () => {
  it('Escape solo llega a la capa superior y se marca como gestionado', () => {
    const a = {};
    const b = {};
    const onA = vi.fn();
    const onB = vi.fn();
    pushLayer(a, { kind: 'modal', onEscape: onA });
    pushLayer(b, { kind: 'popup', onEscape: onB });
    expect(isTopLayer(b)).toBe(true);
    expect(isTopLayer(a)).toBe(false);
    const event = escape();
    expect(onB).toHaveBeenCalledTimes(1);
    expect(onA).not.toHaveBeenCalled();
    expect(isEscapeHandled(event)).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    removeLayer(b);
    escape();
    expect(onA).toHaveBeenCalledTimes(1);
    removeLayer(a);
    expect(layerCount()).toBe(0);
  });

  it('prioridades: tooltip primero y snackbar solo sin otras capas', () => {
    const snack = {};
    const modal = {};
    const tip = {};
    const onSnack = vi.fn();
    const onModal = vi.fn();
    const onTip = vi.fn();
    pushLayer(modal, { kind: 'modal', onEscape: onModal });
    pushLayer(snack, { kind: 'snackbar', onEscape: onSnack });
    pushLayer(tip, { kind: 'tooltip', onEscape: onTip });
    expect(getTopLayer()).toBe(tip);
    // El tooltip no cuenta para isTopLayer de capas no transitorias.
    expect(isTopLayer(modal)).toBe(true);
    escape();
    expect(onTip).toHaveBeenCalledTimes(1);
    removeLayer(tip);
    escape();
    expect(onModal).toHaveBeenCalledTimes(1);
    expect(onSnack).not.toHaveBeenCalled();
    removeLayer(modal);
    escape();
    expect(onSnack).toHaveBeenCalledTimes(1);
    removeLayer(snack);
    expect(layerCount(false)).toBe(0);
  });

  it('ignora Escape ya prevenido y re-push sube a la cima', () => {
    const a = {};
    const b = {};
    const onA = vi.fn();
    pushLayer(a, { onEscape: onA });
    pushLayer(b, {});
    pushLayer(a, { onEscape: onA });
    expect(isTopLayer(a)).toBe(true);
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);
    expect(onA).not.toHaveBeenCalled();
    removeLayer(a);
    removeLayer(b);
  });

  it('isInUpperLayer, poda de nodos desconectados y z-index apilado', () => {
    const lower = {};
    const upper = {};
    const node = document.createElement('div');
    const inner = document.createElement('span');
    node.appendChild(inner);
    document.body.appendChild(node);
    const stacked = document.createElement('div');
    pushLayer(lower, { kind: 'popup' });
    const depth = pushLayer(upper, { kind: 'modal', nodes: node, stack: [{ node: stacked, offset: 1 }] });
    expect(depth).toBe(1);
    expect(stacked.style.zIndex).toBe('calc(var(--mtx-z-index-modal, 1300) + 3)');
    expect(isInUpperLayer(lower, inner)).toBe(true);
    expect(isInUpperLayer(upper, inner)).toBe(false);
    node.remove();
    expect(isTopLayer(lower)).toBe(true);
    expect(hasLayer(upper)).toBe(false);
    expect(stacked.style.zIndex).toBe('');
    removeLayer(lower);
  });
});

function Layer({ open, kind, onEscape, label }: { open: boolean; kind?: LayerKind; onEscape?: () => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useLayer({ open, kind, onEscape, nodes: ref });
  return (
    <div ref={ref} data-testid={label} data-top={String(open && layer.isTopLayer())}>
      {label}
    </div>
  );
}

describe('useLayer', () => {
  it('registra mientras está abierto y entrega Escape a la última capa', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = render(
      <>
        <Layer open label="a" kind="modal" onEscape={first} />
        <Layer open={false} label="b" onEscape={second} />
      </>,
    );
    expect(layerCount()).toBe(1);
    rerender(
      <>
        <Layer open label="a" kind="modal" onEscape={first} />
        <Layer open label="b" onEscape={second} />
      </>,
    );
    expect(layerCount()).toBe(2);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    rerender(
      <>
        <Layer open label="a" kind="modal" onEscape={first} />
        <Layer open={false} label="b" onEscape={second} />
      </>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(first).toHaveBeenCalledTimes(1);
    unmount();
    expect(layerCount()).toBe(0);
  });

  it('usa siempre el último onEscape', () => {
    const v1 = vi.fn();
    const v2 = vi.fn();
    const { rerender, unmount } = render(<Layer open label="c" onEscape={v1} />);
    rerender(<Layer open label="c" onEscape={v2} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(v1).not.toHaveBeenCalled();
    expect(v2).toHaveBeenCalledTimes(1);
    unmount();
  });
});
