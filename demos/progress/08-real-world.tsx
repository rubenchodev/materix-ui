import { useEffect, useId, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardContent } from '@rubenchodev/materix-react/components/card';
import { LinearProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: "File upload with value and buffer, storage usage on a custom scale (`max`) and a loading button built with `Button` `loading`, which renders a decorative CircularProgress.",
  es: "Subida de archivos con valor y buffer, uso de almacenamiento en una escala propia (`max`) y un botón de carga hecho con `loading` de `Button`, que renderiza un CircularProgress decorativo.",
};

/** Simula una subida con valor y buffer. */
function useUpload() {
  const [state, setState] = useState({ value: 0, buffer: 10 });
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const id = setInterval(() => {
      setState(({ value }) => {
        const next = value >= 100 ? 0 : Math.min(100, value + Math.round(Math.random() * 8));
        return { value: next, buffer: Math.min(100, next + 10 + Math.round(Math.random() * 10)) };
      });
    }, reduce ? 1500 : 600);
    return () => clearInterval(id);
  }, []);
  return state;
}

export default function Demo() {
  const upload = useUpload();
  const seatsId = useId();
  const storageId = useId();
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  return (
    <div className="demo-grid-3">
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="subtitle2" component="span">
              Uploading 3 files
            </Typography>
            <LinearProgress value={upload.value} valueBuffer={upload.buffer} showLabel label="File upload" />
            <Typography variant="caption" color="text-secondary" component="span">
              {upload.value >= 100 ? 'Completed' : `${Math.round(upload.value)}% · 3 files`}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="subtitle2" component="span" id={seatsId}>
              Team seats · 7 of 10
            </Typography>
            <LinearProgress max={10} value={7} rounded aria-labelledby={seatsId} />
            <Typography variant="subtitle2" component="span" id={storageId} className="mtx-mt-2">
              Storage · 46 of 50 GB
            </Typography>
            <LinearProgress max={50} value={46} color="warning" rounded aria-labelledby={storageId} />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Save changes
          </Typography>
          <div className="demo-row">
            <Button variant="contained" loading={saving} loadingPosition="start" startIcon="save" onClick={save}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
