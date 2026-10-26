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
      <Tooltip title="Completa los campos obligatorios para continuar">
        <span>
          <Button variant="contained" disabled>
            Continuar
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="No tienes permisos para eliminar">
        <span>
          <IconButton icon="delete" aria-label="Eliminar" disabled />
        </span>
      </Tooltip>
    </div>
  );
}
