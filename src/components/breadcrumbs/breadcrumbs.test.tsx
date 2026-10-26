import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { Link } from '../link';
import { Breadcrumbs } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'], attributes: ['href'] };

const LONG = (
  <Breadcrumbs maxItems={3}>
    <a href="/">Home</a>
    <a href="/a">A</a>
    <a href="/b">B</a>
    <a href="/c">C</a>
    Current
  </Breadcrumbs>
);

describe('Breadcrumbs', () => {
  it('nav con aria-label i18n, ol y ref al nav', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Breadcrumbs ref={ref}>
        <Link href="/">Home</Link>
        <span>Invoices</span>
      </Breadcrumbs>,
    );
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(ref.current).toBe(nav);
    expect(nav).toHaveClass('mtx-breadcrumbs');
    expect(nav.querySelector('ol')).toHaveClass('mtx-breadcrumbs__ol');
  });

  it('variant aplica la escala tipográfica', () => {
    render(<Breadcrumbs variant="body2">Here</Breadcrumbs>);
    expect(screen.getByRole('navigation')).toHaveClass('mtx-typography--body2');
  });

  it('Link con color inherit y subrayado hover; último ítem es la página actual', () => {
    render(
      <Breadcrumbs>
        <a href="/">Home</a>
        Invoices
      </Breadcrumbs>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('mtx-link', 'mtx-link--inherit', 'mtx-link--underline-hover', 'mtx-breadcrumbs__link');
    const current = document.querySelector('[aria-current="page"]')!;
    expect(current.textContent).toBe('Invoices');
    expect(current).toHaveClass('mtx-breadcrumbs__text');
  });

  it('respeta un aria-current existente y las props propias del Link', () => {
    render(
      <Breadcrumbs>
        <Link href="/" aria-current="page" color="primary" underline="always">
          Home
        </Link>
        <Link href="/x">X</Link>
      </Breadcrumbs>,
    );
    expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).toHaveClass('mtx-link--primary', 'mtx-link--underline-always');
  });

  it('separadores aria-hidden de texto, icono o nodo', () => {
    const { rerender } = render(
      <Breadcrumbs>
        <a href="/">A</a>
        <a href="/b">B</a>
        C
      </Breadcrumbs>,
    );
    let seps = document.querySelectorAll('.mtx-breadcrumbs__separator');
    expect(seps).toHaveLength(2);
    expect(seps[0]).toHaveAttribute('aria-hidden', 'true');
    expect(seps[0].textContent).toBe('/');
    rerender(
      <Breadcrumbs separator="navigate_next">
        <a href="/">A</a>B
      </Breadcrumbs>,
    );
    expect(document.querySelector('.mtx-breadcrumbs__separator .material-icons')!.textContent).toBe('navigate_next');
    rerender(
      <Breadcrumbs separator="›">
        <a href="/">A</a>B
      </Breadcrumbs>,
    );
    seps = document.querySelectorAll('.mtx-breadcrumbs__separator');
    expect(seps[0].textContent).toBe('›');
  });

  it('data-icon en los hijos añade el icono decorativo', () => {
    render(
      <Breadcrumbs>
        <Link href="/" data-icon="home">
          Home
        </Link>
        <span data-icon="grain">Here</span>
      </Breadcrumbs>,
    );
    const link = screen.getByRole('link', { name: /Home/ });
    const icon = link.querySelector('.mtx-breadcrumbs__icon')!;
    expect(icon.textContent).toBe('home');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(link).toHaveClass('mtx-breadcrumbs__item--with-icon');
    expect(link).not.toHaveAttribute('data-icon');
    expect(document.querySelector('span[aria-current="page"] .mtx-breadcrumbs__icon')!.textContent).toBe('grain');
  });

  it('colapsa con maxItems y expande con el botón accesible, moviendo el foco', async () => {
    const onExpand = vi.fn();
    render(<Breadcrumbs maxItems={3} onExpand={onExpand}>{(LONG.props as { children: React.ReactNode }).children}</Breadcrumbs>);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('mtx-breadcrumbs--collapsed');
    expect(nav.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(2);
    const button = screen.getByRole('button', { name: 'Show path' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onExpand).toHaveBeenCalledTimes(1);
    expect(nav.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(5);
    expect(nav).not.toHaveClass('mtx-breadcrumbs--collapsed');
    expect(screen.queryByRole('button', { name: 'Show path' })).toBeNull();
    expect(document.activeElement?.textContent).toBe('A');
  });

  it('respeta itemsBefore/AfterCollapse y no colapsa si cubren todos los ítems', () => {
    const { rerender } = render(
      <Breadcrumbs maxItems={3} itemsBeforeCollapse={2} itemsAfterCollapse={2}>
        {(LONG.props as { children: React.ReactNode }).children}
      </Breadcrumbs>,
    );
    const labels = () => Array.from(document.querySelectorAll('.mtx-breadcrumbs__li')).map((li) => li.textContent);
    expect(labels()).toEqual(['Home', 'A', 'C', 'Current']);
    rerender(
      <Breadcrumbs maxItems={2} itemsBeforeCollapse={3} itemsAfterCollapse={2}>
        {(LONG.props as { children: React.ReactNode }).children}
      </Breadcrumbs>,
    );
    expect(document.querySelector('.mtx-breadcrumbs__collapse-button')).toBeNull();
    rerender(<Breadcrumbs maxItems={0}>{(LONG.props as { children: React.ReactNode }).children}</Breadcrumbs>);
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(5);
  });

  it('onNavigate recibe index, href y label; false o preventDefault cancelan', () => {
    const calls: unknown[] = [];
    const { rerender } = render(
      <Breadcrumbs
        onNavigate={(_, detail) => {
          calls.push(detail);
          return false;
        }}
      >
        <a href="/home">Home</a>
        <a href="/docs">Docs</a>
        Here
      </Breadcrumbs>,
    );
    const docs = screen.getByRole('link', { name: 'Docs' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    docs.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(calls[0]).toMatchObject({ index: 1, href: '/docs', label: 'Docs', current: false });

    rerender(
      <Breadcrumbs onNavigate={(e) => e.preventDefault()}>
        <a href="/home">Home</a>
        Here
      </Breadcrumbs>,
    );
    const second = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Home' }).dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);

    rerender(
      <Breadcrumbs onNavigate={() => undefined}>
        <a href="#home">Home</a>
        Here
      </Breadcrumbs>,
    );
    const third = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Home' }).dispatchEvent(third);
    expect(third.defaultPrevented).toBe(false);
  });

  it('items: enlaces, botones, iconos, data y página actual', () => {
    const onNavigate = vi.fn();
    render(
      <Breadcrumbs
        onNavigate={onNavigate}
        items={[
          { label: 'My Drive', icon: 'folder', data: { folder: 'root' } },
          { label: 'Projects', href: '/p' },
          { label: 'Report' },
        ]}
      />,
    );
    const drive = screen.getByRole('button', { name: /My Drive/ });
    expect(drive).toHaveClass('mtx-link', 'mtx-breadcrumbs__link', 'mtx-breadcrumbs__item--with-icon');
    expect(drive).toHaveAttribute('data-folder', 'root');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/p');
    const current = document.querySelector('[aria-current="page"]')!;
    expect(current.tagName).toBe('SPAN');
    expect(current.textContent).toBe('Report');
    fireEvent.click(drive);
    expect(onNavigate.mock.calls[0][1]).toMatchObject({
      index: 0,
      href: null,
      label: 'My Drive',
      item: { label: 'My Drive', icon: 'folder', data: { folder: 'root' } },
    });
  });

  it('items con current explícito y colapso que se reinicia al cambiar la ruta', async () => {
    const make = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `L${i}`, href: `/${i}`, current: i === 0 }));
    const { rerender } = render(<Breadcrumbs maxItems={2} items={make(4)} />);
    expect(screen.getByRole('link', { name: 'L0' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Show path' }));
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(4);
    rerender(<Breadcrumbs maxItems={2} items={make(5)} />);
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(2);
  });

  it('traduce aria-label y el botón de colapso; respeta aria-label y expandText', () => {
    const { rerender } = render(
      <I18nProvider locale="es">
        <Breadcrumbs maxItems={3}>{(LONG.props as { children: React.ReactNode }).children}</Breadcrumbs>
      </I18nProvider>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.getAttribute('aria-label')).not.toBe('breadcrumb');
    expect(screen.getByRole('button').getAttribute('aria-label')).not.toBe('Show path');
    rerender(
      <Breadcrumbs maxItems={3} aria-label="You are here" expandText="More">
        {(LONG.props as { children: React.ReactNode }).children}
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('aplana los Fragments: un <li> por ítem y sin warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Breadcrumbs>
        <>
          <a href="/">Home</a>
          <a href="/docs">Docs</a>
        </>
        <span>Here</span>
      </Breadcrumbs>,
    );
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(3);
    expect(document.querySelectorAll('.mtx-breadcrumbs__separator')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass('mtx-breadcrumbs__link');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('children: vuelve a colapsar si cambian los hijos con la misma cantidad', async () => {
    const trail = (last: string) => (
      <Breadcrumbs maxItems={2}>
        <a href="/">Home</a>
        <a href="/a">A</a>
        <a href="/b">B</a>
        {last}
      </Breadcrumbs>
    );
    const { rerender } = render(trail('One'));
    await userEvent.click(screen.getByRole('button', { name: 'Show path' }));
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(4);
    rerender(trail('One'));
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(4);
    rerender(trail('Two'));
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(2);
  });

  it('defaultExpanded muestra la ruta completa al montar', () => {
    render(<Breadcrumbs maxItems={2} defaultExpanded>{(LONG.props as { children: React.ReactNode }).children}</Breadcrumbs>);
    expect(document.querySelectorAll('.mtx-breadcrumbs__li')).toHaveLength(5);
    expect(document.querySelector('.mtx-breadcrumbs__collapse-button')).toBeNull();
  });

  it('paridad con vanilla (separador de icono, iconos y colapso)', async () => {
    const vanilla = await mountVanilla(`
      <ol data-mtx="breadcrumbs" data-separator="navigate_next" data-max-items="3">
        <li><a href="/" data-icon="home">Home</a></li>
        <li><a href="/a">A</a></li>
        <li><a href="/b">B</a></li>
        <li><span data-icon="grain">Here</span></li>
      </ol>`);
    const { container } = render(
      <Breadcrumbs separator="navigate_next" maxItems={3}>
        <a href="/" data-icon="home">
          Home
        </a>
        <a href="/a">A</a>
        <a href="/b">B</a>
        <span data-icon="grain">Here</span>
      </Breadcrumbs>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('paridad con vanilla (items equivalentes a setItems)', async () => {
    const vanilla = await mountVanilla('<ol data-mtx="breadcrumbs"><li>x</li></ol>');
    const { Breadcrumbs: VanillaBreadcrumbs, getInstance } = await import('@rubenchodev/materix-ui');
    const instance = getInstance(vanilla.querySelector('ol')!) as InstanceType<typeof VanillaBreadcrumbs>;
    instance.setItems([{ label: 'Root', icon: 'folder' }, { label: 'Docs', href: '/docs' }, { label: 'Now' }]);
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Root', icon: 'folder' }, { label: 'Docs', href: '/docs' }, { label: 'Now' }]} />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
