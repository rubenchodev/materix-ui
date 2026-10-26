import { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, useFormControl } from '@rubenchodev/materix-react/components/form-helper-text';
import { Switch } from '@rubenchodev/materix-react/components/switch';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Custom control with useFormControl', es: 'Control propio con useFormControl' };
export const description = {
  en: "useFormControl() returns the state of the closest FormControl (error, disabled, required and the ids of its helper texts) so your own components can react to it. Type fewer than 3 characters or disable the group to see the indicator change.",
  es: "useFormControl() devuelve el estado del FormControl más cercano (error, disabled, required y los ids de sus textos de ayuda) para que tus componentes reaccionen a él. Escribe menos de 3 caracteres o deshabilita el grupo para ver cambiar el indicador.",
};

/** Indicador propio que lee el estado del FormControl más cercano. */
function FieldStatus() {
  const formControl = useFormControl();
  const label = formControl?.disabled ? 'Deshabilitado' : formControl?.error ? 'No válido' : 'Válido';
  return (
    <Typography variant="caption" className="mtx-mt-1" color={formControl?.error ? 'error' : 'text-secondary'}>
      Estado: {label} · describedby: {formControl?.helperTextIds.length ?? 0} texto(s) de ayuda
    </Typography>
  );
}

export default function Demo() {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const error = value.length > 0 && value.length < 3;
  return (
    <div className="demo-stack">
      <Switch label="Deshabilitar el grupo" checked={disabled} onChange={(_, next) => setDisabled(next)} />
      <FormControl error={error} disabled={disabled} required>
        <FormLabel>Cuenta</FormLabel>
        <TextField label="Nombre de usuario" value={value} onChange={(_, next) => setValue(next)} />
        <FormHelperText contained>{error ? 'Al menos 3 caracteres.' : 'Solo letras y números.'}</FormHelperText>
        <FieldStatus />
      </FormControl>
    </div>
  );
}
