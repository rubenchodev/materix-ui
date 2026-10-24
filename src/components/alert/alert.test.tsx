import type { ReactElement } from 'react';
import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Alert, ALERT_CLOSE_DURATION, AlertTitle } from './index';

describe('Alert', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza role=alert, severidad success y variante standard por defecto', () => {
    const { container } = render(<Alert>Guardado</Alert>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('role', 'alert');
    expect(root).toHaveClass('mtx-alert', 'mtx-alert--success', 'mtx-alert--standard');
    expect(root.querySelector('.mtx-alert__message')).toHaveTextContent('Guardado');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('aplica severidad y variante', () => {
    const { container } = render(
      <Alert severity="error" variant="filled">
        X
      </Alert>,
    );
    expect(container.firstElementChild).toHaveClass('mtx-alert--error', 'mtx-alert--filled');
  });

  it('genera el icono SVG de 22px de la severidad', () => {
    const { container } = render(<Alert severity="warning">X</Alert>);
    const svg = container.querySelector('.mtx-alert__icon svg')!;
    expect(svg).toHaveAttribute('width', '22');
    expect(svg).toHaveAttribute('height', '22');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelector('path')!.getAttribute('d')).toContain('M1 21h22L12 2');
  });

  it('icon={false} lo oculta; un nodo o un nombre lo sustituyen', () => {
    const { container, rerender } = render(<Alert icon={false}>X</Alert>);
    expect(container.querySelector('.mtx-alert__icon')).toBeNull();
    rerender(<Alert icon="cloud_done">X</Alert>);
    const icon = container.querySelector('.mtx-alert__icon .material-icons')!;
    expect(icon).toHaveTextContent('cloud_done');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    rerender(<Alert icon={<b data-testid="custom" />}>X</Alert>);
    expect(screen.getByTestId('custom').parentElement).toHaveClass('mtx-alert__icon');
  });

  it('title y AlertTitle generan .mtx-alert__title al inicio del mensaje', () => {
    const { container, rerender } = render(<Alert title="Error">Fallo</Alert>);
    const message = container.querySelector('.mtx-alert__message')!;
    expect(message.firstElementChild).toHaveClass('mtx-alert__title');
    expect(message.firstElementChild).toHaveTextContent('Error');
    rerender(
      <Alert>
        <AlertTitle className="x">Título</AlertTitle>
        Texto
      </Alert>,
    );
    expect(container.querySelector('.mtx-alert__title')).toHaveClass('x');
  });

  it('action se coloca tras el mensaje y antes del botón de cierre', () => {
    const { container } = render(
      <Alert action={<button type="button">Undo</button>} dismissible>
        Borrado
      </Alert>,
    );
    const kids = Array.from(container.firstElementChild!.children);
    expect(kids.map((k) => k.className || k.tagName)).toEqual([
      'mtx-alert__icon',
      'mtx-alert__message',
      'BUTTON',
      'mtx-alert__close',
    ]);
  });

  it('concatena className, reenvía ref, style y atributos', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Alert ref={ref} className="extra" id="a1" style={{ margin: 4 }} role="status">
        X
      </Alert>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('mtx-alert', 'extra');
    expect(root).toHaveAttribute('id', 'a1');
    expect(root).toHaveAttribute('role', 'status');
    expect(root.style.margin).toBe('4px');
  });

  it('dismissible muestra el botón de cierre con el nombre i18n', () => {
    const { container, rerender } = render(<Alert dismissible>X</Alert>);
    expect(container.querySelector('.mtx-alert__close')).toHaveAttribute('aria-label', 'Close');
    rerender(
      <Alert dismissible locale="es">
        X
      </Alert>,
    );
    expect(container.querySelector('.mtx-alert__close')).toHaveAttribute('aria-label', 'Cerrar');
    rerender(
      <I18nProvider locale="es">
        <Alert dismissible>X</Alert>
      </I18nProvider>,
    );
    expect(container.querySelector('.mtx-alert__close')).toHaveAttribute('aria-label', 'Cerrar');
    rerender(
      <Alert dismissible closeLabel="Dismiss">
        X
      </Alert>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveAttribute('type', 'button');
  });

  it('sin onClose ni dismissible no hay botón de cierre', () => {
    const { container } = render(<Alert>X</Alert>);
    expect(container.querySelector('.mtx-alert__close')).toBeNull();
  });

  it('no controlado: el cierre funde, aplica hidden y llama a onClose y onClosed', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onClosed = vi.fn();
    const { container } = render(
      <Alert onClose={onClose} onClosed={onClosed}>
        X
      </Alert>,
    );
    const root = container.firstElementChild as HTMLElement;
    fireEvent.click(container.querySelector('.mtx-alert__close')!);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(root.style.opacity).toBe('0');
    expect(root.style.transform).toBe('translateY(-4px)');
    expect(root).not.toHaveAttribute('hidden');
    expect(onClosed).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(ALERT_CLOSE_DURATION + 10);
    });
    expect(root).toHaveAttribute('hidden');
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('controlado: onClose solicita el cierre; reabrir llama a onOpen y restaura la opacidad', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onClosed = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            reopen
          </button>
          <Alert open={open} onClose={() => setOpen(false)} onOpen={onOpen} onClosed={onClosed} data-testid="alert">
            X
          </Alert>
        </>
      );
    }
    render(<Controlled />);
    const root = screen.getByTestId('alert');
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(root.querySelector('.mtx-alert__close')!);
    act(() => {
      vi.advanceTimersByTime(ALERT_CLOSE_DURATION + 10);
    });
    expect(root).toHaveAttribute('hidden');
    expect(onClosed).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('reopen'));
    expect(root).not.toHaveAttribute('hidden');
    expect(onOpen).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(root.style.opacity).toBe('1');
    expect(root.style.transform).toBe('translateY(0)');
  });

  it('controlado sin cambiar open no se cierra', () => {
    const { container } = render(
      <Alert open onClose={() => {}}>
        X
      </Alert>,
    );
    fireEvent.click(container.querySelector('.mtx-alert__close')!);
    expect(container.firstElementChild).not.toHaveAttribute('hidden');
    expect((container.firstElementChild as HTMLElement).style.opacity).toBe('');
  });

  it('open=false / defaultOpen=false inicial: oculta sin animación ni callbacks', () => {
    const onClosed = vi.fn();
    const { container } = render(
      <Alert defaultOpen={false} onClosed={onClosed}>
        X
      </Alert>,
    );
    expect(container.firstElementChild).toHaveAttribute('hidden');
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('reabrir durante el fundido cancela el cierre', () => {
    vi.useFakeTimers();
    const onClosed = vi.fn();
    const { container, rerender } = render(
      <Alert open onClosed={onClosed}>
        X
      </Alert>,
    );
    rerender(
      <Alert open={false} onClosed={onClosed}>
        X
      </Alert>,
    );
    rerender(
      <Alert open onClosed={onClosed}>
        X
      </Alert>,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.firstElementChild).not.toHaveAttribute('hidden');
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('con prefers-reduced-motion cierra sin esperar la animación', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    try {
      const onClosed = vi.fn();
      const { container } = render(
        <Alert dismissible onClosed={onClosed}>
          X
        </Alert>,
      );
      fireEvent.click(container.querySelector('.mtx-alert__close')!);
      expect(container.firstElementChild).toHaveAttribute('hidden');
      expect(onClosed).toHaveBeenCalledTimes(1);
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('Alert — paridad con vanilla', () => {
  const cases: Array<[string, string, ReactElement]> = [
    [
      'básico',
      '<div data-mtx="alert" data-severity="success">Your changes were saved successfully.</div>',
      <Alert severity="success">Your changes were saved successfully.</Alert>,
    ],
    [
      'con título',
      '<div data-mtx="alert" data-severity="error" data-title="Error">Could not connect to the server.</div>',
      <Alert severity="error" title="Error">
        Could not connect to the server.
      </Alert>,
    ],
    [
      'filled sin icono',
      '<div data-mtx="alert" data-severity="warning" data-variant="filled" data-icon="false">No icon.</div>',
      <Alert severity="warning" variant="filled" icon={false}>
        No icon.
      </Alert>,
    ],
    [
      'outlined descartable',
      '<div data-mtx="alert" data-severity="info" data-variant="outlined" data-dismissible data-close-label="Dismiss notice">You can dismiss this notice.</div>',
      <Alert severity="info" variant="outlined" dismissible closeLabel="Dismiss notice">
        You can dismiss this notice.
      </Alert>,
    ],
    [
      'descartable con título (i18n)',
      '<div data-mtx="alert" data-severity="error" data-variant="filled" data-title="Critical error" data-dismissible>Synchronization has stopped.</div>',
      <Alert severity="error" variant="filled" title="Critical error" onClose={() => {}}>
        Synchronization has stopped.
      </Alert>,
    ],
    [
      'con acción',
      '<div data-mtx="alert" data-severity="success"><div class="mtx-alert__message">1 conversation was deleted.</div><button type="button" class="mtx-button">Undo</button></div>',
      <Alert
        severity="success"
        action={
          <button type="button" className="mtx-button">
            Undo
          </button>
        }
      >
        1 conversation was deleted.
      </Alert>,
    ],
    [
      'icono propio',
      '<div data-mtx="alert" data-severity="success"><span class="mtx-alert__icon"><span class="material-icons" aria-hidden="true">cloud_done</span></span>Backup completed.</div>',
      <Alert severity="success" icon="cloud_done">
        Backup completed.
      </Alert>,
    ],
  ];

  it.each(cases)('%s', async (_name, html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { classPrefixes: ['mtx-', 'material-'] });
  });
});
