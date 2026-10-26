import './demo.css';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';

export const title = { en: 'Box sizing', es: 'Box sizing' };

export const description = {
  en: 'Inside `mtx-root` everything uses `box-sizing: border-box`: a box with `width: 100%`, 16px of padding and a 4px border does not overflow its container.',
  es: 'Dentro de `mtx-root` todo usa `box-sizing: border-box`: una caja con `width: 100%`, 16px de relleno y un borde de 4px no desborda su contenedor.',
};

export default function Demo() {
  return (
    <ScopedCssBaseline className="demo-group">
      <span className="demo-label">width 100% + padding 16px + border 4px</span>
      <div className="demo-css-baseline-sizing">Ocupa exactamente el ancho disponible.</div>
    </ScopedCssBaseline>
  );
}
