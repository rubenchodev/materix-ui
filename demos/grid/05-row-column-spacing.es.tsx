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
        <div className="demo-grid-item">filas 8px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item">columnas 32px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item demo-grid-item--alt">filas 8px</div>
      </Grid>
      <Grid size={6}>
        <div className="demo-grid-item demo-grid-item--alt">columnas 32px</div>
      </Grid>
    </Grid>
  );
}
