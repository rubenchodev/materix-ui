import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "Primary is the default. Use the color prop: secondary, success, error, warning or info.",
  es: "Primary es el color por defecto. Usa la prop color: secondary, success, error, warning o info.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Checkbox label="Primary" defaultChecked />
      <Checkbox label="Secondary" color="secondary" defaultChecked />
      <Checkbox label="Success" color="success" defaultChecked />
      <Checkbox label="Error" color="error" defaultChecked />
      <Checkbox label="Warning" color="warning" defaultChecked />
      <Checkbox label="Info" color="info" defaultChecked />
    </div>
  );
}
