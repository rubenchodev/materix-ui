import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: '`open` is controlled: any button can open the menu anchored to another element. The log shows `onOpen`, `onSelect` and `onClose(event, reason)`, the equivalents of `mtx:menu:open`, `mtx:menu:select` and `mtx:menu:close`.',
  es: '`open` es controlado: cualquier botón puede abrir el menú anclado a otro elemento. El registro muestra `onOpen`, `onSelect` y `onClose(event, reason)`, equivalentes a `mtx:menu:open`, `mtx:menu:select` y `mtx:menu:close`.',
};

export default function Demo() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button ref={anchorRef} variant="outlined">
          Ancla del menú
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)}>
          setOpen(true)
        </Button>
        <Button variant="text" onClick={() => write(`open = ${open}`)}>
          Leer open
        </Button>
      </div>
      <Menu
        open={open}
        anchorEl={anchorRef}
        restoreFocusTo={anchorRef}
        onOpen={() => write('onOpen')}
        onSelect={({ value }) => write(`onSelect → ${value}`)}
        onClose={(_event, reason) => {
          write(`onClose → ${reason}`);
          setOpen(false);
        }}
      >
        <MenuItem icon="save" value="save">
          Guardar
        </MenuItem>
        <MenuItem icon="file_download" value="export">
          Exportar
        </MenuItem>
      </Menu>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
