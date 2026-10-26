import { useEffect, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import type { DialogCloseReason } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The equivalent of `open()`/`close()` is the `open` prop. `onOpen` and `onClose(event, reason)` match `mtx:dialog:open` and `mtx:dialog:close`, and `onExited` fires when the animation ends; try Escape, the backdrop or the button (`data-mtx-dialog-close`).',
  es: 'El equivalente de `open()`/`close()` es la prop `open`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:dialog:open` y `mtx:dialog:close`, y `onExited` se llama al terminar la animación; prueba Escape, el fondo o el botón (`data-mtx-dialog-close`).',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) =>
    setLog((lines) => [...lines.slice(-7), `${new Date().toLocaleTimeString()}  ${text}`]);

  // Equivalente a `open()` + `close('timeout-demo')` tras 2 s.
  useEffect(() => {
    if (!auto) return undefined;
    const timer = setTimeout(() => {
      write('close  reason=timeout-demo');
      setOpen(false);
      setAuto(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [auto]);

  const handleClose = (_event: unknown, reason: DialogCloseReason) => {
    write(`onClose  reason=${reason}`);
    setOpen(false);
    setAuto(false);
  };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={() => setOpen(true)}>
          abrir
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(true);
            setAuto(true);
          }}
        >
          abrir y cerrar tras 2 s
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <Dialog
        open={open}
        onClose={handleClose}
        onOpen={() => write('onOpen')}
        onExited={() => write('onExited')}
        keepMounted
        maxWidth="sm"
        title="Diálogo programático"
        actions={
          <Button variant="contained" data-mtx-dialog-close>
            Cerrar
          </Button>
        }
      >
        Controlado con la prop <code>open</code>. Ciérralo con Escape, el fondo o el botón.
      </Dialog>
    </div>
  );
}
