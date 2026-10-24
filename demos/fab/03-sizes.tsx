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
        <span className="demo-label">Large · 56px (default) — next to a medium TextField (56px)</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Type a message" />
          </div>
          <Fab icon="send" aria-label="Send message" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 48px — next to a large Button, a large IconButton and an extended FAB</span>
        <div className="demo-row">
          <Fab icon="add" size="medium" aria-label="Create" />
          <Fab icon="add" label="Create" />
          <Button variant="outlined" size="large">
            Import
          </Button>
          <IconButton icon="more_vert" size="large" aria-label="More options" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">
          Small · 40px and medium extended (40px) — next to a small TextField and a medium Button
        </span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="New task" size="small" />
          </div>
          <Fab icon="add" size="small" aria-label="Add task" />
          <Fab icon="add" label="Add" size="medium" />
          <Button variant="text">Cancel</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small extended · 34px</span>
        <div className="demo-row">
          <Fab icon="edit" label="Edit" size="small" />
        </div>
      </div>
    </>
  );
}
