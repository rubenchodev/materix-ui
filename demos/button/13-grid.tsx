import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "Inside a grid, combine `fullWidth` with responsive columns: on mobile the buttons stack at full width and from 600px they spread into columns.",
  es: "Dentro de una grilla, combina `fullWidth` con columnas responsive: en móvil los botones se apilan a ancho completo y desde 600px se reparten en columnas.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} sm={4}>
        <Button variant="outlined" fullWidth>Previous</Button>
      </Grid>
      <Grid xs={12} sm={4}>
        <Button fullWidth>Save draft</Button>
      </Grid>
      <Grid xs={12} sm={4}>
        <Button variant="contained" fullWidth>Next</Button>
      </Grid>
    </Grid>
  );
}
