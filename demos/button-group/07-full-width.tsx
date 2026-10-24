import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Full width', es: 'Ancho completo' };
export const description = {
  en: "`fullWidth` takes the full width and splits the space evenly.",
  es: "`fullWidth` ocupa todo el ancho y reparte el espacio por igual.",
};

export default function Demo() {
  return (
    <ButtonGroup fullWidth variant="contained" label="Full width">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  );
}
