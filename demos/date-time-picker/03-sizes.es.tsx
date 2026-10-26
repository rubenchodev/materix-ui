import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { DatePicker, DateTimePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Medium 56px (default) and small 40px with `size="small"`.',
  es: 'Mediano 56px (por defecto) y pequeño 40px con `size="small"`.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Medium · 56px</span>
        <div className="demo-grid-3">
          <DatePicker label="Fecha" />
          <TimePicker label="Hora" variant="filled" />
          <DateTimePicker label="Fecha y hora" variant="standard" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 40px</span>
        <div className="demo-grid-3">
          <DatePicker label="Fecha" size="small" />
          <TimePicker label="Hora" variant="filled" size="small" />
          <DateTimePicker label="Fecha y hora" variant="standard" size="small" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alineación · Picker small 40px + Button medium 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <DatePicker label="Desde" size="small" />
          </div>
          <Button variant="contained">Buscar</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alineación · Picker medium 56px + Button large 48px + FAB 56px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <DateTimePicker label="Recordatorio" />
          </div>
          <Button variant="contained" size="large">
            Programar
          </Button>
          <Fab icon="alarm_add" aria-label="Nuevo recordatorio" />
        </div>
      </div>
    </div>
  );
}
