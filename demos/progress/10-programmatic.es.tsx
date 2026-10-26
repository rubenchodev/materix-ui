import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { CircularProgress, LinearProgress, type ProgressColor } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: "Progress is controlled: update `value`, `valueBuffer`, `color` or `variant` from your state. `value={undefined}` switches back to indeterminate.",
  es: "Progress es controlado: actualiza `value`, `valueBuffer`, `color` o `variant` desde tu estado. `value={undefined}` vuelve al modo indeterminado.",
};

const COLORS: ProgressColor[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

export default function Demo() {
  const [value, setValue] = useState<number | undefined>(30);
  const [colorIndex, setColorIndex] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));
  const color = COLORS[colorIndex];

  const step = (delta: number) => {
    const next = Math.min(100, Math.max(0, (value ?? 0) + delta));
    setValue(next);
    write(`value = ${next}`);
  };

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        <CircularProgress value={value} showLabel size={56} color={color} />
      </div>
      <LinearProgress value={value} showLabel color={color} />
      <div className="demo-row">
        <Button variant="outlined" onClick={() => step(-10)}>-10</Button>
        <Button variant="outlined" onClick={() => step(10)}>+10</Button>
        <Button
          variant="outlined"
          onClick={() => {
            const next = (colorIndex + 1) % COLORS.length;
            setColorIndex(next);
            write(`color = "${COLORS[next]}"`);
          }}
        >
          Cambiar color
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setValue(undefined);
            write('value = undefined → indeterminado');
          }}
        >
          Indeterminado
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
