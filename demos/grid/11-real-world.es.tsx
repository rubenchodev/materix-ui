import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardContent } from '@rubenchodev/materix-react/components/card';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world use cases', es: 'Casos de uso reales' };

export const description = {
  en: 'A dashboard with metrics (1 → 2 → 4 columns) and a main block with a sidebar, plus a form that stacks on mobile.',
  es: 'Un panel con métricas (1 → 2 → 4 columnas) y un bloque principal con barra lateral, más un formulario que se apila en móvil.',
};

const metrics = [
  ['Ventas', '$24.300'],
  ['Pedidos', '1.284'],
  ['Clientes', '312'],
  ['Conversión', '3,4%'],
];

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'Usuario' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Panel</span>
        <div className="demo-surface">
          <Grid container spacing={2}>
            {metrics.map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="overline">{label}</Typography>
                    <p className="demo-grid-stat">{value}</p>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Actividad reciente
                  </Typography>
                  <Typography variant="body2">Bloque principal: 8 de 12 columnas desde 900px.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Tareas
                  </Typography>
                  <Typography variant="body2">Barra lateral: 4 columnas en escritorio.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Formulario</span>
        <form onSubmit={(event) => event.preventDefault()}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Nombre" variant="outlined" type="text" name="name" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Apellidos" variant="outlined" type="text" name="lastname" />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField label="Correo electrónico" variant="outlined" type="email" name="email" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField label="Teléfono" variant="outlined" type="tel" name="phone" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <NativeSelect label="Rol" variant="outlined" name="role" options={roles} />
            </Grid>
            <Grid container size={12} justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button variant="outlined">Cancelar</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}
