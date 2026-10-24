import { Button, type ButtonColor, type ButtonVariant } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "Primary is the default color. `color` applies any palette color in all three variants; `inherit` takes the container color and `surface` adapts the button to a colored background.",
  es: "Primary es el color por defecto. `color` aplica cualquier color de la paleta en las tres variantes; `inherit` toma el color del contenedor y `surface` adapta el botón a un fondo de color.",
};

const COLORS: ButtonColor[] = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];
const VARIANTS: ButtonVariant[] = ['contained', 'outlined', 'text'];
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function Demo() {
  return (
    <div className="demo-stack">
      {VARIANTS.map((variant) => (
        <div className="demo-group" key={variant}>
          <span className="demo-label">{capitalize(variant)}</span>
          <div className="demo-row">
            {COLORS.map((color) => (
              <Button key={color} variant={variant} color={color}>
                {capitalize(color)}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <div className="demo-group">
        <span className="demo-label">Inherit · color=&quot;inherit&quot; on a colored surface</span>
        <div className="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
          <Button color="inherit">Later</Button>
          <Button variant="outlined" color="inherit">See plans</Button>
          <Button variant="contained" color="inherit">Get started</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">On a colored surface · surface=&quot;primary&quot;</span>
        <div className="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
          <Button variant="contained" surface="primary">Start free trial</Button>
          <Button variant="outlined" surface="primary">Book a demo</Button>
          <Button surface="primary">Later</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Exact MUI colors · data-mtx-contrast=&quot;mui&quot; (opt-out of the default AA contrast)</span>
        <div className="demo-row" data-mtx-contrast="mui">
          {VARIANTS.flatMap((variant) =>
            (['warning', 'info'] as const).map((color) => (
              <Button key={`${variant}-${color}`} variant={variant} color={color}>
                {capitalize(color)}
              </Button>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
