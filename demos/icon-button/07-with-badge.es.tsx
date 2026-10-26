import { Badge } from '@rubenchodev/materix-react/components/badge';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'With badge', es: 'Con insignia' };
export const description = {
  en: 'A common combination: an IconButton wrapped in a Badge to show counters. The `aria-label` must include the number for screen readers. The button does not clip its content (the ripple is clipped in an inner container), so the badge is never cut off.',
  es: 'Una combinación habitual: un IconButton dentro de un Badge para mostrar contadores. El `aria-label` debe incluir el número para los lectores de pantalla. El botón no recorta su contenido (el ripple se recorta en un contenedor interno), así que la insignia nunca se corta.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Badge badgeContent={4} color="error">
        <IconButton icon="notifications" aria-label="Notificaciones: 4 sin leer" />
      </Badge>
      <Badge badgeContent={12} color="primary">
        <IconButton icon="mail" aria-label="Correo: 12 mensajes nuevos" />
      </Badge>
    </div>
  );
}
