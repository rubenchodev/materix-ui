import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "`size=\"small|medium|large\"` is inherited by every button (32, 40 and 48px), aligned with a TextField and IconButton of the same height.",
  es: "`size=\"small|medium|large\"` se hereda en todos los botones (32, 40 y 48px), alineados con un TextField y un IconButton de la misma altura.",
};

const SIZES = [
  { size: 'large', label: 'Large · 48px' },
  { size: 'medium', label: 'Medium · 40px' },
  { size: 'small', label: 'Small · 32px' },
] as const;

export default function Demo() {
  return (
    <div className="demo-stack">
      {SIZES.map(({ size, label }) => (
        <div className="demo-group" key={size}>
          <span className="demo-label">{label}</span>
          <div className="demo-row">
            <ButtonGroup size={size} label={label}>
              <Button>Uno</Button>
              <Button>Dos</Button>
              <Button>Tres</Button>
            </ButtonGroup>
            {size === 'medium' ? (
              <TextField label="Buscar" size="small" type="text" />
            ) : (
              <IconButton icon="more_vert" size={size} aria-label="Más opciones" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
