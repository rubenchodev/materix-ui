import '@rubenchodev/materix-ui/utilities.css';
import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };

export const description = {
  en: 'A form action bar and a profile card built only with Stack and components.',
  es: 'Una barra de acciones de formulario y una tarjeta de perfil hechas solo con Stack y componentes.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Formulario</span>
        <Stack component="form" spacing={2} onSubmit={(event) => event.preventDefault()}>
          <TextField label="Nombre" variant="outlined" type="text" name="name" />
          <TextField label="Correo electrónico" variant="outlined" type="email" name="email" />
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button variant="text" type="reset">
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        </Stack>
      </div>
      <div className="demo-group">
        <span className="demo-label">Perfil</span>
        <Paper variant="outlined" className="mtx-p-2">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt="Lucía Herrera">LH</Avatar>
            <Stack className="mtx-flex-1 mtx-min-w-0">
              <Typography variant="subtitle1" component="span" noWrap>
                Lucía Herrera
              </Typography>
              <Typography variant="body2" component="span" color="text-secondary" noWrap>
                Diseñadora de producto · Londres
              </Typography>
            </Stack>
            <Button variant="outlined">Seguir</Button>
          </Stack>
        </Paper>
      </div>
    </div>
  );
}
