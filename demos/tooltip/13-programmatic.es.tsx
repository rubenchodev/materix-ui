import { useRef, useState } from 'react';
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import type { TooltipActions } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: '`open` makes it controlled and `onOpen`/`onClose` replace `mtx:tooltip:open`/`close`. The `action` ref exposes `open()`, `close()`, `toggle()`, `update()` and `isOpen`, like `Materix.tooltip.show/hide`.',
  es: '`open` lo hace controlado y `onOpen`/`onClose` sustituyen a `mtx:tooltip:open`/`close`. La ref `action` expone `open()`, `close()`, `toggle()`, `update()` e `isOpen`, como `Materix.tooltip.show/hide`.',
};

export default function Demo() {
  const actions = useRef<TooltipActions>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('Copiar enlace');
  const [log, setLog] = useState<string[]>([]);
  const write = (line: string) => setLog((lines) => [`${new Date().toLocaleTimeString()}  ${line}`, ...lines]);

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Controlado (open / onOpen / onClose)</span>
        <div className="demo-row">
          <Tooltip
            title={text}
            placement="top"
            open={open}
            onOpen={() => {
              write('onOpen');
              setOpen(true);
            }}
            onClose={() => {
              write('onClose');
              setOpen(false);
            }}
          >
            <Button variant="outlined" startIcon="content_copy">
              Copiar
            </Button>
          </Tooltip>
          <Button variant="text" size="small" onClick={() => setOpen(true)}>
            open = true
          </Button>
          <Button variant="text" size="small" onClick={() => setOpen(false)}>
            open = false
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setText('¡Copiado!');
              setOpen(true);
            }}
          >
            title = &apos;¡Copiado!&apos;
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Imperativo (ref action)</span>
        <div className="demo-row">
          <Tooltip title="Abierto desde código" action={actions} arrow>
            <Button variant="outlined" startIcon="code">
              Destino
            </Button>
          </Tooltip>
          <Button variant="text" size="small" onClick={() => actions.current?.open()}>
            action.open()
          </Button>
          <Button variant="text" size="small" onClick={() => actions.current?.close()}>
            action.close()
          </Button>
        </div>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
