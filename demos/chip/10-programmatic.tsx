import { useRef, useState } from 'react';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Label and disabled state are React state and `ref` points to the root; the log shows `onClick` and `onDelete`.',
  es: 'El texto y el estado deshabilitado son estado de React y `ref` apunta a la raíz; el registro muestra `onClick` y `onDelete`.',
};

export default function Demo() {
  const [label, setLabel] = useState('Test chip');
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const chipRef = useRef<HTMLElement>(null);
  const write = (text: string) => setLog((lines) => [...lines, text]);

  const toggleLabel = () => {
    const next = label === 'Test chip' ? 'Updated label' : 'Test chip';
    setLabel(next);
    write(`label = "${next}"`);
  };
  const changeDisabled = (value: boolean) => {
    setDisabled(value);
    write(`disabled = ${value}`);
  };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Chip
          ref={chipRef}
          label={label}
          icon="science"
          color="primary"
          disabled={disabled}
          onClick={(event) => write(`onClick (${event.type})`)}
          onDelete={(event) => write(`onDelete (${event.type})`)}
        />
      </div>
      <div className="demo-row">
        <Button variant="outlined" onClick={toggleLabel}>
          Change label
        </Button>
        <Button variant="outlined" onClick={() => changeDisabled(true)}>
          Disable
        </Button>
        <Button variant="outlined" onClick={() => changeDisabled(false)}>
          Enable
        </Button>
        <Button variant="text" onClick={() => chipRef.current?.focus()}>
          Focus (ref)
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
