import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Snackbar, SnackbarProvider, snackbarAnchor, useSnackbar } from './index';
import type { SnackbarProps } from './index';

/** Snackbar controlado que se cierra con `onClose`. */
function Controlled(props: Partial<SnackbarProps> & { initial?: boolean }) {
  const { initial = true, ...rest } = props;
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        abrir
      </button>
      <Snackbar
        data-testid="sb"
        message="Mensaje"
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

describe('Snackbar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('genera mensaje con role=alert, acción y anclaje por defecto', () => {
    render(<Snackbar open message="Guardado" action="Deshacer" data-testid="sb" />);
    const el = screen.getByTestId('sb');
    expect(el).toHaveClass('mtx-snackbar', 'mtx-snackbar--bottom-center', 'mtx-snackbar--open');
    expect(el.querySelector('.mtx-snackbar__message')).toHaveAttribute('role', 'alert');
    expect(el.querySelector('.mtx-snackbar__action')).toHaveAttribute('type', 'button');
  });

  it('paridad de estructura con vanilla', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="snackbar" data-message="Hola" data-action="Ok" data-anchor="top-right" data-role="status" data-open></div>',
    );
    render(
      <Snackbar open message="Hola" action="Ok" role="status" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} data-testid="sb" />,
    );
    expectParity(screen.getByTestId('sb'), vanilla.firstElementChild);
  });

  it('cerrado no renderiza; al abrir llama a onOpen', () => {
    const onOpen = vi.fn();
    render(<Controlled initial={false} onOpen={onOpen} />);
    expect(screen.queryByTestId('sb')).toBeNull();
    fireEvent.click(screen.getByText('abrir'));
    expect(screen.getByTestId('sb')).toHaveClass('mtx-snackbar--open');
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('se cierra solo con autoHideDuration (reason timeout) y se desmonta tras la transición', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onExited = vi.fn();
    render(<Controlled autoHideDuration={1000} onClose={onClose} onExited={onExited} />);
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledWith(null, 'timeout');
    expect(screen.getByTestId('sb')).not.toHaveClass('mtx-snackbar--open');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('sb')).toBeNull();
  });

  it('sin autoHideDuration no se cierra solo', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Controlled onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('pausa el temporizador con hover/foco y lo reinicia al salir', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Controlled autoHideDuration={1000} onClose={onClose} action="Ok" />);
    const el = screen.getByTestId('sb');
    act(() => {
      vi.advanceTimersByTime(800);
    });
    fireEvent.mouseEnter(el);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(el);
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.focus(el.querySelector('button')!);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.blur(el.querySelector('button')!);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onClose).toHaveBeenCalledWith(null, 'timeout');
  });

  it('Escape cierra con reason escapeKeyDown; un Escape ya gestionado no', () => {
    const onClose = vi.fn();
    render(<Controlled onClose={onClose} />);
    const handled = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    handled.preventDefault();
    document.dispatchEvent(handled);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
  });

  it('con varios abiertos, Escape cierra solo el más reciente', () => {
    const a = vi.fn();
    const b = vi.fn();
    render(
      <>
        <Snackbar open message="A" onClose={a} />
        <Snackbar open message="B" onClose={b} />
      </>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(b).toHaveBeenCalledTimes(1);
    expect(a).not.toHaveBeenCalled();
  });

  it('clic fuera solicita el cierre con clickaway salvo disableClickAway', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Snackbar open message="X" onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'clickaway');
    onClose.mockClear();
    rerender(<Snackbar open message="X" onClose={onClose} disableClickAway />);
    fireEvent.mouseDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('onAction se ejecuta y closeOnAction cierra con reason action', () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(<Controlled action="Deshacer" onAction={onAction} onClose={onClose} closeOnAction />);
    fireEvent.click(screen.getByText('Deshacer'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'action');
  });

  it('una acción como nodo se pinta tal cual', () => {
    render(<Snackbar open message="X" action={<button type="button" data-testid="custom">Y</button>} />);
    expect(screen.getByTestId('custom')).not.toHaveClass('mtx-snackbar__action');
  });

  it('snackbarAnchor valida el anclaje', () => {
    expect(snackbarAnchor({ vertical: 'top', horizontal: 'left' })).toBe('top-left');
    expect(snackbarAnchor({ vertical: 'x' as 'top', horizontal: 'y' as 'left' })).toBe('bottom-center');
  });
});

describe('SnackbarProvider / useSnackbar', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function Trigger({ onAction }: { onAction?: () => void }) {
    const { enqueue, close } = useSnackbar();
    return (
      <>
        <button type="button" onClick={() => enqueue('Primero')}>
          uno
        </button>
        <button type="button" onClick={() => enqueue({ message: 'Segundo', action: 'Deshacer', onAction, duration: null })}>
          dos
        </button>
        <button type="button" onClick={() => close()}>
          cerrar
        </button>
      </>
    );
  }

  it('muestra un aviso con role=status y duración por defecto de 4 s', () => {
    vi.useFakeTimers();
    render(
      <SnackbarProvider>
        <Trigger />
      </SnackbarProvider>,
    );
    fireEvent.click(screen.getByText('uno'));
    const message = screen.getByText('Primero');
    expect(message).toHaveAttribute('role', 'status');
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Primero')).toBeNull();
  });

  it('un aviso nuevo sustituye al visible tras su salida (uno a la vez)', () => {
    vi.useFakeTimers();
    render(
      <SnackbarProvider>
        <Trigger />
      </SnackbarProvider>,
    );
    fireEvent.click(screen.getByText('uno'));
    fireEvent.click(screen.getByText('dos'));
    expect(screen.getByText('Primero')).toBeInTheDocument();
    expect(screen.queryByText('Segundo')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Primero')).toBeNull();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });

  it('onAction se ejecuta y cierra el aviso; close() lo cierra', () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    render(
      <SnackbarProvider>
        <Trigger onAction={onAction} />
      </SnackbarProvider>,
    );
    fireEvent.click(screen.getByText('dos'));
    fireEvent.click(screen.getByText('Deshacer'));
    expect(onAction).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Segundo')).toBeNull();
    fireEvent.click(screen.getByText('uno'));
    expect(screen.getByText('Primero')).toBeInTheDocument();
    fireEvent.click(screen.getByText('cerrar'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Primero')).toBeNull();
  });

  it('close() notifica reason api y la API mantiene identidad estable entre avisos', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const apis: unknown[] = [];
    function Probe() {
      const api = useSnackbar();
      apis.push(api);
      return (
        <>
          <button type="button" onClick={() => api.enqueue({ message: 'Uno', onClose })}>
            encolar
          </button>
          <button type="button" onClick={() => api.close()}>
            cerrar
          </button>
        </>
      );
    }
    render(
      <SnackbarProvider>
        <Probe />
      </SnackbarProvider>,
    );
    fireEvent.click(screen.getByText('encolar'));
    fireEvent.click(screen.getByText('cerrar'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onClose).toHaveBeenCalledWith('api');
    expect(new Set(apis).size).toBe(1);
  });

  it('useSnackbar fuera del proveedor lanza un error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/SnackbarProvider/);
    spy.mockRestore();
  });
});
