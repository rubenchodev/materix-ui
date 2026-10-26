import { useEffect, useRef, useState } from 'react';
import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';

export const title = { en: 'Apply at runtime', es: 'Aplicar en tiempo de ejecución' };

export const description = {
  en: 'The vanilla `Materix.init(el, \'css-baseline\')` becomes conditional rendering of `ScopedCssBaseline`. The component emits no events; the log shows the element\'s real state.',
  es: 'El `Materix.init(el, \'css-baseline\')` de vanilla pasa a ser un renderizado condicional de `ScopedCssBaseline`. El componente no emite eventos; el registro muestra el estado real del elemento.',
};

export default function Demo() {
  const [applied, setApplied] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!applied || !ref.current) return;
    const el = ref.current;
    setLog((lines) => [...lines.slice(-5), `aplicar → class="${el.className}" · font-family: ${getComputedStyle(el).fontFamily}`]);
  }, [applied]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-mtx-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-mtx-theme', next);
    setLog((lines) => [...lines.slice(-5), `data-mtx-theme="${next}" → color-scheme: ${getComputedStyle(document.body).colorScheme}`]);
  };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" aria-pressed={applied} onClick={() => setApplied((a) => !a)}>
          {applied ? 'Quitar de la caja' : 'Aplicar a la caja'}
        </Button>
        <Button variant="outlined" onClick={toggleTheme}>
          Alternar tema
        </Button>
      </div>
      {applied ? (
        <ScopedCssBaseline ref={ref} className="demo-css-baseline-box">
          <p>Caja con la línea base aplicada desde React.</p>
        </ScopedCssBaseline>
      ) : (
        <div className="demo-css-baseline-box demo-css-baseline-raw">
          <p>Caja creada sin línea base. Pulsa &quot;Aplicar a la caja&quot;.</p>
        </div>
      )}
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
