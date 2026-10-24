import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'KPIs with `Grid`: figure in `h4`, label in `overline` and change in `caption`.',
  es: 'KPI con `Grid`: cifra en `h4`, etiqueta en `overline` y variación en `caption`.',
};

const kpis = [
  { label: 'Revenue', value: '$48,200', change: '+12% this month', color: 'success' as const },
  { label: 'Orders', value: '1,284', change: '+4% this month', color: 'success' as const },
  { label: 'Returns', value: '37', change: '+9% this month', color: 'error' as const },
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {kpis.map(({ label, value, change, color }) => (
        <Grid key={label} xs={12} sm={4}>
          <div className="demo-panel">
            <Typography variant="overline" color="text-secondary">
              {label}
            </Typography>
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            <Typography variant="caption" color={color}>
              {change}
            </Typography>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
