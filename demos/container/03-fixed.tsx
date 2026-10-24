import './demo.css';
import { Container } from '@rubenchodev/materix-react/components/container';

export const title = { en: 'Fixed', es: 'Ancho fijo' };

export const description = {
  en: '`fixed` makes the max width jump to the minimum of each breakpoint (600, 900, 1200, 1536px) instead of growing fluidly. Useful when the design targets specific widths. Resize the window to see it.',
  es: '`fixed` hace que el ancho máximo salte al mínimo de cada breakpoint (600, 900, 1200, 1536px) en lugar de crecer de forma fluida. Útil cuando el diseño apunta a anchos concretos. Redimensiona la ventana para verlo.',
};

export default function Demo() {
  return (
    <div className="demo-container-frame">
      <Container fixed>
        <div className="demo-container-box">fixed</div>
      </Container>
    </div>
  );
}
