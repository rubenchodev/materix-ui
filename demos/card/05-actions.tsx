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
        <span className="demo-label">Text buttons</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Pro plan</h3>
            <p>Unlimited projects and priority support.</p>
          </CardContent>
          <CardActions>
            <Button>Compare</Button>
            <Button>Choose plan</Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icons and an action at the end</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Saved recipe</h3>
            <p>Prep time: 45 minutes.</p>
          </CardContent>
          <CardActions>
            <IconButton icon="favorite_border" aria-label="Like" />
            <IconButton icon="share" aria-label="Share" />
            <Button variant="contained" className="mtx-card__actions-end">
              Cook
            </Button>
          </CardActions>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">No spacing</span>
        <Card className="demo-fixed-width">
          <CardContent>
            <h3>Compact</h3>
            <p>Actions side by side.</p>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton icon="thumb_up" aria-label="Helpful" />
            <IconButton icon="thumb_down" aria-label="Not helpful" />
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
