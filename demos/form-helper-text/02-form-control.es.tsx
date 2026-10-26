import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Switch } from '@rubenchodev/materix-react/components/switch';
import { FormControl, FormHelperText, FormLabel } from '@rubenchodev/materix-react/components/form-helper-text';

export const title = { en: 'FormControl and FormLabel', es: 'FormControl y FormLabel' };
export const description = {
  en: "FormControl groups a FormLabel, one or more controls and a FormHelperText, and shares error and disabled with all of them: the label, the checkbox border and the helper change together.",
  es: "FormControl agrupa un FormLabel, uno o varios controles y un FormHelperText, y les comparte error y disabled: el rótulo, el borde de la casilla y el texto de ayuda cambian a la vez.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <FormControl role="group" aria-labelledby="fht-default-label">
        <FormLabel id="fht-default-label">Boletín</FormLabel>
        <Checkbox label="Resumen semanal" defaultChecked />
        <FormHelperText>Un correo a la semana.</FormHelperText>
      </FormControl>
      <FormControl role="group" aria-labelledby="fht-error-label" error>
        <FormLabel id="fht-error-label">Consentimiento</FormLabel>
        <Checkbox label="Acepto los términos" />
        <FormHelperText>Debes aceptar los términos.</FormHelperText>
      </FormControl>
      <FormControl role="group" aria-labelledby="fht-disabled-label" aria-disabled="true" disabled>
        <FormLabel id="fht-disabled-label">Seguridad</FormLabel>
        <Switch label="Alertas de seguridad" defaultChecked />
        <FormHelperText>Gestionado por tu organización.</FormHelperText>
      </FormControl>
    </div>
  );
}
