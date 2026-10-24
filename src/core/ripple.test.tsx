import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { useRipple, RIPPLE_DURATION } from './ripple';

function Host({ disabled, centered }: { disabled?: boolean; centered?: boolean }) {
  const { handlers, element } = useRipple<HTMLButtonElement>({ disabled, centered });
  return (
    <button type="button" className="mtx-button" {...handlers}>
      Guardar
      {element}
    </button>
  );
}

function setup(props: { disabled?: boolean; centered?: boolean } = {}) {
  const utils = render(<Host {...props} />);
  const button = utils.getByRole('button');
  button.getBoundingClientRect = () =>
    ({ left: 10, top: 20, width: 100, height: 40, right: 110, bottom: 60, x: 10, y: 20, toJSON() {} }) as DOMRect;
  return { ...utils, button };
}

describe('useRipple', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('no renderiza contenedor sin ripples', () => {
    const { button } = setup();
    expect(button.querySelector('.mtx-ripple-container')).toBeNull();
  });

  it('crea el DOM de vanilla con tamaño y posición en línea', () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0, clientX: 30, clientY: 30 });
    const container = button.lastElementChild as HTMLElement;
    expect(container.className).toBe('mtx-ripple-container');
    const ripple = container.firstElementChild as HTMLElement;
    expect(ripple.className).toBe('mtx-ripple');
    // x=20, y=10: sizeX = max(80,20)*2+2 = 162, sizeY = max(30,10)*2+2 = 62.
    const size = Math.sqrt(162 * 162 + 62 * 62);
    expect(ripple.style.width).toBe(`${size}px`);
    expect(ripple.style.height).toBe(`${size}px`);
    expect(ripple.style.left).toBe(`${20 - size / 2}px`);
    expect(ripple.style.top).toBe(`${10 - size / 2}px`);
  });

  it('centered coloca el círculo en el centro', () => {
    const { button } = setup({ centered: true });
    fireEvent.pointerDown(button, { button: 0, clientX: 15, clientY: 25 });
    const ripple = button.querySelector('.mtx-ripple') as HTMLElement;
    const sizeX = 50 * 2 + 2;
    const sizeY = 20 * 2 + 2;
    const size = Math.sqrt(sizeX * sizeX + sizeY * sizeY);
    expect(ripple.style.left).toBe(`${50 - size / 2}px`);
  });

  it('respeta la duración mínima, finaliza y se retira en animationend', () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0, clientX: 30, clientY: 30 });
    fireEvent.pointerUp(button);
    const ripple = button.querySelector('.mtx-ripple') as HTMLElement;
    expect(ripple.classList.contains('mtx-ripple--finishing')).toBe(false);
    act(() => {
      vi.advanceTimersByTime(RIPPLE_DURATION - 1);
    });
    expect(ripple.classList.contains('mtx-ripple--finishing')).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(ripple.className).toBe('mtx-ripple mtx-ripple--finishing');
    // jsdom no define AnimationEvent: React escucha la variante con prefijo.
    fireEvent.animationEnd(ripple);
    fireEvent(ripple, new Event('webkitAnimationEnd', { bubbles: true }));
    expect(button.querySelector('.mtx-ripple')).toBeNull();
    expect(button.querySelector('.mtx-ripple-container')).toBeNull();
  });

  it('retira el ripple con el respaldo de 1100 ms si no llega animationend', () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerLeave(button);
    act(() => {
      vi.advanceTimersByTime(RIPPLE_DURATION);
    });
    expect(button.querySelector('.mtx-ripple--finishing')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(RIPPLE_DURATION * 2);
    });
    expect(button.querySelector('.mtx-ripple-container')).toBeNull();
  });

  it('pointercancel también termina y varias pulsaciones crean varios ripples', () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerCancel(button);
    fireEvent.pointerDown(button, { button: 0 });
    expect(button.querySelectorAll('.mtx-ripple')).toHaveLength(2);
  });

  it('no crea ripple deshabilitado, con botón secundario ni con reduced-motion', () => {
    const { button, unmount } = setup({ disabled: true });
    fireEvent.pointerDown(button, { button: 0 });
    expect(button.querySelector('.mtx-ripple')).toBeNull();
    unmount();

    const second = setup();
    fireEvent.pointerDown(second.button, { button: 2 });
    expect(second.button.querySelector('.mtx-ripple')).toBeNull();

    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes('reduce') })) as unknown as typeof window.matchMedia;
    fireEvent.pointerDown(second.button, { button: 0 });
    expect(second.button.querySelector('.mtx-ripple')).toBeNull();
    window.matchMedia = original;
  });
});
