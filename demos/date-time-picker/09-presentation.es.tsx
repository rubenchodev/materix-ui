import { useState } from 'react';
import {
  DatePicker,
  DateTimePicker,
  StaticDatePicker,
  StaticTimePicker,
} from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Popover, modal and static', es: 'Popover, modal y estático' };
export const description = {
  en: 'A popover below the field (default; centered over a dark backdrop on screens ≤ 600px), a modal dialog with an MD2 header (`display="modal"`) or an embedded picker (`StaticDatePicker` or `displayStatic`).',
  es: 'Un popover bajo el campo (por defecto; centrado sobre un fondo oscuro en pantallas ≤ 600px), un diálogo modal con cabecera MD2 (`display="modal"`) o un selector incrustado (`StaticDatePicker` o `displayStatic`).',
};

export default function Demo() {
  const [dateOut, setDateOut] = useState('Elige un día.');
  const [timeOut, setTimeOut] = useState('Elige una hora.');
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Modal</span>
        <div className="demo-grid-2">
          <DatePicker label="Fecha (modal)" display="modal" />
          <DateTimePicker label="Fecha y hora (modal)" display="modal" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Estático · cada elección llama a onChange</span>
        <div className="demo-grid-2">
          <div className="demo-stack">
            <StaticDatePicker onChange={(_, detail) => setDateOut(`onChange → ${detail.value}`)} />
            <p className="demo-status" aria-live="polite">
              {dateOut}
            </p>
          </div>
          <div className="demo-stack">
            <StaticTimePicker timeView="dial" onChange={(_, detail) => setTimeOut(`onChange → ${detail.value}`)} />
            <p className="demo-status" aria-live="polite">
              {timeOut}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
