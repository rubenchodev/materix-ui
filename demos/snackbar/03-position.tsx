import { useState } from 'react';
import { Snackbar } from '@rubenchodev/materix-react/components/snackbar';
import type { SnackbarOrigin } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Position', es: 'Posición' };
export const description = {
  en: '`anchorOrigin` combines `vertical` (`top`/`bottom`) with `horizontal` (`left`/`center`/`right`). Below 600px the snackbar spans the full width with an 8px side margin.',
  es: '`anchorOrigin` combina `vertical` (`top`/`bottom`) con `horizontal` (`left`/`center`/`right`). Por debajo de 600px el snackbar ocupa todo el ancho con 8px de margen lateral.',
};

const HORIZONTAL: SnackbarOrigin['horizontal'][] = ['left', 'center', 'right'];
const VERTICAL: SnackbarOrigin['vertical'][] = ['top', 'bottom'];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<SnackbarOrigin>({ vertical: 'bottom', horizontal: 'center' });
  const show = (next: SnackbarOrigin) => {
    setOrigin(next);
    setOpen(true);
  };
  return (
    <Stack spacing={2}>
      {VERTICAL.map((vertical) => (
        <Stack key={vertical} spacing={1.5}>
          <Typography variant="overline" color="text-secondary" component="span">
            {vertical === 'top' ? 'Top' : 'Bottom'}
          </Typography>
          <Stack direction="row" spacing={2} wrap alignItems="center">
            {HORIZONTAL.map((horizontal) => (
              <Button key={horizontal} variant="outlined" onClick={() => show({ vertical, horizontal })}>
                {vertical}-{horizontal}
              </Button>
            ))}
          </Stack>
        </Stack>
      ))}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={origin}
        message={`${origin.vertical} ${origin.horizontal}`}
        autoHideDuration={3000}
      />
    </Stack>
  );
}
