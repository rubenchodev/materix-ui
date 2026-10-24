import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With value + onChange the parent owns the selection: onChange(event, value) is the equivalent of mtx:radio-group:change. Each Radio accepts disabled and inputRef (for focus()).",
  es: "Con value + onChange la selección la gestiona el padre: onChange(event, value) equivale a mtx:radio-group:change. Cada Radio acepta disabled e inputRef (para focus()).",
};

export default function Demo() {
  const highRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string | null>('medium');
  const [highDisabled, setHighDisabled] = useState(false);
  const [groupDisabled, setGroupDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ["value = 'low'", () => setValue('low')],
    ["value = 'high'", () => setValue('high')],
    ['High: disabled = true', () => setHighDisabled(true)],
    ['High: disabled = false', () => setHighDisabled(false)],
    ['High: focus()', () => highRef.current?.focus()],
    ['group: error = true', () => setError(true)],
    ['group: error = false', () => setError(false)],
    ['group: disabled = true', () => setGroupDisabled(true)],
    ['group: disabled = false', () => setGroupDisabled(false)],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Controlled group</span>
        <RadioGroup
          row
          aria-label="Priority"
          value={value}
          disabled={groupDisabled}
          error={error}
          helperText={error ? 'Pick a priority.' : undefined}
          onChange={(_, next) => {
            setValue(next);
            write(`onChange → value: "${next}"`);
          }}
        >
          <Radio value="low" label="Low" />
          <Radio value="medium" label="Medium" />
          <Radio value="high" label="High" inputRef={highRef} disabled={highDisabled || undefined} />
        </RadioGroup>
        <span className="demo-status">value: &quot;{value ?? ''}&quot;</span>
      </div>
      <div className="demo-group">
        <span className="demo-label">Actions</span>
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
      </div>
      <div className="demo-group">
        <span className="demo-label">Event log</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
