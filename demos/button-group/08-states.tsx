import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover or use Tab to see hover and focus (the active button is drawn above the neighboring borders). `disabled` disables the whole group; a single child can be disabled on its own. `disableElevation` removes the shadow of the contained group.",
  es: "Pasa el ratón o usa Tab para ver hover y foco (el botón activo se dibuja sobre los bordes vecinos). `disabled` deshabilita todo el grupo; un hijo puede deshabilitarse por separado. `disableElevation` quita la sombra del grupo contained.",
};

const VARIANTS = ['outlined', 'contained', 'text'] as const;

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Disabled group</span>
        <div className="demo-row">
          {VARIANTS.map((variant) => (
            <ButtonGroup key={variant} variant={variant} disabled label={`Disabled ${variant}`}>
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">One disabled button</span>
        <ButtonGroup variant="contained" label="One disabled child">
          <Button>One</Button>
          <Button disabled>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">No elevation</span>
        <ButtonGroup variant="contained" disableElevation label="No elevation">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
