import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Breakpoints', es: 'Breakpoints' };

export const description = {
  en: 'Mobile-first: each value applies from its minimum width upwards. xs 0px · sm 600px · md 900px · lg 1200px · xl 1536px. Always declare `xs` as the base.',
  es: 'Mobile-first: cada valor aplica desde su ancho mínimo hacia arriba. xs 0px · sm 600px · md 900px · lg 1200px · xl 1536px. Declara siempre `xs` como base.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">xs=12 · sm=6 · md=4 · lg=3 · xl=2</span>
        <Grid container spacing={2}>
          {['A', 'B', 'C', 'D', 'E', 'F'].map((label) => (
            <Grid key={label} xs={12} sm={6} md={4} lg={3} xl={2}>
              <div className="demo-grid-item">{label}</div>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="demo-group">
        <span className="demo-label">Contenido + barra lateral · xs=12 / md=8 + md=4</span>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <div className="demo-grid-item demo-grid-item--tall">Contenido · md=8</div>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <div className="demo-grid-item demo-grid-item--tall demo-grid-item--alt">Barra lateral · md=4</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
