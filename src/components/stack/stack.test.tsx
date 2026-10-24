import { createRef } from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Stack } from './Stack';

const classesOf = (el: Element | null) => Array.from(el?.classList ?? []);

describe('Stack', () => {
  it('renderiza .mtx-stack (columna por defecto en CSS)', () => {
    const { container } = render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    const root = container.firstElementChild!;
    expect(root.className).toBe('mtx-stack');
    expect(root.children).toHaveLength(2);
  });

  it('dirección y espaciado responsive con objeto, valores decimales y alias col', () => {
    const { container } = render(
      <Stack
        direction={{ xs: 'col', sm: 'row' }}
        spacing={{ xs: 1.5, md: 3 }}
        alignItems="center"
        justifyContent="space-between"
        wrap
      />,
    );
    expect(container.firstElementChild).toHaveClass(
      'mtx-stack',
      'mtx-stack--column',
      'mtx-stack--sm-row',
      'mtx-stack--spacing-1_5',
      'mtx-stack--md-spacing-3',
      'mtx-stack--align-center',
      'mtx-stack--justify-between',
      'mtx-stack--wrap',
    );
  });

  it('acepta arrays responsive (desde xs) y valores fijos', () => {
    const { container } = render(<Stack direction={['column', null, 'row']} spacing={2} />);
    expect(classesOf(container.firstElementChild).sort()).toEqual(
      ['mtx-stack', 'mtx-stack--column', 'mtx-stack--md-row', 'mtx-stack--spacing-2'].sort(),
    );
  });

  it.each([
    ['flex-start', 'start'],
    ['end', 'end'],
    ['baseline', 'baseline'],
  ] as const)('alignItems="%s" aplica align-%s', (value, key) => {
    const { container } = render(<Stack alignItems={value} />);
    expect(container.firstElementChild).toHaveClass(`mtx-stack--align-${key}`);
  });

  it.each([
    ['center', 'center'],
    ['space-around', 'around'],
    ['evenly', 'evenly'],
    ['flex-end', 'end'],
  ] as const)('justifyContent="%s" aplica justify-%s', (value, key) => {
    const { container } = render(<Stack justifyContent={value} />);
    expect(container.firstElementChild).toHaveClass(`mtx-stack--justify-${key}`);
  });

  it('valores no válidos se ignoran y avisan sin lanzar', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error valores no válidos a propósito
    const { container } = render(<Stack spacing={7} direction="diagonal" />);
    expect(container.firstElementChild!.className).toBe('mtx-stack');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('divider inserta <hr> decorativos entre hijos y omite hijos nulos', () => {
    const { container } = render(
      <Stack divider>
        <a>1</a>
        {null}
        <a>2</a>
        {false}
        <a>3</a>
      </Stack>,
    );
    const root = container.firstElementChild!;
    const dividers = root.querySelectorAll(':scope > .mtx-stack__divider');
    expect(dividers).toHaveLength(2);
    dividers.forEach((d) => {
      expect(d.tagName).toBe('HR');
      expect(d).toHaveClass('mtx-divider');
      expect(d).toHaveAttribute('aria-hidden', 'true');
    });
    expect(root.children[1]).toHaveClass('mtx-stack__divider');
    expect(root.children).toHaveLength(5);
  });

  it('divider acepta un nodo propio', () => {
    const { container } = render(
      <Stack divider={<span className="sep">/</span>}>
        <a>1</a>
        <a>2</a>
      </Stack>,
    );
    expect(container.querySelectorAll('.sep')).toHaveLength(1);
  });

  it('divider={false} no añade separadores', () => {
    const { container } = render(
      <Stack divider={false}>
        <a>1</a>
        <a>2</a>
      </Stack>,
    );
    expect(container.querySelector('.mtx-stack__divider')).toBeNull();
  });

  it('component, ref, className concatenado y atributos nativos', () => {
    const ref = createRef<HTMLFormElement>();
    const { container } = render(
      <Stack component="form" ref={ref} className="extra" aria-label="Formulario" spacing={2} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('FORM');
    expect(ref.current).toBe(root);
    expect(root.className).toBe('mtx-stack mtx-stack--spacing-2 extra');
    expect(root).toHaveAttribute('aria-label', 'Formulario');
  });

  it('es seguro en SSR', () => {
    const html = renderToString(
      <Stack direction="row" divider>
        <i>a</i>
        <i>b</i>
      </Stack>,
    );
    expect(html).toContain('mtx-stack__divider');
  });

  describe('paridad con vanilla', () => {
    it('dirección, espaciado responsive, alineación y wrap', async () => {
      const vanilla = await mountVanilla(`
        <div data-mtx="stack" data-direction="column" data-direction-sm="row"
             data-spacing="1" data-spacing-md="3" data-align="center" data-justify="space-between" data-wrap>
          <span>A</span><span>B</span>
        </div>`);
      const { container } = render(
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, md: 3 }}
          alignItems="center"
          justifyContent="space-between"
          wrap
        >
          <span>A</span>
          <span>B</span>
        </Stack>,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('divisores', async () => {
      const vanilla = await mountVanilla(
        '<div data-mtx="stack" data-direction="row" data-spacing="2" data-divider><a>1</a><a>2</a><a>3</a></div>',
      );
      const { container } = render(
        <Stack direction="row" spacing={2} divider>
          <a>1</a>
          <a>2</a>
          <a>3</a>
        </Stack>,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('espaciado decimal y breakpoints altos', async () => {
      const vanilla = await mountVanilla(
        '<div data-mtx="stack" data-spacing="0.5" data-direction-lg="row-reverse" data-spacing-xl="10"></div>',
      );
      const { container } = render(<Stack spacing={{ xs: 0.5, xl: 10 }} direction={{ lg: 'row-reverse' }} />);
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });
  });
});
