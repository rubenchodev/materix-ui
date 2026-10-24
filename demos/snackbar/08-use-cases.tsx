import { useState } from 'react';
import type { FormEvent } from 'react';
import { SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'A subscription form: the field validates the email and, when it is valid, the shared snackbar confirms the subscription and offers to undo it.',
  es: 'Un formulario de suscripción: el campo valida el correo y, si es válido, el snackbar compartido confirma la suscripción y ofrece deshacerla.',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubscribeForm() {
  const { enqueue } = useSnackbar();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(true);
      return;
    }
    setError(false);
    const subscribed = email;
    setEmail('');
    enqueue({
      message: `${subscribed} subscribed`,
      action: 'Undo',
      onAction: () => setEmail(subscribed),
      duration: 6000,
    });
  };

  return (
    <Stack component="form" spacing={2} alignItems="flex-start" noValidate onSubmit={submit}>
      <TextField
        label="Email"
        type="email"
        name="email"
        variant="outlined"
        value={email}
        onChange={(_event, value) => setEmail(value)}
        error={error}
        helperText={error ? 'Enter a valid email address.' : 'We will send you one email per month.'}
      />
      <Button type="submit" variant="contained" startIcon="mail">
        Subscribe
      </Button>
    </Stack>
  );
}

export default function Demo() {
  return (
    <SnackbarProvider>
      <SubscribeForm />
    </SnackbarProvider>
  );
}
