import { useState } from 'react';
import { Alert, type AlertSeverity } from '@rubenchodev/materix-react/components/alert';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: '`open` replaces `close()`/`open()`; `onOpen` and `onClosed` are the `mtx:alert:open`/`close` events.',
  es: '`open` sustituye a `close()`/`open()`; `onOpen` y `onClosed` equivalen a los eventos `mtx:alert:open`/`close`.',
};

const SEVERITIES: AlertSeverity[] = ['success', 'info', 'warning', 'error'];

export default function Demo() {
  const [open, setOpen] = useState(true);
  const [dynamic, setDynamic] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines, `${new Date().toLocaleTimeString()}  ${text}`]);

  return (
    <div className="demo-stack demo-wide">
      <Alert
        severity="info"
        open={open}
        onClose={() => setOpen(false)}
        onClosed={() => write('onClosed  ← controlled alert')}
        onOpen={() => write('onOpen    ← controlled alert')}
      >
        Controlled from React state.
      </Alert>
      {dynamic.map((id) => (
        <Alert key={id} severity={SEVERITIES[id % 4]} dismissible onClosed={() => write(`onClosed  ← dynamic alert #${id}`)}>
          Dynamic alert #{id}
        </Alert>
      ))}
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setOpen(false)}>
          open = false
        </Button>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          open = true
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            const id = dynamic.length + 1;
            setDynamic((list) => [...list, id]);
            write(`render <Alert> #${id}`);
          }}
        >
          Create alert
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
