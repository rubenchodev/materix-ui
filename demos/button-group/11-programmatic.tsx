import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: "The group is declarative: change `disabled` or render more children and the position classes are recomputed on every render (no `refresh()` needed).",
  es: "El grupo es declarativo: cambia `disabled` o renderiza más hijos y las clases de posición se recalculan en cada render (no hace falta `refresh()`).",
};

const NAMES = ['One', 'Two', 'Three', 'Four', 'Five'];

export default function Demo() {
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(2);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <ButtonGroup disabled={disabled} label="Programmatic group">
          {NAMES.slice(0, count).map((name) => (
            <Button key={name}>{name}</Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="demo-row">
        <Button
          variant="outlined"
          onClick={() => {
            setDisabled(!disabled);
            write(`disabled = ${!disabled}`);
          }}
        >
          Toggle disabled
        </Button>
        <Button
          variant="outlined"
          disabled={count >= NAMES.length}
          onClick={() => {
            setCount(count + 1);
            write(`${count + 1} buttons`);
          }}
        >
          Add button
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
