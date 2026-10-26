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
        <span className="demo-label">end (por defecto)</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Copia de seguridad</h3>
            <p>Última copia hace 2 horas.</p>
          </CardContent>
          <CardActions>
            <Button>Ver historial</Button>
            <Button>Restaurar</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">start (estilo MUI)</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Copia de seguridad</h3>
            <p>Última copia hace 2 horas.</p>
          </CardContent>
          <CardActions align="start">
            <Button>Ver historial</Button>
            <Button>Restaurar</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">center</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Plan gratuito</h3>
            <p>Hasta 3 proyectos.</p>
          </CardContent>
          <CardActions align="center">
            <Button variant="contained">Empezar</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">between</span>
        <Card actionsAlign="between" className="demo-fixed-width">
          <CardContent>
            <h3>Pedido #1042</h3>
            <p>En reparto. Llega mañana.</p>
          </CardContent>
          <CardActions>
            <IconButton icon="more_vert" aria-label="Más opciones" />
            <Button variant="contained">Seguir envío</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
