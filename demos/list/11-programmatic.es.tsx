import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import type { ListSelectDetail } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Click a row to see `onSelect` (the equivalent of `mtx:list:select`, with `item` and `value`). The buttons control the selection with `value` and the Calendar row with `disabled`.',
  es: 'Pulsa una fila para ver `onSelect` (el equivalente a `mtx:list:select`, con `item` y `value`). Los botones controlan la selección con `value` y la fila Calendar con `disabled`.',
};

export default function Demo() {
  const [value, setValue] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((prev) => [...prev.slice(-5), text]);

  const handleSelect = ({ item, value: next }: ListSelectDetail) => {
    setValue(next);
    write(`onSelect  value: "${next}" · item: "${item.textContent?.trim()}"`);
  };

  return (
    <div className="demo-stack">
      <Paper variant="outlined" className="demo-fixed-width">
        <List aria-label="Vistas" value={value} onSelect={handleSelect}>
          <li>
            <ListItemButton value="list" icon="view_list">
              Lista
            </ListItemButton>
          </li>
          <li>
            <ListItemButton value="grid" icon="grid_view">
              Cuadrícula
            </ListItemButton>
          </li>
          <li>
            <ListItemButton value="calendar" icon="calendar_month" disabled={disabled}>
              Calendario
            </ListItemButton>
          </li>
        </List>
      </Paper>
      <div className="demo-row">
        <Button
          variant="outlined"
          onClick={() => {
            setValue('calendar');
            write('value="calendar"');
          }}
        >
          Seleccionar Calendario
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setValue(null);
            write('value={null}');
          }}
        >
          Limpiar selección
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setDisabled((current) => !current);
            write(`Calendario disabled={${!disabled}}`);
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
