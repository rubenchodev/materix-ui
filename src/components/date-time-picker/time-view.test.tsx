import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { createRef, useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { TimeView } from './TimeView';
import type { TimeViewChangeMeta, TimeViewName, TimeViewProps } from './TimeView';

const at = (h: number, m: number, s = 0) => new Date(2026, 9, 20, h, m, s, 0);
const hm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/** Simula el tamaño del reloj (jsdom no hace layout): esfera de 256 px en (0,0). */
const mockClock = (clock: Element) => {
  clock.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 256, height: 256, right: 256, bottom: 256, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
};

const down = (target: Element, x: number, y: number) =>
  fireEvent.pointerDown(target, { button: 0, pointerId: 1, pointerType: 'mouse', clientX: x, clientY: y });
const move = (x: number, y: number) => fireEvent.pointerMove(document, { pointerId: 1, clientX: x, clientY: y });
const up = () => fireEvent.pointerUp(document, { pointerId: 1 });

type Log = Array<{ time: string; view: TimeViewName; done: boolean }>;

/** TimeView controlado con registro de cambios. */
function Harness(props: Partial<TimeViewProps> & { initial?: Date | null; log?: Log; onView?: (v: TimeViewName) => void }) {
  const { initial = at(10, 30), log, onView, ...rest } = props;
  const [value, setValue] = useState<Date | null>(initial);
  return (
    <TimeView
      value={value}
      onChange={(date: Date, meta: TimeViewChangeMeta) => {
        log?.push({ time: hm(date), view: meta.view, done: meta.done });
        setValue(date);
      }}
      onViewChange={onView}
      {...rest}
    />
  );
}

const clockOf = (root: ParentNode) => root.querySelector('.mtx-time-picker__clock') as HTMLElement;
const cards = (root: ParentNode) => Array.from(root.querySelectorAll('.mtx-time-picker__digit-card')) as HTMLElement[];
const numbers = (root: ParentNode) => Array.from(root.querySelectorAll('.mtx-time-picker__number')) as HTMLElement[];

afterEach(() => {
  vi.useRealTimers();
});

describe('TimeView — estructura', () => {
  it('renderiza cabecera, tarjetas y reloj de horas con aguja y números posicionados', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TimeView ref={ref} value={at(10, 30)} onChange={() => {}} className="extra" />);
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('mtx-time-picker', 'extra');
    expect(root.querySelector('.mtx-time-picker__title')!.textContent).toBe('Select time');
    expect(cards(root).map((c) => c.textContent)).toStrictEqual(['10', '30']);
    expect(cards(root)[0]).toHaveClass('mtx-time-picker__digit-card--active');
    expect(cards(root)[0].getAttribute('aria-label')).toBe('Hour 10');
    const clock = clockOf(root);
    expect(clock.getAttribute('role')).toBe('slider');
    expect(clock.getAttribute('aria-valuenow')).toBe('10');
    expect(clock.getAttribute('aria-valuemin')).toBe('0');
    expect(clock.getAttribute('aria-valuemax')).toBe('23');
    expect(clock.getAttribute('aria-valuetext')).toBe('10 hours');
    const hand = root.querySelector('.mtx-time-picker__hand') as HTMLElement;
    expect(hand.style.height).toBe('104px');
    expect(hand.style.transform).toBe('rotate(300deg)');
    expect(numbers(root)).toHaveLength(12);
    expect(parseFloat(numbers(root)[11].style.left)).toBeCloseTo(128);
    expect(numbers(root)[11].style.top).toBe('24px');
    expect(root.querySelector('.mtx-time-picker__number--selected')!.textContent).toBe('10');
    expect(root.querySelector('.mtx-time-picker__ampm-stack')).toBeNull();
  });

  it('con ampm muestra 12 h, AM/PM y aria del slider 1-12', () => {
    const log: Log = [];
    const { container } = render(<Harness ampm initial={at(14, 5)} log={log} />);
    expect(cards(container).map((c) => c.textContent)).toStrictEqual(['02', '05']);
    const clock = clockOf(container);
    expect(clock.getAttribute('aria-valuenow')).toBe('2');
    expect(clock.getAttribute('aria-valuemin')).toBe('1');
    expect(clock.getAttribute('aria-valuetext')).toBe('2 PM hours');
    const [am, pm] = Array.from(container.querySelectorAll('.mtx-time-picker__ampm-opt')) as HTMLButtonElement[];
    expect(pm).toHaveClass('mtx-time-picker__ampm-opt--active');
    expect(pm.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(am);
    expect(log).toStrictEqual([{ time: '02:05', view: 'hours', done: false }]);
    expect(am).toHaveClass('mtx-time-picker__ampm-opt--active');
  });

  it('traduce etiquetas con locale', () => {
    const { container } = render(
      <I18nProvider locale="es">
        <Harness />
      </I18nProvider>,
    );
    expect(container.querySelector('.mtx-time-picker__title')!.textContent).toBe('Seleccionar hora');
  });
});

