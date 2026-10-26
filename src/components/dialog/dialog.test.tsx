import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { pushLayer, removeLayer } from '../../core';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from './index';
import type { DialogCloseReason, DialogProps } from './index';

/** Diálogo controlado con disparador que se cierra con `onClose`. */
function Controlled(props: Partial<DialogProps> & { initial?: boolean }) {
  const { initial = false, onClose, ...rest } = props;
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        trigger
      </button>
      <Dialog
        data-testid="dlg"
        title="Título"
        {...rest}
        open={open}
        onClose={(event, reason) => {
          onClose?.(event, reason);
          setOpen(false);
        }}
      />
    </>
  );
}

const escape = () => fireEvent.keyDown(document, { key: 'Escape' });

describe('Dialog', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  it('cerrado no renderiza nada; abierto se porta a body con clases y ARIA', () => {
    const { rerender, container } = render(<Dialog open={false} data-testid="dlg" title="T" />);
    expect(screen.queryByTestId('dlg')).toBeNull();
    rerender(<Dialog open data-testid="dlg" title="T" description="Desc" />);
    const root = screen.getByTestId('dlg');
    expect(container.contains(root)).toBe(false);
    expect(root).toHaveClass('mtx-dialog', 'mtx-dialog--open', 'mtx-dialog--scroll-paper');
    const paper = screen.getByRole('dialog');
    expect(paper).toHaveClass('mtx-dialog__paper');
    expect(paper).toHaveAttribute('aria-modal', 'true');
    expect(paper).toHaveAccessibleName('T');
    expect(paper).toHaveAccessibleDescription('Desc');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('sintaxis simplificada: título, contenido, descripción y acciones en su sitio', () => {
    render(
      <Dialog open title="T" description="D" actions={<button type="button">OK</button>}>
        <p>Texto</p>
      </Dialog>,
    );
    const paper = screen.getByRole('dialog');
    expect(Array.from(paper.children).map((el) => el.className)).toEqual([
      'mtx-dialog__title',
      'mtx-dialog__content',
      'mtx-dialog__actions',
    ]);
    const content = paper.querySelector('.mtx-dialog__content')!;
    expect(content.firstElementChild).toHaveClass('mtx-dialog__content-text');
    expect(content).toHaveTextContent('DTexto');
  });

  it('composición: DialogActions de los hijos se colocan tras el contenido', () => {
    render(
      <Dialog open actionsAlign="start">
        <DialogTitle>T</DialogTitle>
        <p>Texto</p>
        <DialogActions>
          <button type="button">A</button>
        </DialogActions>
        <DialogActions align="center">
          <button type="button">B</button>
        </DialogActions>
      </Dialog>,
    );
    const [first, second] = document.querySelectorAll('.mtx-dialog__paper > .mtx-dialog__actions');
    expect(first).toHaveClass('mtx-dialog__actions--start');
    expect(second).toHaveClass('mtx-dialog__actions--center');
    expect(second).not.toHaveClass('mtx-dialog__actions--start');
    expect(document.querySelector('.mtx-dialog__content .mtx-dialog__actions')).toBeNull();
  });

  it('respeta aria-label del autor y role alertdialog', () => {
    render(<Dialog open title="X" aria-label="Custom" role="alertdialog" />);
    const paper = screen.getByRole('alertdialog');
    expect(paper).toHaveAttribute('aria-label', 'Custom');
    expect(paper).not.toHaveAttribute('aria-labelledby');
  });

  it('ids derivados del id del diálogo y enlace con DialogContentText', () => {
    render(
      <Dialog open id="dlg-b">
        <DialogTitle>BEM</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>Desc</DialogContentText>
        </DialogContent>
      </Dialog>,
    );
    const paper = screen.getByRole('dialog');
    expect(paper).toHaveAttribute('aria-labelledby', 'dlg-b-title');
    expect(paper).toHaveAccessibleDescription('Desc');
    expect(paper.querySelector('.mtx-dialog__content')).toHaveClass('mtx-dialog__content--dividers');
  });

  it('Escape y clic en el fondo solicitan el cierre con su motivo', () => {
    const reasons: DialogCloseReason[] = [];
    render(<Controlled onClose={(_e, r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('trigger'));
    escape();
    fireEvent.click(screen.getByText('trigger'));
    fireEvent.click(document.querySelector('.mtx-dialog__backdrop')!);
    fireEvent.click(screen.getByText('trigger'));
    expect(screen.getByTestId('dlg')).toHaveClass('mtx-dialog--open');
    expect(reasons).toEqual(['escapeKeyDown', 'backdropClick']);
  });

  it('disableEscapeKeyDown y disableBackdropClose', () => {
    const onClose = vi.fn();
    render(<Dialog open title="T" disableEscapeKeyDown disableBackdropClose onClose={onClose} />);
    escape();
    fireEvent.click(document.querySelector('.mtx-dialog__backdrop')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('data-mtx-dialog-close cierra con closeButtonClick', () => {
    const onClose = vi.fn();
    render(<Dialog open title="T" onClose={onClose} actions={<button type="button" data-mtx-dialog-close>OK</button>} />);
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'closeButtonClick');
  });

  it('foco: entra al primer control (o data-dialog-autofocus), retorno al disparador', () => {
    render(
      <Controlled
        actions={
          <>
            <button type="button">Primero</button>
            <button type="button" data-dialog-autofocus>
              Cancelar
            </button>
          </>
        }
      />,
    );
    const trigger = screen.getByText('trigger');
    trigger.focus();
    fireEvent.click(trigger);
    expect(document.activeElement).toBe(screen.getByText('Cancelar'));
    escape();
    expect(document.activeElement).toBe(trigger);
  });

  it('un contenedor marcado con data-dialog-autofocus delega en su primer control', () => {
    render(
      <Dialog open title="T">
        <div data-dialog-autofocus>
          <span>x</span>
          <button type="button">Ok</button>
        </div>
      </Dialog>,
    );
    expect(document.activeElement).toBe(screen.getByText('Ok'));
  });

  it('onOpen al abrir, animación del panel y desmontaje tras la salida', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onExited = vi.fn();
    render(<Controlled onOpen={onOpen} onExited={onExited} />);
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('trigger'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    const paper = screen.getByRole('dialog');
    expect(paper.style.opacity).toBe('');
    escape();
    expect(paper.style.opacity).toBe('0');
    expect(screen.getByTestId('dlg')).toHaveClass('mtx-dialog--open');
    act(() => {
      vi.advanceTimersByTime(260);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('dlg')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('keepMounted mantiene el nodo cerrado sin la clase --open', () => {
    render(<Dialog open={false} keepMounted title="T" data-testid="dlg" />);
    const root = screen.getByTestId('dlg');
    expect(root).not.toHaveClass('mtx-dialog--open');
  });

  it('tamaños, pantalla completa y scroll body', () => {
    const { rerender } = render(<Dialog open title="T" data-testid="dlg" maxWidth="lg" scroll="body" />);
    const root = screen.getByTestId('dlg');
    expect(root).toHaveClass('mtx-dialog--max-lg', 'mtx-dialog--scroll-body');
    rerender(<Dialog open title="T" data-testid="dlg" fullScreen />);
    expect(root).toHaveClass('mtx-dialog--full');
    rerender(<Dialog open title="T" data-testid="dlg" maxWidth="xs" fullWidth={false} />);
    const paper = screen.getByRole('dialog');
    expect(paper.style.maxWidth).toBe('20rem');
    expect(paper.style.width).toBe('auto');
    rerender(<Dialog open title="T" data-testid="dlg" maxWidth={false} />);
    expect(paper.style.maxWidth).toBe('none');
  });

  it('anidados: Escape cierra solo el superior', () => {
    function Nested() {
      const [outer, setOuter] = useState(true);
      const [inner, setInner] = useState(true);
      return (
        <Dialog open={outer} onClose={() => setOuter(false)} title="Outer" data-testid="outer">
          <Dialog open={inner} onClose={() => setInner(false)} title="Inner" data-testid="inner" />
        </Dialog>
      );
    }
    render(<Nested />);
    escape();
    expect(screen.getByTestId('outer')).toHaveClass('mtx-dialog--open');
    expect(screen.getByRole('dialog', { name: 'Outer' })).toBeInTheDocument();
    escape();
    expect(screen.getByTestId('outer').querySelector<HTMLElement>('.mtx-dialog__paper')!.style.opacity).toBe('0');
  });

  it('el cierre de un diálogo anidado no cierra el exterior', () => {
    const outerClose = vi.fn();
    render(
      <Dialog open onClose={outerClose} title="Outer">
        <Dialog open title="Inner" actions={<button type="button" data-mtx-dialog-close>Cerrar</button>} />
      </Dialog>,
    );
    fireEvent.click(screen.getByText('Cerrar'));
    expect(outerClose).not.toHaveBeenCalled();
  });

  it('description se inserta al inicio de un DialogContent hijo (sin duplicar)', () => {
    const { rerender } = render(
      <Dialog open title="T" description="Desc">
        <DialogContent>
          <p>Cuerpo</p>
        </DialogContent>
      </Dialog>,
    );
    const content = document.querySelector('.mtx-dialog__content')!;
    expect(content.firstElementChild).toHaveClass('mtx-dialog__content-text');
    expect(content.firstElementChild).toHaveTextContent('Desc');
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Desc');
    rerender(
      <Dialog open title="T" description="Desc">
        <DialogContent>
          <DialogContentText>Propia</DialogContentText>
        </DialogContent>
      </Dialog>,
    );
    expect(document.querySelectorAll('.mtx-dialog__content-text')).toHaveLength(1);
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Propia');
  });

  it('aplana Fragments para detectar DialogTitle y DialogActions', () => {
    render(
      <Dialog open title="Prop">
        <>
          <DialogTitle>Fragmento</DialogTitle>
          <p>Texto</p>
          <>
            <DialogActions>
              <button type="button">OK</button>
            </DialogActions>
          </>
        </>
      </Dialog>,
    );
    const paper = screen.getByRole('dialog');
    expect(Array.from(paper.children).map((el) => el.className)).toEqual([
      'mtx-dialog__title',
      'mtx-dialog__content',
      'mtx-dialog__actions',
    ]);
    expect(paper).toHaveAccessibleName('Fragmento');
    expect(paper.querySelector('.mtx-dialog__content .mtx-dialog__actions')).toBeNull();
  });

  it('un clic en el fondo que empieza con una capa superior abierta no cierra el diálogo', () => {
    const onClose = vi.fn();
    render(<Dialog open title="T" onClose={onClose} />);
    const backdrop = document.querySelector('.mtx-dialog__backdrop')!;
    const popup = document.createElement('div');
    document.body.appendChild(popup);
    const owner = {};
    pushLayer(owner, { kind: 'popup', nodes: popup });
    fireEvent.mouseDown(backdrop);
    removeLayer(owner); // el menú/popover se cierra con ese mismo mousedown
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(backdrop);
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'backdropClick');
    popup.remove();
  });

  it('paridad de estructura con vanilla (sintaxis simplificada)', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="dialog" id="dlg-p" data-title="T" data-description="D"><p>Texto</p>' +
        '<div class="mtx-dialog__actions"><button type="button">OK</button></div></div>',
    );
    render(
      <Dialog open title="T" description="D" data-testid="dlg" actions={<button type="button">OK</button>}>
        <p>Texto</p>
      </Dialog>,
    );
    expectParity(screen.getByTestId('dlg').querySelector('.mtx-dialog__paper'), vanilla.querySelector('.mtx-dialog__paper'));
  });
});
