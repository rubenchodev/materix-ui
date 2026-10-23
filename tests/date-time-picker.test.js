import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { DateTimePicker } from '../src/components/date-time-picker/date-time-picker.js';

describe('DateTimePicker (DatePicker, TimePicker & DateTimePicker)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scaffolda automáticamente un input simple con data-mtx="datepicker"', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    input.setAttribute('data-label', 'Fecha de nacimiento');
    document.body.appendChild(input);

    initAll();

    const wrapper = document.querySelector('.mtx-text-field');
    expect(wrapper).not.toBeNull();
    expect(wrapper.querySelector('.mtx-text-field__label').textContent).toBe('Fecha de nacimiento');
    expect(wrapper.querySelector('.mtx-picker-popover')).not.toBeNull();

    const instance = getInstance(input);
    expect(instance).toBeInstanceOf(DateTimePicker);
    expect(instance._mode).toBe('date');
  });

  it('scaffolda correctamente timepicker y datetimepicker', () => {
    const timeInput = document.createElement('input');
    timeInput.setAttribute('data-mtx', 'timepicker');
    timeInput.setAttribute('data-label', 'Hora de salida');
    document.body.appendChild(timeInput);

    const dtInput = document.createElement('input');
    dtInput.setAttribute('data-mtx', 'datetimepicker');
    dtInput.setAttribute('data-label', 'Cita médica');
    document.body.appendChild(dtInput);

    initAll();

    const timeInstance = getInstance(timeInput);
    const dtInstance = getInstance(dtInput);

    expect(timeInstance._mode).toBe('time');
    expect(dtInstance._mode).toBe('datetime');
  });

  it('abre, cierra y alterna el popover', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance._isOpen).toBe(false);

    instance.open();
    expect(instance._isOpen).toBe(true);
    expect(instance._popover.classList.contains('mtx-picker-popover--open')).toBe(true);

    instance.close();
    expect(instance._isOpen).toBe(false);
    expect(instance._popover.classList.contains('mtx-picker-popover--open')).toBe(false);

    instance.toggle();
    expect(instance._isOpen).toBe(true);
  });

  it('cierra el selector con la tecla Escape', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();
    expect(instance._isOpen).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(instance._isOpen).toBe(false);
  });

  it('permite seleccionar una fecha en el calendario y dispara mtx:change', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    let changed = false;
    input.addEventListener('mtx:change', (e) => {
      changed = true;
      expect(e.detail.date).toBeInstanceOf(Date);
    });

    instance.open();
    const dayBtn = instance._popover.querySelector('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
    expect(dayBtn).not.toBeNull();
    dayBtn.click();

    expect(changed).toBe(true);
    expect(input.value).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('permite cambiar de mes usando el selector de meses', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    const monthBtn = instance._popover.querySelector('.mtx-date-picker__title--month');
    expect(monthBtn).not.toBeNull();
    monthBtn.click();
    expect(instance._currentView).toBe('months');

    const monthBtns = instance._popover.querySelectorAll('.mtx-date-picker__month');
    expect(monthBtns.length).toBe(12);

    // Seleccionar Julio (índice 6)
    monthBtns[6].click();
    expect(instance._currentView).toBe('calendar');
    expect(instance._viewDate.getMonth()).toBe(6);
  });

  it('permite cambiar de año usando el selector de años', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    const yearBtn = instance._popover.querySelector('.mtx-date-picker__title--year');
    expect(yearBtn).not.toBeNull();
    yearBtn.click();
    expect(instance._currentView).toBe('years');

    const firstYearBtn = instance._popover.querySelector('.mtx-date-picker__year');
    expect(firstYearBtn).not.toBeNull();
    firstYearBtn.click();

    expect(instance._currentView).toBe('calendar');
  });

  it('restablece a la vista original por defecto cada vez que se abre', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    // Cambiar a la vista de años
    const yearBtn = instance._popover.querySelector('.mtx-date-picker__title--year');
    yearBtn.click();
    expect(instance._currentView).toBe('years');

    // Cerrar y volver a abrir
    instance.close();
    instance.open();

    // Debe volver a la vista de calendario original
    expect(instance._currentView).toBe('calendar');
    expect(instance._popover.querySelector('.mtx-date-picker__days')).not.toBeNull();
  });

  it('respeta restricciones de fecha mínima y máxima', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    input.setAttribute('data-min', '2026-06-01');
    input.setAttribute('data-max', '2026-06-30');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance._viewDate = new Date(2026, 4, 15); // Mayo 2026 (antes del mínimo)
    instance.open();

    const dayBtns = instance._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
    // Todos los días de mayo deben estar deshabilitados
    dayBtns.forEach(btn => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('permite fijar y leer fecha programáticamente mediante API', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    const testDate = new Date(2026, 8, 15, 10, 30); // 15 de Septiembre 2026
    instance.setDate(testDate);

    expect(instance.date.getFullYear()).toBe(2026);
    expect(instance.date.getMonth()).toBe(8);
    expect(instance.date.getDate()).toBe(15);
    expect(instance.value).toBe('15/09/2026');

    instance.clear();
    expect(instance.date).toBeNull();
    expect(instance.value).toBe('');
  });

  it('soporta modo estático embebido con data-static="true"', () => {
    const div = document.createElement('div');
    div.setAttribute('data-mtx', 'datepicker');
    div.setAttribute('data-static', 'true');
    document.body.appendChild(div);

    initAll();

    const instance = getInstance(div);
    expect(instance._isStatic).toBe(true);
    expect(div.classList.contains('mtx-picker-static')).toBe(true);
    expect(div.querySelector('.mtx-date-picker')).not.toBeNull();
  });

  it('no cierra el picker al navegar entre meses o años con los botones internos', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();
    expect(instance._isOpen).toBe(true);

    const prevBtn = instance._popover.querySelector('.mtx-date-picker__nav-btn');
    expect(prevBtn).not.toBeNull();

    // Clic en navegación anterior
    prevBtn.click();
    expect(instance._isOpen).toBe(true);
    expect(instance._popover.classList.contains('mtx-picker-popover--open')).toBe(true);

    // Clic en selector de años
    const yearTitleBtn = instance._popover.querySelector('.mtx-date-picker__title--year');
    expect(yearTitleBtn).not.toBeNull();
    yearTitleBtn.click();
    expect(instance._isOpen).toBe(true);
    expect(instance._currentView).toBe('years');

    // Clic en un año
    const yearBtn = instance._popover.querySelector('.mtx-date-picker__year');
    expect(yearBtn).not.toBeNull();
    yearBtn.click();
    expect(instance._isOpen).toBe(true);
    expect(instance._currentView).toBe('calendar');
  });

  it('renderiza el botón Aceptar con variante filled (mtx-button--contained)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    const actions = instance._popover.querySelector('.mtx-picker-actions');
    expect(actions).not.toBeNull();

    const okBtn = Array.from(actions.querySelectorAll('button')).find(
      (btn) => btn.textContent.trim() === 'OK'
    );
    expect(okBtn).not.toBeNull();
    expect(okBtn.classList.contains('mtx-button--contained')).toBe(true);
    expect(okBtn.classList.contains('mtx-button--small')).toBe(true);
  });

  it('permite insertar y obtener la fecha mediante la API (getDate, setDate, date)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance.getDate()).toBeNull();
    expect(instance.date).toBeNull();

    // Insertar mediante objeto Date
    const testDate = new Date(2026, 9, 25, 14, 30);
    instance.setDate(testDate);

    const retrievedDate = instance.getDate();
    expect(retrievedDate).toBeInstanceOf(Date);
    expect(retrievedDate.getFullYear()).toBe(2026);
    expect(retrievedDate.getMonth()).toBe(9);
    expect(retrievedDate.getDate()).toBe(25);

    // Obtener formateado
    expect(instance.getDate(true)).toBe('25/10/2026');
    expect(instance.getDate('YYYY-MM-DD')).toBe('2026-10-25');
    expect(instance.value).toBe('25/10/2026');
    expect(input.value).toBe('25/10/2026');

    // Insertar mediante string ISO
    instance.setDate('2027-05-18');
    expect(instance.getDate(true)).toBe('18/05/2027');

    // Insertar mediante setter de propiedad
    instance.date = '01/01/2028';
    expect(instance.getDate(true)).toBe('01/01/2028');
  });

  it('permite insertar y obtener fecha y hora (getDateTime, setDateTime, dateTime, time)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datetimepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);

    // Insertar fecha y hora completa
    instance.setDateTime('2026-11-15 16:45');
    const dt = instance.getDateTime();
    expect(dt).toBeInstanceOf(Date);
    expect(dt.getFullYear()).toBe(2026);
    expect(dt.getMonth()).toBe(10);
    expect(dt.getDate()).toBe(15);
    expect(dt.getHours()).toBe(16);
    expect(dt.getMinutes()).toBe(45);

    // Obtener formateado con fecha y hora
    expect(instance.getDateTime(true)).toBe('15/11/2026 16:45');
    expect(instance.getTime()).toBe('16:45');
    expect(instance.getTime(true)).toEqual({ hours: 16, minutes: 45 });

    // Modificar sólo la hora mediante setTime
    instance.setTime('09:15');
    expect(instance.getTime()).toBe('09:15');
    expect(instance.getDateTime(true)).toBe('15/11/2026 09:15');

    // Modificar mediante setter dateTime
    instance.dateTime = new Date(2025, 0, 1, 12, 0);
    expect(instance.getDate('YYYY-MM-DD')).toBe('2025-01-01');
    expect(instance.getTime()).toBe('12:00');
  });

  it('detecta e inserta valor inicial desde atributo value o data-value', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    input.value = '2026-08-20';
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance.getDate()).not.toBeNull();
    expect(instance.getDate().getFullYear()).toBe(2026);
    expect(instance.getDate().getMonth()).toBe(7);
    expect(instance.getDate().getDate()).toBe(20);
    expect(input.value).toBe('20/08/2026');
  });

  it('dispara el evento mtx:change con fecha, dateTime, hora, value e iso al insertar', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datetimepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    let eventDetail = null;

    input.addEventListener('mtx:change', (e) => {
      eventDetail = e.detail;
    });

    instance.setDate('2026-10-31 23:59');

    expect(eventDetail).not.toBeNull();
    expect(eventDetail.date).toBeInstanceOf(Date);
    expect(eventDetail.dateTime).toBeInstanceOf(Date);
    expect(eventDetail.time).toBe('23:59');
    expect(eventDetail.value).toBe('31/10/2026 23:59');
    expect(typeof eventDetail.iso).toBe('string');
  });

  it('inicializa correctamente en modo rango con data-mtx="daterangepicker" o data-range="true"', () => {
    const input1 = document.createElement('input');
    input1.setAttribute('data-mtx', 'daterangepicker');
    document.body.appendChild(input1);

    const input2 = document.createElement('input');
    input2.setAttribute('data-mtx', 'datepicker');
    input2.setAttribute('data-range', 'true');
    document.body.appendChild(input2);

    initAll();

    const inst1 = getInstance(input1);
    const inst2 = getInstance(input2);

    expect(inst1.isRange).toBe(true);
    expect(inst2.isRange).toBe(true);
  });

  it('permite insertar y obtener rango mediante API (getRange, setRange, range)', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'daterangepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance.getRange().start).toBeNull();
    expect(instance.getRange().end).toBeNull();

    // Establecer rango por fechas
    const start = new Date(2026, 9, 1);
    const end = new Date(2026, 9, 15);
    instance.setRange(start, end);

    const r = instance.getRange();
    expect(r.start).toBeInstanceOf(Date);
    expect(r.end).toBeInstanceOf(Date);
    expect(r.start.getDate()).toBe(1);
    expect(r.end.getDate()).toBe(15);

    // Formateado
    const rFormatted = instance.getRange(true);
    expect(rFormatted.start).toBe('01/10/2026');
    expect(rFormatted.end).toBe('15/10/2026');
    expect(rFormatted.value).toBe('01/10/2026 - 15/10/2026');
    expect(input.value).toBe('01/10/2026 - 15/10/2026');

    // ISO
    const rIso = instance.getRange('iso');
    expect(typeof rIso.start).toBe('string');
    expect(typeof rIso.end).toBe('string');

    // Asignar mediante objeto
    instance.range = { start: '10/11/2026', end: '20/11/2026' };
    expect(instance.getRange(true).value).toBe('10/11/2026 - 20/11/2026');

    // Inversión automática si start > end
    instance.setRange('25/12/2026', '20/12/2026');
    expect(instance.getRange(true).start).toBe('20/12/2026');
    expect(instance.getRange(true).end).toBe('25/12/2026');
  });

  it('selecciona rango en el calendario mediante dos clics y emite mtx:change', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'daterangepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    let changeDetail = null;
    input.addEventListener('mtx:change', (e) => {
      changeDetail = e.detail;
    });

    const dayBtns = instance._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
    expect(dayBtns.length).toBeGreaterThan(20);

    // Primer clic: día 5
    dayBtns[4].click();
    expect(instance._rangeStart).not.toBeNull();
    expect(instance._rangeStart.getDate()).toBe(5);
    expect(instance._rangeEnd).toBeNull();
    expect(instance._rangeStep).toBe('end');

    // Segundo clic: día 12
    dayBtns[11].click();
    expect(instance._rangeEnd).not.toBeNull();
    expect(instance._rangeEnd.getDate()).toBe(12);
    expect(instance._rangeStep).toBe('start');

    // Verificar evento emitido
    expect(changeDetail).not.toBeNull();
    expect(changeDetail.isRange).toBe(true);
    expect(changeDetail.startDate).toBeInstanceOf(Date);
    expect(changeDetail.startDate.getDate()).toBe(5);
    expect(changeDetail.endDate).toBeInstanceOf(Date);
    expect(changeDetail.endDate.getDate()).toBe(12);
    expect(changeDetail.value).toContain(' - ');
  });

  it('deriva la máscara correctamente con formato personalizado YYYY-MM-DD HH:mm', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datetimepicker');
    input.setAttribute('data-format', 'YYYY-MM-DD HH:mm');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(input.getAttribute('data-mask')).toBe('0000-00-00 00:00');

    // Asignar fecha de prueba (7 de Septiembre de 2026, 12:00)
    const testDate = new Date(2026, 8, 7, 12, 0);
    instance.setDate(testDate);

    expect(instance.value).toBe('2026-09-07 12:00');
    expect(input.value).toBe('2026-09-07 12:00');
  });

  it('permite flujo fluido en datetimerangepicker sin cerrar prematuramente el calendario', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datetimerangepicker');
    input.setAttribute('data-locale', 'es'); // formato DD/MM/YYYY
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    const dayBtns = instance._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');

    // 1. Primer clic en día 8: debe permanecer en la pestaña de fechas y calendario
    dayBtns[7].click();
    expect(instance._rangeStart).not.toBeNull();
    expect(instance._rangeStart.getDate()).toBe(8);
    expect(instance._rangeEnd).toBeNull();
    expect(instance._activeTab).toBe('date');
    expect(instance._currentView).toBe('calendar');

    // 2. Segundo clic en día 15: debe fijar fin y pasar a time-start
    const updatedDayBtns = instance._popover.querySelectorAll('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
    updatedDayBtns[14].click();
    expect(instance._rangeEnd).not.toBeNull();
    expect(instance._rangeEnd.getDate()).toBe(15);
    expect(instance._activeTab).toBe('time-start');
    expect(['digital-time', 'clock-hours']).toContain(instance._currentView);

    // 3. Ajustar hora de inicio (9 AM)
    instance._setHour(9);
    instance._setMinute(30);
    instance._setAmPm('AM');
    expect(instance._startHour).toBe(9);
    expect(instance._startMinute).toBe(30);

    // 4. Cambiar a pestaña time-end y ajustar hora de fin (18:00 / 6 PM)
    instance._activeTab = 'time-end';
    instance._setHour(6);
    instance._setMinute(45);
    instance._setAmPm('PM');
    expect(instance._endHour).toBe(18);
    expect(instance._endMinute).toBe(45);

    // 5. Verificar que el rango de fecha y hora se formateó
    const monthStr = String(instance._rangeStart.getMonth() + 1).padStart(2, '0');
    expect(instance.value).toContain(`08/${monthStr}/2026 09:30`);
    expect(instance.value).toContain(`15/${monthStr}/2026 18:45`);
    expect(instance.getTime()).toBe('09:30 - 18:45');
  });

  it('soporta selector de hora en formato 12 horas AM/PM con data-ampm="true"', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'timepicker');
    input.setAttribute('data-ampm', 'true');
    input.setAttribute('data-label', 'Hora de reunión');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance._isAmPmMode()).toBe(true);
    expect(instance._format).toBe('hh:mm A');
    expect(input.getAttribute('data-mask')).toBe('time-ampm');

    // Asignar hora 2:45 PM (14:45)
    instance.setTime('14:45');
    expect(instance.getTime()).toBe('02:45 PM');
    expect(input.value).toBe('02:45 PM');
    expect(instance.getTime(true)).toEqual({ hours: 14, minutes: 45, ampm: 'PM' });

    // Asignar hora 9:15 AM
    instance.setTime('09:15');
    expect(instance.getTime()).toBe('09:15 AM');
    expect(input.value).toBe('09:15 AM');
    expect(instance.getTime(true)).toEqual({ hours: 9, minutes: 15, ampm: 'AM' });
  });

  it('filtra caracteres inválidos en tiempo real respetando el formato del campo', () => {
    const timeInput = document.createElement('input');
    timeInput.setAttribute('data-mtx', 'timepicker');
    timeInput.setAttribute('data-ampm', 'true');
    document.body.appendChild(timeInput);

    const dateInput = document.createElement('input');
    dateInput.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(dateInput);

    initAll();

    // 1. Timepicker con AM/PM: solo dígitos, ':' y 'A', 'P', 'M'
    const invalidEvent = new KeyboardEvent('keydown', { key: 'x', cancelable: true });
    timeInput.dispatchEvent(invalidEvent);
    expect(invalidEvent.defaultPrevented).toBe(true);

    const validDigitEvent = new KeyboardEvent('keydown', { key: '1', cancelable: true });
    timeInput.dispatchEvent(validDigitEvent);
    expect(validDigitEvent.defaultPrevented).toBe(false);

    const validColonEvent = new KeyboardEvent('keydown', { key: ':', cancelable: true });
    timeInput.dispatchEvent(validColonEvent);
    expect(validColonEvent.defaultPrevented).toBe(false);

    const validAEvent = new KeyboardEvent('keydown', { key: 'A', cancelable: true });
    timeInput.dispatchEvent(validAEvent);
    expect(validAEvent.defaultPrevented).toBe(false);

    // 2. Datepicker: solo dígitos y separadores '/', '-', '.'
    const invalidLetterEvent = new KeyboardEvent('keydown', { key: 'A', cancelable: true });
    dateInput.dispatchEvent(invalidLetterEvent);
    expect(invalidLetterEvent.defaultPrevented).toBe(true);

    const validSlashEvent = new KeyboardEvent('keydown', { key: '/', cancelable: true });
    dateInput.dispatchEvent(validSlashEvent);
    expect(validSlashEvent.defaultPrevented).toBe(false);

    // 3. Filtrado de caracteres al pegar texto
    const pasteEvent = new Event('paste', { cancelable: true });
    pasteEvent.clipboardData = {
      getData: () => '10:30 abc $# PM'
    };
    timeInput.dispatchEvent(pasteEvent);
    expect(pasteEvent.defaultPrevented).toBe(true);
  });

  it('incluye backdrop móvil y clases de adaptación responsive para pantallas reducidas', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    expect(instance._mobileBackdrop).not.toBeNull();
    expect(instance._mobileBackdrop.classList.contains('mtx-picker-backdrop-mobile')).toBe(true);

    instance.open();
    expect(instance._isOpen).toBe(true);
    expect(instance._mobileBackdrop.classList.contains('mtx-picker-backdrop-mobile--open')).toBe(true);

    // Clic en el backdrop móvil para cerrar
    instance._mobileBackdrop.click();
    expect(instance._isOpen).toBe(false);
    expect(instance._mobileBackdrop.classList.contains('mtx-picker-backdrop-mobile--open')).toBe(false);
  });

  it('cierra automáticamente cualquier picker previo al abrir uno nuevo para evitar múltiples popovers abiertos', () => {
    const input1 = document.createElement('input');
    input1.setAttribute('data-mtx', 'datepicker');
    input1.setAttribute('data-label', 'Fecha 1');
    document.body.appendChild(input1);

    const input2 = document.createElement('input');
    input2.setAttribute('data-mtx', 'timepicker');
    input2.setAttribute('data-label', 'Hora 2');
    document.body.appendChild(input2);

    const input3 = document.createElement('input');
    input3.setAttribute('data-mtx', 'datetimepicker');
    input3.setAttribute('data-label', 'Fecha Hora 3');
    document.body.appendChild(input3);

    initAll();

    const inst1 = getInstance(input1);
    const inst2 = getInstance(input2);
    const inst3 = getInstance(input3);

    // 1. Abrir picker 1
    inst1.open();
    expect(inst1._isOpen).toBe(true);
    expect(inst2._isOpen).toBe(false);
    expect(inst3._isOpen).toBe(false);

    // 2. Abrir picker 2: picker 1 debe cerrarse inmediatamente
    inst2.open();
    expect(inst1._isOpen).toBe(false);
    expect(inst2._isOpen).toBe(true);
    expect(inst3._isOpen).toBe(false);

    // 3. Abrir picker 3: picker 2 debe cerrarse
    inst3.open();
    expect(inst1._isOpen).toBe(false);
    expect(inst2._isOpen).toBe(false);
    expect(inst3._isOpen).toBe(true);

    // 4. closeAll cierra cualquier picker activo
    DateTimePicker.closeAll();
    expect(inst3._isOpen).toBe(false);
  });

  it('devuelve el foco al input al seleccionar una fecha o cerrar mediante acción', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'datepicker');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    // Simular selección de día en el calendario
    const dayBtn = instance._popover.querySelector('.mtx-date-picker__day:not(.mtx-date-picker__day--outside)');
    expect(dayBtn).not.toBeNull();
    dayBtn.click();

    // Debe cerrarse y enfocar el input
    expect(instance._isOpen).toBe(false);
    expect(document.activeElement).toBe(input);
  });

  it('soporta selector de hora canónico Material Design con tarjetas interactivas y alternancia dial/teclado', () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'timepicker');
    input.setAttribute('data-ampm', 'true');
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    // 1. Por defecto abre en modo entrada por teclado ("Enter time") con tarjetas editables
    expect(instance._timeInputMode).toBe('input');
    const headerBox = instance._popover.querySelector('.mtx-time-picker__header-box');
    expect(headerBox).not.toBeNull();

    // En modo input las tarjetas son inputs editables y no se renderiza la esfera analógica
    const inputs = instance._popover.querySelectorAll('.mtx-time-picker__digit-card--input');
    expect(inputs.length).toBe(2);
    expect(instance._popover.querySelector('.mtx-time-picker__clock')).toBeNull();

    const ampmOpts = instance._popover.querySelectorAll('.mtx-time-picker__ampm-opt');
    expect(ampmOpts.length).toBe(2);

    // 2. Escribir valores directamente en las tarjetas de hora y minuto
    inputs[0].value = '10';
    inputs[0].dispatchEvent(new Event('input'));

    inputs[1].value = '45';
    inputs[1].dispatchEvent(new Event('input'));

    // Clic en 'PM'
    const pmBtn = Array.from(instance._popover.querySelectorAll('.mtx-time-picker__ampm-opt')).find((b) => b.textContent.trim() === 'PM');
    expect(pmBtn).toBeDefined();
    pmBtn.click();

    expect(instance.getTime()).toBe('10:45 PM');

    // 3. Alternar a modo reloj dial analógico mediante el botón en el footer
    const toggleBtn = instance._popover.querySelector('.mtx-picker-icon-btn');
    expect(toggleBtn).not.toBeNull();
    toggleBtn.click();

    expect(instance._timeInputMode).toBe('dial');
    expect(instance._popover.querySelector('.mtx-time-picker__clock')).not.toBeNull();

    // 4. Alternar de vuelta a modo entrada por teclado
    const backToInputBtn = instance._popover.querySelector('.mtx-picker-icon-btn');
    expect(backToInputBtn).not.toBeNull();
    backToInputBtn.click();

    expect(instance._timeInputMode).toBe('input');
    expect(instance._popover.querySelector('.mtx-time-picker__clock')).toBeNull();
  });

  it('coloca el foco en el input de hora al abrir para permitir navegación inmediata con Tab', async () => {
    const input = document.createElement('input');
    input.setAttribute('data-mtx', 'timepicker');
    input.type = 'text';
    document.body.appendChild(input);

    initAll();

    const instance = getInstance(input);
    instance.open();

    await new Promise((r) => setTimeout(r, 60));

    const inputs = instance._popover.querySelectorAll('.mtx-time-picker__digit-card--input');
    expect(inputs.length).toBe(2);
    expect(document.activeElement).toBe(inputs[0]);
  });
});

