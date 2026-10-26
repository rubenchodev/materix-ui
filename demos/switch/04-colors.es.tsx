import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "Primary is the default. Use the color prop: secondary, success, error, warning or info. The color shows in the on state.",
  es: "Primary es el color por defecto. Usa la prop color: secondary, success, error, warning o info. El color se ve en el estado activado.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Switch label="Primario" defaultChecked />
      <Switch label="Secundario" color="secondary" defaultChecked />
      <Switch label="Éxito" color="success" defaultChecked />
      <Switch label="Error" color="error" defaultChecked />
      <Switch label="Advertencia" color="warning" defaultChecked />
      <Switch label="Información" color="info" defaultChecked />
    </div>
  );
}
