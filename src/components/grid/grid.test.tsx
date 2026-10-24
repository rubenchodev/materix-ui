import { createRef } from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Grid, normalizeGridSize, normalizeGridSpacing } from './Grid';

describe('Grid', () => {
  it('sin container ni tamaño actúa como contenedor (igual que vanilla)', () => {
    const { container } = render(<Grid />);
    expect(container.firstElementChild!.className).toBe('mtx-grid mtx-grid--container');
  });

  it('un tamaño convierte el elemento en ítem', () => {
    const { container } = render(<Grid xs={12} md={6} />);
    expect(container.firstElementChild!.className).toBe('mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6');
  });

  it('size responsive (API v2), true/grow y auto', () => {
    const { container } = render(
      <>
        <Grid size={{ xs: 12, sm: 6, lg: 'auto' }} />
        <Grid size="grow" />
        <Grid size={4} xl={true} />
        <Grid size={[12, 6, 4, 3, 2]} />
      </>,
    );
    const [a, b, c, d] = Array.from(container.children);
    expect(a).toHaveClass('mtx-grid--item', 'mtx-grid--xs-12', 'mtx-grid--sm-6', 'mtx-grid--lg-auto');
    expect(b).toHaveClass('mtx-grid--xs-true');
    expect(c).toHaveClass('mtx-grid--xs-4', 'mtx-grid--xl-true');
    expect(d).toHaveClass('mtx-grid--xs-12', 'mtx-grid--sm-6', 'mtx-grid--md-4', 'mtx-grid--lg-3', 'mtx-grid--xl-2');
  });

  it('las props xs…xl prevalecen sobre size', () => {
    const { container } = render(<Grid size={{ xs: 6, md: 4 }} md={3} />);
    expect(container.firstElementChild).toHaveClass('mtx-grid--xs-6', 'mtx-grid--md-3');
    expect(container.firstElementChild).not.toHaveClass('mtx-grid--md-4');
  });

  it('item sin tamaño y contenedor anidado (container + tamaño)', () => {
    const { container } = render(
      <>
        <Grid item />
        <Grid container xs={12} md={8} spacing={1} />
      </>,
    );
    const [item, nested] = Array.from(container.children);
    expect(item.className).toBe('mtx-grid mtx-grid--item');
    expect(nested).toHaveClass(
      'mtx-grid--container',
      'mtx-grid--item',
      'mtx-grid--xs-12',
      'mtx-grid--md-8',
      'mtx-grid--spacing-1',
    );
  });

  it('spacing, rowSpacing y columnSpacing responsive con medios pasos', () => {
    const { container } = render(
      <Grid container spacing={{ xs: 2.5, md: 3 }} rowSpacing={{ md: 0.5 }} columnSpacing={{ xs: '1_5' as never, lg: 7 }} />,
    );
    expect(container.firstElementChild).toHaveClass(
      'mtx-grid--spacing-2_5',
      'mtx-grid--md-spacing-3',
      'mtx-grid--md-row-spacing-0_5',
      'mtx-grid--column-spacing-1_5',
      'mtx-grid--lg-column-spacing-7',
    );
  });

  it('el espaciado solo se aplica a contenedores', () => {
    const { container } = render(<Grid xs={6} spacing={2} />);
    expect(container.firstElementChild!.className).not.toContain('spacing');
  });

  it('ignora espaciados fuera de escala avisando en desarrollo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Grid spacing={20 as never} rowSpacing="3.5" />);
    expect(container.firstElementChild!.className).toBe('mtx-grid mtx-grid--container');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('direction, wrap, justifyContent y alignItems', () => {
    const { container } = render(
      <Grid container direction="column" wrap="wrap-reverse" justifyContent="center" alignItems="flex-end" />,
    );
    expect(container.firstElementChild).toHaveClass(
      'mtx-grid--direction-column',
      'mtx-grid--wrap-reverse',
      'mtx-grid--justify-center',
      'mtx-grid--align-flex-end',
    );
  });

  it('acepta alias abreviados de alineación', () => {
    const { container } = render(<Grid justifyContent={'between' as never} alignItems={'start' as never} />);
    expect(container.firstElementChild).toHaveClass('mtx-grid--justify-space-between', 'mtx-grid--align-flex-start');
  });

  it('component, ref, className concatenado y atributos nativos', () => {
    const ref = createRef<HTMLUListElement>();
    const { container } = render(<Grid component="ul" ref={ref} className="extra" role="list" spacing={1} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('UL');
    expect(ref.current).toBe(root);
    expect(root.className).toBe('mtx-grid mtx-grid--container mtx-grid--spacing-1 extra');
    expect(root).toHaveAttribute('role', 'list');
  });

  it('normalizadores', () => {
    expect(normalizeGridSpacing('2.5')).toBe('2_5');
    expect(normalizeGridSpacing(12)).toBe('12');
    expect(normalizeGridSpacing(13)).toBeNull();
    expect(normalizeGridSize('grow')).toBe('true');
    expect(normalizeGridSize(0)).toBeNull();
    expect(normalizeGridSize('auto')).toBe('auto');
  });

  it('es seguro en SSR', () => {
    const html = renderToString(
      <Grid spacing={2}>
        <Grid xs={6} />
      </Grid>,
    );
    expect(html).toContain('mtx-grid--xs-6');
  });

  describe('paridad con vanilla', () => {
    it('contenedor con ítems por breakpoint', async () => {
      const vanilla = await mountVanilla(`
        <div data-mtx="grid" data-spacing="2">
          <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3">A</div>
          <div data-mtx="grid" data-xs="true">B</div>
          <div data-mtx="grid" data-xs="auto" data-xl="2">C</div>
        </div>`);
      const { container } = render(
        <Grid spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            A
          </Grid>
          <Grid size="grow">B</Grid>
          <Grid size={{ xs: 'auto', xl: 2 }}>C</Grid>
        </Grid>,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('espaciado responsive, filas/columnas, dirección y alineación', async () => {
      const vanilla = await mountVanilla(`<div data-mtx="grid" data-spacing="1" data-spacing-md="3"
        data-row-spacing="2" data-column-spacing-lg="7" data-direction="row-reverse"
        data-justify="space-evenly" data-align="baseline"></div>`);
      const { container } = render(
        <Grid
          spacing={{ xs: 1, md: 3 }}
          rowSpacing={2}
          columnSpacing={{ lg: 7 }}
          direction="row-reverse"
          justifyContent="space-evenly"
          alignItems="baseline"
        />,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });

    it('grilla anidada e ítem explícito', async () => {
      const vanilla = await mountVanilla(`
        <div data-mtx="grid" data-spacing="2">
          <div data-mtx="grid" data-xs="12" data-md="8" data-container data-spacing="1">
            <div data-mtx="grid" data-xs="6">n</div>
          </div>
          <div data-mtx="grid" data-item>i</div>
        </div>`);
      const { container } = render(
        <Grid spacing={2}>
          <Grid container xs={12} md={8} spacing={1}>
            <Grid xs={6}>n</Grid>
          </Grid>
          <Grid item>i</Grid>
        </Grid>,
      );
      expectParity(container.firstElementChild, vanilla.firstElementChild);
    });
  });
});
