import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Paper } from './Paper';

describe('Paper', () => {
  it('renderiza un div con la clase base y sin elevación explícita', () => {
    render(<Paper data-testid="p">Contenido</Paper>);
    const el = screen.getByTestId('p');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toBe('mtx-paper');
    expect(el).toHaveTextContent('Contenido');
  });

  it.each([0, 1, 4, 8, 12, 16, 24])('elevation=%i añade mtx-paper--elevation-N', (n) => {
    render(<Paper elevation={n} data-testid="p" />);
    expect(screen.getByTestId('p')).toHaveClass(`mtx-paper--elevation-${n}`);
  });

  it('variant outlined y square', () => {
    render(<Paper variant="outlined" square data-testid="p" />);
    const el = screen.getByTestId('p');
    expect(el).toHaveClass('mtx-paper', 'mtx-paper--outlined', 'mtx-paper--square');
  });

  it('variant elevation no añade modificador', () => {
    render(<Paper variant="elevation" data-testid="p" />);
    expect(screen.getByTestId('p').className).toBe('mtx-paper');
  });

  it('concatena className, reenvía ref, atributos y component', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Paper component="section" ref={ref} className="extra" aria-label="Resumen" style={{ padding: 8 }}>
        x
      </Paper>,
    );
    const el = screen.getByRole('region', { name: 'Resumen' });
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveClass('mtx-paper', 'extra');
    expect(el.style.padding).toBe('8px');
    expect(ref.current).toBe(el);
  });

  describe('paridad con vanilla', () => {
    it.each([
      ['<div data-mtx="paper">A</div>', <Paper>A</Paper>],
      ['<div data-mtx="paper" data-elevation="8">A</div>', <Paper elevation={8}>A</Paper>],
      ['<div data-mtx="paper" data-elevation="0">A</div>', <Paper elevation={0}>A</Paper>],
      ['<div data-mtx="paper" data-variant="outlined" data-square>A</div>', <Paper variant="outlined" square>A</Paper>],
      ['<div data-mtx="paper" data-elevation="3" data-square>A</div>', <Paper elevation={3} square>A</Paper>],
    ])('%s', async (html, node) => {
      const vanilla = await mountVanilla(html);
      const { container } = render(node);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });
  });
});
