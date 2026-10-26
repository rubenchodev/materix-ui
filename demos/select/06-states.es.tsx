import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "`helperText`, `error`, `disabled` and `readOnly`. Use Tab to see the focus and Enter to open.",
  es: "`helperText`, `error`, `disabled` y `readOnly`. Usa Tab para ver el foco y Enter para abrir.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-4">
        <div className="demo-group">
          <span className="demo-label">Texto de ayuda</span>
          <Select label="País de residencia" helperText="Donde tributas actualmente" options={[{ value: 'co', label: 'Colombia' }, { value: 'mx', label: 'México' }]} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error + mensaje</span>
          <Select label="Moneda" error helperText="Selecciona una divisa" required>
            <option value="">Sin seleccionar</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </Select>
        </div>
        <div className="demo-group">
          <span className="demo-label">Deshabilitado</span>
          <Select label="Plan" disabled options={[{ value: 'pro', label: 'Profesional' }]} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Solo lectura</span>
          <Select label="Región" readOnly options={[{ value: 'latam', label: 'Latinoamérica' }, { value: 'eu', label: 'Europa' }]} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error y deshabilitado en filled y standard</span>
        <div className="demo-grid-4">
          <Select label="Filled con error" variant="filled" error helperText="Obligatorio" options={[{ value: '', label: '—' }, { value: 'a', label: 'A' }]} />
          <Select label="Standard con error" variant="standard" error helperText="Obligatorio" options={[{ value: '', label: '—' }, { value: 'a', label: 'A' }]} />
          <Select label="Filled deshabilitado" variant="filled" disabled options={[{ value: 'a', label: 'Bloqueado' }]} />
          <Select label="Standard deshabilitado" variant="standard" disabled options={[{ value: 'a', label: 'Bloqueado' }]} />
        </div>
      </div>
    </div>
  );
}
