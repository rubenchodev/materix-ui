import { act, fireEvent, render, screen } from '@testing-library/react';
import { onTestFinished } from 'vitest';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerSubmenu, useDrawer, useDrawerMode } from './index';
import type { DrawerCloseReason, DrawerProps } from './index';

/** Drawer controlado con disparador que registra los motivos de cierre. */
function Controlled(props: Partial<DrawerProps> & { initial?: boolean; reasons?: DrawerCloseReason[] }) {
  const { initial = false, reasons, ...rest } = props;
  const [open, setOpen] = useState(initial);
  return (
    <>
      <button type="button" aria-controls="ctl" onClick={() => setOpen((v) => !v)}>
        trigger
      </button>
      <button type="button">outside</button>
      <Drawer
        id="ctl"
        data-testid="drawer"
        title="Mail"
        {...rest}
        open={open}
        onClose={(event, reason) => {
          reasons?.push(reason);
          rest.onClose?.(event, reason);
          setOpen(false);
        }}
      >
        <a href="#inbox">Inbox</a>
        <a href="#sent">Sent</a>
      </Drawer>
    </>
  );
}

/**
 * matchMedia controlable para simular el cruce del breakpoint.
 * @param {boolean} initial Coincidencia inicial.
 * @returns {{set: Function, queries: string[]}} Control.
 */
