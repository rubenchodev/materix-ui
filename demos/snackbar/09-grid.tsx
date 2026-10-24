import { SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import type { ButtonColor } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Actions in a `Grid` where each one confirms its result with the shared snackbar, anchored bottom left by the provider.',
  es: 'Acciones en una `Grid` donde cada una confirma su resultado con el snackbar compartido, anclado abajo a la izquierda por el proveedor.',
};

const ACTIONS: Array<{ label: string; message: string; color?: ButtonColor }> = [
  { label: 'Copy', message: 'File copied' },
  { label: 'Move', message: 'File moved' },
  { label: 'Delete', message: 'File deleted', color: 'error' },
];

function Actions() {
  const { enqueue } = useSnackbar();
  return (
    <Grid container spacing={2}>
      {ACTIONS.map(({ label, message, color }) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <Button variant="contained" color={color} fullWidth onClick={() => enqueue({ message, duration: 3000 })}>
            {label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Demo() {
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <Actions />
    </SnackbarProvider>
  );
}
