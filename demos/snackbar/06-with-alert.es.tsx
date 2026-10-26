import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'With Alert', es: 'Con Alert' };
export const description = {
  en: 'For notifications with a severity, place an `Alert` as the child of a snackbar without `message`; the `mtx-p-0 mtx-bg-transparent` utilities remove the snackbar padding and background, and `mtx-flex-1` stretches the alert.',
  es: 'Para notificaciones con severidad, coloca un `Alert` como hijo de un snackbar sin `message`; las utilidades `mtx-p-0 mtx-bg-transparent` quitan el relleno y el fondo del snackbar y `mtx-flex-1` estira la alerta.',
};

export default function Demo() {
  const [open, setOpen] = useState<'success' | 'error' | null>(null);
  const close = () => setOpen(null);
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      <Button variant="outlined" onClick={() => setOpen('success')}>
        Éxito
      </Button>
      <Button variant="outlined" onClick={() => setOpen('error')}>
        Error
      </Button>
      <Snackbar
        open={open === 'success'}
        onClose={close}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        className="mtx-p-0 mtx-bg-transparent"
      >
        <Alert severity="success" variant="filled" className="mtx-flex-1">
          Perfil actualizado correctamente.
        </Alert>
      </Snackbar>
      <Snackbar
        open={open === 'error'}
        onClose={close}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        className="mtx-p-0 mtx-bg-transparent"
      >
        <Alert severity="error" variant="filled" className="mtx-flex-1">
          No se pudo guardar el perfil.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
