import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Paper is the usual container for the items of a `Grid`: the column decides the width and Paper provides the surface.',
  es: 'Paper es el contenedor habitual de los elementos de un `Grid`: la columna decide el ancho y Paper aporta la superficie.',
};

const box = { height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface">
      <Grid container spacing={2} className="mtx-w-100">
        <Grid xs={12} md={8}>
          <Paper className={boxClass} style={box}>
            xs=12 md=8
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper className={boxClass} style={box}>
            xs=12 md=4
          </Paper>
        </Grid>
        <Grid xs={6} md={4}>
          <Paper variant="outlined" className={boxClass} style={box}>
            xs=6 md=4
          </Paper>
        </Grid>
        <Grid xs={6} md={8}>
          <Paper variant="outlined" className={boxClass} style={box}>
            xs=6 md=8
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
