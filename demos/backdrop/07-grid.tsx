import { useState } from 'react';
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { CircularProgress } from '@rubenchodev/materix-react/components/progress';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'The backdrop is fixed to the viewport (in a portal on `document.body`) and does not take part in the layout; here a grid of triggers opens the same backdrop with different messages.',
  es: 'El backdrop está fijo al viewport (en un portal sobre `document.body`) y no participa en la maquetación; aquí una grilla de disparadores abre el mismo backdrop con mensajes distintos.',
};

const ACTIONS = [
  { label: 'Export', message: 'Exporting report…' },
  { label: 'Invite', message: 'Sending invitations…' },
  { label: 'Archive', message: 'Archiving project…' },
];

export default function Demo() {
  const [message, setMessage] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState('');
  const show = (text: string) => {
    setLastMessage(text);
    setMessage(text);
  };
  return (
    <>
      <Grid container spacing={2}>
        {ACTIONS.map(({ label, message: text }) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <Button variant="outlined" fullWidth onClick={() => show(text)}>
              {label}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Backdrop open={message !== null} onClose={() => setMessage(null)} closeOnClick closeOnEscape>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" decorative />
          <Typography variant="subtitle1" color="inherit" role="status">
            {lastMessage}
          </Typography>
        </Stack>
      </Backdrop>
    </>
  );
}
