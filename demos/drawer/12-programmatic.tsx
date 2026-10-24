import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The `open` prop replaces `open()`, `close()`, `toggle()` and `isOpen`. `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:drawer:open` and `mtx:drawer:close`; the log shows them: also try Escape, the backdrop and the X.',
  es: 'La prop `open` sustituye a `open()`, `close()`, `toggle()` e `isOpen`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:drawer:open` y `mtx:drawer:close`; el registro los muestra: prueba también Escape, el fondo y la X.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines.slice(-7), text]);

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setOpen(true)}>
          open = true
        </Button>
        <Button variant="outlined" onClick={() => setOpen((value) => !value)}>
          Toggle
        </Button>
        <Button onClick={() => write(`open → ${open}`)}>Read open</Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <Drawer
        anchor="right"
        title="Programmatic control"
        padded
        open={open}
        onOpen={() => write('onOpen')}
        onClose={(_event, reason) => {
          write(`onClose · reason="${reason}"`);
          setOpen(false);
        }}
      >
        <p>Close it from here by setting the state.</p>
        <Button
          variant="contained"
          onClick={() => {
            write('saved → open = false');
            setOpen(false);
          }}
        >
          Save and close
        </Button>
      </Drawer>
    </div>
  );
}
