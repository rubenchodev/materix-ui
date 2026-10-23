import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { DateTimePicker } from '../src/components/date-time-picker/date-time-picker.js';
import { setLocale, resetLocale } from '../src/i18n/index.js';

/**
 * Crea un picker de campo a partir de atributos y lo inicializa.
 * @param {Record<string,string>} attrs Atributos del input.
 * @returns {{input: HTMLInputElement, picker: DateTimePicker}}
 */
function mount(attrs) {
  const input = document.createElement('input');
  input.type = 'text';
  Object.entries(attrs).forEach(([k, v]) => input.setAttribute(k, v));
  document.body.appendChild(input);
  initAll();
  return { input, picker: getInstance(input) };
}

/** Despacha una tecla sobre el elemento enfocado (o el indicado). */
function press(key, opts = {}, target = document.activeElement) {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts });
  target.dispatchEvent(ev);
  return ev;
}

const focusedDate = () => document.activeElement && document.activeElement.getAttribute('data-date');

describe('DateTimePicker — accesibilidad, teclado y deuda técnica', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  afterEach(() => {
    DateTimePicker.closeAll();
  });

  describe('Patrón Date Picker Dialog', () => {
    it('el icono final es un botón accesible que abre un role="dialog" y enfoca el día seleccionado', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      const toggle = picker._getToggleButton();
      expect(toggle.tagName).toBe('BUTTON');
      expect(toggle.getAttribute('aria-haspopup')).toBe('dialog');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.getAttribute('aria-label')).toContain('Choose date');

      toggle.focus();
      toggle.click();
      expect(picker._isOpen).toBe(true);
      const dialog = picker._popover;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-label')).toBe('Choose date');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.getAttribute('aria-controls')).toBe(dialog.id);
      expect(focusedDate()).toBe('2026-10-20');
    });

    it('sin valor, el foco inicial va al día de hoy', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker' });
      picker.open();
      const today = new Date();
      const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(focusedDate()).toBe(key);
    });

    it('abrir por clic en el campo no roba el foco (se puede seguir escribiendo)', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker' });
      input.focus();
      input.click();
      expect(picker._isOpen).toBe(true);
      expect(document.activeElement).toBe(input);
      // ↓ con el picker abierto entra en el grid
      press('ArrowDown', {}, input);
      expect(document.activeElement.getAttribute('role')).toBe('gridcell');
    });

    it('Alt+↓ en el campo abre el picker con foco en el grid', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      input.focus();
      press('ArrowDown', { altKey: true }, input);
      expect(picker._isOpen).toBe(true);
      expect(focusedDate()).toBe('2026-10-20');
    });

    it('Escape cierra y devuelve el foco al botón que lo abrió', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker' });
      const toggle = picker._getToggleButton();
      toggle.focus();
      toggle.click();
      press('Escape');
      expect(picker._isOpen).toBe(false);
      expect(document.activeElement).toBe(toggle);
    });

    it('en modo modal: aria-modal, foco inicial dentro y trampa de foco con Tab', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-display': 'modal', 'data-value': '2026-10-20' });
      picker.open({ focus: false }); // el modal enfoca siempre
      const dialog = picker._dialog;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.contains(document.activeElement)).toBe(true);

      const tabbables = Array.from(dialog.querySelectorAll('button:not([disabled]), [tabindex]'))
        .filter((el) => el.getAttribute('tabindex') !== '-1');
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      last.focus();
      const ev = press('Tab', {}, last);
      expect(ev.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);
      first.focus();
      press('Tab', { shiftKey: true }, first);
      expect(document.activeElement).toBe(last);

      press('Escape');
      expect(picker._isOpen).toBe(false);
    });
  });

  describe('Calendario como grid', () => {
    it('expone role="grid", filas, cabeceras y días con aria-label, aria-selected y aria-current', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      picker.open();
      const grid = picker._popover.querySelector('[role="grid"]');
      expect(grid).not.toBeNull();
      expect(grid.getAttribute('aria-labelledby')).toBeTruthy();
      expect(document.getElementById(grid.getAttribute('aria-labelledby')).textContent).toContain('October');
      expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(7);
      const rows = grid.querySelectorAll('[role="rowgroup"] > [role="row"]');
      expect(rows.length).toBeGreaterThanOrEqual(5);
      rows.forEach((row) => expect(row.querySelectorAll('[role="gridcell"]').length).toBe(7));

      const selected = grid.querySelector('[data-date="2026-10-20"]:not(.mtx-date-picker__day--outside)');
      expect(selected.getAttribute('aria-label')).toBe('Tuesday, October 20, 2026');
      expect(selected.getAttribute('aria-selected')).toBe('true');
      expect(grid.querySelectorAll('[tabindex="0"]').length).toBe(1);

      picker.setDate(new Date());
      const today = picker._popover.querySelector('.mtx-date-picker__day--today');
      expect(today.getAttribute('aria-current')).toBe('date');
    });

    it('marca aria-disabled en los días fuera de min/max', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-min': '2026-10-10', 'data-max': '2026-10-25', 'data-value': '2026-10-20' });
      picker.open();
      const day9 = picker._popover.querySelector('[data-date="2026-10-09"]');
      const day26 = picker._popover.querySelector('[data-date="2026-10-26"]');
      expect(day9.getAttribute('aria-disabled')).toBe('true');
      expect(day26.getAttribute('aria-disabled')).toBe('true');
      expect(picker._popover.querySelector('[data-date="2026-10-15"]').hasAttribute('aria-disabled')).toBe(false);
    });

    it('navega con flechas, Inicio/Fin, RePág/AvPág y Mayús+RePág/AvPág con roving tabindex', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      picker.open();
      expect(focusedDate()).toBe('2026-10-20');
      press('ArrowRight'); expect(focusedDate()).toBe('2026-10-21');
      press('ArrowDown'); expect(focusedDate()).toBe('2026-10-28');
      press('ArrowLeft'); expect(focusedDate()).toBe('2026-10-27');
      press('ArrowUp'); expect(focusedDate()).toBe('2026-10-20');
      press('Home'); expect(focusedDate()).toBe('2026-10-18'); // domingo
      press('End'); expect(focusedDate()).toBe('2026-10-24'); // sábado
      press('PageDown'); expect(focusedDate()).toBe('2026-11-24');
      expect(picker._viewDate.getMonth()).toBe(10);
      press('PageUp'); expect(focusedDate()).toBe('2026-10-24');
      press('PageDown', { shiftKey: true }); expect(focusedDate()).toBe('2027-10-24');
      press('PageUp', { shiftKey: true }); expect(focusedDate()).toBe('2026-10-24');
      // Cruce de mes con flechas
      press('ArrowDown'); press('ArrowDown'); expect(focusedDate()).toBe('2026-11-07');
      expect(picker._popover.querySelectorAll('.mtx-date-picker__day[tabindex="0"]').length).toBe(1);
    });

    it('Enter y Espacio seleccionan el día enfocado', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      picker.open();
      press('ArrowRight');
      press('Enter');
      expect(picker._isOpen).toBe(false);
      expect(input.value).toBe('10/21/2026');
      expect(document.activeElement).toBe(input);

      picker.open();
      press('ArrowLeft');
      press(' ');
      expect(input.value).toBe('10/20/2026');
    });

    it('salta los días deshabilitados y no sale de los límites', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-min': '2026-10-15', 'data-value': '2026-10-15' });
      picker.open();
      press('ArrowLeft');
      expect(focusedDate()).toBe('2026-10-15');
      press('ArrowUp');
      expect(focusedDate()).toBe('2026-10-15');
    });

    it('los selectores de año y mes son radiogroups navegables por teclado', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      picker.open();
      const yearTitle = picker._popover.querySelector('.mtx-date-picker__title--year');
      yearTitle.focus();
      yearTitle.click();
      expect(picker._currentView).toBe('years');
      expect(picker._popover.querySelector('[role="radiogroup"]')).not.toBeNull();
      expect(document.activeElement.textContent).toBe('2026');
      expect(document.activeElement.getAttribute('aria-checked')).toBe('true');
      press('ArrowRight');
      expect(document.activeElement.textContent).toBe('2027');
      press('ArrowDown');
      expect(document.activeElement.textContent).toBe('2030');
      press('Enter');
      expect(picker._currentView).toBe('calendar');
      expect(picker._viewDate.getFullYear()).toBe(2030);
      expect(document.activeElement.getAttribute('role')).toBe('gridcell');

      const monthTitle = picker._popover.querySelector('.mtx-date-picker__title--month');
      monthTitle.focus();
      monthTitle.click();
      expect(document.activeElement.getAttribute('role')).toBe('radio');
      press('ArrowLeft');
      press('Enter');
      expect(picker._viewDate.getMonth()).toBe(8);
    });
  });

  describe('Reloj accesible', () => {
    it('es un slider con aria-valuetext; las flechas cambian hora y minutos', () => {
      const { input, picker } = mount({ 'data-mtx': 'time-picker', 'data-time-view': 'dial', 'data-value': '10:30' });
      picker.open();
      const clock = picker._popover.querySelector('.mtx-time-picker__clock');
      expect(clock.getAttribute('role')).toBe('slider');
      expect(clock.getAttribute('aria-valuenow')).toBe('10');
      expect(clock.getAttribute('aria-valuetext')).toBe('10 hours');
      expect(document.activeElement).toBe(clock);

      press('ArrowUp');
      expect(input.value).toBe('11:30');
      const clock2 = picker._popover.querySelector('.mtx-time-picker__clock');
      expect(document.activeElement).toBe(clock2);
      expect(clock2.getAttribute('aria-valuenow')).toBe('11');

      press('End');
      expect(input.value).toBe('23:30');
      press('Enter'); // pasa a minutos
      const minutes = picker._popover.querySelector('.mtx-time-picker__clock');
      expect(minutes.getAttribute('aria-label')).toBe('Select minutes');
      press('ArrowDown');
      expect(input.value).toBe('23:29');
      expect(document.activeElement.getAttribute('aria-valuetext')).toBe('29 minutes');
      press('PageUp');
      expect(input.value).toBe('23:34');
    });
  });

  describe('Eventos', () => {
    it('emite una sola vez mtx:date-time-picker:change y el alias mtx:change por selección', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker' });
      const root = picker.element;
      const counts = { canonicalRoot: 0, aliasRoot: 0, canonicalInput: 0 };
      root.addEventListener('mtx:date-time-picker:change', () => { counts.canonicalRoot++; });
      root.addEventListener('mtx:change', () => { counts.aliasRoot++; });
      input.addEventListener('mtx:date-time-picker:change', () => { counts.canonicalInput++; });

      picker.setDate('2026-10-20');
      expect(counts).toEqual({ canonicalRoot: 1, aliasRoot: 1, canonicalInput: 1 });

      picker.open();
      picker._popover.querySelector('[data-date="2026-10-22"]').click();
      expect(counts).toEqual({ canonicalRoot: 2, aliasRoot: 2, canonicalInput: 2 });

      picker.clear();
      expect(counts).toEqual({ canonicalRoot: 3, aliasRoot: 3, canonicalInput: 3 });
    });

    it('emite mtx:date-time-picker:open/close (con alias mtx:open/mtx:close)', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker' });
      const log = [];
      ['mtx:date-time-picker:open', 'mtx:open', 'mtx:date-time-picker:close', 'mtx:close']
        .forEach((name) => picker.element.addEventListener(name, () => log.push(name)));
      picker.open();
      picker.close();
      expect(log).toEqual(['mtx:date-time-picker:open', 'mtx:open', 'mtx:date-time-picker:close', 'mtx:close']);
    });
  });

  describe('Regresiones', () => {
    it('datetime con data-time-view="dial" pasa al reloj tras elegir el día (sin _timeViewMode)', () => {
      const { picker } = mount({ 'data-mtx': 'datetime-picker', 'data-time-view': 'dial', 'data-value': '2026-10-20 08:00' });
      picker.open();
      picker._popover.querySelector('[data-date="2026-10-21"]').click();
      expect(picker._activeTab).toBe('time');
      expect(picker._currentView).toBe('clock-hours');
      expect(picker._popover.querySelector('.mtx-time-picker__clock')).not.toBeNull();
    });

    it('rango datetime con dial pasa a time-start en vista de reloj', () => {
      const { picker } = mount({ 'data-mtx': 'datetime-range-picker', 'data-time-view': 'dial' });
      picker.open();
      const days = picker._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
      days[2].click();
      picker._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)')[5].click();
      expect(picker._activeTab).toBe('time-start');
      expect(picker._currentView).toBe('clock-hours');
    });

    it('disable()/enable() bloquean campo, botón y apertura', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker' });
      const toggle = picker._getToggleButton();
      picker.open();
      picker.disable();
      expect(picker._isOpen).toBe(false);
      expect(picker.disabled).toBe(true);
      expect(input.disabled).toBe(true);
      expect(toggle.disabled).toBe(true);
      expect(toggle.getAttribute('aria-disabled')).toBe('true');
      picker.open();
      toggle.click();
      expect(picker._isOpen).toBe(false);

      picker.enable();
      expect(input.disabled).toBe(false);
      expect(toggle.disabled).toBe(false);
      expect(toggle.hasAttribute('aria-disabled')).toBe(false);
      toggle.click();
      expect(picker._isOpen).toBe(true);
    });

    it('disabled y readonly declarativos no abren el picker', () => {
      const { picker: p1 } = mount({ 'data-mtx': 'date-picker', disabled: '' });
      expect(p1._getToggleButton().disabled).toBe(true);
      p1._getToggleButton().click();
      expect(p1._isOpen).toBe(false);

      const { input, picker: p2 } = mount({ 'data-mtx': 'date-picker', readonly: '' });
      const toggle = p2._getToggleButton();
      expect(toggle.disabled).toBe(true);
      expect(toggle.getAttribute('aria-disabled')).toBe('true');
      input.click();
      toggle.click();
      expect(p2._isOpen).toBe(false);
    });

    it('data-value y data-default-value sincronizan --has-value (label sobre el valor)', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-label': 'Fecha', 'data-value': '2026-10-20' });
      expect(input.value).toBe('10/20/2026');
      expect(picker.element.classList.contains('mtx-text-field--has-value')).toBe(true);

      const { input: i2, picker: p2 } = mount({ 'data-mtx': 'date-picker', 'data-label': 'Otra', 'data-default-value': '2026-01-05' });
      expect(i2.value).toBe('01/05/2026');
      expect(p2.element.classList.contains('mtx-text-field--has-value')).toBe(true);

      p2.clear();
      expect(p2.element.classList.contains('mtx-text-field--has-value')).toBe(false);
    });

    it('data-locale="es-MX" usa español, DD/MM/YYYY y nombres de Intl/diccionario', () => {
      const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-locale': 'es-MX', 'data-value': '2026-10-20' });
      expect(input.value).toBe('20/10/2026');
      expect(picker._getToggleButton().getAttribute('aria-label')).toContain('Elegir fecha');
      picker.open();
      expect(picker._popover.getAttribute('aria-label')).toBe('Elegir fecha');
      expect(picker._popover.querySelector('.mtx-date-picker__title--month').textContent).toContain('Octubre');
      const ok = Array.from(picker._popover.querySelectorAll('.mtx-picker-actions button')).map((b) => b.textContent);
      expect(ok).toContain('Aceptar');
      const label = picker._popover.querySelector('[data-date="2026-10-20"]').getAttribute('aria-label');
      expect(label.toLowerCase()).toContain('octubre');
      expect(label).toContain('2026');
      // El parseo respeta el orden DD/MM del locale
      picker.setDate('05/03/2026');
      expect(picker.getDate().getMonth()).toBe(2);
    });

    it('formato por defecto según locale y data-format explícito tiene prioridad', () => {
      const { input: en } = mount({ 'data-mtx': 'datetime-picker', 'data-value': '2026-10-20 14:05' });
      expect(en.value).toBe('10/20/2026 14:05');
      const { input: es } = mount({ 'data-mtx': 'date-picker', 'data-lang': 'es', 'data-value': '2026-10-20' });
      expect(es.value).toBe('20/10/2026');
      const { input: fmt } = mount({ 'data-mtx': 'date-picker', 'data-locale': 'es', 'data-format': 'YYYY-MM-DD', 'data-value': '2026-10-20' });
      expect(fmt.value).toBe('2026-10-20');
      document.documentElement.setAttribute('lang', 'es-ES');
      const { input: html } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
      expect(html.value).toBe('20/10/2026');
    });

    it('un locale sin diccionario (fr-FR) usa Intl para meses y días', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker', 'data-locale': 'fr-FR', 'data-value': '2026-10-20' });
      picker.open();
      expect(picker._popover.querySelector('.mtx-date-picker__title--month').textContent.toLowerCase()).toContain('octobre');
      expect(picker._popover.querySelector('.mtx-picker-actions .mtx-button--contained').textContent).toBe('OK');
    });

    it('data-picker="date|time" fija el modo aunque data-mtx sea datetime-picker', () => {
      const { picker: d } = mount({ 'data-mtx': 'datetime-picker', 'data-picker': 'date' });
      expect(d._mode).toBe('date');
      d.open();
      expect(d._popover.querySelector('.mtx-picker-tabs')).toBeNull();
      const { picker: tm } = mount({ 'data-mtx': 'datetime-picker', 'data-picker': 'time' });
      expect(tm._mode).toBe('time');
      const { picker: dt } = mount({ 'data-mtx': 'date-picker', 'data-picker': 'datetime' });
      expect(dt._mode).toBe('datetime');
    });

    it('registra el alias date-time-picker además de datetime-picker', () => {
      const { picker } = mount({ 'data-mtx': 'date-time-picker' });
      expect(picker).toBeInstanceOf(DateTimePicker);
      expect(picker._mode).toBe('datetime');
    });

    it('destroy() retira listeners globales, backdrops portados y el registro', () => {
      const added = [];
      const removed = [];
      const targets = [document, window];
      const spies = targets.flatMap((target) => {
        const origAdd = target.addEventListener.bind(target);
        const origRemove = target.removeEventListener.bind(target);
        return [
          vi.spyOn(target, 'addEventListener').mockImplementation((type, fn, opts) => {
            added.push({ target, type, fn });
            return origAdd(type, fn, opts);
          }),
          vi.spyOn(target, 'removeEventListener').mockImplementation((type, fn, opts) => {
            removed.push({ target, type, fn });
            return origRemove(type, fn, opts);
          }),
        ];
      });
      try {
        const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-display': 'modal' });
        expect(added.length).toBeGreaterThan(0);
        expect(document.body.querySelector('.mtx-picker-backdrop')).not.toBeNull();
        picker.open();

        expect(destroy(input)).toBe(true);
        const leaked = added.filter((a) => !removed.some((r) => r.target === a.target && r.type === a.type && r.fn === a.fn));
        expect(leaked).toEqual([]);
        expect(document.body.querySelector('.mtx-picker-backdrop')).toBeNull();
        expect(getInstance(input)).toBeUndefined();
        expect(input.hasAttribute('data-mtx-initialized')).toBe(false);
        expect(DateTimePicker._activePicker).toBeNull();
        // Un Escape o clic posterior no afecta a la instancia destruida
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        document.body.click();
      } finally {
        spies.forEach((spy) => spy.mockRestore());
      }
    });

    it('destroy() del popover retira el backdrop móvil y el popover', () => {
      const { picker } = mount({ 'data-mtx': 'date-picker' });
      expect(document.body.querySelector('.mtx-picker-backdrop-mobile')).not.toBeNull();
      picker.destroy();
      expect(document.body.querySelector('.mtx-picker-backdrop-mobile')).toBeNull();
      expect(document.body.querySelector('.mtx-picker-popover')).toBeNull();
    });

    describe('Reinicialización y registro', () => {
      it('new DateTimePicker() sobre un input ya inicializado destruye el picker previo y su TextField', () => {
        const { input, picker: old } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
        const oldField = old._textField;
        const fresh = new DateTimePicker(input);
        expect(old.destroyed).toBe(true);
        expect(oldField.destroyed).toBe(true);
        expect(getInstance(input)).toBe(fresh);
        expect(input.value).toBe('10/20/2026');

        fresh._getToggleButton().click();
        expect(document.body.querySelectorAll('.mtx-picker-popover').length).toBe(1);
        expect(document.body.querySelectorAll('.mtx-picker-popover--open').length).toBe(1);
        expect(fresh._isOpen).toBe(true);
      });

      it('dos new DateTimePicker(input) dejan una sola instancia viva', () => {
        const input = document.createElement('input');
        input.setAttribute('data-value', '2026-10-20');
        document.body.appendChild(input);
        const first = new DateTimePicker(input);
        const second = new DateTimePicker(input);
        expect(first.destroyed).toBe(true);
        expect(getInstance(input)).toBe(second);
        expect(document.body.querySelectorAll('.mtx-picker-popover').length).toBe(1);
      });

      it('getInstance(input) devuelve el picker y destroy(input) lo destruye', () => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        const picker = new DateTimePicker(input);
        expect(getInstance(input)).toBe(picker);
        expect(destroy(input)).toBe(true);
        expect(picker.destroyed).toBe(true);
        expect(picker._textField.destroyed).toBe(true);
        expect(document.body.querySelector('.mtx-picker-popover')).toBeNull();
      });
    });

    describe('Locale', () => {
      afterEach(() => {
        resetLocale();
      });

      it('un data-locale local no registrado no anula setLocale() para los textos; Intl conserva sus nombres', () => {
        setLocale('es');
        const { picker } = mount({ 'data-mtx': 'date-picker', 'data-locale': 'fr-FR', 'data-value': '2026-10-20' });
        picker.open();
        expect(picker._popover.querySelector('.mtx-picker-actions .mtx-button--contained').textContent).toBe('Aceptar');
        expect(picker._popover.querySelector('.mtx-date-picker__title--month').textContent.toLowerCase()).toContain('octobre');
      });

      it('<html lang> de otro idioma no aporta región si setLocale() fija el idioma', () => {
        setLocale('es');
        document.documentElement.setAttribute('lang', 'en-US');
        const { input, picker } = mount({ 'data-mtx': 'date-picker', 'data-value': '2026-10-20' });
        expect(input.value).toBe('20/10/2026');
        expect(picker._getLocale()).toBe('es');
      });
    });

    describe('Arrastre del reloj y temporizadores', () => {
      /** Despacha un evento de ratón con coordenadas sobre el destino. */
      const mouse = (target, type, x = 128, y = 10) =>
        target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));

      afterEach(() => {
        vi.useRealTimers();
      });

      it('en horas, pasa a minutos una sola vez al soltar el gesto y no durante el arrastre', () => {
        vi.useFakeTimers();
        const { picker } = mount({ 'data-mtx': 'time-picker', 'data-time-view': 'dial', 'data-value': '10:30' });
        picker.open();
        vi.runAllTimers();
        const renderSpy = vi.spyOn(picker, '_renderCurrentView');
        const clock = picker._popover.querySelector('.mtx-time-picker__clock');

        mouse(clock, 'mousedown', 230, 128);
        for (let i = 0; i < 10; i++) mouse(window, 'mousemove', 230, 120 + i);
        vi.advanceTimersByTime(500);
        expect(picker._timeUnit).toBe('hours');
        expect(renderSpy).not.toHaveBeenCalled();

        mouse(window, 'mouseup');
        expect(vi.getTimerCount()).toBe(1);
        vi.advanceTimersByTime(200);
        expect(picker._timeUnit).toBe('minutes');
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(picker._activeDragEnd).toBeNull();
      });

      it('destroy() en mitad del arrastre retira los listeners de window y cancela los temporizadores', () => {
        vi.useFakeTimers();
        const added = [];
        const removed = [];
        const origAdd = window.addEventListener.bind(window);
        const origRemove = window.removeEventListener.bind(window);
        const spies = [
          vi.spyOn(window, 'addEventListener').mockImplementation((type, fn, opts) => {
            added.push({ type, fn });
            return origAdd(type, fn, opts);
          }),
          vi.spyOn(window, 'removeEventListener').mockImplementation((type, fn, opts) => {
            removed.push({ type, fn });
            return origRemove(type, fn, opts);
          }),
        ];
        try {
          const { picker } = mount({ 'data-mtx': 'time-picker', 'data-time-view': 'dial', 'data-value': '10:30' });
          picker.open();
          const clock = picker._popover.querySelector('.mtx-time-picker__clock');
          // Un primer gesto completo deja un cambio de vista pendiente.
          mouse(clock, 'mousedown', 230, 128);
          mouse(window, 'mouseup');
          const clock2 = picker._popover.querySelector('.mtx-time-picker__clock');
          mouse(clock2, 'mousedown', 230, 128);
          mouse(window, 'mousemove', 230, 140);
          expect(picker._activeDragEnd).toBeTypeOf('function');
          expect(picker._timers.size).toBeGreaterThan(0);

          const renderSpy = vi.spyOn(picker, '_renderCurrentView');
          picker.destroy();
          const leaked = added.filter((a) => !removed.some((r) => r.type === a.type && r.fn === a.fn));
          expect(leaked).toEqual([]);
          expect(picker._activeDragEnd).toBeNull();
          expect(picker._timers.size).toBe(0);
          vi.runAllTimers();
          expect(renderSpy).not.toHaveBeenCalled();
        } finally {
          spies.forEach((spy) => spy.mockRestore());
        }
      });
    });
  });
});
