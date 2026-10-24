import { useState } from 'react';
import type { FormEvent } from 'react';
import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { Button } from '@rubenchodev/materix-react/components/button';
import { COUNTRIES } from './data';

export const title = { en: 'Form', es: 'Formulario' };
export const description = {
  en: 'The `name` moves to hidden inputs: one with the value in single selection; one per value in multiple selection (like `<select multiple>`) or a single field with `valueFormat="csv"`. `required` uses native validation; the Reset button restores the initial values.',
  es: 'El `name` pasa a inputs ocultos: uno con el valor en selección única; uno por valor en múltiple (como `<select multiple>`) o un único campo con `valueFormat="csv"`. `required` usa la validación nativa; el botón Reset restaura los valores iniciales.',
};

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'fr', label: 'French' },
];

export default function Demo() {
  const [log, setLog] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setLog('Invalid form');
      return;
    }
    const pairs: string[] = [];
    new FormData(form).forEach((value, key) => pairs.push(`${key}=${String(value)}`));
    setLog(`submit → ${pairs.join('&')}`);
  };

  return (
    <form className="demo-stack demo-wide" noValidate onSubmit={handleSubmit} onReset={() => setLog('reset')}>
      <Autocomplete label="Country of residence" options={COUNTRIES} name="country" required />
      <Autocomplete label="Languages" multiple name="languages" options={LANGUAGES} defaultValue={['en']} />
      <Autocomplete label="Interests (CSV)" multiple freeSolo name="interests" valueFormat="csv" options={['design', 'music', 'travel']} />
      <div className="demo-row">
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Button variant="text" type="reset">
          Reset
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log}
      </pre>
    </form>
  );
}
