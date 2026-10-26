import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'The bar takes 100% of its container width; the screen content is laid out below it with `Grid`.',
  es: 'La barra ocupa el 100 % del ancho de su contenedor; el contenido de la pantalla se maqueta debajo con `Grid`.',
};

const stats = ['Ingresos: 12.480 €', 'Pedidos: 326', 'Devoluciones: 4'];

export default function Demo() {
  return (
    <div className="demo-panel demo-panel--tall mtx-w-100">
      <AppBar position="static" color="primary" dense title="Ventas · octubre" startIcon="menu" />
      <div className="mtx-p-2">
        <Grid container spacing={2}>
          {stats.map((text) => (
            <Grid key={text} size={{ xs: 12, sm: 4 }}>
              <Paper className="mtx-p-2">{text}</Paper>
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Paper className="mtx-p-2">Gráfico mensual</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
