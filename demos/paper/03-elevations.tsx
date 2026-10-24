import { Paper, type PaperElevation } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Elevations', es: 'Elevaciones' };
export const description = {
  en: 'Only MUI elevations 0 to 8, 12, 16 and 24 exist as tokens (`--mtx-elevation-*`). Any other `elevation` value has no style and keeps the base elevation 1.',
  es: 'Solo existen como tokens (`--mtx-elevation-*`) las elevaciones de MUI 0 a 8, 12, 16 y 24. Cualquier otro valor de `elevation` no tiene estilo y conserva la elevación base 1.',
};

const levels: PaperElevation[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 24];
const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  return (
    <div className="demo-surface">
      {levels.map((level) => (
        <Paper key={level} elevation={level} className={boxClass} style={box}>
          {level}
        </Paper>
      ))}
    </div>
  );
}
