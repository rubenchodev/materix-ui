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
          <TextField label="Destinatario" name="recipient" startIcon="person" />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--sm-6 mtx-grid--md-4">
          <Select
            label="País"
            name="country"
            search
            required
            placeholder="Elige un país"
            options={[
              { value: 'co', label: 'Colombia', image: 'https://flagcdn.com/w40/co.png' },
              { value: 'mx', label: 'México', image: 'https://flagcdn.com/w40/mx.png' },
              { value: 'es', label: 'España', image: 'https://flagcdn.com/w40/es.png' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--sm-6 mtx-grid--md-4">
          <Select
            label="Envío"
            name="shipping"
            options={[
              { value: 'std', label: 'Estándar', icon: 'local_shipping' },
              { value: 'exp', label: 'Exprés', icon: 'bolt' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-8">
          <TextField label="Dirección" name="address" startIcon="home" />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-4">
          <Select
            label="Notificaciones"
            name="notifications"
            multiple
            selectedTextFormat="count"
            placeholder="Ninguna"
            options={[
              { value: 'mail', label: 'Correo' },
              { value: 'sms', label: 'SMS' },
            ]}
          />
        </div>
        <div className="mtx-grid mtx-grid--item mtx-grid--xs-12">
          <div className="demo-row">
            <Button variant="contained" type="submit">Continuar</Button>
            <Button variant="text" type="reset" onClick={() => setSubmitted('')}>Restablecer</Button>
          </div>
        </div>
      </form>
      <pre className="demo-log mtx-w-100" aria-live="polite">{submitted}</pre>
    </div>
  );
}
