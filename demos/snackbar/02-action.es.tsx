import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'With action', es: 'Con acción' };
export const description = {
  en: 'A text `action` renders the `.mtx-snackbar__action` button; `onAction` runs when it is pressed and `closeOnAction` closes the snackbar (reason `action`). Any other node, such as an `IconButton`, is rendered as is.',
  es: 'Una `action` de texto genera el botón `.mtx-snackbar__action`; `onAction` se ejecuta al pulsarlo y `closeOnAction` cierra el snackbar (motivo `action`). Cualquier otro nodo, como un `IconButton`, se pinta tal cual.',
};

export default function Demo() {
  const [open, setOpen] = useState<'text' | 'node' | null>(null);
  const [status, setStatus] = useState('');
  const close = () => setOpen(null);
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} wrap alignItems="center">
        <Button variant="outlined" onClick={() => setOpen('text')}>
          Eliminar correo
        </Button>
        <Button variant="outlined" onClick={() => setOpen('node')}>
          Acción personalizada
        </Button>
      </Stack>
      <Typography variant="caption" color="text-secondary" component="p" role="status">
        {status}
      </Typography>
      <Snackbar
        open={open === 'text'}
        onClose={close}
        message="Correo eliminado"
        action="Deshacer"
        onAction={() => setStatus('Correo restaurado')}
        closeOnAction
        autoHideDuration={6000}
      />
      <Snackbar
        open={open === 'node'}
        onClose={close}
        message="Borrador guardado"
        autoHideDuration={6000}
        action={
          <IconButton size="small" color="inherit" aria-label="Cerrar" onClick={close}>
            <span className="material-icons">close</span>
          </IconButton>
        }
      />
    </Stack>
  );
}
