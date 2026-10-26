import { DatePicker, DateTimePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`DatePicker`, `TimePicker` and `DateTimePicker` render a TextField with a mask and an icon button that opens the picker. Typing directly is also supported.',
  es: '`DatePicker`, `TimePicker` y `DateTimePicker` pintan un TextField con máscara y un botón de icono que abre el selector. También se puede escribir directamente.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">DatePicker</span>
        <DatePicker label="Fecha de entrega" />
      </div>
      <div className="demo-group">
        <span className="demo-label">TimePicker</span>
        <TimePicker label="Hora de la cita" />
      </div>
      <div className="demo-group">
        <span className="demo-label">DateTimePicker</span>
        <DateTimePicker label="Reunión" />
      </div>
    </div>
  );
}
