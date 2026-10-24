import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Blocks without a fixed width fill their column: the same placeholder works in 1, 2 or 3 columns.',
  es: 'Los bloques sin ancho fijo llenan su columna: el mismo placeholder sirve en 1, 2 o 3 columnas.',
};

const columns = [6, 6, 12] as const;

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      {columns.map((sm, i) => (
        <Grid key={i} xs={12} sm={sm} md={4}>
          <Skeleton variant="rounded" height={120} />
          <Skeleton />
          <Skeleton width="70%" />
        </Grid>
      ))}
    </Grid>
  );
}
