import { useEffect, useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: '`lockScroll` locks the `<body>` scroll (modal manager shared with Dialog) and `inertOthers` marks the rest of the page as `inert`, so Tab and screen readers cannot reach the covered content. Both are restored on close.',
  es: '`lockScroll` bloquea el scroll del `<body>` (gestor modal compartido con Dialog) e `inertOthers` marca el resto de la página como `inert`, así que Tab y los lectores de pantalla no llegan al contenido cubierto. Ambos se restauran al cerrar.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Lock scroll and inert (3 s)
      </Button>
      <Backdrop open={open} lockScroll inertOthers>
        <CircularProgress color="inherit" label="Processing payment" />
      </Backdrop>
    </Stack>
  );
}
