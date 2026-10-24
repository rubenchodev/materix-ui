import './demo.css';
import { Container } from '@rubenchodev/materix-react/components/container';

export const title = { en: 'Basic usage', es: 'Uso básico' };

export const description = {
  en: 'A single `<Container>`. Without `maxWidth` the cap is `lg` (1200px), as in MUI. The shaded area is the container; the inner strip, its gutters.',
  es: 'Un único `<Container>`. Sin `maxWidth` el tope es `lg` (1200px), como en MUI. La zona sombreada es el contenedor; la franja interior, sus gutters.',
};

export default function Demo() {
  return (
    <div className="demo-container-frame">
      <Container>
        <div className="demo-container-box">Centered content · max. 1200px</div>
      </Container>
    </div>
  );
}
