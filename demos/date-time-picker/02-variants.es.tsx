import { DatePicker, DateTimePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`variant`: `outlined` (default), `filled` and `standard`, inherited from TextField.',
  es: '`variant`: `outlined` (por defecto), `filled` y `standard`, heredadas de TextField.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <DatePicker label="Fecha" variant="outlined" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Filled</span>
        <TimePicker label="Hora" variant="filled" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <DateTimePicker label="Fecha y hora" variant="standard" />
      </div>
    </div>
  );
}
