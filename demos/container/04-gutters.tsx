import './demo.css';
import { Container } from '@rubenchodev/materix-react/components/container';

export const title = { en: 'Gutters', es: 'Márgenes laterales' };

export const description = {
  en: 'By default the container adds 16px of side padding on mobile and 24px from 600px. `disableGutters` removes them, for example to make an image or a table touch the edges.',
  es: 'Por defecto el contenedor añade 16px de relleno lateral en móvil y 24px desde 600px. `disableGutters` los elimina, por ejemplo para que una imagen o una tabla toque los bordes.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">With gutters</span>
        <div className="demo-container-frame">
          <Container maxWidth="sm">
            <div className="demo-container-box">16px / 24px on each side</div>
          </Container>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">disableGutters</span>
        <div className="demo-container-frame">
          <Container maxWidth="sm" disableGutters>
            <div className="demo-container-box">No side padding</div>
          </Container>
        </div>
      </div>
    </div>
  );
}
