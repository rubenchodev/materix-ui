import { useEffect, useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'Saving a form: the backdrop covers the page while the request runs and closes by itself when it finishes; then a Snackbar confirms the result.',
  es: 'Guardar un formulario: el backdrop cubre la página mientras dura la petición y se cierra solo al terminar; después un Snackbar confirma el resultado.',
};

export default function Demo() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saving) return undefined;
    const timer = setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [saving]);

  return (
    <Stack component="form" spacing={2} alignItems="flex-start" onSubmit={(event) => {
      event.preventDefault();
      setSaving(true);
    }}>
      <TextField label="Nombre del proyecto" variant="outlined" defaultValue="Materix UI" name="project" />
      <Button type="submit" variant="contained" startIcon="save">
        Guardar
      </Button>
      <Backdrop open={saving} lockScroll>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" decorative />
          <Typography variant="subtitle1" color="inherit" role="status">
            Guardando cambios…
          </Typography>
        </Stack>
      </Backdrop>
      <Snackbar open={saved} onClose={() => setSaved(false)} message="Proyecto guardado" role="status" autoHideDuration={4000} />
    </Stack>
  );
}
