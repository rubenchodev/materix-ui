import { describe, it, expect, vi, afterEach } from 'vitest';
import { transitionGrow, cancelTransition } from '../src/core/transition.js';

describe('transition: cancelTransition', () => {
  afterEach(() => vi.useRealTimers());

  it('cancela la transición en curso, resuelve con false y retira las clases de fase', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const promise = transitionGrow(el, true);
    expect(cancelTransition(el)).toBe(true);
    vi.advanceTimersByTime(300);
    await expect(promise).resolves.toBe(false);
    expect(el.className).toBe('');
    expect(cancelTransition(el)).toBe(false);
  });
});
