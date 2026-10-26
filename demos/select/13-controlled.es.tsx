import { useRef, useState } from 'react';
import { Select } from '@rubenchodev/materix-react/components/select';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "With `value` + `onChange` and `open` + `onOpen` / `onClose` the parent owns the state; the buttons replace the vanilla instance methods and `focus()` uses `controlRef`.",
  es: "Con `value` + `onChange` y `open` + `onOpen` / `onClose` el estado lo lleva el padre; los botones sustituyen a los métodos de la instancia vanilla y `focus()` usa `controlRef`.",
};

export default function Demo() {
  const controlRef = useRef<HTMLDivElement>(null);
  const [env, setEnv] = useState('dev');
  const [regions, setRegions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [helper, setHelper] = useState('Usa los botones o el menú');
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ["value = 'prod'", () => setEnv('prod')],
    ["value = ['eu', 'sa']", () => setRegions(['eu', 'sa'])],
    ['open = true', () => setOpen(true)],
    ['disabled = !disabled', () => setDisabled((prev) => !prev)],
    ['helperText', () => setHelper(`Actualizado a las ${new Date().toLocaleTimeString()}`)],
    ['focus()', () => controlRef.current?.focus()],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-grid-2">
        <Select
          label="Entorno"
          controlRef={controlRef}
          helperText={helper}
          value={env}
          open={open}
          disabled={disabled}
          onOpen={() => {
            setOpen(true);
            write('onOpen');
          }}
          onClose={() => {
            setOpen(false);
            write('onClose');
          }}
          onChange={(_, next) => {
            setEnv(next as string);
            write(`onChange → ${JSON.stringify(next)}`);
          }}
          options={[
            { value: 'dev', label: 'Desarrollo' },
            { value: 'staging', label: 'Preproducción' },
            { value: 'prod', label: 'Producción' },
          ]}
        />
        <Select
          label="Regiones"
          multiple
          actionsBox
          value={regions}
          onChange={(_, next) => {
            setRegions(next as string[]);
            write(`onChange → ${JSON.stringify(next)}`);
          }}
          options={[
            { value: 'us', label: 'Estados Unidos' },
            { value: 'eu', label: 'Europa' },
            { value: 'sa', label: 'Sudamérica' },
          ]}
        />
      </div>
      <span className="demo-status">
        env: {env} · regions: {JSON.stringify(regions)} · open: {String(open)} · disabled: {String(disabled)}
      </span>
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
