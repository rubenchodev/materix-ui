import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Paper, type PaperElevation } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Paper has no methods or events of its own: surfaces are created from state, and `elevation`, `variant` and `square` are ordinary props that update the classes on every render.',
  es: 'Paper no tiene métodos ni eventos propios: las superficies se crean desde el estado, y `elevation`, `variant` y `square` son props normales que actualizan las clases en cada render.',
};

const levels: PaperElevation[] = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24];
const box = { width: 120, height: 120 } as const;
const boxClass = 'mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-text-center';

export default function Demo() {
  const [items, setItems] = useState<PaperElevation[]>([]);
  const add = () => setItems((prev) => [...prev, levels[prev.length % levels.length]]);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={add}>
          Create Paper
        </Button>
        <Button variant="outlined" onClick={() => setItems([])}>
          Clear
        </Button>
      </div>
      <div className="demo-surface">
        {items.map((level, index) => (
          <Paper key={index} elevation={level} className={boxClass} style={box}>
            Elevation {level}
          </Paper>
        ))}
      </div>
      <pre className="demo-log" aria-live="polite">
        {items.map((level) => `<Paper elevation={${level}} /> → mtx-paper mtx-paper--elevation-${level}`).join('\n')}
      </pre>
    </div>
  );
}
