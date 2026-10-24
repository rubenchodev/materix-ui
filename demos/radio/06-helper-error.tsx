import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Helper and error (FormHelperText)', es: 'Ayuda y error (FormHelperText)' };
export const description = {
  en: "helperText creates a .mtx-form-helper-text below the group and links it with aria-describedby. error flags the error (helper text in red, aria-invalid on the radiogroup); pass the message as helperText. The form validates on submit and clears the error when an option is chosen.",
  es: "helperText crea un .mtx-form-helper-text bajo el grupo y lo enlaza con aria-describedby. error marca el error (texto en rojo, aria-invalid en el radiogroup); pasa el mensaje como helperText. El formulario valida al enviar y limpia el error al elegir una opción.",
};

export default function Demo() {
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(size === null);
  };

  const handleReset = () => {
    setSize(null);
    setError(false);
  };

  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Helper text</span>
        <RadioGroup label="Billing" helperText="You can change it at any time." defaultValue="monthly">
          <Radio value="monthly" label="Monthly" />
          <Radio value="yearly" label="Yearly (2 months free)" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Validation on submit</span>
        <form className="demo-stack" noValidate onSubmit={handleSubmit} onReset={handleReset}>
          <RadioGroup
            label="Size"
            row
            value={size}
            onChange={(_, value) => {
              setSize(value);
              setError(false);
            }}
            error={error}
            helperText={error ? 'Choose a size to continue.' : 'Check the size guide.'}
          >
            <Radio value="s" label="S" />
            <Radio value="m" label="M" />
            <Radio value="l" label="L" />
          </RadioGroup>
          <div className="demo-row">
            <Button variant="contained" type="submit">
              Add to cart
            </Button>
            <Button type="reset">
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
