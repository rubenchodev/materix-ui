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
        <span className="demo-label">Grupo deshabilitado</span>
        <div className="demo-row">
          {VARIANTS.map((variant) => (
            <ButtonGroup key={variant} variant={variant} disabled label={`Deshabilitado ${variant}`}>
              <Button>Uno</Button>
              <Button>Dos</Button>
              <Button>Tres</Button>
            </ButtonGroup>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Un botón deshabilitado</span>
        <ButtonGroup variant="contained" label="Un hijo deshabilitado">
          <Button>Uno</Button>
          <Button disabled>Dos</Button>
          <Button>Tres</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin elevación</span>
        <ButtonGroup variant="contained" disableElevation label="Sin elevación">
          <Button>Uno</Button>
          <Button>Dos</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
