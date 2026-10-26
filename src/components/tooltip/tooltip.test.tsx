import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import { Tooltip, getAccessibleName, hideAllTooltips } from './index';
import type { TooltipActions } from './index';

const mouse = { pointerType: 'mouse' };
const touch = { pointerType: 'touch' };

/** Avanza los temporizadores dentro de `act`. */
const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    act(() => hideAllTooltips());
    if (vi.isFakeTimers()) vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('abre al pasar el puntero tras enterDelay (100 ms) y cierra al salir', () => {
    render(
      <Tooltip title="Eliminar">
        <button type="button">X</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, mouse);
    expect(screen.queryByRole('tooltip')).toBeNull();
    tick(100);
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveClass('mtx-tooltip', 'mtx-tooltip--open');
    expect(tip.querySelector('.mtx-tooltip__label')).toHaveTextContent('Eliminar');
    expect(tip.parentElement?.hasAttribute("data-mtx-portal-root")).toBe(true);
    fireEvent.pointerLeave(button, mouse);
    expect(tip).not.toHaveClass('mtx-tooltip--open');
    tick(150);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('aplica aria-label si el hijo no tiene nombre accesible y lo retira al desmontar', () => {
    const { unmount } = render(
      <Tooltip title="Imprimir">
        <button type="button">
          <span className="material-icons">print</span>
        </button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Imprimir' });
    expect(button).toHaveAttribute('data-mtx-tooltip-label');
    unmount();
    expect(button).not.toHaveAttribute('aria-label');
  });

  it('con nombre propio usa aria-describedby solo mientras es visible', () => {
    render(
      <Tooltip title="Usa la impresora por defecto">
        <button type="button" aria-label="Imprimir factura" />
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Imprimir factura');
    expect(button).not.toHaveAttribute('aria-describedby');
    fireEvent.pointerEnter(button, mouse);
    tick(100);
    const tip = screen.getByRole('tooltip');
    expect(button).toHaveAttribute('aria-describedby', tip.id);
    fireEvent.pointerLeave(button, mouse);
    expect(button).not.toHaveAttribute('aria-describedby');
  });

  it('no duplica la descripción si el nombre coincide con el título', () => {
    render(
      <Tooltip title="Guardar">
        <button type="button">Guardar</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, mouse);
    tick(100);
    expect(button).not.toHaveAttribute('aria-describedby');
    expect(button).not.toHaveAttribute('aria-label');
  });

  it('describeChild describe siempre y no pone aria-label', () => {
    render(
      <Tooltip title="Ayuda" describeChild>
        <button type="button" />
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-label');
    fireEvent.pointerEnter(button, mouse);
    tick(100);
    expect(button).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
  });

  it('Escape cierra el tooltip (WCAG 1.4.13) y llama a onClose', () => {
    const onClose = vi.fn();
    render(
      <Tooltip title="Info" onClose={onClose} enterDelay={0}>
        <button type="button">B</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button'), mouse);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    tick(150);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('es hoverable: pasar del disparador al tooltip no lo cierra', () => {
    render(
      <Tooltip title="Info" enterDelay={0}>
        <button type="button">B</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, mouse);
    const tip = screen.getByRole('tooltip');
    fireEvent.pointerLeave(button, { ...mouse, relatedTarget: tip });
    tick(200);
    expect(tip).toHaveClass('mtx-tooltip--open');
    fireEvent.pointerLeave(tip, { ...mouse, relatedTarget: document.body });
    tick(200);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('abre con foco solo en modalidad de teclado y cierra al perder el foco', () => {
    render(
      <Tooltip title="Info">
        <button type="button">B</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerDown(document.body, mouse);
    fireEvent.focus(button);
    tick(100);
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.blur(button);
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.focus(button);
    tick(100);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(button);
    tick(150);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('pulsación larga táctil (700 ms) con estilo táctil y cierre 1,5 s después', () => {
    render(
      <Tooltip title="Info">
        <button type="button">B</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerDown(button, touch);
    tick(699);
    expect(screen.queryByRole('tooltip')).toBeNull();
    tick(1);
    expect(screen.getByRole('tooltip')).toHaveClass('mtx-tooltip--touch');
    fireEvent.pointerUp(button, touch);
    tick(1499);
    expect(screen.getByRole('tooltip')).toHaveClass('mtx-tooltip--open');
    tick(1);
    tick(150);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('respeta disableHoverListener, disableFocusListener y disableTouchListener', () => {
    render(
      <Tooltip title="Info" disableHoverListener disableFocusListener disableTouchListener>
        <button type="button">B</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, mouse);
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.focus(button);
    fireEvent.pointerDown(button, touch);
    tick(1000);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('modo controlado: onOpen/onClose y open decide la visibilidad', () => {
    const onOpen = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip
          title="Info"
          open={open}
          onOpen={(event) => {
            onOpen(event);
            setOpen(true);
          }}
          onClose={() => setOpen(false)}
          enterDelay={0}
        >
          <button type="button">B</button>
        </Tooltip>
      );
    }
    render(<Controlled />);
    fireEvent.pointerEnter(screen.getByRole('button'), mouse);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('controlado sin abrir de verdad no activa la histéresis (enterDelay normal)', () => {
    tick(2000);
    render(
      <>
        <Tooltip title="Uno" open={false} enterDelay={0}>
          <button type="button">1</button>
        </Tooltip>
        <Tooltip title="Dos" enterDelay={500}>
          <button type="button">2</button>
        </Tooltip>
      </>,
    );
    fireEvent.pointerEnter(screen.getByText('1'), mouse);
    fireEvent.pointerLeave(screen.getByText('1'), mouse);
    fireEvent.pointerEnter(screen.getByText('2'), mouse);
    tick(499);
    expect(screen.queryByRole('tooltip')).toBeNull();
    tick(1);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Dos');
  });

  it('solo un tooltip visible a la vez y enterNextDelay tras cerrar otro', () => {
    render(
      <>
        <Tooltip title="Uno" enterDelay={0}>
          <button type="button">1</button>
        </Tooltip>
        <Tooltip title="Dos" enterDelay={500}>
          <button type="button">2</button>
        </Tooltip>
      </>,
    );
    fireEvent.pointerEnter(screen.getByText('1'), mouse);
    expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    fireEvent.pointerLeave(screen.getByText('1'), mouse);
    // Histéresis: el segundo abre sin su retardo de 500 ms.
    fireEvent.pointerEnter(screen.getByText('2'), mouse);
    const tips = screen.getAllByRole('tooltip');
    expect(tips[tips.length - 1]).toHaveTextContent('Dos');
  });

  it('título vacío no abre ni pone aria-label', () => {
    render(
      <Tooltip title="" enterDelay={0}>
        <button type="button" />
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, mouse);
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(button).not.toHaveAttribute('aria-label');
  });

  it('flecha, data-side y placement', () => {
    render(
      <Tooltip title="Info" arrow placement="top" open>
        <button type="button">B</button>
      </Tooltip>,
    );
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveClass('mtx-tooltip--arrow');
    expect(tip.querySelector('.mtx-tooltip__arrow')).toHaveAttribute('aria-hidden', 'true');
    expect(tip).toHaveAttribute('data-side');
    expect(tip.style.getPropertyValue('--mtx-tooltip-gap')).toBe('14px');
  });

  it('envoltorio de un botón deshabilitado aplica el nombre al botón', () => {
    render(
      <Tooltip title="Sin permiso">
        <span data-testid="wrap">
          <button type="button" disabled />
        </span>
      </Tooltip>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Sin permiso');
    expect(screen.getByTestId('wrap')).not.toHaveAttribute('aria-label');
  });

  it('fusiona ref, className y manejadores del hijo', () => {
    const ref = createRef<HTMLElement>();
    const onPointerEnter = vi.fn();
    render(
      <Tooltip title="Info" ref={ref} className="extra" data-testid="child">
        <button type="button" className="own" onPointerEnter={onPointerEnter}>
          B
        </button>
      </Tooltip>,
    );
    const button = screen.getByTestId('child');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra', 'own');
    fireEvent.pointerEnter(button, mouse);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);
  });

  it('API imperativa: open, close y isOpen', () => {
    const action = createRef<TooltipActions>();
    render(
      <Tooltip title="Copiar" action={action}>
        <button type="button">B</button>
      </Tooltip>,
    );
    act(() => action.current!.open());
    expect(action.current!.isOpen).toBe(true);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    act(() => action.current!.close({ immediate: true }));
    tick(0);
    expect(action.current!.isOpen).toBe(false);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('abrir por `open` controlado cierra el tooltip visible de otro disparador', () => {
    const action = createRef<TooltipActions>();
    const onClose = vi.fn();
    const { rerender } = render(
      <>
        <Tooltip title="Uno" action={action} onClose={onClose}>
          <button type="button">1</button>
        </Tooltip>
        <Tooltip title="Dos" open={false}>
          <button type="button">2</button>
        </Tooltip>
      </>,
    );
    act(() => action.current!.open());
    rerender(
      <>
        <Tooltip title="Uno" action={action} onClose={onClose}>
          <button type="button">1</button>
        </Tooltip>
        <Tooltip title="Dos" open>
          <button type="button">2</button>
        </Tooltip>
      </>,
    );
    tick(0);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('tooltip').map((tip) => tip.textContent)).toEqual(['Dos']);
  });

  it('followCursor ancla la superficie al puntero', () => {
    render(
      <Tooltip title="Sigo" followCursor enterDelay={0}>
        <div data-testid="area">Zona</div>
      </Tooltip>,
    );
    const area = screen.getByTestId('area');
    fireEvent.pointerEnter(area, { ...mouse, clientX: 120, clientY: 80 });
    const tip = screen.getByRole('tooltip');
    fireEvent.pointerMove(area, { ...mouse, clientX: 140, clientY: 90 });
    // jsdom no mide: la superficie queda a `offset` (14) bajo el puntero.
    expect(tip.style.top).toBe('104px');
    // No retiene el puntero: la superficie no puede alcanzarse.
    expect(tip.style.pointerEvents).toBe('none');
  });

  it('getAccessibleName ignora iconos y usa aria-label o texto', () => {
    const el = document.createElement('button');
    el.innerHTML = '<span class="material-icons">print</span> Imprimir';
    expect(getAccessibleName(el)).toBe('Imprimir');
    el.setAttribute('aria-label', 'Otro');
    expect(getAccessibleName(el)).toBe('Otro');
  });

  it('paridad de estructura de la superficie con vanilla', async () => {
    vi.useRealTimers();
    const mtx = await loadVanilla();
    const vanilla = await mountVanilla('<button type="button" data-mtx-tooltip="Exportar" data-tooltip-arrow>E</button>');
    (mtx as unknown as { tooltip: { show: (el: Element) => void } }).tooltip.show(vanilla.firstElementChild!);
    const vanillaTip = document.querySelector('body > .mtx-tooltip') as HTMLElement;
    const vanillaClone = vanillaTip.cloneNode(true) as HTMLElement;
    (mtx as unknown as { tooltip: { hideAll: () => void } }).tooltip.hideAll();
    render(
      <Tooltip title="Exportar" arrow open>
        <button type="button">E</button>
      </Tooltip>,
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expectParity(screen.getByRole('tooltip'), vanillaClone, { ignoreAttributes: ['style'] });
  });
});
