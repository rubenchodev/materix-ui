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
      <Tooltip title="Delete">
        <IconButton icon="delete" />
      </Tooltip>
      <Tooltip title="Add to favorites">
        <IconButton icon="favorite" color="error" />
      </Tooltip>
      <Tooltip title="Saved to your account">
        <Button variant="contained">Save</Button>
      </Tooltip>
      <Tooltip title="Back to the top of the page">
        <Link href="#">Link with tooltip</Link>
      </Tooltip>
    </div>
  );
}
