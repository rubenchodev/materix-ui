import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { FormControl, FormHelperText } from '@rubenchodev/materix-react/components/form-helper-text';

export const title = { en: 'Helper and error (FormHelperText)', es: 'Ayuda y error (FormHelperText)' };
export const description = {
  en: "helperText adds a .mtx-form-helper-text below the checkbox, linked with aria-describedby (outside the <label>, so it does not mix with the name). error turns on the error state; pass the message as helperText. In both cases the input gets aria-invalid=\"true\" and the box border turns red.",
  es: "helperText añade un .mtx-form-helper-text bajo la casilla, enlazado con aria-describedby (fuera del <label>, para no mezclarse con el nombre). error activa el estado de error; pasa el mensaje como helperText. En ambos casos el input recibe aria-invalid=\"true\" y el borde de la caja se pone rojo.",
};

export default function Demo() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const showError = submitted && !accepted;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group">
          <span className="demo-label">Texto de ayuda</span>
          <Checkbox label="Enviar recibo por correo" helperText="Lo recibirás en ana@ejemplo.com" defaultChecked />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error sin mensaje · error</span>
          <Checkbox label="Confirmo que soy mayor de edad" helperText="Requisito legal" error />
        </div>
        <div className="demo-group">
          <span className="demo-label">Validación al enviar</span>
          <form className="demo-stack" noValidate onSubmit={handleSubmit}>
            <Checkbox
              label="Acepto los términos y la política de privacidad"
              required
              checked={accepted}
              onChange={(_, checked) => setAccepted(checked)}
              error={showError}
              helperText={showError ? 'Debes aceptar los términos para continuar.' : undefined}
            />
            <div className="demo-row">
              <Button variant="contained" type="submit">
                Crear cuenta
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">FormControl + FormHelperText</span>
        <FormControl>
          <Checkbox label="Suscribirme al boletín" />
          <FormHelperText>Un correo al mes, sin spam.</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
