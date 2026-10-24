import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react/components/progress';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "The linear bar fills the width of its column; the circular indicator is centered with flex utilities.",
  es: "La barra lineal ocupa el ancho de su columna; el indicador circular se centra con utilidades flex.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={4}>
        <LinearProgress value={25} showLabel />
      </Grid>
      <Grid xs={12} md={4}>
        <LinearProgress value={50} showLabel color="secondary" />
      </Grid>
      <Grid xs={12} md={4}>
        <div className="mtx-d-flex mtx-justify-content-center">
          <CircularProgress value={75} showLabel />
        </div>
      </Grid>
    </Grid>
  );
}
