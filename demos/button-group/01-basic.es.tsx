import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A `<ButtonGroup>` with `<Button>` children: the group passes its variant (outlined by default) to the buttons and adds `role=\"group\"`. Give it a name with `label` or `aria-label`.",
  es: "Un `<ButtonGroup>` con hijos `<Button>`: el grupo pasa su variante (outlined por defecto) a los botones y añade `role=\"group\"`. Dale un nombre con `label` o `aria-label`.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <ButtonGroup variant="contained" label="Acciones básicas">
        <Button>Uno</Button>
        <Button>Dos</Button>
        <Button>Tres</Button>
      </ButtonGroup>
    </div>
  );
}
