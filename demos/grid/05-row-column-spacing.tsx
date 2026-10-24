import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Row and column spacing', es: 'Espaciado por filas y columnas' };

export const description = {
  en: '`rowSpacing` and `columnSpacing` set the vertical and horizontal gap independently.',
  es: '`rowSpacing` y `columnSpacing` fijan por separado la separación vertical y horizontal.',
};

export default function Demo() {
  return (
    <Grid container rowSpacing={1} columnSpacing={4}>
      <Grid size={6}>
        <div className="demo-grid-item">rows 8px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item">columns 32px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item demo-grid-item--alt">rows 8px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item demo-grid-item--alt">columns 32px</div>
      </Grid>
    </Grid>
  );
}
