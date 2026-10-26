import { useState } from 'react';
import type { ReactNode } from 'react';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';
import type { ToggleButtonGroupValue } from '@rubenchodev/materix-react/components/toggle-button';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world example: editor toolbar', es: 'Ejemplo real: barra de un editor' };
export const description = {
  en: "Editor toolbar: multiple formatting plus required exclusive alignment, both controlled and applied to the text.",
  es: "Barra de un editor: formato múltiple y alineación exclusiva obligatoria, ambos controlados y aplicados al texto.",
};

type Align = 'left' | 'center' | 'right';

export default function Demo() {
  const [formats, setFormats] = useState<ToggleButtonGroupValue>(['bold']);
  const [align, setAlign] = useState<ToggleButtonGroupValue>('left');
  const list = Array.isArray(formats) ? formats : [];

  let text: ReactNode = 'El veloz murciélago hindú comía feliz cardillo y kiwi.';
  if (list.includes('underlined')) text = <u>{text}</u>;
  if (list.includes('italic')) text = <em>{text}</em>;
  if (list.includes('bold')) text = <strong>{text}</strong>;

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <ToggleButtonGroup size="small" value={formats} onChange={(_, next) => setFormats(next)} aria-label="Formato">
          <ToggleButton value="bold" icon="format_bold" aria-label="Negrita" />
          <ToggleButton value="italic" icon="format_italic" aria-label="Cursiva" />
          <ToggleButton value="underlined" icon="format_underlined" aria-label="Subrayado" />
        </ToggleButtonGroup>
        <ToggleButtonGroup
          exclusive
          enforceValueSet
          size="small"
          value={align}
          onChange={(_, next) => setAlign(next)}
          aria-label="Alineación"
        >
          <ToggleButton value="left" icon="format_align_left" aria-label="Izquierda" />
          <ToggleButton value="center" icon="format_align_center" aria-label="Centro" />
          <ToggleButton value="right" icon="format_align_right" aria-label="Derecha" />
        </ToggleButtonGroup>
      </div>
      <Paper variant="outlined" className="demo-panel">
        <Typography variant="body1" align={align as Align}>
          {text}
        </Typography>
      </Paper>
    </div>
  );
}
