import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: "A sign-in form with a \"Remember me\" checkbox and a terms confirmation before submitting.",
  es: "Un formulario de acceso con la casilla «Recordarme» y una confirmación de términos antes de enviar.",
};

export default function Demo() {
  const [terms, setTerms] = useState(false);
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Sign-in form</span>
        <form className="demo-panel" onSubmit={(event) => event.preventDefault()}>
          <TextField label="Email" startIcon="email" type="email" autoComplete="email" />
          <TextField label="Password" startIcon="lock" type="password" autoComplete="current-password" />
          <Checkbox name="remember" label="Remember me on this device" />
          <Button variant="contained" fullWidth type="submit">
            Sign in
          </Button>
        </form>
      </div>
      <div className="demo-group">
        <span className="demo-label">Confirmation before submitting</span>
        <div className="demo-panel">
          <Checkbox label="I have read and accept the terms" checked={terms} onChange={(_, next) => setTerms(next)} />
          <Button variant="contained" disabled={!terms}>
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
}
