import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'Article header inside a Paper: overline, title, metadata and excerpt.',
  es: 'Cabecera de artículo dentro de un Paper: overline, título, metadatos y extracto.',
};

export default function Demo() {
  return (
    <Paper variant="outlined" className="demo-wide">
      <div className="demo-panel">
        <div>
          <Typography variant="overline" color="primary">
            Guide
          </Typography>
          <Typography component="h3" variant="h5" gutterBottom>
            How to prepare a quarterly budget
          </Typography>
          <Typography variant="caption" color="text-secondary" component="p" gutterBottom>
            By Jane Smith · 6 min read
          </Typography>
          <Typography variant="body2">
            We go over the steps to estimate income and expenses, set safety margins and review the budget every month.
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
