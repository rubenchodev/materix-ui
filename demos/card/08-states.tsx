import { Card, CardActionArea, CardContent } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Normal, hover and focus (hover or use Tab) and disabled. `disabled` lowers the opacity, removes the pointer and takes the card or action area out of the tab order.',
  es: 'Normal, hover y foco (pasa el ratón o usa Tab) y deshabilitado. `disabled` reduce la opacidad, quita el puntero y saca la tarjeta o el área de acción del orden de tabulación.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Clickable · normal</span>
        <Card clickable title="Normal" subheader="Hover raises to 4" className="demo-fixed-width">
          <CardContent>Interactive.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Clickable · disabled</span>
        <Card clickable disabled title="Disabled" subheader="aria-disabled=true" className="demo-fixed-width">
          <CardContent>Not interactive.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">ActionArea · disabled</span>
        <Card className="demo-fixed-width">
          <CardActionArea disabled>
            <CardContent>
              <div className="mtx-card__title">Disabled area</div>
              <div>The native button is disabled.</div>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}
