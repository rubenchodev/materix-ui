import './demo.css';
import { Grid, type GridSpacing } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Spacing', es: 'Espaciado' };

export const description = {
  en: '`spacing={n}` separates rows and columns by `n × 8px` using `gap` (like MUI Grid v2): no negative margins or padding on the items, so the grid never overflows its parent. Values: any integer from 0 to 12 and the half steps `0.5`, `1.5` and `2.5`. Each column width subtracts its proportional share of the gap, so 12 columns always add up to 100%.',
  es: '`spacing={n}` separa filas y columnas `n × 8px` con `gap` (como MUI Grid v2): sin márgenes negativos ni rellenos en los ítems, así que la grilla nunca desborda a su padre. Valores: cualquier entero de 0 a 12 y los medios pasos `0.5`, `1.5` y `2.5`. El ancho de cada columna descuenta su parte proporcional del gap, de modo que 12 columnas siempre suman el 100%.',
};

const values: GridSpacing[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12];

export default function Demo() {
  return (
    <div className="demo-stack">
      {values.map((spacing) => (
        <div className="demo-group" key={spacing}>
          <span className="demo-label">
            spacing={'{'}
            {spacing}
            {'}'} · {Number(spacing) * 8}px
          </span>
          <Grid container spacing={spacing}>
            {[1, 2, 3].map((n) => (
              <Grid key={n} size={4}>
                <div className="demo-grid-item">{spacing}</div>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}
