import { useEffect, useRef, useState } from 'react';
import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid, type GridJustify, type GridSpacing } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Controlled props', es: 'Props controladas' };

export const description = {
  en: 'The vanilla `setSpacing()`, `setJustifyContent()` and `setDirection()` become props driven by state, and new items are just new children (no `Materix.init()`). Grid emits no events: the log shows the resulting classes.',
  es: 'Los `setSpacing()`, `setJustifyContent()` y `setDirection()` de vanilla pasan a ser props controladas por el estado y los ítems nuevos son simplemente nuevos hijos (sin `Materix.init()`). Grid no emite eventos: el registro muestra las clases resultantes.',
};

export default function Demo() {
  const [spacing, setSpacing] = useState<GridSpacing>(2);
  const [justify, setJustify] = useState<GridJustify>('flex-start');
  const [reversed, setReversed] = useState(false);
  const [count, setCount] = useState(3);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const classes = Array.from(ref.current?.classList ?? []).filter((c) => c.startsWith('mtx-grid--'));
    setLog((lines) => [...lines.slice(-5), `ítems=${count} → ${classes.join(' ')}`]);
  }, [spacing, justify, reversed, count]);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        {([0, 2, 4] as GridSpacing[]).map((value) => (
          <Button key={value} variant="outlined" onClick={() => setSpacing(value)}>
            spacing {value}
          </Button>
        ))}
        <Button variant="outlined" onClick={() => setJustify('center')}>
          justify center
        </Button>
        <Button variant="outlined" onClick={() => setJustify('flex-start')}>
          justify flex-start
        </Button>
        <Button variant="outlined" aria-pressed={reversed} onClick={() => setReversed((r) => !r)}>
          direction reverse
        </Button>
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Añadir ítem
        </Button>
      </div>
      <Grid ref={ref} container spacing={spacing} justifyContent={justify} direction={reversed ? 'row-reverse' : 'row'}>
        {Array.from({ length: count }, (_, i) => (
          <Grid key={i} size={{ xs: 6, md: 3 }}>
            <div className="demo-grid-item">{i + 1}</div>
          </Grid>
        ))}
      </Grid>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
