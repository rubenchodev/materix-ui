import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "Two small paginations side by side in a `Grid`: one column on mobile and two from 900px; items wrap when space runs out.",
  es: "Dos paginaciones pequeñas lado a lado en un `Grid`: una columna en móvil y dos desde 900px; los ítems saltan de línea cuando falta espacio.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }} className="demo-group">
        <span className="demo-label">Orders</span>
        <Pagination count={6} size="small" color="primary" aria-label="Orders pagination" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} className="demo-group">
        <span className="demo-label">Invoices</span>
        <Pagination count={6} size="small" variant="outlined" shape="rounded" aria-label="Invoices pagination" />
      </Grid>
    </Grid>
  );
}
