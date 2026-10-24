import { Badge } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'Wrap the content with `Badge` and pass the value in `badgeContent`; the component creates and positions the badge.',
  es: 'Envuelve el contenido con `Badge` y pasa el valor en `badgeContent`; el componente crea y posiciona la insignia.',
};

export default function Demo() {
  return (
    <div className="demo-row mtx-gap-4">
      <Badge badgeContent={4} color="primary">
        <span className="material-icons" aria-hidden="true">mail</span>
      </Badge>
      <Badge badgeContent={12} color="error">
        <span className="material-icons" aria-hidden="true">notifications</span>
      </Badge>
      <Badge variant="dot" color="success">
        <span className="material-icons" aria-hidden="true">chat</span>
      </Badge>
    </div>
  );
}
