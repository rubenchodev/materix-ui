import '@rubenchodev/materix-ui/utilities.css';
import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';
import type { SpeedDialDirection } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The vanilla `open()`, `close()`, `toggle()` and `direction` become the `open` and `direction` props. `onOpen`/`onClose` receive the event and the reason, like `mtx:speed-dial:open`/`close`.',
  es: '`open()`, `close()`, `toggle()` y `direction` de vanilla pasan a ser las props `open` y `direction`. `onOpen`/`onClose` reciben el evento y el motivo, como `mtx:speed-dial:open`/`close`.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<SpeedDialDirection>('up');
  const [log, setLog] = useState<string[]>([]);
  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));
  const nextDirection: SpeedDialDirection = direction === 'up' ? 'left' : 'up';

  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Actions</span>
        <div className="demo-row">
          <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
            open()
          </Button>
          <Button variant="outlined" size="small" onClick={() => setOpen(false)}>
            close()
          </Button>
          <Button variant="outlined" size="small" onClick={() => setOpen((value) => !value)}>
            toggle()
          </Button>
          <Button variant="outlined" size="small" onClick={() => setDirection(nextDirection)}>
            direction = &apos;{nextDirection}&apos;
          </Button>
        </div>
      </div>
      <div className="demo-panel demo-panel--tall">
        <SpeedDial
          ariaLabel="Share actions"
          open={open}
          direction={direction}
          tooltipHover={direction === 'left'}
          onOpen={(_, reason) => {
            setOpen(true);
            write(`onOpen (reason: ${reason})`);
          }}
          onClose={(_, reason) => {
            setOpen(false);
            write(`onClose (reason: ${reason})`);
          }}
          className={corner}
        >
          <SpeedDialAction icon="mail" tooltipTitle="Email" onClick={() => write('click on "Email"')} />
          <SpeedDialAction icon="link" tooltipTitle="Link" onClick={() => write('click on "Link"')} />
        </SpeedDial>
      </div>
      <div className="demo-group">
        <span className="demo-label">Event log · open: {String(open)}</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </>
  );
}
