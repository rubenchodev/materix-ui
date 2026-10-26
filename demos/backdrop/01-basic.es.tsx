import { useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'The simplest form: `<Backdrop open>` with the content to center. `closeOnClick` and `closeOnEscape` ask to close it through `onClose`, which updates the state. The content is white, so `CircularProgress color="inherit"` stands out in both themes.',
  es: 'La forma más simple: `<Backdrop open>` con el contenido a centrar. `closeOnClick` y `closeOnEscape` solicitan el cierre mediante `onClose`, que actualiza el estado. El contenido es blanco, así que `CircularProgress color="inherit"` destaca en ambos temas.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Mostrar backdrop
      </Button>
      <Backdrop open={open} onClose={() => setOpen(false)} closeOnClick closeOnEscape>
        <CircularProgress color="inherit" label="Cargando" />
      </Backdrop>
    </Stack>
  );
}
