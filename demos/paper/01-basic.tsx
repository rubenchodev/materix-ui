import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A `<Paper>` gets a paper background, a 4px border radius and elevation 1. Adjust the shadow with `elevation`.',
  es: 'Un `<Paper>` recibe fondo de papel, radio de 4px y elevación 1. Ajusta la sombra con `elevation`.',
};

const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface">
      <Paper className={boxClass} style={box}>
        Elevation 1
      </Paper>
      <Paper elevation={8} className={boxClass} style={box}>
        Elevation 8
      </Paper>
    </div>
  );
}
