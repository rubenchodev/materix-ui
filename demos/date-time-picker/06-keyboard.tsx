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
  ['← / →', 'Previous / next day'],
  ['↑ / ↓', 'Same weekday of the previous / next week'],
  ['Home / End', 'First / last day of the week'],
  ['PgUp / PgDn', 'Previous / next month'],
  ['Shift + PgUp / PgDn', 'Previous / next year'],
  ['Enter / Space', 'Selects the focused day, month or year'],
  ['Arrows on the clock', 'Change the hour or minute; PgUp/PgDn ±5 min; Enter moves to minutes'],
  ['Esc', 'Closes and returns focus to the button or the field'],
];

export default function Demo() {
  const [status, setStatus] = useState('Navigate the calendar with the keyboard.');
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') === 'gridcell') setStatus(`Focus: ${target.getAttribute('aria-label')}`);
  };
  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group" onFocus={onFocus}>
          <span className="demo-label">Popover · day grid</span>
          <DatePicker label="Date" defaultValue="2026-10-20" minDate="2026-01-01" maxDate="2027-12-31" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Modal · focus trap</span>
          <DatePicker label="Date (modal)" display="modal" defaultValue="2026-10-20" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Clock · slider with aria-valuetext</span>
          <TimePicker label="Time" timeView="dial" defaultValue="10:30" />
        </div>
      </div>
      <p className="demo-status" aria-live="polite">
        {status}
      </p>
      <div className="demo-surface">
        <TableContainer>
          <Table size="small" aria-label="Picker keys">
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Action</TableCell>
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
