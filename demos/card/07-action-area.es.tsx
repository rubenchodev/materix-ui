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
            <CardActionArea onClick={() => setStatus('Clic en el área de acción.')}>
              <CardMedia
                height={140}
                alt="Cúpulas de colores de la catedral de San Basilio"
                image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"
              />
              <CardContent>
                <div className="mtx-card__title">Descubre Moscú</div>
                <div>Cúpulas de colores, museos y el metro más ornamentado del mundo.</div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button>Reservar</Button>
              <Button>Guardar</Button>
            </CardActions>
          </Card>
        </div>
        <div className="demo-group">
          <span className="demo-label">Tarjeta pulsable</span>
          <Card
            variant="outlined"
            clickable
            avatar="C"
            title="Configuración"
            subheader="Cuenta, privacidad y notificaciones"
            className="demo-fixed-width"
            onClick={() => setStatus('Clic en la tarjeta pulsable.')}
          >
            <CardContent>Toda la tarjeta responde al clic y al teclado.</CardContent>
          </Card>
        </div>
      </div>
      <p className="demo-status" role="status">
        {status}
      </p>
    </div>
  );
}
