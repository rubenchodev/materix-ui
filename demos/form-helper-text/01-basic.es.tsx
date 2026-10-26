import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { FormControl, FormHelperText } from '@rubenchodev/materix-react/components/form-helper-text';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "FormHelperText renders a <p class=\"mtx-form-helper-text\"> below a control. Inside a FormControl it inherits error (red text) and disabled (dimmed, aria-disabled), and the control links it with aria-describedby.",
  es: "FormHelperText renderiza un <p class=\"mtx-form-helper-text\"> bajo un control. Dentro de un FormControl hereda error (texto en rojo) y disabled (atenuado, aria-disabled), y el control lo enlaza con aria-describedby.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Texto de ayuda</span>
        <FormControl>
          <Checkbox label="Enviarme el recibo por correo" defaultChecked />
          <FormHelperText>Nunca compartiremos tu correo.</FormHelperText>
        </FormControl>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error · error</span>
        <FormControl error>
          <Checkbox label="Acepto los términos" required />
          <FormHelperText>Este campo es obligatorio.</FormHelperText>
        </FormControl>
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado · disabled</span>
        <FormControl disabled>
          <Checkbox label="Soporte prioritario" />
          <FormHelperText>No disponible en tu plan.</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
