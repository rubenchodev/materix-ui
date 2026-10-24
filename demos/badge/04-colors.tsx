import { Badge, type BadgeColor } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: 'Without `color` (or with `default`) the badge is neutral gray, as in MUI. The rest use the palette with contrast text.',
  es: 'Sin `color` (o con `default`) la insignia es gris neutro, como en MUI. El resto usa la paleta con texto de contraste.',
};

const colors: BadgeColor[] = ['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success'];

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <div className="demo-row mtx-gap-4">
          {colors.map((color) => (
            <Badge key={color} badgeContent={4} color={color}>
              <span className="material-icons" aria-hidden="true">mail</span>
            </Badge>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Dot</span>
        <div className="demo-row mtx-gap-4">
          {colors.map((color) => (
            <Badge key={color} variant="dot" color={color}>
              <span className="material-icons" aria-hidden="true">mail</span>
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
