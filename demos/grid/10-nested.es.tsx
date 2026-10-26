import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Nested grids', es: 'Grillas anidadas' };

export const description = {
  en: 'An item with `container` is also a container: inside it there are 12 columns again.',
  es: 'Un ítem con `container` también es contenedor: dentro vuelve a haber 12 columnas.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid container size={{ xs: 12, md: 8 }} spacing={1}>
        <Grid size={6}>
          <div className="demo-grid-item">anidado · 6</div>
        </Grid>
        <Grid size={6}>
          <div className="demo-grid-item">anidado · 6</div>
        </Grid>
        <Grid size={12}>
          <div className="demo-grid-item">anidado · 12</div>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <div className="demo-grid-item demo-grid-item--tall demo-grid-item--alt">md=4</div>
      </Grid>
    </Grid>
  );
}
