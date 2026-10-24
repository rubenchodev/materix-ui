import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { AppBar, Toolbar, ToolbarOffset, ToolbarTitle } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'], ignoreSelectors: [], text: true };

/** Ejecuta los frames pendientes. */
async function nextFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

/** Simula el scroll de la ventana. */
async function scrollWindow(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
  await nextFrame();
}

describe('AppBar', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('renderiza un header con posición fixed y color default por defecto', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<AppBar ref={ref} className="extra" />);
    const el = container.firstElementChild!;
    expect(el.tagName).toBe('HEADER');
    expect(el).toHaveClass('mtx-app-bar', 'mtx-app-bar--fixed', 'mtx-app-bar--default', 'extra');
    expect(ref.current).toBe(el);
    expect(el.querySelector('.mtx-toolbar')).toBeNull();
    expect((el as HTMLElement).style.getPropertyValue('--mtx-app-bar-shadow')).toBe('');
  });

  it('paridad con la sintaxis simplificada (título, iconos e hijos)', async () => {
    const vanilla = await mountVanilla(
      '<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="News" data-start-icon="menu" data-end-icon="search"><button class="mtx-button mtx-button--text" type="button">Login</button></header>',
    );
    const { container } = render(
      <AppBar position="static" color="primary" title="News" startIcon="menu" endIcon="search">
        <button className="mtx-button mtx-button--text" type="button">
          Login
        </button>
      </AppBar>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, {
      ...PARITY,
      ignoreSelectors: ['.mtx-ripple-container'],
    });
    const nav = container.querySelector('.mtx-toolbar__navigation-icon')!;
    expect(nav).toHaveAttribute('aria-label', 'Open navigation');
  });

  it('paridad: densa y espaciador entre iconos sin título', async () => {
    const vanilla = await mountVanilla(
      '<header data-mtx="app-bar" data-dense data-start-icon="arrow_back" data-end-icon="more_vert" data-end-icon-label="More"></header>',
    );
    const { container } = render(<AppBar dense startIcon="arrow_back" endIcon="more_vert" endIconLabel="More" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
    expect(container.querySelector('.mtx-toolbar__spacer')).not.toBeNull();
  });

  it('posición, color, bottom y clipped', () => {
    const { container, rerender } = render(<AppBar position="sticky" color="secondary" bottom clipped />);
    const el = container.firstElementChild!;
    expect(el).toHaveClass('mtx-app-bar--sticky', 'mtx-app-bar--secondary', 'mtx-app-bar--bottom', 'mtx-app-bar--clipped');
    rerender(<AppBar position="absolute" color="transparent" />);
    expect(el).toHaveClass('mtx-app-bar--absolute', 'mtx-app-bar--transparent');
    expect(el).not.toHaveClass('mtx-app-bar--sticky');
  });

  it('elevation escribe la variable de sombra y 0 añade --flat', () => {
    const { container, rerender } = render(<AppBar color="transparent" elevation={8} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.boxShadow).toBe('');
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-8)');
    rerender(<AppBar elevation={0} />);
    expect(el).toHaveClass('mtx-app-bar--flat');
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-0)');
  });

  it('activa --animated tras el primer frame', async () => {
    const { container } = render(<AppBar />);
    expect(container.firstElementChild).not.toHaveClass('mtx-app-bar--animated');
    await nextFrame();
    await nextFrame();
    expect(container.firstElementChild).toHaveClass('mtx-app-bar--animated');
  });

  it('elevateOnScroll aplica la sombra al desplazarse', async () => {
    const { container } = render(<AppBar elevateOnScroll />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('none');
    await scrollWindow(100);
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-4)');
    await scrollWindow(0);
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('none');
  });

  it('hideOnScroll oculta al bajar más de 50px y muestra al subir', async () => {
    const { container } = render(<AppBar hideOnScroll />);
    const el = container.firstElementChild!;
    await scrollWindow(40);
    expect(el).not.toHaveClass('mtx-app-bar--hidden');
    await scrollWindow(100);
    expect(el).toHaveClass('mtx-app-bar--hidden');
    await scrollWindow(50);
    expect(el).not.toHaveClass('mtx-app-bar--hidden');
  });

  it('scrollTarget (selector) y desmontaje cancela el frame pendiente', async () => {
    const box = document.createElement('div');
    box.id = 'scroll-box';
    document.body.appendChild(box);
    const { container, unmount } = render(<AppBar elevateOnScroll scrollTarget="#scroll-box" />);
    const el = container.firstElementChild as HTMLElement;
    box.scrollTop = 150;
    box.dispatchEvent(new Event('scroll'));
    await nextFrame();
    expect(el.style.getPropertyValue('--mtx-app-bar-shadow')).toBe('var(--mtx-elevation-4)');

    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    box.dispatchEvent(new Event('scroll'));
    unmount();
    expect(cancel).toHaveBeenCalled();
    cancel.mockRestore();
    box.remove();
  });

  it('etiquetas de iconos, navigationControls y callbacks', () => {
    const onNav = vi.fn();
    const onEnd = vi.fn();
    render(
      <AppBar
        title="App"
        startIcon="arrow_back"
        startIconLabel="Volver"
        endIcon="search"
        endIconLabel="Buscar"
        onNavigationClick={onNav}
        onEndIconClick={onEnd}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onNav).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Buscar' }).querySelector('.material-icons')).toHaveAttribute('aria-hidden', 'true');

    render(<AppBar startIcon="dehaze" navigationControls="app-nav" navigationExpanded />);
    const nav = screen.getByRole('button', { name: 'Open navigation' });
    expect(nav).toHaveAttribute('aria-controls', 'app-nav');
    expect(nav).toHaveAttribute('aria-expanded', 'true');
  });

  it('con una Toolbar propia no genera otra (sintaxis completa)', () => {
    const { container } = render(
      <AppBar position="static">
        <Toolbar variant="prominent" disableGutters>
          <ToolbarTitle>Título</ToolbarTitle>
        </Toolbar>
      </AppBar>,
    );
    expect(container.querySelectorAll('.mtx-toolbar')).toHaveLength(1);
    expect(container.querySelector('.mtx-toolbar')).toHaveClass('mtx-toolbar--prominent', 'mtx-toolbar--disable-gutters');
    expect(container.querySelector('.mtx-toolbar__title')).toHaveTextContent('Título');
  });

  it('ToolbarOffset y Toolbar densa', () => {
    const { container } = render(
      <>
        <ToolbarOffset dense />
        <Toolbar variant="dense" component="nav" aria-label="Main" />
      </>,
    );
    expect(container.firstElementChild).toHaveClass('mtx-toolbar-offset', 'mtx-toolbar-offset--dense');
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass('mtx-toolbar', 'mtx-toolbar--dense');
  });
});
