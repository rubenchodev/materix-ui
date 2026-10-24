import { useEffect, useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import type { BackdropCloseReason } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Closing', es: 'Cierre' };
export const description = {
  en: '`closeOnClick` closes on a click on the layer (controls inside the content are ignored), `closeOnEscape` with Escape through the layer stack, and without either the layer only closes with `open={false}`.',
  es: '`closeOnClick` cierra con un clic en la capa (los controles del contenido se ignoran), `closeOnEscape` con Escape a través de la pila de capas y, sin ninguno, la capa solo se cierra con `open={false}`.',
};

type Mode = 'click' | 'escape' | 'timer';

export default function Demo() {
  const [open, setOpen] = useState<Mode | null>(null);
  const [last, setLast] = useState('—');
  const close = (_event: unknown, reason: BackdropCloseReason) => {
    setLast(reason);
    setOpen(null);
  };

  useEffect(() => {
    if (open !== 'timer') return undefined;
    const timer = setTimeout(() => {
      setOpen(null);
      setLast('timer (open = false)');
    }, 2000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} wrap alignItems="center">
        <Button variant="outlined" onClick={() => setOpen('click')}>
          Close on click
        </Button>
        <Button variant="outlined" onClick={() => setOpen('escape')}>
          Close with Escape
        </Button>
        <Button variant="outlined" onClick={() => setOpen('timer')}>
          Close after 2 s
        </Button>
      </Stack>
      <Typography variant="caption" color="text-secondary" component="p" role="status">
        Last reason: {last}
      </Typography>
      <Backdrop open={open === 'click'} closeOnClick onClose={close}>
        <CircularProgress color="inherit" label="Loading" />
      </Backdrop>
      <Backdrop open={open === 'escape'} closeOnEscape onClose={close}>
        <CircularProgress color="inherit" label="Loading" />
      </Backdrop>
      <Backdrop open={open === 'timer'}>
        <CircularProgress color="inherit" label="Loading" />
      </Backdrop>
    </Stack>
  );
}
