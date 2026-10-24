import { Badge, type BadgeAnchor } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'Position', es: 'Posición' };
export const description = {
  en: '`anchor` places the badge at `top-right` (default), `top-left`, `bottom-right` or `bottom-left`. MUI `anchorOrigin` is also accepted.',
  es: '`anchor` coloca la insignia en `top-right` (por defecto), `top-left`, `bottom-right` o `bottom-left`. También se acepta `anchorOrigin` de MUI.',
};

const anchors: BadgeAnchor[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export default function Demo() {
  return (
    <div className="demo-row mtx-gap-4">
      {anchors.map((anchor) => (
        <Badge key={anchor} badgeContent={3} anchor={anchor} color="primary">
          <span className="material-icons" aria-hidden="true">mail</span>
        </Badge>
      ))}
    </div>
  );
}
