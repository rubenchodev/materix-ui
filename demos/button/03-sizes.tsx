import { Button } from '@rubenchodev/materix-react/components/button';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Three canonical heights with `size`: large 48px, medium 40px (default) and small 32px. Each row aligns the button with other controls of the same height to check that they share the baseline.",
  es: "Tres alturas canónicas con `size`: large 48px, medium 40px (por defecto) y small 32px. Cada fila alinea el botón con otros controles de la misma altura para comprobar que comparten la línea base.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Large · 48px — next to IconButton large and FAB medium (48px)</span>
        <div className="demo-row">
          <Button variant="contained" size="large">Search</Button>
          <Button variant="outlined" size="large">Filters</Button>
          <Button size="large">Clear</Button>
          <IconButton icon="tune" size="large" aria-label="Search settings" />
          <Fab icon="add" size="medium" aria-label="Create" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 40px (default) — next to TextField small (40px)</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Email" size="small" type="email" />
          </div>
          <Button variant="contained">Subscribe</Button>
          <Button variant="outlined">Skip</Button>
          <IconButton icon="help_outline" aria-label="Help" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 32px — next to IconButton small and Chip (32px)</span>
        <div className="demo-row">
          <Button variant="contained" size="small">Filter</Button>
          <Button variant="outlined" size="small">Export</Button>
          <Button size="small">Reset</Button>
          <IconButton icon="more_vert" size="small" aria-label="More options" />
          <Chip label="Active" variant="outlined" />
        </div>
      </div>
    </div>
  );
}
