import './demo.css';
import { Container } from '@rubenchodev/materix-react/components/container';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid', es: 'Grilla' };

export const description = {
  en: 'Container bounds the width and Grid splits the columns inside it. No wrapper with `overflow` is needed: Grid spaces items with `gap`.',
  es: 'Container limita el ancho y Grid reparte las columnas dentro. No hace falta un envoltorio con `overflow`: Grid separa los ítems con `gap`.',
};

export default function Demo() {
  return (
    <div className="demo-container-frame">
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className="demo-container-box">xs=12 sm=6 md=4</div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className="demo-container-box">xs=12 sm=6 md=4</div>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <div className="demo-container-box">xs=12 md=4</div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
