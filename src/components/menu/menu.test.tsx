import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import {
  ContextMenu,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Submenu,
  useMenu,
} from './index';
import type { MenuCloseReason, MenuProps, MenuSelectDetail } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'], attributes: ['tabindex'] };

/** Menú controlado con disparador (patrón habitual). */
function Basic(props: Partial<MenuProps> & { onReason?: (reason: MenuCloseReason) => void }) {
  const { onReason, children, ...rest } = props;
  const menu = useMenu({ id: 'm1' });
  return (
    <>
      <button type="button" {...menu.triggerProps}>
        Abrir
      </button>
      <button type="button">Fuera</button>
      <Menu
        {...menu.menuProps}
        {...rest}
        onClose={(event, reason) => {
          onReason?.(reason);
          menu.menuProps.onClose(event, reason);
        }}
      >
        {children ?? (
          <>
            <MenuItem value="profile">Profile</MenuItem>
            <MenuItem value="account" disabled>
              My account
            </MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}

const flushFrames = () => act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

describe('Menu', () => {
  it('abre con el disparador: portal, estructura, aria y foco en el contenedor con ratón', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(document.getElementById('m1')).toBeNull();

    await user.click(trigger);
    const menu = screen.getByRole('menu');
    expect(menu.id).toBe('m1');
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'm1');
    expect(menu).toHaveClass('mtx-menu', 'mtx-menu--open');
    expect(menu.parentElement).toHaveClass('mtx-menu__paper');
    expect(menu.parentElement).toHaveAttribute('role', 'presentation');
    const popper = menu.parentElement!.parentElement!;
    expect(popper).toHaveClass('mtx-menu__popper');
    expect(popper.parentElement?.hasAttribute("data-mtx-portal-root")).toBe(true);
    expect(popper.style.position).toBe('fixed');
    expect(popper).toHaveAttribute('dir', 'ltr');
    expect(document.activeElement).toBe(menu);
  });

  it('paridad de DOM con vanilla (menú abierto e ítems)', async () => {
    const mtx = await loadVanilla();
    const vanilla = await mountVanilla(
      `<button data-open-menu="#vm">Open</button>
       <div data-mtx="menu" id="vm">
         <div data-mtx="menu-item" data-icon="edit">Edit</div>
         <div data-mtx="menu-item" data-selected>Selected</div>
         <div data-mtx="menu-item" data-dense data-disabled>Off</div>
         <div data-mtx="menu-item" data-divider></div>
         <div data-mtx="menu-item" role="menuitemcheckbox" data-checked>Ruler</div>
       </div>`,
    );
    const vmenu = document.getElementById('vm')!;
    (mtx.getInstance(vmenu) as unknown as { open: (a: null, o: object) => void }).open(null, { focusFirstItem: false });
    render(
      <Menu open anchorEl={document.body} id="rm">
        <MenuItem icon="edit">Edit</MenuItem>
        <MenuItem selected>Selected</MenuItem>
        <MenuItem dense disabled>
          Off
        </MenuItem>
        <MenuDivider />
        <MenuItem role="menuitemcheckbox" defaultChecked>
          Ruler
        </MenuItem>
      </Menu>,
    );
    const rmenu = document.getElementById('rm')!;
    expectParity(rmenu.parentElement, vmenu.parentElement, PARITY);
    (mtx.getInstance(vmenu) as unknown as { close: (o: object) => void }).close({ restoreFocus: false });
    vanilla.remove();
  });

  it('teclado: Enter abre con foco en el primer ítem habilitado; flechas, Home/End y tipeo omiten deshabilitados', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    screen.getByRole('button', { name: 'Abrir' }).focus();
    await user.keyboard('{Enter}');
    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(items[2]);
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(items[2]);
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(items[2]);
    await user.keyboard('p');
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('m');
    expect(document.activeElement).toBe(items[0]);
  });

  it('Escape cierra y devuelve el foco al disparador', async () => {
    const user = userEvent.setup();
    const reasons: MenuCloseReason[] = [];
    render(<Basic onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(reasons).toEqual(['escapeKeyDown']);
    expect(document.activeElement).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('seleccionar un ítem: onSelect con detail, cierre itemClick y foco devuelto; disabled no selecciona', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const reasons: MenuCloseReason[] = [];
    render(<Basic onSelect={onSelect} onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await user.click(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: 'My account' }));
    expect(onSelect).not.toHaveBeenCalled();
    await user.click(screen.getByRole('menuitem', { name: 'Logout' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const detail = onSelect.mock.calls[0][0] as MenuSelectDetail;
    expect(detail.value).toBe('logout');
    expect(detail.item).toHaveTextContent('Logout');
    expect(reasons).toEqual(['itemClick']);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('clic fuera cierra sin devolver el foco; el disparador alterna', async () => {
    const user = userEvent.setup();
    const reasons: MenuCloseReason[] = [];
    render(<Basic onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(reasons).toEqual([]);
    await user.click(trigger);
    const outside = screen.getByRole('button', { name: 'Fuera' });
    await user.click(outside);
    expect(reasons).toEqual(['backdropClick']);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(outside);
  });

  it('Tab cierra (tabKeyDown) y deja el foco en el disparador', async () => {
    const user = userEvent.setup();
    const reasons: MenuCloseReason[] = [];
    render(<Basic onReason={(r) => reasons.push(r)} />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    trigger.focus();
    await user.keyboard('{Enter}');
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
    expect(reasons).toEqual(['tabKeyDown']);
    expect(document.activeElement).toBe(trigger);
  });

  it('onOpen/onClose y keepMounted (oculto, aria-hidden)', async () => {
    const onOpen = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Go
          </button>
          <Menu open={open} keepMounted anchorEl={document.body} onOpen={onOpen} onClose={() => setOpen(false)} id="km">
            <MenuItem>Uno</MenuItem>
          </Menu>
        </>
      );
    }
    render(<Controlled />);
    const list = document.getElementById('km')!;
    expect(list).toHaveAttribute('aria-hidden', 'true');
    expect(list.parentElement!.parentElement!.style.visibility).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(list).not.toHaveAttribute('aria-hidden');
    expect(list).toHaveClass('mtx-menu--open');
  });

  it('matchWidth iguala el ancho mínimo al ancla; dense se hereda', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    anchor.getBoundingClientRect = () =>
      ({ top: 10, left: 10, right: 210, bottom: 40, width: 200, height: 30, x: 10, y: 10 }) as DOMRect;
    render(
      <Menu open anchorEl={anchor} matchWidth dense id="mw">
        <MenuItem>Uno</MenuItem>
      </Menu>,
    );
    const popper = document.getElementById('mw')!.parentElement!.parentElement!;
    expect(popper.style.minWidth).toBe('200px');
    expect(screen.getByRole('menuitem')).toHaveClass('mtx-menu-item--dense');
    anchor.remove();
  });

  it('cierra con anchorHidden si el ancla sale de la vista', async () => {
    const onClose = vi.fn();
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    let top = 10;
    anchor.getBoundingClientRect = () =>
      ({ top, left: 0, right: 50, bottom: top + 20, width: 50, height: 20, x: 0, y: top }) as DOMRect;
    render(
      <Menu open anchorEl={anchor} onClose={onClose}>
        <MenuItem>Uno</MenuItem>
      </Menu>,
    );
    top = -100;
    fireEvent.scroll(window);
    await flushFrames();
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'anchorHidden');
    anchor.remove();
  });

  it('anchorPosition posiciona en un punto (menú contextual)', () => {
    render(
      <Menu open anchorPosition={{ top: 120, left: 80 }} id="ap">
        <MenuItem>Uno</MenuItem>
      </Menu>,
    );
    const popper = document.getElementById('ap')!.parentElement!.parentElement!;
    expect(popper.style.top).toBe('124px');
    expect(popper.style.left).toBe('80px');
  });
});

describe('MenuItem', () => {
  it('icono, imagen, secundario, atajo y separador por prop divider', () => {
    render(
      <MenuList>
        <MenuItem icon="content_cut" shortcut="⌘X">
          Cut
        </MenuItem>
        <MenuItem image="/a.png" secondary="Detalle">
          Img
        </MenuItem>
        <MenuItem divider />
      </MenuList>,
    );
    const [cut, img] = screen.getAllByRole('menuitem');
    expect(cut.querySelector('.mtx-menu-item__icon .material-icons')).toHaveTextContent('content_cut');
    expect(cut.querySelector('.mtx-menu-item__shortcut')).toHaveTextContent('⌘X');
    expect(img.querySelector('img.mtx-menu-item__image')).toHaveAttribute('alt', '');
    expect(img.querySelector('.mtx-list-item-text__secondary')).toHaveTextContent('Detalle');
    const sep = screen.getByRole('separator');
    expect(sep).toHaveClass('mtx-menu-item--divider');
    expect(sep).not.toHaveAttribute('tabindex');
  });

  it('menuitemcheckbox alterna y menuitemradio marca uno en su MenuGroup', () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    render(
      <MenuList onSelect={onSelect}>
        <MenuItem role="menuitemcheckbox" value="ruler">
          Ruler
        </MenuItem>
        <MenuGroup label="Density" defaultValue="comfortable" onChange={onChange}>
          <MenuItem role="menuitemradio" value="comfortable">
            Comfortable
          </MenuItem>
          <MenuItem role="menuitemradio" value="compact">
            Compact
          </MenuItem>
        </MenuGroup>
      </MenuList>,
    );
    const ruler = screen.getByRole('menuitemcheckbox');
    expect(ruler).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(ruler);
    expect(ruler).toHaveAttribute('aria-checked', 'true');
    expect(ruler).toHaveClass('mtx-menu-item--checked');
    expect(onSelect.mock.calls[0][0]).toMatchObject({ value: 'ruler', checked: true });
    const [comfortable, compact] = screen.getAllByRole('menuitemradio');
    expect(screen.getByRole('group', { name: 'Density' })).toBeInTheDocument();
    expect(comfortable).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(compact);
    expect(compact).toHaveAttribute('aria-checked', 'true');
    expect(comfortable).toHaveAttribute('aria-checked', 'false');
    expect(onChange).toHaveBeenCalledWith('compact');
  });

  it('href renderiza un enlace con rol menuitem', () => {
    render(
      <MenuList>
        <MenuItem href="/docs">Docs</MenuItem>
      </MenuList>,
    );
    const link = screen.getByRole('menuitem');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/docs');
  });
});

describe('Submenu', () => {
  function Nested({ rtl = false }: { rtl?: boolean }) {
    const menu = useMenu();
    const [log, setLog] = useState<string[]>([]);
    return (
      <div dir={rtl ? 'rtl' : undefined}>
        <button type="button" {...menu.triggerProps}>
          Insert
        </button>
        <Menu {...menu.menuProps} onSelect={(d) => setLog((l) => [...l, d.value ?? ''])}>
          <MenuItem value="image">Image</MenuItem>
          <Submenu label="Share" icon="share">
            <MenuItem value="email">By email</MenuItem>
            <MenuItem value="link">Copy link</MenuItem>
          </Submenu>
        </Menu>
        <output data-testid="log">{log.join(',')}</output>
      </div>
    );
  }

  it('flecha derecha abre con foco en el primer ítem; izquierda vuelve al disparador', async () => {
    const user = userEvent.setup();
    render(<Nested />);
    screen.getByRole('button', { name: 'Insert' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{ArrowDown}');
    const share = screen.getByRole('menuitem', { name: /Share/ });
    expect(document.activeElement).toBe(share);
    expect(share).toHaveAttribute('aria-haspopup', 'menu');
    expect(share).toHaveAttribute('aria-expanded', 'false');
    expect(share.querySelector('.mtx-menu-item__expand')).toHaveTextContent('chevron_right');
    await user.keyboard('{ArrowRight}');
    expect(share).toHaveAttribute('aria-expanded', 'true');
    const sub = document.getElementById(share.getAttribute('aria-controls')!)!;
    expect(sub).toHaveAttribute('role', 'menu');
    expect(document.activeElement).toHaveTextContent('By email');
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toHaveTextContent('Copy link');
    await user.keyboard('{ArrowLeft}');
    expect(share).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(share);
  });

  it('Escape cierra solo el submenú; seleccionar dentro cierra toda la cadena y llega a onSelect raíz', async () => {
    const user = userEvent.setup();
    render(<Nested />);
    const trigger = screen.getByRole('button', { name: 'Insert' });
    trigger.focus();
    await user.keyboard('{Enter}{ArrowDown}{ArrowRight}');
    await user.keyboard('{Escape}');
    const share = screen.getByRole('menuitem', { name: /Share/ });
    expect(share).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(share);
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    await user.keyboard('{Enter}{Enter}');
    expect(screen.getByTestId('log')).toHaveTextContent('email');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('hover abre a los 100 ms sin mover el foco y otro ítem lo cierra a los 50 ms', () => {
    vi.useFakeTimers();
    try {
      render(<Nested />);
      fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
      const share = screen.getByRole('menuitem', { name: /Share/ });
      const focusedBefore = document.activeElement;
      fireEvent.mouseEnter(share);
      act(() => {
        vi.advanceTimersByTime(99);
      });
      expect(share).toHaveAttribute('aria-expanded', 'false');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(share).toHaveAttribute('aria-expanded', 'true');
      expect(document.activeElement).toBe(focusedBefore);
      fireEvent.mouseEnter(screen.getByRole('menuitem', { name: 'Image' }));
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(share).toHaveAttribute('aria-expanded', 'false');
    } finally {
      vi.useRealTimers();
    }
  });

  it('en RTL usa chevron_left, se abre con flecha izquierda y hacia la izquierda', async () => {
    const user = userEvent.setup();
    render(<Nested rtl />);
    screen.getByRole('button', { name: 'Insert' }).focus();
    await user.keyboard('{Enter}{ArrowDown}');
    const share = screen.getByRole('menuitem', { name: /Share/ });
    expect(share.querySelector('.mtx-menu-item__expand')).toHaveTextContent('chevron_left');
    // jsdom no maqueta: el ítem queda a la derecha del viewport para que quepa a su izquierda.
    share.getBoundingClientRect = () =>
      ({ top: 100, left: 600, right: 800, bottom: 148, width: 200, height: 48, x: 600, y: 100 }) as DOMRect;
    await user.keyboard('{ArrowLeft}');
    expect(share).toHaveAttribute('aria-expanded', 'true');
    const sub = document.getElementById(share.getAttribute('aria-controls')!)!;
    const popper = sub.parentElement!.parentElement!;
    expect(popper).toHaveAttribute('dir', 'rtl');
    expect(popper.dataset.placement).toBe('left');
    await user.keyboard('{ArrowRight}');
    expect(share).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('ContextMenu', () => {
  it('se abre con clic derecho en el punto, ejecuta action y cierra', async () => {
    const action = vi.fn();
    const area = document.createElement('div');
    area.id = 'ctx-area';
    document.body.appendChild(area);
    render(
      <ContextMenu
        target="#ctx-area"
        items={[
          { label: 'Copy', icon: 'content_copy', action },
          { label: 'Paste', disabled: true },
          { divider: true },
          { label: 'Share', submenu: [{ label: 'Email' }] },
        ]}
      />,
    );
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.pointerDown(area, { button: 2 });
    fireEvent.contextMenu(area, { clientX: 50, clientY: 60, button: 2 });
    const menu = screen.getByRole('menu');
    const popper = menu.parentElement!.parentElement!;
    expect(popper.style.left).toBe('50px');
    expect(popper.style.top).toBe('64px');
    expect(screen.getByRole('menuitem', { name: /Paste/ })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem', { name: /Share/ })).toHaveAttribute('aria-haspopup', 'menu');
    fireEvent.click(screen.getByRole('menuitem', { name: /Copy/ }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    area.remove();
  });

  it('Mayús+F10 (coordenadas del centro, como Chromium) ancla al área y enfoca el primer ítem', () => {
    const area = document.createElement('div');
    area.className = 'ctx-kbd';
    area.tabIndex = 0;
    document.body.appendChild(area);
    area.getBoundingClientRect = () =>
      ({ top: 100, left: 100, right: 300, bottom: 200, width: 200, height: 100, x: 100, y: 100 }) as DOMRect;
    render(<ContextMenu target=".ctx-kbd" items={[{ label: 'Copy' }, { label: 'Paste' }]} />);
    area.focus();
    fireEvent.keyDown(area, { key: 'F10', shiftKey: true });
    fireEvent.contextMenu(area, { clientX: 200, clientY: 150, button: 0 });
    const popper = screen.getByRole('menu').parentElement!.parentElement!;
    expect(popper.style.left).toBe('100px');
    expect(popper.style.top).toBe('204px');
    expect(document.activeElement).toHaveTextContent('Copy');
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(document.activeElement).toBe(area);
    area.remove();
  });

  it('un selector se delega: sirve para áreas añadidas después del montaje', () => {
    render(<ContextMenu target=".late-area" items={[{ label: 'Copy' }]} />);
    const late = document.createElement('div');
    late.className = 'late-area';
    late.innerHTML = '<span>child</span>';
    document.body.appendChild(late);
    fireEvent.pointerDown(late);
    fireEvent.mouseDown(late);
    fireEvent.contextMenu(late.firstElementChild!, { clientX: 30, clientY: 40, button: 2 });
    const popper = screen.getByRole('menu').parentElement!.parentElement!;
    expect(popper.style.left).toBe('30px');
    late.remove();
  });
});
