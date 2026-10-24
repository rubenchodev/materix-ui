import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Several rating criteria spread across responsive Grid columns, each named through `aria-labelledby`.',
  es: 'Varios criterios de valoración repartidos en columnas responsive de Grid, cada uno nombrado con `aria-labelledby`.',
};

const CRITERIA: Array<[string, string, number]> = [
  ['grid-clean', 'Cleanliness', 5],
  ['grid-location', 'Location', 4],
  ['grid-value', 'Value for money', 3],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {CRITERIA.map(([id, label, value]) => (
        <Grid key={id} size={{ xs: 12, sm: 6, md: 4 }}>
          <div className="demo-group">
            <span className="demo-label" id={id}>{label}</span>
            <Rating defaultValue={value} aria-labelledby={id} />
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
