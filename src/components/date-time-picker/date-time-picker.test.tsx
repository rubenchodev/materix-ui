import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import {
  DateCalendar,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
  StaticDatePicker,
  TimePicker,
} from './index';
import type { DateRange, DateTimePickerActions, DateTimePickerValue } from './index';

const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const qa = (sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<HTMLElement>(sel));
const day = (key: string) => q<HTMLButtonElement>(`.mtx-date-picker__day[data-date="${key}"]:not(.mtx-date-picker__day--outside)`);
const toggle = (root: ParentNode = document) => q<HTMLButtonElement>('.mtx-text-field__action--end', root);
const input = (root: ParentNode = document) => q<HTMLInputElement>('.mtx-text-field__input', root);
const popover = (root: ParentNode = document) => q('.mtx-picker-popover', root);
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => fireEvent.keyDown(el, { key: k, ...init });

describe('DateCalendar', () => {
  it('renderiza el grid WAI-ARIA con semanas, cabeceras y roving tabindex', () => {
    render(<DateCalendar defaultValue={new Date(2026, 9, 20)} locale="en-US" />);
    expect(q('.mtx-date-picker__grid').getAttribute('role')).toBe('grid');
    expect(qa('.mtx-date-picker__weekday')).toHaveLength(7);
    expect(qa('.mtx-date-picker__week').length).toBeGreaterThanOrEqual(4);
    const focusable = qa('.mtx-date-picker__day[tabindex="0"]');
    expect(focusable).toHaveLength(1);
    expect(focusable[0].getAttribute('data-date')).toBe('2026-10-20');
    expect(focusable[0].getAttribute('aria-selected')).toBe('true');
    expect(focusable[0].getAttribute('aria-label')).toBe('Tuesday, October 20, 2026');
    expect(q('.mtx-date-picker__title--month').textContent).toContain('October');
  });

  it('navega con flechas, Inicio/Fin y RePág/AvPág (con Mayús = año)', () => {
    render(<DateCalendar defaultValue={new Date(2026, 9, 20)} />);
    let cur = day('2026-10-20');
    cur.focus();
    key(cur, 'ArrowRight');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-21');
    key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-28');
    key(document.activeElement!, 'Home');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-25');
    key(document.activeElement!, 'End');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-31');
    key(document.activeElement!, 'PageDown');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-30');
    expect(q('.mtx-date-picker__title--month').textContent).toContain('November');
    key(document.activeElement!, 'PageUp', { shiftKey: true });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2025-11-30');
    cur = document.activeElement as HTMLButtonElement;
    expect(cur.getAttribute('tabindex')).toBe('0');
  });

  it('salta días deshabilitados por min/max y shouldDisableDate', () => {
    const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    render(
      <DateCalendar
        defaultValue={new Date(2026, 9, 23)}
        minDate={new Date(2026, 9, 5)}
        maxDate={new Date(2026, 9, 28)}
        shouldDisableDate={weekend}
      />,
    );
    expect(day('2026-10-04').disabled).toBe(true);
    expect(day('2026-10-24').getAttribute('aria-disabled')).toBe('true');
    expect(day('2026-10-24').classList.contains('mtx-date-picker__day--disabled')).toBe(true);
    const fri = day('2026-10-23');
    fri.focus();
    key(fri, 'ArrowRight');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-26');
  });

  it('abre las vistas de meses y años (radiogroup) y vuelve a días', () => {
    const onViewChange = vi.fn();
    render(<DateCalendar defaultValue={new Date(2026, 9, 20)} onViewChange={onViewChange} />);
    fireEvent.click(q('.mtx-date-picker__title--month'));
    expect(onViewChange).toHaveBeenLastCalledWith('month');
    const months = q('.mtx-date-picker__months');
    expect(months.getAttribute('role')).toBe('radiogroup');
    expect(q('.mtx-date-picker__month--selected').getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(q('.mtx-date-picker__month--selected'));
    key(document.activeElement!, 'ArrowUp');
    expect(document.activeElement?.textContent).toBe('Jul');
    key(document.activeElement!, 'Enter');
    expect(q('.mtx-date-picker__title--month').textContent).toContain('July');
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-07-01');
    fireEvent.click(q('.mtx-date-picker__title--year'));
    const years = qa('.mtx-date-picker__year');
    expect(years[0].textContent).toBe('1900');
    fireEvent.click(years.find((y) => y.textContent === '2030')!);
    expect(q('.mtx-date-picker__title--year').textContent).toContain('2030');
  });

  it('selecciona un rango con vista previa en hover', () => {
    const onRangeChange = vi.fn();
    render(<DateCalendar range month={new Date(2026, 9, 1)} onRangeChange={onRangeChange} />);
    fireEvent.click(day('2026-10-10'));
    expect(onRangeChange).toHaveBeenLastCalledWith({ start: new Date(2026, 9, 10), end: null }, { complete: false });
    fireEvent.mouseEnter(day('2026-10-14'));
    expect(day('2026-10-12').classList.contains('mtx-date-picker__day--range-preview')).toBe(true);
    expect(day('2026-10-12').parentElement!.classList.contains('mtx-date-picker__day-cell--range-preview')).toBe(true);
    fireEvent.click(day('2026-10-05'));
    const [range, meta] = onRangeChange.mock.calls.at(-1)!;
    expect(meta).toEqual({ complete: true });
    expect((range as DateRange).start!.getDate()).toBe(5);
    expect((range as DateRange).end!.getDate()).toBe(10);
    expect(day('2026-10-05').classList.contains('mtx-date-picker__day--range-start')).toBe(true);
    expect(day('2026-10-07').classList.contains('mtx-date-picker__day--in-range')).toBe(true);
    expect(day('2026-10-10').parentElement!.classList.contains('mtx-date-picker__day-cell--range-end')).toBe(true);
  });

  it('localiza nombres con Intl para locales no registrados', () => {
    render(<DateCalendar defaultValue={new Date(2026, 9, 20)} locale="fr-FR" />);
    expect(q('.mtx-date-picker__title--month').textContent).toContain('Octobre');
    expect(day('2026-10-20').getAttribute('aria-label')).toBe('mardi 20 octobre 2026');
  });

  it('paridad de DOM del calendario con vanilla', async () => {
    const vanilla = await mountVanilla('<div data-mtx="date-picker" data-static data-locale="en" data-value="2020-03-15"></div>');
    const { container } = render(<StaticDatePicker defaultValue="2020-03-15" locale="en" />);
    expectParity(q('.mtx-date-picker', container), q('.mtx-date-picker', vanilla), { attributes: ['tabindex', 'data-date'] });
    expectParity(q('.mtx-picker-header', container), q('.mtx-picker-header', vanilla), { attributes: ['tabindex'] });
  });
});

describe('DatePicker', () => {
  it('construye el TextField con máscara, icono y botón accesible', () => {
    render(<DatePicker label="Delivery" defaultValue="2026-10-20" locale="en-US" />);
    expect(input().value).toBe('10/20/2026');
    const btn = toggle();
    expect(btn.querySelector('.material-icons')?.textContent).toBe('event');
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Choose date, selected: 10/20/2026');
    expect(q('.mtx-text-field').classList.contains('mtx-text-field--has-value')).toBe(true);
  });

  it('abre con el botón, enfoca el día seleccionado y elige con teclado', () => {
    const onChange = vi.fn();
    const onAccept = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(
      <DatePicker label="Date" defaultValue="2026-10-20" onChange={onChange} onAccept={onAccept} onOpen={onOpen} onClose={onClose} />,
    );
    fireEvent.click(toggle());
    expect(onOpen).toHaveBeenCalledTimes(1);
    const pop = popover();
    expect(pop.classList.contains('mtx-picker-popover--open')).toBe(true);
    expect(pop.getAttribute('role')).toBe('dialog');
    expect(pop.getAttribute('aria-label')).toBe('Choose date');
    expect(pop.parentElement!.classList.contains('mtx-text-field')).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(toggle().getAttribute('aria-controls')).toBe(pop.id);
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-20');
    key(document.activeElement!, 'ArrowRight');
    key(document.activeElement!, 'Enter');
    expect(onChange).toHaveBeenCalledTimes(1);
    const [value, detail] = onChange.mock.calls[0];
    expect((value as Date).getDate()).toBe(21);
    expect(detail.value).toBe('10/21/2026');
    expect(detail.isRange).toBe(false);
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('select');
    expect(input().value).toBe('10/21/2026');
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
    expect(document.activeElement).toBe(input());
  });

  it('Escape cierra y devuelve el foco; clic en el campo abre sin mover el foco', () => {
    render(<DatePicker label="Date" />);
    input().focus();
    fireEvent.click(input());
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(true);
    expect(document.activeElement).toBe(input());
    key(input(), 'ArrowDown');
    expect(document.activeElement?.classList.contains('mtx-date-picker__day')).toBe(true);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
    expect(document.activeElement).toBe(input());
  });

  it('Alt+↓ abre y Cancelar cierra sin aplicar', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" onChange={onChange} />);
    key(input(), 'ArrowDown', { altKey: true });
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(true);
    const cancel = qa('.mtx-picker-actions .mtx-button').find((b) => b.textContent === 'Cancel')!;
    fireEvent.click(cancel);
    expect(onChange).not.toHaveBeenCalled();
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
  });

  it('cierra con clic fuera', () => {
    render(
      <>
        <DatePicker label="Date" />
        <button type="button" id="outside">x</button>
      </>,
    );
    fireEvent.click(toggle());
    fireEvent.mouseDown(q('#outside'));
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
  });

  it('Hoy aplica la fecha actual y cierra', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" onChange={onChange} />);
    fireEvent.click(toggle());
    fireEvent.click(q('[data-focus-key="today"]'));
    const value = onChange.mock.calls[0][0] as Date;
    expect(value.toDateString()).toBe(new Date().toDateString());
  });

  it('disabled y readOnly bloquean el botón y la apertura', () => {
    const { rerender } = render(<DatePicker label="Date" disabled />);
    expect(toggle().disabled).toBe(true);
    fireEvent.click(input());
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
    rerender(<DatePicker label="Date" readOnly />);
    expect(toggle().disabled).toBe(true);
    expect(toggle().getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(input());
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
  });

  it('formato y locale con región: es-MX → DD/MM/YYYY y textos en español', () => {
    render(<DatePicker label="Fecha" defaultValue="2026-10-20" locale="es-MX" />);
    expect(input().value).toBe('20/10/2026');
    fireEvent.click(toggle());
    expect(popover().getAttribute('aria-label')).toBe('Elegir fecha');
    expect(day('2026-10-20').getAttribute('aria-label')).toBe('martes, 20 de octubre de 2026');
  });

  it('formato personalizado, escritura y onChange al completar la máscara', () => {
    const onChange = vi.fn();
    render(<DatePicker label="ISO" format="YYYY-MM-DD" onChange={onChange} name="due" />);
    expect(input().getAttribute('name')).toBe('due');
    fireEvent.change(input(), { target: { value: '2026-12-2' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input(), { target: { value: '2026-12-24' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as Date).getMonth()).toBe(11);
    fireEvent.change(input(), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null, expect.objectContaining({ value: '' }));
  });

  it('modo controlado: el valor externo actualiza el campo', () => {
    function Controlled() {
      const [value, setValue] = useState<DateTimePickerValue>(new Date(2026, 0, 5));
      return (
        <>
          <DatePicker label="Date" value={value as Date} onChange={setValue} locale="en-US" />
          <button type="button" id="set" onClick={() => setValue(new Date(2026, 11, 25))}>set</button>
        </>
      );
    }
    render(<Controlled />);
    expect(input().value).toBe('01/05/2026');
    fireEvent.click(q('#set'));
    expect(input().value).toBe('12/25/2026');
  });

  it('modal: backdrop en body, aria-modal y trampa de Tab', () => {
    render(<DatePicker label="Date" display="modal" defaultValue="2026-10-20" />);
    fireEvent.click(toggle());
    const backdrop = q('body > .mtx-picker-backdrop');
    expect(backdrop.classList.contains('mtx-picker-backdrop--open')).toBe(true);
    const dialog = q('.mtx-picker-dialog', backdrop);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(q('.mtx-picker-header', dialog)).toBeTruthy();
    const ok = qa('.mtx-picker-actions .mtx-button', dialog).at(-1)!;
    ok.focus();
    key(ok, 'Tab');
    expect(dialog.contains(document.activeElement)).toBe(true);
    // En modal elegir un día no cierra.
    fireEvent.click(day('2026-10-22'));
    expect(backdrop.classList.contains('mtx-picker-backdrop--open')).toBe(true);
    fireEvent.click(backdrop);
    expect(backdrop.classList.contains('mtx-picker-backdrop--open')).toBe(false);
  });

  it('acciones imperativas open/close/clear', () => {
    const action = createRef<DateTimePickerActions>();
    const onChange = vi.fn();
    render(<DatePicker label="Date" defaultValue="2026-10-20" action={action} onChange={onChange} />);
    act(() => action.current!.open());
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(true);
    act(() => action.current!.close());
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
    act(() => action.current!.clear());
    expect(input().value).toBe('');
    expect(onChange).toHaveBeenLastCalledWith(null, expect.objectContaining({ value: '', iso: null }));
  });

  it('solo un picker abierto a la vez', () => {
    const { container } = render(
      <>
        <div id="a"><DatePicker label="A" /></div>
        <div id="b"><DatePicker label="B" /></div>
      </>,
    );
    fireEvent.click(toggle(q('#a', container)));
    fireEvent.click(toggle(q('#b', container)));
    expect(popover(q('#a', container)).classList.contains('mtx-picker-popover--open')).toBe(false);
    expect(popover(q('#b', container)).classList.contains('mtx-picker-popover--open')).toBe(true);
  });
});

describe('TimePicker y DateTimePicker', () => {
  it('TimePicker usa máscara de hora, icono schedule y emite al pulsar OK', () => {
    const onChange = vi.fn();
    render(<TimePicker label="Time" defaultValue="07:30" onChange={onChange} />);
    expect(input().value).toBe('07:30');
    expect(toggle().querySelector('.material-icons')?.textContent).toBe('schedule');
    fireEvent.click(toggle());
    expect(q('.mtx-time-picker')).toBeTruthy();
    expect(q('.mtx-picker-icon-btn').getAttribute('aria-label')).toBe('Switch to clock view');
    fireEvent.click(q('.mtx-picker-icon-btn'));
    expect(q('.mtx-time-picker__clock')).toBeTruthy();
    fireEvent.click(qa('.mtx-picker-actions .mtx-button').at(-1)!);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)![1].time).toBe('07:30');
  });

  it('AM/PM por formato', () => {
    render(<TimePicker label="Time" ampm defaultValue="19:05" />);
    expect(input().value).toBe('07:05 PM');
  });

  it('DateTimePicker: pestañas, día → hora y valor con hora', () => {
    const onChange = vi.fn();
    render(<DateTimePicker label="Meeting" defaultValue="2026-10-20 14:30" onChange={onChange} locale="en-US" />);
    expect(input().value).toBe('10/20/2026 14:30');
    expect(toggle().querySelector('.material-icons')?.textContent).toBe('calendar_month');
    fireEvent.click(toggle());
    const tabs = qa('[role="tab"]');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(day('2026-10-22'));
    expect(onChange).not.toHaveBeenCalled();
    expect(qa('[role="tab"]')[1].getAttribute('aria-selected')).toBe('true');
    expect(q('.mtx-time-picker')).toBeTruthy();
    fireEvent.click(qa('.mtx-picker-actions .mtx-button').at(-1)!);
    const [value, detail] = onChange.mock.calls.at(-1)!;
    expect((value as Date).getDate()).toBe(22);
    expect((value as Date).getHours()).toBe(14);
    expect(detail.value).toBe('10/22/2026 14:30');
    expect(input().value).toBe('10/22/2026 14:30');
  });

  it('pestañas con flechas (WAI-ARIA Tabs)', () => {
    render(<DateTimePicker label="Meeting" />);
    fireEvent.click(toggle());
    const [dateTab] = qa('[role="tab"]');
    dateTab.focus();
    key(dateTab, 'ArrowRight');
    expect(qa('[role="tab"]')[1].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(qa('[role="tab"]')[1]);
  });
});

describe('Rangos', () => {
  it('DateRangePicker: dos clics, separador y cierre', () => {
    const onChange = vi.fn();
    render(<DateRangePicker label="Stay" defaultValue="2026-07-01 - 2026-07-15" onChange={onChange} locale="en-US" />);
    expect(input().value).toBe('07/01/2026 - 07/15/2026');
    fireEvent.click(toggle());
    fireEvent.click(day('2026-07-20'));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(day('2026-07-25'));
    const [value, detail] = onChange.mock.calls[0];
    expect((value as DateRange).start!.getDate()).toBe(20);
    expect((value as DateRange).end!.getDate()).toBe(25);
    expect(detail.isRange).toBe(true);
    expect(detail.value).toBe('07/20/2026 - 07/25/2026');
    expect(popover().classList.contains('mtx-picker-popover--open')).toBe(false);
  });

  it('DateTimeRangePicker: fechas → pestañas Inicio/Fin con horas', () => {
    const onChange = vi.fn();
    render(<DateTimeRangePicker label="Window" onChange={onChange} />);
    fireEvent.click(toggle());
    const now = new Date();
    const k = (d: number) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    fireEvent.click(day(k(10)));
    fireEvent.click(day(k(12)));
    const tabs = qa('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].textContent).toContain('09:00 AM');
    expect(tabs[2].textContent).toContain('06:00 PM');
    const [value] = onChange.mock.calls.at(-1)!;
    expect((value as DateRange).start!.getHours()).toBe(9);
    expect((value as DateRange).end!.getHours()).toBe(18);
    fireEvent.click(tabs[2]);
    expect(qa('[role="tab"]')[2].getAttribute('aria-selected')).toBe('true');
  });
});

describe('Estático', () => {
  it('StaticDatePicker: role group, cabecera, sin Cancel/OK y emite en cada elección', () => {
    const onChange = vi.fn();
    const { container } = render(<StaticDatePicker defaultValue="2026-10-20" onChange={onChange} />);
    const root = q('.mtx-picker-static', container);
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('aria-label')).toBe('Choose date');
    expect(q('.mtx-picker-header', root)).toBeTruthy();
    expect(qa('.mtx-picker-actions .mtx-button', root).map((b) => b.textContent)).toEqual(['Today']);
    fireEvent.click(day('2026-10-21'));
    fireEvent.click(day('2026-10-23'));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('estático deshabilitado: aria-disabled e inert', () => {
    const { container } = render(<StaticDatePicker disabled />);
    const root = q('.mtx-picker-static', container);
    expect(root.getAttribute('aria-disabled')).toBe('true');
    expect(root.hasAttribute('inert')).toBe(true);
    expect(root.classList.contains('mtx-picker-static--disabled')).toBe(true);
  });
});
