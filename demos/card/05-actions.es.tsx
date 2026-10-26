import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActions, CardContent } from '@rubenchodev/materix-react/components/card';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Actions', es: 'Acciones' };
export const description = {
  en: '`CardActions` is a row with 8px of padding and spacing; its buttons take the compact MUI size and are right-aligned. `mtx-card__actions-end` pushes an element to the end and `disableSpacing` removes the spacing.',
  es: '`CardActions` es una fila con 8px de padding y separación; sus botones toman el tamaño compacto de MUI y se alinean a la derecha. `mtx-card__actions-end` empuja un elemento al final y `disableSpacing` quita la separación.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Botones de texto</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Plan Pro</h3>
            <p>Proyectos ilimitados y soporte prioritario.</p>
          </CardContent>
          <CardActions>
            <Button>Comparar</Button>
            <Button>Elegir plan</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Iconos y una acción al final</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Receta guardada</h3>
            <p>Tiempo de preparación: 45 minutos.</p>
          </CardContent>
          <CardActions>
            <IconButton icon="favorite_border" aria-label="Me gusta" />
            <IconButton icon="share" aria-label="Compartir" />
            <Button variant="contained" className="mtx-card__actions-end">
              Cocinar
            </Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin separación</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Compacta</h3>
            <p>Acciones juntas.</p>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton icon="thumb_up" aria-label="Útil" />
            <IconButton icon="thumb_down" aria-label="No útil" />
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
