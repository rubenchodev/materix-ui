import { useState } from 'react';
import type { FormEvent } from 'react';
import '@rubenchodev/materix-ui/components/grid.css';
import { Select } from '@rubenchodev/materix-react/components/select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Grid and form', es: 'Grilla y formulario' };
export const description = {
  en: "A shipping form in `mtx-grid` combining Select, TextField and Button: one column on mobile and three on desktop. `name` is submitted with the form and Reset restores the initial values.",
  es: "Un formulario de envío en `mtx-grid` que combina Select, TextField y Button: una columna en móvil y tres en escritorio. `name` se envía con el formulario y Reset restaura los valores iniciales.",
};

export default function Demo() {
  const [submitted, setSubmitted] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const entries: Record<string, string | string[]> = {};
    data.forEach((value, key) => {
      const text = String(value);
      const prev = entries[key];
      entries[key] = prev === undefined ? text : ([] as string[]).concat(prev, text);
    });
    setSubmitted(JSON.stringify(entries));
  };

  return (
    <div className="demo-surface">
      <form className="mtx-grid mtx-grid--container mtx-grid--spacing-2" onSubmit={handleSubmit}>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-4">
          <TextField label="Recipient" name="recipient" startIcon="person" />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--sm-6 mtx-grid--md-4">
          <Select
            label="Country"
            name="country"
            search
            required
            placeholder="Choose a country"
            options={[
              { value: 'co', label: 'Colombia', image: 'https://flagcdn.com/w40/co.png' },
              { value: 'mx', label: 'Mexico', image: 'https://flagcdn.com/w40/mx.png' },
              { value: 'es', label: 'Spain', image: 'https://flagcdn.com/w40/es.png' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--sm-6 mtx-grid--md-4">
          <Select
            label="Shipping"
            name="shipping"
            options={[
              { value: 'std', label: 'Standard', icon: 'local_shipping' },
              { value: 'exp', label: 'Express', icon: 'bolt' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-8">
          <TextField label="Address" name="address" startIcon="home" />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-4">
          <Select
            label="Notifications"
            name="notifications"
            multiple
            selectedTextFormat="count"
            placeholder="None"
            options={[
              { value: 'mail', label: 'Email' },
              { value: 'sms', label: 'SMS' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12">
          <div className="demo-row">
            <Button variant="contained" type="submit">Continue</Button>
            <Button variant="text" type="reset" onClick={() => setSubmitted('')}>Reset</Button>
          </div>
        </div>
      </form>
      <pre className="demo-log mtx-w-100" aria-live="polite">{submitted}</pre>
    </div>
  );
}
