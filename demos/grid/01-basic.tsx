import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Basic usage', es: 'Uso básico' };

export const description = {
  en: 'A `<Grid container>` with `spacing` and items with columns per breakpoint. Resize the window: 1 column on mobile, 2 on tablet and 4 on desktop.',
  es: 'Un `<Grid container>` con `spacing` e ítems con columnas por breakpoint. Redimensiona la ventana: 1 columna en móvil, 2 en tablet y 4 en escritorio.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((n) => (
        <Grid key={n} size={{ xs: 12, sm: 6, md: 3 }}>
          <div className="demo-grid-item">xs=12 sm=6 md=3</div>
        </Grid>
      ))}
    </Grid>
  );
}
