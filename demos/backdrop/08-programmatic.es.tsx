import { useEffect, useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The `open` prop replaces `open()`, `close()` and `toggle()`. `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:backdrop:open` and `mtx:backdrop:close`; `onExited` fires when the fade-out ends.',
  es: 'La prop `open` sustituye a `open()`, `close()` y `toggle()`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:backdrop:open` y `mtx:backdrop:close`; `onExited` se llama al terminar el fundido de salida.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines, `${new Date().toLocaleTimeString()}  ${text}`]);

  useEffect(() => {
    if (!auto) return undefined;
    const timer = setTimeout(() => {
      setAuto(false);
      setOpen(false);
      write('open = false (tras 1,5 s)');
    }, 1500);
    return () => clearTimeout(timer);
  }, [auto]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} wrap alignItems="center">
        <Button variant="contained" onClick={() => setOpen(true)}>
          open = true
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(true);
            setAuto(true);
          }}
        >
          Abrir y cerrar tras 1,5 s
        </Button>
      </Stack>
      <Typography variant="caption" color="text-secondary" component="p" role="status">
        open: {String(open)}
      </Typography>
      <Backdrop
        open={open}
        closeOnClick
        closeOnEscape
        onOpen={() => write('onOpen')}
        onClose={(_event, reason) => {
          write(`onClose   motivo: ${reason}`);
          setAuto(false);
          setOpen(false);
        }}
        onExited={() => write('onExited')}
      >
        <CircularProgress color="inherit" label="Cargando" />
      </Backdrop>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </Stack>
  );
}
