import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from './index';
import type { SpeedDialProps } from './index';

/** SpeedDial básico con tres acciones. */
function Basic(props: Partial<SpeedDialProps>) {
  return (
    <SpeedDial ariaLabel="Create" data-testid="sd" {...props}>
      <SpeedDialAction icon="description" tooltipTitle="Document" />
      <SpeedDialAction icon="table_chart" tooltipTitle="Spreadsheet" />
      <SpeedDialAction icon="slideshow" tooltipTitle="Presentation" />
    </SpeedDial>
  );
}

const fab = () => screen.getByRole('button', { name: 'Create' });
const root = () => screen.getByTestId('sd');

describe('SpeedDial', () => {
  it('paridad de estructura con vanilla (sintaxis simplificada, cerrado)', async () => {
    const vanilla = await mountVanilla(
      `<div data-mtx="speed-dial" data-icon="add" data-label="Create">
        <button data-icon="description" data-tooltip="Document" aria-label="Document"></button>
        <button data-icon="table_chart" data-tooltip="Spreadsheet" aria-label="Spreadsheet"></button>
        <button data-icon="slideshow" data-tooltip="Presentation" aria-label="Presentation"></button>
      </div>`,
    );
    render(<Basic />);
    expectParity(root(), vanilla.firstElementChild);
  });

  it('paridad con vanilla en modo tooltip-hover y dirección left', async () => {
    const vanilla = await mountVanilla(
      `<div data-mtx="speed-dial" data-direction="left" data-tooltip-hover data-icon="add" data-label="Create">
        <button data-icon="description" data-tooltip="Document" aria-label="Document"></button>
      </div>`,
    );
    render(
      <SpeedDial ariaLabel="Create" direction="left" tooltipHover data-testid="sd">
        <SpeedDialAction icon="description" tooltipTitle="Document" />
      </SpeedDial>,
    );
    expectParity(root(), vanilla.firstElementChild, { ignoreAttributes: ['aria-describedby'] });
  });

  it('ARIA del FAB y acciones fuera del orden de tabulación mientras está cerrado', () => {
    render(<Basic />);
    const actions = document.getElementById(fab().getAttribute('aria-controls')!)!;
    expect(fab()).toHaveAttribute('aria-haspopup', 'true');
    expect(fab()).toHaveAttribute('aria-expanded', 'false');
    expect(actions).toHaveClass('mtx-speed-dial__actions');
    expect(actions).toHaveAttribute('aria-hidden', 'true');
    expect(actions.inert).toBe(true);
    actions.querySelectorAll('.mtx-speed-dial__action').forEach((a) => expect(a).toHaveAttribute('tabindex', '-1'));

    fireEvent.click(fab());
    expect(root()).toHaveClass('mtx-speed-dial--open');
    expect(fab()).toHaveAttribute('aria-expanded', 'true');
    expect(actions).not.toHaveAttribute('aria-hidden');
    expect(actions.inert).toBe(false);
    actions.querySelectorAll('.mtx-speed-dial__action').forEach((a) => expect(a).not.toHaveAttribute('tabindex'));
  });

  it('no controlado: clic alterna y onOpen/onClose reciben el motivo', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<Basic onOpen={onOpen} onClose={onClose} />);
    fireEvent.click(fab());
    expect(onOpen).toHaveBeenCalledWith(expect.anything(), 'toggle');
    fireEvent.click(fab());
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'toggle');
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
  });

  it('controlado: solo cambia con la prop', () => {
    const onOpen = vi.fn();
    const { rerender } = render(<Basic open={false} onOpen={onOpen} />);
    fireEvent.click(fab());
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
    rerender(<Basic open onOpen={onOpen} />);
    expect(root()).toHaveClass('mtx-speed-dial--open');
  });

  it('Escape cierra y devuelve el foco al FAB', () => {
    const onClose = vi.fn();
    render(<Basic defaultOpen onClose={onClose} />);
    const action = screen.getByRole('button', { name: 'Document' });
    action.focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
    expect(document.activeElement).toBe(fab());
  });

  it('clic fuera cierra con motivo clickaway', () => {
    const onClose = vi.fn();
    render(
      <>
        <button type="button">outside</button>
        <Basic defaultOpen onClose={onClose} />
      </>,
    );
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'clickaway');
  });

  it('event="hover" abre al entrar y cierra al salir', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<Basic event="hover" onOpen={onOpen} onClose={onClose} />);
    fireEvent.pointerEnter(root(), { pointerType: 'mouse' });
    expect(onOpen).toHaveBeenCalledWith(expect.anything(), 'mouseEnter');
    expect(root()).toHaveClass('mtx-speed-dial--open');
    fireEvent.mouseLeave(root());
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'mouseLeave');
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
  });

  it('clase de dirección y flechas según la dirección', () => {
    const { rerender } = render(<Basic defaultOpen direction="down" />);
    expect(root()).toHaveClass('mtx-speed-dial--direction-down');
    fab().focus();
    fireEvent.keyDown(fab(), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Document' }));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Spreadsheet' }));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(fab());
    rerender(<Basic defaultOpen direction="right" />);
    expect(root()).toHaveClass('mtx-speed-dial--direction-right');
    fireEvent.keyDown(fab(), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Document' }));
  });

  it('etiquetas persistentes decorativas; la acción conserva su aria-label', () => {
    render(<Basic />);
    const labels = root().querySelectorAll('.mtx-speed-dial__tooltip');
    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveTextContent('Document');
    expect(labels[0]).toHaveAttribute('aria-hidden', 'true');
    expect(root().querySelector('.mtx-speed-dial__action')).toHaveAttribute('aria-label', 'Document');
  });

  it('tooltipHover usa el Tooltip real y se oculta al cerrar', () => {
    vi.useFakeTimers();
    try {
      render(<Basic tooltipHover defaultOpen />);
      expect(root()).toHaveClass('mtx-speed-dial--tooltip-hover');
      expect(root().querySelectorAll('.mtx-speed-dial__tooltip')).toHaveLength(0);
      const action = screen.getByRole('button', { name: 'Spreadsheet' });
      fireEvent.pointerEnter(action, { pointerType: 'mouse' });
      fireEvent.mouseOver(action);
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(document.querySelector('.mtx-tooltip')).toHaveTextContent('Spreadsheet');
      fireEvent.click(fab());
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(document.querySelector('.mtx-tooltip--open')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('tooltipOpen explícito en una acción prevalece sobre tooltipHover', () => {
    render(
      <SpeedDial ariaLabel="Create" tooltipHover data-testid="sd">
        <SpeedDialAction icon="mail" tooltipTitle="Email" tooltipOpen />
      </SpeedDial>,
    );
    expect(root().querySelector('.mtx-speed-dial__tooltip')).toHaveTextContent('Email');
  });

  it('hidden oculta el FAB y fuerza el cierre; position añade la clase fija', () => {
    render(<Basic defaultOpen hidden position="fixed-br" />);
    expect(root()).toHaveClass('mtx-speed-dial--fixed-br');
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
    const button = root().querySelector<HTMLElement>('.mtx-speed-dial__fab')!;
    expect(button.style.visibility).toBe('hidden');
    expect(button.style.transform).toBe('scale(0)');
  });

  it('hidden cierra el estado con motivo hidden y no reaparece abierto', () => {
    const onClose = vi.fn();
    const onOpen = vi.fn();
    const { rerender } = render(<Basic defaultOpen onClose={onClose} onOpen={onOpen} />);
    expect(root()).toHaveClass('mtx-speed-dial--open');
    rerender(<Basic defaultOpen hidden onClose={onClose} onOpen={onOpen} />);
    expect(onClose).toHaveBeenCalledWith(null, 'hidden');
    rerender(<Basic defaultOpen onClose={onClose} onOpen={onOpen} />);
    expect(root()).not.toHaveClass('mtx-speed-dial--open');
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('hidden con un dial controlado pide el cierre', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Basic open onClose={onClose} />);
    rerender(<Basic open hidden onClose={onClose} />);
    expect(onClose).toHaveBeenCalledWith(null, 'hidden');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ariaLabel por defecto desde i18n y color del FAB', () => {
    render(
      <SpeedDial color="secondary" data-testid="sd">
        <SpeedDialAction icon="mail" tooltipTitle="Email" color="error" />
      </SpeedDial>,
    );
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveClass('mtx-fab--secondary', 'mtx-speed-dial__fab');
    expect(screen.getByRole('button', { name: 'Email', hidden: true })).toHaveClass('mtx-fab--error', 'mtx-fab--small');
  });

  it('SpeedDialIcon con openIcon alterna los iconos', () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <SpeedDial
          ariaLabel="Create"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          icon={<SpeedDialIcon openIcon="edit" />}
          data-testid="sd"
        >
          <SpeedDialAction icon="mail" tooltipTitle="Email" />
        </SpeedDial>
      );
    }
    render(<Controlled />);
    const icon = root().querySelector('.mtx-speed-dial__icon')!;
    const closed = icon.querySelector<HTMLElement>('.mtx-speed-dial__icon-closed')!;
    const opened = icon.querySelector<HTMLElement>('.mtx-speed-dial__icon-open')!;
    expect(closed.style.opacity).toBe('1');
    expect(opened.style.opacity).toBe('0');
    // Los iconos internos no reciben la rotación de la hoja de estilos (la aplica su capa).
    expect(opened.querySelector<HTMLElement>('.material-icons')!.style.transform).toBe('none');
    fireEvent.click(fab());
    expect(icon).toHaveClass('mtx-speed-dial__icon--open');
    expect(closed.style.opacity).toBe('0');
    expect(closed.style.transform).toBe('rotate(45deg)');
    expect(opened.style.opacity).toBe('1');
  });

  it('acción sin tooltipTitle no lleva wrapper; más de 5 acciones prolongan el escalonado', () => {
    render(
      <SpeedDial ariaLabel="Create" defaultOpen data-testid="sd">
        <SpeedDialAction icon="mail" aria-label="Plain" />
        {['a', 'b', 'c', 'd', 'e', 'f'].map((n) => (
          <SpeedDialAction key={n} icon="mail" tooltipTitle={n} />
        ))}
      </SpeedDial>,
    );
    const actions = root().querySelector('.mtx-speed-dial__actions')!;
    expect(actions.firstElementChild).toHaveClass('mtx-speed-dial__action');
    const wrappers = actions.querySelectorAll<HTMLElement>('.mtx-speed-dial__action-wrapper');
    expect(wrappers).toHaveLength(6);
    expect(wrappers[3].style.transitionDelay).toBe('');
    expect(wrappers[4].style.transitionDelay).toBe('180ms');
  });
});
