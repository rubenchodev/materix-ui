import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "`size` on the group: large 56px aligns with a medium Text Field, medium 48px with a large Button and small 40px with a medium Button and a small Text Field. Only the padding changes; the icon keeps its 24px grid.",
  es: "`size` en el grupo: large 56px alinea con un Text Field medium, medium 48px con un Button large y small 40px con un Button medium y un Text Field small. Solo cambia el padding; el icono conserva su cuadrícula de 24px.",
};

function ViewGroup({ size }: { size: 'small' | 'medium' | 'large' }) {
  return (
    <ToggleButtonGroup exclusive size={size} defaultValue="list" aria-label={`View (${size})`}>
      <ToggleButton value="list" icon="view_list" aria-label="List" />
      <ToggleButton value="module" icon="view_module" aria-label="Modules" />
      <ToggleButton value="quilt" icon="view_quilt" aria-label="Quilt" />
    </ToggleButtonGroup>
  );
}

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Large · 56px (aligns with Text Field medium)</span>
        <div className="demo-row">
          <ViewGroup size="large" />
          <div className="demo-fixed-width">
            <TextField label="Search" type="search" />
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 48px (default, aligns with Button large)</span>
        <div className="demo-row">
          <ViewGroup size="medium" />
          <Button variant="contained" size="large">
            Apply
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 40px (aligns with Button medium and Text Field small)</span>
        <div className="demo-row">
          <ViewGroup size="small" />
          <Button variant="outlined">Filter</Button>
          <div className="demo-fixed-width">
            <TextField label="Search" type="search" size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}
