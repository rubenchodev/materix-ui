import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES, SKILLS } from './data';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the clear button; press Tab for focus. `disabled`, `readOnly`, `required`, `error` with `helperText` and `loading`.',
  es: 'Pasa el ratón para ver el botón de limpiar; pulsa Tab para el foco. `disabled`, `readOnly`, `required`, `error` con `helperText` y `loading`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Normal with helper</span>
        <Autocomplete label="Country" options={COUNTRIES} helperText="Type to filter" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled</span>
        <Autocomplete label="Country" options={COUNTRIES} defaultValue="co" disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Read-only</span>
        <Autocomplete label="Country" options={COUNTRIES} defaultValue="mx" readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error + helper</span>
        <Autocomplete label="Country" options={COUNTRIES} error helperText="Select a country from the list" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Required</span>
        <Autocomplete label="Country" options={COUNTRIES} required />
      </div>
      <div className="demo-group">
        <span className="demo-label">Loading</span>
        <Autocomplete label="Users" options={[]} loading />
      </div>
      <div className="demo-group">
        <span className="demo-label">Multiple disabled</span>
        <Autocomplete label="Skills" multiple options={SKILLS} defaultValue={['js', 'python']} disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Multiple read-only</span>
        <Autocomplete label="Skills" multiple options={SKILLS} defaultValue={['ts', 'pg']} readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">No options</span>
        <Autocomplete label="Empty" options={[]} noOptionsText="No items" />
      </div>
    </div>
  );
}
