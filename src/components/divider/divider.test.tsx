import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Divider } from './Divider';

describe('Divider', () => {
  it('por defecto es un <hr> con separador implícito y sin role explícito', () => {
    const { container } = render(<Divider />);
    const hr = container.firstElementChild!;
    expect(hr.tagName).toBe('HR');
    expect(hr.className).toBe('mtx-divider');
    expect(hr).not.toHaveAttribute('role');
    expect(screen.getByRole('separator')).toBe(hr);
  });

  it('variantes middle e inset', () => {
    const { container } = render(
      <>
        <Divider variant="middle" />
        <Divider variant="inset" />
        <Divider variant="fullWidth" />
      </>,
    );
    const [middle, inset, full] = Array.from(container.children);
    expect(middle).toHaveClass('mtx-divider--middle');
    expect(inset).toHaveClass('mtx-divider--inset');
    expect(full.className).toBe('mtx-divider');
  });

  it('vertical: div con role separator, aria-orientation y flexItem', () => {
    render(<Divider orientation="vertical" flexItem />);
    const el = screen.getByRole('separator');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el).toHaveClass('mtx-divider--vertical', 'mtx-divider--flex-item');
  });

  it('con texto genera el span y alinea', () => {
    render(<Divider textAlign="left">LEFT</Divider>);
    const el = screen.getByRole('separator');
    expect(el).toHaveClass('mtx-divider--text', 'mtx-divider--text-left');
    expect(el.querySelector('.mtx-divider__text')).toHaveTextContent('LEFT');
  });

  it('textAlign center no añade modificador de alineación', () => {
    render(<Divider>CENTER</Divider>);
    expect(screen.getByRole('separator').className).toBe('mtx-divider mtx-divider--text');
  });

  it('como <li> conserva el rol de lista y, vacío, es decorativo', () => {
    const { container } = render(
      <ul>
        <li>Uno</li>
        <Divider component="li" variant="inset" />
        <Divider component="li">Grupo</Divider>
      </ul>,
    );
    const [, empty, withText] = Array.from(container.querySelectorAll('li'));
    expect(empty).toHaveAttribute('aria-hidden', 'true');
    expect(empty).not.toHaveAttribute('role');
    expect(withText).not.toHaveAttribute('aria-hidden');
    expect(withText).not.toHaveAttribute('role');
  });

  it('respeta role y aria-orientation del usuario', () => {
    const { container } = render(<Divider orientation="vertical" role="presentation" aria-orientation="horizontal" />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute('role', 'presentation');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('concatena className y reenvía ref', () => {
    const ref = createRef<HTMLHRElement>();
    const { container } = render(<Divider ref={ref} className="extra" />);
    expect(container.firstElementChild).toHaveClass('mtx-divider', 'extra');
    expect(ref.current).toBe(container.firstElementChild);
  });

  describe('paridad con vanilla', () => {
    it.each([
      ['<hr data-mtx="divider">', <Divider />],
      ['<hr data-mtx="divider" data-variant="middle">', <Divider variant="middle" />],
      ['<hr data-mtx="divider" data-variant="inset">', <Divider variant="inset" />],
      ['<div data-mtx="divider" data-orientation="vertical" data-flex-item></div>', <Divider orientation="vertical" flexItem />],
      ['<div data-mtx="divider" data-orientation="vertical"></div>', <Divider orientation="vertical" />],
      ['<div data-mtx="divider">CENTER</div>', <Divider>CENTER</Divider>],
      ['<div data-mtx="divider" data-text="LEFT" data-text-align="left"></div>', <Divider textAlign="left">LEFT</Divider>],
      ['<div data-mtx="divider" data-text="RIGHT" data-text-align="right"></div>', <Divider textAlign="right">RIGHT</Divider>],
    ])('%s', async (html, node) => {
      const vanilla = await mountVanilla(html);
      const { container } = render(node);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('<li> vacío dentro de una lista', async () => {
      const vanilla = await mountVanilla('<ul><li data-mtx="divider" data-variant="inset"></li></ul>');
      const { container } = render(
        <ul>
          <Divider component="li" variant="inset" />
        </ul>,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });
  });
});
