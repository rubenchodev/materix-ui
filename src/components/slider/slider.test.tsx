import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { Slider } from './index';
import type { SliderValue } from './index';

/** Simula el tamaño del rail (jsdom no hace layout). */
const mockRail = (root: Element, rect = { left: 0, top: 0, width: 200, height: 200 }) => {
  const rail = root.querySelector('.mtx-slider__rail') as HTMLElement;
  rail.getBoundingClientRect = () =>
    ({ ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height, x: rect.left, y: rect.top, toJSON: () => ({}) }) as DOMRect;
};

const down = (target: Element, init: PointerEventInit) => fireEvent.pointerDown(target, { button: 0, pointerId: 1, ...init });
const move = (init: PointerEventInit) => fireEvent.pointerMove(document, { pointerId: 1, ...init });
const up = (init: PointerEventInit = {}) => fireEvent.pointerUp(document, { pointerId: 1, ...init });
const key = (input: Element, k: string) => fireEvent.keyDown(input, { key: k });

const thumbs = (root: Element) => Array.from(root.querySelectorAll('.mtx-slider__thumb')) as HTMLElement[];
const inputs = (root: Element) => Array.from(root.querySelectorAll('input[type="range"]')) as HTMLInputElement[];

describe('Slider', () => {
  it('renderiza rail, track, thumb, input y value label con estilos calculados', () => {
    const { container } = render(
      <form>
        <Slider aria-label="Volume" name="volume" defaultValue={30} className="extra" />
      </form>,
    );
    const root = container.querySelector('.mtx-slider') as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveClass('mtx-slider', 'extra', 'mtx-slider--label-off');
    expect(root.querySelector('.mtx-slider__rail')).not.toBeNull();
    expect((root.querySelector('.mtx-slider__track') as HTMLElement).style.width).toBe('30%');
    const input = screen.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
    expect(input.parentElement).toHaveClass('mtx-slider__thumb');
    expect(input.parentElement!.style.insetInlineStart).toBe('30%');
    expect(input).toHaveClass('mtx-slider__input');
    expect(input.value).toBe('30');
    expect(new FormData(container.querySelector('form')!).get('volume')).toBe('30');
    expect(root.querySelector('.mtx-slider__value-label')).toHaveAttribute('aria-hidden', 'true');
  });

  it('valor por defecto: punto medio (simple) y [min, max] (rango)', () => {
    const { container } = render(
      <>
        <Slider aria-label="A" min={0} max={50} />
        <Slider aria-label="B" range />
      </>,
    );
    const [a, b1, b2] = inputs(container);
    expect(a.value).toBe('25');
    expect([b1.value, b2.value]).toEqual(['0', '100']);
  });

  it('tamaño, color, orientación y modo de value label', () => {
    const { container } = render(
      <Slider aria-label="V" size="small" color="secondary" orientation="vertical" valueLabelDisplay="on" defaultValue={40} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('mtx-slider--small', 'mtx-slider--secondary', 'mtx-slider--vertical', 'mtx-slider--label-on');
    const input = root.querySelector('input')!;
    expect(input).toHaveAttribute('aria-orientation', 'vertical');
    expect(input.parentElement!.style.bottom).toBe('40%');
    expect((root.querySelector('.mtx-slider__track') as HTMLElement).style.height).toBe('40%');
    expect(root.querySelector('.mtx-slider__value-label-text')).toHaveTextContent('40');
  });

  it('redondea al step y acota a min/max', () => {
    const { container, rerender } = render(<Slider aria-label="S" min={10} max={50} step={5} value={23} />);
    expect(inputs(container)[0].value).toBe('25');
    rerender(<Slider aria-label="S" min={10} max={50} step={5} value={999} />);
    expect(inputs(container)[0].value).toBe('50');
    rerender(<Slider aria-label="S" min={10} max={50} step={5} value={-3} />);
    expect(inputs(container)[0].value).toBe('10');
  });

  it('valueLabelFormat (plantilla y función) y aria-valuetext', () => {
    const { container } = render(
      <>
        <Slider aria-label="T" defaultValue={20} valueLabelFormat="{value} °C" />
        <Slider aria-label="F" defaultValue={5} valueLabelFormat={(v) => `${v * 10}%`} />
        <Slider aria-label="G" defaultValue={7} getAriaValueText={(v, i) => `v${v}-${i}`} />
      </>,
    );
    const [t, f, g] = inputs(container);
    expect(t).toHaveAttribute('aria-valuetext', '20 °C');
    expect(f).toHaveAttribute('aria-valuetext', '50%');
    expect(g).toHaveAttribute('aria-valuetext', 'v7-0');
    const texts = container.querySelectorAll('.mtx-slider__value-label-text');
    expect(texts[0]).toHaveTextContent('20 °C');
    expect(texts[1]).toHaveTextContent('50%');
    expect(texts[2]).toHaveTextContent('7');
  });

  it('teclado: flechas, PageUp/PageDown (10 %), Home/End, onChange y onChangeCommitted', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(<Slider aria-label="K" defaultValue={50} onChange={onChange} onChangeCommitted={onCommit} />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    key(input, 'ArrowRight');
    expect(input.value).toBe('51');
    key(input, 'ArrowDown');
    expect(input.value).toBe('50');
    key(input, 'PageUp');
    expect(input.value).toBe('60');
    key(input, 'PageDown');
    key(input, 'PageDown');
    expect(input.value).toBe('40');
    key(input, 'End');
    expect(input.value).toBe('100');
    key(input, 'Home');
    expect(input.value).toBe('0');
    expect(onCommit).toHaveBeenCalledTimes(7);
    expect(onCommit.mock.calls[6][1]).toBe(0);
    expect(onChange).toHaveBeenCalledTimes(7);
    expect(onChange.mock.calls[0].slice(1)).toEqual([51, 0]);
    // Sin cambio (Home en el mínimo) no notifica.
    key(input, 'Home');
    expect(onChange).toHaveBeenCalledTimes(7);
  });

  it('teclado en RTL horizontal: ArrowLeft incrementa', () => {
    render(
      <div dir="rtl">
        <Slider aria-label="R" defaultValue={50} />
      </div>,
    );
    const input = screen.getByRole('slider') as HTMLInputElement;
    key(input, 'ArrowLeft');
    expect(input.value).toBe('51');
  });

  it('arrastre con puntero: onChange durante el arrastre y onChangeCommitted al soltar', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const { container } = render(<Slider aria-label="D" defaultValue={10} onChange={onChange} onChangeCommitted={onCommit} />);
    const root = container.firstElementChild!;
    mockRail(root);
    const input = inputs(root)[0];
    down(root.querySelector('.mtx-slider__rail')!, { clientX: 100 });
    expect(input.value).toBe('50');
    expect(root).toHaveClass('mtx-slider--dragging');
    expect(thumbs(root)[0]).toHaveClass('mtx-slider__thumb--active');
    expect(document.activeElement).toBe(input);
    act(() => {
      move({ clientX: 150 });
    });
    expect(input.value).toBe('75');
    expect(onCommit).not.toHaveBeenCalled();
    act(() => {
      up({ clientX: 150 });
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit.mock.calls[0][1]).toBe(75);
    expect(root).not.toHaveClass('mtx-slider--dragging');
    act(() => {
      move({ clientX: 20 });
    });
    expect(input.value).toBe('75');
  });

  it('arrastre en RTL invierte el eje', () => {
    const { container } = render(
      <div dir="rtl">
        <Slider aria-label="R" defaultValue={0} />
      </div>,
    );
    const root = container.querySelector('.mtx-slider')!;
    mockRail(root);
    down(root, { clientX: 50 });
    expect(inputs(root)[0].value).toBe('75');
    act(() => {
      up();
    });
  });

  it('arrastre vertical usa el eje Y desde abajo', () => {
    const { container } = render(<Slider aria-label="V" orientation="vertical" defaultValue={0} />);
    const root = container.firstElementChild!;
    mockRail(root);
    down(root, { clientY: 50 });
    expect(inputs(root)[0].value).toBe('75');
    act(() => {
      up();
    });
  });

  it('ignora botones secundarios y clics en el value label', () => {
    const { container } = render(<Slider aria-label="I" defaultValue={10} valueLabelDisplay="on" />);
    const root = container.firstElementChild!;
    mockRail(root);
    fireEvent.pointerDown(root, { button: 2, clientX: 100 });
    down(root.querySelector('.mtx-slider__value-label')!, { clientX: 100 });
    expect(inputs(root)[0].value).toBe('10');
  });

  it('rango: names -start/-end, etiquetas Minimum/Maximum, track y FormData', () => {
    const { container } = render(
      <form>
        <Slider name="price" defaultValue={[20, 60]} aria-label="Price" />
      </form>,
    );
    const root = container.querySelector('.mtx-slider')!;
    const [a, b] = inputs(root);
    expect(a.name).toBe('price-start');
    expect(b.name).toBe('price-end');
    expect(a).toHaveAttribute('aria-label', 'Price: Minimum');
    expect(b).toHaveAttribute('aria-label', 'Price: Maximum');
    const track = root.querySelector('.mtx-slider__track') as HTMLElement;
    expect(track.style.insetInlineStart).toBe('20%');
    expect(track.style.width).toBe('40%');
    const data = new FormData(container.querySelector('form')!);
    expect(data.get('price-start')).toBe('20');
    expect(data.get('price-end')).toBe('60');
  });

  it('rango con aria-labelledby usa el texto externo y getAriaLabel lo sustituye', () => {
    render(
      <>
        <span id="lbl">Budget</span>
        <Slider aria-labelledby="lbl" defaultValue={[10, 20]} />
        <Slider getAriaLabel={(i) => (i === 0 ? 'From' : 'To')} defaultValue={[10, 20]} />
      </>,
    );
    expect(screen.getByRole('slider', { name: 'Budget: Minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Budget: Maximum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'From' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'To' })).toBeInTheDocument();
  });

  it('rango en español usa Mínimo/Máximo', () => {
    render(
      <I18nProvider locale="es">
        <Slider defaultValue={[10, 20]} />
      </I18nProvider>,
    );
    expect(screen.getByRole('slider', { name: 'Mínimo' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Máximo' })).toBeInTheDocument();
  });

  it('rango: el thumb más cercano se mueve y cruza intercambiándose (swap)', () => {
    const onChange = vi.fn();
    const { container } = render(<Slider aria-label="X" defaultValue={[20, 60]} onChange={onChange} />);
    const root = container.firstElementChild!;
    mockRail(root);
    down(root, { clientX: 60 });
    const [a, b] = inputs(root);
    expect([a.value, b.value]).toEqual(['30', '60']);
    act(() => {
      move({ clientX: 160 });
    });
    expect([a.value, b.value]).toEqual(['60', '80']);
    expect(document.activeElement).toBe(b);
    expect(thumbs(root)[1]).toHaveClass('mtx-slider__thumb--active');
    expect(onChange.mock.calls[1].slice(1)).toEqual([[60, 80], 1]);
    act(() => {
      up();
    });
  });

  it('rango con disableSwap y minDistance acota el thumb activo', () => {
    const { container } = render(<Slider aria-label="X" defaultValue={[20, 60]} disableSwap minDistance={10} />);
    const root = container.firstElementChild!;
    mockRail(root);
    down(root, { clientX: 40 });
    act(() => {
      move({ clientX: 190 });
    });
    const [a, b] = inputs(root);
    expect([a.value, b.value]).toEqual(['50', '60']);
    act(() => {
      up();
    });
    key(b, 'Home');
    expect([a.value, b.value]).toEqual(['50', '60']);
    key(b, 'End');
    expect([a.value, b.value]).toEqual(['50', '100']);
  });

  it('marcas: true crea una por step y la lista crea etiquetas activas', () => {
    const { container } = render(
      <>
        <Slider aria-label="A" min={0} max={50} step={10} defaultValue={20} marks />
        <Slider aria-label="B" defaultValue={37} marks="0:0°C,20:20°C,37:37°C,100:100°C" />
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll('.mtx-slider'));
    expect(a.querySelectorAll('.mtx-slider__mark')).toHaveLength(6);
    expect(a.querySelectorAll('.mtx-slider__mark--active')).toHaveLength(3);
    expect(a).not.toHaveClass('mtx-slider--marked');
    const labels = b.querySelectorAll('.mtx-slider__mark-label');
    expect(labels).toHaveLength(4);
    expect(labels[2]).toHaveTextContent('37°C');
    expect((labels[2] as HTMLElement).style.insetInlineStart).toBe('37%');
    expect(b.querySelectorAll('.mtx-slider__mark-label--active')).toHaveLength(3);
    expect(b).toHaveClass('mtx-slider--marked');
  });

  it('marcas como array con etiquetas ReactNode', () => {
    const { container } = render(
      <Slider aria-label="M" defaultValue={50} marks={[{ value: 0, label: <strong>Low</strong> }, { value: 50 }, { value: 100, label: 'High' }, { value: 200, label: 'Out' }]} />,
    );
    expect(container.querySelectorAll('.mtx-slider__mark')).toHaveLength(3);
    expect(container.querySelector('.mtx-slider__mark-label strong')).toHaveTextContent('Low');
  });

  it('marksInset alinea hacia dentro las etiquetas de los extremos', () => {
    const { container } = render(<Slider aria-label="I" defaultValue={37} marks="0:0 °C,37:37 °C,100:100 °C" marksInset />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-slider--marks-inset');
    const labels = root.querySelectorAll('.mtx-slider__mark-label');
    expect(labels[0]).toHaveClass('mtx-slider__mark-label--start');
    expect(labels[1]).not.toHaveClass('mtx-slider__mark-label--start', 'mtx-slider__mark-label--end');
    expect(labels[2]).toHaveClass('mtx-slider__mark-label--end');
  });

  it('step={null} restringe los valores a las marcas', () => {
    render(<Slider aria-label="O" step={null} defaultValue={30} marks="0:A,20:B,37:C,100:D" />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    expect(input.value).toBe('37');
    key(input, 'ArrowRight');
    expect(input.value).toBe('100');
    key(input, 'ArrowLeft');
    key(input, 'ArrowLeft');
    expect(input.value).toBe('20');
  });

  it('step={null}: el input usa step="any" con marcas fraccionarias', () => {
    render(<Slider aria-label="Q" min={0} max={1} step={null} defaultValue={0.25} marks={[{ value: 0 }, { value: 0.25 }, { value: 1 }]} />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    expect(input).toHaveAttribute('step', 'any');
    expect(input.value).toBe('0.25');
  });

  it('onChangeCommitted usa el callback más reciente aunque cambie durante el arrastre', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { container, rerender } = render(<Slider aria-label="L" defaultValue={10} onChangeCommitted={first} />);
    const root = container.firstElementChild!;
    mockRail(root);
    down(root, { clientX: 100 });
    rerender(<Slider aria-label="L" defaultValue={10} onChangeCommitted={second} />);
    act(() => {
      up();
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(expect.anything(), 50);
  });

  it('track invertido y sin track', () => {
    const { container } = render(
      <>
        <Slider aria-label="I" defaultValue={30} track="inverted" />
        <Slider aria-label="F" defaultValue={30} track={false} />
      </>,
    );
    const [inv, none] = Array.from(container.querySelectorAll('.mtx-slider'));
    expect(inv).toHaveClass('mtx-slider--track-inverted');
    const tr = inv.querySelector('.mtx-slider__track') as HTMLElement;
    expect(tr.style.insetInlineStart).toBe('30%');
    expect(tr.style.width).toBe('70%');
    expect(none).toHaveClass('mtx-slider--track-false');
  });

  it('disabled bloquea puntero y teclado', () => {
    const onChange = vi.fn();
    const { container } = render(<Slider aria-label="D" defaultValue={30} disabled onChange={onChange} />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-slider--disabled');
    expect(root).toHaveAttribute('aria-disabled', 'true');
    const input = inputs(root)[0];
    expect(input).toBeDisabled();
    mockRail(root);
    down(root, { clientX: 180 });
    key(input, 'End');
    expect(input.value).toBe('30');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('controlado: refleja el estado del padre', () => {
    function Controlled() {
      const [value, setValue] = useState<SliderValue>([10, 70]);
      return (
        <>
          <Slider aria-label="C" value={value} onChange={(_, v) => setValue(v)} />
          <output>{String(value)}</output>
        </>
      );
    }
    const { container } = render(<Controlled />);
    key(inputs(container)[1], 'ArrowRight');
    expect(container.querySelector('output')).toHaveTextContent('10,71');
  });

  it('controlado: un padre que ignora el cambio no acumula valores (teclado y arrastre)', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const { container } = render(<Slider aria-label="C" value={50} onChange={onChange} onChangeCommitted={onCommit} />);
    const root = container.firstElementChild!;
    const input = inputs(root)[0];
    key(input, 'ArrowRight');
    key(input, 'ArrowRight');
    key(input, 'ArrowRight');
    expect(onChange.mock.calls.map((c) => c[1])).toEqual([51, 51, 51]);
    expect(onCommit).not.toHaveBeenCalled();
    expect(input.value).toBe('50');
    mockRail(root);
    onChange.mockClear();
    down(root, { clientX: 150 });
    act(() => {
      move({ clientX: 160 });
    });
    act(() => {
      up();
    });
    expect(onChange.mock.calls.map((c) => c[1])).toEqual([75, 80]);
    expect(onCommit).not.toHaveBeenCalled();
    expect(input.value).toBe('50');
  });

  it('controlado: un padre que limita a 60 confirma el valor recortado', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    function Clamped() {
      const [value, setValue] = useState<SliderValue>(50);
      return (
        <Slider
          aria-label="C"
          value={value}
          onChange={(_, v) => {
            onChange(v);
            setValue(Math.min(60, v as number));
          }}
          onChangeCommitted={(_, v) => onCommit(v)}
        />
      );
    }
    const { container } = render(<Clamped />);
    const root = container.firstElementChild!;
    const input = inputs(root)[0];
    key(input, 'End');
    expect(input.value).toBe('60');
    expect(onCommit).toHaveBeenLastCalledWith(60);
    key(input, 'ArrowRight');
    expect(onChange).toHaveBeenLastCalledWith(61);
    expect(input.value).toBe('60');
    expect(onCommit).toHaveBeenCalledTimes(1);
    mockRail(root);
    key(input, 'Home');
    expect(input.value).toBe('0');
    down(root, { clientX: 180 });
    act(() => {
      up();
    });
    expect(input.value).toBe('60');
    expect(onCommit).toHaveBeenLastCalledWith(60);
  });

  it('controlado sin onChange: el valor no cambia', () => {
    const { container } = render(<Slider aria-label="C" value={40} />);
    key(inputs(container)[0], 'End');
    expect(inputs(container)[0].value).toBe('40');
  });

  it('sincroniza cambios escritos en el input nativo (tecnologías de apoyo)', () => {
    const onChange = vi.fn();
    render(<Slider aria-label="N" defaultValue={10} onChange={onChange} />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    expect(input.value).toBe('42');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('foco marca el thumb como focused; ref, inputRef, id y props del input', () => {
    const ref = createRef<HTMLSpanElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(<Slider ref={ref} inputRef={inputRef} id="vol" aria-label="F" aria-describedby="help" defaultValue={10} />);
    expect(ref.current).toHaveClass('mtx-slider');
    expect(inputRef.current).toHaveAttribute('id', 'vol');
    expect(inputRef.current).toHaveAttribute('aria-describedby', 'help');
    act(() => inputRef.current!.focus());
    expect(inputRef.current!.parentElement).toHaveClass('mtx-slider__thumb--focused');
    act(() => inputRef.current!.blur());
    expect(inputRef.current!.parentElement).not.toHaveClass('mtx-slider__thumb--focused');
  });
});

describe('Slider · paridad con vanilla', () => {
  it('básico', async () => {
    const vanilla = await mountVanilla('<input type="range" data-mtx="slider" min="0" max="100" value="30" data-label="Volume">');
    const { container } = render(<Slider aria-label="Volume" defaultValue={30} />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('small + color + vertical + label on + formato', async () => {
    const vanilla = await mountVanilla(
      '<input type="range" data-mtx="slider" data-size="small" data-color="warning" data-orientation="vertical" data-value-label-display="on" data-value-label-format="{value} °C" value="40" data-label="T">',
    );
    const { container } = render(
      <Slider aria-label="T" size="small" color="warning" orientation="vertical" valueLabelDisplay="on" valueLabelFormat="{value} °C" defaultValue={40} />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('rango con marcas etiquetadas, track invertido e inset', async () => {
    const vanilla = await mountVanilla(
      '<input type="range" data-mtx="slider" data-range data-value="20,60" data-label="Price" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-track="inverted" data-marks-inset>',
    );
    const { container } = render(
      <Slider aria-label="Price" defaultValue={[20, 60]} marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" track="inverted" marksInset />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('marcas por step, sin track y disabled', async () => {
    const vanilla = await mountVanilla(
      '<input type="range" data-mtx="slider" step="10" value="30" data-marks="true" data-track="false" data-disabled data-label="S">',
    );
    const { container } = render(<Slider aria-label="S" step={10} defaultValue={30} marks track={false} disabled />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});
