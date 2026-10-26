import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'Wrap a single child with `<Tooltip title="…">`. Hover it or use `Tab`; `Escape` hides it. An icon-only IconButton without `aria-label` receives the title as its accessible name.',
  es: 'Envuelve un único hijo con `<Tooltip title="…">`. Pasa el puntero o usa `Tab`; `Escape` lo oculta. Un IconButton de solo icono sin `aria-label` recibe el título como nombre accesible.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Eliminar">
        <IconButton icon="delete" />
      </Tooltip>
      <Tooltip title="Añadir a favoritos">
        <IconButton icon="favorite" color="error" />
      </Tooltip>
      <Tooltip title="Guardado en tu cuenta">
        <Button variant="contained">Guardar</Button>
      </Tooltip>
      <Tooltip title="Volver al inicio de la página">
        <Link href="#">Enlace con tooltip</Link>
      </Tooltip>
    </div>
  );
}
