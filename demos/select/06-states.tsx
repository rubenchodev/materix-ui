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
          <span className="demo-label">Helper</span>
          <Select label="Residence" helperText="Where you pay taxes" options={[{ value: 'co', label: 'Colombia' }, { value: 'mx', label: 'Mexico' }]} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error + message</span>
          <Select label="Currency" error helperText="Select a currency" required>
            <option value="">Not selected</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </Select>
        </div>
        <div className="demo-group">
          <span className="demo-label">Disabled</span>
          <Select label="Plan" disabled options={[{ value: 'pro', label: 'Professional' }]} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Read-only</span>
          <Select label="Region" readOnly options={[{ value: 'latam', label: 'Latin America' }, { value: 'eu', label: 'Europe' }]} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error and disabled in filled and standard</span>
        <div className="demo-grid-4">
          <Select label="Filled error" variant="filled" error helperText="Required" options={[{ value: '', label: '—' }, { value: 'a', label: 'A' }]} />
          <Select label="Standard error" variant="standard" error helperText="Required" options={[{ value: '', label: '—' }, { value: 'a', label: 'A' }]} />
          <Select label="Filled disabled" variant="filled" disabled options={[{ value: 'a', label: 'Locked' }]} />
          <Select label="Standard disabled" variant="standard" disabled options={[{ value: 'a', label: 'Locked' }]} />
        </div>
      </div>
    </div>
  );
}
