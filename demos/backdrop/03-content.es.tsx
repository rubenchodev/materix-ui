import { useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'With content', es: 'Con contenido' };
export const description = {
  en: 'Children are centered; compose them with `Stack` and `Typography`. Any element with `data-mtx-backdrop-close` closes the layer (reason `click`), even without `closeOnClick`.',
  es: 'Los hijos se centran; compónlos con `Stack` y `Typography`. Cualquier elemento con `data-mtx-backdrop-close` cierra la capa (motivo `click`), incluso sin `closeOnClick`.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Sincronizar con mensaje
      </Button>
      <Backdrop open={open} onClose={() => setOpen(false)} closeOnEscape>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" decorative />
          <Typography variant="subtitle1" color="inherit" role="status">
            Sincronizando tus archivos…
          </Typography>
          <Button variant="outlined" color="inherit" data-mtx-backdrop-close="">
            Cancelar
          </Button>
        </Stack>
      </Backdrop>
    </Stack>
  );
}
