import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Badge } from '@rubenchodev/materix-react/components/badge';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'On icons, avatars and buttons', es: 'Sobre iconos, avatares y botones' };
export const description = {
  en: "The badge wraps any element. With IconButton it can go inside the button, wrapping the icon (MUI pattern), or outside, wrapping the button; the number is announced in the button's `aria-label`.",
  es: 'La insignia envuelve cualquier elemento. Con IconButton puede ir dentro del botón, envolviendo el icono (patrón MUI), o fuera, envolviendo el botón; el número se anuncia en el `aria-label` del botón.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Icon</span>
        <div className="demo-row mtx-gap-4">
          <Badge badgeContent={3} color="primary">
            <span className="material-icons" aria-hidden="true">shopping_cart</span>
          </Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar</span>
        <div className="demo-row mtx-gap-4">
          <Badge badgeContent={2} color="error" overlap="circular">
            <Avatar color="primary">AG</Avatar>
          </Badge>
          <Badge badgeContent={9} color="error">
            <Avatar variant="rounded" color="secondary">CR</Avatar>
          </Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">IconButton and Button</span>
        <div className="demo-row mtx-gap-4">
          <IconButton aria-label="Notifications, 17 unread">
            <Badge badgeContent={17} color="error">
              <span className="material-icons" aria-hidden="true">notifications</span>
            </Badge>
          </IconButton>
          <Badge badgeContent={4} color="primary" overlap="circular">
            <IconButton icon="mail" aria-label="Mail, 4 unread messages" />
          </Badge>
          <Badge badgeContent={8} color="error">
            <Button variant="outlined" aria-label="To do, 8 tasks">To do</Button>
          </Badge>
        </div>
      </div>
    </>
  );
}
