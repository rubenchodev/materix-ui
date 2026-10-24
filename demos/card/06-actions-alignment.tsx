import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActions, CardContent } from '@rubenchodev/materix-react/components/card';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Actions alignment', es: 'Alineación de las acciones' };
export const description = {
  en: 'Actions are right-aligned by default (a deliberate deviation from MUI). `align="start"` restores the MUI layout; `center` and `between` are also available, and `actionsAlign` on the card sets all its rows.',
  es: 'Las acciones van a la derecha por defecto (desviación consciente de MUI). `align="start"` recupera el estilo MUI; también hay `center` y `between`, y `actionsAlign` en la tarjeta fija todas sus filas.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">end (default)</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Backup</h3>
            <p>Last backup 2 hours ago.</p>
          </CardContent>
          <CardActions>
            <Button>View history</Button>
            <Button>Restore</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">start (MUI style)</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Backup</h3>
            <p>Last backup 2 hours ago.</p>
          </CardContent>
          <CardActions align="start">
            <Button>View history</Button>
            <Button>Restore</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">center</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Free plan</h3>
            <p>Up to 3 projects.</p>
          </CardContent>
          <CardActions align="center">
            <Button variant="contained">Get started</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">between</span>
        <Card actionsAlign="between" className="demo-fixed-width">
          <CardContent>
            <h3>Order #1042</h3>
            <p>Out for delivery. Arrives tomorrow.</p>
          </CardContent>
          <CardActions>
            <IconButton icon="more_vert" aria-label="More options" />
            <Button variant="contained">Track shipment</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
