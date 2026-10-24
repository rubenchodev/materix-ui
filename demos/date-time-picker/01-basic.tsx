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
        <DatePicker label="Delivery date" />
      </div>
      <div className="demo-group">
        <span className="demo-label">TimePicker</span>
        <TimePicker label="Appointment time" />
      </div>
      <div className="demo-group">
        <span className="demo-label">DateTimePicker</span>
        <DateTimePicker label="Meeting" />
      </div>
    </div>
  );
}
