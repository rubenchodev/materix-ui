import { useState } from 'react';
import type { FormEvent } from 'react';
import { Rating } from '@rubenchodev/materix-react/components/rating';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardContent } from '@rubenchodev/materix-react/components/card';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Casos de uso reales' };
export const description = {
  en: "A product card with the read-only average and a review form that submits the value like any other radio.",
  es: "Una tarjeta de producto con la media en solo lectura y un formulario de reseña que envía el valor como cualquier otro radio.",
};

export default function Demo() {
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const score = new FormData(event.currentTarget).get('review-score');
    setStatus(score ? `¡Gracias! Tu valoración: ${String(score)}.` : 'Elige primero una valoración.');
  };

  return (
    <div className="demo-grid-2">
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" component="h3">Auriculares inalámbricos</Typography>
          <div className="demo-row">
            <Rating value={4.5} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text-secondary">4,5 · 1.284 opiniones</Typography>
          </div>
        </CardContent>
      </Card>
      <form className="demo-stack" aria-label="Escribir opinión" onSubmit={handleSubmit}>
        <Typography variant="subtitle2" component="span" id="rating-review-label">Tu valoración</Typography>
        <Rating name="review-score" aria-labelledby="rating-review-label" />
        <div className="demo-row">
          <Button variant="contained" type="submit">Enviar opinión</Button>
          <span className="demo-status" role="status">{status}</span>
        </div>
      </form>
    </div>
  );
}
