import './demo.css';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Scoped baseline', es: 'Línea base acotada' };

export const description = {
  en: 'The baseline can also be applied to a specific container with `ScopedCssBaseline`, which is handy for embedding Materix in pages with other styles.',
  es: 'La línea base también puede aplicarse a un contenedor concreto con `ScopedCssBaseline`, algo útil para incrustar Materix en páginas con otros estilos.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Contenedor sin línea base</span>
        <div className="demo-css-baseline-box demo-css-baseline-raw">
          <h3>Widget externo</h3>
          <p>Hereda los estilos del sitio anfitrión.</p>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">&lt;ScopedCssBaseline component=&quot;section&quot;&gt;</span>
        <ScopedCssBaseline component="section" className="demo-css-baseline-box">
          <Typography variant="h6" component="h3" gutterBottom>
            Widget de Materix
          </Typography>
          <Typography variant="body2">Tipografía y colores del tema dentro del contenedor.</Typography>
        </ScopedCssBaseline>
      </div>
    </div>
  );
}
