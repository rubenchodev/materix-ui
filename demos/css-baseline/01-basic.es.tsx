import { useEffect, useState } from 'react';
import { CssBaseline } from '@rubenchodev/materix-react/components/css-baseline';

export const title = { en: 'Basic usage', es: 'Uso básico' };

export const description = {
  en: 'This page renders `<CssBaseline />`: the component adds the `mtx-root` class to `<body>`, which applies the typography, the theme colors and `box-sizing`.',
  es: 'Esta página renderiza `<CssBaseline />`: el componente añade la clase `mtx-root` a `<body>`, que aplica la tipografía, los colores del tema y `box-sizing`.',
};

export default function Demo() {
  const [bodyClass, setBodyClass] = useState('');

  useEffect(() => {
    const read = () => setBodyClass(document.body.className);
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="demo-group">
      <CssBaseline />
      <span className="demo-label">Clases actuales de body</span>
      <p className="demo-status" aria-live="polite">
        class=&quot;{bodyClass}&quot;
      </p>
    </div>
  );
}
