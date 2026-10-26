import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Alerts take the width of their Grid column.',
  es: 'Las alertas ocupan el ancho de su columna de la Grid.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Alert severity="success" title="Ventas">
          +12 % respecto al mes anterior.
        </Alert>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Alert severity="warning" title="Inventario">
          3 productos con stock bajo.
        </Alert>
      </Grid>
      <Grid size={12}>
        <Alert severity="info" variant="outlined">
          Los informes se actualizan cada hora.
        </Alert>
      </Grid>
    </Grid>
  );
}
