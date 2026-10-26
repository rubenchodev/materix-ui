import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Backdrop } from './index';
import type { BackdropProps } from './index';

/** Backdrop controlado que se cierra con `onClose`. */
function Controlled(props: Partial<BackdropProps> & { initial?: boolean }) {
  const { initial = true, ...rest } = props;
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)}>
        toggle
      </button>
      <Backdrop
        data-testid="bd"
        {...rest}
        open={open}
        onClose={(event, reason) => {
          rest.onClose?.(event, reason);
          setOpen(false);
        }}
      />
    </>
  );
}

describe('Backdrop', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  it('cerrado no renderiza nada; con keepMounted queda oculto y con aria-hidden', () => {
    const { unmount } = render(<Backdrop open={false} data-testid="bd" />);
    expect(screen.queryByTestId('bd')).toBeNull();
    unmount();
    render(<Backdrop open={false} keepMounted data-testid="bd" />);
    const el = screen.getByTestId('bd');
    expect(el).toHaveAttribute('hidden');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).not.toHaveClass('mtx-backdrop--open');
  });

  it('abierto: clases, data-open, sin aria-hidden y portado a body', () => {
    const { container } = render(
      <Backdrop open data-testid="bd">
        <span>Cargando</span>
      </Backdrop>,
    );
    const el = screen.getByTestId('bd');
    expect(container.contains(el)).toBe(false);
    expect(el.parentElement?.hasAttribute("data-mtx-portal-root")).toBe(true);
    expect(el).toHaveClass('mtx-backdrop', 'mtx-backdrop--open');
    expect(el).toHaveAttribute('data-open');
    expect(el).not.toHaveAttribute('aria-hidden');
    expect(el).toHaveTextContent('Cargando');
  });

  it('disablePortal lo renderiza en su sitio; invisible añade el modificador', () => {
    const { container } = render(<Backdrop open invisible disablePortal data-testid="bd" />);
    const el = screen.getByTestId('bd');
    expect(container.contains(el)).toBe(true);
    expect(el).toHaveClass('mtx-backdrop--invisible');
  });

  it('paridad de estructura con vanilla (abierto)', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="backdrop" id="bd-parity" data-open data-invisible><span>Texto</span></div>',
    );
    render(
      <Backdrop open invisible disablePortal data-testid="bd">
        <span>Texto</span>
      </Backdrop>,
    );
    expectParity(screen.getByTestId('bd'), vanilla.firstElementChild);
  });

  it('onOpen al abrir (no en el montaje inicial) y desmonte tras el fundido', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onExited = vi.fn();
    render(<Controlled initial={false} onOpen={onOpen} onExited={onExited} closeOnClick />);
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('toggle'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('bd'));
    expect(screen.getByTestId('bd')).not.toHaveClass('mtx-backdrop--open');
    expect(screen.getByTestId('bd')).toHaveAttribute('aria-hidden', 'true');
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('bd')).toBeNull();
  });

  it('closeOnClick cierra con clic en la capa o texto, pero no en controles del contenido', () => {
    const onClose = vi.fn();
    const onClick = vi.fn();
    render(
      <Controlled closeOnClick onClose={onClose} onClick={onClick}>
        <button type="button">Cancelar</button>
        <span>Texto</span>
      </Controlled>,
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Texto'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][1]).toBe('click');
  });

  it('sin closeOnClick el clic no cierra; data-mtx-backdrop-close sí', () => {
    const onClose = vi.fn();
    render(
      <Controlled onClose={onClose}>
        <button type="button" data-mtx-backdrop-close="">
          Cerrar
        </button>
      </Controlled>,
    );
    fireEvent.click(screen.getByTestId('bd'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'click');
  });

  it('Escape solo cierra con closeOnEscape', () => {
    const onClose = vi.fn();
    const { unmount } = render(<Controlled onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    unmount();
    render(<Controlled closeOnEscape onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escape');
  });

  it('lockScroll bloquea el scroll del body y lo restaura', () => {
    const { rerender } = render(<Backdrop open lockScroll />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Backdrop open={false} lockScroll />);
    expect(document.body.style.overflow).toBe('');
  });

  it('inertOthers marca el resto de la página y lo restaura al cerrar', () => {
    const main = document.createElement('main');
    const already = document.createElement('div');
    already.setAttribute('inert', '');
    document.body.append(main, already);
    const { rerender } = render(<Backdrop open inertOthers data-testid="bd" />);
    expect(main).toHaveAttribute('inert');
    expect(screen.getByTestId('bd')).not.toHaveAttribute('inert');
    rerender(<Backdrop open={false} inertOthers data-testid="bd" />);
    expect(main).not.toHaveAttribute('inert');
    expect(already).toHaveAttribute('inert');
    main.remove();
    already.remove();
  });

  it('el desmontaje libera el bloqueo de scroll', () => {
    const { unmount } = render(<Backdrop open lockScroll closeOnEscape />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
