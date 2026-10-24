import './demo.css';
import { Grid, type GridSize } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Columns', es: 'Columnas' };

export const description = {
  en: 'Each item takes `n/12` of the width. When the sum exceeds 12, the next items wrap to a new line.',
  es: 'Cada ítem ocupa `n/12` del ancho. Cuando la suma supera 12, los siguientes ítems saltan a una nueva línea.',
};

const rows: Array<[GridSize, boolean]> = [
  [12, false],
  [6, false],
  [6, false],
  [4, false],
  [4, false],
  [4, false],
  [3, false],
  [3, false],
  [3, false],
  [3, false],
  [8, true],
  [4, true],
];
const pairs = Array.from({ length: 11 }, (_, i) => i + 1) as GridSize[];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">12 · 6+6 · 4+4+4 · 3×4 · 8+4</span>
        <Grid container spacing={1}>
          {rows.map(([size, isAlt], i) => (
            <Grid key={i} size={size}>
              <div className={isAlt ? 'demo-grid-item demo-grid-item--alt' : 'demo-grid-item'}>{String(size)}</div>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="demo-group">
        <span className="demo-label">Pairs that add up to 12: n + (12 − n)</span>
        <Grid container spacing={1}>
          {pairs.flatMap((n) => [
            <Grid key={`a${String(n)}`} size={n}>
              <div className="demo-grid-item">{String(n)}</div>
            </Grid>,
            <Grid key={`b${String(n)}`} size={(12 - Number(n)) as GridSize}>
              <div className="demo-grid-item demo-grid-item--alt">{12 - Number(n)}</div>
            </Grid>,
          ])}
        </Grid>
      </div>
    </div>
  );
}
