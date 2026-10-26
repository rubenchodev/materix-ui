import { Button } from '@rubenchodev/materix-react/components/button';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Three sizes with `size`: large 48px, medium 40px (default) and small 32px. The icon keeps its native 24px grid; only the touch area changes. Each row aligns it with controls of the same height.',
  es: 'Tres tamaños con `size`: large 48px, medium 40px (por defecto) y small 32px. El icono conserva su cuadrícula nativa de 24px; solo cambia el área táctil. Cada fila lo alinea con controles de la misma altura.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Large · 48px — junto a un Button large y un FAB medium</span>
        <div className="demo-row">
          <IconButton icon="edit" size="large" aria-label="Editar" />
          <IconButton icon="content_copy" size="large" aria-label="Duplicar" />
          <Button variant="contained" size="large">
            Publicar
          </Button>
          <Fab icon="add" size="medium" aria-label="Crear" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 40px (por defecto) — junto a un TextField small y un Button medium</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Buscar archivos" size="small" type="search" />
          </div>
          <IconButton icon="filter_list" aria-label="Filtrar" />
          <IconButton icon="sort" aria-label="Ordenar" />
          <Button variant="outlined">Subir</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 32px — junto a un Button small y un Chip</span>
        <div className="demo-row">
          <IconButton icon="close" size="small" aria-label="Cerrar" />
          <IconButton icon="more_vert" size="small" aria-label="Más opciones" />
          <Button variant="text" size="small">
            Ver todo
          </Button>
          <Chip label="Borradores" variant="outlined" />
        </div>
      </div>
    </>
  );
}
