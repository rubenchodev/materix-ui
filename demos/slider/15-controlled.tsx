import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Slider } from '@rubenchodev/materix-react/components/slider';
import type { SliderValue } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With value + onChange the parent owns the state; the vanilla setters (value, max, disable()) become prop changes and focus() uses inputRef. onChange and onChangeCommitted are logged below.",
  es: "Con value + onChange el estado lo gestiona el padre; los setters de vanilla (value, max, disable()) pasan a ser cambios de props y focus() usa inputRef. onChange y onChangeCommitted se registran abajo.",
};

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<SliderValue>(40);
  const [max, setMax] = useState(100);
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ['value = 75', () => setValue(75)],
    ['max = 200', () => setMax(200)],
    ['max = 100', () => setMax(100)],
    ['disabled = true', () => setDisabled(true)],
    ['disabled = false', () => setDisabled(false)],
    ['focus()', () => inputRef.current?.focus()],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-group demo-wide">
        <span className="demo-label">Controlled slider</span>
        <Slider
          aria-label="Controlled slider"
          inputRef={inputRef}
          value={value}
          max={max}
          disabled={disabled}
          valueLabelDisplay="auto"
          onChange={(_, next) => {
            setValue(next);
            write(`onChange → ${String(next)}`);
          }}
          onChangeCommitted={(_, next) => write(`onChangeCommitted → ${String(next)}`)}
        />
        <span className="demo-status">
          value: {String(value)} · max: {max} · disabled: {String(disabled)}
        </span>
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
