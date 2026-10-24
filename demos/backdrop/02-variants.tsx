import { useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'The default layer dims the page with `--mtx-backdrop-bg`; `invisible` keeps it transparent but still blocks clicks. With `invisible` use a colored indicator.',
  es: 'La capa predeterminada oscurece la página con `--mtx-backdrop-bg`; `invisible` la deja transparente pero sigue bloqueando los clics. Con `invisible` usa un indicador con color.',
};

export default function Demo() {
  const [open, setOpen] = useState<'default' | 'invisible' | null>(null);
  const close = () => setOpen(null);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="outlined" onClick={() => setOpen('default')}>
        Default (dimmed)
      </Button>
      <Button variant="outlined" onClick={() => setOpen('invisible')}>
        Invisible
      </Button>
      <Backdrop open={open === 'default'} onClose={close} closeOnClick closeOnEscape>
        <CircularProgress color="inherit" label="Loading" />
      </Backdrop>
      <Backdrop open={open === 'invisible'} invisible onClose={close} closeOnClick closeOnEscape>
        <CircularProgress label="Loading" />
      </Backdrop>
    </Stack>
  );
}
