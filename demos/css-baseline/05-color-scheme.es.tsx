import { useEffect, useRef, useState } from 'react';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';

export const title = { en: 'Color scheme', es: 'Esquema de color' };

export const description = {
  en: 'Switch the theme with the button in the top bar: with `data-mtx-theme="dark"` on `<html>`, `mtx-root` switches to `color-scheme: dark` and native controls are drawn dark.',
  es: 'Cambia el tema con el botón de la barra superior: con `data-mtx-theme="dark"` en `<html>`, `mtx-root` pasa a `color-scheme: dark` y los controles nativos se pintan oscuros.',
};

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scheme, setScheme] = useState('');

  useEffect(() => {
    const read = () => setScheme(ref.current ? getComputedStyle(ref.current).colorScheme : '');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mtx-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <ScopedCssBaseline ref={ref} className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Controles nativos</span>
        <div className="demo-row">
          <input type="date" aria-label="Fecha nativa" />
          <input type="color" aria-label="Color nativo" defaultValue="#4818d0" />
          <select aria-label="Select nativo">
            <option>Opción nativa</option>
            <option>Otra opción</option>
          </select>
          <input type="range" aria-label="Rango nativo" />
        </div>
      </div>
      <p className="demo-status" aria-live="polite">
        color-scheme: {scheme}
      </p>
    </ScopedCssBaseline>
  );
}
