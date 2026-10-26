import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { Rating, roundRatingValue } from './index';

/** Simula un clic de puntero (pointerdown en el contenedor + click en el radio). */
const pointerClick = (input: HTMLElement) => {
  fireEvent.pointerDown(input.closest('.mtx-rating')!);
  fireEvent.click(input);
};

describe('Rating', () => {
  it('construye 5 estrellas con radios ocultos, etiquetas y radio vacío', () => {
    const { container } = render(<Rating defaultValue={3} name="score" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('mtx-rating');
    expect(root.querySelectorAll('.mtx-rating__item')).toHaveLength(5);
    const inputs = root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(inputs).toHaveLength(6);
    inputs.forEach((input) => expect(input.name).toBe('score'));
    expect(root.querySelector<HTMLInputElement>('input[value="3"]')!.checked).toBe(true);
    expect(root.querySelector('label[for="score-1"]')).toHaveTextContent('1 Star');
    expect(root.querySelector('label[for="score-3"]')).toHaveTextContent('3 Stars');
    expect(root.querySelector('label[for="score-empty"]')).toHaveTextContent('Empty');
    expect(root.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(3);
    expect(root.querySelector('svg')).not.toBeNull();
  });

  it('paridad DOM con vanilla (interactivo con nombre accesible)', async () => {
    const vanilla = await mountVanilla('<span data-mtx="rating" data-value="3" data-name="p" aria-label="Quality"></span>');
    const { container } = render(<Rating defaultValue={3} name="p" aria-label="Quality" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['for', 'name', 'value', 'data-rating-value'] });
  });

  it('paridad DOM con vanilla (precisión 0.5, tamaño, iconos)', async () => {
    const vanilla = await mountVanilla(
      '<span data-mtx="rating" data-value="2.5" data-precision="0.5" data-size="large" data-icon="favorite" data-name="h" data-label="Likes"></span>',
    );
    const { container } = render(<Rating defaultValue={2.5} precision={0.5} size="large" icon="favorite" name="h" label="Likes" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, { attributes: ['for', 'data-rating-value'] });
  });

  it('paridad DOM con vanilla (read-only y disabled)', async () => {
    const ro = await mountVanilla('<span data-mtx="rating" data-value="4" data-read-only></span>');
    const { container } = render(<Rating value={4} readOnly />);
    expectParity(container.firstElementChild, ro.firstElementChild);
    const dis = await mountVanilla('<span data-mtx="rating" data-value="2" data-disabled data-name="d"></span>');
    const { container: c2 } = render(<Rating defaultValue={2} disabled name="d" />);
    expectParity(c2.firstElementChild, dis.firstElementChild);
  });

  it('cambia con el radio nativo y llama a onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Rating defaultValue={2} onChange={onChange} />);
    await user.click(container.querySelector('input[value="4"]')!);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 4);
    expect(container.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(4);
  });

  it('un clic de puntero sobre el valor actual lo borra (null)', () => {
    const onChange = vi.fn();
    const { container } = render(<Rating defaultValue={3} onChange={onChange} />);
    pointerClick(container.querySelector('input[value="3"]')!);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), null);
    expect(container.querySelector<HTMLInputElement>('.mtx-rating__input--empty')!.checked).toBe(true);
    expect(container.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(0);
  });

  it('controlado: refleja el estado del padre', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<number | null>(1);
      return (
        <>
          <Rating value={value} onChange={(_, next) => setValue(next)} aria-label="C" />
          <span data-testid="state">{String(value)}</span>
        </>
      );
    }
    const { container } = render(<Controlled />);
    await user.click(container.querySelector('input[value="5"]')!);
    expect(screen.getByTestId('state')).toHaveTextContent('5');
    expect(container.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(5);
  });

  it('teclado: flechas entre radios nativos', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Rating defaultValue={2} onChange={onChange} aria-label="K" />);
    container.querySelector<HTMLInputElement>('input[value="2"]')!.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 3);
  });

  it('precisión 0.5: dos radios por estrella, parciales y redondeo', () => {
    const { container } = render(<Rating defaultValue={2.4} precision={0.5} name="half" />);
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(11);
    const partial = container.querySelectorAll<HTMLElement>('.mtx-rating__label--partial');
    expect(partial).toHaveLength(5);
    expect(partial[0].style.width).toBe('50%');
    expect(container.querySelector<HTMLInputElement>('input[value="2.5"]')!.checked).toBe(true);
    expect(container.querySelector('label[for="half-2_5"]')).toHaveTextContent('2.5 Stars');
  });

  it('read-only: role="img", aria-label y sin radios', () => {
    const { container, rerender } = render(<Rating value={4} readOnly />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('role', 'img');
    expect(root).toHaveAttribute('aria-label', 'Rated 4 out of 5');
    expect(root.querySelectorAll('input')).toHaveLength(0);
    rerender(<Rating value={2} readOnly />);
    expect(root).toHaveAttribute('aria-label', 'Rated 2 out of 5');
  });

  it('i18n: etiquetas en español por contexto y por prop locale', () => {
    const { container } = render(
      <I18nProvider locale="es">
        <Rating defaultValue={1} name="es" />
        <Rating value={3.5} precision={0.5} readOnly />
      </I18nProvider>,
    );
    expect(container.querySelector('label[for="es-1"]')).toHaveTextContent('1 estrella');
    expect(container.querySelector('label[for="es-empty"]')).toHaveTextContent('Sin valoración');
    expect(container.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'Valoración: 3,5 de 5');
    const { container: c2 } = render(<Rating defaultValue={2} name="lp" locale="es" />);
    expect(c2.querySelector('label[for="lp-2"]')).toHaveTextContent('2 estrellas');
  });

  it('getLabelText y emptyLabelText personalizados', () => {
    const { container } = render(<Rating name="g" getLabelText={(v) => `${v} hearts`} emptyLabelText="None" />);
    expect(container.querySelector('label[for="g-4"]')).toHaveTextContent('4 hearts');
    expect(container.querySelector('label[for="g-empty"]')).toHaveTextContent('None');
  });

  it('max, size, iconos personalizados y highlightSelectedOnly', () => {
    const { container } = render(
      <>
        <Rating max={10} defaultValue={6} size="large" icon="favorite" emptyIcon="favorite_border" highlightSelectedOnly />
        <Rating icon="sentiment_satisfied" size="small" />
        <Rating icon={<b data-testid="custom">*</b>} />
      </>,
    );
    const [hearts, faces] = container.querySelectorAll('.mtx-rating');
    expect(hearts).toHaveClass('mtx-rating--large');
    expect(hearts.querySelectorAll('.mtx-rating__item')).toHaveLength(10);
    expect(hearts.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(1);
    expect(faces).toHaveClass('mtx-rating--small');
    expect(faces.querySelector('.material-icons')).toHaveTextContent('sentiment_satisfied');
    expect(screen.getAllByTestId('custom').length).toBe(10);
  });

  it('disabled: radios deshabilitados, aria-disabled; role radiogroup con label', () => {
    const { container } = render(<Rating defaultValue={2} disabled label="Quality" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('role', 'radiogroup');
    expect(root).toHaveAttribute('aria-label', 'Quality');
    expect(root).toHaveAttribute('aria-disabled', 'true');
    expect(root).toHaveClass('mtx-rating--disabled');
    root.querySelectorAll('input').forEach((input) => expect(input).toBeDisabled());
  });

  it('hover: vista previa, item activo y onChangeActive; foco también lo notifica', () => {
    const onChangeActive = vi.fn();
    const { container } = render(<Rating defaultValue={1} onChangeActive={onChangeActive} />);
    const root = container.firstElementChild as HTMLElement;
    const items = root.querySelectorAll<HTMLElement>('.mtx-rating__item');
    items.forEach((item, i) => {
      item.getBoundingClientRect = () => ({ left: i * 24, right: i * 24 + 24, width: 24, top: 0, bottom: 24, height: 24, x: i * 24, y: 0, toJSON: () => ({}) });
    });
    fireEvent.pointerMove(root, { clientX: 80, pointerType: 'mouse' });
    expect(onChangeActive).toHaveBeenLastCalledWith(expect.anything(), 4);
    expect(root).toHaveClass('mtx-rating--hovering');
    expect(items[3]).toHaveClass('mtx-rating__item--active');
    expect(root.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(4);
    fireEvent.pointerLeave(root);
    expect(onChangeActive).toHaveBeenLastCalledWith(expect.anything(), null);
    expect(root.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(1);
    act(() => root.querySelector<HTMLInputElement>('input[value="2"]')!.focus());
    expect(onChangeActive).toHaveBeenLastCalledWith(expect.anything(), 2);
    act(() => root.querySelector<HTMLInputElement>('input[value="2"]')!.blur());
    expect(onChangeActive).toHaveBeenLastCalledWith(expect.anything(), null);
  });

  it('form.reset() restaura defaultValue en modo no controlado', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Rating defaultValue={3} name="r" aria-label="R" />
      </form>,
    );
    await user.click(container.querySelector('input[value="5"]')!);
    expect(container.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(5);
    act(() => container.querySelector('form')!.reset());
    expect(container.querySelectorAll('.mtx-rating__label--filled')).toHaveLength(3);
    expect(container.querySelector<HTMLInputElement>('input[value="3"]')!.checked).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[value="5"]')!.checked).toBe(false);
  });

  it('read-only respeta el aria-label explícito', () => {
    const { container } = render(<Rating value={4} readOnly aria-label="Average: 4 stars" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Average: 4 stars');
    expect(container.firstElementChild).toHaveAttribute('role', 'img');
  });

  it('roundRatingValue: redondea, acota y 0 vacía', () => {
    expect(roundRatingValue(9, 1, 5)).toBe(5);
    expect(roundRatingValue(2.4, 1, 5)).toBe(2);
    expect(roundRatingValue(0, 1, 5)).toBe(null);
    expect(roundRatingValue(2.3, 0.25, 5)).toBe(2.25);
  });

  it('ref, className, style y name generado único', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <>
        <Rating ref={ref} className="extra" style={{ margin: 4 }} />
        <Rating />
      </>,
    );
    expect(ref.current).toHaveClass('mtx-rating', 'extra');
    expect(ref.current!.style.margin).toBe('4px');
    const [a, b] = container.querySelectorAll<HTMLInputElement>('.mtx-rating__input--empty');
    expect(a.name).toMatch(/^mtx-rating-/);
    expect(a.name).not.toBe(b.name);
  });

  it('desmontar cancela el temporizador del clic de puntero', () => {
    vi.useFakeTimers();
    try {
      const { container, unmount } = render(<Rating defaultValue={2} />);
      fireEvent.pointerDown(container.firstElementChild!);
      expect(vi.getTimerCount()).toBe(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
