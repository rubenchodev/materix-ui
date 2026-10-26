import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A single `<Select>` with `label` and `<option>` children. The component renders the label, the combobox, the notched border and a hidden native `<select>` that is submitted with the form. Only need the system dropdown? Use NativeSelect.",
  es: "Un único `<Select>` con `label` y children `<option>`. El componente genera el label, el combobox, el borde con muesca y un `<select>` nativo oculto que se envía con el formulario. ¿Solo necesitas el desplegable del sistema? Usa NativeSelect.",
};

export default function Demo() {
  return (
    <div className="demo-fixed-width">
      <Select label="Ciudad" name="city">
        <option value="mdx">Ciudad de México</option>
        <option value="gdl">Guadalajara</option>
        <option value="mty">Monterrey</option>
      </Select>
    </div>
  );
}
