import { useState } from 'react';
import type { FocusEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';
import { DatePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Keyboard and accessibility', es: 'Teclado y accesibilidad' };
export const description = {
  en: 'WAI-ARIA Date Picker Dialog pattern: the end icon is a button with `aria-haspopup="dialog"` and `aria-expanded`; the picker is a `role="dialog"` and the calendar a `role="grid"` with roving tabindex. Focus the calendar button and press Enter, or type in the field and press Alt+↓.',
  es: 'Patrón WAI-ARIA Date Picker Dialog: el icono final es un botón con `aria-haspopup="dialog"` y `aria-expanded`; el selector es un `role="dialog"` y el calendario un `role="grid"` con roving tabindex. Enfoca el botón del calendario y pulsa Enter, o escribe en el campo y pulsa Alt+↓.',
};

const KEYS: Array<[string, string]> = [
  ['← / →', 'Día anterior / siguiente'],
  ['↑ / ↓', 'Mismo día de la semana anterior / siguiente'],
  ['Inicio / Fin', 'Primer / último día de la semana'],
  ['RePág / AvPág', 'Mes anterior / siguiente'],
  ['Mayús + RePág / AvPág', 'Año anterior / siguiente'],
  ['Enter / Espacio', 'Selecciona el día, mes o año enfocado'],
  ['Flechas en el reloj', 'Cambian la hora o el minuto; RePág/AvPág ±5 min; Enter pasa a los minutos'],
  ['Esc', 'Cierra y devuelve el foco al botón o al campo'],
];

export default function Demo() {
  const [status, setStatus] = useState('Recorre el calendario con el teclado.');
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') === 'gridcell') setStatus(`Foco: ${target.getAttribute('aria-label')}`);
  };
  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group" onFocus={onFocus}>
          <span className="demo-label">Popover · cuadrícula de días</span>
          <DatePicker label="Fecha" defaultValue="2026-10-20" minDate="2026-01-01" maxDate="2027-12-31" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Modal · trampa de foco</span>
          <DatePicker label="Fecha (modal)" display="modal" defaultValue="2026-10-20" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Reloj · slider con aria-valuetext</span>
          <TimePicker label="Hora" timeView="dial" defaultValue="10:30" />
        </div>
      </div>
      <p className="demo-status" aria-live="polite">
        {status}
      </p>
      <div className="demo-surface">
        <TableContainer>
          <Table size="small" aria-label="Teclas del selector">
            <TableHead>
              <TableRow>
                <TableCell>Tecla</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {KEYS.map(([k, act]) => (
                <TableRow key={k}>
                  <TableCell>
                    <kbd>{k}</kbd>
                  </TableCell>
                  <TableCell>{act}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
