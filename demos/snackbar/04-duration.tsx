import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Duration', es: 'Duración' };
export const description = {
  en: 'Without `autoHideDuration` (or with `null`) the snackbar does not close by itself. The timer pauses while the pointer or focus is on it and restarts when they leave.',
  es: 'Sin `autoHideDuration` (o con `null`) el snackbar no se cierra solo. El temporizador se pausa mientras el puntero o el foco están sobre él y se reinicia al salir.',
};

type Mode = 'short' | 'long' | 'persistent';

export default function Demo() {
  const [open, setOpen] = useState<Mode | null>(null);
  const close = () => setOpen(null);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="outlined" onClick={() => setOpen('short')}>
        2 seconds
      </Button>
      <Button variant="outlined" onClick={() => setOpen('long')}>
        8 seconds
      </Button>
      <Button variant="outlined" onClick={() => setOpen('persistent')}>
        No auto-hide
      </Button>
      <Snackbar open={open === 'short'} onClose={close} message="Closes in 2 seconds" autoHideDuration={2000} />
      <Snackbar
        open={open === 'long'}
        onClose={close}
        message="Closes in 8 seconds (hover over it to pause)"
        autoHideDuration={8000}
      />
      <Snackbar open={open === 'persistent'} onClose={close} message="Stays until you close it" action="Close" closeOnAction />
    </Stack>
  );
}
