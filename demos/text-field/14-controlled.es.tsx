import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField, isMaskComplete, resolveMask, unmaskValue } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: 'The buttons change the state of a controlled field (`value`, `error`, `disabled`) and use `inputRef`; the log shows its events. Fields can also be created dynamically by adding them to the state.',
  es: 'Los botones cambian el estado de un campo controlado (`value`, `error`, `disabled`) y usan `inputRef`; el registro muestra sus eventos. También se pueden crear campos dinámicamente añadiéndolos al estado.',
};

const CURRENCY = resolveMask('currency');

const DYNAMIC: { variant: 'outlined' | 'filled' | 'standard'; startIcon?: string }[] = [
  { variant: 'outlined', startIcon: 'edit' },
  { variant: 'filled' },
  { variant: 'standard' },
];

export default function Demo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [fields, setFields] = useState<number[]>([]);
  const write = (text: string) => setLog((prev) => [`${new Date().toLocaleTimeString()}  ${text}`, ...prev].slice(0, 8));

  return (
    <div className="demo-stack">
      <div className="demo-fixed-width">
        <TextField
          inputRef={inputRef}
          label="Campo controlado"
          mask="currency"
          value={value}
          onChange={(_, next, details) => {
            setValue(next);
            write(`onChange → value "${next}" · unmaskedValue "${details.unmaskedValue}"`);
          }}
          onFocus={() => write('focus')}
          onBlur={() => write('blur')}
          disabled={disabled}
          error={Boolean(error)}
          helperText={error || 'Escribe o usa los botones'}
        />
      </div>
      <div className="demo-row">
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setValue('125000');
            write('value = "125000" → "$ 1,250.00"');
          }}
        >
          value = 125000
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setError('Importe fuera de rango');
            write('error + helperText');
          }}
        >
          Poner error
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setError('');
            write('error eliminado');
          }}
        >
          Quitar error
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setDisabled(!disabled);
            write(`disabled = ${!disabled}`);
          }}
        >
          Deshabilitar / habilitar
        </Button>
        <Button variant="outlined" size="small" onClick={() => inputRef.current?.focus()}>
          Enfocar (inputRef)
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const shown = inputRef.current?.value ?? '';
            write(`value "${shown}" · unmaskedValue "${unmaskValue(shown, CURRENCY)}" · isMaskComplete ${isMaskComplete(shown, CURRENCY)}`);
          }}
        >
          Leer valores
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <div className="demo-group">
        <span className="demo-label">Crear campos dinámicamente</span>
        <div className="demo-row">
          <Button
            variant="text"
            onClick={() => {
              const next = fields.length + 1;
              setFields([...fields, next]);
              write(`campo #${next} añadido al estado`);
            }}
          >
            Añadir campo
          </Button>
          <Button variant="text" disabled={!fields.length} onClick={() => setFields([])}>
            Quitar todos
          </Button>
        </div>
        <div className="demo-grid-3">
          {fields.map((n) => {
            const config = DYNAMIC[(n - 1) % DYNAMIC.length];
            return <TextField key={n} label={`Campo #${n}`} variant={config.variant} startIcon={config.startIcon} />;
          })}
        </div>
      </div>
    </div>
  );
}
