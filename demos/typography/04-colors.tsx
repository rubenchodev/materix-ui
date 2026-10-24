import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` accepts the palette colors (`primary`, `secondary`, `error`, `warning`, `info`, `success`), the text colors (`text-primary`, `text-secondary`, `disabled`) and `inherit`.',
  es: '`color` acepta los colores de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`), los de texto (`text-primary`, `text-secondary`, `disabled`) e `inherit`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Palette and text (color)</span>
        <Typography color="primary">Primary</Typography>
        <Typography color="secondary">Secondary</Typography>
        <Typography color="text-secondary">Secondary text</Typography>
        <Typography color="disabled" aria-disabled="true">
          Disabled text
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">Status (color)</span>
        <Typography color="error">Error</Typography>
        <Typography color="warning">Warning</Typography>
        <Typography color="info">Info</Typography>
        <Typography color="success">Success</Typography>
      </div>
    </div>
  );
}
