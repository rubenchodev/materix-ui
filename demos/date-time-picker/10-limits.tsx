import { DatePicker, DateTimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Limits, initial value and format', es: 'Límites, valor inicial y formato' };
export const description = {
  en: '`minDate`/`maxDate` disable days outside the interval (they accept `today`) and `shouldDisableDate` disables specific days; `defaultValue` sets the initial value and `format` changes the format and the mask.',
  es: '`minDate`/`maxDate` deshabilitan los días fuera del intervalo (aceptan `today`) y `shouldDisableDate` deshabilita días concretos; `defaultValue` fija el valor inicial y `format` cambia el formato y la máscara.',
};

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">2026 only</span>
        <DatePicker label="Date" minDate="2026-01-01" maxDate="2026-12-31" />
      </div>
      <div className="demo-group">
        <span className="demo-label">From today + value</span>
        <DatePicker label="Delivery" minDate="today" defaultValue="2026-12-24" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Weekdays only</span>
        <DatePicker label="Workday" shouldDisableDate={isWeekend} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Format YYYY-MM-DD</span>
        <DatePicker label="ISO" format="YYYY-MM-DD" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Format YYYY-MM-DD HH:mm</span>
        <DateTimePicker label="ISO with time" format="YYYY-MM-DD HH:mm" />
      </div>
    </div>
  );
}
