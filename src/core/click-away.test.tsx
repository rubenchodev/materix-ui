import { describe, expect, it, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { useClickAway } from './click-away';

function Box({ onAway, enabled = true }: { onAway: () => void; enabled?: boolean }) {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  useClickAway([a, b], onAway, { enabled });
  return (
    <>
      <div ref={a} data-testid="a" />
      <div ref={b} data-testid="b" />
      <div data-testid="out" />
    </>
  );
}

describe('useClickAway', () => {
  afterEach(() => vi.useRealTimers());

  it('notifica clics fuera de todos los nodos', () => {
    const onAway = vi.fn();
    const { getByTestId } = render(<Box onAway={onAway} />);
    fireEvent.mouseDown(getByTestId('a'));
    fireEvent.mouseDown(getByTestId('b'));
    expect(onAway).not.toHaveBeenCalled();
    fireEvent.mouseDown(getByTestId('out'));
    expect(onAway).toHaveBeenCalledTimes(1);
  });

  it('ignora el mousedown sintético durante 1 s tras touchstart', () => {
    vi.useFakeTimers();
    const onAway = vi.fn();
    const { getByTestId } = render(<Box onAway={onAway} />);
    const out = getByTestId('out');
    fireEvent.touchStart(out);
    fireEvent.mouseDown(out);
    expect(onAway).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(999);
    fireEvent.mouseDown(out);
    expect(onAway).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2);
    fireEvent.mouseDown(out);
    expect(onAway).toHaveBeenCalledTimes(2);
  });

  it('no escucha con enabled=false', () => {
    const onAway = vi.fn();
    const { getByTestId } = render(<Box onAway={onAway} enabled={false} />);
    fireEvent.mouseDown(getByTestId('out'));
    expect(onAway).not.toHaveBeenCalled();
  });
});
