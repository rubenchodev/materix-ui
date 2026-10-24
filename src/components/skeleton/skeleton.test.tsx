import { createRef } from 'react';
import { render } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Skeleton } from './Skeleton';
import { SkeletonRegion } from './SkeletonRegion';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Skeleton', () => {
  it('por defecto es un span text con pulse y aria-hidden', () => {
    const { container } = render(<Skeleton />);
    expect(root(container).tagName).toBe('SPAN');
    expect(root(container)).toHaveClass('mtx-skeleton', 'mtx-skeleton--text', 'mtx-skeleton--pulse');
    expect(root(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('variantes y dimensiones (número = px)', () => {
    const { container, rerender } = render(<Skeleton variant="circular" width={40} height="3rem" />);
    expect(root(container)).toHaveClass('mtx-skeleton--circular');
    expect(root(container).style.width).toBe('40px');
    expect(root(container).style.height).toBe('3rem');
    for (const variant of ['rectangular', 'rounded'] as const) {
      rerender(<Skeleton variant={variant} width="60%" />);
      expect(root(container)).toHaveClass(`mtx-skeleton--${variant}`);
      expect(root(container).style.width).toBe('60%');
    }
  });

  it('variante desconocida vuelve a text', () => {
    // @ts-expect-error valor no válido a propósito
    const { container } = render(<Skeleton variant="pill" />);
    expect(root(container)).toHaveClass('mtx-skeleton--text');
  });

  it('animaciones wave y false', () => {
    const { container, rerender } = render(<Skeleton animation="wave" />);
    expect(root(container)).toHaveClass('mtx-skeleton--wave');
    expect(root(container)).not.toHaveClass('mtx-skeleton--pulse');
    rerender(<Skeleton animation={false} />);
    expect(root(container)).toHaveClass('mtx-skeleton--no-animation');
    rerender(<Skeleton animation="false" />);
    expect(root(container)).toHaveClass('mtx-skeleton--no-animation');
  });

  it('con hijos marca with-children y envuelve el texto directo', () => {
    const { container, rerender } = render(<Skeleton variant="circular"><img alt="" width="40" height="40" /></Skeleton>);
    expect(root(container)).toHaveClass('mtx-skeleton--with-children');
    rerender(<Skeleton>Título</Skeleton>);
    expect(root(container)).toHaveClass('mtx-skeleton--with-children');
    expect(root(container).querySelector(':scope > .mtx-skeleton__text')).toHaveTextContent('Título');
    rerender(<Skeleton>{'  '}</Skeleton>);
    expect(root(container)).not.toHaveClass('mtx-skeleton--with-children');
  });

  it('lines genera N líneas text con la última más corta', () => {
    const { container, rerender } = render(<Skeleton lines={3} animation="wave" />);
    const el = root(container);
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('mtx-skeleton-lines');
    expect(el).not.toHaveClass('mtx-skeleton');
    const lines = el.querySelectorAll(':scope > .mtx-skeleton.mtx-skeleton--text');
    expect(lines).toHaveLength(3);
    expect((lines[2] as HTMLElement).style.width).toBe('60%');
    expect(lines[0]).toHaveClass('mtx-skeleton--wave');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    rerender(<Skeleton lines={2} lastWidth={40} />);
    expect((root(container).lastElementChild as HTMLElement).style.width).toBe('40px');
  });

  it('reenvía ref y concatena className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Skeleton component="div" ref={ref} className="extra" />);
    expect(ref.current).toBe(root(container));
    expect(root(container)).toHaveClass('mtx-skeleton', 'extra');
  });

  describe('paridad con vanilla', () => {
    it('bloques y animaciones', async () => {
      const vanilla = await mountVanilla(
        '<span data-mtx="skeleton"></span>'
        + '<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40" data-animation="wave"></span>'
        + '<span data-mtx="skeleton" data-variant="rounded" data-animation="false"></span>'
        + '<div data-mtx="skeleton">Título</div>',
      );
      const { container } = render(
        <>
          <Skeleton />
          <Skeleton variant="circular" width={40} height={40} animation="wave" />
          <Skeleton variant="rounded" animation={false} />
          <Skeleton component="div">Título</Skeleton>
        </>,
      );
      Array.from(container.children).forEach((el, i) => expectParity(el, vanilla.children[i]));
    });

    it('párrafo de líneas', async () => {
      const vanilla = await mountVanilla('<div data-mtx="skeleton" data-lines="3" data-animation="wave"></div>');
      const { container } = render(<Skeleton lines={3} animation="wave" />);
      expectParity(root(container), vanilla.firstElementChild);
    });
  });
});

describe('SkeletonRegion', () => {
  it('alterna data-loading y aria-busy y llama a onChange solo al cambiar', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <SkeletonRegion loading placeholder={<Skeleton />} onChange={onChange} aria-live="polite">
        Contenido
      </SkeletonRegion>,
    );
    const region = root(container);
    expect(region).toHaveAttribute('data-loading', '');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region.querySelector('[data-skeleton-placeholder]')).toHaveAttribute('aria-hidden', 'true');
    expect(region.querySelector('[data-skeleton-content]')).toHaveTextContent('Contenido');
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <SkeletonRegion loading={false} placeholder={<Skeleton />} onChange={onChange} aria-live="polite">
        Contenido
      </SkeletonRegion>,
    );
    expect(region).not.toHaveAttribute('data-loading');
    expect(region).not.toHaveAttribute('aria-busy');
    expect(onChange).toHaveBeenCalledWith({ loading: false });

    rerender(
      <SkeletonRegion loading placeholder={<Skeleton />} onChange={onChange} aria-live="polite">
        Contenido
      </SkeletonRegion>,
    );
    expect(onChange).toHaveBeenLastCalledWith({ loading: true });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('reenvía props a placeholder y contenido', () => {
    const { container } = render(
      <SkeletonRegion
        loading={false}
        placeholderProps={{ className: 'ph' }}
        contentProps={{ className: 'ct' }}
        className="region"
      />,
    );
    expect(root(container)).toHaveClass('region');
    expect(container.querySelector('.ph')).toHaveAttribute('data-skeleton-placeholder');
    expect(container.querySelector('.ct')).toHaveAttribute('data-skeleton-content');
  });
});
