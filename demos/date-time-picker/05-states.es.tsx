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
        <span className="demo-label">Ayuda</span>
        <DatePicker label="Inicio" helperText="DD/MM/AAAA" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error + mensaje</span>
        <DatePicker label="Vencimiento" error helperText="La fecha ya pasó" defaultValue="2020-01-01" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Obligatorio</span>
        <TimePicker label="Hora" required />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado</span>
        <DatePicker label="Bloqueado" defaultValue="2026-08-15" disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo lectura</span>
        <DatePicker label="Emitida" defaultValue="2026-03-02" readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">defaultValue (etiqueta flotante)</span>
        <DatePicker label="Inicio" defaultValue="2026-10-20" />
      </div>
      <div className="demo-group">
        <span className="demo-label">defaultValue (hora)</span>
        <TimePicker label="Alarma" defaultValue="07:30" />
      </div>
      <div className="demo-group">
        <span className="demo-label">disabled = !disabled</span>
        <div className="demo-stack">
          <DatePicker label="Conmutable" disabled={disabled} />
          <Button variant="outlined" size="small" onClick={() => setDisabled((v) => !v)}>
            {disabled ? 'habilitar' : 'deshabilitar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
