import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: "`variant`: `outlined` (default, with notch), `filled` and `standard`.",
  es: "`variant`: `outlined` (por defecto, con muesca), `filled` y `standard`.",
};

const COUNTRIES = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <Select label="País" variant="outlined" options={COUNTRIES} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Filled</span>
        <Select label="País" variant="filled" options={COUNTRIES} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <Select label="País" variant="standard" options={COUNTRIES} />
      </div>
    </div>
  );
}
