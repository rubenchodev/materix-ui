import { Badge } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`standard` shows the content (a number or short text); `dot` shows an 8px dot with no number.',
  es: '`standard` muestra el contenido (un número o texto corto); `dot` muestra un punto de 8px sin número.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <div className="demo-row mtx-gap-4">
          <Badge badgeContent={4} color="secondary">
            <span className="material-icons" aria-hidden="true">mail</span>
          </Badge>
          <Badge badgeContent="New" color="success">
            <span className="material-icons" aria-hidden="true">inventory_2</span>
          </Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Dot</span>
        <div className="demo-row mtx-gap-4">
          <Badge variant="dot" color="secondary">
            <span className="material-icons" aria-hidden="true">mail</span>
          </Badge>
          <Badge variant="dot" color="error">
            <span className="material-icons" aria-hidden="true">notifications</span>
          </Badge>
        </div>
      </div>
    </>
  );
}
