import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "`size` sets the diameter in px (40 by default) and `thickness` the stroke width (3.6). The height of the linear bar is changed with the `--mtx-linear-progress-height` variable.",
  es: "`size` fija el diámetro en px (40 por defecto) y `thickness` el grosor del trazo (3.6). La altura de la barra lineal se cambia con la variable `--mtx-linear-progress-height`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Circular · 16 / 24 / 40 / 56 / 80px</span>
        <div className="demo-row">
          <CircularProgress size={16} />
          <CircularProgress size={24} />
          <CircularProgress />
          <CircularProgress size={56} />
          <CircularProgress size={80} value={60} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Thickness · 2 / 3.6 / 6</span>
        <div className="demo-row">
          <CircularProgress thickness={2} value={70} />
          <CircularProgress value={70} />
          <CircularProgress thickness={6} value={70} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Next to a 40px button</span>
        <div className="demo-row">
          <Button variant="outlined">Retry</Button>
          <CircularProgress />
          <CircularProgress size={24} />
        </div>
      </div>
    </div>
  );
}
