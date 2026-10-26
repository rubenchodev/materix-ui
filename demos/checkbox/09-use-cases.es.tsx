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
        <span className="demo-label">Formulario de acceso</span>
        <form className="demo-panel" onSubmit={(event) => event.preventDefault()}>
          <TextField label="Correo electrónico" startIcon="email" type="email" autoComplete="email" />
          <TextField label="Contraseña" startIcon="lock" type="password" autoComplete="current-password" />
          <Checkbox name="remember" label="Recordarme en este equipo" />
          <Button variant="contained" fullWidth type="submit">
            Iniciar sesión
          </Button>
        </form>
      </div>
      <div className="demo-group">
        <span className="demo-label">Confirmación antes de enviar</span>
        <div className="demo-panel">
          <Checkbox label="He leído y acepto los términos" checked={terms} onChange={(_, next) => setTerms(next)} />
          <Button variant="contained" disabled={!terms}>
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
