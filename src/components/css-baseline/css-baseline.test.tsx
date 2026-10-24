import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { CssBaseline } from './CssBaseline';
import { ScopedCssBaseline } from './ScopedCssBaseline';

const baseCss = readFileSync(
  resolve(__dirname, '../../../node_modules/@rubenchodev/materix-ui/dist/base.css'),
  'utf8',
);

describe('CssBaseline', () => {
  afterEach(() => {
    document.body.className = '';
    document.documentElement.classList.remove('mtx-root');
  });

  it('añade mtx-root a <body> y lo retira al desmontar', () => {
    const { unmount } = render(<CssBaseline />);
    expect(document.body).toHaveClass('mtx-root');
    unmount();
    expect(document.body).not.toHaveClass('mtx-root');
  });

  it('conserva las clases existentes y no retira una mtx-root previa', () => {
    document.body.className = 'app-shell mtx-root';
    const { unmount } = render(<CssBaseline />);
    expect(document.body.className).toBe('app-shell mtx-root');
    unmount();
    expect(document.body.className).toBe('app-shell mtx-root');
  });

  it('varias instancias: la clase se mantiene hasta desmontar la última (idempotente)', () => {
    const a = render(<CssBaseline />);
    const b = render(<CssBaseline />);
    expect(document.body.className).toBe('mtx-root');
    a.unmount();
    expect(document.body).toHaveClass('mtx-root');
    b.unmount();
    expect(document.body).not.toHaveClass('mtx-root');
  });

  it('target="html" marca <html>', () => {
    const { unmount } = render(<CssBaseline target="html" />);
    expect(document.documentElement).toHaveClass('mtx-root');
    unmount();
    expect(document.documentElement).not.toHaveClass('mtx-root');
  });

  it('renderiza sus hijos tal cual y nada sin hijos', () => {
    const { container } = render(
      <CssBaseline>
        <p>App</p>
      </CssBaseline>,
    );
    expect(container.innerHTML).toBe('<p>App</p>');
    const empty = render(<CssBaseline />);
    expect(empty.container.innerHTML).toBe('');
  });

  it('no accede al DOM en SSR', () => {
    const html = renderToString(
      <CssBaseline>
        <span>ok</span>
      </CssBaseline>,
    );
    expect(html).toBe('<span>ok</span>');
  });

  describe('color-scheme con base.css', () => {
    let style: HTMLStyleElement;
    beforeEach(() => {
      style = document.createElement('style');
      style.textContent = baseCss;
      document.head.appendChild(style);
    });
    afterEach(() => style.remove());

    it('light por defecto y dark con data-mtx-theme', () => {
      const { container } = render(<ScopedCssBaseline />);
      const el = container.firstElementChild as HTMLElement;
      expect(getComputedStyle(el).getPropertyValue('color-scheme')).toBe('light');
      el.setAttribute('data-mtx-theme', 'dark');
      expect(getComputedStyle(el).getPropertyValue('color-scheme')).toBe('dark');
    });

    it('el tema oscuro de un ancestro también aplica', () => {
      const { container } = render(
        <div data-mtx-theme="dark">
          <ScopedCssBaseline />
        </div>,
      );
      const el = container.querySelector('.mtx-root') as HTMLElement;
      expect(getComputedStyle(el).getPropertyValue('color-scheme')).toBe('dark');
    });

    it('CssBaseline aplica color-scheme al <body>', () => {
      render(<CssBaseline />);
      expect(getComputedStyle(document.body).getPropertyValue('color-scheme')).toBe('light');
    });
  });
});

describe('ScopedCssBaseline', () => {
  it('renderiza un contenedor .mtx-root con component, ref, className y atributos', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <ScopedCssBaseline component="section" ref={ref} className="widget" aria-label="Widget">
        <p>Hola</p>
      </ScopedCssBaseline>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SECTION');
    expect(ref.current).toBe(root);
    expect(root.className).toBe('mtx-root widget');
    expect(root).toHaveAttribute('aria-label', 'Widget');
  });

  it('paridad con vanilla (data-mtx="css-baseline" en un contenedor)', async () => {
    const vanilla = await mountVanilla('<section class="app-shell" data-mtx="css-baseline"><p>Hola</p></section>');
    const { container } = render(
      <ScopedCssBaseline component="section" className="app-shell">
        <p>Hola</p>
      </ScopedCssBaseline>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { classPrefixes: ['mtx-', 'app-'] });
  });
});
