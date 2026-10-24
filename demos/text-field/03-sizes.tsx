import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import type { TextFieldSize } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Large 48px with `size="large"`, medium 56px (default) and small 40px with `size="small"`. The alignment rows show the field next to components of the same height.',
  es: 'Large 48px con `size="large"`, medium 56px (por defecto) y small 40px con `size="small"`. Las filas de alineación muestran el campo junto a componentes de la misma altura.',
};

const SIZES: { size?: TextFieldSize; label: string }[] = [
  { size: 'large', label: 'Large · 48px' },
  { label: 'Medium · 56px' },
  { size: 'small', label: 'Small · 40px' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      {SIZES.map(({ size, label }) => (
        <div className="demo-group" key={label}>
          <span className="demo-label">{label}</span>
          <div className="demo-grid-3">
            <TextField label="Outlined" size={size} />
            <TextField label="Filled" variant="filled" size={size} />
            <TextField label="Standard" variant="standard" size={size} />
          </div>
        </div>
      ))}
      <div className="demo-group">
        <span className="demo-label">Alignment · TextField small 40px + Button medium 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Discount code" size="small" />
          </div>
          <Button variant="contained">Apply</Button>
          <Button variant="outlined">Remove</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alignment · TextField large 48px + Button large 48px + IconButton large 48px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Newsletter email" size="large" type="email" />
          </div>
          <Button variant="contained" size="large">
            Subscribe
          </Button>
          <IconButton size="large" icon="more_vert" aria-label="More options" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alignment · TextField medium 56px + Button large 48px + FAB 56px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Search products" startIcon="search" type="search" />
          </div>
          <Button variant="contained" size="large">
            Search
          </Button>
          <Fab icon="add" aria-label="Add product" />
        </div>
      </div>
    </div>
  );
}
