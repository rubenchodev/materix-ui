import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Semantics vs. style', es: 'Semántica frente a estilo' };
export const description = {
  en: 'The tag (`component`) defines the structure and `variant` the look: `variant` takes precedence over the tag.',
  es: 'La etiqueta (`component`) define la estructura y `variant` el aspecto: `variant` prevalece sobre la etiqueta.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <Typography component="h3" variant="h5" gutterBottom>
        Semantic h3 styled as h5
      </Typography>
      <Typography component="h4" variant="subtitle1">
        Semantic h4 styled as subtitle1
      </Typography>
      <Typography variant="body2">Paragraph styled as body2.</Typography>
    </div>
  );
}
