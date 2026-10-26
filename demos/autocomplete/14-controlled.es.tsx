import { useRef, useState } from 'react';
import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import type { AutocompleteOption } from '@rubenchodev/materix-react/components/autocomplete';
import { Button } from '@rubenchodev/materix-react/components/button';
import { FILMS } from './data.es';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: "`value` + `onChange` and `open` + `onOpen`/`onClose` replace vanilla's `value`, `open()`, `clear()`, `setOptions()` and `disable()`; `inputRef` gives access to `focus()`. The log shows the callbacks with their `reason`.",
  es: '`value` + `onChange` y `open` + `onOpen`/`onClose` sustituyen a `value`, `open()`, `clear()`, `setOptions()` y `disable()` de vanilla; `inputRef` da acceso a `focus()`. El registro muestra los callbacks con su `reason`.',
};

const OTHER_FILMS: AutocompleteOption[] = [
  { value: 'alien', label: 'Alien, el octavo pasajero', description: '1979', group: 'Ciencia ficción' },
  { value: 'blade-runner', label: 'Blade Runner', description: '1982', group: 'Ciencia ficción' },
  { value: 'amelie', label: 'Amélie', description: '2001', group: 'Comedia' },
];

export default function Demo() {
  const [value, setValue] = useState<AutocompleteOption | string | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(FILMS);
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const write = (line: string) => setLog((prev) => [...prev.slice(-7), line]);

  return (
    <div className="demo-stack">
      <div className="demo-fixed-width">
        <Autocomplete
          label="Película"
          options={options}
          value={value}
          open={open}
          disabled={disabled}
          inputRef={inputRef}
          onChange={(_event, next, reason) => {
            setValue(next);
            const key = next && typeof next === 'object' ? next.value : next;
            write(`onChange → ${JSON.stringify({ value: key, reason })}`);
          }}
          onInputChange={(_event, inputValue, reason) => write(`onInputChange → ${JSON.stringify({ inputValue, reason })}`)}
          onOpen={(_event, reason) => {
            setOpen(true);
            write(`onOpen → ${reason}`);
          }}
          onClose={(_event, reason) => {
            setOpen(false);
            write(`onClose → ${reason}`);
          }}
        />
      </div>
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setValue('matrix')}>
          value = matrix
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
        >
          Abrir
        </Button>
        <Button variant="outlined" onClick={() => setValue(null)}>
          Limpiar
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setOptions(OTHER_FILMS);
            write('options = [...3 opciones agrupadas]');
          }}
        >
          Cambiar opciones
        </Button>
        <Button variant="outlined" onClick={() => setDisabled((prev) => !prev)}>
          {disabled ? 'Habilitar' : 'Deshabilitar'}
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
