import { createRef } from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Container } from './Container';

describe('Container', () => {
  it('renderiza un div .mtx-container sin modificadores por defecto (tope lg en CSS)', () => {
    const { container } = render(<Container>Contenido</Container>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.className).toBe('mtx-container');
    expect(root).toHaveTextContent('Contenido');
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('maxWidth="%s" aplica mtx-container--%s', (mw) => {
    const { container } = render(<Container maxWidth={mw} />);
    expect(container.firstElementChild).toHaveClass('mtx-container', `mtx-container--${mw}`);
  });

  it('maxWidth={false} produce un contenedor fluido', () => {
    const { container } = render(<Container maxWidth={false} />);
    expect(container.firstElementChild).toHaveClass('mtx-container--fluid');
  });

  it('fixed y disableGutters aplican sus clases', () => {
    const { container } = render(<Container fixed disableGutters />);
    expect(container.firstElementChild).toHaveClass('mtx-container--fixed', 'mtx-container--disable-gutters');
  });

  it('un maxWidth no válido no rompe el render y avisa en desarrollo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error valor no válido a propósito
    const { container } = render(<Container maxWidth="huge" />);
    expect(container.firstElementChild!.className).toBe('mtx-container');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('component, ref, className concatenado y atributos nativos', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Container component="main" ref={ref} className="app" id="main" aria-label="Principal" maxWidth="md" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('MAIN');
    expect(ref.current).toBe(root);
    expect(root.className).toBe('mtx-container mtx-container--md app');
    expect(root).toHaveAttribute('id', 'main');
    expect(root).toHaveAttribute('aria-label', 'Principal');
  });

  it('es seguro en SSR', () => {
    expect(renderToString(<Container maxWidth="sm">Hola</Container>)).toContain('class="mtx-container mtx-container--sm"');
  });

  describe('paridad con vanilla', () => {
    it('por defecto', async () => {
      const vanilla = await mountVanilla('<div data-mtx="container"><p>Texto</p></div>');
      const { container } = render(<Container><p>Texto</p></Container>);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('max-width, fixed y disable-gutters', async () => {
      const vanilla = await mountVanilla('<main data-mtx="container" data-max-width="md" data-disable-gutters data-fixed>X</main>');
      const { container } = render(<Container component="main" maxWidth="md" disableGutters fixed>X</Container>);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('data-max-width="false"', async () => {
      const vanilla = await mountVanilla('<div data-mtx="container" data-max-width="false"></div>');
      const { container } = render(<Container maxWidth={false} />);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });
  });
});
