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
      <div className="demo-row mtx-gap-4">
        <IconButton aria-label="Notifications, 17 unread">
          <Badge badgeContent={17} color="error">
            <span className="material-icons" aria-hidden="true">notifications</span>
          </Badge>
        </IconButton>
        <Badge badgeContent={4} color="primary" overlap="circular">
          <IconButton icon="mail" aria-label="Mail, 4 unread messages" />
        </Badge>
        <Badge badgeContent={17} color="error" overlap="circular">
          <IconButton icon="notifications" aria-label="Notifications, 17 new" />
        </Badge>
        <Badge variant="dot" color="secondary" overlap="circular">
          <IconButton icon="shopping_cart" aria-label="Cart, items pending" />
        </Badge>
        <Badge variant="dot" color="success" overlap="circular" anchor="bottom-right">
          <Avatar src="https://i.pravatar.cc/120?img=47" alt="Anna Green, online" />
        </Badge>
      </div>
    </div>
  );
}