describe('TimeView — vistas', () => {
  it('las tarjetas cambian de vista y el reloj pasa a minutos', () => {
    const { container } = render(<Harness />);
    fireEvent.click(cards(container)[1]);
    const clock = clockOf(container);
    expect(clock.getAttribute('aria-label')).toBe('Select minutes');
    expect(clock.getAttribute('aria-valuenow')).toBe('30');
    expect(numbers(container).map((n) => n.textContent)[0]).toBe('00');
    expect(container.querySelector('.mtx-time-picker__number--selected')!.textContent).toBe('30');
    expect(cards(container)[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('vista controlada: solo notifica con onViewChange', () => {
    const onView = vi.fn();
    const { container } = render(<Harness view="hours" onView={onView} />);
    fireEvent.click(cards(container)[1]);
    expect(onView).toHaveBeenCalledWith('minutes');
    expect(clockOf(container).getAttribute('aria-label')).toBe('Select hours');
  });

  it('views con segundos añade tarjeta y vista de segundos', () => {
    const { container } = render(<Harness views={['hours', 'minutes', 'seconds']} initial={at(10, 30, 15)} view="seconds" />);
    expect(cards(container).map((c) => c.textContent)).toStrictEqual(['10', '30', '15']);
    expect(container.querySelectorAll('.mtx-time-picker__colon')).toHaveLength(2);
    expect(clockOf(container).getAttribute('aria-label')).toBe('Select seconds');
  });
});

describe('TimeView — arrastre', () => {
  it('cambia la hora durante el arrastre y pasa a minutos una sola vez 200 ms después de soltar', () => {
    vi.useFakeTimers();
    const log: Log = [];
    const onView = vi.fn();
    const { container } = render(<Harness log={log} onView={onView} />);
    const clock = clockOf(container);
    mockClock(clock);
    down(clock, 230, 128); // 3 en punto
    expect(container.querySelector('.mtx-time-picker__hand--dragging')).not.toBeNull();
    for (let i = 0; i < 10; i++) move(230, 130 + i);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onView).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(log).toStrictEqual([{ time: '03:30', view: 'hours', done: false }]);
    expect(cards(container)[0].textContent).toBe('03');

    up();
    expect(container.querySelector('.mtx-time-picker__hand--dragging')).toBeNull();
    expect(log[1]).toStrictEqual({ time: '03:30', view: 'hours', done: true });
    expect(vi.getTimerCount()).toBe(1);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onView).toHaveBeenCalledTimes(1);
    expect(onView).toHaveBeenCalledWith('minutes');
    expect(clockOf(container).getAttribute('aria-label')).toBe('Select minutes');
  });

  it('en minutos la selección es libre y al soltar marca done', () => {
    const log: Log = [];
    const { container } = render(<Harness log={log} view="minutes" />);
    const clock = clockOf(container);
    mockClock(clock);
    // 7 minutos = 42°.
    const rad = ((42 - 90) * Math.PI) / 180;
    down(clock, 128 + 100 * Math.cos(rad), 128 + 100 * Math.sin(rad));
    up();
    expect(log).toStrictEqual([
      { time: '10:07', view: 'minutes', done: false },
      { time: '10:07', view: 'minutes', done: true },
    ]);
  });

  it('minutesStep redondea al paso y minTime/maxTime ignoran opciones deshabilitadas', () => {
    const log: Log = [];
    const { container } = render(
      <Harness log={log} view="minutes" minutesStep={15} minTime={at(10, 20)} />,
    );
    const clock = clockOf(container);
    mockClock(clock);
    const disabled = numbers(container).filter((n) => n.style.color !== '');
    expect(disabled.map((n) => n.textContent)).toStrictEqual(['00', '05', '10', '15', '20', '25', '35', '40', '50', '55']);
    down(clock, 128, 20); // 0 min → deshabilitado
    move(230, 128); // 15 min → < 10:20
    move(128, 230); // 30 min (valor actual: no emite)
    move(20, 128); // 45 min
    up();
    expect(log.map((l) => `${l.time}${l.done ? '!' : ''}`)).toStrictEqual(['10:45', '10:45!']);
  });

  it('pointercancel no avanza de vista y el desmontaje retira listeners y temporizadores', () => {
    vi.useFakeTimers();
    const onView = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { container, unmount } = render(<Harness onView={onView} />);
    const clock = clockOf(container);
    mockClock(clock);
    down(clock, 230, 128);
    fireEvent.pointerCancel(document, { pointerId: 1 });
    expect(vi.getTimerCount()).toBe(0);
    down(clock, 230, 128);
    up();
    expect(vi.getTimerCount()).toBe(1);
    down(clock, 128, 230);
    move(128, 231);
    removeSpy.mockClear();
    unmount();
    expect(removeSpy.mock.calls.map((c) => c[0]).sort()).toStrictEqual(['pointercancel', 'pointermove', 'pointerup']);
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(onView).not.toHaveBeenCalled();
    removeSpy.mockRestore();
  });

  it('readOnly y disabled no cambian el valor', () => {
    const log: Log = [];
    const { container, rerender } = render(<Harness log={log} readOnly />);
    mockClock(clockOf(container));
    down(clockOf(container), 230, 128);
    up();
    fireEvent.keyDown(clockOf(container), { key: 'ArrowUp' });
    rerender(<Harness log={log} disabled ampm />);
    expect(clockOf(container).getAttribute('aria-disabled')).toBe('true');
    expect((container.querySelector('.mtx-time-picker__ampm-opt') as HTMLButtonElement).disabled).toBe(true);
    expect(log).toStrictEqual([]);
  });
});

describe('TimeView — teclado del reloj', () => {
  it('flechas, Inicio/Fin, Enter pasa a minutos y RePág suma 5', () => {
    const log: Log = [];
    const { container } = render(<Harness log={log} autoFocus />);
    const clock = clockOf(container);
    expect(document.activeElement).toBe(clock);
    fireEvent.keyDown(clock, { key: 'ArrowUp' });
    expect(clock.getAttribute('aria-valuenow')).toBe('11');
    fireEvent.keyDown(clock, { key: 'End' });
    expect(cards(container)[0].textContent).toBe('23');
    fireEvent.keyDown(clock, { key: 'Enter' });
    expect(clock.getAttribute('aria-label')).toBe('Select minutes');
    expect(document.activeElement).toBe(clock);
    fireEvent.keyDown(clock, { key: 'ArrowDown' });
    expect(clock.getAttribute('aria-valuetext')).toBe('29 minutes');
    fireEvent.keyDown(clock, { key: 'PageUp' });
    expect(cards(container)[1].textContent).toBe('34');
    fireEvent.keyDown(clock, { key: 'Enter' });
    expect(log.map((l) => `${l.time}${l.done ? '!' : ''}`)).toStrictEqual(['11:30', '23:30', '23:30!', '23:29', '23:34', '23:34!']);
  });

  it('con ampm las flechas recorren 1-12 conservando el período y saltan horas deshabilitadas', () => {
    const { container } = render(<Harness ampm initial={at(13, 0)} maxTime={at(15, 30)} />);
    const clock = clockOf(container);
    fireEvent.keyDown(clock, { key: 'ArrowDown' });
    expect(cards(container)[0].textContent).toBe('12');
    expect(clock.getAttribute('aria-valuetext')).toBe('12 PM hours');
    fireEvent.keyDown(clock, { key: 'ArrowDown' });
    // 11 PM … 4 PM están deshabilitadas: vuelve a 3 PM.
    expect(clock.getAttribute('aria-valuenow')).toBe('3');
  });

  it('minutesStep: las flechas saltan al siguiente múltiplo', () => {
    const { container } = render(<Harness view="minutes" minutesStep={5} initial={at(10, 32)} />);
    const clock = clockOf(container);
    fireEvent.keyDown(clock, { key: 'ArrowUp' });
    expect(clock.getAttribute('aria-valuenow')).toBe('35');
    fireEvent.keyDown(clock, { key: 'End' });
    expect(clock.getAttribute('aria-valuenow')).toBe('55');
  });
});

describe('TimeView — variante digital', () => {
  it('tarjetas editables con etiquetas, avance automático y Enter final con done', () => {
    const log: Log = [];
    const { container } = render(<Harness variant="digital" ampm log={log} autoFocus initial={at(9, 15)} />);
    expect(container.querySelector('.mtx-time-picker__title')!.textContent).toBe('Enter time');
    expect(clockOf(container)).toBeNull();
    const [hour, minute] = Array.from(container.querySelectorAll('.mtx-time-picker__digit-card--input')) as HTMLInputElement[];
    expect(document.activeElement).toBe(hour);
    expect(hour.value).toBe('09');
    expect(Array.from(container.querySelectorAll('.mtx-time-picker__card-label')).map((l) => l.textContent)).toStrictEqual(['Hour', 'Minute']);
    fireEvent.change(hour, { target: { value: '7' } });
    expect(document.activeElement).toBe(minute);
    expect(minute).toHaveClass('mtx-time-picker__digit-card--active');
    fireEvent.change(minute, { target: { value: '7a5' } });
    expect(minute.value).toBe('59');
    fireEvent.keyDown(minute, { key: 'ArrowUp' });
    fireEvent.keyDown(minute, { key: 'Enter' });
    expect(log.map((l) => `${l.time}${l.done ? '!' : ''}`)).toStrictEqual(['07:15', '07:59', '07:00', '07:00!']);
  });

  it('las flechas de la hora recorren el rango y blur rellena con ceros', () => {
    const { container } = render(<Harness variant="digital" initial={at(0, 5)} />);
    const hour = container.querySelector('.mtx-time-picker__digit-card--input') as HTMLInputElement;
    fireEvent.keyDown(hour, { key: 'ArrowDown' });
    expect(hour.value).toBe('23');
    fireEvent.change(hour, { target: { value: '4' } });
    expect(hour.value).toBe('4');
    fireEvent.blur(hour);
    expect(hour.value).toBe('04');
  });
});

describe('TimeView — paridad con vanilla', () => {
  /** Monta un time picker vanilla, lo abre y devuelve su `.mtx-time-picker`. */
  const vanillaTimePicker = async (attrs: string) => {
    const mtx = await loadVanilla();
    const host = await mountVanilla(`<input type="text" data-mtx="time-picker" data-value="10:30" ${attrs}>`);
    const instance = mtx.getInstance(host.querySelector('input')!) as unknown as { open(): void; close(): void };
    instance.open();
    onTestFinished(() => instance.close());
    return document.querySelector('.mtx-time-picker') as HTMLElement;
  };

  it('reloj de 24 h (vista de horas)', async () => {
    const vanilla = await vanillaTimePicker('data-time-view="dial"');
    const { container } = render(<Harness />);
    expectParity(container.firstElementChild, vanilla);
  });

  it('reloj con AM/PM', async () => {
    const vanilla = await vanillaTimePicker('data-time-view="dial" data-ampm="true"');
    const { container } = render(<Harness ampm />);
    expectParity(container.firstElementChild, vanilla);
  });

  it('entrada por teclado (digital)', async () => {
    const vanilla = await vanillaTimePicker('');
    const { container } = render(<Harness variant="digital" />);
    expectParity(container.firstElementChild, vanilla);
  });
});
