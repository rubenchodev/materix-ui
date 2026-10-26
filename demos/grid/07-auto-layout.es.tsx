import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Auto-layout', es: 'Auto-layout' };

export const description = {
  en: '`grow` (or `true`) makes the item grow and share the remaining space with the other growing items. `auto` sizes the item to its content width (`flex: 0 0 auto`), like MUI\'s `size="auto"`.',
  es: '`grow` (o `true`) hace que el ítem crezca y reparta el espacio libre con los demás ítems que crecen. `auto` ajusta el ítem al ancho de su contenido (`flex: 0 0 auto`), como `size="auto"` de MUI.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Tres ítems grow</span>
        <Grid container spacing={2}>
          {[1, 2, 3].map((n) => (
            <Grid key={n} size="grow">
              <div className="demo-grid-item">grow</div>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="demo-group">
        <span className="demo-label">auto (ancho del contenido) · xs=6 · grow (resto)</span>
        <Grid container spacing={2}>
          <Grid size="auto">
            <div className="demo-grid-item">auto</div>
          </Grid>
          <Grid size={6}>
            <div className="demo-grid-item demo-grid-item--alt">xs=6</div>
          </Grid>
          <Grid xs>
            <div className="demo-grid-item">true</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
