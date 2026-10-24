import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: "`variant=\"outlined|contained|text\"`, as in MUI. Outlined overlaps the borders; contained separates with the dark shade of the color and moves the elevation to the group; text separates with a 50% line.",
  es: "`variant=\"outlined|contained|text\"`, como en MUI. Outlined superpone los bordes; contained separa con el tono oscuro del color y lleva la elevación al grupo; text separa con una línea al 50%.",
};

const VARIANTS = ['outlined', 'contained', 'text'] as const;

export default function Demo() {
  return (
    <div className="demo-stack">
      {VARIANTS.map((variant) => (
        <div className="demo-group" key={variant}>
          <span className="demo-label">{variant === 'outlined' ? 'outlined (default)' : variant}</span>
          <ButtonGroup variant={variant} label={variant}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  );
}
