import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { CircularProgress, LinearProgress } from './index';

const PARITY = { classPrefixes: ['mtx-'], attributes: ['viewBox', 'focusable', 'r', 'cx', 'cy', 'stroke-width', 'fill'] };

describe('CircularProgress', () => {
  it('indeterminate por defecto: SVG, role y nombre accesible', () => {
    const { container } = render(<CircularProgress />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveClass('mtx-circular-progress', 'mtx-circular-progress--indeterminate', 'mtx-circular-progress--primary');
    expect(root).toHaveAttribute('role', 'progressbar');
    expect(root).toHaveAttribute('aria-label', 'Loading');
    expect(root).not.toHaveAttribute('aria-valuenow');
    expect(root.style.getPropertyValue('--mtx-circular-progress-size')).toBe('40px');
    const svg = root.querySelector('svg.mtx-circular-progress__svg')!;
    expect(svg).toHaveAttribute('viewBox', '22 22 44 44');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(root.querySelector('.mtx-circular-progress__circle')).toHaveAttribute('r', String((44 - 3.6) / 2));
  });

  it('determinate: aria-value* y dashoffset proporcional', () => {
    render(<CircularProgress value={75} />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveClass('mtx-circular-progress--determinate');
    expect(root).toHaveAttribute('aria-valuenow', '75');
    expect(root).toHaveAttribute('aria-valuemin', '0');
    expect(root).toHaveAttribute('aria-valuemax', '100');
    const circle = root.querySelector('.mtx-circular-progress__circle') as SVGCircleElement;
    const circumference = 2 * Math.PI * ((44 - 3.6) / 2);
    expect(parseFloat(circle.style.strokeDasharray)).toBeCloseTo(circumference, 2);
    expect(parseFloat(circle.style.strokeDashoffset)).toBeCloseTo(0.25 * circumference, 2);
  });

  it('acota el valor, respeta min/max y muestra la etiqueta', () => {
    render(<CircularProgress value={70} min={0} max={50} showLabel />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveAttribute('aria-valuenow', '50');
    expect(root).toHaveClass('mtx-circular-progress--with-label');
    const label = root.querySelector('.mtx-circular-progress__label')!;
    expect(label).toHaveTextContent('100%');
    expect(label).toHaveAttribute('aria-hidden', 'true');
  });

  it('size, thickness, color, track y disableShrink', () => {
    const { container } = render(<CircularProgress size={24} thickness={6} color="secondary" track disableShrink />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--mtx-circular-progress-size')).toBe('24px');
    expect(root).toHaveClass('mtx-circular-progress--secondary', 'mtx-circular-progress--track', 'mtx-circular-progress--disable-shrink');
    expect(root.querySelector('.mtx-circular-progress__track')).toHaveAttribute('stroke-width', '6');
  });

  it('nombre accesible: label, aria-label, aria-labelledby e idioma', () => {
    const { rerender } = render(<CircularProgress label="Sincronizando" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Sincronizando');
    rerender(<CircularProgress aria-labelledby="t" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-labelledby', 't');
    rerender(
      <I18nProvider locale="es">
        <CircularProgress />
      </I18nProvider>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Cargando');
  });

  it('decorative oculta a lectores de pantalla', () => {
    const { container } = render(<CircularProgress decorative value={30} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-valuenow');
  });

  it('ref, className concatenado y component', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<CircularProgress ref={ref} className="extra" component="div" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current!.tagName).toBe('DIV');
    expect(ref.current).toHaveClass('mtx-circular-progress', 'extra');
  });

  it.each([
    ['<span data-mtx="circular-progress"></span>', <CircularProgress key="a" />],
    ['<span data-mtx="circular-progress" data-value="75" data-show-label></span>', <CircularProgress key="b" value={75} showLabel />],
    [
      '<span data-mtx="circular-progress" data-value="65" data-track data-color="success" data-size="56" data-thickness="5"></span>',
      <CircularProgress key="c" value={65} track color="success" size={56} thickness={5} />,
    ],
    ['<span data-mtx="circular-progress" data-disable-shrink data-label="Subiendo"></span>', <CircularProgress key="d" disableShrink label="Subiendo" />],
    [
      '<span data-mtx="circular-progress" data-size="16" data-thickness="3.6" data-color="inherit" data-decorative></span>',
      <CircularProgress key="e" size={16} color="inherit" decorative />,
    ],
  ])('paridad con vanilla: %s', async (html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});

describe('LinearProgress', () => {
  it('indeterminate por defecto con pista y dos barras', () => {
    const { container } = render(<LinearProgress />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('mtx-linear-progress', 'mtx-linear-progress--indeterminate', 'mtx-linear-progress--primary');
    expect(root).toHaveAttribute('role', 'progressbar');
    expect(root.querySelectorAll('.mtx-linear-progress__bar')).toHaveLength(2);
    expect(root.querySelector('.mtx-linear-progress__dashed')).not.toBeNull();
  });

  it('determinate: transform de la barra y aria-valuenow', () => {
    render(<LinearProgress value={40} />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveClass('mtx-linear-progress--determinate');
    expect(root).toHaveAttribute('aria-valuenow', '40');
    expect((root.querySelector('.mtx-linear-progress__bar1') as HTMLElement).style.transform).toMatch(/translateX\(-60(\.0+)?%\)/);
    expect((root.querySelector('.mtx-linear-progress__bar2') as HTMLElement).style.transform).toBe('');
  });

  it('buffer se infiere de valueBuffer y pinta la segunda barra', () => {
    render(<LinearProgress value={30} valueBuffer={55} />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveClass('mtx-linear-progress--buffer');
    expect((root.querySelector('.mtx-linear-progress__bar2') as HTMLElement).style.transform).toMatch(/translateX\(-45(\.0+)?%\)/);
  });

  it('query, rounded, color y etiqueta en escala propia', () => {
    const { rerender } = render(<LinearProgress variant="query" />);
    expect(screen.getByRole('progressbar')).toHaveClass('mtx-linear-progress--query');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    rerender(<LinearProgress value={7} max={10} rounded color="warning" showLabel />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveClass('mtx-linear-progress--rounded', 'mtx-linear-progress--warning', 'mtx-linear-progress--with-label');
    expect(root).toHaveAttribute('aria-valuemax', '10');
    expect(root.querySelector('.mtx-linear-progress__label')).toHaveTextContent('70%');
  });

  it('un color desconocido vuelve a primary', () => {
    // @ts-expect-error valor inválido a propósito
    render(<LinearProgress color="banana" />);
    expect(screen.getByRole('progressbar')).toHaveClass('mtx-linear-progress--primary');
  });

  it.each([
    ['<span data-mtx="linear-progress"></span>', <LinearProgress key="a" />],
    ['<span data-mtx="linear-progress" data-value="40" data-show-label></span>', <LinearProgress key="b" value={40} showLabel />],
    ['<span data-mtx="linear-progress" data-value="30" data-value-buffer="55"></span>', <LinearProgress key="c" value={30} valueBuffer={55} />],
    ['<span data-mtx="linear-progress" data-variant="query" data-color="error"></span>', <LinearProgress key="d" variant="query" color="error" />],
    [
      '<span data-mtx="linear-progress" data-max="50" data-value="46" data-rounded data-label="Storage"></span>',
      <LinearProgress key="e" max={50} value={46} rounded label="Storage" />,
    ],
  ])('paridad con vanilla: %s', async (html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
