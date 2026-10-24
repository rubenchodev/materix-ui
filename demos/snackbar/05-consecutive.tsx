import { SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Consecutive', es: 'Consecutivos' };
export const description = {
  en: '`SnackbarProvider` keeps a queue and shows one notice at a time: a new notice closes the visible one and appears when its exit transition ends, as in MUI’s *Consecutive Snackbars* example.',
  es: '`SnackbarProvider` mantiene una cola y muestra un aviso a la vez: uno nuevo cierra el visible y aparece al terminar su transición de salida, como el ejemplo *Consecutive Snackbars* de MUI.',
};

function Buttons() {
  const { enqueue } = useSnackbar();
  return (
    <Stack direction="row" spacing={2} wrap alignItems="center">
      {['A', 'B', 'C'].map((name) => (
        <Button key={name} variant="outlined" onClick={() => enqueue({ message: `Message ${name}`, duration: 2500 })}>
          Message {name}
        </Button>
      ))}
    </Stack>
  );
}

export default function Demo() {
  return (
    <SnackbarProvider>
      <Buttons />
    </SnackbarProvider>
  );
}
