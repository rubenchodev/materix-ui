import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Slider } from '@rubenchodev/materix-react/components/slider';
import type { SliderValue } from '@rubenchodev/materix-react/components/slider';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Casos de uso' };
export const description = {
  en: "A controlled price filter: onChange updates the summary while dragging and the form submits price-start and price-end.",
  es: "Un filtro de precio controlado: onChange actualiza el resumen durante el arrastre y el formulario envía price-start y price-end.",
};

export default function Demo() {
  const [price, setPrice] = useState<SliderValue>([200, 700]);
  const [status, setStatus] = useState('');
  const [low, high] = price as number[];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus(`Aplicado: price-start=${data.get('price-start')}, price-end=${data.get('price-end')}`);
  };

  return (
    <form className="demo-stack demo-wide" aria-label="Filtro de productos" onSubmit={submit}>
      <Typography variant="subtitle2" component="span" id="slider-filter-label">
        Precio (USD)
      </Typography>
      <Slider
        name="price"
        min={0}
        max={1000}
        step={10}
        value={price}
        minDistance={50}
        valueLabelDisplay="auto"
        valueLabelFormat="${value}"
        aria-labelledby="slider-filter-label"
        onChange={(_, value) => setPrice(value)}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" component="span" aria-live="polite">
          ${low} – ${high}
        </Typography>
        <Button variant="contained" type="submit">
          Aplicar filtro
        </Button>
      </Stack>
      {status ? (
        <Typography variant="body2" color="text-secondary">
          {status}
        </Typography>
      ) : null}
    </form>
  );
}
