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
          <DatePicker label="Date" />
          <TimePicker label="Time" variant="filled" />
          <DateTimePicker label="Date and time" variant="standard" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 40px</span>
        <div className="demo-grid-3">
          <DatePicker label="Date" size="small" />
          <TimePicker label="Time" variant="filled" size="small" />
          <DateTimePicker label="Date and time" variant="standard" size="small" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alignment · small Picker 40px + medium Button 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <DatePicker label="From" size="small" />
          </div>
          <Button variant="contained">Search</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alignment · medium Picker 56px + large Button 48px + FAB 56px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <DateTimePicker label="Reminder" />
          </div>
          <Button variant="contained" size="large">
            Schedule
          </Button>
          <Fab icon="alarm_add" aria-label="New reminder" />
        </div>
      </div>
    </div>
  );
}
