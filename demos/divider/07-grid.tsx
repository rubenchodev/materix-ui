import { Divider } from '@rubenchodev/materix-react/components/divider';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Metrics in a `Grid` with a horizontal divider between the figure and its description.',
  es: 'Métricas en un `Grid` con un divisor horizontal entre la cifra y su descripción.',
};

const metrics = [
  { value: '1,284', label: 'Orders this month' },
  { value: '96%', label: 'On-time deliveries' },
  { value: '4.8', label: 'Average rating' },
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {metrics.map(({ value, label }) => (
        <Grid key={label} xs={12} sm={4}>
          <Paper variant="outlined">
            <div className="demo-panel">
              <strong>{value}</strong>
              <Divider className="demo-wide" />
              <span>{label}</span>
            </div>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
