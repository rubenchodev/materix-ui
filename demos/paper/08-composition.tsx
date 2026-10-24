import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Semantic element and composition', es: 'Elemento semántico y composición' };
export const description = {
  en: '`component` changes the root tag (for example `section`) without changing the look; the content is composed with Typography.',
  es: '`component` cambia la etiqueta raíz (por ejemplo `section`) sin alterar el aspecto; el contenido se compone con Typography.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <Paper component="section" elevation={2} aria-labelledby="order-summary" className="mtx-p-2 demo-wide">
        <Typography id="order-summary" component="h3" variant="h6" gutterBottom>
          Order summary
        </Typography>
        <Typography variant="body2">3 items · Standard shipping · Total $74.90</Typography>
      </Paper>
    </div>
  );
}
