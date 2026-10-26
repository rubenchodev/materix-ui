import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With checked + onChange the parent owns the state: toggle(), disable() and setError() from vanilla become state changes and focus() uses inputRef. User changes call onChange and are logged below.",
  es: "Con checked + onChange el estado lo gestiona el padre: toggle(), disable() y setError() de vanilla pasan a ser cambios de estado y focus() usa inputRef. Los cambios del usuario llaman a onChange y se registran abajo.",
};

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ['toggle', () => setChecked((value) => !value)],
    ['checked = true', () => setChecked(true)],
    ['checked = false', () => setChecked(false)],
    ['disabled = true', () => setDisabled(true)],
    ['disabled = false', () => setDisabled(false)],
    ['focus()', () => inputRef.current?.focus()],
    ['error = true', () => setError(true)],
    ['error = false', () => setError(false)],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Interruptor controlado</span>
        <div className="demo-row">
          <Switch
            label="Interruptor controlado"
            inputRef={inputRef}
            checked={checked}
            disabled={disabled}
            error={error}
            helperText={error ? 'Activa esta opción.' : undefined}
            onChange={(_, next) => {
              setChecked(next);
              write(`onChange (usuario) → checked: ${next}`);
            }}
          />
          <span className="demo-status">
            checked: {String(checked)} · disabled: {String(disabled)}
          </span>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Acciones</span>
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
        <span className="demo-label">Registro de eventos</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
