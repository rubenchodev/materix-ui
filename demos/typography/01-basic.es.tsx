import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A heading `component` (`h1`–`h6`) picks up its variant automatically; on other tags set it with `variant` (`body1` by default).',
  es: 'Un `component` de encabezado (`h1`–`h6`) toma su variante automáticamente; en otras etiquetas indícala con `variant` (`body1` por defecto).',
};

export default function Demo() {
  return (
    <div>
      <Typography component="h3" variant="h4" gutterBottom>
        Informe mensual
      </Typography>
      <Typography variant="body1">Las ventas crecieron un 12 % respecto al mes anterior, impulsadas por el canal en línea.</Typography>
    </div>
  );
}
