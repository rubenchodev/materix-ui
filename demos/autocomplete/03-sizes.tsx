import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import type { AutocompleteSize } from '@rubenchodev/materix-react/components/autocomplete';
import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { COUNTRIES, SKILLS } from './data';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Medium 56px (default) and small 40px with `size="small"`, aligned with a TextField and Button of the same height.',
  es: 'Medium 56px (por defecto) y small 40px con `size="small"`, alineados con un TextField y un Button de la misma altura.',
};

const SIZES: { size: AutocompleteSize; label: string }[] = [
  { size: 'medium', label: 'Medium · 56px' },
  { size: 'small', label: 'Small · 40px' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      {SIZES.map(({ size, label }) => (
        <div className="demo-group" key={size}>
          <span className="demo-label">{label}</span>
          <div className="demo-grid-3">
            <Autocomplete label="Outlined" size={size} options={COUNTRIES} defaultValue="co" />
            <Autocomplete label="Filled" variant="filled" size={size} options={COUNTRIES} defaultValue="mx" />
            <Autocomplete label="Standard" variant="standard" size={size} options={COUNTRIES} defaultValue="pe" />
          </div>
        </div>
      ))}
      <div className="demo-group">
        <span className="demo-label">Alignment · Autocomplete small 40px + TextField small 40px + Button medium 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <Autocomplete label="Destination" size="small" options={COUNTRIES} />
          </div>
          <div className="demo-fixed-width">
            <TextField label="Passengers" size="small" type="number" defaultValue="2" inputProps={{ min: 1 }} />
          </div>
          <Button variant="contained">Search flights</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Multiple small · 24px chips</span>
        <div className="demo-wide">
          <Autocomplete label="Skills" size="small" multiple options={SKILLS} defaultValue={['js', 'css']} />
        </div>
      </div>
    </div>
  );
}
