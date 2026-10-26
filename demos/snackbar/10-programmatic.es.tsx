import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The `open` prop replaces `open()` and `close()`, and `message`/`action` replace `setMessage()`/`setAction()`. `onOpen`, `onAction` and `onClose(event, reason)` are the equivalents of `mtx:snackbar:open`, `:action` and `:close`.',
  es: 'La prop `open` sustituye a `open()` y `close()`, y `message`/`action` a `setMessage()`/`setAction()`. `onOpen`, `onAction` y `onClose(event, reason)` equivalen a `mtx:snackbar:open`, `:action` y `:close`.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Controlado desde el estado de React');
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines, `${new Date().toLocaleTimeString()}  ${text}`]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} wrap alignItems="center">
        <Button variant="contained" onClick={() => setOpen(true)}>
          open = true
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setMessage(`Borrador guardado a las ${new Date().toLocaleTimeString()}`);
            setOpen(true);
          }}
        >
          Cambiar mensaje
        </Button>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          open = false
        </Button>
      </Stack>
      <Typography variant="caption" color="text-secondary" component="p" role="status">
        open: {String(open)}
      </Typography>
      <Snackbar
        open={open}
        message={message}
        action="Cerrar"
        closeOnAction
        autoHideDuration={5000}
        onOpen={() => write('onOpen')}
        onAction={() => write('onAction')}
        onClose={(_event, reason) => {
          write(`onClose   motivo: ${reason}`);
          setOpen(false);
        }}
        onExited={() => write('onExited')}
      />
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </Stack>
  );
}
