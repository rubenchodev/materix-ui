import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'The simplest form: `<Snackbar open message>`. `onClose(event, reason)` asks to close it with Escape, a click outside or, with `autoHideDuration`, when the time runs out.',
  es: 'La forma más simple: `<Snackbar open message>`. `onClose(event, reason)` solicita el cierre con Escape, un clic fuera o, con `autoHideDuration`, al agotarse el tiempo.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show snackbar
      </Button>
      <Snackbar open={open} onClose={() => setOpen(false)} message="Message archived" autoHideDuration={4000} />
    </Stack>
  );
}
