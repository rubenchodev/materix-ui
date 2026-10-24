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
        Monthly report
      </Typography>
      <Typography variant="body1">Sales grew 12% over the previous month, driven by the online channel.</Typography>
    </div>
  );
}
