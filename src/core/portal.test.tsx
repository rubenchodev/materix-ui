import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Portal } from './portal';

describe('Portal', () => {
  it('monta en document.body por defecto', () => {
    const { container } = render(
      <div>
        <Portal>
          <span data-testid="content">hola</span>
        </Portal>
      </div>,
    );
    const content = document.querySelector('[data-testid="content"]');
    expect(content?.parentElement).toBe(document.body);
    expect(container.querySelector('[data-testid="content"]')).toBeNull();
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
