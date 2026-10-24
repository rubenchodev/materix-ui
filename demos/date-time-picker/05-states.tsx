import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { DatePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Helper, error with message, required, disabled and read-only, as in TextField. With `disabled` or `readOnly` the calendar button is disabled and the picker does not open.',
  es: 'Ayuda, error con mensaje, obligatorio, deshabilitado y solo lectura, como en TextField. Con `disabled` o `readOnly` el botón del calendario se deshabilita y el selector no se abre.',
};

export default function Demo() {
  const [disabled, setDisabled] = useState(false);
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">Helper</span>
        <DatePicker label="Start" helperText="MM/DD/YYYY" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error + message</span>
        <DatePicker label="Due date" error helperText="The date has already passed" defaultValue="2020-01-01" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Required</span>
        <TimePicker label="Time" required />
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled</span>
        <DatePicker label="Locked" defaultValue="2026-08-15" disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Read-only</span>
        <DatePicker label="Issued" defaultValue="2026-03-02" readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">defaultValue (floating label)</span>
        <DatePicker label="Start" defaultValue="2026-10-20" />
      </div>
      <div className="demo-group">
        <span className="demo-label">defaultValue (time)</span>
        <TimePicker label="Alarm" defaultValue="07:30" />
      </div>
      <div className="demo-group">
        <span className="demo-label">disabled = !disabled</span>
        <div className="demo-stack">
          <DatePicker label="Toggleable" disabled={disabled} />
          <Button variant="outlined" size="small" onClick={() => setDisabled((v) => !v)}>
            {disabled ? 'enable' : 'disable'}
          </Button>
        </div>
      </div>
    </div>
  );
}