function mockMatchMedia(initial: boolean) {
  const original = window.matchMedia;
  let matches = initial;
  const listeners = new Set<() => void>();
  const queries: string[] = [];
  window.matchMedia = ((query: string) => {
    queries.push(query);
    return {
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_type: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_type: string, fn: () => void) => listeners.delete(fn),
    } as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
  return {
    queries,
    set(value: boolean) {
      matches = value;
      act(() => listeners.forEach((fn) => fn()));
    },
    restore() {
      window.matchMedia = original;
    },
  };
}

/**
 * jsdom no calcula cajas: simula que todo elemento es visible para el cálculo de enfocables.
 * @returns {Function} Restaura `getClientRects`.
 */
function stubRects(): () => void {
  const proto = HTMLElement.prototype as unknown as { getClientRects: () => unknown };
  const original = proto.getClientRects;
  proto.getClientRects = () => [{}];
  return () => {
    proto.getClientRects = original;
  };
}

describe('Drawer', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  it('temporal cerrado no se monta; abierto se porta a body con cabecera, panel y fondo', () => {
    const { rerender } = render(<Drawer open={false} title="Mail" data-testid="drawer" />);
    expect(screen.queryByTestId('drawer')).toBeNull();
    rerender(
      <Drawer open title="Mail" data-testid="drawer">
        <p>Body</p>
      </Drawer>,
    );
    const el = screen.getByTestId('drawer');
    expect(el.parentElement?.hasAttribute("data-mtx-portal-root")).toBe(true);
    expect(el).toHaveClass('mtx-drawer', 'mtx-drawer--left', 'mtx-drawer--temporary', 'mtx-drawer--open');
    expect(el).toHaveAttribute('aria-hidden', 'false');
    expect(el.querySelector('.mtx-drawer__header .mtx-drawer__title')).toHaveTextContent('Mail');
    expect(el.querySelector('.mtx-drawer__content')).toHaveTextContent('Body');
    expect(document.querySelector('.mtx-backdrop.mtx-backdrop--open')).not.toBeNull();
  });

  it('paridad de estructura con vanilla (temporal abierto con título y subtítulo)', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="drawer" id="dp" data-title="Mail" data-subtitle="Inbox" data-open><p>Body</p></div>',
    );
    render(
      <Drawer open title="Mail" subtitle="Inbox" data-testid="drawer" disablePortal>
        <p>Body</p>
      </Drawer>,
    );
    expectParity(screen.getByTestId('drawer'), vanilla.querySelector('.mtx-drawer'));
  });

  it('paridad con vanilla: permanente y persistente cerrado', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="drawer" data-variant="permanent" data-title="Nav"><p>A</p></div>' +
        '<div data-mtx="drawer" data-variant="persistent" data-anchor="right" data-width="wide"><p>B</p></div>',
    );
    const drawers = vanilla.querySelectorAll('.mtx-drawer');
    render(
      <>
        <Drawer variant="permanent" title="Nav" data-testid="perm">
          <p>A</p>
        </Drawer>
        <Drawer variant="persistent" anchor="right" width="wide" data-testid="pers">
          <p>B</p>
        </Drawer>
      </>,
    );
    expectParity(screen.getByTestId('perm'), drawers[0]);
    expectParity(screen.getByTestId('pers'), drawers[1]);
  });

  it('paridad con vanilla: cabecera de usuario y pie generado', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="drawer" data-variant="persistent" data-user-name="Emma Johnson" data-user-email="emma@example.com" data-user-avatar="EJ" data-footer-version="v0.1.0" data-footer-action="Sign out"><p>A</p></div>',
    );
    render(
      <Drawer
        variant="persistent"
        userName="Emma Johnson"
        userEmail="emma@example.com"
        userAvatar="EJ"
        footerInfo="v0.1.0"
        footerAction="Sign out"
        data-testid="drawer"
      >
        <p>A</p>
      </Drawer>,
    );
    expectParity(screen.getByTestId('drawer'), vanilla.querySelector('.mtx-drawer'), {
      ignoreSelectors: ['.mtx-drawer__footer'],
    });
    expect(screen.getByTestId('drawer').querySelector('.mtx-drawer__footer-info')).toHaveTextContent('v0.1.0');
    expect(screen.getByRole('button', { name: /Sign out/, hidden: true })).toHaveClass('mtx-button--text', 'mtx-button--small');
  });

  it('anclas, anchos, elevación, clipped, absolute y padding transferido', () => {
    const { rerender } = render(<Drawer open anchor="bottom" width="narrow" disablePortal data-testid="d" />);
    const el = screen.getByTestId('d');
    expect(el).toHaveClass('mtx-drawer--bottom', 'mtx-drawer--narrow');
    rerender(<Drawer open anchor="right" width="full" disablePortal data-testid="d" />);
    expect(el).toHaveClass('mtx-drawer--right', 'mtx-drawer--full-width');
    rerender(
      <Drawer open width={450} elevation={4} clipped absolute style={{ padding: 12 }} data-testid="d" />,
    );
    const el2 = screen.getByTestId('d');
    expect(el2.style.width).toBe('450px');
    expect(el2.style.getPropertyValue('--mtx-drawer-width')).toBe('450px');
    expect(el2.style.boxShadow).toBe('var(--mtx-elevation-4)');
    expect(el2).toHaveClass('mtx-drawer--clipped', 'mtx-drawer--absolute');
    expect(el2.style.padding).toBe('');
    expect((el2.querySelector('.mtx-drawer__content') as HTMLElement).style.padding).toBe('12px');
  });

  it('ARIA del temporal: panel dialog modal nombrado por el título; aria-label del root tiene prioridad', () => {
    const { rerender } = render(<Drawer open title="Mail" data-testid="d" />);
    const dialog = screen.getByRole('dialog', { name: 'Mail' });
    expect(dialog).toHaveClass('mtx-drawer__content');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('tabindex', '-1');
    rerender(<Drawer open title="Mail" aria-label="Main navigation" data-testid="d" />);
    expect(screen.getByRole('dialog', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('Escape, fondo, botón X, data-mtx-drawer-close y clic fuera cierran con su motivo', () => {
    vi.useFakeTimers();
    const reasons: DrawerCloseReason[] = [];
    render(<Controlled reasons={reasons} />);
    const trigger = screen.getByText('trigger');

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(trigger);
    fireEvent.click(document.querySelector('.mtx-backdrop') as HTMLElement);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(trigger);
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(reasons).toEqual(['escapeKeyDown', 'backdropClick', 'closeButtonClick', 'clickaway']);
  });

  it('el disparador (aria-controls) no cuenta como clic fuera', () => {
    const reasons: DrawerCloseReason[] = [];
    render(<Controlled reasons={reasons} initial />);
    fireEvent.mouseDown(screen.getByText('trigger'));
    expect(reasons).toEqual([]);
  });

  it('disableBackdropClick y disableEscapeKeyDown impiden el cierre implícito', () => {
    const reasons: DrawerCloseReason[] = [];
    render(<Controlled reasons={reasons} initial disableBackdropClick disableEscapeKeyDown />);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(document.querySelector('.mtx-backdrop') as HTMLElement);
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(reasons).toEqual([]);
    expect(screen.getByTestId('drawer')).toHaveClass('mtx-drawer--open');
  });

  it('hideBackdrop no crea fondo; bloquea el scroll del body mientras está abierto', () => {
    const { rerender } = render(<Drawer open hideBackdrop data-testid="d" />);
    expect(document.querySelector('.mtx-backdrop')).toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Drawer open={false} hideBackdrop data-testid="d" />);
    expect(document.body.style.overflow).toBe('');
  });

  it('enfoca el primer elemento (o data-drawer-autofocus) y devuelve el foco al cerrar', () => {
    vi.useFakeTimers();
    onTestFinished(stubRects());
    render(<Controlled />);
    const trigger = screen.getByText('trigger');
    trigger.focus();
    fireEvent.click(trigger);
    expect(document.activeElement).toBe(screen.getByText('Inbox'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(trigger);
  });

  it('Tab queda atrapado en el panel', () => {
    onTestFinished(stubRects());
    render(<Controlled initial />);
    const last = screen.getByText('Sent');
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByText('Inbox'));
  });

  it('onOpen al abrir (no en el montaje), desmonte tras la transición y keepMounted', () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const { rerender } = render(<Drawer open={false} onOpen={onOpen} data-testid="d" />);
    rerender(<Drawer open onOpen={onOpen} data-testid="d" />);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('d')).toHaveClass('mtx-drawer--animated', 'mtx-drawer--open');
    rerender(<Drawer open={false} onOpen={onOpen} data-testid="d" />);
    expect(screen.getByTestId('d')).not.toHaveClass('mtx-drawer--open');
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByTestId('d')).toBeNull();

    rerender(<Drawer open={false} keepMounted data-testid="d" />);
    const kept = screen.getByTestId('d');
    expect(kept).toHaveAttribute('aria-hidden', 'true');
    expect(kept).not.toHaveClass('mtx-drawer--open');
  });

  it('persistente: role region, sin fondo, sin bloqueo de scroll ni foco forzado', () => {
    const { rerender } = render(<Drawer variant="persistent" open={false} data-testid="d" title="P" />);
    const el = screen.getByTestId('d');
    expect(el).toHaveAttribute('role', 'region');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.querySelector('.mtx-drawer__content')).toHaveAttribute('tabindex', '-1');
    rerender(<Drawer variant="persistent" open data-testid="d" title="P" />);
    expect(el).toHaveClass('mtx-drawer--persistent', 'mtx-drawer--open');
    expect(document.querySelector('.mtx-backdrop')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('permanente: siempre abierto, role navigation, sin botón de cierre y nunca solicita cerrar', () => {
    const onClose = vi.fn();
    render(
      <Drawer variant="permanent" title="Nav" onClose={onClose} data-testid="d">
        <button type="button" data-mtx-drawer-close>
          x
        </button>
      </Drawer>,
    );
    const el = screen.getByTestId('d');
    expect(el).toHaveClass('mtx-drawer--permanent', 'mtx-drawer--open');
    expect(el).not.toHaveClass('mtx-drawer--animated');
    expect(el).toHaveAttribute('role', 'navigation');
    expect(el.querySelector('.mtx-drawer__close')).toBeNull();
    fireEvent.click(screen.getByText('x'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('respeta la sintaxis BEM: DrawerHeader, DrawerContent y DrawerFooter sin duplicar', () => {
    render(
      <Drawer open disablePortal data-testid="d">
        <DrawerHeader>
          <h3 className="mtx-drawer__title">Edit</h3>
        </DrawerHeader>
        <DrawerContent padded>Form</DrawerContent>
        <DrawerFooter>
          <button type="button" data-mtx-drawer-close>
            Cancel
          </button>
        </DrawerFooter>
      </Drawer>,
    );
    const el = screen.getByTestId('d');
    expect(el.querySelectorAll('.mtx-drawer__header')).toHaveLength(1);
    expect(el.querySelectorAll('.mtx-drawer__content')).toHaveLength(1);
    expect(el.querySelector('.mtx-drawer__content')).toHaveClass('mtx-drawer__content--padded');
    expect(el.lastElementChild).toHaveClass('mtx-drawer__footer');
    expect(screen.getByRole('dialog')).toHaveTextContent('Form');
  });

  it('headerMode="temporary" marca la cabecera; el botón de cierre usa el diccionario', () => {
    render(<Drawer open title="T" headerMode="temporary" data-testid="d" />);
    expect(screen.getByTestId('d').querySelector('.mtx-drawer__header')).toHaveClass('mtx-drawer__temporary-only');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('data-mtx-drawer-close');
  });

  it('absolute: drawer y fondo en su sitio, sin bloquear el scroll', () => {
    const { container } = render(
      <div style={{ position: 'relative' }}>
        <Drawer open absolute data-testid="d" />
      </div>,
    );
    expect(container.contains(screen.getByTestId('d'))).toBe(true);
    const backdrop = container.querySelector('.mtx-backdrop') as HTMLElement;
    expect(backdrop.style.position).toBe('absolute');
    expect(document.body.style.overflow).toBe('');
  });

  it('DrawerSubmenu alterna aria-expanded y el panel colapsable', () => {
    vi.useFakeTimers();
    render(
      <DrawerSubmenu label="Projects" icon="folder" id="sub">
        <a href="#w">Website</a>
      </DrawerSubmenu>,
    );
    const button = screen.getByRole('button', { name: /Projects/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'sub');
    expect(button.querySelector('.mtx-collapse-indicator')).toHaveTextContent('chevron_right');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('sub')?.querySelector('.mtx-list--nested')).not.toBeNull();
  });
});

describe('Drawer responsive', () => {
  let media: ReturnType<typeof mockMatchMedia>;
  afterEach(() => media?.restore());

  it('usa md (900px) por defecto y breakpoint para sm/lg/xl', () => {
    media = mockMatchMedia(false);
    const { rerender } = render(<Drawer variant="responsive" />);
    expect(media.queries).toContain('(min-width: 900px)');
    rerender(<Drawer variant="responsive" breakpoint="lg" />);
    expect(media.queries).toContain('(min-width: 1200px)');
  });

  it('en escritorio arranca permanente y en móvil temporal (montado y cerrado)', () => {
    media = mockMatchMedia(true);
    const { unmount } = render(<Drawer variant="responsive" title="Mail" data-testid="d" />);
    const el = screen.getByTestId('d');
    expect(el).toHaveClass('mtx-drawer--permanent', 'mtx-drawer--open', 'mtx-drawer--responsive');
    expect(el).toHaveAttribute('role', 'navigation');
    expect(screen.queryByRole('dialog')).toBeNull();
    unmount();
    media.restore();
    media = mockMatchMedia(false);
    render(<Drawer variant="responsive" title="Mail" data-testid="d2" />);
    const el2 = screen.getByTestId('d2');
    expect(el2).toHaveClass('mtx-drawer--temporary');
    expect(el2).not.toHaveClass('mtx-drawer--open');
    expect(el2).toHaveAttribute('aria-hidden', 'true');
  });

  it('al cruzar el breakpoint emite onModeChange, solicita cerrar el temporal abierto y no anima', () => {
    media = mockMatchMedia(false);
    const onModeChange = vi.fn();
    const reasons: DrawerCloseReason[] = [];
    render(<Controlled variant="responsive" initial reasons={reasons} onModeChange={onModeChange} />);
    expect(document.body.style.overflow).toBe('hidden');
    media.set(true);
    expect(onModeChange).toHaveBeenLastCalledWith('permanent', 'temporary');
    expect(reasons).toEqual(['breakpoint']);
    const el = screen.getByTestId('drawer');
    expect(el).toHaveClass('mtx-drawer--permanent', 'mtx-drawer--open');
    expect(el).not.toHaveClass('mtx-drawer--animated');
    expect(document.body.style.overflow).toBe('');
    media.set(false);
    expect(onModeChange).toHaveBeenLastCalledWith('temporary', 'permanent');
    expect(el).toHaveClass('mtx-drawer--temporary');
    expect(el).not.toHaveClass('mtx-drawer--open');
  });

  it('al volver a móvil con el foco dentro, el foco pasa al disparador visible', () => {
    media = mockMatchMedia(true);
    function App() {
      const mode = useDrawerMode('responsive');
      return (
        <>
          {mode === 'temporary' && (
            <button type="button" aria-controls="nav">
              menu
            </button>
          )}
          <Drawer id="nav" variant="responsive">
            <a href="#a">Link</a>
          </Drawer>
        </>
      );
    }
    render(<App />);
    const link = screen.getByText('Link');
    link.focus();
    const restore = stubRects();
    try {
      media.set(false);
    } finally {
      restore();
    }
    expect(document.activeElement).toBe(screen.getByText('menu'));
  });

  it('useDrawerMode sin variante responsive devuelve la variante', () => {
    media = mockMatchMedia(true);
    let mode = '';
    function Probe() {
      mode = useDrawerMode('persistent');
      return null;
    }
    render(<Probe />);
    expect(mode).toBe('persistent');
  });
});

describe('Drawer SSR', () => {
  it('no notifica onModeChange por la corrección tras hidratar; sí en cruces posteriores', async () => {
    const media = mockMatchMedia(true);
    const onModeChange = vi.fn();
    const onClose = vi.fn();
    const app = (
      <Drawer variant="responsive" title="Mail" onModeChange={onModeChange} onClose={onClose} data-testid="ssr" disablePortal>
        <p>Body</p>
      </Drawer>
    );
    const host = document.createElement('div');
    host.innerHTML = renderToString(app);
    document.body.appendChild(host);
    expect(host.querySelector('.mtx-drawer')).toHaveClass('mtx-drawer--temporary');
    let root: ReturnType<typeof hydrateRoot> | null = null;
    await act(async () => {
      root = hydrateRoot(host, app);
    });
    expect(host.querySelector('.mtx-drawer')).toHaveClass('mtx-drawer--permanent');
    expect(onModeChange).not.toHaveBeenCalled();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
    });
    media.set(false);
    expect(onModeChange).toHaveBeenCalledWith('temporary', 'permanent');
    expect(onClose).not.toHaveBeenCalled();
    act(() => root?.unmount());
    host.remove();
    media.restore();
  });
});

describe('useDrawer', () => {
  /** Disparador y drawer conectados por el hook. */
  function HookDemo({ onClose }: { onClose?: (reason: string) => void }) {
    const drawer = useDrawer({ id: 'hook-drawer', onClose });
    return (
      <>
        <button type="button" {...drawer.getTriggerProps()}>
          trigger
        </button>
        <button type="button" {...drawer.getTriggerProps({ action: 'open' })}>
          opener
        </button>
        <Drawer {...drawer.drawerProps} title="Hook" />
      </>
    );
  }

  it('getTriggerProps da aria-controls/aria-expanded y alterna; drawerProps cierra con el motivo', () => {
    const onClose = vi.fn();
    render(<HookDemo onClose={onClose} />);
    const trigger = screen.getByText('trigger');
    expect(trigger).toHaveAttribute('aria-controls', 'hook-drawer');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('hook-drawer')).toHaveClass('mtx-drawer--open');
    // El disparador no cuenta como clic fuera.
    fireEvent.mouseDown(trigger);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('opener'), { bubbles: true });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenLastCalledWith('escapeKeyDown');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
