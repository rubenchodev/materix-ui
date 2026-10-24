import { DatePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: 'The end icon opens and closes the picker and depends on the mode; change it with `endIcon` and add another one with `startIcon`.',
  es: 'El icono final abre y cierra el selector y depende del modo; cámbialo con `endIcon` y añade otro con `startIcon`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Default icon</span>
        <DatePicker label="Date" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Start icon + custom end icon</span>
        <DatePicker label="Check-in" startIcon="hotel" endIcon="calendar_today" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom end icon</span>
        <TimePicker label="Alarm" endIcon="alarm" />
      </div>
    </div>
  );
}
