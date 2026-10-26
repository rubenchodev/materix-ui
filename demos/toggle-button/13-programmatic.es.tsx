import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';
import type { ToggleButtonGroupValue } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: "Controlled `value` + `onChange`: setting `value` from code fires no `onChange`, and `disabled` toggles the whole group.",
  es: "`value` + `onChange` controlados: fijar `value` desde código no dispara `onChange`, y `disabled` alterna todo el grupo.",
};

export default function Demo() {
  const [value, setValue] = useState<ToggleButtonGroupValue>(['bold']);
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <ToggleButtonGroup
          value={value}
          disabled={disabled}
          onChange={(_, next) => {
            setValue(next);
            write(`onChange → ${JSON.stringify(next)}`);
          }}
          aria-label="Formato"
        >
          <ToggleButton value="bold" icon="format_bold" aria-label="Negrita" />
          <ToggleButton value="italic" icon="format_italic" aria-label="Cursiva" />
          <ToggleButton value="underlined" icon="format_underlined" aria-label="Subrayado" />
        </ToggleButtonGroup>
      </div>
      <div className="demo-row">
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setValue(['italic', 'underlined']);
            write('value = ["italic","underlined"]');
          }}
        >
          Fijar cursiva + subrayado
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setDisabled(!disabled);
            write(`disabled = ${!disabled}`);
          }}
        >
          Alternar deshabilitado
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
