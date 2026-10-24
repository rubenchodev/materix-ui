import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Disabled elements', es: 'Elementos deshabilitados' };
export const description = {
  en: 'Disabled elements don\'t receive pointer or focus events: wrap them with a `<span>` so the tooltip can still explain why they are unavailable, as MUI recommends.',
  es: 'Los elementos deshabilitados no reciben eventos de puntero ni de foco: envuélvelos en un `<span>` para que el tooltip siga explicando por qué no están disponibles, como recomienda MUI.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Fill in the required fields to continue">
        <span>
          <Button variant="contained" disabled>
            Continue
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="You don't have permission to delete">
        <span>
          <IconButton icon="delete" aria-label="Delete" disabled />
        </span>
      </Tooltip>
    </div>
  );
}
