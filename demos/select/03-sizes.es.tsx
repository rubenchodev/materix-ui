import { Select } from '@rubenchodev/materix-react/components/select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Medium 56px (default) and small 40px with `size=\"small\"`: the same heights as TextField and Button, so they line up in the same row.",
  es: "Medium 56px (por defecto) y small 40px con `size=\"small\"`: las mismas alturas que TextField y Button, así que se alinean en la misma fila.",
};

const OPTIONS = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Medium · 56px</span>
        <div className="demo-grid-3">
          <Select label="Outlined" options={OPTIONS} />
          <Select label="Filled" variant="filled" options={OPTIONS} />
          <Select label="Standard" variant="standard" options={OPTIONS} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 40px</span>
        <div className="demo-grid-3">
          <Select label="Outlined" size="small" options={OPTIONS} />
          <Select label="Filled" variant="filled" size="small" options={OPTIONS} />
          <Select label="Standard" variant="standard" size="small" options={OPTIONS} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alineación · Select small 40px + TextField small 40px + Button medium 40px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <Select label="Ordenar por" size="small" options={[{ value: 'recent', label: 'Más reciente' }, { value: 'price', label: 'Precio' }]} />
          </div>
          <div className="demo-fixed-width">
            <TextField label="Buscar" size="small" type="search" />
          </div>
          <Button variant="contained">Filtrar</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Alineación · Select medium 56px + Button large 48px + FAB 56px</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <Select label="Proyecto" startIcon="folder" options={[{ value: 'web', label: 'Sitio web' }, { value: 'app', label: 'App móvil' }]} />
          </div>
          <Button variant="contained" size="large">Abrir</Button>
          <Fab icon="add" aria-label="Nuevo proyecto" />
        </div>
      </div>
    </div>
  );
}
