import './demo.css';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';

export const title = { en: 'With and without baseline', es: 'Con y sin línea base' };

export const description = {
  en: 'On the left, a block with the browser defaults; on the right, the same content with `mtx-root`: Roboto 16px, 1.5 line height, theme colors and bold at 700.',
  es: 'A la izquierda, un bloque con los estilos del navegador; a la derecha, el mismo contenido con `mtx-root`: Roboto 16px, interlineado 1.5, colores del tema y negrita a 700.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Browser</span>
        <div className="demo-css-baseline-box demo-css-baseline-raw">
          <p>
            Text with the browser typography and <strong>bold</strong>.
          </p>
          <input type="text" aria-label="Field without baseline" placeholder="Native field" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">mtx-root</span>
        <ScopedCssBaseline className="demo-css-baseline-box">
          <p>
            Text with the Materix base typography and <strong>bold</strong>.
          </p>
          <input type="text" aria-label="Field with baseline" placeholder="Native field" />
        </ScopedCssBaseline>
      </div>
    </div>
  );
}
