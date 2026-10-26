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
        <span className="demo-label">Paleta y texto (color)</span>
        <Typography color="primary">Primario</Typography>
        <Typography color="secondary">Secundario</Typography>
        <Typography color="text-secondary">Texto secundario</Typography>
        <Typography color="disabled" aria-disabled="true">
          Texto deshabilitado
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">Estado (color)</span>
        <Typography color="error">Error</Typography>
        <Typography color="warning">Advertencia</Typography>
        <Typography color="info">Información</Typography>
        <Typography color="success">Éxito</Typography>
      </div>
    </div>
  );
}
