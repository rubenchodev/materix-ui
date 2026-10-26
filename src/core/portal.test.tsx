import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Portal } from './portal';

describe('Portal', () => {
  it('monta por defecto en un div.mtx-root compartido al final de body', () => {
    const { container } = render(
      <div>
        <Portal>
          <span data-testid="content">hola</span>
        </Portal>
        <Portal>
          <span data-testid="content-2">adiós</span>
        </Portal>
      </div>,
    );
    const root = document.querySelector('[data-testid="content"]')?.parentElement;
    expect(root?.hasAttribute('data-mtx-portal-root')).toBe(true);
    expect(root?.classList.contains('mtx-root')).toBe(true);
    expect(root?.parentElement).toBe(document.body);
    expect(document.querySelector('[data-testid="content-2"]')?.parentElement).toBe(root);
    expect(document.querySelectorAll('[data-mtx-portal-root]')).toHaveLength(1);
    expect(container.querySelector('[data-testid="content"]')).toBeNull();
  });

  it('usa body directamente cuando ya es .mtx-root (CssBaseline)', () => {
    document.body.classList.add('mtx-root');
    try {
      render(
        <Portal>
          <span data-testid="direct" />
        </Portal>,
      );
      expect(document.querySelector('[data-testid="direct"]')?.parentElement).toBe(document.body);
    } finally {
      document.body.classList.remove('mtx-root');
    }
  });

  it('respeta container y disablePortal', () => {
    const target = document.createElement('section');
    document.body.appendChild(target);
    render(
      <Portal container={target}>
        <span data-testid="a" />
      </Portal>,
    );
    expect(target.querySelector('[data-testid="a"]')).not.toBeNull();

    const { container } = render(
      <Portal disablePortal>
        <span data-testid="b" />
      </Portal>,
    );
    expect(container.querySelector('[data-testid="b"]')).not.toBeNull();
    target.remove();
  });

  it('no renderiza nada en el servidor', () => {
    expect(
      renderToString(
        <Portal>
          <span>x</span>
        </Portal>,
      ),
    ).toBe('');
  });
});
