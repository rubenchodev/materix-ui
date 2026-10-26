import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Team directory in `Grid`: 1 column on mobile, 2 at `sm` and 3 at `md`.',
  es: 'Directorio del equipo en `Grid`: 1 columna en móvil, 2 en `sm` y 3 en `md`.',
};

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      <Grid xs={12} sm={6} md={4}>
        <div className="demo-panel">
          <div className="demo-row">
            <Avatar src="https://i.pravatar.cc/120?img=5" alt="" />
            <span>Ana García</span>
          </div>
        </div>
      </Grid>
      <Grid xs={12} sm={6} md={4}>
        <div className="demo-panel">
          <div className="demo-row">
            <Avatar color="primary" aria-hidden="true">CR</Avatar>
            <span>Carlos Ruiz</span>
          </div>
        </div>
      </Grid>
      <Grid xs={12} sm={6} md={4}>
        <div className="demo-panel">
          <div className="demo-row">
            <Avatar variant="rounded" color="success" aria-hidden="true">LM</Avatar>
            <span>Lucía Martínez</span>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
