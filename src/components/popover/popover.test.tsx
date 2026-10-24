import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Dialog } from '../dialog';
import { Drawer } from '../drawer';
import { Popover, resolveOrigin, usePopover } from './index';
import type { PopoverActions, PopoverCloseReason, PopoverProps } from './index';

/** Disparador + popover con `usePopover`. */
function WithHook(props: Partial<PopoverProps> & { onReason?: (reason: string) => void }) {
  const { onReason, ...rest } = props;
  const popover = usePopover({ onClose: (reason) => onReason?.(reason) });
  return (
    <>
      <button type="button" {...popover.getTriggerProps()}>
        Open
      </button>
      <button type="button">Outside</button>
      <Popover {...popover.popoverProps} label="Basic popover" {...rest}>
        <button type="button">First</button>
        <button type="button" data-mtx-popover-close="">
          Close
        </button>
      </Popover>
    </>
  );
}

/** Popover controlado por estado externo. */
function Controlled(props: Partial<PopoverProps> & { onReason?: (reason: PopoverCloseReason) => void }) {
  const { onReason, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          setAnchor(event.currentTarget);
          setOpen(true);
        }}
      >
        Open
      </button>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={(_event, reason) => {
          onReason?.(reason);
          setOpen(false);
        }}
        {...rest}
      >
        <p>Content</p>
      </Popover>
    </>
  );
}

const getPopover = () => document.querySelector<HTMLElement>('.mtx-popover');

