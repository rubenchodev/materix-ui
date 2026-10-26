import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Medium 56px (default) and small 40px with `size="small"` (14px text). A small NativeSelect lines up with a small TextField and a medium Button; a medium one with a large Button and a FAB.',
  es: 'Medium 56px (por defecto) y small 40px con `size="small"` (texto de 14px). Un NativeSelect small se alinea con un TextField small y un Button medium; uno medium, con un Button large y un FAB.',
};

const OPTIONS = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      {(['medium', 'small'] as const).map((size) => (
        <div key={size} className="demo-group">
          <span className="demo-label">{size === 'medium' ? 'Medium · 56px' : 'Small · 40px'}</span>
          <div className="demo-grid-3">
            <NativeSelect size={size} variant="outlined" label="Outlined" options={OPTIONS} />
            <NativeSelect size={size} variant="filled" label="Filled" options={OPTIONS} />
            <NativeSelect size={size} variant="standard" label="Standard" options={OPTIONS} />
          </div>
        </div>
      ))}
      <div className="demo-group">
        <span className="demo-label">Alineación · NativeSelect small 40px + TextField small 40px + Button medium 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <NativeSelect
              size="small"
              variant="outlined"
              label="Por página"
              options={[{ value: '10', label: '10' }, { value: '25', label: '25' }, { value: '50', label: '50' }]}
            />
          </div>
          <div className="demo-fixed-width">
            <TextField size="small" label="Ir a la página" inputMode="numeric" />
          </div>
          <Button variant="contained">Ir</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alineación · NativeSelect medium 56px + Button large 48px + FAB 56px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <NativeSelect
              variant="outlined"
              label="Plantilla"
              options={[{ value: 'blank', label: 'En blanco' }, { value: 'invoice', label: 'Factura' }]}
            />
          </div>
          <Button variant="contained" size="large">Crear</Button>
          <Fab icon="add" aria-label="Nueva plantilla" />
        </div>
      </div>
    </div>
  );
}
