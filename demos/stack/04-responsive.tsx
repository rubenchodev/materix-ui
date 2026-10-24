import './demo.css';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Responsive', es: 'Responsive' };

export const description = {
  en: '`direction` and `spacing` accept an object per breakpoint (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) that applies from that width up. Here: a column with 8px on mobile, a row with 16px from 600px and 32px from 900px.',
  es: '`direction` y `spacing` aceptan un objeto por breakpoint (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) que aplica desde ese ancho hacia arriba. Aquí: columna con 8px en móvil, fila con 16px desde 600px y 32px desde 900px.',
};

export default function Demo() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
      <div className="demo-stack-item">One</div>
      <div className="demo-stack-item">Two</div>
      <div className="demo-stack-item">Three</div>
    </Stack>
  );
}
