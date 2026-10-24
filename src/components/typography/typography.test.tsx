import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Typography, type TypographyVariant } from './Typography';

describe('Typography', () => {
  it('por defecto es body1 en un <p>', () => {
    render(<Typography>Texto</Typography>);
    const el = screen.getByText('Texto');
    expect(el.tagName).toBe('P');
    expect(el.className).toBe('mtx-typography mtx-typography--body1');
  });

  it.each<[TypographyVariant, string]>([
    ['h1', 'H1'],
    ['h4', 'H4'],
    ['h6', 'H6'],
    ['subtitle1', 'P'],
    ['subtitle2', 'P'],
    ['body2', 'P'],
    ['button', 'SPAN'],
    ['caption', 'SPAN'],
    ['overline', 'SPAN'],
  ])('variant %s → clase y etiqueta %s', (variant, tag) => {
    render(<Typography variant={variant}>v</Typography>);
    const el = screen.getByText('v');
    expect(el.tagName).toBe(tag);
    expect(el).toHaveClass(`mtx-typography--${variant}`);
  });

  it('component polimórfico: la etiqueta es semántica y la variante visual', () => {
    render(
      <Typography component="h3" variant="h5">
        Título
      </Typography>,
    );
    const el = screen.getByRole('heading', { level: 3 });
    expect(el).toHaveClass('mtx-typography--h5');
    expect(el).not.toHaveClass('mtx-typography--h3');
  });

  it('un encabezado sin variant toma la suya de la etiqueta (como vanilla)', () => {
    render(<Typography component="h2">Sección</Typography>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('mtx-typography--h2');
  });

  it('variant inherit no aplica clase de escala', () => {
    render(<Typography variant="inherit">x</Typography>);
    expect(screen.getByText('x').className).toBe('mtx-typography');
  });

  it('variantMapping sustituye la etiqueta por defecto', () => {
    render(
      <Typography variant="subtitle1" variantMapping={{ subtitle1: 'h6' }}>
        s
      </Typography>,
    );
    expect(screen.getByText('s').tagName).toBe('H6');
  });

  it('color, align, noWrap, gutterBottom y paragraph', () => {
    render(
      <Typography variant="caption" color="error" align="center" noWrap gutterBottom paragraph>
        x
      </Typography>,
    );
    const el = screen.getByText('x');
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass(
      'mtx-typography--color-error',
      'mtx-typography--center',
      'mtx-typography--align-center',
      'mtx-typography--no-wrap',
      'mtx-typography--gutter-bottom',
      'mtx-typography--paragraph',
    );
  });

  it('variantes responsive y escala fluida', () => {
    render(
      <Typography variant="h5" variantSm="h5" variantMd="h4" variantLg="h3" variantXl="h2" responsive>
        r
      </Typography>,
    );
    expect(screen.getByText('r')).toHaveClass(
      'mtx-typography--sm-h5',
      'mtx-typography--md-h4',
      'mtx-typography--lg-h3',
      'mtx-typography--xl-h2',
      'mtx-typography--responsive',
    );
  });

  it('concatena className, reenvía ref y atributos', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Typography ref={ref} className="extra" id="t1" aria-live="polite">
        x
      </Typography>,
    );
    const el = screen.getByText('x');
    expect(el).toHaveClass('mtx-typography', 'extra');
    expect(el).toHaveAttribute('id', 't1');
    expect(ref.current).toBe(el);
  });

  describe('paridad con vanilla', () => {
    it.each([
      ['<h3 data-mtx="typography" data-variant="h4" data-gutter-bottom>T</h3>', <Typography component="h3" variant="h4" gutterBottom>T</Typography>],
      ['<h2 data-mtx="typography">T</h2>', <Typography component="h2">T</Typography>],
      ['<p data-mtx="typography" data-variant="body1">T</p>', <Typography>T</Typography>],
      ['<span data-mtx="typography" data-variant="overline">T</span>', <Typography variant="overline">T</Typography>],
      ['<p data-mtx="typography" data-variant="body1" data-color="text-secondary">T</p>', <Typography color="text-secondary">T</Typography>],
      ['<p data-mtx="typography" data-variant="body2" data-align="justify">T</p>', <Typography variant="body2" align="justify">T</Typography>],
      ['<p data-mtx="typography" data-variant="body1" data-no-wrap>T</p>', <Typography noWrap>T</Typography>],
      ['<p data-mtx="typography" data-variant="body2" data-paragraph>T</p>', <Typography variant="body2" paragraph>T</Typography>],
      [
        '<h2 data-mtx="typography" data-variant="h5" data-variant-md="h4" data-variant-lg="h3">T</h2>',
        <Typography component="h2" variant="h5" variantMd="h4" variantLg="h3">T</Typography>,
      ],
      ['<h2 data-mtx="typography" data-variant="h2" data-responsive>T</h2>', <Typography variant="h2" responsive>T</Typography>],
    ])('%s', async (html, node) => {
      const vanilla = await mountVanilla(html);
      const { container } = render(node);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
      expect(container.firstElementChild!.tagName).toBe(vanilla.firstElementChild!.tagName);
    });
  });
});