describe('Popover', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  it('cerrado no renderiza nada; con keepMounted queda oculto', () => {
    const { unmount } = render(<Popover open={false}>x</Popover>);
    expect(getPopover()).toBeNull();
    unmount();
    render(
      <Popover open={false} keepMounted data-testid="pop">
        x
      </Popover>,
    );
    const el = screen.getByTestId('pop');
    expect(el).toHaveAttribute('hidden');
    expect(el).toHaveClass('mtx-popover');
    expect(el).not.toHaveClass('mtx-popover--open');
  });

  it('abierto: rol dialog, tabindex -1, clase open, portado a body y foco en el primer control', () => {
    const { container } = render(<WithHook />);
    fireEvent.click(screen.getByText('Open'));
    const el = getPopover()!;
    expect(container.contains(el)).toBe(false);
    expect(el.parentElement).toBe(document.body);
    expect(el).toHaveAttribute('role', 'dialog');
    expect(el).toHaveAttribute('tabindex', '-1');
    expect(el).toHaveAttribute('aria-label', 'Basic popover');
    expect(el).toHaveClass('mtx-popover', 'mtx-popover--open');
    expect(el).not.toHaveAttribute('hidden');
    expect(el).not.toHaveAttribute('aria-modal');
    expect(document.activeElement).toBe(screen.getByText('First'));
  });

  it('el disparador recibe aria-haspopup, aria-controls y aria-expanded sincronizado', () => {
    render(<WithHook />);
    const trigger = screen.getByText('Open');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    const el = getPopover()!;
    expect(trigger).toHaveAttribute('aria-controls', el.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape cierra (escapeKeyDown) y devuelve el foco al disparador', () => {
    const reasons: string[] = [];
    render(<WithHook onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByText('Open');
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(reasons).toEqual(['escapeKeyDown']);
    expect(getPopover()).not.toHaveClass('mtx-popover--open');
    expect(document.activeElement).toBe(trigger);
  });

  it('disableEscapeKeyDown ignora Escape', () => {
    const reasons: string[] = [];
    render(<WithHook disableEscapeKeyDown onReason={(r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(reasons).toEqual([]);
  });

  it('clic fuera cierra (clickaway); clic en el disparador alterna (trigger)', () => {
    const reasons: string[] = [];
    render(<WithHook onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    fireEvent.mouseDown(getPopover()!);
    expect(reasons).toEqual([]);
    fireEvent.mouseDown(trigger);
    expect(reasons).toEqual([]);
    fireEvent.click(trigger);
    expect(reasons).toEqual(['trigger']);
    fireEvent.click(trigger);
    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(reasons).toEqual(['trigger', 'clickaway']);
  });

  it('[data-mtx-popover-close] cierra con motivo action', () => {
    const reasons: string[] = [];
    render(<WithHook onReason={(r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Close'));
    expect(reasons).toEqual(['action']);
  });

  it('Tab fuera de un popover no modal cierra con tabOut', () => {
    vi.useFakeTimers();
    const reasons: string[] = [];
    render(<WithHook onReason={(r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('Open'));
    const outside = screen.getByText('Outside');
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
    outside.focus();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(reasons).toEqual(['tabOut']);
  });

  it('modal: aria-modal, bloqueo de scroll, Tab atrapado, sin fondo y clic fuera (clickaway)', () => {
    const reasons: string[] = [];
    render(<WithHook modal onReason={(r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('Open'));
    const el = getPopover()!;
    expect(el).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('.mtx-backdrop')).toBeNull();
    const last = screen.getByText('Close');
    last.focus();
    const tab = fireEvent.keyDown(last, { key: 'Tab' });
    // Tab atrapado: se cancela y el foco sigue dentro (jsdom no mide, así que no se comprueba el ciclo).
    expect(tab).toBe(false);
    expect(el.contains(document.activeElement)).toBe(true);
    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(reasons).toEqual(['clickaway']);
    expect(document.body.style.overflow).toBe('');
  });

  it('regresión: popover modal dentro de un Drawer; un clic fuera cierra solo el popover', () => {
    const drawerClose = vi.fn();
    const reasons: string[] = [];
    function InDrawer() {
      const popover = usePopover({ onClose: (reason) => reasons.push(reason) });
      return (
        <Drawer open variant="temporary" onClose={drawerClose} aria-label="Nav">
          <p>Drawer text</p>
          <button type="button" {...popover.getTriggerProps()}>
            Open
          </button>
          <Popover {...popover.popoverProps} modal label="Inner">
            <button type="button">Inside</button>
          </Popover>
        </Drawer>
      );
    }
    render(<InDrawer />);
    fireEvent.click(screen.getByText('Open'));
    expect(getPopover()).toHaveClass('mtx-popover--open');
    expect(document.activeElement).toBe(screen.getByText('Inside'));
    const text = screen.getByText('Drawer text');
    fireEvent.mouseDown(text);
    fireEvent.mouseUp(text);
    fireEvent.click(text);
    expect(reasons).toEqual(['clickaway']);
    expect(drawerClose).not.toHaveBeenCalled();
    expect(getPopover()).not.toHaveClass('mtx-popover--open');
  });

  it('regresión: popover keepMounted abierto desde un Dialog queda por encima (z-index)', () => {
    function InDialog() {
      const popover = usePopover();
      return (
        <Dialog open title="Settings" onClose={() => undefined}>
          <button type="button" {...popover.getTriggerProps()}>
            Open
          </button>
          <Popover {...popover.popoverProps} keepMounted label="Over dialog">
            <button type="button">Inside</button>
          </Popover>
        </Dialog>
      );
    }
    render(<InDialog />);
    const el = getPopover()!;
    expect(el).toHaveAttribute('hidden');
    fireEvent.click(screen.getByText('Open'));
    expect(el.style.zIndex).toMatch(/calc\(var\(--mtx-z-index-modal, 1300\) \+ \d+\)/);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(el.style.zIndex).toBe('');
  });

  it('anchorPosition: el ancla virtual es estable entre renders', () => {
    const { rerender } = render(
      <Popover open anchorReference="anchorPosition" anchorPosition={{ top: 50, left: 60 }} label="P">
        x
      </Popover>,
    );
    const el = getPopover()!;
    el.style.top = '0px';
    rerender(
      <Popover open anchorReference="anchorPosition" anchorPosition={{ top: 50, left: 60 }} label="P" className="x">
        x
      </Popover>,
    );
    // Sin re-suscripción no se recoloca en el nuevo commit.
    expect(el.style.top).toBe('0px');
    rerender(
      <Popover open anchorReference="anchorPosition" anchorPosition={{ top: 70, left: 60 }} label="P" className="x">
        x
      </Popover>,
    );
    expect(el.style.top).toBe('70px');
  });

  it('nombre accesible desde el primer encabezado interno', () => {
    render(
      <Popover open anchorReference="none" id="pop-h">
        <h3>Order #48213</h3>
      </Popover>,
    );
    const el = getPopover()!;
    expect(el).toHaveAttribute('aria-labelledby', 'pop-h-title');
    expect(screen.getByText('Order #48213')).toHaveAttribute('id', 'pop-h-title');
  });

  it('data-autofocus elige el foco inicial; sin enfocables se enfoca el panel', () => {
    const { unmount } = render(
      <Popover open anchorReference="none">
        <button type="button">A</button>
        <input aria-label="Name" data-autofocus="" />
      </Popover>,
    );
    expect(document.activeElement).toBe(screen.getByLabelText('Name'));
    unmount();
    render(
      <Popover open anchorReference="none" label="Empty">
        text
      </Popover>,
    );
    expect(document.activeElement).toBe(getPopover());
  });

  it('elevation aplica las variables CSS de la elevación canónica más cercana', () => {
    render(
      <Popover open anchorReference="none" elevation={10} label="E">
        x
      </Popover>,
    );
    const el = getPopover()!;
    expect(el.style.getPropertyValue('--mtx-popover-shadow')).toBe('var(--mtx-elevation-8)');
    expect(el.style.getPropertyValue('--mtx-popover-overlay')).toBe('var(--mtx-overlay-elevation-8)');
  });

  it('posiciona con placement y con orígenes MUI; transform-origin y data-placement', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    anchor.getBoundingClientRect = () => ({ top: 100, left: 200, right: 300, bottom: 140, width: 100, height: 40, x: 200, y: 100, toJSON: () => ({}) });
    const { rerender } = render(
      <Popover open anchorEl={anchor} label="P">
        x
      </Popover>,
    );
    const el = getPopover()!;
    expect(el.style.top).toBe('140px');
    expect(el.style.left).toBe('200px');
    expect(el.getAttribute('data-placement')).toBe('bottom-start');
    expect(el.style.transformOrigin).toBe('left top');
    rerender(
      <Popover
        open
        anchorEl={anchor}
        label="P"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        x
      </Popover>,
    );
    expect(el.style.top).toBe('100px');
    expect(el.style.left).toBe('300px');
    expect(el.getAttribute('data-placement')).toBe('origin');
    anchor.remove();
  });

  it('anchorPosition ancla a un punto del viewport', () => {
    render(
      <Popover open anchorReference="anchorPosition" anchorPosition={{ top: 50, left: 60 }} label="P">
        x
      </Popover>,
    );
    const el = getPopover()!;
    expect(el.style.top).toBe('50px');
    expect(el.style.left).toBe('60px');
  });

  it('resolveOrigin convierte palabras clave y píxeles', () => {
    expect(resolveOrigin({ vertical: 'center', horizontal: 'right' }, 100, 40, { vertical: 'top', horizontal: 'left' })).toEqual({ x: 100, y: 20 });
    expect(resolveOrigin({ vertical: 8, horizontal: 16 }, 100, 40, { vertical: 'top', horizontal: 'left' })).toEqual({ x: 16, y: 8 });
  });

  it('onOpen al abrir y onExited tras la salida (desmonta)', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const onExited = vi.fn();
    const reasons: PopoverCloseReason[] = [];
    render(<Controlled onOpen={onOpen} onExited={onExited} label="C" onReason={(r) => reasons.push(r)} />);
    fireEvent.click(screen.getByText('Open'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen.mock.calls[0][0]).toBe(screen.getByText('Open'));
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(reasons).toEqual(['escapeKeyDown']);
    expect(getPopover()).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
    expect(getPopover()).toBeNull();
  });

  it('ref, className concatenado, disablePortal y action.updatePosition', () => {
    const ref = createRef<HTMLDivElement>();
    const action = createRef<PopoverActions>();
    const { container } = render(
      <Popover open anchorReference="none" ref={ref} action={action} className="mtx-p-2" disablePortal label="R">
        x
      </Popover>,
    );
    expect(ref.current).toBe(getPopover());
    expect(container.contains(ref.current)).toBe(true);
    expect(ref.current).toHaveClass('mtx-popover', 'mtx-p-2');
    expect(typeof action.current?.updatePosition).toBe('function');
    act(() => action.current!.updatePosition());
  });

  it('usePopover: openPopover({x, y}) abre en un punto y close() cierra', () => {
    let api: ReturnType<typeof usePopover> | null = null;
    function Point() {
      const popover = usePopover();
      api = popover;
      return (
        <Popover {...popover.popoverProps} label="Point">
          x
        </Popover>
      );
    }
    render(<Point />);
    act(() => api!.openPopover({ x: 40, y: 30 }));
    const el = getPopover()!;
    expect(el.style.left).toBe('40px');
    expect(el.style.top).toBe('30px');
    act(() => api!.close());
    expect(el).not.toHaveClass('mtx-popover--open');
  });

  it('paridad con vanilla (abierto)', async () => {
    const vanilla = await mountVanilla(
      '<button data-open-popover="#pv">Open</button><div data-mtx="popover" id="pv" data-label="Basic popover" class="mtx-p-2">The content.</div>',
    );
    (vanilla.querySelector('button') as HTMLButtonElement).click();
    const vanillaEl = document.getElementById('pv')!;
    render(
      <Popover open anchorReference="none" label="Basic popover" className="mtx-p-2">
        The content.
      </Popover>,
    );
    const reactEl = Array.from(document.querySelectorAll<HTMLElement>('.mtx-popover')).find((el) => el !== vanillaEl)!;
    expectParity(reactEl, vanillaEl, { attributes: ['tabindex'] });
    (vanilla.querySelector('button') as HTMLButtonElement).click();
  });
});
