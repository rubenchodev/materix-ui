import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`elevation` (default) separates the surface with a shadow; `variant="outlined"` outlines it with a 1px border and no shadow.',
  es: '`elevation` (por defecto) separa la superficie con una sombra; `variant="outlined"` la delimita con un borde de 1px y sin sombra.',
};

const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Elevation</span>
        <Paper className={boxClass} style={box}>
          Shadow
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <Paper variant="outlined" className={boxClass} style={box}>
          Border
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Elevation 0</span>
        <Paper elevation={0} className={boxClass} style={box}>
          Flat
        </Paper>
      </div>
    </div>
  );
}
