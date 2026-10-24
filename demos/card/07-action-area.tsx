import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActionArea, CardActions, CardContent, CardMedia } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Action area', es: 'Área de acción' };
export const description = {
  en: '`CardActionArea` turns the image and text into a single clickable zone with ripple, hover and focus. With `clickable` the whole card becomes interactive (`role="button"`, Enter and Space).',
  es: '`CardActionArea` convierte la imagen y el texto en una zona pulsable con ripple, hover y foco. Con `clickable` toda la tarjeta es interactiva (`role="button"`, Enter y Espacio).',
};

export default function Demo() {
  const [status, setStatus] = useState('');
  return (
    <div className="demo-stack">
      <div className="demo-surface">
        <div className="demo-group">
          <span className="demo-label">CardActionArea</span>
          <Card className="demo-fixed-width">
            <CardActionArea onClick={() => setStatus('Clicked the action area.')}>
              <CardMedia
                height={140}
                alt="Colorful domes of Saint Basil's Cathedral"
                image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"
              />
              <CardContent>
                <div className="mtx-card__title">Discover Moscow</div>
                <div>Colorful domes, museums and the most ornate subway in the world.</div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button>Book</Button>
              <Button>Save</Button>
            </CardActions>
          </Card>
        </div>
        <div className="demo-group">
          <span className="demo-label">Clickable card</span>
          <Card
            variant="outlined"
            clickable
            avatar="S"
            title="Settings"
            subheader="Account, privacy and notifications"
            className="demo-fixed-width"
            onClick={() => setStatus('Clicked the clickable card.')}
          >
            <CardContent>The whole card responds to clicks and the keyboard.</CardContent>
          </Card>
        </div>
      </div>
      <p className="demo-status" role="status">
        {status}
      </p>
    </div>
  );
}
