import { useState, type FormEvent } from 'react';
import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'In forms', es: 'En formularios' };
export const description = {
  en: 'Bind `open` to the validation result. Submit the empty form to see the error and fill it in to see the success message.',
  es: 'Vincula `open` al resultado de la validación. Envía el formulario vacío para ver el error y rellénalo para ver el éxito.',
};

export default function Demo() {
  const [result, setResult] = useState<'idle' | 'error' | 'success'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const valid = String(data.get('email') ?? '').trim() !== '' && String(data.get('password') ?? '').trim() !== '';
    setResult(valid ? 'success' : 'error');
  };

  return (
    <form className="demo-stack demo-fixed-width" noValidate onSubmit={handleSubmit}>
      <Alert severity="error" title="Check the form" open={result === 'error'}>
        Email and password are required.
      </Alert>
      <Alert severity="success" open={result === 'success'}>
        Signed in successfully.
      </Alert>
      <TextField label="Email" variant="outlined" type="email" name="email" autoComplete="email" />
      <TextField label="Password" variant="outlined" type="password" name="password" autoComplete="current-password" />
      <Button variant="contained" type="submit">
        Sign in
      </Button>
    </form>
  );
}
