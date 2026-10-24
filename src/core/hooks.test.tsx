import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, render, renderHook } from '@testing-library/react';
import { createRef, useState } from 'react';
import { setRef, useControlled, useEventCallback, useForkRef, usePrefersReducedMotion } from './hooks';
import { ownerDocument, resolveTarget } from './dom';

describe('useControlled', () => {
  it('no controlado: usa el valor por defecto y el setter lo cambia', () => {
    const { result } = renderHook(() => useControlled({ controlled: undefined, default: 1, name: 'Test' }));
    expect(result.current[0]).toBe(1);
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
  });

  it('controlado: el setter no cambia el valor', () => {
    const { result, rerender } = renderHook(({ v }) => useControlled({ controlled: v, default: 0, name: 'Test' }), {
      initialProps: { v: 3 },
    });
    act(() => result.current[1](9));
    expect(result.current[0]).toBe(3);
    rerender({ v: 4 });
    expect(result.current[0]).toBe(4);
  });

  it('avisa al pasar de controlado a no controlado', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = renderHook(
      ({ v }: { v: number | undefined }) => useControlled({ controlled: v, default: 0, name: 'Slider' }),
      { initialProps: { v: 1 as number | undefined } },
    );
    rerender({ v: undefined });
    expect(spy.mock.calls.some((call) => String(call[0]).includes('controlled value state of Slider'))).toBe(true);
    spy.mockRestore();
  });

  it('avisa si cambia el valor por defecto en modo no controlado', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = renderHook(({ d }) => useControlled({ controlled: undefined, default: d, name: 'X' }), {
      initialProps: { d: 1 },
    });
    rerender({ d: 2 });
    expect(spy.mock.calls.some((call) => String(call[0]).includes('default value state'))).toBe(true);
    spy.mockRestore();
  });
});

describe('useEventCallback', () => {
  it('mantiene identidad y llama a la última versión', () => {
    const { result, rerender } = renderHook(({ n }) => useEventCallback(() => n), { initialProps: { n: 1 } });
    const first = result.current;
    rerender({ n: 2 });
    expect(result.current).toBe(first);
    expect(result.current()).toBe(2);
  });
});

describe('useForkRef / setRef', () => {
  it('asigna el nodo a refs de objeto y de función', () => {
    const objectRef = createRef<HTMLDivElement>();
    const fnRef = vi.fn();
    function Comp() {
      const ref = useForkRef<HTMLDivElement>(objectRef, fnRef);
      return <div ref={ref} />;
    }
    const { unmount } = render(<Comp />);
    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
    expect(fnRef).toHaveBeenCalledWith(objectRef.current);
    unmount();
    expect(objectRef.current).toBeNull();
  });

  it('devuelve null si todas las refs son nulas', () => {
    const { result } = renderHook(() => useForkRef(null, undefined));
    expect(result.current).toBeNull();
  });

  it('setRef tolera null', () => {
    expect(() => setRef(null, 1)).not.toThrow();
  });
});

describe('usePrefersReducedMotion', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('refleja la media query y sus cambios', () => {
    let listener: (() => void) | null = null;
    const query = {
      matches: true,
      addEventListener: (_: string, fn: () => void) => {
        listener = fn;
      },
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn(() => query) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    query.matches = false;
    act(() => listener?.());
    expect(result.current).toBe(false);
  });
});

describe('dom', () => {
  it('ownerDocument y resolveTarget', () => {
    const div = document.createElement('div');
    expect(ownerDocument(div)).toBe(document);
    expect(ownerDocument(null)).toBe(document);
    expect(resolveTarget({ current: div })).toBe(div);
    expect(resolveTarget(() => div)).toBe(div);
    expect(resolveTarget(div)).toBe(div);
    expect(resolveTarget(null)).toBeNull();
  });

  it('useState no se ve afectado (sanidad)', () => {
    const { result } = renderHook(() => useState(1));
    expect(result.current[0]).toBe(1);
  });
});
