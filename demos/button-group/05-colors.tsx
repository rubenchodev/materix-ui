import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "`color` accepts the palette colors and `inherit`; a child with its own `color` keeps it.",
  es: "`color` acepta los colores de la paleta e `inherit`; un hijo con su propio `color` lo conserva.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <ButtonGroup variant="contained" color="secondary" label="Secondary">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup color="success" label="Success">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="text" color="error" label="Error">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="contained" color="inherit" label="Inherit">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="contained" label="Child with its own color">
        <Button>Primary</Button>
        <Button color="error">Own color</Button>
      </ButtonGroup>
    </div>
  );
}
