import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Direction', es: 'Dirección' };

export const description = {
  en: '`direction` changes the flow direction. Reading and tab order still follow the JSX.',
  es: '`direction` cambia el sentido del flujo. El orden de lectura y de tabulación sigue al JSX.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">direction=&quot;row-reverse&quot;</span>
        <Grid container spacing={2} direction="row-reverse">
          {[1, 2, 3].map((n) => (
            <Grid key={n} size={4}>
              <div className="demo-grid-item">{n}</div>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="demo-group">
        <span className="demo-label">direction=&quot;column&quot;</span>
        <Grid container spacing={1} direction="column">
          {[1, 2, 3].map((n) => (
            <Grid key={n} size={12}>
              <div className="demo-grid-item">{n}</div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
