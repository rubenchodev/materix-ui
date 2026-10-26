import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Badge } from '@rubenchodev/materix-react/components/badge';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'An action bar with counters and an avatar with an online status.',
  es: 'Una barra de acciones con contadores y un avatar con estado en línea.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
        <IconButton aria-label="Notificaciones, 17 sin leer">
          <Badge badgeContent={17} color="error">
            <span className="material-icons" aria-hidden="true">notifications</span>
          </Badge>
        </IconButton>
        <Badge badgeContent={4} color="primary" overlap="circular">
          <IconButton icon="mail" aria-label="Correo, 4 mensajes sin leer" />
        </Badge>
        <Badge badgeContent={17} color="error" overlap="circular">
          <IconButton icon="notifications" aria-label="Notificaciones, 17 nuevas" />
        </Badge>
        <Badge variant="dot" color="secondary" overlap="circular">
          <IconButton icon="shopping_cart" aria-label="Carrito, artículos pendientes" />
        </Badge>
        <Badge variant="dot" color="success" overlap="circular" anchor="bottom-right">
          <Avatar src="https://i.pravatar.cc/120?img=47" alt="Ana Verde, en línea" />
        </Badge>
      </div>
    </div>
  );
}
