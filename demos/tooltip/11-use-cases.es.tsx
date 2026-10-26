import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'An editor\'s formatting bar with shortcuts (instant opening as you move across the buttons) and extra information next to a value.',
  es: 'La barra de formato de un editor con atajos (apertura instantánea al recorrer los botones) e información extra junto a un valor.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-row" role="toolbar" aria-label="Formato de texto">
        <Tooltip title="Negrita (Ctrl+B)">
          <IconButton icon="format_bold" size="small" aria-label="Negrita" />
        </Tooltip>
        <Tooltip title="Cursiva (Ctrl+I)">
          <IconButton icon="format_italic" size="small" aria-label="Cursiva" />
        </Tooltip>
        <Tooltip title="Subrayado (Ctrl+U)">
          <IconButton icon="format_underlined" size="small" aria-label="Subrayado" />
        </Tooltip>
        <Tooltip title="Lista con viñetas">
          <IconButton icon="format_list_bulleted" size="small" />
        </Tooltip>
        <Tooltip title="Insertar enlace (Ctrl+K)">
          <IconButton icon="link" size="small" aria-label="Insertar enlace" />
        </Tooltip>
      </div>
      <div className="demo-row">
        <Typography component="span" variant="body2">
          Saldo disponible: <strong>$1,240.50</strong>
        </Typography>
        <Tooltip title="Incluye pagos pendientes de confirmación" arrow placement="right">
          <IconButton icon="info" size="small" />
        </Tooltip>
      </div>
    </div>
  );
}
