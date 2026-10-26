import { useRef, useState } from 'react';
import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: '`usePopover()` exposes `openPopover(anchor)`, `close()` and `toggle(anchor)`; `onOpen` and `onClose(event, reason)` replace `mtx:popover:open` and `mtx:popover:close`.',
  es: '`usePopover()` expone `openPopover(anchor)`, `close()` y `toggle(anchor)`; `onOpen` y `onClose(event, reason)` sustituyen a `mtx:popover:open` y `mtx:popover:close`.',
};

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...lines]);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const popover = usePopover({ onClose: (reason) => write(`onClose → ${reason}`) });

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Acciones</span>
        <div className="demo-row">
          <Button
            variant="outlined"
            size="small"
            ref={anchorRef}
            onClick={() => anchorRef.current && popover.openPopover(anchorRef.current)}
          >
            openPopover(anchor)
          </Button>
          <Button variant="outlined" size="small" onClick={(event) => popover.toggle(event.currentTarget)}>
            toggle(anchor)
          </Button>
        </div>
      </div>
      <Popover {...popover.popoverProps} label="Popover programático" className="mtx-p-2" onOpen={() => write('onOpen')}>
        <p className="mtx-mb-1">Abierto por código.</p>
        <Button variant="text" size="small" onClick={popover.close}>
          close()
        </Button>
      </Popover>
      <div className="demo-group">
        <span className="demo-label">Registro de eventos</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
