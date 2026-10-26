import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Grid', es: 'Grid' };
export const description = {
  en: 'Inside the content you can use `Grid` for multi-column forms; combine it with `maxWidth="lg"` to give the columns room. On mobile the fields stack in a single column.',
  es: 'Dentro del contenido puedes usar `Grid` para formularios de varias columnas; combínalo con `maxWidth="lg"` para dar espacio a las columnas. En móvil los campos se apilan en una sola columna.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Nueva dirección
      </Button>
      <Dialog
        open={open}
        onClose={close}
        maxWidth="lg"
        title="Nueva dirección de envío"
        actions={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button variant="contained" onClick={close}>
              Guardar
            </Button>
          </>
        }
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Nombre" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Apellidos" fullWidth />
          </Grid>
          <Grid size={12}>
            <TextField label="Dirección" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Código postal" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Ciudad" fullWidth />
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
