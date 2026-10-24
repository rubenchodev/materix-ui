import { useEffect, useRef, useState } from 'react';
import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack, type StackSpacing } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Controlled props', es: 'Props controladas' };

export const description = {
  en: 'The vanilla `setDirection()`, `setSpacing()`, `setDivider()` and `refresh()` become props driven by state; dividers follow the children on every render. Stack emits no events.',
  es: 'Los `setDirection()`, `setSpacing()`, `setDivider()` y `refresh()` de vanilla pasan a ser props controladas por el estado; los divisores siguen a los hijos en cada render. Stack no emite eventos.',
};

export default function Demo() {
  const [row, setRow] = useState(true);
  const [spacing, setSpacing] = useState<StackSpacing>(2);
  const [divider, setDivider] = useState(false);
  const [count, setCount] = useState(3);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const classes = ref.current?.className ?? '';
    setLog((lines) => [...lines.slice(-5), `children=${count} → ${classes}`]);
  }, [row, spacing, divider, count]);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setRow((r) => !r)}>
          Toggle direction
        </Button>
        <Button variant="outlined" onClick={() => setSpacing(0.5)}>
          spacing 0.5
        </Button>
        <Button variant="outlined" onClick={() => setSpacing(3)}>
          spacing 3
        </Button>
        <Button variant="outlined" aria-pressed={divider} onClick={() => setDivider((d) => !d)}>
          Toggle dividers
        </Button>
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Add child
        </Button>
      </div>
      <Stack ref={ref} direction={row ? 'row' : 'column'} spacing={spacing} divider={divider}>
        {Array.from({ length: count }, (_, i) => (
          <div className="demo-stack-item" key={i}>
            {i + 1}
          </div>
        ))}
      </Stack>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
