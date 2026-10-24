import { useRef, useState } from 'react';
import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: 'With `value` + `onChange` the parent owns the value: the vanilla `value = …`, `disable()`/`enable()` and `focus()` become state changes and `inputRef.current.focus()`. The log shows each change.',
  es: 'Con `value` + `onChange` el padre es dueño del valor: `value = …`, `disable()`/`enable()` y `focus()` de vanilla pasan a ser cambios de estado e `inputRef.current.focus()`. El registro muestra cada cambio.',
};

export default function Demo() {
  const inputRef = useRef<HTMLSelectElement>(null);
  const [value, setValue] = useState('s');
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ['value = "l"', () => setValue('l')],
    ['disabled = !disabled', () => setDisabled((prev) => !prev)],
    ['focus()', () => inputRef.current?.focus()],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <div className="demo-fixed-width">
          <NativeSelect
            variant="outlined"
            label="Size"
            inputRef={inputRef}
            value={value}
            disabled={disabled}
            onChange={(_, next) => {
              setValue(next as string);
              write(`onChange (user) → value: ${String(next)}`);
            }}
            options={[{ value: 's', label: 'S' }, { value: 'm', label: 'M' }, { value: 'l', label: 'L' }]}
          />
        </div>
        <span className="demo-status">
          value: {value} · disabled: {String(disabled)}
        </span>
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
