import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Divider } from '@rubenchodev/materix-react/components/divider';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Divider has no methods or events: dividers are rendered from state like any other element, with nothing to initialize.',
  es: 'Divider no tiene métodos ni eventos: los divisores se renderizan desde el estado como cualquier otro elemento, sin nada que inicializar.',
};

export default function Demo() {
  const [count, setCount] = useState(0);
  const blocks = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setCount((n) => n + 1)}>
          Add divider with text
        </Button>
        <Button variant="text" onClick={() => setCount(0)}>
          Clear
        </Button>
      </div>
      <div className="demo-stack">
        {blocks.map((n) => (
          <Divider key={n} textAlign={n % 2 === 0 ? 'left' : 'center'}>
            Block {n}
          </Divider>
        ))}
      </div>
      <pre className="demo-log" aria-live="polite">
        {blocks
          .map((n) => `<Divider${n % 2 === 0 ? ' textAlign="left"' : ''}>Block ${n}</Divider> → role="separator"`)
          .join('\n')}
      </pre>
    </div>
  );
}
