import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The `open` prop replaces `open()`, `close()`, `toggle()` and `isOpen`. `useDrawer` gives `open`, `setOpen`, `toggle`, `getTriggerProps()` and `drawerProps`; its `onOpen` and `onClose(reason)` (like the Drawer props `onOpen`/`onClose(event, reason)`) are the equivalents of `mtx:drawer:open` and `mtx:drawer:close`; the log shows them: also try Escape, the backdrop and the X.',
  es: 'La prop `open` sustituye a `open()`, `close()`, `toggle()` e `isOpen`. `useDrawer` da `open`, `setOpen`, `toggle`, `getTriggerProps()` y `drawerProps`; sus `onOpen` y `onClose(reason)` (los `onOpen`/`onClose(event, reason)` del Drawer) equivalen a `mtx:drawer:open` y `mtx:drawer:close`; el registro los muestra: prueba también Escape, el fondo y la X.',
};

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines.slice(-7), text]);
  // El hook da el estado, setOpen/toggle (open()/close()/toggle() de vanilla) y las props de disparador y drawer.
  const drawer = useDrawer({
    onOpen: () => write('onOpen'),
    onClose: (reason) => write(`onClose · reason="${reason}"`),
  });

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        <Button variant="outlined" {...drawer.getTriggerProps({ action: 'open' })}>
          setOpen(true)
        </Button>
        <Button variant="outlined" {...drawer.getTriggerProps()}>
          toggle()
        </Button>
        <Button onClick={() => write(`open → ${drawer.open}`)}>Read open</Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <Drawer anchor="right" title="Programmatic control" padded {...drawer.drawerProps}>
        <p>Close it from here with setOpen(false).</p>
        <Button variant="contained" onClick={() => drawer.setOpen(false)}>
          Save and close
        </Button>
      </Drawer>
    </div>
  );
}
