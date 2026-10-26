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
            Guía
          </Typography>
          <Typography component="h3" variant="h5" gutterBottom>
            Cómo preparar un presupuesto trimestral
          </Typography>
          <Typography variant="caption" color="text-secondary" component="p" gutterBottom>
            Por Juana Pérez · 6 min de lectura
          </Typography>
          <Typography variant="body2">
            Repasamos los pasos para estimar ingresos y gastos, fijar márgenes de seguridad y revisar el presupuesto cada mes.
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
