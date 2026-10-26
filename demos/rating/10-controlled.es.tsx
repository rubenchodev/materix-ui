import { useRef, useState } from 'react';
import { Rating } from '@rubenchodev/materix-react/components/rating';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With `value` + `onChange` the parent owns the value: the vanilla `value = …`, `disable()`/`enable()` and `focus()` become state changes. The log shows `onChange` and `onChangeActive`.",
  es: "Con `value` + `onChange` el padre es dueño del valor: `value = …`, `disable()`/`enable()` y `focus()` de vanilla pasan a ser cambios de estado. El registro muestra `onChange` y `onChangeActive`.",
};

export default function Demo() {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | null>(3);
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const focus = () => {
    const root = ref.current;
    const target = root?.querySelector<HTMLInputElement>('input:checked:not([value=""])') ?? root?.querySelector('input');
    target?.focus();
  };

  const actions: Array<[string, () => void]> = [
    ['value = 5', () => setValue(5)],
    ['value = null', () => setValue(null)],
    ['disabled = true', () => setDisabled(true)],
    ['disabled = false', () => setDisabled(false)],
    ['focus()', focus],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Rating
          ref={ref}
          value={value}
          disabled={disabled}
          aria-label="Valoración controlada"
          onChange={(_, next) => {
            setValue(next);
            write(`onChange → ${String(next)}`);
          }}
          onChangeActive={(_, next) => write(`onChangeActive → ${String(next)}`)}
        />
        <span className="demo-status">value: {String(value)} · disabled: {String(disabled)}</span>
      </div>
      <div className="demo-row">
        {actions.map(([label, run]) => (
          <Button
            key={label}
            variant="outlined"
            size="small"
            onClick={() => {
              run();
              write(label);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
