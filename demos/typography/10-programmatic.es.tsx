import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Typography, type TypographyVariant } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Typography has no methods or events: render it from your data and change `variant` like any other prop.',
  es: 'Typography no tiene métodos ni eventos: renderízalo a partir de tus datos y cambia `variant` como cualquier otra prop.',
};

const variants: TypographyVariant[] = ['h5', 'h6', 'subtitle1', 'overline'];

export default function Demo() {
  const [count, setCount] = useState(0);
  const items = Array.from({ length: count }, (_, i) => ({ n: i + 1, variant: variants[i % variants.length] }));
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setCount((n) => n + 1)}>
          Añadir título dinámico
        </Button>
        <Button variant="text" onClick={() => setCount(0)}>
          Limpiar
        </Button>
      </div>
      <div>
        {items.map(({ n, variant }) => (
          <Typography key={n} variant={variant} component="p">
            Título dinámico {n} ({variant})
          </Typography>
        ))}
      </div>
      <pre className="demo-log" aria-live="polite">
        {items.map(({ variant }) => `<Typography variant="${variant}"> → mtx-typography mtx-typography--${variant}`).join('\n')}
      </pre>
    </div>
  );
}
