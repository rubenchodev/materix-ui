import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "Write just <Checkbox label>. The component renders the wrapping <label class=\"mtx-checkbox\">, the native input, the box and the text, and forwards name, value, required and the other native props to the input.",
  es: "Escribe solo <Checkbox label>. El componente renderiza el <label class=\"mtx-checkbox\"> envolvente, el input nativo, la caja y el texto, y pasa name, value, required y el resto de props nativas al input.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Checkbox label="Recordarme" defaultChecked />
      <Checkbox label="Recibir novedades" />
    </div>
  );
}
