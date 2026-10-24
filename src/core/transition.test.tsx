import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, render, renderHook } from '@testing-library/react';
import { Collapse, Fade, Grow, useTransition } from './transition';

function tick(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
});

describe('useTransition', () => {
  it('recorre entering → entered y exiting → exited', () => {
    const onEntered = vi.fn();
    const onExited = vi.fn();
    const { result, rerender } = renderHook(({ on }) => useTransition(on, 225, { onEntered, onExited }), {
      initialProps: { on: false },
    });
    expect(result.current.status).toBe('exited');
    rerender({ on: true });
    expect(result.current.status).toBe('entering');
    tick(224);
    expect(result.current.status).toBe('entering');
    tick(1);
    expect(result.current.status).toBe('entered');
    expect(onEntered).toHaveBeenCalledTimes(1);
    rerender({ on: false });
    expect(result.current.status).toBe('exiting');
    tick(225);
    expect(result.current.status).toBe('exited');
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('cancela la fase en curso al invertir `in`', () => {
    const onEntered = vi.fn();
    const { result, rerender } = renderHook(({ on }) => useTransition(on, 200, { onEntered }), {
      initialProps: { on: false },
    });
    rerender({ on: true });
    tick(100);
    rerender({ on: false });
    expect(result.current.status).toBe('exiting');
    tick(500);
    expect(onEntered).not.toHaveBeenCalled();
    expect(result.current.status).toBe('exited');
  });

  it('unmountOnExit, mountOnEnter y appear', () => {
    const { result, rerender } = renderHook(({ on }) => useTransition(on, 100, { unmountOnExit: true }), {
      initialProps: { on: false },
    });
    expect(result.current.mounted).toBe(false);
    rerender({ on: true });
    expect(result.current.mounted).toBe(true);
    tick(100);
    rerender({ on: false });
    expect(result.current.mounted).toBe(true);
    tick(100);
    expect(result.current.mounted).toBe(false);

    const appear = renderHook(() => useTransition(true, 100, { appear: true }));
    expect(appear.result.current.status).toBe('entering');
    tick(100);
    expect(appear.result.current.status).toBe('entered');
  });

  it('reduced-motion salta directamente al estado final', () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce') })) as unknown as typeof window.matchMedia;
    const { result, rerender } = renderHook(({ on }) => useTransition(on), { initialProps: { on: false } });
    rerender({ on: true });
    expect(result.current.status).toBe('entered');
    window.matchMedia = original;
  });
});

describe('Fade', () => {
  it('oculta en exited, anima opacidad y llama a onExited', () => {
    const onExited = vi.fn();
    const { getByTestId, rerender } = render(
      <Fade in={false} onExited={onExited}>
        <div data-testid="el" style={{ color: 'red' }} />
      </Fade>,
    );
    const el = getByTestId('el');
    expect(el.style.opacity).toBe('0');
    expect(el.style.visibility).toBe('hidden');
    expect(el.style.color).toBe('red');

    rerender(
      <Fade in onExited={onExited}>
        <div data-testid="el" style={{ color: 'red' }} />
      </Fade>,
    );
    expect(el.style.visibility).toBe('');
    expect(el.style.opacity).toBe('0');
    expect(el.style.transition).toBe('opacity 225ms cubic-bezier(0, 0, 0.2, 1)');
    tick(16);
    expect(el.style.opacity).toBe('1');
    tick(225);

    rerender(
      <Fade in={false} onExited={onExited}>
        <div data-testid="el" style={{ color: 'red' }} />
      </Fade>,
    );
    expect(el.style.transition).toBe('opacity 225ms cubic-bezier(0.4, 0, 1, 1)');
    tick(16);
    expect(el.style.opacity).toBe('0');
    tick(225);
    expect(onExited).toHaveBeenCalledWith(el);
    expect(el.style.visibility).toBe('hidden');
  });

  it('conserva la ref del hijo y desmonta con unmountOnExit', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { queryByTestId, rerender } = render(
      <Fade in unmountOnExit>
        <div data-testid="el" ref={ref} />
      </Fade>,
    );
    expect(ref.current).toBe(queryByTestId('el'));
    rerender(
      <Fade in={false} unmountOnExit>
        <div data-testid="el" ref={ref} />
      </Fade>,
    );
    tick(300);
    expect(queryByTestId('el')).toBeNull();
  });
});

describe('Collapse', () => {
  it('anima la altura y termina en height:auto', () => {
    const { getByTestId, rerender } = render(
      <Collapse in={false}>
        <div data-testid="el" />
      </Collapse>,
    );
    const el = getByTestId('el');
    Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 120 });
    expect(el.style.height).toBe('0px');
    expect(el.style.overflow).toBe('hidden');

    rerender(
      <Collapse in>
        <div data-testid="el" />
      </Collapse>,
    );
    expect(el.style.height).toBe('0px');
    tick(16);
    expect(el.style.height).toBe('120px');
    tick(225);
    expect(el.style.height).toBe('auto');
    expect(el.style.overflow).toBe('');

    rerender(
      <Collapse in={false} timeout={100}>
        <div data-testid="el" />
      </Collapse>,
    );
    expect(el.style.height).toBe('120px');
    tick(16);
    expect(el.style.height).toBe('0px');
    tick(100);
    expect(el.style.visibility).toBe('hidden');
  });
});

describe('Grow', () => {
  it('escala de 0.6,0 a 1,1 con transformOrigin', () => {
    const { getByTestId, rerender } = render(
      <Grow in={false} transformOrigin="left top">
        <div data-testid="el" />
      </Grow>,
    );
    const el = getByTestId('el');
    expect(el.style.transform).toBe('scale(0.6, 0)');
    rerender(
      <Grow in transformOrigin="left top">
        <div data-testid="el" />
      </Grow>,
    );
    expect(el.style.transformOrigin).toBe('left top');
    tick(16);
    expect(el.style.transform).toBe('scale(1, 1)');
    expect(el.style.opacity).toBe('1');
  });
});

describe('StrictMode', () => {
  it('appear y cambios de `in` funcionan con efectos dobles', async () => {
    const { StrictMode } = await import('react');
    const onEntered = vi.fn();
    const view = (on: boolean) => (
      <StrictMode>
        <Fade in={on} appear onEntered={onEntered}>
          <div data-testid="el" />
        </Fade>
      </StrictMode>
    );
    const { getByTestId, rerender } = render(view(true));
    const el = getByTestId('el');
    tick(16);
    expect(el.style.opacity).toBe('1');
    tick(225);
    expect(onEntered).toHaveBeenCalledTimes(1);
    rerender(view(false));
    tick(300);
    expect(el.style.visibility).toBe('hidden');
  });
});
