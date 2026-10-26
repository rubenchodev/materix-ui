import { DateRangePicker, DateTimeRangePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Ranges', es: 'Rangos' };
export const description = {
  en: 'Start and end with two clicks on the same calendar (the span is previewed on hover). In date-time mode, once the days are chosen the start and end time tabs appear.',
  es: 'Inicio y fin con dos clics en el mismo calendario (el tramo se previsualiza al pasar el ratón). En modo fecha y hora, al elegir los días aparecen las pestañas de hora de inicio y fin.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">DateRangePicker</span>
        <DateRangePicker label="Estancia" />
      </div>
      <div className="demo-group">
        <span className="demo-label">DateTimeRangePicker</span>
        <DateTimeRangePicker label="Ventana de mantenimiento" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Valor inicial</span>
        <DateRangePicker label="Vacaciones" defaultValue="2026-07-01 - 2026-07-15" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Rango con AM/PM · reloj</span>
        <DateTimeRangePicker label="Turno" ampm timeView="dial" />
      </div>
    </div>
  );
}
