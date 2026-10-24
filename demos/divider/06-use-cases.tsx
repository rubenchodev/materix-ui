import { Button } from '@rubenchodev/materix-react/components/button';
import { Divider } from '@rubenchodev/materix-react/components/divider';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'An "or" separator between a social sign-in and the sign-in form.',
  es: 'Un separador «o» entre un inicio de sesión social y el formulario de inicio de sesión.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <div className="demo-stack demo-fixed-width">
        <Button variant="outlined">Continue with Google</Button>
        <Divider>or</Divider>
        <TextField label="Email" variant="outlined" type="email" />
        <Button variant="contained">Continue</Button>
      </div>
    </div>
  );
}
