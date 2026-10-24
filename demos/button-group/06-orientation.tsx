import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Orientation', es: 'Orientación' };
export const description = {
  en: "`orientation=\"vertical\"` stacks the buttons (keeps `role=\"group\"`, which does not allow `aria-orientation`).",
  es: "`orientation=\"vertical\"` apila los botones (mantiene `role=\"group\"`, que no admite `aria-orientation`).",
};

const VARIANTS = ['outlined', 'contained', 'text'] as const;

export default function Demo() {
  return (
    <div className="demo-row demo-row--start">
      {VARIANTS.map((variant) => (
        <ButtonGroup key={variant} orientation="vertical" variant={variant} label={`Vertical ${variant}`}>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      ))}
    </div>
  );
}
