import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { addModal, hasOpenModal, isTopModal, removeModal, useScrollLock } from './scroll-lock';

function Lock({ locked }: { locked: boolean }) {
  useScrollLock(locked);
  return null;
}

describe('scroll lock', () => {
  it('bloqueo anidado: se libera al cerrar el último y restaura el overflow previo', () => {
    document.body.style.overflow = 'scroll';
    const outer = render(<Lock locked />);
    expect(document.body.style.overflow).toBe('hidden');
    const inner = render(<Lock locked />);
    outer.rerender(<Lock locked={false} />);
    expect(document.body.style.overflow).toBe('hidden');
    inner.unmount();
    expect(document.body.style.overflow).toBe('scroll');
    expect(hasOpenModal()).toBe(false);
    outer.unmount();
  });

  it('respeta un overflow cambiado por el autor durante el bloqueo', () => {
    document.body.style.overflow = '';
    const { unmount } = render(<Lock locked />);
    document.body.style.overflow = 'auto';
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('API imperativa: isTopModal y poda de nodos desconectados', () => {
    const a = {};
    const node = document.createElement('div');
    document.body.appendChild(node);
    addModal(a);
    addModal(node);
    expect(isTopModal(node)).toBe(true);
    node.remove();
    expect(isTopModal(a)).toBe(true);
    removeModal(a);
    removeModal(a);
    expect(hasOpenModal()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });
});
