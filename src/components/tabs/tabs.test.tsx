import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Tab, TabContext, TabPanel, Tabs } from './index';

function Group(props: { onChange?: (value: string | number) => void; onBeforeChange?: (v: string | number) => boolean | void; follows?: boolean }) {
  return (
    <TabContext defaultValue="one" onChange={(_, v) => props.onChange?.(v)}>
      <Tabs aria-label="Demo" selectionFollowsFocus={props.follows} onBeforeChange={props.onBeforeChange}>
        <Tab value="one" label="One" />
        <Tab value="two" label="Two" disabled />
        <Tab value="three" label="Three" />
      </Tabs>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
    </TabContext>
  );
}

describe('Tabs', () => {
  it('renderiza tablist, pestañas, indicador y paneles enlazados', () => {
    render(<Group />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('mtx-tabs');
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    expect(list.lastElementChild).toHaveClass('mtx-tabs__indicator');
    const one = screen.getByRole('tab', { name: 'One' });
    expect(one).toHaveClass('mtx-tab', 'mtx-tab--active');
    expect(one).toHaveAttribute('aria-selected', 'true');
    expect(one).toHaveAttribute('tabindex', '0');
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Panel one');
    expect(one.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(one.id);
    expect(screen.getByText('Panel three')).not.toBeVisible();
    const two = screen.getByRole('tab', { name: 'Two' });
    expect(two).toBeDisabled();
    expect(two).toHaveAttribute('aria-disabled', 'true');
    expect(two).toHaveAttribute('tabindex', '-1');
  });

  it('clic cambia de pestaña y llama a onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: 'Three' }));
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three');
    expect(onChange).toHaveBeenCalledWith('three');
  });

  it('onBeforeChange que devuelve false cancela el cambio', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group onChange={onChange} onBeforeChange={(v) => v !== 'three'} />);
    await user.click(screen.getByRole('tab', { name: 'Three' }));
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('teclado: flechas saltan deshabilitadas y envuelven; Home/End; Enter activa', async () => {
    const user = userEvent.setup();
    render(<Group />);
    const one = screen.getByRole('tab', { name: 'One' });
    const three = screen.getByRole('tab', { name: 'Three' });
    one.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(three);
    expect(one).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(one);
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(three);
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(one);
    await user.keyboard('{ArrowLeft}{Enter}');
    expect(three).toHaveAttribute('aria-selected', 'true');
  });

  it('selectionFollowsFocus activa al mover el foco', async () => {
    const user = userEvent.setup();
    render(<Group follows />);
    screen.getByRole('tab', { name: 'One' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true');
  });

  it('vertical usa flechas arriba/abajo y modificadores de clase', async () => {
    const user = userEvent.setup();
    render(
      <Tabs orientation="vertical" variant="fullWidth" centered aria-label="V">
        <Tab label="A" />
        <Tab label="B" />
      </Tabs>,
    );
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('mtx-tabs--vertical', 'mtx-tabs--full', 'mtx-tabs--centered');
    expect(list).toHaveAttribute('aria-orientation', 'vertical');
    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'B' }));
  });

  it('controlado sin contexto: valor por índice', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string | number>(1);
      return (
        <>
          <Tabs value={value} onChange={(_, v) => setValue(v)} aria-label="C">
            <Tab label="A" />
            <Tab label="B" />
          </Tabs>
          <span data-testid="v">{value}</span>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'A' }));
    expect(screen.getByTestId('v')).toHaveTextContent('0');
    expect(screen.getByRole('tab', { name: 'A' })).not.toHaveAttribute('aria-controls');
  });

  it('icono por nombre, posición final y solo icono', () => {
    render(
      <Tabs aria-label="I">
        <Tab icon="phone" label="Calls" />
        <Tab icon="favorite" iconPosition="end" label="Favs" />
        <Tab icon="person" aria-label="Contacts" />
      </Tabs>,
    );
    const calls = screen.getByRole('tab', { name: 'Calls' });
    expect(calls.firstElementChild).toHaveClass('material-icons', 'mtx-tab__icon');
    expect(calls.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    const favs = screen.getByRole('tab', { name: 'Favs' });
    expect(favs.lastElementChild).toHaveTextContent('favorite');
    expect(screen.getByRole('tab', { name: 'Contacts' })).toBeInTheDocument();
  });

  it('RTL invierte las flechas horizontales', async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <Tabs aria-label="R">
          <Tab label="A" />
          <Tab label="B" />
          <Tab label="C" />
        </Tabs>
      </div>,
    );
    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'B' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'A' }));
  });

  it('valor inexistente o deshabilitado: la primera habilitada queda con tabIndex=0', () => {
    const { rerender } = render(
      <Tabs value="nope" aria-label="T">
        <Tab value="a" label="A" disabled />
        <Tab value="b" label="B" />
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'false');
    rerender(
      <Tabs value="a" aria-label="T">
        <Tab value="a" label="A" disabled />
        <Tab value="b" label="B" />
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('tabindex', '-1');
  });

  it('re-observa las pestañas si se reemplazan con el mismo número', () => {
    const observed: Element[] = [];
    const Original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      observe(el: Element) {
        observed.push(el);
      }
      unobserve() {}
      disconnect() {
        observed.length = 0;
      }
    } as unknown as typeof ResizeObserver;
    try {
      const { rerender } = render(
        <Tabs aria-label="O">
          <Tab key="a" label="A" />
        </Tabs>,
      );
      rerender(
        <Tabs aria-label="O">
          <Tab key="b" label="B" />
        </Tabs>,
      );
      expect(observed).toContain(screen.getByRole('tab', { name: 'B' }));
    } finally {
      globalThis.ResizeObserver = Original;
    }
  });

  it('mide el indicador con offsetLeft/offsetWidth', () => {
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
    const left = vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockReturnValue(30);
    const { container } = render(
      <Tabs aria-label="M">
        <Tab label="A" />
      </Tabs>,
    );
    const indicator = container.querySelector<HTMLElement>('.mtx-tabs__indicator')!;
    expect(indicator.style.width).toBe('120px');
    expect(indicator.style.transform).toBe('translateX(30px)');
    width.mockRestore();
    left.mockRestore();
  });

  describe('paridad con vanilla', () => {
    it('grupo con panel y pestaña deshabilitada', async () => {
      const vanilla = await mountVanilla(
        '<div data-mtx="tabs">' +
          '<button type="button" data-mtx="tab" data-icon="phone" data-active>One</button>' +
          '<button type="button" data-mtx="tab" data-disabled disabled>Two</button>' +
          '<button type="button" data-mtx="tab">Three</button>' +
          '</div>',
      );
      const { container } = render(
        <Tabs>
          <Tab icon="phone" label="One" />
          <Tab label="Two" disabled />
          <Tab label="Three" />
        </Tabs>,
      );
      expectParity(container.firstElementChild!, vanilla.firstElementChild!, { attributes: ['tabindex'] });
    });

    it('vertical, full y centered', async () => {
      const vanilla = await mountVanilla(
        '<div data-mtx="tabs" data-orientation="vertical" data-full data-centered>' +
          '<button type="button" data-mtx="tab">A</button>' +
          '<button type="button" data-mtx="tab" data-active>B</button>' +
          '</div>',
      );
      const { container } = render(
        <Tabs orientation="vertical" variant="fullWidth" centered defaultValue={1}>
          <Tab label="A" />
          <Tab label="B" />
        </Tabs>,
      );
      expectParity(container.firstElementChild!, vanilla.firstElementChild!, { attributes: ['tabindex'] });
    });

    it('panel activo y oculto', async () => {
      const vanilla = await mountVanilla(
        '<div><div data-mtx="tabs">' +
          '<button type="button" data-mtx="tab" data-panel="#pp1" data-active>A</button>' +
          '<button type="button" data-mtx="tab" data-panel="#pp2">B</button>' +
          '</div><div class="mtx-tab-panel" id="pp1">One</div><div class="mtx-tab-panel" id="pp2">Two</div></div>',
      );
      const { container } = render(
        <div>
          <TabContext>
            <Tabs>
              <Tab value="a" label="A" />
              <Tab value="b" label="B" />
            </Tabs>
            <TabPanel value="a">One</TabPanel>
            <TabPanel value="b">Two</TabPanel>
          </TabContext>
        </div>,
      );
      expectParity(container.firstElementChild!, vanilla.firstElementChild!, { attributes: ['hidden'] });
    });
  });
});

describe('TabsContainer', () => {
  it('aplica la superficie y el modificador borderless', async () => {
    const { TabsContainer } = await import('./index');
    const { container } = render(<TabsContainer borderless className="x" />);
    expect(container.firstElementChild).toHaveClass('mtx-tabs-container', 'mtx-tabs-container--borderless', 'x');
  });
});
