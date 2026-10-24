import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { getTabbable, useFocusTrap } from './focus-trap';

// jsdom no calcula layout: los elementos se consideran visibles.
const original = Element.prototype.getClientRects;
beforeAll(() => {
  Element.prototype.getClientRects = function getClientRects() {
    return [{}] as unknown as DOMRectList;
  };
});
afterAll(() => {
  Element.prototype.getClientRects = original;
});

function Trap({ active, withInitial = false }: { active: boolean; withInitial?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef<HTMLButtonElement>(null);
  useFocusTrap(ref, { active, initialFocus: withInitial ? initial : undefined });
  return (
    <div ref={ref} data-testid="trap">
      <button type="button">uno</button>
      <button type="button" ref={initial}>
        dos
      </button>
      <button type="button" disabled>
        off
      </button>
      <button type="button">tres</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('enfoca el primero, cicla con Tab/Shift+Tab y devuelve el foco', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const { getByText, rerender } = render(<Trap active />);
    expect(document.activeElement).toBe(getByText('uno'));

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(getByText('tres'));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(getByText('uno'));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(getByText('dos'));

    rerender(<Trap active={false} />);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('respeta initialFocus y reenfoca si el foco sale', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const { getByText, unmount } = render(<Trap active withInitial />);
    expect(document.activeElement).toBe(getByText('dos'));
    outside.focus();
    expect(document.activeElement).toBe(getByText('dos'));
    unmount();
    outside.remove();
  });

  it('getTabbable excluye deshabilitados, tabindex -1 y radios no activos del grupo', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button>a</button>
      <span tabindex="-1">b</span>
      <input type="radio" name="g" value="1" />
      <input type="radio" name="g" value="2" checked />
      <input type="radio" name="h" value="1" />
      <input type="radio" name="h" value="2" />
    `;
    document.body.appendChild(root);
    const list = getTabbable(root);
    expect(list.map((el) => el.tagName + ((el as HTMLInputElement).value || ''))).toEqual(['BUTTON', 'INPUT2', 'INPUT1']);
    root.remove();
  });
});
