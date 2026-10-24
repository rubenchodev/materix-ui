import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Validation', es: 'Validación' };
export const description = {
  en: 'Combine native validation (`required`, `type`, `checkValidity()` through `inputRef`) with `error` and `helperText`.',
  es: 'Combina la validación nativa (`required`, `type`, `checkValidity()` mediante `inputRef`) con `error` y `helperText`.',
};

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;
    if (input.checkValidity()) setMessage('');
    else setMessage(input.value ? 'Invalid email' : 'Email is required');
  };

  return (
    <form className="demo-stack demo-wide" noValidate onSubmit={handleSubmit} onReset={() => setMessage('')}>
      <TextField
        inputRef={inputRef}
        label="Email"
        startIcon="email"
        required
        type="email"
        error={Boolean(message)}
        helperText={message || 'We will send you the confirmation'}
      />
      <div className="mtx-d-flex mtx-justify-content-end mtx-gap-1">
        <Button variant="text" type="reset">
          Clear
        </Button>
        <Button variant="contained" type="submit">
          Validate
        </Button>
      </div>
    </form>
  );
}
