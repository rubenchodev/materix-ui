import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Link } from './Link';

describe('Link', () => {
  it('por defecto es un <a> con la clase base', () => {
    render(<Link href="/docs">Docs</Link>);
    const el = screen.getByRole('link', { name: 'Docs' });
    expect(el.className).toBe('mtx-link');
    expect(el).toHaveAttribute('href', '/docs');
  });

  it('color y underline', () => {
    render(
      <Link href="#" color="secondary" underline="hover">
        x
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveClass('mtx-link--secondary', 'mtx-link--color-secondary', 'mtx-link--underline-hover');
  });

  it('component="button" añade type="button" y respeta un type explícito', () => {
    render(
      <>
        <Link component="button">Reenviar</Link>
        <Link component="button" type="submit">
          Enviar
        </Link>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Reenviar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit');
  });

  it('disabled en <a>: aria-disabled, fuera del tabulado y sin onClick', async () => {
    const onClick = vi.fn();
    render(
      <Link href="#x" disabled onClick={onClick}>
        Off
      </Link>,
    );
    const el = screen.getByText('Off');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveAttribute('tabindex', '-1');
    await userEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled en <button>: atributo disabled nativo', () => {
    render(
      <Link component="button" disabled>
        Off
      </Link>,
    );
    const el = screen.getByRole('button');
    expect(el).toBeDisabled();
    expect(el).not.toHaveAttribute('aria-disabled');
  });

  it('habilitado: llama onClick y navega con teclado', async () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <Link href="#y" onClick={onClick}>
        On
      </Link>,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('component personalizado recibe las props', () => {
    const Custom = (props: { to: string; className?: string; children?: React.ReactNode }) => (
      <a href={props.to} className={props.className}>
        {props.children}
      </a>
    );
    render(
      <Link component={Custom} to="/route" color="error">
        Ruta
      </Link>,
    );
    const el = screen.getByRole('link', { name: 'Ruta' });
    expect(el).toHaveAttribute('href', '/route');
    expect(el).toHaveClass('mtx-link', 'mtx-link--error');
  });

  it('concatena className y reenvía ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} className="extra" href="#">
        x
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveClass('mtx-link', 'extra');
    expect(ref.current).toBe(screen.getByRole('link'));
  });

  describe('paridad con vanilla', () => {
    const attributes = ['href', 'tabindex'];
    it.each([
      ['<a data-mtx="link" href="#a">A</a>', <Link href="#a">A</Link>],
      ['<a data-mtx="link" data-color="secondary" href="#a">A</a>', <Link color="secondary" href="#a">A</Link>],
      ['<a data-mtx="link" data-underline="none" href="#a">A</a>', <Link underline="none" href="#a">A</Link>],
      [
        '<a data-mtx="link" data-color="error" data-underline="always" href="#a">A</a>',
        <Link color="error" underline="always" href="#a">A</Link>,
      ],
      ['<a data-mtx="link" data-disabled href="#a">A</a>', <Link disabled href="#a">A</Link>],
      ['<button data-mtx="link">B</button>', <Link component="button">B</Link>],
      ['<button data-mtx="link" disabled>B</button>', <Link component="button" disabled>B</Link>],
    ])('%s', async (html, node) => {
      const vanilla = await mountVanilla(html);
      const { container } = render(node);
      expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes });
    });
  });
});
