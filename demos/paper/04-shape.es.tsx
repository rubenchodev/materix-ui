import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Shape', es: 'Forma' };
export const description = {
  en: 'By default the corners use `--mtx-shape-radius` (4px). `square` makes them straight, useful for surfaces attached to the edges of the window.',
  es: 'Por defecto las esquinas usan `--mtx-shape-radius` (4px). `square` las deja rectas, útil para superficies pegadas a los bordes de la ventana.',
};

const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Redondeado · 4px</span>
        <Paper elevation={3} className={boxClass} style={box}>
          Redondeado
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Cuadrado</span>
        <Paper elevation={3} square className={boxClass} style={box}>
          Cuadrado
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Contorneado cuadrado</span>
        <Paper variant="outlined" square className={boxClass} style={box}>
          Contorneado
        </Paper>
      </div>
    </div>
  );
}
