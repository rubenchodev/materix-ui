import { useEffect, useRef, useState } from 'react';
import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Container, type ContainerMaxWidth } from '@rubenchodev/materix-react/components/container';

export const title = { en: 'Controlled props', es: 'Props controladas' };

export const description = {
  en: 'The vanilla `setMaxWidth()`, `setFixed()` and `setGutters()` become props driven by state. Container emits no events: the log shows the resulting classes.',
  es: 'Los `setMaxWidth()`, `setFixed()` y `setGutters()` de vanilla pasan a ser props controladas por el estado. Container no emite eventos: el registro muestra las clases resultantes.',
};

const sizes: ContainerMaxWidth[] = ['xs', 'sm', 'md', false];

export default function Demo() {
  const [maxWidth, setMaxWidth] = useState<ContainerMaxWidth>('sm');
  const [gutters, setGutters] = useState(true);
  const [fixed, setFixed] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const classes = ref.current?.className ?? '';
    setLog((lines) => [...lines.slice(-5), `maxWidth=${String(maxWidth)} gutters=${gutters} fixed=${fixed} → ${classes}`]);
  }, [maxWidth, gutters, fixed]);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        {sizes.map((value) => (
          <Button
            key={String(value)}
            variant={maxWidth === value ? 'contained' : 'outlined'}
            aria-pressed={maxWidth === value}
            onClick={() => setMaxWidth(value)}
          >
            {String(value)}
          </Button>
        ))}
        <Button variant="outlined" aria-pressed={!gutters} onClick={() => setGutters((g) => !g)}>
          Alternar gutters
        </Button>
        <Button variant="outlined" aria-pressed={fixed} onClick={() => setFixed((f) => !f)}>
          Alternar fixed
        </Button>
      </div>
      <div className="demo-container-frame">
        <Container ref={ref} maxWidth={maxWidth} disableGutters={!gutters} fixed={fixed}>
          <div className="demo-container-box">Container controlado por el estado de React</div>
        </Container>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
