import { createRef } from 'react';
import { render } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Badge } from './Badge';

const MAIL = <span className="material-icons" aria-hidden="true">mail</span>;
const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const badgeNode = (container: HTMLElement) => container.querySelector('.mtx-badge__badge') as HTMLElement;

describe('Badge', () => {
  it('renderiza la insignia con el contenido, color default y aria-hidden', () => {
    const { container } = render(<Badge badgeContent={4}>{MAIL}</Badge>);
    expect(root(container).tagName).toBe('SPAN');
    expect(root(container)).toHaveClass('mtx-badge', 'mtx-badge--default');
    expect(badgeNode(container)).toHaveTextContent('4');
    expect(badgeNode(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('aplica max+ a valores numéricos (número o cadena)', () => {
    const { container, rerender } = render(<Badge badgeContent={150} />);
    expect(badgeNode(container)).toHaveTextContent('99+');
    rerender(<Badge badgeContent="1000" max={999} />);
    expect(badgeNode(container)).toHaveTextContent('999+');
    rerender(<Badge badgeContent="New" />);
    expect(badgeNode(container)).toHaveTextContent('New');
  });

  it('oculta con 0 o sin contenido salvo showZero; invisible siempre oculta', () => {
    const { container, rerender } = render(<Badge badgeContent={0} />);
    expect(root(container)).toHaveClass('mtx-badge--invisible');
    rerender(<Badge badgeContent={0} showZero />);
    expect(root(container)).not.toHaveClass('mtx-badge--invisible');
    rerender(<Badge />);
    expect(root(container)).toHaveClass('mtx-badge--invisible');
    rerender(<Badge badgeContent={5} invisible />);
    expect(root(container)).toHaveClass('mtx-badge--invisible');
  });

  it('variante dot sin texto y visible sin contenido', () => {
    const { container } = render(<Badge variant="dot" badgeContent={9} />);
    expect(root(container)).toHaveClass('mtx-badge--dot');
    expect(root(container)).not.toHaveClass('mtx-badge--invisible');
    expect(badgeNode(container).textContent).toBe('');
  });

  it('colores, anclajes (anchor y anchorOrigin) y overlap circular', () => {
    const { container, rerender } = render(<Badge badgeContent={1} color="error" anchor="bottom-left" overlap="circular" />);
    expect(root(container)).toHaveClass('mtx-badge--error', 'mtx-badge--bottom-left', 'mtx-badge--overlap-circular');
    rerender(<Badge badgeContent={1} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} />);
    expect(root(container)).toHaveClass('mtx-badge--top-left');
    rerender(<Badge badgeContent={1} anchor="top-right" />);
    expect(root(container).className).not.toContain('top-right');
  });

  it('standalone deja el número accesible; label genera texto oculto', () => {
    const { container, rerender } = render(<Badge standalone badgeContent={4} color="primary" />);
    expect(root(container)).toHaveClass('mtx-badge--standalone');
    expect(badgeNode(container)).not.toHaveAttribute('aria-hidden');
    rerender(<Badge badgeContent={150} label="{0} sin leer" />);
    expect(badgeNode(container)).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.mtx-badge__label')).toHaveTextContent('99+ sin leer');
    rerender(<Badge badgeContent={150} label="{0} sin leer" invisible />);
    expect(container.querySelector('.mtx-badge__label')!.textContent).toBe('');
  });

  it('label con contenido no textual no muestra [object Object]', () => {
    const { container } = render(<Badge badgeContent={<b>!</b>} label="Aviso {0}" />);
    expect(container.querySelector('.mtx-badge__label')!.textContent).toBe('Aviso ');
  });

  it('reenvía ref, concatena className y acepta component', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Badge component="div" ref={ref} className="extra" id="b1" badgeContent={2} />);
    expect(ref.current).toBe(root(container));
    expect(root(container).tagName).toBe('DIV');
    expect(root(container)).toHaveClass('mtx-badge', 'extra');
    expect(root(container)).toHaveAttribute('id', 'b1');
  });

  describe('paridad con vanilla', () => {
    it('standard con color y max', async () => {
      const vanilla = await mountVanilla(
        '<span data-mtx="badge" data-content="150" data-color="error"><span class="material-icons" aria-hidden="true">mail</span></span>',
      );
      const { container } = render(<Badge badgeContent={150} color="error">{MAIL}</Badge>);
      expectParity(root(container), vanilla.firstElementChild);
    });

    it('dot con anclaje y overlap circular', async () => {
      const vanilla = await mountVanilla(
        '<span data-mtx="badge" data-variant="dot" data-color="success" data-overlap="circular" data-anchor="bottom-right"><span class="material-icons" aria-hidden="true">mail</span></span>',
      );
      const { container } = render(
        <Badge variant="dot" color="success" overlap="circular" anchor="bottom-right">{MAIL}</Badge>,
      );
      expectParity(root(container), vanilla.firstElementChild);
    });

    it('cero invisible, showZero y standalone con label', async () => {
      const vanilla = await mountVanilla(
        '<span data-mtx="badge" data-content="0"></span><span data-mtx="badge" data-content="0" data-show-zero></span>'
        + '<span data-mtx="badge" data-standalone data-content="4" data-color="primary" data-label="{0} unread"></span>'
        + '<span data-mtx="badge" data-standalone data-content="7"></span>',
      );
      const { container } = render(
        <>
          <Badge badgeContent={0} />
          <Badge badgeContent={0} showZero />
          <Badge standalone badgeContent={4} color="primary" label="{0} unread" />
          <Badge standalone badgeContent={7} />
        </>,
      );
      Array.from(container.children).forEach((el, i) => expectParity(el, vanilla.children[i]));
    });
  });
});
