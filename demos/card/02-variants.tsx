import { Card, CardContent } from '@rubenchodev/materix-react/components/card';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'By default the card has elevation 1. `variant="outlined"` outlines it with a border, `raised` raises it to 8, `elevation` accepts 0–8, 12, 16 and 24, and `square` removes the radius.',
  es: 'Por defecto la tarjeta tiene elevación 1. `variant="outlined"` la delimita con un borde, `raised` la eleva a 8, `elevation` acepta 0–8, 12, 16 y 24, y `square` quita el radio.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Elevation (1)</span>
        <Card>
          <CardContent>
            <h3>Default</h3>
            <p>Elevation 1 shadow.</p>
          </CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <Card variant="outlined">
          <CardContent>
            <h3>Outlined</h3>
            <p>Border, no shadow.</p>
          </CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Raised (8)</span>
        <Card raised>
          <CardContent>
            <h3>Raised</h3>
            <p>Prominent shadow.</p>
          </CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Elevation 4 · square</span>
        <Card elevation={4} square>
          <CardContent>
            <h3>Square</h3>
            <p>No radius.</p>
          </CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom typography (Typography)</span>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              $48,290
            </Typography>
            <Typography variant="caption" component="p">
              The content&apos;s h1–h6 and p styles have zero specificity: the typography class wins.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
