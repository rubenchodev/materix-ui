import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'With `size`: large 56px (default), medium 48px and small 40px. The extended FAB is 48px by default, 40px in medium and 34px in small. Each row aligns it with controls of the same height.',
  es: 'Con `size`: large 56px (por defecto), medium 48px y small 40px. El FAB extendido mide 48px por defecto, 40px en medium y 34px en small. Cada fila lo alinea con controles de la misma altura.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Large · 56px (por defecto) — junto a un TextField medium (56px)</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Escribe un mensaje" />
          </div>
          <Fab icon="send" aria-label="Enviar mensaje" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 48px — junto a un Button large, un IconButton large y un FAB extendido</span>
        <div className="demo-row">
          <Fab icon="add" size="medium" aria-label="Crear" />
          <Fab icon="add" label="Crear" />
          <Button variant="outlined" size="large">
            Importar
          </Button>
          <IconButton icon="more_vert" size="large" aria-label="Más opciones" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">
          Small · 40px y extendido medium (40px) — junto a un TextField small y un Button medium
        </span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Nueva tarea" size="small" />
          </div>
          <Fab icon="add" size="small" aria-label="Añadir tarea" />
          <Fab icon="add" label="Añadir" size="medium" />
          <Button variant="text">Cancelar</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Extendido small · 34px</span>
        <div className="demo-row">
          <Fab icon="edit" label="Editar" size="small" />
        </div>
      </div>
    </>
  );
}
