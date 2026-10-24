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
        <Alert severity="success" title="Sales">
          +12% compared to last month.
        </Alert>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Alert severity="warning" title="Inventory">
          3 products are low on stock.
        </Alert>
      </Grid>
      <Grid size={12}>
        <Alert severity="info" variant="outlined">
          Reports are updated every hour.
        </Alert>
      </Grid>
    </Grid>
  );
}
