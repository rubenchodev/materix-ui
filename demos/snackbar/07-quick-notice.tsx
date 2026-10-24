import { useState } from 'react';
import { SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Quick notices with useSnackbar()', es: 'Avisos rápidos con useSnackbar()' };
export const description = {
  en: 'Wrap the app once with `<SnackbarProvider>` and call `useSnackbar().enqueue(message | options)`. The shared snackbar uses `role="status"` and 4 s by default; `onAction` runs when the action is pressed and closes the notice.',
  es: 'Envuelve la aplicación una vez con `<SnackbarProvider>` y llama a `useSnackbar().enqueue(mensaje | opciones)`. El snackbar compartido usa `role="status"` y 4 s por defecto; `onAction` se ejecuta al pulsar la acción y cierra el aviso.',
};

function Actions() {
  const { enqueue } = useSnackbar();
  const [status, setStatus] = useState('');
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} wrap alignItems="center">
        <Button variant="contained" onClick={() => enqueue('Link copied')}>
          Copy link
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            enqueue({
              message: 'Conversation archived',
              action: 'Undo',
              onAction: () => setStatus('Conversation restored'),
              duration: 6000,
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            })
          }
        >
          Archive with undo
        </Button>
      </Stack>
      <Typography variant="caption" color="text-secondary" component="p" role="status">
        {status}
      </Typography>
    </Stack>
  );
}

export default function Demo() {
  return (
    <SnackbarProvider>
      <Actions />
    </SnackbarProvider>
  );
}
