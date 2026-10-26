import { useState } from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { getPaginationItems, Pagination, PaginationItem, usePagination } from './index';

const pageLabels = (root: Element) =>
  Array.from(root.querySelectorAll('.mtx-pagination__item--page, .mtx-pagination__ellipsis')).map((el) => el.textContent);

describe('Pagination', () => {
  it('renderiza nav con clases por defecto, aria-label y aria-current', () => {
    const { container } = render(<Pagination count={10} />);
    const nav = container.firstElementChild!;
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveClass('mtx-pagination', 'mtx-pagination--text', 'mtx-pagination--circular', 'mtx-pagination--medium', 'mtx-pagination--color-standard');
    expect(nav).toHaveAttribute('aria-label', 'pagination navigation');
    expect(nav.querySelector('ul')).toHaveClass('mtx-pagination__ul');
    expect(pageLabels(nav)).toEqual(['1', '2', '3', '4', '5', '…', '10']);
    const current = screen.getByRole('button', { name: 'page 1' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('mtx-pagination__item--selected');
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeEnabled();
  });

  it('aplica variante, forma, tamaño, color y className', () => {
    const { container } = render(<Pagination count={3} variant="outlined" shape="rounded" size="large" color="secondary" className="x" />);
    expect(container.firstElementChild).toHaveClass('mtx-pagination--outlined', 'mtx-pagination--rounded', 'mtx-pagination--large', 'mtx-pagination--color-secondary', 'x');
  });

  it('elipsis inicial y final, sibling/boundary y botones primera/última', () => {
    const { container, rerender } = render(<Pagination count={11} defaultPage={6} />);
    expect(pageLabels(container)).toEqual(['1', '…', '5', '6', '7', '…', '11']);
    rerender(<Pagination count={11} page={6} siblingCount={0} boundaryCount={2} showFirstButton showLastButton hidePrevButton hideNextButton />);
    expect(pageLabels(container)).toEqual(['1', '2', '…', '6', '…', '10', '11']);
    expect(container.querySelector('.mtx-pagination__item--first')).not.toBeNull();
    expect(container.querySelector('.mtx-pagination__item--last')).not.toBeNull();
    expect(container.querySelector('.mtx-pagination__item--previous')).toBeNull();
    expect(container.querySelector('.mtx-pagination__item--next')).toBeNull();
  });

  it('no controlado: clic cambia de página y llama a onChange; la página actual no emite', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination count={5} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(screen.getByRole('button', { name: 'page 3' })).toHaveAttribute('aria-current', 'page');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 3);
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 4);
    await user.click(screen.getByRole('button', { name: 'page 4' }));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('controlado: refleja la página del padre y ajusta al rango', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(2);
      return <Pagination count={5} page={page} onChange={(_, next) => setPage(next)} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
    const { container } = render(<Pagination count={3} page={9} />);
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent('3');
  });

  it('mueve el foco a la página actual si el botón enfocado se deshabilita', async () => {
    const user = userEvent.setup();
    render(<Pagination count={3} defaultPage={2} />);
    const next = screen.getByRole('button', { name: 'Go to next page' });
    next.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'page 3' }));
  });

  it('disabled deshabilita todos los ítems', () => {
    const { container } = render(<Pagination count={3} disabled />);
    expect(container.firstElementChild).toHaveClass('mtx-pagination--disabled');
    container.querySelectorAll('button').forEach((button) => expect(button).toBeDisabled());
  });

  it('count 0 solo pinta navegación deshabilitada', () => {
    const { container } = render(<Pagination count={0} showFirstButton />);
    expect(container.querySelectorAll('.mtx-pagination__item--page')).toHaveLength(0);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => expect(button).toBeDisabled());
  });

  it('count 0 ocultando anterior y siguiente no pinta nada (como vanilla)', () => {
    const { container } = render(<Pagination count={0} hidePrevButton hideNextButton showFirstButton showLastButton />);
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('modo enlaces: href, aria-disabled y navegación cancelable', () => {
    const onChange = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { container } = render(<Pagination count={5} getItemHref={(p) => `?page=${p}`} onChange={onChange} />);
    const prev = container.querySelector('.mtx-pagination__item--previous')!;
    expect(prev.tagName).toBe('A');
    expect(prev).not.toHaveAttribute('href');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev).toHaveAttribute('role', 'link');
    const link = screen.getByRole('link', { name: 'Go to page 2' });
    expect(link).toHaveAttribute('href', '?page=2');
    fireEvent.click(link);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), 2);
    expect(screen.getByRole('link', { name: 'page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('modo enlaces sin preventDefault no cambia la página en cliente', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} getItemHref={(p) => `#p${p}`} onChange={onChange} />);
    fireEvent.click(screen.getByRole('link', { name: 'Go to page 4' }));
    expect(onChange).toHaveBeenCalledWith(expect.anything(), 4);
    expect(screen.getByRole('link', { name: 'page 1' })).toHaveAttribute('aria-current', 'page');
  });

  it('modo enlaces: detecta preventDefault hecho después de onChange (Link de router)', async () => {
    render(
      <Pagination
        count={5}
        getItemHref={(p) => `#p${p}`}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            onClick={(event) => {
              item.onClick(event);
              event.preventDefault();
            }}
          />
        )}
      />,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go to page 3' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('link', { name: 'page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('reexporta getPaginationItems', () => {
    expect(getPaginationItems({ count: 3, page: 1 })).toEqual(['previous', 1, 2, 3, 'next']);
  });

  it('getItemAriaLabel, renderItem y aria-label propio', () => {
    render(
      <Pagination
        count={2}
        aria-label="Results"
        getItemAriaLabel={(type, page) => `${type}:${page}`}
        renderItem={(item) => <PaginationItem {...item} data-testid={`item-${item.type}`} />}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'page:2' })).toBeInTheDocument();
    expect(screen.getAllByTestId('item-page')).toHaveLength(2);
  });

  it('traduce las etiquetas con I18nProvider y con locale', () => {
    render(
      <I18nProvider locale="es">
        <Pagination count={3} />
      </I18nProvider>,
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'navegación de paginación');
    const { container } = render(<Pagination count={3} locale="es" />);
    expect(container.querySelector('.mtx-pagination__item--next')!.getAttribute('aria-label')).not.toBe('Go to next page');
  });

  it('usePagination expone ítems al estilo MUI', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => usePagination({ count: 10, defaultPage: 1, onChange }));
    expect(result.current.items.map((item) => item.type)).toEqual([
      'previous', 'page', 'page', 'page', 'page', 'page', 'end-ellipsis', 'page', 'next',
    ]);
    expect(result.current.items[0].disabled).toBe(true);
    act(() => result.current.items[8].onClick({} as never));
    expect(onChange).toHaveBeenCalledWith(expect.anything(), 2);
    expect(result.current.page).toBe(2);
  });

  describe('paridad con vanilla', () => {
    it('por defecto', async () => {
      const vanilla = await mountVanilla('<nav data-mtx="pagination" data-count="10" data-page="4"></nav>');
      const { container } = render(<Pagination count={10} defaultPage={4} />);
      expectParity(container.firstElementChild!, vanilla.firstElementChild!);
    });

    it('variantes y botones primera/última', async () => {
      const vanilla = await mountVanilla(
        '<nav data-mtx="pagination" data-count="8" data-page="8" data-variant="outlined" data-shape="rounded" data-size="small" data-color="primary" data-show-first-button data-show-last-button data-disabled></nav>',
      );
      const { container } = render(
        <Pagination count={8} defaultPage={8} variant="outlined" shape="rounded" size="small" color="primary" showFirstButton showLastButton disabled />,
      );
      expectParity(container.firstElementChild!, vanilla.firstElementChild!);
    });

    it('modo enlaces', async () => {
      const vanilla = await mountVanilla('<nav data-mtx="pagination" data-count="5" data-page="1" data-href-template="?page={page}"></nav>');
      const { container } = render(<Pagination count={5} getItemHref={(p) => `?page=${p}`} />);
      expectParity(container.firstElementChild!, vanilla.firstElementChild!, { attributes: ['href'] });
    });
  });
});
