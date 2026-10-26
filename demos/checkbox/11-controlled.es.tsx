import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With checked + onChange the parent owns the state: the vanilla methods become state changes and focus() uses inputRef. Changes made from code do not call onChange; user changes do, and are logged below.",
  es: "Con checked + onChange el estado lo gestiona el padre: los métodos de vanilla pasan a ser cambios de estado y focus() usa inputRef. Los cambios desde código no llaman a onChange; los del usuario sí, y se registran abajo.",
};

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ['toggle', () => { setIndeterminate(false); setChecked((value) => !value); }],
    ['checked = true', () => setChecked(true)],
    ['indeterminate = true', () => setIndeterminate(true)],
    ['disabled = true', () => setDisabled(true)],
    ['disabled = false', () => setDisabled(false)],
    ['focus()', () => inputRef.current?.focus()],
    ['error = true', () => setError(true)],
    ['error = false', () => setError(false)],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Casilla controlada</span>
        <div className="demo-row">
          <Checkbox
            label="Casilla controlada"
            inputRef={inputRef}
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            error={error}
            helperText={error ? 'Marca esta casilla.' : undefined}
            onChange={(_, next) => {
              setIndeterminate(false);
              setChecked(next);
              write(`onChange (usuario) → checked: ${next}`);
            }}
          />
          <span className="demo-status">
            checked: {String(checked)} · indeterminate: {String(indeterminate)} · disabled: {String(disabled)}
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
